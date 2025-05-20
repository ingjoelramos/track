import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Users, AlertTriangle, Globe, RepeatIcon, CloudOff, Map, UserCheck, NetworkIcon, Calendar, Table } from 'lucide-react';
import { getLinkStats, getLink, getVisits, getDomain, getTemplate } from '../../lib/storage';
import { LinkStats, FilterOptions, Visit } from '../../types';
import { formatDateTime, formatDate } from '../../lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { FilterBar } from './filter-bar';
import { Tabs, TabsList, TabTrigger, TabContent } from '../ui/tabs';
import { Button } from '../ui/button';
import { formatDistanceToNow } from 'date-fns';
import { StatsCard } from './stats-card';
import { Badge } from '../ui/badge';
import { StatsTable } from './stats-table';

interface DashboardStatsProps {
  linkId: string;
}

export function DashboardStats({ linkId }: DashboardStatsProps) {
  const [stats, setStats] = useState<LinkStats | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({
    dateRange: '7d',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'traffic' | 'sources' | 'geo' | 'technology'>('overview');
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart');
  const [link, setLink] = useState<any>(null);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [showTable, setShowTable] = useState(false);
  
  useEffect(() => {
    const linkData = getLink(linkId);
    setLink(linkData);
    
    // Initial load
    const initialStats = getLinkStats(linkId, filters);
    setStats(initialStats);
    setVisits(getVisits(linkId));
    setIsLoading(false);
    setLastUpdated(new Date());
    
    // Set up socket connection for real-time updates
    // This would use Socket.IO in a real implementation
    const interval = setInterval(() => {
      const updatedStats = getLinkStats(linkId, filters);
      const updatedVisits = getVisits(linkId);
      setStats(updatedStats);
      setVisits(updatedVisits);
      setLastUpdated(new Date());
    }, 5000); // Update every 5 seconds to simulate real-time
    
    return () => clearInterval(interval);
  }, [linkId, filters]);
  
  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  if (!stats) {
    return (
      <div className="text-center p-12">
        <h3 className="text-xl font-medium">No data available</h3>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          There are no visits recorded for this link yet.
        </p>
      </div>
    );
  }
  
  // Traffic quality metrics
  const qualityMetrics = [
    { name: 'Legitimate', value: stats.legitimate, color: '#10B981' },
    { name: 'VPN/Proxy', value: stats.vpn, color: '#EF4444' },
  ];
  
  // Visitor type metrics
  const visitorMetrics = [
    { name: 'Unique', value: stats.unique, color: '#2563EB' },
    { name: 'Repeat', value: stats.repeated, color: '#9333EA' },
  ];
  
  // Generate traffic trend percentage (random for demo)
  const trafficTrend = Math.round((Math.random() * 20) - 5);
  const trendDirection = trafficTrend >= 0 ? 'up' : 'down';
  const trendFormatted = `${trendDirection === 'up' ? '+' : ''}${trafficTrend}%`;
  
  return (
    <div className="space-y-6">
      <FilterBar onFilterChange={handleFilterChange} filters={filters} />
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard 
          title="Total Visits" 
          value={stats.total.toString()} 
          icon={<Activity className="h-6 w-6 text-primary-600" />} 
          trend={trendFormatted} 
          trendDirection={trendDirection as 'up' | 'down'}
        />
        <StatsCard 
          title="Unique Visitors" 
          value={stats.unique.toString()} 
          icon={<Users className="h-6 w-6 text-primary-600" />} 
          trend={`+${Math.round(Math.random() * 10)}%`} 
        />
        <StatsCard 
          title="VPN Detected" 
          value={stats.vpn.toString()} 
          icon={<AlertTriangle className="h-6 w-6 text-primary-600" />} 
          trend={`-${Math.round(Math.random() * 5)}%`} 
          trendDirection="down"
        />
        <StatsCard 
          title="Legitimate" 
          value={stats.legitimate.toString()} 
          icon={<Globe className="h-6 w-6 text-primary-600" />} 
          trend={`+${Math.round(Math.random() * 8)}%`} 
        />
      </div>

      {showTable ? (
        <StatsTable 
          visits={visits} 
          onClose={() => setShowTable(false)} 
        />
      ) : (
        <Button
          variant="outline"
          onClick={() => setShowTable(true)}
          className="w-full mt-4"
        >
          <Table className="h-4 w-4 mr-2" />
          Show Detailed Statistics Table
        </Button>
      )}
    </div>
  );
}