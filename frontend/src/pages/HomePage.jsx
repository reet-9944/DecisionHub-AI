import React from 'react';
import HeroSection from '../components/HeroSection';
import DomainGrid from '../components/DomainGrid';
import DecisionFlow from '../components/DecisionFlow';
import Features from '../components/Features';
import CTASection from '../components/CTASection';
import Footer from '../components/Footer';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <DomainGrid />
      <DecisionFlow />
      <Features />
      <CTASection />
      <Footer />
    </>
  );
}
