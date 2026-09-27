import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { DocsPage, DocsBody, DocsDescription, DocsTitle } from 'fumadocs-ui/page';
import { mdxComponents } from '@/components/mdx';
import { Portal } from '@/components/portal';
import { RunbookBox } from '@/components/runbook-box';
import { canAccess } from '@/lib/access';
import { baseOptions } from '@/lib/layout';
import { visiblePages, visibleTree, docsSource } from '@/lib/source';
import { getViewer } from '@/lib/viewer';

interface Props {
  params: Promise<{ slug?: string[] }>;
}

/**
 * Seite laden und gegen `canAccess` prüfen. Nicht zugängliche Seiten liefern
 * vorerst 404. Mit dem Login (Doku-Spec §3.5) werden daraus Weiterleitung zum
 * Login (anonym) bzw. 403 (falsche Rolle) — bis dahin gibt es keinen Login,
 * auf den eine Weiterleitung zeigen könnte.
 */
async function loadPage(slug: string[] | undefined) {
  const page = docsSource.getPage(slug);
  if (!page) return null;
  const viewer = await getViewer();
  if (!canAccess(page.data, viewer)) return null;
  return { page, viewer };
}

/*
 * Das Layout wählt die Seite selbst: die Wurzel ist ein Portal ohne Sidebar,
 * alle anderen Seiten sind Doku-Seiten mit Sidebar. Ein eigenes page.tsx für
 * `/` ginge nicht, weil die optionale Catch-all-Route `/` bereits abdeckt.
 */
export default async function Page({ params }: Props) {
  const { slug } = await params;
  const loaded = await loadPage(slug);
  if (!loaded) notFound();

  const { page, viewer } = loaded;
  const tree = visibleTree(viewer);

  if (!slug || slug.length === 0) {
    const featured = visiblePages(viewer)
      .filter((p) => p.data.featured)
      .map((p) => ({ title: p.data.title, url: p.url }));

    return (
      <HomeLayout {...baseOptions}>
        <Portal tree={tree} featured={featured} />
      </HomeLayout>
    );
  }

  const MDX = page.data.body;

  return (
    <DocsLayout tree={tree} {...baseOptions}>
      <DocsPage toc={page.data.toc} full={page.data.full}>
        <DocsTitle>{page.data.title}</DocsTitle>
        <DocsDescription>{page.data.description}</DocsDescription>
        <DocsBody>
          {page.data.runbook ? <RunbookBox runbook={page.data.runbook} /> : null}
          <MDX components={mdxComponents} />
        </DocsBody>
      </DocsPage>
    </DocsLayout>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const loaded = await loadPage(slug);
  if (!loaded) return {};

  const { page } = loaded;
  return {
    title: slug && slug.length > 0 ? `${page.data.title} – GGS Hilfe` : 'GGS Hilfe',
    description: page.data.description,
    // Nicht-öffentliche Seiten nie indexieren, auch wenn sie jemand sehen darf
    robots: canAccess(page.data, null) ? undefined : { index: false, follow: false },
  };
}
