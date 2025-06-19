
import React, { memo } from 'react';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Skeleton } from '@/components/ui/skeleton';
import { ProgressiveLoader } from '@/components/ui/progressive-loader';
import { Users, GraduationCap, ImageIcon, TrendingUp } from 'lucide-react';

interface OptimizedStatsGridProps {
  classesData: any;
  studentsData: any;
  creationsData: any;
  todayCreations: number;
  classesLoading: boolean;
  studentsLoading: boolean;
  creationsLoading: boolean;
}

const StatCardSkeleton = memo(() => <Skeleton className="h-32" />);
StatCardSkeleton.displayName = 'StatCardSkeleton';

export const OptimizedStatsGrid = memo(({
  classesData,
  studentsData,
  creationsData,
  todayCreations,
  classesLoading,
  studentsLoading,
  creationsLoading
}: OptimizedStatsGridProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <ProgressiveLoader
        isLoading={classesLoading}
        skeleton={<StatCardSkeleton />}
        delay={0}
      >
        <StatsCard
          title="Total Classes"
          value={classesData?.length || 0}
          icon={GraduationCap}
          description="Active classes"
        />
      </ProgressiveLoader>
      
      <ProgressiveLoader
        isLoading={studentsLoading}
        skeleton={<StatCardSkeleton />}
        delay={100}
      >
        <StatsCard
          title="Total Students"
          value={studentsData?.length || 0}
          icon={Users}
          description="Enrolled students"
        />
      </ProgressiveLoader>
      
      <ProgressiveLoader
        isLoading={creationsLoading}
        skeleton={<StatCardSkeleton />}
        delay={200}
      >
        <StatsCard
          title="Total Creations"
          value={creationsData?.length || 0}
          icon={ImageIcon}
          description="All-time creations"
        />
      </ProgressiveLoader>
      
      <ProgressiveLoader
        isLoading={creationsLoading}
        skeleton={<StatCardSkeleton />}
        delay={300}
      >
        <StatsCard
          title="Today's Creations"
          value={todayCreations}
          icon={TrendingUp}
          description="Created today"
        />
      </ProgressiveLoader>
    </div>
  );
});

OptimizedStatsGrid.displayName = 'OptimizedStatsGrid';
