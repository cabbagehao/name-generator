import React from 'react';
import { Language } from '../../types';
import { translations } from '../../utils/i18n';

interface AuthFormProps {
  isSignUp: boolean;
  loading: boolean;
  error: string;
  formData: {
    email: string;
    password: string;
    name: string;
  };
  onChange: (field: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  language: Language;
}

export function AuthForm({ 
  isSignUp, 
  loading, 
  error, 
  formData, 
  onChange, 
  onSubmit,
  language 
}: AuthFormProps) {
  const t = translations[language];

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {isSignUp && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t.name}
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => onChange('name', e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t.email}
        </label>
        <input
          type="email"
          required
          value={formData.email}
          onChange={(e) => onChange('email', e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t.password}
        </label>
        <input
          type="password"
          required
          minLength={6}
          value={formData.password}
          onChange={(e) => onChange('password', e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
      >
        {loading ? t.loading : (isSignUp ? t.signUp : t.signIn)}
      </button>
    </form>
  );
}