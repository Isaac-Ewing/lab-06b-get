require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');

describe('app routes', () => {
  describe('routes', () => {
    let token;
  
    beforeAll(async done => {
      execSync('npm run setup-db');
  
      client.connect();
  
      const signInData = await fakeRequest(app)
        .post('/auth/signup')
        .send({
          email: 'jon@user.com',
          password: '1234'
        });
      
      token = signInData.body.token; // eslint-disable-line
  
      return done();
    });
  
    afterAll(done => {
      return client.end(done);
    });

    test('returns games', async() => {

      const expectation = [
        {
          id: 'Destiny',
          avgplayers: 73000,
          fun: false,
          owner_id: 1,
          type: 'fps'
        },
        {
          id: 'DeadByDaylight',
          avgplayers: 41000,
          fun: true,
          owner_id: 1,
          type: 'horror'
        },
        {
          id: 'Rimworld',
          avgplayers: 15000,
          fun: true,
          owner_id: 1,
          type: 'survival'
        },
        {
          id: 'SeaOfThieves',
          avgplayers: 15900,
          fun: true,
          owner_id: 1,
          type: 'adventure'
        },
        {
          id: 'pubg',
          avgplayers: 182000,
          fun: false,
          owner_id: 1,
          type: 'fps'
        }
      ];

      const data = await fakeRequest(app)
        .get('/games')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });

    test('returns game', async() => {

      const expectation = [
        {
          id: 'Destiny',
          avgplayers: 73000,
          fun: false,
          owner_id: 1,
          type: 'fps'
        }
      ];

      const data = await fakeRequest(app)
        .get('/games/Destiny')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });
  });
});