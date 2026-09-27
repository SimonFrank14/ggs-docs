import '../global.css';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Providers } from '@/components/providers';
import { montserrat, roboto, robotoMono } from '@/lib/fonts';

export const metadata: Metadata = {
  title: 'GGS Hilfe',
  description: 'Anleitungen und Handbücher des Goethe-Gymnasiums Stolberg',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="de"
      suppressHydrationWarning
      className={`${roboto.variable} ${montserrat.variable} ${robotoMono.variable}`}
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
