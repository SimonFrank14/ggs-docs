import { pageMarkdown, siteOrigin } from '@/lib/llm';
import { visiblePages } from '@/lib/source';

/** Alle öffentlichen Anleitungen als ein Markdown-Text, z. B. für ein KI-Werkzeug. */
export async function GET(request: Request): Promise<Response> {
  const origin = siteOrigin(request);
  const pages = visiblePages(null).filter((page) => page.url !== '/');
  const texts = await Promise.all(pages.map((page) => pageMarkdown(page, origin)));
  return new Response(texts.join('\n\n---\n\n') + '\n', {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
