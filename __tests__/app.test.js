require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');
const { getCategoryIdByName } = require('../lib/utils.js');

describe('app routes', () => {
  describe('routes', () => {
    let token;
    let categories;
  
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

      const categoryData = await fakeRequest(app).get('/categories');
      categories = categoryData.body;
  
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
          avgplayers: 73000,
          fun: false,
          owner_id: 1,
          category: 'fps'
        },
        {
          id: 2,
          name: 'DeadByDaylight',
          avgplayers: 41000,
          fun: true,
          owner_id: 1,
          category: 'horror'
        },
        {
          id: 3,
          name: 'Rimworld',
          avgplayers: 15000,
          fun: true,
          owner_id: 1,
          category: 'survival'
        },
        {
          id: 4,
          name: 'SeaOfThieves',
          avgplayers: 15900,
          fun: true,
          owner_id: 1,
          category: 'adventure'
        },
        {
          id: 5,
          name: 'pubg',
          avgplayers: 182000,
          fun: false,
          owner_id: 1,
          category: 'fps'
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
          avgplayers: 73000,
          fun: false,
          owner_id: 1,
          category: 'fps'
        }
      ];

      const data = await fakeRequest(app)
        .get('/games/1')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });

    test('make a new game', async() => {
      const categoryId = getCategoryIdByName(categories, 'fps');
      const expectation = 
      {
        id: 6,
        name: 'game',
        avgplayers: 30000,
        fun: true,
        owner_id: 1,
        category: 'fps'
      }; 
      const expectation2 = 
      {
        id: 6,
        name: 'game',
        avgplayers: 30000,
        fun: true,
        owner_id: 1,
        category_id: categoryId
      }; 
      const data = await fakeRequest(app)
        .post('/games')
        .send({
          name: 'game',
          avgplayers: 30000,
          fun: true,
          category_id: categoryId
        })
        .expect('Content-Type', /json/)
        .expect(200);
      const gamesData = await fakeRequest(app) 
        .get('/games')
        .expect('Content-Type', /json/)
        .expect(200);
      expect(data.body).toEqual(expectation2);
      expect(gamesData.body).toContainEqual(expectation);
    });

    test('put test', async() => {
      const categoryId = getCategoryIdByName(categories, 'horror');
      const data = await fakeRequest(app)
        .put('/games/5')
        .send({
          name: 'Spelunky',
          avgplayers: 20000,
          fun: false,
          category_id: 2,
          owner_id: 1
        });
  
      const newGame = { 
        id: 5,
        name: 'Spelunky',
        avgplayers: 20000,
        fun: false,
        category_id: 2,
        owner_id: 1
      };
      
      const newGame2 = { 
        id: 5,
        name: 'Spelunky',
        avgplayers: 20000,
        fun: false,
        category: 'horror',
        owner_id: 1
      };

      const dataGames = await fakeRequest(app)
        .get('/games/5')
        .expect('Content-Type', /json/)
        .expect(200);
      expect(data.body).toEqual(newGame);
      expect(dataGames.body).toContainEqual(newGame2);
    });

    test('test delete', async() => {

      const expectation = 
      {
        id: 6,
        name: 'Spelunky',
        avgplayers: 30000,
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

    test('/GET categories returns all categories', async() => {

      const data = await fakeRequest(app)
        .get('/categories')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body.length).toBeGreaterThan(0);
    });
  });
});