import { motion } from 'motion/react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

export function RadarChartCard() {
  const data = [
    { factor: 'Market', value: 85, fullMark: 100 },
    { factor: 'Risk', value: 68, fullMark: 100 },
    { factor: 'Growth', value: 72, fullMark: 100 },
    { factor: 'Execution', value: 80, fullMark: 100 },
    { factor: 'Resources', value: 75, fullMark: 100 },
    { factor: 'Timing', value: 82, fullMark: 100 },
  ];

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.2 }}
      whileHover={{ scale: 1.02 }}
      className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 shadow-xl"
    >
      <h3 className="text-lg text-white mb-4">Decision Factors Radar</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data}>
            <PolarGrid stroke="rgba(255, 255, 255, 0.2)" />
            <PolarAngleAxis 
              dataKey="factor" 
              tick={{ fill: 'rgba(255, 255, 255, 0.7)', fontSize: 12 }}
            />
            <PolarRadiusAxis 
              angle={90} 
              domain={[0, 100]}
              tick={{ fill: 'rgba(255, 255, 255, 0.5)', fontSize: 10 }}
            />
            <Radar
              name="Score"
              dataKey="value"
              stroke="url(#radarGradient)"
              fill="url(#radarGradient)"
              fillOpacity={0.6}
              strokeWidth={2}
            />
            <defs>
              <linearGradient id="radarGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
          </RadarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-white/60 text-sm text-center mt-2">
        Comprehensive view of all decision factors
      </p>
    </motion.div>
  );
}
