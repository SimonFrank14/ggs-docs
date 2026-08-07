import './global.css';
import type { ReactNode } from 'react';
import { RootProvider } from 'fumadocs-ui/provider';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body>
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
