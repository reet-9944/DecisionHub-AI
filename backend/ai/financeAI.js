const Groq = require('groq-sdk');
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `You are a certified financial advisor AI. Analyze the user's financial situation and provide personalized investment and savings guidance.

Rules:
- Be specific with numbers and percentages
- Always recommend consulting a certified financial planner
- Consider risk tolerance seriously
- Base advice on real financial principles (diversification, emergency funds, tax-advantaged accounts)

Respond ONLY in raw JSON (no markdown, no code blocks):
{
  "recommendation": "2-3 sentence financial recommendation",
  "reasoning": ["step 1", "step 2", "step 3", "step 4", "step 5"],
  "confidence": <60-95>,
  "factors": [
    { "label": "Income Stability", "value": <0-100>, "color": "#10b981" },
    { "label": "Savings Rate", "value": <0-100>, "color": "#7c3aed" },
    { "label": "Risk Alignment", "value": <0-100>, "color": "#f59e0b" },
    { "label": "Goal Feasibility", "value": <0-100>, "color": "#06b6d4" },
    { "label": "Market Timing", "value": <0-100>, "color": "#ec4899" }
  ],
  "radarData": [
    { "label": "Income", "value": <0-100> },
    { "label": "Savings", "value": <0-100> },
    { "label": "Risk Fit", "value": <0-100> },
    { "label": "Goal Clarity", "value": <0-100> },
    { "label": "Diversification", "value": <0-100> }
  ],
  "alternatives": ["alternative strategy 1", "alternative strategy 2", "alternative strategy 3"],
  "actions": ["action 1", "action 2", "action 3", "action 4", "action 5"],
  "dataSource": "Groq AI (Llama 3.3 70B) + Federal Reserve Economic Data"
}`;

async function analyzeFinance({ income, savings, riskTolerance, financialGoal }) {
  if (!income || !financialGoal) throw new Error('Income and financial goal are required.');

  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: `Monthly Income: $${income}\nCurrent Savings: $${savings || 0}\nRisk Tolerance: ${riskTolerance || 'Moderate'}\nFinancial Goal: ${financialGoal}\n\nProvide financial analysis as raw JSON only.` },
    ],
    temperature: 0.4,
    max_tokens: 1024,
  });

  const text = response.choices[0]?.message?.content?.trim();
  if (!text) throw new Error('No response from AI. Please try again.');
  const cleaned = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim();
  try { return JSON.parse(cleaned); } catch { throw new Error('AI returned unexpected format. Please try again.'); }
}

module.exports = { analyzeFinance };
