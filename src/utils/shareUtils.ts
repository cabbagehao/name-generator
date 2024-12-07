import { SharedNames } from '../types';

function encodeUnicode(str: string): string {
  return encodeURIComponent(str).replace(/%/g, '_');
}

function decodeUnicode(str: string): string {
  return decodeURIComponent(str.replace(/_/g, '%'));
}

export function encodeSharedNames(names: string[], language: string): string {
  const sharedData: SharedNames = {
    names,
    language: language as 'en' | 'zh',
    timestamp: Date.now()
  };
  
  return encodeUnicode(JSON.stringify(sharedData));
}

export function decodeSharedNames(encoded: string): SharedNames | null {
  try {
    const decoded = JSON.parse(decodeUnicode(encoded));
    if (decoded && Array.isArray(decoded.names)) {
      return decoded as SharedNames;
    }
    return null;
  } catch {
    return null;
  }
}