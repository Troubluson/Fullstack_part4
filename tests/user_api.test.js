/* eslint-disable max-len */
const supertest = require('supertest');
const app = require('../app');
const User = require('../models/User');
const helper = require('./user_test_helper');

const api = supertest(app);

beforeEach(async () => {
  await User.deleteMany({});
  await User.insertMany(helper.initialUser);
});

describe('Adding new users', () => {
  test('Post successfully creates a new user', async () => {
    const initialUsers = await helper.getAllUsersInDb();
    const user = {
      username: 'testuser',
      name: 'user test',
      password: 'secret',
    };
    await api
        .post('/api/users')
        .send(user)
        .expect(201)
        .expect('Content-Type', /application\/json/);

    const usersAfterPost = await helper.getAllUsersInDb();
    expect(usersAfterPost).toHaveLength(initialUsers.length + 1);
  });

  test('A too short password gives fails with status code 400', async () => {
    const userShortPass = {
      username: 'testuser1',
      name: 'user test',
      password: 'pa',
    };
    const response = await api
        .post('/api/users')
        .send(userShortPass)
        .expect(400);
    expect(response.body.error).toBe(
        'Password must be at least 3 characters long',
    );
  });

  test('A too short username fails with status code 400', async () => {
    const userShortUsername = {
      username: 'us',
      name: 'user test',
      password: 'password',
    };
    const response = await api
        .post('/api/users')
        .send(userShortUsername)
        .expect(400);

    expect(response.body.error).toContain(
        'is shorter than the minimum allowed length',
    );
  });

  test('A Duplicate username gives status code 400 and appropriate error', async () => {
    const duplicateUser = {...helper.initialUser, password: 'pass'};
    delete duplicateUser.passwordHash;
    const response = await api
        .post('/api/users')
        .send(duplicateUser)
        .expect(400);
    expect(response.body.error).toContain('Username must be unique');
  });

  test('A missing token gives status code 401', async () => {
    expect();
  });
});
