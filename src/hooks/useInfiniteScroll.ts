import { useCallback, useRef } from 'react';

export function useInfiniteScroll(callback: () => void, options = {}) {
  const observer = useRef<IntersectionObserver | null>(null);
  
  const lastElementRef = useCallback((node: HTMLElement | null) => {
    if (!node) return;
    
    observer.current?.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        callback();
      }
    }, options);
    
    observer.current.observe(node);
  }, [callback, options]);
  
  return lastElementRef;
}