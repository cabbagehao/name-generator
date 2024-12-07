import { Gender } from '../types';
import { femaleFirstNames, maleFirstNames } from '../data/englishNameData';

export function generateEnglishName(lastName: string, gender: Gender): string {
  if (!lastName) return '';
  
  const firstNames = gender === 'female' ? femaleFirstNames : maleFirstNames;
  
  if (!firstNames.length) return lastName;
  
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  return firstName ? `${firstName} ${lastName}` : lastName;
}