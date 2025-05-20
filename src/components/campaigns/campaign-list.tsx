import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Pause, Search, Filter, ChevronLeft, ChevronRight, Copy, Check, Link } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Campaign, Domain, Template } from '../../types';
import { getCampaigns, getDomain, getTemplate, updateCampaign, hasRole } from '../../lib/storage';
import { formatDate } from '../../lib/utils';
import { useToast } from '../ui/toast';

export function CampaignList() {
  const [campaigns, setCampaigns] = React.useState<Campaign[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'paused' | 'draft'>('all');
  const isAdmin = hasRole('admin');
  const itemsPerPage = 10;
  
  React.useEffect(() => {
    setCampaigns(getCampaigns());
  }, []);
  
  // Filter campaigns based on search term and status
  const filteredCampaigns = useMemo(() => {
    return campaigns.filter(campaign => {
      const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [campaigns, searchTerm, statusFilter]);
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredCampaigns.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCampaigns = filteredCampaigns.slice(startIndex, startIndex + itemsPerPage);
  
  const handleStatusToggle = (id: string, currentStatus: 'active' | 'paused' | 'draft') => {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active';
    const updatedCampaign = updateCampaign(id, { status: newStatus });
    if (updatedCampaign) {
      setCampaigns(getCampaigns());
    }
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  if (campaigns.length === 0) {
    return (
      <Card className="min-h-[200px] flex items-center justify-center">
        <CardContent className="text-center p-6">
          <p className="text-gray-500 dark:text-gray-400">No campaigns yet</p>
          {isAdmin && (
            <Button className="mt-4" onClick={() => window.location.href = '/create-campaign'}>
              Create your first campaign
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search campaigns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search className="h-4 w-4 text-gray-400" />}
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={statusFilter === 'all' ? 'primary' : 'outline'}
            onClick={() => setStatusFilter('all')}
          >
            All
          </Button>
          <Button
            variant={statusFilter === 'active' ? 'primary' : 'outline'}
            onClick={() => setStatusFilter('active')}
          >
            Active
          </Button>
          <Button
            variant={statusFilter === 'paused' ? 'primary' : 'outline'}
            onClick={() => setStatusFilter('paused')}
          >
            Paused
          </Button>
          <Button
            variant={statusFilter === 'draft' ? 'primary' : 'outline'}
            onClick={() => setStatusFilter('draft')}
          >
            Draft
          </Button>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {paginatedCampaigns.map((campaign) => (
          <CampaignCard 
            key={campaign.id} 
            campaign={campaign} 
            onStatusToggle={isAdmin ? handleStatusToggle : undefined} 
          />
        ))}
      </div>
      
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handlePageChange(page)}
            >
              {page}
            </Button>
          ))}
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      {filteredCampaigns.length === 0 && (
        <div className="text-center p-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">
            No campaigns found matching your search criteria
          </p>
        </div>
      )}
    </div>
  );
}

interface CampaignCardProps {
  campaign: Campaign;
  onStatusToggle?: (id: string, status: 'active' | 'paused' | 'draft') => void;
}

function CampaignCard({ campaign, onStatusToggle }: CampaignCardProps) {
  const { addToast } = useToast();
  const [copied, setCopied] = useState(false);
  const domain = getDomain(campaign.domainId);
  const template = getTemplate(campaign.templateId);
  
  const statusColors = {
    active: 'success',
    paused: 'warning',
    draft: 'default',
  } as const;
  
  const handleCopyLink = () => {
    const url = `https://${domain?.host}/${campaign.id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    
    addToast({
      title: 'Link Copied',
      description: 'Campaign link copied to clipboard',
      variant: 'success',
    });
    
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="h-full overflow-hidden">
        <CardHeader className="pb-4 flex flex-row items-start justify-between">
          <div>
            <Badge variant={statusColors[campaign.status]}>
              {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
            </Badge>
            <CardTitle className="mt-2">{campaign.name}</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyLink}
              className="text-gray-500 hover:text-primary-600"
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Link className="h-4 w-4" />
              )}
            </Button>
            {onStatusToggle && campaign.status !== 'draft' && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onStatusToggle(campaign.id, campaign.status)}
              >
                {campaign.status === 'active' ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="pb-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 dark:text-gray-400">Domain</p>
                <p className="font-medium">{domain?.host || 'Unknown'}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Template</p>
                <p className="font-medium">{template?.name || 'Unknown'}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Created</p>
                <p className="font-medium">{formatDate(campaign.createdAt)}</p>
              </div>
            </div>
            
            <Button className="w-full flex items-center justify-center gap-1" onClick={() => window.location.href = `/dashboard/${campaign.id}`}>
              View dashboard
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}