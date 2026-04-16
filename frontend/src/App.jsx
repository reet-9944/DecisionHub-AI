import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import HealthcareDashboard from './pages/HealthcareDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/healthcare-dashboard" element={<HealthcareDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
