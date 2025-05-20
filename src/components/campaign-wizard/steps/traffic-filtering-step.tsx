import React from 'react';
import { Shield, Clock, Users, UserX, AlertTriangle, BarChart3 } from 'lucide-react';
import { Card, CardContent } from '../../ui/card';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';

interface TrafficFilteringStepProps {
  formData: {
    blockVpn: boolean;
    blockAbnormalTraffic: boolean;
    frequencyCapping: 'none' | '6h' | '12h' | '24h';
    repeatVisitorUrl: string;
  };
  updateFormData: (data: Partial<typeof formData>) => void;
}

export function TrafficFilteringStep({ formData, updateFormData }: TrafficFilteringStepProps) {
  const handleFrequencyChange = (value: 'none' | '6h' | '12h' | '24h') => {
    updateFormData({ frequencyCapping: value });
  };
  
  const handleToggleVpnBlocking = () => {
    updateFormData({ blockVpn: !formData.blockVpn });
  };
  
  const handleToggleAbnormalTraffic = () => {
    updateFormData({ blockAbnormalTraffic: !formData.blockAbnormalTraffic });
  };
  
  const handleRepeatVisitorUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData({ repeatVisitorUrl: e.target.value });
  };
  
  return (
    <div className="space-y-6">
      <p className="text-gray-500 dark:text-gray-400">
        Configure traffic filtering options to optimize your campaign performance and protect against fraud.
      </p>
      
      <div className="space-y-6">
        {/* Traffic Protection Section */}
        <div>
          <h3 className="text-lg font-medium flex items-center mb-3">
            <Shield className="h-5 w-5 text-primary-600 mr-2" />
            Traffic Protection
          </h3>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card className={`cursor-pointer transition ${formData.blockVpn ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : ''}`} onClick={handleToggleVpnBlocking}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${formData.blockVpn ? 'bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'}`}>
                    <UserX className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium">Block VPN Traffic</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Filter out visitors using VPNs and proxy services
                    </p>
                    
                    <div className="mt-3 flex items-center">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${formData.blockVpn ? 'border-primary-600' : 'border-gray-300 dark:border-gray-600'}`}>
                        {formData.blockVpn && (
                          <div className="w-3 h-3 rounded-full bg-primary-600" />
                        )}
                      </div>
                      <span className="ml-2 text-sm font-medium">
                        {formData.blockVpn ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className={`cursor-pointer transition ${formData.blockAbnormalTraffic ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : ''}`} onClick={handleToggleAbnormalTraffic}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${formData.blockAbnormalTraffic ? 'bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'}`}>
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium">Block Abnormal Traffic</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Filter out suspicious or bot traffic patterns
                    </p>
                    
                    <div className="mt-3 flex items-center">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${formData.blockAbnormalTraffic ? 'border-primary-600' : 'border-gray-300 dark:border-gray-600'}`}>
                        {formData.blockAbnormalTraffic && (
                          <div className="w-3 h-3 rounded-full bg-primary-600" />
                        )}
                      </div>
                      <span className="ml-2 text-sm font-medium">
                        {formData.blockAbnormalTraffic ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Frequency Capping Section */}
        <div>
          <h3 className="text-lg font-medium flex items-center mb-3">
            <Clock className="h-5 w-5 text-primary-600 mr-2" />
            Frequency Capping
          </h3>
          
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            Limit how often the same visitor can see your offer within a time period.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card className={`cursor-pointer transition ${formData.frequencyCapping === 'none' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : ''}`} onClick={() => handleFrequencyChange('none')}>
              <CardContent className="p-3 text-center">
                <h4 className="font-medium">No Limit</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Show to all visitors
                </p>
                
                <div className="mt-2 flex justify-center">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.frequencyCapping === 'none' ? 'border-primary-600' : 'border-gray-300 dark:border-gray-600'}`}>
                    {formData.frequencyCapping === 'none' && (
                      <div className="w-2.5 h-2.5 rounded-full bg-primary-600" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className={`cursor-pointer transition ${formData.frequencyCapping === '6h' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : ''}`} onClick={() => handleFrequencyChange('6h')}>
              <CardContent className="p-3 text-center">
                <h4 className="font-medium">6 Hours</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Once per 6 hours
                </p>
                
                <div className="mt-2 flex justify-center">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.frequencyCapping === '6h' ? 'border-primary-600' : 'border-gray-300 dark:border-gray-600'}`}>
                    {formData.frequencyCapping === '6h' && (
                      <div className="w-2.5 h-2.5 rounded-full bg-primary-600" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className={`cursor-pointer transition ${formData.frequencyCapping === '12h' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : ''}`} onClick={() => handleFrequencyChange('12h')}>
              <CardContent className="p-3 text-center">
                <h4 className="font-medium">12 Hours</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Once per 12 hours
                </p>
                
                <div className="mt-2 flex justify-center">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.frequencyCapping === '12h' ? 'border-primary-600' : 'border-gray-300 dark:border-gray-600'}`}>
                    {formData.frequencyCapping === '12h' && (
                      <div className="w-2.5 h-2.5 rounded-full bg-primary-600" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className={`cursor-pointer transition ${formData.frequencyCapping === '24h' ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : ''}`} onClick={() => handleFrequencyChange('24h')}>
              <CardContent className="p-3 text-center">
                <h4 className="font-medium">24 Hours</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Once per day
                </p>
                
                <div className="mt-2 flex justify-center">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.frequencyCapping === '24h' ? 'border-primary-600' : 'border-gray-300 dark:border-gray-600'}`}>
                    {formData.frequencyCapping === '24h' && (
                      <div className="w-2.5 h-2.5 rounded-full bg-primary-600" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Repeat Visitor Section */}
        <div>
          <h3 className="text-lg font-medium flex items-center mb-3">
            <Users className="h-5 w-5 text-primary-600 mr-2" />
            Repeat Visitor Handling
          </h3>
          
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            Specify an alternate URL to send repeat visitors (optional).
          </p>
          
          <Input
            label="Repeat Visitor URL (leave empty to use main destination)"
            name="repeatVisitorUrl"
            value={formData.repeatVisitorUrl}
            onChange={handleRepeatVisitorUrlChange}
            placeholder="https://alternate-offer.com"
          />
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <div className="flex items-start gap-3">
            <BarChart3 className="h-5 w-5 text-primary-600 mt-0.5" />
            <div>
              <h3 className="font-medium">Traffic Optimization Tips</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Blocking VPN traffic can reduce fraud but may also block legitimate users. Consider your target market before enabling this filter. Repeat visitor handling can improve conversions by showing different offers to returning visitors.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}