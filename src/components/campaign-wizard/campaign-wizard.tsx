import React, { useState } from 'react';
import { useToast } from '../ui/toast';
import { Wizard, WizardStep, WizardSteps, WizardNavigation, WizardStepIndicator } from '../ui/wizard';
import { CampaignNameStep } from './steps/campaign-name-step';
import { DomainSelectionStep } from './steps/domain-selection-step';
import { TrafficSourceStep } from './steps/traffic-source-step';
import { SummaryStep } from './steps/summary-step';
import { DestinationUrlStep } from './steps/destination-url-step';
import { TrafficFilteringStep } from './steps/traffic-filtering-step';
import { Campaign, Domain, TrafficParameter } from '../../types';
import { createCampaign, createLink } from '../../lib/storage';
import { generateUniqueHash } from '../../lib/utils';

export function CampaignWizard() {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    domainId: '',
    params: {},
    trafficSource: '',
    trafficParameters: [] as TrafficParameter[],
    destinationUrl: '',
    blockVpn: false,
    blockAbnormalTraffic: false,
    frequencyCapping: 'none' as 'none' | '6h' | '12h' | '24h',
    repeatVisitorUrl: ''
  });
  
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  
  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };
  
  const handleComplete = () => {
    try {
      // Generate a unique hash for the campaign URL
      const uniqueHash = generateUniqueHash();
      
      // Create campaign
      const campaign = createCampaign({
        name: formData.name,
        domainId: formData.domainId,
        status: 'active',
        trafficSource: formData.trafficSource,
        trafficParameters: formData.trafficParameters,
        destinationUrl: formData.destinationUrl,
        blockVpn: formData.blockVpn,
        blockAbnormalTraffic: formData.blockAbnormalTraffic,
        frequencyCapping: formData.frequencyCapping,
        repeatVisitorUrl: formData.repeatVisitorUrl
      });
      
      // Create link
      const link = createLink({
        campaignId: campaign.id,
        slug: uniqueHash,
        params: formData.params,
        trafficParameters: formData.trafficParameters
      });
      
      addToast({
        title: 'Campaign Created',
        description: 'Your tracking campaign has been created successfully.',
        variant: 'success',
      });
      
      // Redirect to dashboard
      window.location.href = `/dashboard/${campaign.id}`;
    } catch (error) {
      addToast({
        title: 'Error',
        description: 'Failed to create campaign. Please try again.',
        variant: 'error',
      });
    }
  };
  
  return (
    <Wizard onComplete={handleComplete}>
      <WizardStepIndicator 
        stepNames={['Campaign Name', 'Domain', 'Destination URL', 'Traffic Source', 'Traffic Filtering', 'Summary']} 
        className="mb-8"
      />
      
      <WizardSteps>
        <WizardStep title="Name your campaign">
          <CampaignNameStep 
            formData={formData} 
            updateFormData={updateFormData} 
          />
        </WizardStep>
        
        <WizardStep title="Select tracking domain">
          <DomainSelectionStep 
            formData={formData} 
            updateFormData={updateFormData}
            setSelectedDomain={setSelectedDomain}
          />
        </WizardStep>

        <WizardStep title="Set destination URL">
          <DestinationUrlStep 
            formData={formData} 
            updateFormData={updateFormData}
          />
        </WizardStep>
        
        <WizardStep title="Configure traffic source">
          <TrafficSourceStep
            formData={formData}
            updateFormData={updateFormData}
          />
        </WizardStep>

        <WizardStep title="Traffic filtering options">
          <TrafficFilteringStep
            formData={formData}
            updateFormData={updateFormData}
          />
        </WizardStep>
        
        <WizardStep title="Review and create">
          <SummaryStep 
            formData={formData} 
            updateFormData={updateFormData}
            selectedDomain={selectedDomain}
          />
        </WizardStep>
      </WizardSteps>
      
      <WizardNavigation />
    </Wizard>
  );
}