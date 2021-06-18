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
          id: 1,
          name: 'Destiny',
          avgPlayers: 73000,
          fun: false,
          owner_id: 1,
          type: 'fps'
        },
        {
          id: 2,
          name: 'DeadByDaylight',
          avgPlayers: 41000,
          fun: true,
          owner_id: 1,
          type: 'horror'
        },
        {
          id: 3,
          name: 'Rimworld',
          avgPlayers: 15000,
          fun: true,
          owner_id: 1,
          type: 'survival'
        },
        {
          id: 4,
          name: 'SeaOfThieves',
          avgPlayers: 15900,
          fun: true,
          owner_id: 1,
          type: 'adventure'
        },
        {
          id: 5,
          name: 'pubg',
          avgPlayers: 182000,
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
          id: 1,
          name: 'Destiny',
          avgPlayers: 73000,
          fun: false,
          owner_id: 1,
          type: 'fps'
        }
      ];

      const data = await fakeRequest(app)
        .get('/games/1')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });

    test('make a new game', async() => {

      const expectation = 
      {
        id: 6,
        name: 'Spelunky',
        avgPlayers: 30000,
        fun: true,
        type: 'rouge'
      }; 
      const data = await fakeRequest(app)
        .post('/games')
        .send({
          name: 'Spelunky',
          avgPlayers: 30000,
          fun: true,
          type: 'rouge',
        })
        .expect('Content-Type', /json/)
        .expect(200);
        
      const gamesData = await fakeRequest(app) 
        .get('/games')
        .expect('Content-Type', /json/)
        .expect(200); 

      expect(data.body).toEqual(expectation);
      expect(gamesData.body).toContainEqual(expectation);
    });

    test('put test', async() => {
      const data = await fakeRequest(app)
        .put('/games/6')
        .send({
          name: 'Spelunky2',
          avgPlayers: 20000,
          fun: false,
          type: 'none'
        });
  
      const newGame = { 
        id: 6,
        name: 'Spelunky2',
        avgPlayers: 20000,
        fun: false,
        type: 'none',
        owner_id: 1
      };

      const dataGames = await fakeRequest(app)
        .get('/games/6')
        .expect('Content-Type', /json/)
        .expect(200);
      expect(data.body).toEqual(newGame);
      expect(dataGames.body).toContainEqual(newGame);
    });

    test('test delete', async() => {

      const expectation = 
      {
        id: 6,
        name: 'Spelunky',
        avgPlayers: 30000,
        fun: true,
        type: 'rouge',
      };
      
      await fakeRequest(app)
        .delete('/games/6')
        .expect('Content-Type', /json/)
        .expect(200);
      
      const allGames = await fakeRequest(app) 
        .get('/games')
        .expect('Content-Type', /json/)
        .expect(200); 
     
      expect(allGames.body).not.toContainEqual(expectation);
    });
  });
});