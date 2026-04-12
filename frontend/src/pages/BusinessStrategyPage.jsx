import React from 'react';
import PageLayout from '../components/PageLayout';
import AIForm from '../components/AIForm';

const fields = [
  { key: 'industry', label: 'Industry', type: 'text', placeholder: 'e.g. SaaS, E-commerce, Healthcare Tech', required: true },
  { key: 'companyStage', label: 'Company Stage', type: 'select', options: ['Idea Stage', 'Pre-Seed', 'Seed', 'Series A', 'Growth', 'Enterprise'], required: true },
  { key: 'businessChallenge', label: 'Business Challenge', type: 'textarea', placeholder: 'Describe your main challenge or strategic question...', required: true },
  { key: 'teamSize', label: 'Team Size', type: 'number', placeholder: 'e.g. 12' },
];

export default function BusinessStrategyPage() {
  return (
    <PageLayout icon="📊" title="Business Strategy Advisor" subtitle="Strategic recommendations, risk analysis, and growth ideas" color="#f97316">
      <AIForm domain="business" fields={fields} color="#f97316" />
    </PageLayout>
  );
}
