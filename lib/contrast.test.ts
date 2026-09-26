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

// Paarungen aus app/global.css, Farbkonzept „Textmarker" (Runbook-Spec §9.2)
const pairs: Array<[string, string, string]> = [
  // Hellmodus
  ['Überschrift/Link (Tinte) auf Papier', '#1C2430', '#FBFAF6'],
  ['Fließtext auf Papier', '#3D4654', '#FBFAF6'],
  ['gedämpfter Text auf Papier', '#5B6472', '#FBFAF6'],
  ['gedämpfter Text auf Muted', '#5B6472', '#F2F0E8'],
  ['Tinte auf aktivem Eintrag (Gold soft)', '#1C2430', '#FFF4B8'],
  ['Tinte auf Gold (Logo, Pfeil)', '#1C2430', '#FDD700'],
  ['Gold auf Tinte (Primär-Button)', '#FDD700', '#1C2430'],
  // Dunkelmodus
  ['Überschrift auf Dunkel', '#F3F1EA', '#12151B'],
  ['Fließtext auf Dunkel', '#C9CCD3', '#12151B'],
  ['gedämpfter Text auf Dunkel', '#A3A9B4', '#12151B'],
  ['gedämpfter Text auf Dunkel-Muted', '#A3A9B4', '#1A1E26'],
  ['Gold als Primärfarbe auf Dunkel', '#FDD700', '#12151B'],
  ['Dunkel auf Gold (Primär-Button)', '#12151B', '#FDD700'],
  ['Überschrift auf aktivem Eintrag (Dunkel)', '#F3F1EA', '#3A3208'],
];

describe('GGS-Farbtokens gegen WCAG AA', () => {
  it.each(pairs)('%s', (_name, fg, bg) => {
    expect(contrastRatio(fg, bg)).toBeGreaterThanOrEqual(AA);
  });
});
