DROP TABLE IF NOT EXISTS classes;

CREATE TABLE department ( 
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    code CHAR(4) NOT NULL, 
)

CREATE TABLE classes (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, 
    `name` VARCHAR(255) NOT NULL,
    department_id INT NOT NULL,
    code CHAR(4) NOT NULL, 
)

CREATE TABLE professor (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
)

CREATE TABLE professor_classes (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    professor_id INT NOT NULL,
    class_id INT NOT NULL,
)

CREATE TABLE post (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    file_type CHAR(3) NOT NULL,
    `path` VARCHAR(255) NOT NULL,
    class_id INT NOT NULL, 
    professor_id INT,
    title VARCHAR(255) NOT NULL,
    dt DATETIME NOT NULL,
)