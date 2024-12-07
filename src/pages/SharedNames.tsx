import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { BookHeart, Home, Share2 } from 'lucide-react';
import { decodeSharedNames } from '../utils/shareUtils';
import { translations } from '../utils/i18n';

export function SharedNames() {
  const { code } = useParams<{ code: string }>();
  const sharedData = code ? decodeSharedNames(code) : null;
  
  if (!sharedData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-pink-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-red-500 mb-4">Invalid share link</div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  const t = translations[sharedData.language];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-pink-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <BookHeart size={32} className="text-blue-500" />
            <h1 className="text-3xl font-bold text-gray-800">{t.sharedNames}</h1>
          </div>
          <p className="text-gray-600">{t.sharedDescription}</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Share2 className="w-5 h-5 text-blue-500" />
              <h2 className="text-xl font-semibold">{t.sharedNamesList}</h2>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {sharedData.names.map((name, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-blue-50 to-pink-50 p-4 rounded-lg text-center"
                >
                  <span className="text-lg font-medium">{name}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
              >
                <Home className="w-5 h-5" />
                {t.createYourOwn}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}