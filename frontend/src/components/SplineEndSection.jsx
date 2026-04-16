import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const SplineEndSection = () => {
  const sectionRef = useRef(null);
  const iframeRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const iframe = iframeRef.current;
    
    if (!section || !iframe) return;

    const handleWheel = (e) => {
      // Allow page scrolling by preventing iframe from capturing scroll
      e.preventDefault();
      window.scrollBy({
        top: e.deltaY,
        behavior: 'auto'
      });
    };

    // Add wheel event listener to capture scroll
    section.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      section.removeEventListener('wheel', handleWheel);
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="h-screen flex items-center justify-center bg-gradient-to-b from-gray-950 via-black to-black relative overflow-hidden"
    >
      {/* Themed decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.05, 0.15, 0.05],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl bg-pink-500/20"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.05, 0.15, 0.05],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl bg-purple-500/20"
        />
      </div>

      {/* Section title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="absolute top-12 left-0 right-0 text-center z-10 pointer-events-none"
      >
        <h3 className="text-4xl font-bold text-white mb-2">Meet Your AI Companion</h3>
        <p className="text-gray-400 text-sm">
          Move your cursor and watch the robot follow • Scroll to continue
        </p>
      </motion.div>

      {/* Spline 3D - Always interactive, scroll handled separately */}
      <div className="absolute inset-0 w-full h-full spline-hide-logo">
        <iframe
          ref={iframeRef}
          src="https://my.spline.design/robotfollowcursorforlandingpage-CgX3GaSyEyCuUMS69vE3fM9h/"
          frameBorder="0"
          width="100%"
          height="100%"
          title="3D Robot Experience"
          className="w-full h-full"
          style={{ pointerEvents: 'auto' }}
          loading="lazy"
        />
      </div>

      {/* CTA Section - Overlay at bottom */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="absolute bottom-12 left-0 right-0 text-center z-10 px-6 pointer-events-none"
      >
        <div className="max-w-4xl mx-auto backdrop-blur-xl bg-black/40 rounded-3xl p-8 border border-white/10 pointer-events-auto">
          <h3 className="text-3xl font-bold text-white mb-6">
            Ready to Transform Your Decisions?
          </h3>
          <div className="flex flex-wrap gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(139, 92, 246, 0.6)' }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-full shadow-2xl"
            >
              Get Started Free
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-full hover:bg-white/20 transition-all"
            >
              Schedule Demo
            </motion.button>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default SplineEndSection;