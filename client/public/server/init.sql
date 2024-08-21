USE gophernotes;

DROP TABLE IF EXISTS departments;

CREATE TABLE departments ( 
    id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    code CHAR(4) NOT NULL UNIQUE
);

DROP TABLE IF EXISTS classes; 

CREATE TABLE classes (
    id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT, 
    `name` VARCHAR(255) NOT NULL,
    department_id INT NOT NULL,
    code CHAR(4) NOT NULL UNIQUE
);

DROP TABLE IF EXISTS professors;

CREATE TABLE professors (
    id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL
);

DROP TABLE IF EXISTS professor_classes; 

CREATE TABLE professor_classes (
    id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
    professor_id INT UNSIGNED NOT NULL,
    class_id INT UNSIGNED NOT NULL
);

DROP TABLE IF EXISTS posts; 

-- Upload type: PDF: 1, IMG: 2, DOC: 3, TEXT: 4
CREATE TABLE posts (
    id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
    deleted BIT NOT NULL DEFAULT 0, 
    upload_type TINYINT UNSIGNED NOT NULL,
    `path` VARCHAR(255),
    `text` TEXT,
    class_id INT NOT NULL, 
    professor_id INT,
    title VARCHAR(255) NOT NULL,
    dt DATETIME NOT NULL
);

INSERT INTO departments(`name`, code) VALUES ("Computer Science", "CSCI");

INSERT INTO classes(`name`, department_id, code) VALUES 
    ("Machine Learning Fundamentals", 1, "5521"), 
    ("Natural Language Processing", 1, "5541"), 
    ("Introduction to Artificial Intelligence", 1, "4511"), 
    ("Machine Learning", 1, "5525"), 
    ("Advanced Programming Principles", 1, "2041"); 

INSERT INTO professor_classes(professor_id, class_id) VALUES 
    (1, 1),
    (2, 2),
    (3, 3),
    (4, 4),
    (5, 5);

INSERT INTO professors(`name`) VALUES 
    ("Catherine Zhao"),
    ("Dongyeop Kang"),
    ("Maria Gini"),
    ("Paul Schrater"),
    ("James Moen");


-- Insert initial values
INSERT INTO posts (deleted, upload_type, path, text, class_id, professor_id, title, dt) VALUES
(0x00, 1, '/files/machine_learning_fundamentals.pdf', NULL, 1, 1, 'Introduction to ML PDF', '2024-07-01 22:09:11'),
(0x00, 4, '', 'This is the notes I have for the class', 1, 1, 'Introduction to ML Text', '2024-07-01 22:09:11'),
(0x00, 2, '/images/nlp_class_image.jpg', NULL, 2, 2, 'NLP Class Overview', '2024-07-01 22:09:11'),
(0x00, 3, '/docs/ai_notes.docx', NULL, 3, 3, 'AI Class Notes', '2024-07-01 22:09:11'),
(0x00, 1, '/files/advanced_programming.pdf', NULL, 5, 5, 'Advanced Programming Tutorial', '2024-07-01 22:09:11'),
(0x00, 1, '/files/machine_learning.pdf', NULL, 4, 4, 'Deep Learning Concepts', '2024-07-01 22:09:11');

