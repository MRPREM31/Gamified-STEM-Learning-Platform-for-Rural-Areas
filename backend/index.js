import express from 'express';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const PORT = 4000;
app.use(cors());
app.use(bodyParser.json());

// SQLite3 setup
let db;
(async () => {
  db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database
  });

  // Create tables if not exist
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT,
      password TEXT,
      type TEXT,
      school TEXT,
      class TEXT,
      dob TEXT,
      subject TEXT,
      experience TEXT
    );
    
    -- Insert sample teacher if not exists
    INSERT OR IGNORE INTO users (
      name, 
      email, 
      password, 
      type, 
      school, 
      subject,
      experience,
      dob
    ) VALUES (
      'Dr. Roni Kumar',
      'roni.kumar@eduquest.com',
      'teacher123',
      'teacher',
      'EduQuest Academy',
      'Computer Science, Mathematics',
      '10+ years teaching experience in Computer Science and Mathematics',
      '1985-06-15'
    );
    CREATE TABLE IF NOT EXISTS quizzes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      subject TEXT,
      questions TEXT
    );
    CREATE TABLE IF NOT EXISTS results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      quiz_id INTEGER,
      score INTEGER,
      coins INTEGER,
      badge TEXT,
      FOREIGN KEY(user_id) REFERENCES users(id),
      FOREIGN KEY(quiz_id) REFERENCES quizzes(id)
    );
  `);

  // Register endpoints only after DB is ready
  app.get('/', (req, res) => {
    res.send('Backend API running');
  });

  // --- TEACHER ENDPOINTS ---
  app.get('/api/teachers', async (req, res) => {
    try {
      const teachers = await db.all('SELECT id, name, email, school FROM users WHERE type = ?', ['teacher']);
      res.json(teachers);
    } catch (err) {
      console.error('Error fetching teachers:', err);
      res.status(500).json({ error: 'Failed to fetch teachers' });
    }
  });

  app.get('/api/teachers/:id', async (req, res) => {
    try {
      const teacher = await db.get(
        'SELECT id, name, email, school, dob, subject, experience FROM users WHERE type = ? AND id = ?', 
        ['teacher', req.params.id]
      );
      if (!teacher) {
        return res.status(404).json({ error: 'Teacher not found' });
      }
      res.json(teacher);
    } catch (err) {
      console.error('Error fetching teacher:', err);
      res.status(500).json({ error: 'Failed to fetch teacher details' });
    }
  });

  // --- AUTH ENDPOINTS ---

  app.post('/api/register', async (req, res) => {
    const { name, email, password, type, school, class: userClass, dob } = req.body;
    // Validate required fields
    if (!name || !email || !password || !type || !school || !userClass || !dob) {
      console.error('Missing field:', { name, email, password, type, school, userClass, dob });
      return res.status(400).json({ error: 'Missing required field' });
    }
    try {
      const result = await db.run(
        'INSERT INTO users (name, email, password, type, school, class, dob) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [name, email, password, type, school, userClass, dob]
      );
      // OTP logic
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      // Store OTP in memory (for demo)
      if (!global.otps) global.otps = {};
      global.otps[email] = otp;
      // Simulate sending OTP (console log)
      console.log(`OTP for ${email}: ${otp}`);
      res.json({ id: result.lastID, name, email, type, school, class: userClass, dob, otpSent: true });
    } catch (err) {
      console.error('Registration error:', err);
      res.status(500).json({ error: 'Registration failed', details: err.message });
    }
  // --- OTP VERIFICATION ENDPOINT ---
  app.post('/api/verify-otp', async (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ error: 'Missing email or OTP' });
    }
    if (global.otps && global.otps[email] === otp) {
      delete global.otps[email];
      return res.json({ success: true });
    }
    res.status(400).json({ error: 'Invalid OTP' });
  });
  });

  app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await db.get('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);
      if (user) {
        res.json(user);
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
      }
    } catch (err) {
      res.status(500).json({ error: 'Login failed', details: err.message });
    }
  });

  // --- USER ENDPOINTS ---
  app.get('/api/user/:id', async (req, res) => {
    try {
      const user = await db.get('SELECT * FROM users WHERE id = ?', [req.params.id]);
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch user', details: err.message });
    }
  });

  // --- QUIZ ENDPOINTS ---
  app.get('/api/quizzes', async (req, res) => {
    try {
      const questionsConfig = await import('./config/questions.json', { assert: { type: 'json' } });
      const quizzes = questionsConfig.default.quizzes.map(quiz => ({
        ...quiz,
        questions: JSON.stringify(quiz.questions)
      }));
      res.json(quizzes);
    } catch (err) {
      console.error('Failed to fetch quizzes:', err);
      res.status(500).json({ error: 'Failed to fetch quizzes', details: err.message });
    }
  });

  app.post('/api/quizzes', async (req, res) => {
    const { subject, questions } = req.body;
    try {
      const result = await db.run('INSERT INTO quizzes (subject, questions) VALUES (?, ?)', [subject, JSON.stringify(questions)]);
      res.json({ id: result.lastID, subject, questions });
    } catch (err) {
      res.status(500).json({ error: 'Failed to create quiz', details: err.message });
    }
  });

  // --- RESULTS ENDPOINTS ---
  app.post('/api/results', async (req, res) => {
    const { user_id, quiz_id, score, coins, badge } = req.body;
    try {
      const result = await db.run(
        'INSERT INTO results (user_id, quiz_id, score, coins, badge) VALUES (?, ?, ?, ?, ?)',
        [user_id, quiz_id, score, coins, badge]
      );
      res.json({ id: result.lastID, user_id, quiz_id, score, coins, badge });
    } catch (err) {
      res.status(500).json({ error: 'Failed to save result', details: err.message });
    }
  });

  app.get('/api/results/:user_id', async (req, res) => {
    try {
      const results = await db.all('SELECT * FROM results WHERE user_id = ?', [req.params.user_id]);
      res.json(results);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch results', details: err.message });
    }
  });

  app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
  });
})();

// Placeholder for endpoints
// TODO: Add auth, quiz, user endpoints


