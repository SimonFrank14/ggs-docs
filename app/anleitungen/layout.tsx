import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import type { ReactNode } from 'react';
import { anleitungenSource } from '@/lib/source';
import { BookOpen } from 'lucide-react';

export default function AnleitungenLayout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      tree={anleitungenSource.pageTree}
      nav={{
        title: (
          <span className="flex items-center gap-2 font-semibold">
            <BookOpen className="size-5 text-ggs-accent" />
            GGS Anleitungen
          </span>
        ),
        url: '/anleitungen',
        links: [
          {
            text: 'Zurück zur Schulhomepage',
            url: 'https://goethe-gymnasium-stolberg.de',
            external: true,
          },
        ],
      }}
      sidebar={{
        banner: (
          <div className="rounded-lg bg-ggs-gold/10 border border-ggs-gold/30 px-3 py-2 text-sm text-ggs-text font-medium">
            Anleitungen für Schüler, Eltern & Lehrkräfte
          </div>
        ),
      }}
    >
      {children}
    </DocsLayout>
  );
}
