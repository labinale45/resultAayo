"use server";
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ 
      authorized: false,
      redirect: "/"
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    
    if (req.path === '/admin' && decoded.role !== 'Admin') {
      return res.status(403).json({
        authorized: false,
        message: "Access denied",
        redirect: "/"
      });
    }
    
    next();
  } catch (err) {
    res.status(401).json({ 
      authorized: false,
      message: 'Token is not valid',
      redirect: "/"
    });
  }
};

module.exports = authMiddleware;