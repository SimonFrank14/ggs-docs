'use client';

import { useSearchContext } from 'fumadocs-ui/contexts/search';

export function HomeSearch() {
  const { setOpenSearch, hotKey } = useSearchContext();

  return (
    <button type="button" className="ggs-hero-search" onClick={() => setOpenSearch(true)}>
      <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none">
        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
        <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <span>Anleitung suchen, z. B. „WLAN" oder „AirPrint"</span>
      <kbd className="ggs-hero-kbd">
        {hotKey.map((key, i) => (
          <span key={i}>{key.display}</span>
        ))}
      </kbd>
    </button>
  );
}
