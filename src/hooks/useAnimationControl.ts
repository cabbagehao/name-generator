import { useState, useCallback, MutableRefObject } from 'react';
import { NameBubble } from '../types';

interface AnimationControlResult {
  isPaused: boolean;
  handlePauseToggle: () => void;
  pausedBubblesRef: MutableRefObject<NameBubble[]>;
}

export function useAnimationControl(
  bubbles: NameBubble[],
  pausedBubblesRef: MutableRefObject<NameBubble[]>,
  setBubbles: (bubbles: NameBubble[]) => void
): AnimationControlResult {
  const [isPaused, setIsPaused] = useState(false);

  const handlePauseToggle = useCallback(() => {
    setIsPaused(prev => {
      if (!prev) {
        // Store current bubbles when pausing
        pausedBubblesRef.current = [...bubbles];
      } else {
        // Restore bubbles when resuming
        setBubbles(pausedBubblesRef.current);
      }
      return !prev;
    });
  }, [bubbles, pausedBubblesRef, setBubbles]);

  return {
    isPaused,
    handlePauseToggle,
    pausedBubblesRef
  };
}