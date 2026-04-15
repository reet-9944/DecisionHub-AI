const express = require('express');
const router = express.Router();
const { analyzeHealthcare } = require('../ai/healthcareAI');

router.post('/', async (req, res) => {
  const { symptoms, age, medicalHistory, urgency } = req.body;

  if (!symptoms || symptoms.trim().length < 3) {
    return res.status(400).json({ error: 'Please provide a valid symptom description.' });
  }

  try {
    const result = await analyzeHealthcare({ symptoms, age, medicalHistory, urgency });
    res.json(result);
  } catch (err) {
    console.error('Healthcare AI error:', err.message);

    if (err.message.includes('API_KEY') || err.message.includes('API key')) {
      return res.status(500).json({ error: 'Gemini API key is missing or invalid. Check your .env file.' });
    }
    if (err.message.includes('quota') || err.message.includes('429')) {
      return res.status(429).json({ error: 'API quota exceeded. Please try again later.' });
    }

    res.status(500).json({ error: err.message || 'Healthcare analysis failed. Please try again.' });
  }
});

module.exports = router;
