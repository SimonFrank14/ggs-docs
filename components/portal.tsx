import Link from 'next/link';
import type { ReactNode } from 'react';
import type * as PageTree from 'fumadocs-core/page-tree';
import { ArrowRight, BookOpen } from 'lucide-react';
import { HomeSearch } from './home-search';

export interface QuickLink {
  title: string;
  url: string;
}

interface Topic {
  name: ReactNode;
  icon?: ReactNode;
  url: string;
  pages: QuickLink[];
}

const PAGES_PER_TOPIC = 4;

function topicsOf(tree: PageTree.Root): Topic[] {
  const loose: QuickLink[] = [];
  const topics: Topic[] = [];

  for (const node of tree.children) {
    if (node.type === 'page' && node.url !== '/') {
      loose.push({ title: String(node.name), url: node.url });
    }
    if (node.type !== 'folder') continue;
    const pages = node.children.flatMap((child) =>
      child.type === 'page' ? [{ title: String(child.name), url: child.url }] : [],
    );
    const url = node.index?.url ?? pages[0]?.url;
    if (!url) continue;
    topics.push({ name: node.name, icon: node.icon, url, pages });
  }

  if (loose.length > 0) {
    topics.push({ name: 'Weitere Anleitungen', url: loose[0].url, pages: loose });
  }
  return topics;
}

/**
 * Startseite als Portal: zuerst die Suche, dann „Häufig gesucht", dann alle
 * Themen mit ihren ersten Anleitungen als Direktlinks. Alles kommt aus dem
 * rollengefilterten Baum — wer eine Kachel sieht, darf ihre Seiten sehen.
 */
export function Portal({
  tree,
  featured,
}: {
  tree: PageTree.Root;
  featured: QuickLink[];
}): React.JSX.Element {
  const topics = topicsOf(tree);

  return (
    <main className="ggs-portal">
      <section className="ggs-hero">
        <div className="ggs-hero-inner">
          <p className="ggs-eyebrow">Hilfe &amp; Anleitungen</p>
          <h1 className="ggs-hero-title">Wie können wir helfen?</h1>
          <HomeSearch />
          {featured.length > 0 ? (
            <nav aria-label="Häufig gesucht" className="ggs-quick">
              <span className="ggs-quick-label">Häufig gesucht:</span>
              {featured.map((link) => (
                <Link key={link.url} href={link.url} className="ggs-chip">
                  {link.title}
                </Link>
              ))}
            </nav>
          ) : null}
        </div>
      </section>

      <section className="ggs-section" aria-labelledby="themen">
        <h2 id="themen" className="ggs-section-title">
          Themen
        </h2>

        {topics.length > 0 ? (
          <ul className="ggs-topics">
            {topics.map((topic) => (
              <li key={topic.url} className="ggs-topic">
                <Link href={topic.url} className="ggs-topic-head">
                  <span className="ggs-topic-icon" aria-hidden="true">
                    {topic.icon ?? <BookOpen />}
                  </span>
                  <span className="ggs-topic-name">{topic.name}</span>
                </Link>
                <ul className="ggs-topic-pages">
                  {topic.pages.slice(0, PAGES_PER_TOPIC).map((page) => (
                    <li key={page.url}>
                      <Link href={page.url}>{page.title}</Link>
                    </li>
                  ))}
                </ul>
                {topic.pages.length > PAGES_PER_TOPIC ? (
                  <Link href={topic.url} className="ggs-topic-more">
                    Alle {topic.pages.length} anzeigen <ArrowRight aria-hidden="true" />
                  </Link>
                ) : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="ggs-empty">
            Die Anleitungen ziehen gerade von der Schulhomepage hierher um. Bis dahin findest du sie
            unter{' '}
            <a href="https://goethe-gymnasium-stolberg.de/anleitungen/">
              goethe-gymnasium-stolberg.de/anleitungen
            </a>
            .
          </p>
        )}
      </section>

      <section className="ggs-contact" aria-labelledby="kontakt">
        <h2 id="kontakt" className="ggs-section-title">
          Nichts gefunden?
        </h2>
        <p>
          Schreib dem IT-Support in Teams (App <strong>IT-Support</strong>) oder an{' '}
          <a href="mailto:support@goethe-gymnasium-stolberg.de">
            support@goethe-gymnasium-stolberg.de
          </a>
          .
        </p>
      </section>
    </main>
  );
}
