// @ts-check
const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
let users = new Users();

let app = express();
// Pour utiliser socket.io, on doit créer un server et utiliser http à la place de express
let server = http.createServer(app);
// On passe ensuite le serveur http par socket.io dans une nouvelle variable
// Donne accès à la librairie socket.io côté client à l'adresse /socket.io/socket.io.js
// On passe l'url en source d'une balise script dans chat.html
let io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => { // connection est un event standard
  console.log('New user connected'); // Côté serveur

  // socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app')); // Côté client

  // Emet à l'ensemble des pers. connectées sauf à l'émetteur :
  // socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined')); // Côté client, sauf émetteur

  socket.on('join', (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback('Name and room name are required.')
    }
    // join permet de communiquer uniquement avec un réseau défini par string
    // pour quitter un espace de communication, on utilise socket.leave(String)
    socket.join(params.room);
    users.removeUser(socket.id); // retire le user si dans une autre room avant
    users.addUser(socket.id, params.name, params.room); // ajoute un nouveau user avec sa room

    // io.to().emit() Envoie un event à une room définie
    // .to(String) spécifie la room
    io.to(params.room).emit('updateUserList', users.getUserList(params.room));
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined.`));

    callback();
  });

  socket.on('createMessage', (message, callback) => {
    let user = users.getUser(socket.id);

    if (user && isRealString(message.text)) {
      io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
    }
    callback();
  });

  socket.on('createLocationMessage', (coords) => {
    let user = users.getUser(socket.id);

    if (user) {
      io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
    }
  });

  socket.on('disconnect', () => { // disconnect est un event standard
    let user = users.removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
    }
  });
});

server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
