/**
 * Wortmarke der Doku: gelbe Fläche als Textmarker-Strich hinter „GGS",
 * daneben der Name. Bewusst kein Nachbau des Homepage-Logos, das eine
 * Gebäudezeichnung trägt und in 3,5 rem Höhe nicht lesbar wäre.
 */
export function Logo() {
  return (
    <span className="ggs-logo">
      <span className="ggs-logo-mark" aria-hidden="true">
        GGS
      </span>
      <span className="ggs-logo-text">Hilfe</span>
    </span>
  );
}
