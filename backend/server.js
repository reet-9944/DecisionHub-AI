require('dotenv').config();
const express = require('express');
const cors = require('cors');

const { analyzeHealthcare } = require('./ai/healthcareAI');
const { analyzeCareer } = require('./ai/careerAI');
const { analyzeFinance } = require('./ai/financeAI');
const { analyzeResume } = require('./ai/resumeAI');
const { analyzePublicService } = require('./ai/publicServiceAI');
const { analyzeBusinessStrategy } = require('./ai/businessStrategyAI');

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

app.post('/api/analyze', async (req, res) => {
  const { domain, input } = req.body;
  if (!domain || !input) return res.status(400).json({ error: 'domain and input are required' });

  try {
    let result;
    switch (domain) {
      case 'healthcare': result = await analyzeHealthcare(input); break;
      case 'career':     result = await analyzeCareer(input); break;
      case 'finance':    result = await analyzeFinance(input); break;
      case 'resume':     result = await analyzeResume(input); break;
      case 'public':     result = await analyzePublicService(input); break;
      case 'business':   result = await analyzeBusinessStrategy(input); break;
      default: return res.status(400).json({ error: `Unknown domain: ${domain}` });
    }
    res.json(result);
  } catch (err) {
    console.error(`[${domain}] error:`, err.message);
    if (err.message.includes('429') || err.message.includes('quota')) {
      return res.status(429).json({ error: 'API quota exceeded. Please try again in a moment.' });
    }
    res.status(500).json({ error: err.message || 'Analysis failed. Please try again.' });
  }
});

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`DecisionHub AI backend running on port ${PORT}`));
