const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'supersecret';

exports.generateToken = (userId, role) => {
  return jwt.sign({ userId, role }, SECRET, { expiresIn: '1d' });
};

exports.verifyToken = (token) => {
  return jwt.verify(token, SECRET);
};
