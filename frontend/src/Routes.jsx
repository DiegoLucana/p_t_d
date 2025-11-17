import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import LoginPage from './pages/login';
import VideoAnalysisPlayback from './pages/video-analysis-playback';
import RealTimeMonitoringDashboard from './pages/real-time-monitoring-dashboard';
import ValidationLaboratory from './pages/validation-laboratory';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/video-analysis-playback" element={<VideoAnalysisPlayback />} />
        <Route path="/real-time-monitoring-dashboard" element={<RealTimeMonitoringDashboard />} />
        <Route path="/validation-laboratory" element={<ValidationLaboratory />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
