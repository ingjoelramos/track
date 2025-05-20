import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Lock, Eye, EyeOff, Mail, ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { login } from '../../lib/storage';
import { useToast } from '../ui/toast';
import { useTranslation } from '../../lib/i18n/useTranslation';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { t } = useTranslation();
  const { addToast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (isLogin) {
      // Login
      setTimeout(() => {
        const user = login(email);
        
        if (user) {
          addToast({
            title: t('auth.loginSuccess'),
            description: `${t('common.welcome')}, ${user.name || email}!`,
            variant: 'success',
          });
          onClose();
          window.location.reload();
        } else {
          addToast({
            title: t('auth.loginError'),
            description: t('auth.invalidCredentials'),
            variant: 'error',
          });
        }
        
        setIsLoading(false);
      }, 1000);
    } else {
      // Registration (demo mode)
      setTimeout(() => {
        addToast({
          title: t('auth.registrationSuccess'),
          description: t('auth.accountCreated'),
          variant: 'success',
        });
        setIsLogin(true);
        setIsLoading(false);
      }, 1000);
    }
  };
  
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };
  
  const modalVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', duration: 0.4 } }
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={backdropVariants}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-md px-4"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
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
                  <span className="sr-only">Close</span>
                </Button>
                
                <CardTitle className="text-xl font-heading">
                  {isLogin ? t('auth.welcomeBack') : t('auth.createAccount')}
                </CardTitle>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {isLogin ? t('auth.loginToContinue') : t('auth.fillDetails')}
                </p>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {!isLogin && (
                    <Input
                      type="text"
                      label={t('auth.fullName')}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      autoComplete="name"
                      placeholder={t('auth.enterName')}
                      icon={<User className="h-4 w-4 text-gray-400" />}
                    />
                  )}
                  
                  <Input
                    type="email"
                    label={t('auth.email')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    placeholder={t('auth.enterEmail')}
                    icon={<Mail className="h-4 w-4 text-gray-400" />}
                  />
                  
                  <div className="space-y-2 relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      label={t('auth.password')}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete={isLogin ? "current-password" : "new-password"}
                      placeholder={t('auth.enterPassword')}
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
                          name="remember-me"
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                          {t('auth.rememberMe')}
                        </label>
                      </div>
                      
                      <button type="button" className="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400">
                        {t('auth.forgotPassword')}
                      </button>
                    </div>
                  )}
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                        {isLogin ? t('auth.signingIn') : t('auth.creatingAccount')}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        {isLogin ? t('auth.signIn') : t('auth.signUp')}
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
                        {isLogin ? t('auth.noAccount') : t('auth.haveAccount')}
                      </span>
                    </div>
                  </div>
                  
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => setIsLogin(!isLogin)}
                  >
                    {isLogin ? t('auth.createAccount') : t('auth.signIn')}
                  </Button>
                  
                  <div className="text-sm text-center text-gray-500 dark:text-gray-400 mt-4">
                    <p>{t('auth.demoCredentials')}:</p>
                    <p><strong>{t('auth.email')}:</strong> admin@demo.io</p>
                    <p><strong>{t('auth.password')}:</strong> {t('auth.anyPassword')}</p>
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