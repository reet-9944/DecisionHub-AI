const Groq = require('groq-sdk');
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `You are an expert career coach and talent advisor. Analyze the user's career profile and provide structured professional guidance.

Rules:
- Be specific, actionable, and realistic
- Base advice on current job market trends
- Identify skill gaps clearly
- Suggest concrete next steps

Respond ONLY in raw JSON (no markdown, no code blocks):
{
  "recommendation": "2-3 sentence career recommendation",
  "reasoning": ["step 1", "step 2", "step 3", "step 4", "step 5"],
  "confidence": <60-95>,
  "factors": [
    { "label": "Experience Relevance", "value": <0-100>, "color": "#f59e0b" },
    { "label": "Market Demand", "value": <0-100>, "color": "#10b981" },
    { "label": "Skill Alignment", "value": <0-100>, "color": "#7c3aed" },
    { "label": "Salary Growth Potential", "value": <0-100>, "color": "#06b6d4" },
    { "label": "Transition Feasibility", "value": <0-100>, "color": "#ec4899" }
  ],
  "radarData": [
    { "label": "Experience", "value": <0-100> },
    { "label": "Skills", "value": <0-100> },
    { "label": "Market Fit", "value": <0-100> },
    { "label": "Salary", "value": <0-100> },
    { "label": "Growth", "value": <0-100> }
  ],
  "alternatives": ["alternative path 1", "alternative path 2", "alternative path 3"],
  "actions": ["action 1", "action 2", "action 3", "action 4", "action 5"],
  "dataSource": "Groq AI (Llama 3.3 70B) + LinkedIn Market Data"
}`;

async function analyzeCareer({ currentRole, skills, experience, careerGoal }) {
  if (!currentRole || !careerGoal) throw new Error('Current role and career goal are required.');

  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: `Current Role: ${currentRole}\nSkills: ${skills || 'Not specified'}\nYears of Experience: ${experience || 0}\nCareer Goal: ${careerGoal}\n\nProvide career analysis as raw JSON only.` },
    ],
    temperature: 0.4,
    max_tokens: 1024,
  });

  const text = response.choices[0]?.message?.content?.trim();
  if (!text) throw new Error('No response from AI. Please try again.');
  const cleaned = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim();
  try { return JSON.parse(cleaned); } catch { throw new Error('AI returned unexpected format. Please try again.'); }
}

module.exports = { analyzeCareer };
