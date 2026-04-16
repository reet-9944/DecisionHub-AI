const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const DB_FILE = path.join(__dirname, '../data/users.json');

// Ensure data directory exists
if (!fs.existsSync(path.dirname(DB_FILE))) {
  fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
}

const loadUsers = () => {
  try { return JSON.parse(fs.readFileSync(DB_FILE, 'utf8')); } catch { return []; }
};

const saveUsers = (users) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(users, null, 2));
};

const JWT_SECRET = process.env.JWT_SECRET || 'decisionhub_secret';
const sign = (user) => jwt.sign(
  { id: user.id, name: user.name, email: user.email },
  JWT_SECRET,
  { expiresIn: '7d' }
);

// Sign Up
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'All fields are required.' });

  const users = loadUsers();
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'An account with this email already exists.' });
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = { id: Date.now().toString(), name, email, password: hashed };
  users.push(user);
  saveUsers(users);

  res.json({ token: sign(user), user: { id: user.id, name: user.name, email: user.email } });
});

// Sign In
router.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required.' });

  const users = loadUsers();
  const user = users.find(u => u.email === email);
  if (!user) return res.status(400).json({ error: 'No account found with this email.' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ error: 'Incorrect password. Try again.' });

  res.json({ token: sign(user), user: { id: user.id, name: user.name, email: user.email } });
});

// Verify token
router.get('/me', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided.' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ user: decoded });
  } catch {
    res.status(401).json({ error: 'Invalid or expired token.' });
  }
});

module.exports = router;
