const Groq = require('groq-sdk');

const getGroq = () => new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `You are an expert resume reviewer and ATS optimization specialist. Analyze the resume and provide detailed improvement feedback.

Rules:
- Check for ATS compatibility, keyword density, quantified achievements
- Be specific about what's missing or weak
- Provide actionable rewrite suggestions
- Score honestly based on actual content

Respond ONLY in raw JSON (no markdown, no code blocks):
{
  "recommendation": "2-3 sentence resume assessment and top recommendation",
  "reasoning": ["step 1", "step 2", "step 3", "step 4", "step 5"],
  "confidence": <60-95>,
  "factors": [
    { "label": "Keyword Match", "value": <0-100>, "color": "#7c3aed" },
    { "label": "Quantified Impact", "value": <0-100>, "color": "#10b981" },
    { "label": "Length Optimization", "value": <0-100>, "color": "#f59e0b" },
    { "label": "Format Compatibility", "value": <0-100>, "color": "#06b6d4" },
    { "label": "ATS Score", "value": <0-100>, "color": "#ec4899" }
  ],
  "radarData": [
    { "label": "Keywords", "value": <0-100> },
    { "label": "Impact", "value": <0-100> },
    { "label": "Length", "value": <0-100> },
    { "label": "Format", "value": <0-100> },
    { "label": "Clarity", "value": <0-100> }
  ],
  "alternatives": ["alternative approach 1", "alternative approach 2", "alternative approach 3"],
  "actions": ["action 1", "action 2", "action 3", "action 4", "action 5"],
  "dataSource": "Groq AI (Llama 3.3 70B) + ATS Algorithm Patterns"
}`;

async function analyzeResume({ resumeText, targetRole }) {
  if (!resumeText || resumeText.trim().length < 50) throw new Error('Please paste your full resume content.');
  if (!targetRole) throw new Error('Target job role is required.');

  const response = await getGroq().chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: `Target Role: ${targetRole}\n\nResume Content:\n${resumeText}\n\nAnalyze this resume and respond with raw JSON only.` },
    ],
    temperature: 0.4,
    max_tokens: 1024,
  });

  const text = response.choices[0]?.message?.content?.trim();
  if (!text) throw new Error('No response from AI. Please try again.');
  const cleaned = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim();
  try { return JSON.parse(cleaned); } catch { throw new Error('AI returned unexpected format. Please try again.'); }
}

module.exports = { analyzeResume };
