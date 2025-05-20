import React, { useEffect, useState } from 'react';
import { ArrowLeft, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { DashboardStats } from '../components/dashboard/dashboard-stats';
import { CampaignParameters } from '../components/dashboard/campaign-parameters';
import { getCampaign, getLinks, getCurrentUser } from '../lib/storage';
import { Campaign, Link } from '../types';
import { Tabs, TabsList, TabTrigger, TabContent } from '../components/ui/tabs';

interface DashboardPageProps {
  campaignId: string;
}

export function DashboardPage({ campaignId }: DashboardPageProps) {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [links, setLinks] = useState<Link[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'stats' | 'parameters'>('stats');
  const user = getCurrentUser();
  
  useEffect(() => {
    if (!user) {
      // Redirect to home if not logged in
      window.location.href = '/';
      return;
    }
    
    const campaignData = getCampaign(campaignId);
    if (campaignData) {
      setCampaign(campaignData);
      setLinks(getLinks(campaignId));
    }
    setIsLoading(false);
  }, [campaignId]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  if (!campaign) {
    return (
      <div className="space-y-8">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" onClick={() => window.location.href = '/'}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to campaigns
          </Button>
        </div>
        
        <Card className="p-8 text-center">
          <h2 className="text-xl font-heading font-semibold">Campaign Not Found</h2>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            The campaign you're looking for doesn't exist or has been deleted.
          </p>
          <Button className="mt-4" onClick={() => window.location.href = '/'}>
            Return to Dashboard
          </Button>
        </Card>
      </div>
    );
  }
  
  const linkId = links.length > 0 ? links[0].id : '';
  
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => window.location.href = '/'}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to campaigns
        </Button>
        
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => setActiveTab('parameters')}
        >
          <Settings className="mr-2 h-4 w-4" />
          Traffic Source Settings
        </Button>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-2xl">{campaign.name} Dashboard</CardTitle>
            <div>
              <Tabs
                defaultTab="stats"
                className="space-y-0"
              >
                <TabsList>
                  <TabTrigger value="stats" onClick={() => setActiveTab('stats')}>Analytics</TabTrigger>
                  <TabTrigger value="parameters" onClick={() => setActiveTab('parameters')}>Traffic Sources</TabTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            {activeTab === 'stats' ? (
              linkId ? (
                <DashboardStats linkId={linkId} />
              ) : (
                <div className="p-8 text-center">
                  <p className="text-gray-500 dark:text-gray-400">No links found for this campaign</p>
                </div>
              )
            ) : (
              <CampaignParameters campaignId={campaignId} />
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}