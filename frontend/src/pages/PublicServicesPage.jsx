import React from 'react';
import PageLayout from '../components/PageLayout';
import AIForm from '../components/AIForm';

const fields = [
  { key: 'location', label: 'Location (City, State)', type: 'text', placeholder: 'e.g. Austin, Texas', required: true },
  { key: 'serviceNeeded', label: 'Service Needed', type: 'select', options: ['Housing Assistance', 'Food Programs', 'Healthcare Coverage', 'Unemployment Benefits', 'Education Grants', 'Small Business Support', 'Disability Services'], required: true },
  { key: 'eligibilityDetails', label: 'Eligibility Details', type: 'textarea', placeholder: 'Income level, household size, employment status, any relevant details...' },
];

export default function PublicServicesPage() {
  return (
    <PageLayout icon="🏛️" title="Public Services Navigator" subtitle="Locate government programs and navigate eligibility" color="#ec4899">
      <AIForm domain="public" fields={fields} color="#ec4899" />
    </PageLayout>
  );
}
