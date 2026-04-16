import { motion } from 'motion/react';
import { Gauge } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ConfidenceScoreCard() {
  const [progress, setProgress] = useState(0);
  const targetScore = 78;

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(targetScore);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 75) return 'from-green-400 to-emerald-600';
    if (score >= 50) return 'from-yellow-400 to-orange-500';
    return 'from-red-400 to-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 75) return 'High Confidence';
    if (score >= 50) return 'Moderate Confidence';
    return 'Low Confidence';
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 shadow-xl"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
          <Gauge className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-xl text-white">AI Confidence Score</h3>
      </div>

      <div className="space-y-6">
        {/* Progress Bar */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-white/70">Overall Confidence</span>
            <span className="text-2xl text-white">{targetScore}%</span>
          </div>
          <div className="h-4 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              className={`h-full bg-gradient-to-r ${getScoreColor(targetScore)} relative`}
            >
              <motion.div
                animate={{ x: [0, 100, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              />
            </motion.div>
          </div>
          <p className="text-white/60 text-sm mt-2">{getScoreLabel(targetScore)}</p>
        </div>

        {/* Score Breakdown */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Data Quality', score: 85 },
            { label: 'Risk Level', score: 68 },
            { label: 'Feasibility', score: 82 },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="text-center p-4 rounded-xl bg-white/5 border border-white/10"
            >
              <div className="text-2xl text-white mb-1">{item.score}%</div>
              <div className="text-white/60 text-xs">{item.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Indicator */}
        <div className="flex items-center justify-center gap-2 pt-2">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className={`w-3 h-3 rounded-full bg-gradient-to-r ${getScoreColor(targetScore)}`}
          />
          <span className="text-white/70 text-sm">Analysis Complete</span>
        </div>
      </div>
    </motion.div>
  );
}
