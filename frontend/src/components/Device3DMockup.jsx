import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Heart, Rocket, FileText, Wallet, Building2, BarChart3, ArrowRight, Check } from 'lucide-react';

const Device3DMockup = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });

  const y = useTransform(scrollYProgress, [0, 1], [150, -150]);
  const rotateY = useTransform(scrollYProgress, [0, 0.5, 1], [-35, -15, 5]);
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [20, 5, -10]);

  const steps = [
    { icon: Heart, text: 'Choose Your Domain', color: 'text-cyan-500' },
    { icon: BarChart3, text: 'AI Analysis Begins', color: 'text-purple-500' },
    { icon: Check, text: 'Get Instant Results', color: 'text-green-500' },
  ];

  const domains = [
    { icon: Heart, name: 'Healthcare', color: 'bg-cyan-500' },
    { icon: Rocket, name: 'Career', color: 'bg-orange-500' },
    { icon: FileText, name: 'Resume', color: 'bg-blue-500' },
    { icon: Wallet, name: 'Finance', color: 'bg-purple-500' },
    { icon: Building2, name: 'Public', color: 'bg-pink-500' },
    { icon: BarChart3, name: 'Business', color: 'bg-yellow-500' },
  ];

  return (
    <section ref={ref} className="min-h-screen flex items-center justify-center px-6 py-32 bg-gradient-to-b from-gray-800 via-gray-850 to-gray-900 relative overflow-hidden">
      {/* Section Title */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="absolute top-32 left-0 right-0 text-center z-10"
      >
        <h2 className="text-6xl lg:text-8xl font-bold text-white drop-shadow-2xl">
          The Design
        </h2>
      </motion.div>

      <div className="max-w-7xl mx-auto w-full relative mt-32">
        <motion.div
          style={{
            y,
            rotateY,
            rotateX,
            transformPerspective: 1500,
            transformStyle: 'preserve-3d',
          }}
          className="relative mx-auto"
        >
          {/* Device Shadow */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-3xl transform translate-y-16 scale-90" />

          {/* Device Frame */}
          <motion.div
            whileHover={{
              scale: 1.02,
              rotateY: -20,
              rotateX: 10,
              transition: { duration: 0.5 }
            }}
            className="relative w-full max-w-5xl mx-auto bg-gradient-to-br from-gray-800 to-gray-900 rounded-[3rem] p-3 shadow-2xl border border-white/10"
            style={{
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Screen Content */}
            <div className="relative w-full aspect-video bg-gradient-to-br from-gray-900 to-black rounded-[2.5rem] overflow-hidden">
              {/* DecisionHub AI Navigation */}
              <div className="absolute top-0 left-0 right-0 px-8 py-6 flex items-center justify-between bg-black/50 backdrop-blur-md border-b border-white/10 z-10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <span className="text-white font-bold">D</span>
                  </div>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="font-semibold text-white"
                  >
                    DecisionHub AI
                  </motion.span>
                </div>
                <button className="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg">
                  Try Now
                </button>
              </div>

              {/* Main Content - Animated Steps */}
              <div className="absolute inset-0 pt-20 p-8 flex flex-col justify-center">
                {/* Typewriter Heading */}
                <motion.div className="text-center mb-12">
                  <motion.h1
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.5, delay: 0.7 }}
                    className="text-3xl lg:text-4xl font-bold text-white mb-4"
                  >
                    How It Works
                  </motion.h1>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={isInView ? { width: '100%' } : {}}
                    transition={{ duration: 1, delay: 1 }}
                    className="h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto max-w-xs"
                  />
                </motion.div>

                {/* Animated Steps */}
                <div className="space-y-6 max-w-2xl mx-auto">
                  {steps.map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -50 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.6, delay: 1.2 + index * 0.3 }}
                      className="flex items-center gap-4 bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10"
                    >
                      <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                        <step.icon className={`w-6 h-6 ${step.color}`} />
                      </div>
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : {}}
                        transition={{ duration: 1, delay: 1.5 + index * 0.3 }}
                        className="text-lg text-white font-medium"
                      >
                        {step.text}
                      </motion.span>
                      <ArrowRight className="w-5 h-5 text-gray-500 ml-auto" />
                    </motion.div>
                  ))}
                </div>

                {/* Domain Icons Grid */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 2.4 }}
                  className="mt-12"
                >
                  <p className="text-center text-gray-400 text-sm mb-4">
                    Choose from 6 AI-Powered Domains
                  </p>
                  <div className="flex justify-center gap-3 flex-wrap">
                    {domains.map((domain, index) => (
                      <motion.div
                        key={index}
                        initial={{ scale: 0, rotate: -180 }}
                        animate={isInView ? { scale: 1, rotate: 0 } : {}}
                        transition={{
                          type: 'spring',
                          stiffness: 200,
                          delay: 2.6 + index * 0.1
                        }}
                        whileHover={{ scale: 1.1, y: -5 }}
                        className={`w-12 h-12 rounded-xl ${domain.color} flex items-center justify-center cursor-pointer shadow-lg`}
                      >
                        <domain.icon className="w-6 h-6 text-white" />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* CTA Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 3.2 }}
                  className="text-center mt-8"
                >
                  <button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-full shadow-xl hover:shadow-2xl transition-shadow">
                    Start Your Journey
                  </button>
                </motion.div>
              </div>
            </div>

            {/* Device Reflection */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-[3rem] pointer-events-none" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Device3DMockup;