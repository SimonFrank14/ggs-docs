import { describe, expect, it } from 'vitest';
import { pageMarkdown, pageMarkdownUrl } from './llm';
import type { DocsPage } from './source';

describe('pageMarkdownUrl', () => {
  it('hängt .md an und behandelt die Startseite', () => {
    expect(pageMarkdownUrl('/wlan-drucken/schul-wlan')).toBe('/wlan-drucken/schul-wlan.md');
    expect(pageMarkdownUrl('/')).toBe('/index.md');
  });
});

describe('pageMarkdown', () => {
  it('liefert Titel, Quelle und den Text ohne Frontmatter, mit absoluten Bildern', async () => {
    // Nur die Felder, die pageMarkdown liest; die Datei ist die echte Anleitung
    const page = {
      path: 'wlan-drucken/schul-wlan.md',
      url: '/wlan-drucken/schul-wlan',
      data: { title: 'Mit dem Schul-WLAN verbinden', description: 'GGS-WLAN einrichten' },
    } as unknown as DocsPage;
    const md = await pageMarkdown(page, 'https://docs.example');
    expect(md.startsWith('# Mit dem Schul-WLAN verbinden')).toBe(true);
    expect(md).toContain('Quelle: https://docs.example/wlan-drucken/schul-wlan');
    expect(md).not.toMatch(/^status:/m);
    expect(md).toContain('](https://docs.example/images/anleitungen/schul-wlan/');
  });
});
