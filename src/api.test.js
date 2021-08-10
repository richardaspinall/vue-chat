require('dotenv').config();
const express = require('express');
const request = require('supertest');
const router = require('./router');
const clearTests = require('../dev_scripts/database/clearTests');

const app = express();

app.use(router);

// Unknown endpoint call
describe('Base API test', () => {
  it.only('Recieves 404', async () => {
    const response = await request(app).get('/');

    expect(response.statusCode).toEqual(404);
  });
});

describe('User routes', () => {
  it('Gets a user', async () => {
    const response = await request(app).get('/user/1');

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      user_name: 'raspinall',
      first_name: 'richard',
      last_name: 'aspinall',
    });
  });

  it('Gets all users in a room', async () => {
    const response = await request(app).get('/users?room_id=1');

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual(
      {
        user_name: 'raspinall',
        first_name: 'richard',
        last_name: 'aspinall',
      },
      {
        user_name: 'james',
        first_name: 'james',
        last_name: 'smith',
      }
    );
  });

  it('Creates a user', async () => {
    const response = await request(app).post('/user').send({
      user_name: 'jdoe',
      first_name: 'jane',
      last_name: 'doe',
      password: 'testpassword',
    });

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      user_name: 'jdoe',
      first_name: 'jane',
      last_name: 'doe',
    });
  });

  it('Returns user_name_taken error', async () => {
    const response = await request(app).post('/user').send({
      user_name: 'raspinall',
      first_name: 'richard',
      last_name: 'aspinall',
      password: 'testpassword',
    });

    expect(response.statusCode).toEqual(400);
    expect(response.body).toEqual({
      error: 'user_name_taken',
    });
  });

  it('Returns user_name_maxlength error', async () => {
    const response = await request(app).post('/user').send({
      user_name: 'raspinall123456789123',
      first_name: 'richard',
      last_name: 'aspinall',
      password: 'testpassword',
    });

    expect(response.statusCode).toEqual(400);
    expect(response.body).toEqual({
      error: 'user_name_maxlength',
    });
  });

  it('Returns name_maxlength error', async () => {
    const response = await request(app).post('/user').send({
      user_name: 'maxlength',
      first_name: 'richardrichardrichardrichardrichardrichardrichardrichard',
      last_name: 'aspinallaspinallaspinallaspinallaspinallaspinallaspinall',
      password: 'testpassword',
    });

    expect(response.statusCode).toEqual(400);
    expect(response.body).toEqual({
      error: 'name_maxlength',
    });
  });

  it('Returns password_minlength error', async () => {
    const response = await request(app).post('/user').send({
      user_name: 'raspinall',
      first_name: 'richard',
      last_name: 'aspinall',
      password: 'test',
    });

    expect(response.statusCode).toEqual(400);
    expect(response.body).toEqual({
      error: 'password_minlength',
    });
  });
});

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

describe('Message routes', () => {
  it('Returns all messages in a room', async () => {
    const response = await request(app).get('/messages?room_id=1');

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      messages: [
        {
          room_id: 1,
          user_id: 1,
          time_stamp: 1624669801.101,
          message: 'Hey James!',
        },
        {
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

afterAll(() => clearTests());
