import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ConfidenceBar from './ConfidenceBar';
import FactorsChart from './FactorsChart';
import RadarChart from './RadarChart';
import ReasoningTimeline from './ReasoningTimeline';
import AlternativesPanel from './AlternativesPanel';
import HumanReviewPanel from './HumanReviewPanel';

export default function ResultPanel({ result, domain }) {
  const [tab, setTab] = useState('overview');
  if (!result) return null;

  const { recommendation, reasoning, confidence, actions, factors, radarData, alternatives, dataSource } = result;

  const tabs = [
    { id: 'overview', label: '📊 Overview' },
    { id: 'reasoning', label: '🧠 Reasoning' },
    { id: 'factors', label: '📈 Factors' },
    { id: 'actions', label: '✅ Actions' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        background: '#0d0d14',
        border: '1px solid rgba(124,58,237,0.2)',
        borderRadius: 20,
        overflow: 'hidden',
        boxShadow: '0 24px 80px rgba(124,58,237,0.12)',
      }}
    >
      {/* Header */}
      <div style={{
        padding: '1.25rem 1.5rem',
        background: 'linear-gradient(135deg, rgba(124,58,237,0.12), rgba(6,182,212,0.06))',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14,
            }}
          >✦</motion.div>
          <div>
            <div style={{ fontWeight: 700, color: '#fff', fontSize: 15 }}>AI Analysis Complete</div>
            {dataSource && <div style={{ color: '#475569', fontSize: 11 }}>Data: {dataSource}</div>}
          </div>
        </div>
        <div style={{
          padding: '4px 12px', borderRadius: 100,
          background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.2)',
          color: '#10b981', fontSize: 11, fontWeight: 700,
        }}>
          ● ANALYSIS READY
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.06)',
        overflowX: 'auto',
      }}>
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: '12px 18px', background: 'none', border: 'none',
              cursor: 'pointer', fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap',
              color: tab === t.id ? '#a78bfa' : '#475569',
              borderBottom: tab === t.id ? '2px solid #7c3aed' : '2px solid transparent',
              transition: 'color 0.2s',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ padding: '1.5rem' }}>

        {/* OVERVIEW TAB */}
        {tab === 'overview' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <ConfidenceBar value={confidence} />

            <div style={{ marginTop: '1.25rem', marginBottom: '1.5rem' }}>
              <div style={{ color: '#64748b', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px' }}>
                AI Recommendation
              </div>
              <p style={{
                color: '#e2e8f0', fontSize: 14, lineHeight: 1.8,
                background: 'rgba(124,58,237,0.07)', padding: '1rem 1.25rem',
                borderRadius: 12, borderLeft: '3px solid #7c3aed',
              }}>
                {recommendation}
              </p>
            </div>

            {radarData && radarData.length >= 3 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ color: '#64748b', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '1rem' }}>
                  Decision Profile
                </div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <RadarChart data={radarData} color="#7c3aed" size={220} />
                </div>
              </div>
            )}

            <AlternativesPanel alternatives={alternatives} />
            <HumanReviewPanel aiResult={result} domain={domain} />
          </motion.div>
        )}

        {/* REASONING TAB */}
        {tab === 'reasoning' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <ReasoningTimeline steps={reasoning} />
            <div style={{
              background: 'rgba(6,182,212,0.06)', border: '1px solid rgba(6,182,212,0.15)',
              borderRadius: 12, padding: '1rem', marginTop: '1rem',
            }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                <span style={{ fontSize: 16 }}>ℹ️</span>
                <p style={{ color: '#64748b', fontSize: 12, lineHeight: 1.7, margin: 0 }}>
                  This reasoning was generated by analyzing your inputs against domain-specific models and real-world data patterns. Human experts can validate or adjust these conclusions.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* FACTORS TAB */}
        {tab === 'factors' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <FactorsChart factors={factors} />
            {radarData && radarData.length >= 3 && (
              <>
                <div style={{ color: '#64748b', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px', margin: '1.5rem 0 1rem' }}>
                  Multi-Dimensional Analysis
                </div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <RadarChart data={radarData} color="#06b6d4" size={240} />
                </div>
              </>
            )}
          </motion.div>
        )}

        {/* ACTIONS TAB */}
        {tab === 'actions' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div style={{ color: '#64748b', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '1rem' }}>
              Suggested Action Plan
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {actions?.map((a, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  style={{
                    display: 'flex', gap: '12px', alignItems: 'flex-start',
                    background: 'rgba(16,185,129,0.05)',
                    border: '1px solid rgba(16,185,129,0.12)',
                    borderRadius: 10, padding: '12px 14px',
                  }}
                >
                  <div style={{
                    width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                    background: 'rgba(16,185,129,0.2)', color: '#10b981',
                    fontSize: 11, fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>{i + 1}</div>
                  <span style={{ color: '#cbd5e1', fontSize: 13, lineHeight: 1.6 }}>{a}</span>
                </motion.div>
              ))}
            </div>

            <div style={{ marginTop: '1.5rem' }}>
              <HumanReviewPanel aiResult={result} domain={domain} />
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
