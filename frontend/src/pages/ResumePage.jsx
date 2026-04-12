import React from 'react';
import PageLayout from '../components/PageLayout';
import AIForm from '../components/AIForm';

const fields = [
  { key: 'resumeText', label: 'Resume Content', type: 'textarea', placeholder: 'Paste your full resume text here...', required: true },
  { key: 'targetRole', label: 'Target Job Role', type: 'text', placeholder: 'e.g. Senior Product Manager', required: true },
];

export default function ResumePage() {
  return (
    <PageLayout icon="📄" title="Resume Analyzer" subtitle="ATS scoring and improvement suggestions" color="#06b6d4">
      <AIForm domain="resume" fields={fields} color="#06b6d4" />
    </PageLayout>
  );
}
