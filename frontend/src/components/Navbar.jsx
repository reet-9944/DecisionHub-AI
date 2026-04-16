import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const Navbar = ({ activeTheme }) => {
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <motion.div
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
              style={{ 
                background: activeTheme.accent,
                boxShadow: `0 4px 14px ${activeTheme.accent}60`
              }}
            >
              <span className="text-white font-bold text-xl">D</span>
            </motion.div>
            <span 
              className="font-semibold text-lg tracking-tight"
              style={{ color: activeTheme.textPrimary }}
            >
              DecisionHub AI
            </span>
          </div>

          {/* Contact Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2.5 rounded-full font-semibold shadow-lg transition-all"
            style={{
              background: activeTheme.buttonBg,
              color: activeTheme.buttonText,
              boxShadow: `0 4px 14px ${activeTheme.accent}40`
            }}
          >
            Contact
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
