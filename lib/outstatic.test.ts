import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { DOC_ROLES } from './roles';

/**
 * Outstatic-Konfiguration im Inhaltsbaum. collections.json legt fest, welche
 * Ordner der Editor anbietet. Fehlt sie, macht Outstatic JEDEN Ordner zur
 * Sammlung — auch Runbooks und MDX-Seiten mit Komponenten, die der
 * Markdown-Editor beim Speichern zerstören würde.
 */

const CONTENT_DIR = join(__dirname, '..', 'content', 'docs');
const collections = JSON.parse(readFileSync(join(CONTENT_DIR, 'collections.json'), 'utf8')) as Array<{
  slug: string;
  path: string;
}>;

describe('Outstatic-Sammlungen', () => {
  it.each(collections.map((c) => [c.slug, c]))('%s zeigt auf einen existierenden Ordner', (_slug, c) => {
    expect(c.path).toBe(`content/docs/${c.slug}`);
    expect(existsSync(join(CONTENT_DIR, c.slug))).toBe(true);
  });

  it.each(collections.map((c) => [c.slug]))('%s enthält nur Markdown, kein MDX', (slug) => {
    const mdx = readdirSync(join(CONTENT_DIR, slug)).filter((f) => f.endsWith('.mdx'));
    expect(mdx).toEqual([]);
  });

  it('bietet Runbooks nicht im Editor an', () => {
    expect(collections.map((c) => c.slug)).not.toContain('runbooks');
  });

  it.each(collections.map((c) => [c.slug]))('%s hat ein Rollenfeld mit genau den Doku-Rollen', (slug) => {
    const schema = JSON.parse(readFileSync(join(CONTENT_DIR, slug, 'schema.json'), 'utf8'));
    const values = schema.properties.roles.values.map((v: { value: string }) => v.value);
    expect([...values].sort()).toEqual([...DOC_ROLES].sort());
  });
});
