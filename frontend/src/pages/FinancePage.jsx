import React from 'react';
import PageLayout from '../components/PageLayout';
import AIForm from '../components/AIForm';

const fields = [
  { key: 'income', label: 'Monthly Income ($)', type: 'number', placeholder: 'e.g. 5000', required: true },
  { key: 'savings', label: 'Current Savings ($)', type: 'number', placeholder: 'e.g. 20000', required: true },
  { key: 'riskTolerance', label: 'Risk Tolerance', type: 'select', options: ['Conservative', 'Moderate', 'Aggressive'], required: true },
  { key: 'financialGoal', label: 'Financial Goal', type: 'textarea', placeholder: 'e.g. Save for retirement, buy a house, build emergency fund...', required: true },
];

export default function FinancePage() {
  return (
    <PageLayout icon="💰" title="Finance Planner" subtitle="Personalized investment strategies and financial roadmaps" color="#7c3aed">
      <AIForm domain="finance" fields={fields} color="#7c3aed" />
    </PageLayout>
  );
}
