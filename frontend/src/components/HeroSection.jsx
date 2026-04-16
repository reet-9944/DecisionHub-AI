import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const domainRoutes = {
  healthcare: '/healthcare-dashboard',
};

const HeroSection = ({ activeDomain, domains, setActiveId }) => {
  const navigate = useNavigate();

  const handleCTA = () => {
    const route = domainRoutes[activeDomain.id];
    if (route) navigate(route);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 pt-24 pb-32">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            key={`${activeDomain.id}-content`}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="space-y-8 z-10"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm"
              style={{
                background: `${activeDomain.theme.accent}20`,
                border: `1px solid ${activeDomain.theme.accent}40`
              }}
            >
              <Sparkles className="w-4 h-4" style={{ color: activeDomain.theme.accent }} />
              <span className="text-sm font-medium" style={{ color: activeDomain.theme.textPrimary }}>
                AI-Powered Decision Intelligence
              </span>
            </motion.div>

            {/* Main Headline */}
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight"
                style={{ color: activeDomain.theme.textPrimary }}
              >
                {activeDomain.title}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-lg leading-relaxed"
                style={{ color: activeDomain.theme.textSecondary }}
              >
                {activeDomain.description}
              </motion.p>
            </div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <motion.button
                onClick={handleCTA}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="group px-8 py-4 rounded-full font-semibold shadow-xl transition-all duration-300 flex items-center gap-2"
                style={{
                  background: activeDomain.theme.buttonBg,
                  color: activeDomain.theme.buttonText,
                  boxShadow: `0 10px 30px ${activeDomain.theme.accent}40`
                }}
              >
                {domainRoutes[activeDomain.id] ? 'Get Started' : 'Order Now'}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-full font-semibold transition-all duration-300 backdrop-blur-sm"
                style={{
                  background: `${activeDomain.theme.accent}10`,
                  color: activeDomain.theme.textPrimary,
                  border: `2px solid ${activeDomain.theme.accent}30`
                }}
              >
                View Menu
              </motion.button>
            </motion.div>

            {/* Domain Switcher Icons — fixed below CTA, hidden on scroll */}
            {domains && setActiveId && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="flex items-center gap-3 flex-wrap"
              >
                {domains.map((domain) => {
                  const isActive = activeDomain.id === domain.id;
                  return (
                    <motion.button
                      key={domain.id}
                      onClick={() => setActiveId(domain.id)}
                      whileHover={{ scale: 1.1, y: -3 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative group"
                      title={domain.name}
                    >
                      <div
                        className="w-14 h-14 rounded-2xl overflow-hidden relative transition-all duration-300"
                        style={{
                          border: isActive ? `2px solid ${domain.theme.accent}` : '2px solid rgba(0,0,0,0.1)',
                          boxShadow: isActive ? `0 6px 20px ${domain.theme.accent}50` : '0 2px 8px rgba(0,0,0,0.1)',
                        }}
                      >
                        <img
                          src={domain.iconImage}
                          alt={domain.name}
                          className="w-full h-full object-cover"
                        />
                        {isActive && (
                          <div
                            className="absolute inset-0"
                            style={{ background: `${domain.theme.accent}30` }}
                          />
                        )}
                      </div>
                      {/* Tooltip */}
                      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                        <div className="px-2 py-1 rounded-lg text-xs font-medium text-white"
                          style={{ background: domain.theme.accent }}>
                          {domain.name}
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </motion.div>
            )}
          </motion.div>

          {/* Right Content - Hero Image */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeDomain.id}
              initial={{ opacity: 0, scale: 0.8, rotateY: 20 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, scale: 0.8, rotateY: -20 }}
              transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
              className="relative flex items-center justify-center"
            >
              {/* Decorative floating elements */}
              <motion.div
                animate={{
                  y: [0, -20, 0],
                  rotate: [0, 5, 0]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
                className="absolute -top-10 -left-10 w-20 h-20 rounded-full opacity-60 blur-xl"
                style={{ background: activeDomain.theme.accent }}
              />
              
              <motion.div
                animate={{
                  y: [0, 30, 0],
                  rotate: [0, -5, 0]
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 0.5
                }}
                className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full opacity-40 blur-2xl"
                style={{ background: activeDomain.theme.accent }}
              />

              {/* Main Hero Image */}
              <motion.div
                animate={{
                  y: [0, -15, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
                className="relative"
              >
                <motion.img
                  src={activeDomain.heroImage}
                  alt={activeDomain.name}
                  className="relative w-full max-w-lg h-auto object-contain drop-shadow-2xl rounded-3xl"
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.8 }}
                />
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;