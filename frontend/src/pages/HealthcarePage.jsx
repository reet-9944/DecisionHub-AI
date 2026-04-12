import React from 'react';
import PageLayout from '../components/PageLayout';
import AIForm from '../components/AIForm';

const fields = [
  { key: 'symptoms', label: 'Symptoms', type: 'textarea', placeholder: 'Describe your symptoms in detail...', required: true },
  { key: 'age', label: 'Age', type: 'number', placeholder: 'e.g. 35', required: true },
  { key: 'medicalHistory', label: 'Medical History', type: 'textarea', placeholder: 'Any existing conditions, medications, allergies...' },
  { key: 'urgency', label: 'Urgency Level', type: 'select', options: ['Low', 'Medium', 'High', 'Emergency'], required: true },
];

export default function HealthcarePage() {
  return (
    <PageLayout icon="🏥" title="Healthcare AI" subtitle="Symptom analysis and urgency assessment" color="#10b981">
      <AIForm domain="healthcare" fields={fields} color="#10b981" />
    </PageLayout>
  );
}
