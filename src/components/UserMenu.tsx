import React, { useState, useRef, useEffect } from 'react';
import { User, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { auth } from '../services/firebase';
import { useAuthState } from '../hooks/useAuthState';
import { translations } from '../utils/i18n';
import { Language } from '../types';

interface UserMenuProps {
  language: Language;
}

export function UserMenu({ language }: UserMenuProps) {
  const { user } = useAuthState(auth);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const t = translations[language];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm hover:shadow-md transition-all"
      >
        <User size={20} className="text-gray-600" />
        <span className="max-w-[150px] truncate">{user.displayName || user.email}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
          <Link
            to="/profile"
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <Settings size={16} />
            <span>{t.profile}</span>
          </Link>
        </div>
      )}
    </div>
  );
}