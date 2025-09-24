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
    -- Insert sample quizzes for Science Class 6 only
    INSERT OR IGNORE INTO quizzes (subject_id, title, description, class, created_by, difficulty_level) VALUES
    (2, 'Basic Science - Class 6', 'Introduction to science for class 6', '6', 1, 'easy');
  `);

  // Insert exactly 10 questions for Basic Science - Class 6
  await db.exec(`
    -- Questions for Basic Science - Class 6
    INSERT OR IGNORE INTO questions (quiz_id, question_text, options, correct_answer, explanation, points) VALUES
    (1, 'What is the basic unit of life?', '["Cell", "Atom", "Molecule", "Tissue"]', 'Cell', 'All living things are made up of cells, which are the basic units of life.', 10),
    
    (1, 'Which of these is a source of renewable energy?', '["Coal", "Solar Power", "Natural Gas", "Oil"]', 'Solar Power', 'Solar power is renewable as it comes from the sun, which is a continuous source of energy.', 10),
    
    (1, 'What is photosynthesis?', '["Plant growth", "Making food from sunlight", "Breathing process", "Water absorption"]', 'Making food from sunlight', 'Plants make their own food using sunlight through photosynthesis.', 10),
    
    (1, 'Which gas do plants absorb from the air?', '["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"]', 'Carbon Dioxide', 'Plants use carbon dioxide from the air for photosynthesis.', 10),
    
    (1, 'What is the main function of roots?', '["Photosynthesis", "Absorbing water", "Producing fruits", "Making leaves"]', 'Absorbing water', 'Roots absorb water and minerals from the soil for the plant.', 10),
    
    (1, 'What causes day and night?', '["Earth''s rotation", "Earth''s revolution", "The Sun''s movement", "The Moon''s phases"]', 'Earth''s rotation', 'The Earth rotates on its axis, causing day and night.', 10),
    
    (1, 'What is the Earth''s innermost layer?', '["Crust", "Mantle", "Core", "Atmosphere"]', 'Core', 'The Earth''s innermost layer is the core.', 10),
    
    (1, 'Which planet is known as the Red Planet?', '["Venus", "Mars", "Jupiter", "Saturn"]', 'Mars', 'Mars appears red due to iron oxide (rust) on its surface.', 10),
    
    (1, 'What causes the seasons?', '["Earth''s tilt", "Distance from Sun", "Moon''s gravity", "Ocean currents"]', 'Earth''s tilt', 'The Earth''s tilt causes seasons as it revolves around the Sun.', 10),
    
    (1, 'What is the main component of Earth''s atmosphere?', '["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"]', 'Nitrogen', 'Nitrogen makes up about 78% of Earth''s atmosphere.', 10)
  `);

  console.log('Database initialized successfully');
  return db;
}

export { initializeDatabase };