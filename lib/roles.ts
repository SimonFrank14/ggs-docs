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
 * Die Slugs sind die echten Rollen der Schulhomepage, dieselben wie in
 * ggs-stundenplan (`src/types/user.ts`). Die Mitgliedschaften sind Pläne des
 * Plugins „Paid Member Subscriptions" (`pms_subscription_plan_<ID>`).
 *
 * Im Zweifel bekommt eine Rolle weniger: Unbekannte Rollen zählen nicht, und
 * `admin` gibt es nur für WordPress-Administratoren.
 */
const WP_ROLE_MAP: Readonly<Record<string, readonly DocRole[]>> = {
  administrator: ['admin'],
  pms_subscription_plan_1456: ['lehrer'], // Lehrkräfte
  pms_subscription_plan_1472: ['lehrer'], // „Global Admin" im Stundenplan, zählt dort als Kollegium
  pms_subscription_plan_1455: ['schueler'], // Schülerinnen und Schüler
  pms_subscription_plan_3799: ['schueler'], // Oberstufe
  pms_subscription_plan_11698: ['eltern'], // Eltern
  // Verwaltung: noch keine eigene WordPress-Rolle bekannt
};

export function mapWpRoles(wpRoles: readonly string[]): DocRole[] {
  const mapped = new Set<DocRole>();
  for (const wp of wpRoles) {
    for (const role of WP_ROLE_MAP[wp] ?? []) mapped.add(role);
  }
  return [...mapped];
}

/**
 * Rollen aus dem Frontmatter als einfache Liste. Outstatic speichert
 * Mehrfachauswahl-Felder als `{ label, value }`, von Hand geschriebene Seiten
 * als Strings. fumadocs reicht zur Laufzeit das rohe Frontmatter durch —
 * deshalb muss jeder Leser der Rollen hierüber gehen, nicht nur das Schema.
 */
export function normalizeRoles(value: unknown): unknown[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) =>
    item && typeof item === 'object' && 'value' in item ? (item as { value: unknown }).value : item,
  );
}

/** Anzeigenamen der Rollen, z. B. auf der Konto-Seite. */
export const ROLE_LABELS: Readonly<Record<DocRole, string>> = {
  public: 'Alle',
  eltern: 'Eltern',
  schueler: 'Schülerin / Schüler',
  lehrer: 'Lehrkraft',
  verwaltung: 'Verwaltung',
  admin: 'IT-Team',
};
