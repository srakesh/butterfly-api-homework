'use strict';

const path = require('path');
const lowdb = require('lowdb');
const FileAsync = require('lowdb/adapters/FileAsync');
const request = require('supertest');
const shortid = require('shortid');

const createApp = require('../src/index');

let app;

beforeAll(async () => {
  // Create a test database
  const testDbPath = path.join(__dirname, 'test.db.json');
  const db = await lowdb(new FileAsync(testDbPath));

  // Fill the test database with data
  await db.setState({
    butterflies: [
      {
        id: 'wxyz9876',
        commonName: 'test-butterfly',
        species: 'Testium butterflius',
        article: 'https://example.com/testium_butterflius'
      }
    ],
    users: [
      {
        id: 'abcd1234',
        username: 'test-user'
      }
    ],
    butterflyratings: [
      {
        id: 'cdsTT',
        userid: 'abcd1234',
        butterflyid: 'wxyz9876',
        rating: 4.5
      }
    ]
  }).write();

  // Create an app instance
  app = await createApp(testDbPath);
});

describe('GET root', () => {
  it('success', async () => {
    const response = await request(app)
      .get('/');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: 'Server is running!'
    });
  });
});

describe('GET butterfly', () => {
  it('success', async () => {
    const response = await request(app)
      .get('/butterflies/wxyz9876');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: 'wxyz9876',
      commonName: 'test-butterfly',
      species: 'Testium butterflius',
      article: 'https://example.com/testium_butterflius'
    });
  });

  it('error - not found', async () => {
    const response = await request(app)
      .get('/butterflies/bad-id');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: 'Not found'
    });
  });
});

describe('POST butterfly', () => {
  it('success', async () => {
    shortid.generate = jest.fn().mockReturnValue('new-butterfly-id');

    const postResponse = await request(app)
      .post('/butterflies')
      .send({
        commonName: 'Boop',
        species: 'Boopi beepi',
        article: 'https://example.com/boopi_beepi'
      });

    expect(postResponse.status).toBe(200);
    expect(postResponse.body).toEqual({
      id: 'new-butterfly-id',
      commonName: 'Boop',
      species: 'Boopi beepi',
      article: 'https://example.com/boopi_beepi'
    });

    const getResponse = await request(app)
      .get('/butterflies/new-butterfly-id');

    expect(getResponse.status).toBe(200);
    expect(getResponse.body).toEqual({
      id: 'new-butterfly-id',
      commonName: 'Boop',
      species: 'Boopi beepi',
      article: 'https://example.com/boopi_beepi'
    });
  });

  it('error - empty body', async () => {
    const response = await request(app)
      .post('/butterflies')
      .send();

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'Invalid request body'
    });
  });

  it('error - missing all attributes', async () => {
    const response = await request(app)
      .post('/butterflies')
      .send({});

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'Invalid request body'
    });
  });

  it('error - missing some attributes', async () => {
    const response = await request(app)
      .post('/butterflies')
      .send({ commonName: 'boop' });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'Invalid request body'
    });
  });
});

describe('GET user', () => {
  it('success', async () => {
    const response = await request(app)
      .get('/users/abcd1234');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: 'abcd1234',
      username: 'test-user'
    });
  });

  it('error - not found', async () => {
    const response = await request(app)
      .get('/users/bad-id');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: 'Not found'
    });
  });
});

describe('POST user', () => {
  it('success', async () => {
    shortid.generate = jest.fn().mockReturnValue('new-user-id');

    const postResponse = await request(app)
      .post('/users')
      .send({
        username: 'Buster'
      });

    expect(postResponse.status).toBe(200);
    expect(postResponse.body).toEqual({
      id: 'new-user-id',
      username: 'Buster'
    });

    const getResponse = await request(app)
      .get('/users/new-user-id');

    expect(getResponse.status).toBe(200);
    expect(getResponse.body).toEqual({
      id: 'new-user-id',
      username: 'Buster'
    });
  });

  it('error - empty body', async () => {
    const response = await request(app)
      .post('/users')
      .send();

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'Invalid request body'
    });
  });

  it('error - missing all attributes', async () => {
    const response = await request(app)
      .post('/users')
      .send({});

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'Invalid request body'
    });
  });
});

describe('GET butterflyratings', () => {
  it('success', async () => {
    const response = await request(app)
      .get('/butterflyratings/abcd1234');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([{
      id: 'cdsTT',
      userid: 'abcd1234',
      butterflyid: 'wxyz9876',
      rating: 4.5
    }]);
  });

  it('error - not found', async () => {
    const response = await request(app)
      .get('/butterflyratings/bad-id');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: 'Not found'
    });
  });
});

describe('POST butterflyratings', () => {
  it('success', async () => {
    shortid.generate = jest.fn().mockReturnValue('new-butterfly-rating-id');

    const postResponse = await request(app)
      .post('/butterflyratings')
      .send({
        userid: 'abcd1234',
        butterflyid: 'wxyz9876',
        rating: 4.5
      });

    expect(postResponse.status).toBe(200);
    expect(postResponse.body).toEqual([{
      id: 'cdsTT',
      userid: 'abcd1234',
      butterflyid: 'wxyz9876',
      rating: 4.5
    }]);

    const getResponse = await request(app)
      .get('/butterflyratings/abcd1234');

    expect(getResponse.status).toBe(200);
    expect(getResponse.body).toEqual([{
      id: 'cdsTT',
      userid: 'abcd1234',
      butterflyid: 'wxyz9876',
      rating: 4.5
    }]);
  });


  it('error - invalid butterfly', async () => {
    shortid.generate = jest.fn().mockReturnValue('new-butterfly-rating-id');

    const response = await request(app)
      .post('/butterflyratings')
      .send({
        userid: 'abcd1234',
        butterflyid: 'butterfly-does-not-exist',
        rating: 4.5
      });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: 'Invalid butterfly'
    });
  });

  it('error - invalid user', async () => {
    shortid.generate = jest.fn().mockReturnValue('new-butterfly-rating-id');

    const response = await request(app)
      .post('/butterflyratings')
      .send({
        userid: 'user-does-not-exist',
        butterflyid: 'wxyz9876',
        rating: 4.5
      });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error: 'Invalid user'
    });
  });

  it('error - invalid rating', async () => {
    shortid.generate = jest.fn().mockReturnValue('new-butterfly-rating-id');

    const response = await request(app)
      .post('/butterflyratings')
      .send({
        userid: 'abcd1234',
        butterflyid: 'wxyz9876',
        rating: 5.5
      });

    expect(response.body).toEqual({
      error: 'Invalid request body. Please check your input. userid and butterflyid are string types. rating is a number >= 0 and <= 5.'
    });
  });

  it('error - empty body', async () => {
    const response = await request(app)
      .post('/butterflyratings')
      .send();

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'Invalid request body. Please check your input. userid and butterflyid are string types. rating is a number >= 0 and <= 5.'
    });
  });

  it('error - missing all attributes', async () => {
    const response = await request(app)
      .post('/butterflyratings')
      .send({});

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'Invalid request body. Please check your input. userid and butterflyid are string types. rating is a number >= 0 and <= 5.'
    });
  });

  it('error - missing some attributes', async () => {
    const response = await request(app)
      .post('/butterflyratings')
      .send({ rating: '4.5' });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'Invalid request body. Please check your input. userid and butterflyid are string types. rating is a number >= 0 and <= 5.'
    });
  });
  it('error - missing some attributes', async () => {
    const response = await request(app)
      .post('/butterflyratings')
      .send({ rating: '4.5' });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error: 'Invalid request body. Please check your input. userid and butterflyid are string types. rating is a number >= 0 and <= 5.'
    });
  });
});