const express  = require('express');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const path     = require('path');
const Database = require('better-sqlite3');
const router   = express.Router();

// ── Persistent SQLite DB ──────────────────────────────────────────────────────
const DB_PATH = path.join(__dirname, '../data/users.db');
const db = new Database(DB_PATH);

// Create users table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id       TEXT PRIMARY KEY,
    name     TEXT NOT NULL,
    email    TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created  INTEGER DEFAULT (strftime('%s','now'))
  )
`);

// ── Helpers ───────────────────────────────────────────────────────────────────
const JWT_SECRET = process.env.JWT_SECRET || 'decisionhub_secret_key_2024';

const signToken = (user) =>
  jwt.sign(
    { id: user.id, name: user.name, email: user.email },
    JWT_SECRET,
    { expiresIn: '30d' }
  );

const safeUser = (u) => ({ id: u.id, name: u.name, email: u.email });

// ── Sign Up ───────────────────────────────────────────────────────────────────
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: 'All fields are required.' });

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing)
    return res.status(400).json({ error: 'An account with this email already exists.' });

  const hashed = await bcrypt.hash(password, 10);
  const id     = `${Date.now()}_${Math.random().toString(36).slice(2)}`;

  db.prepare('INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)')
    .run(id, name.trim(), email.toLowerCase().trim(), hashed);

  const user = { id, name: name.trim(), email: email.toLowerCase().trim() };
  res.json({ token: signToken(user), user: safeUser(user) });
});

// ── Sign In ───────────────────────────────────────────────────────────────────
router.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: 'Email and password are required.' });

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase().trim());
  if (!user)
    return res.status(400).json({ error: 'No account found with this email.' });

  const match = await bcrypt.compare(password, user.password);
  if (!match)
    return res.status(400).json({ error: 'Incorrect password. Try again.' });

  res.json({ token: signToken(user), user: safeUser(user) });
});

// ── Verify Token ──────────────────────────────────────────────────────────────
router.get('/me', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided.' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // Re-fetch from DB to ensure user still exists
    const user = db.prepare('SELECT id, name, email FROM users WHERE id = ?').get(decoded.id);
    if (!user) return res.status(401).json({ error: 'Account not found.' });
    res.json({ user });
  } catch {
    res.status(401).json({ error: 'Invalid or expired token.' });
  }
});

module.exports = router;
