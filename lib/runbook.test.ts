import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { checkDocFrontmatter, docAccessFields, findDuplicateRunbookIds } from './runbook';

const schema = z.object(docAccessFields).superRefine(checkDocFrontmatter);

const runbook = {
  id: 'shared-ipad-cache-leeren',
  anlass: ['iPad meldet Speicher voll'],
  werkzeuge: ['jamf.shared_ipad.cache_leeren'],
};

describe('Frontmatter-Schema', () => {
  it('akzeptiert eine normale öffentliche Seite', () => {
    expect(schema.safeParse({ roles: ['public'], order: 10 }).success).toBe(true);
  });

  it('akzeptiert eine Seite ohne roles (fail-closed zur Laufzeit)', () => {
    expect(schema.safeParse({}).success).toBe(true);
  });

  it('weist unbekannte Rollen ab', () => {
    expect(schema.safeParse({ roles: ['hausmeister'] }).success).toBe(false);
  });

  it('akzeptiert ein gültiges Runbook', () => {
    expect(schema.safeParse({ roles: ['admin'], runbook }).success).toBe(true);
  });

  it('weist ein öffentliches Runbook ab', () => {
    const result = schema.safeParse({ roles: ['admin', 'public'], runbook });
    expect(result.success).toBe(false);
  });

  it('weist ein Runbook ohne admin ab', () => {
    expect(schema.safeParse({ roles: ['lehrer'], runbook }).success).toBe(false);
  });

  it('akzeptiert ein Runbook ohne roles, weil es dann ohnehin nur admin sieht', () => {
    expect(schema.safeParse({ runbook }).success).toBe(true);
  });

  it('weist ein Runbook ohne Anlass ab', () => {
    const result = schema.safeParse({ roles: ['admin'], runbook: { ...runbook, anlass: [] } });
    expect(result.success).toBe(false);
  });

  it.each(['Shared iPad', 'cache_leeren', '-x', 'a--b'])('weist die Runbook-ID %j ab', (id) => {
    const result = schema.safeParse({ roles: ['admin'], runbook: { ...runbook, id } });
    expect(result.success).toBe(false);
  });

  it.each(['jamf.cache', 'Jamf.ipad.leeren', 'jamf.ipad.cache.leeren', 'jamf ipad leeren'])(
    'weist den Werkzeugnamen %j ab',
    (name) => {
      const result = schema.safeParse({
        roles: ['admin'],
        runbook: { ...runbook, werkzeuge: [name] },
      });
      expect(result.success).toBe(false);
    },
  );
});

describe('findDuplicateRunbookIds', () => {
  it('meldet doppelte IDs mit allen Pfaden', () => {
    const result = findDuplicateRunbookIds([
      { path: 'a.mdx', runbook: { id: 'x' } },
      { path: 'b.mdx', runbook: { id: 'y' } },
      { path: 'c.mdx', runbook: { id: 'x' } },
      { path: 'd.mdx' },
    ]);
    expect([...result]).toEqual([['x', ['a.mdx', 'c.mdx']]]);
  });
});
