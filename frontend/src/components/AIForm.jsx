import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Loader from './Loader';
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
      setError('Failed to connect to AI engine. Make sure the backend is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '12px 14px', borderRadius: 10,
    background: '#13131f', border: '1px solid rgba(255,255,255,0.08)',
    color: '#f1f5f9', fontSize: 14, outline: 'none',
    transition: 'border-color 0.2s',
    fontFamily: 'inherit',
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: result ? '1fr 1fr' : '1fr', gap: '2rem' }}>
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
        <h2 style={{ color: '#fff', fontWeight: 700, fontSize: 18, marginBottom: '1.5rem' }}>
          Enter Your Details
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '1.5rem' }}>
          {fields.map(f => (
            <div key={f.key}>
              <label style={{ display: 'block', color: '#94a3b8', fontSize: 13, fontWeight: 500, marginBottom: '6px' }}>
                {f.label}
              </label>
              {f.type === 'textarea' ? (
                <textarea
                  value={form[f.key]}
                  onChange={e => handleChange(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  rows={4}
                  required={f.required}
                  style={{ ...inputStyle, resize: 'vertical' }}
                  onFocus={e => e.target.style.borderColor = color}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                />
              ) : f.type === 'select' ? (
                <select
                  value={form[f.key]}
                  onChange={e => handleChange(f.key, e.target.value)}
                  required={f.required}
                  style={{ ...inputStyle, cursor: 'pointer' }}
                  onFocus={e => e.target.style.borderColor = color}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                >
                  <option value="">Select {f.label}</option>
                  {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : (
                <input
                  type={f.type || 'text'}
                  value={form[f.key]}
                  onChange={e => handleChange(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  required={f.required}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = color}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                />
              )}
            </div>
          ))}
        </div>

        {error && (
          <div style={{
            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: 10, padding: '12px', color: '#fca5a5', fontSize: 13, marginBottom: '1rem',
          }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%', padding: '13px', borderRadius: 12,
            background: loading ? 'rgba(124,58,237,0.4)' : `linear-gradient(135deg, ${color}, #06b6d4)`,
            border: 'none', color: '#fff', fontWeight: 700, fontSize: 15,
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'opacity 0.2s',
          }}
        >
          {loading ? 'Analyzing...' : '✦ Analyze with AI'}
        </button>
      </motion.form>

      {loading && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Loader text="AI is analyzing your input..." />
        </div>
      )}

      {result && !loading && <ResultPanel result={result} />}
    </div>
  );
}
