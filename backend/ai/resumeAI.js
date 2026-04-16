const Groq = require('groq-sdk');

const getGroq = () => new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `You are an elite resume coach, ATS expert, and career strategist. Perform a deep, comprehensive analysis.

Respond ONLY in raw JSON (no markdown, no code blocks):
{
  "overallScore": <0-100>,
  "atsScore": <0-100>,
  "skillMatchScore": <0-100>,
  "impactScore": <0-100>,
  "readabilityScore": <0-100>,
  "recommendation": "2-3 sentence executive summary of the resume",
  "scoreReasons": {
    "ats": "reason for ATS score",
    "skillMatch": "reason for skill match score",
    "impact": "reason for impact score",
    "readability": "reason for readability score"
  },
  "suggestions": [
    { "id": 1, "section": "Experience", "weak": "original weak line from resume", "strong": "improved version with action verb + metric", "type": "impact" },
    { "id": 2, "section": "Summary", "weak": "original weak line", "strong": "improved version", "type": "clarity" },
    { "id": 3, "section": "Skills", "weak": "original weak line", "strong": "improved version", "type": "keywords" },
    { "id": 4, "section": "Experience", "weak": "another weak line", "strong": "improved version", "type": "impact" },
    { "id": 5, "section": "Education", "weak": "weak line", "strong": "improved version", "type": "format" }
  ],
  "jobMatch": {
    "matchPercent": <0-100>,
    "missingKeywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
    "suggestedKeywords": ["keyword1", "keyword2", "keyword3"],
    "presentKeywords": ["keyword1", "keyword2", "keyword3", "keyword4"]
  },
  "hrScanSections": [
    { "section": "Name & Contact", "attention": "high", "reason": "First thing recruiters see" },
    { "section": "Summary/Objective", "attention": "high", "reason": "Sets the tone in 2 seconds" },
    { "section": "Work Experience", "attention": "high", "reason": "Most scrutinized section" },
    { "section": "Skills", "attention": "medium", "reason": "Scanned for keyword matches" },
    { "section": "Education", "attention": "low", "reason": "Glanced at briefly" },
    { "section": "Certifications", "attention": "medium", "reason": "Noticed if relevant" }
  ],
  "rejection": {
    "shortlistChance": <0-100>,
    "rejectionChance": <0-100>,
    "reasons": ["reason1", "reason2", "reason3"]
  },
  "skillGap": {
    "missingSkills": ["skill1", "skill2", "skill3", "skill4"],
    "roadmap": [
      { "skill": "skill name", "level": "Beginner", "resource": "resource suggestion", "project": "project idea" },
      { "skill": "skill name", "level": "Intermediate", "resource": "resource suggestion", "project": "project idea" },
      { "skill": "skill name", "level": "Advanced", "resource": "resource suggestion", "project": "project idea" }
    ]
  },
  "interviewQuestions": {
    "technical": [
      { "q": "question", "difficulty": "Easy" },
      { "q": "question", "difficulty": "Medium" },
      { "q": "question", "difficulty": "Hard" }
    ],
    "hr": [
      { "q": "question", "difficulty": "Easy" },
      { "q": "question", "difficulty": "Medium" }
    ],
    "behavioral": [
      { "q": "question", "difficulty": "Medium" },
      { "q": "question", "difficulty": "Hard" }
    ]
  },
  "hiddenMistakes": [
    { "type": "weak_verb", "original": "worked on", "suggestion": "engineered", "line": "context line" },
    { "type": "passive_voice", "original": "was responsible for", "suggestion": "led", "line": "context line" },
    { "type": "repetition", "original": "repeated word/phrase", "suggestion": "alternative", "line": "context line" },
    { "type": "vague", "original": "vague phrase", "suggestion": "specific alternative", "line": "context line" }
  ],
  "formattingIssues": ["issue1", "issue2", "issue3"],
  "improvedResume": "Full rewritten resume text in ATS-friendly format with strong action verbs, quantified achievements, and professional tone. Use plain text with clear section headers.",
  "factors": [
    { "label": "ATS Compatibility", "value": <0-100>, "color": "#14b8a6" },
    { "label": "Skill Match", "value": <0-100>, "color": "#38bdf8" },
    { "label": "Impact Score", "value": <0-100>, "color": "#818cf8" },
    { "label": "Readability", "value": <0-100>, "color": "#f59e0b" },
    { "label": "Keyword Density", "value": <0-100>, "color": "#f97316" }
  ],
  "confidence": <70-95>
}`;

async function analyzeResume({ resumeText, jobDescription, targetRole }) {
  if (!resumeText || resumeText.trim().length < 50) throw new Error('Resume content is too short. Please paste your full resume.');

  const userMsg = `Target Role: ${targetRole || 'Not specified'}
Job Description: ${jobDescription || 'Not provided'}

Resume Content:
${resumeText}

Analyze thoroughly and respond with raw JSON only.`;

  const response = await getGroq().chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userMsg },
    ],
    temperature: 0.3,
    max_tokens: 4096,
  });

  const text = response.choices[0]?.message?.content?.trim();
  if (!text) throw new Error('No response from AI.');
  const cleaned = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim();
  try { return JSON.parse(cleaned); } catch { throw new Error('AI returned unexpected format. Please try again.'); }
}

module.exports = { analyzeResume };
