import React, { useState, useCallback, useEffect } from 'react';
import { NameInput } from './components/NameInput';
import { ScrollingNames } from './components/ScrollingNames';
import { Favorites } from './components/Favorites';
import { AuthButton } from './components/AuthButton';
import { generateNames } from './utils/nameGenerator';
import { BookHeart, Globe } from 'lucide-react';
import { Gender, Language, NameConfig } from './types';
import { translations } from './utils/i18n';
import { auth } from './services/firebase';
import { useAuthState } from './hooks/useAuthState';
import { saveFavorites, getFavorites, subscribeFavorites } from './services/favoriteService';

function App() {
  const [config, setConfig] = useState<NameConfig>({
    lastName: '杨',
    gender: 'female',
    language: 'zh'
  });
  const [names, setNames] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const { user } = useAuthState(auth);

  const t = translations[config.language];

  useEffect(() => {
    if (user) {
      // Load favorites when user signs in
      getFavorites().then(savedFavorites => {
        setFavorites(new Set(savedFavorites));
      });

      // Subscribe to real-time updates
      const unsubscribe = subscribeFavorites(user.uid, (updatedFavorites) => {
        setFavorites(new Set(updatedFavorites));
      });

      return () => unsubscribe();
    } else {
      // Clear favorites when user signs out
      setFavorites(new Set());
    }
  }, [user]);

  const handleGenerate = useCallback(() => {
    if (config.lastName.trim()) {
      const newNames = generateNames(config);
      setNames(newNames);
    }
  }, [config]);

  useEffect(() => {
    const defaultLastName = config.language === 'zh' ? '杨' : 'Smith';
    setConfig(prev => ({ ...prev, lastName: defaultLastName }));
  }, [config.language]);

  useEffect(() => {
    handleGenerate();
  }, [config.gender, config.language, handleGenerate]);

  const handleAddToFavorites = useCallback((name: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(name)) {
        newFavorites.delete(name);
      } else {
        newFavorites.add(name);
      }
      
      if (user) {
        saveFavorites(Array.from(newFavorites));
      }
      
      return newFavorites;
    });
  }, [user]);

  const handleRemoveFavorite = useCallback((name: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      newFavorites.delete(name);
      
      if (user) {
        saveFavorites(Array.from(newFavorites));
      }
      
      return newFavorites;
    });
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-pink-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-end mb-4">
          <div className="flex items-center gap-4">
            <AuthButton language={config.language} />
            <button
              onClick={() => setConfig(prev => ({
                ...prev,
                language: prev.language === 'zh' ? 'en' : 'zh'
              }))}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm hover:shadow-md transition-all"
            >
              <Globe size={20} className="text-gray-600" />
              <span>{config.language === 'zh' ? 'English' : '中文'}</span>
            </button>
          </div>
        </div>

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

export default App;