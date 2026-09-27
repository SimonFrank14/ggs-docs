import Link from 'next/link';
import { LogIn } from 'lucide-react';
import type { Viewer } from '@/lib/access';

function initialOf(viewer: Viewer): string {
  return (viewer.name?.trim()[0] ?? '?').toUpperCase();
}

/**
 * Anmelde-Knopf bzw. Konto-Chip in der Kopfzeile. Beides führt nach
 * `/anmelden`; dort wird angemeldet oder das Konto gezeigt.
 * `compact` ist die Variante fürs Handy: nur Symbol bzw. Initiale.
 */
export function AccountButton({
  viewer,
  compact = false,
}: {
  viewer: Viewer | null;
  compact?: boolean;
}): React.JSX.Element {
  if (!viewer) {
    return (
      <Link
        href="/anmelden"
        className={compact ? 'ggs-account-icon' : 'ggs-account-login'}
        aria-label="Anmelden"
      >
        <LogIn aria-hidden="true" />
        {compact ? null : <span>Anmelden</span>}
      </Link>
    );
  }

  return (
    <Link
      href="/anmelden"
      className={compact ? 'ggs-account-icon ggs-account-icon--user' : 'ggs-account-chip'}
      aria-label={`Konto${viewer.name ? ` von ${viewer.name}` : ''}`}
    >
      <span className="ggs-account-avatar" aria-hidden="true">
        {initialOf(viewer)}
      </span>
      {compact ? null : <span>{viewer.name || 'Konto'}</span>}
    </Link>
  );
}

/** Konto-Zeile unten in der Seitenleiste der Doku-Seiten. */
export function AccountSidebar({ viewer }: { viewer: Viewer | null }): React.JSX.Element {
  if (!viewer) {
    return (
      <Link href="/anmelden" className="ggs-account-login ggs-account-login--block">
        <LogIn aria-hidden="true" />
        <span>Anmelden</span>
      </Link>
    );
  }

  return (
    <Link href="/anmelden" className="ggs-account-row">
      <span className="ggs-account-avatar" aria-hidden="true">
        {initialOf(viewer)}
      </span>
      <span className="ggs-account-row-text">
        <span className="ggs-account-row-name">{viewer.name || 'Angemeldet'}</span>
        <span className="ggs-account-row-hint">Konto &amp; Abmelden</span>
      </span>
    </Link>
  );
}
