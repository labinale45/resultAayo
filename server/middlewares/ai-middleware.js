const jwt = require('jsonwebtoken');

const aiAuthMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('AI Auth Middleware Error:', error);
    res.status(401).json({ message: 'Invalid authentication' });
  }
};

module.exports = aiAuthMiddleware; 