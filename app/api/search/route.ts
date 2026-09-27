import { createSearchAPI } from 'fumadocs-core/search/server';
import type { Viewer } from '@/lib/access';
import { visiblePages } from '@/lib/source';
import { getViewer } from '@/lib/viewer';

type SearchAPI = ReturnType<typeof createSearchAPI>;

/**
 * Ein Suchindex je Rollenkombination, beim ersten Bedarf gebaut. So findet
 * jede Person genau die Seiten, die sie auch öffnen darf (Doku-Spec §3.5),
 * und Anonyme bekommen denselben Index wie bisher.
 */
const indexes = new Map<string, SearchAPI>();

function searchFor(viewer: Viewer | null): SearchAPI {
  const key = viewer ? [...viewer.roles].sort().join(',') || '-' : 'anonym';
  let api = indexes.get(key);
  if (!api) {
    api = createSearchAPI('advanced', {
      language: 'german',
      indexes: visiblePages(viewer).map((page) => ({
        id: page.url,
        url: page.url,
        title: page.data.title,
        description: page.data.description,
        structuredData: page.data.structuredData,
      })),
    });
    indexes.set(key, api);
  }
  return api;
}

export async function GET(request: Request): Promise<Response> {
  return searchFor(await getViewer()).GET(request);
}
