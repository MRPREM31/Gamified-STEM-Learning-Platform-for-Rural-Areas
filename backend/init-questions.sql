-- Create quizzes table
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

-- Create questions table
CREATE TABLE IF NOT EXISTS questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    quiz_id INTEGER NOT NULL,
    question_text TEXT NOT NULL,
    options TEXT NOT NULL,  -- JSON array of options
    correct_answer TEXT NOT NULL,
    difficulty_level TEXT CHECK(difficulty_level IN ('easy', 'medium', 'hard')),
    points INTEGER DEFAULT 1,
    explanation TEXT,
    FOREIGN KEY(quiz_id) REFERENCES quizzes(id)
);

-- Insert Mathematics Quizzes
INSERT INTO quizzes (subject_id, title, description, class, difficulty_level, created_by) VALUES
(1, 'Basic Arithmetic', 'Fundamental arithmetic operations', '6', 'easy', 1),
(1, 'Algebra Basics', 'Introduction to algebraic expressions', '6', 'medium', 1),
(1, 'Advanced Mathematics', 'Complex mathematical concepts', '6', 'hard', 1);

-- Insert Mathematics Questions (Easy)
INSERT INTO questions (quiz_id, question_text, options, correct_answer, difficulty_level, points, explanation) VALUES
(1, 'What is 15 + 7?', '["20", "22", "21", "23"]', '22', 'easy', 1, 'Simple addition: 15 + 7 = 22'),
(1, 'What is 25 - 8?', '["17", "16", "18", "15"]', '17', 'easy', 1, 'Basic subtraction: 25 - 8 = 17'),
(1, 'What is 4 × 6?', '["22", "24", "26", "28"]', '24', 'easy', 1, 'Multiplication: 4 × 6 = 24');

-- Insert Mathematics Questions (Medium)
INSERT INTO questions (quiz_id, question_text, options, correct_answer, difficulty_level, points, explanation) VALUES
(2, 'Solve: 2x + 3 = 11', '["x = 4", "x = 5", "x = 6", "x = 7"]', 'x = 4', 'medium', 2, 'Subtract 3 from both sides: 2x = 8, then divide by 2: x = 4'),
(2, 'What is the value of y in: y/3 = 6?', '["y = 18", "y = 15", "y = 12", "y = 9"]', 'y = 18', 'medium', 2, 'Multiply both sides by 3: y = 6 × 3 = 18'),
(2, 'Simplify: 2(x + 3) + 4', '["2x + 10", "2x + 7", "2x + 6", "2x + 5"]', '2x + 10', 'medium', 2, 'First distribute 2: 2x + 6, then add 4: 2x + 10');

-- Insert Mathematics Questions (Hard)
INSERT INTO questions (quiz_id, question_text, options, correct_answer, difficulty_level, points, explanation) VALUES
(3, 'Solve the quadratic equation: x² - 5x + 6 = 0', '["x = 2 or x = 3", "x = 1 or x = 4", "x = -2 or x = 3", "x = 2 or x = -3"]', 'x = 2 or x = 3', 'hard', 3, 'Using factoring: (x-2)(x-3)=0, so x=2 or x=3'),
(3, 'Find the derivative of f(x) = x³ + 2x² - 4x', '["3x² + 4x - 4", "3x² + 4x", "3x² + 2x - 4", "3x + 4"]', '3x² + 4x - 4', 'hard', 3, 'Power rule: derivative of x³ is 3x², of 2x² is 4x, of -4x is -4'),
(3, 'If log₂(x) = 3, what is x?', '["6", "8", "16", "4"]', '8', 'hard', 3, '2³ = 8, so x = 8');

-- Insert Science Quizzes
INSERT INTO quizzes (subject_id, title, description, class, difficulty_level, created_by) VALUES
(2, 'Basic Science', 'Introduction to scientific concepts', '6', 'easy', 1),
(2, 'Physics Fundamentals', 'Basic physics concepts', '6', 'medium', 1),
(2, 'Advanced Science', 'Complex scientific principles', '6', 'hard', 1);

-- Insert Science Questions (Easy)
INSERT INTO questions (quiz_id, question_text, options, correct_answer, difficulty_level, points, explanation) VALUES
(4, 'What is the closest planet to the Sun?', '["Venus", "Mercury", "Mars", "Earth"]', 'Mercury', 'easy', 1, 'Mercury is the first planet from the Sun'),
(4, 'What is the basic unit of life?', '["Atom", "Cell", "Molecule", "Tissue"]', 'Cell', 'easy', 1, 'Cells are the basic structural and functional units of all living organisms'),
(4, 'What gas do plants absorb from the air?', '["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"]', 'Carbon Dioxide', 'easy', 1, 'Plants use carbon dioxide for photosynthesis');

-- Insert Science Questions (Medium)
INSERT INTO questions (quiz_id, question_text, options, correct_answer, difficulty_level, points, explanation) VALUES
(5, 'What is the formula for the speed of an object?', '["distance × time", "distance ÷ time", "time ÷ distance", "time × distance"]', 'distance ÷ time', 'medium', 2, 'Speed is calculated by dividing the distance traveled by the time taken'),
(5, 'What is the process by which plants make their own food?', '["Respiration", "Photosynthesis", "Digestion", "Absorption"]', 'Photosynthesis', 'medium', 2, 'Photosynthesis is the process where plants convert light energy into chemical energy'),
(5, 'What is the main function of white blood cells?', '["Transport oxygen", "Fight infection", "Carry nutrients", "Clot blood"]', 'Fight infection', 'medium', 2, 'White blood cells are part of the immune system and help fight infections');

-- Insert Science Questions (Hard)
INSERT INTO questions (quiz_id, question_text, options, correct_answer, difficulty_level, points, explanation) VALUES
(6, 'What is the acceleration due to gravity on Earth (in m/s²)?', '["8.8", "9.8", "10.8", "11.8"]', '9.8', 'hard', 3, 'The acceleration due to gravity on Earth is approximately 9.8 m/s²'),
(6, 'What is the chemical formula for glucose?', '["C6H12O6", "C6H6O6", "C12H22O11", "C6H10O5"]', 'C6H12O6', 'hard', 3, 'Glucose is a monosaccharide with the molecular formula C6H12O6'),
(6, 'What is the principle behind nuclear fusion?', '["Splitting atoms", "Combining light atoms", "Electron transfer", "Isotope decay"]', 'Combining light atoms', 'hard', 3, 'Nuclear fusion involves combining light atomic nuclei to form heavier nuclei, releasing energy');