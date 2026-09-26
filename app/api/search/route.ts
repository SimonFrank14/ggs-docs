import { createSearchAPI } from 'fumadocs-core/search/server';
import { visiblePages } from '@/lib/source';

/**
 * Der Suchindex wird einmal beim Start gebaut und ist für alle Anfragen gleich.
 * Er enthält deshalb ausschließlich Seiten, die auch anonym sichtbar sind.
 * Rollenabhängige Indizes kommen mit dem Login (Doku-Spec Phase 2).
 */
export const { GET } = createSearchAPI('advanced', {
  language: 'german',
  indexes: visiblePages(null).map((page) => ({
    id: page.url,
    url: page.url,
    title: page.data.title,
    description: page.data.description,
    structuredData: page.data.structuredData,
  })),
});
