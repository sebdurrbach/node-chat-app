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

socket.on('newLocationMessage', (message) => {
  let li = $('<li></li>');
  let a = $('<a target="_blank" >My current location</a>');

  li.text(`${message.from} : `);
  a.attr('href', message.url);
  li.append(a);
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

let locationButton = $('#send-location');
locationButton.on('click', () => {
  if (!navigator.geolocation) { // obj et method intégrée aux navigateurs
    return alert('Geolocation not supported by your browser');
  }
  // Cette méthode prend 2 callback : succès renvoie la position et erreur
  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, () => {
    alert('Unable to fetch your location');
  });
});