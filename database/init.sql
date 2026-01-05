-- Course Registration System Database Schema (Updated for Nigerian University System)

-- Create users table (students and admins)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'student' CHECK (role IN ('student', 'admin')),
    student_id VARCHAR(50) UNIQUE,
    phone VARCHAR(20),
    level INTEGER CHECK (level IN (100, 200, 300, 400)),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
    id SERIAL PRIMARY KEY,
    course_code VARCHAR(20) UNIQUE NOT NULL,
    course_name VARCHAR(255) NOT NULL,
    credits INTEGER NOT NULL,
    level INTEGER NOT NULL CHECK (level IN (100, 200, 300, 400)),
    semester INTEGER NOT NULL CHECK (semester IN (1, 2)),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create enrollments table (links students to courses)
CREATE TABLE IF NOT EXISTS enrollments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
    enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'enrolled' CHECK (status IN ('enrolled', 'dropped', 'completed')),
    UNIQUE(user_id, course_id)
);

-- Create grades table for GPA calculation
CREATE TABLE IF NOT EXISTS grades (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
    semester_name VARCHAR(50) NOT NULL,
    score INTEGER CHECK (score >= 0 AND score <= 100),
    letter_grade VARCHAR(2),
    grade_point DECIMAL(3,1),
    quality_point DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, course_id, semester_name)
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_student_id ON users(student_id);
CREATE INDEX idx_users_level ON users(level);
CREATE INDEX idx_courses_code ON courses(course_code);
CREATE INDEX idx_courses_level ON courses(level);
CREATE INDEX idx_courses_semester ON courses(semester);
CREATE INDEX idx_enrollments_user ON enrollments(user_id);
CREATE INDEX idx_enrollments_course ON enrollments(course_id);
CREATE INDEX idx_grades_user ON grades(user_id);
CREATE INDEX idx_grades_semester ON grades(semester_name);

-- Insert default admin user (password: admin123)
INSERT INTO users (email, password, full_name, role, student_id, level) 
VALUES (
    'admin@courseapp.com', 
    '$2b$10$K7L1OJ45/4Y2nIKhGn0qAe7yT4rQvxcTLGpZYhm3xP9sVa5kJ5LkG', 
    'System Administrator', 
    'admin', 
    'ADMIN001',
    NULL
) ON CONFLICT (email) DO NOTHING;

-- Insert Year 1 - First Semester Courses
INSERT INTO courses (course_code, course_name, credits, level, semester) VALUES
('GES 100.1', 'Communication skills in English', 3, 100, 1),
('GES 102.1', 'Introduction to Philosophy in English', 2, 100, 1),
('MTH 110.1', 'Algebra and Trigonometry', 3, 100, 1),
('MTH 120.1', 'Calculus', 3, 100, 1),
('PHY 101.1', 'Mechanics and Properties of Matter', 3, 100, 1),
('PHY 102.1', 'Laboratory Practices I', 1, 100, 1),
('CSC 180.1', 'Introduction to computer science and Basic Programming', 2, 100, 1),
('CMH 130.1', 'General Chemistry I', 3, 100, 1),
('FSB 101.1', 'General Biology I', 3, 100, 1)
ON CONFLICT (course_code) DO NOTHING;

-- Insert Year 1 - Second Semester Courses
INSERT INTO courses (course_code, course_name, credits, level, semester) VALUES
('GES 101.2', 'Computer Appreciations and Application', 2, 100, 2),
('CSC 182.2', 'Computer Applications', 2, 100, 2),
('CSC 183.2', 'Introduction to Problem Solving', 2, 100, 2),
('MTH 114.2', 'Introduction to Set, Logic and Numbers', 3, 100, 2),
('MTH 124.2', 'Coordinate Geometry', 3, 100, 2),
('GES 103.2', 'Nigerian People and Culture', 2, 100, 2),
('PHY 112.2', 'Introduction to Electricity and Magnetism', 3, 100, 2),
('PHY 103.2', 'Laboratory Practices II', 1, 100, 2),
('STA 160.2', 'Descriptive Statistics', 3, 100, 2)
ON CONFLICT (course_code) DO NOTHING;

-- Insert Year 2 - First Semester Courses
INSERT INTO courses (course_code, course_name, credits, level, semester) VALUES
('MTH 270.1', 'Numerical Analysis', 3, 200, 1),
('STA 260.1', 'Introduction to Probability and statistics', 3, 200, 1),
('CSC 280.1', 'Introduction to Computer Programming (Fortran)', 3, 200, 1),
('CSC 281.1', 'Computer System Fundamentals', 2, 200, 1),
('CSC 283.1', 'Introduction to Information Systems and File Structures', 2, 200, 1),
('CSC 284.1', 'Introduction to Logic Design', 2, 200, 1),
('CSC 288.1', 'Structured Programming', 2, 200, 1),
('MTH 210.1', 'Linear Algebra', 3, 200, 1),
('MTH 230.1', 'Modern Algebra', 3, 200, 1)
ON CONFLICT (course_code) DO NOTHING;

-- Insert Year 2 - Second Semester Courses
INSERT INTO courses (course_code, course_name, credits, level, semester) VALUES
('CSC 282.2', 'Database Programming', 2, 200, 2),
('CSC 285.2', 'Digital Designs and Microprocessor', 2, 200, 2),
('CSC 286.2', 'Data Structures', 2, 200, 2),
('CSC 287.2', 'Object Oriented Programming I', 2, 200, 2),
('FSC 2C1.2', 'Community Service', 1, 200, 2),
('MTH 224.2', 'Mathematical Methods I', 2, 200, 2),
('MTH 250.2', 'Elementary Differential Equations', 3, 200, 2),
('STA 262.2', 'Mathematical Statistics I', 3, 200, 2),
('PHY 351.2', 'Electronics 1', 3, 200, 2)
ON CONFLICT (course_code) DO NOTHING;

-- Insert Year 3 - First Semester Courses
INSERT INTO courses (course_code, course_name, credits, level, semester) VALUES
('GES 300.1', 'Fundamentals of Entrepreneurship', 2, 300, 1),
('CSC 395.1', 'Introduction to Software Engineering', 3, 300, 1),
('CSC 382.1', 'Computer Architecture I', 2, 300, 1),
('CSC 394.1', 'Operating Systems', 3, 300, 1),
('CSC 396.1', 'Automata theory, Computability & Formal Languages', 3, 300, 1),
('CSC 397.1', 'Computational Methods', 2, 300, 1),
('STA 370.1', 'Operations Research', 3, 300, 1)
ON CONFLICT (course_code) DO NOTHING;

-- Insert Year 3 - Second Semester Course
INSERT INTO courses (course_code, course_name, credits, level, semester) VALUES
('CSC 300.2', 'Industrial Training', 9, 300, 2)
ON CONFLICT (course_code) DO NOTHING;

-- Insert Year 4 - First Semester Courses
INSERT INTO courses (course_code, course_name, credits, level, semester) VALUES
('GES 400.1', 'Entrepreneurship', 2, 400, 1),
('CSC 480.1', 'Database Management', 3, 400, 1),
('CSC 481.1', 'Object Oriented Programming II', 2, 400, 1),
('CSC 482.1', 'Compiler Construction', 2, 400, 1),
('CSC 483.1', 'Algorithms and Complexity Analysis', 2, 400, 1),
('CSC 486.1', 'System Analysis and Design', 3, 400, 1),
('CSC 496.1', 'Programming Languages (4th and 5th Generation)', 2, 400, 1),
('CSC 498.1', 'Computer Network & Data Communications', 3, 400, 1)
ON CONFLICT (course_code) DO NOTHING;

-- Insert Year 4 - Second Semester Courses
INSERT INTO courses (course_code, course_name, credits, level, semester) VALUES
('CSC 491.2', 'Internet and Web Applications', 2, 400, 2),
('CSC 494.2', 'Introduction to Artificial Intelligence', 3, 400, 2),
('CSC 492.2', 'Computer Architecture II', 2, 400, 2),
('CSC 490.2', 'Project', 6, 400, 2),
('CSC 493.2', 'Computer Modeling and Simulation', 2, 400, 2),
('CSC 499.2', 'Computer Graphics', 2, 400, 2),
('CSC 497.2', 'Project Management', 1, 400, 2)
ON CONFLICT (course_code) DO NOTHING;

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_grades_updated_at BEFORE UPDATE ON grades
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();