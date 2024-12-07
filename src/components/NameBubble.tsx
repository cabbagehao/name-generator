import React from 'react';
import { Heart, Sparkles } from 'lucide-react';
import { NameBubble as NameBubbleType } from '../types';

interface NameBubbleProps {
  bubble: NameBubbleType;
  isFavorite: boolean;
  onClick: (name: string) => void;
}

export function NameBubble({ bubble, isFavorite, onClick }: NameBubbleProps) {
  return (
    <div
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
        onClick={() => onClick(bubble.name)}
        className={`name-card bg-white px-3 sm:px-6 py-2 sm:py-3 rounded-full shadow-lg flex items-center gap-1 sm:gap-2 cursor-pointer
          hover:bg-gradient-to-r hover:from-blue-50 hover:to-pink-50 transform hover:scale-110 transition-transform`}
        style={{
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          WebkitTransformStyle: 'preserve-3d'
        }}
      >
        <span className="text-base sm:text-lg font-medium">{bubble.name}</span>
        {isFavorite && (
          <Sparkles size={14} className="sm:w-4 sm:h-4 text-yellow-400" />
        )}
        <Heart 
          size={16}
          className={`sm:w-5 sm:h-5 transition-colors ${
            isFavorite ? 'text-red-500' : 'text-gray-300'
          }`}
          fill={isFavorite ? 'currentColor' : 'none'}
        />
      </div>
    </div>
  );
}