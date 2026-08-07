import { DocsPage, DocsBody, DocsDescription, DocsTitle } from 'fumadocs-ui/page';
import { notFound } from 'next/navigation';
import { adminSource } from '@/lib/source';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ slug?: string[] }>;
}

export default async function AdminPage({ params }: Props) {
  const { slug } = await params;
  const page = adminSource.getPage(slug);
  if (!page) notFound();

  const MDX = page.data.body;

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDX />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return adminSource.generateParams();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = adminSource.getPage(slug);
  if (!page) notFound();

  return {
    title: `${page.data.title} – GGS Admin`,
    description: page.data.description,
    robots: { index: false, follow: false },
  };
}
