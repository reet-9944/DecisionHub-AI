import { motion } from 'motion/react';
import { Brain, Lightbulb, TrendingUp, Target } from 'lucide-react';

interface ReasoningTabProps {
  problem: string;
}

export function ReasoningTab({ problem }: ReasoningTabProps) {
  const reasoningSteps = [
    {
      icon: Brain,
      title: 'Problem Analysis',
      content: `We analyzed your decision: "${problem}". The AI evaluated multiple dimensions including feasibility, risk factors, market conditions, and resource requirements to provide a comprehensive assessment.`,
      color: 'from-purple-400 to-purple-600',
    },
    {
      icon: Lightbulb,
      title: 'Key Considerations',
      content: 'The analysis identified several critical factors: market timing shows favorable conditions, competitive landscape requires strategic positioning, and resource allocation needs careful planning. These elements collectively inform the recommendation.',
      color: 'from-yellow-400 to-orange-500',
    },
    {
      icon: TrendingUp,
      title: 'Opportunity Assessment',
      content: 'Growth potential is significant with a 73% positive trajectory. Market conditions indicate strong demand, and early indicators suggest favorable adoption rates. The timing aligns well with broader industry trends.',
      color: 'from-green-400 to-emerald-600',
    },
    {
      icon: Target,
      title: 'Strategic Alignment',
      content: 'The recommended approach balances short-term execution with long-term sustainability. It provides clear milestones for measurement and allows for adaptive adjustments based on real-world feedback.',
      color: 'from-blue-400 to-cyan-600',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 shadow-xl"
      >
        <h3 className="text-xl text-white mb-4">AI Reasoning Process</h3>
        <p className="text-white/70 leading-relaxed">
          Our AI uses a multi-layered analysis approach combining market data, risk assessment,
          historical patterns, and predictive modeling to deliver actionable insights. Below is
          the step-by-step reasoning that led to the recommendation.
        </p>
      </motion.div>

      {reasoningSteps.map((step, index) => (
        <motion.div
          key={index}
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: index * 0.15 }}
          whileHover={{ scale: 1.01, x: 5 }}
          className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 shadow-xl"
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center`}>
                <step.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center text-white text-sm`}>
                  {index + 1}
                </div>
                <h4 className="text-lg text-white">{step.title}</h4>
              </div>
              <p className="text-white/70 leading-relaxed">{step.content}</p>
            </div>
          </div>
        </motion.div>
      ))}

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="backdrop-blur-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-2xl p-6 shadow-xl"
      >
        <h4 className="text-white mb-3">Conclusion</h4>
        <p className="text-white/80 leading-relaxed">
          Based on the comprehensive analysis above, the AI recommends proceeding with a structured,
          phased approach that minimizes risk while maximizing opportunity. This recommendation
          balances confidence in the opportunity (78%) with realistic risk mitigation strategies.
        </p>
      </motion.div>
    </motion.div>
  );
}
