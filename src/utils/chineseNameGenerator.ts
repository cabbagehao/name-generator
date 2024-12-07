import { Gender } from '../types';
import { femaleFirstCharacters, femaleSecondCharacters, maleFirstCharacters, maleSecondCharacters } from '../data/chineseNameData';

export function generateChineseName(lastName: string, gender: Gender): string {
  if (!lastName) return '';
  
  const firstCharacters = gender === 'female' ? femaleFirstCharacters : maleFirstCharacters;
  const secondCharacters = gender === 'female' ? femaleSecondCharacters : maleSecondCharacters;
  
  if (!firstCharacters.length || !secondCharacters.length) return lastName;
  
  // Randomly decide between single or double character name with equal probability
  const nameLength = Math.random() < 0.5 ? 1 : 2;
  
  let name = lastName;
  
  // Add first character
  const firstChar = firstCharacters[Math.floor(Math.random() * firstCharacters.length)];
  if (firstChar) name += firstChar;
  
  // Add second character if needed
  if (nameLength === 2) {
    const secondChar = secondCharacters[Math.floor(Math.random() * secondCharacters.length)];
    if (secondChar) name += secondChar;
  }

  console.log(name);
  return name;
}