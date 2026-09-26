import type { Runbook } from '@/lib/runbook';

/**
 * Kopfkasten eines Runbooks: Anlass und benutzte Werkzeuge aus dem Frontmatter.
 * Die Freigabestufe je Werkzeug kommt später aus dem Gateway (Runbook-Spec §8.1).
 */
export function RunbookBox({ runbook }: { runbook: Runbook }) {
  return (
    <aside className="ggs-runbook" aria-label="Runbook">
      <div>
        <p className="ggs-runbook-label">Wann dieses Runbook passt</p>
        <ul>
          {runbook.anlass.map((anlass) => (
            <li key={anlass}>{anlass}</li>
          ))}
        </ul>
      </div>
      {runbook.werkzeuge && runbook.werkzeuge.length > 0 ? (
        <div>
          <p className="ggs-runbook-label">Werkzeuge</p>
          <ul className="ggs-runbook-tools">
            {runbook.werkzeuge.map((name) => (
              <li key={name}>
                <code>{name}</code>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      <p className="ggs-runbook-id">
        ID <code>{runbook.id}</code>
      </p>
    </aside>
  );
}
