import 'outstatic/outstatic.css';
import { Outstatic } from 'outstatic';
import { OstClient } from 'outstatic/client';

type Params = Promise<{ ost?: string[] }>;

export default async function Page({ params }: { params: Params }) {
  const ostData = await Outstatic();
  const { ost = [] } = await params;
  return <OstClient ostData={ostData} params={{ ost }} />;
}
