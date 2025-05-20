import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Globe, Plus, Check, X, RefreshCw, Copy, ExternalLink } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { useToast } from '../components/ui/toast';
import { getCurrentUser, getDomains, hasRole } from '../lib/storage';
import { Domain } from '../types';

export function DomainSettingsPage() {
  const { addToast } = useToast();
  const [domains, setDomains] = useState<Domain[]>([]);
  const [newDomain, setNewDomain] = useState('');
  const [verifying, setVerifying] = useState<string | null>(null);
  const user = getCurrentUser();
  const isAdmin = hasRole('admin');
  
  useEffect(() => {
    if (!user) {
      window.location.href = '/';
      return;
    }
    
    setDomains(getDomains());
  }, []);
  
  const handleAddDomain = () => {
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
    
    // Add domain (would validate ownership in a real app)
    const domain: Domain = {
      id: `d${domains.length + 1}`,
      host: newDomain,
      verified: false
    };
    
    setDomains([...domains, domain]);
    setNewDomain('');
    
    addToast({
      title: 'Domain Added',
      description: `${newDomain} has been added. Verification is needed.`,
      variant: 'success',
    });
  };
  
  const handleVerifyDomain = (id: string) => {
    setVerifying(id);
    
    // Simulate verification process
    setTimeout(() => {
      setDomains(domains.map(domain => 
        domain.id === id ? { ...domain, verified: true } : domain
      ));
      setVerifying(null);
      
      addToast({
        title: 'Domain Verified',
        description: 'Domain verification completed successfully.',
        variant: 'success',
      });
    }, 2000);
  };
  
  const handleDeleteDomain = (id: string) => {
    setDomains(domains.filter(domain => domain.id !== id));
    
    addToast({
      title: 'Domain Removed',
      description: 'The domain has been removed successfully.',
      variant: 'success',
    });
  };
  
  const handleCopyDNS = (value: string) => {
    navigator.clipboard.writeText(value);
    
    addToast({
      title: 'Copied',
      description: 'DNS record copied to clipboard.',
      variant: 'success',
    });
  };
  
  if (!isAdmin) {
    return (
      <Card className="p-8 text-center">
        <h2 className="text-xl font-heading font-semibold">Access Denied</h2>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          You need administrator privileges to access domain settings.
        </p>
        <Button className="mt-4" onClick={() => window.location.href = '/'}>
          Return to Dashboard
        </Button>
      </Card>
    );
  }
  
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-heading font-bold">Domain Settings</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Add a New Domain</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              placeholder="track.yourdomain.com"
              value={newDomain}
              onChange={(e) => setNewDomain(e.target.value)}
              className="flex-1"
              icon={<Globe className="h-4 w-4 text-gray-400" />}
            />
            <Button onClick={handleAddDomain}>
              <Plus className="h-4 w-4 mr-2" />
              Add Domain
            </Button>
          </div>
          
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="font-medium mb-2">Benefits of Custom Domains</h3>
            <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
              <li className="flex items-start">
                <Check className="h-4 w-4 text-success-500 mr-2 mt-0.5" />
                Increased brand recognition and trust
              </li>
              <li className="flex items-start">
                <Check className="h-4 w-4 text-success-500 mr-2 mt-0.5" />
                Improved deliverability and click-through rates
              </li>
              <li className="flex items-start">
                <Check className="h-4 w-4 text-success-500 mr-2 mt-0.5" />
                Bypasses tracking protection in some email clients
              </li>
              <li className="flex items-start">
                <Check className="h-4 w-4 text-success-500 mr-2 mt-0.5" />
                Full control over your tracking infrastructure
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Your Tracking Domains</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {domains.length === 0 ? (
              <div className="py-6 text-center text-gray-500 dark:text-gray-400">
                No domains configured yet. Add your first tracking domain above.
              </div>
            ) : (
              domains.map((domain) => (
                <motion.div
                  key={domain.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="py-6 first:pt-0 last:pb-0"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{domain.host}</h3>
                        <Badge variant={domain.verified ? 'success' : 'warning'}>
                          {domain.verified ? 'Verified' : 'Unverified'}
                        </Badge>
                      </div>
                      
                      {!domain.verified && (
                        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                          Add the following DNS record to verify domain ownership
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {!domain.verified ? (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm"
                            disabled={verifying === domain.id}
                            onClick={() => handleVerifyDomain(domain.id)}
                          >
                            {verifying === domain.id ? (
                              <>
                                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                Verifying...
                              </>
                            ) : (
                              <>
                                <Check className="h-4 w-4 mr-2" />
                                Verify
                              </>
                            )}
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeleteDomain(domain.id)}
                            className="text-error-500 hover:text-error-600 hover:bg-error-50 dark:hover:bg-error-950/50"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => window.open(`https://${domain.host}`, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Visit
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeleteDomain(domain.id)}
                            className="text-error-500 hover:text-error-600 hover:bg-error-50 dark:hover:bg-error-950/50"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {!domain.verified && (
                    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium mb-2">CNAME Record</h4>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 p-2 bg-gray-100 dark:bg-gray-700 rounded font-mono text-sm overflow-x-auto">
                              <span className="text-primary-600 dark:text-primary-400">Host:</span> {domain.host.split('.')[0]} | <span className="text-primary-600 dark:text-primary-400">Value:</span> tracks-receiver.trackpro.io
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleCopyDNS(`${domain.host.split('.')[0]} CNAME tracks-receiver.trackpro.io`)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium mb-2">TXT Record for Verification</h4>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 p-2 bg-gray-100 dark:bg-gray-700 rounded font-mono text-sm overflow-x-auto">
                              <span className="text-primary-600 dark:text-primary-400">Host:</span> {domain.host.split('.')[0]} | <span className="text-primary-600 dark:text-primary-400">Value:</span> trackpro-verify={domain.id}
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleCopyDNS(`${domain.host.split('.')[0]} TXT trackpro-verify=${domain.id}`)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Domain Setup Guide</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-400">
                1
              </div>
              <div>
                <h3 className="font-medium">Register a domain</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Register a domain (or subdomain) that you want to use for tracking links. We recommend using a subdomain of your main domain, like track.yourdomain.com.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-400">
                2
              </div>
              <div>
                <h3 className="font-medium">Add DNS records</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Set up the required DNS records as shown in the domain verification section. These records will route traffic from your domain to our tracking servers.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-400">
                3
              </div>
              <div>
                <h3 className="font-medium">Verify ownership</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Click the "Verify" button to confirm your domain ownership. DNS changes may take up to 24-48 hours to propagate, but typically complete within an hour.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-400">
                4
              </div>
              <div>
                <h3 className="font-medium">Start using your domain</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Once verified, your domain is ready to use in tracking campaigns. You can select it when creating a new campaign.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}