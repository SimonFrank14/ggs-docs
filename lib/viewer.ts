import type { Viewer } from './access';

/**
 * Wer die aktuelle Anfrage stellt.
 *
 * Bis Auth.js gegen den WordPress-OIDC-Provider steht (Doku-Spec Phase 2),
 * ist jeder Besucher anonym und sieht nur `public`-Seiten. Admin-Inhalte wie
 * Runbooks liegen damit bereits im Inhaltsbaum, sind aber unsichtbar. Mit dem
 * Login ändert sich nur diese Funktion, nicht `canAccess` oder die Aufrufer.
 */
export async function getViewer(): Promise<Viewer | null> {
  return null;
}
