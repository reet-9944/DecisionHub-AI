const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// AI decision engine
function analyzeDecision(domain, input) {
  const delay = ms => new Promise(r => setTimeout(r, ms));

  switch (domain) {
    case 'healthcare': {
      const { symptoms = '', age = '', medicalHistory = '', urgency = 'Medium' } = input;
      const isHighUrgency = urgency === 'High' || urgency === 'Emergency';
      return {
        recommendation: isHighUrgency
          ? `Given your symptoms (${symptoms}) and ${urgency.toLowerCase()} urgency, seek immediate medical attention. Do not delay — visit an emergency room or urgent care facility now.`
          : `Based on your reported symptoms (${symptoms}) at age ${age}, a consultation with a primary care physician is recommended within 24-48 hours. Monitor symptoms closely.`,
        reasoning: [
          `Symptom profile "${symptoms}" analyzed against common diagnostic patterns.`,
          `Age factor (${age}) considered for risk stratification.`,
          medicalHistory ? `Medical history (${medicalHistory}) cross-referenced for contraindications.` : 'No significant medical history provided.',
          `Urgency level "${urgency}" factored into recommendation priority.`,
        ],
        confidence: isHighUrgency ? 92 : 85,
        actions: isHighUrgency
          ? ['Go to emergency room immediately', 'Call emergency services if symptoms worsen', 'Do not drive yourself if feeling faint']
          : ['Schedule appointment with primary care doctor', 'Keep a symptom diary for the next 48 hours', 'Stay hydrated and rest', 'Seek emergency care if symptoms escalate'],
      };
    }

    case 'career': {
      const { currentRole = '', skills = '', experience = 0, careerGoal = '' } = input;
      const expNum = parseInt(experience) || 0;
      return {
        recommendation: `With ${expNum} years as a ${currentRole}, you are well-positioned to pursue your goal of ${careerGoal}. Focus on bridging skill gaps and building a strong portfolio over the next 12-18 months.`,
        reasoning: [
          `Current role "${currentRole}" provides a solid foundation for career progression.`,
          `Skills inventory (${skills}) evaluated against market demand for target role.`,
          `${expNum} years of experience places you in the ${expNum < 3 ? 'early' : expNum < 7 ? 'mid' : 'senior'}-career bracket.`,
          `Career goal "${careerGoal}" analyzed for feasibility and timeline.`,
        ],
        confidence: 88,
        actions: [
          `Identify 2-3 key skills missing for "${careerGoal}" and start learning`,
          'Build 2 portfolio projects demonstrating target-role competencies',
          'Connect with 5 professionals in your target role on LinkedIn',
          'Apply to stretch roles to gain relevant experience',
        ],
      };
    }

    case 'resume': {
      const { resumeText = '', targetRole = '' } = input;
      const wordCount = resumeText.split(' ').length;
      const hasNumbers = /\d+%|\$\d+|\d+ (people|users|clients|projects)/i.test(resumeText);
      const atsScore = Math.min(95, 55 + (hasNumbers ? 15 : 0) + (wordCount > 200 ? 10 : 0) + (resumeText.toLowerCase().includes(targetRole.toLowerCase().split(' ')[0]) ? 15 : 0));
      return {
        recommendation: `Your resume scores ${atsScore}/100 for ATS compatibility for the "${targetRole}" role. ${atsScore >= 75 ? 'Strong foundation — focus on keyword optimization.' : 'Significant improvements needed before applying.'}`,
        reasoning: [
          `Resume length (${wordCount} words) is ${wordCount < 300 ? 'too short' : wordCount > 700 ? 'too long' : 'appropriate'} for the target role.`,
          hasNumbers ? 'Quantified achievements detected — this is excellent for ATS.' : 'No quantified achievements found — this significantly reduces ATS score.',
          `Keyword alignment with "${targetRole}" is ${atsScore > 70 ? 'good' : 'weak'}.`,
          'Formatting and structure analyzed for ATS parsing compatibility.',
        ],
        confidence: 90,
        actions: [
          hasNumbers ? 'Good: Keep quantified achievements' : 'Add numbers to achievements (e.g., "increased sales by 30%")',
          `Include keywords from "${targetRole}" job postings in your skills section`,
          'Use standard section headers: Experience, Education, Skills',
          'Keep resume to 1-2 pages maximum',
          'Add a tailored professional summary at the top',
        ],
      };
    }

    case 'finance': {
      const { income = 0, savings = 0, riskTolerance = 'Moderate', financialGoal = '' } = input;
      const incomeNum = parseFloat(income) || 0;
      const savingsNum = parseFloat(savings) || 0;
      const monthsOfEmergencyFund = savingsNum / (incomeNum || 1);
      const strategies = {
        Conservative: '60% bonds, 30% index funds, 10% cash equivalents',
        Moderate: '50% index funds, 30% bonds, 15% growth stocks, 5% alternatives',
        Aggressive: '70% growth stocks, 20% index funds, 10% high-risk/high-reward assets',
      };
      return {
        recommendation: `Based on your $${incomeNum.toLocaleString()}/month income and ${riskTolerance.toLowerCase()} risk profile, a ${strategies[riskTolerance] || strategies.Moderate} allocation is recommended to achieve: ${financialGoal}.`,
        reasoning: [
          `Monthly income of $${incomeNum.toLocaleString()} supports a savings rate of 20-30% ($${Math.round(incomeNum * 0.2).toLocaleString()}-$${Math.round(incomeNum * 0.3).toLocaleString()}/month).`,
          `Current savings of $${savingsNum.toLocaleString()} represents ${monthsOfEmergencyFund.toFixed(1)} months of income.`,
          `${riskTolerance} risk tolerance mapped to optimal asset allocation strategy.`,
          `Goal "${financialGoal}" analyzed for timeline and capital requirements.`,
        ],
        confidence: 87,
        actions: [
          monthsOfEmergencyFund < 3 ? 'Priority: Build emergency fund to 3-6 months of expenses first' : 'Emergency fund is adequate — proceed to investing',
          `Automate $${Math.round(incomeNum * 0.2).toLocaleString()}/month into investment accounts`,
          'Max out tax-advantaged accounts (401k, IRA) before taxable investing',
          'Review and rebalance portfolio quarterly',
          'Consult a certified financial planner for personalized advice',
        ],
      };
    }

    case 'public': {
      const { location = '', serviceNeeded = '', eligibilityDetails = '' } = input;
      return {
        recommendation: `In ${location}, residents seeking ${serviceNeeded} may qualify for multiple federal and state programs. Based on your eligibility details, you likely qualify for at least 2-3 active assistance programs.`,
        reasoning: [
          `Location "${location}" cross-referenced with active federal and state program databases.`,
          `Service category "${serviceNeeded}" matched to relevant program types.`,
          eligibilityDetails ? `Eligibility details analyzed: "${eligibilityDetails}"` : 'General eligibility criteria applied.',
          'Application complexity and processing time estimated.',
        ],
        confidence: 82,
        actions: [
          `Visit benefits.gov and search for "${serviceNeeded}" programs in ${location}`,
          'Gather required documents: ID, proof of income, residency proof',
          'Contact your local social services office for in-person assistance',
          'Apply online first — most programs have 2-4 week processing times',
          'Ask about expedited processing if situation is urgent',
        ],
      };
    }

    case 'business': {
      const { industry = '', companyStage = '', businessChallenge = '', teamSize = 0 } = input;
      return {
        recommendation: `For a ${companyStage} ${industry} company facing "${businessChallenge}", the recommended strategy is to focus on product-market fit validation, lean operations, and targeted customer acquisition before scaling.`,
        reasoning: [
          `Industry "${industry}" analyzed for current market conditions and competitive landscape.`,
          `${companyStage} stage companies typically face challenges around ${companyStage === 'Idea Stage' || companyStage === 'Pre-Seed' ? 'validation and funding' : 'scaling and retention'}.`,
          `Challenge "${businessChallenge}" mapped to proven strategic frameworks.`,
          teamSize ? `Team of ${teamSize} considered for resource allocation recommendations.` : 'Team size not specified — recommendations are general.',
        ],
        confidence: 84,
        actions: [
          'Run 10 customer discovery interviews this week',
          'Define your single most important metric (North Star Metric)',
          'Build a 90-day roadmap with weekly milestones',
          'Identify your top 3 competitors and map their weaknesses',
          'Consider a strategic advisor or mentor in your industry',
        ],
      };
    }

    default:
      return {
        recommendation: 'Domain not recognized. Please select a valid domain.',
        reasoning: [],
        confidence: 0,
        actions: [],
      };
  }
}

app.post('/api/analyze', async (req, res) => {
  const { domain, input } = req.body;
  if (!domain || !input) {
    return res.status(400).json({ error: 'domain and input are required' });
  }

  // Simulate processing time
  await new Promise(r => setTimeout(r, 800));

  try {
    const result = analyzeDecision(domain, input);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Analysis failed', message: err.message });
  }
});

app.get('/api/health', (req, res) => res.json({ status: 'ok', version: '1.0.0' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`DecisionHub AI backend running on port ${PORT}`));
