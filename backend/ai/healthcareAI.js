const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const DISCLAIMER =
  'IMPORTANT: This is AI-generated information for educational purposes only. ' +
  'It is NOT a substitute for professional medical advice, diagnosis, or treatment. ' +
  'Always consult a qualified healthcare provider for medical concerns.';

const SYSTEM_PROMPT = `You are a knowledgeable medical AI assistant. Analyze the patient's symptoms and provide structured healthcare guidance.

Rules:
- Be medically accurate and evidence-based
- Always recommend consulting a real doctor
- Never diagnose definitively — use language like "may indicate", "could suggest"
- Flag emergency symptoms clearly

Respond ONLY in this exact raw JSON format (no markdown, no code blocks):
{
  "recommendation": "Main recommendation in 2-3 sentences",
  "reasoning": ["step 1", "step 2", "step 3", "step 4", "step 5"],
  "confidence": <number 60-95>,
  "factors": [
    { "label": "Symptom Severity", "value": <0-100>, "color": "#ef4444" },
    { "label": "Age Risk Factor", "value": <0-100>, "color": "#f59e0b" },
    { "label": "Medical History Weight", "value": <0-100>, "color": "#7c3aed" },
    { "label": "Urgency Indicator", "value": <0-100>, "color": "#06b6d4" },
    { "label": "Treatment Availability", "value": <0-100>, "color": "#10b981" }
  ],
  "radarData": [
    { "label": "Severity", "value": <0-100> },
    { "label": "Urgency", "value": <0-100> },
    { "label": "Risk", "value": <0-100> },
    { "label": "History", "value": <0-100> },
    { "label": "Clarity", "value": <0-100> }
  ],
  "alternatives": ["alternative 1", "alternative 2", "alternative 3"],
  "actions": ["action 1", "action 2", "action 3", "action 4"],
  "dataSource": "Groq AI (Llama 3.3 70B) + WHO Clinical Guidelines"
}`;

async function analyzeHealthcare({ symptoms, age, medicalHistory, urgency }) {
  if (!symptoms || symptoms.trim().length < 3) {
    throw new Error('Please describe your symptoms in more detail.');
  }

  const userPrompt = `Patient Details:
- Symptoms: ${symptoms}
- Age: ${age || 'Not specified'}
- Medical History: ${medicalHistory || 'None provided'}
- Urgency Level: ${urgency || 'Medium'}

Analyze these symptoms and respond with raw JSON only.`;

  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.4,
    max_tokens: 1024,
  });

  const text = response.choices[0]?.message?.content?.trim();
  if (!text) throw new Error('No response from AI. Please try again.');

  // Strip markdown code fences if present
  const cleaned = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim();

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error('AI returned an unexpected format. Please try again.');
  }

  parsed.recommendation = `${parsed.recommendation}\n\n⚠️ ${DISCLAIMER}`;
  parsed.dataSource = 'Groq AI (Llama 3.3 70B) + WHO Clinical Guidelines';

  return parsed;
}

module.exports = { analyzeHealthcare };
