import React, { useState } from 'react';
import { X } from 'lucide-react';
import { SignUpData, SignInData, signUp, signIn, signInWithGoogle } from '../../services/authService';
import { Language } from '../../types';
import { translations } from '../../utils/i18n';
import { AuthForm } from './AuthForm';
import { GoogleSignInButton } from './GoogleSignInButton';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export function AuthModal({ isOpen, onClose, language }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });

  const t = translations[language];

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        await signUp(formData as SignUpData);
      } else {
        await signIn(formData as SignInData);
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      setLoading(true);
      await signInWithGoogle();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {isSignUp ? t.signUp : t.signIn}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <AuthForm
          isSignUp={isSignUp}
          loading={loading}
          error={error}
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          language={language}
        />

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              {t.or}
            </span>
          </div>
        </div>

        <GoogleSignInButton
          onClick={handleGoogleSignIn}
          disabled={loading}
          language={language}
        />

        <div className="mt-4 text-center text-sm">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-blue-500 hover:text-blue-600"
          >
            {isSignUp ? t.alreadyHaveAccount : t.needAccount}
          </button>
        </div>
      </div>
    </div>
  );
}