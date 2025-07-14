import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import AdminDashboard from './pages/admin/Dashboard';
import ClientDashboard from './pages/client/Dashboard';
import Login from './pages/Login';
import { cn } from './lib/utils';

function App() {
  return (
    <ThemeProvider>
      <div className={cn(
        "min-h-screen font-sans text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-brand-navy",
        "selection:bg-brand-gold/10 selection:text-brand-gold-dark dark:selection:bg-brand-gold/20 dark:selection:text-brand-gold",
        "transition-colors duration-200"
      )}>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/admin/*" element={<AdminDashboard />} />
              <Route path="/client/*" element={<ClientDashboard />} />
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </div>
    </ThemeProvider>
  );
}

export default App;