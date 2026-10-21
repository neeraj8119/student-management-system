
CREATE DATABASE IF NOT EXISTS student_management;
USE student_management;
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin','teacher') DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE departments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  code VARCHAR(20) UNIQUE NOT NULL
);

CREATE TABLE teachers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150),
  phone VARCHAR(20),
  department_id INT,
  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
);

CREATE TABLE courses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  code VARCHAR(30) UNIQUE NOT NULL,
  teacher_id INT,
  department_id INT,
  FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE SET NULL,
  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
);

CREATE TABLE students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id VARCHAR(30) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150),
  phone VARCHAR(20),
  gender VARCHAR(20),
  date_of_birth DATE,
  department_id INT,
  course_id INT,
  address VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE SET NULL
);

CREATE TABLE attendance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  attendance_date DATE NOT NULL,
  status ENUM('Present','Absent') NOT NULL,
  UNIQUE(student_id, attendance_date),
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

CREATE TABLE fees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  total_amount DECIMAL(10,2) DEFAULT 0,
  paid_amount DECIMAL(10,2) DEFAULT 0,
  payment_date DATE,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

CREATE TABLE marks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  subject VARCHAR(100) NOT NULL,
  marks DECIMAL(5,2) NOT NULL,
  max_marks DECIMAL(5,2) DEFAULT 100,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

INSERT INTO departments(name, code) VALUES
('Computer Applications','MCA'),
('Computer Science','CSE'),
('Management','MBA'),
('Information Technology','IT'),
('Electronics & Communication','ECE'),
('Mechanical Engineering','MECH'),
('Civil Engineering','CIVIL'),
('Commerce','COM'),
('Arts & Humanities','ARTS'),
('10','DEPT10');

INSERT INTO courses(name, code, department_id) VALUES
('Master of Computer Applications','MCA01',1),
('PG Diploma in Computer Applications','PGDCA',1),
('B.Tech Computer Science','BTECH-CS',2),
('M.Tech Computer Science','MTECH-CS',2),
('Master of Business Administration','MBA01',3),
('Bachelor of Business Administration','BBA01',3),
('B.Tech Information Technology','BTECH-IT',4),
('Bachelor of Information Technology','BIT01',4),
('B.Tech Electronics & Communication','BTECH-ECE',5),
('B.Tech Mechanical Engineering','BTECH-ME',6),
('B.Tech Civil Engineering','BTECH-CIV',7),
('Bachelor of Commerce','BCOM01',8),
('Master of Commerce','MCOM01',8),
('Bachelor of Arts','BA01',9),
('Master of Arts in English','MA-ENG',9),
('Course 1','C1001',10),
('Course 2','C1002',10),
('Course 3','C1003',10),
('Course 4','C1004',10),
('Course 5','C1005',10),
('Course 6','C1006',10),
('Course 7','C1007',10),
('Course 8','C1008',10),
('Course 9','C1009',10),
('Course 10','C1010',10);

INSERT INTO users(name,email,password,role)
VALUES ('Admin','admin@gmail.com',
'$2a$10$ncyQ/r3D78NzV50yh27IoOOmKoS5dpGxNtaKFdpTMWxkptdBMQReC',
'admin');
