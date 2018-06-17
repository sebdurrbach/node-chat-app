// @ts-check
const path = require('path');
const http = require('http');
const express = require('express');
const socket = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

let app = express();
// Pour utiliser socket.io, on doit créer un server et utiliser http à la place de express
let server = http.createServer(app);
// On passe ensuite le serveur http par socket.io dans une nouvelle variable
// Donne accès à la librairie socket.io côté client à l'adresse /socket.io/socket.io.js
// On passe l'url en source d'une balise script dans index.html
let io = socket(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('New user connected');

  socket.on('disconnect', () => {
    console.log('Disconnected from client');
  });
});

server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
