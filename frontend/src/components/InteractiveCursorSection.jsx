import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const InteractiveCursorSection = () => {
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
      className="h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950 relative overflow-hidden"
    >
      {/* Themed decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
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
          className="absolute top-20 left-20 w-96 h-96 rounded-full blur-3xl bg-purple-500/20"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
          className="absolute bottom-20 right-20 w-96 h-96 rounded-full blur-3xl bg-blue-500/20"
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
        <h3 className="text-4xl font-bold text-white mb-2">Clarity. Focus. Impact.</h3>
        <p className="text-gray-300 text-sm">
          Move your cursor to interact • Scroll to continue
        </p>
      </motion.div>

      {/* Spline 3D - Always interactive, scroll handled separately */}
      <div className="absolute inset-0 w-full h-full spline-hide-logo">
        <iframe
          ref={iframeRef}
          src="https://my.spline.design/claritystream-pG3Ef2DtcYVv9h6aTdmkArh8/"
          frameBorder="0"
          width="100%"
          height="100%"
          title="Clarity Stream 3D Experience"
          className="w-full h-full"
          style={{ pointerEvents: 'auto' }}
          loading="lazy"
        />
      </div>
    </section>
  );
};

export default InteractiveCursorSection;