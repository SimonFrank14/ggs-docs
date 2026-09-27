import { Bot, CheckCircle2, MessageSquare, ShieldCheck, UserRound } from 'lucide-react';
import type { ReactNode } from 'react';

interface Schritt {
  icon: ReactNode;
  titel: string;
  text: string;
  wer: 'du' | 'mensch' | 'ki';
}

const SCHRITTE: Schritt[] = [
  { icon: <MessageSquare />, titel: 'Du schreibst', text: 'wie bisher im Teams-Chat „IT-Support" oder per Mail', wer: 'du' },
  { icon: <Bot />, titel: 'Der Assistent bereitet vor', text: 'liest dein Anliegen ohne Namen und Nummern, sucht die passende Anleitung, schlägt Schritte vor', wer: 'ki' },
  { icon: <ShieldCheck />, titel: 'Ein Mensch prüft', text: 'jemand aus dem IT-Team sieht den Vorschlag und entscheidet', wer: 'mensch' },
  { icon: <CheckCircle2 />, titel: 'Du bekommst Antwort', text: 'vom IT-Team — gelesen und abgeschickt von einem Menschen', wer: 'mensch' },
];

const LABEL = { du: 'Du', mensch: 'Mensch', ki: 'KI · intern' } as const;

/** Der Weg eines Anliegens: Der Assistent steht nur im internen Teil, nie zwischen dir und der Antwort. */
export function KiAblauf(): React.JSX.Element {
  return (
    <figure className="ggs-ki-figure not-prose">
      <ol className="ggs-ki-flow">
        {SCHRITTE.map((s, i) => (
          <li key={s.titel} className={`ggs-ki-step ggs-ki-step--${s.wer}`}>
            <span className="ggs-ki-step-num" aria-hidden="true">
              {i + 1}
            </span>
            <span className="ggs-ki-step-icon" aria-hidden="true">
              {s.icon}
            </span>
            <span className="ggs-ki-step-badge">
              {s.wer === 'du' || s.wer === 'mensch' ? <UserRound aria-hidden="true" /> : <Bot aria-hidden="true" />}
              {LABEL[s.wer]}
            </span>
            <strong className="ggs-ki-step-title">{s.titel}</strong>
            <span className="ggs-ki-step-text">{s.text}</span>
          </li>
        ))}
      </ol>
      <figcaption>
        Der Assistent arbeitet nur im internen Teil (gestrichelt). Er schreibt dir nie direkt und ändert nichts, ohne dass
        ein Mensch zugestimmt hat.
      </figcaption>
    </figure>
  );
}
