const express = require('express');
const cors = require('cors');
const client = require('./client.js');
const app = express();
const morgan = require('morgan');
const ensureAuth = require('./auth/ensure-auth');
const createAuthRoutes = require('./auth/create-auth-routes');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev')); // http logging

const authRoutes = createAuthRoutes();

// setup authentication routes to give user an auth token
// creates a /auth/signin and a /auth/signup POST route. 
// each requires a POST body with a .email and a .password
app.use('/auth', authRoutes);

// everything that starts with "/api" below here requires an auth token!
app.use('/api', ensureAuth);

// and now every request that has a token in the Authorization header will have a `req.userId` property for us to see who's talking
app.get('/api/test', (req, res) => {
  res.json({
    message: `in this proctected route, we get the user's id like so: ${req.userId}`
  });
});

app.get('/categories', async(req, res) => {
  try {
    const data = await client.query(`
    SELECT id, name
    FROM categories
    ORDER BY name
    `);
    res.json(data.rows);
  }
  catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/games', async(req, res) => {
  try {
    const data = await client.query(`
    SELECT g.id, g.name, g.avgplayers, g.fun, c.name as category, g.owner_id
    FROM games as g
    JOIN categories as c
    ON g.category_id = c.id;
    `);
    
    res.json(data.rows);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

app.get('/games/:id', async(req, res) => {
  try {
    const data = await client.query(`
    SELECT g.id, g.name, g.avgplayers, g.fun, c.name as category, g.owner_id
    FROM games as g
    JOIN categories as c
    ON g.category_id = c.id
    WHERE g.id = $1;
    `, [req.params.id]);
    
    res.json(data.rows);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

app.post('/games', async(req, res) => {
  try {
    const data = await client.query(`
      INSERT INTO games (name, avgplayers, fun, category_id, owner_id)
      VALUES ($1, $2, $3, $4, 1)
      RETURNING *`, [req.body.name, req.body.avgplayers, req.body.fun, req.body.category_id]);
    console.log(data.rows[0]);
    res.json(data.rows[0]);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

app.put('/games/:id', async(req, res) => {
  try {
    const data = await client.query(`
    UPDATE games
    SET
      name=$1,
      avgplayers=$2,
      fun=$3,
      category_id=$4
    WHERE id=$5
    RETURNING *
    `, [req.body.name, req.body.avgplayers, req.body.fun, req.body.category_id, req.params.id]);
    res.json(data.rows[0]);
  }
  catch(e) {
    res.status(500).json({ error: e.message });
  }
});

app.delete('/games/:id', async(req, res) => {
  try {
    const data = await client.query('DELETE FROM games WHERE id=$1', [req.params.id]);
    
    res.json(data.rows[0]);
  } 
  catch(e) {
    res.status(500).json({ error: e.message });
  }
});

app.use(require('./middleware/error'));

module.exports = app;
