// récupère l'obj renvoyé par la création de socket.io à l'adresse /socket.io/socket.io.js
// voir server.js
let socket = io();

function scrollToBottom() {
  let messages = $('#messages');
  let newMessage = messages.children('li:last-child');

  let clientHeight = messages.prop('clientHeight'); // partie visible
  let scrollTop = messages.prop('scrollTop'); // distance du haut
  let scrollHeight = messages.prop('scrollHeight'); // hauteur totale
  let newMessageHeight = newMessage.innerHeight(); // hauteur dernier message
  let lastMessageHeight = newMessage.prev().innerHeight(); // hauteur avant-dernier

  if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    messages.scrollTop(scrollHeight);
  }
}

socket.on('connect', () => {
  // deparam est une fonction ajoutée à jQuery, voir deparam.js
  // location est une globale du navigateur, search contient les params de l'url
  let params = $.deparam(window.location.search);

  socket.emit('join', params, function(err) {
    if (err) {
      alert(err);
      // href est la variable de destination de la page
      window.location.href = '/'; // renvoie à l'index
    } else {
      console.log('No error');
    }
  });
});

socket.on('disconnect', () => {
  console.log('Disconnected from the server');
});

socket.on('updateUserList', (users) => {
  let ol = $('<ol></ol>');
  users.forEach((user) => {
    ol.append($('<li></li>').text(user))
  });
  $('#users').html(ol);
});

socket.on('newMessage', (message) => {
  let formattedTime = moment(message.createdAt).format('h:mm a');
  let template = $('#message-template').html();
  let html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    createdAt: formattedTime
  });

  $('#messages').append(html);
  scrollToBottom();
});

socket.on('newLocationMessage', (message) => {
  let formattedTime = moment(message.createdAt).format('h:mm a');
  let template = $('#location-message-template').html();
  let html = Mustache.render(template, {
    from: message.from,
    url: message.url,
    createdAt: formattedTime
  });

  $('#messages').append(html);
  scrollToBottom();
});

$('#message-form').on('submit', (e) => {
  e.preventDefault();
  let messageTextbox = $('[name=message]')

  socket.emit('createMessage', {
    text: messageTextbox.val()
  }, () => {
    messageTextbox.val('');
  });
});

let locationButton = $('#send-location');
locationButton.on('click', () => {
  if (!navigator.geolocation) { // obj et method intégrée aux navigateurs
    return alert('Geolocation not supported by your browser');
  }
  locationButton.attr('disabled', 'disabled').text('Sending location...');
  // Cette méthode prend 2 callback : succès renvoie la position et erreur
  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
    locationButton.removeAttr('disabled').text('Send location');
  }, () => {
    locationButton.removeAttr('disabled').text('Send location');
    alert('Unable to fetch your location');
  });
});