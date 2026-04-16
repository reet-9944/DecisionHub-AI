import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface InputFormProps {
  onAnalyze: (data: { name: string; problem: string }) => void;
  initialData: { name: string; problem: string };
}

export function InputForm({ onAnalyze, initialData }: InputFormProps) {
  const [name, setName] = useState(initialData.name);
  const [problem, setProblem] = useState(initialData.problem);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && problem.trim()) {
      onAnalyze({ name, problem });
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.9, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-lg"
    >
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 mb-4"
          >
            <Sparkles className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-3xl text-white mb-2">AI Decision Assistant</h1>
          <p className="text-white/70">Get intelligent insights powered by AI</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-white/90 mb-2">
              Your Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
              required
            />
          </div>

          <div>
            <label htmlFor="problem" className="block text-white/90 mb-2">
              Decision or Problem
            </label>
            <textarea
              id="problem"
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              placeholder="Describe the decision you need help with..."
              rows={5}
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all resize-none"
              required
            />
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(168, 85, 247, 0.4)' }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white flex items-center justify-center gap-2 shadow-lg hover:shadow-purple-500/50 transition-shadow"
          >
            <Sparkles className="w-5 h-5" />
            Analyze with AI
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
}
