import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const domains = [
  {
    id: 'healthcare',
    path: '/healthcare',
    icon: '🏥',
    title: 'Healthcare AI',
    subtitle: 'Health Engine',
    desc: 'Analyze symptoms, assess urgency, and get AI-powered medical guidance.',
    tags: ['Health', 'Diagnostics'],
    color: '#10b981',
    glow: 'rgba(16,185,129,0.15)',
  },
  {
    id: 'career',
    path: '/career',
    icon: '🚀',
    title: 'Career Advisor',
    subtitle: 'Career Engine',
    desc: 'Map your career path, identify skill gaps, and plan your next move.',
    tags: ['Growth', 'Skills'],
    color: '#f59e0b',
    glow: 'rgba(245,158,11,0.15)',
  },
  {
    id: 'resume',
    path: '/resume',
    icon: '📄',
    title: 'Resume Analyzer',
    subtitle: 'HR Engine',
    desc: 'Score your resume for ATS, find weaknesses, and get improvement tips.',
    tags: ['ATS', 'Hiring'],
    color: '#06b6d4',
    glow: 'rgba(6,182,212,0.15)',
  },
  {
    id: 'finance',
    path: '/finance',
    icon: '💰',
    title: 'Finance Planner',
    subtitle: 'Finance Engine',
    desc: 'Build personalized investment strategies and financial roadmaps.',
    tags: ['Finance', 'Money'],
    color: '#7c3aed',
    glow: 'rgba(124,58,237,0.15)',
  },
  {
    id: 'public-services',
    path: '/public-services',
    icon: '🏛️',
    title: 'Public Services',
    subtitle: 'Civic Engine',
    desc: 'Locate government programs and navigate eligibility requirements.',
    tags: ['Civic', 'Access'],
    color: '#ec4899',
    glow: 'rgba(236,72,153,0.15)',
  },
  {
    id: 'business',
    path: '/business',
    icon: '📊',
    title: 'Strategy Advisor',
    subtitle: 'Business Engine',
    desc: 'Get strategic recommendations, risk analysis, and growth ideas.',
    tags: ['Strategy', 'Growth'],
    color: '#f97316',
    glow: 'rgba(249,115,22,0.15)',
  },
];

export default function DomainGrid() {
  const navigate = useNavigate();

  return (
    <section id="domains" style={{ padding: '6rem 2rem', background: '#050508' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: '3.5rem' }}
        >
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, color: '#fff', letterSpacing: '-1px', marginBottom: '0.75rem' }}>
            Domains of Intelligence
          </h2>
          <p style={{ color: '#64748b', fontSize: 17 }}>
            Specialized AI engines for every critical life and business domain.
          </p>
        </motion.div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '1.25rem',
        }}>
          {domains.map((d, i) => (
            <motion.div
              key={d.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -6, scale: 1.01 }}
              onClick={() => navigate(d.path)}
              style={{
                background: '#0d0d14',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 20,
                padding: '1.75rem',
                cursor: 'pointer',
                transition: 'border-color 0.3s, box-shadow 0.3s',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = d.color + '55';
                e.currentTarget.style.boxShadow = `0 20px 60px ${d.glow}`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Glow blob */}
              <div style={{
                position: 'absolute', top: -40, right: -40,
                width: 120, height: 120, borderRadius: '50%',
                background: d.glow, filter: 'blur(30px)', pointerEvents: 'none',
              }} />

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 14, flexShrink: 0,
                  background: `${d.color}18`,
                  border: `1px solid ${d.color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 24,
                }}>
                  {d.icon}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 18, color: '#fff' }}>
                    {d.title}{' '}
                    <span style={{ color: '#475569', fontWeight: 400, fontSize: 15 }}>by {d.subtitle}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', marginTop: '6px', flexWrap: 'wrap' }}>
                    {d.tags.map(t => (
                      <span key={t} style={{
                        padding: '2px 10px', borderRadius: 100,
                        background: `${d.color}15`, color: d.color,
                        fontSize: 11, fontWeight: 600, letterSpacing: '0.3px',
                      }}>{t}</span>
                    ))}
                  </div>
                </div>
              </div>

              <p style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.6, marginBottom: '1.25rem' }}>
                {d.desc}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: d.color, fontSize: 13, fontWeight: 600 }}>
                Analyze Now
                <span style={{ fontSize: 16 }}>→</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
