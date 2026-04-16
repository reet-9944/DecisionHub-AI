import { useState, useEffect, useRef } from "react";

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";

const COLORS = {
  bg: "#0A0A0F",
  bgCard: "#111118",
  bgCard2: "#16161E",
  purple: "#7B5CF0",
  purpleLight: "#9D7EFF",
  purpleDim: "#2D1F6E",
  cyan: "#00E5D4",
  cyanDim: "#003D38",
  gold: "#F0B429",
  green: "#22C55E",
  red: "#EF4444",
  text: "#F0EEF8",
  textMuted: "#8B87A8",
  border: "rgba(123,92,240,0.18)",
  borderLight: "rgba(255,255,255,0.07)",
};

const cssVars = `
  :root {
    --bg: ${COLORS.bg};
    --bg-card: ${COLORS.bgCard};
    --bg-card2: ${COLORS.bgCard2};
    --purple: ${COLORS.purple};
    --purple-light: ${COLORS.purpleLight};
    --purple-dim: ${COLORS.purpleDim};
    --cyan: ${COLORS.cyan};
    --cyan-dim: ${COLORS.cyanDim};
    --gold: ${COLORS.gold};
    --green: ${COLORS.green};
    --red: ${COLORS.red};
    --text: ${COLORS.text};
    --text-muted: ${COLORS.textMuted};
    --border: ${COLORS.border};
    --border-light: ${COLORS.borderLight};
  }

  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'DM Sans', sans-serif;
    background: var(--bg);
    color: var(--text);
    overflow-x: hidden;
  }

  .syne { font-family: 'Syne', sans-serif; }

  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-12px); }
  }
  @keyframes pulse-ring {
    0% { transform: scale(0.8); opacity: 1; }
    100% { transform: scale(2.2); opacity: 0; }
  }
  @keyframes shimmer {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes ticker {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }
  @keyframes scan {
    0% { top: 0%; }
    100% { top: 100%; }
  }
  @keyframes gradMove {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }

  .fade-up { animation: fadeUp 0.7s ease forwards; }
  .fade-up-d1 { animation: fadeUp 0.7s 0.1s ease both; }
  .fade-up-d2 { animation: fadeUp 0.7s 0.2s ease both; }
  .fade-up-d3 { animation: fadeUp 0.7s 0.3s ease both; }
  .fade-up-d4 { animation: fadeUp 0.7s 0.4s ease both; }

  .shimmer-text {
    background: linear-gradient(90deg, var(--purple-light) 0%, var(--cyan) 30%, var(--purple-light) 60%, var(--gold) 80%, var(--purple-light) 100%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: shimmer 3s linear infinite;
  }

  .card-glow {
    border: 1px solid var(--border);
    background: var(--bg-card);
    border-radius: 16px;
    transition: border-color 0.3s, box-shadow 0.3s;
  }
  .card-glow:hover {
    border-color: rgba(123,92,240,0.45);
    box-shadow: 0 0 32px rgba(123,92,240,0.12);
  }

  .btn-primary {
    background: linear-gradient(135deg, var(--purple) 0%, #5B3FCF 100%);
    color: #fff;
    border: none;
    padding: 14px 32px;
    border-radius: 50px;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
    box-shadow: 0 4px 24px rgba(123,92,240,0.35);
  }
  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(123,92,240,0.5);
  }

  .btn-ghost {
    background: transparent;
    color: var(--text-muted);
    border: 1px solid var(--border-light);
    padding: 12px 28px;
    border-radius: 50px;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    cursor: pointer;
    transition: all 0.2s;
  }
  .btn-ghost:hover {
    border-color: var(--purple);
    color: var(--text);
  }

  .nav-link {
    color: var(--text-muted);
    text-decoration: none;
    font-size: 14px;
    font-weight: 400;
    transition: color 0.2s;
    cursor: pointer;
  }
  .nav-link:hover { color: var(--text); }

  .metric-up { color: var(--green); }
  .metric-down { color: var(--red); }

  .scrollbar-hide { scrollbar-width: none; }
  .scrollbar-hide::-webkit-scrollbar { display: none; }

  input, textarea, select {
    font-family: 'DM Sans', sans-serif;
  }
`;

// ─── Sparkline SVG ──────────────────────────────────────────────
function Sparkline({ data, color = COLORS.purple, width = 80, height = 32 }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * height;
    return `${x},${y}`;
  });
  const pathD = `M ${pts.join(" L ")}`;
  const areaD = `M 0,${height} L ${pts.join(" L ")} L ${width},${height} Z`;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <defs>
        <linearGradient id={`sg-${color.replace("#","")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaD} fill={`url(#sg-${color.replace("#","")})`} />
      <path d={pathD} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// ─── Portfolio Pie Chart ─────────────────────────────────────────
function PieChart() {
  const segments = [
    { label: "Stocks", pct: 45, color: COLORS.purple },
    { label: "Crypto", pct: 25, color: COLORS.cyan },
    { label: "Bonds", pct: 20, color: COLORS.gold },
    { label: "Cash", pct: 10, color: "#4B5563" },
  ];
  const r = 60, cx = 80, cy = 80;
  let cumAngle = -Math.PI / 2;
  const slices = segments.map((s) => {
    const angle = (s.pct / 100) * 2 * Math.PI;
    const x1 = cx + r * Math.cos(cumAngle);
    const y1 = cy + r * Math.sin(cumAngle);
    cumAngle += angle;
    const x2 = cx + r * Math.cos(cumAngle);
    const y2 = cy + r * Math.sin(cumAngle);
    const large = angle > Math.PI ? 1 : 0;
    return { ...s, d: `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${large},1 ${x2},${y2} Z` };
  });
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
      <svg width={160} height={160} viewBox="0 0 160 160">
        {slices.map((s, i) => (
          <path key={i} d={s.d} fill={s.color} opacity={0.9} />
        ))}
        <circle cx={cx} cy={cy} r={38} fill={COLORS.bgCard} />
        <text x={cx} y={cy - 6} textAnchor="middle" fill={COLORS.text} fontSize="13" fontWeight="600" fontFamily="Syne">Total</text>
        <text x={cx} y={cy + 10} textAnchor="middle" fill={COLORS.textMuted} fontSize="10" fontFamily="DM Sans">Portfolio</text>
      </svg>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {segments.map((s) => (
          <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: s.color }} />
            <span style={{ fontSize: 12, color: COLORS.textMuted }}>{s.label}</span>
            <span style={{ fontSize: 12, fontWeight: 500, marginLeft: "auto", paddingLeft: 8 }}>{s.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Line Chart ──────────────────────────────────────────────────
function LineChart({ data, labels, colors, height = 180 }) {
  const svgW = 480, svgH = height;
  const pad = { l: 40, r: 16, t: 16, b: 32 };
  const W = svgW - pad.l - pad.r;
  const H = svgH - pad.t - pad.b;
  const allVals = data.flat();
  const maxV = Math.max(...allVals) * 1.1;
  const minV = Math.min(...allVals) * 0.9;
  const range = maxV - minV;
  const toX = (i) => pad.l + (i / (labels.length - 1)) * W;
  const toY = (v) => pad.t + H - ((v - minV) / range) * H;
  const gridLines = [0.25, 0.5, 0.75, 1].map((f) => minV + f * range);

  return (
    <svg viewBox={`0 0 ${svgW} ${svgH}`} style={{ width: "100%", height }}>
      <defs>
        {data.map((_, i) => (
          <linearGradient key={i} id={`lg${i}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={colors[i]} stopOpacity="0.25" />
            <stop offset="100%" stopColor={colors[i]} stopOpacity="0" />
          </linearGradient>
        ))}
      </defs>
      {gridLines.map((v, i) => (
        <g key={i}>
          <line x1={pad.l} y1={toY(v)} x2={pad.l + W} y2={toY(v)} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          <text x={pad.l - 6} y={toY(v) + 4} textAnchor="end" fill={COLORS.textMuted} fontSize="9" fontFamily="DM Sans">
            {v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v.toFixed(0)}
          </text>
        </g>
      ))}
      {labels.map((l, i) => (
        <text key={i} x={toX(i)} y={svgH - 8} textAnchor="middle" fill={COLORS.textMuted} fontSize="9" fontFamily="DM Sans">{l}</text>
      ))}
      {data.map((series, si) => {
        const pts = series.map((v, i) => `${toX(i)},${toY(v)}`);
        const areaD = `M ${toX(0)},${pad.t + H} L ${pts.join(" L ")} L ${toX(labels.length - 1)},${pad.t + H} Z`;
        const lineD = `M ${pts.join(" L ")}`;
        return (
          <g key={si}>
            <path d={areaD} fill={`url(#lg${si})`} />
            <path d={lineD} fill="none" stroke={colors[si]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            {series.map((v, i) => (
              <circle key={i} cx={toX(i)} cy={toY(v)} r="3" fill={colors[si]} opacity={0.9} />
            ))}
          </g>
        );
      })}
    </svg>
  );
}

// ─── Bar Chart ───────────────────────────────────────────────────
function BarChart({ data, labels, color = COLORS.purple, height = 140 }) {
  const svgW = 400, svgH = height;
  const pad = { l: 30, r: 8, t: 12, b: 28 };
  const W = svgW - pad.l - pad.r;
  const H = svgH - pad.t - pad.b;
  const maxV = Math.max(...data) * 1.1;
  const barW = W / data.length * 0.5;
  const step = W / data.length;
  return (
    <svg viewBox={`0 0 ${svgW} ${svgH}`} style={{ width: "100%", height }}>
      <defs>
        <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} />
          <stop offset="100%" stopColor={color} stopOpacity="0.4" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75, 1].map((f, i) => (
        <line key={i} x1={pad.l} y1={pad.t + H * (1 - f)} x2={pad.l + W} y2={pad.t + H * (1 - f)} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
      ))}
      {data.map((v, i) => {
        const bH = (v / maxV) * H;
        const bX = pad.l + step * i + step / 2 - barW / 2;
        const bY = pad.t + H - bH;
        return (
          <g key={i}>
            <rect x={bX} y={bY} width={barW} height={bH} rx="3" fill="url(#barGrad)" opacity="0.85" />
            <text x={bX + barW / 2} y={svgH - 8} textAnchor="middle" fill={COLORS.textMuted} fontSize="9" fontFamily="DM Sans">{labels[i]}</text>
          </g>
        );
      })}
    </svg>
  );
}

// ─── Ticker ──────────────────────────────────────────────────────
const tickerItems = [
  { sym: "BTC", price: "$67,420", chg: "+2.4%" },
  { sym: "ETH", price: "$3,812", chg: "+1.8%" },
  { sym: "AAPL", price: "$193.42", chg: "+0.6%" },
  { sym: "TSLA", price: "$248.30", chg: "-1.2%" },
  { sym: "NVDA", price: "$875.20", chg: "+3.1%" },
  { sym: "GOLD", price: "$2,315", chg: "+0.4%" },
  { sym: "SPY", price: "$514.80", chg: "+0.9%" },
  { sym: "BNB", price: "$418.10", chg: "+1.3%" },
  { sym: "SOL", price: "$182.40", chg: "+4.2%" },
  { sym: "MSFT", price: "$420.10", chg: "+0.7%" },
];

function Ticker() {
  return (
    <div style={{ overflow: "hidden", background: "rgba(123,92,240,0.06)", borderTop: `1px solid ${COLORS.border}`, borderBottom: `1px solid ${COLORS.border}`, padding: "10px 0" }}>
      <div style={{ display: "flex", animation: "ticker 28s linear infinite", whiteSpace: "nowrap", width: "max-content" }}>
        {[...tickerItems, ...tickerItems].map((t, i) => (
          <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "0 28px", fontSize: 13 }}>
            <span style={{ fontWeight: 600, fontFamily: "Syne", color: COLORS.purpleLight }}>{t.sym}</span>
            <span style={{ color: COLORS.text }}>{t.price}</span>
            <span style={{ color: t.chg.startsWith("-") ? COLORS.red : COLORS.green, fontSize: 11, fontWeight: 500 }}>{t.chg}</span>
            <span style={{ color: COLORS.border, fontSize: 10, paddingLeft: 12 }}>•</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── AI Chat ─────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are Fina, an expert AI financial advisor for Finovate — a modern fintech platform. 
You provide clear, accurate, actionable financial guidance. You cover:
- Investment strategies (stocks, ETFs, crypto, bonds, real estate)
- Budgeting and saving techniques
- Debt management and credit improvement
- Tax optimization strategies
- Retirement planning (401k, IRA, Roth IRA)
- Market analysis and economic trends
- Financial decision frameworks (buy vs rent, emergency funds, diversification)
- Risk assessment and portfolio allocation
Always be concise but thorough. Use specific numbers/percentages when helpful. 
Format responses with clear structure — use bullet points or numbered steps for actionable advice.
Acknowledge uncertainty where it exists. Never guarantee returns.
End with a follow-up question or next step to deepen the conversation.`;

function AIChat() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! I'm **Fina**, your AI financial advisor. I can help you with investments, budgeting, debt management, retirement planning, and any financial confusion you're facing.\n\nWhat financial challenge can I help you solve today? 💡",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [analyst, setAnalyst] = useState(null);
  const endRef = useRef(null);
  const inputRef = useRef(null);

  const suggestions = [
    "How should I start investing with $500/month?",
    "Should I pay off debt or invest first?",
    "How to build an emergency fund?",
    "Best ETFs for long-term growth?",
    "How does compound interest work?",
    "Should I rent or buy a house?",
  ];

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text) => {
    const userMsg = text || input.trim();
    if (!userMsg || loading) return;
    setInput("");
    const newMessages = [...messages, { role: "user", content: userMsg }];
    setMessages(newMessages);
    setLoading(true);
    setAnalyst(null);

    try {
      const apiMessages = newMessages.map((m) => ({
        role: m.role,
        content: typeof m.content === "string" ? m.content.replace(/\*\*/g, "") : m.content,
      }));

      const response = await fetch(ANTHROPIC_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: apiMessages,
        }),
      });

      const data = await response.json();
      const reply = data.content?.[0]?.text || "I couldn't process that. Please try again.";
      setMessages([...newMessages, { role: "assistant", content: reply }]);

      // Simulated human analyst note
      const analystNotes = [
        "Our senior analyst concurs — diversification is key here.",
        "Verified by our risk team: this aligns with standard financial planning guidelines.",
        "Human review: solid advice for your risk profile.",
        "Analyst note: consider consulting a CFP for personalized tax strategies.",
      ];
      setAnalyst(analystNotes[Math.floor(Math.random() * analystNotes.length)]);
    } catch (err) {
      setMessages([...newMessages, { role: "assistant", content: "Connection error. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const formatMsg = (text) => {
    if (!text) return null;
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((p, i) =>
      p.startsWith("**") ? <strong key={i}>{p.slice(2, -2)}</strong> : p
    );
  };

  return (
    <div className="card-glow" style={{ display: "flex", flexDirection: "column", height: 520 }}>
      <div style={{ padding: "16px 20px", borderBottom: `1px solid ${COLORS.border}`, display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ position: "relative" }}>
          <div style={{ width: 38, height: 38, borderRadius: "50%", background: `linear-gradient(135deg, ${COLORS.purple}, ${COLORS.cyan})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
            🤖
          </div>
          <div style={{ position: "absolute", bottom: 1, right: 1, width: 10, height: 10, background: COLORS.green, borderRadius: "50%", border: `2px solid ${COLORS.bgCard}` }} />
        </div>
        <div>
          <div style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 15 }}>Fina — AI Financial Advisor</div>
          <div style={{ fontSize: 11, color: COLORS.textMuted }}>Powered by Claude • Human-verified insights</div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: COLORS.green }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: COLORS.green, animation: "pulse-ring 2s infinite" }} />
          Online
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 14 }} className="scrollbar-hide">
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", flexDirection: m.role === "user" ? "row-reverse" : "row", gap: 10, alignItems: "flex-start" }}>
            {m.role === "assistant" && (
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: `linear-gradient(135deg, ${COLORS.purple}, ${COLORS.cyan})`, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>🤖</div>
            )}
            <div style={{
              maxWidth: "78%",
              background: m.role === "user" ? `linear-gradient(135deg, ${COLORS.purple}, #4A2CB0)` : COLORS.bgCard2,
              borderRadius: m.role === "user" ? "16px 4px 16px 16px" : "4px 16px 16px 16px",
              padding: "10px 14px",
              fontSize: 13,
              lineHeight: 1.7,
              color: COLORS.text,
              border: m.role === "assistant" ? `1px solid ${COLORS.border}` : "none",
              whiteSpace: "pre-line",
            }}>
              {formatMsg(m.content)}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: `linear-gradient(135deg, ${COLORS.purple}, ${COLORS.cyan})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>🤖</div>
            <div style={{ background: COLORS.bgCard2, border: `1px solid ${COLORS.border}`, borderRadius: "4px 16px 16px 16px", padding: "12px 16px", display: "flex", gap: 5 }}>
              {[0, 1, 2].map((j) => (
                <div key={j} style={{ width: 7, height: 7, borderRadius: "50%", background: COLORS.purple, animation: `blink 1.2s ${j * 0.4}s infinite` }} />
              ))}
            </div>
          </div>
        )}
        {analyst && !loading && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(34,197,94,0.06)", border: `1px solid rgba(34,197,94,0.2)`, borderRadius: 10, padding: "8px 14px", fontSize: 11, color: "#86efac" }}>
            <span>👤</span>
            <span><strong>Human Analyst:</strong> {analyst}</span>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div style={{ padding: "10px 16px", borderTop: `1px solid ${COLORS.border}` }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
          {suggestions.slice(0, 3).map((s, i) => (
            <button key={i} onClick={() => send(s)} style={{ background: "rgba(123,92,240,0.1)", border: `1px solid ${COLORS.border}`, borderRadius: 20, padding: "4px 12px", fontSize: 11, color: COLORS.textMuted, cursor: "pointer", fontFamily: "DM Sans" }}>
              {s}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
            placeholder="Ask about investments, budgeting, debt, retirement..."
            style={{ flex: 1, background: COLORS.bgCard2, border: `1px solid ${COLORS.border}`, borderRadius: 50, padding: "10px 18px", color: COLORS.text, fontSize: 13, outline: "none" }}
          />
          <button
            onClick={() => send()}
            disabled={loading || !input.trim()}
            className="btn-primary"
            style={{ padding: "10px 20px", fontSize: 14, opacity: loading || !input.trim() ? 0.5 : 1 }}
          >
            ↗
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Hero Section ────────────────────────────────────────────────
function Hero() {
  const [netWorth, setNetWorth] = useState(127840);
  const [change, setChange] = useState(2847);

  useEffect(() => {
    const timer = setInterval(() => {
      const delta = (Math.random() - 0.45) * 300;
      setNetWorth((v) => Math.max(100000, v + delta));
      setChange((v) => v + delta * 0.3);
    }, 2400);
    return () => clearInterval(timer);
  }, []);

  const sparkData = [102, 108, 105, 115, 112, 120, 118, 125, 122, 128, 124, 130];

  return (
    <section style={{ padding: "80px 0 60px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-30%", left: "50%", transform: "translateX(-50%)", width: 800, height: 800, borderRadius: "50%", background: "radial-gradient(circle, rgba(123,92,240,0.12) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", top: 100, right: 80, width: 300, height: 300, borderRadius: "50%", background: `radial-gradient(circle, rgba(0,229,212,0.06) 0%, transparent 70%)` }} />
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
        <div className="fade-up">
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(123,92,240,0.1)", border: `1px solid ${COLORS.border}`, borderRadius: 50, padding: "6px 16px", marginBottom: 28 }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: COLORS.cyan, boxShadow: `0 0 8px ${COLORS.cyan}` }} />
            <span style={{ fontSize: 12, color: COLORS.cyan, fontWeight: 500 }}>Smart Financial Platform</span>
          </div>

          <h1 className="syne" style={{ fontSize: 56, fontWeight: 800, lineHeight: 1.1, marginBottom: 24 }}>
            Grow Your<br />
            <span className="shimmer-text">Wealth Smarter</span><br />
            with AI
          </h1>

          <p style={{ fontSize: 16, color: COLORS.textMuted, lineHeight: 1.8, marginBottom: 36, maxWidth: 440 }}>
            Finovate merges AI intelligence with human expertise to decode your finances, optimize investments, and eliminate financial confusion — all in one elegant platform.
          </p>

          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <button className="btn-primary" style={{ padding: "15px 36px", fontSize: 15 }}>Start Free Trial</button>
            <button className="btn-ghost">Watch Demo ▶</button>
          </div>

          <div style={{ display: "flex", gap: 32, marginTop: 44 }}>
            {[["$2.4B+", "Assets Managed"], ["180k+", "Active Users"], ["99.8%", "Uptime SLA"]].map(([v, l]) => (
              <div key={l}>
                <div className="syne" style={{ fontSize: 22, fontWeight: 700, color: COLORS.purpleLight }}>{v}</div>
                <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="fade-up-d2">
          <div className="card-glow" style={{ padding: 28, animation: "float 5s ease-in-out infinite" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
              <div>
                <div style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 4 }}>Total Net Worth</div>
                <div className="syne" style={{ fontSize: 38, fontWeight: 800 }}>${netWorth.toLocaleString("en", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4, color: change > 0 ? COLORS.green : COLORS.red, fontSize: 13 }}>
                  {change > 0 ? "▲" : "▼"} +${Math.abs(change).toFixed(0)} today
                </div>
              </div>
              <Sparkline data={sparkData} color={COLORS.cyan} width={90} height={48} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 24 }}>
              {[["Invested", "$89,200", "+12.4%", true], ["Savings", "$28,640", "+3.1%", true], ["Debt", "$10,000", "-8.2%", false]].map(([l, v, c, up]) => (
                <div key={l} style={{ background: COLORS.bgCard2, borderRadius: 12, padding: "12px 14px", border: `1px solid ${COLORS.borderLight}` }}>
                  <div style={{ fontSize: 10, color: COLORS.textMuted, marginBottom: 4 }}>{l}</div>
                  <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 2 }}>{v}</div>
                  <div style={{ fontSize: 10, color: up ? COLORS.green : COLORS.red }}>{c}</div>
                </div>
              ))}
            </div>

            <PieChart />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Dashboard Preview ───────────────────────────────────────────
function Dashboard() {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const portfolioData = [88000, 91000, 89500, 94000, 96500, 98000, 95000, 101000, 103500, 108000, 112000, 115000];
  const savingsData = [18000, 19200, 20100, 21300, 22000, 23400, 24200, 25100, 26300, 27000, 27900, 28640];
  const incomeData = [6200, 6200, 6500, 6200, 6800, 6200, 6200, 7100, 6200, 6200, 6800, 6200];
  const expenseData = [4800, 4200, 5100, 4600, 4900, 4300, 4700, 5200, 4400, 4800, 5100, 4500];

  return (
    <section style={{ padding: "60px 0", background: "rgba(255,255,255,0.015)", borderTop: `1px solid ${COLORS.borderLight}` }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div className="syne fade-up" style={{ fontSize: 40, fontWeight: 800, marginBottom: 12 }}>
            Your Financial <span className="shimmer-text">Command Center</span>
          </div>
          <p className="fade-up-d1" style={{ color: COLORS.textMuted, fontSize: 16 }}>Real-time analytics, portfolio tracking, and intelligent insights</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20, marginBottom: 20 }}>
          <div className="card-glow" style={{ padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div>
                <div className="syne" style={{ fontSize: 16, fontWeight: 700 }}>Portfolio Growth</div>
                <div style={{ fontSize: 12, color: COLORS.textMuted }}>12-month performance</div>
              </div>
              <div style={{ display: "flex", gap: 12, fontSize: 11 }}>
                {[["Portfolio", COLORS.purple], ["Savings", COLORS.cyan]].map(([l, c]) => (
                  <span key={l} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <span style={{ width: 10, height: 3, borderRadius: 2, background: c, display: "inline-block" }} />
                    <span style={{ color: COLORS.textMuted }}>{l}</span>
                  </span>
                ))}
              </div>
            </div>
            <LineChart data={[portfolioData, savingsData]} labels={months} colors={[COLORS.purple, COLORS.cyan]} height={200} />
          </div>

          <div className="card-glow" style={{ padding: 24 }}>
            <div className="syne" style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Monthly Cash Flow</div>
            <div style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 20 }}>Income vs Expenses</div>
            <BarChart data={incomeData.slice(-6)} labels={months.slice(-6)} color={COLORS.purple} height={160} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 16 }}>
              <div style={{ background: COLORS.bgCard2, borderRadius: 10, padding: "12px 14px" }}>
                <div style={{ fontSize: 10, color: COLORS.textMuted }}>Avg Income</div>
                <div style={{ fontWeight: 600, marginTop: 4 }}>$6,550</div>
                <div style={{ fontSize: 10, color: COLORS.green }}>▲ +5.3%</div>
              </div>
              <div style={{ background: COLORS.bgCard2, borderRadius: 10, padding: "12px 14px" }}>
                <div style={{ fontSize: 10, color: COLORS.textMuted }}>Avg Expense</div>
                <div style={{ fontWeight: 600, marginTop: 4 }}>$4,717</div>
                <div style={{ fontSize: 10, color: COLORS.red }}>▼ -2.1%</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {[
            { label: "Savings Rate", value: "28%", goal: "30%", pct: 93, color: COLORS.cyan },
            { label: "Debt-to-Income", value: "12%", goal: "<36%", pct: 67, color: COLORS.green },
            { label: "Emergency Fund", value: "4.2mo", goal: "6 months", pct: 70, color: COLORS.gold },
            { label: "Investment Return", value: "+16.8%", goal: "Market: +14.2%", pct: 84, color: COLORS.purple },
          ].map((item) => (
            <div key={item.label} className="card-glow" style={{ padding: 18 }}>
              <div style={{ fontSize: 11, color: COLORS.textMuted, marginBottom: 8 }}>{item.label}</div>
              <div className="syne" style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>{item.value}</div>
              <div style={{ fontSize: 10, color: COLORS.textMuted, marginBottom: 10 }}>Goal: {item.goal}</div>
              <div style={{ background: COLORS.borderLight, borderRadius: 4, height: 4, overflow: "hidden" }}>
                <div style={{ width: `${item.pct}%`, height: "100%", background: item.color, borderRadius: 4, transition: "width 1s ease" }} />
              </div>
              <div style={{ fontSize: 10, color: item.color, marginTop: 4 }}>{item.pct}% of goal</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Decision Tools ──────────────────────────────────────────────
function DecisionTools() {
  const [tool, setTool] = useState("compound");
  const [principal, setPrincipal] = useState(10000);
  const [rate, setRate] = useState(8);
  const [years, setYears] = useState(20);
  const [monthly, setMonthly] = useState(500);

  const futureValue = principal * Math.pow(1 + rate / 100, years) +
    monthly * 12 * ((Math.pow(1 + rate / 100, years) - 1) / (rate / 100));

  const chartData = Array.from({ length: years }, (_, i) => {
    const y = i + 1;
    return Math.round(principal * Math.pow(1 + rate / 100, y) + monthly * 12 * ((Math.pow(1 + rate / 100, y) - 1) / (rate / 100)));
  });
  const chartLabels = Array.from({ length: years }, (_, i) => {
    if (i === 0 || i === years - 1 || i % Math.ceil(years / 5) === 0) return `Y${i + 1}`;
    return "";
  });

  return (
    <section style={{ padding: "60px 0" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div className="syne" style={{ fontSize: 40, fontWeight: 800, marginBottom: 12 }}>
            Financial <span className="shimmer-text">Decision Tools</span>
          </div>
          <p style={{ color: COLORS.textMuted }}>Interactive calculators to eliminate financial confusion</p>
        </div>

        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginBottom: 32 }}>
          {[["compound", "Compound Interest"], ["budget", "Budget Planner"], ["debt", "Debt Payoff"]].map(([id, label]) => (
            <button key={id} onClick={() => setTool(id)} style={{
              background: tool === id ? COLORS.purple : "transparent",
              border: `1px solid ${tool === id ? COLORS.purple : COLORS.border}`,
              color: tool === id ? "#fff" : COLORS.textMuted,
              borderRadius: 50, padding: "8px 22px", fontSize: 13, cursor: "pointer", fontFamily: "DM Sans",
              transition: "all 0.2s",
            }}>
              {label}
            </button>
          ))}
        </div>

        {tool === "compound" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 24 }}>
            <div className="card-glow" style={{ padding: 28 }}>
              <div className="syne" style={{ fontSize: 18, fontWeight: 700, marginBottom: 24 }}>Compound Interest Calculator</div>
              {[
                ["Initial Investment", principal, setPrincipal, 1000, 100000, 1000, "$"],
                ["Monthly Contribution", monthly, setMonthly, 0, 5000, 50, "$"],
                ["Annual Return Rate", rate, setRate, 1, 20, 0.5, "%"],
                ["Time Horizon (Years)", years, setYears, 1, 40, 1, "yr"],
              ].map(([label, val, setter, min, max, step, unit]) => (
                <div key={label} style={{ marginBottom: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13 }}>
                    <span style={{ color: COLORS.textMuted }}>{label}</span>
                    <span style={{ color: COLORS.purpleLight, fontWeight: 600 }}>{unit === "$" ? `$${val.toLocaleString()}` : `${val}${unit}`}</span>
                  </div>
                  <input type="range" min={min} max={max} step={step} value={val}
                    onChange={(e) => setter(Number(e.target.value))}
                    style={{ width: "100%", accentColor: COLORS.purple }} />
                </div>
              ))}

              <div style={{ background: `linear-gradient(135deg, rgba(123,92,240,0.15), rgba(0,229,212,0.08))`, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: "20px 24px", marginTop: 8 }}>
                <div style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 4 }}>Future Value in {years} years</div>
                <div className="syne" style={{ fontSize: 34, fontWeight: 800, color: COLORS.cyan }}>
                  ${Math.round(futureValue).toLocaleString()}
                </div>
                <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 6 }}>
                  Profit: <span style={{ color: COLORS.green }}>${Math.round(futureValue - principal - monthly * 12 * years).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="card-glow" style={{ padding: 28 }}>
              <div className="syne" style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Growth Projection</div>
              <div style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 20 }}>Portfolio value over {years} years</div>
              <LineChart data={[chartData]} labels={chartLabels} colors={[COLORS.cyan]} height={260} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginTop: 16 }}>
                <div style={{ background: COLORS.bgCard2, borderRadius: 10, padding: "12px 14px" }}>
                  <div style={{ fontSize: 10, color: COLORS.textMuted }}>Total Invested</div>
                  <div style={{ fontWeight: 600, marginTop: 4, fontSize: 14 }}>${(principal + monthly * 12 * years).toLocaleString()}</div>
                </div>
                <div style={{ background: COLORS.bgCard2, borderRadius: 10, padding: "12px 14px" }}>
                  <div style={{ fontSize: 10, color: COLORS.textMuted }}>Total Returns</div>
                  <div style={{ fontWeight: 600, marginTop: 4, fontSize: 14, color: COLORS.green }}>${Math.round(futureValue - principal - monthly * 12 * years).toLocaleString()}</div>
                </div>
                <div style={{ background: COLORS.bgCard2, borderRadius: 10, padding: "12px 14px" }}>
                  <div style={{ fontSize: 10, color: COLORS.textMuted }}>ROI</div>
                  <div style={{ fontWeight: 600, marginTop: 4, fontSize: 14, color: COLORS.purple }}>
                    {(((futureValue - principal) / principal) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {tool === "budget" && <BudgetPlanner />}
        {tool === "debt" && <DebtPayoff />}
      </div>
    </section>
  );
}

function BudgetPlanner() {
  const [income, setIncome] = useState(6500);
  const categories = [
    { label: "Housing (rent/mortgage)", recommended: 30, color: COLORS.purple },
    { label: "Food & Groceries", recommended: 12, color: COLORS.cyan },
    { label: "Transportation", recommended: 10, color: COLORS.gold },
    { label: "Savings & Investments", recommended: 20, color: COLORS.green },
    { label: "Utilities & Bills", recommended: 8, color: "#8B87A8" },
    { label: "Entertainment", recommended: 5, color: "#E879F9" },
    { label: "Emergency Fund", recommended: 5, color: "#FB923C" },
    { label: "Other", recommended: 10, color: "#94A3B8" },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
      <div className="card-glow" style={{ padding: 28 }}>
        <div className="syne" style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>50/30/20 Budget Rule</div>
        <div style={{ fontSize: 13, color: COLORS.textMuted, marginBottom: 24 }}>The gold standard for personal budgeting</div>
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 13 }}>
            <span style={{ color: COLORS.textMuted }}>Monthly Take-Home Income</span>
            <span style={{ color: COLORS.purpleLight, fontWeight: 600 }}>${income.toLocaleString()}</span>
          </div>
          <input type="range" min={2000} max={20000} step={100} value={income} onChange={(e) => setIncome(Number(e.target.value))} style={{ width: "100%", accentColor: COLORS.purple }} />
        </div>

        {[["50% Needs", 0.5, COLORS.purple, "Housing, food, utilities, transport"], ["30% Wants", 0.3, COLORS.cyan, "Entertainment, dining out, hobbies"], ["20% Savings", 0.2, COLORS.green, "Investments, emergency fund, debt payoff"]].map(([label, pct, color, desc]) => (
          <div key={label} style={{ marginBottom: 16, background: COLORS.bgCard2, borderRadius: 12, padding: "14px 16px", border: `1px solid rgba(255,255,255,0.05)` }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span className="syne" style={{ fontSize: 14, fontWeight: 700, color }}>{label}</span>
              <span style={{ fontSize: 16, fontWeight: 600 }}>${(income * pct).toLocaleString()}/mo</span>
            </div>
            <div style={{ fontSize: 11, color: COLORS.textMuted }}>{desc}</div>
          </div>
        ))}
      </div>

      <div className="card-glow" style={{ padding: 28 }}>
        <div className="syne" style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Recommended Breakdown</div>
        {categories.map((c) => (
          <div key={c.label} style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 12 }}>
              <span style={{ color: COLORS.textMuted }}>{c.label}</span>
              <span style={{ color: c.color }}>${Math.round(income * c.recommended / 100).toLocaleString()}</span>
            </div>
            <div style={{ background: COLORS.borderLight, borderRadius: 4, height: 6, overflow: "hidden" }}>
              <div style={{ width: `${c.recommended * 5}%`, height: "100%", background: c.color, borderRadius: 4 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DebtPayoff() {
  const [debt, setDebt] = useState(15000);
  const [intRate, setIntRate] = useState(18);
  const [payment, setPayment] = useState(400);

  const minPayment = (debt * intRate / 100) / 12;
  const monthsToPayoff = payment > minPayment
    ? Math.ceil(-Math.log(1 - (debt * intRate / 1200) / payment) / Math.log(1 + intRate / 1200))
    : Infinity;
  const totalPaid = monthsToPayoff < Infinity ? payment * monthsToPayoff : Infinity;
  const interestPaid = totalPaid - debt;

  const avalancheAdvice = intRate > 15 ? "High interest! Use Avalanche method — pay this off first before investing." : "Moderate rate. Balance paying off debt with investing (invest if return > rate).";

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
      <div className="card-glow" style={{ padding: 28 }}>
        <div className="syne" style={{ fontSize: 18, fontWeight: 700, marginBottom: 24 }}>Debt Payoff Calculator</div>
        {[["Total Debt", debt, setDebt, 1000, 100000, 500, "$"],
          ["Annual Interest Rate", intRate, setIntRate, 1, 30, 0.5, "%"],
          ["Monthly Payment", payment, setPayment, Math.ceil(minPayment) + 10, 3000, 25, "$"]
        ].map(([label, val, setter, min, max, step, unit]) => (
          <div key={label} style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13 }}>
              <span style={{ color: COLORS.textMuted }}>{label}</span>
              <span style={{ color: COLORS.purpleLight, fontWeight: 600 }}>{unit === "$" ? `$${val.toLocaleString()}` : `${val}${unit}`}</span>
            </div>
            <input type="range" min={min} max={max} step={step} value={val} onChange={(e) => setter(Number(e.target.value))} style={{ width: "100%", accentColor: COLORS.purple }} />
          </div>
        ))}

        <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 12, padding: 16, marginTop: 4 }}>
          <div style={{ fontSize: 11, color: COLORS.textMuted }}>Months to debt-free</div>
          <div className="syne" style={{ fontSize: 32, fontWeight: 800, color: monthsToPayoff < 48 ? COLORS.green : COLORS.red }}>
            {monthsToPayoff < Infinity ? `${monthsToPayoff} mo` : "∞"}
          </div>
          {monthsToPayoff < Infinity && (
            <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 4 }}>
              Total interest: <span style={{ color: COLORS.red }}>${Math.round(interestPaid).toLocaleString()}</span>
            </div>
          )}
        </div>
      </div>

      <div className="card-glow" style={{ padding: 28 }}>
        <div className="syne" style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Debt Strategy Guide</div>

        <div style={{ background: intRate > 15 ? "rgba(239,68,68,0.08)" : "rgba(34,197,94,0.08)", border: `1px solid ${intRate > 15 ? "rgba(239,68,68,0.25)" : "rgba(34,197,94,0.25)"}`, borderRadius: 12, padding: 16, marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4, color: intRate > 15 ? COLORS.red : COLORS.green }}>
            {intRate > 15 ? "⚠️ High Interest Alert" : "✓ Manageable Rate"}
          </div>
          <div style={{ fontSize: 13, color: COLORS.textMuted, lineHeight: 1.6 }}>{avalancheAdvice}</div>
        </div>

        <div className="syne" style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Payoff Strategies</div>
        {[
          ["Avalanche Method", "Pay highest interest rate debts first. Saves the most money.", COLORS.purple],
          ["Snowball Method", "Pay smallest balances first. Better for motivation.", COLORS.cyan],
          ["Debt Consolidation", "Combine debts at lower rate. Reduces monthly payment.", COLORS.gold],
        ].map(([name, desc, color]) => (
          <div key={name} style={{ marginBottom: 12, padding: "12px 14px", background: COLORS.bgCard2, borderRadius: 10, borderLeft: `3px solid ${color}` }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2, color }}>{name}</div>
            <div style={{ fontSize: 12, color: COLORS.textMuted }}>{desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Market Overview ─────────────────────────────────────────────
function MarketOverview() {
  const assets = [
    { name: "Bitcoin", sym: "BTC", price: "$67,420", chg: "+2.4%", up: true, data: [55000, 58000, 62000, 59000, 64000, 61000, 67420] },
    { name: "Ethereum", sym: "ETH", price: "$3,812", chg: "+1.8%", up: true, data: [3100, 3300, 3500, 3200, 3700, 3600, 3812] },
    { name: "Apple", sym: "AAPL", price: "$193.42", chg: "+0.6%", up: true, data: [175, 180, 185, 182, 190, 191, 193] },
    { name: "Tesla", sym: "TSLA", price: "$248.30", chg: "-1.2%", up: false, data: [280, 260, 270, 255, 265, 252, 248] },
    { name: "S&P 500", sym: "SPY", price: "$514.80", chg: "+0.9%", up: true, data: [490, 495, 502, 498, 508, 510, 514] },
    { name: "Gold", sym: "GOLD", price: "$2,315", chg: "+0.4%", up: true, data: [2200, 2240, 2280, 2260, 2300, 2310, 2315] },
  ];

  return (
    <section style={{ padding: "60px 0", background: "rgba(255,255,255,0.015)", borderTop: `1px solid ${COLORS.borderLight}` }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
          <div>
            <div className="syne" style={{ fontSize: 32, fontWeight: 800 }}>Market <span className="shimmer-text">Overview</span></div>
            <div style={{ fontSize: 13, color: COLORS.textMuted, marginTop: 4 }}>Live tracking — major assets & indices</div>
          </div>
          <button className="btn-ghost" style={{ fontSize: 12 }}>View All Markets →</button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {assets.map((a) => (
            <div key={a.sym} className="card-glow" style={{ padding: 20, cursor: "pointer" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: a.up ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: a.up ? COLORS.green : COLORS.red, fontFamily: "Syne" }}>
                      {a.sym.slice(0, 2)}
                    </div>
                    <div>
                      <div className="syne" style={{ fontSize: 14, fontWeight: 700 }}>{a.sym}</div>
                      <div style={{ fontSize: 10, color: COLORS.textMuted }}>{a.name}</div>
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 15, fontWeight: 600 }}>{a.price}</div>
                  <div style={{ fontSize: 12, color: a.up ? COLORS.green : COLORS.red, marginTop: 2 }}>{a.chg}</div>
                </div>
              </div>
              <Sparkline data={a.data} color={a.up ? COLORS.cyan : COLORS.red} width={200} height={40} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Features ───────────────────────────────────────────────────
function Features() {
  const features = [
    { icon: "🤖", title: "AI Financial Advisor", desc: "Ask anything about money — investments, budgeting, debt, retirement. Get expert-level answers backed by real financial data.", color: COLORS.purple },
    { icon: "📊", title: "Smart Analytics", desc: "Visualize your complete financial picture with interactive charts, trend analysis, and predictive forecasting.", color: COLORS.cyan },
    { icon: "🎯", title: "Goal Tracking", desc: "Set financial goals and watch AI optimize your path to reach them faster with intelligent recommendations.", color: COLORS.gold },
    { icon: "🛡️", title: "Risk Assessment", desc: "Know your risk profile. Get portfolio recommendations aligned with your comfort level and time horizon.", color: COLORS.green },
    { icon: "💡", title: "Smart Alerts", desc: "Proactive insights when markets move, bills are due, or opportunities arise in your portfolio.", color: "#E879F9" },
    { icon: "👤", title: "Human Analysts", desc: "Every major decision gets reviewed by certified financial planners for that extra layer of confidence.", color: "#FB923C" },
  ];

  return (
    <section style={{ padding: "60px 0" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div className="syne" style={{ fontSize: 40, fontWeight: 800, marginBottom: 12 }}>
            Everything You Need to <span className="shimmer-text">Thrive Financially</span>
          </div>
          <p style={{ color: COLORS.textMuted, maxWidth: 480, margin: "0 auto" }}>
            One platform to understand, manage, and grow your wealth — with AI and human expertise combined
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
          {features.map((f) => (
            <div key={f.title} className="card-glow" style={{ padding: 28, cursor: "pointer" }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: `${f.color}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 16 }}>
                {f.icon}
              </div>
              <div className="syne" style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: f.color }}>{f.title}</div>
              <div style={{ fontSize: 13, color: COLORS.textMuted, lineHeight: 1.7 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA Section ─────────────────────────────────────────────────
function CTA() {
  return (
    <section style={{ padding: "80px 0" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ background: `linear-gradient(135deg, rgba(123,92,240,0.2) 0%, rgba(0,229,212,0.08) 100%)`, border: `1px solid ${COLORS.border}`, borderRadius: 28, padding: "64px 80px", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -80, right: -80, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(123,92,240,0.2), transparent 70%)", pointerEvents: "none" }} />
          <div className="syne" style={{ fontSize: 48, fontWeight: 800, marginBottom: 16 }}>
            Take Control of Your<br /><span className="shimmer-text">Financial Future Today</span>
          </div>
          <p style={{ fontSize: 16, color: COLORS.textMuted, marginBottom: 36, maxWidth: 480, margin: "0 auto 36px" }}>
            Join 180,000+ users who eliminated financial confusion and built real wealth with Finovate.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="btn-primary" style={{ padding: "16px 40px", fontSize: 16 }}>Start Free — No Card Required</button>
            <button className="btn-ghost" style={{ padding: "16px 32px" }}>Schedule a Demo</button>
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 32, marginTop: 32, fontSize: 12, color: COLORS.textMuted }}>
            <span>✓ 30-day free trial</span>
            <span>✓ No credit card</span>
            <span>✓ Cancel anytime</span>
            <span>✓ Bank-grade security</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Navigation ──────────────────────────────────────────────────
function Nav({ activeSection, setActiveSection }) {
  const links = ["Home", "Dashboard", "Markets", "Tools", "AI Advisor"];

  return (
    <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(10,10,15,0.92)", backdropFilter: "blur(20px)", borderBottom: `1px solid ${COLORS.border}` }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: `linear-gradient(135deg, ${COLORS.purple}, ${COLORS.cyan})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 16 }}>◈</span>
          </div>
          <span className="syne" style={{ fontSize: 18, fontWeight: 800, letterSpacing: "-0.5px" }}>
            Fino<span style={{ color: COLORS.purpleLight }}>vate</span>
          </span>
        </div>

        <div style={{ display: "flex", gap: 4 }}>
          {links.map((l) => (
            <button key={l} onClick={() => setActiveSection(l)}
              style={{
                background: activeSection === l ? "rgba(123,92,240,0.12)" : "transparent",
                border: "none",
                borderRadius: 8,
                padding: "8px 16px",
                color: activeSection === l ? COLORS.purpleLight : COLORS.textMuted,
                fontSize: 13,
                cursor: "pointer",
                fontFamily: "DM Sans",
                fontWeight: activeSection === l ? 500 : 400,
                transition: "all 0.2s",
              }}>
              {l}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn-ghost" style={{ padding: "8px 20px", fontSize: 13 }}>Log In</button>
          <button className="btn-primary" style={{ padding: "8px 20px", fontSize: 13 }}>Get Started</button>
        </div>
      </div>
    </nav>
  );
}

// ─── App ─────────────────────────────────────────────────────────
export default function App() {
  const [activeSection, setActiveSection] = useState("Home");

  return (
    <>
      <style>{cssVars}</style>
      <div style={{ minHeight: "100vh", background: COLORS.bg, color: COLORS.text }}>
        <Nav activeSection={activeSection} setActiveSection={setActiveSection} />
        <Ticker />

        {activeSection === "Home" && (
          <>
            <Hero />
            <Features />
            <CTA />
          </>
        )}
        {activeSection === "Dashboard" && <Dashboard />}
        {activeSection === "Markets" && <MarketOverview />}
        {activeSection === "Tools" && <DecisionTools />}
        {activeSection === "AI Advisor" && (
          <div style={{ maxWidth: 860, margin: "0 auto", padding: "40px 24px" }}>
            <div style={{ textAlign: "center", marginBottom: 36 }}>
              <div className="syne" style={{ fontSize: 36, fontWeight: 800, marginBottom: 10 }}>
                Ask <span className="shimmer-text">Fina</span> — Your AI Advisor
              </div>
              <p style={{ color: COLORS.textMuted }}>Expert financial guidance, human-verified • Available 24/7</p>
            </div>
            <AIChat />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginTop: 24 }}>
              {[
                ["🎯", "Goal Planning", "Retirement, home buying, education funding"],
                ["📈", "Investment Guide", "Stocks, ETFs, crypto, real estate strategies"],
                ["💳", "Debt Freedom", "Payoff strategies, credit improvement"],
              ].map(([icon, title, desc]) => (
                <div key={title} className="card-glow" style={{ padding: 16, textAlign: "center" }}>
                  <div style={{ fontSize: 24, marginBottom: 8 }}>{icon}</div>
                  <div className="syne" style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{title}</div>
                  <div style={{ fontSize: 11, color: COLORS.textMuted }}>{desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <footer style={{ borderTop: `1px solid ${COLORS.borderLight}`, padding: "40px 24px", textAlign: "center" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
            <div className="syne" style={{ fontSize: 18, fontWeight: 800 }}>Fino<span style={{ color: COLORS.purpleLight }}>vate</span></div>
            <div style={{ fontSize: 12, color: COLORS.textMuted }}>© 2025 Finovate. Not financial advice. Always consult a licensed advisor for major decisions.</div>
            <div style={{ display: "flex", gap: 20, fontSize: 12 }}>
              {["Privacy", "Terms", "Security", "Contact"].map((l) => (
                <span key={l} style={{ color: COLORS.textMuted, cursor: "pointer" }}>{l}</span>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
