import React, { useState, useRef, useEffect } from 'react';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { analyzeWithAI } from '../services/api';
import ResultPanel from '../components/ResultPanel';

// ── Scroll progress bar ───────────────────────────────────────────────────────
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div style={{
      position: 'fixed', top: 0, left: 0, right: 0, height: 3, zIndex: 9999,
      background: 'linear-gradient(90deg, #e91e8c, #ff6b9d, #f59e0b)',
      scaleX: scrollYProgress, transformOrigin: '0%',
    }} />
  );
}

// ── Floating particle ─────────────────────────────────────────────────────────
function Particle({ style, duration = 6, delay = 0 }) {
  return (
    <motion.div
      animate={{ y: [0, -30, 0], x: [0, 10, 0], scale: [1, 1.2, 1], opacity: [0.4, 0.8, 0.4] }}
      transition={{ duration, repeat: Infinity, ease: 'easeInOut', delay }}
      style={{ borderRadius: '50%', position: 'absolute', pointerEvents: 'none', ...style }}
    />
  );
}

// ── Repeating fade-in (once: false so it replays on scroll) ──────────────────
function Reveal({ children, delay = 0, direction = 'up', distance = 50 }) {
  const ref = useRef(null);
  // once: false → re-animates every time element enters viewport
  const inView = useInView(ref, { once: false, margin: '-60px' });
  const variants = {
    hidden: {
      opacity: 0,
      y: direction === 'up' ? distance : direction === 'down' ? -distance : 0,
      x: direction === 'left' ? distance : direction === 'right' ? -distance : 0,
      scale: direction === 'scale' ? 0.8 : 1,
      rotate: direction === 'rotate' ? -10 : 0,
    },
    visible: { opacity: 1, y: 0, x: 0, scale: 1, rotate: 0 },
  };
  return (
    <motion.div ref={ref} variants={variants} initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

// ── Staggered children container ─────────────────────────────────────────────
function StaggerContainer({ children, delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: '-60px' });
  return (
    <motion.div ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={{ visible: { transition: { staggerChildren: 0.12, delayChildren: delay } } }}>
      {children}
    </motion.div>
  );
}

function StaggerItem({ children, direction = 'up' }) {
  const variants = {
    hidden: { opacity: 0, y: direction === 'up' ? 30 : 0, x: direction === 'left' ? 30 : 0 },
    visible: { opacity: 1, y: 0, x: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  };
  return <motion.div variants={variants}>{children}</motion.div>;
}

// ── Animated stat counter ─────────────────────────────────────────────────────
function StatCounter({ value, label, color = '#e91e8c' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: '-40px' });
  return (
    <div ref={ref} style={{ textAlign: 'center' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.3, y: 20 }}
        animate={inView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.3, y: 20 }}
        transition={{ duration: 0.7, type: 'spring', bounce: 0.5 }}
        style={{ fontSize: 34, fontWeight: 900, color, lineHeight: 1 }}>
        {value}
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        style={{ color: '#888', fontSize: 12, marginTop: 4 }}>
        {label}
      </motion.div>
    </div>
  );
}

// ── Morphing background blob ──────────────────────────────────────────────────
function MorphBlob({ color, size, style }) {
  return (
    <motion.div
      animate={{
        borderRadius: ['50%', '40% 60% 60% 40%', '60% 40% 40% 60%', '50%'],
        scale: [1, 1.08, 0.95, 1],
        rotate: [0, 15, -10, 0],
      }}
      transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      style={{
        width: size, height: size,
        background: color,
        position: 'absolute', pointerEvents: 'none', ...style,
      }}
    />
  );
}

// ── Orbiting dot ──────────────────────────────────────────────────────────────
function OrbitDot({ radius, duration, color, size = 10, startAngle = 0 }) {
  return (
    <motion.div
      animate={{ rotate: [startAngle, startAngle + 360] }}
      transition={{ duration, repeat: Infinity, ease: 'linear' }}
      style={{ position: 'absolute', width: radius * 2, height: radius * 2, top: `calc(50% - ${radius}px)`, left: `calc(50% - ${radius}px)` }}>
      <div style={{
        position: 'absolute', top: 0, left: '50%', marginLeft: -size / 2,
        width: size, height: size, borderRadius: '50%', background: color,
        boxShadow: `0 0 8px ${color}`,
      }} />
    </motion.div>
  );
}

// ── Typing text effect ────────────────────────────────────────────────────────
function TypedText({ words }) {
  const [idx, setIdx] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[idx];
    let timeout;
    if (!deleting && displayed.length < word.length) {
      timeout = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 80);
    } else if (!deleting && displayed.length === word.length) {
      timeout = setTimeout(() => setDeleting(true), 1800);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 45);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setIdx((idx + 1) % words.length);
    }
    return () => clearTimeout(timeout);
  }, [displayed, deleting, idx, words]);

  return (
    <span style={{ color: '#e91e8c' }}>
      {displayed}
      <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity }}>|</motion.span>
    </span>
  );
}

// ── Glowing card ──────────────────────────────────────────────────────────────
function GlowCard({ children, glowColor = 'rgba(233,30,140,0.15)', style }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      animate={{ boxShadow: hovered ? `0 20px 60px ${glowColor}, 0 0 0 1px rgba(233,30,140,0.2)` : '0 4px 20px rgba(0,0,0,0.06)' }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      style={{ borderRadius: 20, background: '#fff', ...style }}>
      {children}
    </motion.div>
  );
}

// ── AI Form ───────────────────────────────────────────────────────────────────
const fields = [
  { key: 'currentRole', label: 'Current Role', type: 'text', placeholder: 'e.g. Junior Software Developer', required: true },
  { key: 'skills', label: 'Current Skills', type: 'textarea', placeholder: 'List your key skills, technologies, tools...', required: true },
  { key: 'experience', label: 'Years of Experience', type: 'number', placeholder: 'e.g. 3', required: true },
  { key: 'careerGoal', label: 'Career Goal', type: 'textarea', placeholder: 'Where do you want to be in 3-5 years?', required: true },
];

function CareerForm({ onResult, prefilledRole = '' }) {
  const [form, setForm] = useState({ currentRole: '', skills: '', experience: '', careerGoal: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // When a career is selected from explorer, prefill the currentRole field
  useEffect(() => {
    if (prefilledRole) setForm(p => ({ ...p, currentRole: prefilledRole }));
  }, [prefilledRole]);

  const inputBase = {
    width: '100%', padding: '12px 14px', borderRadius: 10,
    border: '1.5px solid #f0d6e8', color: '#1a1a2e', fontSize: 14,
    outline: 'none', fontFamily: 'inherit', transition: 'border-color 0.2s, box-shadow 0.2s',
    boxSizing: 'border-box', background: '#fdf5f9',
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      const data = await analyzeWithAI('career', form);
      onResult(data);
    } catch (err) {
      setError(err.message || 'Failed to connect to AI engine.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      style={{ background: '#fff', borderRadius: 24, padding: '2rem', boxShadow: '0 20px 60px rgba(233,30,140,0.1)', border: '1px solid rgba(233,30,140,0.1)' }}>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.5rem' }}>
        <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 2, repeat: Infinity }}
          style={{ width: 10, height: 10, borderRadius: '50%', background: '#e91e8c' }} />
        <h3 style={{ color: '#1a1a2e', fontWeight: 700, fontSize: 17, margin: 0 }}>Enter Your Details</h3>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
        {fields.map((f, fi) => (
          <motion.div key={f.key}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: fi * 0.08, duration: 0.5 }}
            style={f.type === 'textarea' ? { gridColumn: '1 / -1' } : {}}>
            <label style={{ display: 'block', color: '#999', fontSize: 11, fontWeight: 700, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {f.label}
            </label>
            {f.type === 'textarea' ? (
              <textarea value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                placeholder={f.placeholder} rows={3} required={f.required}
                style={{ ...inputBase, resize: 'vertical' }}
                onFocus={e => { e.target.style.borderColor = '#e91e8c'; e.target.style.boxShadow = '0 0 0 3px rgba(233,30,140,0.1)'; }}
                onBlur={e => { e.target.style.borderColor = '#f0d6e8'; e.target.style.boxShadow = 'none'; }} />
            ) : (
              <input type={f.type} value={form[f.key]}
                onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                placeholder={f.placeholder} required={f.required} style={inputBase}
                onFocus={e => { e.target.style.borderColor = '#e91e8c'; e.target.style.boxShadow = '0 0 0 3px rgba(233,30,140,0.1)'; }}
                onBlur={e => { e.target.style.borderColor = '#f0d6e8'; e.target.style.boxShadow = 'none'; }} />
            )}
          </motion.div>
        ))}
      </div>

      {error && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: 12, color: '#dc2626', fontSize: 13, marginBottom: '1rem' }}>
          {error}
        </motion.div>
      )}

      <motion.button type="submit" disabled={loading}
        whileHover={!loading ? { scale: 1.02, boxShadow: '0 8px 40px rgba(233,30,140,0.45)' } : {}}
        whileTap={!loading ? { scale: 0.97 } : {}}
        style={{
          width: '100%', padding: '15px', borderRadius: 12, border: 'none',
          background: loading ? '#ddd' : 'linear-gradient(135deg, #e91e8c, #ff6b9d)',
          color: loading ? '#999' : '#fff', fontWeight: 700, fontSize: 15,
          cursor: loading ? 'not-allowed' : 'pointer',
          boxShadow: loading ? 'none' : '0 4px 24px rgba(233,30,140,0.3)',
          transition: 'background 0.3s',
        }}>
        {loading ? (
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              style={{ display: 'inline-block', width: 16, height: 16, border: '2px solid #999', borderTopColor: 'transparent', borderRadius: '50%' }} />
            Analyzing with AI...
          </span>
        ) : '✦ Analyze with AI'}
      </motion.button>
    </motion.form>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
const CAREERS = [
  { title: 'Software Engineer', icon: '💻', salary: '$85k – $160k', growth: 'Very High', skills: ['JavaScript', 'Python', 'System Design', 'Git'], color: '#7c3aed', desc: 'Build products used by millions. High demand across every industry.' },
  { title: 'Data Scientist', icon: '📊', salary: '$90k – $155k', growth: 'High', skills: ['Python', 'ML/AI', 'SQL', 'Statistics'], color: '#06b6d4', desc: 'Turn raw data into decisions. One of the fastest-growing roles globally.' },
  { title: 'Product Manager', icon: '🧭', salary: '$95k – $170k', growth: 'High', skills: ['Strategy', 'Roadmapping', 'Analytics', 'Leadership'], color: '#f59e0b', desc: 'Own the vision of a product from idea to launch.' },
  { title: 'UX Designer', icon: '🎨', salary: '$70k – $130k', growth: 'Moderate', skills: ['Figma', 'User Research', 'Prototyping', 'Accessibility'], color: '#ec4899', desc: 'Shape how people experience digital products every day.' },
  { title: 'DevOps Engineer', icon: '⚙️', salary: '$95k – $165k', growth: 'Very High', skills: ['Docker', 'Kubernetes', 'CI/CD', 'AWS'], color: '#10b981', desc: 'Bridge development and operations to ship faster and more reliably.' },
  { title: 'Cybersecurity Analyst', icon: '🔐', salary: '$80k – $150k', growth: 'Very High', skills: ['Networking', 'Threat Analysis', 'SIEM', 'Compliance'], color: '#ef4444', desc: 'Protect organisations from ever-evolving digital threats.' },
  { title: 'Cloud Architect', icon: '☁️', salary: '$120k – $200k', growth: 'Very High', skills: ['AWS/Azure/GCP', 'Networking', 'Security', 'Cost Optimisation'], color: '#0ea5e9', desc: 'Design scalable, resilient infrastructure for the modern web.' },
  { title: 'AI/ML Engineer', icon: '🤖', salary: '$110k – $190k', growth: 'Explosive', skills: ['PyTorch', 'LLMs', 'MLOps', 'Mathematics'], color: '#e91e8c', desc: 'Build the intelligent systems shaping the next decade of technology.' },
];

const growthColor = { 'Very High': '#10b981', 'High': '#06b6d4', 'Moderate': '#f59e0b', 'Explosive': '#e91e8c' };

function CareerExplorer({ onSelectCareer }) {
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('All');
  const filters = ['All', 'Very High', 'High', 'Moderate', 'Explosive'];
  const visible = filter === 'All' ? CAREERS : CAREERS.filter(c => c.growth === filter);

  const handleSelect = (career) => {
    setSelected(career);
    onSelectCareer(career);
  };

  return (
    <div>
      {/* Filter pills */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem', justifyContent: 'center' }}>
        {filters.map(f => (
          <motion.button key={f} onClick={() => setFilter(f)}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            style={{
              padding: '7px 18px', borderRadius: 100, border: 'none', cursor: 'pointer',
              fontWeight: 600, fontSize: 12,
              background: filter === f ? 'linear-gradient(135deg, #e91e8c, #ff6b9d)' : 'rgba(233,30,140,0.07)',
              color: filter === f ? '#fff' : '#e91e8c',
              boxShadow: filter === f ? '0 4px 16px rgba(233,30,140,0.3)' : 'none',
              transition: 'all 0.2s',
            }}>
            {f === 'All' ? 'All Careers' : `${f} Growth`}
          </motion.button>
        ))}
      </div>

      {/* Career cards grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>
        <AnimatePresence mode="popLayout">
          {visible.map((career, i) => (
            <motion.div key={career.title}
              layout
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: -10 }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
              onClick={() => handleSelect(career)}
              whileHover={{ y: -6, boxShadow: `0 20px 50px ${career.color}22` }}
              style={{
                background: selected?.title === career.title ? `linear-gradient(135deg, ${career.color}12, ${career.color}06)` : '#fff',
                border: `1.5px solid ${selected?.title === career.title ? career.color : 'rgba(0,0,0,0.06)'}`,
                borderRadius: 18, padding: '1.5rem', cursor: 'pointer',
                boxShadow: selected?.title === career.title ? `0 8px 30px ${career.color}22` : '0 2px 12px rgba(0,0,0,0.04)',
                transition: 'border-color 0.2s, background 0.2s',
              }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <motion.div animate={{ rotate: [0, 8, -8, 0] }} transition={{ duration: 4, repeat: Infinity, delay: i * 0.5 }}
                  style={{ fontSize: 32 }}>{career.icon}</motion.div>
                <span style={{
                  padding: '3px 10px', borderRadius: 100, fontSize: 10, fontWeight: 700,
                  background: `${growthColor[career.growth]}18`, color: growthColor[career.growth],
                }}>
                  {career.growth}
                </span>
              </div>
              <div style={{ fontWeight: 800, color: '#1a1a2e', fontSize: 15, marginBottom: '0.25rem' }}>{career.title}</div>
              <div style={{ color: career.color, fontWeight: 700, fontSize: 12, marginBottom: '0.5rem' }}>{career.salary}</div>
              <p style={{ color: '#888', fontSize: 12, lineHeight: 1.6, marginBottom: '0.75rem' }}>{career.desc}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                {career.skills.map(s => (
                  <span key={s} style={{ padding: '3px 8px', borderRadius: 6, background: `${career.color}10`, color: career.color, fontSize: 10, fontWeight: 600 }}>{s}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Expanded detail panel */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, y: 20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{ overflow: 'hidden', marginTop: '1.5rem' }}>
            <div style={{
              background: `linear-gradient(135deg, ${selected.color}10, ${selected.color}05)`,
              border: `1.5px solid ${selected.color}30`, borderRadius: 20, padding: '1.75rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 40 }}>{selected.icon}</span>
                  <div>
                    <div style={{ fontWeight: 900, color: '#1a1a2e', fontSize: 20 }}>{selected.title}</div>
                    <div style={{ color: selected.color, fontWeight: 700, fontSize: 13 }}>{selected.salary} / year</div>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                  onClick={() => document.getElementById('career-form-section')?.scrollIntoView({ behavior: 'smooth' })}
                  style={{
                    padding: '10px 22px', borderRadius: 50, border: 'none', cursor: 'pointer',
                    background: `linear-gradient(135deg, ${selected.color}, ${selected.color}bb)`,
                    color: '#fff', fontWeight: 700, fontSize: 13,
                    boxShadow: `0 4px 20px ${selected.color}44`,
                  }}>
                  Analyze My Fit for This Role →
                </motion.button>
              </div>
              <p style={{ color: '#555', fontSize: 14, lineHeight: 1.7, marginBottom: '1rem' }}>{selected.desc}</p>
              <div>
                <div style={{ color: '#999', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>Key Skills Required</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {selected.skills.map(s => (
                    <motion.span key={s} whileHover={{ scale: 1.1 }}
                      style={{ padding: '5px 12px', borderRadius: 8, background: `${selected.color}15`, color: selected.color, fontSize: 12, fontWeight: 600 }}>{s}</motion.span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function CareerPage() {
  const [result, setResult] = useState(null);
  const [prefilledRole, setPrefilledRole] = useState('');
  const formRef = useRef(null);
  const heroRef = useRef(null);
  const section2Ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const scrollToForm = () => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const scrollToSection2 = () => section2Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const handleCareerSelect = (career) => {
    setPrefilledRole(career.title);
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300);
  };

  return (
    <div style={{ background: '#fff5f9', minHeight: '100vh', fontFamily: 'Inter, sans-serif', overflowX: 'hidden' }}>
      <ScrollProgress />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section ref={heroRef} style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
        {/* Parallax background blobs */}
        <motion.div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', y: heroY, opacity: heroOpacity }}>
          <MorphBlob color="rgba(233,30,140,0.08)" size={500} style={{ top: -100, right: -100 }} />
          <MorphBlob color="rgba(245,158,11,0.06)" size={350} style={{ bottom: 0, left: -80 }} />
          <Particle style={{ width: 12, height: 12, background: '#e91e8c', top: '20%', left: '10%' }} duration={5} />
          <Particle style={{ width: 8, height: 8, background: '#f59e0b', top: '60%', left: '5%' }} duration={7} delay={1} />
          <Particle style={{ width: 16, height: 16, background: '#10b981', top: '30%', right: '8%' }} duration={6} delay={2} />
          <Particle style={{ width: 10, height: 10, background: '#ff6b9d', bottom: '20%', right: '15%' }} duration={8} delay={0.5} />
          <Particle style={{ width: 6, height: 6, background: '#e91e8c', top: '70%', left: '20%' }} duration={4} delay={1.5} />
        </motion.div>

        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '120px 24px 80px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center', width: '100%', position: 'relative', zIndex: 1 }}>
          {/* Left */}
          <div>
            <Reveal delay={0.05}>
              <motion.div whileHover={{ scale: 1.05 }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: '1px solid #e91e8c', borderRadius: 100, padding: '5px 16px', fontSize: 11, fontWeight: 700, color: '#e91e8c', letterSpacing: '1px', marginBottom: '1.5rem', textTransform: 'uppercase', background: 'rgba(233,30,140,0.04)' }}>
                <motion.span animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 2, repeat: Infinity }}>✦</motion.span>
                Our Purpose
              </motion.div>
            </Reveal>

            <StaggerContainer delay={0.1}>
              {['Shape Your', 'Career'].map((line, i) => (
                <StaggerItem key={i}>
                  <div style={{ fontSize: 'clamp(38px, 5vw, 60px)', fontWeight: 900, lineHeight: 1.05, color: '#1a1a2e' }}>{line}</div>
                </StaggerItem>
              ))}
              <StaggerItem>
                <div style={{ fontSize: 'clamp(38px, 5vw, 60px)', fontWeight: 900, lineHeight: 1.05, marginBottom: '1rem' }}>
                  <TypedText words={['With AI', 'With Experts', 'With Confidence', 'With Purpose']} />
                </div>
              </StaggerItem>
            </StaggerContainer>

            <Reveal delay={0.4}>
              <p style={{ color: '#666', fontSize: 15, lineHeight: 1.8, maxWidth: 380, marginBottom: '2rem' }}>
                Get personalised career guidance powered by AI analysis, verified by human experts — so every recommendation is both smart and safe.
              </p>
            </Reveal>

            <Reveal delay={0.5}>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
                <motion.button onClick={scrollToForm}
                  whileHover={{ scale: 1.05, boxShadow: '0 12px 40px rgba(233,30,140,0.45)' }}
                  whileTap={{ scale: 0.95 }}
                  style={{ padding: '14px 32px', borderRadius: 50, border: 'none', background: 'linear-gradient(135deg, #e91e8c, #ff6b9d)', color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer', boxShadow: '0 8px 30px rgba(233,30,140,0.35)' }}>
                  Start Career Analysis →
                </motion.button>
                <motion.button onClick={scrollToSection2}
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  style={{ padding: '14px 28px', borderRadius: 50, border: '2px solid #e91e8c', background: 'transparent', color: '#e91e8c', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
                  Learn More ↓
                </motion.button>
              </div>
            </Reveal>

            <Reveal delay={0.6}>
              <div style={{ display: 'flex', gap: '2.5rem' }}>
                <StatCounter value="12k+" label="Careers Guided" />
                <StatCounter value="98%" label="Accuracy Rate" />
                <StatCounter value="50+" label="Human Experts" />
              </div>
            </Reveal>
          </div>

          {/* Right — hero visual */}
          <Reveal delay={0.3} direction="left">
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', height: 420 }}>
              {/* Orbit rings */}
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                style={{ position: 'absolute', width: 340, height: 340, borderRadius: '50%', border: '1.5px dashed rgba(233,30,140,0.2)' }} />
              <motion.div animate={{ rotate: -360 }} transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
                style={{ position: 'absolute', width: 260, height: 260, borderRadius: '50%', border: '1px dashed rgba(245,158,11,0.2)' }} />

              {/* Orbiting dots */}
              <OrbitDot radius={170} duration={8} color="#e91e8c" size={12} startAngle={0} />
              <OrbitDot radius={170} duration={8} color="#ff6b9d" size={8} startAngle={120} />
              <OrbitDot radius={130} duration={6} color="#f59e0b" size={10} startAngle={60} />
              <OrbitDot radius={130} duration={6} color="#10b981" size={8} startAngle={240} />

              {/* Center avatar */}
              <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 4, repeat: Infinity }}
                style={{ width: 180, height: 180, borderRadius: '50%', background: 'linear-gradient(135deg, #fce4f3, #f8b4d9)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 2, boxShadow: '0 20px 60px rgba(233,30,140,0.2)' }}>
                <div style={{ width: 110, height: 110, borderRadius: '50%', background: 'linear-gradient(135deg, #e91e8c, #ff6b9d)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48 }}>👤</div>
              </motion.div>

              {/* Floating badges */}
              <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity }}
                style={{ position: 'absolute', top: 30, right: 10, background: '#fff', borderRadius: 14, padding: '10px 16px', boxShadow: '0 8px 30px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 600, color: '#1a1a2e', zIndex: 3 }}>
                <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 1.5, repeat: Infinity }}
                  style={{ width: 8, height: 8, borderRadius: '50%', background: '#e91e8c' }} />
                AI Analysis Ready
              </motion.div>

              <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 3.5, repeat: Infinity }}
                style={{ position: 'absolute', bottom: 50, left: 0, background: '#fff', borderRadius: 14, padding: '10px 16px', boxShadow: '0 8px 30px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 600, color: '#1a1a2e', zIndex: 3 }}>
                <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                  style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} />
                Human Verified
              </motion.div>

              {/* Score badge */}
              <motion.div animate={{ x: [0, 6, 0] }} transition={{ duration: 4, repeat: Infinity }}
                style={{ position: 'absolute', top: 120, left: 0, background: 'linear-gradient(135deg, #e91e8c, #ff6b9d)', borderRadius: 14, padding: '10px 16px', boxShadow: '0 8px 30px rgba(233,30,140,0.3)', zIndex: 3 }}>
                <div style={{ color: '#fff', fontWeight: 900, fontSize: 20 }}>98%</div>
                <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 10 }}>Accuracy</div>
              </motion.div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── SECTION 2: AI ANALYSIS ───────────────────────────────────────── */}
      <section ref={section2Ref} style={{ padding: '100px 24px', background: '#fff', position: 'relative', overflow: 'hidden' }}>
        <MorphBlob color="rgba(233,30,140,0.04)" size={400} style={{ top: -100, left: -100 }} />
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center', position: 'relative' }}>

          <Reveal direction="right">
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', height: 360 }}>
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
                style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', border: '2px dashed rgba(233,30,140,0.15)' }} />
              <motion.div animate={{ rotate: -360 }} transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                style={{ position: 'absolute', width: 220, height: 220, borderRadius: '50%', border: '1px dashed rgba(245,158,11,0.2)' }} />
              <OrbitDot radius={150} duration={7} color="#e91e8c" size={14} />
              <OrbitDot radius={110} duration={5} color="#f59e0b" size={10} startAngle={180} />
              <motion.div animate={{ scale: [1, 1.08, 1], rotate: [0, 5, -5, 0] }} transition={{ duration: 4, repeat: Infinity }}
                style={{ width: 170, height: 170, borderRadius: '50%', background: 'linear-gradient(135deg, #fce4f3, #f8b4d9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 70, zIndex: 2, boxShadow: '0 16px 50px rgba(233,30,140,0.15)' }}>
                🎯
              </motion.div>
              <Particle style={{ width: 14, height: 14, background: '#10b981', top: 20, right: 50 }} duration={5} />
              <Particle style={{ width: 10, height: 10, background: '#f59e0b', bottom: 30, left: 40 }} duration={7} delay={1} />
            </div>
          </Reveal>

          <div>
            <Reveal delay={0.05}>
              <div style={{ color: '#e91e8c', fontSize: 11, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '0.75rem' }}>01 · AI Analysis</div>
            </Reveal>
            <Reveal delay={0.15}>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 900, color: '#1a1a2e', lineHeight: 1.15, margin: '0 0 1rem' }}>
                Get instant career <span style={{ color: '#e91e8c' }}>insights</span> powered by AI
              </h2>
            </Reveal>
            <Reveal delay={0.25}>
              <p style={{ color: '#666', fontSize: 15, lineHeight: 1.8, marginBottom: '1.5rem' }}>
                Our AI scans your skills, experience and goals — then maps out a personalised roadmap with actionable next steps tailored specifically to you.
              </p>
            </Reveal>
            <StaggerContainer delay={0.3}>
              {['Skill gap analysis against market demand', 'Personalised career roadmap in seconds', 'Salary trajectory & growth potential', 'Industry trend matching'].map((item, i) => (
                <StaggerItem key={i} direction="left">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#444', fontSize: 14, marginBottom: '0.75rem' }}>
                    <motion.div whileHover={{ scale: 1.3, background: '#e91e8c' }}
                      style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(233,30,140,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.2s' }}>
                      <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#e91e8c' }} />
                    </motion.div>
                    {item}
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </section>

      {/* ── SECTION 3: HUMAN EXPERTS ─────────────────────────────────────── */}
      <section style={{ padding: '100px 24px', background: '#fff5f9', position: 'relative', overflow: 'hidden' }}>
        <MorphBlob color="rgba(16,185,129,0.05)" size={450} style={{ bottom: -100, right: -100 }} />
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center', position: 'relative' }}>
          <div>
            <Reveal delay={0.05}>
              <div style={{ color: '#10b981', fontSize: 11, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '0.75rem' }}>02 · Human Experts</div>
            </Reveal>
            <Reveal delay={0.15}>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 900, color: '#1a1a2e', lineHeight: 1.15, margin: '0 0 1rem' }}>
                Verified by <span style={{ color: '#e91e8c' }}>real experts</span> for your safety
              </h2>
            </Reveal>
            <Reveal delay={0.25}>
              <p style={{ color: '#666', fontSize: 15, lineHeight: 1.8, marginBottom: '1.5rem' }}>
                Every AI recommendation is reviewed by certified career counsellors. They check for accuracy, safety and relevance — so you get guidance you can truly trust.
              </p>
            </Reveal>
            <StaggerContainer delay={0.3}>
              {['Reviewed by certified career coaches', '12+ years average expert experience', 'Real-time adjustments to AI output', 'Bias detection & fairness checks'].map((item, i) => (
                <StaggerItem key={i} direction="left">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#444', fontSize: 14, marginBottom: '0.75rem' }}>
                    <motion.div whileHover={{ scale: 1.3 }}
                      style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981' }} />
                    </motion.div>
                    {item}
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>

          <Reveal direction="left">
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', height: 360 }}>
              <motion.div animate={{ rotate: -360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                style={{ position: 'absolute', width: 290, height: 290, borderRadius: '50%', border: '2px dashed rgba(16,185,129,0.2)' }} />
              <OrbitDot radius={145} duration={9} color="#10b981" size={12} />
              <OrbitDot radius={145} duration={9} color="#06b6d4" size={8} startAngle={180} />
              <motion.div animate={{ scale: [1, 1.06, 1] }} transition={{ duration: 4, repeat: Infinity }}
                style={{ width: 180, height: 180, borderRadius: '50%', background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 76, zIndex: 2, boxShadow: '0 16px 50px rgba(16,185,129,0.15)' }}>
                🧑‍💼
              </motion.div>
              <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity }}
                style={{ position: 'absolute', top: 10, right: 10, background: '#fff', borderRadius: 12, padding: '8px 14px', boxShadow: '0 8px 24px rgba(0,0,0,0.08)', fontSize: 12, fontWeight: 700, color: '#10b981', display: 'flex', alignItems: 'center', gap: 6, zIndex: 3 }}>
                ✓ Expert Verified
              </motion.div>
              <Particle style={{ width: 16, height: 16, background: '#e91e8c', top: 60, left: 20, opacity: 0.6 }} duration={6} />
              <Particle style={{ width: 20, height: 20, background: '#f59e0b', bottom: 40, right: 20, opacity: 0.5 }} duration={8} delay={1} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── SECTION 4: HOW IT WORKS ──────────────────────────────────────── */}
      <section style={{ padding: '100px 24px', background: '#fff', position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <Reveal delay={0.05}>
            <div style={{ color: '#e91e8c', fontSize: 11, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '0.75rem' }}>03 · How It Works</div>
            <h2 style={{ fontSize: 'clamp(26px, 4vw, 42px)', fontWeight: 900, color: '#1a1a2e', marginBottom: '3.5rem' }}>
              Three steps to your <span style={{ color: '#e91e8c' }}>perfect career path</span>
            </h2>
          </Reveal>

          <StaggerContainer>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem' }}>
              {[
                { icon: '📝', title: 'Share Your Profile', desc: 'Tell us your current role, skills, experience and where you want to go.', color: '#e91e8c' },
                { icon: '🤖', title: 'AI Analyzes', desc: 'Our AI maps skill gaps, market demand and builds your personalised roadmap.', color: '#f59e0b' },
                { icon: '👤', title: 'Expert Validates', desc: 'A certified career coach reviews and refines the AI output for accuracy.', color: '#10b981' },
              ].map((step, i) => (
                <StaggerItem key={i}>
                  <GlowCard glowColor={`${step.color}22`} style={{ padding: '2rem', border: `1px solid ${step.color}18`, height: '100%' }}>
                    <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 4, repeat: Infinity, delay: i * 1.2 }}
                      style={{ fontSize: 44, marginBottom: '1rem' }}>{step.icon}</motion.div>
                    <div style={{ fontWeight: 800, color: '#1a1a2e', fontSize: 17, marginBottom: '0.5rem' }}>{step.title}</div>
                    <div style={{ color: '#888', fontSize: 13, lineHeight: 1.7, marginBottom: '1.25rem' }}>{step.desc}</div>
                    <motion.div whileHover={{ scale: 1.15 }}
                      style={{ width: 36, height: 36, borderRadius: '50%', background: `linear-gradient(135deg, ${step.color}, ${step.color}99)`, color: '#fff', fontWeight: 900, fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', boxShadow: `0 4px 16px ${step.color}44` }}>
                      {i + 1}
                    </motion.div>
                  </GlowCard>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        </div>
      </section>

      {/* ── SECTION 5: TESTIMONIALS ──────────────────────────────────────── */}
      <section style={{ padding: '100px 24px', background: 'linear-gradient(135deg, #fff5f9, #fce4f3)', position: 'relative', overflow: 'hidden' }}>
        <MorphBlob color="rgba(233,30,140,0.06)" size={300} style={{ top: 0, right: 0 }} />
        <div style={{ maxWidth: 960, margin: '0 auto', position: 'relative' }}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <div style={{ color: '#e91e8c', fontSize: 11, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '0.75rem' }}>04 · Success Stories</div>
              <h2 style={{ fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 900, color: '#1a1a2e' }}>
                Real people, <span style={{ color: '#e91e8c' }}>real results</span>
              </h2>
            </div>
          </Reveal>
          <StaggerContainer>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
              {[
                { name: 'Priya S.', role: 'Software Engineer → Tech Lead', quote: 'The AI identified exactly which skills I was missing. Got promoted within 8 months.', rating: 5 },
                { name: 'Marcus T.', role: 'Marketing → Product Manager', quote: 'The human expert review gave me confidence the advice was actually right for my situation.', rating: 5 },
                { name: 'Aisha K.', role: 'Teacher → UX Designer', quote: 'I was skeptical about a career switch at 34. The roadmap made it feel completely achievable.', rating: 5 },
              ].map((t, i) => (
                <StaggerItem key={i}>
                  <GlowCard style={{ padding: '1.5rem', border: '1px solid rgba(233,30,140,0.08)' }}>
                    <div style={{ display: 'flex', gap: 2, marginBottom: '0.75rem' }}>
                      {Array(t.rating).fill(0).map((_, si) => (
                        <motion.span key={si} initial={{ scale: 0 }} whileInView={{ scale: 1 }}
                          viewport={{ once: false }} transition={{ delay: si * 0.1, type: 'spring', bounce: 0.6 }}
                          style={{ color: '#f59e0b', fontSize: 14 }}>★</motion.span>
                      ))}
                    </div>
                    <p style={{ color: '#555', fontSize: 13, lineHeight: 1.7, marginBottom: '1rem', fontStyle: 'italic' }}>"{t.quote}"</p>
                    <div style={{ fontWeight: 700, color: '#1a1a2e', fontSize: 13 }}>{t.name}</div>
                    <div style={{ color: '#e91e8c', fontSize: 11, marginTop: 2 }}>{t.role}</div>
                  </GlowCard>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        </div>
      </section>

      {/* ── SECTION 5.5: CAREER EXPLORER ─────────────────────────────────── */}
      <section style={{ padding: '100px 24px', background: '#fff', position: 'relative', overflow: 'hidden' }}>
        <MorphBlob color="rgba(124,58,237,0.04)" size={400} style={{ top: -80, left: -80 }} />
        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative' }}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <div style={{ color: '#e91e8c', fontSize: 11, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '0.75rem' }}>05 · Explore Careers</div>
              <h2 style={{ fontSize: 'clamp(26px, 4vw, 42px)', fontWeight: 900, color: '#1a1a2e', margin: '0 0 0.75rem' }}>
                Find your <span style={{ color: '#e91e8c' }}>ideal career path</span>
              </h2>
              <p style={{ color: '#888', fontSize: 14, maxWidth: 500, margin: '0 auto' }}>
                Browse in-demand roles, see salary ranges and required skills — then click "Analyze My Fit" to get your personalised AI analysis instantly.
              </p>
            </div>
          </Reveal>
          <CareerExplorer onSelectCareer={handleCareerSelect} />
        </div>
      </section>

      {/* ── SECTION 6: AI FORM ───────────────────────────────────────────── */}
      <section ref={formRef} id="career-form-section" style={{ padding: '100px 24px', background: '#fff', position: 'relative', overflow: 'hidden' }}>
        <MorphBlob color="rgba(233,30,140,0.05)" size={500} style={{ top: -150, right: -150 }} />
        <div style={{ maxWidth: 800, margin: '0 auto', position: 'relative' }}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <div style={{ color: '#e91e8c', fontSize: 11, fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '0.75rem' }}>05 · Get Your Analysis</div>
              <h2 style={{ fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 900, color: '#1a1a2e', margin: 0 }}>
                Start your <span style={{ color: '#e91e8c' }}>AI career analysis</span> now
              </h2>
              <p style={{ color: '#888', fontSize: 14, marginTop: '0.75rem' }}>Fill in your details and get a personalised roadmap in seconds</p>
            </div>
          </Reveal>

          <CareerForm onResult={setResult} prefilledRole={prefilledRole} />

          <AnimatePresence>
            {result && (
              <motion.div initial={{ opacity: 0, y: 40, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                style={{ marginTop: '2rem' }}>
                <ResultPanel result={result} domain="career" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

    </div>
  );
}
