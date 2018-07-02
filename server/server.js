// @ts-check
const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

let app = express();
// Pour utiliser socket.io, on doit créer un server et utiliser http à la place de express
let server = http.createServer(app);
// On passe ensuite le serveur http par socket.io dans une nouvelle variable
// Donne accès à la librairie socket.io côté client à l'adresse /socket.io/socket.io.js
// On passe l'url en source d'une balise script dans index.html
let io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => { // connection est un event standard
  console.log('New user connected'); // Côté serveur

  socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app')); // Côté client

  // SOCKET.BROADCAST.EMIT emet à l'ensemble des pers. connectées sauf à l'émetteur
  socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined')); // Côté client, sauf émetteur

  socket.on('createMessage', (message, callback) => {

    // IO.EMIT emet un event à l'ensemble des personnes connectées au serveur
    io.emit('newMessage', generateMessage(message.from, message.text));
    callback();
  });

  socket.on('createLocationMessage', (coords) => {
    io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
  });

  socket.on('disconnect', () => { // disconnect est un event standard
    console.log('Disconnected from client');
  });
});

server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
