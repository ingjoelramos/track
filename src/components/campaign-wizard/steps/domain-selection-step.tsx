import React from 'react';
import { Radio } from 'lucide-react';
import { Card } from '../../ui/card';
import { Domain } from '../../../types';
import { getDomains } from '../../../lib/storage';

interface DomainSelectionStepProps {
  formData: {
    domainId: string;
  };
  updateFormData: (data: Partial<{ domainId: string }>) => void;
  setSelectedDomain: (domain: Domain | null) => void;
}

export function DomainSelectionStep({ 
  formData, 
  updateFormData, 
  setSelectedDomain 
}: DomainSelectionStepProps) {
  const [domains, setDomains] = React.useState<Domain[]>([]);
  
  React.useEffect(() => {
    const availableDomains = getDomains();
    setDomains(availableDomains);
    
    // Auto-select first domain if none selected
    if (!formData.domainId && availableDomains.length > 0) {
      handleDomainSelect(availableDomains[0].id);
    }
  }, []);
  
  const handleDomainSelect = (domainId: string) => {
    updateFormData({ domainId });
    const domain = domains.find(d => d.id === domainId) || null;
    setSelectedDomain(domain);
  };
  
  return (
    <div className="space-y-6">
      <p className="text-gray-500 dark:text-gray-400">
        Select the domain you want to use for this tracking campaign.
      </p>
      
      <div className="space-y-4">
        {domains.map((domain) => (
          <Card
            key={domain.id}
            className={`p-4 cursor-pointer transition-all ${
              formData.domainId === domain.id 
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                : 'hover:border-gray-300 dark:hover:border-gray-600'
            }`}
            onClick={() => handleDomainSelect(domain.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div 
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    formData.domainId === domain.id 
                      ? 'border-primary-600' 
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  {formData.domainId === domain.id && (
                    <div className="w-3 h-3 rounded-full bg-primary-600" />
                  )}
                </div>
                <div>
                  <h3 className="font-medium">{domain.host}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {domain.verified ? 'Verified' : 'Not verified'}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}