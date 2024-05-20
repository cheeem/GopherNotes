-- @block init
-- DROP DATABASE gophernotes;
CREATE DATABASE IF NOT EXISTS gophernotes;
USE gophernotes;

CREATE TABLE department (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
	code CHAR(4) NOT NULL,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE classes (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    course_number INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    department_id INT NOT NULL,
    FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE professor (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE semester (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    term VARCHAR(255) NOT NULL
);

CREATE TABLE note (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    class_id INT NOT NULL,
    professor_id INT NOT NULL,
    semester_id INT NOT NULL,
    description VARCHAR(255) NOT NULL,
    FOREIGN KEY (class_id) REFERENCES classes(id),
    FOREIGN KEY (professor_id) REFERENCES professor(id),
    FOREIGN KEY (semester_id) REFERENCES semester(id)
);


CREATE TABLE professor_classes (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    professor_id INT NOT NULL,
    class_id INT NOT NULL,
    FOREIGN KEY (professor_id) REFERENCES professor(id),
    FOREIGN KEY (class_id) REFERENCES classes(id)
);


CREATE TABLE post (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    file_type CHAR(3) NOT NULL,
    `path` VARCHAR(255) NOT NULL,
    class_id INT NOT NULL, 
    professor_id INT,
    title VARCHAR(255) NOT NULL,
    dt DATETIME NOT NULL
)





-- @block insert
USE gophernotes;

-- Insert into department table
INSERT INTO department (name, code) VALUES ('Computer Science', 'CSCI');

-- Assume 'Computer Science' department has ID 1, add classes
INSERT INTO classes (course_number, name, department_id) VALUES 
(5521,'Machine Learning Fundamentals', 1),
(5541,'Natural Language Processing', 1),
(4511,'Introduction to Artificial Intelligence', 1),
(5525,'Machine Learning: Analysis and Methods', 1),
(2041,'Advanced Programming Principles', 1);

-- Insert professors
INSERT INTO professor (name) VALUES 
('Catherine Zhao'),
('Dongyeop Kang'),
('Maria Gini'),
('Paul Schrater'),
('James Moen');

-- Insert semester
INSERT INTO semester (term) VALUES ('Spring 2024');

-- Assuming IDs are assigned in the order of insertion, with 'Spring 2024' as ID 1 in semester
-- Assuming professors are assigned IDs 1-5 in the order of their insertion
-- Assuming classes are assigned IDs 1-5 in the order of their insertion
INSERT INTO note (title, class_id, professor_id, semester_id, description) VALUES 
('Machine Learning Fundamentals', 1, 1, 1, 'CSCI 5521- Machine Learning Fundamentals - Catherine Zhao - (Spring 2024).pdf'),
('Natural Language Processing', 2, 2, 1, 'CSCI 5541-Natural Language Processing-Dongyeop Kang-(Spring 2024).pdf'),
('Introduction to Artificial Intelligence', 3, 3, 1, 'CSCI4511W-Introduction to Artificial Intelligence-Maria Gini-(Spring 2024).pdf'),
('Machine Learning: Analysis and Methods', 4, 4, 1, 'CSCI5525-Machine Learning_ Analysis and Methods-Paul Schrater-(Spring 2024).pdf'),
('Advanced Programming Principles', 5, 5, 1, 'CSSI2041-Advanced Programming Principles-James Moen-(Spring 2024).pdf');

INSERT INTO professor_classes (professor_id, class_id) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5);



-- @block select classes 
        SELECT 
            classes.course_number AS class_code,
            department.code AS department_code 
        FROM classes 
        JOIN department ON department.id = classes.department_id 
        WHERE CONCAT(department.code, classes.course_number) LIKE ?


-- @block select professors
    SELECT 
    c.course_number AS class_code, 
    d.code AS department_code
FROM 
    professor p
JOIN 
    professor_classes pc ON p.id = pc.professor_id
JOIN 
    classes c ON pc.class_id = c.id
JOIN 
    department d ON c.department_id = d.id
WHERE 
    p.name LIKE ?;

