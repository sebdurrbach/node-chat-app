let socket = io();

socket.on('connect', () => {
  console.log('Connected to the server');
});

socket.on('disconnect', () => {
  console.log('Disconnected from the server');
});

socket.on('newMessage', (message) => {
  console.log('New message', message);

  let li = $('<li></li>');
  li.text(`${message.from} : ${message.text}`);
  $('#messages').append(li);
});

$('#message-form').on('submit', (e) => {
  e.preventDefault();

  socket.emit('createMessage', {
    from: 'User',
    text: $('[name="message"]').val()
  }, () => {

  });
});