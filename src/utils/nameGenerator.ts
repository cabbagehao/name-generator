import { NameConfig } from '../types';
import { generateChineseName } from './chineseNameGenerator';
import { generateEnglishName } from './englishNameGenerator';
import { generateNamesFromWenxin } from '../services/wenxinApi';

const recentlyUsedNames = new Set<string>();
const MAX_RECENT_NAMES = 1000;
const MIN_NAMES_THRESHOLD = 10;
const FETCH_BATCH_SIZE = 30;

let nameCache: string[] = [];
let isFetchingNames = false;

function clearOldNames() {
  if (recentlyUsedNames.size > MAX_RECENT_NAMES) {
    const namesArray = Array.from(recentlyUsedNames);
    const newNames = namesArray.slice(-MAX_RECENT_NAMES / 2);
    recentlyUsedNames.clear();
    newNames.forEach(name => recentlyUsedNames.add(name));
  }
}

// Generate names locally first, then enhance with API results
async function fetchNewNames(config: NameConfig): Promise<void> {
  if (isFetchingNames || config.language !== 'zh') return;
  
  try {
    isFetchingNames = true;
    
    // Generate some names locally first
    const localNames = Array.from({ length: FETCH_BATCH_SIZE }, () => 
      generateChineseName(config.lastName, config.gender)
    );
    nameCache = [...nameCache, ...localNames];
    
    // Then fetch from API in the background
    const apiNames = await generateNamesFromWenxin(config.lastName, config.gender, FETCH_BATCH_SIZE);
    if (apiNames.length > 0) {
      nameCache = [...nameCache, ...apiNames];
    }
  } catch {
    // Silent catch - errors are handled in the API layer
  } finally {
    isFetchingNames = false;
  }
}

export function generateNames(config: NameConfig, count: number = 32): string[] {
  if (!config.lastName) return [];
  
  const names = new Set<string>();
  const maxAttempts = count * 4;
  let attempts = 0;
  
  // Use cached names first, then generate locally
  while (names.size < count && attempts < maxAttempts) {
    let name: string | undefined;
    
    if (nameCache.length > 0) {
      name = nameCache.shift();
    } else {
      name = config.language === 'zh' 
        ? generateChineseName(config.lastName, config.gender)
        : generateEnglishName(config.lastName, config.gender);
    }
    
    if (name && name !== config.lastName && !recentlyUsedNames.has(name)) {
      names.add(name);
      recentlyUsedNames.add(name);
    }
    attempts++;
  }
  
  clearOldNames();
  
  // Trigger background fetch if cache is running low
  if (config.language === 'zh' && nameCache.length < MIN_NAMES_THRESHOLD) {
    void fetchNewNames(config);
  }
  
  return Array.from(names);
}

export function generateNewName(config: NameConfig): string {
  if (!config.lastName) return '';
  
  const maxAttempts = 50;
  let attempts = 0;
  let name = '';
  
  while (attempts < maxAttempts) {
    if (nameCache.length > 0) {
      name = nameCache.shift() || '';
    } else {
      name = config.language === 'zh'
        ? generateChineseName(config.lastName, config.gender)
        : generateEnglishName(config.lastName, config.gender);
    }
    
    if (name && name !== config.lastName && !recentlyUsedNames.has(name)) {
      recentlyUsedNames.add(name);
      clearOldNames();
      break;
    }
    attempts++;
  }
  
  // Trigger background fetch if cache is running low
  if (config.language === 'zh' && nameCache.length < MIN_NAMES_THRESHOLD) {
    void fetchNewNames(config);
  }
  
  return name || generateChineseName(config.lastName, config.gender);
}