const request = require('supertest');

const app = require('../../src/app');

describe('GetById /fragments/:_id', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () =>
    request(app).get('/v1/fragments/111').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app)
      .get('/v1/fragments/111')
      .auth('invalid@email.com', 'incorrect_password')
      .expect(401));

  // Using a valid username/password pair should give a success result
  test('authenticated users get a fragment', async () => {
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('content-type', 'text/plain');
    const id = postRes.body.fragment.id;

    const res = await request(app).get(`/v1/fragments/${id}`).auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(200);
  });

  // Returns 404 if the fragment does not exist
  test('returns 404 for non existing fragment', async () => {
    const res = await request(app).get(`/v1/fragments/111`).auth('user1@email.com', 'password1');
    expect(res.statusCode).toBe(404);
  });

  // If the id contains .txt extension then the corresponding type of data is returned
  test('return data in the appropriate format for the id with the extension', async () => {
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('content-type', 'text/plain');
    const id = postRes.body.fragment.id;

    const res = await request(app)
      .get(`/v1/fragments/${id}.txt`)
      .auth('user1@email.com', 'password1');
    expect(res.type).toBe('text/plain');
  });

  // If the id contains .md extension then the corresponding type of data is returned
  test('return data in the appropriate format for the id with the extension', async () => {
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'password1')
      .set('content-type', 'text/markdown');
    const id = postRes.body.fragment.id;

    const res = await request(app)
      .get(`/v1/fragments/${id}.md`)
      .auth('user1@email.com', 'password1');
    expect(res.type).toBe('text/markdown');
  });
  //
});
