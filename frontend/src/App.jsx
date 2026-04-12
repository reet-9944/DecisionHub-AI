import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import HealthcarePage from './pages/HealthcarePage';
import CareerPage from './pages/CareerPage';
import ResumePage from './pages/ResumePage';
import FinancePage from './pages/FinancePage';
import PublicServicesPage from './pages/PublicServicesPage';
import BusinessStrategyPage from './pages/BusinessStrategyPage';
import GlobalStyles from './styles/GlobalStyles';

function App() {
  return (
    <BrowserRouter>
      <GlobalStyles />
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/healthcare" element={<HealthcarePage />} />
        <Route path="/career" element={<CareerPage />} />
        <Route path="/resume" element={<ResumePage />} />
        <Route path="/finance" element={<FinancePage />} />
        <Route path="/public-services" element={<PublicServicesPage />} />
        <Route path="/business" element={<BusinessStrategyPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
