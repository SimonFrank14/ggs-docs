import 'outstatic/outstatic.css';
import type { ReactNode } from 'react';

/**
 * Eigenes Root-Layout für den Editor. Outstatic 2 erwartet `body#outstatic`
 * und bringt sein eigenes CSS mit; das Portal-CSS (Tailwind, fumadocs) würde
 * es überschreiben. Deshalb teilt sich der Editor kein Layout mit dem Portal.
 */
export default function CmsLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="de">
      <body id="outstatic">{children}</body>
    </html>
  );
}
