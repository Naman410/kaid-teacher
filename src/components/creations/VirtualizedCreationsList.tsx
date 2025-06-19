
import React, { memo, useRef, useCallback } from 'react';
import { StudentCreation } from '@/types/teacher';
import { useVirtualization } from '@/hooks/useVirtualization';
import { CreationCard } from './CreationCard';

interface VirtualizedCreationsListProps {
  creations: StudentCreation[];
  containerHeight?: number;
}

const ITEM_HEIGHT = 400; // Approximate height of a creation card

export const VirtualizedCreationsList = memo(({ 
  creations, 
  containerHeight = 600 
}: VirtualizedCreationsListProps) => {
  const scrollElementRef = useRef<HTMLDivElement>(null);
  
  const {
    startIndex,
    endIndex,
    totalHeight,
    offsetY,
    setScrollTop,
  } = useVirtualization({
    itemCount: creations.length,
    itemHeight: ITEM_HEIGHT,
    containerHeight,
    overscan: 2,
  });

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, [setScrollTop]);

  if (creations.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No creations found.</p>
      </div>
    );
  }

  const visibleCreations = creations.slice(startIndex, endIndex + 1);

  return (
    <div
      ref={scrollElementRef}
      className="overflow-auto border rounded-lg"
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div
          style={{
            transform: `translateY(${offsetY}px)`,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
          }}
        >
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 p-4">
            {visibleCreations.map((creation) => (
              <div key={creation.id} style={{ height: ITEM_HEIGHT }}>
                <CreationCard creation={creation} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});

VirtualizedCreationsList.displayName = 'VirtualizedCreationsList';
