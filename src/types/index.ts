export type Gender = 'female' | 'male';
export type Language = 'en' | 'zh';

export interface NameConfig {
  lastName: string;
  gender: Gender;
  language: Language;
}

export interface NameBubble {
  id: string;
  name: string;
  x: number;
  y: number;
  speed: number;
  delay: number;
}

export interface SharedNames {
  names: string[];
  language: Language;
  timestamp: number;
}