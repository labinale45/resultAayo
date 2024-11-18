const { generateResponse } = require('../models/ai-model');
const jwt = require('jsonwebtoken');

const getAIResponse = async (req, res) => {
  try {
    const { prompt } = req.body;
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!prompt) {
      return res.status(400).json({ message: 'Prompt is required' });
    }

    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Decode token to get user ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const response = await generateResponse(prompt, userId);
    res.status(200).json({ response });
  } catch (error) {
    console.error('AI Controller Error:', error);
    res.status(500).json({ message: 'Error generating AI response' });
  }
};

module.exports = { getAIResponse }; 