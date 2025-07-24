-- pgSQL password : ram

-- Create enum types first
CREATE TYPE student_status AS ENUM ('Active', 'Inactive', 'Graduated', 'Suspended');
CREATE TYPE faculty_status AS ENUM ('Active', 'Inactive', 'On Leave');

-- Create Departments table first without the faculty_id foreign key
CREATE TABLE Departments (
    department_id SERIAL PRIMARY KEY,
    department_name VARCHAR(100) NOT NULL,
    department_code VARCHAR(10) UNIQUE NOT NULL,
    faculty_id INT NULL,  -- Will add FK constraint after Faculty table is created
    description TEXT
);

CREATE TABLE Faculty (
    faculty_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20),
    department_id INT NOT NULL,
    position VARCHAR(100),
    specialization TEXT,
    status faculty_status DEFAULT 'Active',
    FOREIGN KEY (department_id) REFERENCES Departments(department_id)
);

-- Add password column to Faculty table if it doesn't exist
ALTER TABLE Faculty 
ADD COLUMN IF NOT EXISTS password VARCHAR(255);

-- Now add the foreign key to Departments
ALTER TABLE Departments 
    ADD CONSTRAINT fk_department_head 
    FOREIGN KEY (faculty_id) REFERENCES Faculty(faculty_id);

CREATE TABLE Students (
    student_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    date_of_birth DATE,
    gender CHAR(1),  -- 'M', 'F', 'O' (Other), or NULL
    email VARCHAR(100) UNIQUE,
    -- phone VARCHAR(20),
    -- address TEXT,
    -- city VARCHAR(50),
    -- state VARCHAR(50),
    -- zip_code VARCHAR(20),
    -- country VARCHAR(50),
    enrollment_date DATE,
    status student_status DEFAULT 'Active',
    photo_path VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Modify Students table to include roll number and password for authentication
ALTER TABLE Students 
ADD COLUMN roll_number VARCHAR(20) UNIQUE,
ADD COLUMN password VARCHAR(255),
ADD COLUMN department_id INT,
ADD CONSTRAINT fk_student_department FOREIGN KEY (department_id) REFERENCES Departments(department_id);

CREATE TABLE Courses (
    course_id SERIAL PRIMARY KEY,
    course_code VARCHAR(20) UNIQUE NOT NULL,
    course_name VARCHAR(100) NOT NULL,
    description TEXT
);

-- Add users table for admin authentication
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Check if columns already exist and add them if not
ALTER TABLE Students 
ADD COLUMN IF NOT EXISTS phone VARCHAR(20),
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS date_of_birth DATE;

-- Create an attendance record table to store aggregated attendance data
CREATE TABLE Attendance (
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    total_hours INT DEFAULT 0,
    present_hours INT DEFAULT 0,
    FOREIGN KEY (student_id) REFERENCES Students(student_id),
    FOREIGN KEY (course_id) REFERENCES Courses(course_id),
    UNIQUE (student_id, course_id)
);

-- Create index for faster lookups
-- CREATE INDEX idx_attendance_student ON Attendance(student_id);
-- CREATE INDEX idx_attendance_course ON Attendance(course_id);

-- Create Attendance Log table to track when classes occur
CREATE TABLE AttendanceLog (
    attendance_log_id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    course_id INT NOT NULL,
    faculty_id INT NOT NULL,
    FOREIGN KEY (course_id) REFERENCES Courses(course_id),
    FOREIGN KEY (faculty_id) REFERENCES Faculty(faculty_id)
);

-- Create Absent Log table to track student absences
CREATE TABLE AbsentLog (
    student_id INT NOT NULL,
    course_id INT NOT NULL, 
    attendance_log_id INT NOT NULL,
    date DATE NOT NULL,
    FOREIGN KEY (course_id) REFERENCES Courses(course_id),
    FOREIGN KEY (student_id) REFERENCES Students(student_id),
    FOREIGN KEY (attendance_log_id) REFERENCES AttendanceLog(attendance_log_id)
);

-- -- Create indexes to improve query performance
-- CREATE INDEX idx_attendance_date ON AttendanceLog(date);
-- CREATE INDEX idx_attendance_course ON AttendanceLog(course_id);
-- CREATE INDEX idx_absent_student ON AbsentLog(student_id);
-- CREATE INDEX idx_absent_attendance ON AbsentLog(attendance_log_id);