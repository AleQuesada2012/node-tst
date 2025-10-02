// index.js
require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // SSL needed for Render external connections:
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

const app = express();
app.use(express.json());

app.get('/ping', (req, res) => {
  res.json({ status: "OK" });
});

app.get('/users', async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM users LIMIT 10');
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

app.get('/', (req, res) => {
  text = "Hello from backend! use /ping to test connection, /users to query DB"
  res.send('Hello from backend!');
});


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
