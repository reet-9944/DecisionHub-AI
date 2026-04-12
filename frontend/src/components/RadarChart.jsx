import React from 'react';
import { motion } from 'framer-motion';

export default function RadarChart({ data = [], color = '#7c3aed', size = 200 }) {
  if (!data || data.length < 3) return null;

  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.38;
  const n = data.length;

  const angleStep = (2 * Math.PI) / n;
  const getPoint = (i, val) => {
    const angle = i * angleStep - Math.PI / 2;
    const radius = r * (val / 100);
    return { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) };
  };

  const gridLevels = [0.25, 0.5, 0.75, 1];
  const dataPoints = data.map((d, i) => getPoint(i, d.value));
  const pathD = dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ') + 'Z';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Grid */}
        {gridLevels.map((level, li) => {
          const pts = data.map((_, i) => {
            const angle = i * angleStep - Math.PI / 2;
            return `${cx + r * level * Math.cos(angle)},${cy + r * level * Math.sin(angle)}`;
          });
          return (
            <polygon
              key={li}
              points={pts.join(' ')}
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="1"
            />
          );
        })}

        {/* Axes */}
        {data.map((_, i) => {
          const angle = i * angleStep - Math.PI / 2;
          return (
            <line
              key={i}
              x1={cx} y1={cy}
              x2={cx + r * Math.cos(angle)}
              y2={cy + r * Math.sin(angle)}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="1"
            />
          );
        })}

        {/* Data polygon */}
        <motion.path
          d={pathD}
          fill={`${color}22`}
          stroke={color}
          strokeWidth="2"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        />

        {/* Data points */}
        {dataPoints.map((p, i) => (
          <motion.circle
            key={i}
            cx={p.x} cy={p.y} r={4}
            fill={color}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 + i * 0.05 }}
          />
        ))}

        {/* Labels */}
        {data.map((d, i) => {
          const angle = i * angleStep - Math.PI / 2;
          const lx = cx + (r + 18) * Math.cos(angle);
          const ly = cy + (r + 18) * Math.sin(angle);
          return (
            <text
              key={i}
              x={lx} y={ly}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#64748b"
              fontSize="9"
              fontFamily="Inter, sans-serif"
            >
              {d.label}
            </text>
          );
        })}
      </svg>

      {/* Legend */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
        {data.map((d, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
            <span style={{ color: '#64748b', fontSize: 11 }}>{d.label}: <span style={{ color: '#94a3b8', fontWeight: 600 }}>{d.value}%</span></span>
          </div>
        ))}
      </div>
    </div>
  );
}
