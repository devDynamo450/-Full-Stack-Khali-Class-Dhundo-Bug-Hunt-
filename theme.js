// theme.js — Advantage-style design tokens (dark + bold red)
import { StyleSheet } from 'react-native';

export const COLORS = {
  // Core palette — mirrors the Advantage Fitness dark+red design
  black:      '#000000',
  charcoal:   '#1C1C1C',   // section backgrounds / cards
  darkGray:   '#2A2A2A',   // nav background
  medGray:    '#3D3D3D',   // card surfaces
  lightGray:  '#555555',   // borders
  red:        '#E8192C',   // primary accent / CTA red
  redDark:    '#C8102E',   // darker red for hover
  redDim:     '#E8192C22', // red tint
  white:      '#FFFFFF',
  offWhite:   '#F5F5F5',
  textMuted:  '#AAAAAA',
  textSub:    '#CCCCCC',
  text:       '#FFFFFF',
  gold:       '#F0A500',

  // Legacy aliases so existing components compile unchanged
  navyDark:   '#000000',
  navy:       '#1C1C1C',
  navyLight:  '#2A2A2A',
  surface:    '#1C1C1C',
  border:     '#333333',
  bg:         '#0a0a0a',
  accent:     '#E8192C',
  accentDim:  '#E8192C22',
  accentLight:'#FF4D5E',
  error:      '#E8192C',
};

export const BLOCK_COLORS = {
  'A-Block':      '#E8192C',
  'B-Block':      '#F0A500',
  'AI-Block':     '#00AAFF',
  'C-Block':      '#00C87A',
  'D-Block':      '#A855F7',
  'E-Block':      '#FF6B35',
  'Lab Block':    '#06B6D4',
  'Seminar Hall': '#F0A500',
};

export const TYPE_ICONS = {
  'Classroom':    '🏫',
  'Lecture Hall': '🎓',
  'Tutorial Room':'📖',
  'Lab':          '🔬',
  'Studio':       '🖥️',
  'Seminar Hall': '🏛️',
};

export const CANTEEN_EMOJIS = {
  'All':           '🏫',
  'Fusion Cafe':   '☕',
  'Chai Adda':     '🍵',
  'Maggie Point':  '🍜',
  'Le Broc':       '🥗',
};

export const CANTEENS = ['All', 'Fusion Cafe', 'Chai Adda', 'Maggie Point', 'Le Broc'];
