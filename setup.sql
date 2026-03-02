-- Create the database
CREATE DATABASE IF NOT EXISTS form_submission;

-- Use the database
USE form_submission;

-- Create the registrations table
CREATE TABLE IF NOT EXISTS registrations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  classRoll VARCHAR(50) NOT NULL,
  department VARCHAR(100) NOT NULL,
  year VARCHAR(50) NOT NULL,
  semester VARCHAR(50) NOT NULL,
  address VARCHAR(255) NOT NULL
);
