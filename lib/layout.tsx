import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { AccountButton } from '@/components/account';
import { Logo } from '@/components/logo';
import type { Viewer } from './access';

const homepageLink = {
  text: 'Zur Schulhomepage',
  url: 'https://goethe-gymnasium-stolberg.de',
  external: true,
} as const;

/** Gemeinsame Kopfleiste ohne Konto, z. B. für Seiten ohne Anmeldebezug. */
export const baseOptions: BaseLayoutProps = {
  nav: {
    title: <Logo />,
    url: '/',
  },
  links: [homepageLink],
};

/**
 * Kopfleiste der Startseite und der Anmeldeseite. Der Konto-Knopf sitzt am
 * Desktop rechts neben der Suche, auf dem Handy als Symbol direkt in der
 * Leiste, nicht versteckt im Aufklappmenü.
 */
export function homeOptions(viewer: Viewer | null): BaseLayoutProps {
  return {
    ...baseOptions,
    nav: {
      ...baseOptions.nav,
      children: (
        <div className="ggs-nav-account ms-auto lg:hidden">
          <AccountButton viewer={viewer} variant="icon" />
        </div>
      ),
    },
    links: [
      homepageLink,
      { type: 'custom', secondary: true, on: 'nav', children: <AccountButton viewer={viewer} /> },
    ],
  };
}
