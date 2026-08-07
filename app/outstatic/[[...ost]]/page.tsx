import 'outstatic/outstatic.css';
import { Outstatic } from 'outstatic';
import { OstClient } from 'outstatic/client';

export default function Page() {
  const ostData = Outstatic();
  return <OstClient ostData={ostData} />;
}
