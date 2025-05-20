import React from 'react';
import { Code, ListTree } from 'lucide-react';
import { Card, CardContent } from '../../ui/card';
import { Template } from '../../../types';
import { getTemplates } from '../../../lib/storage';

interface TemplateSelectionStepProps {
  formData: {
    templateId: string;
  };
  updateFormData: (data: Partial<{ templateId: string }>) => void;
  setSelectedTemplate: (template: Template | null) => void;
}

export function TemplateSelectionStep({ 
  formData, 
  updateFormData, 
  setSelectedTemplate 
}: TemplateSelectionStepProps) {
  const [templates, setTemplates] = React.useState<Template[]>([]);
  
  React.useEffect(() => {
    const availableTemplates = getTemplates();
    setTemplates(availableTemplates);
    
    // Auto-select first template if none selected
    if (!formData.templateId && availableTemplates.length > 0) {
      handleTemplateSelect(availableTemplates[0].id);
    }
  }, []);
  
  const handleTemplateSelect = (templateId: string) => {
    updateFormData({ templateId });
    const template = templates.find(t => t.id === templateId) || null;
    setSelectedTemplate(template);
  };
  
  const getTemplateIcon = (type: 'placeholders' | 'query') => {
    return type === 'placeholders' ? (
      <ListTree className="h-10 w-10 text-primary-600" />
    ) : (
      <Code className="h-10 w-10 text-secondary-600" />
    );
  };
  
  return (
    <div className="space-y-6">
      <p className="text-gray-500 dark:text-gray-400">
        Choose how your tracking parameters will be formatted in the URL.
      </p>
      
      <div className="grid gap-4 md:grid-cols-2">
        {templates.map((template) => (
          <Card
            key={template.id}
            className={`cursor-pointer transition-all ${
              formData.templateId === template.id 
                ? 'border-primary-500' 
                : 'hover:border-gray-300 dark:hover:border-gray-600'
            }`}
            onClick={() => handleTemplateSelect(template.id)}
          >
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                {getTemplateIcon(template.type)}
                
                <h3 className="mt-4 text-lg font-medium">{template.name}</h3>
                
                <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {template.type === 'placeholders' ? (
                    <p>Uses placeholders like {'{parameter}'} in the URL</p>
                  ) : (
                    <p>Uses query parameters like ?param=value in the URL</p>
                  )}
                </div>
                
                <div className="mt-4 w-full p-2 bg-gray-100 dark:bg-gray-800 rounded-md text-xs font-mono overflow-x-auto">
                  {template.pattern}
                </div>
                
                <div 
                  className={`mt-4 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    formData.templateId === template.id 
                      ? 'border-primary-600' 
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  {formData.templateId === template.id && (
                    <div className="w-3 h-3 rounded-full bg-primary-600" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}