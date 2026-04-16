import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { analyzeWithAI } from '../services/api';

const C = '#f97316';
const C2 = '#fb923c';

function Ring({ value = 0, size = 110, stroke = 9, label }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', position: 'absolute' }}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
          <motion.circle cx={size/2} cy={size/2} r={r} fill="none" stroke={C} strokeWidth={stroke}
            strokeLinecap="round" strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: circ - (value / 100) * circ }}
            transition={{ duration: 1.2, ease: 'easeOut' }} />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ color: '#fff', fontWeight: 800, fontSize: size * 0.22, lineHeight: 1 }}>{value}</div>
          <div style={{ color: C, fontSize: size * 0.1, fontWeight: 600 }}>{value >= 75 ? 'Strong' : value >= 50 ? 'Fair' : 'Weak'}</div>
        </div>
      </div>
      {label && <div style={{ color: '#94a3b8', fontSize: 11, fontWeight: 600, textAlign: 'center' }}>{label}</div>}
    </div>
  );
}

function Card({ children, accent, style = {} }) {
  return <div style={{ background: '#0b1117', border: `1px solid ${accent ? accent + '25' : 'rgba(255,255,255,0.07)'}`, borderRadius: 18, padding: '1.5rem', ...style }}>{children}</div>;
}

function Title({ icon, title, badge }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.25rem' }}>
      <span style={{ fontSize: 18 }}>{icon}</span>
      <span style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>{title}</span>
      {badge && <span style={{ marginLeft: 'auto', padding: '2px 10px', borderRadius: 100, background: `${C}18`, border: `1px solid ${C}30`, color: C2, fontSize: 11, fontWeight: 700 }}>{badge}</span>}
    </div>
  );
}

const STEPS = ['Analysing industry landscape…','Applying Porter\'s Five Forces…','Evaluating competitive advantage…','Identifying growth levers…','Building strategic roadmap…'];

function LoadingScreen() {
  const [idx, setIdx] = useState(0);
  React.useEffect(() => {
    const t = setInterval(() => setIdx(i => Math.min(i + 1, STEPS.length - 1)), 1400);
    return () => clearInterval(t);
  }, []);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      style={{ background: '#0b1117', border: `1px solid ${C}25`, borderRadius: 20, padding: '3rem 2rem', textAlign: 'center' }}>
      <div style={{ position: 'relative', width: 80, height: 80, margin: '0 auto 2rem' }}>
        {[0,1,2].map(i => (
          <motion.div key={i} animate={{ scale: [1,1.8,1], opacity: [0.5,0,0.5] }}
            transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.5 }}
            style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: `2px solid ${C}` }} />
        ))}
        <div style={{ position: 'absolute', inset: '22%', borderRadius: '50%', background: `linear-gradient(135deg,${C},#fbbf24)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>📊</div>
      </div>
      <div style={{ color: '#fff', fontWeight: 700, fontSize: 17, marginBottom: 8 }}>AI is building your strategy…</div>
      <AnimatePresence mode="wait">
        <motion.div key={idx} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
          style={{ color: C2, fontSize: 13, marginBottom: '1.5rem' }}>{STEPS[idx]}</motion.div>
      </AnimatePresence>
      <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
        {STEPS.map((_, i) => <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: i <= idx ? C : 'rgba(255,255,255,0.1)', transition: 'background 0.3s' }} />)}
      </div>
    </motion.div>
  );
}

const STAGES = ['Idea Stage','Pre-Seed','Seed','Series A','Growth','Enterprise'];
const INDUSTRIES = ['SaaS','E-commerce','FinTech','HealthTech','EdTech','AI/ML','Marketplace','Consumer App'];

export default function BusinessStrategyPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('input');
  const [form, setForm] = useState({ industry: '', companyStage: '', businessChallenge: '', teamSize: '' });
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!form.industry || !form.businessChallenge) { setError('Industry and business challenge are required.'); return; }
    setError(''); setMode('loading');
    try {
      const res = await analyzeWithAI('business', form);
      setResult(res); setMode('result');
    } catch (e) { setError(e.message); setMode('input'); }
  };

  const inp = { width: '100%', padding: '12px 14px', borderRadius: 10, background: '#0d1520', border: '1px solid rgba(255,255,255,0.08)', color: '#f1f5f9', fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg,#060a0f,#080d12,#060b0e)', paddingTop: 64 }}>
      <div style={{ background: '#060a0f', borderBottom: `1px solid ${C}12`, padding: '1.5rem 2rem' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', fontSize: 13 }}>← Back</button>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: `${C}18`, border: `1px solid ${C}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>📊</div>
            <div>
              <h1 style={{ color: '#fff', fontSize: 22, fontWeight: 800, margin: 0 }}>Business Strategy Advisor</h1>
              <p style={{ color: '#64748b', fontSize: 12, margin: 0 }}>Strategic recommendations, risk analysis & growth roadmap</p>
            </div>
          </div>
          {mode === 'result' && (
            <button onClick={() => { setMode('input'); setResult(null); }}
              style={{ padding: '8px 18px', borderRadius: 10, background: `${C}12`, border: `1px solid ${C}25`, color: C2, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>↺ New Strategy</button>
          )}
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '2rem 1.5rem' }}>
        {mode === 'input' && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{ background: `linear-gradient(135deg,${C}10,rgba(251,191,36,0.04))`, border: `1px solid ${C}18`, borderRadius: 20, padding: '2rem', marginBottom: '1.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📊</div>
              <h2 style={{ color: '#fff', fontSize: 22, fontWeight: 800, margin: '0 0 8px' }}>Get Your Business Strategy</h2>
              <p style={{ color: '#64748b', fontSize: 14, margin: 0 }}>AI applies Porter's Five Forces, SWOT & OKR frameworks to your specific situation</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: '1.25rem' }}>
              <Card accent={C} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>🏢 Company Details</div>
                <div>
                  <label style={{ display: 'block', color: '#94a3b8', fontSize: 11, fontWeight: 600, marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Industry</label>
                  <input value={form.industry} onChange={e => setForm(p => ({ ...p, industry: e.target.value }))}
                    placeholder="e.g. SaaS, E-commerce, HealthTech" style={inp}
                    onFocus={e => e.target.style.borderColor = C} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 6 }}>
                    {INDUSTRIES.map(ind => (
                      <button key={ind} onClick={() => setForm(p => ({ ...p, industry: ind }))}
                        style={{ padding: '3px 10px', borderRadius: 100, background: form.industry === ind ? `${C}20` : 'rgba(255,255,255,0.04)', border: `1px solid ${form.industry === ind ? C : 'rgba(255,255,255,0.08)'}`, color: form.industry === ind ? C2 : '#64748b', fontSize: 10, cursor: 'pointer' }}>
                        {ind}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', color: '#94a3b8', fontSize: 11, fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Company Stage</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {STAGES.map(s => (
                      <button key={s} onClick={() => setForm(p => ({ ...p, companyStage: s }))}
                        style={{ padding: '5px 12px', borderRadius: 8, border: `1px solid ${form.companyStage === s ? C : 'rgba(255,255,255,0.08)'}`, background: form.companyStage === s ? `${C}18` : '#0d1520', color: form.companyStage === s ? C2 : '#64748b', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', color: '#94a3b8', fontSize: 11, fontWeight: 600, marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Team Size</label>
                  <input type="number" value={form.teamSize} onChange={e => setForm(p => ({ ...p, teamSize: e.target.value }))}
                    placeholder="e.g. 12" style={inp}
                    onFocus={e => e.target.style.borderColor = C} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
                </div>
              </Card>
              <Card style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>🎯 Business Challenge</div>
                <div>
                  <label style={{ display: 'block', color: '#94a3b8', fontSize: 11, fontWeight: 600, marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Describe your main challenge</label>
                  <textarea value={form.businessChallenge} onChange={e => setForm(p => ({ ...p, businessChallenge: e.target.value }))}
                    placeholder="e.g. We're struggling with customer acquisition costs. Our CAC is 3x LTV and we need to find a sustainable growth channel…" rows={8}
                    style={{ ...inp, resize: 'vertical' }}
                    onFocus={e => e.target.style.borderColor = C} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {['Customer Acquisition','Product-Market Fit','Scaling Operations','Fundraising','Competitive Moat','Team Building'].map(g => (
                    <button key={g} onClick={() => setForm(p => ({ ...p, businessChallenge: g }))}
                      style={{ padding: '4px 12px', borderRadius: 100, background: form.businessChallenge === g ? `${C}20` : 'rgba(255,255,255,0.04)', border: `1px solid ${form.businessChallenge === g ? C : 'rgba(255,255,255,0.08)'}`, color: form.businessChallenge === g ? C2 : '#64748b', fontSize: 11, cursor: 'pointer' }}>
                      {g}
                    </button>
                  ))}
                </div>
              </Card>
            </div>
            {error && <div style={{ marginTop: '1rem', padding: '10px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, color: '#fca5a5', fontSize: 13 }}>⚠ {error}</div>}
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleAnalyze}
              style={{ marginTop: '1.5rem', width: '100%', padding: 16, borderRadius: 14, border: 'none', cursor: 'pointer', background: `linear-gradient(135deg,${C},#fbbf24)`, color: '#fff', fontWeight: 800, fontSize: 16, boxShadow: `0 6px 24px ${C}35` }}>
              📊 Build My Strategy
            </motion.button>
          </motion.div>
        )}

        {mode === 'loading' && <LoadingScreen />}

        {mode === 'result' && result && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <Card accent={C}>
              <Title icon="📊" title="Strategic Analysis" badge={`${result.confidence}% Confidence`} />
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <Ring value={result.confidence} size={120} stroke={10} label="AI Confidence" />
              </div>
              <div style={{ padding: '1rem 1.25rem', background: `${C}08`, borderLeft: `3px solid ${C}`, borderRadius: '0 10px 10px 0', marginBottom: '1rem' }}>
                <div style={{ color: '#64748b', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 6 }}>Strategic Recommendation</div>
                <p style={{ color: '#e2e8f0', fontSize: 13, lineHeight: 1.8, margin: 0 }}>{result.recommendation}</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: '0.75rem' }}>
                {result.factors?.map((f, i) => (
                  <div key={i} style={{ background: '#0d1520', borderRadius: 10, padding: '0.75rem', border: `1px solid ${f.color}20` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ color: '#94a3b8', fontSize: 11 }}>{f.label}</span>
                      <span style={{ color: f.color, fontWeight: 800, fontSize: 14 }}>{f.value}</span>
                    </div>
                    <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                      <motion.div initial={{ width: 0 }} animate={{ width: `${f.value}%` }} transition={{ duration: 0.9, delay: i * 0.1 }}
                        style={{ height: '100%', background: f.color, borderRadius: 2 }} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
            <Card>
              <Title icon="🧠" title="Strategic Reasoning" />
              {result.reasoning?.map((r, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                  style={{ display: 'flex', gap: 10, padding: '10px 12px', background: '#0d1520', borderRadius: 10, marginBottom: 8 }}>
                  <div style={{ width: 22, height: 22, borderRadius: '50%', background: `${C}20`, color: C2, fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i+1}</div>
                  <span style={{ color: '#cbd5e1', fontSize: 13, lineHeight: 1.6 }}>{r}</span>
                </motion.div>
              ))}
            </Card>
            <Card accent={C}>
              <Title icon="✅" title="Action Plan" badge={`${result.actions?.length} steps`} />
              {result.actions?.map((a, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                  style={{ display: 'flex', gap: 12, padding: '12px 14px', background: `${C}06`, border: `1px solid ${C}15`, borderRadius: 10, marginBottom: 8 }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: `${C}20`, color: C2, fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i+1}</div>
                  <span style={{ color: '#cbd5e1', fontSize: 13, lineHeight: 1.6 }}>{a}</span>
                </motion.div>
              ))}
            </Card>
            {result.alternatives?.length > 0 && (
              <Card>
                <Title icon="💡" title="Alternative Strategies" />
                {result.alternatives.map((a, i) => (
                  <div key={i} style={{ padding: '10px 14px', background: `${C}06`, border: `1px solid ${C}12`, borderRadius: 10, color: '#94a3b8', fontSize: 13, marginBottom: 6 }}>→ {a}</div>
                ))}
              </Card>
            )}
            <button onClick={() => { setMode('input'); setResult(null); }}
              style={{ padding: 14, borderRadius: 14, background: `${C}0a`, border: `1px solid ${C}20`, color: C2, fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
              ↺ New Strategy
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
