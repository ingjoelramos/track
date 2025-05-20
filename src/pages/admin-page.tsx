import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Activity, Settings, Shield, Key, AlertTriangle, UserPlus, Ban, Check, Globe, Plus, X, RefreshCw, Copy, ExternalLink, Star, StarOff } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsList, TabTrigger, TabContent } from '../components/ui/tabs';
import { useToast } from '../components/ui/toast';
import { getCurrentUser, hasRole, getUsers, getDomains, getSystemSettings, updateSystemSettings, getGlobalDomains, createDomain, updateDomain, deleteDomain } from '../lib/storage';
import { User, Domain } from '../types';

export function AdminPage() {
  return (
    <div className="space-y-6">
      <SystemSettings />
    </div>
  );
}

function SystemSettings() {
  const { addToast } = useToast();
  const [settings, setSettings] = useState(getSystemSettings());
  const [globalDomains, setGlobalDomains] = useState<Domain[]>(getGlobalDomains());
  const [newDomain, setNewDomain] = useState('');
  const [proxyCheckApiKey, setProxyCheckApiKey] = useState(settings.proxyCheckApiKey || '');
  const [proxyCheckEnabled, setProxyCheckEnabled] = useState(settings.proxyCheckEnabled);
  
  const handleSave = () => {
    const updatedSettings = updateSystemSettings({
      proxyCheckApiKey,
      proxyCheckEnabled
    });
    
    setSettings(updatedSettings);
    
    addToast({
      title: 'Settings Saved',
      description: 'System settings have been updated successfully.',
      variant: 'success',
    });
  };
  
  const handleAddGlobalDomain = () => {
    if (!newDomain) return;
    
    // Validate domain format
    if (!/^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/.test(newDomain)) {
      addToast({
        title: 'Invalid Domain',
        description: 'Please enter a valid domain name (e.g. track.example.com).',
        variant: 'error',
      });
      return;
    }
    
    const domain = createDomain({
      host: newDomain,
      verified: false,
      isGlobal: true,
      isDefault: globalDomains.length === 0 // Make first global domain default
    });
    
    setGlobalDomains([...globalDomains, domain]);
    setNewDomain('');
    
    addToast({
      title: 'Global Domain Added',
      description: `${newDomain} has been added as a global domain.`,
      variant: 'success',
    });
  };
  
  const handleSetDefault = (domainId: string) => {
    const domain = updateDomain(domainId, { isDefault: true });
    if (domain) {
      setGlobalDomains(getGlobalDomains());
      
      addToast({
        title: 'Default Domain Updated',
        description: `${domain.host} is now the default global domain.`,
        variant: 'success',
      });
    }
  };
  
  const handleDeleteGlobalDomain = (domainId: string) => {
    if (deleteDomain(domainId)) {
      setGlobalDomains(getGlobalDomains());
      
      addToast({
        title: 'Global Domain Removed',
        description: 'The global domain has been removed successfully.',
        variant: 'success',
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>ProxyCheck.io Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Enable ProxyCheck.io</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Use ProxyCheck.io for VPN and proxy detection
                </p>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={proxyCheckEnabled}
                  onChange={(e) => setProxyCheckEnabled(e.target.checked)}
                  className="h-6 w-6 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Input
                label="API Key"
                type="password"
                value={proxyCheckApiKey}
                onChange={(e) => setProxyCheckApiKey(e.target.value)}
                placeholder="Enter your ProxyCheck.io API key"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Get your API key from <a href="https://proxycheck.io/dashboard" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">ProxyCheck.io Dashboard</a>
              </p>
            </div>
            
            {proxyCheckEnabled && !proxyCheckApiKey && (
              <div className="p-4 bg-warning-50 dark:bg-warning-900/20 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-warning-500 mt-0.5" />
                  <div>
                    <h3 className="font-medium">API Key Required</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      An API key is required to use ProxyCheck.io services. VPN detection will not work without a valid key.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Global Domain Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
              <Input
                label="Add Global Domain"
                type="text"
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value)}
                placeholder="e.g., track.yourdomain.com"
                className="flex-1"
              />
              <div className="flex items-end">
                <Button onClick={handleAddGlobalDomain}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Domain
                </Button>
              </div>
            </div>
            
            <div className="space-y-4">
              {globalDomains.length === 0 ? (
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No global domains configured. Add a domain that will be available to all users.
                  </p>
                </div>
              ) : (
                globalDomains.map((domain) => (
                  <div
                    key={domain.id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Globe className="h-5 w-5 text-primary-500" />
                        <span className="font-medium">{domain.host}</span>
                      </div>
                      {domain.isDefault && (
                        <Badge variant="primary">Default</Badge>
                      )}
                      <Badge variant={domain.verified ? 'success' : 'warning'}>
                        {domain.verified ? 'Verified' : 'Unverified'}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {!domain.isDefault && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSetDefault(domain.id)}
                          className="text-primary-500"
                        >
                          <Star className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteGlobalDomain(domain.id)}
                        className="text-error-500"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <Globe className="h-5 w-5 text-primary-500 mt-0.5" />
                <div>
                  <h3 className="font-medium">About Global Domains</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Global domains are available to all users who don't have their own domains configured.
                    The default domain will be automatically selected for new campaigns.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button onClick={handleSave}>
          <Check className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}