import { canAccess } from '@/lib/access';
import { pageMarkdown, siteOrigin } from '@/lib/llm';
import { docsSource } from '@/lib/source';
import { getViewer } from '@/lib/viewer';

/**
 * Eine Seite als Markdown, erreichbar als `<seite>.md` (Rewrite in
 * next.config.mjs). Dieselbe Rollenprüfung wie die Seite selbst: wer die Seite
 * nicht sehen darf, bekommt 404, auch keinen Hinweis, dass es sie gibt.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug?: string[] }> },
): Promise<Response> {
  const { slug = [] } = await params;
  const page = docsSource.getPage(slug.length === 1 && slug[0] === 'index' ? [] : slug);
  if (!page || !canAccess(page.data, await getViewer())) {
    return new Response('Nicht gefunden\n', { status: 404 });
  }
  return new Response(await pageMarkdown(page, siteOrigin(request)), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8', 'Cache-Control': 'private, no-store' },
  });
}
