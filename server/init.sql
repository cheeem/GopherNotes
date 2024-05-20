USE gophernotes;

DROP TABLE IF EXISTS departments;

CREATE TABLE departments ( 
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    code CHAR(4) NOT NULL UNIQUE
);

DROP TABLE IF EXISTS classes; 

CREATE TABLE classes (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, 
    `name` VARCHAR(255) NOT NULL,
    department_id INT NOT NULL,
    code CHAR(4) NOT NULL UNIQUE
);

DROP TABLE IF EXISTS professors;

CREATE TABLE professors (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL
);

DROP TABLE IF EXISTS professor_classes; 

CREATE TABLE professor_classes (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    professor_id INT NOT NULL,
    class_id INT NOT NULL
);

DROP TABLE IF EXISTS posts; 

CREATE TABLE posts (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    file_type CHAR(3) NOT NULL,
    `path` VARCHAR(255) NOT NULL,
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