import React, { useState } from 'react';
import { CalendarIcon, Filter, Download, Sliders, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Select } from '../ui/select';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { FilterOptions } from '../../types';
import { browsers, devices, os, sources, countries, regions, cities, connections, carriers, visitorTypes, trafficTypes, languages } from '../../data/demoData';

interface FilterBarProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
}

export function FilterBar({ filters, onFilterChange }: FilterBarProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [showCalendar, setShowCalendar] = React.useState(false);
  const [tokenParameter, setTokenParameter] = useState('');
  const [tokenValue, setTokenValue] = useState('');
  
  const handleDateRangeChange = (range: 'today' | '7d' | '15d' | 'month' | 'custom') => {
    onFilterChange({ ...filters, dateRange: range });
    if (range === 'custom') {
      setShowCalendar(true);
    } else {
      setShowCalendar(false);
    }
  };
  
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Clear the filter if "All" is selected
    if (value === 'all') {
      const newFilters = { ...filters };
      delete newFilters[name as keyof FilterOptions];
      onFilterChange(newFilters);
      return;
    }
    
    onFilterChange({ 
      ...filters, 
      [name]: name === 'isVpn' || name === 'repeated' ? value === 'true' : value 
    });
  };
  
  const toggleVpnFilter = () => {
    const newFilters = { ...filters };
    if (newFilters.isVpn === undefined) {
      newFilters.isVpn = false; // Show only non-VPN traffic
    } else if (newFilters.isVpn === false) {
      newFilters.isVpn = true; // Show only VPN traffic
    } else {
      delete newFilters.isVpn; // Show all traffic
    }
    onFilterChange(newFilters);
  };
  
  const toggleRepeatedFilter = () => {
    const newFilters = { ...filters };
    if (newFilters.repeated === undefined) {
      newFilters.repeated = true; // Show only repeat visitors
    } else if (newFilters.repeated === true) {
      newFilters.repeated = false; // Show only first-time visitors
    } else {
      delete newFilters.repeated; // Show all visitors
    }
    onFilterChange(newFilters);
  };
  
  const getVpnButtonVariant = () => {
    if (filters.isVpn === undefined) return 'outline';
    if (filters.isVpn === false) return 'primary';
    return 'secondary';
  };
  
  const getVpnButtonLabel = () => {
    if (filters.isVpn === undefined) return 'All Traffic';
    if (filters.isVpn === false) return 'Non-VPN Only';
    return 'VPN Only';
  };
  
  const getRepeatedButtonVariant = () => {
    if (filters.repeated === undefined) return 'outline';
    if (filters.repeated === true) return 'primary';
    return 'secondary';
  };
  
  const getRepeatedButtonLabel = () => {
    if (filters.repeated === undefined) return 'All Visitors';
    if (filters.repeated === true) return 'Repeat Visitors';
    return 'First-time Only';
  };
  
  const resetFilters = () => {
    onFilterChange({ dateRange: '7d' });
    setIsOpen(false);
    setShowCalendar(false);
    setTokenParameter('');
    setTokenValue('');
  };
  
  const handleAddTokenFilter = () => {
    if (!tokenParameter || !tokenValue) return;
    
    const newTokenFilters = [
      ...(filters.tokenFilters || []),
      { parameter: tokenParameter, value: tokenValue }
    ];
    
    onFilterChange({ ...filters, tokenFilters: newTokenFilters });
    setTokenParameter('');
    setTokenValue('');
  };
  
  const handleRemoveTokenFilter = (parameter: string, value: string) => {
    const newTokenFilters = (filters.tokenFilters || [])
      .filter(f => !(f.parameter === parameter && f.value === value));
    
    onFilterChange({ ...filters, tokenFilters: newTokenFilters });
  };
  
  const customDateFilterContent = (
    <div className="mt-4 grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
        <input
          type="date"
          className="flex h-10 w-full rounded-2xl border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          value={filters.startDate || ''}
          onChange={(e) => onFilterChange({ ...filters, startDate: e.target.value })}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">End Date</label>
        <input
          type="date"
          className="flex h-10 w-full rounded-2xl border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          value={filters.endDate || ''}
          onChange={(e) => onFilterChange({ ...filters, endDate: e.target.value })}
        />
      </div>
    </div>
  );
  
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button 
          variant={filters.dateRange === 'today' ? 'primary' : 'outline'} 
          size="sm"
          onClick={() => handleDateRangeChange('today')}
        >
          Today
        </Button>
        <Button 
          variant={filters.dateRange === '7d' ? 'primary' : 'outline'} 
          size="sm"
          onClick={() => handleDateRangeChange('7d')}
        >
          Last 7 days
        </Button>
        <Button 
          variant={filters.dateRange === '15d' ? 'primary' : 'outline'} 
          size="sm"
          onClick={() => handleDateRangeChange('15d')}
        >
          Last 15 days
        </Button>
        <Button 
          variant={filters.dateRange === 'month' ? 'primary' : 'outline'} 
          size="sm"
          onClick={() => handleDateRangeChange('month')}
        >
          This month
        </Button>
        <Button 
          variant={filters.dateRange === 'custom' ? 'primary' : 'outline'} 
          size="sm"
          onClick={() => handleDateRangeChange('custom')}
        >
          <CalendarIcon className="h-4 w-4 mr-1" /> Custom
        </Button>
        
        <div className="ml-auto flex flex-wrap gap-2">
          <Button 
            variant={getVpnButtonVariant()} 
            size="sm"
            onClick={toggleVpnFilter}
          >
            {getVpnButtonLabel()}
          </Button>
          <Button 
            variant={getRepeatedButtonVariant()} 
            size="sm"
            onClick={toggleRepeatedFilter}
          >
            {getRepeatedButtonLabel()}
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="ml-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Filter className="h-4 w-4 mr-1" /> Advanced filters
          </Button>
        </div>
      </div>
      
      {showCalendar && customDateFilterContent}
      
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Advanced Filters</h3>
              <Button variant="outline" size="sm" onClick={resetFilters}>
                Reset Filters
              </Button>
            </div>
            
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
              <Select
                label="Country"
                name="country"
                value={filters.country || 'all'}
                onChange={handleFilterChange}
                options={[
                  { value: 'all', label: 'All Countries' },
                  ...countries.map(country => ({ value: country, label: country }))
                ]}
              />
              <Select
                label="Region"
                name="region"
                value={filters.region || 'all'}
                onChange={handleFilterChange}
                options={[
                  { value: 'all', label: 'All Regions' },
                  ...Object.values(regions).flat().map(region => ({ value: region, label: region }))
                ]}
              />
              <Select
                label="Device"
                name="device"
                value={filters.device || 'all'}
                onChange={handleFilterChange}
                options={[
                  { value: 'all', label: 'All Devices' },
                  ...devices.map(device => ({ value: device, label: device }))
                ]}
              />
              <Select
                label="Browser"
                name="browser"
                value={filters.browser || 'all'}
                onChange={handleFilterChange}
                options={[
                  { value: 'all', label: 'All Browsers' },
                  ...browsers.map(browser => ({ value: browser, label: browser }))
                ]}
              />
              <Select
                label="Traffic Source"
                name="source"
                value={filters.source || 'all'}
                onChange={handleFilterChange}
                options={[
                  { value: 'all', label: 'All Sources' },
                  ...sources.map(source => ({ value: source, label: source }))
                ]}
              />
              <Select
                label="Operating System"
                name="os"
                value={filters.os || 'all'}
                onChange={handleFilterChange}
                options={[
                  { value: 'all', label: 'All OS' },
                  ...os.map(o => ({ value: o, label: o }))
                ]}
              />
              <Select
                label="Visitor Type"
                name="visitor_type"
                value={filters.visitor_type || 'all'}
                onChange={handleFilterChange}
                options={[
                  { value: 'all', label: 'All Visitor Types' },
                  ...visitorTypes.map(type => ({ value: type, label: type }))
                ]}
              />
              <Select
                label="Traffic Type"
                name="traffic_type"
                value={filters.traffic_type || 'all'}
                onChange={handleFilterChange}
                options={[
                  { value: 'all', label: 'All Traffic Types' },
                  ...trafficTypes.map(type => ({ value: type, label: type }))
                ]}
              />
              <Select
                label="Connection Type"
                name="connection"
                value={filters.connection || 'all'}
                onChange={handleFilterChange}
                options={[
                  { value: 'all', label: 'All Connection Types' },
                  ...connections.map(conn => ({ value: conn, label: conn }))
                ]}
              />
              <Select
                label="Carrier"
                name="carrier"
                value={filters.carrier || 'all'}
                onChange={handleFilterChange}
                options={[
                  { value: 'all', label: 'All Carriers' },
                  ...carriers.map(carrier => ({ value: carrier, label: carrier }))
                ]}
              />
              <Select
                label="Language"
                name="language"
                value={filters.language || 'all'}
                onChange={handleFilterChange}
                options={[
                  { value: 'all', label: 'All Languages' },
                  ...languages.map(lang => ({ value: lang, label: lang.split('-')[0].toUpperCase() + ' (' + lang + ')' }))
                ]}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <Select
                label="VPN/Proxy Detection"
                name="isVpn"
                value={filters.isVpn === undefined ? 'all' : String(filters.isVpn)}
                onChange={handleFilterChange}
                options={[
                  { value: 'all', label: 'All Traffic' },
                  { value: 'false', label: 'Non-VPN Traffic Only' },
                  { value: 'true', label: 'VPN/Proxy Traffic Only' }
                ]}
              />
              <Select
                label="Visitor Frequency"
                name="repeated"
                value={filters.repeated === undefined ? 'all' : String(filters.repeated)}
                onChange={handleFilterChange}
                options={[
                  { value: 'all', label: 'All Visitors' },
                  { value: 'true', label: 'Repeat Visitors Only' },
                  { value: 'false', label: 'First-time Visitors Only' }
                ]}
              />
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
              <h3 className="font-medium mb-4">Token Filters</h3>
              
              <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex-1">
                  <Input
                    label="Token Parameter"
                    placeholder="e.g., zoneid, campaign_id"
                    value={tokenParameter}
                    onChange={(e) => setTokenParameter(e.target.value)}
                  />
                </div>
                <div className="flex-1">
                  <Input
                    label="Value"
                    placeholder="Token value to filter"
                    value={tokenValue}
                    onChange={(e) => setTokenValue(e.target.value)}
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    onClick={handleAddTokenFilter}
                    disabled={!tokenParameter || !tokenValue}
                  >
                    Add Filter
                  </Button>
                </div>
              </div>
              
              {filters.tokenFilters && filters.tokenFilters.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {filters.tokenFilters.map((filter, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="flex items-center gap-2"
                    >
                      <span>{filter.parameter}: {filter.value}</span>
                      <button
                        onClick={() => handleRemoveTokenFilter(filter.parameter, filter.value)}
                        className="hover:text-error-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex justify-end mt-4">
              <Button variant="outline" size="sm" onClick={resetFilters}>
                Reset Filters
              </Button>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}