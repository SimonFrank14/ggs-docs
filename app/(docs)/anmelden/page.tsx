import type { Metadata } from 'next';
import Link from 'next/link';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { LogIn, LogOut } from 'lucide-react';
import { auth, signIn, signOut } from '@/lib/auth';
import { homeOptions } from '@/lib/layout';
import { safeRedirectTarget } from '@/lib/redirect';
import { ROLE_LABELS } from '@/lib/roles';
import { getViewer } from '@/lib/viewer';

export const metadata: Metadata = {
  title: 'Anmelden – GGS Hilfe',
  robots: { index: false, follow: false },
};

interface Props {
  searchParams: Promise<{ ziel?: string; error?: string }>;
}

/**
 * Anmelden mit dem Konto der Schulhomepage, bzw. das eigene Konto mit
 * Abmelden, wenn schon angemeldet. Geschützte Seiten leiten hierher (§3.5).
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
    <HomeLayout {...homeOptions(viewer)}>
      <main className="ggs-auth">
        <div className="ggs-auth-card">
          {session?.user && viewer ? (
            <>
              <div className="ggs-auth-band">
                <span className="ggs-account-avatar ggs-account-avatar--large" aria-hidden="true">
                  {(viewer.name?.trim()[0] ?? '?').toUpperCase()}
                </span>
              </div>
              <div className="ggs-auth-body">
                <p className="ggs-auth-eyebrow">Angemeldet</p>
                <h1>{viewer.name ? `Hallo ${viewer.name}` : 'Du bist angemeldet'}</h1>
                {viewer.roles.length > 0 ? (
                  <ul className="ggs-auth-roles" aria-label="Deine Rollen">
                    {viewer.roles.map((role) => (
                      <li key={role}>{ROLE_LABELS[role]}</li>
                    ))}
                  </ul>
                ) : null}
                <p>
                  {viewer.roles.length > 0
                    ? 'Du siehst alle Anleitungen, die für deine Rollen freigegeben sind.'
                    : 'Deinem Konto ist keine Gruppe zugeordnet. Du siehst die öffentlichen Anleitungen.'}
                </p>
                <div className="ggs-auth-actions">
                  <Link href="/" className="ggs-auth-button">
                    Zu den Anleitungen
                  </Link>
                  <form action={abmelden}>
                    <button type="submit" className="ggs-auth-secondary">
                      <LogOut aria-hidden="true" />
                      Abmelden
                    </button>
                  </form>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="ggs-auth-band">
                <span className="ggs-logo-mark ggs-logo-mark--large" aria-hidden="true">
                  GGS
                </span>
              </div>
              <div className="ggs-auth-body">
                <p className="ggs-auth-eyebrow">Hilfe &amp; Anleitungen</p>
                <h1>Anmelden</h1>
                <p>
                  Einige Anleitungen gibt es nur für Lehrkräfte, Schülerinnen und Schüler oder
                  Eltern. Melde dich an, um sie zu sehen.
                </p>
                {error ? (
                  <p className="ggs-auth-error" role="alert">
                    Die Anmeldung hat nicht geklappt. Versuch es noch einmal. Wenn es wieder nicht
                    klappt, melde dich beim IT-Support.
                  </p>
                ) : null}
                <form action={anmelden}>
                  <button type="submit" className="ggs-auth-button">
                    <LogIn aria-hidden="true" />
                    Anmelden
                  </button>
                </form>
                <p className="ggs-auth-hint">
                  Du nutzt dieselben Zugangsdaten wie auf goethe-gymnasium-stolberg.de.
                </p>
              </div>
            </>
          )}
        </div>
      </main>
    </HomeLayout>
  );
}
