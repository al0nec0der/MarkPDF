import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ViewerPage from './pages/ViewerPage';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <div className="bg-[#181818]">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/viewer"
          element={
            <ProtectedRoute>
              <ErrorBoundary>
                <ViewerPage />
              </ErrorBoundary>
            </ProtectedRoute>
          }
        />
        <Route
          path="/pdf/:pdfUuid"
          element={
            <ProtectedRoute>
              <ErrorBoundary>
                <ViewerPage />
              </ErrorBoundary>
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;