import { ArrowRight, KeyRound, Lock } from 'lucide-react';
import type { ReactNode } from 'react';

function Echt({ children }: { children: ReactNode }) {
  return <mark className="ggs-ki-real">{children}</mark>;
}

function Platzhalter({ children }: { children: ReactNode }) {
  return <code className="ggs-ki-token">{children}</code>;
}

/** Vorher/nachher: was du schreibst und was der Assistent davon zu sehen bekommt. Beispieldaten sind erfunden. */
export function KiPlatzhalter(): React.JSX.Element {
  return (
    <figure className="ggs-ki-figure not-prose">
      <div className="ggs-ki-compare">
        <div className="ggs-ki-panel">
          <p className="ggs-ki-panel-label">Das schreibst du</p>
          <p className="ggs-ki-message">
            Hallo, hier ist <Echt>Anna Beispiel</Echt> aus der <Echt>7b</Echt>. Mein iPad mit der Nummer{' '}
            <Echt>DMPX1234ABCD</Echt> sagt „Speicher voll". Erreichbar bin ich unter <Echt>anna.beispiel@schule.de</Echt>.
          </p>
          <p className="ggs-ki-panel-foot">
            <span className="ggs-ki-dot ggs-ki-dot--real" aria-hidden="true" /> echte Angaben
          </p>
        </div>

        <div className="ggs-ki-arrow" aria-hidden="true">
          <Lock />
          <ArrowRight />
        </div>

        <div className="ggs-ki-panel ggs-ki-panel--model">
          <p className="ggs-ki-panel-label">Das sieht der Assistent</p>
          <p className="ggs-ki-message">
            Hallo, hier ist <Platzhalter>«PERSON_1»</Platzhalter> aus der <Echt>7b</Echt>. Mein iPad mit der Nummer{' '}
            <Platzhalter>«GERAET_1»</Platzhalter> sagt „Speicher voll". Erreichbar bin ich unter{' '}
            <Platzhalter>«EMAIL_1»</Platzhalter>.
          </p>
          <p className="ggs-ki-panel-foot">
            <span className="ggs-ki-dot ggs-ki-dot--token" aria-hidden="true" /> Platzhalter
          </p>
        </div>
      </div>

      <div className="ggs-ki-vault">
        <KeyRound aria-hidden="true" />
        <p>
          Welcher Platzhalter zu welcher Angabe gehört, steht nur in einer verschlüsselten Tabelle auf Servern der Schule.
          Sie gilt nur für dieses eine Anliegen und wird nach 30 Tagen gelöscht.
        </p>
      </div>

      <figcaption>
        Beispiel mit erfundenen Daten. Die Klasse bleibt stehen, weil sie für die Hilfe nötig ist und allein niemanden
        erkennbar macht.
      </figcaption>
    </figure>
  );
}
