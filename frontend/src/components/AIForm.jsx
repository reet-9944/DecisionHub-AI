import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ResultPanel from './ResultPanel';
import { analyzeWithAI } from '../services/api';

export default function AIForm({ domain, fields, color = '#7c3aed' }) {
  const [form, setForm] = useState(() => Object.fromEntries(fields.map(f => [f.key, ''])));
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await analyzeWithAI(domain, form);
      setResult(data);
    } catch (err) {
      setError(err.message || 'Failed to connect to AI engine. Make sure the backend is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '12px 14px', borderRadius: 10,
    background: '#13131f', border: '1px solid rgba(255,255,255,0.08)',
    color: '#f1f5f9', fontSize: 14, outline: 'none',
    transition: 'border-color 0.2s', fontFamily: 'inherit',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        style={{
          background: '#0d0d14',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 20, padding: '2rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }} />
          <h2 style={{ color: '#fff', fontWeight: 700, fontSize: 17 }}>Enter Your Details</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
          {fields.map(f => (
            <div key={f.key} style={f.type === 'textarea' ? { gridColumn: '1 / -1' } : {}}>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: 12, fontWeight: 600, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {f.label}
              </label>
              {f.type === 'textarea' ? (
                <textarea value={form[f.key]} onChange={e => handleChange(f.key, e.target.value)}
                  placeholder={f.placeholder} rows={4} required={f.required}
                  style={{ ...inputStyle, resize: 'vertical' }}
                  onFocus={e => e.target.style.borderColor = color}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
              ) : f.type === 'select' ? (
                <select value={form[f.key]} onChange={e => handleChange(f.key, e.target.value)}
                  required={f.required} style={{ ...inputStyle, cursor: 'pointer' }}
                  onFocus={e => e.target.style.borderColor = color}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}>
                  <option value="">Select {f.label}</option>
                  {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : (
                <input type={f.type || 'text'} value={form[f.key]}
                  onChange={e => handleChange(f.key, e.target.value)}
                  placeholder={f.placeholder} required={f.required} style={inputStyle}
                  onFocus={e => e.target.style.borderColor = color}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
              )}
            </div>
          ))}
        </div>

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '12px', color: '#fca5a5', fontSize: 13, marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        <button type="submit" disabled={loading} style={{
          width: '100%', padding: '14px', borderRadius: 12,
          background: loading ? 'rgba(124,58,237,0.3)' : `linear-gradient(135deg, ${color}, #06b6d4)`,
          border: 'none', color: '#fff', fontWeight: 700, fontSize: 15,
          cursor: loading ? 'not-allowed' : 'pointer',
          boxShadow: loading ? 'none' : `0 4px 24px ${color}44`,
        }}>
          {loading ? 'Analyzing...' : '✦ Analyze with AI'}
        </button>
      </motion.form>

      <AnimatePresence>
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ background: '#0d0d14', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ position: 'relative', width: 80, height: 80 }}>
              {[0, 1, 2].map(i => (
                <motion.div key={i}
                  animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.4 }}
                  style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: `2px solid ${color}` }} />
              ))}
              <div style={{ position: 'absolute', inset: '20%', borderRadius: '50%', background: `linear-gradient(135deg, ${color}, #06b6d4)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>✦</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#fff', fontWeight: 600, fontSize: 15, marginBottom: '4px' }}>AI is analyzing your input</div>
              <div style={{ color: '#475569', fontSize: 13 }}>Processing data patterns and generating insights...</div>
            </div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'center' }}>
              {['Collecting data', 'Pattern analysis', 'Generating insights'].map((step, i) => (
                <motion.div key={step}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.5 }}
                  style={{ padding: '4px 10px', borderRadius: 100, background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)', color: '#a78bfa', fontSize: 11 }}>
                  {step}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {result && !loading && <ResultPanel result={result} domain={domain} />}
    </div>
  );
}
