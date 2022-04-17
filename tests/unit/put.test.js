const request = require('supertest');

const app = require('../../src/app');

describe('PUT /v1/fragments', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () => request(app).put('/v1/fragments').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app).put('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));

  // Using a valid username password allows successful editing
  test('authenticated users could edit fragment', async () => {
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('content-type', 'text/plain');
    const id = postRes.body.fragment.id;

    const res = await request(app)
      .put(`/v1/fragments/${id}`)
      .auth('user1@email.com', 'password1')
      .set('content-type', 'text/plain');
    expect(res.statusCode).toBe(200);
  });

  // Returns 400 if users want to change the content type
  test('content type could not be changed', async () => {
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('content-type', 'text/plain');
    const id = postRes.body.fragment.id;

    const res = await request(app)
      .put(`/v1/fragments/${id}`)
      .auth('user1@email.com', 'password1')
      .set('content-type', 'text/markdown');
    expect(res.statusCode).toBe(400);
  });

  // Returns 404 if the ID does not exist
  test('returns 404 if fragment cannot find', async () => {
    const res = await request(app)
      .put(`/v1/fragments/IDNotExists`)
      .auth('user1@email.com', 'password1')
      .set('content-type', 'text/plain');
    expect(res.statusCode).toBe(404);
  });
});
