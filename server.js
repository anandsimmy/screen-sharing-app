const fs = require('fs');
const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');
const https = require('https');
const WebSocketServer = require('websocket').server;

let clients = [];
const peersByCode = {};

//for express server
const app = express();
app.use(cors());
const PORT = process.env.PORT || 1337;

// for http-server to setup websocket server
// const httpServer= https.createServer({
//  key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
//  cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem')),
//  requestCert: true,
//  rejectUnauthorized: false
// }, app)

const httpServer = http.createServer();

httpServer.listen(1337, () => {
  console.log('http server listening at port 1337');
});

//for websocket server
const wsServer = new WebSocketServer({
  httpServer,
});

wsServer.on('request', (request) => {
  const connection = request.accept();
  const id = Math.floor(Math.random() * 100);
  console.log('request recieved');

  clients.forEach((client) =>
    client.connection.send(
      JSON.stringify({
        client: id,
        text: JSON.stringify({
          message_type: 'test',
          content: 'I am connected',
        }),
      })
    )
  );

  clients.push({ connection, id });

  connection.on('message', (message) => {
    console.log('message', message);
    const { code } = JSON.parse(message.utf8Data);
    if (!peersByCode[code]) {
      peersByCode[code] = [{ connection, id }];
    } else if (!peersByCode[code].find((peer) => peer.id === id)) {
      peersByCode[code].push({ connection, id });
    }
    peersByCode[code]
      .filter((peer) => peer.id !== id)
      .forEach((peer) =>
        peer.connection.send(
          JSON.stringify({
            peer: id,
            text: message.utf8Data,
          })
        )
      );
  });

  connection.on('close', () => {
    console.log('closing');
    clients = clients.filter((client) => client.id !== id);
    clients.forEach((client) =>
      client.connection.send(
        JSON.stringify({
          client: id,
          text: JSON.stringify({
            message_type: 'test',
            content: 'I am leaving',
          }),
        })
      )
    );
  });
});

if (
  true ||
  process.env.NODE_ENV === 'production' ||
  process.env.NODE_ENV === 'staging'
) {
  app.use(express.static(path.join(__dirname, '/client/build')));
  console.log('express static');
  app.get('*', function (req, res) {
    console.log('response received');
    res.sendFile(path.join(__dirname, '/client/build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Express server is listening at port ${PORT}`);
});
