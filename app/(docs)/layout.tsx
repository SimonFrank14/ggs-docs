import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import type { ReactNode } from 'react';
import { docsSource } from '@/lib/source';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      tree={docsSource.pageTree}
      nav={{
        title: 'GGS Dokumentation',
        url: '/',
      }}
      links={[
        {
          text: 'Zur Schulhomepage',
          url: 'https://goethe-gymnasium-stolberg.de',
          external: true,
        },
      ]}
    >
      {children}
    </DocsLayout>
  );
}
