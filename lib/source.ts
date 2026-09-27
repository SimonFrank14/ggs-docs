import { loader } from 'fumadocs-core/source';
import { icons } from 'lucide-react';
import { createElement } from 'react';
import { docs } from '@/.source';
import { canAccess, filterTree, type Viewer } from './access';
import { sortTreeByOrder } from './tree-order';

// fumadocs-mdx 11.10.1 widerspricht sich zwischen Laufzeit und Typdeklaration:
// - Laufzeit (node_modules/fumadocs-mdx/dist/chunk-UOOPSLFY.js:45-51,
//   createMDXSource): `files` ist eine Funktion, die die Datei-Liste erzeugt.
// - Typdeklaration (node_modules/fumadocs-core/dist/builder-5BHIAfCi.d.ts:146-147,
//   interface Source): `files` sei bereits ein Array.
// Wir folgen der Laufzeit (sonst erhält `loader` eine Funktion statt eines
// Arrays und stürzt beim internen `.map()` ab) und casten nur an dieser einen
// Stelle, um den daraus entstehenden Typkonflikt aufzulösen.
type FumadocsSource = ReturnType<typeof docs.toFumadocsSource>;
const rawSource = docs.toFumadocsSource() as unknown as {
  files: () => FumadocsSource['files'];
};

export const docsSource = loader({
  baseUrl: '/',
  // `icon` in meta.json oder Frontmatter nennt ein Lucide-Icon, z. B. "Wifi"
  icon(name) {
    if (name && name in icons) return createElement(icons[name as keyof typeof icons]);
  },
  source: {
    files: rawSource.files(),
  },
});

export type DocsPage = ReturnType<typeof docsSource.getPages>[number];

/** Alle Seiten, die `viewer` sehen darf. Einziger Weg an die Seitenliste für Ausgaben. */
export function visiblePages(viewer: Viewer | null): DocsPage[] {
  return docsSource.getPages().filter((page) => canAccess(page.data, viewer));
}

/** Der Navigationsbaum, gefiltert auf die Seiten, die `viewer` sehen darf. */
export function visibleTree(viewer: Viewer | null) {
  const pages = visiblePages(viewer);
  const urls = new Set(pages.map((page) => page.url));
  const order = new Map(pages.map((page) => [page.url, page.data.order]));
  return sortTreeByOrder(
    filterTree(docsSource.pageTree, (url) => urls.has(url)),
    (url) => order.get(url),
  );
}
