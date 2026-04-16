import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { analyzeWithAI } from '../services/api';

const scoreColor = (v) => v >= 75 ? '#14b8a6' : v >= 50 ? '#f59e0b' : '#ef4444';
const scoreLabel = (v) => v >= 75 ? 'Good' : v >= 50 ? 'Needs Work' : 'Poor';
const diffColor  = { Easy: '#14b8a6', Medium: '#f59e0b', Hard: '#ef4444' };
const attnColor  = { high: '#14b8a6', medium: '#f59e0b', low: '#64748b' };
const mistakeClr = { weak_verb: '#f59e0b', passive_voice: '#ef4444', repetition: '#818cf8', vague: '#f97316' };
const typeClr    = { impact: '#14b8a6', clarity: '#38bdf8', keywords: '#818cf8', format: '#f59e0b' };

function ScoreRing({ value = 0, size = 110, stroke = 9, label, color }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const c = color || scoreColor(value);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', position: 'absolute' }}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
          <motion.circle cx={size/2} cy={size/2} r={r} fill="none" stroke={c} strokeWidth={stroke}
            strokeLinecap="round" strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: circ - (value / 100) * circ }}
            transition={{ duration: 1.2, ease: 'easeOut' }} />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ color: '#fff', fontWeight: 800, fontSize: size * 0.22, lineHeight: 1 }}>{value}</div>
          <div style={{ color: c, fontSize: size * 0.11, fontWeight: 600 }}>{scoreLabel(value)}</div>
        </div>
      </div>
      {label && <div style={{ color: '#94a3b8', fontSize: 11, fontWeight: 600, textAlign: 'center' }}>{label}</div>}
    </div>
  );
}

function Card({ children, accent, style = {} }) {
  return (
    <div style={{ background: '#0b1117', border: `1px solid ${accent ? accent + '25' : 'rgba(255,255,255,0.07)'}`, borderRadius: 18, padding: '1.5rem', ...style }}>
      {children}
    </div>
  );
}

function SectionTitle({ icon, title, badge, badgeColor = '#14b8a6' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.25rem' }}>
      <span style={{ fontSize: 18 }}>{icon}</span>
      <span style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>{title}</span>
      {badge && (
        <span style={{ marginLeft: 'auto', padding: '2px 10px', borderRadius: 100, background: `${badgeColor}18`, border: `1px solid ${badgeColor}30`, color: badgeColor, fontSize: 11, fontWeight: 700 }}>
          {badge}
        </span>
      )}
    </div>
  );
}

function MiniBar({ label, value, color, delay = 0 }) {
  const c = color || scoreColor(value);
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ color: '#94a3b8', fontSize: 12 }}>{label}</span>
        <span style={{ color: c, fontSize: 12, fontWeight: 700 }}>{value}%</span>
      </div>
      <div style={{ height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
        <motion.div initial={{ width: 0 }} animate={{ width: `${value}%` }}
          transition={{ duration: 0.9, delay, ease: 'easeOut' }}
          style={{ height: '100%', background: c, borderRadius: 3 }} />
      </div>
    </div>
  );
}

function UploadZone({ onText }) {
  const [dragging, setDragging] = useState(false);
  const [parsing, setParsing]   = useState(false);
  const [fileName, setFileName] = useState('');
  const inputRef = useRef();

  const parseFile = async (file) => {
    if (!file) return;
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['pdf', 'docx'].includes(ext)) { alert('Only PDF and DOCX supported.'); return; }
    setParsing(true); setFileName(file.name);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res  = await fetch('/api/resume/parse', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Parse failed');
      onText(data.text);
    } catch (e) {
      alert('Could not parse file: ' + e.message);
      setFileName('');
    } finally { setParsing(false); }
  };

  const onDrop = useCallback((e) => {
    e.preventDefault(); setDragging(false);
    parseFile(e.dataTransfer.files[0]);
  }, []);

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      onClick={() => inputRef.current?.click()}
      style={{
        border: `2px dashed ${dragging ? '#14b8a6' : 'rgba(255,255,255,0.12)'}`,
        borderRadius: 14, padding: '1.75rem', textAlign: 'center', cursor: 'pointer',
        background: dragging ? 'rgba(20,184,166,0.05)' : 'rgba(255,255,255,0.02)',
        transition: 'all 0.2s',
      }}
    >
      <input ref={inputRef} type="file" accept=".pdf,.docx" style={{ display: 'none' }}
        onChange={(e) => parseFile(e.target.files[0])} />
      {parsing ? (
        <div style={{ color: '#14b8a6', fontSize: 13 }}>⏳ Parsing {fileName}…</div>
      ) : fileName ? (
        <div style={{ color: '#14b8a6', fontSize: 13 }}>✅ {fileName} — text extracted</div>
      ) : (
        <>
          <div style={{ fontSize: 30, marginBottom: 8 }}>📄</div>
          <div style={{ color: '#94a3b8', fontSize: 13 }}>
            Drop <strong style={{ color: '#fff' }}>PDF / DOCX</strong> here or{' '}
            <span style={{ color: '#14b8a6' }}>browse</span>
          </div>
          <div style={{ color: '#475569', fontSize: 11, marginTop: 4 }}>Max 10 MB</div>
        </>
      )}
    </div>
  );
}

const LOADING_STEPS = [
  'Parsing resume structure…',
  'Running ATS compatibility check…',
  'Matching skills to job description…',
  'Detecting weak verbs & passive voice…',
  'Generating improvement suggestions…',
  'Simulating HR 6-second scan…',
  'Predicting shortlist probability…',
  'Building skill gap roadmap…',
  'Generating interview questions…',
  'Finalising AI-powered report…',
];

function LoadingScreen() {
  const [idx, setIdx] = useState(0);
  React.useEffect(() => {
    const t = setInterval(() => setIdx(i => Math.min(i + 1, LOADING_STEPS.length - 1)), 1500);
    return () => clearInterval(t);
  }, []);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      style={{ background: '#0b1117', border: '1px solid rgba(20,184,166,0.18)', borderRadius: 20, padding: '3rem 2rem', textAlign: 'center' }}>
      <div style={{ position: 'relative', width: 80, height: 80, margin: '0 auto 2rem' }}>
        {[0,1,2].map(i => (
          <motion.div key={i} animate={{ scale: [1,1.8,1], opacity: [0.5,0,0.5] }}
            transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.5 }}
            style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2px solid #14b8a6' }} />
        ))}
        <div style={{ position: 'absolute', inset: '22%', borderRadius: '50%', background: 'linear-gradient(135deg,#14b8a6,#38bdf8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>📄</div>
      </div>
      <div style={{ color: '#fff', fontWeight: 700, fontSize: 17, marginBottom: 8 }}>AI is analysing your resume…</div>
      <AnimatePresence mode="wait">
        <motion.div key={idx} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
          style={{ color: '#14b8a6', fontSize: 13, marginBottom: '1.5rem' }}>
          {LOADING_STEPS[idx]}
        </motion.div>
      </AnimatePresence>
      <div style={{ display: 'flex', gap: 4, justifyContent: 'center', flexWrap: 'wrap' }}>
        {LOADING_STEPS.map((_, i) => (
          <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: i <= idx ? '#14b8a6' : 'rgba(255,255,255,0.1)', transition: 'background 0.3s' }} />
        ))}
      </div>
    </motion.div>
  );
}

function ScoreDashboard({ result }) {
  const tiles = [
    { label: 'ATS Score',    value: result.atsScore,         reason: result.scoreReasons?.ats },
    { label: 'Skill Match',  value: result.skillMatchScore,  reason: result.scoreReasons?.skillMatch },
    { label: 'Impact',       value: result.impactScore,      reason: result.scoreReasons?.impact },
    { label: 'Readability',  value: result.readabilityScore, reason: result.scoreReasons?.readability },
  ];
  return (
    <Card accent="#14b8a6">
      <SectionTitle icon="🎯" title="Resume Score Dashboard" badge={`${result.overallScore}/100`} />
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
        <ScoreRing value={result.overallScore} size={130} stroke={10} label="Overall Score" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {tiles.map((t, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            style={{ background: '#0d1520', borderRadius: 12, padding: '1rem', border: `1px solid ${scoreColor(t.value)}22` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ color: '#94a3b8', fontSize: 12, fontWeight: 600 }}>{t.label}</span>
              <span style={{ color: scoreColor(t.value), fontWeight: 800, fontSize: 20 }}>{t.value}</span>
            </div>
            <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden', marginBottom: 8 }}>
              <motion.div initial={{ width: 0 }} animate={{ width: `${t.value}%` }} transition={{ duration: 1, delay: i * 0.15 }}
                style={{ height: '100%', background: scoreColor(t.value), borderRadius: 2 }} />
            </div>
            {t.reason && <div style={{ color: '#475569', fontSize: 11, lineHeight: 1.5 }}>{t.reason}</div>}
          </motion.div>
        ))}
      </div>
      <div style={{ padding: '1rem 1.25rem', background: 'rgba(20,184,166,0.05)', borderLeft: '3px solid #14b8a6', borderRadius: '0 10px 10px 0' }}>
        <div style={{ color: '#64748b', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 6 }}>AI Assessment</div>
        <p style={{ color: '#e2e8f0', fontSize: 13, lineHeight: 1.8, margin: 0 }}>{result.recommendation}</p>
      </div>
    </Card>
  );
}

function SuggestionsPanel({ suggestions, onReplace }) {
  return (
    <Card accent="#38bdf8">
      <SectionTitle icon="✨" title="AI Suggestions — Before → After" badge={`${suggestions?.length || 0} fixes`} badgeColor="#38bdf8" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {suggestions?.map((s, i) => (
          <motion.div key={s.id || i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
            style={{ background: '#0d1520', borderRadius: 12, padding: '1rem', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ padding: '2px 8px', borderRadius: 6, background: `${typeClr[s.type] || '#818cf8'}18`, color: typeClr[s.type] || '#818cf8', fontSize: 10, fontWeight: 700, textTransform: 'uppercase' }}>{s.type}</span>
                <span style={{ color: '#64748b', fontSize: 11 }}>{s.section}</span>
              </div>
              <button onClick={() => onReplace(s)}
                style={{ padding: '4px 12px', borderRadius: 8, background: 'rgba(20,184,166,0.1)', border: '1px solid rgba(20,184,166,0.2)', color: '#14b8a6', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
                Replace ↗
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div style={{ padding: '10px 12px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 8 }}>
                <div style={{ color: '#ef4444', fontSize: 10, fontWeight: 700, marginBottom: 4 }}>BEFORE</div>
                <div style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.6 }}>{s.weak}</div>
              </div>
              <div style={{ padding: '10px 12px', background: 'rgba(20,184,166,0.06)', border: '1px solid rgba(20,184,166,0.15)', borderRadius: 8 }}>
                <div style={{ color: '#14b8a6', fontSize: 10, fontWeight: 700, marginBottom: 4 }}>AFTER</div>
                <div style={{ color: '#e2e8f0', fontSize: 12, lineHeight: 1.6 }}>{s.strong}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}

function JobMatchPanel({ jobMatch }) {
  if (!jobMatch) return null;
  return (
    <Card accent="#818cf8">
      <SectionTitle icon="🔗" title="Job Description Match" badge={`${jobMatch.matchPercent}% Match`} badgeColor="#818cf8" />
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
        <ScoreRing value={jobMatch.matchPercent} size={110} stroke={9} color="#818cf8" label="Match Score" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        <div>
          <div style={{ color: '#ef4444', fontSize: 11, fontWeight: 700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.8px' }}>❌ Missing</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {jobMatch.missingKeywords?.map((k, i) => (
              <span key={i} style={{ padding: '3px 10px', borderRadius: 100, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#fca5a5', fontSize: 11 }}>{k}</span>
            ))}
          </div>
        </div>
        <div>
          <div style={{ color: '#14b8a6', fontSize: 11, fontWeight: 700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.8px' }}>✅ Present</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {jobMatch.presentKeywords?.map((k, i) => (
              <span key={i} style={{ padding: '3px 10px', borderRadius: 100, background: 'rgba(20,184,166,0.08)', border: '1px solid rgba(20,184,166,0.2)', color: '#14b8a6', fontSize: 11 }}>{k}</span>
            ))}
          </div>
        </div>
      </div>
      {jobMatch.suggestedKeywords?.length > 0 && (
        <div>
          <div style={{ color: '#f59e0b', fontSize: 11, fontWeight: 700, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.8px' }}>💡 Add These</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {jobMatch.suggestedKeywords.map((k, i) => (
              <span key={i} style={{ padding: '3px 10px', borderRadius: 100, background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', color: '#fbbf24', fontSize: 11 }}>{k}</span>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}

function HRScanSimulator({ sections }) {
  const [scanning, setScanning] = useState(false);
  const [revealed, setRevealed] = useState([]);
  const [done,     setDone]     = useState(false);

  const runScan = () => {
    setScanning(true); setRevealed([]); setDone(false);
    sections?.forEach((_, i) => {
      setTimeout(() => {
        setRevealed(prev => [...prev, i]);
        if (i === sections.length - 1) { setScanning(false); setDone(true); }
      }, i * 700);
    });
  };

  return (
    <Card accent="#f59e0b">
      <SectionTitle icon="👁️" title="HR 6-Second Scan Simulator" />
      <p style={{ color: '#64748b', fontSize: 12, marginBottom: '1.25rem', lineHeight: 1.6 }}>
        See which sections a recruiter notices first — and which get ignored.
      </p>
      <button onClick={runScan} disabled={scanning}
        style={{ padding: '10px 22px', borderRadius: 10, border: 'none', cursor: scanning ? 'wait' : 'pointer',
          fontWeight: 700, fontSize: 13, marginBottom: '1.25rem', color: '#fff',
          background: scanning ? 'rgba(245,158,11,0.2)' : 'linear-gradient(135deg,#f59e0b,#f97316)',
          boxShadow: scanning ? 'none' : '0 4px 16px rgba(245,158,11,0.25)' }}>
        {scanning ? '👁️ Scanning…' : done ? '↺ Re-run Scan' : '▶ Run Scan Simulation'}
      </button>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {sections?.map((s, i) => {
          const vis = revealed.includes(i);
          const c   = attnColor[s.attention] || '#64748b';
          return (
            <motion.div key={i} animate={{ opacity: vis ? 1 : 0.22, x: vis ? 0 : -6 }} transition={{ duration: 0.35 }}
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px',
                background: vis ? `${c}0d` : '#0d1520',
                border: `1px solid ${vis ? c + '30' : 'rgba(255,255,255,0.05)'}`,
                borderRadius: 10, transition: 'background 0.3s' }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: vis ? c : '#334155', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ color: vis ? '#fff' : '#475569', fontSize: 13, fontWeight: 600 }}>{s.section}</div>
                <div style={{ color: '#475569', fontSize: 11, marginTop: 2 }}>{s.reason}</div>
              </div>
              {vis && (
                <span style={{ padding: '2px 10px', borderRadius: 100, background: `${c}18`, color: c, fontSize: 10, fontWeight: 700, textTransform: 'uppercase' }}>
                  {s.attention}
                </span>
              )}
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
}

function RejectionPanel({ rejection }) {
  if (!rejection) return null;
  return (
    <Card accent="#ef4444">
      <SectionTitle icon="🔮" title="Rejection Prediction" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
        {[
          { label: 'Shortlist Chance', value: rejection.shortlistChance, color: '#14b8a6' },
          { label: 'Rejection Risk',   value: rejection.rejectionChance,  color: '#ef4444' },
        ].map((item, i) => (
          <div key={i} style={{ textAlign: 'center', padding: '1.25rem', background: `${item.color}08`, border: `1px solid ${item.color}20`, borderRadius: 12 }}>
            <div style={{ color: item.color, fontSize: 34, fontWeight: 800 }}>{item.value}%</div>
            <div style={{ color: '#94a3b8', fontSize: 12, marginTop: 4 }}>{item.label}</div>
            <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, marginTop: 10, overflow: 'hidden' }}>
              <motion.div initial={{ width: 0 }} animate={{ width: `${item.value}%` }} transition={{ duration: 1, delay: i * 0.2 }}
                style={{ height: '100%', background: item.color, borderRadius: 2 }} />
            </div>
          </div>
        ))}
      </div>
      <div style={{ color: '#94a3b8', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 8 }}>Why you might get rejected</div>
      {rejection.reasons?.map((r, i) => (
        <div key={i} style={{ display: 'flex', gap: 10, padding: '8px 12px', background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.1)', borderRadius: 8, marginBottom: 6 }}>
          <span style={{ color: '#ef4444' }}>⚠</span>
          <span style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.6 }}>{r}</span>
        </div>
      ))}
    </Card>
  );
}

function SkillGapPanel({ skillGap }) {
  if (!skillGap) return null;
  const lvlColor = { Beginner: '#14b8a6', Intermediate: '#f59e0b', Advanced: '#ef4444' };
  return (
    <Card accent="#818cf8">
      <SectionTitle icon="🗺️" title="Skill Gap + Learning Roadmap" />
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ color: '#94a3b8', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 8 }}>Missing Skills</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {skillGap.missingSkills?.map((s, i) => (
            <span key={i} style={{ padding: '4px 12px', borderRadius: 100, background: 'rgba(129,140,248,0.1)', border: '1px solid rgba(129,140,248,0.2)', color: '#a5b4fc', fontSize: 12 }}>{s}</span>
          ))}
        </div>
      </div>
      <div style={{ color: '#94a3b8', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 10 }}>Learning Roadmap</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {skillGap.roadmap?.map((r, i) => {
          const c = lvlColor[r.level] || '#818cf8';
          return (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
              style={{ padding: '12px 14px', background: `${c}08`, border: `1px solid ${c}20`, borderRadius: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ color: '#fff', fontWeight: 700, fontSize: 13 }}>{r.skill}</span>
                <span style={{ padding: '2px 8px', borderRadius: 100, background: `${c}18`, color: c, fontSize: 10, fontWeight: 700 }}>{r.level}</span>
              </div>
              <div style={{ color: '#64748b', fontSize: 11, marginBottom: 3 }}>📚 {r.resource}</div>
              <div style={{ color: '#64748b', fontSize: 11 }}>🛠 Project: {r.project}</div>
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
}

function InterviewPanel({ questions }) {
  const [tab, setTab] = useState('technical');
  if (!questions) return null;
  const tabs = [
    { key: 'technical', label: '⚙️ Technical',  data: questions.technical },
    { key: 'hr',        label: '🤝 HR',          data: questions.hr },
    { key: 'behavioral',label: '🧠 Behavioral',  data: questions.behavioral },
  ];
  return (
    <Card accent="#38bdf8">
      <SectionTitle icon="💬" title="Interview Question Generator" />
      <div style={{ display: 'flex', gap: 6, marginBottom: '1.25rem', background: '#0d1520', borderRadius: 10, padding: 4 }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            style={{ flex: 1, padding: '7px 10px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, transition: 'all 0.2s',
              background: tab === t.key ? 'rgba(56,189,248,0.15)' : 'none',
              color: tab === t.key ? '#38bdf8' : '#64748b' }}>
            {t.label}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
          {tabs.find(t => t.key === tab)?.data?.map((q, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, padding: '10px 12px', background: '#0d1520', borderRadius: 10, marginBottom: 8, alignItems: 'flex-start' }}>
              <span style={{ color: '#38bdf8', fontWeight: 800, fontSize: 13, minWidth: 24 }}>Q{i+1}</span>
              <div style={{ flex: 1, color: '#e2e8f0', fontSize: 13, lineHeight: 1.6 }}>{q.q}</div>
              <span style={{ padding: '2px 8px', borderRadius: 100, background: `${diffColor[q.difficulty] || '#64748b'}18`, color: diffColor[q.difficulty] || '#64748b', fontSize: 10, fontWeight: 700, whiteSpace: 'nowrap' }}>
                {q.difficulty}
              </span>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </Card>
  );
}

function HiddenMistakesPanel({ mistakes }) {
  if (!mistakes?.length) return null;
  const typeLabel = { weak_verb: 'Weak Verb', passive_voice: 'Passive Voice', repetition: 'Repetition', vague: 'Vague' };
  return (
    <Card accent="#f97316">
      <SectionTitle icon="🔍" title="Hidden Mistake Detector" badge={`${mistakes.length} found`} badgeColor="#f97316" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {mistakes.map((m, i) => {
          const c = mistakeClr[m.type] || '#f97316';
          return (
            <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
              style={{ padding: '10px 14px', background: `${c}08`, border: `1px solid ${c}20`, borderRadius: 10 }}>
              <div style={{ marginBottom: 6 }}>
                <span style={{ padding: '2px 8px', borderRadius: 6, background: `${c}18`, color: c, fontSize: 10, fontWeight: 700 }}>
                  {typeLabel[m.type] || m.type}
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div>
                  <div style={{ color: '#ef4444', fontSize: 10, fontWeight: 700, marginBottom: 3 }}>WEAK</div>
                  <div style={{ color: '#94a3b8', fontSize: 12 }}>"{m.original}"</div>
                </div>
                <div>
                  <div style={{ color: '#14b8a6', fontSize: 10, fontWeight: 700, marginBottom: 3 }}>STRONGER</div>
                  <div style={{ color: '#e2e8f0', fontSize: 12 }}>"{m.suggestion}"</div>
                </div>
              </div>
              {m.line && <div style={{ color: '#475569', fontSize: 11, marginTop: 6, fontStyle: 'italic' }}>Context: {m.line}</div>}
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
}

function ImprovedResumePanel({ text }) {
  const [copied, setCopied] = useState(false);
  if (!text) return null;
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <Card accent="#14b8a6">
      <SectionTitle icon="🚀" title="One-Click Improved Resume" />
      <p style={{ color: '#64748b', fontSize: 12, marginBottom: '1rem', lineHeight: 1.6 }}>
        AI-rewritten with strong action verbs, quantified achievements, and ATS-friendly formatting.
      </p>
      <div style={{ position: 'relative' }}>
        <pre style={{ background: '#060a0f', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '1.25rem', color: '#cbd5e1', fontSize: 12, lineHeight: 1.8, whiteSpace: 'pre-wrap', wordBreak: 'break-word', maxHeight: 420, overflowY: 'auto', margin: 0 }}>
          {text}
        </pre>
        <button onClick={copy}
          style={{ position: 'absolute', top: 10, right: 10, padding: '5px 12px', borderRadius: 8, background: copied ? 'rgba(20,184,166,0.2)' : 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', color: copied ? '#14b8a6' : '#94a3b8', fontSize: 11, cursor: 'pointer', fontWeight: 600 }}>
          {copied ? '✓ Copied' : '📋 Copy'}
        </button>
      </div>
    </Card>
  );
}

function FormattingPanel({ issues }) {
  if (!issues?.length) return null;
  return (
    <Card>
      <SectionTitle icon="🎨" title="Design & Formatting Fixes" badge={`${issues.length} issues`} badgeColor="#f59e0b" />
      {issues.map((issue, i) => (
        <div key={i} style={{ display: 'flex', gap: 10, padding: '8px 12px', background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.12)', borderRadius: 8, marginBottom: 6 }}>
          <span style={{ color: '#f59e0b' }}>⚡</span>
          <span style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.6 }}>{issue}</span>
        </div>
      ))}
    </Card>
  );
}

function BadgesPanel({ result }) {
  const badges = [];
  if ((result.atsScore || 0) >= 75)        badges.push({ icon: '🤖', label: 'ATS Optimized',    color: '#14b8a6' });
  if ((result.skillMatchScore || 0) >= 75) badges.push({ icon: '🎯', label: 'Keyword Master',   color: '#818cf8' });
  if ((result.impactScore || 0) >= 75)     badges.push({ icon: '💥', label: 'Impact Champion',  color: '#f59e0b' });
  if ((result.overallScore || 0) >= 80)    badges.push({ icon: '⭐', label: 'Top Candidate',    color: '#38bdf8' });
  if (!badges.length) return null;
  return (
    <Card accent="#818cf8">
      <SectionTitle icon="🏆" title="Achievements Unlocked" />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        {badges.map((b, i) => (
          <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.15, type: 'spring', stiffness: 200 }}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', borderRadius: 12, background: `${b.color}12`, border: `1px solid ${b.color}30` }}>
            <span style={{ fontSize: 20 }}>{b.icon}</span>
            <span style={{ color: b.color, fontWeight: 700, fontSize: 13 }}>{b.label}</span>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}

export default function ResumePage() {
  const navigate  = useNavigate();
  const [mode, setMode]               = useState('input');   // input | loading | result
  const [resumeText, setResumeText]   = useState('');
  const [jobDesc, setJobDesc]         = useState('');
  const [targetRole, setTargetRole]   = useState('');
  const [result, setResult]           = useState(null);
  const [error, setError]             = useState('');
  const [activeTab, setActiveTab]     = useState('score');
  const [replacedLines, setReplaced]  = useState({});

  const handleAnalyze = async () => {
    if (!resumeText.trim()) { setError('Please paste or upload your resume.'); return; }
    setError(''); setMode('loading');
    try {
      const res = await analyzeWithAI('resume', { resumeText, jobDescription: jobDesc, targetRole });
      setResult(res);
      setMode('result');
    } catch (e) {
      setError(e.message || 'Analysis failed. Please try again.');
      setMode('input');
    }
  };

  const handleReplace = (suggestion) => {
    setReplaced(prev => ({ ...prev, [suggestion.id]: true }));
    setResumeText(prev => prev.replace(suggestion.weak, suggestion.strong));
  };

  const TABS = [
    { key: 'score',      label: '🎯 Score',       show: true },
    { key: 'suggestions',label: '✨ Suggestions',  show: true },
    { key: 'jobmatch',   label: '🔗 Job Match',    show: !!result?.jobMatch },
    { key: 'hrscan',     label: '👁️ HR Scan',      show: !!result?.hrScanSections },
    { key: 'rejection',  label: '🔮 Prediction',   show: !!result?.rejection },
    { key: 'skillgap',   label: '🗺️ Skill Gap',    show: !!result?.skillGap },
    { key: 'interview',  label: '💬 Interview',    show: !!result?.interviewQuestions },
    { key: 'mistakes',   label: '🔍 Mistakes',     show: !!result?.hiddenMistakes?.length },
    { key: 'improved',   label: '🚀 Improved',     show: !!result?.improvedResume },
    { key: 'format',     label: '🎨 Format',       show: !!result?.formattingIssues?.length },
  ].filter(t => t.show);

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg,#060a0f 0%,#080d12 50%,#060b0e 100%)', paddingTop: 64 }}>

      {/* Header */}
      <div style={{ background: '#060a0f', borderBottom: '1px solid rgba(20,184,166,0.08)', padding: '1.5rem 2rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', fontSize: 13 }}>← Back</button>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(20,184,166,0.12)', border: '1px solid rgba(20,184,166,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>📄</div>
            <div>
              <h1 style={{ color: '#fff', fontSize: 22, fontWeight: 800, margin: 0 }}>AI Resume Analyzer</h1>
              <p style={{ color: '#64748b', fontSize: 12, margin: 0 }}>Smart career assistant powered by Groq Llama 3.3 70B</p>
            </div>
          </div>
          {mode === 'result' && (
            <button onClick={() => { setMode('input'); setResult(null); setActiveTab('score'); }}
              style={{ padding: '8px 18px', borderRadius: 10, background: 'rgba(20,184,166,0.08)', border: '1px solid rgba(20,184,166,0.2)', color: '#14b8a6', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              ↺ Analyse New Resume
            </button>
          )}
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1.5rem' }}>

        {/* INPUT MODE */}
        {mode === 'input' && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            {/* Hero */}
            <div style={{ background: 'linear-gradient(135deg,rgba(20,184,166,0.08),rgba(56,189,248,0.04))', border: '1px solid rgba(20,184,166,0.15)', borderRadius: 20, padding: '2rem', marginBottom: '1.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🚀</div>
              <h2 style={{ color: '#fff', fontSize: 24, fontWeight: 800, margin: '0 0 8px' }}>Get Your Resume Analysed in Seconds</h2>
              <p style={{ color: '#64748b', fontSize: 14, margin: 0, maxWidth: 520, marginInline: 'auto' }}>
                ATS scoring · Before/After suggestions · HR scan simulation · Rejection prediction · Skill roadmap · Interview prep
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: '1.25rem' }}>
              {/* Resume input */}
              <Card accent="#14b8a6" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>📄 Your Resume</div>
                <UploadZone onText={setResumeText} />
                <div style={{ color: '#475569', fontSize: 11, textAlign: 'center' }}>— or paste text below —</div>
                <textarea
                  value={resumeText}
                  onChange={e => setResumeText(e.target.value)}
                  placeholder="Paste your full resume text here…"
                  rows={8}
                  style={{ width: '100%', padding: 12, borderRadius: 10, background: '#0d1520', border: '1px solid rgba(255,255,255,0.08)', color: '#f1f5f9', fontSize: 13, outline: 'none', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.borderColor = '#14b8a6'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                />
              </Card>

              {/* Job details */}
              <Card style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>🎯 Target Role (optional)</div>
                <input
                  value={targetRole}
                  onChange={e => setTargetRole(e.target.value)}
                  placeholder="e.g. Senior Frontend Engineer"
                  style={{ width: '100%', padding: 12, borderRadius: 10, background: '#0d1520', border: '1px solid rgba(255,255,255,0.08)', color: '#f1f5f9', fontSize: 13, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.borderColor = '#14b8a6'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                />
                <div style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>📋 Job Description (optional)</div>
                <textarea
                  value={jobDesc}
                  onChange={e => setJobDesc(e.target.value)}
                  placeholder="Paste the job description to get keyword match analysis…"
                  rows={8}
                  style={{ width: '100%', padding: 12, borderRadius: 10, background: '#0d1520', border: '1px solid rgba(255,255,255,0.08)', color: '#f1f5f9', fontSize: 13, outline: 'none', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.borderColor = '#38bdf8'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                />
              </Card>
            </div>

            {error && (
              <div style={{ marginTop: '1rem', padding: '10px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, color: '#fca5a5', fontSize: 13 }}>
                ⚠ {error}
              </div>
            )}

            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={handleAnalyze}
              style={{ marginTop: '1.5rem', width: '100%', padding: '16px', borderRadius: 14, border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg,#14b8a6,#38bdf8)', color: '#fff', fontWeight: 800, fontSize: 16, boxShadow: '0 6px 24px rgba(20,184,166,0.3)' }}>
              🔍 Analyse My Resume with AI
            </motion.button>
          </motion.div>
        )}

        {/* LOADING */}
        {mode === 'loading' && <LoadingScreen />}

        {/* RESULT MODE */}
        {mode === 'result' && result && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>

            {/* Badges */}
            <BadgesPanel result={result} />

            {/* Tab bar */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', margin: '1.25rem 0', background: '#0b1117', borderRadius: 14, padding: 6, border: '1px solid rgba(255,255,255,0.06)' }}>
              {TABS.map(t => (
                <button key={t.key} onClick={() => setActiveTab(t.key)}
                  style={{ padding: '8px 14px', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600, transition: 'all 0.2s', whiteSpace: 'nowrap',
                    background: activeTab === t.key ? 'rgba(20,184,166,0.15)' : 'none',
                    color: activeTab === t.key ? '#14b8a6' : '#64748b' }}>
                  {t.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                {activeTab === 'score'       && <ScoreDashboard result={result} />}
                {activeTab === 'suggestions' && <SuggestionsPanel suggestions={result.suggestions} onReplace={handleReplace} />}
                {activeTab === 'jobmatch'    && <JobMatchPanel jobMatch={result.jobMatch} />}
                {activeTab === 'hrscan'      && <HRScanSimulator sections={result.hrScanSections} />}
                {activeTab === 'rejection'   && <RejectionPanel rejection={result.rejection} />}
                {activeTab === 'skillgap'    && <SkillGapPanel skillGap={result.skillGap} />}
                {activeTab === 'interview'   && <InterviewPanel questions={result.interviewQuestions} />}
                {activeTab === 'mistakes'    && <HiddenMistakesPanel mistakes={result.hiddenMistakes} />}
                {activeTab === 'improved'    && <ImprovedResumePanel text={result.improvedResume} />}
                {activeTab === 'format'      && <FormattingPanel issues={result.formattingIssues} />}
              </motion.div>
            </AnimatePresence>

            {/* Factor bars at bottom */}
            {result.factors?.length > 0 && (
              <Card style={{ marginTop: '1.25rem' }}>
                <SectionTitle icon="📊" title="Detailed Factor Breakdown" />
                {result.factors.map((f, i) => (
                  <MiniBar key={i} label={f.label} value={f.value} color={f.color} delay={i * 0.1} />
                ))}
              </Card>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
