import type * as PageTree from 'fumadocs-core/page-tree';

/**
 * Sortiert Seiten innerhalb jedes Ordners nach `order` aus dem Frontmatter
 * (Feld „Reihenfolge" in Outstatic), bei Gleichstand nach Titel. Seiten ohne
 * `order` kommen ans Ende. Ordner, Trenner und Indexseiten bleiben, wo sie sind —
 * ihre Reihenfolge steuert meta.json.
 */
export function sortTreeByOrder(
  tree: PageTree.Root,
  orderOf: (url: string) => number | undefined,
): PageTree.Root {
  return { ...tree, children: sortNodes(tree.children, orderOf) };
}

function sortNodes(
  nodes: PageTree.Node[],
  orderOf: (url: string) => number | undefined,
): PageTree.Node[] {
  const withFolders = nodes.map((node) =>
    node.type === 'folder' ? { ...node, children: sortNodes(node.children, orderOf) } : node,
  );

  // Nur zusammenhängende Seitenblöcke sortieren, damit Trenner und Ordner ihre Stelle behalten
  const result: PageTree.Node[] = [];
  let run: PageTree.Item[] = [];
  const flush = () => {
    run.sort((a, b) => {
      const oa = orderOf(a.url) ?? Number.POSITIVE_INFINITY;
      const ob = orderOf(b.url) ?? Number.POSITIVE_INFINITY;
      return oa !== ob ? oa - ob : String(a.name).localeCompare(String(b.name), 'de');
    });
    result.push(...run);
    run = [];
  };
  for (const node of withFolders) {
    if (node.type === 'page') run.push(node);
    else {
      flush();
      result.push(node);
    }
  }
  flush();
  return result;
}
