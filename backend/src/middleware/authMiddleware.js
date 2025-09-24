const { verifyAccessToken, verifyRefreshToken, signAccessToken } = require('../utils/jwt');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');

const auth = (role) => async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) return res.status(401).json({ message: 'No token provided' });

    const payload = verifyAccessToken(token);
    // payload should contain { id, role }
    if (!payload || !payload.id) return res.status(401).json({ message: 'Invalid token' });
    if (role && payload.role !== role) {
      return res.status(403).json({ message: 'Forbidden: wrong role' });
    }

    const Model = payload.role === 'doctor' ? Doctor : Patient;
    const user = await Model.findById(payload.id);
    if (!user) return res.status(401).json({ message: 'User not found' });

    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

module.exports = auth;
