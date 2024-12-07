import React, { useState } from 'react';
import { X, Star, Share2 } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../utils/i18n';
import { ShareDialog } from './ShareDialog';

interface FavoritesProps {
  favorites: string[];
  onRemove: (name: string) => void;
  language: Language;
}

export function Favorites({ favorites, onRemove, language }: FavoritesProps) {
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const t = translations[language];

  if (favorites.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-4 p-4 sm:p-8 bg-white rounded-lg shadow-sm">
        <Star className="mx-auto mb-4 text-yellow-400 w-6 h-6 sm:w-8 sm:h-8" />
        <p className="text-sm sm:text-base">{t.noFavorites}</p>
        <p className="text-xs sm:text-sm mt-2">{t.addToFavorites}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Star className="text-yellow-400 w-5 h-5 sm:w-6 sm:h-6" />
          <h2 className="text-lg sm:text-xl font-semibold">{t.myFavorites}</h2>
          <span className="text-xs sm:text-sm text-gray-500">({favorites.length})</span>
        </div>
        
        <button
          onClick={() => setIsShareDialogOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
        >
          <Share2 className="w-4 h-4" />
          <span>{t.share}</span>
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-4">
        {favorites.map((name) => (
          <div
            key={name}
            className="name-card bg-gradient-to-r from-blue-50 to-pink-50 p-3 sm:p-4 rounded-lg shadow-md flex items-center justify-between"
          >
            <span className="text-base sm:text-lg font-medium">{name}</span>
            <button
              onClick={() => onRemove(name)}
              className="p-1 sm:p-1.5 bg-white text-gray-400 hover:text-red-500 rounded-full transition-all hover:scale-110 active:scale-95"
            >
              <X size={16} className="sm:w-[18px] sm:h-[18px]" />
            </button>
          </div>
        ))}
      </div>

      <ShareDialog
        isOpen={isShareDialogOpen}
        onClose={() => setIsShareDialogOpen(false)}
        names={favorites}
        language={language}
      />
    </div>
  );
}