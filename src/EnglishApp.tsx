import React, { useState, useCallback, useEffect } from 'react';
import { NameInput } from './components/NameInput';
import { ScrollingNames } from './components/ScrollingNames';
import { Favorites } from './components/Favorites';
import { generateNames } from './utils/nameGenerator';
import { BookHeart, Globe } from 'lucide-react';
import { Gender, NameConfig } from './types';
import { translations } from './utils/i18n';

function EnglishApp() {
  const [config, setConfig] = useState<NameConfig>({
    lastName: 'Smith',
    gender: 'female',
    language: 'en'
  });
  const [names, setNames] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const t = translations[config.language];

  const handleGenerate = useCallback(() => {
    if (config.lastName.trim()) {
      const newNames = generateNames(config);
      setNames(newNames);
    }
  }, [config]);

  useEffect(() => {
    handleGenerate();
  }, [config.gender, handleGenerate]);

  const handleAddToFavorites = useCallback((name: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(name)) {
        newFavorites.delete(name);
      } else {
        newFavorites.add(name);
      }
      return newFavorites;
    });
  }, []);

  const handleRemoveFavorite = useCallback((name: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      newFavorites.delete(name);
      return newFavorites;
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-pink-50">
      <div className="absolute top-4 right-4">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm hover:shadow-md transition-all"
        >
          <Globe size={20} className="text-gray-600" />
          <span>中文</span>
        </a>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BookHeart size={32} className="text-blue-500" />
            <h1 className="text-3xl font-bold text-gray-800">{t.title}</h1>
          </div>
          <p className="text-gray-600">{t.subtitle}</p>
        </div>

        <div className="flex flex-col items-center gap-8">
          <NameInput
            lastName={config.lastName}
            gender={config.gender}
            language={config.language}
            onLastNameChange={(lastName) => setConfig(prev => ({ ...prev, lastName }))}
            onGenderChange={(gender: Gender) => setConfig(prev => ({ ...prev, gender }))}
            onGenerate={handleGenerate}
          />

          {names.length > 0 && (
            <ScrollingNames
              names={names}
              onAddToFavorites={handleAddToFavorites}
              favorites={favorites}
              language={config.language}
              config={config}
            />
          )}

          <Favorites
            favorites={Array.from(favorites)}
            onRemove={handleRemoveFavorite}
            language={config.language}
          />
        </div>
      </div>
    </div>
  );
}

export default EnglishApp;