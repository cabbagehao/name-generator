import React from 'react';
import { Play, Pause, Maximize2, Minimize2 } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../utils/i18n';

interface ControlsProps {
  isPaused: boolean;
  isFullscreen: boolean;
  totalDisplayed: number;
  favoritesCount: number;
  onPauseToggle: () => void;
  onFullscreenToggle: () => void;
  language: Language;
}

export function Controls({
  isPaused,
  isFullscreen,
  totalDisplayed,
  favoritesCount,
  onPauseToggle,
  onFullscreenToggle,
  language
}: ControlsProps) {
  const t = translations[language];

  return (
    <div className={`flex justify-between items-center mb-4 ${isFullscreen ? 'absolute top-4 right-4 z-10 mb-0' : ''}`}>
      <div className="flex items-center gap-2 sm:gap-4">
        <button
          onClick={onPauseToggle}
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
            <span>{t.favorites}: {favoritesCount}</span>
          </div>
        )}
        {isFullscreen && (
          <div className="text-xs sm:text-sm text-white bg-black/50 px-2 sm:px-3 py-1 rounded-full">
            {t.favorites}: {favoritesCount}
          </div>
        )}
      </div>
      <button
        onClick={onFullscreenToggle}
        className="ml-2 sm:ml-4 p-1.5 sm:p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow"
      >
        {isFullscreen ? (
          <Minimize2 size={16} className="sm:w-5 sm:h-5 text-gray-600" />
        ) : (
          <Maximize2 size={16} className="sm:w-5 sm:h-5 text-gray-600" />
        )}
      </button>
    </div>
  );
}