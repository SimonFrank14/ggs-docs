import type { Metadata } from 'next';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { auth, signIn, signOut } from '@/lib/auth';
import { layoutOptions } from '@/lib/layout';
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
 * Anmelden mit dem Konto der Schulhomepage, bzw. Abmelden, wenn schon
 * angemeldet. Geschützte Seiten leiten anonyme Besucher hierher (§3.5).
 */
export default async function AnmeldenPage({ searchParams }: Props): Promise<React.JSX.Element> {
  const { ziel, error } = await searchParams;
  const target = safeRedirectTarget(ziel);
  const session = await auth();
  const viewer = await getViewer();

  async function anmelden() {
    'use server';
    await signIn('wordpress', { redirectTo: target });
  }

  async function abmelden() {
    'use server';
    // Nur die eigene Sitzung beenden, nicht die auf der Schulhomepage (§3.4)
    await signOut({ redirectTo: '/' });
  }

  return (
    <HomeLayout {...layoutOptions(viewer)}>
      <main className="ggs-auth">
        <div className="ggs-auth-card">
          {session?.user ? (
            <>
              <h1>Angemeldet{session.user.name ? ` als ${session.user.name}` : ''}</h1>
              <p>Du siehst alle Anleitungen, die für deine Rolle freigegeben sind.</p>
              <form action={abmelden}>
                <button type="submit" className="ggs-auth-button">
                  Abmelden
                </button>
              </form>
            </>
          ) : (
            <>
              <h1>Anmelden</h1>
              <p>
                Manche Anleitungen sind nur für Lehrkräfte, Schülerinnen und Schüler oder Eltern
                sichtbar. Melde dich mit deinem Konto der Schulhomepage an, um sie zu sehen.
              </p>
              {error ? (
                <p className="ggs-auth-error" role="alert">
                  Die Anmeldung hat nicht geklappt. Versuch es noch einmal. Wenn es wieder nicht
                  klappt, melde dich beim IT-Support.
                </p>
              ) : null}
              <form action={anmelden}>
                <button type="submit" className="ggs-auth-button">
                  Mit dem Konto der Schulhomepage anmelden
                </button>
              </form>
            </>
          )}
        </div>
      </main>
    </HomeLayout>
  );
}
