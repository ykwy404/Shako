const express = require("express");
const WebSocket = require("ws");
const http = require("http");
const app = express();
const cors = require('cors')
const {parseMessage} = require('./webrtc/parse');
const {knex} = require('./migrations');
const port = process.env.PORT || 9000;

//initialize a http server
const server = http.createServer(app);

//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });

const { Server } = require("socket.io");
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  }
});

wss.on("connection", ws => {
  ws.on("message", msg => {
    const msgReceive = msg.toString()
    try {
        const json = JSON.parse(msgReceive)
        parseMessage(json, ws, knex, app, io)  
    } catch (error) {
        console.log(error)
    }
  });
  //When connect send again to validate token
  ws.send(
    JSON.stringify({
      type: "validateToken"
    })
);
});

//start our server
server.listen(port, () => {
  console.log(`Signaling Server running on port: ${port}`);
});