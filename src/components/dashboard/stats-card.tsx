import React from 'react';
import { Card, CardContent } from '../ui/card';
import { DivideIcon as LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
  trendDirection?: 'up' | 'down';
  description?: string;
}

export function StatsCard({ 
  title, 
  value, 
  icon, 
  trend, 
  trendDirection = 'up',
  description 
}: StatsCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {title}
            </p>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold">{value}</p>
              {trend && (
                <span 
                  className={cn(
                    "text-sm font-medium",
                    trendDirection === 'up' ? "text-green-600 dark:text-green-500" : "text-red-600 dark:text-red-500"
                  )}
                >
                  {trend}
                </span>
              )}
            </div>
            {description && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {description}
              </p>
            )}
          </div>
          <div className="p-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}