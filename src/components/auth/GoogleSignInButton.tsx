import React from 'react';
import { Language } from '../../types';
import { translations } from '../../utils/i18n';

interface GoogleSignInButtonProps {
  onClick: () => void;
  disabled: boolean;
  language: Language;
}

export function GoogleSignInButton({ onClick, disabled, language }: GoogleSignInButtonProps) {
  const t = translations[language];

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="w-full py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
    >
      <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
      {t.continueWithGoogle}
    </button>
  );
}