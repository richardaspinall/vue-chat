require('dotenv').config();
const express = require('express');
const request = require('supertest');
const router = require('./router');
const DBConnection = require('./database/dbConnection');
const clearTests = require('../dev_scripts/database/clearTests');

const app = express();
app.use(express.json());

app.use(router);

// Unknown routes
describe('Unknown route', () => {
  it.only('Recieves 404', async () => {
    const response = await request(app).get('/');

    expect(response.statusCode).toEqual(404);
  });
});

// User routes
describe('User routes', () => {
  it.only('Gets a user', async () => {
    const response = await request(app).get('/user/1');

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      user_id: 1,
      user_name: 'raspinall',
      first_name: 'richard',
      last_name: 'aspinall',
    });
  });

  it.only('Gets all users', async () => {
    const response = await request(app).get('/users');

    expect(response.statusCode).toEqual(200);
    expect(response.body.users).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          user_id: expect.any(Number),
          user_name: expect.any(String),
          first_name: expect.any(String),
          last_name: expect.any(String),
        }),
      ])
    );
  });

  it.only('Creates a user', async () => {
    const response = await request(app).post('/user').send({
      user_name: 'jdoe',
      first_name: 'jane',
      last_name: 'doe',
      password: 'testpassword',
    });

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        user_id: expect.any(Number),
        user_name: expect.any(String),
        first_name: expect.any(String),
        last_name: expect.any(String),
      })
    );
  });

  it.only('Returns user_not_found error', async () => {
    const response = await request(app).get('/user/100');

    expect(response.statusCode).toEqual(404);
    expect(response.body).toEqual({
      error: 'user_not_found',
    });
  });

  it.only('Returns user_name_taken error', async () => {
    const response = await request(app).post('/user').send({
      user_name: 'raspinall',
      first_name: 'richard',
      last_name: 'aspinall',
      password: 'testpassword',
    });

    expect(response.statusCode).toEqual(409);
    expect(response.body).toEqual({
      error: 'user_name_taken',
    });
  });

  it.only('Returns user_name_maxlength error', async () => {
    const response = await request(app).post('/user').send({
      user_name: 'raspinall123456789123',
      first_name: 'richard',
      last_name: 'aspinall',
      password: 'testpassword',
    });

    expect(response.statusCode).toEqual(422);
    expect(response.body).toEqual({
      error: 'user_name_maxlength',
    });
  });

  it.only('Returns name_maxlength error', async () => {
    const response = await request(app).post('/user').send({
      user_name: 'maxlength',
      first_name: 'richardrichardrichardrichardrichardrichardrichardrichard',
      last_name: 'aspinallaspinallaspinallaspinallaspinallaspinallaspinall',
      password: 'testpassword',
    });

    expect(response.statusCode).toEqual(422);
    expect(response.body).toEqual({
      error: 'name_maxlength',
    });
  });

  it.only('Returns password_minlength error', async () => {
    const response = await request(app).post('/user').send({
      user_name: 'raspinall',
      first_name: 'richard',
      last_name: 'aspinall',
      password: 'test',
    });

    expect(response.statusCode).toEqual(422);
    expect(response.body).toEqual({
      error: 'password_minlength',
    });
  });
});

// Room routes
describe('Room routes', () => {
  it('Gets a room', async () => {
    const response = await request(app).get('/room/1');

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      room_id: 1,
      room_name: 'random',
    });
  });

  it('Gets all rooms', async () => {
    const response = await request(app).get('/rooms');

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      rooms: [
        {
          room_id: 1,
          room_name: 'random',
        },
        {
          room_id: 2,
          room_name: 'general',
        },
      ],
    });
  });

  it('Creates a room', async () => {
    const allRooms = await request(app).get('/rooms');
    const expectedRoomId = allRooms.rooms.length;
    const response = await request(app).post('/room').send({ room_name: 'cats' });

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      room_id: expectedRoomId,
      room_name: 'cats',
    });
  });

  it('Returns room_name_taken error', async () => {
    const response = await request(app).post('/room').send({
      room_name: 'general',
    });

    expect(response.statusCode).toEqual(400);
    expect(response.body).toEqual({
      error: 'room_name_taken',
    });
  });

  it('Returns room_name_maxlength error', async () => {
    const response = await request(app).post('/room').send({
      room_name: 'general12345678912345',
    });

    expect(response.statusCode).toEqual(400);
    expect(response.body).toEqual({
      error: 'room_name_maxlength',
    });
  });
});

// Message routes
describe('Message routes', () => {
  it('Returns all messages in a room', async () => {
    const response = await request(app).get('/messages?room_id=1');

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      messages: [
        {
          message_id: 1,
          room_id: 1,
          user_id: 1,
          time_stamp: 1624669801.101,
          message: 'Hey James!',
        },
        {
          message_id: 2,
          room_id: 1,
          user_id: 2,
          time_stamp: 1624669801.102,
          message: 'Hey Richard!',
        },
      ],
    });
  });

  it('Creates a message', async () => {
    const response = await request(app).post('/message').send({
      room_id: 1,
      user_id: 1,
      message: 'Hey there!',
    });

    expect(response.statusCode).toEqual(200);
  });

  it('Returns an empty_message error', async () => {
    const response = await request(app).post('/message').send({
      room_id: 1,
      user_id: 1,
      message: '',
    });

    expect(response.statusCode).toEqual(400);
  });
});

afterAll(() => {
  clearTests();
  DBConnection.closePool();
});
