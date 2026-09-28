'use server';

import { signIn, signOut } from './auth';
import { safeRedirectTarget } from './redirect';

/** Startet die Anmeldung bei der Schulhomepage und kehrt danach zu `ziel` zurück. */
export async function anmelden(formData: FormData): Promise<void> {
  await signIn('wordpress', { redirectTo: safeRedirectTarget(formData.get('ziel')) });
}

/** Beendet nur die eigene Sitzung, nicht die auf der Schulhomepage (Doku-Spec §3.4). */
export async function abmelden(): Promise<void> {
  await signOut({ redirectTo: '/' });
}
