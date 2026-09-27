import type { Metadata } from 'next';
import { Outstatic } from 'outstatic';
import { OstClient } from 'outstatic/client';

type Params = Promise<{ ost?: string[] }>;

// Der Editor gehört nicht in Suchmaschinen (Doku-Spec §5.3)
export const metadata: Metadata = {
  title: 'Redaktion – GGS Hilfe',
  robots: { index: false, follow: false },
};

export default async function Page({ params }: { params: Params }) {
  const ostData = await Outstatic();
  const { ost = [] } = await params;
  return <OstClient ostData={ostData} params={{ ost }} />;
}
