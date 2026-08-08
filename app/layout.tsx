import './global.css';
import type { ReactNode } from 'react';
import { Providers } from '@/components/providers';
import { roboto, robotoSlab, montserrat } from '@/lib/fonts';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="de"
      suppressHydrationWarning
      className={`${roboto.variable} ${robotoSlab.variable} ${montserrat.variable}`}
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
