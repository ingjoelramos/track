import React from 'react';
import { motion } from 'framer-motion';
import { UserProfile } from '../components/profile/user-profile';
import { getCurrentUser } from '../lib/storage';

export function ProfilePage() {
  const user = getCurrentUser();
  
  if (!user) {
    window.location.href = '/';
    return null;
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <UserProfile />
    </motion.div>
  );
}