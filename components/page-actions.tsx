'use client';

import { useState } from 'react';
import { Check, Copy, ExternalLink } from 'lucide-react';

/**
 * Knöpfe über dem Text einer Anleitung: Markdown kopieren (z. B. für einen
 * eigenen KI-Chat) und, bei öffentlichen Seiten, direkt in ChatGPT oder Claude
 * öffnen. Geschützte Seiten kann ein externer Dienst nicht abrufen, dort fehlen
 * diese Links deshalb.
 */
export function PageActions({
  markdownUrl,
  isPublic,
}: {
  markdownUrl: string;
  isPublic: boolean;
}): React.JSX.Element {
  const [state, setState] = useState<'idle' | 'copied' | 'error'>('idle');

  async function copy() {
    try {
      const response = await fetch(markdownUrl);
      if (!response.ok) throw new Error(String(response.status));
      await navigator.clipboard.writeText(await response.text());
      setState('copied');
    } catch {
      setState('error');
    }
    setTimeout(() => setState('idle'), 2000);
  }

  function prompt(): string {
    return `Lies ${window.location.origin}${markdownUrl} und beantworte meine Fragen zu dieser Anleitung.`;
  }

  return (
    <div className="ggs-page-actions">
      <button type="button" className="ggs-page-action" onClick={copy}>
        {state === 'copied' ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
        {state === 'copied' ? 'Kopiert' : state === 'error' ? 'Kopieren fehlgeschlagen' : 'Markdown kopieren'}
      </button>
      {isPublic ? (
        <>
          <a
            className="ggs-page-action"
            href="https://chatgpt.com/"
            target="_blank"
            rel="noreferrer"
            onClick={(event) => {
              event.currentTarget.href = `https://chatgpt.com/?hints=search&q=${encodeURIComponent(prompt())}`;
            }}
          >
            <ExternalLink aria-hidden="true" />
            In ChatGPT öffnen
          </a>
          <a
            className="ggs-page-action"
            href="https://claude.ai/new"
            target="_blank"
            rel="noreferrer"
            onClick={(event) => {
              event.currentTarget.href = `https://claude.ai/new?q=${encodeURIComponent(prompt())}`;
            }}
          >
            <ExternalLink aria-hidden="true" />
            In Claude öffnen
          </a>
        </>
      ) : null}
    </div>
  );
}
