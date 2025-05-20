import React, { createContext, useContext, useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

type ToastVariant = 'default' | 'success' | 'warning' | 'error';

interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, ...toast }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  
  return context;
};

const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-0 right-0 z-50 flex flex-col gap-2 p-4 md:bottom-8 md:right-8">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
};

interface ToastProps {
  toast: Toast;
  onClose: () => void;
}

const toastVariants = {
  default: 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200',
  success: 'bg-success-50 dark:bg-success-950 text-success-500 dark:text-success-50',
  warning: 'bg-warning-50 dark:bg-warning-950 text-warning-500 dark:text-warning-50',
  error: 'bg-error-50 dark:bg-error-950 text-error-500 dark:text-error-50',
};

const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  const { variant = 'default', title, description, duration = 5000 } = toast;

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'pointer-events-auto flex w-full max-w-md rounded-2xl border shadow-lg',
        toastVariants[variant],
        variant === 'default' ? 'border-gray-200 dark:border-gray-700' : 'border-transparent'
      )}
    >
      <div className="flex w-full flex-1 flex-col gap-2 p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {description && <p className="text-sm opacity-90">{description}</p>}
      </div>
    </motion.div>
  );
};