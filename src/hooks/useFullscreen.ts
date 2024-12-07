import { useState, useCallback } from 'react';

export function useFullscreen(onToggle?: () => void) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => {
      const newState = !prev;
      if (onToggle) {
        setTimeout(onToggle, 50);
      }
      return newState;
    });
  }, [onToggle]);

  return {
    isFullscreen,
    toggleFullscreen
  };
}