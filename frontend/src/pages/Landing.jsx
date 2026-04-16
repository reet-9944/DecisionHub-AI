import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { domains } from '../data/mockData';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import QuoteSection from '../components/QuoteSection';
import AlternatingDomains from '../components/AlternatingDomains';
import Floating3DCard from '../components/Floating3DCard';
import Device3DMockup from '../components/Device3DMockup';
import InteractiveCursorSection from '../components/InteractiveCursorSection';
import SplineEndSection from '../components/SplineEndSection';

const Landing = () => {
  const [activeId, setActiveId] = useState('healthcare');
  const activeDomain = domains.find((d) => d.id === activeId);

  return (
    <div className="relative overflow-x-hidden">

      {/* Domain Icon Selector — fixed at bottom, outside all transform parents */}
      {/* Hero Section with Background */}
      <div className="relative min-h-screen">
        {/* Animated Background */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeDomain.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            className="fixed inset-0 -z-10"
            style={{ background: activeDomain.theme.background }}
          />
        </AnimatePresence>

        {/* Subtle gradient overlay */}
        <div className="fixed inset-0 -z-10 opacity-40">
          <div
            className="absolute top-0 left-0 w-full h-1/2"
            style={{
              background: `radial-gradient(ellipse at top, ${activeDomain.theme.accent}20, transparent)`
            }}
          />
          <div
            className="absolute bottom-0 right-0 w-full h-1/2"
            style={{
              background: `radial-gradient(ellipse at bottom right, ${activeDomain.theme.accent}15, transparent)`
            }}
          />
        </div>

        {/* Navigation */}
        <Navbar activeTheme={activeDomain.theme} />

        {/* Hero Section */}
        <AnimatePresence mode="wait">
          <HeroSection key={activeId} activeDomain={activeDomain} domains={domains} setActiveId={setActiveId} />
        </AnimatePresence>
      </div>

      {/* Scroll Sections */}
      <div className="relative">
        {/* Quote Section */}
        <QuoteSection />

        {/* Alternating Domain Sections */}
        <AlternatingDomains />

        {/* 3D Floating Card Section */}
        <Floating3DCard />

        {/* 3D Device Mockup Section */}
        <Device3DMockup />

        {/* Interactive Cursor Following Section */}
        <InteractiveCursorSection />

        {/* Spline 3D End Section */}
        <SplineEndSection />

        {/* Footer */}
        <footer className="bg-black py-12 px-6 border-t border-white/10">
          <div className="max-w-7xl mx-auto text-center text-gray-500 text-sm">
            <p>© 2025 DecisionHub AI. Powered by explainable artificial intelligence.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Landing;
