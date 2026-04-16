import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import GlobalStyles from './styles/GlobalStyles';

import Landing from './pages/Landing';
import HomePage from './pages/HomePage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import HealthcarePage from './pages/HealthcarePage';
import HealthcareDashboard from './pages/HealthcareDashboard';
import CareerPage from './pages/CareerPage';
import ResumePage from './pages/ResumePage';
import FinancePage from './pages/FinancePage';
import PublicServicesPage from './pages/PublicServicesPage';
import BusinessStrategyPage from './pages/BusinessStrategyPage';
import ProfilePage from './pages/ProfilePage';
import ReportAnalyzerPage from './pages/ReportAnalyzerPage';

const protect = (Component) => (
  <ProtectedRoute><Component /></ProtectedRoute>
);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <GlobalStyles />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/home" element={<><Navbar /><HomePage /></>} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/profile" element={protect(ProfilePage)} />
          <Route path="/report-analyzer" element={protect(ReportAnalyzerPage)} />
          <Route path="/healthcare" element={protect(HealthcarePage)} />
          <Route path="/healthcare-dashboard" element={<HealthcareDashboard />} />
          <Route path="/career" element={protect(CareerPage)} />
          <Route path="/resume" element={protect(ResumePage)} />
          <Route path="/finance" element={protect(FinancePage)} />
          <Route path="/public-services" element={protect(PublicServicesPage)} />
          <Route path="/business" element={protect(BusinessStrategyPage)} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
