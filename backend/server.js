require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { PDFParse } = require('pdf-parse');
const authRoutes = require('./routes/authRoutes');
const reportRoutes = require('./routes/reportRoutes');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

const { analyzeHealthcare } = require('./ai/healthcareAI');
const { analyzeCareer } = require('./ai/careerAI');
const { analyzeFinance } = require('./ai/financeAI');
const { analyzeResume } = require('./ai/resumeAI');
const { analyzePublicService } = require('./ai/publicServiceAI');
const { analyzeBusinessStrategy } = require('./ai/businessStrategyAI');

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/report', reportRoutes);

// Resume file upload + text extraction
app.post('/api/resume/parse', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });
    const { mimetype, buffer, originalname } = req.file;
    let text = '';

    if (mimetype === 'application/pdf' || originalname.endsWith('.pdf')) {
      const parser = new PDFParse({ data: buffer });
      const data = await parser.getText();
      text = data.text;
    } else if (
      mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      originalname.endsWith('.docx')
    ) {
      // Try mammoth if available, else extract readable text from buffer
      try {
        const mammoth = require('mammoth');
        const result = await mammoth.extractRawText({ buffer });
        text = result.value;
      } catch {
        // Fallback: extract printable ASCII from docx buffer
        text = buffer.toString('utf8').replace(/[^\x20-\x7E\n\r\t]/g, ' ').replace(/\s{3,}/g, '\n').trim();
      }
    } else {
      return res.status(400).json({ error: 'Only PDF and DOCX files are supported.' });
    }

    if (!text || text.trim().length < 30) return res.status(422).json({ error: 'Could not extract text from file. Try pasting the resume text instead.' });
    res.json({ text: text.trim() });
  } catch (err) {
    console.error('[resume/parse]', err.message);
    res.status(500).json({ error: 'File parsing failed: ' + err.message });
  }
});

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
