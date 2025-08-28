const authService = require('../services/authService');

/**
 * Input validation utilities for authentication endpoints
 */
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  return {
    isValid: password && password.length >= 5,
    message: password ? (password.length < 5 ? 'Password must be at least 5 characters long' : null) : 'Password is required'
  };
};

const sanitizeInput = (str) => {
  if (typeof str !== 'string') return '';
  return str.trim().toLowerCase();
};

/**
 * @swagger
 * /login:
 *   post:
 *     summary: User login
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */
exports.login = async (req, res) => {
  try {
    // Request body validation
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: 'Request body is required' });
    }

    const { email, password } = req.body;

    // Email validation
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const sanitizedEmail = sanitizeInput(email);
    if (!validateEmail(sanitizedEmail)) {
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    // Password validation
    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }

    if (typeof password !== 'string') {
      return res.status(400).json({ message: 'Password must be a string' });
    }

    const result = await authService.login(sanitizedEmail, password);
    res.status(200).json(result);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || 'Internal server error.' });
  }
};

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: User registration
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "newuser@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "password123"
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User created successfully"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *       400:
 *         description: User already exists or invalid input
 *       500:
 *         description: Internal server error
 */
exports.signup = async (req, res) => {
  try {
    // Request body validation
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: 'Request body is required' });
    }

    const { email, password } = req.body;

    // Email validation
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const sanitizedEmail = sanitizeInput(email);
    if (!validateEmail(sanitizedEmail)) {
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    // Password validation
    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }

    if (typeof password !== 'string') {
      return res.status(400).json({ message: 'Password must be a string' });
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({ message: passwordValidation.message });
    }

    const result = await authService.signup(sanitizedEmail, password);
    res.status(201).json(result);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message || 'Internal server error.' });
  }
};