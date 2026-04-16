import { motion } from 'motion/react';
import { RecommendationCard } from './RecommendationCard';
import { KeyInsightsCard } from './KeyInsightsCard';
import { ConfidenceScoreCard } from './ConfidenceScoreCard';
import { RiskAnalysisCard } from './RiskAnalysisCard';

interface OverviewTabProps {
  problem: string;
}

export function OverviewTab({ problem }: OverviewTabProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants}>
        <RecommendationCard problem={problem} />
      </motion.div>

      <motion.div variants={itemVariants}>
        <ConfidenceScoreCard />
      </motion.div>

      <motion.div variants={itemVariants}>
        <KeyInsightsCard />
      </motion.div>

      <motion.div variants={itemVariants}>
        <RiskAnalysisCard />
      </motion.div>
    </motion.div>
  );
}
