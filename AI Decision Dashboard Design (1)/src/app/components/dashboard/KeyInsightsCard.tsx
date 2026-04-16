import { TrendingUp, AlertTriangle, Rocket, Target, Users, DollarSign } from 'lucide-react';
import { motion } from 'motion/react';

export function KeyInsightsCard() {
  const insights = [
    {
      icon: TrendingUp,
      text: 'Market conditions show positive momentum with 73% growth trajectory',
      color: 'from-blue-400 to-blue-600',
    },
    {
      icon: AlertTriangle,
      text: 'Moderate risk detected - mitigation strategies recommended',
      color: 'from-yellow-400 to-orange-500',
    },
    {
      icon: Rocket,
      text: 'High potential for scalability and expansion opportunities',
      color: 'from-purple-400 to-pink-600',
    },
    {
      icon: Target,
      text: 'Clear execution path with measurable milestones identified',
      color: 'from-green-400 to-emerald-600',
    },
    {
      icon: Users,
      text: 'Strong stakeholder alignment and team readiness',
      color: 'from-indigo-400 to-purple-600',
    },
    {
      icon: DollarSign,
      text: 'Resource allocation optimized for maximum ROI',
      color: 'from-cyan-400 to-blue-600',
    },
  ];

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 shadow-xl"
    >
      <h3 className="text-xl text-white mb-6">Key Insights</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((insight, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.03, x: 5 }}
            className="flex items-start gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-white/10"
          >
            <div className={`flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br ${insight.color} flex items-center justify-center`}>
              <insight.icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-white/80 text-sm leading-relaxed">{insight.text}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
