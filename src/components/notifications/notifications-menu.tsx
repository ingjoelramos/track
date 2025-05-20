import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, CheckCheck, AlertTriangle, Info, Users, Settings, ShieldAlert } from 'lucide-react';
import { Badge } from '../ui/badge';

interface NotificationsMenuProps {
  onClose: () => void;
}

export function NotificationsMenu({ onClose }: NotificationsMenuProps) {
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
  
  const notifications = [
    {
      id: 'n1',
      title: 'VPN Traffic Spike',
      message: 'Unusual increase in VPN traffic (15%) detected in the last hour.',
      time: '10 min ago',
      type: 'warning',
      icon: <AlertTriangle className="h-5 w-5 text-warning-500" />,
      read: false
    },
    {
      id: 'n2',
      title: 'New Campaign Created',
      message: 'Your campaign "Summer Launch" has been created successfully.',
      time: '1 hour ago',
      type: 'success',
      icon: <CheckCheck className="h-5 w-5 text-success-500" />,
      read: true
    },
    {
      id: 'n3',
      title: 'System Update',
      message: 'TrackPro will undergo maintenance on June 25, 2:00 AM UTC.',
      time: '3 hours ago',
      type: 'info',
      icon: <Info className="h-5 w-5 text-primary-500" />,
      read: false
    },
    {
      id: 'n4',
      title: 'New User Joined',
      message: 'analyst@demo.io has been added to your organization.',
      time: '1 day ago',
      type: 'info',
      icon: <Users className="h-5 w-5 text-secondary-500" />,
      read: true
    },
    {
      id: 'n5',
      title: 'Security Alert',
      message: 'Multiple failed login attempts detected from IP 203.0.113.1',
      time: '2 days ago',
      type: 'error',
      icon: <ShieldAlert className="h-5 w-5 text-error-500" />,
      read: true
    }
  ];
  
  const unreadCount = notifications.filter(notification => !notification.read).length;
  
  return (
    <motion.div
      ref={menuRef}
      className="absolute right-0 mt-2 w-80 rounded-2xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-gray-800 dark:ring-gray-700"
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Notifications</h3>
          <Badge variant="primary">{unreadCount} new</Badge>
        </div>
      </div>
      
      <div className="max-h-[400px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            No notifications
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`p-4 flex gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${
                  !notification.read ? 'bg-primary-50 dark:bg-primary-900/20' : ''
                }`}
              >
                <div className="mt-1">
                  {notification.icon}
                </div>
                <div>
                  <div className="flex items-start justify-between">
                    <p className="font-medium text-sm">{notification.title}</p>
                    <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
                      {notification.time}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {notification.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="p-2 border-t border-gray-200 dark:border-gray-700">
        <button className="w-full text-center text-sm text-primary-600 dark:text-primary-400 hover:underline py-2">
          Mark all as read
        </button>
        <button className="w-full text-center text-sm text-primary-600 dark:text-primary-400 hover:underline py-2">
          View all notifications
        </button>
      </div>
    </motion.div>
  );
}