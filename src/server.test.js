const request = require('supertest');
const server = require('./server');

describe('Base test', () => {
  it('Tests that our server runs and recieves a 404', async () => {
    const response = await request(server).get('/');
    expect(response.statusCode).toEqual(404);
  });
});

afterAll(() => server.close());
