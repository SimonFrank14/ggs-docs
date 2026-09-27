import { describe, expect, it } from 'vitest';
import type * as PageTree from 'fumadocs-core/page-tree';
import { sortTreeByOrder } from './tree-order';

const page = (url: string, name = url): PageTree.Item => ({ type: 'page', name, url });

describe('sortTreeByOrder', () => {
  const order: Record<string, number> = { '/a/drucken': 20, '/a/wlan': 10 };
  const orderOf = (url: string) => order[url];

  it('sortiert Seiten im Ordner nach order, Seiten ohne order ans Ende', () => {
    const tree: PageTree.Root = {
      name: 'Docs',
      children: [
        {
          type: 'folder',
          name: 'A',
          children: [page('/a/ohne', 'Ohne'), page('/a/drucken'), page('/a/wlan')],
        },
      ],
    };
    const folder = sortTreeByOrder(tree, orderOf).children[0] as PageTree.Folder;
    expect(folder.children.map((n) => (n as PageTree.Item).url)).toEqual(['/a/wlan', '/a/drucken', '/a/ohne']);
  });

  it('sortiert bei gleicher order nach Titel', () => {
    const tree: PageTree.Root = { name: 'Docs', children: [page('/b', 'Beta'), page('/a', 'Alpha')] };
    expect(sortTreeByOrder(tree, () => undefined).children.map((n) => (n as PageTree.Item).name)).toEqual([
      'Alpha',
      'Beta',
    ]);
  });

  it('lässt Ordner und Trenner an ihrer Stelle', () => {
    const tree: PageTree.Root = {
      name: 'Docs',
      children: [page('/x'), { type: 'separator', name: 'S' }, { type: 'folder', name: 'F', children: [] }],
    };
    expect(sortTreeByOrder(tree, () => undefined).children.map((n) => n.type)).toEqual([
      'page',
      'separator',
      'folder',
    ]);
  });
});
