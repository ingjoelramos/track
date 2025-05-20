import React from 'react';
import { Card, CardContent } from '../../ui/card';
import { Input } from '../../ui/input';
import { Domain, TrafficParameter } from '../../../types';
import { trafficSources } from '../../../data/traffic-sources';
import { Clock, Shield, UserX, AlertTriangle, Users } from 'lucide-react';

interface SummaryStepProps {
  formData: {
    name: string;
    domainId: string;
    slug: string;
    params: Record<string, string>;
    trafficSource?: string;
    trafficParameters?: TrafficParameter[];
    destinationUrl?: string;
    blockVpn?: boolean;
    blockAbnormalTraffic?: boolean;
    frequencyCapping?: 'none' | '6h' | '12h' | '24h';
    repeatVisitorUrl?: string;
  };
  updateFormData: (data: Partial<typeof formData>) => void;
  selectedDomain: Domain | null;
}

export function SummaryStep({ 
  formData, 
  updateFormData,
  selectedDomain
}: SummaryStepProps) {
  const [previewUrl, setPreviewUrl] = React.useState('');
  
  React.useEffect(() => {
    if (!selectedDomain) return;
    
    generatePreviewUrl();
  }, [selectedDomain, formData]);
  
  const generatePreviewUrl = () => {
    if (!selectedDomain || !formData.slug) {
      setPreviewUrl('');
      return;
    }
    
    let url = `https://${selectedDomain.host}/${formData.slug}`;
    
    // Add traffic parameters if available
    if (formData.trafficSource && formData.trafficParameters && formData.trafficParameters.length > 0) {
      const trafficSource = trafficSources.find(s => s.id === formData.trafficSource);
      
      if (trafficSource) {
        const queryParams = formData.trafficParameters.map(param => {
          const tokenDef = trafficSource.tokens.find(t => t.id === param.id);
          if (tokenDef) {
            return `${param.parameter}=${param.token}`;
          }
          return '';
        }).filter(Boolean);
        
        if (queryParams.length > 0) {
          url += '?' + queryParams.join('&');
        }
      }
    }
    
    setPreviewUrl(url);
  };
  
  // Get traffic source information
  const trafficSource = formData.trafficSource ? 
    trafficSources.find(s => s.id === formData.trafficSource) : null;
  
  // Format frequency capping for display
  const getFrequencyDisplay = () => {
    switch(formData.frequencyCapping) {
      case '6h': return 'Every 6 hours';
      case '12h': return 'Every 12 hours';
      case '24h': return 'Every 24 hours';
      case 'none':
      default: return 'No limit (show all)';
    }
  };
  
  return (
    <div className="space-y-6">
      <p className="text-gray-500 dark:text-gray-400">
        Review your campaign details before creating it.
      </p>
      
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Campaign Name</h3>
                <p className="mt-1">{formData.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">URL Slug</h3>
                <p className="mt-1">{formData.slug}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Domain</h3>
                <p className="mt-1">{selectedDomain?.host || 'Not selected'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Traffic Source</h3>
                <p className="mt-1">{trafficSource?.name || 'Not configured'}</p>
              </div>
              <div className="md:col-span-2">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Destination URL</h3>
                <p className="mt-1 font-mono text-xs break-all bg-gray-50 dark:bg-gray-800 p-2 rounded">
                  {formData.destinationUrl || 'Not specified'}
                </p>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Traffic Analysis</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-300`}>
                    <Users className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Repeat Traffic Handling</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formData.repeatVisitorUrl ? 'Custom URL for repeats' : 'Using main destination'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-300`}>
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Frequency Capping</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formData.frequencyCapping === 'none' ? 'No limit' : 
                       `Every ${formData.frequencyCapping.replace('h', ' hours')}`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Traffic Filtering</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${formData.blockVpn ? 'bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-300' : 'bg-gray-100 text-gray-400 dark:bg-gray-800'}`}>
                    <UserX className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">VPN/Proxy Blocking</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{formData.blockVpn ? 'Enabled' : 'Disabled'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${formData.blockAbnormalTraffic ? 'bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-300' : 'bg-gray-100 text-gray-400 dark:bg-gray-800'}`}>
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Abnormal Traffic Blocking</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{formData.blockAbnormalTraffic ? 'Enabled' : 'Disabled'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-300 flex items-center justify-center">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Frequency Capping</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{getFrequencyDisplay()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-300 flex items-center justify-center">
                    <Users className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Repeat Visitor URL</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formData.repeatVisitorUrl ? 'Configured' : 'Not configured (using main URL)'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {trafficSource && formData.trafficParameters && formData.trafficParameters.length > 0 && (
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Traffic Parameters</h3>
                <div className="grid grid-cols-2 gap-2">
                  {formData.trafficParameters.map((param, index) => {
                    const tokenDef = trafficSource.tokens.find(t => t.id === param.id);
                    return (
                      <div key={param.id} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-2 rounded-md">
                        <span className="text-xs font-medium">{param.parameter}:</span>
                        <span className="text-xs font-mono">{param.token}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Preview URL</h3>
              <div className="mt-2 p-3 bg-gray-100 dark:bg-gray-800 rounded-md text-xs font-mono break-all">
                {previewUrl || 'Preview not available. Please select all required options.'}
              </div>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                After creating the campaign, you can configure traffic source parameters in the campaign dashboard.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}