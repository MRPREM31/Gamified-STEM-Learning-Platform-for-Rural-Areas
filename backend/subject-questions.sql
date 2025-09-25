-- Clear existing questions
DELETE FROM questions;

-- Basic Science Questions (Class 6)
INSERT OR IGNORE INTO questions (quiz_id, question_text, options, correct_answer, explanation, points) VALUES
(1, 'What is the process of converting water vapor to liquid?', '["Evaporation", "Condensation", "Sublimation", "Freezing"]', 1, 'Condensation is the process where water vapor changes into liquid water.', 10),
(1, 'Which element has the atomic number 1?', '["Helium", "Hydrogen", "Carbon", "Oxygen"]', 1, 'Hydrogen is the first element in the periodic table with atomic number 1.', 10),
(1, 'What is the SI unit of electric current?', '["Volt", "Watt", "Ampere", "Ohm"]', 2, 'Ampere (A) is the SI unit of electric current.', 10),
(1, 'Which part of the plant conducts photosynthesis?', '["Root", "Stem", "Leaves", "Flower"]', 2, 'Leaves contain chlorophyll and are the main site of photosynthesis.', 10),
(1, 'What is the function of red blood cells?', '["Transport oxygen", "Fight infection", "Blood clotting", "Produce antibodies"]', 0, 'Red blood cells carry oxygen to all parts of the body.', 10),
(1, 'Which is the largest planet in our solar system?', '["Mars", "Jupiter", "Saturn", "Earth"]', 1, 'Jupiter is the largest planet in our solar system.', 10),
(1, 'What is the basic unit of life?', '["Tissue", "Cell", "Organ", "Molecule"]', 1, 'The cell is the basic structural and functional unit of all living organisms.', 10),
(1, 'How many bones are there in the human body?', '["186", "206", "226", "246"]', 1, 'An adult human body has 206 bones.', 10),
(1, 'What is the boiling point of water?', '["50°C", "75°C", "100°C", "125°C"]', 2, 'Water boils at 100 degrees Celsius at standard atmospheric pressure.', 10),
(1, 'Which gas do plants absorb from the air?', '["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"]', 1, 'Plants absorb carbon dioxide for photosynthesis.', 10);

-- Mathematics Questions (Class 6)
INSERT OR IGNORE INTO questions (quiz_id, question_text, options, correct_answer, explanation, points) VALUES
(2, 'What is the value of π (pi) to two decimal places?', '["3.41", "3.14", "3.12", "3.16"]', 1, 'Pi (π) is approximately equal to 3.14.', 10),
(2, 'Solve: 3x + 5 = 20', '["5", "15", "3", "10"]', 0, 'Subtract 5 from both sides: 3x = 15, then divide by 3: x = 5', 10),
(2, 'What is the perimeter of a square with side length 7 units?', '["21", "28", "14", "49"]', 1, 'Perimeter of a square = 4 × side length = 4 × 7 = 28 units', 10),
(2, 'Which of these is a prime number?', '["15", "21", "23", "25"]', 2, '23 is only divisible by 1 and itself, making it a prime number.', 10),
(2, 'What is 25% of 80?', '["15", "20", "25", "30"]', 1, '25% = 1/4, so 25% of 80 = 80 ÷ 4 = 20', 10),
(2, 'What is the area of a triangle with base 8 units and height 6 units?', '["24", "48", "14", "16"]', 0, 'Area of triangle = (base × height) ÷ 2 = (8 × 6) ÷ 2 = 24 square units', 10),
(2, 'What is the next number in the sequence: 2, 4, 8, 16, ...?', '["24", "32", "20", "28"]', 1, 'Each number is multiplied by 2 to get the next number.', 10),
(2, 'What is the sum of angles in a triangle?', '["90°", "180°", "270°", "360°"]', 1, 'The sum of angles in a triangle is always 180 degrees.', 10),
(2, 'Convert 3/4 to a decimal.', '["0.65", "0.75", "0.80", "0.70"]', 1, 'Divide 3 by 4: 3 ÷ 4 = 0.75', 10),
(2, 'What is the mode of: 2, 3, 3, 4, 5, 3, 6?', '["2", "3", "4", "5"]', 1, 'The mode is the number that appears most frequently: 3 appears three times.', 10);

-- Engineering Questions (Class 6)
INSERT OR IGNORE INTO questions (quiz_id, question_text, options, correct_answer, explanation, points) VALUES
(3, 'What is the first step in the engineering design process?', '["Build a Prototype", "Identify the Problem", "Test the Solution", "Evaluate Results"]', 1, 'The engineering design process starts with identifying and understanding the problem.', 10),
(3, 'Which tool is used for measuring angles?', '["Ruler", "Protractor", "Scale", "Compass"]', 1, 'A protractor is specifically designed for measuring angles.', 10),
(3, 'What is brainstorming used for?', '["Testing Solutions", "Generating Ideas", "Building Models", "Writing Reports"]', 1, 'Brainstorming is a creative process for generating multiple ideas and solutions.', 10),
(3, 'Which material is strongest in tension?', '["Wood", "Steel", "Glass", "Plastic"]', 1, 'Steel has the highest tensile strength among these materials.', 10),
(3, 'What is the purpose of a blueprint?', '["Color Design", "Detailed Plan", "Cost Estimate", "Time Schedule"]', 1, 'A blueprint provides detailed technical drawings and plans for construction.', 10),
(3, 'Which simple machine makes work easier by using a grooved wheel?', '["Lever", "Pulley", "Wedge", "Screw"]', 1, 'A pulley uses a grooved wheel to change the direction of force and make lifting easier.', 10),
(3, 'What type of bridge is strongest?', '["Beam", "Arch", "Suspension", "Truss"]', 2, 'Suspension bridges can span the longest distances and support heavy loads.', 10),
(3, 'Which energy transformation occurs in a solar panel?', '["Light to Heat", "Light to Electricity", "Heat to Light", "Heat to Electricity"]', 1, 'Solar panels convert light energy into electrical energy.', 10),
(3, 'What is the main function of insulation in a house?', '["Keep noise out", "Control temperature", "Support weight", "Decorate walls"]', 1, 'Insulation helps control temperature by reducing heat transfer.', 10),
(3, 'Which force pulls objects toward Earth\'s center?', '["Magnetic", "Gravity", "Friction", "Tension"]', 1, 'Gravity is the force that pulls objects toward the center of Earth.', 10);

-- Technology Questions (Class 6)
INSERT OR IGNORE INTO questions (quiz_id, question_text, options, correct_answer, explanation, points) VALUES
(4, 'What is the brain of a computer called?', '["Hard Drive", "CPU", "Memory", "Monitor"]', 1, 'The CPU (Central Processing Unit) is considered the brain of a computer as it processes all instructions.', 10),
(4, 'Which of these is an input device?', '["Printer", "Speaker", "Mouse", "Monitor"]', 2, 'A mouse is an input device used to interact with the computer.', 10),
(4, 'What does RAM stand for?', '["Random Access Memory", "Read Always Memory", "Real Active Memory", "Rapid Access Module"]', 0, 'RAM (Random Access Memory) is temporary memory used by the computer while running programs.', 10),
(4, 'Which of these is a programming language?', '["Windows", "Python", "Chrome", "Printer"]', 1, 'Python is a popular programming language used for coding.', 10),
(4, 'What is the main purpose of an operating system?', '["Play Games", "Browse Internet", "Manage Computer Resources", "Send Emails"]', 2, 'An operating system manages computer hardware and software resources.', 10),
(4, 'Which file extension is used for text documents?', '[".jpg", ".txt", ".mp3", ".mp4"]', 1, '.txt is the standard file extension for plain text documents.', 10),
(4, 'What is the function of a firewall?', '["Speed up computer", "Security", "Store files", "Play music"]', 1, 'A firewall provides security by controlling incoming and outgoing network traffic.', 10),
(4, 'Which device connects a computer to the internet?', '["Printer", "Scanner", "Modem", "Speaker"]', 2, 'A modem connects computers to the internet by converting digital signals.', 10),
(4, 'What is the purpose of a spreadsheet program?', '["Write letters", "Edit photos", "Organize data", "Play videos"]', 2, 'Spreadsheet programs are used to organize, calculate and analyze data.', 10),
(4, 'Which storage device has the largest capacity?', '["Floppy Disk", "CD", "DVD", "Hard Drive"]', 3, 'Hard drives typically have much larger storage capacity than other options.', 10);