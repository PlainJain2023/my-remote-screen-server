// Import the socket.io-client package
const io = require('socket.io-client');

// Connect to the Socket.IO server (replace 'http://localhost:3000' with your server's URL)
const socket = io('http://localhost:5050');

// Handle connection
socket.on('connect', () => {
  console.log('Connected to server');

  // Emit an event to the server
  socket.emit('message', 'Hello from the client!');

  // Receive messages from the server
  socket.on('message', (data) => {
    console.log('Message from server:', data);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Disconnected from server');
  });
});

// Optionally, handle connection errors
socket.on('connect_error', (error) => {
  console.error('Connection error:', error);
});