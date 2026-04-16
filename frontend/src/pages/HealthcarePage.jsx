import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { analyzeWithAI } from '../services/api';

const EMERGENCY_KEYWORDS = [
  'chest pain','heart attack','can\'t breathe','difficulty breathing','stroke',
import * as THREE from 'three';
import { useAuth } from '../context/AuthContext';
import { analyzeWithAI } from '../services/api';

/* ── constants ── */
const EMERGENCY_KEYWORDS = [
  'chest pain','heart attack',"can't breathe",'difficulty breathing','stroke',
  'unconscious','not breathing','severe bleeding','overdose','seizure',
  'choking','anaphylaxis','allergic reaction','suicide','poisoning',
];
const SPECIALISTS = {
  heart:'Cardiologist',chest:'Cardiologist',cardiac:'Cardiologist',
  skin:'Dermatologist',rash:'Dermatologist',acne:'Dermatologist',
  bone:'Orthopedist',joint:'Orthopedist',fracture:'Orthopedist',
  child:'Pediatrician',baby:'Pediatrician',infant:'Pediatrician',
  eye:'Ophthalmologist',vision:'Ophthalmologist',blind:'Ophthalmologist',
  mental:'Psychiatrist',anxiety:'Psychiatrist',depression:'Psychiatrist',
  teeth:'Dentist',tooth:'Dentist',dental:'Dentist',
  stomach:'Gastroenterologist',digestion:'Gastroenterologist',liver:'Gastroenterologist',
  lung:'Pulmonologist',breathing:'Pulmonologist',asthma:'Pulmonologist',
  brain:'Neurologist',headache:'Neurologist',migraine:'Neurologist',
};

const T = {
  en:{
    title:'Healthcare AI',subtitle:'Intelligent symptom analysis & health guidance',
    heroTitle:'Your AI Health Assistant',
    heroDesc:'Analyze symptoms, detect emergencies, get specialist recommendations',
    symptomChecker:'Symptom Checker',talkToAI:'Voice Input',healthHistory:'Health History',
    back:'← Back',reset:'↺ Reset',stepOf:(s,t)=>`Step ${s} of ${t}`,
    complete:p=>`${p}% complete`,next:'Next →',analyze:'🔍 Analyze with AI',skip:'Skip',
    listening:'🔴 Listening… speak now',analyzing:'AI is analyzing your symptoms…',
    processingWith:'Processing with Groq Llama 3.3 70B',analysisComplete:'AI Analysis Complete',
    confidence:v=>`${v}% Confidence`,recommendation:'AI Recommendation',readAloud:'🔊 Read aloud',
    specialist:'Recommended Specialist',specialistDesc:'Based on your symptoms',
    specialistTip:s=>`💡 Search "${s} near me" on Google Maps`,
    nearbyTitle:'📍 Nearby Hospitals & Pharmacies',nearbyDesc:'Find medical facilities near you',
    allowLocation:'Allow Location',locating:'Getting location…',
    openMaps:'Open Maps',nearbyHospitals:'Hospitals',nearbyPharmacy:'Pharmacies',nearbyClinic:'Clinics',
    locationDenied:'Location denied. Please allow in browser settings.',
    riskFactors:'Risk Factors',reasoning:'🧠 AI Reasoning',actions:'✅ Recommended Actions',
    alternatives:'💡 Alternative Approaches',disclaimer:'Medical Disclaimer',
    disclaimerText:'This AI provides informational support only and is NOT a substitute for professional medical advice. Always consult a qualified healthcare provider. In emergencies, call 112 immediately.',
    resultDisclaimer:'This AI analysis is for informational purposes only. It is NOT a medical diagnosis.',
    startNew:'↺ Start New Analysis',tryAgain:'Try Again',recentQueries:'📋 Recent Health Queries',
    emergencyTitle:'EMERGENCY DETECTED',emergencyDesc:'Your symptoms may require immediate medical attention',
    callAmbulance:'🚑 Ambulance 108',call112:'📞 Call 112',
    features:[
      {icon:'🚨',title:'Emergency Detection',desc:'Instantly detects critical symptoms and shows emergency contacts'},
      {icon:'🧠',title:'AI Diagnosis',desc:'Multi-step guided analysis powered by Groq Llama 3.3 70B'},
      {icon:'👨‍⚕️',title:'Doctor Recommendation',desc:'Get matched to the right specialist based on your symptoms'},
      {icon:'🎙️',title:'Voice Input',desc:'Speak your symptoms in English or Hindi'},
      {icon:'📈',title:'Health History',desc:'Track your previous queries and health patterns'},
      {icon:'🌐',title:'Multi-language',desc:'Full support for English and Hindi'},
    ],
    steps:[
      {key:'symptoms',question:'What symptoms are you experiencing?',placeholder:'e.g. headache, fever, fatigue, chest pain…',type:'textarea'},
      {key:'duration',question:'How long have you had these symptoms?',placeholder:'e.g. 2 days, 1 week…',type:'text'},
      {key:'age',question:'What is your age?',placeholder:'e.g. 28',type:'number'},
      {key:'severity',question:'How severe are your symptoms?',type:'select',options:['Mild - manageable','Moderate - affecting daily life','Severe - very painful','Emergency - need help now']},
      {key:'medicalHistory',question:'Any existing conditions or medications?',placeholder:'e.g. diabetes, hypertension, aspirin…',type:'textarea',optional:true},
    ],
  },
  hi:{
    title:'स्वास्थ्य AI',subtitle:'बुद्धिमान लक्षण विश्लेषण और स्वास्थ्य मार्गदर्शन',
    heroTitle:'आपका AI स्वास्थ्य सहायक',
    heroDesc:'लक्षणों का विश्लेषण करें, आपातकाल का पता लगाएं, विशेषज्ञ सिफारिशें प्राप्त करें',
    symptomChecker:'लक्षण जांचें',talkToAI:'आवाज़ इनपुट',healthHistory:'स्वास्थ्य इतिहास',
    back:'← वापस',reset:'↺ रीसेट',stepOf:(s,t)=>`चरण ${s} / ${t}`,
    complete:p=>`${p}% पूर्ण`,next:'अगला →',analyze:'🔍 AI से विश्लेषण करें',skip:'छोड़ें',
    listening:'🔴 सुन रहा है… बोलें',analyzing:'AI आपके लक्षणों का विश्लेषण कर रहा है…',
    processingWith:'Groq Llama 3.3 70B से प्रोसेस हो रहा है',analysisComplete:'AI विश्लेषण पूर्ण',
    confidence:v=>`${v}% विश्वास`,recommendation:'AI सिफारिश',readAloud:'🔊 ज़ोर से पढ़ें',
    specialist:'अनुशंसित विशेषज्ञ',specialistDesc:'आपके लक्षणों के आधार पर',
    specialistTip:s=>`💡 Google Maps पर "${s} near me" खोजें`,
    nearbyTitle:'📍 नजदीकी अस्पताल और फार्मेसी',nearbyDesc:'आपके पास चिकित्सा सुविधाएं खोजें',
    allowLocation:'स्थान दें',locating:'स्थान मिल रहा है…',
    openMaps:'Maps खोलें',nearbyHospitals:'अस्पताल',nearbyPharmacy:'फार्मेसी',nearbyClinic:'क्लिनिक',
    locationDenied:'स्थान की अनुमति अस्वीकार।',
    riskFactors:'जोखिम कारक',reasoning:'🧠 AI तर्क',actions:'✅ अनुशंसित कार्य',
    alternatives:'💡 वैकल्पिक उपाय',disclaimer:'चिकित्सा अस्वीकरण',
    disclaimerText:'यह AI केवल सूचनात्मक सहायता प्रदान करता है। किसी भी स्वास्थ्य समस्या के लिए योग्य डॉक्टर से परामर्श लें।',
    resultDisclaimer:'यह AI विश्लेषण केवल जानकारी के लिए है। यह चिकित्सा निदान नहीं है।',
    startNew:'↺ नया विश्लेषण शुरू करें',tryAgain:'पुनः प्रयास करें',recentQueries:'📋 हाल की स्वास्थ्य जांच',
    emergencyTitle:'आपातकाल का पता चला',emergencyDesc:'आपके लक्षणों के लिए तत्काल चिकित्सा ध्यान की आवश्यकता हो सकती है',
    callAmbulance:'🚑 एम्बुलेंस 108',call112:'📞 112 पर कॉल करें',
    features:[
      {icon:'🚨',title:'आपातकाल पहचान',desc:'गंभीर लक्षणों का तुरंत पता लगाता है'},
      {icon:'🧠',title:'AI निदान',desc:'Groq Llama 3.3 70B द्वारा संचालित बहु-चरण विश्लेषण'},
      {icon:'👨‍⚕️',title:'डॉक्टर सिफारिश',desc:'लक्षणों के आधार पर सही विशेषज्ञ से मिलान'},
      {icon:'🎙️',title:'आवाज़ इनपुट',desc:'हिंदी या अंग्रेजी में लक्षण बोलें'},
      {icon:'📈',title:'स्वास्थ्य इतिहास',desc:'पिछली जांच और स्वास्थ्य पैटर्न ट्रैक करें'},
      {icon:'🌐',title:'बहुभाषी',desc:'अंग्रेजी और हिंदी में पूर्ण समर्थन'},
    ],
    steps:[
      {key:'symptoms',question:'आप कौन से लक्षण अनुभव कर रहे हैं?',placeholder:'जैसे: सिरदर्द, बुखार, थकान…',type:'textarea'},
      {key:'duration',question:'ये लक्षण कब से हैं?',placeholder:'जैसे: 2 दिन, 1 हफ्ता…',type:'text'},
      {key:'age',question:'आपकी उम्र क्या है?',placeholder:'जैसे: 28',type:'number'},
      {key:'severity',question:'आपके लक्षण कितने गंभीर हैं?',type:'select',options:['हल्के - सहनीय','मध्यम - दैनिक जीवन प्रभावित','गंभीर - बहुत दर्दनाक','आपातकाल - तुरंत मदद चाहिए']},
      {key:'medicalHistory',question:'कोई मौजूदा बीमारी या दवाएं?',placeholder:'जैसे: मधुमेह, उच्च रक्तचाप…',type:'textarea',optional:true},
    ],
  },
};

/* ══════════════════════════════════════════════════════════════
   3D DNA HELIX SCENE  (Three.js)
══════════════════════════════════════════════════════════════ */
function DNAScene({ emergency }) {
  const mountRef = useRef(null);
  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;
    const W = el.clientWidth || 500, H = el.clientHeight || 500;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    el.appendChild(renderer.domElement);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 100);
    camera.position.set(0, 0, 8);

    /* ── DNA helix ── */
    const helixGroup = new THREE.Group();
    const mat1 = new THREE.MeshPhysicalMaterial({ color:0x14b8a6, emissive:0x0d9488, emissiveIntensity:0.6, roughness:0.2, metalness:0.7, clearcoat:1 });
    const mat2 = new THREE.MeshPhysicalMaterial({ color:0x38bdf8, emissive:0x0ea5e9, emissiveIntensity:0.6, roughness:0.2, metalness:0.7, clearcoat:1 });
    const matB = new THREE.MeshPhysicalMaterial({ color:0xa78bfa, emissive:0x7c3aed, emissiveIntensity:0.4, roughness:0.3, metalness:0.5, transparent:true, opacity:0.8 });

    const TURNS=3, STEPS=72, R=1.3, H_DNA=5.5;
    for (let i=0; i<STEPS; i++) {
      const frac = i/STEPS;
      const a1   = frac * Math.PI*2*TURNS;
      const a2   = a1 + Math.PI;
      const y    = (frac - 0.5) * H_DNA;
      const geo  = new THREE.SphereGeometry(0.1, 14, 14);
      const s1   = new THREE.Mesh(geo, mat1.clone());
      const s2   = new THREE.Mesh(geo, mat2.clone());
      s1.position.set(Math.cos(a1)*R, y, Math.sin(a1)*R);
      s2.position.set(Math.cos(a2)*R, y, Math.sin(a2)*R);
      helixGroup.add(s1, s2);
      if (i % 4 === 0) {
        const p1  = s1.position.clone(), p2 = s2.position.clone();
        const mid = p1.clone().lerp(p2, 0.5);
        const len = p1.distanceTo(p2);
        const cyl = new THREE.Mesh(
          new THREE.CylinderGeometry(0.035, 0.035, len, 8),
          matB.clone()
        );
        cyl.position.copy(mid);
        cyl.lookAt(p2); cyl.rotateX(Math.PI/2);
        helixGroup.add(cyl);
      }
    }
    scene.add(helixGroup);

    /* ── glowing core sphere ── */
    const core = new THREE.Mesh(
      new THREE.SphereGeometry(0.35, 32, 32),
      new THREE.MeshPhysicalMaterial({ color:0x14b8a6, emissive:0x14b8a6, emissiveIntensity:2, roughness:0, metalness:1, transparent:true, opacity:0.9 })
    );
    scene.add(core);

    /* ── orbit rings ── */
    const rings = [];
    [[2.4,0.022,0x14b8a6,0.4,Math.PI/2.2,0],[3.1,0.014,0x38bdf8,0.25,Math.PI/3,Math.PI/5],[3.8,0.01,0x818cf8,0.18,Math.PI/4,Math.PI/3]].forEach(([rad,tube,col,op,rx,rz])=>{
      const r = new THREE.Mesh(
        new THREE.TorusGeometry(rad,tube,14,100),
        new THREE.MeshStandardMaterial({ color:col, emissive:col, emissiveIntensity:0.5, transparent:true, opacity:op })
      );
      r.rotation.x=rx; r.rotation.z=rz;
      scene.add(r); rings.push(r);
    });

    /* ── floating orbs ── */
    const orbColors=[0x14b8a6,0x38bdf8,0x818cf8,0xf59e0b,0xef4444,0xa78bfa];
    const orbs=[];
    for(let i=0;i<35;i++){
      const sz=0.04+Math.random()*0.12;
      const orb=new THREE.Mesh(
        new THREE.SphereGeometry(sz,12,12),
        new THREE.MeshStandardMaterial({ color:orbColors[i%orbColors.length], emissive:orbColors[i%orbColors.length], emissiveIntensity:0.8, roughness:0.1, metalness:0.9, transparent:true, opacity:0.6+Math.random()*0.4 })
      );
      orb.position.set((Math.random()-0.5)*10,(Math.random()-0.5)*7,(Math.random()-0.5)*5-1);
      orb.userData={ vx:(Math.random()-0.5)*0.007, vy:(Math.random()-0.5)*0.007, vz:(Math.random()-0.5)*0.004, phase:Math.random()*Math.PI*2 };
      scene.add(orb); orbs.push(orb);
    }

    /* ── star field ── */
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(800*3);
    for(let i=0;i<800*3;i++) starPos[i]=(Math.random()-0.5)*40;
    starGeo.setAttribute('position',new THREE.BufferAttribute(starPos,3));
    scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color:0x14b8a6, size:0.035, transparent:true, opacity:0.4 })));

    /* ── lights ── */
    scene.add(new THREE.AmbientLight(0xffffff,0.3));
    const pl1=new THREE.PointLight(0x14b8a6,5,15); pl1.position.set(4,4,4); scene.add(pl1);
    const pl2=new THREE.PointLight(0x818cf8,3,12); pl2.position.set(-4,-3,3); scene.add(pl2);
    const pl3=new THREE.PointLight(0x38bdf8,2,10); pl3.position.set(0,5,-3); scene.add(pl3);
    const pl4=new THREE.PointLight(0xf59e0b,1.5,8); pl4.position.set(-3,2,-2); scene.add(pl4);

    /* ── mouse parallax ── */
    const mouse={x:0,y:0};
    const onMove=e=>{ mouse.x=(e.clientX/window.innerWidth-0.5)*2; mouse.y=(e.clientY/window.innerHeight-0.5)*2; };
    window.addEventListener('mousemove',onMove);

    /* ── animate ── */
    let t=0, frame;
    const animate=()=>{
      frame=requestAnimationFrame(animate);
      t+=0.007;

      helixGroup.rotation.y = t*0.45 + mouse.x*0.25;
      helixGroup.rotation.x = mouse.y*0.12;

      const pulse = emergency ? 0.4+0.6*Math.sin(t*10) : 0.6;
      core.material.emissiveIntensity = emergency ? 1+Math.sin(t*10) : 1.5+0.5*Math.sin(t*2);
      helixGroup.children.forEach(c=>{ if(c.material?.emissiveIntensity!==undefined) c.material.emissiveIntensity=pulse; });

      rings[0].rotation.z = t*0.18;
      rings[1].rotation.y = t*0.12;
      rings[2].rotation.x = t*0.09;

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
      orbs.forEach(orb=>{
        const d=orb.userData;
        orb.position.x+=d.vx+Math.sin(t+d.phase)*0.002;
        orb.position.y+=d.vy+Math.cos(t+d.phase)*0.002;
        orb.position.z+=d.vz;
        if(Math.abs(orb.position.x)>6) d.vx*=-1;
        if(Math.abs(orb.position.y)>5) d.vy*=-1;
        if(Math.abs(orb.position.z)>4) d.vz*=-1;
        orb.material.opacity=0.4+0.5*Math.sin(t*1.5+d.phase);
      });

      pl1.position.x=Math.sin(t*0.6)*5; pl1.position.y=Math.cos(t*0.4)*4;
      pl2.position.x=Math.cos(t*0.5)*4; pl2.position.y=Math.sin(t*0.7)*3;

      renderer.render(scene,camera);
    };
    animate();

    const onResize=()=>{
      const W2=el.clientWidth||500, H2=el.clientHeight||500;
      camera.aspect=W2/H2; camera.updateProjectionMatrix();
      renderer.setSize(W2,H2);
    };
    window.addEventListener('resize',onResize);

    return ()=>{
      cancelAnimationFrame(frame);
      window.removeEventListener('mousemove',onMove);
      window.removeEventListener('resize',onResize);
      renderer.dispose();
      if(el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, [emergency]);

  return <div ref={mountRef} style={{ position:'absolute', inset:0, width:'100%', height:'100%' }} />;
}

/* ══════════════════════════════════════════════════════════════
   PARTICLE BACKGROUND  (Three.js)
══════════════════════════════════════════════════════════════ */
function ParticleBG() {
  const ref = useRef(null);
  useEffect(()=>{
    const el=ref.current; if(!el) return;
    const W=window.innerWidth, H=window.innerHeight;
    const renderer=new THREE.WebGLRenderer({ antialias:false, alpha:true });
    renderer.setSize(W,H); renderer.setClearColor(0x000000,0);
    el.appendChild(renderer.domElement);
    const scene=new THREE.Scene();
    const camera=new THREE.PerspectiveCamera(75,W/H,0.1,100);
    camera.position.z=5;
    const geo=new THREE.BufferGeometry();
    const N=700, pos=new Float32Array(N*3);
    for(let i=0;i<N*3;i++) pos[i]=(Math.random()-0.5)*35;
    geo.setAttribute('position',new THREE.BufferAttribute(pos,3));
    const pts=new THREE.Points(geo,new THREE.PointsMaterial({ color:0x14b8a6, size:0.03, transparent:true, opacity:0.35 }));
    scene.add(pts);
    let frame;
    const animate=()=>{ frame=requestAnimationFrame(animate); pts.rotation.y+=0.0002; pts.rotation.x+=0.00008; renderer.render(scene,camera); };
    animate();
    const onResize=()=>{ renderer.setSize(window.innerWidth,window.innerHeight); camera.aspect=window.innerWidth/window.innerHeight; camera.updateProjectionMatrix(); };
    window.addEventListener('resize',onResize);
    return ()=>{ cancelAnimationFrame(frame); window.removeEventListener('resize',onResize); renderer.dispose(); if(el.contains(renderer.domElement)) el.removeChild(renderer.domElement); };
  },[]);
  return <div ref={ref} style={{ position:'fixed', inset:0, zIndex:0, pointerEvents:'none' }} />;
}

/* ══════════════════════════════════════════════════════════════
   NEARBY LOCATIONS
══════════════════════════════════════════════════════════════ */
function NearbyLocations({ t, lang }) {
  const [status,setStatus]=useState('idle');
  const [coords,setCoords]=useState(null);
  const getLocation=()=>{
    if(!navigator.geolocation) return;
    setStatus('locating');
    navigator.geolocation.getCurrentPosition(
      pos=>{ setCoords({lat:pos.coords.latitude,lng:pos.coords.longitude}); setStatus('done'); },
      ()=>setStatus('denied'),{timeout:10000}
    );
  };
  const openMap=q=>{
    const url=coords?`https://www.google.com/maps/search/${encodeURIComponent(q)}/@${coords.lat},${coords.lng},14z`:`https://www.google.com/maps/search/${encodeURIComponent(q)}`;
    window.open(url,'_blank');
  };
  const places=[
    {icon:'🏥',label:t.nearbyHospitals,query:'hospital near me',color:'#ef4444'},
    {icon:'💊',label:t.nearbyPharmacy,query:'pharmacy near me',color:'#14b8a6'},
    {icon:'🏨',label:t.nearbyClinic,query:'medical clinic near me',color:'#818cf8'},
    {icon:'🚑',label:lang==='hi'?'आपातकालीन सेवा':'Emergency',query:'emergency hospital near me',color:'#f97316'},
    {icon:'🔬',label:lang==='hi'?'डायग्नोस्टिक लैब':'Diagnostic Lab',query:'diagnostic lab near me',color:'#38bdf8'},
    {icon:'👨‍⚕️',label:lang==='hi'?'डॉक्टर':'Doctor Clinic',query:'doctor clinic near me',color:'#f59e0b'},
  ];
  return (
    <div style={{ background:'rgba(11,17,23,0.8)', backdropFilter:'blur(16px)', border:'1px solid rgba(20,184,166,0.2)', borderRadius:20, padding:'1.5rem' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.25rem', flexWrap:'wrap', gap:'0.5rem' }}>
        <div>
          <h3 style={{ color:'#fff', fontSize:15, fontWeight:700, margin:'0 0 3px' }}>{t.nearbyTitle}</h3>
          <p style={{ color:'#475569', fontSize:12, margin:0 }}>{t.nearbyDesc}</p>
        </div>
        {status!=='done' && (
          <motion.button whileHover={{scale:1.03}} whileTap={{scale:0.97}} onClick={getLocation} disabled={status==='locating'}
            style={{ padding:'8px 16px', borderRadius:10, border:'none', cursor:status==='locating'?'wait':'pointer', background:'linear-gradient(135deg,#14b8a6,#38bdf8)', color:'#fff', fontSize:13, fontWeight:600, opacity:status==='locating'?0.7:1 }}>
            📍 {status==='locating'?t.locating:t.allowLocation}
          </motion.button>
        )}
        {status==='done' && <span style={{ color:'#14b8a6', fontSize:12, fontWeight:600 }}>✓ {lang==='hi'?'स्थान मिल गया':'Location found'}</span>}
      </div>
      {status==='denied' && <div style={{ padding:'10px 14px', background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)', borderRadius:10, color:'#fca5a5', fontSize:13, marginBottom:'1rem' }}>⚠️ {t.locationDenied}</div>}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))', gap:'0.75rem' }}>
        {places.map((p,i)=>(
          <motion.button key={i}
            initial={{opacity:0,y:20,scale:0.9}} animate={{opacity:1,y:0,scale:1}}
            transition={{delay:i*0.07,type:'spring',stiffness:200}}
            whileHover={{scale:1.07,y:-5,boxShadow:`0 12px 30px ${p.color}30`}}
            whileTap={{scale:0.95}}
            onClick={()=>openMap(p.query)}
            style={{ padding:'1rem 0.5rem', borderRadius:14, cursor:'pointer', background:`${p.color}10`, border:`1px solid ${p.color}25`, display:'flex', flexDirection:'column', alignItems:'center', gap:'7px', backdropFilter:'blur(8px)', position:'relative', overflow:'hidden', transition:'border-color 0.2s' }}
            onMouseEnter={e=>{ e.currentTarget.style.background=`${p.color}22`; e.currentTarget.style.borderColor=`${p.color}50`; }}
            onMouseLeave={e=>{ e.currentTarget.style.background=`${p.color}10`; e.currentTarget.style.borderColor=`${p.color}25`; }}>
            <motion.span
              animate={{scale:[1,1.12,1],rotate:[0,8,-8,0]}}
              transition={{duration:2.5,repeat:Infinity,delay:i*0.3}}
              style={{fontSize:24}}>{p.icon}</motion.span>
            <span style={{color:p.color,fontSize:11,fontWeight:600,textAlign:'center',lineHeight:1.3}}>{p.label}</span>
            <span style={{color:'#475569',fontSize:10}}>{t.openMaps} →</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════════ */
export default function HealthcarePage() {
  const { user }  = useAuth();
  const navigate  = useNavigate();
  const recognitionRef = useRef(null);

  const [lang,setLang]                   = useState('en');
  const [mode,setMode]                   = useState('home');
  const [step,setStep]                   = useState(0);
  const [answers,setAnswers]             = useState({});
  const [currentAnswer,setCurrentAnswer] = useState('');
  const [loading,setLoading]             = useState(false);
  const [result,setResult]               = useState(null);
  const [emergency,setEmergency]         = useState(false);
  const [specialist,setSpecialist]       = useState(null);
  const [listening,setListening]         = useState(false);
  const [history,setHistory]             = useState(()=>{
    try { return JSON.parse(localStorage.getItem(`health_history_${user?.id||user?.email}`)||'[]'); } catch { return []; }
  });

  const t     = T[lang];
  const STEPS = t.steps;

  const checkEmergency   = txt => EMERGENCY_KEYWORDS.some(k=>txt.toLowerCase().includes(k));
  const detectSpecialist = txt => { const l=txt.toLowerCase(); for(const [k,s] of Object.entries(SPECIALISTS)) if(l.includes(k)) return s; return 'General Physician'; };

  const handleAnswerChange = val => { setCurrentAnswer(val); if(step===0) setEmergency(checkEmergency(val)); };

  const handleNext = () => {
    if(!currentAnswer && !STEPS[step].optional) return;
    const na={...answers,[STEPS[step].key]:currentAnswer};
    setAnswers(na); setCurrentAnswer('');
    if(step<STEPS.length-1) setStep(step+1);
    else submitAnalysis(na);
  };

  const submitAnalysis = async data => {
    setLoading(true); setMode('result');
    setSpecialist(detectSpecialist(data.symptoms||''));
    try {
      const res=await analyzeWithAI('healthcare',{
        symptoms:data.symptoms, age:data.age, medicalHistory:data.medicalHistory||'',
        urgency:data.severity?.includes('Emergency')||data.severity?.includes('आपातकाल')?'Emergency'
          :data.severity?.includes('Severe')||data.severity?.includes('गंभीर')?'High'
          :data.severity?.includes('Moderate')||data.severity?.includes('मध्यम')?'Medium':'Low',
        lang,
      });
      setResult(res);
      const entry={date:new Date().toLocaleDateString(),symptoms:data.symptoms,confidence:res.confidence};
      const newH=[entry,...history].slice(0,10);
      setHistory(newH);
      localStorage.setItem(`health_history_${user?.id||user?.email}`,JSON.stringify(newH));
    } catch(err) { setResult({error:err.message}); }
    finally { setLoading(false); }
  };

  const startVoice = () => {
    if(!('webkitSpeechRecognition' in window||'SpeechRecognition' in window)){ alert('Voice input not supported. Try Chrome.'); return; }
    const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
    const rec=new SR();
    rec.lang=lang==='hi'?'hi-IN':'en-US';
    rec.onresult=e=>{ const txt=e.results[0][0].transcript; setCurrentAnswer(txt); handleAnswerChange(txt); setListening(false); };
    rec.onerror=()=>setListening(false);
    rec.onend=()=>setListening(false);
    recognitionRef.current=rec;
    rec.start(); setListening(true);
  };

  const speak = text => {
    window.speechSynthesis?.cancel();
    const clean=text.replace(/[⚠️✦→←↺•]/g,'').trim();
    const chunks=clean.match(/.{1,200}/g)||[clean];
    let idx=0;
    const next=()=>{
      if(idx>=chunks.length) return;
      const chunk=chunks[idx++];
      const lc=lang==='hi'?'hi':'en';
      const url=`https://translate.googleapis.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(chunk)}&tl=${lc}&client=gtx&ttsspeed=0.9`;
      const audio=new Audio(url);
      audio.onended=next;
      audio.onerror=()=>{ const u=new SpeechSynthesisUtterance(chunk); u.lang=lang==='hi'?'hi-IN':'en-US'; window.speechSynthesis.speak(u); };
      audio.play().catch(()=>{ const u=new SpeechSynthesisUtterance(chunk); u.lang=lang==='hi'?'hi-IN':'en-US'; window.speechSynthesis.speak(u); });
    };
    next();
  };

  const reset = () => { setMode('home'); setStep(0); setAnswers({}); setCurrentAnswer(''); setResult(null); setEmergency(false); };

  /* ── input style ── */
  const inp = { width:'100%', padding:'13px 15px', borderRadius:12, background:'rgba(13,21,32,0.8)', border:'1px solid rgba(255,255,255,0.1)', color:'#f1f5f9', fontSize:14, outline:'none', resize:'vertical', fontFamily:'inherit', backdropFilter:'blur(8px)', boxSizing:'border-box' };

  return (
    <div style={{ minHeight:'100vh', background:'linear-gradient(160deg,#020608 0%,#040c10 50%,#020608 100%)', paddingTop:64, position:'relative', overflow:'hidden' }}>

      {/* ── Three.js particle background ── */}
      <ParticleBG />

      {/* ── Emergency Banner ── */}
      <AnimatePresence>
        {emergency && (
          <motion.div initial={{y:-80}} animate={{y:0}} exit={{y:-80}}
            style={{ position:'fixed', top:64, left:0, right:0, zIndex:999, background:'linear-gradient(135deg,#0f766e,#0e7490)', padding:'1rem 2rem', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'1rem', boxShadow:'0 4px 32px rgba(15,118,110,0.5)', backdropFilter:'blur(12px)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <motion.span animate={{scale:[1,1.3,1]}} transition={{duration:0.6,repeat:Infinity}} style={{fontSize:28}}>🚨</motion.span>
              <div>
                <div style={{color:'#fff',fontWeight:800,fontSize:16}}>{t.emergencyTitle}</div>
                <div style={{color:'rgba(255,255,255,0.8)',fontSize:13}}>{t.emergencyDesc}</div>
              </div>
            </div>
            <div style={{display:'flex',gap:10}}>
              <a href="tel:112" style={{background:'#fff',color:'#0f766e',padding:'10px 20px',borderRadius:10,fontWeight:800,fontSize:14,textDecoration:'none'}}>📞 Call 112</a>
              <a href="tel:108" style={{background:'rgba(255,255,255,0.15)',color:'#fff',padding:'10px 20px',borderRadius:10,fontWeight:700,fontSize:14,textDecoration:'none',border:'1px solid rgba(255,255,255,0.3)'}}>{t.callAmbulance}</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Header ── */}
      <div style={{ position:'relative', zIndex:10, background:'rgba(4,12,16,0.7)', backdropFilter:'blur(20px)', borderBottom:'1px solid rgba(20,184,166,0.1)', padding:'1.25rem 2rem' }}>
        <div style={{ maxWidth:1000, margin:'0 auto', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'1rem' }}>
          <div style={{display:'flex',alignItems:'center',gap:'1rem'}}>
            <button onClick={()=>navigate('/')} style={{background:'none',border:'none',cursor:'pointer',color:'#64748b',fontSize:13}}>{t.back}</button>
            <div style={{width:48,height:48,borderRadius:14,background:'rgba(20,184,166,0.15)',border:'1px solid rgba(20,184,166,0.3)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,boxShadow:'0 0 20px rgba(20,184,166,0.2)',animation:'heartbeat 2s ease-in-out infinite'}}>🏥</div>
            <div>
              <h1 style={{color:'#fff',fontSize:22,fontWeight:800,margin:0}}>{t.title}</h1>
              <p style={{color:'#64748b',fontSize:12,margin:0}}>{t.subtitle}</p>
            </div>
          </div>
          <div style={{display:'flex',gap:8,alignItems:'center'}}>
            <div style={{display:'flex',background:'rgba(13,21,32,0.8)',borderRadius:10,border:'1px solid rgba(255,255,255,0.08)',overflow:'hidden',backdropFilter:'blur(8px)'}}>
              {Object.entries({en:'EN',hi:'हि'}).map(([k,v])=>(
                <button key={k} onClick={()=>setLang(k)} style={{padding:'6px 14px',background:lang===k?'#14b8a6':'none',border:'none',color:lang===k?'#fff':'#64748b',fontSize:12,fontWeight:600,cursor:'pointer',transition:'all 0.2s'}}>{v}</button>
              ))}
            </div>
            {mode!=='home' && (
              <button onClick={reset} style={{background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:10,padding:'6px 14px',color:'#94a3b8',fontSize:12,cursor:'pointer',backdropFilter:'blur(8px)'}}>{t.reset}</button>
            )}
          </div>
        </div>
      </div>

      <div style={{ maxWidth:1000, margin:'0 auto', padding:'2rem 1.5rem', position:'relative', zIndex:10 }}>

        {/* ════════════════ HOME MODE ════════════════ */}
        {mode==='home' && (
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}>

            {/* ── Hero with 3D DNA ── */}
            <div style={{ position:'relative', borderRadius:28, overflow:'hidden', marginBottom:'2rem', background:'linear-gradient(135deg,rgba(20,184,166,0.06),rgba(56,189,248,0.03),rgba(129,140,248,0.04))', border:'1px solid rgba(20,184,166,0.15)', animation:'borderGlow 3s ease-in-out infinite' }}>
              {/* 3D canvas */}
              <div style={{ height:420, position:'relative' }}>
                <DNAScene emergency={emergency} />
                {/* overlay gradient */}
                <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom,transparent 40%,rgba(4,12,16,0.95) 100%)', pointerEvents:'none' }} />
                {/* hero text */}
                <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'2rem', textAlign:'center' }}>
                  <motion.div animate={{y:[0,-6,0]}} transition={{duration:3,repeat:Infinity,ease:'easeInOut'}}
                    style={{fontSize:52,marginBottom:12}}>🏥</motion.div>
                  <motion.h2
                    initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{delay:0.3,duration:0.7}}
                    style={{
                      fontSize:'clamp(22px,4vw,34px)',fontWeight:900,margin:'0 0 10px',letterSpacing:'-0.5px',
                      background:'linear-gradient(90deg,#14b8a6,#38bdf8,#818cf8,#14b8a6)',
                      backgroundSize:'300% 100%',
                      WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',
                      animation:'gradientShift 4s ease infinite',
                    }}>{t.heroTitle}</motion.h2>
                  <motion.p
                    initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.5,duration:0.6}}
                    style={{color:'rgba(255,255,255,0.65)',fontSize:14,maxWidth:520,margin:'0 auto 1.75rem',lineHeight:1.7}}>{t.heroDesc}</motion.p>
                  <motion.div
                    initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.7}}
                    style={{display:'flex',gap:'1rem',justifyContent:'center',flexWrap:'wrap'}}>
                    {[
                      {icon:'🩺',label:t.symptomChecker,color:'#14b8a6',action:()=>setMode('symptom')},
                      {icon:'🎙️',label:t.talkToAI,color:'#818cf8',action:()=>setMode('symptom')},
                      {icon:'📊',label:t.healthHistory,color:'#38bdf8',action:()=>document.getElementById('history-section')?.scrollIntoView({behavior:'smooth'})},
                      {icon:'🔬',label:lang==='hi'?'रिपोर्ट विश्लेषण':'Report Analyzer',color:'#f59e0b',action:()=>navigate('/report-analyzer')},
                    ].map((btn,i)=>(
                      <motion.button key={i}
                        initial={{opacity:0,scale:0.8}} animate={{opacity:1,scale:1}} transition={{delay:0.8+i*0.1,type:'spring',stiffness:200}}
                        whileHover={{scale:1.08,y:-4,boxShadow:`0 8px 30px ${btn.color}40`}} whileTap={{scale:0.95}} onClick={btn.action}
                        style={{ padding:'11px 22px', borderRadius:14, cursor:'pointer', background:`${btn.color}18`, border:`1px solid ${btn.color}35`, color:btn.color, fontWeight:700, fontSize:14, display:'flex', alignItems:'center', gap:'8px', backdropFilter:'blur(10px)', boxShadow:`0 4px 20px ${btn.color}20`, transition:'box-shadow 0.3s' }}>
                        <motion.span animate={{rotate:[0,10,-10,0]}} transition={{duration:2,repeat:Infinity,delay:i*0.5}} style={{fontSize:18}}>{btn.icon}</motion.span>{btn.label}
                      </motion.button>
                    ))}
                  </motion.div>
                </div>
              </div>
            </div>

            {/* ── Feature Cards ── */}
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:'1rem',marginBottom:'2rem'}}>
              {t.features.map((f,i)=>(
                <motion.div key={i}
                  initial={{opacity:0,y:40,rotateX:15}} animate={{opacity:1,y:0,rotateX:0}}
                  transition={{delay:i*0.09,duration:0.5,type:'spring',stiffness:120}}
                  whileHover={{y:-8,scale:1.02,boxShadow:'0 20px 50px rgba(20,184,166,0.18)'}}
                  style={{ background:'rgba(11,17,23,0.7)', backdropFilter:'blur(16px)', border:'1px solid rgba(20,184,166,0.12)', borderRadius:18, padding:'1.25rem', cursor:'default', transition:'all 0.3s', position:'relative', overflow:'hidden' }}>
                  {/* shimmer sweep on hover */}
                  <div style={{ position:'absolute', inset:0, background:'linear-gradient(105deg,transparent 40%,rgba(20,184,166,0.06) 50%,transparent 60%)', backgroundSize:'200% 100%', animation:'shimmer 3s ease infinite', animationDelay:`${i*0.4}s`, pointerEvents:'none' }} />
                  <motion.div
                    animate={{scale:[1,1.15,1],rotate:[0,5,-5,0]}}
                    transition={{duration:2.5,repeat:Infinity,delay:i*0.3,ease:'easeInOut'}}
                    style={{fontSize:30,marginBottom:'0.75rem',display:'inline-block'}}>{f.icon}</motion.div>
                  <div style={{color:'#fff',fontWeight:700,fontSize:14,marginBottom:'0.4rem'}}>{f.title}</div>
                  <div style={{color:'#475569',fontSize:12,lineHeight:1.6}}>{f.desc}</div>
                  {/* bottom accent line */}
                  <motion.div initial={{width:0}} animate={{width:'100%'}} transition={{delay:0.5+i*0.1,duration:0.8}}
                    style={{position:'absolute',bottom:0,left:0,height:2,background:`linear-gradient(90deg,transparent,#14b8a6,transparent)`}} />
                </motion.div>
              ))}
            </div>

            {/* ── Disclaimer ── */}
            <motion.div initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{delay:0.6}}
              style={{background:'rgba(245,158,11,0.06)',border:'1px solid rgba(245,158,11,0.2)',borderRadius:14,padding:'1rem 1.25rem',display:'flex',gap:10,marginBottom:'2rem',backdropFilter:'blur(8px)'}}>
              <motion.span animate={{rotate:[0,15,-15,0]}} transition={{duration:2,repeat:Infinity}} style={{fontSize:18}}>⚠️</motion.span>
              <p style={{color:'#94a3b8',fontSize:12,lineHeight:1.7,margin:0}}>
                <strong style={{color:'#f59e0b'}}>{t.disclaimer}:</strong> {t.disclaimerText}
              </p>
            </motion.div>

            {/* ── Health History ── */}
            {history.length>0 && (
              <motion.div id="history-section" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.7}}
                style={{background:'rgba(11,17,23,0.7)',backdropFilter:'blur(16px)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:20,padding:'1.5rem'}}>
                <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:'1rem'}}>
                  <motion.span animate={{scale:[1,1.2,1]}} transition={{duration:2,repeat:Infinity}} style={{fontSize:16}}>📋</motion.span>
                  <h3 style={{color:'#fff',fontSize:15,fontWeight:700,margin:0}}>{t.recentQueries}</h3>
                  <motion.div initial={{scale:0}} animate={{scale:1}} transition={{type:'spring',stiffness:200,delay:0.8}}
                    style={{marginLeft:'auto',padding:'2px 10px',borderRadius:100,background:'rgba(20,184,166,0.1)',border:'1px solid rgba(20,184,166,0.2)',color:'#14b8a6',fontSize:11,fontWeight:700}}>
                    {history.length} records
                  </motion.div>
                </div>
                <div style={{display:'flex',flexDirection:'column',gap:'0.6rem'}}>
                  {history.map((h,i)=>(
                    <motion.div key={i}
                      initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{delay:0.8+i*0.07}}
                      whileHover={{x:4,background:'rgba(20,184,166,0.06)'}}
                      style={{display:'flex',justifyContent:'space-between',alignItems:'center',background:'rgba(13,21,32,0.8)',borderRadius:10,padding:'0.75rem 1rem',border:'1px solid rgba(255,255,255,0.04)',transition:'all 0.2s',cursor:'default'}}>
                      <div>
                        <div style={{color:'#e2e8f0',fontSize:13,fontWeight:500}}>{h.symptoms?.slice(0,60)}{h.symptoms?.length>60?'...':''}</div>
                        <div style={{color:'#475569',fontSize:11,marginTop:2}}>{h.date}</div>
                      </div>
                      <motion.div initial={{scale:0}} animate={{scale:1}} transition={{delay:0.9+i*0.07,type:'spring',stiffness:200}}
                        style={{padding:'3px 10px',borderRadius:100,background:'rgba(20,184,166,0.1)',border:'1px solid rgba(20,184,166,0.2)',color:'#14b8a6',fontSize:11,fontWeight:700,whiteSpace:'nowrap'}}>
                        {h.confidence}% confidence
                      </motion.div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* ════════════════ SYMPTOM CHECKER MODE ════════════════ */}
        {mode==='symptom' && (
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}>
            {/* Progress */}
            <div style={{marginBottom:'2rem'}}>
              <div style={{display:'flex',justifyContent:'space-between',marginBottom:'0.5rem'}}>
                <motion.span initial={{opacity:0}} animate={{opacity:1}} style={{color:'#94a3b8',fontSize:13}}>{t.stepOf(step+1,STEPS.length)}</motion.span>
                <motion.span key={step} initial={{scale:1.4,color:'#fff'}} animate={{scale:1,color:'#14b8a6'}} style={{fontSize:13,fontWeight:600}}>{t.complete(Math.round((step/STEPS.length)*100))}</motion.span>
              </div>
              {/* progress bar with glow */}
              <div style={{height:6,background:'rgba(255,255,255,0.06)',borderRadius:3,overflow:'hidden',position:'relative'}}>
                <motion.div animate={{width:`${(step/STEPS.length)*100}%`}} transition={{duration:0.5,ease:'easeOut'}}
                  style={{height:'100%',background:'linear-gradient(90deg,#14b8a6,#38bdf8,#818cf8)',borderRadius:3,boxShadow:'0 0 12px rgba(20,184,166,0.6)',position:'relative'}}>
                  {/* shimmer on bar */}
                  <div style={{position:'absolute',inset:0,background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.3),transparent)',animation:'shimmer 1.5s ease infinite'}} />
                </motion.div>
              </div>
              <div style={{display:'flex',gap:6,marginTop:'0.75rem'}}>
                {STEPS.map((_,i)=>(
                  <motion.div key={i} animate={{background:i<=step?'#14b8a6':'rgba(255,255,255,0.06)',scale:i===step?[1,1.2,1]:1}}
                    transition={{duration:0.3,scale:{duration:0.4,repeat:i===step?Infinity:0,repeatDelay:1}}}
                    style={{flex:1,height:3,borderRadius:2}} />
                ))}
              </div>
            </div>

            <div style={{background:'rgba(11,17,23,0.8)',backdropFilter:'blur(20px)',border:'1px solid rgba(20,184,166,0.2)',borderRadius:24,padding:'2.5rem',boxShadow:'0 0 60px rgba(20,184,166,0.06)',position:'relative',overflow:'hidden'}}>
              {/* scanning line */}
              <div style={{position:'absolute',left:0,right:0,height:1,background:'linear-gradient(90deg,transparent,rgba(20,184,166,0.4),transparent)',animation:'scanline 3s linear infinite',pointerEvents:'none'}} />
              <AnimatePresence mode="wait">
                <motion.div key={step} initial={{opacity:0,x:30,scale:0.97}} animate={{opacity:1,x:0,scale:1}} exit={{opacity:0,x:-30,scale:0.97}} transition={{duration:0.3}}>
                  <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:'1.5rem'}}>
                    <motion.div
                      key={step}
                      initial={{scale:0,rotate:-180}} animate={{scale:1,rotate:0}} transition={{type:'spring',stiffness:300,damping:15}}
                      style={{width:38,height:38,borderRadius:'50%',background:'linear-gradient(135deg,#14b8a6,#38bdf8)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:800,fontSize:15,boxShadow:'0 4px 16px rgba(20,184,166,0.5)',flexShrink:0}}>{step+1}</motion.div>
                    <motion.h2 initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.1}}
                      style={{color:'#fff',fontSize:20,fontWeight:700,margin:0}}>{STEPS[step].question}</motion.h2>
                  </div>

                  {STEPS[step].type==='textarea' ? (
                    <textarea value={currentAnswer} onChange={e=>handleAnswerChange(e.target.value)}
                      placeholder={STEPS[step].placeholder} rows={4} style={inp}
                      onFocus={e=>e.target.style.borderColor='#14b8a6'}
                      onBlur={e=>e.target.style.borderColor=emergency&&step===0?'#ef4444':'rgba(255,255,255,0.1)'} />
                  ) : STEPS[step].type==='select' ? (
                    <div style={{display:'flex',flexDirection:'column',gap:'0.75rem'}}>
                      {STEPS[step].options.map((opt,oi)=>(
                        <motion.button key={opt}
                          initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} transition={{delay:oi*0.07,type:'spring',stiffness:200}}
                          whileHover={{scale:1.02,x:4}} whileTap={{scale:0.98}} onClick={()=>setCurrentAnswer(opt)}
                          style={{ padding:'14px 18px', borderRadius:12, textAlign:'left', cursor:'pointer', background:currentAnswer===opt?'rgba(20,184,166,0.12)':'rgba(13,21,32,0.8)', border:`1px solid ${currentAnswer===opt?'#14b8a6':'rgba(255,255,255,0.08)'}`, color:currentAnswer===opt?'#14b8a6':'#e2e8f0', fontSize:14, fontWeight:currentAnswer===opt?600:400, backdropFilter:'blur(8px)', transition:'all 0.2s', position:'relative', overflow:'hidden' }}>
                          {currentAnswer===opt && <motion.div layoutId="selectHighlight" style={{position:'absolute',inset:0,background:'rgba(20,184,166,0.06)',borderRadius:12}} />}
                          {opt}
                        </motion.button>
                      ))}
                    </div>
                  ) : (
                    <input type={STEPS[step].type} value={currentAnswer} onChange={e=>handleAnswerChange(e.target.value)}
                      placeholder={STEPS[step].placeholder} style={inp}
                      onFocus={e=>e.target.style.borderColor='#14b8a6'}
                      onBlur={e=>e.target.style.borderColor='rgba(255,255,255,0.1)'} />
                  )}

                  <div style={{display:'flex',gap:10,marginTop:'1.25rem'}}>
                    <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.98}} onClick={handleNext}
                      disabled={!currentAnswer&&!STEPS[step].optional}
                      style={{ flex:1, padding:14, borderRadius:12, background:(!currentAnswer&&!STEPS[step].optional)?'rgba(20,184,166,0.15)':'linear-gradient(135deg,#14b8a6,#38bdf8)', border:'none', color:'#fff', fontWeight:700, fontSize:15, cursor:(!currentAnswer&&!STEPS[step].optional)?'not-allowed':'pointer', boxShadow:(!currentAnswer&&!STEPS[step].optional)?'none':'0 4px 20px rgba(20,184,166,0.3)' }}>
                      {step===STEPS.length-1?t.analyze:t.next}
                    </motion.button>
                    <motion.button whileHover={{scale:1.05}} whileTap={{scale:0.95}} onClick={startVoice}
                      style={{ width:52, height:52, borderRadius:12, border:`2px solid ${listening?'#ef4444':'rgba(129,140,248,0.4)'}`, background:listening?'rgba(239,68,68,0.1)':'rgba(129,140,248,0.1)', cursor:'pointer', fontSize:20, display:'flex', alignItems:'center', justifyContent:'center', backdropFilter:'blur(8px)', position:'relative', overflow:'hidden' }}>
                      {listening ? (
                        <div style={{display:'flex',gap:2,alignItems:'center'}}>
                          {[0,1,2,3].map(b=>(
                            <div key={b} style={{width:3,height:16,background:'#ef4444',borderRadius:2,animation:`waveBar 0.6s ease-in-out infinite`,animationDelay:`${b*0.1}s`}} />
                          ))}
                        </div>
                      ) : '🎙️'}
                    </motion.button>
                    {STEPS[step].optional && (
                      <button onClick={()=>{setCurrentAnswer('');handleNext();}}
                        style={{padding:'14px 18px',borderRadius:12,background:'none',border:'1px solid rgba(255,255,255,0.08)',color:'#64748b',fontSize:13,cursor:'pointer'}}>
                        {t.skip}
                      </button>
                    )}
                  </div>

                  {listening && (
                    <motion.div animate={{opacity:[0.5,1,0.5]}} transition={{duration:1,repeat:Infinity}}
                      style={{marginTop:'0.75rem',color:'#ef4444',fontSize:13,textAlign:'center'}}>
                      {t.listening}
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* ════════════════ RESULT MODE ════════════════ */}
        {mode==='result' && (
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}>
            {loading ? (
              <motion.div initial={{opacity:0,scale:0.97}} animate={{opacity:1,scale:1}}
                style={{background:'rgba(11,17,23,0.8)',backdropFilter:'blur(20px)',border:'1px solid rgba(20,184,166,0.2)',borderRadius:24,padding:'4rem 2rem',textAlign:'center',position:'relative',overflow:'hidden'}}>
                {/* scanning line */}
                <div style={{position:'absolute',left:0,right:0,height:2,background:'linear-gradient(90deg,transparent,rgba(20,184,166,0.6),transparent)',animation:'scanline 2s linear infinite',pointerEvents:'none'}} />
                <div style={{position:'relative',width:90,height:90,margin:'0 auto 2rem'}}>
                  {[0,1,2,3].map(i=>(
                    <motion.div key={i}
                      animate={{scale:[1,1.9,1],opacity:[0.7,0,0.7]}}
                      transition={{duration:1.8,repeat:Infinity,delay:i*0.35}}
                      style={{position:'absolute',inset:0,borderRadius:'50%',border:`2px solid ${['#14b8a6','#38bdf8','#818cf8','#f59e0b'][i]}`}} />
                  ))}
                  <motion.div
                    animate={{rotate:360}} transition={{duration:3,repeat:Infinity,ease:'linear'}}
                    style={{position:'absolute',inset:'18%',borderRadius:'50%',background:'linear-gradient(135deg,#14b8a6,#38bdf8,#818cf8)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22}}>🏥</motion.div>
                </div>
                <motion.div animate={{opacity:[0.7,1,0.7]}} transition={{duration:1.5,repeat:Infinity}}
                  style={{color:'#fff',fontWeight:700,fontSize:17,marginBottom:'0.5rem'}}>{t.analyzing}</motion.div>
                <div style={{color:'#475569',fontSize:13,marginBottom:'1.5rem'}}>{t.processingWith}</div>
                <div style={{display:'flex',flexWrap:'wrap',gap:6,justifyContent:'center',marginBottom:'1.5rem'}}>
                  {(lang==='hi'
                    ?['लक्षण विश्लेषण','पैटर्न जांच','अंतर्दृष्टि','सिफारिशें']
                    :['Analyzing symptoms','Checking patterns','Generating insights','Preparing recommendations']
                  ).map((s,i)=>(
                    <motion.div key={s}
                      animate={{opacity:[0.3,1,0.3],y:[2,0,2]}}
                      transition={{duration:1.5,repeat:Infinity,delay:i*0.4}}
                      style={{padding:'5px 14px',borderRadius:100,background:'rgba(20,184,166,0.08)',border:'1px solid rgba(20,184,166,0.2)',color:'#14b8a6',fontSize:11,display:'flex',alignItems:'center',gap:5}}>
                      <motion.div animate={{scale:[1,1.4,1]}} transition={{duration:1.5,repeat:Infinity,delay:i*0.4}}
                        style={{width:5,height:5,borderRadius:'50%',background:'#14b8a6'}} />
                      {s}
                    </motion.div>
                  ))}
                </div>
                {/* progress dots */}
                <div style={{display:'flex',gap:6,justifyContent:'center'}}>
                  {[0,1,2,3,4,5,6,7].map(i=>(
                    <motion.div key={i}
                      animate={{scale:[1,1.5,1],background:['rgba(20,184,166,0.2)','#14b8a6','rgba(20,184,166,0.2)']}}
                      transition={{duration:1.6,repeat:Infinity,delay:i*0.2}}
                      style={{width:7,height:7,borderRadius:'50%'}} />
                  ))}
                </div>
              </motion.div>
            ) : result?.error ? (
              <div style={{background:'rgba(239,68,68,0.08)',border:'1px solid rgba(239,68,68,0.2)',borderRadius:20,padding:'2rem',textAlign:'center'}}>
                <div style={{fontSize:40,marginBottom:'1rem'}}>⚠️</div>
                <div style={{color:'#fca5a5',fontSize:15,marginBottom:'1rem'}}>{result.error}</div>
                <button onClick={reset} style={{padding:'10px 24px',borderRadius:10,background:'rgba(239,68,68,0.15)',border:'1px solid rgba(239,68,68,0.3)',color:'#fca5a5',cursor:'pointer',fontSize:14}}>{t.tryAgain}</button>
              </div>
            ) : result && (
              <div style={{display:'flex',flexDirection:'column',gap:'1.25rem'}}>

                {/* Confidence + Recommendation */}
                <motion.div initial={{opacity:0,y:30,scale:0.97}} animate={{opacity:1,y:0,scale:1}} transition={{duration:0.5,type:'spring'}}
                  style={{background:'rgba(11,17,23,0.8)',backdropFilter:'blur(20px)',border:'1px solid rgba(20,184,166,0.2)',borderRadius:20,padding:'2rem',boxShadow:'0 16px 48px rgba(20,184,166,0.08)',position:'relative',overflow:'hidden'}}>
                  {/* shimmer overlay */}
                  <div style={{position:'absolute',inset:0,background:'linear-gradient(105deg,transparent 40%,rgba(20,184,166,0.04) 50%,transparent 60%)',backgroundSize:'200% 100%',animation:'shimmer 4s ease infinite',pointerEvents:'none'}} />
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.25rem',flexWrap:'wrap',gap:'0.5rem'}}>
                    <div style={{display:'flex',alignItems:'center',gap:10}}>
                      <motion.div animate={{rotate:[0,360]}} transition={{duration:4,repeat:Infinity,ease:'linear'}}
                        style={{width:36,height:36,borderRadius:10,background:'linear-gradient(135deg,#14b8a6,#38bdf8)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,boxShadow:'0 0 16px rgba(20,184,166,0.4)'}}>✦</motion.div>
                      <div>
                        <div style={{color:'#fff',fontWeight:700,fontSize:15}}>{t.analysisComplete}</div>
                        <div style={{color:'#475569',fontSize:11}}>{lang==='hi'?'Groq AI + WHO दिशानिर्देश':'Groq AI + WHO Clinical Guidelines'}</div>
                      </div>
                    </div>
                    <motion.div initial={{scale:0}} animate={{scale:1}} transition={{delay:0.3,type:'spring',stiffness:200}}
                      style={{padding:'4px 14px',borderRadius:100,background:'rgba(20,184,166,0.1)',border:'1px solid rgba(20,184,166,0.25)',color:'#14b8a6',fontSize:12,fontWeight:700}}>
                      {t.confidence(result.confidence)}
                    </motion.div>
                  </div>
                  {/* animated confidence bar */}
                  <div style={{height:8,background:'rgba(255,255,255,0.06)',borderRadius:4,overflow:'hidden',marginBottom:'1.5rem',position:'relative'}}>
                    <motion.div initial={{width:0}} animate={{width:`${result.confidence}%`}} transition={{duration:1.5,ease:'easeOut'}}
                      style={{height:'100%',background:'linear-gradient(90deg,#14b8a6,#38bdf8,#818cf8)',borderRadius:4,boxShadow:'0 0 10px rgba(20,184,166,0.5)',position:'relative'}}>
                      <div style={{position:'absolute',inset:0,background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.25),transparent)',animation:'shimmer 1.5s ease infinite'}} />
                    </motion.div>
                    {/* confidence marker */}
                    <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.5}}
                      style={{position:'absolute',top:-4,left:`${result.confidence}%`,transform:'translateX(-50%)',width:16,height:16,borderRadius:'50%',background:'#fff',border:'3px solid #14b8a6',boxShadow:'0 0 8px rgba(20,184,166,0.6)'}} />
                  </div>
                  <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.4}}
                    style={{background:'rgba(20,184,166,0.05)',borderLeft:'3px solid #14b8a6',borderRadius:'0 10px 10px 0',padding:'1rem 1.25rem',marginBottom:'1rem'}}>
                    <div style={{color:'#64748b',fontSize:11,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.8px',marginBottom:6}}>{t.recommendation}</div>
                    <p style={{color:'#e2e8f0',fontSize:14,lineHeight:1.8,margin:0}}>{result.recommendation}</p>
                  </motion.div>
                  <motion.button whileHover={{scale:1.03,boxShadow:'0 4px 16px rgba(129,140,248,0.3)'}} whileTap={{scale:0.97}}
                    onClick={()=>speak(result.recommendation.split('\n\n⚠️')[0])}
                    style={{background:'rgba(129,140,248,0.08)',border:'1px solid rgba(129,140,248,0.18)',borderRadius:8,padding:'6px 14px',color:'#a5b4fc',fontSize:12,cursor:'pointer'}}>
                    {t.readAloud}
                  </motion.button>
                </motion.div>

                {/* Specialist + Factors */}
                <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:'1rem'}}>
                  <motion.div initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{delay:0.2,type:'spring'}}
                    style={{background:'rgba(11,17,23,0.8)',backdropFilter:'blur(16px)',border:'1px solid rgba(129,140,248,0.18)',borderRadius:18,padding:'1.5rem',position:'relative',overflow:'hidden'}}>
                    <div style={{position:'absolute',top:-20,right:-20,width:80,height:80,borderRadius:'50%',background:'radial-gradient(circle,rgba(129,140,248,0.15),transparent)',pointerEvents:'none'}} />
                    <div style={{color:'#94a3b8',fontSize:11,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.8px',marginBottom:'1rem'}}>{t.specialist}</div>
                    <div style={{display:'flex',alignItems:'center',gap:12}}>
                      <motion.div animate={{scale:[1,1.08,1]}} transition={{duration:2,repeat:Infinity}}
                        style={{width:48,height:48,borderRadius:14,background:'rgba(129,140,248,0.12)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22}}>👨‍⚕️</motion.div>
                      <div>
                        <motion.div initial={{opacity:0,y:5}} animate={{opacity:1,y:0}} transition={{delay:0.4}}
                          style={{color:'#fff',fontWeight:700,fontSize:16}}>{specialist}</motion.div>
                        <div style={{color:'#475569',fontSize:12}}>{t.specialistDesc}</div>
                      </div>
                    </div>
                    <div style={{marginTop:'1rem',padding:10,background:'rgba(129,140,248,0.06)',borderRadius:10,color:'#94a3b8',fontSize:12}}>{t.specialistTip(specialist)}</div>
                  </motion.div>
                  <motion.div initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} transition={{delay:0.3,type:'spring'}}
                    style={{background:'rgba(11,17,23,0.8)',backdropFilter:'blur(16px)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:18,padding:'1.5rem'}}>
                    <div style={{color:'#94a3b8',fontSize:11,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.8px',marginBottom:'1rem'}}>{t.riskFactors}</div>
                    {result.factors?.slice(0,4).map((f,i)=>(
                      <motion.div key={i} initial={{opacity:0,x:10}} animate={{opacity:1,x:0}} transition={{delay:0.4+i*0.1}}>
                        <div style={{display:'flex',justifyContent:'space-between',marginBottom:3}}>
                          <span style={{color:'#94a3b8',fontSize:12}}>{f.label}</span>
                          <motion.span initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.8+i*0.1}}
                            style={{color:f.color,fontSize:12,fontWeight:600}}>{f.value}%</motion.span>
                        </div>
                        <div style={{height:5,background:'rgba(255,255,255,0.06)',borderRadius:2,marginBottom:8,overflow:'hidden'}}>
                          <motion.div initial={{width:0}} animate={{width:`${f.value}%`}} transition={{duration:1,delay:0.5+i*0.15,ease:'easeOut'}}
                            style={{height:'100%',background:f.color,borderRadius:2,boxShadow:`0 0 6px ${f.color}60`}} />
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>

                {/* Nearby */}
                <NearbyLocations t={t} lang={lang} />

                {/* Reasoning */}
                <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.3}}
                  style={{background:'rgba(11,17,23,0.8)',backdropFilter:'blur(16px)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:18,padding:'1.5rem'}}>
                  <div style={{color:'#94a3b8',fontSize:11,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.8px',marginBottom:'1rem'}}>{t.reasoning}</div>
                  <div style={{position:'relative'}}>
                    {/* vertical timeline line */}
                    <div style={{position:'absolute',left:10,top:0,width:1,background:'rgba(20,184,166,0.2)',overflow:'hidden',bottom:0}}>
                      <motion.div initial={{height:0}} animate={{height:'100%'}} transition={{duration:1.5,ease:'easeOut'}}
                        style={{width:'100%',background:'linear-gradient(to bottom,#14b8a6,transparent)'}} />
                    </div>
                    {result.reasoning?.map((r,i)=>(
                      <motion.div key={i} initial={{opacity:0,x:-15}} animate={{opacity:1,x:0}} transition={{delay:0.2+i*0.12,type:'spring',stiffness:150}}
                        whileHover={{x:4,background:'rgba(20,184,166,0.06)'}}
                        style={{display:'flex',gap:10,padding:'10px 12px 10px 28px',background:'rgba(13,21,32,0.8)',borderRadius:10,marginBottom:8,position:'relative',transition:'all 0.2s'}}>
                        <motion.div initial={{scale:0}} animate={{scale:1}} transition={{delay:0.3+i*0.12,type:'spring',stiffness:300}}
                          style={{position:'absolute',left:4,top:'50%',transform:'translateY(-50%)',width:14,height:14,borderRadius:'50%',background:'rgba(20,184,166,0.2)',border:'2px solid #14b8a6',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                          <div style={{width:4,height:4,borderRadius:'50%',background:'#14b8a6'}} />
                        </motion.div>
                        <span style={{color:'#cbd5e1',fontSize:13,lineHeight:1.6}}>{r}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Actions */}
                <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.45}}
                  style={{background:'rgba(11,17,23,0.8)',backdropFilter:'blur(16px)',border:'1px solid rgba(20,184,166,0.15)',borderRadius:18,padding:'1.5rem',position:'relative',overflow:'hidden'}}>
                  <div style={{position:'absolute',top:0,left:0,right:0,height:2,background:'linear-gradient(90deg,transparent,#14b8a6,#38bdf8,transparent)',animation:'shimmer 2s ease infinite'}} />
                  <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:'1rem'}}>
                    <motion.span animate={{scale:[1,1.2,1]}} transition={{duration:1.5,repeat:Infinity}} style={{fontSize:16}}>✅</motion.span>
                    <div style={{color:'#94a3b8',fontSize:11,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.8px'}}>{t.actions}</div>
                  </div>
                  {result.actions?.map((a,i)=>(
                    <motion.div key={i}
                      initial={{opacity:0,x:-20,scale:0.96}} animate={{opacity:1,x:0,scale:1}}
                      transition={{delay:0.5+i*0.1,type:'spring',stiffness:180}}
                      whileHover={{x:6,background:'rgba(20,184,166,0.08)',borderColor:'rgba(20,184,166,0.25)'}}
                      style={{display:'flex',gap:12,padding:'12px 14px',background:'rgba(20,184,166,0.04)',border:'1px solid rgba(20,184,166,0.1)',borderRadius:10,marginBottom:8,cursor:'default',transition:'all 0.2s'}}>
                      <motion.div
                        initial={{scale:0,rotate:-90}} animate={{scale:1,rotate:0}}
                        transition={{delay:0.6+i*0.1,type:'spring',stiffness:300}}
                        style={{width:24,height:24,borderRadius:'50%',background:'linear-gradient(135deg,rgba(20,184,166,0.3),rgba(56,189,248,0.2))',color:'#14b8a6',fontSize:11,fontWeight:800,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,border:'1px solid rgba(20,184,166,0.3)'}}>
                        {i+1}
                      </motion.div>
                      <span style={{color:'#cbd5e1',fontSize:13,lineHeight:1.6}}>{a}</span>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Alternatives */}
                {result.alternatives?.length>0 && (
                  <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.55}}
                    style={{background:'rgba(11,17,23,0.8)',backdropFilter:'blur(16px)',border:'1px solid rgba(56,189,248,0.15)',borderRadius:18,padding:'1.5rem',position:'relative',overflow:'hidden'}}>
                    <div style={{position:'absolute',bottom:0,left:0,right:0,height:1,background:'linear-gradient(90deg,transparent,#38bdf8,transparent)',opacity:0.4}} />
                    <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:'1rem'}}>
                      <motion.span animate={{x:[0,4,0]}} transition={{duration:1.5,repeat:Infinity}} style={{fontSize:16}}>💡</motion.span>
                      <div style={{color:'#94a3b8',fontSize:11,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.8px'}}>{t.alternatives}</div>
                    </div>
                    {result.alternatives.map((a,i)=>(
                      <motion.div key={i}
                        initial={{opacity:0,x:20}} animate={{opacity:1,x:0}}
                        transition={{delay:0.6+i*0.09,type:'spring',stiffness:160}}
                        whileHover={{x:6,background:'rgba(56,189,248,0.08)',borderColor:'rgba(56,189,248,0.25)'}}
                        style={{padding:'10px 14px',background:'rgba(56,189,248,0.04)',border:'1px solid rgba(56,189,248,0.1)',borderRadius:10,color:'#94a3b8',fontSize:13,marginBottom:6,display:'flex',alignItems:'center',gap:8,cursor:'default',transition:'all 0.2s'}}>
                        <motion.span animate={{x:[0,3,0]}} transition={{duration:1.2,repeat:Infinity,delay:i*0.2}} style={{color:'#38bdf8',fontWeight:700}}>→</motion.span>
                        {a}
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                {/* Disclaimer */}
                <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.65}}
                  style={{background:'rgba(245,158,11,0.06)',border:'1px solid rgba(245,158,11,0.2)',borderRadius:14,padding:'1rem 1.25rem',display:'flex',gap:10}}>
                  <motion.span animate={{rotate:[0,15,-15,0],scale:[1,1.1,1]}} transition={{duration:3,repeat:Infinity}} style={{fontSize:18,flexShrink:0}}>⚠️</motion.span>
                  <p style={{color:'#94a3b8',fontSize:12,lineHeight:1.7,margin:0}}>
                    <strong style={{color:'#f59e0b'}}>{t.disclaimer}:</strong> {t.resultDisclaimer}
                  </p>
                </motion.div>

                <motion.button
                  initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.7}}
                  whileHover={{scale:1.02,boxShadow:'0 8px 30px rgba(20,184,166,0.25)',background:'rgba(20,184,166,0.12)'}}
                  whileTap={{scale:0.97}}
                  onClick={reset}
                  style={{padding:14,borderRadius:14,background:'rgba(20,184,166,0.07)',border:'1px solid rgba(20,184,166,0.18)',color:'#14b8a6',fontSize:15,fontWeight:600,cursor:'pointer',position:'relative',overflow:'hidden',transition:'all 0.2s'}}>
                  <motion.div style={{position:'absolute',inset:0,background:'linear-gradient(90deg,transparent,rgba(20,184,166,0.08),transparent)',backgroundSize:'200% 100%',animation:'shimmer 2s ease infinite',pointerEvents:'none'}} />
                  {t.startNew}
                </motion.button>
              </div>
            )}
          </motion.div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes heartbeat { 0%,100%{transform:scale(1)} 14%{transform:scale(1.18)} 28%{transform:scale(1)} 42%{transform:scale(1.12)} 70%{transform:scale(1)} }
        @keyframes shimmer { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
        @keyframes scanline { 0%{top:0%} 100%{top:100%} }
        @keyframes borderGlow { 0%,100%{box-shadow:0 0 8px rgba(20,184,166,0.2)} 50%{box-shadow:0 0 24px rgba(20,184,166,0.5),0 0 48px rgba(56,189,248,0.2)} }
        @keyframes floatUp { 0%{transform:translateY(0px)} 50%{transform:translateY(-8px)} 100%{transform:translateY(0px)} }
        @keyframes ripple { 0%{transform:scale(0);opacity:0.6} 100%{transform:scale(4);opacity:0} }
        @keyframes drawLine { from{height:0} to{height:100%} }
        @keyframes countUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes gradientShift { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
        @keyframes typewriter { from{width:0} to{width:100%} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes slideInLeft { from{opacity:0;transform:translateX(-20px)} to{opacity:1;transform:translateX(0)} }
        @keyframes slideInRight { from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:translateX(0)} }
        @keyframes popIn { 0%{transform:scale(0.5);opacity:0} 70%{transform:scale(1.1)} 100%{transform:scale(1);opacity:1} }
        @keyframes waveBar { 0%,100%{transform:scaleY(0.4)} 50%{transform:scaleY(1)} }
      `}</style>
    </div>
  );
}
