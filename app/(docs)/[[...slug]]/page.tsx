import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { Lock } from 'lucide-react';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { DocsPage, DocsBody, DocsDescription, DocsTitle } from 'fumadocs-ui/page';
import { mdxComponents } from '@/components/mdx';
import { Portal } from '@/components/portal';
import { RunbookBox } from '@/components/runbook-box';
import { canAccess } from '@/lib/access';
import { AccountSidebar } from '@/components/account';
import { baseOptions, homeOptions } from '@/lib/layout';
import { visiblePages, visibleTree, docsSource } from '@/lib/source';
import { getViewer } from '@/lib/viewer';

interface Props {
  params: Promise<{ slug?: string[] }>;
}

/**
 * Seite laden und gegen `canAccess` prüfen (Doku-Spec §3.5):
 * - gibt es die Seite nicht: 404
 * - anonym und geschützt: `login`, die Seite leitet zur Anmeldung weiter
 * - angemeldet, aber falsche Rolle: `forbidden`, die Seite erklärt das
 */
async function loadPage(slug: string[] | undefined) {
  const page = docsSource.getPage(slug);
  if (!page) return { status: 'missing' as const };
  const viewer = await getViewer();
  if (!canAccess(page.data, viewer)) {
    return { status: viewer ? ('forbidden' as const) : ('login' as const), viewer };
  }
  return { status: 'ok' as const, page, viewer };
}

/*
 * Das Layout wählt die Seite selbst: die Wurzel ist ein Portal ohne Sidebar,
 * alle anderen Seiten sind Doku-Seiten mit Sidebar. Ein eigenes page.tsx für
 * `/` ginge nicht, weil die optionale Catch-all-Route `/` bereits abdeckt.
 */
export default async function Page({ params }: Props) {
  const { slug } = await params;
  const loaded = await loadPage(slug);
  if (loaded.status === 'missing') notFound();
  if (loaded.status === 'login') {
    redirect(`/anmelden?ziel=${encodeURIComponent(`/${(slug ?? []).join('/')}`)}`);
  }

  const { viewer } = loaded;
  const tree = visibleTree(viewer);

  if (loaded.status === 'forbidden') {
    return (
      <HomeLayout {...homeOptions(viewer)}>
        <main className="ggs-auth">
          <div className="ggs-auth-card">
            <div className="ggs-auth-band">
              <Lock aria-hidden="true" />
            </div>
            <div className="ggs-auth-body">
              <h1>Kein Zugriff</h1>
              <p>
                Diese Anleitung ist für eine andere Gruppe freigegeben als deine. Wenn du sie
                brauchst, melde dich beim IT-Support.
              </p>
              <Link href="/" className="ggs-auth-secondary">
                Zur Startseite
              </Link>
            </div>
          </div>
        </main>
      </HomeLayout>
    );
  }

  // TypeScript verengt nicht über redirect(); zur Laufzeit ist hier immer 'ok'
  if (loaded.status !== 'ok') notFound();
  const { page } = loaded;

  if (!slug || slug.length === 0) {
    const featured = visiblePages(viewer)
      .filter((p) => p.data.featured)
      .map((p) => ({ title: p.data.title, url: p.url }));

    return (
      <HomeLayout {...homeOptions(viewer)}>
        <Portal tree={tree} featured={featured} />
      </HomeLayout>
    );
  }

  const MDX = page.data.body;

  return (
    <DocsLayout
      tree={tree}
      {...baseOptions}
      sidebar={{ footer: <AccountSidebar viewer={viewer} /> }}
    >
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
  if (loaded.status !== 'ok') return {};

  const { page } = loaded;
  return {
    title: slug && slug.length > 0 ? `${page.data.title} – GGS Hilfe` : 'GGS Hilfe',
    description: page.data.description,
    // Nicht-öffentliche Seiten nie indexieren, auch wenn sie jemand sehen darf
    robots: canAccess(page.data, null) ? undefined : { index: false, follow: false },
  };
}
