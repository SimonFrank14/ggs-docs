import './global.css';
import type { ReactNode } from 'react';
import { Providers } from '@/components/providers';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
