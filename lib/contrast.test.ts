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

describe('GGS-Farbtokens im Dunkelmodus gegen WCAG AA', () => {
  // Fumadocs-Dunkelhintergrund, aus node_modules/fumadocs-ui/dist/style.css,
  // .dark { --color-fd-background: hsl(0, 0%, 7.04%) } ≈ #121212.
  const DARK_BG = '#121212';

  it('belegt, dass die Hellmodus-Linkfarbe im Dunkelmodus AA verfehlt', () => {
    expect(contrastRatio('#8A6A00', DARK_BG)).toBeLessThan(4.5);
  });

  it('erfüllt mit der helleren Dunkelmodus-Goldvariante AA für Fließtext', () => {
    expect(contrastRatio('#A37E00', DARK_BG)).toBeGreaterThanOrEqual(4.5);
  });

  it('belegt, dass Weiß auf der Dunkelmodus-Goldvariante als Textfarbe AA verfehlt', () => {
    expect(contrastRatio(WHITE, '#A37E00')).toBeLessThan(4.5);
  });

  it('erfüllt mit dunklem Vordergrund auf der Dunkelmodus-Goldvariante AA', () => {
    expect(contrastRatio('#171717', '#A37E00')).toBeGreaterThanOrEqual(4.5);
  });
});
