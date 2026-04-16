const express = require('express');
const multer = require('multer');

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    allowed.includes(file.mimetype) ? cb(null, true) : cb(new Error('Only PDF and image files allowed.'));
  },
});

const ANALYSIS_PROMPT = `You are an expert medical report analyzer. The user has uploaded a medical lab report image.

IMPORTANT: Look at the image carefully and extract ALL test names, values, units, and reference ranges visible.

Then analyze and respond ONLY in this exact raw JSON (no markdown, no code blocks, no explanation):
{
  "overallStatus": "NORMAL",
  "summary": "2-3 sentence plain language summary of the report",
  "reportType": "e.g. Complete Blood Count, Lipid Profile, Urine Test",
  "values": [
    {
      "name": "Test name",
      "value": "Patient value with unit",
      "normalRange": "Normal range from report",
      "status": "NORMAL",
      "explanation": "Simple 1-sentence explanation a patient can understand"
    }
  ],
  "abnormalFindings": ["finding 1", "finding 2"],
  "recommendations": ["recommendation 1", "recommendation 2", "recommendation 3"],
  "specialistNeeded": "Specialist type or null",
  "urgency": "LOW",
  "needsDoctor": false
}

overallStatus must be: NORMAL, NEEDS_ATTENTION, or SERIOUS
status for each value must be: NORMAL, BORDERLINE, or ABNORMAL
urgency must be: LOW, MEDIUM, HIGH, or EMERGENCY`;

router.post('/analyze', upload.single('report'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Please upload a medical report file.' });

  const { lang = 'en' } = req.body;
  const Groq = require('groq-sdk');
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

  try {
    let result;

    if (req.file.mimetype === 'application/pdf') {
      // PDF: extract text then analyze
      const pdfParse = require('pdf-parse');
      const data = await pdfParse(req.file.buffer);
      const text = data.text;

      if (!text || text.trim().length < 10) {
        return res.status(400).json({ error: 'Could not extract text from PDF. Please try uploading an image instead.' });
      }

      const langNote = lang === 'hi' ? '\nWrite ALL text values in Hindi (Devanagari script). Keep JSON keys in English.' : '';

      const response = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: ANALYSIS_PROMPT + langNote },
          { role: 'user', content: `Analyze this medical report:\n\n${text.slice(0, 4000)}` },
        ],
        temperature: 0.2,
        max_tokens: 2000,
      });

      const raw = response.choices[0]?.message?.content?.trim()
        .replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim();
      result = JSON.parse(raw);

    } else {
      // Image: use Groq vision model
      const base64 = req.file.buffer.toString('base64');
      const mimeType = req.file.mimetype;
      const langNote = lang === 'hi' ? ' Write ALL text values in Hindi (Devanagari script). Keep JSON keys in English.' : '';

      const response = await groq.chat.completions.create({
        model: 'meta-llama/llama-4-maverick-17b-128e-instruct',
        messages: [{
          role: 'user',
          content: [
            {
              type: 'text',
              text: ANALYSIS_PROMPT + langNote,
            },
            {
              type: 'image_url',
              image_url: { url: `data:${mimeType};base64,${base64}` },
            },
          ],
        }],
        temperature: 0.2,
        max_tokens: 2000,
      });

      const raw = response.choices[0]?.message?.content?.trim()
        .replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim();
      result = JSON.parse(raw);
    }

    res.json(result);

  } catch (err) {
    console.error('Report error:', err.message);
    if (err.message.includes('JSON') || err.message.includes('token')) {
      return res.status(500).json({ error: 'AI could not read the report clearly. Please upload a clearer image or PDF.' });
    }
    if (err.message.includes('model') || err.message.includes('404')) {
      return res.status(500).json({ error: 'Vision model unavailable. Please upload a PDF version of your report instead.' });
    }
    res.status(500).json({ error: err.message || 'Report analysis failed. Please try again.' });
  }
});

module.exports = router;
