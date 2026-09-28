import { LogOut } from 'lucide-react';
import type { Viewer } from '@/lib/access';
import { abmelden, anmelden } from '@/lib/auth-actions';
import { ROLE_LABELS } from '@/lib/roles';

export function initialOf(viewer: Viewer): string {
  return (viewer.name?.trim()[0] ?? '?').toUpperCase();
}

/**
 * Inhalt von Anmelde-Popup und Anmeldeseite, im Stil eines Schulausweises:
 * oben der dunkle Streifen mit der Schulmarke, darunter Anmelden bzw. das
 * eigene Konto. `ziel` ist die Seite, auf die es nach der Anmeldung zurückgeht.
 */
export function AccountPanel({
  viewer,
  ziel,
  error = false,
  headingId,
}: {
  viewer: Viewer | null;
  ziel: string;
  error?: boolean;
  headingId?: string;
}): React.JSX.Element {
  return (
    <div className="ggs-idcard">
      <div className="ggs-idcard-strip">
        <span className="ggs-idcard-mark" aria-hidden="true">
          GGS
        </span>
        <span className="ggs-idcard-school">Goethe-Gymnasium Stolberg</span>
      </div>

      {viewer ? (
        <div className="ggs-idcard-body">
          <div className="ggs-idcard-person">
            <span className="ggs-idcard-photo" aria-hidden="true">
              {initialOf(viewer)}
            </span>
            <div>
              <h2 id={headingId}>{viewer.name || 'Angemeldet'}</h2>
              {viewer.roles.length > 0 ? (
                <ul className="ggs-idcard-roles" aria-label="Deine Gruppen">
                  {viewer.roles.map((role) => (
                    <li key={role}>{ROLE_LABELS[role]}</li>
                  ))}
                </ul>
              ) : (
                <p className="ggs-idcard-note">Keine Gruppe zugeordnet</p>
              )}
            </div>
          </div>
          <p>
            {viewer.roles.length > 0
              ? 'Du siehst alle Anleitungen, die für deine Gruppen freigegeben sind.'
              : 'Du siehst die öffentlichen Anleitungen. Fehlt dir etwas, melde dich beim IT-Support.'}
          </p>
          <form action={abmelden}>
            <button type="submit" className="ggs-idcard-secondary">
              <LogOut aria-hidden="true" />
              Abmelden
            </button>
          </form>
        </div>
      ) : (
        <div className="ggs-idcard-body">
          <h2 id={headingId}>Anmelden</h2>
          <p>
            Mit deinem Konto der Schulhomepage siehst du auch die Anleitungen für Lehrkräfte,
            Schülerinnen und Schüler oder Eltern.
          </p>
          {error ? (
            <p className="ggs-idcard-error" role="alert">
              Die Anmeldung hat nicht geklappt. Versuch es noch einmal. Klappt es wieder nicht,
              melde dich beim IT-Support.
            </p>
          ) : null}
          <form action={anmelden}>
            <input type="hidden" name="ziel" value={ziel} />
            <button type="submit" className="ggs-idcard-primary">
              Weiter zur Anmeldung
            </button>
          </form>
          <p className="ggs-idcard-note">
            Du meldest dich auf goethe-gymnasium-stolberg.de an und kommst danach hierher zurück.
          </p>
        </div>
      )}
    </div>
  );
}
