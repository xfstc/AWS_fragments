const request = require('supertest');

const app = require('../../src/app');

describe('Error', () => {
  test('should return HTTP 404 response', async () => {
    const res = await request(app).get('/urlThatDoesNotExist');
    expect(res.statusCode).toBe(404);
  });
});
