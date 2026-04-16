import { useState } from 'react';
import { InputForm } from './components/InputForm';
import { LoadingOverlay } from './components/LoadingOverlay';
import { Dashboard } from './components/Dashboard';
import { motion, AnimatePresence } from 'motion/react';

type ViewState = 'initial' | 'loading' | 'dashboard';

interface FormData {
  name: string;
  problem: string;
}

export default function App() {
  const [viewState, setViewState] = useState<ViewState>('initial');
  const [formData, setFormData] = useState<FormData>({ name: '', problem: '' });

  const handleAnalyze = (data: FormData) => {
    setFormData(data);
    setViewState('loading');
    
    // Simulate AI processing
    setTimeout(() => {
      setViewState('dashboard');
    }, 2500);
  };

  const handleNewAnalysis = () => {
    setViewState('initial');
    setFormData({ name: '', problem: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] overflow-hidden">
      <AnimatePresence mode="wait">
        {viewState === 'initial' && (
          <motion.div
            key="initial"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex items-center justify-center p-6"
          >
            <InputForm onAnalyze={handleAnalyze} initialData={formData} />
          </motion.div>
        )}

        {viewState === 'loading' && (
          <LoadingOverlay key="loading" />
        )}

        {viewState === 'dashboard' && (
          <Dashboard 
            key="dashboard" 
            formData={formData} 
            onNewAnalysis={handleNewAnalysis}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
