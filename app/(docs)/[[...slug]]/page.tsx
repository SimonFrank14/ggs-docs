import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DocsPage, DocsBody, DocsDescription, DocsTitle } from 'fumadocs-ui/page';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import { Home } from '@/components/home';
import { RunbookBox } from '@/components/runbook-box';
import { canAccess } from '@/lib/access';
import { docsSource, visibleTree } from '@/lib/source';
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

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const loaded = await loadPage(slug);
  if (!loaded) notFound();

  const { page, viewer } = loaded;
  const MDX = page.data.body;

  if (!slug || slug.length === 0) {
    return (
      <DocsPage full>
        <Home tree={visibleTree(viewer)}>
          <MDX components={defaultMdxComponents} />
        </Home>
      </DocsPage>
    );
  }

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        {page.data.runbook ? <RunbookBox runbook={page.data.runbook} /> : null}
        <MDX components={defaultMdxComponents} />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const loaded = await loadPage(slug);
  if (!loaded) return {};

  const { page } = loaded;
  return {
    title: slug && slug.length > 0 ? `${page.data.title} – GGS Hilfe` : page.data.title,
    description: page.data.description,
    // Nicht-öffentliche Seiten nie indexieren, auch wenn sie jemand sehen darf
    robots: canAccess(page.data, null) ? undefined : { index: false, follow: false },
  };
}
