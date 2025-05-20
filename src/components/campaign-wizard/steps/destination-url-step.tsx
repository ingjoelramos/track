import React from 'react';
import { LinkIcon, Globe, ExternalLink } from 'lucide-react';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';

interface DestinationUrlStepProps {
  formData: {
    destinationUrl: string;
  };
  updateFormData: (data: Partial<{ destinationUrl: string }>) => void;
}

export function DestinationUrlStep({ formData, updateFormData }: DestinationUrlStepProps) {
  const [urlError, setUrlError] = React.useState('');
  
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    updateFormData({ destinationUrl: value });
    
    // URL validation
    if (!value) {
      setUrlError('Destination URL is required');
    } else if (!isValidUrl(value)) {
      setUrlError('Please enter a valid URL (e.g., https://example.com)');
    } else {
      setUrlError('');
    }
  };
  
  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };
  
  const handleOpenUrl = () => {
    if (isValidUrl(formData.destinationUrl)) {
      window.open(formData.destinationUrl, '_blank');
    }
  };
  
  return (
    <div className="space-y-6">
      <p className="text-gray-500 dark:text-gray-400">
        Enter the destination URL where visitors will be redirected when they click on your tracking link.
      </p>
      
      <div className="space-y-4">
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Input
              label="Destination URL"
              name="destinationUrl"
              value={formData.destinationUrl}
              onChange={handleUrlChange}
              placeholder="https://your-landing-page.com"
              error={urlError}
              required
              icon={<Globe className="h-4 w-4 text-gray-400" />}
            />
          </div>
          
          {formData.destinationUrl && !urlError && (
            <Button 
              variant="outline" 
              type="button" 
              onClick={handleOpenUrl}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Test URL
            </Button>
          )}
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <h3 className="font-medium flex items-center mb-2">
            <LinkIcon className="h-4 w-4 mr-2 text-primary-600" />
            Destination URL Tips
          </h3>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <li>Use a full URL including https:// or http://</li>
            <li>Make sure your landing page is mobile-optimized if targeting mobile traffic</li>
            <li>Consider using different destination URLs for A/B testing</li>
            <li>You can include UTM parameters to track campaign performance in Google Analytics</li>
          </ul>
        </div>
      </div>
    </div>
  );
}