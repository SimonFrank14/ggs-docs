/**
 * Ziel nach der Anmeldung. Nur Pfade auf dieser Seite, sonst die Startseite —
 * ein `?ziel=https://…` darf niemanden auf eine fremde Seite schicken.
 */
export function safeRedirectTarget(value: unknown): string {
  if (typeof value !== 'string') return '/';
  if (!value.startsWith('/') || value.startsWith('//') || value.startsWith('/\\')) return '/';
  return value;
}
