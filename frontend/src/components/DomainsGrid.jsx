import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Heart,
  Rocket,
  FileText,
  Wallet,
  Building2,
  BarChart3,
} from 'lucide-react';

const domainRoutes = {
  healthcare: '/healthcare-dashboard',
};

const domainCards = [
  {
    id: 'healthcare',
    icon: Heart,
    title: 'Healthcare AI',
    subtitle: 'by Health Engine',
    tags: ['Health', 'Diagnostics'],
    description: 'Analyze symptoms, assess urgency, and get AI-powered medical guidance.',
    color: '#10B981',
    bgGradient: 'from-emerald-900/20 to-teal-900/20'
  },
  {
    id: 'career',
    icon: Rocket,
    title: 'Career Advisor',
    subtitle: 'by Career Engine',
    tags: ['Growth', 'Skills'],
    description: 'Map your career path, identify skill gaps, and plan your next move.',
    color: '#F97316',
    bgGradient: 'from-orange-900/20 to-red-900/20'
  },
  {
    id: 'resume',
    icon: FileText,
    title: 'Resume Analyzer',
    subtitle: 'by HR Engine',
    tags: ['ATS', 'Hiring'],
    description: 'Score your resume for ATS, find weaknesses, and get improvement tips.',
    color: '#3B82F6',
    bgGradient: 'from-blue-900/20 to-cyan-900/20'
  },
  {
    id: 'finance',
    icon: Wallet,
    title: 'Finance Planner',
    subtitle: 'by Finance Engine',
    tags: ['Finance', 'Money'],
    description: 'Build personalized investment strategies and financial roadmaps.',
    color: '#A855F7',
    bgGradient: 'from-purple-900/20 to-violet-900/20'
  },
  {
    id: 'public-services',
    icon: Building2,
    title: 'Public Services',
    subtitle: 'by Civic Engine',
    tags: ['Civic', 'Access'],
    description: 'Locate government programs and navigate eligibility requirements.',
    color: '#EC4899',
    bgGradient: 'from-pink-900/20 to-rose-900/20'
  },
  {
    id: 'strategy',
    icon: BarChart3,
    title: 'Strategy Advisor',
    subtitle: 'by Business Engine',
    tags: ['Strategy', 'Growth'],
    description: 'Get strategic recommendations, risk analysis, and growth ideas.',
    color: '#EAB308',
    bgGradient: 'from-yellow-900/20 to-amber-900/20'
  }
];

const DomainsGrid = () => {
  const ref = useRef(null);
  const navigate = useNavigate();
  const isInView = useInView(ref, { once: false, amount: 0.2 });

  return (
    <section ref={ref} className="py-32 px-6 bg-black relative overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black opacity-50" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl lg:text-6xl font-bold text-white mb-6">
            Domains of Intelligence
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Specialized AI engines for every critical life and business domain.
          </p>
        </motion.div>

        {/* Domain Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {domainCards.map((domain, index) => {
            const Icon = domain.icon;
            
            return (
              <motion.div
                key={domain.id}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.03,
                  y: -8,
                  transition: { duration: 0.3 }
                }}
                onClick={() => domainRoutes[domain.id] && navigate(domainRoutes[domain.id])}
                className={`group relative ${domainRoutes[domain.id] ? 'cursor-pointer' : ''}`}
              >
                <div className={`relative h-full p-8 rounded-3xl bg-gradient-to-br ${domain.bgGradient} backdrop-blur-xl border border-white/10 overflow-hidden`}>
                  {/* Glow effect on hover */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `radial-gradient(circle at 50% 50%, ${domain.color}20, transparent 70%)`
                    }}
                  />

                  {/* Icon */}
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 relative z-10"
                    style={{ background: `${domain.color}20` }}
                  >
                    <Icon className="w-8 h-8" style={{ color: domain.color }} />
                  </div>

                  {/* Content */}
                  <div className="relative z-10 space-y-4">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-1">
                        {domain.title}
                      </h3>
                      <p className="text-sm text-gray-500">{domain.subtitle}</p>
                    </div>

                    {/* Tags */}
                    <div className="flex gap-2">
                      {domain.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 rounded-full text-xs font-medium"
                          style={{
                            background: `${domain.color}15`,
                            color: domain.color
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Description */}
                    <p className="text-gray-400 leading-relaxed">
                      {domain.description}
                    </p>

                    {/* CTA */}
                    <motion.button
                      whileHover={{ x: 5 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (domainRoutes[domain.id]) navigate(domainRoutes[domain.id]);
                      }}
                      className="flex items-center gap-2 font-semibold mt-6 group/btn"
                      style={{ color: domain.color }}
                    >
                      Analyze Now
                      <svg
                        className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default DomainsGrid;