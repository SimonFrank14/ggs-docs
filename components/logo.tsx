/**
 * Wortmarke der Doku im Stil der Schulhomepage: gelbe Fläche mit dunkler
 * Schrift, daneben der Name in Montserrat wie das Hauptmenü der Homepage.
 */
export function Logo() {
  return (
    <span className="ggs-logo">
      <span className="ggs-logo-mark" aria-hidden="true">
        GGS
      </span>
      <span className="ggs-logo-text">
        Goethe-Gymnasium <span className="ggs-logo-sub">Hilfe &amp; Anleitungen</span>
      </span>
    </span>
  );
}
