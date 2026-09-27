import type { Metadata } from 'next';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { AccountPanel } from '@/components/account-panel';
import { homeOptions } from '@/lib/layout';
import { safeRedirectTarget } from '@/lib/redirect';
import { getViewer } from '@/lib/viewer';

export const metadata: Metadata = {
  title: 'Anmelden – GGS Hilfe',
  robots: { index: false, follow: false },
};

interface Props {
  searchParams: Promise<{ ziel?: string; error?: string }>;
}

/**
 * Dieselbe Karte wie im Konto-Popup, als eigene Seite. Hierher leiten
 * geschützte Seiten anonyme Besucher (§3.5), und Auth.js schickt Fehler hierher.
 */
export default async function AnmeldenPage({ searchParams }: Props): Promise<React.JSX.Element> {
  const { ziel, error } = await searchParams;
  const viewer = await getViewer();

  return (
    <HomeLayout {...homeOptions(viewer)}>
      <main className="ggs-auth">
        <AccountPanel viewer={viewer} ziel={safeRedirectTarget(ziel)} error={Boolean(error)} />
      </main>
    </HomeLayout>
  );
}
