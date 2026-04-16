const Groq = require('groq-sdk');

const getGroq = () => new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `You are a public services navigator AI. Help users find government assistance programs they may qualify for based on their location and situation.

Rules:
- Be specific about real programs (SNAP, Medicaid, Section 8, TANF, etc.)
- Mention eligibility requirements clearly
- Provide application steps
- Always recommend contacting local offices for confirmation

Respond ONLY in raw JSON (no markdown, no code blocks):
{
  "recommendation": "2-3 sentence summary of programs available and eligibility",
  "reasoning": ["step 1", "step 2", "step 3", "step 4", "step 5"],
  "confidence": <60-95>,
  "factors": [
    { "label": "Program Availability", "value": <0-100>, "color": "#10b981" },
    { "label": "Eligibility Match", "value": <0-100>, "color": "#7c3aed" },
    { "label": "Location Coverage", "value": <0-100>, "color": "#f59e0b" },
    { "label": "Application Complexity", "value": <0-100>, "color": "#06b6d4" },
    { "label": "Processing Speed", "value": <0-100>, "color": "#ec4899" }
  ],
  "radarData": [
    { "label": "Availability", "value": <0-100> },
    { "label": "Eligibility", "value": <0-100> },
    { "label": "Coverage", "value": <0-100> },
    { "label": "Speed", "value": <0-100> },
    { "label": "Support", "value": <0-100> }
  ],
  "alternatives": ["alternative program 1", "alternative program 2", "alternative program 3"],
  "actions": ["action 1", "action 2", "action 3", "action 4", "action 5"],
  "dataSource": "Groq AI (Llama 3.3 70B) + USA.gov Benefits Database"
}`;

async function analyzePublicService({ location, serviceNeeded, eligibilityDetails }) {
  if (!location || !serviceNeeded) throw new Error('Location and service type are required.');

  const response = await getGroq().chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: `Location: ${location}\nService Needed: ${serviceNeeded}\nEligibility Details: ${eligibilityDetails || 'Not provided'}\n\nFind relevant programs and respond with raw JSON only.` },
    ],
    temperature: 0.4,
    max_tokens: 1024,
  });

  const text = response.choices[0]?.message?.content?.trim();
  if (!text) throw new Error('No response from AI. Please try again.');
  const cleaned = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim();
  try { return JSON.parse(cleaned); } catch { throw new Error('AI returned unexpected format. Please try again.'); }
}

module.exports = { analyzePublicService };
