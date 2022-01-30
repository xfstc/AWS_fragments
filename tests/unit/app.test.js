const request = require('supertest');

const app = require('../../src/app');

describe('Error', () => {
  test('should get proper cors headers', async () => {
    const response = await request(app).get('/');
    expect(response.header['access-control-allow-origin']).toEqual('*');
  });

  test('should return HTTP 404 response', async () => {
    const res = await request(app).get('/urlThatDoesNotExist');
    expect(res.statusCode).toBe(404);
  });
});
