import { motion } from 'motion/react';
import { Brain, Sparkles } from 'lucide-react';

export function LoadingOverlay() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center z-50"
    >
      <div className="text-center">
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: { duration: 2, repeat: Infinity, ease: 'linear' },
            scale: { duration: 1, repeat: Infinity, ease: 'easeInOut' }
          }}
          className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 mb-6 relative"
        >
          <Brain className="w-12 h-12 text-white" />
          <motion.div
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
            className="absolute inset-0 rounded-full bg-purple-500/30"
          />
        </motion.div>

        <motion.h2
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-2xl text-white mb-2"
        >
          AI is analyzing...
        </motion.h2>

        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center gap-2 text-white/70"
        >
          <Sparkles className="w-4 h-4" />
          <span>Processing your decision</span>
        </motion.div>

        <div className="flex gap-2 mt-6 justify-center">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ 
                y: [0, -15, 0],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{ 
                duration: 1,
                repeat: Infinity,
                delay: i * 0.15,
                ease: 'easeInOut'
              }}
              className="w-3 h-3 rounded-full bg-purple-400"
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
