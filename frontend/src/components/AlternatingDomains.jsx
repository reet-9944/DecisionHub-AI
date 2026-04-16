import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Heart, Rocket, FileText, Wallet, Building2, BarChart3 } from 'lucide-react';

const domainSections = [
  {
    id: 'healthcare',
    title: 'Healthcare AI',
    description: 'Analyze symptoms, assess urgency levels, and receive AI-powered medical guidance. Get personalized health insights backed by medical research and clinical data.',
    icon: Heart,
    illustration: '🏥',
    discount: '40%',
    bgColor: 'from-pink-50 to-rose-50',
    accentColor: '#10B981',
    buttonColor: 'bg-yellow-400 hover:bg-yellow-500',
    imagePosition: 'left'
  },
  {
    id: 'career',
    title: 'Career Advisor',
    description: 'Map your professional journey, identify skill gaps, and plan strategic career moves. Get AI-powered coaching for interviews, negotiations, and career transitions.',
    icon: Rocket,
    illustration: '🚀',
    discount: '60%',
    bgColor: 'from-blue-50 to-cyan-50',
    accentColor: '#F97316',
    buttonColor: 'bg-yellow-400 hover:bg-yellow-500',
    imagePosition: 'right'
  },
  {
    id: 'resume',
    title: 'Resume Analyzer',
    description: 'Score your resume for ATS compatibility, find weaknesses, and get actionable improvement tips. Optimize for specific job descriptions and industries.',
    icon: FileText,
    illustration: '📄',
    discount: '50%',
    bgColor: 'from-purple-50 to-pink-50',
    accentColor: '#3B82F6',
    buttonColor: 'bg-yellow-400 hover:bg-yellow-500',
    imagePosition: 'left'
  },
  {
    id: 'finance',
    title: 'Finance Planner',
    description: 'Build personalized investment strategies and comprehensive financial roadmaps. Analyze spending patterns, optimize savings, and plan for major life goals.',
    icon: Wallet,
    illustration: '💰',
    discount: '45%',
    bgColor: 'from-gray-100 to-gray-200',
    accentColor: '#A855F7',
    buttonColor: 'bg-yellow-400 hover:bg-yellow-500',
    imagePosition: 'right'
  },
  {
    id: 'public-services',
    title: 'Public Services Navigator',
    description: 'Locate government programs, navigate eligibility requirements, and access civic resources. Simplify interactions with public services and benefits.',
    icon: Building2,
    illustration: '🏛️',
    discount: '55%',
    bgColor: 'from-gray-200 to-gray-300',
    accentColor: '#EC4899',
    buttonColor: 'bg-yellow-400 hover:bg-yellow-500',
    imagePosition: 'left'
  },
  {
    id: 'strategy',
    title: 'Business Strategy Advisor',
    description: 'Get strategic recommendations, comprehensive risk analysis, and actionable growth ideas. Make data-driven decisions for scaling your business.',
    icon: BarChart3,
    illustration: '📊',
    discount: '35%',
    bgColor: 'from-gray-300 to-gray-400',
    accentColor: '#EAB308',
    buttonColor: 'bg-yellow-400 hover:bg-yellow-500',
    imagePosition: 'right'
  }
];

const AlternatingDomains = () => {
  const navigate = useNavigate();
  
  return (
    <div className="relative">
      {domainSections.map((domain, index) => {
        const Icon = domain.icon;
        const isLeft = domain.imagePosition === 'left';

        return (
          <section
            key={domain.id}
            className={`min-h-screen flex items-center px-6 py-20 bg-gradient-to-br ${domain.bgColor} relative overflow-hidden`}
          >
            {/* Discount Badge */}
            <motion.div
              initial={{ x: isLeft ? -100 : 100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className={`absolute ${isLeft ? 'left-0' : 'right-0'} top-20 bg-cyan-400 px-8 py-6 shadow-xl z-10`}
              style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%, 10% 50%)' }}
            >
              <div className="text-4xl font-bold text-gray-800">{domain.discount}</div>
              <div className="text-2xl font-bold text-gray-800">OFF</div>
            </motion.div>

            {/* Decorative paw prints */}
            <div className="absolute bottom-10 right-10 opacity-10">
              <div className="text-orange-300 text-8xl rotate-12">🐾</div>
            </div>
            <div className="absolute top-20 left-20 opacity-10">
              <div className="text-cyan-300 text-6xl -rotate-12">🐾</div>
            </div>

            <div className="max-w-7xl mx-auto w-full">
              <div className={`grid lg:grid-cols-2 gap-16 items-center ${isLeft ? '' : 'lg:grid-flow-col-dense'}`}>
                {/* Illustration */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, x: isLeft ? -100 : 100 }}
                  whileInView={{ opacity: 1, scale: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className={`relative flex items-center justify-center ${isLeft ? 'lg:order-1' : 'lg:order-2'}`}
                >
                  <div className="relative">
                    {/* Background blob */}
                    <div 
                      className="absolute inset-0 w-96 h-96 rounded-full blur-3xl opacity-30"
                      style={{ background: domain.accentColor }}
                    />
                    
                    {/* Main illustration */}
                    <motion.div
                      animate={{ 
                        y: [0, -20, 0],
                        rotate: [0, 5, 0]
                      }}
                      transition={{ 
                        duration: 4, 
                        repeat: Infinity,
                        ease: 'easeInOut'
                      }}
                      className="relative w-80 h-80 flex items-center justify-center"
                    >
                      <div className="text-9xl drop-shadow-2xl">{domain.illustration}</div>
                      <Icon 
                        className="absolute bottom-4 right-4 w-16 h-16 drop-shadow-lg" 
                        style={{ color: domain.accentColor }}
                      />
                    </motion.div>
                  </div>
                </motion.div>

                {/* Content */}
                <motion.div
                  initial={{ opacity: 0, x: isLeft ? 100 : -100 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className={`space-y-6 ${isLeft ? 'lg:order-2' : 'lg:order-1'}`}
                >
                  <h2 className="text-5xl lg:text-6xl font-bold text-gray-800">
                    {domain.title}
                  </h2>

                  <p className="text-lg text-gray-600 leading-relaxed max-w-xl">
                    {domain.description}
                  </p>

                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      if (domain.id === 'healthcare') {
                        navigate('/healthcare-dashboard');
                      }
                    }}
                    className={`px-10 py-4 ${domain.buttonColor} text-gray-800 font-bold text-xl rounded-2xl shadow-lg transition-all cursor-pointer`}
                  >
                    ANALYZE NOW
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default AlternatingDomains;