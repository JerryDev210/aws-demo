-- Insert departments data
INSERT INTO Departments (department_name, department_code, description)
VALUES 
  ('Computer Science Engineering', 'CSE', 'Department of Computer Science and Engineering focuses on computing technologies and software systems.'),
  ('Information Technology', 'IT', 'Department of Information Technology deals with information systems and computing infrastructure.'),
  ('Electronics and Communication', 'ECE', 'Department of Electronics and Communication focuses on electronic devices and communication systems.'),
  ('Electrical Engineering', 'EEE', 'Department of Electrical Engineering deals with electrical systems and power engineering.'),
  ('Mechanical Engineering', 'MECH', 'Department of Mechanical Engineering focuses on machines, manufacturing and thermal systems.'),
  ('Civil Engineering', 'CIVIL', 'Department of Civil Engineering deals with design and construction of physical structures.'),
  ('Artificial Intelligence and Machine Learning', 'AI-ML', 'Department focused on AI technologies and machine learning systems.'),
  ('Data Science', 'DS', 'Department specializing in data analytics and computational statistics.'),
  ('Biotechnology', 'BT', 'Department focusing on technological applications in biological systems.'),
  ('Master of Computer Applications', 'MCA', 'Department offering Master of Computer Applications program focusing on advanced software development and computer applications.');

-- Insert Faculty Data
INSERT INTO Faculty (
  name, 
  email, 
  phone, 
  department_id, 
  position, 
  specialization, 
  status,
  password  -- Adding password field for login
) VALUES
  ('Dr. Chita', 'chitra@example.com', '9876543210', 10, 'HOD', 'Operating System', 'Active', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa'),
  ('Dr. Vijayalakshmi', 'vj@example.com', '9876543211', 10, 'Professor', 'Database Systems', 'Active', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa'),
  ('Mrs. Mutharasi', 'muthu@example.com', '9876543212', 10, 'Assistant Professor', 'Software Engineerring', 'Active', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa');

-- Update Departments with faculty as department head
UPDATE Departments SET faculty_id = 1 WHERE department_id = 10;

-- Insert Course Data
INSERT INTO Courses (course_code, course_name, description) VALUES
  ('MCA101', 'Data Structures and Algorithms', 'Introduction to basic data structures and algorithm analysis'),
  ('MCA102', 'Database Management Systems', 'Design and implementation of database systems'),
  ('MCA103', 'Web Technologies', 'Modern web development frameworks and technologies'),
  ('MCA104', 'Operating Systems', 'Principles of operating system design and implementation'),
  ('MCA105', 'Software Engineering', 'Principles and practices of software development lifecycle'),
  ('MCA106', 'Discrete Mathematics', 'Mathematical structures for computer science applications');

INSERT INTO Students (
  name, 
  date_of_birth, 
  gender, 
  email, 
  phone, 
  address, 
  enrollment_date, 
  status, 
  roll_number, 
  password, 
  department_id
) VALUES
  ('Arun Kumar', '2000-05-10', 'M', 'arun@example.com', '9876500001', 'Chennai', '2022-08-01', 'Active', 'MCA22001', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa', 10),
  ('Bina Singh', '2000-06-15', 'F', 'bina@example.com', '9876500002', 'Delhi', '2022-08-01', 'Active', 'MCA22002', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa', 10),
  ('Chetan Patel', '2000-07-20', 'M', 'chetan@example.com', '9876500003', 'Mumbai', '2022-08-01', 'Active', 'MCA22003', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa', 10),
  ('Divya Rao', '2000-08-25', 'F', 'divya@example.com', '9876500004', 'Bangalore', '2022-08-01', 'Active', 'MCA22004', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa', 10),
  ('Eshan Jain', '2000-09-30', 'M', 'eshan@example.com', '9876500005', 'Hyderabad', '2022-08-01', 'Active', 'MCA22005', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa', 10),
  ('Fiona Das', '2000-10-05', 'F', 'fiona@example.com', '9876500006', 'Pune', '2022-08-01', 'Active', 'MCA22006', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa', 10),
  ('Ganesh Iyer', '2000-11-10', 'M', 'ganesh@example.com', '9876500007', 'Kolkata', '2022-08-01', 'Active', 'MCA22007', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa', 10),
  ('Hema Reddy', '2000-12-15', 'F', 'hema@example.com', '9876500008', 'Chennai', '2022-08-01', 'Active', 'MCA22008', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa', 10),
  ('Irfan Khan', '2001-01-20', 'M', 'irfan@example.com', '9876500009', 'Delhi', '2022-08-01', 'Active', 'MCA22009', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa', 10),
  ('Jyoti Sharma', '2001-02-25', 'F', 'jyoti@example.com', '9876500010', 'Mumbai', '2022-08-01', 'Active', 'MCA22010', '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa', 10);

-- Create the FacultyCourse table if it doesn't exist yet
CREATE TABLE IF NOT EXISTS FacultyCourse (
    faculty_id INT NOT NULL,
    course_id INT NOT NULL,
    PRIMARY KEY (faculty_id, course_id),
    FOREIGN KEY (faculty_id) REFERENCES Faculty(faculty_id),
    FOREIGN KEY (course_id) REFERENCES Courses(course_id)
);

-- Associate faculty members with courses
INSERT INTO FacultyCourse (faculty_id, course_id) VALUES
  (1, 1), -- Dr. Chita teaches Data Structures and Algorithms
  (1, 4), -- Dr. Chita teaches Operating Systems
  (2, 2), -- Dr. Vijayalakshmi teaches Database Management Systems
  (2, 6), -- Dr. Vijayalakshmi teaches Discrete Mathematics
  (3, 3), -- Mrs. Mutharasi teaches Web Technologies
  (3, 5); -- Mrs. Mutharasi teaches Software Engineering

-- Note: faculty_id is initially NULL as we need to create faculty members first
-- You can update department heads later with:
-- UPDATE Departments SET faculty_id = [faculty_id] WHERE department_id = [department_id];