import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { DocsPage } from './source';

/**
 * Seiten als reines Markdown für KI-Werkzeuge (llms.txt, „Markdown kopieren",
 * „In ChatGPT öffnen"). fumadocs-mdx 11.10 liefert den verarbeiteten Text noch
 * nicht mit; deshalb lesen wir die Quelldatei. Im Docker-Image liegt
 * `content/docs` dafür neben dem Server (siehe Dockerfile).
 */
const CONTENT_DIR = join(process.cwd(), 'content', 'docs');

function stripFrontmatter(source: string): string {
  return source.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '').trim();
}

/** Relative Links und Bilder (`](/…)`) auf absolute Adressen umschreiben. */
function absolutize(markdown: string, origin: string): string {
  return markdown.replace(/\]\((\/[^)\s]*)/g, (_m, path: string) => `](${origin}${path}`);
}

export function pageMarkdownUrl(url: string): string {
  return url === '/' ? '/index.md' : `${url}.md`;
}

export async function pageMarkdown(page: DocsPage, origin: string): Promise<string> {
  const source = await readFile(join(CONTENT_DIR, page.path), 'utf8');
  const lines = [`# ${page.data.title}`, ''];
  if (page.data.description) lines.push(`> ${page.data.description}`, '');
  lines.push(`Quelle: ${origin}${page.url}`, '', absolutize(stripFrontmatter(source), origin));
  return lines.join('\n');
}

/**
 * Öffentliche Adresse der Doku. Hinter Traefik zeigt `request.url` auf die
 * Container-Adresse; AUTH_URL ist die echte (siehe docker-compose.yml).
 */
export function siteOrigin(request: Request): string {
  return (process.env.AUTH_URL ?? new URL(request.url).origin).replace(/\/$/, '');
}
