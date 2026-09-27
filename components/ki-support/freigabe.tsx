import { Bot, Check, X } from 'lucide-react';

/** So sieht das IT-Team einen Vorschlag des Assistenten. Nachbildung, keine echte Oberfläche. */
export function KiFreigabe(): React.JSX.Element {
  return (
    <figure className="ggs-ki-figure not-prose">
      <div className="ggs-ki-card" role="img" aria-label="Beispiel einer Freigabekarte für das IT-Team">
        <div className="ggs-ki-card-head">
          <Bot aria-hidden="true" />
          <span>Vorschlag des Assistenten · wartet auf Freigabe</span>
        </div>
        <p className="ggs-ki-card-title">Speicher des geteilten iPads leeren</p>
        <dl className="ggs-ki-card-grid">
          <dt>Gerät</dt>
          <dd>iPad DMPX1234ABCD</dd>
          <dt>Warum</dt>
          <dd>Gerät meldet vollen Speicher, Anmeldung schlägt fehl</dd>
          <dt>Folge</dt>
          <dd>Nicht gespeicherte Daten auf dem Gerät gehen verloren</dd>
          <dt>Anleitung</dt>
          <dd>Shared iPad – Cache leeren</dd>
        </dl>
        <div className="ggs-ki-card-actions" aria-hidden="true">
          <span className="ggs-ki-btn ggs-ki-btn--yes">
            <Check /> Freigeben
          </span>
          <span className="ggs-ki-btn ggs-ki-btn--no">
            <X /> Ablehnen
          </span>
        </div>
      </div>
      <figcaption>
        Nachbildung. Das IT-Team sieht hier die echten Angaben, der Assistent nicht. Ohne Klick auf „Freigeben" passiert
        nichts.
      </figcaption>
    </figure>
  );
}
