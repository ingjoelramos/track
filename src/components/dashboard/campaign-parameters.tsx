import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings, Copy, Globe, Code, Link as LinkIcon, ArrowRight, Plus, Check, Trash2, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { useToast } from '../ui/toast';
import { Campaign, Link, TrafficParameter } from '../../types';
import { getCampaign, getLinks, getDomain, getTemplate, updateTrafficParameters } from '../../lib/storage';
import { trafficSources } from '../../data/traffic-sources';

interface CampaignParametersProps {
  campaignId: string;
}

export function CampaignParameters({ campaignId }: CampaignParametersProps) {
  const { addToast } = useToast();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [links, setLinks] = useState<Link[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedSource, setSelectedSource] = useState<any>(null);
  const [parameters, setParameters] = useState<TrafficParameter[]>([]);
  const [mappingMode, setMappingMode] = useState<'auto' | 'manual'>('auto');
  const [tokenToAdd, setTokenToAdd] = useState<string>('');
  const [parameterName, setParameterName] = useState<string>('');
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  
  useEffect(() => {
    const campaignData = getCampaign(campaignId);
    if (campaignData) {
      setCampaign(campaignData);
      setLinks(getLinks(campaignId));
      
      if (campaignData.trafficSource) {
        const source = trafficSources.find(s => s.id === campaignData.trafficSource);
        setSelectedSource(source || null);
      }
      
      if (campaignData.trafficParameters && campaignData.trafficParameters.length > 0) {
        setParameters(campaignData.trafficParameters);
      }
    }
    setIsLoading(false);
  }, [campaignId]);
  
  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    
    addToast({
      title: 'URL Copied',
      description: 'Tracking URL copied to clipboard',
      variant: 'success',
    });
    
    setTimeout(() => {
      setCopiedUrl(null);
    }, 2000);
  };
  
  const handleSourceSelect = (sourceId: string) => {
    const source = trafficSources.find(s => s.id === sourceId) || null;
    setSelectedSource(source);
    setParameters([]);
  };
  
  const handleAddToken = (tokenId: string) => {
    if (!selectedSource) return;
    
    const token = selectedSource.tokens.find((t: any) => t.id === tokenId);
    if (!token) return;
    
    if (parameters.find(t => t.id === tokenId)) return;
    
    let param = '';
    if (mappingMode === 'auto') {
      const prefix = selectedSource.defaultParameterPrefix;
      const nextNum = parameters.length + 1;
      param = `${prefix}${nextNum}`;
    } else {
      param = parameterName || token.id.replace(/[^a-zA-Z0-9_]/g, '');
    }
    
    const newToken: TrafficParameter = {
      id: tokenId,
      sourceId: selectedSource.id,
      token: token.token,
      parameter: param,
      description: token.description
    };
    
    const updatedTokens = [...parameters, newToken];
    setParameters(updatedTokens);
    
    setTokenToAdd('');
    setParameterName('');
  };
  
  const handleRemoveToken = (tokenId: string) => {
    const updatedTokens = parameters.filter(t => t.id !== tokenId);
    setParameters(updatedTokens);
  };
  
  const handleUpdateParameter = (tokenId: string, newParamName: string) => {
    const updatedTokens = parameters.map(t => 
      t.id === tokenId ? { ...t, parameter: newParamName } : t
    );
    setParameters(updatedTokens);
  };
  
  const toggleMappingMode = () => {
    setMappingMode(mappingMode === 'auto' ? 'manual' : 'auto');
  };
  
  const handleSaveChanges = () => {
    if (!campaign) return;
    
    const updatedCampaign: Partial<Campaign> = {
      ...campaign,
      trafficSource: selectedSource?.id || '',
      trafficParameters: parameters
    };
    
    updateTrafficParameters(campaignId, parameters);
    
    setCampaign(updatedCampaign as Campaign);
    
    setIsEditing(false);
    
    addToast({
      title: 'Changes Saved',
      description: 'Traffic source parameters have been updated.',
      variant: 'success',
    });
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  if (!campaign || links.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500 dark:text-gray-400">No campaign data available</p>
        </CardContent>
      </Card>
    );
  }
  
  const domain = getDomain(campaign.domainId);
  const template = getTemplate(campaign.templateId);
  const link = links[0];
  const trafficSource = campaign.trafficSource ? 
    trafficSources.find(s => s.id === campaign.trafficSource) : null;
  
  let trackingUrl = '';
  if (domain && link.slug) {
    trackingUrl = `https://${domain.host}/${link.slug}`;
    
    const queryParams = [];
    
    if (campaign.trafficParameters && campaign.trafficParameters.length > 0) {
      campaign.trafficParameters.forEach(param => {
        queryParams.push(`${param.parameter}=${param.token}`);
      });
    }
    
    if (queryParams.length > 0) {
      trackingUrl += '?' + queryParams.join('&');
    }
  }
  
  let previewUrl = '';
  if (domain && link.slug) {
    previewUrl = `https://${domain.host}/${link.slug}`;
    
    const queryParams = [];
    
    if (campaign.trafficParameters && campaign.trafficParameters.length > 0 && trafficSource) {
      campaign.trafficParameters.forEach(param => {
        const tokenDef = trafficSource.tokens.find(t => t.id === param.id);
        if (tokenDef) {
          queryParams.push(`${param.parameter}=${tokenDef.example}`);
        }
      });
    }
    
    if (queryParams.length > 0) {
      previewUrl += '?' + queryParams.join('&');
    }
  }

  if (isEditing) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Configure Traffic Source</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSaveChanges}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
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
                        selectedSource?.id === source.id 
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
                            selectedSource?.id === source.id 
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
                              .filter(token => !parameters.some(t => t.id === token.id))
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
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Selected Tokens
                      </h4>
                      
                      {parameters.length === 0 ? (
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
                              {parameters.map((tokenParam) => {
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
                    
                    {parameters.length > 0 && (
                      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <h4 className="text-sm font-medium mb-2">URL Preview with Tokens</h4>
                        <div className="mb-2">
                          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                            <span>Your tracking URL will look like this:</span>
                            <Badge variant="secondary">Before token replacement</Badge>
                          </div>
                          <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono break-all">
                            https://{domain?.host || 'yourdomain.com'}/{link.slug}?
                            {parameters
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
                            https://{domain?.host || 'yourdomain.com'}/{link.slug}?
                            {parameters
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
          </CardContent>
        </Card>
      </motion.div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Traffic Source Parameters</CardTitle>
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            <Settings className="h-4 w-4 mr-2" />
            {trafficSource ? 'Edit Parameters' : 'Configure Traffic Source'}
          </Button>
        </CardHeader>
        <CardContent className="p-6">
          {!trafficSource ? (
            <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 className="text-lg font-medium mb-2">No Traffic Source Configured</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Configure a traffic source to define how tracking parameters will be passed in your URLs.
              </p>
              <Button onClick={() => setIsEditing(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Configure Traffic Source
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Tracking URL with Tokens</h3>
                <div className="flex gap-2">
                  <div className="flex-1 p-2 bg-gray-100 dark:bg-gray-800 rounded-lg font-mono text-xs overflow-x-auto">
                    {trackingUrl || 'No tracking URL configured'}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled={!trackingUrl}
                    onClick={() => handleCopyUrl(trackingUrl)}
                  >
                    {copiedUrl === trackingUrl ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              
              {previewUrl && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Preview URL with Sample Values</h3>
                  <div className="flex gap-2">
                    <div className="flex-1 p-2 bg-gray-100 dark:bg-gray-800 rounded-lg font-mono text-xs overflow-x-auto">
                      {previewUrl}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleCopyUrl(previewUrl)}
                    >
                      {copiedUrl === previewUrl ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              )}
              
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Campaign Configuration</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Status</span>
                      <Badge variant={campaign.status === 'active' ? 'success' : (campaign.status === 'paused' ? 'warning' : 'default')}>
                        {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Domain</span>
                      <span className="text-sm font-medium flex items-center">
                        <Globe className="h-3.5 w-3.5 mr-1 text-primary-500" />
                        {domain?.host || 'None'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Slug</span>
                      <span className="text-sm font-medium flex items-center">
                        <LinkIcon className="h-3.5 w-3.5 mr-1 text-primary-500" />
                        {link.slug || 'None'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Template</span>
                      <span className="text-sm font-medium flex items-center">
                        <Code className="h-3.5 w-3.5 mr-1 text-primary-500" />
                        {template?.name || 'None'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Traffic Source</span>
                      <span className="text-sm font-medium">
                        {trafficSource?.name || 'None'}
                      </span>
                    </div>
                  </div>
                </div>
                
                {trafficSource && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{trafficSource.name} Token Mapping</h3>
                    {campaign.trafficParameters && campaign.trafficParameters.length > 0 ? (
                      <div className="space-y-2">
                        {campaign.trafficParameters.map((param) => {
                          const tokenDef = trafficSource.tokens.find(t => t.id === param.id);
                          if (!tokenDef) return null;
                          
                          return (
                            <div key={param.id} className="flex justify-between items-center py-1 px-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800">
                              <span className="text-sm flex items-center">
                                <span className="font-mono text-primary-600 dark:text-primary-400">
                                  {tokenDef.token}
                                </span>
                                <ArrowRight className="h-3 w-3 mx-2 text-gray-400" />
                                <span className="font-medium">{param.parameter}</span>
                              </span>
                              <Badge variant="secondary" className="text-xs">
                                {tokenDef.name}
                              </Badge>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className="text-sm text-gray-500 dark:text-gray-400">No tokens configured</p>
                        <Button variant="outline" size="sm" className="mt-2" onClick={() => setIsEditing(true)}>
                          <Plus className="h-4 w-4 mr-1" /> Add Tokens
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-start gap-3">
                  <Settings className="h-5 w-5 text-primary-500 mt-0.5" />
                  <div>
                    <h3 className="font-medium">How Token Replacement Works</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {trafficSource?.name || 'Traffic sources'} will replace each token (like {'{cid}'} or {'{keyword}'}) with 
                      the actual values when a visitor clicks on your ad. These values will be passed to your tracking URL via 
                      the parameter names you've configured.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}