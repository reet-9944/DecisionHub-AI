import { ShieldAlert, Shield, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

export function RiskAnalysisCard() {
  const risks = [
    {
      category: 'Market Risk',
      level: 'low' as const,
      description: 'Stable market conditions with minimal volatility',
      impact: 2,
    },
    {
      category: 'Financial Risk',
      level: 'medium' as const,
      description: 'Moderate capital requirements with managed exposure',
      impact: 5,
    },
    {
      category: 'Execution Risk',
      level: 'medium' as const,
      description: 'Complex implementation but achievable with planning',
      impact: 6,
    },
    {
      category: 'Competitive Risk',
      level: 'high' as const,
      description: 'Significant competition requires differentiation strategy',
      impact: 7,
    },
    {
      category: 'Regulatory Risk',
      level: 'low' as const,
      description: 'Clear compliance path with minimal barriers',
      impact: 3,
    },
    {
      category: 'Technical Risk',
      level: 'medium' as const,
      description: 'Standard technology stack with proven solutions',
      impact: 4,
    },
  ];

  const getRiskConfig = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'low':
        return {
          icon: ShieldCheck,
          color: 'from-green-400 to-emerald-600',
          bg: 'bg-green-500/10',
          border: 'border-green-500/30',
          text: 'text-green-400',
        };
      case 'medium':
        return {
          icon: Shield,
          color: 'from-yellow-400 to-orange-500',
          bg: 'bg-yellow-500/10',
          border: 'border-yellow-500/30',
          text: 'text-yellow-400',
        };
      case 'high':
        return {
          icon: ShieldAlert,
          color: 'from-red-400 to-red-600',
          bg: 'bg-red-500/10',
          border: 'border-red-500/30',
          text: 'text-red-400',
        };
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 shadow-xl"
    >
      <h3 className="text-xl text-white mb-6">Risk Analysis</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {risks.map((risk, index) => {
          const config = getRiskConfig(risk.level);
          const Icon = config.icon;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.03, y: -2 }}
              className={`p-4 rounded-xl border ${config.bg} ${config.border} transition-all`}
            >
              <div className="flex items-start gap-3 mb-3">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${config.color} flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-white">{risk.category}</h4>
                  <span className={`text-xs uppercase tracking-wider ${config.text}`}>
                    {risk.level} risk
                  </span>
                </div>
              </div>
              <p className="text-white/70 text-sm mb-3">{risk.description}</p>
              <div className="flex items-center gap-2">
                <span className="text-white/60 text-xs">Impact:</span>
                <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${risk.impact * 10}%` }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                    className={`h-full bg-gradient-to-r ${config.color}`}
                  />
                </div>
                <span className="text-white/60 text-xs">{risk.impact}/10</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
