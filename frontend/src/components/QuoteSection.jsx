import React from 'react';
import { motion } from 'framer-motion';

const QuoteSection = () => {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-32 bg-gradient-to-br from-blue-50 via-white to-orange-50 relative overflow-hidden">
      {/* Decorative paw prints */}
      <div className="absolute bottom-20 right-20 opacity-20">
        <div className="text-orange-300 text-8xl">🐾</div>
      </div>
      <div className="absolute bottom-40 right-40 opacity-10">
        <div className="text-orange-300 text-6xl">🐾</div>
      </div>

      <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center">
        {/* Left - Decorative Elements */}
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative flex items-center justify-center"
        >
          <div className="relative">
            {/* Floating shapes */}
            <motion.div
              animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -top-10 -left-10 w-32 h-32 bg-cyan-200 rounded-full opacity-50"
            />
            <motion.div
              animate={{ y: [0, 15, 0], rotate: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
              className="absolute top-20 -right-10 w-24 h-24 bg-orange-300 rounded-full opacity-40"
            />
            
            {/* Main illustration placeholder - Batman duck */}
            <div className="relative w-80 h-80 bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-full flex items-center justify-center">
              <div className="text-9xl">🦆</div>
            </div>

            {/* Additional decorative elements */}
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="absolute -bottom-5 left-10 text-6xl"
            >
              🧶
            </motion.div>
          </div>
        </motion.div>

        {/* Right - Quote Text */}
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-8 text-center lg:text-left"
        >
          <h2 className="text-5xl lg:text-7xl font-bold text-gray-800 leading-tight">
            Make decisions or book a consultation{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
              whenever you want.
            </span>
          </h2>
        </motion.div>

        {/* Right decorative - Vet with dog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative hidden lg:flex items-center justify-center"
        >
          <div className="relative w-80 h-80 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center overflow-hidden">
            <div className="text-9xl">👨‍⚕️</div>
            <div className="absolute bottom-8 right-8 text-7xl">🐕</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default QuoteSection;