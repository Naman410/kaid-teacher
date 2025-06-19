
import { useState, useEffect, useMemo } from 'react';

interface UseVirtualizationProps {
  itemCount: number;
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

export function useVirtualization({ 
  itemCount, 
  itemHeight, 
  containerHeight, 
  overscan = 5 
}: UseVirtualizationProps) {
  const [scrollTop, setScrollTop] = useState(0);

  const { startIndex, endIndex, visibleItems } = useMemo(() => {
    const start = Math.floor(scrollTop / itemHeight);
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    const end = Math.min(start + visibleCount + overscan, itemCount - 1);
    
    return {
      startIndex: Math.max(0, start - overscan),
      endIndex: end,
      visibleItems: end - Math.max(0, start - overscan) + 1,
    };
  }, [scrollTop, itemHeight, containerHeight, itemCount, overscan]);

  const totalHeight = itemCount * itemHeight;
  const offsetY = startIndex * itemHeight;

  return {
    startIndex,
    endIndex,
    visibleItems,
    totalHeight,
    offsetY,
    setScrollTop,
  };
}
