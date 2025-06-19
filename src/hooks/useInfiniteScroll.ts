
import { useState, useEffect, useCallback } from 'react';

interface UseInfiniteScrollProps<T> {
  data: T[];
  itemsPerPage: number;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

export function useInfiniteScroll<T>({ 
  data, 
  itemsPerPage, 
  hasMore = true,
  onLoadMore 
}: UseInfiniteScrollProps<T>) {
  const [visibleItems, setVisibleItems] = useState(itemsPerPage);
  const [loading, setLoading] = useState(false);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    
    // Simulate async loading
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setVisibleItems(prev => Math.min(prev + itemsPerPage, data.length));
    
    if (onLoadMore) {
      onLoadMore();
    }
    
    setLoading(false);
  }, [loading, hasMore, itemsPerPage, data.length, onLoadMore]);

  const handleScroll = useCallback(() => {
    if (window.innerHeight + document.documentElement.scrollTop 
        >= document.documentElement.offsetHeight - 1000) {
      loadMore();
    }
  }, [loadMore]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const displayedData = data.slice(0, visibleItems);
  const hasMoreToShow = visibleItems < data.length;

  return {
    displayedData,
    loading,
    hasMoreToShow,
    loadMore,
  };
}
