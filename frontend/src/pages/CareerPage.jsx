import React from 'react';
import PageLayout from '../components/PageLayout';
import AIForm from '../components/AIForm';

const fields = [
  { key: 'currentRole', label: 'Current Role', type: 'text', placeholder: 'e.g. Junior Software Developer', required: true },
  { key: 'skills', label: 'Current Skills', type: 'textarea', placeholder: 'List your key skills, technologies, tools...', required: true },
  { key: 'experience', label: 'Years of Experience', type: 'number', placeholder: 'e.g. 3', required: true },
  { key: 'careerGoal', label: 'Career Goal', type: 'textarea', placeholder: 'Where do you want to be in 3-5 years?', required: true },
];

export default function CareerPage() {
  return (
    <PageLayout icon="🚀" title="Career Advisor" subtitle="Professional pathway and skills gap analysis" color="#f59e0b">
      <AIForm domain="career" fields={fields} color="#f59e0b" />
    </PageLayout>
  );
}
