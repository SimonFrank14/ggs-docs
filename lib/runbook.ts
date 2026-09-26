import { z } from 'zod';
import { DOC_ROLES } from './roles';

/**
 * Frontmatter-Vertrag der Doku (Doku-Spec §3.3) samt Runbook-Block
 * (Runbook-Spec §3.2). Wird in `source.config.ts` zur Build-Zeit angewendet.
 */

export const RUNBOOK_ID_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/** Werkzeugnamen des Gateways, Form `bereich.objekt.verb`, z. B. `jamf.shared_ipad.cache_leeren`. */
export const TOOL_NAME_PATTERN = /^[a-z]+(\.[a-z0-9_]+){2}$/;

export const runbookSchema = z.object({
  id: z.string().regex(RUNBOOK_ID_PATTERN, 'Runbook-ID: Kleinbuchstaben, Ziffern, Bindestriche'),
  anlass: z.array(z.string().min(1)).min(1, 'Ein Runbook braucht mindestens einen Anlass'),
  stichworte: z.array(z.string().min(1)).optional(),
  werkzeuge: z
    .array(z.string().regex(TOOL_NAME_PATTERN, 'Werkzeugname: bereich.objekt.verb'))
    .optional(),
});

export type Runbook = z.infer<typeof runbookSchema>;

export const docAccessFields = {
  roles: z.array(z.enum(DOC_ROLES)).optional(),
  order: z.number().optional(),
  runbook: runbookSchema.optional(),
};

const accessSchema = z.object(docAccessFields);

/**
 * Regeln, die mehrere Felder zusammen betreffen. Ein Runbook ist nie öffentlich
 * und schließt immer `admin` ein, damit das IT-Team es sicher sieht.
 */
export function checkDocFrontmatter(
  data: z.infer<typeof accessSchema>,
  ctx: z.RefinementCtx,
): void {
  if (!data.runbook) return;
  const roles = data.roles ?? [];
  if (roles.includes('public')) {
    ctx.addIssue({
      code: 'custom',
      path: ['roles'],
      message: 'Runbooks dürfen nicht public sein',
    });
  }
  if (roles.length > 0 && !roles.includes('admin')) {
    ctx.addIssue({
      code: 'custom',
      path: ['roles'],
      message: 'Runbooks müssen die Rolle admin einschließen',
    });
  }
}

/** Findet Runbook-IDs, die mehr als einmal vergeben sind. */
export function findDuplicateRunbookIds(
  pages: ReadonlyArray<{ path: string; runbook?: { id: string } }>,
): Map<string, string[]> {
  const byId = new Map<string, string[]>();
  for (const page of pages) {
    if (!page.runbook) continue;
    byId.set(page.runbook.id, [...(byId.get(page.runbook.id) ?? []), page.path]);
  }
  return new Map([...byId].filter(([, paths]) => paths.length > 1));
}
