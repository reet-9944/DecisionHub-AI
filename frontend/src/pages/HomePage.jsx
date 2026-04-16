import React from 'react';
import HeroSection from '../components/HeroSection';
import QuoteSection from '../components/QuoteSection';
import AlternatingDomains from '../components/AlternatingDomains';
import Floating3DCard from '../components/Floating3DCard';
import Device3DMockup from '../components/Device3DMockup';
import InteractiveCursorSection from '../components/InteractiveCursorSection';
import SplineEndSection from '../components/SplineEndSection';
import Footer from '../components/Footer';

export default function HomePage() {
  return (
    <div className="relative overflow-x-hidden">
      {/* Hero — unchanged */}
      <HeroSection />

      {/* New sections from decisionhub */}
      <QuoteSection />
      <AlternatingDomains />
      <Floating3DCard />
      <Device3DMockup />
      <InteractiveCursorSection />
      <SplineEndSection />
      <Footer />
    </div>
  );
}
