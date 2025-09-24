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
    -- Clear existing tables
    DROP TABLE IF EXISTS questions;
    DROP TABLE IF EXISTS quizzes;
    DROP TABLE IF EXISTS subjects;
    DROP TABLE IF EXISTS teachers;
    DROP TABLE IF EXISTS students;

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

    -- Quizzes table with unique title constraint
    CREATE TABLE IF NOT EXISTS quizzes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      subject_id INTEGER NOT NULL,
      title TEXT NOT NULL UNIQUE,
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
  `);

  // Insert initial data
  await db.exec(`
    -- Insert science subject
    INSERT INTO subjects (id, name, description) VALUES
    (2, 'Science', 'Learn about natural phenomena and scientific concepts');

    -- Insert demo teacher
    INSERT INTO teachers (id, name, email, password, school, subjects, experience) VALUES
    (1, 'Demo Teacher', 'demo@teacher.com', 'password123', 'Demo School', 'Science', '5 years');

    -- Insert science quizzes with different difficulty levels
    INSERT INTO quizzes (subject_id, title, description, class, created_by, difficulty_level) VALUES
    (2, 'Basic Science - Class 6', 'Fundamental science concepts', '6', 1, 'easy'),
    (2, 'Earth Science - Class 6', 'Learn about Earth and Space', '6', 1, 'medium'),
    (2, 'Life Science - Class 6', 'Biology and living things', '6', 1, 'hard');
  `);

  // Insert questions for Basic Science (Easy)
  await db.exec(`
    INSERT INTO questions (quiz_id, question_text, options, correct_answer, explanation, points) VALUES
    (1, 'What is the basic unit of life?', '["Cell", "Atom", "Molecule", "Tissue"]', 'Cell', 'All living things are made up of cells', 10),
    (1, 'Which of these is a renewable energy source?', '["Coal", "Solar Power", "Natural Gas", "Oil"]', 'Solar Power', 'Solar power is renewable as it comes from the sun', 10),
    (1, 'What is photosynthesis?', '["Plant growth", "Making food from sunlight", "Breathing", "Water absorption"]', 'Making food from sunlight', 'Plants make their food using sunlight', 10),
    (1, 'Which gas do plants absorb from air?', '["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"]', 'Carbon Dioxide', 'Plants use CO2 for photosynthesis', 10),
    (1, 'What is the main function of roots?', '["Photosynthesis", "Absorbing water", "Making fruits", "Making leaves"]', 'Absorbing water', 'Roots absorb water and minerals', 10),
    (1, 'What type of energy is stored in food?', '["Kinetic", "Chemical", "Heat", "Light"]', 'Chemical', 'Food contains stored chemical energy', 10),
    (1, 'Which of these is a living thing?', '["Rock", "Water", "Plant", "Air"]', 'Plant', 'Plants are living organisms', 10),
    (1, 'What do plants need to grow?', '["Only water", "Only sunlight", "Only air", "Water, air, and sunlight"]', 'Water, air, and sunlight', 'Plants need multiple things to grow', 10),
    (1, 'Which sense organ helps us see?', '["Ears", "Eyes", "Nose", "Tongue"]', 'Eyes', 'Eyes are organs for vision', 10),
    (1, 'What do animals need to survive?', '["Only food", "Only water", "Only air", "Food, water, and air"]', 'Food, water, and air', 'Animals need multiple things to survive', 10)
  `);

  // Insert questions for Earth Science (Medium)
  await db.exec(`
    INSERT INTO questions (quiz_id, question_text, options, correct_answer, explanation, points) VALUES
    (2, 'What causes day and night?', '["Earth''s rotation", "Earth''s revolution", "Sun''s movement", "Moon''s phases"]', 'Earth''s rotation', 'Earth rotates on its axis every 24 hours', 10),
    (2, 'What is the Earth''s innermost layer?', '["Crust", "Mantle", "Core", "Atmosphere"]', 'Core', 'The core is the centermost layer', 10),
    (2, 'Which planet is known as the Red Planet?', '["Venus", "Mars", "Jupiter", "Saturn"]', 'Mars', 'Mars appears red due to iron oxide', 10),
    (2, 'What causes the seasons?', '["Earth''s tilt", "Distance from Sun", "Moon", "Ocean currents"]', 'Earth''s tilt', 'Earth''s tilt causes seasonal changes', 10),
    (2, 'What is the main component of Earth''s atmosphere?', '["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"]', 'Nitrogen', 'Nitrogen makes up about 78% of atmosphere', 10),
    (2, 'What type of rock is formed by lava cooling?', '["Sedimentary", "Igneous", "Metamorphic", "Crystal"]', 'Igneous', 'Igneous rocks form from cooled magma/lava', 10),
    (2, 'Which layer of Earth do we live on?', '["Core", "Mantle", "Crust", "Inner core"]', 'Crust', 'The crust is Earth''s outermost layer', 10),
    (2, 'What causes ocean tides?', '["Sun", "Wind", "Moon''s gravity", "Earth''s rotation"]', 'Moon''s gravity', 'Moon''s gravitational pull causes tides', 10),
    (2, 'What is the closest planet to the Sun?', '["Earth", "Venus", "Mars", "Mercury"]', 'Mercury', 'Mercury is the first planet from the Sun', 10),
    (2, 'What causes earthquakes?', '["Wind", "Rain", "Tectonic plates", "Temperature"]', 'Tectonic plates', 'Movement of tectonic plates causes earthquakes', 10)
  `);

  // Insert questions for Life Science (Hard)
  await db.exec(`
    INSERT INTO questions (quiz_id, question_text, options, correct_answer, explanation, points) VALUES
    (3, 'What is the function of white blood cells?', '["Carry oxygen", "Fight infection", "Digest food", "Produce energy"]', 'Fight infection', 'White blood cells are part of immune system', 10),
    (3, 'Which organ is part of the digestive system?', '["Heart", "Lungs", "Stomach", "Brain"]', 'Stomach', 'Stomach helps digest food', 10),
    (3, 'What is the main function of the heart?', '["Thinking", "Breathing", "Pumping blood", "Digesting food"]', 'Pumping blood', 'Heart pumps blood throughout body', 10),
    (3, 'What are chromosomes made of?', '["Proteins", "Fats", "DNA", "Sugar"]', 'DNA', 'Chromosomes contain genetic material DNA', 10),
    (3, 'Which system controls body movements?', '["Digestive", "Nervous", "Respiratory", "Circulatory"]', 'Nervous', 'Nervous system controls movements', 10),
    (3, 'What is the role of chlorophyll in plants?', '["Store water", "Absorb sunlight", "Support stem", "Produce seeds"]', 'Absorb sunlight', 'Chlorophyll captures light for photosynthesis', 10),
    (3, 'What is cellular respiration?', '["Making food", "Using oxygen for energy", "Growing", "Division"]', 'Using oxygen for energy', 'Cells use oxygen to produce energy', 10),
    (3, 'What protects our body from diseases?', '["Bones", "Muscles", "Immune system", "Skin only"]', 'Immune system', 'Immune system fights off infections', 10),
    (3, 'What is the function of red blood cells?', '["Fight infection", "Carry oxygen", "Digest food", "Filter blood"]', 'Carry oxygen', 'Red blood cells transport oxygen', 10),
    (3, 'Which organ filters blood in our body?', '["Heart", "Lungs", "Kidneys", "Stomach"]', 'Kidneys', 'Kidneys filter waste from blood', 10)
  `);

  console.log('Database initialized successfully');

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