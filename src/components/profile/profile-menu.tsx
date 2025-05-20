import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Settings, LogOut, UserCircle, Shield, Key } from 'lucide-react';

interface ProfileMenuProps {
  user: { id: string; email: string; role: string; name: string };
  onLogout: () => void;
  onClose: () => void;
}

export function ProfileMenu({ user, onLogout, onClose }: ProfileMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);
  
  return (
    <motion.div
      ref={menuRef}
      className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800 dark:ring-gray-700"
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900">
            <User className="h-6 w-6 text-primary-700 dark:text-primary-300" />
          </div>
          <div>
            <p className="font-medium">{user.name || user.email}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user.role}</p>
          </div>
        </div>
      </div>
      
      <div className="py-1">
        <a
          href="/profile"
          className="flex items-center px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <UserCircle className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
          <span>Profile</span>
        </a>
        
        <a
          href="/settings"
          className="flex items-center px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Settings className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
          <span>Settings</span>
        </a>
        
        <a
          href="/api-keys"
          className="flex items-center px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Key className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
          <span>API Keys</span>
        </a>
        
        {user.role === 'admin' && (
          <a
            href="/admin"
            className="flex items-center px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Shield className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
            <span>Admin Panel</span>
          </a>
        )}
      </div>
      
      <div className="py-1 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={onLogout}
          className="flex w-full items-center px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-left"
        >
          <LogOut className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
          <span>Sign out</span>
        </button>
      </div>
    </motion.div>
  );
}