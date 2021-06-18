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

    test('make a new game', async() => {

      const expectation = 
      {
        id: 'Spelunky',
        avgPlayers: 30000,
        fun: true,
        type: 'rouge',
        owner_id: 1
      }; 
      
      const data = await fakeRequest(app)
        .post('/games')
        .send({
          id: 'Spelunky',
          avgPlayers: 30000,
          fun: true,
          type: 'rouge',
        })
        .expect('Content-Type', /json/);
        
      const gamesData = await fakeRequest(app) 
        .get('/games')
        .expect('Content-Type', /json/)
        .expect(200); 

      expect(data.body).toEqual(expectation);
      expect(gamesData.body).toContainEqual(expectation);
    });

    test('/PUT board-games updates a single board game', async() => {
      const data = await fakeRequest(app)
        .put('/games/Destiny')
        .send({
          id: 'Destiny2',
          avgPlayers: 20000,
          fun: true,
          type: 'none'
        })
        .expect('Content-Type', /json/);
      const dataGames = await fakeRequest(app)
        .get('/games')
        .expect('Content-Type', /json/)
        .expect(200);
  
      const newGame = { 
        'id': 'Destiny2',
        'avgPlayers': 20000,
        'fun': true,
        'type': 'none'
      };
      expect(data.body).toEqual(newGame);
      expect(dataGames.body).toContainEqual(newGame);
    });

    test('test delete', async() => {

      const expectation = 
      {
        id: 'Spelunky',
        avgPlayers: 30000,
        fun: true,
        type: 'rouge',
      };
      
      await fakeRequest(app)
        .delete('/games/Spelunky')
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