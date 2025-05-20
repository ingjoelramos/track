import React, { createContext, useContext, useState } from 'react';
import { cn } from '../../lib/utils';

type TabsContextValue = {
  selectedTab: string;
  setSelectedTab: (id: string) => void;
};

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

function useTabs() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs components must be used within a TabsProvider');
  }
  return context;
}

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultTab: string;
}

const Tabs = ({ children, className, defaultTab, ...props }: TabsProps) => {
  const [selectedTab, setSelectedTab] = useState<string>(defaultTab);
  
  return (
    <TabsContext.Provider value={{ selectedTab, setSelectedTab }}>
      <div className={cn('space-y-4', className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

const TabsList = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'inline-flex items-center justify-center rounded-lg bg-gray-100 p-1 dark:bg-gray-800',
      className
    )}
    {...props}
  />
));
TabsList.displayName = 'TabsList';

interface TabTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

const TabTrigger = React.forwardRef<HTMLButtonElement, TabTriggerProps>(
  ({ className, value, ...props }, ref) => {
    const { selectedTab, setSelectedTab } = useTabs();
    const isSelected = selectedTab === value;
    
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          isSelected
            ? 'bg-white text-primary-700 shadow-sm dark:bg-gray-700 dark:text-primary-100'
            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300',
          className
        )}
        onClick={() => setSelectedTab(value)}
        {...props}
      />
    );
  }
);
TabTrigger.displayName = 'TabTrigger';

interface TabContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

const TabContent = React.forwardRef<HTMLDivElement, TabContentProps>(
  ({ className, value, children, ...props }, ref) => {
    const { selectedTab } = useTabs();
    
    if (selectedTab !== value) {
      return null;
    }
    
    return (
      <div
        ref={ref}
        className={cn('mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
TabContent.displayName = 'TabContent';

export { Tabs, TabsList, TabTrigger, TabContent };