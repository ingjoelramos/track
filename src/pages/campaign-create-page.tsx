import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { CampaignWizard } from '../components/campaign-wizard/campaign-wizard';
import { getCurrentUser, hasRole } from '../lib/storage';

export function CampaignCreatePage() {
  const user = getCurrentUser();
  const isAdmin = hasRole('admin');
  
  if (!user) {
    // Redirect to home if not logged in
    window.location.href = '/';
    return null;
  }
  
  if (!isAdmin) {
    return (
      <div className="space-y-8">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" onClick={() => window.location.href = '/'}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to campaigns
          </Button>
        </div>
        
        <Card className="p-8 text-center">
          <h2 className="text-xl font-heading font-semibold">Access Denied</h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            You need administrator privileges to create campaigns.
          </p>
          <Button className="mt-4" onClick={() => window.location.href = '/'}>
            Return to Dashboard
          </Button>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <Button variant="ghost" size="sm" onClick={() => window.location.href = '/'}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to campaigns
        </Button>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="p-6 md:p-8">
          <CampaignWizard />
        </Card>
      </motion.div>
    </div>
  );
}