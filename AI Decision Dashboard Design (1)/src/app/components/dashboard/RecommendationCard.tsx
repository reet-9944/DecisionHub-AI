import { CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

interface RecommendationCardProps {
  problem: string;
}

export function RecommendationCard({ problem }: RecommendationCardProps) {
  // Generate contextual recommendation based on problem
  const getRecommendation = () => {
    const lowerProblem = problem.toLowerCase();
    
    if (lowerProblem.includes('business') || lowerProblem.includes('startup') || lowerProblem.includes('company')) {
      return 'Proceed with phased implementation approach';
    } else if (lowerProblem.includes('career') || lowerProblem.includes('job')) {
      return 'Take the opportunity - timing is favorable';
    } else if (lowerProblem.includes('invest') || lowerProblem.includes('financial')) {
      return 'Diversify and monitor - proceed with caution';
    } else if (lowerProblem.includes('education') || lowerProblem.includes('study')) {
      return 'Prioritize long-term growth opportunities';
    } else {
      return 'Move forward with structured planning';
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01, boxShadow: '0 0 40px rgba(168, 85, 247, 0.3)' }}
      className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 shadow-xl transition-all"
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-7 h-7 text-white" />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg text-white/90 mb-2">AI Recommendation</h3>
          <p className="text-2xl text-white mb-3">
            {getRecommendation()}
          </p>
          <p className="text-white/70">
            Based on comprehensive analysis of market conditions, risk factors, and growth potential,
            this approach offers the best balance of opportunity and security.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
