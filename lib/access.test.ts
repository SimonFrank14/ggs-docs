import { describe, expect, it } from 'vitest';
import type * as PageTree from 'fumadocs-core/page-tree';
import { canAccess, filterTree, type Viewer } from './access';

const anonym = null;
const eltern: Viewer = { roles: ['eltern'] };
const lehrer: Viewer = { roles: ['lehrer'] };
const admin: Viewer = { roles: ['admin'] };
const ohneRollen: Viewer = { roles: [] };

describe('canAccess', () => {
  const cases: Array<[string, { roles?: unknown[] | null; status?: string }, Viewer | null, boolean]> = [
    ['public für Anonyme', { roles: ['public'] }, anonym, true],
    ['public für Angemeldete', { roles: ['public'] }, lehrer, true],
    ['lehrer-Seite für Lehrer', { roles: ['lehrer'] }, lehrer, true],
    ['lehrer-Seite für Anonyme', { roles: ['lehrer'] }, anonym, false],
    ['lehrer-Seite für Eltern (keine Hierarchie)', { roles: ['lehrer'] }, eltern, false],
    ['eltern-Seite für Lehrer (keine Hierarchie)', { roles: ['eltern'] }, lehrer, false],
    ['mehrere Rollen, eine passt', { roles: ['eltern', 'lehrer'] }, lehrer, true],
    ['admin-Seite für Anonyme', { roles: ['admin'] }, anonym, false],
    ['admin-Seite für Lehrer', { roles: ['admin'] }, lehrer, false],
    ['admin-Seite für Admin', { roles: ['admin'] }, admin, true],
    ['Admin sieht Eltern-Seiten', { roles: ['eltern'] }, admin, true],
    ['roles fehlt → nur admin (anonym)', {}, anonym, false],
    ['roles fehlt → nur admin (lehrer)', {}, lehrer, false],
    ['roles fehlt → nur admin (admin)', {}, admin, true],
    ['roles null → nur admin', { roles: null }, eltern, false],
    ['roles leer → nur admin', { roles: [] }, eltern, false],
    ['unbekannte Rolle → nur admin', { roles: ['hausmeister'] }, anonym, false],
    ['unbekannte neben gültiger Rolle', { roles: ['hausmeister', 'public'] }, anonym, true],
    ['Angemeldet ohne Rollen = anonym', { roles: ['lehrer'] }, ohneRollen, false],
    ['Angemeldet ohne Rollen sieht public', { roles: ['public'] }, ohneRollen, true],
    ['Outstatic-Format public', { roles: [{ label: 'Öffentlich', value: 'public' }] }, anonym, true],
    ['Outstatic-Format lehrer für Eltern', { roles: [{ label: 'Lehrer', value: 'lehrer' }] }, eltern, false],
    ['Outstatic-Format lehrer für Lehrer', { roles: [{ label: 'Lehrer', value: 'lehrer' }] }, lehrer, true],
    ['Entwurf ist nicht öffentlich', { roles: ['public'], status: 'draft' }, anonym, false],
    ['Entwurf sieht auch admin nicht', { roles: ['public'], status: 'draft' }, admin, false],
    ['Veröffentlicht wie ohne Status', { roles: ['public'], status: 'published' }, anonym, true],
  ];

  it.each(cases)('%s', (_name, page, viewer, expected) => {
    expect(canAccess(page, viewer)).toBe(expected);
  });
});

describe('filterTree', () => {
  const tree: PageTree.Root = {
    name: 'Docs',
    children: [
      { type: 'page', name: 'Start', url: '/' },
      {
        type: 'folder',
        name: 'Anleitungen',
        children: [
          { type: 'page', name: 'WLAN', url: '/infrastruktur/wlan' },
          { type: 'page', name: 'Geheim', url: '/infrastruktur/geheim' },
        ],
      },
      { type: 'separator', name: 'Intern' },
      {
        type: 'folder',
        name: 'Runbooks',
        index: { type: 'page', name: 'Übersicht', url: '/runbooks' },
        children: [{ type: 'page', name: 'Cache', url: '/runbooks/cache' }],
      },
    ],
  };

  const publicUrls = new Set(['/', '/infrastruktur/wlan']);

  it('entfernt unsichtbare Seiten, leere Ordner und verwaiste Trenner', () => {
    const result = filterTree(tree, (url) => publicUrls.has(url));
    expect(result.children).toEqual([
      { type: 'page', name: 'Start', url: '/' },
      {
        type: 'folder',
        name: 'Anleitungen',
        children: [{ type: 'page', name: 'WLAN', url: '/infrastruktur/wlan' }],
        index: undefined,
      },
    ]);
  });

  it('lässt für Admins alles stehen', () => {
    const result = filterTree(tree, () => true);
    expect(result.children).toHaveLength(4);
  });

  it('entfernt die Indexseite eines Ordners, wenn sie unsichtbar ist', () => {
    const result = filterTree(tree, (url) => url === '/runbooks/cache');
    expect(result.children[0]).toEqual({ type: 'separator', name: 'Intern' });
    const folder = result.children[1] as PageTree.Folder;
    expect(folder.name).toBe('Runbooks');
    expect(folder.index).toBeUndefined();
    expect(folder.children).toHaveLength(1);
  });
});
