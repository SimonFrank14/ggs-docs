import { Montserrat, Roboto, Roboto_Mono } from 'next/font/google';

// Schriften der Schulhomepage (Doku-Spec §6.1). next/font lädt sie zur
// Build-Zeit und liefert sie selbst aus; zur Laufzeit geht keine Anfrage an Google.

export const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-ggs-sans',
  display: 'swap',
});

export const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-ggs-display',
  display: 'swap',
});

export const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  variable: '--font-ggs-mono',
  display: 'swap',
});
