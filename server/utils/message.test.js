const expect = require('expect');

const {generateMessage, generateLocationMessage} = require('./message');

describe('generateMessage', () => {
  it('should generate correct message object', () => {
    let from = 'Seb';
    let text = 'Hello there';
    let message = generateMessage(from, text);

    expect(typeof message.createdAt).toBe('number'); // Jest expect version 21+
    expect(message).toMatchObject({from, text}); // Jest expect version 21+
  });
});

describe('generateLocationMessage', () => {
  it('should generate correct location object', () => {
    let from = 'Booba';
    let lat = 1;
    let long = 2;
    let url = 'https://www.google.com/maps?q=1,2';
    let message = generateLocationMessage(from, lat, long);

    expect(typeof message.createdAt).toBe('number'); // Jest expect version 21+
    expect(message).toMatchObject({from, url}); // Jest expect version 21+
  });
});