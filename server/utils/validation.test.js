const expect = require('expect');
const {isRealString} = require('./validation');

describe('isRealString', () => {
  it('should reject non-string values', () => {
    let res = isRealString(82);
    expect(res).toBe(false);
  });

  it('should reject string with only spaces', () => {
    let res = isRealString('   ');
    expect(res).toBe(false);
  });

  it('should reject string with only spaces', () => {
    let res = isRealString(' Seb ');
    expect(res).toBe(true);
  });
});