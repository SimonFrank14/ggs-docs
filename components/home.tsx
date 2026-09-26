import Link from 'next/link';
import type { ReactNode } from 'react';
import type * as PageTree from 'fumadocs-core/page-tree';
import { HomeSearch } from './home-search';

interface Topic {
  name: ReactNode;
  url: string;
  count: number;
}

function topicsOf(tree: PageTree.Root): Topic[] {
  return tree.children.flatMap((node) => {
    if (node.type !== 'folder') return [];
    const pages = node.children.filter((child) => child.type === 'page');
    const url = node.index?.url ?? pages[0]?.url;
    if (!url) return [];
    return [{ name: node.name, url, count: pages.length + (node.index ? 1 : 0) }];
  });
}

/**
 * Startseite der Doku. Die Themenkacheln kommen aus dem bereits
 * rollengefilterten Baum: wer eine Kachel sieht, darf ihre Seiten sehen.
 */
export function Home({ tree, children }: { tree: PageTree.Root; children?: ReactNode }) {
  const topics = topicsOf(tree);

  return (
    <div className="ggs-home">
      <section className="ggs-hero">
        <p className="ggs-eyebrow">Goethe-Gymnasium Stolberg</p>
        <h1 className="ggs-hero-title">
          Wie geht das <mark>eigentlich</mark>?
        </h1>
        <p className="ggs-hero-lead">
          Anleitungen zu WLAN, iPads, Accounts und allem, was an der Schule mit Technik zu tun hat.
        </p>
        <HomeSearch />
      </section>

      {topics.length > 0 ? (
        <section aria-labelledby="themen">
          <h2 id="themen" className="ggs-section-title">
            Themen
          </h2>
          <ul className="ggs-topics">
            {topics.map((topic) => (
              <li key={topic.url}>
                <Link href={topic.url} className="ggs-topic">
                  <span className="ggs-topic-name">{topic.name}</span>
                  <span className="ggs-topic-count">
                    {topic.count === 1 ? '1 Anleitung' : `${topic.count} Anleitungen`}
                  </span>
                  <span className="ggs-topic-arrow" aria-hidden="true">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <section className="ggs-empty">
          <p>
            Die Anleitungen ziehen gerade von der Schulhomepage hierher um. Bis dahin findest du sie
            unter{' '}
            <a href="https://goethe-gymnasium-stolberg.de/anleitungen/">
              goethe-gymnasium-stolberg.de/anleitungen
            </a>
            .
          </p>
        </section>
      )}

      {children ? <div className="ggs-home-body prose">{children}</div> : null}

      <footer className="ggs-home-footer">
        <p>
          Etwas fehlt oder stimmt nicht? Schreib dem IT-Support in Teams oder an{' '}
          <a href="mailto:support@goethe-gymnasium-stolberg.de">
            support@goethe-gymnasium-stolberg.de
          </a>
          .
        </p>
      </footer>
    </div>
  );
}
