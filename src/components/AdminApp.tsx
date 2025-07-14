import React, { useState, useEffect } from 'react';
import { AdminLogin } from './AdminLogin';
import { AdminDashboard } from './AdminDashboard';

export const AdminApp: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if admin is already authenticated
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleAdminAuth = (token: string) => {
    setIsAuthenticated(true);
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onAdminAuth={handleAdminAuth} />;
  }

  return <AdminDashboard onSignOut={handleSignOut} />;
};