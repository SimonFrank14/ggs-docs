import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { Logo } from '@/components/logo';
import type { Viewer } from './access';

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

/** Kopfleiste mit Anmelden bzw. Abmelden, je nachdem, wer die Seite ansieht. */
export function layoutOptions(viewer: Viewer | null): BaseLayoutProps {
  return {
    ...baseOptions,
    links: [
      ...(baseOptions.links ?? []),
      viewer
        ? { text: viewer.name ? `Abmelden (${viewer.name})` : 'Abmelden', url: '/anmelden' }
        : { text: 'Anmelden', url: '/anmelden' },
    ],
  };
}
