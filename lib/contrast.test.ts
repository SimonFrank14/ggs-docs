import { describe, expect, it } from 'vitest';
import { contrastRatio } from './contrast';

const WHITE = '#ffffff';

describe('contrastRatio', () => {
  it('berechnet den Maximalkontrast Schwarz auf Weiß', () => {
    expect(contrastRatio('#000000', WHITE)).toBeCloseTo(21, 1);
  });

  it('ist symmetrisch', () => {
    expect(contrastRatio('#D2A500', WHITE)).toBeCloseTo(contrastRatio(WHITE, '#D2A500'), 5);
  });
});

describe('GGS-Farbtokens gegen WCAG AA', () => {
  it('belegt, dass die Markenfarben als Textfarbe durchfallen', () => {
    expect(contrastRatio('#D2A500', WHITE)).toBeLessThan(4.5);
    expect(contrastRatio('#FDD700', WHITE)).toBeLessThan(4.5);
  });

  it('erfüllt mit der abgeleiteten Linkfarbe AA für Fließtext', () => {
    expect(contrastRatio('#8A6A00', WHITE)).toBeGreaterThanOrEqual(4.5);
  });

  it('erfüllt mit der Fließtextfarbe AA', () => {
    expect(contrastRatio('#626262', WHITE)).toBeGreaterThanOrEqual(4.5);
  });
});
