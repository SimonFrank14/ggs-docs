import { siteOrigin, pageMarkdownUrl } from '@/lib/llm';
import { visiblePages } from '@/lib/source';

/**
 * Verzeichnis für KI-Werkzeuge nach llmstxt.org. Enthält nur öffentliche
 * Seiten: Crawler und KI-Dienste sind nie angemeldet.
 */
export function GET(request: Request): Response {
  const origin = siteOrigin(request);
  const lines = [
    '# GGS Hilfe',
    '',
    '> Anleitungen des Goethe-Gymnasiums Stolberg zu WLAN, Drucken, Konten, iPads und Schulalltag.',
    '',
    `Alle Anleitungen als ein Text: ${origin}/llms-full.txt`,
    '',
    '## Anleitungen',
    '',
    ...visiblePages(null)
      .filter((page) => page.url !== '/')
      .map(
        (page) =>
          `- [${page.data.title}](${origin}${pageMarkdownUrl(page.url)})${
            page.data.description ? `: ${page.data.description}` : ''
          }`,
      ),
  ];
  return new Response(lines.join('\n') + '\n', {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
