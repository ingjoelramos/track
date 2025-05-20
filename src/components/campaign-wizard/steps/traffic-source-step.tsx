import React, { useState, useEffect } from 'react';
import { Globe, Info, Plus, Trash2, ArrowRight, Check } from 'lucide-react';
import { Card, CardContent } from '../../ui/card';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { trafficSources } from '../../../data/traffic-sources';
import { TrafficParameter } from '../../../types';

interface TrafficSourceStepProps {
  formData: {
    trafficSource?: string;
    trafficParameters?: TrafficParameter[];
  };
  updateFormData: (data: Partial<{ trafficSource?: string; trafficParameters?: TrafficParameter[] }>) => void;
}

export function TrafficSourceStep({ formData, updateFormData }: TrafficSourceStepProps) {
  const [selectedSource, setSelectedSource] = useState(
    formData.trafficSource ? trafficSources.find(s => s.id === formData.trafficSource) : null
  );
  
  // Store the tokens that have been added to the campaign
  const [selectedTokens, setSelectedTokens] = useState<TrafficParameter[]>(
    formData.trafficParameters || []
  );
  
  // Track the mapping of tokens to parameters
  const [mappingMode, setMappingMode] = useState<'auto' | 'manual'>('auto');
  
  // UI state for token selection
  const [tokenToAdd, setTokenToAdd] = useState<string>('');
  const [parameterName, setParameterName] = useState<string>('');

  useEffect(() => {
    if (selectedSource && mappingMode === 'auto' && selectedTokens.length === 0) {
      // Auto-populate some common tokens if none are selected
      const commonTokenIds = ['zp_cid', 'exo_clickid', 'ts_id', 'tb_clickid', 'pa_clickid'];
      const sourceTokenIds = selectedSource.tokens.map(t => t.id);
      const tokenId = commonTokenIds.find(id => sourceTokenIds.includes(id));
      
      if (tokenId) {
        const token = selectedSource.tokens.find(t => t.id === tokenId);
        if (token) {
          handleAddToken(token.id);
        }
      }
    }
  }, [selectedSource, mappingMode]);
  
  const handleSourceSelect = (sourceId: string) => {
    const source = trafficSources.find(s => s.id === sourceId) || null;
    setSelectedSource(source);
    updateFormData({ trafficSource: sourceId });
    
    // Reset parameters when source changes
    setSelectedTokens([]);
    updateFormData({ 
      trafficParameters: []
    });
  };
  
  const handleAddToken = (tokenId: string) => {
    if (!selectedSource) return;
    
    const token = selectedSource.tokens.find(t => t.id === tokenId);
    if (!token) return;
    
    // Don't add duplicates
    if (selectedTokens.find(t => t.id === tokenId)) return;
    
    // Generate parameter name automatically based on mapping mode
    let param = '';
    if (mappingMode === 'auto') {
      // Auto mode: use sub1, sub2, etc.
      const prefix = selectedSource.defaultParameterPrefix;
      const nextNum = selectedTokens.length + 1;
      param = `${prefix}${nextNum}`;
    } else {
      // Manual mode: use the name provided or default to the token ID
      param = parameterName || token.id.replace(/[^a-zA-Z0-9_]/g, '');
    }
    
    const newToken: TrafficParameter = {
      id: tokenId,
      sourceId: selectedSource.id,
      token: token.token,
      parameter: param,
      description: token.description
    };
    
    const updatedTokens = [...selectedTokens, newToken];
    setSelectedTokens(updatedTokens);
    updateFormData({ trafficParameters: updatedTokens });
    
    // Reset the form
    setTokenToAdd('');
    setParameterName('');
  };
  
  const handleRemoveToken = (tokenId: string) => {
    const updatedTokens = selectedTokens.filter(t => t.id !== tokenId);
    setSelectedTokens(updatedTokens);
    updateFormData({ trafficParameters: updatedTokens });
  };
  
  const handleUpdateParameter = (tokenId: string, newParamName: string) => {
    const updatedTokens = selectedTokens.map(t => 
      t.id === tokenId ? { ...t, parameter: newParamName } : t
    );
    setSelectedTokens(updatedTokens);
    updateFormData({ trafficParameters: updatedTokens });
  };
  
  const toggleMappingMode = () => {
    setMappingMode(mappingMode === 'auto' ? 'manual' : 'auto');
  };
  
  return (
    <div className="space-y-6">
      <p className="text-gray-500 dark:text-gray-400">
        Select a traffic source and configure which tracking tokens will be included in your URLs.
      </p>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Traffic Source
          </label>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {trafficSources.map((source) => (
              <Card
                key={source.id}
                className={`cursor-pointer transition-all ${
                  formData.trafficSource === source.id 
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                    : 'hover:border-gray-300 dark:hover:border-gray-600'
                }`}
                onClick={() => handleSourceSelect(source.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 overflow-hidden rounded-lg">
                      <img 
                        src={source.logo} 
                        alt={source.name} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium">{source.name}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {source.tokens.length} available tokens
                      </p>
                    </div>
                  </div>
                  
                  <div 
                    className={`mt-4 w-full h-1 rounded-full ${
                      formData.trafficSource === source.id 
                        ? 'bg-primary-500' 
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        {selectedSource && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Configure {selectedSource.name} Tokens</h3>
              <a 
                href={selectedSource.website} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
              >
                <Globe className="h-3 w-3" />
                {selectedSource.name} Documentation
              </a>
            </div>
            
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {selectedSource.name} uses tokens in their URLs that get replaced with actual values when a visitor clicks. 
              Map these tokens to your tracking parameters below.
            </p>
            
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium">Parameter Mapping Mode</h4>
                <div className="flex items-center space-x-2">
                  <button
                    className={`px-3 py-1 text-sm rounded-md ${
                      mappingMode === 'auto' 
                        ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200' 
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                    }`}
                    onClick={() => setMappingMode('auto')}
                  >
                    Automatic
                  </button>
                  <button
                    className={`px-3 py-1 text-sm rounded-md ${
                      mappingMode === 'manual' 
                        ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200' 
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                    }`}
                    onClick={() => setMappingMode('manual')}
                  >
                    Manual
                  </button>
                </div>
              </div>
              
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {mappingMode === 'auto'
                  ? `Automatic mode will assign parameter names like ${selectedSource.defaultParameterPrefix}1, ${selectedSource.defaultParameterPrefix}2, etc.`
                  : 'Manual mode allows you to specify your own parameter names for each token.'}
              </p>
            </div>
            
            <div className="space-y-6">
              {/* Token selection */}
              <div className="flex flex-wrap gap-3">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Available Tokens
                  </label>
                  <div className="relative">
                    <select
                      className="flex h-10 w-full rounded-2xl border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                      value={tokenToAdd}
                      onChange={(e) => setTokenToAdd(e.target.value)}
                    >
                      <option value="">Select a token to add...</option>
                      {selectedSource.tokens
                        .filter(token => !selectedTokens.some(t => t.id === token.id))
                        .map(token => (
                          <option key={token.id} value={token.id}>
                            {token.token} - {token.name}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
                
                {mappingMode === 'manual' && (
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Parameter Name
                    </label>
                    <Input
                      placeholder="e.g., click_id, sub1"
                      value={parameterName}
                      onChange={(e) => setParameterName(e.target.value)}
                    />
                  </div>
                )}
                
                <div className="flex items-end">
                  <Button
                    onClick={() => handleAddToken(tokenToAdd)}
                    disabled={!tokenToAdd || (mappingMode === 'manual' && !parameterName)}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Token
                  </Button>
                </div>
              </div>
              
              {/* Selected tokens list */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Selected Tokens
                </h4>
                
                {selectedTokens.length === 0 ? (
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No tokens selected. Add tokens to include in your tracking URL.
                    </p>
                  </div>
                ) : (
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Token</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Parameter Name</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Description</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {selectedTokens.map((tokenParam) => {
                          const tokenDef = selectedSource.tokens.find(t => t.id === tokenParam.id);
                          if (!tokenDef) return null;
                          
                          return (
                            <tr key={tokenParam.id} className="hover:bg-gray-100 dark:hover:bg-gray-750">
                              <td className="px-4 py-3 text-sm font-mono">{tokenDef.token}</td>
                              <td className="px-4 py-3">
                                {mappingMode === 'manual' ? (
                                  <Input
                                    value={tokenParam.parameter}
                                    onChange={(e) => handleUpdateParameter(tokenParam.id, e.target.value)}
                                    className="h-8 text-sm"
                                    placeholder="Parameter name"
                                  />
                                ) : (
                                  <span className="text-sm font-medium">{tokenParam.parameter}</span>
                                )}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                                {tokenDef.description}
                              </td>
                              <td className="px-4 py-3">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveToken(tokenParam.id)}
                                  className="text-gray-500 hover:text-error-500"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              
              {/* URL Preview */}
              {selectedTokens.length > 0 && (
                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h4 className="text-sm font-medium mb-2">URL Preview with Tokens</h4>
                  <div className="mb-2">
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                      <span>Your tracking URL will look like this:</span>
                      <Badge variant="secondary">Before token replacement</Badge>
                    </div>
                    <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono break-all">
                      https://yourdomain.com/campaign?
                      {selectedTokens
                        .map((tokenParam) => `${tokenParam.parameter}=${tokenParam.token}`)
                        .join('&')}
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                      <span>When a visitor clicks, it will be replaced with values like:</span>
                      <Badge variant="success">After token replacement</Badge>
                    </div>
                    <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono break-all">
                      https://yourdomain.com/campaign?
                      {selectedTokens
                        .map((tokenParam) => {
                          const tokenDef = selectedSource.tokens.find(t => t.id === tokenParam.id);
                          return `${tokenParam.parameter}=${tokenDef?.example || 'value'}`;
                        })
                        .join('&')}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}