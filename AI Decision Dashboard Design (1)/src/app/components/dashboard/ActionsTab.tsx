import { motion } from 'motion/react';
import { CheckCircle2, Circle, Calendar, Users, Target, FileCheck } from 'lucide-react';

export function ActionsTab() {
  const actionPlan = [
    {
      step: 1,
      title: 'Initial Research & Planning',
      description: 'Conduct comprehensive market research and develop detailed execution plan',
      duration: '2 weeks',
      assignee: 'Strategy Team',
      status: 'pending' as const,
      icon: FileCheck,
    },
    {
      step: 2,
      title: 'Resource Allocation',
      description: 'Secure necessary budget, team members, and infrastructure',
      duration: '1 week',
      assignee: 'Operations',
      status: 'pending' as const,
      icon: Users,
    },
    {
      step: 3,
      title: 'Pilot Launch',
      description: 'Execute small-scale pilot to validate assumptions and gather data',
      duration: '3 weeks',
      assignee: 'Product Team',
      status: 'pending' as const,
      icon: Target,
    },
    {
      step: 4,
      title: 'Analysis & Optimization',
      description: 'Review pilot results and optimize approach based on findings',
      duration: '1 week',
      assignee: 'Analytics Team',
      status: 'pending' as const,
      icon: Calendar,
    },
    {
      step: 5,
      title: 'Full Implementation',
      description: 'Roll out complete solution with monitoring and adjustment protocols',
      duration: '4 weeks',
      assignee: 'Cross-functional',
      status: 'pending' as const,
      icon: CheckCircle2,
    },
  ];

  const milestones = [
    { name: 'Planning Complete', date: 'Week 2', status: 'upcoming' },
    { name: 'Resources Secured', date: 'Week 3', status: 'upcoming' },
    { name: 'Pilot Launch', date: 'Week 4', status: 'upcoming' },
    { name: 'Go/No-Go Decision', date: 'Week 7', status: 'upcoming' },
    { name: 'Full Rollout', date: 'Week 11', status: 'upcoming' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Action Steps */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 shadow-xl"
      >
        <h3 className="text-xl text-white mb-6">Action Plan</h3>
        <div className="space-y-4">
          {actionPlan.map((action, index) => (
            <motion.div
              key={index}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.01, x: 5 }}
              className="relative"
            >
              {/* Connecting Line */}
              {index < actionPlan.length - 1 && (
                <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-gradient-to-b from-purple-500/50 to-blue-500/50 -mb-4" />
              )}

              <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white text-lg relative z-10">
                    {action.step}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="text-white mb-1">{action.title}</h4>
                      <p className="text-white/70 text-sm">{action.description}</p>
                    </div>
                    <Circle className="w-5 h-5 text-white/40 flex-shrink-0 ml-4" />
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-sm">
                    <div className="flex items-center gap-2 text-white/60">
                      <Calendar className="w-4 h-4" />
                      {action.duration}
                    </div>
                    <div className="flex items-center gap-2 text-white/60">
                      <Users className="w-4 h-4" />
                      {action.assignee}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Timeline & Milestones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Timeline */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 shadow-xl"
        >
          <h3 className="text-lg text-white mb-4">Key Milestones</h3>
          <div className="space-y-3">
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10"
              >
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-blue-600" />
                <div className="flex-1">
                  <div className="text-white text-sm">{milestone.name}</div>
                </div>
                <div className="text-white/60 text-sm">{milestone.date}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Summary Stats */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 shadow-xl"
        >
          <h3 className="text-lg text-white mb-4">Execution Summary</h3>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30">
              <div className="text-3xl text-white mb-1">11 weeks</div>
              <div className="text-white/70 text-sm">Total Timeline</div>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30">
              <div className="text-3xl text-white mb-1">5 steps</div>
              <div className="text-white/70 text-sm">Action Items</div>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30">
              <div className="text-3xl text-white mb-1">4 teams</div>
              <div className="text-white/70 text-sm">Stakeholders</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Next Steps CTA */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="backdrop-blur-xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-2xl p-6 shadow-xl"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center flex-shrink-0">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div>
            <h4 className="text-white mb-2">Ready to Get Started?</h4>
            <p className="text-white/70 text-sm mb-4">
              This action plan provides a clear roadmap for implementation. Begin with Step 1
              and monitor progress at each milestone to ensure successful execution.
            </p>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(168, 85, 247, 0.4)' }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
            >
              Download Action Plan
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
