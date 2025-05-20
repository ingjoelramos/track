import React from 'react';
import { Header } from './header';
import { ToastProvider } from '../ui/toast';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <Header />
        <main className="container mx-auto px-4 py-8">{children}</main>
      </div>
    </ToastProvider>
  );
}