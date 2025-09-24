-- Add Technology and Engineering subjects if they don't exist
INSERT OR IGNORE INTO subjects (name, description) VALUES
('Technology', 'Computer Science and Digital Skills'),
('Engineering', 'Engineering principles and problem-solving');

-- Create Technology Quizzes
INSERT INTO quizzes (subject_id, title, description, class, difficulty_level, created_by) VALUES
((SELECT id FROM subjects WHERE name = 'Technology'), 'Basic Programming', 'Introduction to programming concepts', '6', 'easy', 1),
((SELECT id FROM subjects WHERE name = 'Technology'), 'Web Development', 'Basics of web development and design', '6', 'medium', 1),
((SELECT id FROM subjects WHERE name = 'Technology'), 'Advanced Computing', 'Advanced computer science concepts', '6', 'hard', 1);

-- Create Engineering Quizzes
INSERT INTO quizzes (subject_id, title, description, class, difficulty_level, created_by) VALUES
((SELECT id FROM subjects WHERE name = 'Engineering'), 'Engineering Basics', 'Basic engineering concepts', '6', 'easy', 1),
((SELECT id FROM subjects WHERE name = 'Engineering'), 'Mechanical Design', 'Introduction to mechanical engineering', '6', 'medium', 1),
((SELECT id FROM subjects WHERE name = 'Engineering'), 'Advanced Engineering', 'Complex engineering principles', '6', 'hard', 1);