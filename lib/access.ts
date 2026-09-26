import type * as PageTree from 'fumadocs-core/page-tree';
import { isDocRole, type DocRole } from './roles';

/**
 * Wer eine Seite ansieht. `null` heißt anonym und hat genau die Rolle `public`.
 */
export interface Viewer {
  roles: readonly DocRole[];
}

export interface PageAccessMeta {
  roles?: readonly string[] | null;
}

/**
 * Die einzige Stelle, die über Sichtbarkeit entscheidet (Doku-Spec §3.2).
 *
 * - Fehlt `roles` oder ist es leer, gilt die Seite als nur für `admin` sichtbar (fail-closed).
 * - Unbekannte Rollenwerte zählen nicht; bleibt keine gültige übrig, gilt wieder nur `admin`.
 * - `public` heißt für alle sichtbar, auch für Angemeldete.
 * - `admin` sieht alles. Darüber hinaus additiv ohne Hierarchie.
 */
export function canAccess(page: PageAccessMeta, viewer: Viewer | null): boolean {
  const declared = (page.roles ?? []).filter(isDocRole);
  const required: readonly DocRole[] = declared.length > 0 ? declared : ['admin'];

  const held = new Set<DocRole>(['public', ...(viewer?.roles ?? [])]);
  if (held.has('admin')) return true;

  return required.some((role) => held.has(role));
}

/**
 * Filtert den Navigationsbaum auf die Seiten, die `isVisible` zulässt.
 * Ordner ohne sichtbaren Inhalt und ohne sichtbare Indexseite verschwinden,
 * ebenso Trenner, auf die nichts Sichtbares mehr folgt.
 */
export function filterTree(
  tree: PageTree.Root,
  isVisible: (url: string) => boolean,
): PageTree.Root {
  return { ...tree, children: filterNodes(tree.children, isVisible) };
}

function filterNodes(
  nodes: PageTree.Node[],
  isVisible: (url: string) => boolean,
): PageTree.Node[] {
  const result: PageTree.Node[] = [];

  for (const node of nodes) {
    if (node.type === 'page') {
      if (isVisible(node.url)) result.push(node);
      continue;
    }

    if (node.type === 'folder') {
      const children = filterNodes(node.children, isVisible);
      const index = node.index && isVisible(node.index.url) ? node.index : undefined;
      if (children.length > 0 || index) result.push({ ...node, children, index });
      continue;
    }

    result.push(node);
  }

  // Trenner ohne nachfolgenden Inhalt entfernen
  return result.filter(
    (node, i) =>
      node.type !== 'separator' ||
      result.slice(i + 1).some((next) => next.type !== 'separator'),
  );
}
