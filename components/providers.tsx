'use client';

import { RootProvider } from 'fumadocs-ui/provider';
import type { ReactNode } from 'react';

const translations = {
  search: 'Suchen',
  searchNoResult: 'Keine Treffer',
  toc: 'Auf dieser Seite',
  tocNoHeadings: 'Keine Überschriften',
  lastUpdate: 'Zuletzt aktualisiert am',
  chooseLanguage: 'Sprache wählen',
  nextPage: 'Nächste Seite',
  previousPage: 'Vorherige Seite',
  chooseTheme: 'Darstellung',
  editOnGithub: 'Auf GitHub bearbeiten',
};

export function Providers({ children }: { children: ReactNode }) {
  return <RootProvider i18n={{ locale: 'de', translations }}>{children}</RootProvider>;
}
