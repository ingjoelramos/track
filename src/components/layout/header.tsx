import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Moon, Sun, UserCircle, Settings, LogOut, User, ChevronDown, Bell, Users, Shield } from 'lucide-react';
import { Button } from '../ui/button';
import { getCurrentUser, logout, hasRole } from '../../lib/auth';
import { AuthModal } from '../auth/auth-modal';
import { ProfileMenu } from '../profile/profile-menu';
import { NotificationsMenu } from '../notifications/notifications-menu';

export function Header() {
  const [user, setUser] = useState(getCurrentUser());
  const [theme, setTheme] = useState<'light' | 'dark'>(
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  );
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const isAdmin = hasRole('admin');
  
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark');
  };
  
  const handleLogout = () => {
    logout();
    setUser(null);
    setIsProfileOpen(false);
    window.location.reload();
  };
  
  return (
    <>
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-primary-600 dark:text-primary-500" />
            <h1 className="text-xl font-heading font-bold">TrackPro</h1>
          </div>
          
          {user && (
            <div className="hidden md:flex items-center space-x-4">
              <a href="/" className="text-sm font-medium hover:text-primary-600 dark:hover:text-primary-400">
                Dashboard
              </a>
              <a href="/create-campaign" className="text-sm font-medium hover:text-primary-600 dark:hover:text-primary-400">
                Campaigns
              </a>
              <a href="/domains" className="text-sm font-medium hover:text-primary-600 dark:hover:text-primary-400">
                Domains
              </a>
              {isAdmin && (
                <a href="/admin" className="text-sm font-medium hover:text-primary-600 dark:hover:text-primary-400">
                  <Shield className="h-4 w-4 inline-block mr-1" />
                  Admin
                </a>
              )}
            </div>
          )}
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={toggleTheme}>
              {theme === 'light' ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>
            
            {user ? (
              <>
                <div className="relative">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                    className="relative"
                  >
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-error-500 ring-2 ring-white dark:ring-gray-900"></span>
                  </Button>
                  
                  {isNotificationsOpen && (
                    <NotificationsMenu onClose={() => setIsNotificationsOpen(false)} />
                  )}
                </div>
                
                <div className="relative">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2"
                  >
                    <div className="hidden md:flex flex-col items-end">
                      <span className="text-sm font-medium">{user.name || user.email}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user.role}</span>
                    </div>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900">
                      <User className="h-5 w-5 text-primary-700 dark:text-primary-300" />
                    </div>
                    <ChevronDown className="h-4 w-4 hidden md:block" />
                  </Button>
                  
                  {isProfileOpen && (
                    <ProfileMenu user={user} onLogout={handleLogout} onClose={() => setIsProfileOpen(false)} />
                  )}
                </div>
              </>
            ) : (
              <Button size="sm" onClick={() => setIsAuthModalOpen(true)}>
                Login
              </Button>
            )}
          </div>
        </div>
      </header>
      
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        onAuth={(newUser) => {
          setUser(newUser);
          setIsAuthModalOpen(false);
        }}
      />
    </>
  );
}