import React, { useState, useCallback } from 'react';
import { Copy, X, Share2, Home, BookHeart } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../utils/i18n';
import { encodeSharedNames } from '../utils/shareUtils';

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  names: string[];
  language: Language;
}

export function ShareDialog({ isOpen, onClose, names, language }: ShareDialogProps) {
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const t = translations[language];

  const shareUrl = `${window.location.origin}/shared/${encodeSharedNames(names, language)}`;

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [shareUrl]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            {t.shareNames}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-2">{t.shareDescription}</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="flex-1 p-2 border rounded bg-gray-50 text-sm"
            />
            <button
              onClick={handleCopy}
              className={`px-4 py-2 rounded ${
                copied
                  ? 'bg-green-500 text-white'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              } transition-colors flex items-center gap-2`}
            >
              <Copy className="w-4 h-4" />
              {copied ? t.copied : t.copy}
            </button>
          </div>
        </div>

        <div className="border-t pt-6">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="mb-4 text-blue-500 hover:text-blue-600 flex items-center gap-2"
          >
            <span>{showPreview ? t.hidePreview : t.showPreview}</span>
          </button>

          {showPreview && (
            <div className="bg-gray-50 rounded-lg p-6 border">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <BookHeart size={32} className="text-blue-500" />
                    <h1 className="text-3xl font-bold text-gray-800">{t.sharedNames}</h1>
                  </div>
                  <p className="text-gray-600">{t.sharedDescription}</p>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Share2 className="w-5 h-5 text-blue-500" />
                    <h2 className="text-xl font-semibold">{t.sharedNamesList}</h2>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {names.map((name, index) => (
                      <div
                        key={index}
                        className="bg-gradient-to-r from-blue-50 to-pink-50 p-4 rounded-lg text-center"
                      >
                        <span className="text-lg font-medium">{name}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 text-center">
                    <button
                      className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                    >
                      <Home className="w-5 h-5" />
                      {t.createYourOwn}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="text-sm text-gray-500 mt-4">
            {t.shareNote}
          </div>
        </div>
      </div>
    </div>
  );
}