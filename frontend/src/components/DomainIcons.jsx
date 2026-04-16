import React from 'react';
import { motion } from 'framer-motion';
import {
  Heart,
  FileText,
  Briefcase,
  Building2,
  GraduationCap,
  TrendingUp,
} from 'lucide-react';

const iconMap = {
  healthcare: Heart,
  resume: FileText,
  business: Briefcase,
  'public-services': Building2,
  career: GraduationCap,
  finance: TrendingUp,
};

const DomainIcons = ({ domains, activeId, setActiveId }) => {
  return (
    <div style={{ position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', zIndex: 9999 }}>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="flex items-center gap-3 px-6 py-4 backdrop-blur-xl bg-white/80 rounded-3xl shadow-2xl border border-white/40"
      >
        {domains.map((domain, index) => {
          const Icon = iconMap[domain.id];
          const isActive = activeId === domain.id;

          return (
            <motion.button
              key={domain.id}
              onClick={() => setActiveId(domain.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ scale: 1.1, y: -4 }}
              whileTap={{ scale: 0.95 }}
              className="relative group"
            >
              {/* Icon Container */}
              <div
                className={`relative w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 overflow-hidden ${
                  isActive ? 'shadow-xl' : 'shadow-md hover:shadow-lg'
                }`}
                style={{
                  background: isActive ? domain.theme.accent : '#FFFFFF',
                  border: isActive ? `2px solid ${domain.theme.accent}` : '2px solid #E5E7EB',
                  boxShadow: isActive ? `0 8px 24px ${domain.theme.accent}60` : undefined
                }}
              >
                {/* Background image */}
                <img
                  src={domain.iconImage}
                  alt={domain.name}
                  className="absolute inset-0 w-full h-full object-cover opacity-70"
                />
                
                {/* Icon overlay */}
                <div className="relative z-10">
                  <Icon
                    className="w-7 h-7 transition-colors duration-300"
                    style={{
                      color: isActive ? '#FFFFFF' : domain.theme.accent
                    }}
                  />
                </div>

                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute inset-0 rounded-2xl"
                    style={{
                      background: `linear-gradient(135deg, ${domain.theme.accent}40, ${domain.theme.accent}20)`,
                    }}
                    transition={{ type: 'spring', duration: 0.6 }}
                  />
                )}
              </div>

              {/* Tooltip */}
              <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-white whitespace-nowrap shadow-lg"
                  style={{ background: domain.theme.accent }}
                >
                  {domain.name}
                </div>
                <div
                  className="w-2 h-2 mx-auto transform rotate-45"
                  style={{
                    background: domain.theme.accent,
                    marginTop: '-4px'
                  }}
                />
              </div>
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
};

export default DomainIcons;