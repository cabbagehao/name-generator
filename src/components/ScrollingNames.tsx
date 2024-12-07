import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Heart, Sparkles, Pause, Play, Maximize2, Minimize2 } from 'lucide-react';
import { Language, NameBubble, NameConfig } from '../types';
import { translations } from '../utils/i18n';
import { calculateNamePositions, redistributeBubbles } from '../utils/positionCalculator';
import { useAnimationControl } from '../hooks/useAnimationControl';
import { generateNewName } from '../utils/nameGenerator';

interface ScrollingNamesProps {
  names: string[];
  onAddToFavorites: (name: string) => void;
  favorites: Set<string>;
  language: Language;
  config: NameConfig;
}

export function ScrollingNames({ names, onAddToFavorites, favorites, language, config }: ScrollingNamesProps) {
  const [bubbles, setBubbles] = useState<NameBubble[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [totalDisplayed, setTotalDisplayed] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  const pausedBubblesRef = useRef<NameBubble[]>([]);
  const resizeTimeoutRef = useRef<number>();
  const initializedRef = useRef(false);
  const displayedNamesRef = useRef<Set<string>>(new Set());

  const { isPaused, handlePauseToggle } = useAnimationControl(
    bubbles,
    pausedBubblesRef,
    setBubbles
  );

  const t = translations[language];

  const createBubble = useCallback((startInView: boolean = false) => {
    if (!containerRef.current) return null;
    
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    
    const newName = generateNewName(config);
    if (!newName) return null;
    
    const positions = calculateNamePositions(width, height, 1, 100, startInView);
    const position = positions[0];
    const baseSpeed = 1;
    const speedVariation = Math.random() * 2;
    
    return {
      id: Math.random().toString(),
      name: newName,
      x: position.x,
      y: position.y,
      speed: baseSpeed + speedVariation,
      delay: 0
    };
  }, [config]);

  const handleNameClick = useCallback((name: string) => {
    onAddToFavorites(name);
  }, [onAddToFavorites]);

  const handleResize = useCallback(() => {
    if (!containerRef.current || isPaused) return;
    
    if (resizeTimeoutRef.current) {
      window.clearTimeout(resizeTimeoutRef.current);
    }
    
    resizeTimeoutRef.current = window.setTimeout(() => {
      const width = containerRef.current?.clientWidth || 0;
      const height = containerRef.current?.clientHeight || 0;
      setBubbles(prevBubbles => redistributeBubbles(prevBubbles, width, height));
    }, 100);
  }, [isPaused]);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => {
      const newState = !prev;
      setTimeout(() => handleResize(), 50);
      return newState;
    });
  }, [handleResize]);

  useEffect(() => {
    if (!initializedRef.current && containerRef.current) {
      initializedRef.current = true;
      const initialBubbles = Array.from({ length: 10 }, () => createBubble(true))
        .filter((b): b is NameBubble => b !== null);
      setBubbles(initialBubbles);
      
      initialBubbles.forEach(bubble => {
        if (bubble.y >= 0 && bubble.y <= (containerRef.current?.clientHeight || 0)) {
          displayedNamesRef.current.add(bubble.name);
        }
      });
      setTotalDisplayed(displayedNamesRef.current.size);
    }

    const animate = (timestamp: number) => {
      if (!containerRef.current) return;
      
      if (!lastTimeRef.current) {
        lastTimeRef.current = timestamp;
      }
      
      const deltaTime = timestamp - lastTimeRef.current;
      
      if (deltaTime >= 16.67) {
        lastTimeRef.current = timestamp;
        
        if (!isPaused) {
          setBubbles(prevBubbles => {
            const height = containerRef.current?.clientHeight || 0;
            
            return prevBubbles.map(bubble => {
              const newY = bubble.y + bubble.speed;
              
              if (newY >= 0 && newY <= height) {
                if (!displayedNamesRef.current.has(bubble.name)) {
                  displayedNamesRef.current.add(bubble.name);
                  setTotalDisplayed(displayedNamesRef.current.size);
                }
              }
              
              if (newY > height) {
                const newBubble = createBubble();
                if (newBubble) {
                  return newBubble;
                }
              }
              
              return { ...bubble, y: newY };
            });
          });
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (resizeTimeoutRef.current) {
        window.clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, [createBubble, isPaused]);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  useEffect(() => {
    displayedNamesRef.current.clear();
    setTotalDisplayed(0);
  }, [config]);

  return (
    <div className={`w-full max-w-4xl ${isFullscreen ? 'fixed inset-0 z-50 max-w-none bg-white' : ''}`}>
      <div className={`flex justify-between items-center mb-4 ${isFullscreen ? 'absolute top-4 right-4 z-10 mb-0' : ''}`}>
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={handlePauseToggle}
            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow text-sm sm:text-base"
          >
            {isPaused ? (
              <>
                <Play size={16} className="sm:w-5 sm:h-5 text-green-500" />
                <span>{t.continue}</span>
              </>
            ) : (
              <>
                <Pause size={16} className="sm:w-5 sm:h-5 text-blue-500" />
                <span>{t.pause}</span>
              </>
            )}
          </button>
          {!isFullscreen && (
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
              <span>{t.displayed}: {totalDisplayed}</span>
              <span>|</span>
              <span>{t.favorites}: {favorites.size}</span>
            </div>
          )}
          {isFullscreen && (
            <div className="text-xs sm:text-sm text-white bg-black/50 px-2 sm:px-3 py-1 rounded-full">
              {t.favorites}: {favorites.size}
            </div>
          )}
        </div>
        <button
          onClick={toggleFullscreen}
          className="ml-2 sm:ml-4 p-1.5 sm:p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow"
        >
          {isFullscreen ? (
            <Minimize2 size={16} className="sm:w-5 sm:h-5 text-gray-600" />
          ) : (
            <Maximize2 size={16} className="sm:w-5 sm:h-5 text-gray-600" />
          )}
        </button>
      </div>
      <div 
        ref={containerRef}
        className={`relative bg-gradient-to-br from-blue-50 to-pink-50 rounded-lg shadow-inner overflow-hidden
          ${isFullscreen ? 'w-full h-screen' : 'w-full h-[500px]'}`}
        style={{ perspective: '1000px' }}
      >
        {bubbles.map(bubble => (
          <div
            key={bubble.id}
            style={{
              transform: `translate3d(${bubble.x}px, ${bubble.y}px, 0)`,
              position: 'absolute',
              left: 0,
              top: 0,
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              WebkitTransform: `translate3d(${bubble.x}px, ${bubble.y}px, 0)`,
              WebkitTransformStyle: 'preserve-3d'
            }}
            className="name-bubble will-change-transform"
          >
            <div
              onClick={() => handleNameClick(bubble.name)}
              className={`name-card bg-white px-3 sm:px-6 py-2 sm:py-3 rounded-full shadow-lg flex items-center gap-1 sm:gap-2 cursor-pointer
                hover:bg-gradient-to-r hover:from-blue-50 hover:to-pink-50 transform hover:scale-110 transition-transform`}
              style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                WebkitTransformStyle: 'preserve-3d'
              }}
            >
              <span className="text-base sm:text-lg font-medium">{bubble.name}</span>
              {favorites.has(bubble.name) && (
                <Sparkles size={14} className="sm:w-4 sm:h-4 text-yellow-400" />
              )}
              <Heart 
                size={16}
                className={`sm:w-5 sm:h-5 transition-colors ${
                  favorites.has(bubble.name)
                    ? 'text-red-500'
                    : 'text-gray-300'
                }`}
                fill={favorites.has(bubble.name) ? 'currentColor' : 'none'}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}