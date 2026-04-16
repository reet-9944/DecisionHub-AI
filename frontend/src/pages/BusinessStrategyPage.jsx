import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import {
  Sparkles, Brain, TrendingUp, Target, Rocket, Globe, DollarSign,
  Users, Zap, Shield, BarChart2, ChevronRight, ArrowRight,
  CheckCircle2, Star, Quote, Lightbulb, Clock, Award, Play,
  Building2, ShoppingCart, RefreshCw, Store, Code2, AlertTriangle
} from 'lucide-react';
import { analyzeWithAI } from '../services/api';

// ─── Video Demo Modal ────────────────────────────────────────────────────────
function VideoModal({ open, onClose }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    if (open) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  // Demo steps shown inside the modal
  const demoSteps = [
    { icon: '1', title: 'Enter Your Details', desc: 'Fill in your industry, company stage, team size, and business challenge.' },
    { icon: '2', title: 'AI Analyzes in Seconds', desc: 'Llama 3.3 70B applies Porter\'s Five Forces, SWOT, and OKR frameworks instantly.' },
    { icon: '3', title: 'Get Your Strategy', desc: 'Receive a full strategy, risk factors, action plan, and alternative approaches.' },
    { icon: '4', title: 'Execute & Scale', desc: 'Follow the step-by-step roadmap with timelines, milestones, and team assignments.' },
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(2,12,6,0.92)',
            backdropFilter: 'blur(16px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '1.5rem',
          }}
        >
          <motion.div
            initial={{ scale: 0.88, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.88, opacity: 0, y: 40 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%', maxWidth: 760,
              borderRadius: 24,
              background: 'linear-gradient(135deg, #041a0a, #031208)',
              border: '1px solid rgba(0,255,136,0.2)',
              boxShadow: '0 40px 120px rgba(0,255,136,0.15), 0 0 0 1px rgba(0,255,136,0.05)',
              overflow: 'hidden',
            }}
          >
            {/* Modal Header */}
            <div style={{
              padding: '1.5rem 2rem',
              borderBottom: '1px solid rgba(0,255,136,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: 'rgba(0,255,136,0.03)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #00ff88, #00cc66)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Play size={14} color="#020c06" fill="#020c06" />
                </motion.div>
                <div>
                  <div style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>How It Works</div>
                  <div style={{ color: 'rgba(0,255,136,0.6)', fontSize: 11 }}>AI Business Strategy Demo</div>
                </div>
              </div>
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.1, background: 'rgba(0,255,136,0.15)' }}
                whileTap={{ scale: 0.95 }}
                style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: 'rgba(0,255,136,0.06)',
                  border: '1px solid rgba(0,255,136,0.15)',
                  color: 'rgba(255,255,255,0.6)', fontSize: 18, lineHeight: 1,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background 0.2s',
                }}
              >
                ×
              </motion.button>
            </div>

            {/* Animated Preview Area */}
            <div style={{
              position: 'relative', height: 220, overflow: 'hidden',
              background: 'linear-gradient(135deg, #020c06, #041a0a)',
              borderBottom: '1px solid rgba(0,255,136,0.08)',
            }}>
              {/* Animated grid */}
              <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                backgroundImage: `linear-gradient(rgba(0,255,136,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,0.05) 1px, transparent 1px)`,
                backgroundSize: '40px 40px',
              }} />
              {/* Glowing orbs */}
              {[
                { w: 200, h: 200, top: '-20%', left: '10%', color: '#00ff8820' },
                { w: 160, h: 160, top: '20%', right: '5%', color: '#00cc6618' },
              ].map((orb, i) => (
                <motion.div key={i}
                  animate={{ y: [0, -15, 0], scale: [1, 1.08, 1] }}
                  transition={{ duration: 4 + i * 2, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ position: 'absolute', width: orb.w, height: orb.h, borderRadius: '50%', background: `radial-gradient(circle, ${orb.color}, transparent 70%)`, top: orb.top, left: orb.left, right: orb.right, filter: 'blur(30px)' }}
                />
              ))}
              {/* Animated bars preview */}
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem' }}>
                {[65, 82, 74, 91, 58, 78].map((h, i) => (
                  <motion.div key={i}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ delay: 0.1 + i * 0.1, duration: 0.6, ease: 'easeOut' }}
                    style={{ transformOrigin: 'bottom', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}
                  >
                    <motion.div
                      animate={{ opacity: [0.6, 1, 0.6] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                      style={{ width: 32, height: h, borderRadius: '6px 6px 0 0', background: `linear-gradient(180deg, #00ff88, #00cc66${Math.round(h * 1.5).toString(16)})`, boxShadow: `0 0 12px rgba(0,255,136,0.3)` }}
                    />
                    <div style={{ width: 32, height: 2, background: 'rgba(0,255,136,0.2)', borderRadius: 1 }} />
                  </motion.div>
                ))}
              </div>
              {/* Center badge */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.8, type: 'spring', stiffness: 200 }}
                style={{
                  position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                  padding: '8px 20px', borderRadius: 100,
                  background: 'rgba(2,12,6,0.85)', border: '1px solid rgba(0,255,136,0.4)',
                  color: '#00ff88', fontSize: 13, fontWeight: 700,
                  backdropFilter: 'blur(10px)',
                  display: 'flex', alignItems: 'center', gap: 8,
                  boxShadow: '0 0 30px rgba(0,255,136,0.2)',
                }}
              >
                <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
                  <Sparkles size={14} color="#00ff88" />
                </motion.div>
                AI Analysis Complete — 94% Confidence
              </motion.div>
            </div>

            {/* Steps */}
            <div style={{ padding: '2rem', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
              {demoSteps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.1, duration: 0.4 }}
                  style={{
                    display: 'flex', gap: 12, alignItems: 'flex-start',
                    padding: '14px 16px', borderRadius: 14,
                    background: 'rgba(0,255,136,0.03)',
                    border: '1px solid rgba(0,255,136,0.08)',
                  }}
                >
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                    background: 'linear-gradient(135deg, #00ff88, #00cc66)',
                    color: '#020c06', fontSize: 12, fontWeight: 800,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>{step.icon}</div>
                  <div>
                    <div style={{ color: '#fff', fontWeight: 600, fontSize: 13, marginBottom: 3 }}>{step.title}</div>
                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, lineHeight: 1.6 }}>{step.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA inside modal */}
            <div style={{ padding: '0 2rem 2rem', display: 'flex', gap: '0.75rem' }}>
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(0,255,136,0.35)' }}
                whileTap={{ scale: 0.97 }}
                style={{
                  flex: 1, padding: '13px', borderRadius: 12,
                  background: 'linear-gradient(135deg, #00ff88, #00cc66)',
                  border: 'none', color: '#020c06', fontWeight: 800, fontSize: 14,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}
              >
                <Rocket size={16} /> Try It Now
              </motion.button>
              <motion.button
                onClick={onClose}
                whileHover={{ borderColor: 'rgba(0,255,136,0.4)' }}
                whileTap={{ scale: 0.97 }}
                style={{
                  padding: '13px 20px', borderRadius: 12,
                  background: 'transparent', border: '1px solid rgba(0,255,136,0.15)',
                  color: 'rgba(255,255,255,0.5)', fontSize: 14, cursor: 'pointer',
                  transition: 'border-color 0.2s',
                }}
              >
                Close
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Utility: useInView hook ─────────────────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

// ─── Animated Section Wrapper ────────────────────────────────────────────────
function Section({ children, className = '', delay = 0, direction = 'up' }) {
  const [ref, inView] = useInView();
  const variants = {
    hidden: {
      opacity: 0,
      y: direction === 'up' ? 60 : direction === 'down' ? -60 : 0,
      x: direction === 'left' ? 60 : direction === 'right' ? -60 : 0,
      scale: direction === 'zoom' ? 0.85 : 1,
    },
    visible: { opacity: 1, y: 0, x: 0, scale: 1, transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] } },
  };
  return (
    <motion.div ref={ref} variants={variants} initial="hidden" animate={inView ? 'visible' : 'hidden'} className={className}>
      {children}
    </motion.div>
  );
}

// ─── 3D Tilt Card ────────────────────────────────────────────────────────────
function TiltCard({ children, style = {}, glowColor = '#00ff88' }) {
  const cardRef = useRef(null);
  const handleMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotX = ((y - cy) / cy) * -12;
    const rotY = ((x - cx) / cx) * 12;
    card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.03)`;
    card.style.boxShadow = `0 20px 60px ${glowColor}33, 0 0 30px ${glowColor}22`;
  };
  const handleLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)';
    card.style.boxShadow = '';
  };
  return (
    <div ref={cardRef} onMouseMove={handleMove} onMouseLeave={handleLeave}
      style={{ transition: 'transform 0.15s ease, box-shadow 0.3s ease', ...style }}>
      {children}
    </div>
  );
}

// ─── Floating Orb Background ─────────────────────────────────────────────────
function FloatingOrbs() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {[
        { w: 500, h: 500, top: '-10%', left: '-5%', color: '#00ff8822', dur: 8 },
        { w: 400, h: 400, top: '30%', right: '-8%', color: '#00cc6622', dur: 10 },
        { w: 300, h: 300, bottom: '10%', left: '20%', color: '#00ff4422', dur: 7 },
        { w: 250, h: 250, top: '60%', right: '25%', color: '#00ff8811', dur: 12 },
      ].map((orb, i) => (
        <motion.div key={i}
          animate={{ y: [0, -30, 0], x: [0, 15, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: orb.dur, repeat: Infinity, ease: 'easeInOut', delay: i * 1.5 }}
          style={{
            position: 'absolute', width: orb.w, height: orb.h,
            borderRadius: '50%', background: `radial-gradient(circle, ${orb.color}, transparent 70%)`,
            top: orb.top, left: orb.left, right: orb.right, bottom: orb.bottom,
            filter: 'blur(40px)',
          }}
        />
      ))}
    </div>
  );
}

// ─── Particle Grid ───────────────────────────────────────────────────────────
function ParticleGrid() {
  const dots = Array.from({ length: 80 });
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {dots.map((_, i) => (
        <motion.div key={i}
          animate={{ opacity: [0.1, 0.5, 0.1], scale: [1, 1.3, 1] }}
          transition={{ duration: 2 + (i % 4), repeat: Infinity, delay: (i * 0.15) % 3 }}
          style={{
            position: 'absolute',
            width: 2, height: 2, borderRadius: '50%',
            background: '#00ff88',
            left: `${(i % 10) * 11 + 2}%`,
            top: `${Math.floor(i / 10) * 14 + 5}%`,
          }}
        />
      ))}
    </div>
  );
}

// ─── SECTION 1: Hero ─────────────────────────────────────────────────────────
function HeroSection({ onCTAClick, onDemoClick }) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <section style={{
      minHeight: '100vh', position: 'relative', display: 'flex', alignItems: 'center',
      justifyContent: 'center', overflow: 'hidden',
      background: 'linear-gradient(135deg, #020c06 0%, #041a0a 40%, #061f0c 70%, #020c06 100%)',
    }}>
      <FloatingOrbs />
      <ParticleGrid />

      {/* Grid lines */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `linear-gradient(rgba(0,255,136,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,0.04) 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
      }} />

      <motion.div style={{ y, opacity }} className="hero-content"
        style2={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 1.5rem', maxWidth: 900, margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 18px', borderRadius: 100, background: 'rgba(0,255,136,0.08)', border: '1px solid rgba(0,255,136,0.25)', marginBottom: '1.5rem' }}>
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}>
            <Sparkles size={14} color="#00ff88" />
          </motion.div>
          <span style={{ color: '#00ff88', fontSize: 12, fontWeight: 600, letterSpacing: '0.5px' }}>AI-POWERED STRATEGY ENGINE</span>
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
          style={{ fontSize: 'clamp(42px, 8vw, 88px)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-2px', marginBottom: '1.5rem', color: '#fff' }}>
          AI-Powered
          <br />
          <span style={{ background: 'linear-gradient(135deg, #00ff88, #00cc66, #00ff44)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Business Strategy
          </span>
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
          style={{ fontSize: 'clamp(16px, 2.5vw, 20px)', color: 'rgba(255,255,255,0.55)', maxWidth: 600, margin: '0 auto 2.5rem', lineHeight: 1.7 }}>
          Transform your business decisions with real-time AI analysis. Get data-driven strategies, risk assessments, and actionable roadmaps in seconds.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
          style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <motion.button onClick={onCTAClick}
            whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(0,255,136,0.5)' }}
            whileTap={{ scale: 0.97 }}
            style={{ padding: '16px 36px', borderRadius: 14, background: 'linear-gradient(135deg, #00ff88, #00cc66)', border: 'none', color: '#020c06', fontWeight: 800, fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Rocket size={18} /> Start Your Strategy
          </motion.button>
          <motion.button
            onClick={onDemoClick}
            whileHover={{ scale: 1.03, borderColor: 'rgba(0,255,136,0.6)' }}
            whileTap={{ scale: 0.97 }}
            style={{ padding: '16px 32px', borderRadius: 14, background: 'rgba(0,255,136,0.06)', border: '1px solid rgba(0,255,136,0.25)', color: '#00ff88', fontWeight: 600, fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Play size={16} /> Watch Demo
          </motion.button>
        </motion.div>

        {/* Stats row */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          style={{ display: 'flex', gap: '2rem', justifyContent: 'center', marginTop: '4rem', flexWrap: 'wrap' }}>
          {[
            { val: '10K+', label: 'Strategies Generated' },
            { val: '94%', label: 'Accuracy Rate' },
            { val: '3s', label: 'Avg. Analysis Time' },
            { val: '50+', label: 'Industries Covered' },
          ].map((s, i) => (
            <motion.div key={i} whileHover={{ y: -4 }}
              style={{ textAlign: 'center', padding: '1rem 1.5rem', borderRadius: 12, background: 'rgba(0,255,136,0.05)', border: '1px solid rgba(0,255,136,0.12)' }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: '#00ff88', letterSpacing: '-1px' }}>{s.val}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>{s.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 1.5, repeat: Infinity }}
        style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        <div style={{ width: 1, height: 40, background: 'linear-gradient(180deg, transparent, #00ff88)' }} />
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#00ff88' }} />
      </motion.div>
    </section>
  );
}

// ─── Strategy Option Modal ────────────────────────────────────────────────────
function StrategyModal({ option, onClose }) {
  const [industry, setIndustry] = useState('');
  const [stage, setStage] = useState('Seed');
  const [teamSize, setTeamSize] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  if (!option) return null;
  const Icon = option.icon;

  const inputStyle = {
    width: '100%', padding: '12px 14px', borderRadius: 10,
    background: 'rgba(0,255,136,0.04)', border: '1px solid rgba(0,255,136,0.15)',
    color: '#fff', fontSize: 13, outline: 'none', fontFamily: 'inherit',
    transition: 'border-color 0.2s, box-shadow 0.2s', boxSizing: 'border-box',
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!industry.trim()) return;
    setLoading(true); setError(null); setResult(null);
    try {
      const challenge = `${option.title}: ${option.challengePrompt}. Industry: ${industry}.`;
      const data = await analyzeWithAI('business', {
        industry,
        companyStage: stage,
        teamSize,
        businessChallenge: challenge,
      });
      setResult(data);
    } catch (err) {
      setError(err.message || 'Analysis failed. Make sure the backend is running.');
    } finally { setLoading(false); }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, zIndex: 9998, background: 'rgba(2,12,6,0.92)', backdropFilter: 'blur(16px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', overflowY: 'auto' }}
      >
        <motion.div
          initial={{ scale: 0.88, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.88, opacity: 0, y: 40 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          style={{ width: '100%', maxWidth: 680, borderRadius: 24, background: 'linear-gradient(135deg, #041a0a, #031208)', border: `1px solid ${option.color}33`, boxShadow: `0 40px 120px ${option.color}18`, overflow: 'hidden', maxHeight: '90vh', overflowY: 'auto' }}
        >
          {/* Header */}
          <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid rgba(0,255,136,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: `${option.color}06`, position: 'sticky', top: 0, zIndex: 1, backdropFilter: 'blur(20px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: `${option.color}18`, border: `1px solid ${option.color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={20} color={option.color} />
              </div>
              <div>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>{option.title}</div>
                <div style={{ color: `${option.color}99`, fontSize: 11 }}>AI Strategy Generator</div>
              </div>
            </div>
            <motion.button onClick={onClose} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
              style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              ×
            </motion.button>
          </div>

          <div style={{ padding: '2rem' }}>
            {/* What this covers */}
            <div style={{ marginBottom: '1.75rem', padding: '1rem 1.25rem', borderRadius: 12, background: `${option.color}08`, border: `1px solid ${option.color}18` }}>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, lineHeight: 1.7, margin: 0 }}>
                <span style={{ color: option.color, fontWeight: 700 }}>What you'll get: </span>
                {option.whatYouGet}
              </p>
            </div>

            {/* Key focus areas */}
            <div style={{ marginBottom: '1.75rem' }}>
              <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Key Focus Areas</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {option.tags.map((tag, i) => (
                  <span key={i} style={{ padding: '4px 12px', borderRadius: 100, background: `${option.color}10`, border: `1px solid ${option.color}22`, color: option.color, fontSize: 12, fontWeight: 600 }}>{tag}</span>
                ))}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleAnalyze}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', color: `${option.color}99`, fontSize: 11, fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: 7 }}>Your Industry *</label>
                  <input type="text" value={industry} onChange={e => setIndustry(e.target.value)}
                    placeholder={option.industryPlaceholder} required style={inputStyle}
                    onFocus={e => { e.target.style.borderColor = option.color + '66'; e.target.style.boxShadow = `0 0 16px ${option.color}18`; }}
                    onBlur={e => { e.target.style.borderColor = 'rgba(0,255,136,0.15)'; e.target.style.boxShadow = 'none'; }} />
                </div>
                <div>
                  <label style={{ display: 'block', color: `${option.color}99`, fontSize: 11, fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: 7 }}>Company Stage</label>
                  <select value={stage} onChange={e => setStage(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}
                    onFocus={e => { e.target.style.borderColor = option.color + '66'; }}
                    onBlur={e => { e.target.style.borderColor = 'rgba(0,255,136,0.15)'; }}>
                    {['Idea Stage', 'Pre-Seed', 'Seed', 'Series A', 'Growth', 'Enterprise'].map(s => (
                      <option key={s} value={s} style={{ background: '#031208' }}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', color: `${option.color}99`, fontSize: 11, fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: 7 }}>Team Size</label>
                  <input type="number" value={teamSize} onChange={e => setTeamSize(e.target.value)}
                    placeholder="e.g. 10" style={inputStyle}
                    onFocus={e => { e.target.style.borderColor = option.color + '66'; }}
                    onBlur={e => { e.target.style.borderColor = 'rgba(0,255,136,0.15)'; }} />
                </div>
              </div>

              {error && (
                <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '10px 14px', color: '#fca5a5', fontSize: 13, marginBottom: '1rem', display: 'flex', gap: 8, alignItems: 'center' }}>
                  <AlertTriangle size={14} /> {error}
                </div>
              )}

              <motion.button type="submit" disabled={loading}
                whileHover={{ scale: 1.02, boxShadow: `0 0 30px ${option.color}44` }}
                whileTap={{ scale: 0.98 }}
                style={{ width: '100%', padding: '14px', borderRadius: 12, background: loading ? `${option.color}22` : `linear-gradient(135deg, ${option.color}, ${option.color}bb)`, border: 'none', color: loading ? option.color : '#020c06', fontWeight: 800, fontSize: 14, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                {loading ? (
                  <><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}><RefreshCw size={16} /></motion.div> Generating AI Strategy...</>
                ) : (
                  <><Sparkles size={16} /> Generate {option.title} Strategy</>
                )}
              </motion.button>
            </form>

            {/* Results */}
            <AnimatePresence>
              {result && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                  style={{ marginTop: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {/* Divider */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, transparent, ${option.color}33)` }} />
                    <span style={{ color: option.color, fontSize: 11, fontWeight: 700, letterSpacing: '0.8px' }}>AI RESULTS</span>
                    <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${option.color}33, transparent)` }} />
                  </div>

                  {/* Confidence */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>Confidence</span>
                    <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden' }}>
                      <motion.div initial={{ width: 0 }} animate={{ width: `${result.confidence}%` }} transition={{ duration: 1, ease: 'easeOut' }}
                        style={{ height: '100%', background: `linear-gradient(90deg, ${option.color}, ${option.color}88)`, borderRadius: 3 }} />
                    </div>
                    <span style={{ color: option.color, fontWeight: 700, fontSize: 13 }}>{result.confidence}%</span>
                  </div>

                  {/* Recommendation */}
                  <div style={{ padding: '1.25rem', borderRadius: 14, background: `${option.color}06`, border: `1px solid ${option.color}18`, borderLeft: `3px solid ${option.color}` }}>
                    <div style={{ color: option.color, fontSize: 11, fontWeight: 700, letterSpacing: '0.6px', textTransform: 'uppercase', marginBottom: 8 }}>Strategy Recommendation</div>
                    <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, lineHeight: 1.8, margin: 0 }}>{result.recommendation}</p>
                  </div>

                  {/* Action Plan */}
                  {result.actions?.length > 0 && (
                    <div style={{ padding: '1.25rem', borderRadius: 14, background: 'rgba(0,204,102,0.04)', border: '1px solid rgba(0,204,102,0.15)' }}>
                      <div style={{ color: '#00cc66', fontSize: 11, fontWeight: 700, letterSpacing: '0.6px', textTransform: 'uppercase', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <CheckCircle2 size={12} /> Action Plan
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {result.actions.map((a, i) => (
                          <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                            style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                            <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(0,204,102,0.2)', color: '#00cc66', fontSize: 10, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>{i + 1}</div>
                            <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13, lineHeight: 1.6 }}>{a}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Factors */}
                  {result.factors?.length > 0 && (
                    <div style={{ padding: '1.25rem', borderRadius: 14, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 700, letterSpacing: '0.6px', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Key Factors</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                        {result.factors.map((f, i) => (
                          <div key={i}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>{f.label}</span>
                              <span style={{ color: f.color, fontSize: 12, fontWeight: 700 }}>{f.value}</span>
                            </div>
                            <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden' }}>
                              <motion.div initial={{ width: 0 }} animate={{ width: `${f.value}%` }} transition={{ delay: i * 0.08, duration: 0.7 }}
                                style={{ height: '100%', background: `linear-gradient(90deg, ${f.color}, ${f.color}88)`, borderRadius: 2 }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Alternatives */}
                  {result.alternatives?.length > 0 && (
                    <div style={{ padding: '1.25rem', borderRadius: 14, background: 'rgba(0,255,170,0.03)', border: '1px solid rgba(0,255,170,0.12)' }}>
                      <div style={{ color: '#00ffaa', fontSize: 11, fontWeight: 700, letterSpacing: '0.6px', textTransform: 'uppercase', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Zap size={12} /> Alternative Approaches
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {result.alternatives.map((alt, i) => (
                          <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                            <span style={{ color: '#00ffaa', fontSize: 13, marginTop: 1 }}>◈</span>
                            <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, lineHeight: 1.6 }}>{alt}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── SECTION 2: Strategy Options ─────────────────────────────────────────────
const strategyOptions = [
  {
    icon: Building2, title: 'Start a Business', desc: 'Launch with a validated strategy, market fit analysis, and go-to-market plan.', color: '#00ff88',
    challengePrompt: 'I want to start a new business and need a complete launch strategy including market validation, go-to-market plan, and initial steps',
    whatYouGet: 'Business model validation, target market analysis, go-to-market strategy, initial action plan, and key risks to watch.',
    tags: ['Market Validation', 'Go-to-Market', 'Business Model', 'Launch Plan', 'Funding'],
    industryPlaceholder: 'e.g. EdTech, Food & Beverage, SaaS',
  },
  {
    icon: TrendingUp, title: 'Grow Existing Business', desc: 'Identify growth levers, optimize operations, and expand your customer base.', color: '#00cc66',
    challengePrompt: 'I have an existing business and want to identify the highest-leverage growth opportunities, optimize operations, and expand my customer base',
    whatYouGet: 'Growth lever analysis, customer acquisition strategies, operational improvements, revenue expansion tactics, and competitive positioning.',
    tags: ['Growth Levers', 'Customer Acquisition', 'Operations', 'Revenue Expansion', 'Retention'],
    industryPlaceholder: 'e.g. Retail, Consulting, E-commerce',
  },
  {
    icon: Rocket, title: 'Scale a Startup', desc: 'Accelerate growth with data-driven scaling frameworks and investor-ready plans.', color: '#00ff44',
    challengePrompt: 'I have a startup with early traction and need a data-driven scaling strategy, investor-ready roadmap, and frameworks to accelerate growth',
    whatYouGet: 'Scaling framework, investor pitch strategy, hiring roadmap, product-market fit optimization, and metrics to track.',
    tags: ['Scaling Framework', 'Investor Readiness', 'PMF', 'Hiring', 'Metrics'],
    industryPlaceholder: 'e.g. FinTech, HealthTech, B2B SaaS',
  },
  {
    icon: Globe, title: 'Enter a New Market', desc: 'Analyze market dynamics, competition, and entry barriers before you move.', color: '#00ffaa',
    challengePrompt: 'I want to enter a new market and need a thorough analysis of market dynamics, competitive landscape, entry barriers, and the best entry strategy',
    whatYouGet: 'Market entry analysis, competitive landscape, barrier assessment, localization strategy, and phased entry plan.',
    tags: ['Market Entry', 'Competitive Analysis', 'Localization', 'Risk Assessment', 'Partnerships'],
    industryPlaceholder: 'e.g. Healthcare, Logistics, PropTech',
  },
  {
    icon: DollarSign, title: 'Improve Profitability', desc: 'Cut costs, boost margins, and optimize your revenue streams with AI insights.', color: '#00dd77',
    challengePrompt: 'I need to improve my business profitability by cutting costs, boosting margins, optimizing pricing, and identifying new revenue streams',
    whatYouGet: 'Cost reduction opportunities, margin improvement tactics, pricing strategy, revenue stream diversification, and efficiency gains.',
    tags: ['Cost Reduction', 'Margin Optimization', 'Pricing Strategy', 'Revenue Streams', 'Efficiency'],
    industryPlaceholder: 'e.g. Manufacturing, SaaS, Services',
  },
  {
    icon: Target, title: 'Strategic Pivot', desc: 'Evaluate pivot opportunities and reposition your business for maximum impact.', color: '#00ff66',
    challengePrompt: 'I am considering a strategic pivot and need help evaluating pivot opportunities, understanding the risks, and creating a repositioning plan',
    whatYouGet: 'Pivot opportunity analysis, risk vs. reward assessment, repositioning strategy, transition roadmap, and stakeholder communication plan.',
    tags: ['Pivot Analysis', 'Repositioning', 'Risk Assessment', 'Transition Plan', 'Stakeholders'],
    industryPlaceholder: 'e.g. Media, Tech, Consumer Goods',
  },
];

function StrategyOptionsSection() {
  const [activeOption, setActiveOption] = useState(null);

  return (
    <section style={{ padding: '8rem 2rem', background: 'linear-gradient(180deg, #020c06, #031208)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(circle at 50% 50%, rgba(0,255,136,0.03) 0%, transparent 70%)`, pointerEvents: 'none' }} />
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <Section style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 16px', borderRadius: 100, background: 'rgba(0,255,136,0.08)', border: '1px solid rgba(0,255,136,0.2)', marginBottom: '1rem' }}>
            <Target size={12} color="#00ff88" />
            <span style={{ color: '#00ff88', fontSize: 11, fontWeight: 700, letterSpacing: '1px' }}>STRATEGY OPTIONS</span>
          </div>
          <h2 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 900, color: '#fff', letterSpacing: '-1px', marginBottom: '1rem' }}>
            Choose Your <span style={{ color: '#00ff88' }}>Path</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 16, maxWidth: 500, margin: '0 auto' }}>
            Every business journey is unique. Click any option to get AI-powered ideas tailored to your stage.
          </p>
        </Section>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
          {strategyOptions.map((opt, i) => {
            const Icon = opt.icon;
            return (
              <Section key={i} delay={i * 0.08} direction="up">
                <TiltCard glowColor={opt.color}
                  style={{ height: '100%', borderRadius: 20, background: 'rgba(0,255,136,0.03)', border: '1px solid rgba(0,255,136,0.1)', padding: '2rem', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, right: 0, width: 120, height: 120, borderRadius: '50%', background: `radial-gradient(circle, ${opt.color}11, transparent 70%)`, transform: 'translate(30%, -30%)' }} />
                  <motion.div whileHover={{ scale: 1.1, rotate: 5 }}
                    style={{ width: 52, height: 52, borderRadius: 14, background: `linear-gradient(135deg, ${opt.color}22, ${opt.color}11)`, border: `1px solid ${opt.color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                    <Icon size={24} color={opt.color} />
                  </motion.div>
                  <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 18, marginBottom: '0.6rem' }}>{opt.title}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, lineHeight: 1.7, marginBottom: '1rem' }}>{opt.desc}</p>
                  {/* Tags preview */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.25rem' }}>
                    {opt.tags.slice(0, 3).map((tag, j) => (
                      <span key={j} style={{ padding: '2px 9px', borderRadius: 100, background: `${opt.color}0d`, border: `1px solid ${opt.color}1a`, color: `${opt.color}cc`, fontSize: 10, fontWeight: 600 }}>{tag}</span>
                    ))}
                  </div>
                  <motion.button
                    onClick={() => setActiveOption(opt)}
                    whileHover={{ x: 4 }}
                    style={{ background: 'none', border: 'none', color: opt.color, fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, padding: 0 }}>
                    Get AI Ideas <ArrowRight size={14} />
                  </motion.button>
                </TiltCard>
              </Section>
            );
          })}
        </div>
      </div>

      {/* Strategy Modal */}
      {activeOption && (
        <StrategyModal option={activeOption} onClose={() => setActiveOption(null)} />
      )}
    </section>
  );
}

// ─── SECTION 3: AI Strategy Generator ────────────────────────────────────────
function AIGeneratorSection({ sectionRef, onResult }) {
  const [form, setForm] = useState({ industry: '', companyStage: 'Seed', businessChallenge: '', teamSize: '' });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const inputStyle = {
    width: '100%', padding: '14px 16px', borderRadius: 12,
    background: 'rgba(0,255,136,0.04)', border: '1px solid rgba(0,255,136,0.15)',
    color: '#fff', fontSize: 14, outline: 'none', fontFamily: 'inherit',
    transition: 'border-color 0.2s, box-shadow 0.2s', boxSizing: 'border-box',
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(null); setResult(null);
    try {
      const data = await analyzeWithAI('business', form);
      setResult(data);
      if (onResult) onResult(data);
    } catch (err) {
      setError(err.message || 'Analysis failed. Make sure the backend is running.');
    } finally { setLoading(false); }
  };

  return (
    <section ref={sectionRef} id="generator" style={{ padding: '8rem 2rem', background: 'linear-gradient(180deg, #031208, #020c06)', position: 'relative', overflow: 'hidden' }}>
      <FloatingOrbs />
      <div style={{ maxWidth: 900, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <Section style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 16px', borderRadius: 100, background: 'rgba(0,255,136,0.08)', border: '1px solid rgba(0,255,136,0.2)', marginBottom: '1rem' }}>
            <Brain size={12} color="#00ff88" />
            <span style={{ color: '#00ff88', fontSize: 11, fontWeight: 700, letterSpacing: '1px' }}>AI GENERATOR</span>
          </div>
          <h2 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 900, color: '#fff', letterSpacing: '-1px', marginBottom: '1rem' }}>
            Generate Your <span style={{ color: '#00ff88' }}>Strategy</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 16 }}>Powered by Llama 3.3 70B + HBR Strategic Frameworks</p>
        </Section>

        <Section delay={0.1}>
          <TiltCard glowColor="#00ff88" style={{ borderRadius: 24, background: 'rgba(0,255,136,0.03)', border: '1px solid rgba(0,255,136,0.15)', padding: '2.5rem', backdropFilter: 'blur(20px)' }}>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
                {[
                  { key: 'industry', label: 'Industry', type: 'text', placeholder: 'e.g. SaaS, E-commerce, HealthTech' },
                  { key: 'teamSize', label: 'Team Size', type: 'number', placeholder: 'e.g. 12' },
                ].map(f => (
                  <div key={f.key}>
                    <label style={{ display: 'block', color: 'rgba(0,255,136,0.7)', fontSize: 11, fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: 8 }}>{f.label}</label>
                    <input type={f.type} value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                      placeholder={f.placeholder} style={inputStyle} required={f.key === 'industry'}
                      onFocus={e => { e.target.style.borderColor = 'rgba(0,255,136,0.5)'; e.target.style.boxShadow = '0 0 20px rgba(0,255,136,0.1)'; }}
                      onBlur={e => { e.target.style.borderColor = 'rgba(0,255,136,0.15)'; e.target.style.boxShadow = 'none'; }} />
                  </div>
                ))}
                <div>
                  <label style={{ display: 'block', color: 'rgba(0,255,136,0.7)', fontSize: 11, fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: 8 }}>Company Stage</label>
                  <select value={form.companyStage} onChange={e => setForm(p => ({ ...p, companyStage: e.target.value }))}
                    style={{ ...inputStyle, cursor: 'pointer' }}
                    onFocus={e => { e.target.style.borderColor = 'rgba(0,255,136,0.5)'; }}
                    onBlur={e => { e.target.style.borderColor = 'rgba(0,255,136,0.15)'; }}>
                    {['Idea Stage', 'Pre-Seed', 'Seed', 'Series A', 'Growth', 'Enterprise'].map(s => (
                      <option key={s} value={s} style={{ background: '#031208' }}>{s}</option>
                    ))}
                  </select>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', color: 'rgba(0,255,136,0.7)', fontSize: 11, fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: 8 }}>Business Challenge</label>
                  <textarea value={form.businessChallenge} onChange={e => setForm(p => ({ ...p, businessChallenge: e.target.value }))}
                    placeholder="Describe your main challenge or strategic question in detail..." rows={4} required
                    style={{ ...inputStyle, resize: 'vertical' }}
                    onFocus={e => { e.target.style.borderColor = 'rgba(0,255,136,0.5)'; e.target.style.boxShadow = '0 0 20px rgba(0,255,136,0.1)'; }}
                    onBlur={e => { e.target.style.borderColor = 'rgba(0,255,136,0.15)'; e.target.style.boxShadow = 'none'; }} />
                </div>
              </div>

              {error && (
                <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '12px 16px', color: '#fca5a5', fontSize: 13, marginBottom: '1.25rem', display: 'flex', gap: 8, alignItems: 'center' }}>
                  <AlertTriangle size={14} /> {error}
                </div>
              )}

              <motion.button type="submit" disabled={loading}
                whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(0,255,136,0.4)' }}
                whileTap={{ scale: 0.98 }}
                style={{ width: '100%', padding: '16px', borderRadius: 14, background: loading ? 'rgba(0,255,136,0.2)' : 'linear-gradient(135deg, #00ff88, #00cc66)', border: 'none', color: loading ? '#00ff88' : '#020c06', fontWeight: 800, fontSize: 16, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                {loading ? (
                  <>
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                      <RefreshCw size={18} />
                    </motion.div>
                    Analyzing with AI...
                  </>
                ) : (
                  <><Sparkles size={18} /> Generate Strategy</>
                )}
              </motion.button>
            </form>
          </TiltCard>
        </Section>

        {/* Results */}
        <AnimatePresence>
          {result && (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}
              style={{ marginTop: '2rem', display: 'grid', gap: '1.25rem' }}>
              {/* Strategy */}
              <TiltCard glowColor="#00ff88" style={{ borderRadius: 20, background: 'rgba(0,255,136,0.04)', border: '1px solid rgba(0,255,136,0.2)', padding: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1rem' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(0,255,136,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Lightbulb size={18} color="#00ff88" />
                  </div>
                  <h3 style={{ color: '#00ff88', fontWeight: 700, fontSize: 14, letterSpacing: '0.5px', textTransform: 'uppercase' }}>AI Strategy</h3>
                  <div style={{ marginLeft: 'auto', padding: '3px 12px', borderRadius: 100, background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.2)', color: '#00ff88', fontSize: 12, fontWeight: 700 }}>
                    {result.confidence}% Confidence
                  </div>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 15, lineHeight: 1.8, borderLeft: '3px solid #00ff88', paddingLeft: '1rem' }}>{result.recommendation}</p>
              </TiltCard>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
                {/* Action Plan */}
                <TiltCard glowColor="#00cc66" style={{ borderRadius: 20, background: 'rgba(0,204,102,0.04)', border: '1px solid rgba(0,204,102,0.2)', padding: '1.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.25rem' }}>
                    <CheckCircle2 size={16} color="#00cc66" />
                    <h3 style={{ color: '#00cc66', fontWeight: 700, fontSize: 13, letterSpacing: '0.5px', textTransform: 'uppercase' }}>Action Plan</h3>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {result.actions?.map((a, i) => (
                      <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                        style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '8px 12px', borderRadius: 8, background: 'rgba(0,204,102,0.05)' }}>
                        <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(0,204,102,0.2)', color: '#00cc66', fontSize: 10, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>{i + 1}</div>
                        <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, lineHeight: 1.6 }}>{a}</span>
                      </motion.div>
                    ))}
                  </div>
                </TiltCard>

                {/* Risks */}
                <TiltCard glowColor="#ff6644" style={{ borderRadius: 20, background: 'rgba(255,100,68,0.04)', border: '1px solid rgba(255,100,68,0.2)', padding: '1.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.25rem' }}>
                    <Shield size={16} color="#ff6644" />
                    <h3 style={{ color: '#ff6644', fontWeight: 700, fontSize: 13, letterSpacing: '0.5px', textTransform: 'uppercase' }}>Risk Factors</h3>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {result.factors?.map((f, i) => (
                      <div key={i} style={{ padding: '8px 12px', borderRadius: 8, background: 'rgba(255,100,68,0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>{f.label}</span>
                          <span style={{ color: f.color, fontSize: 12, fontWeight: 700 }}>{f.value}</span>
                        </div>
                        <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden' }}>
                          <motion.div initial={{ width: 0 }} animate={{ width: `${f.value}%` }} transition={{ delay: i * 0.1, duration: 0.8 }}
                            style={{ height: '100%', background: `linear-gradient(90deg, ${f.color}, ${f.color}88)`, borderRadius: 2 }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </TiltCard>
              </div>

              {/* Alternatives */}
              {result.alternatives?.length > 0 && (
                <TiltCard glowColor="#00ffaa" style={{ borderRadius: 20, background: 'rgba(0,255,170,0.03)', border: '1px solid rgba(0,255,170,0.15)', padding: '1.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.25rem' }}>
                    <Zap size={16} color="#00ffaa" />
                    <h3 style={{ color: '#00ffaa', fontWeight: 700, fontSize: 13, letterSpacing: '0.5px', textTransform: 'uppercase' }}>Alternative Strategies</h3>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.75rem' }}>
                    {result.alternatives.map((alt, i) => (
                      <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
                        style={{ padding: '12px 14px', borderRadius: 10, background: 'rgba(0,255,170,0.05)', border: '1px solid rgba(0,255,170,0.12)', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                        <span style={{ color: '#00ffaa', fontSize: 14, marginTop: 1 }}>◈</span>
                        <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13, lineHeight: 1.6 }}>{alt}</span>
                      </motion.div>
                    ))}
                  </div>
                </TiltCard>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

// ─── SECTION 4: Visual Insights ──────────────────────────────────────────────

// Fallback static data shown before any AI result is available
const FALLBACK_GROWTH = [
  { month: 'Jan', revenue: 40, users: 24 }, { month: 'Feb', revenue: 55, users: 38 },
  { month: 'Mar', revenue: 48, users: 42 }, { month: 'Apr', revenue: 72, users: 58 },
  { month: 'May', revenue: 85, users: 71 }, { month: 'Jun', revenue: 94, users: 83 },
  { month: 'Jul', revenue: 110, users: 96 }, { month: 'Aug', revenue: 128, users: 112 },
];
const FALLBACK_FACTORS = [
  { label: 'Market Opportunity', value: 72, color: '#00ff88' },
  { label: 'Competitive Advantage', value: 58, color: '#00cc66' },
  { label: 'Execution Feasibility', value: 65, color: '#00ff44' },
  { label: 'Resource Alignment', value: 50, color: '#00ffaa' },
  { label: 'Risk Level', value: 45, color: '#f59e0b' },
];
const FALLBACK_RADAR = [
  { subject: 'Market', A: 72 }, { subject: 'Advantage', A: 58 },
  { subject: 'Execution', A: 65 }, { subject: 'Resources', A: 50 }, { subject: 'Risk Mgmt', A: 55 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'rgba(2,12,6,0.95)', border: '1px solid rgba(0,255,136,0.2)', borderRadius: 10, padding: '10px 14px' }}>
      <p style={{ color: '#00ff88', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, margin: 0 }}>
          {p.name}: <span style={{ color: p.color, fontWeight: 700 }}>{p.value}</span>
        </p>
      ))}
    </div>
  );
};

// Derive a growth-trajectory curve from AI factors:
// each factor value seeds a cumulative growth line across 8 months
function buildGrowthData(factors) {
  if (!factors?.length) return FALLBACK_GROWTH;
  const base = factors.reduce((s, f) => s + f.value, 0) / factors.length;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
  return months.map((month, i) => ({
    month,
    revenue: Math.round(base * (0.5 + i * 0.1) + (factors[i % factors.length]?.value ?? 50) * 0.3),
    users: Math.round(base * (0.3 + i * 0.08) + (factors[(i + 1) % factors.length]?.value ?? 40) * 0.2),
  }));
}

// Derive market-analysis bars from AI alternatives (one bar per alternative)
function buildMarketData(alternatives, factors) {
  const colors = ['#00ff88', '#00cc66', '#00ff44', '#00ffaa', '#00dd77', '#00bb55'];
  if (alternatives?.length) {
    return alternatives.map((alt, i) => ({
      name: alt.split(' ').slice(0, 2).join(' '),
      value: Math.min(95, 55 + (factors?.[i % (factors?.length || 1)]?.value ?? 60) * 0.4),
      color: colors[i % colors.length],
    }));
  }
  return FALLBACK_FACTORS.map((f, i) => ({ name: f.label.split(' ')[0], value: f.value, color: colors[i] }));
}

// Derive radar from AI radarData or fall back to factors
function buildRadarData(radarData, factors) {
  if (radarData?.length >= 3) {
    return radarData.map(d => ({ subject: d.label, A: d.value }));
  }
  if (factors?.length) {
    return factors.map(f => ({ subject: f.label.split(' ')[0], A: f.value }));
  }
  return FALLBACK_RADAR;
}

function VisualInsightsSection({ aiResult }) {
  const factors  = aiResult?.factors  ?? FALLBACK_FACTORS;
  const growthData  = buildGrowthData(factors);
  const marketData  = buildMarketData(aiResult?.alternatives, factors);
  const radarChartData = buildRadarData(aiResult?.radarData, factors);
  const hasResult = !!aiResult;

  // Confidence-based growth badge
  const conf = aiResult?.confidence ?? null;
  const growthBadge = conf ? `${conf}% Confidence` : '+28% MoM';

  return (
    <section style={{ padding: '8rem 2rem', background: 'linear-gradient(180deg, #020c06, #031208)', position: 'relative' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <Section style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 16px', borderRadius: 100, background: 'rgba(0,255,136,0.08)', border: '1px solid rgba(0,255,136,0.2)', marginBottom: '1rem' }}>
            <BarChart2 size={12} color="#00ff88" />
            <span style={{ color: '#00ff88', fontSize: 11, fontWeight: 700, letterSpacing: '1px' }}>VISUAL INSIGHTS</span>
          </div>
          <h2 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 900, color: '#fff', letterSpacing: '-1px', marginBottom: '1rem' }}>
            Data-Driven <span style={{ color: '#00ff88' }}>Intelligence</span>
          </h2>
          {hasResult && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 14px', borderRadius: 100, background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.25)', color: '#00ff88', fontSize: 12, fontWeight: 600 }}>
              <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
                <Sparkles size={12} color="#00ff88" />
              </motion.div>
              Charts updated with your AI analysis results
            </motion.div>
          )}
        </Section>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.5rem' }}>

          {/* Growth Trajectory — driven by AI factor averages */}
          <Section delay={0.1}>
            <TiltCard glowColor="#00ff88" style={{ borderRadius: 20, background: 'rgba(0,255,136,0.03)', border: '1px solid rgba(0,255,136,0.12)', padding: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.5rem' }}>
                <TrendingUp size={16} color="#00ff88" />
                <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>
                  {hasResult ? 'Projected Growth Trajectory' : 'Growth Trajectory'}
                </h3>
                <div style={{ marginLeft: 'auto', padding: '3px 10px', borderRadius: 100, background: 'rgba(0,255,136,0.1)', color: '#00ff88', fontSize: 11, fontWeight: 700 }}>
                  {growthBadge}
                </div>
              </div>
              {hasResult && (
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, marginBottom: '0.75rem' }}>
                  Based on your AI factor scores — Revenue & User growth projections
                </p>
              )}
              <div style={{ height: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={growthData}>
                    <defs>
                      <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#00ff88" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#00ff88" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#00cc66" stopOpacity={0.2} />
                        <stop offset="100%" stopColor="#00cc66" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }} stroke="transparent" />
                    <YAxis tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }} stroke="transparent" />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#00ff88" strokeWidth={2} fill="url(#revGrad)" />
                    <Area type="monotone" dataKey="users" name="Users" stroke="#00cc66" strokeWidth={2} fill="url(#userGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </TiltCard>
          </Section>

          {/* Market / Alternatives Analysis — driven by AI alternatives */}
          <Section delay={0.15}>
            <TiltCard glowColor="#00cc66" style={{ borderRadius: 20, background: 'rgba(0,204,102,0.03)', border: '1px solid rgba(0,204,102,0.12)', padding: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.5rem' }}>
                <Globe size={16} color="#00cc66" />
                <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>
                  {hasResult ? 'Strategy Alternatives Score' : 'Market Analysis'}
                </h3>
              </div>
              {hasResult && (
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, marginBottom: '0.75rem' }}>
                  Viability score for each AI-suggested alternative strategy
                </p>
              )}
              <div style={{ height: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={marketData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 10 }} stroke="transparent" />
                    <YAxis tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 10 }} stroke="transparent" />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" name="Score" radius={[6, 6, 0, 0]}>
                      {marketData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TiltCard>
          </Section>

          {/* Radar — driven by AI radarData */}
          <Section delay={0.2}>
            <TiltCard glowColor="#00ff44" style={{ borderRadius: 20, background: 'rgba(0,255,68,0.03)', border: '1px solid rgba(0,255,68,0.12)', padding: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.5rem' }}>
                <Target size={16} color="#00ff44" />
                <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>
                  {hasResult ? 'Strategic Health Radar' : 'Business Health Radar'}
                </h3>
              </div>
              {hasResult && (
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, marginBottom: '0.75rem' }}>
                  Multi-dimensional view from your AI analysis
                </p>
              )}
              <div style={{ height: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarChartData}>
                    <PolarGrid stroke="rgba(0,255,136,0.1)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 9 }} />
                    <Radar name="Score" dataKey="A" stroke="#00ff88" fill="#00ff88" fillOpacity={0.15} strokeWidth={2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </TiltCard>
          </Section>

          {/* Risk Meter — driven by AI factors */}
          <Section delay={0.25}>
            <TiltCard glowColor="#00ffaa" style={{ borderRadius: 20, background: 'rgba(0,255,170,0.03)', border: '1px solid rgba(0,255,170,0.12)', padding: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.5rem' }}>
                <Shield size={16} color="#00ffaa" />
                <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>
                  {hasResult ? 'AI Factor Assessment' : 'Risk Assessment Meter'}
                </h3>
              </div>
              {hasResult && (
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, marginBottom: '0.75rem' }}>
                  Scores from your AI strategy analysis
                </p>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {factors.map((f, i) => {
                  // colour-code by value: high = green, mid = amber, low = red
                  const barColor = f.color ?? (f.value >= 70 ? '#00ff88' : f.value >= 45 ? '#f59e0b' : '#ef4444');
                  return (
                    <div key={i}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                        <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>{f.label}</span>
                        <span style={{ color: barColor, fontSize: 12, fontWeight: 700 }}>{f.value}%</span>
                      </div>
                      <div style={{ height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden' }}>
                        <motion.div
                          key={`${f.label}-${f.value}`}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${f.value}%` }}
                          viewport={{ once: false }}
                          transition={{ delay: i * 0.08, duration: 0.9 }}
                          style={{ height: '100%', background: `linear-gradient(90deg, ${barColor}, ${barColor}88)`, borderRadius: 3 }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </TiltCard>
          </Section>

        </div>
      </div>
    </section>
  );
}

// ─── SECTION 5: Business Models ───────────────────────────────────────────────
const businessModels = [
  { icon: Building2, title: 'B2B', desc: 'Business-to-business solutions with enterprise contracts and long-term relationships.', tag: 'Enterprise', color: '#00ff88' },
  { icon: ShoppingCart, title: 'B2C', desc: 'Direct consumer products with high volume, brand loyalty, and viral growth loops.', tag: 'Consumer', color: '#00cc66' },
  { icon: RefreshCw, title: 'Subscription', desc: 'Recurring revenue model with predictable MRR and high customer lifetime value.', tag: 'Recurring', color: '#00ff44' },
  { icon: Store, title: 'Marketplace', desc: 'Two-sided platform connecting buyers and sellers with network effect advantages.', tag: 'Platform', color: '#00ffaa' },
  { icon: Code2, title: 'SaaS', desc: 'Software-as-a-service with scalable infrastructure and low marginal cost per user.', tag: 'Software', color: '#00dd77' },
  { icon: Globe, title: 'Freemium', desc: 'Free tier drives adoption, premium features convert power users to paying customers.', tag: 'Growth', color: '#00bb55' },
];

function BusinessModelsSection() {
  const scrollRef = useRef(null);
  const scroll = (dir) => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: dir * 360, behavior: 'smooth' });
  };
  return (
    <section style={{ padding: '8rem 0', background: 'linear-gradient(180deg, #031208, #020c06)', overflow: 'hidden' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem' }}>
        <Section style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 16px', borderRadius: 100, background: 'rgba(0,255,136,0.08)', border: '1px solid rgba(0,255,136,0.2)', marginBottom: '1rem' }}>
            <Store size={12} color="#00ff88" />
            <span style={{ color: '#00ff88', fontSize: 11, fontWeight: 700, letterSpacing: '1px' }}>BUSINESS MODELS</span>
          </div>
          <h2 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 900, color: '#fff', letterSpacing: '-1px', marginBottom: '1rem' }}>
            Choose Your <span style={{ color: '#00ff88' }}>Model</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 16 }}>Each model has unique advantages — pick the one that fits your vision.</p>
        </Section>
      </div>

      <div ref={scrollRef} style={{ display: 'flex', gap: '1.25rem', overflowX: 'auto', padding: '1rem 2rem 2rem', scrollbarWidth: 'none', msOverflowStyle: 'none', cursor: 'grab' }}>
        {businessModels.map((m, i) => {
          const Icon = m.icon;
          return (
            <motion.div key={i} initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
              <TiltCard glowColor={m.color} style={{ minWidth: 280, borderRadius: 20, background: 'rgba(0,255,136,0.03)', border: '1px solid rgba(0,255,136,0.1)', padding: '2rem', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, right: 0, width: 100, height: 100, borderRadius: '50%', background: `radial-gradient(circle, ${m.color}15, transparent 70%)`, transform: 'translate(30%, -30%)' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: `${m.color}15`, border: `1px solid ${m.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={22} color={m.color} />
                  </div>
                  <span style={{ padding: '3px 10px', borderRadius: 100, background: `${m.color}15`, border: `1px solid ${m.color}25`, color: m.color, fontSize: 10, fontWeight: 700 }}>{m.tag}</span>
                </div>
                <h3 style={{ color: '#fff', fontWeight: 800, fontSize: 20, marginBottom: '0.6rem' }}>{m.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, lineHeight: 1.7 }}>{m.desc}</p>
              </TiltCard>
            </motion.div>
          );
        })}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
        {[-1, 1].map((dir, i) => (
          <motion.button key={i} onClick={() => scroll(dir)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
            style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(0,255,136,0.08)', border: '1px solid rgba(0,255,136,0.2)', color: '#00ff88', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {dir === -1 ? '←' : '→'}
          </motion.button>
        ))}
      </div>
    </section>
  );
}

// ─── SECTION 6: Timeline / Roadmap ───────────────────────────────────────────
const roadmapSteps = [
  { phase: 'Phase 1', title: 'Discovery & Validation', duration: 'Week 1–2', desc: 'Market research, customer interviews, and problem validation. Define your ICP and value proposition.', icon: Lightbulb, color: '#00ff88' },
  { phase: 'Phase 2', title: 'Strategy Formation', duration: 'Week 3–4', desc: 'Apply Porter\'s Five Forces and SWOT analysis. Define competitive positioning and go-to-market approach.', icon: Brain, color: '#00cc66' },
  { phase: 'Phase 3', title: 'MVP & Pilot Launch', duration: 'Week 5–7', desc: 'Build minimum viable product, launch to early adopters, and collect feedback loops.', icon: Rocket, color: '#00ff44' },
  { phase: 'Phase 4', title: 'Optimize & Iterate', duration: 'Week 8–10', desc: 'Analyze metrics, refine product-market fit, and optimize conversion funnels.', icon: RefreshCw, color: '#00ffaa' },
  { phase: 'Phase 5', title: 'Scale & Expand', duration: 'Week 11+', desc: 'Accelerate growth channels, expand to new markets, and build scalable operations.', icon: TrendingUp, color: '#00dd77' },
];

function TimelineSection() {
  return (
    <section style={{ padding: '8rem 2rem', background: 'linear-gradient(180deg, #020c06, #031208)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: 'linear-gradient(180deg, transparent, rgba(0,255,136,0.2), transparent)', transform: 'translateX(-50%)', pointerEvents: 'none' }} />
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <Section style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 16px', borderRadius: 100, background: 'rgba(0,255,136,0.08)', border: '1px solid rgba(0,255,136,0.2)', marginBottom: '1rem' }}>
            <Clock size={12} color="#00ff88" />
            <span style={{ color: '#00ff88', fontSize: 11, fontWeight: 700, letterSpacing: '1px' }}>EXECUTION ROADMAP</span>
          </div>
          <h2 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 900, color: '#fff', letterSpacing: '-1px', marginBottom: '1rem' }}>
            Your Strategy <span style={{ color: '#00ff88' }}>Timeline</span>
          </h2>
        </Section>

        <div style={{ position: 'relative' }}>
          {roadmapSteps.map((step, i) => {
            const Icon = step.icon;
            const isLeft = i % 2 === 0;
            return (
              <Section key={i} delay={i * 0.12} direction={isLeft ? 'right' : 'left'}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2.5rem', flexDirection: isLeft ? 'row' : 'row-reverse' }}>
                  <TiltCard glowColor={step.color} style={{ flex: 1, borderRadius: 18, background: 'rgba(0,255,136,0.03)', border: `1px solid ${step.color}22`, padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.75rem' }}>
                      <span style={{ padding: '2px 10px', borderRadius: 100, background: `${step.color}15`, color: step.color, fontSize: 10, fontWeight: 700 }}>{step.phase}</span>
                      <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>{step.duration}</span>
                    </div>
                    <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 16, marginBottom: '0.5rem' }}>{step.title}</h3>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, lineHeight: 1.7 }}>{step.desc}</p>
                  </TiltCard>

                  <motion.div whileInView={{ scale: [0, 1.2, 1] }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.12 }}
                    style={{ width: 52, height: 52, borderRadius: '50%', background: `linear-gradient(135deg, ${step.color}33, ${step.color}11)`, border: `2px solid ${step.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, position: 'relative', zIndex: 1 }}>
                    <Icon size={20} color={step.color} />
                  </motion.div>

                  <div style={{ flex: 1 }} />
                </div>
              </Section>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── SECTION 7: Features ──────────────────────────────────────────────────────
const features = [
  { icon: Brain, title: 'AI-Powered Insights', desc: 'Llama 3.3 70B analyzes your business context using proven frameworks like Porter\'s Five Forces and SWOT.', color: '#00ff88' },
  { icon: Zap, title: 'Instant Analysis', desc: 'Get comprehensive strategic recommendations in under 3 seconds — no waiting, no delays.', color: '#00cc66' },
  { icon: BarChart2, title: 'Data-Driven Decisions', desc: 'Every recommendation is backed by quantified factors, confidence scores, and risk assessments.', color: '#00ff44' },
  { icon: TrendingUp, title: 'Scalable Strategies', desc: 'Strategies that grow with you — from idea stage to enterprise, the AI adapts to your context.', color: '#00ffaa' },
  { icon: Shield, title: 'Risk Intelligence', desc: 'Proactive risk identification with mitigation strategies before you commit resources.', color: '#00dd77' },
  { icon: Users, title: 'Team Alignment', desc: 'Generate actionable plans your entire team can execute with clear ownership and timelines.', color: '#00bb55' },
];

function FeaturesSection() {
  return (
    <section style={{ padding: '8rem 2rem', background: 'linear-gradient(180deg, #031208, #020c06)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(circle at 30% 50%, rgba(0,255,136,0.04) 0%, transparent 60%), radial-gradient(circle at 70% 50%, rgba(0,204,102,0.03) 0%, transparent 60%)`, pointerEvents: 'none' }} />
      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <Section style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 16px', borderRadius: 100, background: 'rgba(0,255,136,0.08)', border: '1px solid rgba(0,255,136,0.2)', marginBottom: '1rem' }}>
            <Award size={12} color="#00ff88" />
            <span style={{ color: '#00ff88', fontSize: 11, fontWeight: 700, letterSpacing: '1px' }}>FEATURES</span>
          </div>
          <h2 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 900, color: '#fff', letterSpacing: '-1px', marginBottom: '1rem' }}>
            Why Choose <span style={{ color: '#00ff88' }}>Our AI</span>
          </h2>
        </Section>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <Section key={i} delay={i * 0.07} direction="up">
                <TiltCard glowColor={f.color} style={{ borderRadius: 20, background: 'rgba(0,255,136,0.02)', border: '1px solid rgba(0,255,136,0.08)', padding: '2rem', height: '100%', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', bottom: 0, right: 0, width: 80, height: 80, borderRadius: '50%', background: `radial-gradient(circle, ${f.color}10, transparent 70%)`, transform: 'translate(20%, 20%)' }} />
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <motion.div whileHover={{ rotate: 10, scale: 1.1 }}
                      style={{ width: 48, height: 48, borderRadius: 14, background: `${f.color}12`, border: `1px solid ${f.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={22} color={f.color} />
                    </motion.div>
                    <div>
                      <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 16, marginBottom: '0.5rem' }}>{f.title}</h3>
                      <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, lineHeight: 1.7 }}>{f.desc}</p>
                    </div>
                  </div>
                </TiltCard>
              </Section>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── SECTION 8: Testimonials ──────────────────────────────────────────────────
const testimonials = [
  { name: 'Sarah Chen', role: 'CEO, TechFlow SaaS', text: 'The AI strategy generator helped us pivot from B2C to B2B in 2 weeks. Revenue grew 3x in the following quarter.', rating: 5, result: '+300% Revenue' },
  { name: 'Marcus Webb', role: 'Founder, GreenScale', text: 'We used the market entry analysis before expanding to Southeast Asia. The risk assessment was spot-on and saved us from a costly mistake.', rating: 5, result: '4 New Markets' },
  { name: 'Priya Nair', role: 'COO, HealthBridge', text: 'The action plan generated was more detailed than what our $50K consulting firm produced. Implemented it in 6 weeks.', rating: 5, result: '6-Week Execution' },
  { name: 'David Kim', role: 'Startup Advisor', text: 'I recommend this to every founder I mentor. The Porter\'s Five Forces analysis alone is worth it — instant, accurate, actionable.', rating: 5, result: '50+ Startups Advised' },
];

function TestimonialsSection() {
  return (
    <section style={{ padding: '8rem 2rem', background: 'linear-gradient(180deg, #020c06, #031208)', position: 'relative', overflow: 'hidden' }}>
      <FloatingOrbs />
      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <Section style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 16px', borderRadius: 100, background: 'rgba(0,255,136,0.08)', border: '1px solid rgba(0,255,136,0.2)', marginBottom: '1rem' }}>
            <Star size={12} color="#00ff88" />
            <span style={{ color: '#00ff88', fontSize: 11, fontWeight: 700, letterSpacing: '1px' }}>SUCCESS STORIES</span>
          </div>
          <h2 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 900, color: '#fff', letterSpacing: '-1px', marginBottom: '1rem' }}>
            Trusted by <span style={{ color: '#00ff88' }}>Builders</span>
          </h2>
        </Section>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {testimonials.map((t, i) => (
            <Section key={i} delay={i * 0.1} direction="up">
              <TiltCard glowColor="#00ff88" style={{ borderRadius: 20, background: 'rgba(0,255,136,0.03)', border: '1px solid rgba(0,255,136,0.1)', padding: '2rem', height: '100%', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', gap: 3 }}>
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={14} color="#00ff88" fill="#00ff88" />
                  ))}
                </div>
                <Quote size={20} color="rgba(0,255,136,0.3)" />
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, lineHeight: 1.8, flex: 1 }}>{t.text}</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid rgba(0,255,136,0.08)' }}>
                  <div>
                    <div style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>{t.name}</div>
                    <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12 }}>{t.role}</div>
                  </div>
                  <div style={{ padding: '4px 12px', borderRadius: 100, background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.2)', color: '#00ff88', fontSize: 11, fontWeight: 700 }}>{t.result}</div>
                </div>
              </TiltCard>
            </Section>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── SECTION 9: Footer ────────────────────────────────────────────────────────
function FooterSection({ onCTAClick }) {
  return (
    <footer style={{ background: '#020c06', borderTop: '1px solid rgba(0,255,136,0.08)', padding: '5rem 2rem 2rem' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* CTA Banner */}
        <Section>
          <div style={{ textAlign: 'center', padding: '4rem 2rem', borderRadius: 24, background: 'linear-gradient(135deg, rgba(0,255,136,0.06), rgba(0,204,102,0.03))', border: '1px solid rgba(0,255,136,0.12)', marginBottom: '4rem', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(circle at 50% 50%, rgba(0,255,136,0.06) 0%, transparent 70%)`, pointerEvents: 'none' }} />
            <h2 style={{ fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 900, color: '#fff', letterSpacing: '-1px', marginBottom: '1rem' }}>
              Ready to Build Your <span style={{ color: '#00ff88' }}>Strategy?</span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 16, marginBottom: '2rem' }}>Join thousands of founders making smarter decisions with AI.</p>
            <motion.button onClick={onCTAClick}
              whileHover={{ scale: 1.05, boxShadow: '0 0 50px rgba(0,255,136,0.4)' }}
              whileTap={{ scale: 0.97 }}
              style={{ padding: '16px 40px', borderRadius: 14, background: 'linear-gradient(135deg, #00ff88, #00cc66)', border: 'none', color: '#020c06', fontWeight: 800, fontSize: 16, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <Sparkles size={18} /> Start Your Strategy Now
            </motion.button>
          </div>
        </Section>

        {/* Footer Links */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1rem' }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #00ff88, #00cc66)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Brain size={16} color="#020c06" />
              </div>
              <span style={{ color: '#fff', fontWeight: 800, fontSize: 15 }}>DecisionHub</span>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, lineHeight: 1.7 }}>AI-powered decisions for modern businesses.</p>
          </div>
          {[
            { title: 'Product', links: ['Strategy Generator', 'Market Analysis', 'Risk Assessment', 'Roadmap Builder'] },
            { title: 'Solutions', links: ['Startups', 'Enterprise', 'Consultants', 'Investors'] },
            { title: 'Company', links: ['About', 'Blog', 'Careers', 'Contact'] },
          ].map((col, i) => (
            <div key={i}>
              <h4 style={{ color: '#fff', fontWeight: 700, fontSize: 13, marginBottom: '1rem', letterSpacing: '0.5px' }}>{col.title}</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {col.links.map((link, j) => (
                  <motion.a key={j} href="#" whileHover={{ color: '#00ff88', x: 3 }}
                    style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, textDecoration: 'none', transition: 'color 0.2s' }}>
                    {link}
                  </motion.a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ borderTop: '1px solid rgba(0,255,136,0.06)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12 }}>© 2026 DecisionHub AI. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {['Privacy', 'Terms', 'Cookies'].map((l, i) => (
              <motion.a key={i} href="#" whileHover={{ color: '#00ff88' }}
                style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12, textDecoration: 'none', transition: 'color 0.2s' }}>
                {l}
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── ROOT PAGE ────────────────────────────────────────────────────────────────
export default function BusinessStrategyPage() {
  const generatorRef = useRef(null);
  const [demoOpen, setDemoOpen] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  const scrollToGenerator = useCallback(() => {
    setDemoOpen(false);
    setTimeout(() => {
      generatorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }, []);

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", background: '#020c06', minHeight: '100vh', paddingTop: 64 }}>
      <VideoModal open={demoOpen} onClose={() => setDemoOpen(false)} />
      <HeroSection onCTAClick={scrollToGenerator} onDemoClick={() => setDemoOpen(true)} />
      <StrategyOptionsSection />
      <AIGeneratorSection sectionRef={generatorRef} onResult={setAiResult} />
      <VisualInsightsSection aiResult={aiResult} />
      <BusinessModelsSection />
      <TimelineSection />
      <FeaturesSection />
      <TestimonialsSection />
      <FooterSection onCTAClick={scrollToGenerator} />
    </div>
  );
}
