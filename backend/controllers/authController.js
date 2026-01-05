const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';
const JWT_EXPIRES_IN = '24h';

// Register new user
exports.register = async (req, res) => {
  try {
    const { email, password, full_name, student_id, phone, level } = req.body;

    // Validate input
    if (!email || !password || !full_name || !level) {
      return res.status(400).json({ error: 'Email, password, full name, and level are required' });
    }

    // Validate level
    if (![100, 200, 300, 400].includes(parseInt(level))) {
      return res.status(400).json({ error: 'Level must be 100, 200, 300, or 400' });
    }

    // Check if user already exists
    const userExists = await db.query(
      'SELECT * FROM users WHERE email = $1 OR student_id = $2',
      [email, student_id]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: 'User with this email or student ID already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const result = await db.query(
      `INSERT INTO users (email, password, full_name, student_id, phone, role, level) 
       VALUES ($1, $2, $3, $4, $5, 'student', $6) 
       RETURNING id, email, full_name, student_id, role, created_at`,
      [email, hashedPassword, full_name, student_id, phone, level]
    );

    const user = result.rows[0];

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        student_id: user.student_id,
        role: user.role,
        level: parseInt(level)
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed', message: error.message });
  }
};

// Login user - FIXED VERSION
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const result = await db.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = result.rows[0];

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role,
        level: user.level  // Optional: include level in JWT
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        student_id: user.student_id,
        role: user.role,
        level: parseInt(user.level) 
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed', message: error.message });
  }
};

// Get current user profile
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await db.query(
      `SELECT id, email, full_name, student_id, phone, role, created_at 
       FROM users WHERE id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile', message: error.message });
  }
};