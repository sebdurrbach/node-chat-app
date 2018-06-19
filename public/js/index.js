let socket = io();

socket.on('connect', () => {
  console.log('Connected to the server');

  socket.emit('createMessage', {
    to: 'Tom',
    text: 'Ouais'
  });
});

socket.on('disconnect', () => {
  console.log('Disconnected from the server');
});

socket.on('newMessage', (message) => {
  console.log('New message', message);
});