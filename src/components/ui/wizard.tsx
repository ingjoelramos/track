import React, { createContext, useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from './button';
import { cn } from '../../lib/utils';

interface WizardContextValue {
  activeStep: number;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  goToStep: (step: number) => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

const WizardContext = createContext<WizardContextValue | undefined>(undefined);

const useWizard = () => {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error('Wizard components must be used within a WizardProvider');
  }
  return context;
};

interface WizardProps {
  children: React.ReactNode;
  className?: string;
  initialStep?: number;
  onComplete?: () => void;
}

export const Wizard: React.FC<WizardProps> = ({ 
  children, 
  className,
  initialStep = 0,
  onComplete
}) => {
  const [activeStep, setActiveStep] = useState(initialStep);
  
  // Count the number of steps
  const steps = React.Children.toArray(children).filter(
    (child) => React.isValidElement(child) && child.type === WizardStep
  );
  
  const isFirstStep = activeStep === 0;
  const isLastStep = activeStep === steps.length - 1;
  
  const goToNextStep = () => {
    if (isLastStep) {
      onComplete?.();
      return;
    }
    setActiveStep((prev) => prev + 1);
  };
  
  const goToPreviousStep = () => {
    if (!isFirstStep) {
      setActiveStep((prev) => prev - 1);
    }
  };
  
  const goToStep = (step: number) => {
    if (step >= 0 && step < steps.length) {
      setActiveStep(step);
    }
  };
  
  return (
    <WizardContext.Provider
      value={{
        activeStep,
        goToNextStep,
        goToPreviousStep,
        goToStep,
        isFirstStep,
        isLastStep,
      }}
    >
      <div className={cn('space-y-6', className)}>
        {children}
      </div>
    </WizardContext.Provider>
  );
};

interface WizardStepProps {
  children: React.ReactNode;
  title?: string;
}

export const WizardStep: React.FC<WizardStepProps> = ({ children, title }) => {
  const { activeStep } = useWizard();
  const stepIndex = React.useContext(WizardStepIndexContext);
  
  if (activeStep !== stepIndex) {
    return null;
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      {title && <h2 className="text-xl font-heading font-semibold">{title}</h2>}
      {children}
    </motion.div>
  );
};

interface WizardNavigationProps {
  nextLabel?: string;
  backLabel?: string;
  completeLabel?: string;
  className?: string;
}

export const WizardNavigation: React.FC<WizardNavigationProps> = ({
  nextLabel = 'Next',
  backLabel = 'Back',
  completeLabel = 'Complete',
  className,
}) => {
  const { goToNextStep, goToPreviousStep, isFirstStep, isLastStep } = useWizard();
  
  return (
    <div className={cn('flex justify-between pt-6', className)}>
      <Button
        variant="outline"
        onClick={goToPreviousStep}
        disabled={isFirstStep}
      >
        {backLabel}
      </Button>
      <Button onClick={goToNextStep}>
        {isLastStep ? completeLabel : nextLabel}
      </Button>
    </div>
  );
};

interface WizardStepsProps {
  children: React.ReactNode;
  className?: string;
}

// Context to track step index
const WizardStepIndexContext = createContext<number>(-1);

export const WizardSteps: React.FC<WizardStepsProps> = ({ children, className }) => {
  const { activeStep } = useWizard();
  
  return (
    <div className={cn('space-y-4', className)}>
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return null;
        
        return (
          <WizardStepIndexContext.Provider value={index}>
            {React.cloneElement(child as React.ReactElement)}
          </WizardStepIndexContext.Provider>
        );
      })}
    </div>
  );
};

interface WizardStepIndicatorProps {
  stepNames: string[];
  className?: string;
}

export const WizardStepIndicator: React.FC<WizardStepIndicatorProps> = ({
  stepNames,
  className,
}) => {
  const { activeStep, goToStep } = useWizard();
  
  return (
    <div className={cn('flex items-center space-x-2', className)}>
      {stepNames.map((step, index) => (
        <React.Fragment key={index}>
          {index > 0 && <div className="h-0.5 w-4 bg-gray-200 dark:bg-gray-700" />}
          <button
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors',
              activeStep === index
                ? 'bg-primary-600 text-white'
                : index < activeStep
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
            )}
            onClick={() => goToStep(index)}
          >
            {index + 1}
          </button>
          <div className="ml-2 hidden sm:block">
            <p
              className={cn(
                'text-sm font-medium',
                activeStep === index
                  ? 'text-gray-900 dark:text-gray-100'
                  : 'text-gray-500 dark:text-gray-400'
              )}
            >
              {step}
            </p>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};