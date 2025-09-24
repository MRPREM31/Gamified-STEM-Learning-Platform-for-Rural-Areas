import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { initializeDatabase } from './database.js';

const app = express();
const PORT = process.env.PORT || 4000;
const HOST = '0.0.0.0'; // Listen on all network interfaces

// Enable CORS for all origins
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());

// SQLite3 setup
let db;

// API endpoints
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
    
    // First verify the subject exists
    const subject = await db.get('SELECT * FROM subjects WHERE id = ?', [subjectId]);
    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }

    // Get quizzes for the subject and class
    const quizzes = await db.all(
      `SELECT q.*, s.name as subject_name 
       FROM quizzes q
       JOIN subjects s ON q.subject_id = s.id
       WHERE q.subject_id = ? AND q.class = ?`,
      [subjectId, studentClass]
    );

    if (quizzes.length === 0) {
      return res.json([]);
    }

    res.json(quizzes);
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    res.status(500).json({ error: 'Failed to fetch quizzes' });
  }
});
(async () => {
  try {
    db = await initializeDatabase();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }

  // Create tables if not exist
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

    -- Insert initial subjects if they don't exist
    INSERT OR IGNORE INTO subjects (name, description) VALUES
    ('Mathematics', 'Learn core mathematical concepts and problem solving'),
    ('Science', 'Explore scientific principles and natural phenomena'),
    ('English', 'Develop language and communication skills'),
    ('Technology', 'Understanding modern technology and computing'),
    ('Engineering', 'Basic engineering concepts and principles');

    -- Insert a sample teacher if not exists
    INSERT OR IGNORE INTO teachers (name, email, password, school, subjects, experience)
    VALUES ('Demo Teacher', 'demo@teacher.com', 'password123', 'Demo School', 'Mathematics,Science', '5 years');

    -- Insert sample quizzes for Class 6
    INSERT OR IGNORE INTO quizzes (subject_id, title, description, class, created_by, difficulty_level) VALUES
    (1, 'Basic Mathematics - Class 6', 'Fundamental math concepts for class 6', '6', 1, 'easy'),
    (1, 'Basic Algebra - Class 6', 'Introduction to algebra for class 6', '6', 1, 'easy'),
    (2, 'Basic Science - Class 6', 'Introduction to science for class 6', '6', 1, 'easy'),
    (2, 'Earth Science - Class 6', 'Learn about Earth and Space', '6', 1, 'easy'),
    (4, 'Introduction to Computers - Class 6', 'Basic computer concepts', '6', 1, 'easy'),
    (5, 'Simple Machines - Class 6', 'Learn about basic machines', '6', 1, 'easy');

    -- Insert sample quizzes for Class 10
    INSERT OR IGNORE INTO quizzes (subject_id, title, description, class, created_by, difficulty_level) VALUES
    (1, 'Advanced Mathematics - Class 10', 'Advanced math concepts', '10', 1, 'medium'),
    (1, 'Advanced Algebra - Class 10', 'Complex algebraic concepts', '10', 1, 'medium'),
    (2, 'Physics - Class 10', 'Basic physics concepts', '10', 1, 'medium'),
    (2, 'Chemistry - Class 10', 'Introduction to chemistry', '10', 1, 'medium'),
    (4, 'Computer Science - Class 10', 'Programming basics', '10', 1, 'medium'),
    (5, 'Engineering Basics - Class 10', 'Basic engineering concepts', '10', 1, 'medium');

    -- Quizzes table
    CREATE TABLE IF NOT EXISTS quizzes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      subject_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      class TEXT NOT NULL,
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

    -- Insert sample data for testing
    INSERT OR IGNORE INTO teachers (name, email, password, school, subjects, experience) 
    VALUES (
      'Dr. Roni Kumar',
      'roni.kumar@eduquest.com',
      'teacher123',
      'EduQuest Academy',
      'Computer Science, Mathematics',
      '10+ years teaching experience in Computer Science and Mathematics'
    );

    -- Insert core subjects
    INSERT OR IGNORE INTO subjects (name, description) VALUES
    ('Science', 'Physics, Chemistry, Biology - Interactive MCQs'),
    ('Technology', 'Computer Science, Digital Skills - Interactive MCQs'),
    ('Engineering', 'Problem Solving, Design Thinking - Interactive MCQs'),
    ('Mathematics', 'Algebra, Geometry, Statistics - Interactive MCQs');

    -- Insert quizzes for each subject (for class 6)
    INSERT OR IGNORE INTO quizzes (subject_id, title, description, class, created_by) VALUES
    (1, 'Science Quiz', 'Test your knowledge in Physics, Chemistry, and Biology', '6', 1),
    (2, 'Technology Quiz', 'Test your knowledge in Computer Science and Digital Skills', '6', 1),
    (3, 'Engineering Quiz', 'Test your knowledge in Problem Solving and Design Thinking', '6', 1),
    (4, 'Mathematics Quiz', 'Test your knowledge in Algebra, Geometry, and Statistics', '6', 1);

    -- Insert Mathematics questions
    INSERT OR IGNORE INTO questions (quiz_id, question_text, options, correct_answer, explanation, points) VALUES
    (4, 'What is the formula for the area of a rectangle?', '["length × width", "length + width", "length ÷ width", "length - width"]', 'length × width', 'The area of a rectangle is calculated by multiplying its length by its width.', 10),
    (4, 'Solve for x: 2x + 5 = 15', '["5", "10", "8", "7"]', '5', 'Subtract 5 from both sides: 2x = 10, then divide by 2: x = 5', 10),
    (4, 'What is the sum of angles in a triangle?', '["90°", "180°", "270°", "360°"]', '180°', 'The sum of angles in a triangle is always 180 degrees.', 10),
    (4, 'What is 20% of 50?', '["5", "10", "15", "20"]', '10', 'To find 20% of 50: (20/100) × 50 = 10', 10),
    (4, 'What is the perimeter of a square with side 5 units?', '["20", "25", "15", "10"]', '20', 'Perimeter of a square = 4 × side length = 4 × 5 = 20', 10);

    -- Insert Science questions
    INSERT OR IGNORE INTO questions (quiz_id, question_text, options, correct_answer, explanation, points) VALUES
    (1, 'What is the unit of force?', '["Meter", "Newton", "Joule", "Watt"]', 'Newton', 'Newton (N) is the SI unit of force.', 10),
    (1, 'Which organelle is known as the powerhouse of the cell?', '["Nucleus", "Mitochondria", "Ribosome", "Golgi Body"]', 'Mitochondria', 'Mitochondria produces energy for the cell through cellular respiration.', 10),
    (1, 'What is the chemical formula for water?', '["NaCl", "H2O", "CO2", "O2"]', 'H2O', 'Water is made up of two hydrogen atoms and one oxygen atom.', 10),
    (1, 'What planet is known as the Red Planet?', '["Earth", "Mars", "Jupiter", "Venus"]', 'Mars', 'Mars appears red due to iron oxide (rust) on its surface.', 10),
    (1, 'What process do plants use to make their food?', '["Respiration", "Photosynthesis", "Digestion", "Absorption"]', 'Photosynthesis', 'Plants make their food through photosynthesis using sunlight, water, and carbon dioxide.', 10);

    -- Insert Technology questions
    INSERT OR IGNORE INTO questions (quiz_id, question_text, options, correct_answer, explanation, points) VALUES
    (2, 'What does CPU stand for?', '["Central Processing Unit", "Computer Personal Unit", "Central Program Utility", "Computer Processing Unit"]', 'Central Processing Unit', 'CPU is the brain of the computer that processes instructions.', 10),
    (2, 'Which is a programming language?', '["Microsoft", "Python", "Firefox", "Router"]', 'Python', 'Python is a popular programming language used for software development.', 10),
    (2, 'What is RAM used for?', '["Permanent Storage", "Temporary Storage", "Processing Data", "Displaying Graphics"]', 'Temporary Storage', 'RAM provides fast temporary storage for data that the CPU needs quickly.', 10),
    (2, 'What does URL stand for?', '["Universal Resource Locator", "Unified Resource Link", "Universal Reference Link", "Unified Resource Locator"]', 'Universal Resource Locator', 'URL is the address of a webpage on the internet.', 10),
    (2, 'Which file extension is used for Python files?', '[".exe", ".py", ".doc", ".html"]', '.py', 'Python files use the .py extension to identify them as Python source code.', 10);

    -- Insert Engineering questions
    INSERT OR IGNORE INTO questions (quiz_id, question_text, options, correct_answer, explanation, points) VALUES
    (3, 'What is the first step in the engineering design process?', '["Build a Prototype", "Identify the Problem", "Test the Solution", "Evaluate Results"]', 'Identify the Problem', 'The engineering design process starts with identifying and understanding the problem to be solved.', 10),
    (3, 'Which tool is used for measuring angles?', '["Ruler", "Protractor", "Scale", "Compass"]', 'Protractor', 'A protractor is specifically designed for measuring angles.', 10),
    (3, 'What is brainstorming used for?', '["Testing Solutions", "Generating Ideas", "Building Models", "Writing Reports"]', 'Generating Ideas', 'Brainstorming is a creative process used to generate multiple ideas and solutions.', 10),
    (3, 'Which shape is most stable for building structures?', '["Circle", "Triangle", "Square", "Rectangle"]', 'Triangle', 'Triangles are the most stable shape because they cannot be deformed without changing the length of their sides.', 10),
    (3, 'What does CAD stand for?', '["Computer Aided Design", "Computer Art Design", "Computed Auto Draw", "Creative Art Design"]', 'Computer Aided Design', 'CAD software helps engineers and designers create precise technical drawings.', 10);

    -- Science Quiz Questions (Physics, Chemistry, Biology)
    INSERT OR IGNORE INTO questions (quiz_id, question_text, options, correct_answer, points) VALUES
    (1, 'What is the unit of force?', '["Meter", "Newton", "Joule", "Watt"]', 1, 10),
    (1, 'Which organelle is known as the powerhouse of the cell?', '["Nucleus", "Mitochondria", "Ribosome", "Golgi Body"]', 1, 10),
    (1, 'What is the chemical formula for table salt?', '["NaCl", "H2O", "CO2", "O2"]', 0, 10),
    (1, 'Which of these is a vector quantity?', '["Temperature", "Velocity", "Mass", "Time"]', 1, 10),
    (1, 'What is the pH value of a neutral solution?', '["0", "7", "14", "1"]', 1, 10),
    (1, 'Which blood vessels carry blood away from the heart?', '["Arteries", "Veins", "Capillaries", "Vessels"]', 0, 10),
    (1, 'What is the process of converting water vapor to liquid?', '["Evaporation", "Condensation", "Sublimation", "Freezing"]', 1, 10),
    (1, 'Which element has the atomic number 1?', '["Helium", "Hydrogen", "Carbon", "Oxygen"]', 1, 10),
    (1, 'What is the SI unit of electric current?', '["Volt", "Watt", "Ampere", "Ohm"]', 2, 10),
    (1, 'Which part of the plant conducts photosynthesis?', '["Root", "Stem", "Leaves", "Flower"]', 2, 10);

    -- Technology Quiz Questions (Computer Science, Digital Skills)
    INSERT OR IGNORE INTO questions (quiz_id, question_text, options, correct_answer, points) VALUES
    (2, 'What does CPU stand for?', '["Central Processing Unit", "Computer Personal Unit", "Central Program Utility", "Computer Processing Unit"]', 0, 10),
    (2, 'Which of these is a programming language?', '["Microsoft", "Python", "Firefox", "Router"]', 1, 10),
    (2, 'What is the main function of RAM?', '["Permanent Storage", "Temporary Storage", "Processing Data", "Displaying Graphics"]', 1, 10),
    (2, 'What does URL stand for?', '["Universal Resource Locator", "Unified Resource Link", "Universal Reference Link", "Unified Resource Locator"]', 0, 10),
    (2, 'Which device is used for taking input through hand?', '["Monitor", "Printer", "Mouse", "Speaker"]', 2, 10),
    (2, 'What is the standard port number for HTTP?', '["80", "443", "21", "25"]', 0, 10),
    (2, 'Which file extension is used for Python files?', '[".exe", ".py", ".doc", ".html"]', 1, 10),
    (2, 'What does HTML stand for?', '["Hyper Text Markup Language", "High Tech Modern Language", "Hyper Transfer Markup Language", "High Text Modern Link"]', 0, 10),
    (2, 'Which of these is a web browser?', '["Word", "Excel", "Chrome", "PowerPoint"]', 2, 10),
    (2, 'What is the function of an operating system?', '["Play Games", "Manage Hardware and Software", "Send Emails", "Create Documents"]', 1, 10);

    -- Engineering Quiz Questions (Problem Solving, Design Thinking)
    INSERT OR IGNORE INTO questions (quiz_id, question_text, options, correct_answer, points) VALUES
    (3, 'What is the first step in the engineering design process?', '["Build a Prototype", "Identify the Problem", "Test the Solution", "Evaluate Results"]', 1, 10),
    (3, 'Which tool is used for measuring angles?', '["Ruler", "Protractor", "Scale", "Compass"]', 1, 10),
    (3, 'What is brainstorming used for?', '["Testing Solutions", "Generating Ideas", "Building Models", "Writing Reports"]', 1, 10),
    (3, 'Which material is strongest in tension?', '["Wood", "Steel", "Glass", "Plastic"]', 1, 10),
    (3, 'What is the purpose of a blueprint?', '["Color Design", "Detailed Plan", "Cost Estimate", "Time Schedule"]', 1, 10),
    (3, 'Which shape is most stable for building structures?', '["Circle", "Triangle", "Square", "Rectangle"]', 1, 10),
    (3, 'What is the main purpose of a prototype?', '["Final Product", "Testing Ideas", "Sales Demo", "Documentation"]', 1, 10),
    (3, 'Which renewable energy source uses wind?', '["Solar Panels", "Wind Turbines", "Batteries", "Fuel Cells"]', 1, 10),
    (3, 'What does CAD stand for?', '["Computer Aided Design", "Computer Art Design", "Computed Auto Draw", "Creative Art Design"]', 0, 10),
    (3, 'Which factor is most important in bridge design?', '["Color", "Safety", "Cost", "Speed"]', 1, 10);

    -- Mathematics Quiz Questions (Algebra, Geometry, Statistics)
    INSERT OR IGNORE INTO questions (quiz_id, question_text, options, correct_answer, points) VALUES
    (4, 'What is the formula for the area of a rectangle?', '["length × width", "length + width", "length ÷ width", "length - width"]', 0, 10),
    (4, 'Solve for x: 2x + 5 = 15', '["5", "10", "8", "7"]', 0, 10),
    (4, 'What is the sum of angles in a triangle?', '["90°", "180°", "270°", "360°"]', 1, 10),
    (4, 'What is the mean of 2, 4, 6, 8, 10?', '["4", "5", "6", "8"]', 2, 10),
    (4, 'Which is the formula for Pythagorean theorem?', '["a+b=c", "a²+b²=c²", "a×b=c", "a-b=c"]', 1, 10),
    (4, 'What is 20% of 50?', '["5", "10", "15", "20"]', 1, 10),
    (4, 'How many faces does a cube have?', '["4", "6", "8", "12"]', 1, 10),
    (4, 'What is the next number in the sequence: 2, 4, 8, 16...?', '["24", "32", "20", "28"]', 1, 10),
    (4, 'What is the mode in: 2, 3, 3, 4, 5, 3?', '["2", "3", "4", "5"]', 1, 10),
    (4, 'What is the perimeter of a square with side 5 units?', '["20", "25", "15", "10"]', 0, 10);
  `);

  // Register endpoints only after DB is ready
  app.get('/', (req, res) => {
    res.send('Backend API running');
  });

  // --- TEACHER ENDPOINTS ---
  app.get('/api/teachers', async (req, res) => {
    try {
      const teachers = await db.all(
        'SELECT id, name, email, school, subjects, experience FROM teachers'
      );
      res.json(teachers);
    } catch (err) {
      console.error('Error fetching teachers:', err);
      res.status(500).json({ error: 'Failed to fetch teachers' });
    }
  });

  app.get('/api/teachers/:id', async (req, res) => {
    try {
      const teacher = await db.get(
        'SELECT id, name, email, school, subjects, experience FROM teachers WHERE id = ?',
        [req.params.id]
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
    const { name, email, password, type, school, class: userClass, dob, subjects, experience } = req.body;
    
    // Validate required fields
    if (!name || !email || !password || !type || !school) {
      console.error('Missing required field:', { name, email, password, type, school });
      return res.status(400).json({ error: 'Missing required field' });
    }

    try {
      // Check if email already exists
      const existingStudent = await db.get('SELECT email FROM students WHERE email = ?', [email]);
      const existingTeacher = await db.get('SELECT email FROM teachers WHERE email = ?', [email]);
      
      if (existingStudent || existingTeacher) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      let result;
      if (type === 'student') {
        // Additional validation for student
        if (!userClass || !dob) {
          return res.status(400).json({ error: 'Missing required student fields' });
        }
        
        result = await db.run(
          'INSERT INTO students (name, email, password, school, class, dob) VALUES (?, ?, ?, ?, ?, ?)',
          [name, email, password, school, userClass, dob]
        );
      } else if (type === 'teacher') {
        // Additional validation for teacher
        if (!subjects) {
          return res.status(400).json({ error: 'Missing required teacher fields' });
        }

        result = await db.run(
          'INSERT INTO teachers (name, email, password, school, subjects, experience) VALUES (?, ?, ?, ?, ?, ?)',
          [name, email, password, school, subjects, experience || '']
        );
      } else {
        return res.status(400).json({ error: 'Invalid user type' });
      }

      // Return user data without password
      res.status(201).json({
        id: result.lastID,
        name,
        email,
        type,
        school,
        ...(type === 'student' ? { class: userClass, dob } : { subjects, experience })
      });
    } catch (err) {
      console.error('Registration error:', err);
      res.status(500).json({ error: 'Registration failed', details: err.message });
    }
  });

  app.post('/api/login', async (req, res) => {
    const { email, password, type } = req.body;
    
    if (!email || !password || !type) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      let user;
      if (type === 'student') {
        user = await db.get(
          'SELECT id, name, email, school, class, dob FROM students WHERE email = ? AND password = ?',
          [email, password]
        );
      } else if (type === 'teacher') {
        user = await db.get(
          'SELECT id, name, email, school, subjects, experience FROM teachers WHERE email = ? AND password = ?',
          [email, password]
        );
      } else {
        return res.status(400).json({ error: 'Invalid user type' });
      }

      if (user) {
        res.json({ ...user, type });
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
      }
    } catch (err) {
      console.error('Login error:', err);
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
  app.get('/api/quizzes/subject/:subject/class/:class', async (req, res) => {
    try {
      const subject = req.params.subject.toLowerCase();
      const classLevel = req.params.class;
      
      // First get the subject ID
      const subjectData = await db.get(
        'SELECT id FROM subjects WHERE LOWER(name) = ?',
        [subject]
      );

      if (!subjectData) {
        return res.status(404).json({ error: 'Subject not found' });
      }

      // Get quizzes for this subject and class
      const quizzes = await db.all(`
        SELECT 
          q.id,
          q.subject_id,
          q.title,
          q.description,
          q.class,
          s.name as subject,
          s.description as subject_description,
          COUNT(qs.id) as question_count,
          SUM(qs.points) as total_points
        FROM quizzes q
        JOIN subjects s ON q.subject_id = s.id
        LEFT JOIN questions qs ON q.id = qs.quiz_id
        WHERE q.subject_id = ? AND q.class = ?
        GROUP BY q.id
      `, [subjectData.id, classLevel]);

      console.log(`Found ${quizzes.length} quizzes for subject: ${subject}, class: ${classLevel}`);
      res.json(quizzes);
    } catch (err) {
      console.error('Failed to fetch quizzes:', err);
      res.status(500).json({ error: 'Failed to fetch quizzes', details: err.message });
    }
  });

  app.get('/api/quizzes/:quizId/questions', async (req, res) => {
    try {
      // First check if quiz exists
      const quiz = await db.get(`
        SELECT 
          q.*,
          s.name as subject_name,
          s.description as subject_description
        FROM quizzes q
        JOIN subjects s ON q.subject_id = s.id
        WHERE q.id = ?
      `, [req.params.quizId]);
      
      if (!quiz) {
        console.error('Quiz not found:', req.params.quizId);
        return res.status(404).json({ error: 'Quiz not found' });
      }

      // Get all questions for this quiz
      const questions = await db.all(`
        SELECT 
          id,
          question_text as question,
          options,
          correct_answer,
          points
        FROM questions 
        WHERE quiz_id = ?
        LIMIT 10
      `, [req.params.quizId]);

      // Parse the options JSON string for each question
      const formattedQuestions = questions.map(q => ({
        ...q,
        options: JSON.parse(q.options)
      }));

      console.log(`Found ${questions.length} questions for quiz ${req.params.quizId}`);
      res.json(formattedQuestions);
    } catch (err) {
      console.error('Failed to fetch questions:', err);
      res.status(500).json({ error: 'Failed to fetch questions', details: err.message });
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
  // Submit quiz answers and get results
  app.post('/api/quizzes/:quizId/submit', async (req, res) => {
    const { studentId, answers, timeTaken } = req.body;
    
    try {
      // Get quiz and questions
      const quiz = await db.get(`
        SELECT q.*, COUNT(qs.id) as total_questions, SUM(qs.points) as total_points
        FROM quizzes q
        LEFT JOIN questions qs ON q.id = qs.quiz_id
        WHERE q.id = ?
        GROUP BY q.id
      `, [req.params.quizId]);

      if (!quiz) {
        return res.status(404).json({ error: 'Quiz not found' });
      }

      // Get all questions with correct answers
      const questions = await db.all(`
        SELECT id, correct_answer, points
        FROM questions 
        WHERE quiz_id = ?
      `, [req.params.quizId]);

      // Calculate score and coins
      let score = 0;
      const answersArray = JSON.parse(answers);
      questions.forEach((q, index) => {
        if (answersArray[index] === q.correct_answer) {
          score += q.points;
        }
      });

      // Calculate percentage
      const percentage = (score / quiz.total_points) * 100;

      // Determine badge based on percentage
      let badge = null;
      const coins = Math.floor(score / 2); // 5 coins per 10 points

      if (percentage >= 90) {
        badge = 'gold';
      } else if (percentage >= 75) {
        badge = 'silver';
      } else if (percentage >= 60) {
        badge = 'bronze';
      }

      // Save results
      const result = await db.run(
        `INSERT INTO quiz_results 
         (student_id, quiz_id, score, coins_earned, badge, answers, time_taken) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [studentId, req.params.quizId, score, coins, badge, answers, timeTaken]
      );

      // Update student stats
      await db.run(`
        UPDATE students 
        SET 
          total_coins = total_coins + ?,
          total_badges = total_badges + ?,
          xp_points = xp_points + ?,
          quizzes_completed = quizzes_completed + 1
        WHERE id = ?
      `, [coins, badge ? 1 : 0, score, studentId]);

      // Return results
      res.json({
        quiz_id: req.params.quizId,
        score,
        total_points: quiz.total_points,
        percentage,
        coins_earned: coins,
        badge,
        time_taken: timeTaken
      });
    } catch (err) {
      console.error('Failed to submit quiz:', err);
      res.status(500).json({ error: 'Failed to submit quiz', details: err.message });
    }
  });

  // Get student's quiz results and progress
  app.get('/api/students/:studentId/results', async (req, res) => {
    try {
      // Get student's overall stats
      const student = await db.get(`
        SELECT 
          id,
          name,
          total_coins,
          total_badges,
          xp_points,
          quizzes_completed
        FROM students 
        WHERE id = ?
      `, [req.params.studentId]);

      if (!student) {
        return res.status(404).json({ error: 'Student not found' });
      }

      // Get all quiz results with quiz and subject details
      const results = await db.all(`
        SELECT 
          qr.id,
          qr.quiz_id,
          qr.score,
          qr.coins_earned,
          qr.badge,
          qr.completed_at,
          qr.time_taken,
          q.title as quiz_title,
          q.class as quiz_class,
          s.name as subject_name,
          s.description as subject_description
        FROM quiz_results qr
        LEFT JOIN quizzes q ON qr.quiz_id = q.id
        LEFT JOIN subjects s ON q.subject_id = s.id
        WHERE qr.student_id = ?
        ORDER BY qr.completed_at DESC
      `, [req.params.studentId]);

      // Get subject-wise performance
      const subjectStats = await db.all(`
        SELECT 
          s.name as subject,
          COUNT(DISTINCT qr.quiz_id) as quizzes_taken,
          SUM(qr.score) as total_score,
          SUM(qr.coins_earned) as total_coins,
          COUNT(CASE WHEN qr.badge IS NOT NULL THEN 1 END) as badges_earned
        FROM quiz_results qr
        JOIN quizzes q ON qr.quiz_id = q.id
        JOIN subjects s ON q.subject_id = s.id
        WHERE qr.student_id = ?
        GROUP BY s.id
      `, [req.params.studentId]);

      // Return combined stats
      res.json({
        student: {
          id: student.id,
          name: student.name,
          total_coins: student.total_coins,
          total_badges: student.total_badges,
          xp_points: student.xp_points,
          quizzes_completed: student.quizzes_completed
        },
        quiz_results: results || [],
        subject_stats: subjectStats || [],
        summary: {
          total_quizzes: results.length,
          total_coins: student.total_coins,
          total_badges: student.total_badges,
          total_xp: student.xp_points,
          subjects_attempted: subjectStats.length
        }
      });
    } catch (err) {
      console.error('Error fetching student results:', err);
      res.status(500).json({ error: 'Failed to fetch results', details: err.message });
    }
  });

  app.listen(PORT, HOST, () => {
    console.log(`Backend server running on http://${HOST}:${PORT}`);
    console.log('Access the server locally via:');
    console.log(`1. http://localhost:${PORT}`);
    console.log(`2. http://192.168.1.4:${PORT}`);
  });
})();

// Placeholder for endpoints
// TODO: Add auth, quiz, user endpoints


