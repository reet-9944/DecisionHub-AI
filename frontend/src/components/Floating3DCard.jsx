import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Brain, Users, Sparkles } from 'lucide-react';

const Floating3DCard = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [25, 0, -25]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section ref={ref} className="min-h-screen flex items-center justify-center px-6 py-32 bg-gradient-to-b from-gray-400 via-gray-600 to-gray-800 relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl bg-blue-500/20"
      />

      <div className="max-w-6xl mx-auto relative">
        <motion.div
          style={{
            y,
            rotateX,
            opacity,
            transformPerspective: 1200,
          }}
          className="relative"
        >
          {/* 3D Card Container */}
          <motion.div
            whileHover={{ 
              scale: 1.02,
              rotateX: -5,
              rotateY: 5,
              transition: { duration: 0.3 }
            }}
            className="relative w-full aspect-video rounded-3xl overflow-hidden"
            style={{
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Card Shadow */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-3xl transform translate-y-12 scale-95" />

            {/* Main Card */}
            <div className="relative w-full h-full bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 rounded-3xl border border-gray-300 overflow-hidden shadow-2xl">
              {/* Decorative Elements */}
              <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-10">
                <div className="absolute inset-0 grid grid-cols-3 gap-4 p-8 transform rotate-12">
                  {[...Array(9)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        opacity: [0.2, 0.5, 0.2],
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                      className="aspect-square bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl backdrop-blur-sm"
                    />
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="relative z-20 h-full flex flex-col items-center justify-center p-12 lg:p-16 text-center">
                {/* Icons */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="flex items-center gap-4 mb-8"
                >
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                  <Sparkles className="w-8 h-8 text-purple-500" />
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-4xl lg:text-6xl font-bold text-gray-800 leading-tight mb-6"
                >
                  Where AI Meets{' '}
                  <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Human Wisdom
                  </span>
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="text-lg text-gray-600 leading-relaxed max-w-2xl mb-8"
                >
                  Our platform combines the power of artificial intelligence with human intuition. 
                  Get AI-driven insights, validated by expert knowledge, for decisions you can trust.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="flex items-center gap-8"
                >
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">AI</div>
                    <div className="text-sm text-gray-500">Analysis</div>
                  </div>
                  <div className="text-2xl text-gray-400">+</div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">Human</div>
                    <div className="text-sm text-gray-500">Expertise</div>
                  </div>
                  <div className="text-2xl text-gray-400">=</div>
                  <div className="text-center">
                    <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Perfect</div>
                    <div className="text-sm text-gray-500">Decisions</div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Floating3DCard;