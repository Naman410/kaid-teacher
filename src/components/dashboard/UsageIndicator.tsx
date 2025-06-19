
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { memo, useMemo } from 'react';

interface UsageIndicatorProps {
  current: number;
  limit: number;
  label: string;
  type?: 'daily' | 'monthly';
}

export const UsageIndicator = memo(({ current, limit, label, type = 'daily' }: UsageIndicatorProps) => {
  const { percentage, colorClass, formattedPercentage } = useMemo(() => {
    const pct = (current / limit) * 100;
    let color = 'text-green-600';
    
    if (pct >= 90) color = 'text-red-600';
    else if (pct >= 75) color = 'text-yellow-600';
    
    return {
      percentage: pct,
      colorClass: color,
      formattedPercentage: pct.toFixed(1)
    };
  }, [current, limit]);

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">{label}</span>
        <span className={cn("text-sm font-medium", colorClass)}>
          {current}/{limit}
        </span>
      </div>
      <Progress 
        value={percentage} 
        className="h-2"
      />
      <div className="text-xs text-muted-foreground">
        {formattedPercentage}% of {type} limit used
      </div>
    </div>
  );
});

UsageIndicator.displayName = 'UsageIndicator';
