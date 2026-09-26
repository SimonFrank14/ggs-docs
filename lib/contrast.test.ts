import { describe, expect, it } from 'vitest';
import { contrastRatio } from './contrast';

const WHITE = '#ffffff';
const AA = 4.5;

describe('contrastRatio', () => {
  it('berechnet den Maximalkontrast Schwarz auf Weiß', () => {
    expect(contrastRatio('#000000', WHITE)).toBeCloseTo(21, 1);
  });

  it('ist symmetrisch', () => {
    expect(contrastRatio('#D2A500', WHITE)).toBeCloseTo(contrastRatio(WHITE, '#D2A500'), 5);
  });
});

describe('Warum Gold keine Textfarbe ist', () => {
  it('belegt, dass die Markenfarben als Textfarbe auf Weiß durchfallen', () => {
    expect(contrastRatio('#D2A500', WHITE)).toBeLessThan(AA);
    expect(contrastRatio('#FDD700', WHITE)).toBeLessThan(AA);
  });
});

// Paarungen aus app/global.css (Runbook-Spec §9)
const pairs: Array<[string, string, string]> = [
  // Hellmodus
  ['Überschrift/Link auf Weiß', '#333333', '#FFFFFF'],
  ['Fließtext auf Weiß', '#4D4D4D', '#FFFFFF'],
  ['gedämpfter Text auf Weiß', '#626262', '#FFFFFF'],
  ['gedämpfter Text auf Muted', '#626262', '#F4F4F4'],
  ['Überschrift auf aktivem Eintrag (Gold soft)', '#333333', '#FFF5BF'],
  ['Hero: Überschrift auf Gold', '#333333', '#FDD700'],
  ['Chip: Überschrift auf Weiß 70 % über Gold', '#333333', '#FEF3B3'],
  ['Gold auf Überschriftfarbe (Primär-Button)', '#FDD700', '#333333'],
  // Dunkelmodus
  ['Überschrift auf Dunkel', '#F3F1EA', '#12151B'],
  ['Fließtext auf Dunkel', '#C9CCD3', '#12151B'],
  ['gedämpfter Text auf Dunkel', '#A3A9B4', '#12151B'],
  ['gedämpfter Text auf Dunkel-Muted', '#A3A9B4', '#1A1E26'],
  ['Hero-Überschrift auf Dunkel-Hero', '#F3F1EA', '#1A1E26'],
  ['Gold als Primärfarbe auf Dunkel', '#FDD700', '#12151B'],
  ['Dunkel auf Gold (Primär-Button)', '#12151B', '#FDD700'],
  ['Überschrift auf aktivem Eintrag (Dunkel)', '#F3F1EA', '#3A3208'],
];

describe('GGS-Farbtokens gegen WCAG AA', () => {
  it.each(pairs)('%s', (_name, fg, bg) => {
    expect(contrastRatio(fg, bg)).toBeGreaterThanOrEqual(AA);
  });
});
