export const setupConnection = (roomCode) => {
  const MESSAGE_TYPE = {
    SDP: 'SDP',
    CANDIDATE: 'CANDIDATE',
  };

  const myVideo = document.getElementById('my-video');
  const userVideo = document.getElementById('user-video');
  // const startButton= document.getElementById('start')
  const switchButton = document.getElementById('switch');
  // const codeInput= document.getElementById('code')
  const codeInput = { value: roomCode };

  const senders = [];
  let userMediaStream = null;
  let displayMediaStream = null;

  const startConnection = async () => {
    let socketUrl = `ws://${window.location.hostname}:1337`;
    console.log('process.env.NODE_ENV', process.env.NODE_ENV);
    if (process.env.NODE_ENV !== 'development') {
      socketUrl = `ws://${window.location.hostname}`;
    }
    console.log('socket endpoint', socketUrl, process.env.NODE_ENV);
    const signaling = new WebSocket(socketUrl);

    // adding audio and video tracks to peer connection
    userMediaStream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: true,
    });
    myVideo.srcObject = userMediaStream;

    createPeerConnection(signaling, userMediaStream);

    console.log('readyState', signaling.readyState);
    signaling.onopen = () => {
      console.log('signal opened');
      createPeerConnection(signaling, userMediaStream);
    };
  };

  //starting automatically
  startConnection();

  // startButton.addEventListener('click', async () => {
  // })

  switchButton?.addEventListener('click', async () => {
    if (!displayMediaStream) {
      displayMediaStream = await navigator.mediaDevices.getDisplayMedia();
    }
    if (switchButton.value === 'Switch') {
      senders
        .find((stream) => stream.track.kind === 'video')
        .replaceTrack(displayMediaStream.getTracks()[0]);
      switchButton.value = 'Video';
      myVideo.style.display = 'none';
    } else {
      console.log('userMediaStream', userMediaStream.getTracks());
      senders
        .find((stream) => stream.track.kind === 'video')
        .replaceTrack(
          userMediaStream.getTracks().find((stream) => stream.kind === 'video')
        );
      switchButton.value = 'Switch';
      myVideo.style.display = 'block';
    }
  });

  const sendMessage = (signaling, message) => {
    signaling.send(
      JSON.stringify({
        ...message,
        code: codeInput.value,
      })
    );
  };

  const createPeerConnection = (signaling, userMediaStream) => {
    // creating peer connection
    const peerConnection = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.test.com:19000' }],
    });

    userMediaStream
      .getTracks()
      .forEach((track) =>
        senders.push(peerConnection.addTrack(track, userMediaStream))
      );

    addMessageHandler(signaling, peerConnection);

    peerConnection.onnegotiationneeded = () => {
      createAndSendOffer(signaling, peerConnection);
    };

    peerConnection.onicecandidate = (iceEvent) => {
      sendMessage(signaling, {
        message_type: MESSAGE_TYPE.CANDIDATE,
        content: iceEvent.candidate,
      });
    };

    peerConnection.ontrack = (event) => {
      if (!userVideo.srcObject) {
        userVideo.srcObject = event.streams[0];
      }
    };
  };

  const addMessageHandler = (signaling, peerConnection) => {
    signaling.onmessage = async (message) => {
      console.log(message);
      message = JSON.parse(message.data);
      const { message_type, content } = JSON.parse(message.text);
      if (message_type === MESSAGE_TYPE.SDP) {
        if (content.type === 'offer') {
          await peerConnection.setRemoteDescription(content);
          const answer = await peerConnection.createAnswer();
          await peerConnection.setLocalDescription(answer);
          sendMessage(signaling, {
            message_type: MESSAGE_TYPE.SDP,
            content: answer,
          });
        } else if (content.type === 'answer') {
          peerConnection.setRemoteDescription(content);
        }
      } else if (message_type === MESSAGE_TYPE.CANDIDATE) {
        peerConnection.addIceCandidate(content);
      }
    };
  };

  const createAndSendOffer = async (signaling, peerConnection) => {
    // creating SDP offer (Session Description Protocol)
    const offer = await peerConnection.createOffer();

    // setting local description
    await peerConnection.setLocalDescription(offer);

    // sending offer
    sendMessage(signaling, {
      message_type: MESSAGE_TYPE.SDP,
      content: offer,
    });
  };
};
