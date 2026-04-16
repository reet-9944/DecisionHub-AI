import { motion } from 'motion/react';
import { RadarChartCard } from './RadarChartCard';
import { BarChartCard } from './BarChartCard';
import { TrendingUp, Users, DollarSign, Clock, Shield, Zap } from 'lucide-react';

export function FactorsTab() {
  const factors = [
    {
      icon: TrendingUp,
      name: 'Market Opportunity',
      score: 8.5,
      description: 'Strong market demand with clear growth trajectory',
      color: 'from-blue-400 to-blue-600',
    },
    {
      icon: Shield,
      name: 'Risk Management',
      score: 6.8,
      description: 'Moderate risks with established mitigation strategies',
      color: 'from-yellow-400 to-orange-500',
    },
    {
      icon: Zap,
      name: 'Execution Speed',
      score: 7.2,
      description: 'Fast implementation possible with right resources',
      color: 'from-purple-400 to-pink-600',
    },
    {
      icon: Users,
      name: 'Team Readiness',
      score: 8.0,
      description: 'Strong team alignment and capability',
      color: 'from-green-400 to-emerald-600',
    },
    {
      icon: DollarSign,
      name: 'Financial Viability',
      score: 7.5,
      description: 'Positive ROI projections with manageable investment',
      color: 'from-cyan-400 to-blue-600',
    },
    {
      icon: Clock,
      name: 'Timing',
      score: 8.2,
      description: 'Optimal market timing for maximum impact',
      color: 'from-indigo-400 to-purple-600',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RadarChartCard />
        <BarChartCard />
      </div>

      {/* Detailed Factors */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 shadow-xl"
      >
        <h3 className="text-xl text-white mb-6">Detailed Factor Analysis</h3>
        <div className="space-y-4">
          {factors.map((factor, index) => (
            <motion.div
              key={index}
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              whileHover={{ scale: 1.02, x: 5 }}
              className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${factor.color} flex items-center justify-center flex-shrink-0`}>
                  <factor.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-white">{factor.name}</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-white text-lg">{factor.score}</span>
                      <span className="text-white/60 text-sm">/10</span>
                    </div>
                  </div>
                  <p className="text-white/70 text-sm mb-3">{factor.description}</p>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${factor.score * 10}%` }}
                      transition={{ delay: 0.6 + index * 0.1, duration: 0.8 }}
                      className={`h-full bg-gradient-to-r ${factor.color}`}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Summary Stats */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1 }}
        className="grid grid-cols-3 gap-4"
      >
        {[
          { label: 'Average Score', value: '7.7/10', color: 'from-green-400 to-emerald-600' },
          { label: 'Highest Factor', value: 'Market', color: 'from-blue-400 to-blue-600' },
          { label: 'Lowest Factor', value: 'Risk', color: 'from-yellow-400 to-orange-500' },
        ].map((stat, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05, y: -2 }}
            className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-xl p-4 text-center shadow-lg"
          >
            <div className={`text-2xl text-transparent bg-gradient-to-r ${stat.color} bg-clip-text mb-1`}>
              {stat.value}
            </div>
            <div className="text-white/70 text-sm">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
