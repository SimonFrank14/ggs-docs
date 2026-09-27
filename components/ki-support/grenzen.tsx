import { Check, X } from 'lucide-react';

const TUT = [
  'dein Anliegen lesen — mit Platzhaltern statt Namen, Mailadressen und Gerätenummern',
  'in unseren Anleitungen nachsehen, was in solchen Fällen hilft',
  'nachsehen, wie es deinem Gerät oder Konto technisch geht (z. B. ob das iPad online ist)',
  'dem IT-Team Schritte und einen Antworttext vorschlagen',
];

const TUT_NICHT = [
  'dir selbst antworten — jede Antwort schickt ein Mensch ab',
  'etwas an deinem Konto oder Gerät ändern, ohne dass ein Mensch zustimmt',
  'Passwörter, Codes oder Bildschirmfotos sehen',
  'über dich entscheiden, dich bewerten oder Noten, Zeugnisse, Schülerakten lesen',
  'mit deinen Daten trainiert werden',
];

export function KiGrenzen(): React.JSX.Element {
  return (
    <div className="ggs-ki-limits not-prose">
      <div className="ggs-ki-limit ggs-ki-limit--yes">
        <p className="ggs-ki-limit-title">Der Assistent darf</p>
        <ul>
          {TUT.map((t) => (
            <li key={t}>
              <Check aria-hidden="true" />
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="ggs-ki-limit ggs-ki-limit--no">
        <p className="ggs-ki-limit-title">Der Assistent kann und darf nicht</p>
        <ul>
          {TUT_NICHT.map((t) => (
            <li key={t}>
              <X aria-hidden="true" />
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
