const jwt = require('jsonwebtoken');

const secretKey = process.env.JWT_SECRET || 'defaultKey123';

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
  } catch (err) {
    console.error(err);
    res.status(403).json({ error: 'Invalid or expired token.' });
  }
};

module.exports = verifyToken;
