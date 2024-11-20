const { generateResponse } = require('../models/ai-model');

const getAIResponse = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ message: 'Prompt is required' });
    }

    const response = await generateResponse(prompt);
    res.status(200).json({ response });
  } catch (error) {
    console.error('AI Controller Error:', error);
    res.status(500).json({ message: 'Error generating AI response' });
  }
};

module.exports = { getAIResponse }; 