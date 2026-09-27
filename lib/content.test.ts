import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { describe, expect, it } from 'vitest';
import { parse } from 'yaml';
import { findDuplicateRunbookIds } from './runbook';

/**
 * Prüft den echten Inhaltsbaum auf Regeln, die das Frontmatter-Schema pro
 * Datei nicht sehen kann. Das Schema selbst greift beim Build.
 */

const CONTENT_DIR = join(__dirname, '..', 'content', 'docs');
const PUBLIC_DIR = join(__dirname, '..', 'public');

function listMdx(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return listMdx(full);
    return /\.mdx?$/.test(entry.name) ? [full] : [];
  });
}

function frontmatter(file: string): Record<string, unknown> {
  const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(readFileSync(file, 'utf8'));
  return match ? (parse(match[1]) ?? {}) : {};
}

const pages = listMdx(CONTENT_DIR).map((file) => ({
  path: relative(CONTENT_DIR, file),
  ...(frontmatter(file) as { roles?: string[]; runbook?: { id: string } }),
}));

describe('Inhaltsbaum', () => {
  it('hat höchstens zwei Ebenen (Outstatic-Modell, Doku-Spec §4.1)', () => {
    const tooDeep = pages.filter((p) => p.path.split(/[\\/]/).length > 2).map((p) => p.path);
    expect(tooDeep).toEqual([]);
  });

  it('vergibt jede Runbook-ID nur einmal', () => {
    expect([...findDuplicateRunbookIds(pages)]).toEqual([]);
  });

  it('klassifiziert jede Seite ausdrücklich über roles', () => {
    const unclassified = pages.filter((p) => !p.roles || p.roles.length === 0).map((p) => p.path);
    expect(unclassified).toEqual([]);
  });

  it('verlinkt nur auf existierende Seiten und Dateien', () => {
    const broken: string[] = [];
    for (const file of listMdx(CONTENT_DIR)) {
      const text = readFileSync(file, 'utf8');
      for (const [, target] of text.matchAll(/\]\((\/[^)\s#?]*)/g)) {
        if (!target || target === '/') continue;
        const inPublic = existsSync(join(PUBLIC_DIR, target));
        const page = ['.md', '.mdx', '/index.md', '/index.mdx'].some((ext) =>
          existsSync(join(CONTENT_DIR, target + ext)),
        );
        if (!inPublic && !page) broken.push(`${relative(CONTENT_DIR, file)} → ${target}`);
      }
    }
    expect(broken).toEqual([]);
  });
});
