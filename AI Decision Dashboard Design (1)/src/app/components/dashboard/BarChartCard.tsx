import { motion } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export function BarChartCard() {
  const data = [
    { option: 'Option A', score: 78, color: '#a855f7' },
    { option: 'Option B', score: 65, color: '#3b82f6' },
    { option: 'Option C', score: 52, color: '#06b6d4' },
    { option: 'Option D', score: 45, color: '#8b5cf6' },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-lg p-3 shadow-lg">
          <p className="text-white text-sm">{payload[0].payload.option}</p>
          <p className="text-white">
            Score: <span className="font-bold">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.3 }}
      whileHover={{ scale: 1.02 }}
      className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 shadow-xl"
    >
      <h3 className="text-lg text-white mb-4">Option Comparison</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
            <XAxis 
              dataKey="option" 
              tick={{ fill: 'rgba(255, 255, 255, 0.7)', fontSize: 12 }}
              stroke="rgba(255, 255, 255, 0.2)"
            />
            <YAxis 
              tick={{ fill: 'rgba(255, 255, 255, 0.7)', fontSize: 12 }}
              stroke="rgba(255, 255, 255, 0.2)"
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} />
            <Bar dataKey="score" radius={[8, 8, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-white/60 text-sm text-center mt-2">
        Comparative analysis of different options
      </p>
    </motion.div>
  );
}
