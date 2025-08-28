const User = require('../models/user');

exports.findByEmail = (email) => {
  return User.findOne({ email });
};

exports.createUser = (data) => {
  return User.create({
    email: data.email,
    passwordHash: data.passwordHash,
  });
}; 