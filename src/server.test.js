const request = require('supertest');
const server = require('./server');

describe('Base test', () => {
  it('Tests that our server runs', async () => {
    const response = await request(server).get('/');
    expect(response.text).toEqual('Hello World');
  });
});

afterAll(() => server.close());
