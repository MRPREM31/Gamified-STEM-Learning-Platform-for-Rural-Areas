import express from 'express';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import cors from 'cors';
import bodyParser from 'body-parser';
import bcrypt from 'bcryptjs';

const app = express();
const PORT = 4000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// SQLite setup
let db;

async function initializeDatabase() {
  db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database
  });

  // Create users table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      type TEXT CHECK(type IN ('student', 'teacher')) NOT NULL,
      school TEXT,
      class TEXT,
      dob TEXT,
      subjects TEXT,
      experience TEXT,
      coins INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create subjects table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS subjects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT
    )
  `);

  // Create quizzes table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS quizzes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      subject_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      class TEXT NOT NULL,
      difficulty_level TEXT CHECK(difficulty_level IN ('easy', 'medium', 'hard')),
      FOREIGN KEY(subject_id) REFERENCES subjects(id)
    )
  `);

  // Create quiz_results table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS quiz_results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      quiz_id INTEGER NOT NULL,
      score INTEGER NOT NULL,
      coins_earned INTEGER NOT NULL,
      badge TEXT NOT NULL,
      completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id),
      FOREIGN KEY(quiz_id) REFERENCES quizzes(id)
    )
  `);

  console.log('Database initialized successfully');
}

// Initialize the database
initializeDatabase().catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});

// Get all subjects
app.get('/api/subjects', async (req, res) => {
  try {
    const subjects = await db.all('SELECT * FROM subjects');
    res.json(subjects);
  } catch (error) {
    console.error('Error fetching subjects:', error);
    res.status(500).json({ error: 'Failed to fetch subjects' });
  }
});

// Get quizzes by subject and class
app.get('/api/quizzes/subject/:subjectId/class/:class', async (req, res) => {
  try {
    const { subjectId, class: studentClass } = req.params;
    const quizzes = await db.all(
      'SELECT * FROM quizzes WHERE subject_id = ? AND class = ?',
      [subjectId, studentClass]
    );
    res.json(quizzes);
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    res.status(500).json({ error: 'Failed to fetch quizzes' });
  }
});

// Get questions by quiz ID
app.get('/api/questions/quiz/:quizId', async (req, res) => {
  try {
    const { quizId } = req.params;
    const questions = await db.all(
      'SELECT * FROM questions WHERE quiz_id = ?',
      [quizId]
    );
    // Parse the options from JSON string to array
    questions.forEach(q => {
      q.options = JSON.parse(q.options);
    });
    res.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});

// Get quiz results for a user
app.get('/api/results/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const results = await db.all(
      `SELECT qr.*, q.title as quiz_title, s.name as subject_name 
       FROM quiz_results qr
       JOIN quizzes q ON qr.quiz_id = q.id
       JOIN subjects s ON q.subject_id = s.id
       WHERE qr.user_id = ?
       ORDER BY qr.completed_at DESC`,
      [userId]
    );
    res.json(results);
  } catch (error) {
    console.error('Error fetching results:', error);
    res.status(500).json({ error: 'Failed to fetch results' });
  }
});

// Submit quiz result
app.post('/api/results', async (req, res) => {
  try {
    const { userId, quizId, score, coinsEarned, badge } = req.body;
    const result = await db.run(
      'INSERT INTO quiz_results (user_id, quiz_id, score, coins_earned, badge) VALUES (?, ?, ?, ?, ?)',
      [userId, quizId, score, coinsEarned, badge]
    );
    res.json({ id: result.lastID });
  } catch (error) {
    console.error('Error submitting result:', error);
    res.status(500).json({ error: 'Failed to submit result' });
  }
});

// Registration endpoint
app.post('/api/register', async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      type,
      school,
      class: studentClass,
      dob,
      subjects,
      experience
    } = req.body;

    // Validate required fields
    if (!name || !email || !password || !type) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if email already exists
    const existingUser = await db.get('SELECT id FROM users WHERE email = ?', [email]);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const result = await db.run(
      `INSERT INTO users (name, email, password, type, school, class, dob, subjects, experience)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, email, hashedPassword, type, school, studentClass, dob, subjects, experience]
    );

    // Get the created user (excluding password)
    const user = await db.get(
      'SELECT id, name, email, type, school, class, subjects, coins FROM users WHERE id = ?',
      [result.lastID]
    );

    res.status(201).json(user);
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { email, password, type } = req.body;

    // Validate required fields
    if (!email || !password || !type) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get user by email and type
    const user = await db.get(
      'SELECT * FROM users WHERE email = ? AND type = ?',
      [email, type]
    );

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Remove password from response
    delete user.password;
    res.json(user);
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Failed to authenticate' });
  }
});

// Get user profile
app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await db.get(
      'SELECT id, name, email, type, school, class, subjects, coins FROM users WHERE id = ?',
      [req.params.id]
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Update user coins
app.patch('/api/users/:id/coins', async (req, res) => {
  try {
    const { coins } = req.body;
    
    await db.run(
      'UPDATE users SET coins = coins + ? WHERE id = ?',
      [coins, req.params.id]
    );

    const updatedUser = await db.get(
      'SELECT id, name, email, type, school, class, subjects, coins FROM users WHERE id = ?',
      [req.params.id]
    );

    res.json(updatedUser);
  } catch (err) {
    console.error('Error updating coins:', err);
    res.status(500).json({ error: 'Failed to update coins' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});