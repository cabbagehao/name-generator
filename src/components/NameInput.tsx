import React from 'react';
import { Search } from 'lucide-react';
import { Gender, Language } from '../types';
import { translations } from '../utils/i18n';

interface NameInputProps {
  lastName: string;
  gender: Gender;
  language: Language;
  onLastNameChange: (value: string) => void;
  onGenderChange: (value: Gender) => void;
  onGenerate: () => void;
}

export function NameInput({
  lastName,
  gender,
  language,
  onLastNameChange,
  onGenderChange,
  onGenerate
}: NameInputProps) {
  const t = translations[language];

  return (
    <div className="w-full max-w-md space-y-4">
      <div className="relative">
        <input
          type="text"
          value={lastName}
          onChange={(e) => onLastNameChange(e.target.value)}
          placeholder={t.inputPlaceholder}
          className="w-full px-4 py-2 sm:py-3 text-base sm:text-lg border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={onGenerate}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 sm:p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors transform hover:scale-105 active:scale-95"
        >
          <Search size={18} className="sm:w-5 sm:h-5" />
        </button>
      </div>
      
      <div className="flex justify-center gap-2 sm:gap-4">
        <button
          onClick={() => onGenderChange('female')}
          className={`px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-sm sm:text-base transition-all transform hover:scale-105 active:scale-95 ${
            gender === 'female'
              ? 'bg-pink-500 text-white shadow-lg'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {t.femaleNames}
        </button>
        <button
          onClick={() => onGenderChange('male')}
          className={`px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-sm sm:text-base transition-all transform hover:scale-105 active:scale-95 ${
            gender === 'male'
              ? 'bg-blue-500 text-white shadow-lg'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {t.maleNames}
        </button>
      </div>
    </div>
  );
}