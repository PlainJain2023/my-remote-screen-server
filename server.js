// const ws_config = require('./ws_config')
// const fs = require('fs')
// const path = require("path")


const cors = require('cors');
const express = require('express');
const app = express();
const http = require('http');

const registerEventHandler = require("./eventHandler")


const server = http.createServer(app);


app.use(cors({
  origin: "*",
  credentials: true,
}));

const { Server } = require("socket.io");
const io = new Server(server, {
  maxHttpBufferSize: 1e8, // Equivalent to 100,000,000 (100 MB)
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Object to track connected clients
const connectedClients = {};

function initDevice(obj, key, id) {
  // Check if the object has the key
  if (obj[key]) {
      // Add the deviceName property to the object
      obj[key].deviceId = id;
  } else {
      console.log(`Key "${key}" not found in the object. Adding it in`);
      obj[key] = { id: key };
      obj[key].deviceId = id;
  }
}


const onConnectionHandler = (socket) => {
  try {
    console.log('[client connected] :: ', socket.id);
    // Add the client to the connected clients list
    const clients = Object.keys(connectedClients)
    if (clients.length < 3) {
      connectedClients[socket.id] = { id: socket.id };
    } else {
      console.log("Max connections reached");
      socket.disconnect(true); 
    }

    socket.on("init-device", (payload)=>{
      initDevice(connectedClients, socket.id, payload.deviceId)
      console.log("initing device:", payload, " || ",connectedClients)
      socket.broadcast.emit('client-connected', {id: socket.id, connectedClients});
    })
    console.log("connectedClients:", connectedClients)

    // Notify others about this connection (optional)

    // Handle status check requests
    socket.on('check-client-status', (clientId, callback) => {
      const isConnected = Boolean(connectedClients[clientId]);
      callback({ isConnected, clientId });
    });

    socket.on('get-connected-clients', (callback) => {
      callback(connectedClients);
    });

    // Handle client disconnection
    socket.on('disconnect', () => {
      delete connectedClients[socket.id];
      console.log('Client disconnected:', socket.id);
      console.log("connectedClients:", connectedClients)

      // Notify others about this disconnection (optional)
      io.emit('client-disconnected', { id: socket.id, connectedClients });
    });

    //-----------------------------------------------------------------------------------
    registerEventHandler(io, socket);
    //-----------------------------------------------------------------------------------
  } catch (err) {
    console.error(err);
  }
}

io.on('connection', onConnectionHandler);

// io.on("disconnect", () => {
//   console.log("User Disconected")
// })

server.listen(process.env.PORT || 5050, () => {
  console.log('listening on *:5050');
})