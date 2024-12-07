import { useCallback, useRef } from 'react';
import { NameConfig } from '../types';
import { generateNewName } from '../utils/nameGenerator';

export function useNameGeneration(config: NameConfig) {
  const displayedNamesRef = useRef<Set<string>>(new Set());

  const createNewName = useCallback(() => {
    const newName = generateNewName(config);
    if (!newName) return null;
    return newName;
  }, [config]);

  const trackDisplayedName = useCallback((name: string) => {
    if (!displayedNamesRef.current.has(name)) {
      displayedNamesRef.current.add(name);
      return true;
    }
    return false;
  }, []);

  const clearDisplayedNames = useCallback(() => {
    displayedNamesRef.current.clear();
  }, []);

  return {
    createNewName,
    trackDisplayedName,
    clearDisplayedNames,
    displayedNamesRef
  };
}