const verifyAccessToken = require('./jwt.js'); // Adjust the import path as necessary

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  // Uses your verifyAccessToken function that returns payload or null
  const decoded = verifyAccessToken(token);
  
  if (!decoded) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }

  req.user = decoded; // Contains { id, role } from your signAccessToken
  next();
};

module.exports = authenticateToken ;