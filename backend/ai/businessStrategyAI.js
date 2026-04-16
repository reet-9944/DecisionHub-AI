const Groq = require('groq-sdk');

const getGroq = () => new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `You are a senior business strategy consultant AI. Analyze the company's situation and provide strategic recommendations.

Rules:
- Apply real frameworks (Porter's Five Forces, SWOT, Jobs-to-be-Done, OKRs)
- Be specific to the company stage and industry
- Identify the highest-leverage actions
- Be realistic about risks

Respond ONLY in raw JSON (no markdown, no code blocks):
{
  "recommendation": "2-3 sentence strategic recommendation",
  "reasoning": ["step 1", "step 2", "step 3", "step 4", "step 5"],
  "confidence": <60-95>,
  "factors": [
    { "label": "Market Opportunity", "value": <0-100>, "color": "#f97316" },
    { "label": "Competitive Advantage", "value": <0-100>, "color": "#7c3aed" },
    { "label": "Execution Feasibility", "value": <0-100>, "color": "#10b981" },
    { "label": "Resource Alignment", "value": <0-100>, "color": "#06b6d4" },
    { "label": "Risk Level", "value": <0-100>, "color": "#ef4444" }
  ],
  "radarData": [
    { "label": "Market", "value": <0-100> },
    { "label": "Advantage", "value": <0-100> },
    { "label": "Execution", "value": <0-100> },
    { "label": "Resources", "value": <0-100> },
    { "label": "Risk Mgmt", "value": <0-100> }
  ],
  "alternatives": ["alternative strategy 1", "alternative strategy 2", "alternative strategy 3"],
  "actions": ["action 1", "action 2", "action 3", "action 4", "action 5"],
  "dataSource": "Groq AI (Llama 3.3 70B) + HBR Strategic Frameworks"
}`;

async function analyzeBusinessStrategy({ industry, companyStage, businessChallenge, teamSize }) {
  if (!industry || !businessChallenge) throw new Error('Industry and business challenge are required.');

  const response = await getGroq().chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: `Industry: ${industry}\nCompany Stage: ${companyStage || 'Not specified'}\nBusiness Challenge: ${businessChallenge}\nTeam Size: ${teamSize || 'Not specified'}\n\nProvide strategic analysis as raw JSON only.` },
    ],
    temperature: 0.4,
    max_tokens: 1024,
  });

  const text = response.choices[0]?.message?.content?.trim();
  if (!text) throw new Error('No response from AI. Please try again.');
  const cleaned = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim();
  try { return JSON.parse(cleaned); } catch { throw new Error('AI returned unexpected format. Please try again.'); }
}

module.exports = { analyzeBusinessStrategy };
