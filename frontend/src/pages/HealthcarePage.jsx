import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { analyzeWithAI } from '../services/api';

const EMERGENCY_KEYWORDS = [
  'chest pain','heart attack','can\'t breathe','difficulty breathing','stroke',
  'unconscious','not breathing','severe bleeding','overdose','seizure',
  'choking','anaphylaxis','allergic reaction','suicide','poisoning',
];

const SPECIALISTS = {
  heart: 'Cardiologist', chest: 'Cardiologist', cardiac: 'Cardiologist',
  skin: 'Dermatologist', rash: 'Dermatologist', acne: 'Dermatologist',
  bone: 'Orthopedist', joint: 'Orthopedist', fracture: 'Orthopedist',
  child: 'Pediatrician', baby: 'Pediatrician', infant: 'Pediatrician',
  eye: 'Ophthalmologist', vision: 'Ophthalmologist', blind: 'Ophthalmologist',
  mental: 'Psychiatrist', anxiety: 'Psychiatrist', depression: 'Psychiatrist',
  teeth: 'Dentist', tooth: 'Dentist', dental: 'Dentist',
  stomach: 'Gastroenterologist', digestion: 'Gastroenterologist', liver: 'Gastroenterologist',
  lung: 'Pulmonologist', breathing: 'Pulmonologist', asthma: 'Pulmonologist',
  brain: 'Neurologist', headache: 'Neurologist', migraine: 'Neurologist',
};

const LANGS = { en: 'English', hi: 'हिंदी' };

const T = {
  en: {
    title: 'Healthcare AI',
    subtitle: 'Intelligent symptom analysis & health guidance',
    heroTitle: 'Your AI Health Assistant',
    heroDesc: 'Analyze symptoms, detect emergencies, get specialist recommendations — powered by real AI',
    symptomChecker: 'Symptom Checker',
    talkToAI: 'Talk to AI',
    healthHistory: 'Health History',
    back: '← Back',
    reset: '↺ Reset',
    stepOf: (s, t) => `Step ${s} of ${t}`,
    complete: (p) => `${p}% complete`,
    next: 'Next →',
    analyze: '🔍 Analyze with AI',
    skip: 'Skip',
    listening: '🔴 Listening... speak now',
    analyzing: 'AI is analyzing your symptoms...',
    processingWith: 'Processing with Groq Llama 3.3 70B',
    analysisComplete: 'AI Analysis Complete',
    confidence: (v) => `${v}% Confidence`,
    recommendation: 'AI Recommendation',
    readAloud: '🔊 Read aloud',
    specialist: 'Recommended Specialist',
    specialistDesc: 'Based on your symptoms',
    specialistTip: (s) => `💡 Search "${s} near me" on Google Maps to find local doctors`,
    nearbyTitle: '📍 Nearby Hospitals & Pharmacies',
    nearbyDesc: 'Find medical facilities near your current location',
    allowLocation: 'Allow Location Access',
    locating: 'Getting your location...',
    openMaps: 'Open in Google Maps',
    nearbyHospitals: 'Nearby Hospitals',
    nearbyPharmacy: 'Nearby Pharmacies',
    nearbyClinic: 'Nearby Clinics',
    locationDenied: 'Location access denied. Please allow location in browser settings.',
    riskFactors: 'Risk Factors',
    reasoning: '🧠 AI Reasoning',
    actions: '✅ Recommended Actions',
    alternatives: '💡 Alternative Approaches',
    disclaimer: 'Medical Disclaimer',
    disclaimerText: 'This AI provides informational support only and is NOT a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider for medical concerns. In case of emergency, call 112 immediately.',
    resultDisclaimer: 'This AI analysis is for informational purposes only. It is NOT a medical diagnosis. Please consult a qualified healthcare professional before making any medical decisions.',
    startNew: '↺ Start New Analysis',
    tryAgain: 'Try Again',
    recentQueries: '📋 Recent Health Queries',
    emergencyTitle: 'EMERGENCY DETECTED',
    emergencyDesc: 'Your symptoms may require immediate medical attention',
    callAmbulance: '🚑 Ambulance 108',
    call112: '📞 Call 112',
    features: [
      { icon: '🚨', title: 'Emergency Detection', desc: 'Instantly detects critical symptoms and shows emergency contacts' },
      { icon: '🧠', title: 'AI Diagnosis', desc: 'Multi-step guided analysis powered by Groq Llama 3.3 70B' },
      { icon: '👨‍⚕️', title: 'Doctor Recommendation', desc: 'Get matched to the right specialist based on your symptoms' },
      { icon: '🎙️', title: 'Voice Input', desc: 'Speak your symptoms in English or Hindi' },
      { icon: '📈', title: 'Health History', desc: 'Track your previous queries and health patterns' },
      { icon: '🌐', title: 'Multi-language', desc: 'Full support for English and Hindi' },
    ],
    steps: [
      { key: 'symptoms', question: 'What symptoms are you experiencing?', placeholder: 'e.g. headache, fever, fatigue...', type: 'textarea' },
      { key: 'duration', question: 'How long have you had these symptoms?', placeholder: 'e.g. 2 days, 1 week...', type: 'text' },
      { key: 'age', question: 'What is your age?', placeholder: 'e.g. 28', type: 'number' },
      { key: 'severity', question: 'How severe are your symptoms?', type: 'select', options: ['Mild - manageable', 'Moderate - affecting daily life', 'Severe - very painful', 'Emergency - need help now'] },
      { key: 'medicalHistory', question: 'Any existing conditions or medications?', placeholder: 'e.g. diabetes, hypertension, aspirin...', type: 'textarea', optional: true },
    ],
  },
  hi: {
    title: 'स्वास्थ्य AI',
    subtitle: 'बुद्धिमान लक्षण विश्लेषण और स्वास्थ्य मार्गदर्शन',
    heroTitle: 'आपका AI स्वास्थ्य सहायक',
    heroDesc: 'लक्षणों का विश्लेषण करें, आपातकाल का पता लगाएं, विशेषज्ञ सिफारिशें प्राप्त करें',
    symptomChecker: 'लक्षण जांचें',
    talkToAI: 'AI से बात करें',
    healthHistory: 'स्वास्थ्य इतिहास',
    back: '← वापस',
    reset: '↺ रीसेट',
    stepOf: (s, t) => `चरण ${s} / ${t}`,
    complete: (p) => `${p}% पूर्ण`,
    next: 'अगला →',
    analyze: '🔍 AI से विश्लेषण करें',
    skip: 'छोड़ें',
    listening: '🔴 सुन रहा है... बोलें',
    analyzing: 'AI आपके लक्षणों का विश्लेषण कर रहा है...',
    processingWith: 'Groq Llama 3.3 70B से प्रोसेस हो रहा है',
    analysisComplete: 'AI विश्लेषण पूर्ण',
    confidence: (v) => `${v}% विश्वास`,
    recommendation: 'AI सिफारिश',
    readAloud: '🔊 ज़ोर से पढ़ें',
    specialist: 'अनुशंसित विशेषज्ञ',
    specialistDesc: 'आपके लक्षणों के आधार पर',
    specialistTip: (s) => `💡 Google Maps पर "${s} near me" खोजें`,
    nearbyTitle: '📍 नजदीकी अस्पताल और फार्मेसी',
    nearbyDesc: 'आपके वर्तमान स्थान के पास चिकित्सा सुविधाएं खोजें',
    allowLocation: 'स्थान की अनुमति दें',
    locating: 'आपका स्थान प्राप्त हो रहा है...',
    openMaps: 'Google Maps में खोलें',
    nearbyHospitals: 'नजदीकी अस्पताल',
    nearbyPharmacy: 'नजदीकी फार्मेसी',
    nearbyClinic: 'नजदीकी क्लिनिक',
    locationDenied: 'स्थान की अनुमति अस्वीकार। कृपया ब्राउज़र सेटिंग में अनुमति दें।',
    riskFactors: 'जोखिम कारक',
    reasoning: '🧠 AI तर्क',
    actions: '✅ अनुशंसित कार्य',
    alternatives: '💡 वैकल्पिक उपाय',
    disclaimer: 'चिकित्सा अस्वीकरण',
    disclaimerText: 'यह AI केवल सूचनात्मक सहायता प्रदान करता है। यह पेशेवर चिकित्सा सलाह का विकल्प नहीं है। किसी भी स्वास्थ्य समस्या के लिए योग्य डॉक्टर से परामर्श लें। आपातकाल में तुरंत 112 पर कॉल करें।',
    resultDisclaimer: 'यह AI विश्लेषण केवल जानकारी के लिए है। यह चिकित्सा निदान नहीं है। कोई भी चिकित्सा निर्णय लेने से पहले योग्य स्वास्थ्य सेवा प्रदाता से परामर्श करें।',
    startNew: '↺ नया विश्लेषण शुरू करें',
    tryAgain: 'पुनः प्रयास करें',
    recentQueries: '📋 हाल की स्वास्थ्य जांच',
    emergencyTitle: 'आपातकाल का पता चला',
    emergencyDesc: 'आपके लक्षणों के लिए तत्काल चिकित्सा ध्यान की आवश्यकता हो सकती है',
    callAmbulance: '🚑 एम्बुलेंस 108',
    call112: '📞 112 पर कॉल करें',
    features: [
      { icon: '🚨', title: 'आपातकाल पहचान', desc: 'गंभीर लक्षणों का तुरंत पता लगाता है और आपातकालीन संपर्क दिखाता है' },
      { icon: '🧠', title: 'AI निदान', desc: 'Groq Llama 3.3 70B द्वारा संचालित बहु-चरण विश्लेषण' },
      { icon: '👨‍⚕️', title: 'डॉक्टर सिफारिश', desc: 'लक्षणों के आधार पर सही विशेषज्ञ से मिलान' },
      { icon: '🎙️', title: 'आवाज़ इनपुट', desc: 'हिंदी या अंग्रेजी में लक्षण बोलें' },
      { icon: '📈', title: 'स्वास्थ्य इतिहास', desc: 'पिछली जांच और स्वास्थ्य पैटर्न ट्रैक करें' },
      { icon: '🌐', title: 'बहुभाषी', desc: 'अंग्रेजी और हिंदी में पूर्ण समर्थन' },
    ],
    steps: [
      { key: 'symptoms', question: 'आप कौन से लक्षण अनुभव कर रहे हैं?', placeholder: 'जैसे: सिरदर्द, बुखार, थकान...', type: 'textarea' },
      { key: 'duration', question: 'ये लक्षण कब से हैं?', placeholder: 'जैसे: 2 दिन, 1 हफ्ता...', type: 'text' },
      { key: 'age', question: 'आपकी उम्र क्या है?', placeholder: 'जैसे: 28', type: 'number' },
      { key: 'severity', question: 'आपके लक्षण कितने गंभीर हैं?', type: 'select', options: ['हल्के - सहनीय', 'मध्यम - दैनिक जीवन प्रभावित', 'गंभीर - बहुत दर्दनाक', 'आपातकाल - तुरंत मदद चाहिए'] },
      { key: 'medicalHistory', question: 'कोई मौजूदा बीमारी या दवाएं?', placeholder: 'जैसे: मधुमेह, उच्च रक्तचाप, एस्पिरिन...', type: 'textarea', optional: true },
    ],
  },
};

export default function HealthcarePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [lang, setLang] = useState('en');
  const [mode, setMode] = useState('home'); // home | symptom | voice | result
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [emergency, setEmergency] = useState(false);
  const [specialist, setSpecialist] = useState(null);
  const [listening, setListening] = useState(false);
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem(`health_history_${user?.id || user?.email}`) || '[]'); } catch { return []; }
  });
  const t = T[lang];
  const STEPS = t.steps;
  const color = '#9bdfebff';
  const langRef = useRef(lang);
  useEffect(() => { langRef.current = lang; }, [lang]);

  const checkEmergency = (text) => {
    const lower = text.toLowerCase();
    return EMERGENCY_KEYWORDS.some(k => lower.includes(k));
  };

  const detectSpecialist = (text) => {
    const lower = text.toLowerCase();
    for (const [keyword, spec] of Object.entries(SPECIALISTS)) {
      if (lower.includes(keyword)) return spec;
    }
    return 'General Physician';
  };

  const handleAnswerChange = (val) => {
    setCurrentAnswer(val);
    if (step === 0 && checkEmergency(val)) setEmergency(true);
    else if (step === 0) setEmergency(false);
  };

  const handleNext = () => {
    if (!currentAnswer && !STEPS[step].optional) return;
    const newAnswers = { ...answers, [STEPS[step].key]: currentAnswer };
    setAnswers(newAnswers);
    setCurrentAnswer('');
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      submitAnalysis(newAnswers);
    }
  };

  const submitAnalysis = async (data) => {
    setLoading(true);
    setMode('result');
    const spec = detectSpecialist(data.symptoms || '');
    setSpecialist(spec);
    try {
      const res = await analyzeWithAI('healthcare', {
        symptoms: data.symptoms,
        age: data.age,
        medicalHistory: data.medicalHistory || '',
        urgency: data.severity?.includes('Emergency') || data.severity?.includes('आपातकाल') ? 'Emergency'
          : data.severity?.includes('Severe') || data.severity?.includes('गंभीर') ? 'High'
          : data.severity?.includes('Moderate') || data.severity?.includes('मध्यम') ? 'Medium' : 'Low',
        lang,
      });
      setResult(res);
      const entry = { date: new Date().toLocaleDateString(), symptoms: data.symptoms, confidence: res.confidence };
      const newHistory = [entry, ...history].slice(0, 10);
      setHistory(newHistory);
      localStorage.setItem(`health_history_${user?.id || user?.email}`, JSON.stringify(newHistory));
    } catch (err) {
      setResult({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  const startVoice = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Voice input not supported in this browser. Try Chrome.');
      return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SR();
    recognition.lang = lang === 'hi' ? 'hi-IN' : 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setCurrentAnswer(transcript);
      handleAnswerChange(transcript);
      setListening(false);
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  };

  const [voices, setVoices] = useState([]);

  // Load voices — browser loads them async
  useEffect(() => {
    const load = () => setVoices(window.speechSynthesis.getVoices());
    load();
    window.speechSynthesis.onvoiceschanged = load;
    return () => { window.speechSynthesis.onvoiceschanged = null; };
  }, []);

  const speak = (text) => {
    window.speechSynthesis?.cancel();

    // Use Google Translate TTS — works like Google, no install needed
    const cleanText = text.replace(/[⚠️✦→←↺•]/g, '').trim();
    const chunks = cleanText.match(/.{1,200}/g) || [cleanText];

    let index = 0;
    const playNext = () => {
      if (index >= chunks.length) return;
      const chunk = chunks[index++];
      const langCode = lang === 'hi' ? 'hi' : 'en';
      const url = `https://translate.googleapis.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(chunk)}&tl=${langCode}&client=gtx&ttsspeed=0.9`;
      const audio = new Audio(url);
      audio.onended = playNext;
      audio.onerror = () => {
        // Fallback to browser TTS if Google fails
        const utt = new SpeechSynthesisUtterance(chunk);
        utt.lang = lang === 'hi' ? 'hi-IN' : 'en-US';
        window.speechSynthesis.speak(utt);
      };
      audio.play().catch(() => {
        const utt = new SpeechSynthesisUtterance(chunk);
        utt.lang = lang === 'hi' ? 'hi-IN' : 'en-US';
        window.speechSynthesis.speak(utt);
      });
    };
    playNext();
  };

  const reset = () => {
    setMode('home'); setStep(0); setAnswers({});
    setCurrentAnswer(''); setResult(null); setEmergency(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #060a0f 0%, #080d12 40%, #060b0e 100%)', paddingTop: '64px' }}>
      {/* Emergency Banner */}
      <AnimatePresence>
        {emergency && (
          <motion.div initial={{ y: -80 }} animate={{ y: 0 }} exit={{ y: -80 }}
            style={{
              position: 'fixed', top: 64, left: 0, right: 0, zIndex: 999,
              background: 'linear-gradient(135deg, #0f766e, #0e7490)',
              padding: '1rem 2rem', display: 'flex', alignItems: 'center',
              justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem',
              boxShadow: '0 4px 32px rgba(15,118,110,0.4)',
            }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: 28 }}>🚨</span>
              <div>
                <div style={{ color: '#fff', fontWeight: 800, fontSize: 16 }}>{t.emergencyTitle}</div>
                <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13 }}>{t.emergencyDesc}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <a href="tel:112" style={{
                background: '#fff', color: '#0f766e', padding: '10px 20px',
                borderRadius: 10, fontWeight: 800, fontSize: 14, textDecoration: 'none',
                display: 'flex', alignItems: 'center', gap: '6px',
              }}>📞 Call 112</a>
              <a href="tel:108" style={{
                background: 'rgba(255,255,255,0.2)', color: '#fff', padding: '10px 20px',
                borderRadius: 10, fontWeight: 700, fontSize: 14, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.4)',
              }}>{t.callAmbulance}</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div style={{ background: '#060a0f', borderBottom: '1px solid rgba(20,184,166,0.08)', padding: '2rem' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', fontSize: 13 }}>{t.back}</button>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(20,184,166,0.12)', border: '1px solid rgba(20,184,166,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>🏥</div>
              <div>
                <h1 style={{ color: '#fff', fontSize: 26, fontWeight: 800, margin: 0 }}>{t.title}</h1>
                <p style={{ color: '#64748b', fontSize: 13, margin: 0 }}>{t.subtitle}</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {/* Language Toggle */}
              <div style={{ display: 'flex', background: '#13131f', borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                {Object.entries(LANGS).map(([k, v]) => (
                  <button key={k} onClick={() => setLang(k)} style={{
                    padding: '6px 14px', background: lang === k ? '#14b8a6' : 'none',
                    border: 'none', color: lang === k ? '#fff' : '#64748b',
                    fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                  }}>{v}</button>
                ))}
              </div>
              {mode !== 'home' && (
                <button onClick={reset} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '6px 14px', color: '#94a3b8', fontSize: 12, cursor: 'pointer' }}>
                  {t.reset}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '2rem 1.5rem' }}>

        {/* HOME MODE */}
        {mode === 'home' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

            {/* Hero */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(20,184,166,0.08), rgba(56,189,248,0.05), rgba(99,102,241,0.04))',
              border: '1px solid rgba(20,184,166,0.18)', borderRadius: 24,
              padding: '3rem 2rem', textAlign: 'center', marginBottom: '2rem', position: 'relative', overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(20,184,166,0.12), transparent)', pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', bottom: -60, left: -30, width: 180, height: 180, borderRadius: '50%', background: 'radial-gradient(circle, rgba(56,189,248,0.07), transparent)', pointerEvents: 'none' }} />
              <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 3, repeat: Infinity }} style={{ fontSize: 56, marginBottom: '1rem' }}>🏥</motion.div>
              <h2 style={{ color: '#fff', fontSize: 28, fontWeight: 800, marginBottom: '0.75rem' }}>
                {t.heroTitle}
              </h2>
              <p style={{ color: '#64748b', fontSize: 15, maxWidth: 500, margin: '0 auto 2rem' }}>
                {t.heroDesc}
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <ActionBtn icon="🩺" label={t.symptomChecker} color="#14b8a6" onClick={() => setMode('symptom')} />
                <ActionBtn icon="🎙️" label={t.talkToAI} color="#818cf8" onClick={() => { setMode('symptom'); }} />
                <ActionBtn icon="📊" label={t.healthHistory} color="#38bdf8" onClick={() => document.getElementById('history-section')?.scrollIntoView({ behavior: 'smooth' })} />
                <ActionBtn icon="🔬" label={lang === 'hi' ? 'रिपोर्ट विश्लेषण' : 'Report Analyzer'} color="#f59e0b" onClick={() => navigate('/report-analyzer')} />
              </div>
            </div>

            {/* Feature Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              {t.features.map((f, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                  whileHover={{ y: -4 }}
                  style={{ background: '#0b1117', border: `1px solid rgba(20,184,166,0.13)`, borderRadius: 16, padding: '1.25rem', cursor: 'default' }}>
                  <div style={{ fontSize: 28, marginBottom: '0.75rem' }}>{f.icon}</div>
                  <div style={{ color: '#fff', fontWeight: 700, fontSize: 14, marginBottom: '0.4rem' }}>{f.title}</div>
                  <div style={{ color: '#475569', fontSize: 12, lineHeight: 1.6 }}>{f.desc}</div>
                </motion.div>
              ))}
            </div>

            {/* Disclaimer */}
            <div style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 14, padding: '1rem 1.25rem', display: 'flex', gap: '10px', marginBottom: '2rem' }}>
              <span style={{ fontSize: 18 }}>⚠️</span>
              <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.7, margin: 0 }}>
                <strong style={{ color: '#f59e0b' }}>{t.disclaimer}:</strong> {t.disclaimerText}
              </p>
            </div>

            {/* Health History */}
            {history.length > 0 && (
              <div id="history-section" style={{ background: '#0b1117', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '1.5rem' }}>
                <h3 style={{ color: '#fff', fontSize: 15, fontWeight: 700, marginBottom: '1rem' }}>{t.recentQueries}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {history.map((h, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#13131f', borderRadius: 10, padding: '0.75rem 1rem' }}>
                      <div>
                        <div style={{ color: '#e2e8f0', fontSize: 13, fontWeight: 500 }}>{h.symptoms?.slice(0, 60)}{h.symptoms?.length > 60 ? '...' : ''}</div>
                        <div style={{ color: '#475569', fontSize: 11, marginTop: 2 }}>{h.date}</div>
                      </div>
                      <div style={{ padding: '3px 10px', borderRadius: 100, background: 'rgba(20,184,166,0.1)', border: '1px solid rgba(20,184,166,0.2)', color: '#14b8a6', fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap' }}>
                        {h.confidence}% confidence
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* SYMPTOM CHECKER MODE */}
        {mode === 'symptom' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Progress */}
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: '#94a3b8', fontSize: 13 }}>{t.stepOf(step + 1, STEPS.length)}</span>
                <span style={{ color: '#14b8a6', fontSize: 13, fontWeight: 600 }}>{t.complete(Math.round(((step) / STEPS.length) * 100))}</span>
              </div>
              <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2 }}>
                <motion.div animate={{ width: `${((step) / STEPS.length) * 100}%` }} style={{ height: '100%', background: 'linear-gradient(90deg, #14b8a6, #38bdf8)', borderRadius: 2 }} />
              </div>
              <div style={{ display: 'flex', gap: '6px', marginTop: '0.75rem' }}>
                {STEPS.map((_, i) => (
                  <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= step ? '#14b8a6' : 'rgba(255,255,255,0.06)', transition: 'background 0.3s' }} />
                ))}
              </div>
            </div>

            <div style={{ background: '#0b1117', border: '1px solid rgba(20,184,166,0.18)', borderRadius: 24, padding: '2.5rem' }}>
              <AnimatePresence mode="wait">
                <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #14b8a6, #38bdf8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 14 }}>{step + 1}</div>
                    <h2 style={{ color: '#fff', fontSize: 20, fontWeight: 700, margin: 0 }}>
                      {STEPS[step].question}                    </h2>
                  </div>

                  {STEPS[step].type === 'textarea' ? (
                    <textarea value={currentAnswer} onChange={e => handleAnswerChange(e.target.value)}
                      placeholder={STEPS[step].placeholder} rows={4}
                      style={{ width: '100%', padding: '14px', borderRadius: 12, background: '#13131f', border: `1px solid ${emergency && step === 0 ? '#ef4444' : 'rgba(255,255,255,0.1)'}`, color: '#f1f5f9', fontSize: 14, outline: 'none', resize: 'vertical', fontFamily: 'inherit', transition: 'border-color 0.2s' }}
                      onFocus={e => e.target.style.borderColor = '#14b8a6'}
                      onBlur={e => e.target.style.borderColor = emergency && step === 0 ? '#ef4444' : 'rgba(255,255,255,0.1)'}
                    />
                  ) : STEPS[step].type === 'select' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {STEPS[step].options.map(opt => (
                        <motion.button key={opt} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                          onClick={() => { setCurrentAnswer(opt); }}
                          style={{
                            padding: '14px 18px', borderRadius: 12, textAlign: 'left', cursor: 'pointer',
                            background: currentAnswer === opt ? 'rgba(20,184,166,0.1)' : '#13131f',
                            border: `1px solid ${currentAnswer === opt ? '#14b8a6' : 'rgba(255,255,255,0.08)'}`,
                            color: currentAnswer === opt ? '#14b8a6' : '#e2e8f0', fontSize: 14, fontWeight: currentAnswer === opt ? 600 : 400,
                            transition: 'all 0.2s',
                          }}>
                          {opt}
                        </motion.button>
                      ))}
                    </div>
                  ) : (
                    <input type={STEPS[step].type} value={currentAnswer} onChange={e => handleAnswerChange(e.target.value)}
                      placeholder={STEPS[step].placeholder}
                      style={{ width: '100%', padding: '14px', borderRadius: 12, background: '#13131f', border: '1px solid rgba(255,255,255,0.1)', color: '#f1f5f9', fontSize: 14, outline: 'none', fontFamily: 'inherit' }}
                      onFocus={e => e.target.style.borderColor = '#14b8a6'}
                      onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                    />
                  )}

                  {/* Voice input */}
                  <div style={{ display: 'flex', gap: '10px', marginTop: '1.25rem' }}>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      onClick={handleNext}
                      disabled={!currentAnswer && !STEPS[step].optional}
                      style={{
                        flex: 1, padding: '14px', borderRadius: 12,
                        background: (!currentAnswer && !STEPS[step].optional) ? 'rgba(20,184,166,0.15)' : 'linear-gradient(135deg, #14b8a6, #38bdf8)',
                        border: 'none', color: '#fff', fontWeight: 700, fontSize: 15, cursor: (!currentAnswer && !STEPS[step].optional) ? 'not-allowed' : 'pointer',
                        boxShadow: (!currentAnswer && !STEPS[step].optional) ? 'none' : '0 4px 20px rgba(20,184,166,0.25)',
                      }}>
                      {step === STEPS.length - 1 ? t.analyze : t.next}
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      onClick={startVoice}
                      style={{
                        width: 52, height: 52, borderRadius: 12, border: `2px solid ${listening ? '#ef4444' : 'rgba(124,58,237,0.4)'}`,
                        background: listening ? 'rgba(239,68,68,0.1)' : 'rgba(124,58,237,0.1)',
                        cursor: 'pointer', fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                      {listening ? '⏹️' : '🎙️'}
                    </motion.button>
                    {STEPS[step].optional && (
                      <button onClick={() => { setCurrentAnswer(''); handleNext(); }}
                        style={{ padding: '14px 18px', borderRadius: 12, background: 'none', border: '1px solid rgba(255,255,255,0.08)', color: '#64748b', fontSize: 13, cursor: 'pointer' }}>
                        {t.skip}
                      </button>
                    )}
                  </div>

                  {listening && (
                    <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1, repeat: Infinity }}
                      style={{ marginTop: '0.75rem', color: '#ef4444', fontSize: 13, textAlign: 'center' }}>
                      {t.listening}
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* RESULT MODE */}
        {mode === 'result' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {loading ? (
              <div style={{ background: '#0b1117', border: '1px solid rgba(20,184,166,0.18)', borderRadius: 24, padding: '4rem 2rem', textAlign: 'center' }}>
                <div style={{ position: 'relative', width: 80, height: 80, margin: '0 auto 2rem' }}>
                  {[0,1,2].map(i => (
                    <motion.div key={i} animate={{ scale: [1,1.8,1], opacity: [0.6,0,0.6] }} transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.4 }}
                      style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2px solid #14b8a6' }} />
                  ))}
                  <div style={{ position: 'absolute', inset: '22%', borderRadius: '50%', background: 'linear-gradient(135deg, #14b8a6, #38bdf8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🏥</div>
                </div>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: 17, marginBottom: '0.5rem' }}>{t.analyzing}</div>
                <div style={{ color: '#475569', fontSize: 13, marginBottom: '1.5rem' }}>{t.processingWith}</div>
                {(lang === 'hi'
                  ? ['लक्षण विश्लेषण', 'पैटर्न जांच', 'अंतर्दृष्टि', 'सिफारिशें']
                  : ['Analyzing symptoms', 'Checking patterns', 'Generating insights', 'Preparing recommendations']
                ).map((s, i) => (                  <motion.div key={s} animate={{ opacity: [0.3,1,0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.4 }}
                    style={{ display: 'inline-block', margin: '0 4px 8px', padding: '4px 12px', borderRadius: 100, background: 'rgba(20,184,166,0.07)', border: '1px solid rgba(20,184,166,0.18)', color: '#14b8a6', fontSize: 11 }}>
                    {s}
                  </motion.div>
                ))}
              </div>
            ) : result?.error ? (
              <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 20, padding: '2rem', textAlign: 'center' }}>
                <div style={{ fontSize: 40, marginBottom: '1rem' }}>⚠️</div>
                <div style={{ color: '#fca5a5', fontSize: 15, marginBottom: '1rem' }}>{result.error}</div>
                <button onClick={reset} style={{ padding: '10px 24px', borderRadius: 10, background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5', cursor: 'pointer', fontSize: 14 }}>{t.tryAgain}</button>
              </div>
            ) : result && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                {/* Confidence + Recommendation */}
                <div style={{ background: '#0b1117', border: '1px solid rgba(20,184,166,0.18)', borderRadius: 20, padding: '2rem', boxShadow: '0 16px 48px rgba(20,184,166,0.06)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <motion.div animate={{ rotate: [0,360] }} transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                        style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #14b8a6, #38bdf8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>✦</motion.div>
                      <div>
                        <div style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>{t.analysisComplete}</div>
                        <div style={{ color: '#475569', fontSize: 11 }}>{lang === 'hi' ? 'Groq AI + WHO दिशानिर्देश' : 'Groq AI + WHO Clinical Guidelines'}</div>
                      </div>
                    </div>
                    <div style={{ padding: '4px 14px', borderRadius: 100, background: 'rgba(20,184,166,0.1)', border: '1px solid rgba(20,184,166,0.22)', color: '#14b8a6', fontSize: 12, fontWeight: 700 }}>
                      {t.confidence(result.confidence)}
                    </div>
                  </div>

                  {/* Confidence bar */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                      <motion.div initial={{ width: 0 }} animate={{ width: `${result.confidence}%` }} transition={{ duration: 1, ease: 'easeOut' }}
                        style={{ height: '100%', background: 'linear-gradient(90deg, #14b8a6, #38bdf8)', borderRadius: 3 }} />
                    </div>
                  </div>

                  <div style={{ background: 'rgba(20,184,166,0.05)', borderLeft: '3px solid #14b8a6', borderRadius: '0 10px 10px 0', padding: '1rem 1.25rem', marginBottom: '1rem' }}>
                    <div style={{ color: '#64748b', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }}>{t.recommendation}</div>
                    <p style={{ color: '#e2e8f0', fontSize: 14, lineHeight: 1.8, margin: 0 }}>{result.recommendation}</p>
                  </div>

                  <button onClick={() => speak(result.recommendation.split('\n\n⚠️')[0])} style={{ background: 'rgba(129,140,248,0.08)', border: '1px solid rgba(129,140,248,0.18)', borderRadius: 8, padding: '6px 14px', color: '#a5b4fc', fontSize: 12, cursor: 'pointer' }}>{t.readAloud}</button>
                </div>

                {/* Specialist + Factors row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                  {/* Specialist */}
                  <div style={{ background: '#0b1117', border: '1px solid rgba(129,140,248,0.18)', borderRadius: 18, padding: '1.5rem' }}>
                    <div style={{ color: '#94a3b8', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '1rem' }}>{t.specialist}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(129,140,248,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>👨‍⚕️</div>
                      <div>
                        <div style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>{specialist}</div>
                        <div style={{ color: '#475569', fontSize: 12 }}>{t.specialistDesc}</div>
                      </div>
                    </div>
                    <div style={{ marginTop: '1rem', padding: '10px', background: 'rgba(129,140,248,0.06)', borderRadius: 10, color: '#94a3b8', fontSize: 12 }}>{t.specialistTip(specialist)}</div>
                  </div>

                  {/* Factors */}
                  <div style={{ background: '#0b1117', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, padding: '1.5rem' }}>
                    <div style={{ color: '#94a3b8', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '1rem' }}>{t.riskFactors}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                      {result.factors?.slice(0, 4).map((f, i) => (
                        <div key={i}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                            <span style={{ color: '#94a3b8', fontSize: 12 }}>{f.label}</span>
                            <span style={{ color: f.color, fontSize: 12, fontWeight: 600 }}>{f.value}%</span>
                          </div>
                          <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2 }}>
                            <motion.div initial={{ width: 0 }} animate={{ width: `${f.value}%` }} transition={{ duration: 0.8, delay: i * 0.1 }}
                              style={{ height: '100%', background: f.color, borderRadius: 2 }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Nearby Locations */}
                <NearbyLocations t={t} lang={lang} />

                {/* Reasoning */}
                <div style={{ background: '#0b1117', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, padding: '1.5rem' }}>                  <div style={{ color: '#94a3b8', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '1rem' }}>{t.reasoning}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {result.reasoning?.map((r, i) => (
                      <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                        style={{ display: 'flex', gap: '10px', padding: '10px 12px', background: '#13131f', borderRadius: 10 }}>
                        <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(20,184,166,0.13)', color: '#14b8a6', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i+1}</div>
                        <span style={{ color: '#cbd5e1', fontSize: 13, lineHeight: 1.6 }}>{r}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ background: '#0b1117', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, padding: '1.5rem' }}>
                  <div style={{ color: '#94a3b8', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '1rem' }}>{t.actions}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {result.actions?.map((a, i) => (
                      <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                        style={{ display: 'flex', gap: '12px', padding: '12px 14px', background: 'rgba(20,184,166,0.04)', border: '1px solid rgba(20,184,166,0.1)', borderRadius: 10 }}>
                        <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(20,184,166,0.15)', color: '#14b8a6', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i+1}</div>
                        <span style={{ color: '#cbd5e1', fontSize: 13, lineHeight: 1.6 }}>{a}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Alternatives */}
                {result.alternatives?.length > 0 && (
                  <div style={{ background: '#0b1117', border: '1px solid rgba(56,189,248,0.13)', borderRadius: 18, padding: '1.5rem' }}>
                    <div style={{ color: '#94a3b8', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '1rem' }}>{t.alternatives}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {result.alternatives.map((a, i) => (
                        <div key={i} style={{ padding: '10px 14px', background: 'rgba(56,189,248,0.04)', border: '1px solid rgba(56,189,248,0.1)', borderRadius: 10, color: '#94a3b8', fontSize: 13 }}>
                          → {a}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Disclaimer */}
                <div style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 14, padding: '1rem 1.25rem', display: 'flex', gap: '10px' }}>
                  <span>⚠️</span>
                  <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.7, margin: 0 }}>
                    <strong style={{ color: '#f59e0b' }}>{t.disclaimer}:</strong> {t.resultDisclaimer}
                  </p>
                </div>

                <button onClick={reset} style={{ padding: '14px', borderRadius: 14, background: 'rgba(20,184,166,0.07)', border: '1px solid rgba(20,184,166,0.18)', color: '#14b8a6', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
                  {t.startNew}
                </button>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

function NearbyLocations({ t, lang }) {
  const [status, setStatus] = useState('idle'); // idle | locating | done | denied
  const [coords, setCoords] = useState(null);

  const getLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation not supported in this browser.');
      return;
    }
    setStatus('locating');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setStatus('done');
      },
      () => setStatus('denied'),
      { timeout: 10000 }
    );
  };

  const openMap = (query) => {
    if (coords) {
      window.open(`https://www.google.com/maps/search/${encodeURIComponent(query)}/@${coords.lat},${coords.lng},14z`, '_blank');
    } else {
      window.open(`https://www.google.com/maps/search/${encodeURIComponent(query)}`, '_blank');
    }
  };

  const places = [
    { icon: '🏥', label: t.nearbyHospitals, query: 'hospital near me', color: '#ef4444' },
    { icon: '💊', label: t.nearbyPharmacy, query: 'pharmacy near me', color: '#14b8a6' },
    { icon: '🏨', label: t.nearbyClinic, query: 'medical clinic near me', color: '#818cf8' },
    { icon: '🚑', label: lang === 'hi' ? 'आपातकालीन सेवा' : 'Emergency Services', query: 'emergency hospital near me', color: '#f97316' },
    { icon: '🔬', label: lang === 'hi' ? 'डायग्नोस्टिक लैब' : 'Diagnostic Lab', query: 'diagnostic lab near me', color: '#38bdf8' },
    { icon: '👨‍⚕️', label: lang === 'hi' ? 'डॉक्टर क्लिनिक' : 'Doctor Clinic', query: 'doctor clinic near me', color: '#f59e0b' },
  ];

  return (
    <div style={{ background: '#0b1117', border: '1px solid rgba(20,184,166,0.18)', borderRadius: 20, padding: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <h3 style={{ color: '#fff', fontSize: 15, fontWeight: 700, margin: '0 0 4px' }}>{t.nearbyTitle}</h3>
          <p style={{ color: '#475569', fontSize: 12, margin: 0 }}>{t.nearbyDesc}</p>
        </div>
        {status !== 'done' && (
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={getLocation} disabled={status === 'locating'}
            style={{
              padding: '8px 16px', borderRadius: 10, border: 'none', cursor: status === 'locating' ? 'wait' : 'pointer',
              background: 'linear-gradient(135deg, #14b8a6, #38bdf8)',
              color: '#fff', fontSize: 13, fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: '6px',
              opacity: status === 'locating' ? 0.7 : 1,
            }}>
            {status === 'locating' ? (
              <><span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid #fff', animation: 'spin 0.7s linear infinite' }} />{t.locating}</>
            ) : (
              <><span>📍</span>{t.allowLocation}</>
            )}
          </motion.button>
        )}
        {status === 'done' && (
          <div style={{ padding: '6px 12px', borderRadius: 8, background: 'rgba(20,184,166,0.1)', border: '1px solid rgba(20,184,166,0.2)', color: '#14b8a6', fontSize: 12, fontWeight: 600 }}>
            ✓ {lang === 'hi' ? 'स्थान मिल गया' : 'Location found'}
          </div>
        )}
      </div>

      {status === 'denied' && (
        <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, color: '#fca5a5', fontSize: 13, marginBottom: '1rem' }}>
          ⚠️ {t.locationDenied}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.75rem' }}>
        {places.map((p, i) => (
          <motion.button key={i} whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}
            onClick={() => openMap(p.query)}
            style={{
              padding: '1rem 0.75rem', borderRadius: 14, cursor: 'pointer',
              background: `${p.color}10`, border: `1px solid ${p.color}25`,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = `${p.color}20`}
            onMouseLeave={e => e.currentTarget.style.background = `${p.color}10`}
          >
            <span style={{ fontSize: 26 }}>{p.icon}</span>
            <span style={{ color: p.color, fontSize: 12, fontWeight: 600, textAlign: 'center', lineHeight: 1.3 }}>{p.label}</span>
            <span style={{ color: '#475569', fontSize: 10 }}>{t.openMaps} →</span>
          </motion.button>
        ))}
      </div>

      {status === 'done' && coords && (
        <div style={{ marginTop: '1rem', padding: '10px 14px', background: 'rgba(6,182,212,0.06)', border: '1px solid rgba(6,182,212,0.15)', borderRadius: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <span style={{ color: '#475569', fontSize: 12 }}>
            📍 {lang === 'hi' ? 'आपका स्थान:' : 'Your location:'} {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
          </span>
          <a href={`https://www.google.com/maps/@${coords.lat},${coords.lng},15z`} target="_blank" rel="noreferrer"
            style={{ color: '#38bdf8', fontSize: 12, fontWeight: 600 }}>
            {lang === 'hi' ? 'मानचित्र देखें →' : 'View on map →'}
          </a>
        </div>
      )}
    </div>
  );
}

function ActionBtn({ icon, label, color, onClick }) {
  return (
    <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={onClick}
      style={{
        padding: '12px 24px', borderRadius: 14, cursor: 'pointer',
        background: `${color}15`, border: `1px solid ${color}30`,
        color, fontWeight: 700, fontSize: 14,
        display: 'flex', alignItems: 'center', gap: '8px',
      }}>
      <span style={{ fontSize: 18 }}>{icon}</span> {label}
    </motion.button>
  );
}
