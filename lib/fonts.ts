import { Roboto, Roboto_Slab, Montserrat } from 'next/font/google';

export const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-ggs-sans',
  display: 'swap',
});

export const robotoSlab = Roboto_Slab({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-ggs-serif',
  display: 'swap',
});

export const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['600'],
  variable: '--font-ggs-nav',
  display: 'swap',
});
