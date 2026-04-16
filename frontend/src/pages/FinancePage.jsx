import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import AIForm from "../components/AIForm";

const C = {
  bg: "#0A0A0F", bgCard: "#111118", bgCard2: "#16161E",
  purple: "#7B5CF0", purpleLight: "#9D7EFF", purpleDim: "#2D1F6E",
  cyan: "#00E5D4", gold: "#F0B429", green: "#22C55E", red: "#EF4444",
  text: "#F0EEF8", textMuted: "#8B87A8",
  border: "rgba(123,92,240,0.18)", borderLight: "rgba(255,255,255,0.07)",
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
  .fv * { box-sizing: border-box; }
  .fv-syne { font-family: 'Syne', sans-serif !important; }
  @keyframes fv-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
  @keyframes fv-shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
  @keyframes fv-ticker { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
  @keyframes fv-blink { 0%,100%{opacity:1} 50%{opacity:0} }
  @keyframes fv-spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes fv-pulse { 0%{box-shadow:0 0 0 0 rgba(123,92,240,0.4)} 70%{box-shadow:0 0 0 10px rgba(123,92,240,0)} 100%{box-shadow:0 0 0 0 rgba(123,92,240,0)} }
  .fv-shimmer-text {
    background: linear-gradient(90deg,#9D7EFF 0%,#00E5D4 30%,#9D7EFF 60%,#F0B429 80%,#9D7EFF 100%);
    background-size:200% auto; -webkit-background-clip:text; background-clip:text;
    -webkit-text-fill-color:transparent; animation:fv-shimmer 3s linear infinite;
  }
  .fv-card {
    border:1px solid rgba(123,92,240,0.18); background:#111118; border-radius:16px;
    transition:border-color 0.3s,box-shadow 0.3s;
  }
  .fv-card:hover { border-color:rgba(123,92,240,0.45); box-shadow:0 0 32px rgba(123,92,240,0.12); }
  .fv-btn { background:linear-gradient(135deg,#7B5CF0,#5B3FCF); color:#fff; border:none;
    padding:13px 30px; border-radius:50px; font-family:'DM Sans',sans-serif; font-size:14px;
    font-weight:500; cursor:pointer; transition:transform 0.2s,box-shadow 0.2s;
    box-shadow:0 4px 24px rgba(123,92,240,0.35); }
  .fv-btn:hover { transform:translateY(-2px); box-shadow:0 8px 32px rgba(123,92,240,0.5); }
  .fv-btn:disabled { opacity:0.5; cursor:not-allowed; transform:none; }
  .fv-input { background:#16161E; border:1px solid rgba(123,92,240,0.18); border-radius:12px;
    padding:11px 16px; color:#F0EEF8; font-size:13px; outline:none; font-family:'DM Sans',sans-serif;
    transition:border-color 0.2s; width:100%; box-sizing:border-box; }
  .fv-input:focus { border-color:#7B5CF0; }
  .fv-select { background:#16161E; border:1px solid rgba(123,92,240,0.18); border-radius:12px;
    padding:11px 16px; color:#F0EEF8; font-size:13px; outline:none; font-family:'DM Sans',sans-serif;
    width:100%; box-sizing:border-box; cursor:pointer; }
  .fv-scrollbar::-webkit-scrollbar { display:none; }
  .fv-scrollbar { scrollbar-width:none; }
  .fv-tab-btn { background:transparent; border:1px solid rgba(123,92,240,0.18); color:#8B87A8;
    border-radius:50px; padding:7px 20px; font-size:12px; cursor:pointer;
    font-family:'DM Sans',sans-serif; transition:all 0.2s; white-space:nowrap; }
  .fv-tab-btn.active { background:#7B5CF0; border-color:#7B5CF0; color:#fff; }
`;

// ─── Scroll Reveal Wrapper ────────────────────────────────────────
function Reveal({ children, delay = 0, direction = "up" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const variants = {
    hidden: { opacity: 0, y: direction === "up" ? 40 : direction === "down" ? -40 : 0, x: direction === "left" ? 40 : direction === "right" ? -40 : 0 },
    visible: { opacity: 1, y: 0, x: 0 },
  };
  return (
    <motion.div ref={ref} variants={variants} initial="hidden" animate={inView ? "visible" : "hidden"}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

// ─── Sparkline ────────────────────────────────────────────────────
function Sparkline({ data, color = C.purple, width = 80, height = 32 }) {
  const max = Math.max(...data), min = Math.min(...data), range = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * width},${height - ((v - min) / range) * height}`);
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <defs>
        <linearGradient id={`sp${color.replace(/[^a-z0-9]/gi,"")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`M 0,${height} L ${pts.join(" L ")} L ${width},${height} Z`} fill={`url(#sp${color.replace(/[^a-z0-9]/gi,"")})`} />
      <path d={`M ${pts.join(" L ")}`} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// ─── Pie Chart ────────────────────────────────────────────────────
function PieChart() {
  const segs = [
    { label: "Stocks", pct: 45, color: C.purple },
    { label: "Crypto", pct: 25, color: C.cyan },
    { label: "Bonds", pct: 20, color: C.gold },
    { label: "Cash", pct: 10, color: "#4B5563" },
  ];
  const r = 60, cx = 80, cy = 80;
  let cum = -Math.PI / 2;
  const slices = segs.map(s => {
    const a = (s.pct / 100) * 2 * Math.PI;
    const x1 = cx + r * Math.cos(cum), y1 = cy + r * Math.sin(cum);
    cum += a;
    const x2 = cx + r * Math.cos(cum), y2 = cy + r * Math.sin(cum);
    return { ...s, d: `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${a > Math.PI ? 1 : 0},1 ${x2},${y2} Z` };
  });
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
      <svg width={160} height={160} viewBox="0 0 160 160">
        {slices.map((s, i) => <path key={i} d={s.d} fill={s.color} opacity={0.9} />)}
        <circle cx={cx} cy={cy} r={38} fill={C.bgCard} />
        <text x={cx} y={cy - 6} textAnchor="middle" fill={C.text} fontSize="13" fontWeight="600" fontFamily="Syne">Total</text>
        <text x={cx} y={cy + 10} textAnchor="middle" fill={C.textMuted} fontSize="10" fontFamily="DM Sans">Portfolio</text>
      </svg>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {segs.map(s => (
          <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: s.color }} />
            <span style={{ fontSize: 12, color: C.textMuted }}>{s.label}</span>
            <span style={{ fontSize: 12, fontWeight: 500, marginLeft: "auto", paddingLeft: 8 }}>{s.pct}%</span>
          </div>
        ))}
      </div>
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { analyzeWithAI } from '../services/api';

const C = '#818cf8';
const C2 = '#a78bfa';

function Ring({ value = 0, size = 110, stroke = 9, label, color }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const c = color || C;
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
          <div style={{ color: c, fontSize: size * 0.1, fontWeight: 600 }}>{value >= 75 ? 'Strong' : value >= 50 ? 'Fair' : 'Weak'}</div>
        </div>
      </div>
      {label && <div style={{ color: '#94a3b8', fontSize: 11, fontWeight: 600, textAlign: 'center' }}>{label}</div>}
    </div>
  );
}

// ─── Line Chart ───────────────────────────────────────────────────
function LineChart({ data, labels, colors, height = 180 }) {
  const svgW = 480, svgH = height, pad = { l: 40, r: 16, t: 16, b: 32 };
  const W = svgW - pad.l - pad.r, H = svgH - pad.t - pad.b;
  const allVals = data.flat(), maxV = Math.max(...allVals) * 1.1, minV = Math.min(...allVals) * 0.9, range = maxV - minV;
  const toX = i => pad.l + (i / (labels.length - 1)) * W;
  const toY = v => pad.t + H - ((v - minV) / range) * H;
  return (
    <svg viewBox={`0 0 ${svgW} ${svgH}`} style={{ width: "100%", height }}>
      <defs>{data.map((_, i) => (
        <linearGradient key={i} id={`lg${i}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={colors[i]} stopOpacity="0.25" />
          <stop offset="100%" stopColor={colors[i]} stopOpacity="0" />
        </linearGradient>
      ))}</defs>
      {[0.25, 0.5, 0.75, 1].map((f, i) => {
        const v = minV + f * range;
        return <g key={i}>
          <line x1={pad.l} y1={toY(v)} x2={pad.l + W} y2={toY(v)} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          <text x={pad.l - 6} y={toY(v) + 4} textAnchor="end" fill={C.textMuted} fontSize="9" fontFamily="DM Sans">
            {v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v.toFixed(0)}
          </text>
        </g>;
      })}
      {labels.map((l, i) => <text key={i} x={toX(i)} y={svgH - 8} textAnchor="middle" fill={C.textMuted} fontSize="9" fontFamily="DM Sans">{l}</text>)}
      {data.map((series, si) => {
        const pts = series.map((v, i) => `${toX(i)},${toY(v)}`);
        return <g key={si}>
          <path d={`M ${toX(0)},${pad.t + H} L ${pts.join(" L ")} L ${toX(labels.length - 1)},${pad.t + H} Z`} fill={`url(#lg${si})`} />
          <path d={`M ${pts.join(" L ")}`} fill="none" stroke={colors[si]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          {series.map((v, i) => <circle key={i} cx={toX(i)} cy={toY(v)} r="3" fill={colors[si]} opacity={0.9} />)}
        </g>;
      })}
    </svg>
  );
}

// ─── Bar Chart ────────────────────────────────────────────────────
function BarChart({ data, labels, color = C.purple, height = 140 }) {
  const svgW = 400, svgH = height, pad = { l: 30, r: 8, t: 12, b: 28 };
  const W = svgW - pad.l - pad.r, H = svgH - pad.t - pad.b;
  const maxV = Math.max(...data) * 1.1, barW = W / data.length * 0.5, step = W / data.length;
  return (
    <svg viewBox={`0 0 ${svgW} ${svgH}`} style={{ width: "100%", height }}>
      <defs>
        <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} /><stop offset="100%" stopColor={color} stopOpacity="0.4" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75, 1].map((f, i) => <line key={i} x1={pad.l} y1={pad.t + H * (1 - f)} x2={pad.l + W} y2={pad.t + H * (1 - f)} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />)}
      {data.map((v, i) => {
        const bH = (v / maxV) * H, bX = pad.l + step * i + step / 2 - barW / 2, bY = pad.t + H - bH;
        return <g key={i}>
          <rect x={bX} y={bY} width={barW} height={bH} rx="3" fill="url(#barGrad)" opacity="0.85" />
          <text x={bX + barW / 2} y={svgH - 8} textAnchor="middle" fill={C.textMuted} fontSize="9" fontFamily="DM Sans">{labels[i]}</text>
        </g>;
      })}
    </svg>
  );
}

// ─── Ticker ───────────────────────────────────────────────────────
const TICKERS = [
  { sym: "BTC", price: "$67,420", chg: "+2.4%" }, { sym: "ETH", price: "$3,812", chg: "+1.8%" },
  { sym: "AAPL", price: "$193.42", chg: "+0.6%" }, { sym: "TSLA", price: "$248.30", chg: "-1.2%" },
  { sym: "NVDA", price: "$875.20", chg: "+3.1%" }, { sym: "GOLD", price: "$2,315", chg: "+0.4%" },
  { sym: "SPY", price: "$514.80", chg: "+0.9%" }, { sym: "SOL", price: "$182.40", chg: "+4.2%" },
];
function Ticker() {
  return (
    <div style={{ overflow: "hidden", background: "rgba(123,92,240,0.06)", borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, padding: "10px 0" }}>
      <div style={{ display: "flex", animation: "fv-ticker 28s linear infinite", whiteSpace: "nowrap", width: "max-content" }}>
        {[...TICKERS, ...TICKERS].map((t, i) => (
          <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "0 28px", fontSize: 13 }}>
            <span style={{ fontWeight: 600, fontFamily: "Syne", color: C.purpleLight }}>{t.sym}</span>
            <span style={{ color: C.text }}>{t.price}</span>
            <span style={{ color: t.chg.startsWith("-") ? C.red : C.green, fontSize: 11 }}>{t.chg}</span>
            <span style={{ color: C.border, paddingLeft: 12 }}>•</span>
          </span>
        ))}
      </div>
function Card({ children, accent, style = {} }) {
  return (
    <div style={{ background: '#0b1117', border: `1px solid ${accent ? accent + '25' : 'rgba(255,255,255,0.07)'}`, borderRadius: 18, padding: '1.5rem', ...style }}>
      {children}
    </div>
  );
}

// ─── Section Label ────────────────────────────────────────────────
function SectionLabel({ children }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(123,92,240,0.1)", border: `1px solid ${C.border}`, borderRadius: 50, padding: "5px 14px", marginBottom: 16 }}>
      <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.cyan, boxShadow: `0 0 8px ${C.cyan}` }} />
      <span style={{ fontSize: 11, color: C.cyan, fontWeight: 500 }}>{children}</span>
function Title({ icon, title, badge }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.25rem' }}>
      <span style={{ fontSize: 18 }}>{icon}</span>
      <span style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>{title}</span>
      {badge && <span style={{ marginLeft: 'auto', padding: '2px 10px', borderRadius: 100, background: `${C}18`, border: `1px solid ${C}30`, color: C2, fontSize: 11, fontWeight: 700 }}>{badge}</span>}
    </div>
  );
}

// ─── 1. HERO ──────────────────────────────────────────────────────
function Hero() {
  const [netWorth, setNetWorth] = useState(127840);
  const [change, setChange] = useState(2847);
  const sparkData = [102, 108, 105, 115, 112, 120, 118, 125, 122, 128, 124, 130];
  useEffect(() => {
    const t = setInterval(() => {
      const d = (Math.random() - 0.45) * 300;
      setNetWorth(v => Math.max(100000, v + d));
      setChange(v => v + d * 0.3);
    }, 2400);
    return () => clearInterval(t);
  }, []);
  return (
    <section style={{ padding: "80px 0 60px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: "-20%", left: "50%", transform: "translateX(-50%)", width: 800, height: 800, borderRadius: "50%", background: "radial-gradient(circle, rgba(123,92,240,0.1) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", top: 80, right: 60, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,229,212,0.05) 0%, transparent 70%)" }} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
        <Reveal>
          <SectionLabel>Smart Financial Platform</SectionLabel>
          <h1 className="fv-syne" style={{ fontSize: 56, fontWeight: 800, lineHeight: 1.1, marginBottom: 20, fontFamily: "Syne, sans-serif" }}>
            Grow Your<br /><span className="fv-shimmer-text">Wealth Smarter</span><br />with AI
          </h1>
          <p style={{ fontSize: 15, color: C.textMuted, lineHeight: 1.8, marginBottom: 32, maxWidth: 420 }}>
            AI-powered financial intelligence to decode your finances, optimize investments, and eliminate financial confusion.
          </p>
          <div style={{ display: "flex", gap: 36 }}>
            {[["$2.4B+", "Assets Managed"], ["180k+", "Active Users"], ["99.8%", "Uptime SLA"]].map(([v, l]) => (
              <div key={l}>
                <div className="fv-syne" style={{ fontSize: 22, fontWeight: 700, color: C.purpleLight }}>{v}</div>
                <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="fv-card" style={{ padding: 28, animation: "fv-float 5s ease-in-out infinite" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
              <div>
                <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 4 }}>Total Net Worth</div>
                <div className="fv-syne" style={{ fontSize: 36, fontWeight: 800 }}>${netWorth.toLocaleString("en", { maximumFractionDigits: 0 })}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4, color: change > 0 ? C.green : C.red, fontSize: 13 }}>
                  {change > 0 ? "▲" : "▼"} ${Math.abs(change).toFixed(0)} today
                </div>
              </div>
              <Sparkline data={sparkData} color={C.cyan} width={90} height={48} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 24 }}>
              {[["Invested", "$89,200", "+12.4%", true], ["Savings", "$28,640", "+3.1%", true], ["Debt", "$10,000", "-8.2%", false]].map(([l, v, ch, up]) => (
                <div key={l} style={{ background: C.bgCard2, borderRadius: 12, padding: "12px 14px", border: `1px solid ${C.borderLight}` }}>
                  <div style={{ fontSize: 10, color: C.textMuted, marginBottom: 4 }}>{l}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{v}</div>
                  <div style={{ fontSize: 10, color: up ? C.green : C.red }}>{ch}</div>
                </div>
              ))}
            </div>
            <PieChart />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── 2. STATS BAR ─────────────────────────────────────────────────
function StatsBar() {
  const stats = [
    { icon: "📈", label: "Portfolio Return", value: "+16.8%", sub: "vs market +14.2%", color: C.green },
    { icon: "💰", label: "Savings Rate", value: "28%", sub: "Goal: 30%", color: C.cyan },
    { icon: "🛡️", label: "Debt-to-Income", value: "12%", sub: "Healthy (<36%)", color: C.purple },
    { icon: "🏦", label: "Emergency Fund", value: "4.2 mo", sub: "Goal: 6 months", color: C.gold },
  ];
  return (
    <section style={{ padding: "20px 0 60px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.1}>
            <div className="fv-card" style={{ padding: 22 }}>
              <div style={{ fontSize: 22, marginBottom: 10 }}>{s.icon}</div>
              <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 4 }}>{s.label}</div>
              <div className="fv-syne" style={{ fontSize: 26, fontWeight: 700, color: s.color, marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontSize: 11, color: C.textMuted }}>{s.sub}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

// ─── 3. DASHBOARD CHARTS ──────────────────────────────────────────
function DashboardSection() {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const portfolioData = [88000, 91000, 89500, 94000, 96500, 98000, 95000, 101000, 103500, 108000, 112000, 115000];
  const savingsData = [18000, 19200, 20100, 21300, 22000, 23400, 24200, 25100, 26300, 27000, 27900, 28640];
  const incomeData = [6200, 6200, 6500, 6200, 6800, 6200, 6200, 7100, 6200, 6200, 6800, 6200];
  return (
    <section style={{ padding: "60px 0", borderTop: `1px solid ${C.borderLight}` }}>
      <Reveal>
        <SectionLabel>Analytics</SectionLabel>
        <div className="fv-syne" style={{ fontSize: 40, fontWeight: 800, marginBottom: 8 }}>
          Financial <span className="fv-shimmer-text">Command Center</span>
        </div>
        <p style={{ color: C.textMuted, marginBottom: 40 }}>Real-time analytics, portfolio tracking, and intelligent insights</p>
      </Reveal>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20, marginBottom: 20 }}>
        <Reveal delay={0.1}>
          <div className="fv-card" style={{ padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div>
                <div className="fv-syne" style={{ fontSize: 15, fontWeight: 700 }}>Portfolio Growth</div>
                <div style={{ fontSize: 12, color: C.textMuted }}>12-month performance</div>
              </div>
              <div style={{ display: "flex", gap: 12, fontSize: 11 }}>
                {[["Portfolio", C.purple], ["Savings", C.cyan]].map(([l, col]) => (
                  <span key={l} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <span style={{ width: 10, height: 3, borderRadius: 2, background: col, display: "inline-block" }} />
                    <span style={{ color: C.textMuted }}>{l}</span>
                  </span>
                ))}
              </div>
            </div>
            <LineChart data={[portfolioData, savingsData]} labels={months} colors={[C.purple, C.cyan]} height={200} />
          </div>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="fv-card" style={{ padding: 24 }}>
            <div className="fv-syne" style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Monthly Cash Flow</div>
            <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 20 }}>Income vs Expenses</div>
            <BarChart data={incomeData.slice(-6)} labels={months.slice(-6)} color={C.purple} height={160} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 16 }}>
              <div style={{ background: C.bgCard2, borderRadius: 10, padding: "12px 14px" }}>
                <div style={{ fontSize: 10, color: C.textMuted }}>Avg Income</div>
                <div style={{ fontWeight: 600, marginTop: 4 }}>$6,550</div>
                <div style={{ fontSize: 10, color: C.green }}>▲ +5.3%</div>
              </div>
              <div style={{ background: C.bgCard2, borderRadius: 10, padding: "12px 14px" }}>
                <div style={{ fontSize: 10, color: C.textMuted }}>Avg Expense</div>
                <div style={{ fontWeight: 600, marginTop: 4 }}>$4,717</div>
                <div style={{ fontSize: 10, color: C.red }}>▼ -2.1%</div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── 4. MARKET OVERVIEW ───────────────────────────────────────────
function MarketSection() {
  const assets = [
    { name: "Bitcoin", sym: "BTC", price: "$67,420", chg: "+2.4%", up: true, data: [55000, 58000, 62000, 59000, 64000, 61000, 67420] },
    { name: "Ethereum", sym: "ETH", price: "$3,812", chg: "+1.8%", up: true, data: [3100, 3300, 3500, 3200, 3700, 3600, 3812] },
    { name: "Apple", sym: "AAPL", price: "$193.42", chg: "+0.6%", up: true, data: [175, 180, 185, 182, 190, 191, 193] },
    { name: "Tesla", sym: "TSLA", price: "$248.30", chg: "-1.2%", up: false, data: [280, 260, 270, 255, 265, 252, 248] },
    { name: "S&P 500", sym: "SPY", price: "$514.80", chg: "+0.9%", up: true, data: [490, 495, 502, 498, 508, 510, 514] },
    { name: "Gold", sym: "GOLD", price: "$2,315", chg: "+0.4%", up: true, data: [2200, 2240, 2280, 2260, 2300, 2310, 2315] },
  ];
  return (
    <section style={{ padding: "60px 0", borderTop: `1px solid ${C.borderLight}` }}>
      <Reveal>
        <SectionLabel>Live Markets</SectionLabel>
        <div className="fv-syne" style={{ fontSize: 40, fontWeight: 800, marginBottom: 8 }}>
          Market <span className="fv-shimmer-text">Overview</span>
        </div>
        <p style={{ color: C.textMuted, marginBottom: 40 }}>Major assets & indices — live tracking</p>
      </Reveal>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {assets.map((a, i) => (
          <Reveal key={a.sym} delay={i * 0.08}>
            <div className="fv-card" style={{ padding: 20, cursor: "pointer" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: a.up ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: a.up ? C.green : C.red, fontFamily: "Syne" }}>
                    {a.sym.slice(0, 2)}
                  </div>
                  <div>
                    <div className="fv-syne" style={{ fontSize: 13, fontWeight: 700 }}>{a.sym}</div>
                    <div style={{ fontSize: 10, color: C.textMuted }}>{a.name}</div>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{a.price}</div>
                  <div style={{ fontSize: 11, color: a.up ? C.green : C.red }}>{a.chg}</div>
                </div>
              </div>
              <Sparkline data={a.data} color={a.up ? C.cyan : C.red} width={200} height={40} />
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

// ─── 5. TOOLS ─────────────────────────────────────────────────────
function ToolsSection() {
  const [calcTab, setCalcTab] = useState("compound");
  const [principal, setPrincipal] = useState(10000);
  const [rate, setRate] = useState(8);
  const [years, setYears] = useState(20);
  const [monthly, setMonthly] = useState(500);
  const fv = principal * Math.pow(1 + rate / 100, years) + monthly * 12 * ((Math.pow(1 + rate / 100, years) - 1) / (rate / 100));
  const chartData = Array.from({ length: years }, (_, i) => {
    const y = i + 1;
    return Math.round(principal * Math.pow(1 + rate / 100, y) + monthly * 12 * ((Math.pow(1 + rate / 100, y) - 1) / (rate / 100)));
  });
  const chartLabels = Array.from({ length: years }, (_, i) => (i === 0 || i === years - 1 || i % Math.ceil(years / 5) === 0) ? `Y${i + 1}` : "");

  const [income, setIncome] = useState(6500);
  const [debt, setDebt] = useState(15000);
  const [intRate, setIntRate] = useState(18);
  const [payment, setPayment] = useState(400);
  const minPay = (debt * intRate / 100) / 12;
  const debtMonths = payment > minPay ? Math.ceil(-Math.log(1 - (debt * intRate / 1200) / payment) / Math.log(1 + intRate / 1200)) : Infinity;

  return (
    <section style={{ padding: "60px 0", borderTop: `1px solid ${C.borderLight}` }}>
      <Reveal>
        <SectionLabel>Decision Tools</SectionLabel>
        <div className="fv-syne" style={{ fontSize: 40, fontWeight: 800, marginBottom: 8 }}>
          Financial <span className="fv-shimmer-text">Calculators</span>
        </div>
        <p style={{ color: C.textMuted, marginBottom: 28 }}>Interactive tools to eliminate financial confusion</p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 32 }}>
          {[["compound", "Compound Interest"], ["budget", "Budget Planner"], ["debt", "Debt Payoff"]].map(([id, label]) => (
            <button key={id} onClick={() => setCalcTab(id)} className={`fv-tab-btn ${calcTab === id ? "active" : ""}`}>{label}</button>
          ))}
        </div>
      </Reveal>

      {calcTab === "compound" && (
        <Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 24 }}>
            <div className="fv-card" style={{ padding: 28 }}>
              <div className="fv-syne" style={{ fontSize: 17, fontWeight: 700, marginBottom: 24 }}>Compound Interest</div>
              {[["Initial Investment", principal, setPrincipal, 1000, 100000, 1000, "$"],
                ["Monthly Contribution", monthly, setMonthly, 0, 5000, 50, "$"],
                ["Annual Return Rate", rate, setRate, 1, 20, 0.5, "%"],
                ["Time Horizon (Years)", years, setYears, 1, 40, 1, "yr"]
              ].map(([label, val, setter, min, max, step, unit]) => (
                <div key={label} style={{ marginBottom: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13 }}>
                    <span style={{ color: C.textMuted }}>{label}</span>
                    <span style={{ color: C.purpleLight, fontWeight: 600 }}>{unit === "$" ? `$${Number(val).toLocaleString()}` : `${val}${unit}`}</span>
                  </div>
                  <input type="range" min={min} max={max} step={step} value={val} onChange={e => setter(Number(e.target.value))} style={{ width: "100%", accentColor: C.purple }} />
                </div>
              ))}
              <div style={{ background: "linear-gradient(135deg,rgba(123,92,240,0.15),rgba(0,229,212,0.08))", border: `1px solid ${C.border}`, borderRadius: 14, padding: "20px 24px" }}>
                <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 4 }}>Future Value in {years} years</div>
                <div className="fv-syne" style={{ fontSize: 32, fontWeight: 800, color: C.cyan }}>${Math.round(fv).toLocaleString()}</div>
                <div style={{ fontSize: 12, color: C.textMuted, marginTop: 6 }}>
                  Profit: <span style={{ color: C.green }}>${Math.round(fv - principal - monthly * 12 * years).toLocaleString()}</span>
                </div>
              </div>
            </div>
            <div className="fv-card" style={{ padding: 28 }}>
              <div className="fv-syne" style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Growth Projection</div>
              <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 20 }}>Portfolio value over {years} years</div>
              <LineChart data={[chartData]} labels={chartLabels} colors={[C.cyan]} height={240} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 16 }}>
                {[["Total Invested", `$${(principal + monthly * 12 * years).toLocaleString()}`, C.text],
                  ["Total Returns", `$${Math.round(fv - principal - monthly * 12 * years).toLocaleString()}`, C.green],
                  ["ROI", `${(((fv - principal) / principal) * 100).toFixed(1)}%`, C.purple]
                ].map(([l, v, col]) => (
                  <div key={l} style={{ background: C.bgCard2, borderRadius: 10, padding: "12px 14px" }}>
                    <div style={{ fontSize: 10, color: C.textMuted }}>{l}</div>
                    <div style={{ fontWeight: 600, marginTop: 4, fontSize: 14, color: col }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      )}

      {calcTab === "budget" && (
        <Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <div className="fv-card" style={{ padding: 28 }}>
              <div className="fv-syne" style={{ fontSize: 17, fontWeight: 700, marginBottom: 6 }}>50/30/20 Rule</div>
              <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 24 }}>The gold standard for personal budgeting</div>
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 13 }}>
                  <span style={{ color: C.textMuted }}>Monthly Income</span>
                  <span style={{ color: C.purpleLight, fontWeight: 600 }}>${income.toLocaleString()}</span>
                </div>
                <input type="range" min={2000} max={20000} step={100} value={income} onChange={e => setIncome(Number(e.target.value))} style={{ width: "100%", accentColor: C.purple }} />
              </div>
              {[["50% Needs", 0.5, C.purple, "Housing, food, utilities, transport"],
                ["30% Wants", 0.3, C.cyan, "Entertainment, dining out, hobbies"],
                ["20% Savings", 0.2, C.green, "Investments, emergency fund, debt payoff"]
              ].map(([label, pct, color, desc]) => (
                <div key={label} style={{ marginBottom: 14, background: C.bgCard2, borderRadius: 12, padding: "14px 16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span className="fv-syne" style={{ fontSize: 14, fontWeight: 700, color }}>{label}</span>
                    <span style={{ fontSize: 15, fontWeight: 600 }}>${(income * pct).toLocaleString()}/mo</span>
                  </div>
                  <div style={{ fontSize: 11, color: C.textMuted }}>{desc}</div>
                </div>
              ))}
            </div>
            <div className="fv-card" style={{ padding: 28 }}>
              <div className="fv-syne" style={{ fontSize: 17, fontWeight: 700, marginBottom: 20 }}>Breakdown</div>
              {[{ label: "Housing", pct: 30, color: C.purple }, { label: "Food", pct: 12, color: C.cyan },
                { label: "Transport", pct: 10, color: C.gold }, { label: "Savings", pct: 20, color: C.green },
                { label: "Utilities", pct: 8, color: "#8B87A8" }, { label: "Entertainment", pct: 5, color: "#E879F9" },
                { label: "Emergency", pct: 5, color: "#FB923C" }, { label: "Other", pct: 10, color: "#94A3B8" }
              ].map(cat => (
                <div key={cat.label} style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 12 }}>
                    <span style={{ color: C.textMuted }}>{cat.label}</span>
                    <span style={{ color: cat.color }}>${Math.round(income * cat.pct / 100).toLocaleString()}</span>
                  </div>
                  <div style={{ background: C.borderLight, borderRadius: 4, height: 6, overflow: "hidden" }}>
                    <div style={{ width: `${cat.pct * 5}%`, height: "100%", background: cat.color, borderRadius: 4 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      )}

      {calcTab === "debt" && (
        <Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <div className="fv-card" style={{ padding: 28 }}>
              <div className="fv-syne" style={{ fontSize: 17, fontWeight: 700, marginBottom: 24 }}>Debt Payoff Calculator</div>
              {[["Total Debt", debt, setDebt, 1000, 100000, 500, "$"],
                ["Annual Interest Rate", intRate, setIntRate, 1, 30, 0.5, "%"],
                ["Monthly Payment", payment, setPayment, Math.ceil(minPay) + 10, 3000, 25, "$"]
              ].map(([label, val, setter, min, max, step, unit]) => (
                <div key={label} style={{ marginBottom: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13 }}>
                    <span style={{ color: C.textMuted }}>{label}</span>
                    <span style={{ color: C.purpleLight, fontWeight: 600 }}>{unit === "$" ? `$${Number(val).toLocaleString()}` : `${val}${unit}`}</span>
                  </div>
                  <input type="range" min={min} max={max} step={step} value={val} onChange={e => setter(Number(e.target.value))} style={{ width: "100%", accentColor: C.purple }} />
                </div>
              ))}
              <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 12, padding: 16 }}>
                <div style={{ fontSize: 11, color: C.textMuted }}>Months to debt-free</div>
                <div className="fv-syne" style={{ fontSize: 32, fontWeight: 800, color: debtMonths < 48 ? C.green : C.red }}>
                  {debtMonths < Infinity ? `${debtMonths} mo` : "∞"}
                </div>
                {debtMonths < Infinity && <div style={{ fontSize: 12, color: C.textMuted, marginTop: 4 }}>Interest paid: <span style={{ color: C.red }}>${Math.round(payment * debtMonths - debt).toLocaleString()}</span></div>}
              </div>
            </div>
            <div className="fv-card" style={{ padding: 28 }}>
              <div className="fv-syne" style={{ fontSize: 17, fontWeight: 700, marginBottom: 20 }}>Strategy Guide</div>
              <div style={{ background: intRate > 15 ? "rgba(239,68,68,0.08)" : "rgba(34,197,94,0.08)", border: `1px solid ${intRate > 15 ? "rgba(239,68,68,0.25)" : "rgba(34,197,94,0.25)"}`, borderRadius: 12, padding: 16, marginBottom: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4, color: intRate > 15 ? C.red : C.green }}>
                  {intRate > 15 ? "⚠️ High Interest Alert" : "✓ Manageable Rate"}
                </div>
                <div style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.6 }}>
                  {intRate > 15 ? "Use Avalanche method — pay this off before investing." : "Balance paying off debt with investing."}
                </div>
              </div>
              {[["Avalanche Method", "Pay highest interest first. Saves the most money.", C.purple],
                ["Snowball Method", "Pay smallest balances first. Better for motivation.", C.cyan],
                ["Consolidation", "Combine debts at lower rate. Reduces monthly payment.", C.gold]
              ].map(([name, desc, color]) => (
                <div key={name} style={{ marginBottom: 12, padding: "12px 14px", background: C.bgCard2, borderRadius: 10, borderLeft: `3px solid ${color}` }}>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2, color }}>{name}</div>
                  <div style={{ fontSize: 12, color: C.textMuted }}>{desc}</div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      )}
    </section>
  );
}

// ─── 6. AI ANALYZE ────────────────────────────────────────────────
const FINANCE_FIELDS = [
  { key: 'income', label: 'Monthly Income ($)', type: 'number', placeholder: 'e.g. 5000', required: true },
  { key: 'savings', label: 'Current Savings ($)', type: 'number', placeholder: 'e.g. 20000', required: true },
  { key: 'riskTolerance', label: 'Risk Tolerance', type: 'select', options: ['Conservative', 'Moderate', 'Aggressive'], required: true },
  { key: 'financialGoal', label: 'Financial Goal', type: 'textarea', placeholder: 'e.g. Save for retirement, buy a house, build emergency fund...', required: true },
];
const STEPS = ['Analysing income & savings…','Evaluating risk profile…','Checking market conditions…','Building investment strategy…','Generating financial roadmap…'];

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
        <div style={{ position: 'absolute', inset: '22%', borderRadius: '50%', background: `linear-gradient(135deg,${C},#38bdf8)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>💰</div>
      </div>
      <div style={{ color: '#fff', fontWeight: 700, fontSize: 17, marginBottom: 8 }}>AI is building your financial plan…</div>
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

function AISection({ sectionRef }) {
  return (
    <section ref={sectionRef} style={{ padding: "60px 0", borderTop: `1px solid ${C.borderLight}` }}>
      <Reveal>
        <SectionLabel>AI Powered</SectionLabel>
        <div className="fv-syne" style={{ fontSize: 40, fontWeight: 800, marginBottom: 8 }}>
          Get Your <span className="fv-shimmer-text">AI Analysis</span>
        </div>
        <p style={{ color: C.textMuted, marginBottom: 40 }}>Personalized investment strategy powered by Groq AI</p>
      </Reveal>
      <Reveal delay={0.1}>
        <AIForm domain="finance" fields={FINANCE_FIELDS} color="#7B5CF0" />
      </Reveal>
    </section>
  );
}

// ─── 7. FEATURES ─────────────────────────────────────────────────
function FeaturesSection() {
  const features = [
    { icon: "🤖", title: "AI Financial Advisor", desc: "Expert-level answers on investments, budgeting, debt, and retirement backed by real financial data.", color: C.purple },
    { icon: "📊", title: "Smart Analytics", desc: "Visualize your complete financial picture with interactive charts and predictive forecasting.", color: C.cyan },
    { icon: "🎯", title: "Goal Tracking", desc: "Set financial goals and watch AI optimize your path to reach them faster.", color: C.gold },
    { icon: "🛡️", title: "Risk Assessment", desc: "Know your risk profile. Get portfolio recommendations aligned with your comfort level.", color: C.green },
    { icon: "💡", title: "Smart Alerts", desc: "Proactive insights when markets move, bills are due, or opportunities arise.", color: "#E879F9" },
    { icon: "👤", title: "Human Analysts", desc: "Every major decision reviewed by certified financial planners for extra confidence.", color: "#FB923C" },
  ];
  return (
    <section style={{ padding: "60px 0", borderTop: `1px solid ${C.borderLight}` }}>
      <Reveal>
        <SectionLabel>Features</SectionLabel>
        <div className="fv-syne" style={{ fontSize: 40, fontWeight: 800, marginBottom: 8 }}>
          Everything You Need to <span className="fv-shimmer-text">Thrive Financially</span>
        </div>
        <p style={{ color: C.textMuted, marginBottom: 40, maxWidth: 480 }}>One platform to understand, manage, and grow your wealth</p>
      </Reveal>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
        {features.map((f, i) => (
          <Reveal key={f.title} delay={i * 0.08}>
            <div className="fv-card" style={{ padding: 28 }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: `${f.color}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 16 }}>{f.icon}</div>
              <div className="fv-syne" style={{ fontSize: 15, fontWeight: 700, marginBottom: 8, color: f.color }}>{f.title}</div>
              <div style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.7 }}>{f.desc}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

// ─── 8. CTA ───────────────────────────────────────────────────────
function CTASection({ analyzeRef }) {
  return (
    <section style={{ padding: "60px 0 80px" }}>
      <Reveal>
        <div style={{ background: "linear-gradient(135deg,rgba(123,92,240,0.2),rgba(0,229,212,0.08))", border: `1px solid ${C.border}`, borderRadius: 28, padding: "64px 80px", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -80, right: -80, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle,rgba(123,92,240,0.2),transparent 70%)", pointerEvents: "none" }} />
          <div className="fv-syne" style={{ fontSize: 44, fontWeight: 800, marginBottom: 16 }}>
            Take Control of Your<br /><span className="fv-shimmer-text">Financial Future Today</span>
          </div>
          <p style={{ fontSize: 15, color: C.textMuted, marginBottom: 36, maxWidth: 480, margin: "0 auto 36px" }}>
            Join 180,000+ users who eliminated financial confusion and built real wealth.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="fv-btn" onClick={() => analyzeRef.current?.scrollIntoView({ behavior: "smooth" })} style={{ padding: "16px 40px", fontSize: 15 }}>Start Free — No Card Required</button>
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 32, marginTop: 28, fontSize: 12, color: C.textMuted }}>
            {["✓ 30-day free trial", "✓ No credit card", "✓ Cancel anytime", "✓ Bank-grade security"].map(t => <span key={t}>{t}</span>)}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────
export default function FinancePage() {
  const analyzeRef = useRef(null);
  return (
    <>
      <style>{CSS}</style>
      <div className="fv" style={{ background: C.bg, minHeight: "100vh", color: C.text, fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <Hero />
          <StatsBar />
          <DashboardSection />
          <MarketSection />
          <ToolsSection />
          <AISection sectionRef={analyzeRef} />
          <FeaturesSection />
          <CTASection analyzeRef={analyzeRef} />
        </div>
      </div>
    </>
  const navigate = useNavigate();
  const [mode, setMode] = useState('input');
  const [form, setForm] = useState({ income: '', savings: '', riskTolerance: 'Moderate', financialGoal: '' });
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!form.income || !form.financialGoal) { setError('Income and financial goal are required.'); return; }
    setError(''); setMode('loading');
    try {
      const res = await analyzeWithAI('finance', form);
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
            <div style={{ width: 48, height: 48, borderRadius: 14, background: `${C}18`, border: `1px solid ${C}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>💰</div>
            <div>
              <h1 style={{ color: '#fff', fontSize: 22, fontWeight: 800, margin: 0 }}>Finance Planner</h1>
              <p style={{ color: '#64748b', fontSize: 12, margin: 0 }}>Personalised investment strategies & financial roadmaps</p>
            </div>
          </div>
          {mode === 'result' && (
            <button onClick={() => { setMode('input'); setResult(null); }}
              style={{ padding: '8px 18px', borderRadius: 10, background: `${C}12`, border: `1px solid ${C}25`, color: C2, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>↺ New Plan</button>
          )}
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '2rem 1.5rem' }}>
        {mode === 'input' && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{ background: `linear-gradient(135deg,${C}10,rgba(56,189,248,0.04))`, border: `1px solid ${C}18`, borderRadius: 20, padding: '2rem', marginBottom: '1.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>💰</div>
              <h2 style={{ color: '#fff', fontSize: 22, fontWeight: 800, margin: '0 0 8px' }}>Build Your Financial Plan</h2>
              <p style={{ color: '#64748b', fontSize: 14, margin: 0 }}>Get AI-powered investment advice, savings strategies & a personalised financial roadmap</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: '1.25rem' }}>
              <Card accent={C} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>📊 Financial Snapshot</div>
                {[
                  { key: 'income', label: 'Monthly Income ($)', placeholder: 'e.g. 5000', type: 'number' },
                  { key: 'savings', label: 'Current Savings ($)', placeholder: 'e.g. 20000', type: 'number' },
                ].map(f => (
                  <div key={f.key}>
                    <label style={{ display: 'block', color: '#94a3b8', fontSize: 11, fontWeight: 600, marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{f.label}</label>
                    <input type={f.type} value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                      placeholder={f.placeholder} style={inp}
                      onFocus={e => e.target.style.borderColor = C} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
                  </div>
                ))}
                <div>
                  <label style={{ display: 'block', color: '#94a3b8', fontSize: 11, fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Risk Tolerance</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {['Conservative','Moderate','Aggressive'].map(r => (
                      <button key={r} onClick={() => setForm(p => ({ ...p, riskTolerance: r }))}
                        style={{ flex: 1, padding: '8px 4px', borderRadius: 8, border: `1px solid ${form.riskTolerance === r ? C : 'rgba(255,255,255,0.08)'}`, background: form.riskTolerance === r ? `${C}18` : '#0d1520', color: form.riskTolerance === r ? C2 : '#64748b', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>
                        {r === 'Conservative' ? '🛡️' : r === 'Moderate' ? '⚖️' : '🚀'} {r}
                      </button>
                    ))}
                  </div>
                </div>
              </Card>
              <Card style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>🎯 Financial Goal</div>
                <div>
                  <label style={{ display: 'block', color: '#94a3b8', fontSize: 11, fontWeight: 600, marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.5px' }}>What do you want to achieve?</label>
                  <textarea value={form.financialGoal} onChange={e => setForm(p => ({ ...p, financialGoal: e.target.value }))}
                    placeholder="e.g. Save for retirement, buy a house, build an emergency fund, invest in stocks…" rows={6}
                    style={{ ...inp, resize: 'vertical' }}
                    onFocus={e => e.target.style.borderColor = C} onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {['Retirement Fund','Buy a House','Emergency Fund','Stock Portfolio','Debt Free','Start a Business'].map(g => (
                    <button key={g} onClick={() => setForm(p => ({ ...p, financialGoal: g }))}
                      style={{ padding: '4px 12px', borderRadius: 100, background: form.financialGoal === g ? `${C}20` : 'rgba(255,255,255,0.04)', border: `1px solid ${form.financialGoal === g ? C : 'rgba(255,255,255,0.08)'}`, color: form.financialGoal === g ? C2 : '#64748b', fontSize: 11, cursor: 'pointer' }}>
                      {g}
                    </button>
                  ))}
                </div>
              </Card>
            </div>
            {error && <div style={{ marginTop: '1rem', padding: '10px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, color: '#fca5a5', fontSize: 13 }}>⚠ {error}</div>}
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleAnalyze}
              style={{ marginTop: '1.5rem', width: '100%', padding: 16, borderRadius: 14, border: 'none', cursor: 'pointer', background: `linear-gradient(135deg,${C},#38bdf8)`, color: '#fff', fontWeight: 800, fontSize: 16, boxShadow: `0 6px 24px ${C}35` }}>
              💰 Build My Financial Plan
            </motion.button>
          </motion.div>
        )}

        {mode === 'loading' && <LoadingScreen />}

        {mode === 'result' && result && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <Card accent={C}>
              <Title icon="💰" title="Financial Analysis" badge={`${result.confidence}% Confidence`} />
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <Ring value={result.confidence} size={120} stroke={10} label="AI Confidence" />
              </div>
              <div style={{ padding: '1rem 1.25rem', background: `${C}08`, borderLeft: `3px solid ${C}`, borderRadius: '0 10px 10px 0', marginBottom: '1rem' }}>
                <div style={{ color: '#64748b', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 6 }}>AI Recommendation</div>
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
              <Title icon="🧠" title="AI Reasoning" />
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
            <div style={{ padding: '1rem', background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: 12, display: 'flex', gap: 10 }}>
              <span>⚠️</span>
              <p style={{ color: '#94a3b8', fontSize: 12, lineHeight: 1.7, margin: 0 }}>
                <strong style={{ color: '#f59e0b' }}>Disclaimer:</strong> This AI analysis is for informational purposes only. Always consult a certified financial advisor before making investment decisions.
              </p>
            </div>
            <button onClick={() => { setMode('input'); setResult(null); }}
              style={{ padding: 14, borderRadius: 14, background: `${C}0a`, border: `1px solid ${C}20`, color: C2, fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
              ↺ New Analysis
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
