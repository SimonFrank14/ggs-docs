export const DOC_ROLES = [
  'public',
  'eltern',
  'schueler',
  'lehrer',
  'verwaltung',
  'admin',
] as const;

export type DocRole = (typeof DOC_ROLES)[number];

export function isDocRole(value: unknown): value is DocRole {
  return typeof value === 'string' && (DOC_ROLES as readonly string[]).includes(value);
}

/**
 * Abbildung WordPress-Rolle → Doku-Rollen.
 *
 * Die Slugs entsprechen der erwarteten Rollenbenennung im WordPress des GGS.
 * Sie werden gegen die Live-Benutzerverwaltung bestätigt, sobald Admin-Zugang
 * vorliegt (siehe Task 14, Step 1). Eine Abweichung ist eine Änderung an genau
 * dieser Tabelle plus der zugehörigen Testfälle.
 */
const WP_ROLE_MAP: Readonly<Record<string, readonly DocRole[]>> = {
  administrator: ['admin'],
  ggs_verwaltung: ['verwaltung'],
  ggs_lehrer: ['lehrer'],
  ggs_schueler: ['schueler'],
  ggs_eltern: ['eltern'],
};

export function mapWpRoles(wpRoles: readonly string[]): DocRole[] {
  const mapped = new Set<DocRole>();
  for (const wp of wpRoles) {
    for (const role of WP_ROLE_MAP[wp] ?? []) mapped.add(role);
  }
  return [...mapped];
}
