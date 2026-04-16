import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HOSPITALS = [
  { name: 'AIIMS Delhi', phone: '011-26588500', type: 'Government', city: 'Delhi' },
  { name: 'Apollo Hospitals', phone: '1860-500-1066', type: 'Private', city: 'Pan India' },
  { name: 'Fortis Healthcare', phone: '1800-111-1234', type: 'Private', city: 'Pan India' },
  { name: 'Max Healthcare', phone: '011-26515050', type: 'Private', city: 'Delhi NCR' },
  { name: 'Medanta Hospital', phone: '0124-4141414', type: 'Private', city: 'Gurugram' },
  { name: 'Narayana Health', phone: '1800-309-6661', type: 'Private', city: 'Pan India' },
];

const STATUS_CONFIG = {
  NORMAL:          { color: '#10b981', bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.25)',  icon: '✅', label: 'Normal' },
  NEEDS_ATTENTION: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.25)',  icon: '⚠️', label: 'Needs Attention' },
  SERIOUS:         { color: '#ef4444', bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.25)',   icon: '🚨', label: 'Serious' },
  BORDERLINE:      { color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)',   icon: '⚡', label: 'Borderline' },
  ABNORMAL:        { color: '#ef4444', bg: 'rgba(239,68,68,0.08)',  border: 'rgba(239,68,68,0.2)',    icon: '❌', label: 'Abnormal' },
};

export default function ReportAnalyzerPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileRef = useRef();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [lang, setLang] = useState('en');
  const [locationStatus, setLocationStatus] = useState('idle');
  const [coords, setCoords] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (f) => {
    if (!f) return;
    setFile(f);
    setResult(null);
    setError('');
    if (f.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(f);
    } else {
      setPreview(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const formData = new FormData();
      formData.append('report', file);
      formData.append('lang', lang);

      const res = await fetch('http://localhost:5000/api/report/analyze', {
        method: 'POST',
        body: formData,
      });

      let data;
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        data = await res.json();
      } else {
        const text = await res.text();
        throw new Error(`Server error: ${text.slice(0, 100)}`);
      }

      if (!res.ok) throw new Error(data.error || 'Analysis failed.');
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getLocation = () => {
    if (!navigator.geolocation) return;
    setLocationStatus('locating');
    navigator.geolocation.getCurrentPosition(
      (pos) => { setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }); setLocationStatus('done'); },
      () => setLocationStatus('denied'),
      { timeout: 10000 }
    );
  };

  const openMap = (query) => {
    const base = coords
      ? `https://www.google.com/maps/search/${encodeURIComponent(query)}/@${coords.lat},${coords.lng},14z`
      : `https://www.google.com/maps/search/${encodeURIComponent(query)}`;
    window.open(base, '_blank');
  };

  const overall = result ? STATUS_CONFIG[result.overallStatus] || STATUS_CONFIG.NORMAL : null;

  return (
    <div style={{ minHeight: '100vh', background: '#050508', paddingTop: '64px', paddingBottom: '4rem' }}>
      {/* Header */}
      <div style={{ background: '#080810', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '2rem' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button onClick={() => navigate('/healthcare')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', fontSize: 13 }}>← Back</button>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>🔬</div>
              <div>
                <h1 style={{ color: '#fff', fontSize: 24, fontWeight: 800, margin: 0 }}>Medical Report Analyzer</h1>
                <p style={{ color: '#64748b', fontSize: 13, margin: 0 }}>Upload your lab report — AI explains it in simple language</p>
              </div>
            </div>
            <div style={{ display: 'flex', background: '#13131f', borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' }}>
              {[['en','English'],['hi','हिंदी']].map(([k,v]) => (
                <button key={k} onClick={() => setLang(k)} style={{ padding: '6px 14px', background: lang === k ? '#7c3aed' : 'none', border: 'none', color: lang === k ? '#fff' : '#64748b', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>{v}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1.5rem' }}>

        {/* Upload Area */}
        {!result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
              style={{
                border: `2px dashed ${dragOver ? '#7c3aed' : file ? '#10b981' : 'rgba(255,255,255,0.12)'}`,
                borderRadius: 20, padding: '3rem 2rem', textAlign: 'center', cursor: 'pointer',
                background: dragOver ? 'rgba(124,58,237,0.05)' : file ? 'rgba(16,185,129,0.04)' : '#0d0d14',
                transition: 'all 0.2s', marginBottom: '1.5rem',
              }}>
              <input ref={fileRef} type="file" accept=".pdf,image/*" style={{ display: 'none' }} onChange={e => handleFile(e.target.files[0])} />
              {file ? (
                <div>
                  {preview && <img src={preview} alt="preview" style={{ maxHeight: 200, borderRadius: 12, marginBottom: '1rem', objectFit: 'contain' }} />}
                  <div style={{ fontSize: 32, marginBottom: '0.5rem' }}>✅</div>
                  <div style={{ color: '#10b981', fontWeight: 700, fontSize: 16 }}>{file.name}</div>
                  <div style={{ color: '#475569', fontSize: 13, marginTop: 4 }}>{(file.size / 1024).toFixed(1)} KB • Click to change</div>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: 48, marginBottom: '1rem' }}>📋</div>
                  <div style={{ color: '#fff', fontWeight: 700, fontSize: 18, marginBottom: '0.5rem' }}>
                    {lang === 'hi' ? 'रिपोर्ट अपलोड करें' : 'Upload Medical Report'}
                  </div>
                  <div style={{ color: '#475569', fontSize: 14, marginBottom: '1rem' }}>
                    {lang === 'hi' ? 'PDF या Image यहाँ खींचें या क्लिक करें' : 'Drag & drop PDF or Image, or click to browse'}
                  </div>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    {['PDF', 'JPG', 'PNG', 'WEBP'].map(f => (
                      <span key={f} style={{ padding: '3px 10px', borderRadius: 6, background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)', color: '#a78bfa', fontSize: 11 }}>{f}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 12, padding: '12px 16px', color: '#fca5a5', fontSize: 13, marginBottom: '1rem' }}>⚠️ {error}</div>
            )}

            <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
              onClick={handleAnalyze} disabled={!file || loading}
              style={{
                width: '100%', padding: '16px', borderRadius: 14, border: 'none',
                background: !file ? 'rgba(124,58,237,0.2)' : 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                color: '#fff', fontWeight: 700, fontSize: 16, cursor: !file ? 'not-allowed' : 'pointer',
                boxShadow: file ? '0 4px 24px rgba(124,58,237,0.3)' : 'none',
              }}>
              {loading ? '🔬 Analyzing...' : lang === 'hi' ? '🔬 AI से विश्लेषण करें' : '🔬 Analyze with AI'}
            </motion.button>

            {/* Loading */}
            {loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                style={{ marginTop: '2rem', background: '#0d0d14', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 20, padding: '3rem', textAlign: 'center' }}>
                <div style={{ position: 'relative', width: 72, height: 72, margin: '0 auto 1.5rem' }}>
                  {[0,1,2].map(i => (
                    <motion.div key={i} animate={{ scale: [1,1.8,1], opacity: [0.6,0,0.6] }} transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.4 }}
                      style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '2px solid #7c3aed' }} />
                  ))}
                  <div style={{ position: 'absolute', inset: '22%', borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🔬</div>
                </div>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: 16, marginBottom: '0.5rem' }}>
                  {lang === 'hi' ? 'AI आपकी रिपोर्ट पढ़ रहा है...' : 'AI is reading your report...'}
                </div>
                <div style={{ color: '#475569', fontSize: 13 }}>
                  {lang === 'hi' ? 'सभी मान निकाले जा रहे हैं' : 'Extracting and analyzing all values'}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* RESULTS */}
        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            {/* Overall Status Banner */}
            <div style={{ background: overall.bg, border: `1px solid ${overall.border}`, borderRadius: 20, padding: '2rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
              <div style={{ fontSize: 52, marginBottom: '0.75rem' }}>{overall.icon}</div>
              <div style={{ color: overall.color, fontSize: 26, fontWeight: 800, marginBottom: '0.5rem' }}>
                {lang === 'hi'
                  ? result.overallStatus === 'NORMAL' ? 'रिपोर्ट सामान्य है ✅'
                    : result.overallStatus === 'NEEDS_ATTENTION' ? 'ध्यान देने की जरूरत है ⚠️'
                    : 'गंभीर — डॉक्टर से मिलें 🚨'
                  : result.overallStatus === 'NORMAL' ? 'Report is Normal ✅'
                    : result.overallStatus === 'NEEDS_ATTENTION' ? 'Needs Medical Attention ⚠️'
                    : 'Serious — See a Doctor Now 🚨'}
              </div>
              <p style={{ color: '#e2e8f0', fontSize: 14, lineHeight: 1.8, maxWidth: 600, margin: '0 auto 1rem' }}>{result.summary}</p>
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <span style={{ padding: '4px 12px', borderRadius: 100, background: 'rgba(255,255,255,0.1)', color: '#e2e8f0', fontSize: 12 }}>📋 {result.reportType}</span>
                <span style={{ padding: '4px 12px', borderRadius: 100, background: 'rgba(255,255,255,0.1)', color: '#e2e8f0', fontSize: 12 }}>
                  {lang === 'hi' ? `तात्कालिकता: ${result.urgency}` : `Urgency: ${result.urgency}`}
                </span>
                {result.specialistNeeded && (
                  <span style={{ padding: '4px 12px', borderRadius: 100, background: 'rgba(124,58,237,0.2)', color: '#a78bfa', fontSize: 12 }}>👨‍⚕️ {result.specialistNeeded}</span>
                )}
              </div>
            </div>

            {/* Test Values Table */}
            {result.values?.length > 0 && (
              <div style={{ background: '#0d0d14', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '1.5rem' }}>
                <h3 style={{ color: '#fff', fontSize: 15, fontWeight: 700, margin: '0 0 1.25rem' }}>
                  {lang === 'hi' ? '🧪 परीक्षण परिणाम' : '🧪 Test Results'}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {result.values.map((v, i) => {
                    const cfg = STATUS_CONFIG[v.status] || STATUS_CONFIG.NORMAL;
                    return (
                      <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                        style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, borderRadius: 14, padding: '1rem 1.25rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: 16 }}>{cfg.icon}</span>
                            <span style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>{v.name}</span>
                          </div>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                            <span style={{ color: cfg.color, fontWeight: 800, fontSize: 15 }}>{v.value}</span>
                            <span style={{ color: '#475569', fontSize: 12 }}>Normal: {v.normalRange}</span>
                            <span style={{ padding: '2px 8px', borderRadius: 6, background: cfg.bg, border: `1px solid ${cfg.border}`, color: cfg.color, fontSize: 11, fontWeight: 700 }}>{v.status}</span>
                          </div>
                        </div>
                        <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.6, margin: 0 }}>{v.explanation}</p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Abnormal Findings */}
            {result.abnormalFindings?.length > 0 && (
              <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 18, padding: '1.5rem' }}>
                <h3 style={{ color: '#f87171', fontSize: 15, fontWeight: 700, margin: '0 0 1rem' }}>
                  {lang === 'hi' ? '❌ असामान्य निष्कर्ष' : '❌ Abnormal Findings'}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {result.abnormalFindings.map((f, i) => (
                    <div key={i} style={{ display: 'flex', gap: '10px', padding: '10px 12px', background: 'rgba(239,68,68,0.06)', borderRadius: 10 }}>
                      <span style={{ color: '#ef4444', flexShrink: 0 }}>•</span>
                      <span style={{ color: '#fca5a5', fontSize: 13 }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {result.recommendations?.length > 0 && (
              <div style={{ background: '#0d0d14', border: '1px solid rgba(16,185,129,0.15)', borderRadius: 18, padding: '1.5rem' }}>
                <h3 style={{ color: '#fff', fontSize: 15, fontWeight: 700, margin: '0 0 1rem' }}>
                  {lang === 'hi' ? '✅ सिफारिशें' : '✅ Recommendations'}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {result.recommendations.map((r, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                      style={{ display: 'flex', gap: '12px', padding: '12px 14px', background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.12)', borderRadius: 10 }}>
                      <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(16,185,129,0.2)', color: '#10b981', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i+1}</div>
                      <span style={{ color: '#cbd5e1', fontSize: 13, lineHeight: 1.6 }}>{r}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* If Serious — Show Nearby Doctors + Hospital Contacts */}
            {result.needsDoctor && (
              <>
                {/* Nearby on Maps */}
                <div style={{ background: '#0d0d14', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 20, padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div>
                      <h3 style={{ color: '#fff', fontSize: 15, fontWeight: 700, margin: '0 0 4px' }}>
                        {lang === 'hi' ? '📍 नजदीकी डॉक्टर और अस्पताल' : '📍 Find Nearby Doctors & Hospitals'}
                      </h3>
                      <p style={{ color: '#475569', fontSize: 12, margin: 0 }}>
                        {lang === 'hi' ? 'अपना स्थान दें और नजदीकी सुविधाएं खोजें' : 'Share your location to find nearest medical facilities'}
                      </p>
                    </div>
                    {locationStatus !== 'done' && (
                      <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={getLocation}
                        style={{ padding: '8px 16px', borderRadius: 10, border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg,#ef4444,#f97316)', color: '#fff', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        📍 {lang === 'hi' ? 'स्थान दें' : 'Share Location'}
                      </motion.button>
                    )}
                    {locationStatus === 'done' && <span style={{ color: '#10b981', fontSize: 12, fontWeight: 600 }}>✓ Location found</span>}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '0.75rem' }}>
                    {[
                      { icon: '🏥', label: lang === 'hi' ? 'नजदीकी अस्पताल' : 'Nearby Hospital', query: `${result.specialistNeeded || 'hospital'} near me`, color: '#ef4444' },
                      { icon: '👨‍⚕️', label: result.specialistNeeded || 'Doctor', query: `${result.specialistNeeded || 'doctor'} near me`, color: '#7c3aed' },
                      { icon: '💊', label: lang === 'hi' ? 'फार्मेसी' : 'Pharmacy', query: 'pharmacy near me', color: '#10b981' },
                      { icon: '🔬', label: lang === 'hi' ? 'डायग्नोस्टिक लैब' : 'Diagnostic Lab', query: 'diagnostic lab near me', color: '#06b6d4' },
                    ].map((p, i) => (
                      <motion.button key={i} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={() => openMap(p.query)}
                        style={{ padding: '1rem 0.5rem', borderRadius: 14, cursor: 'pointer', background: `${p.color}10`, border: `1px solid ${p.color}25`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: 24 }}>{p.icon}</span>
                        <span style={{ color: p.color, fontSize: 11, fontWeight: 600, textAlign: 'center' }}>{p.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Hospital Contact Numbers */}
                <div style={{ background: '#0d0d14', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 20, padding: '1.5rem' }}>
                  <h3 style={{ color: '#fff', fontSize: 15, fontWeight: 700, margin: '0 0 1.25rem' }}>
                    {lang === 'hi' ? '📞 प्रमुख अस्पतालों के नंबर' : '📞 Top Hospital Contact Numbers'}
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0.75rem' }}>
                    {HOSPITALS.map((h, i) => (
                      <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                        style={{ background: '#13131f', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
                        <div>
                          <div style={{ color: '#fff', fontWeight: 700, fontSize: 13 }}>{h.name}</div>
                          <div style={{ color: '#475569', fontSize: 11, marginTop: 2 }}>{h.type} • {h.city}</div>
                        </div>
                        <a href={`tel:${h.phone}`} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 12px', borderRadius: 8, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#10b981', fontSize: 12, fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap' }}>
                          📞 {h.phone}
                        </a>
                      </motion.div>
                    ))}
                  </div>
                  {/* Emergency Numbers */}
                  <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    {[['🚑 Ambulance', '108'], ['🏥 Emergency', '112'], ['☎️ Health Helpline', '104']].map(([label, num]) => (
                      <a key={num} href={`tel:${num}`} style={{ flex: 1, minWidth: 120, padding: '12px', borderRadius: 12, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', fontSize: 13, fontWeight: 700, textDecoration: 'none', textAlign: 'center' }}>
                        {label}<br /><span style={{ fontSize: 18 }}>{num}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Disclaimer */}
            <div style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 14, padding: '1rem 1.25rem', display: 'flex', gap: '10px' }}>
              <span>⚠️</span>
              <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.7, margin: 0 }}>
                <strong style={{ color: '#f59e0b' }}>Disclaimer:</strong> This AI analysis is for informational purposes only. It cannot replace a qualified doctor's diagnosis. Always consult a healthcare professional for medical decisions.
              </p>
            </div>

            <button onClick={() => { setResult(null); setFile(null); setPreview(null); }}
              style={{ padding: '14px', borderRadius: 14, background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)', color: '#a78bfa', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
              ↺ {lang === 'hi' ? 'नई रिपोर्ट अपलोड करें' : 'Analyze Another Report'}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
