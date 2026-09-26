import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import type { ReactNode } from 'react';
import { Logo } from '@/components/logo';
import { visibleTree } from '@/lib/source';
import { getViewer } from '@/lib/viewer';

export default async function Layout({ children }: { children: ReactNode }) {
  const viewer = await getViewer();

  return (
    <DocsLayout
      tree={visibleTree(viewer)}
      nav={{
        title: <Logo />,
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
