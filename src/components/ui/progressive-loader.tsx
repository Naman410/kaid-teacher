
import React, { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface ProgressiveLoaderProps {
  isLoading: boolean;
  hasError?: boolean;
  children: React.ReactNode;
  skeleton?: React.ReactNode;
  delay?: number;
  className?: string;
}

export function ProgressiveLoader({ 
  isLoading, 
  hasError = false,
  children, 
  skeleton,
  delay = 0,
  className 
}: ProgressiveLoaderProps) {
  const [shouldShow, setShouldShow] = useState(delay === 0);

  useEffect(() => {
    if (delay > 0) {
      const timer = setTimeout(() => setShouldShow(true), delay);
      return () => clearTimeout(timer);
    }
  }, [delay]);

  if (!shouldShow) {
    return null;
  }

  if (hasError) {
    return (
      <div className={cn("p-4 text-center text-muted-foreground", className)}>
        Failed to load content. Please try again.
      </div>
    );
  }

  if (isLoading) {
    return skeleton || <Skeleton className={cn("h-32 w-full", className)} />;
  }

  return <>{children}</>;
}
