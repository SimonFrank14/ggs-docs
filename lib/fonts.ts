import { Bricolage_Grotesque, Figtree, JetBrains_Mono } from 'next/font/google';

// next/font lädt die Schriften zur Build-Zeit und liefert sie selbst aus.
// Zur Laufzeit geht keine Anfrage an Google (Doku-Spec §6.2).

export const figtree = Figtree({
  subsets: ['latin'],
  variable: '--font-ggs-sans',
  display: 'swap',
});

export const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-ggs-display',
  display: 'swap',
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-ggs-mono',
  display: 'swap',
});
