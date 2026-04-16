import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Heart, FileText, Briefcase, Building2, GraduationCap, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const domains = [
  {
    id: 'healthcare',
    name: 'Healthcare',
    title: 'AI-Powered Healthcare Decisions',
    description: 'Navigate complex medical choices with confidence. Our AI analyzes treatment options and helps you make informed healthcare decisions.',
    heroImage: 'https://images.pexels.com/photos/7089024/pexels-photo-7089024.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    iconImage: 'https://images.pexels.com/photos/36101262/pexels-photo-36101262.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    route: '/healthcare',
    theme: {
      background: 'linear-gradient(135deg, #0c4a6e 0%, #0e7490 50%, #164e63 100%)',
      accent: '#0EA5E9',
      buttonBg: '#0EA5E9',
      buttonText: '#FFFFFF',
      textPrimary: '#e0f2fe',
      textSecondary: '#bae6fd',
    },
  },
  {
    id: 'resume',
    name: 'Resume',
    title: 'Intelligent Resume Optimization',
    description: 'Transform your career story with AI-driven insights. Get personalized recommendations and ATS optimization.',
    heroImage: 'https://images.unsplash.com/photo-1634562876572-5abe57afcceb?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMzV8MHwxfHNlYXJjaHwyfHxwcm9mZXNzaW9uYWwlMjBkb2N1bWVudHxlbnwwfHx8fDE3NzYyNjQxMzR8MA&ixlib=rb-4.1.0&q=85',
    iconImage: 'https://images.unsplash.com/photo-1633360821222-7e8df83639fb?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMzV8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBkb2N1bWVudHxlbnwwfHx8fDE3NzYyNjQxMzR8MA&ixlib=rb-4.1.0&q=85',
    route: '/resume',
    theme: {
      background: 'linear-gradient(135deg, #78350f 0%, #b45309 50%, #92400e 100%)',
      accent: '#F59E0B',
      buttonBg: '#D97706',
      buttonText: '#FFFFFF',
      textPrimary: '#fef3c7',
      textSecondary: '#fde68a',
    },
  },
  {
    id: 'business',
    name: 'Business',
    title: 'Strategic Business Intelligence',
    description: 'Make data-driven decisions that propel your business forward. Our AI evaluates market trends and strategic opportunities.',
    heroImage: 'https://images.unsplash.com/photo-1650978810653-112cb6018092?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxNzV8MHwxfHNlYXJjaHwyfHxidXNpbmVzcyUyMHN0cmF0ZWd5fGVufDB8fHx8MTc3NjI2NDEzOHww&ixlib=rb-4.1.0&q=85',
    iconImage: 'https://images.pexels.com/photos/7688106/pexels-photo-7688106.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    route: '/business',
    theme: {
      background: 'linear-gradient(135deg, #701a75 0%, #a21caf 50%, #86198f 100%)',
      accent: '#C026D3',
      buttonBg: '#A21CAF',
      buttonText: '#FFFFFF',
      textPrimary: '#fae8ff',
      textSecondary: '#f0abfc',
    },
  },
  {
    id: 'public',
    name: 'Public Services',
    title: 'Civic Decision Support',
    description: 'Empower citizens with transparent, AI-assisted guidance. Make navigating government processes simple and efficient.',
    heroImage: 'https://images.unsplash.com/photo-1624417963912-8532660d9de8?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHwyfHxnb3Zlcm5tZW50JTIwYnVpbGRpbmd8ZW58MHx8fHwxNzc2MjY0MTY0fDA&ixlib=rb-4.1.0&q=85',
    iconImage: 'https://images.pexels.com/photos/34223492/pexels-photo-34223492.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    route: '/public-services',
    theme: {
      background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #1e40af 100%)',
      accent: '#3B82F6',
      buttonBg: '#2563EB',
      buttonText: '#FFFFFF',
      textPrimary: '#dbeafe',
      textSecondary: '#bfdbfe',
    },
  },
  {
    id: 'career',
    name: 'Career',
    title: 'Your AI Career Guide',
    description: 'Chart your professional path with intelligent career planning. Receive personalized advice on skill development and growth.',
    heroImage: 'https://images.unsplash.com/photo-1698767008609-f5fa6137b9e6?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2OTV8MHwxfHNlYXJjaHwxfHxjYXJlZXIlMjBncm93dGh8ZW58MHx8fHwxNzc2MjY0MTY4fDA&ixlib=rb-4.1.0&q=85',
    iconImage: 'https://images.unsplash.com/photo-1698767008609-f5fa6137b9e6?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2OTV8MHwxfHNlYXJjaHwxfHxjYXJlZXIlMjBncm93dGh8ZW58MHx8fHwxNzc2MjY0MTY4fDA&ixlib=rb-4.1.0&q=85',
    route: '/career',
    theme: {
      background: 'linear-gradient(135deg, #831843 0%, #db2777 50%, #9f1239 100%)',
      accent: '#EC4899',
      buttonBg: '#DB2777',
      buttonText: '#FFFFFF',
      textPrimary: '#fce7f3',
      textSecondary: '#fbcfe8',
    },
  },
  {
    id: 'finance',
    name: 'Finance',
    title: 'Smart Financial Strategy',
    description: 'Optimize your financial future with AI-powered insights. Make confident decisions backed by comprehensive analysis.',
    heroImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHwxfHxmaW5hbmNpYWwlMjBwbGFubmluZ3xlbnwwfHx8fDE3NzYyNjQxNzJ8MA&ixlib=rb-4.1.0&q=85',
    iconImage: 'https://images.pexels.com/photos/7654592/pexels-photo-7654592.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    route: '/finance',
    theme: {
      background: 'linear-gradient(135deg, #064e3b 0%, #059669 50%, #065f46 100%)',
      accent: '#10B981',
      buttonBg: '#059669',
      buttonText: '#FFFFFF',
      textPrimary: '#d1fae5',
      textSecondary: '#a7f3d0',
    },
  },
];

const iconMap = {
  healthcare: Heart,
  resume: FileText,
  business: Briefcase,
  public: Building2,
  career: GraduationCap,
  finance: TrendingUp,
};

export default function HeroSection() {
  const [activeId, setActiveId] = useState('healthcare');
  const navigate = useNavigate();
  const activeDomain = domains.find((d) => d.id === activeId);

  return (
    <>
      {/* Hero Section — scoped background, not fixed */}
      <section style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>

        {/* Animated background — absolute within this section only */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeDomain.id + '-bg'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            style={{
              position: 'absolute', inset: 0, zIndex: 0,
              background: activeDomain.theme.background,
            }}
          />
        </AnimatePresence>

        {/* Radial overlays */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '50%',
            background: `radial-gradient(ellipse at top, ${activeDomain.theme.accent}25, transparent)`,
          }} />
          <div style={{
            position: 'absolute', bottom: 0, right: 0, width: '100%', height: '50%',
            background: `radial-gradient(ellipse at bottom right, ${activeDomain.theme.accent}15, transparent)`,
          }} />
          {/* Bottom fade into dark for smooth transition to next section */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: '180px',
            background: 'linear-gradient(to bottom, transparent, #050508)',
          }} />
        </div>

        {/* Content */}
        <div style={{
          position: 'relative', zIndex: 2,
          minHeight: '100vh', display: 'flex', alignItems: 'center',
          padding: '100px 2rem 140px',
        }}>
          <div style={{ maxWidth: 1280, margin: '0 auto', width: '100%' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '4rem', alignItems: 'center',
            }}>

              {/* Left — Text */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeDomain.id}-content`}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
                >
                  {/* Badge */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 8,
                      padding: '8px 16px', borderRadius: 100, width: 'fit-content',
                      background: `${activeDomain.theme.accent}25`,
                      border: `1px solid ${activeDomain.theme.accent}50`,
                    }}
                  >
                    <Sparkles size={16} style={{ color: activeDomain.theme.accent }} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: activeDomain.theme.textPrimary }}>
                      AI-Powered Decision Intelligence
                    </span>
                  </motion.div>

                  {/* Headline */}
                  <div>
                    <motion.h1
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      style={{
                        fontSize: 'clamp(36px, 5vw, 66px)',
                        fontWeight: 800, lineHeight: 1.1,
                        letterSpacing: '-2px', marginBottom: '1rem',
                        color: activeDomain.theme.textPrimary,
                      }}
                    >
                      {activeDomain.title}
                    </motion.h1>
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                      style={{
                        fontSize: 18, lineHeight: 1.7,
                        color: activeDomain.theme.textSecondary, maxWidth: 480,
                      }}
                    >
                      {activeDomain.description}
                    </motion.p>
                  </div>

                  {/* CTA Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}
                  >
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate(activeDomain.route)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '14px 28px', borderRadius: 50,
                        background: activeDomain.theme.buttonBg,
                        color: activeDomain.theme.buttonText,
                        border: 'none', fontWeight: 700, fontSize: 16, cursor: 'pointer',
                        boxShadow: `0 10px 30px ${activeDomain.theme.accent}50`,
                      }}
                    >
                      Try DecisionHub AI
                      <ArrowRight size={18} />
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => document.getElementById('domains')?.scrollIntoView({ behavior: 'smooth' })}
                      style={{
                        padding: '14px 28px', borderRadius: 50,
                        background: `${activeDomain.theme.accent}15`,
                        color: activeDomain.theme.textPrimary,
                        border: `2px solid ${activeDomain.theme.accent}40`,
                        fontWeight: 600, fontSize: 16, cursor: 'pointer',
                      }}
                    >
                      Explore Domains
                    </motion.button>
                  </motion.div>

                  {/* Domain Icon Dock — inline below buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.65 }}
                  >
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: 8,
                      padding: '10px 16px',
                      background: 'rgba(255,255,255,0.88)',
                      backdropFilter: 'blur(20px)',
                      borderRadius: 24,
                      boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
                      border: '1px solid rgba(255,255,255,0.6)',
                    }}>
                      {domains.map((domain, index) => {
                        const Icon = iconMap[domain.id];
                        const isActive = activeId === domain.id;
                        return (
                          <motion.button
                            key={domain.id}
                            onClick={() => setActiveId(domain.id)}
                            whileHover={{ scale: 1.12, y: -4 }}
                            whileTap={{ scale: 0.95 }}
                            title={domain.name}
                            style={{
                              position: 'relative', width: 52, height: 52,
                              borderRadius: 13, cursor: 'pointer', overflow: 'hidden',
                              padding: 0,
                              background: isActive ? domain.theme.accent : '#fff',
                              border: isActive ? `2px solid ${domain.theme.accent}` : '2px solid #e5e7eb',
                              boxShadow: isActive ? `0 6px 18px ${domain.theme.accent}60` : '0 2px 6px rgba(0,0,0,0.08)',
                              transition: 'all 0.3s',
                              flexShrink: 0,
                            }}
                          >
                            <img
                              src={domain.iconImage}
                              alt={domain.name}
                              style={{
                                position: 'absolute', inset: 0,
                                width: '100%', height: '100%',
                                objectFit: 'cover', opacity: 0.6,
                              }}
                            />
                            <div style={{
                              position: 'relative', zIndex: 1,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              height: '100%',
                            }}>
                              <Icon size={20} color={isActive ? '#fff' : domain.theme.accent} />
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>

                  {/* Stats */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap' }}
                  >
                    {[['6', 'AI Domains'], ['98%', 'Accuracy'], ['< 2s', 'Response Time']].map(([val, label]) => (
                      <div key={label} style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 26, fontWeight: 800, color: activeDomain.theme.textPrimary }}>{val}</div>
                        <div style={{ fontSize: 12, color: activeDomain.theme.textSecondary, marginTop: 2 }}>{label}</div>
                      </div>
                    ))}
                  </motion.div>
                </motion.div>
              </AnimatePresence>

              {/* Right — Hero Image */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeDomain.id + '-img'}
                  initial={{ opacity: 0, scale: 0.8, rotateY: 20 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  exit={{ opacity: 0, scale: 0.8, rotateY: -20 }}
                  transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
                  style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <motion.div
                    animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    style={{
                      position: 'absolute', top: -40, left: -40,
                      width: 80, height: 80, borderRadius: '50%',
                      background: activeDomain.theme.accent, opacity: 0.5, filter: 'blur(24px)',
                    }}
                  />
                  <motion.div
                    animate={{ y: [0, 30, 0], rotate: [0, -5, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                    style={{
                      position: 'absolute', bottom: -40, right: -40,
                      width: 120, height: 120, borderRadius: '50%',
                      background: activeDomain.theme.accent, opacity: 0.3, filter: 'blur(32px)',
                    }}
                  />
                  <motion.div
                    animate={{ y: [0, -15, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <motion.img
                      src={activeDomain.heroImage}
                      alt={activeDomain.name}
                      initial={{ scale: 1.1 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.8 }}
                      style={{
                        width: '100%', maxWidth: 480, height: 'auto',
                        objectFit: 'cover', borderRadius: 24,
                        boxShadow: `0 30px 80px ${activeDomain.theme.accent}40`,
                      }}
                    />
                  </motion.div>
                </motion.div>
              </AnimatePresence>

            </div>
          </div>
        </div>
      </section>

    </>
  );
}
