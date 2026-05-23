const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    // read token
    const token = req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.split(' ')[1]
      : null;

    if (!token) return res.status(401).json({ message: 'Not authenticated' });

    // Verify the token is not expired
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // finds  the actual user in DB and attach to request
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) return res.status(401).json({ message: 'User not found' });

    next(); 
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = { protect };