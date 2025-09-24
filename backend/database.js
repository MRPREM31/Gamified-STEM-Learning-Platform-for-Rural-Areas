import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

let db;

async function initializeDatabase() {
  db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database
  });

  // Create tables first
  await db.exec(`
    -- Students table
    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      school TEXT,
      class TEXT,
      dob TEXT,
      total_coins INTEGER DEFAULT 0,
      total_badges INTEGER DEFAULT 0,
      xp_points INTEGER DEFAULT 0,
      quizzes_completed INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Teachers table
    CREATE TABLE IF NOT EXISTS teachers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      school TEXT,
      subjects TEXT,
      experience TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Subjects table
    CREATE TABLE IF NOT EXISTS subjects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      description TEXT
    );

    -- Quizzes table
    CREATE TABLE IF NOT EXISTS quizzes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      subject_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      class TEXT NOT NULL,
      difficulty_level TEXT CHECK(difficulty_level IN ('easy', 'medium', 'hard')),
      created_by INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(subject_id) REFERENCES subjects(id),
      FOREIGN KEY(created_by) REFERENCES teachers(id)
    );

    -- Questions table
    CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      quiz_id INTEGER NOT NULL,
      question_text TEXT NOT NULL,
      options TEXT NOT NULL,
      correct_answer TEXT NOT NULL,
      explanation TEXT,
      points INTEGER DEFAULT 10,
      FOREIGN KEY(quiz_id) REFERENCES quizzes(id)
    );

    -- Quiz results table
    CREATE TABLE IF NOT EXISTS quiz_results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL,
      quiz_id INTEGER NOT NULL,
      score INTEGER NOT NULL DEFAULT 0,
      coins_earned INTEGER DEFAULT 0,
      badge TEXT CHECK(badge IN ('bronze', 'silver', 'gold')),
      completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      answers TEXT,
      time_taken INTEGER DEFAULT 0,
      FOREIGN KEY(student_id) REFERENCES students(id),
      FOREIGN KEY(quiz_id) REFERENCES quizzes(id)
    );
  `);

  // Insert initial data
  await db.exec(`
    -- Insert subjects
    INSERT OR IGNORE INTO subjects (name, description) VALUES
    ('Mathematics', 'Learn core mathematical concepts and problem solving'),
    ('Science', 'Explore scientific principles and natural phenomena'),
    ('English', 'Develop language and communication skills'),
    ('Technology', 'Understanding modern technology and computing'),
    ('Engineering', 'Basic engineering concepts and principles');
  `);

  // Insert teacher
  await db.exec(`
    -- Insert a sample teacher
    INSERT OR IGNORE INTO teachers (name, email, password, school, subjects, experience)
    VALUES ('Demo Teacher', 'demo@teacher.com', 'password123', 'Demo School', 'Mathematics,Science', '5 years');
  `);

  // Insert quizzes
  await db.exec(`
    -- Insert sample quizzes for Class 6
    INSERT OR IGNORE INTO quizzes (subject_id, title, description, class, created_by, difficulty_level) VALUES
    (1, 'Basic Mathematics - Class 6', 'Fundamental math concepts for class 6', '6', 1, 'easy'),
    (1, 'Basic Algebra - Class 6', 'Introduction to algebra for class 6', '6', 1, 'easy'),
    (2, 'Basic Science - Class 6', 'Introduction to science for class 6', '6', 1, 'easy'),
    (2, 'Earth Science - Class 6', 'Learn about Earth and Space', '6', 1, 'easy'),
    (4, 'Introduction to Computers - Class 6', 'Basic computer concepts', '6', 1, 'easy'),
    (5, 'Simple Machines - Class 6', 'Learn about basic machines', '6', 1, 'easy');
  `);

  await db.exec(`
    -- Insert sample quizzes for Class 10
    INSERT OR IGNORE INTO quizzes (subject_id, title, description, class, created_by, difficulty_level) VALUES
    (1, 'Advanced Mathematics - Class 10', 'Advanced math concepts', '10', 1, 'medium'),
    (1, 'Advanced Algebra - Class 10', 'Complex algebraic concepts', '10', 1, 'medium'),
    (2, 'Physics - Class 10', 'Basic physics concepts', '10', 1, 'medium'),
    (2, 'Chemistry - Class 10', 'Introduction to chemistry', '10', 1, 'medium'),
    (4, 'Computer Science - Class 10', 'Programming basics', '10', 1, 'medium'),
    (5, 'Engineering Basics - Class 10', 'Basic engineering concepts', '10', 1, 'medium');
  `);

  console.log('Database initialized successfully');
  return db;
}

export { initializeDatabase };