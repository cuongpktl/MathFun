import React from 'react';

export interface MathProblem {
  id: string;
  type: 'word' | 'vertical' | 'expression' | 'find100' | 'fill_blank' | 'measurement' | 'geometry';
  question?: string;
  numbers?: number[];
  operators?: string[];
  answer: number;
  userAnswer?: string;
  isCorrect?: boolean;
  options?: number[]; // For finding games
  
  // Specific for measurement
  unit?: string; // 'kg' or 'l'
  visualType?: 'calc' | 'balance' | 'spring' | 'beaker' | 'identify_shape' | 'path_length';
  visualData?: any; // Holds weights, liquid level, shapes, or path data
}

export interface TabItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
}

export enum GameState {
  PLAYING,
  CHECKED,
}