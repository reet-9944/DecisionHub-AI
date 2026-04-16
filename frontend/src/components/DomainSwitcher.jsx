import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  FileText,
  Briefcase,
  Building2,
  GraduationCap,
  TrendingUp,
} from 'lucide-react';

const iconMap = {
  healthcare: Heart,
  resume: FileText,
  business: Briefcase,
  'public-services': Building2,
  career: GraduationCap,
  finance: TrendingUp,
};

const DomainSwitcher = ({ domains, activeId, setActiveId }) => {
  const activeDomain = domains.find((d) => d.id === activeId);

  return (
    <div className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 space-y-4"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white">
            Explore AI-Powered
            <span className={`block mt-2 bg-gradient-to-r ${activeDomain.theme.gradient} bg-clip-text text-transparent`}>
              Decision Domains
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Select a domain to see how DecisionHub AI transforms complex
            decisions into confident actions.
          </p>
        </motion.div>

        {/* Domain Pills */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-16"
        >
          {domains.map((domain, index) => {
            const Icon = iconMap[domain.id];
            const isActive = activeId === domain.id;

            return (
              <motion.button
                key={domain.id}
                onClick={() => setActiveId(domain.id)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`group relative px-6 py-3.5 rounded-2xl font-semibold transition-all duration-300 overflow-hidden ${
                  isActive
                    ? 'text-white shadow-2xl'
                    : 'text-gray-400 backdrop-blur-sm bg-white/5 border border-white/10 hover:border-white/20 hover:text-white'
                }`}
              >
                {/* Active gradient background */}
                {isActive && (
                  <motion.div
                    layoutId="activeBackground"
                    className={`absolute inset-0 bg-gradient-to-r ${domain.theme.gradient}`}
                    transition={{ type: 'spring', duration: 0.6 }}
                    style={{
                      boxShadow: `0 0 40px ${domain.theme.textGlow}`,
                    }}
                  />
                )}

                {/* Content */}
                <span className="relative flex items-center gap-2">
                  <Icon className="w-5 h-5" />
                  {domain.name}
                </span>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Active Domain Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeDomain.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            className="max-w-5xl mx-auto"
          >
            <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 lg:p-12 shadow-2xl overflow-hidden">
              {/* Background glow */}
              <div
                className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl opacity-20"
                style={{
                  background: `radial-gradient(circle, ${activeDomain.theme.accentColor}, transparent)`,
                }}
              />

              <div className="relative z-10 grid lg:grid-cols-2 gap-8 items-center">
                {/* Text Content */}
                <div className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20"
                  >
                    {React.createElement(iconMap[activeDomain.id], {
                      className: 'w-5 h-5',
                      style: { color: activeDomain.theme.accentColor },
                    })}
                    <span className="text-sm font-medium text-white">
                      {activeDomain.name}
                    </span>
                  </motion.div>

                  <motion.h3
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="text-3xl lg:text-4xl font-bold text-white"
                  >
                    {activeDomain.title}
                  </motion.h3>

                  <motion.p
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="text-gray-400 text-lg leading-relaxed"
                  >
                    {activeDomain.description}
                  </motion.p>

                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 rounded-xl font-semibold text-white border-2 transition-all duration-300"
                    style={{
                      borderColor: activeDomain.theme.accentColor,
                      boxShadow: `0 0 20px ${activeDomain.theme.textGlow}`,
                    }}
                  >
                    Get Started
                  </motion.button>
                </div>

                {/* Image */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="relative"
                >
                  <div
                    className="absolute inset-0 rounded-2xl blur-2xl opacity-30"
                    style={{
                      background: `radial-gradient(circle, ${activeDomain.theme.accentColor}, transparent)`,
                    }}
                  />
                  <img
                    src={activeDomain.image}
                    alt={activeDomain.name}
                    className="relative w-full h-80 object-cover rounded-2xl shadow-2xl"
                  />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DomainSwitcher;
