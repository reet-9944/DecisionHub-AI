import { useState } from 'react';
import { motion } from 'motion/react';
import { InputForm } from './InputForm';
import { OverviewTab } from './dashboard/OverviewTab';
import { ReasoningTab } from './dashboard/ReasoningTab';
import { FactorsTab } from './dashboard/FactorsTab';
import { ActionsTab } from './dashboard/ActionsTab';

interface DashboardProps {
  formData: { name: string; problem: string };
  onNewAnalysis: () => void;
}

type TabType = 'overview' | 'reasoning' | 'factors' | 'actions';

export function Dashboard({ formData, onNewAnalysis }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const tabs = [
    { id: 'overview' as TabType, label: 'Overview' },
    { id: 'reasoning' as TabType, label: 'Reasoning' },
    { id: 'factors' as TabType, label: 'Factors' },
    { id: 'actions' as TabType, label: 'Actions' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex h-screen overflow-hidden"
    >
      {/* Left Panel - Sticky Input */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-[400px] flex-shrink-0 p-6 overflow-hidden"
      >
        <div className="h-full flex flex-col">
          <InputForm onAnalyze={onNewAnalysis} initialData={formData} />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-4 text-center"
          >
            <p className="text-white/60 text-sm">
              Results for <span className="text-white/90">{formData.name}</span>
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Panel - Scrollable Output */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex-1 overflow-y-auto p-6 pb-8"
      >
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Tab Navigation */}
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-2 inline-flex gap-2">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`px-6 py-2.5 rounded-xl transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.label}
              </motion.button>
            ))}
          </div>

          {/* Tab Content */}
          <div>
            {activeTab === 'overview' && <OverviewTab problem={formData.problem} />}
            {activeTab === 'reasoning' && <ReasoningTab problem={formData.problem} />}
            {activeTab === 'factors' && <FactorsTab />}
            {activeTab === 'actions' && <ActionsTab />}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
