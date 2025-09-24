-- Mathematics Questions (Quiz ID: 1 - Basic Arithmetic)
INSERT INTO questions (quiz_id, question_text, options, correct_answer, difficulty_level, points, explanation) VALUES
(1, 'What is the result of 125 + 75?', '["175", "200", "150", "225"]', '200', 'easy', 1, 'Basic addition: 125 + 75 = 200'),
(1, 'Calculate 45 × 5', '["205", "225", "235", "245"]', '225', 'easy', 1, 'Multiplication: 45 × 5 = 225'),
(1, 'What is 500 - 175?', '["325", "375", "275", "425"]', '325', 'easy', 1, 'Subtraction: 500 - 175 = 325'),
(1, 'Solve: 144 ÷ 12', '["12", "14", "16", "18"]', '12', 'easy', 1, 'Division: 144 ÷ 12 = 12'),
(1, 'What is 15% of 200?', '["30", "25", "35", "40"]', '30', 'easy', 1, 'Percentage calculation: 15% of 200 = (15/100) × 200 = 30'),
(1, 'Round 3.678 to the nearest tenth', '["3.6", "3.7", "3.68", "3.67"]', '3.7', 'easy', 1, 'When rounding to the nearest tenth, look at the hundredths digit. If it''s 5 or greater, round up.'),
(1, 'What is the square of 9?', '["72", "81", "90", "99"]', '81', 'easy', 1, 'Square means multiply the number by itself: 9 × 9 = 81'),
(1, 'Find the missing number: 15, 20, 25, __, 35', '["28", "29", "30", "31"]', '30', 'easy', 1, 'This is an arithmetic sequence with a common difference of 5'),
(1, 'What is the sum of angles in a triangle?', '["90°", "180°", "270°", "360°"]', '180°', 'easy', 1, 'The sum of angles in any triangle is always 180 degrees'),
(1, 'Convert 3/4 to a decimal', '["0.75", "0.70", "0.80", "0.85"]', '0.75', 'easy', 1, 'To convert a fraction to decimal, divide numerator by denominator: 3 ÷ 4 = 0.75');

-- Mathematics Questions (Quiz ID: 2 - Algebra Basics)
INSERT INTO questions (quiz_id, question_text, options, correct_answer, difficulty_level, points, explanation) VALUES
(2, 'Solve: 2x + 3 = 11', '["x = 4", "x = 5", "x = 6", "x = 7"]', 'x = 4', 'medium', 2, 'Subtract 3 from both sides: 2x = 8, then divide by 2: x = 4'),
(2, 'Simplify: 3(x + 2)', '["3x + 2", "3x + 5", "3x + 6", "3x + 8"]', '3x + 6', 'medium', 2, 'Distribute 3: 3x + 6'),
(2, 'What is the value of y in: y/4 = 8?', '["y = 24", "y = 28", "y = 32", "y = 36"]', 'y = 32', 'medium', 2, 'Multiply both sides by 4: y = 8 × 4 = 32'),
(2, 'Solve: 5x - 3 = 12', '["x = 3", "x = 4", "x = 5", "x = 6"]', 'x = 3', 'medium', 2, 'Add 3 to both sides: 5x = 15, then divide by 5: x = 3'),
(2, 'Simplify: 2(x + 3) + 4', '["2x + 10", "2x + 7", "2x + 6", "2x + 5"]', '2x + 10', 'medium', 2, 'First distribute 2: 2x + 6, then add 4: 2x + 10'),
(2, 'What is the slope in y = 3x + 2?', '["1", "2", "3", "4"]', '3', 'medium', 2, 'In the equation y = mx + b, m is the slope'),
(2, 'Solve: x/3 + 4 = 10', '["x = 18", "x = 21", "x = 24", "x = 27"]', 'x = 18', 'medium', 2, 'Subtract 4 from both sides: x/3 = 6, then multiply by 3: x = 18'),
(2, 'Factor: x² + 5x + 6', '["(x+2)(x+3)", "(x+1)(x+5)", "(x+3)(x+2)", "(x+6)(x+1)"]', '(x+2)(x+3)', 'medium', 2, 'Find factors of 6 that add to 5: 2 and 3'),
(2, 'Solve: -2x = 14', '["x = -7", "x = 7", "x = -8", "x = 8"]', 'x = -7', 'medium', 2, 'Divide both sides by -2: x = -7'),
(2, 'What is the y-intercept in 2x + y = 8?', '["6", "8", "4", "2"]', '8', 'medium', 2, 'When x = 0, y = 8');

-- Mathematics Questions (Quiz ID: 3 - Advanced Mathematics)
INSERT INTO questions (quiz_id, question_text, options, correct_answer, difficulty_level, points, explanation) VALUES
(3, 'Solve the quadratic equation: x² - 5x + 6 = 0', '["x = 2 or x = 3", "x = 1 or x = 4", "x = -2 or x = 3", "x = 2 or x = -3"]', 'x = 2 or x = 3', 'hard', 3, 'Using factoring: (x-2)(x-3)=0, so x=2 or x=3'),
(3, 'Find the derivative of f(x) = x³ + 2x² - 4x', '["3x² + 4x - 4", "3x² + 4x", "3x² + 2x - 4", "3x + 4"]', '3x² + 4x - 4', 'hard', 3, 'Power rule: derivative of x³ is 3x², of 2x² is 4x, of -4x is -4'),
(3, 'If log₂(x) = 3, what is x?', '["6", "8", "16", "4"]', '8', 'hard', 3, '2³ = 8, so x = 8'),
(3, 'Solve: 2sin(x) + 1 = 0', '["x = 150°", "x = -30°", "x = 210°", "x = 330°"]', 'x = 210°', 'hard', 3, 'sin(x) = -1/2, so x = 210° or 330°'),
(3, 'Find the volume of a sphere with radius 3', '["36π", "108π/3", "36π/3", "12π"]', '36π', 'hard', 3, 'Volume of sphere = (4/3)πr³'),
(3, 'What is the limit of (x² - 1)/(x - 1) as x approaches 1?', '["1", "2", "0", "undefined"]', '2', 'hard', 3, 'Use L''Hôpital''s rule or factor numerator'),
(3, 'Find the third term in (1 + x)⁴ expansion', '["4x²", "6x²", "12x²", "8x²"]', '6x²', 'hard', 3, 'Use binomial expansion: term is C(4,2)x²'),
(3, 'Solve: cos²(x) = sin(x)', '["x = π/3", "x = π/4", "x = π/6", "x = π/2"]', 'x = π/3', 'hard', 3, 'Substitute sin²(x) + cos²(x) = 1'),
(3, 'Find the area under y = x² from x = 0 to x = 2', '["8/3", "4", "16/3", "6"]', '8/3', 'hard', 3, 'Integrate x² from 0 to 2'),
(3, 'What is the sum of infinite GP: 1 + 1/2 + 1/4 + ...?', '["1", "2", "3", "4"]', '2', 'hard', 3, 'Sum = a/(1-r) where r = 1/2');

-- Science Questions (Quiz ID: 4 - Basic Science)
INSERT INTO questions (quiz_id, question_text, options, correct_answer, difficulty_level, points, explanation) VALUES
(4, 'What is the chemical symbol for water?', '["W", "H2O", "WA", "HO"]', 'H2O', 'easy', 1, 'Water molecule consists of two hydrogen atoms and one oxygen atom'),
(4, 'Which planet is known as the Red Planet?', '["Venus", "Mars", "Jupiter", "Saturn"]', 'Mars', 'easy', 1, 'Mars appears red due to iron oxide (rust) on its surface'),
(4, 'What is the process by which plants make their food?', '["Digestion", "Photosynthesis", "Respiration", "Absorption"]', 'Photosynthesis', 'easy', 1, 'Plants produce their food through photosynthesis using sunlight, water, and carbon dioxide'),
(4, 'What is the largest organ in the human body?', '["Heart", "Brain", "Liver", "Skin"]', 'Skin', 'easy', 1, 'The skin is the largest organ, covering the entire body'),
(4, 'Which gas do plants absorb from the air?', '["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"]', 'Carbon Dioxide', 'easy', 1, 'Plants absorb CO2 from the air for photosynthesis'),
(4, 'What is the basic unit of life?', '["Atom", "Cell", "Molecule", "Tissue"]', 'Cell', 'easy', 1, 'Cells are the fundamental building blocks of all living organisms'),
(4, 'What force pulls objects toward the center of the Earth?', '["Magnetic Force", "Electric Force", "Gravity", "Nuclear Force"]', 'Gravity', 'easy', 1, 'Gravity is the force that attracts objects toward Earth''s center'),
(4, 'Which state of matter has a definite shape and volume?', '["Liquid", "Gas", "Solid", "Plasma"]', 'Solid', 'easy', 1, 'Solids maintain both their shape and volume'),
(4, 'What is the main function of the lungs?', '["Pumping Blood", "Breathing", "Digestion", "Thinking"]', 'Breathing', 'easy', 1, 'Lungs are responsible for breathing, taking in oxygen and releasing carbon dioxide'),
(4, 'What type of energy does the Sun provide?', '["Chemical", "Nuclear", "Light and Heat", "Electrical"]', 'Light and Heat', 'easy', 1, 'The Sun provides both light and heat energy to Earth');

-- Science Questions (Quiz ID: 5 - Physics Fundamentals)
INSERT INTO questions (quiz_id, question_text, options, correct_answer, difficulty_level, points, explanation) VALUES
(5, 'What is the SI unit of force?', '["Watt", "Newton", "Joule", "Pascal"]', 'Newton', 'medium', 2, 'Newton (N) is the SI unit of force'),
(5, 'Which law states that energy cannot be created or destroyed?', '["Newton''s First Law", "Law of Conservation of Energy", "Ohm''s Law", "Boyle''s Law"]', 'Law of Conservation of Energy', 'medium', 2, 'Energy can only be transformed from one form to another'),
(5, 'What is the speed of light in vacuum?', '["299,792 km/s", "300,000 km/s", "199,792 km/s", "200,000 km/s"]', '299,792 km/s', 'medium', 2, 'Light travels at 299,792 kilometers per second in vacuum'),
(5, 'Which type of wave needs a medium to travel?', '["Light waves", "Radio waves", "Sound waves", "X-rays"]', 'Sound waves', 'medium', 2, 'Sound waves need a medium (solid, liquid, or gas) to propagate'),
(5, 'What is the unit of electric current?', '["Volt", "Watt", "Ampere", "Ohm"]', 'Ampere', 'medium', 2, 'Ampere (A) measures the flow of electric charge'),
(5, 'Which lens type is used to correct far-sightedness?', '["Convex", "Concave", "Bifocal", "Plano"]', 'Convex', 'medium', 2, 'Convex lenses converge light rays to correct far-sightedness'),
(5, 'What is the basic unit of temperature in SI system?', '["Fahrenheit", "Celsius", "Kelvin", "Rankine"]', 'Kelvin', 'medium', 2, 'Kelvin is the SI unit of temperature'),
(5, 'Which color of light has the highest wavelength?', '["Blue", "Green", "Yellow", "Red"]', 'Red', 'medium', 2, 'Red light has the longest wavelength in visible spectrum'),
(5, 'What is the formula for work done?', '["W = m/v", "W = F × d", "W = mv²", "W = mgh"]', 'W = F × d', 'medium', 2, 'Work = Force × displacement'),
(5, 'Which particle has a negative charge?', '["Proton", "Neutron", "Electron", "Alpha particle"]', 'Electron', 'medium', 2, 'Electrons carry a negative electric charge');

-- Science Questions (Quiz ID: 6 - Advanced Science)
INSERT INTO questions (quiz_id, question_text, options, correct_answer, difficulty_level, points, explanation) VALUES
(6, 'What is the atomic number of Carbon?', '["5", "6", "7", "8"]', '6', 'hard', 3, 'Carbon has 6 protons in its nucleus'),
(6, 'Which element is most abundant in Earth''s atmosphere?', '["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"]', 'Nitrogen', 'hard', 3, 'Nitrogen makes up about 78% of Earth''s atmosphere'),
(6, 'What is the pH of a neutral solution?', '["5", "6", "7", "8"]', '7', 'hard', 3, 'A pH of 7 indicates a neutral solution'),
(6, 'What is the primary function of DNA?', '["Energy storage", "Protein synthesis", "Genetic information storage", "Cell division"]', 'Genetic information storage', 'hard', 3, 'DNA stores and transmits genetic information'),
(6, 'Which organ produces insulin?', '["Liver", "Kidney", "Pancreas", "Spleen"]', 'Pancreas', 'hard', 3, 'The pancreas produces insulin to regulate blood sugar'),
(6, 'What is the charge of a neutron?', '["Positive", "Negative", "Neutral", "Variable"]', 'Neutral', 'hard', 3, 'Neutrons have no electric charge'),
(6, 'Which blood type is the universal donor?', '["A+", "B+", "AB+", "O-"]', 'O-', 'hard', 3, 'O negative blood can be given to any blood type'),
(6, 'What is the primary function of mitochondria?', '["Protein synthesis", "Energy production", "Water storage", "Waste removal"]', 'Energy production', 'hard', 3, 'Mitochondria are the powerhouse of the cell'),
(6, 'Which element has the highest electronegativity?', '["Oxygen", "Nitrogen", "Chlorine", "Fluorine"]', 'Fluorine', 'hard', 3, 'Fluorine has the highest electronegativity value'),
(6, 'What is the speed of sound in air at room temperature?', '["343 m/s", "293 m/s", "443 m/s", "243 m/s"]', '343 m/s', 'hard', 3, 'Sound travels at approximately 343 meters per second in air at room temperature');