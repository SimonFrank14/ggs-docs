'use client';

import { usePathname } from 'next/navigation';
import { useId, useRef } from 'react';
import { UserRound, X } from 'lucide-react';
import type { Viewer } from '@/lib/access';
import { AccountPanel, initialOf } from './account-panel';

type Variant = 'pill' | 'icon' | 'row';

/**
 * Konto-Knopf: anonym „Anmelden", angemeldet Initiale und Vorname. Ein Klick
 * öffnet das Konto-Popup über der aktuellen Seite; nach der Anmeldung geht es
 * auf genau diese Seite zurück.
 */
export function AccountButton({
  viewer,
  variant = 'pill',
}: {
  viewer: Viewer | null;
  variant?: Variant;
}): React.JSX.Element {
  const dialog = useRef<HTMLDialogElement>(null);
  const headingId = useId();
  const pathname = usePathname();
  const label = viewer ? viewer.name || 'Konto' : 'Anmelden';

  const badge = viewer ? (
    <span className="ggs-account-badge ggs-account-badge--initial" aria-hidden="true">
      {initialOf(viewer)}
    </span>
  ) : (
    <span className="ggs-account-badge" aria-hidden="true">
      <UserRound />
    </span>
  );

  return (
    <>
      <button
        type="button"
        className={`ggs-account ggs-account--${variant}`}
        aria-haspopup="dialog"
        aria-label={variant === 'icon' ? label : undefined}
        onClick={() => dialog.current?.showModal()}
      >
        {badge}
        {variant === 'icon' ? null : (
          <span className="ggs-account-text">
            <span className="ggs-account-label">{label}</span>
            {variant === 'row' ? (
              <span className="ggs-account-hint">{viewer ? 'Konto & Abmelden' : 'Mit dem Homepage-Konto'}</span>
            ) : null}
          </span>
        )}
      </button>

      <dialog
        ref={dialog}
        className="ggs-account-dialog"
        aria-labelledby={headingId}
        // Klick auf den abgedunkelten Hintergrund schließt das Popup
        onClick={(event) => {
          if (event.target === event.currentTarget) event.currentTarget.close();
        }}
      >
        <button
          type="button"
          className="ggs-account-close"
          aria-label="Schließen"
          onClick={() => dialog.current?.close()}
        >
          <X aria-hidden="true" />
        </button>
        <AccountPanel viewer={viewer} ziel={pathname || '/'} headingId={headingId} />
      </dialog>
    </>
  );
}
