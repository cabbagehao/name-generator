import React, { useState } from 'react';
import { LogIn, LogOut } from 'lucide-react';
import { signOutUser } from '../services/authService';
import { auth } from '../services/firebase';
import { useAuthState } from '../hooks/useAuthState';
import { translations } from '../utils/i18n';
import { Language } from '../types';
import { AuthModal } from './auth/AuthModal';
import { UserMenu } from './UserMenu';

interface AuthButtonProps {
  language: Language;
}

export function AuthButton({ language }: AuthButtonProps) {
  const { user, loading } = useAuthState(auth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const t = translations[language];

  const handleSignOut = async () => {
    await signOutUser();
  };

  if (loading) {
    return (
      <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-gray-400 cursor-wait">
        <span>{t.loading}</span>
      </button>
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <UserMenu language={language} />
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm hover:shadow-md transition-all"
        >
          <LogOut size={20} className="text-gray-600" />
          <span>{t.signOut}</span>
        </button>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm hover:shadow-md transition-all"
        title={t.signInPrompt}
      >
        <LogIn size={20} className="text-gray-600" />
        <span>{t.signIn}</span>
      </button>

      <AuthModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        language={language}
      />
    </>
  );
}