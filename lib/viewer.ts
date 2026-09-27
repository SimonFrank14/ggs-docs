import type { Viewer } from './access';
import { auth } from './auth';
import { mapWpRoles } from './roles';

/**
 * Wer die aktuelle Anfrage stellt. `null` heißt anonym.
 *
 * Liest nur das Sitzungs-Cookie, fragt WordPress also nicht bei jeder Anfrage.
 * Ist WordPress nicht erreichbar, laufen öffentliche Seiten und bestehende
 * Sitzungen weiter (Doku-Spec §7); nur die Neuanmeldung schlägt fehl.
 */
export async function getViewer(): Promise<Viewer | null> {
  const session = await auth();
  if (!session?.user) return null;
  return { roles: mapWpRoles(session.user.wpRoles ?? []), name: session.user.name || undefined };
}
