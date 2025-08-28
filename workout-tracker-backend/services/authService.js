const userDao = require('../dao/userDao');
const userDto = require('../dto/userDto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

exports.login = async (email, password) => {
  if (!email || !password) {
    const err = new Error('Email and password are required.');
    err.status = 400;
    throw err;
  }
  const user = await userDao.findByEmail(email);
  if (!user) {
    const err = new Error('Invalid email or password.');
    err.status = 401;
    throw err;
  }
  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    const err = new Error('Invalid email or password.');
    err.status = 401;
    throw err;
  }
  const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
  return { message: 'Login successful!', token, user: userDto.toDto(user) };
};

exports.signup = async (email, password) => {
  if (!email || !password) {
    const err = new Error('Email and password are required.');
    err.status = 400;
    throw err;
  }
  const existingUser = await userDao.findByEmail(email);
  if (existingUser) {
    const err = new Error('Email already in use.');
    err.status = 409;
    throw err;
  }
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);
  const newUser = await userDao.createUser({ email, passwordHash });
  const token = jwt.sign({ userId: newUser._id, email: newUser.email }, JWT_SECRET, { expiresIn: '7d' });
  return { message: 'User signed up successfully!', token, user: userDto.toDto(newUser) };
}; 