import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { CampaignList } from '../components/campaigns/campaign-list';
import { getCurrentUser } from '../lib/auth';

export function HomePage() {
  const user = getCurrentUser();
  
  if (!user) {
    return null;
  }
  
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-heading font-bold">Tracking Campaigns</h1>
        
        {user.role === 'admin' && (
          <Button onClick={() => window.location.href = '/create-campaign'}>
            Create Campaign
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      
      <CampaignList />
    </div>
  );
}