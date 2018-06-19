const expect = require('expect');

const {generateMessage} = require('./message');

describe('generateMessage', () => {
  it('should generate correct message object', () => {
    let from = 'Seb';
    let text = 'Hello there';
    let message = generateMessage(from, text);

    expect(typeof message.createdAt).toBe('number'); // Jest expect version 21+
    expect(message).toMatchObject({from, text}); // Jest expect version 21+
  });
});