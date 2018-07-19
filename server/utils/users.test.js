const expect = require('expect');

const {Users} = require('./users');

describe('Users', () => {
  let users;

  beforeEach(() => {
    users = new Users();
    users.users = [{
      id: '1',
      name: 'Mike',
      room: 'Node Course'
    }, {
      id: '2',
      name: 'Jen',
      room: 'React Course'
    }, {
      id: '3',
      name: 'Julie',
      room: 'Node Course'
    }];
  });

  it('should add new user', () => {
    let users = new Users();
    let user = {
      id: 12345,
      name: 'Seb',
      room: 'Node Course'
    }

    let resUsers = users.addUser(user.id, user.name, user.room);

    expect(users.users).toEqual([user]);
  });

  it('should remove a user', () => {
    let user = users.removeUser('1');

    expect(user.id).toBe('1');
    expect(users.users.length).toBe(2);
  });

  it('should not remove a user', () => {
    let user = users.removeUser('4');

    expect(user).toBe(undefined);
    expect(users.users.length).toBe(3);
  });

  it('should find a user', () => {
    let user = users.getUser('1');
    expect(user.id).toBe('1');
  });

  it('should not find a user', () => {
    let user = users.getUser('4');
    expect(user).toBeUndefined();
  });

  it('should return names for Node Course', () => {
    let userList = users.getUserList('Node Course');
    expect(userList).toEqual(['Mike', 'Julie']);
  });

  it('should return names for React Course', () => {
    let userList = users.getUserList('React Course');
    expect(userList).toEqual(['Jen']);
  });
});
