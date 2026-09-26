import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { Logo } from '@/components/logo';

/** Gemeinsame Kopfleiste für Portal-Startseite und Doku-Seiten. */
export const baseOptions: BaseLayoutProps = {
  nav: {
    title: <Logo />,
    url: '/',
  },
  links: [
    {
      text: 'Zur Schulhomepage',
      url: 'https://goethe-gymnasium-stolberg.de',
      external: true,
    },
  ],
};
