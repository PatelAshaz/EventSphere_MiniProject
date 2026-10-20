-- =========================================================
-- Campus Tech Club & Event Management Hub (CampusHub)
-- Database Schema & Sample Data
-- For 2nd-Year Computer Engineering Mini-Project
-- =========================================================

-- Step 1: Create the database
CREATE DATABASE IF NOT EXISTS campus_event_db;
USE campus_event_db;

-- Step 2: Drop existing tables if re-running script (registrations first due to foreign key)
DROP TABLE IF EXISTS registrations;
DROP TABLE IF EXISTS events;

-- Step 3: Create the 'events' table
CREATE TABLE IF NOT EXISTS events (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    club_name VARCHAR(100) NOT NULL,
    event_date VARCHAR(50) NOT NULL,
    time VARCHAR(20) DEFAULT '09:00',
    venue VARCHAR(100) NOT NULL,
    seats INT DEFAULT 100,
    description TEXT
);

-- Step 4: Create the 'registrations' table
CREATE TABLE IF NOT EXISTS registrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_name VARCHAR(100) NOT NULL,
    roll_no VARCHAR(50) NOT NULL,
    branch VARCHAR(50) NOT NULL,
    year VARCHAR(10) NOT NULL,
    email VARCHAR(100) NOT NULL,
    event_id VARCHAR(50) NOT NULL,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- =========================================================
-- Sample Data (3-4 Sample Events + Registrations)
-- =========================================================

-- Insert Sample Tech Club Events
INSERT INTO events (id, title, club_name, event_date, time, venue, seats, description) VALUES
('EVT-101', 'Nebula Hack 2026', 'Hackathon', '2026-03-14', '09:00', 'CSE Seminar Hall', 120, '24-hour build sprint on the theme "Life on Station". Teams of 4, mentor sessions every 6 hours, coffee on us and a 50k prize pool.'),
('EVT-102', 'Zero-G CTF - Cyber Security Contest', 'Cybersecurity', '2026-03-21', '10:00', 'IT Lab 2', 60, 'Capture the Flag contest across web security, cryptography, and reverse engineering tracks. Beginner-friendly challenges included.'),
('EVT-103', 'AI/ML Foundations Workshop', 'Workshop', '2026-03-07', '14:00', 'Auditorium B', 150, 'Hands-on intro to neural networks and computer vision in Python. Bring your laptop — we cover model training and Kaggle tips.'),
('EVT-104', 'CodeSprint - Speed Coding Contest', 'Coding Contest', '2026-04-02', '11:00', 'Computer Center 1', 80, 'Fast-paced competitive programming contest testing algorithms, data structures, and problem-solving speed under time pressure.'),
('EVT-105', 'TechTrivia - Inter-Branch Quiz Battle', 'Quiz', '2026-04-10', '15:30', 'Seminar Hall A', 100, 'Thrilling multi-round tech quiz covering computer architecture, open source history, algorithms, and tech trivia.');

-- Insert Sample Student Registrations
INSERT INTO registrations (student_name, roll_no, branch, year, email, event_id) VALUES
('Aarav Sharma', 'CS23B012', 'CSE', '2', 'aarav.sharma@campus.edu', 'EVT-101'),
('Diya Patel', 'CS23B045', 'CSE', '2', 'diya.patel@campus.edu', 'EVT-103'),
('Rohan Verma', 'IT23B009', 'IT', '2', 'rohan.verma@campus.edu', 'EVT-101'),
('Sneha Iyer', 'EE23B023', 'EE', '2', 'sneha.iyer@campus.edu', 'EVT-102'),
('Kabir Singh', 'CS22B071', 'CSE', '3', 'kabir.singh@campus.edu', 'EVT-104'),
('Ananya Reddy', 'ME23B016', 'ME', '2', 'ananya.reddy@campus.edu', 'EVT-105');

-- Verify inserted data
SELECT * FROM events;
SELECT * FROM registrations;
