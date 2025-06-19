
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface UsageIndicatorProps {
  current: number;
  limit: number;
  label: string;
  type?: 'daily' | 'monthly';
}

export function UsageIndicator({ current, limit, label, type = 'daily' }: UsageIndicatorProps) {
  const percentage = (current / limit) * 100;
  
  const getColorClass = () => {
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 75) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getProgressClass = () => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">{label}</span>
        <span className={cn("text-sm font-medium", getColorClass())}>
          {current}/{limit}
        </span>
      </div>
      <Progress 
        value={percentage} 
        className="h-2"
        // Custom styling would need to be implemented in the Progress component
      />
      <div className="text-xs text-muted-foreground">
        {percentage.toFixed(1)}% of {type} limit used
      </div>
    </div>
  );
}
