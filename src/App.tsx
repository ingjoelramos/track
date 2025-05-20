import React, { useState, useEffect } from 'react';
import { Layout } from './components/layout/layout';
import { HomePage } from './pages/home-page';
import { CampaignCreatePage } from './pages/campaign-create-page';
import { DashboardPage } from './pages/dashboard-page';
import { ProfilePage } from './pages/profile-page';
import { DomainSettingsPage } from './pages/domain-settings-page';
import { AdminPage } from './pages/admin-page';
import { AuthModal } from './components/auth/auth-modal';
import { getCurrentUser } from './lib/auth';

function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [params, setParams] = useState<Record<string, string>>({});
  const [user, setUser] = useState(getCurrentUser());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(!getCurrentUser());
  
  useEffect(() => {
    // Simple client-side routing
    const handleNavigation = () => {
      const path = window.location.pathname;
      const searchParams = new URLSearchParams(window.location.search);
      const newParams: Record<string, string> = {};
      
      for (const [key, value] of searchParams.entries()) {
        newParams[key] = value;
      }
      
      setParams(newParams);
      
      if (path === '/') {
        setCurrentPage('home');
      } else if (path === '/create-campaign') {
        setCurrentPage('create-campaign');
      } else if (path.startsWith('/dashboard/')) {
        const campaignId = path.split('/')[2];
        setParams(prev => ({ ...prev, campaignId }));
        setCurrentPage('dashboard');
      } else if (path === '/profile') {
        setCurrentPage('profile');
      } else if (path === '/domains') {
        setCurrentPage('domains');
      } else if (path === '/admin') {
        setCurrentPage('admin');
      } else {
        setCurrentPage('home');
      }
    };
    
    handleNavigation();
    window.addEventListener('popstate', handleNavigation);
    return () => window.removeEventListener('popstate', handleNavigation);
  }, []);
  
  // Update the document title
  useEffect(() => {
    let title = 'TrackPro';
    switch (currentPage) {
      case 'create-campaign':
        title += ' | Create Campaign';
        break;
      case 'dashboard':
        title += ' | Dashboard';
        break;
      case 'profile':
        title += ' | Profile Settings';
        break;
      case 'domains':
        title += ' | Domain Settings';
        break;
      case 'admin':
        title += ' | Admin Dashboard';
        break;
    }
    document.title = title;
  }, [currentPage]);
  
  const renderPage = () => {
    // If not authenticated, show auth modal
    if (!user) {
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-heading font-bold mb-2">TrackPro</h1>
              <p className="text-gray-500 dark:text-gray-400">
                Advanced Campaign Tracking System
              </p>
            </div>
          </div>
        </div>
      );
    }
    
    switch (currentPage) {
      case 'create-campaign':
        return <CampaignCreatePage />;
      case 'dashboard':
        return <DashboardPage campaignId={params.campaignId || ''} />;
      case 'profile':
        return <ProfilePage />;
      case 'domains':
        return <DomainSettingsPage />;
      case 'admin':
        return <AdminPage />;
      default:
        return <HomePage />;
    }
  };
  
  return (
    <Layout>
      {renderPage()}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        onAuth={(newUser) => {
          setUser(newUser);
          setIsAuthModalOpen(false);
        }}
      />
    </Layout>
  );
}

export default App;