import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Lock, Eye, EyeOff, Mail, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { login, register, logout } from '../../lib/auth';
import { useToast } from '../ui/toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { addToast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const user = login(formData.email, formData.password);
      
      if (user) {
        addToast({
          title: 'Login Successful',
          description: `Welcome back, ${user.name || user.email}!`,
          variant: 'success',
        });

        onClose();
        // Use replace to prevent back button from showing login again
        window.location.replace('/');
      } else {
        addToast({
          title: 'Login Failed',
          description: 'Please use admin@demo.io with any password',
          variant: 'error',
        });
        setIsLoading(false);
      }
    } catch (error) {
      addToast({
        title: 'Login Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'error',
      });
      setIsLoading(false);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-md px-4"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', duration: 0.4 }}
            onClick={e => e.stopPropagation()}
          >
            <Card>
              <CardHeader className="relative pb-4">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onClose}
                  className="absolute top-4 right-4 p-1 h-auto rounded-full"
                >
                  <X className="h-5 w-5" />
                </Button>
                
                <CardTitle className="text-xl font-heading">
                  {isLogin ? 'Welcome Back' : 'Create Account'}
                </CardTitle>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {isLogin ? 'Sign in to your account' : 'Fill in your details to get started'}
                </p>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {!isLogin && (
                    <Input
                      type="text"
                      name="name"
                      label="Full Name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      autoComplete="name"
                      placeholder="Enter your name"
                      icon={<User className="h-4 w-4 text-gray-400" />}
                    />
                  )}
                  
                  <Input
                    type="email"
                    name="email"
                    label="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                    placeholder="Enter your email"
                    icon={<Mail className="h-4 w-4 text-gray-400" />}
                  />
                  
                  <div className="space-y-2 relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      label="Password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      autoComplete={isLogin ? "current-password" : "new-password"}
                      placeholder="Enter your password"
                      icon={<Lock className="h-4 w-4 text-gray-400" />}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-10 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  
                  {isLogin && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          id="remember-me"
                          name="rememberMe"
                          type="checkbox"
                          checked={formData.rememberMe}
                          onChange={handleChange}
                          className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                          Remember me
                        </label>
                      </div>
                      
                      <button type="button" className="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400">
                        Forgot password?
                      </button>
                    </div>
                  )}
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        {isLogin ? 'Signing in...' : 'Creating account...'}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        {isLogin ? 'Sign In' : 'Sign Up'}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </div>
                    )}
                  </Button>
                  
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                        {isLogin ? "Don't have an account?" : 'Already have an account?'}
                      </span>
                    </div>
                  </div>
                  
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => setIsLogin(!isLogin)}
                  >
                    {isLogin ? 'Create Account' : 'Sign In'}
                  </Button>
                  
                  <div className="text-sm text-center text-gray-500 dark:text-gray-400 mt-4">
                    <p>Demo credentials:</p>
                    <p><strong>Email:</strong> admin@demo.io</p>
                    <p><strong>Password:</strong> (any password will work)</p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}