import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import type { ReactNode } from 'react';
import { adminSource } from '@/lib/source';
import { ShieldCheck } from 'lucide-react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      tree={adminSource.pageTree}
      nav={{
        title: (
          <span className="flex items-center gap-2 font-semibold">
            <ShieldCheck className="size-5 text-ggs-accent" />
            GGS Admin-Doku
          </span>
        ),
        url: '/anleitungen/admin',
        links: [
          {
            text: 'Anleitungen',
            url: '/anleitungen',
          },
          {
            text: 'Schulhomepage',
            url: 'https://goethe-gymnasium-stolberg.de',
            external: true,
          },
        ],
      }}
      sidebar={{
        banner: (
          <div className="rounded-lg bg-ggs-warn-bg border border-ggs-warn-border px-3 py-2 text-sm text-ggs-text font-medium">
            Interner Bereich – nur für Administratoren
          </div>
        ),
      }}
    >
      {children}
    </DocsLayout>
  );
}
