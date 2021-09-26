import React, { useState } from 'react'
import VideoIcon from '../../assets/video-cam.png';
import ScreenShareIcon from '../../assets/share.png';
import styles from './VideoComponent.module.css'
 
const VideoComponent= () => {

  const [appState, setAppState] = useState('video');
  
  return (
    <div className={styles.videoWrapper}>
      <video
        id='my-video'
        className={styles.myVideo}
        // controls
        autoPlay
      />
      <video
        id='user-video'
        className={styles.userVideo}
        // controls
        autoPlay
      />
      <div className={styles.buttonContainer}>
        {/* <button id="start">Start</button> */}
        <img
          alt='switch'
          src={appState === 'video' ? ScreenShareIcon : VideoIcon}
          title={`Switch to ${appState === 'video' ? 'Screen Share' : 'Video'}`}
          onClick={() =>  setAppState((currentState) => currentState === 'video' ? 'screenShare' : 'video')}
          className={styles.switchIconStyles}
          id="switch"
        />
      </div>
    </div>
  )
}

export default VideoComponent