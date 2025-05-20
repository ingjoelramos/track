import React from 'react';
import { Input } from '../../ui/input';

interface CampaignNameStepProps {
  formData: {
    name: string;
  };
  updateFormData: (data: Partial<{ name: string }>) => void;
}

export function CampaignNameStep({ formData, updateFormData }: CampaignNameStepProps) {
  const [nameError, setNameError] = React.useState('');
  const [slugError, setSlugError] = React.useState('');
  
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    updateFormData({ name: value });
    
    if (!value) {
      setNameError('Campaign name is required');
    } else if (value.length < 3) {
      setNameError('Campaign name must be at least 3 characters');
    } else {
      setNameError('');
    }
  };
  
  return (
    <div className="space-y-6">
      <p className="text-gray-500 dark:text-gray-400">
        Give your campaign a descriptive name to help you identify it later.
      </p>
      
      <div className="space-y-4">
        <Input
          label="Campaign Name"
          name="name"
          value={formData.name}
          onChange={handleNameChange}
          placeholder="e.g., Summer Promotion 2025"
          error={nameError}
          required
        />
      </div>
    </div>
  );
}