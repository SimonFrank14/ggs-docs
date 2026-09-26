'use client';

import { useSearchContext } from 'fumadocs-ui/contexts/search';
import { Search } from 'lucide-react';

export function HomeSearch(): React.JSX.Element {
  const { setOpenSearch, hotKey } = useSearchContext();

  return (
    <button type="button" className="ggs-hero-search" onClick={() => setOpenSearch(true)}>
      <Search aria-hidden="true" />
      <span className="ggs-hero-search-text">Suche nach „WLAN", „iPad", „Passwort" …</span>
      <kbd className="ggs-hero-kbd">
        {hotKey.map((key, i) => (
          <span key={i}>{key.display}</span>
        ))}
      </kbd>
    </button>
  );
}
