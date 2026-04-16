const Groq = require('groq-sdk');
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const DISCLAIMER = {
  en: 'IMPORTANT: This is AI-generated information for educational purposes only. It is NOT a substitute for professional medical advice. Always consult a qualified healthcare provider.',
  hi: 'महत्वपूर्ण: यह केवल शैक्षिक उद्देश्यों के लिए AI-जनित जानकारी है। यह पेशेवर चिकित्सा सलाह का विकल्प नहीं है। हमेशा एक योग्य स्वास्थ्य सेवा प्रदाता से परामर्श करें।',
};

const getSystemPrompt = (lang) => {
  const isHindi = lang === 'hi';
  return `You are a knowledgeable medical AI assistant. Analyze the patient's symptoms and provide structured healthcare guidance.

Rules:
- Be medically accurate and evidence-based
- Always recommend consulting a real doctor
- Never diagnose definitively — use language like "may indicate", "could suggest"
- Flag emergency symptoms clearly
${isHindi ? '- IMPORTANT: Write ALL text values (recommendation, reasoning steps, alternatives, actions) in Hindi (Devanagari script). Only keep JSON keys and color hex codes in English.' : '- Write all text in English.'}

Respond ONLY in this exact raw JSON format (no markdown, no code blocks):
{
  "recommendation": "${isHindi ? 'हिंदी में 2-3 वाक्यों में मुख्य सिफारिश' : 'Main recommendation in 2-3 sentences'}",
  "reasoning": ["${isHindi ? 'हिंदी में चरण 1' : 'step 1'}", "${isHindi ? 'चरण 2' : 'step 2'}", "${isHindi ? 'चरण 3' : 'step 3'}", "${isHindi ? 'चरण 4' : 'step 4'}", "${isHindi ? 'चरण 5' : 'step 5'}"],
  "confidence": <number 60-95>,
  "factors": [
    { "label": "${isHindi ? 'लक्षण गंभीरता' : 'Symptom Severity'}", "value": <0-100>, "color": "#ef4444" },
    { "label": "${isHindi ? 'आयु जोखिम' : 'Age Risk Factor'}", "value": <0-100>, "color": "#f59e0b" },
    { "label": "${isHindi ? 'चिकित्सा इतिहास' : 'Medical History Weight'}", "value": <0-100>, "color": "#7c3aed" },
    { "label": "${isHindi ? 'तात्कालिकता' : 'Urgency Indicator'}", "value": <0-100>, "color": "#06b6d4" },
    { "label": "${isHindi ? 'उपचार उपलब्धता' : 'Treatment Availability'}", "value": <0-100>, "color": "#10b981" }
  ],
  "radarData": [
    { "label": "${isHindi ? 'गंभीरता' : 'Severity'}", "value": <0-100> },
    { "label": "${isHindi ? 'तात्कालिकता' : 'Urgency'}", "value": <0-100> },
    { "label": "${isHindi ? 'जोखिम' : 'Risk'}", "value": <0-100> },
    { "label": "${isHindi ? 'इतिहास' : 'History'}", "value": <0-100> },
    { "label": "${isHindi ? 'स्पष्टता' : 'Clarity'}", "value": <0-100> }
  ],
  "alternatives": ["${isHindi ? 'हिंदी में विकल्प 1' : 'alternative 1'}", "${isHindi ? 'विकल्प 2' : 'alternative 2'}", "${isHindi ? 'विकल्प 3' : 'alternative 3'}"],
  "actions": ["${isHindi ? 'हिंदी में कार्य 1' : 'action 1'}", "${isHindi ? 'कार्य 2' : 'action 2'}", "${isHindi ? 'कार्य 3' : 'action 3'}", "${isHindi ? 'कार्य 4' : 'action 4'}"],
  "dataSource": "Groq AI (Llama 3.3 70B) + WHO Clinical Guidelines"
}`;
};

async function analyzeHealthcare({ symptoms, age, medicalHistory, urgency, lang = 'en' }) {
  if (!symptoms || symptoms.trim().length < 3) {
    throw new Error(lang === 'hi'
      ? 'कृपया अपने लक्षणों का अधिक विस्तार से वर्णन करें।'
      : 'Please describe your symptoms in more detail.');
  }

  const isHindi = lang === 'hi';

  // For Hindi: use a two-step approach - get analysis then translate
  const userPrompt = `Patient Details:
- Symptoms: ${symptoms}
- Age: ${age || 'Not specified'}
- Medical History: ${medicalHistory || 'None provided'}
- Urgency Level: ${urgency || 'Medium'}

${isHindi ? 'IMPORTANT: You MUST write ALL text values in Hindi (हिंदी) Devanagari script. This is mandatory. Do not write any English words in the text values.' : ''}

Analyze these symptoms and respond with raw JSON only.`;

  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: getSystemPrompt(lang) },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.4,
    max_tokens: 1500,
  });

  const text = response.choices[0]?.message?.content?.trim();
  if (!text) throw new Error(isHindi ? 'AI से कोई प्रतिक्रिया नहीं। पुनः प्रयास करें।' : 'No response from AI. Please try again.');

  const cleaned = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim();

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error(isHindi ? 'AI ने अप्रत्याशित प्रारूप लौटाया। पुनः प्रयास करें।' : 'AI returned an unexpected format. Please try again.');
  }

  // If Hindi requested, translate text fields via a second call
  if (isHindi) {
    const textToTranslate = {
      recommendation: parsed.recommendation,
      reasoning: parsed.reasoning,
      alternatives: parsed.alternatives,
      actions: parsed.actions,
    };

    const translatePrompt = `Translate the following JSON text values to Hindi (Devanagari script). Keep the JSON structure exactly the same. Only translate the string values, do not change keys or numbers.

${JSON.stringify(textToTranslate)}

Return ONLY the translated raw JSON, no markdown, no explanation.`;

    try {
      const translateRes = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: 'You are a professional Hindi translator. Translate English medical text to natural Hindi (Devanagari). Return only raw JSON.' },
          { role: 'user', content: translatePrompt },
        ],
        temperature: 0.2,
        max_tokens: 1500,
      });

      const translatedText = translateRes.choices[0]?.message?.content?.trim()
        .replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim();

      const translated = JSON.parse(translatedText);
      parsed.recommendation = translated.recommendation || parsed.recommendation;
      parsed.reasoning = translated.reasoning || parsed.reasoning;
      parsed.alternatives = translated.alternatives || parsed.alternatives;
      parsed.actions = translated.actions || parsed.actions;
    } catch {
      // Translation failed — keep original, still works
    }
  }

  parsed.recommendation = `${parsed.recommendation}\n\n⚠️ ${DISCLAIMER[lang] || DISCLAIMER.en}`;
  parsed.dataSource = 'Groq AI (Llama 3.3 70B) + WHO Clinical Guidelines';
  parsed.lang = lang;

  return parsed;
}

module.exports = { analyzeHealthcare };
