# GGS-Doku Phase 1 (Fundament) + Phase 2 (Zugriff) — Implementierungsplan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eine lauffähige, im GGS-Erscheinungsbild gestaltete Fumadocs-Plattform auf eigener Origin, deren Sichtbarkeit pro Seite über einen einzigen, getesteten Durchsetzungspunkt gegen fünf Rollen aus dem WordPress-OIDC geprüft wird.

**Architecture:** Alle Doku-Routen rendern serverseitig. Eine Funktion `canAccess(frontmatter, subject)` entscheidet über Sichtbarkeit; sie wird von Seitenroute, Navigationsbaum, Suche und Sitemap aufgerufen (Ask-AI und `llms.txt` folgen in Phase 5). Ein einziger Inhaltsbaum unter `content/docs`; Zielgruppen kommen aus dem Frontmatter, nicht aus der Verzeichnisstruktur. Anmeldung über Auth.js v5 als OIDC-Client gegen den WP OAuth Server.

**Tech Stack:** Next.js 15.3.4 (App Router, `output: 'standalone'`), React 19, Fumadocs 15.8.5 (`fumadocs-ui`, `fumadocs-core`), fumadocs-mdx 11.10.1, Outstatic 2.2.3, Tailwind CSS 4, Zod 4.4.3, Auth.js v5 (`next-auth@beta`), Vitest 3, Node 22 (Container) / 25 (lokal), npm.

## Global Constraints

- **Fail-closed:** Fehlt `roles` im Frontmatter oder enthält es ausschließlich unbekannte Werte, gilt die Seite als `['admin']`. Niemals als `public`.
- **Erlaubte Rollenwerte, exakt:** `public`, `eltern`, `schueler`, `lehrer`, `verwaltung`, `admin`.
- **`public` heißt für alle sichtbar**, auch für Angemeldete — nicht „nur für Nicht-Angemeldete".
- **`admin` sieht jede Seite.** Sonst ist das Modell additiv ohne Hierarchie.
- **Eine Regel, kein Nachbau:** Jede Stelle, die Inhalte ausgibt, ruft `canAccess` aus `lib/access.ts`. Die Bedingung wird nirgends dupliziert.
- **Kein Gating in `middleware.ts`.** Die Prüfung sitzt dort, wo Inhalte erzeugt werden (Server Components und Route Handler, Node-Runtime). Eine zweite Gate-Ebene in der Middleware würde von der ersten abdriften.
- **Genau zwei Verzeichnisebenen** unter `content/docs/<bereich>/<seite>.mdx`. Tiefere Pfade sind in Outstatic unsichtbar.
- **Session-Cookie host-only**, ohne `Domain`-Attribut.
- Alle Inhalte und alle nutzersichtbaren Texte auf **Deutsch**.
- Commit-Nachrichten auf Deutsch, Präfixe `feat:`, `fix:`, `chore:`, `test:`, `docs:`.

## Dateistruktur

Neu oder umgebaut in diesen beiden Phasen:

| Datei | Verantwortung |
|---|---|
| `lib/roles.ts` | Rollenkonstanten, Typwächter, Abbildung WordPress-Rolle → Doku-Rollen |
| `lib/access.ts` | `pageRoles()` und `canAccess()` — der einzige Durchsetzungspunkt |
| `lib/source.ts` | Eine Fumadocs-Quelle über `content/docs` |
| `lib/page-tree.ts` | Rollenabhängige Filterung des Navigationsbaums |
| `lib/search.ts` | Suchindex über alle Seiten (ungefiltert aufgebaut, gefiltert ausgeliefert) |
| `auth.ts` | Auth.js-Konfiguration, OIDC-Provider, Rollen in die Session |
| `source.config.ts` | Frontmatter-Schema inkl. `roles` und `order` |
| `app/(docs)/[[...slug]]/page.tsx` | Seitenroute mit Gate |
| `app/(docs)/layout.tsx` | DocsLayout mit gefiltertem Baum |
| `app/api/auth/[...nextauth]/route.ts` | Auth.js-Handler |
| `app/api/search/route.ts` | Suche mit Gate |
| `app/kein-zugriff/page.tsx` | 403-Seite |
| `app/sitemap.ts`, `app/robots.ts` | Nur `public`-Seiten |
| `scripts/validate-content.ts` | CI-Validierung des Frontmatter-Vertrags |
| `wordpress/ggs-oidc-roles.php` | mu-Plugin: `roles`-Claim in `id_token` und `/oauth/me` |

Gelöscht: `app/anleitungen/**`, `app/page.tsx`, `instrumentation.ts`, `content/admin/**`, `content/anleitungen/**`.

---

## Phase 1 — Fundament

### Task 1: Test-Infrastruktur

Ohne Test-Runner lässt sich keine der folgenden Aufgaben nach TDD bauen. Diese Aufgabe hat als Deliverable einen grünen Testlauf mit einem echten Test.

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`
- Create: `lib/roles.ts`
- Test: `lib/roles.test.ts`

**Interfaces:**
- Consumes: nichts
- Produces: `DOC_ROLES: readonly DocRole[]`, `type DocRole`, `isDocRole(value: unknown): value is DocRole`, `mapWpRoles(wpRoles: readonly string[]): DocRole[]`

- [ ] **Step 1: Abhängigkeiten installieren**

```bash
npm install --save-dev vitest@^3.0.0 @vitejs/plugin-react@^4.3.0
npm install zod@^4.4.3
```

`zod` ist bislang nur transitiv über fumadocs-mdx vorhanden. Für das eigene Frontmatter-Schema (Task 8) wird es zur direkten Abhängigkeit.

- [ ] **Step 2: Vitest konfigurieren**

Create `vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['**/*.test.ts'],
    exclude: ['node_modules/**', '.next/**', '.source/**'],
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, '.') },
  },
});
```

- [ ] **Step 3: Test-Skript ergänzen**

In `package.json` unter `scripts` einfügen:

```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 4: Den fehlschlagenden Test schreiben**

Create `lib/roles.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { DOC_ROLES, isDocRole, mapWpRoles } from './roles';

describe('DOC_ROLES', () => {
  it('enthält genau die sechs vereinbarten Werte', () => {
    expect([...DOC_ROLES]).toEqual([
      'public', 'eltern', 'schueler', 'lehrer', 'verwaltung', 'admin',
    ]);
  });
});

describe('isDocRole', () => {
  it('erkennt gültige Rollen', () => {
    expect(isDocRole('lehrer')).toBe(true);
    expect(isDocRole('admin')).toBe(true);
  });

  it('weist Unbekanntes ab', () => {
    expect(isDocRole('hausmeister')).toBe(false);
    expect(isDocRole('')).toBe(false);
    expect(isDocRole(null)).toBe(false);
    expect(isDocRole(42)).toBe(false);
  });
});

describe('mapWpRoles', () => {
  it('bildet den WordPress-Administrator auf admin ab', () => {
    expect(mapWpRoles(['administrator'])).toEqual(['admin']);
  });

  it('bildet mehrere WP-Rollen zusammen ab, ohne Duplikate', () => {
    const result = mapWpRoles(['ggs_lehrer', 'ggs_eltern', 'ggs_lehrer']);
    expect([...result].sort()).toEqual(['eltern', 'lehrer']);
  });

  it('ignoriert unbekannte WP-Rollen, statt sie durchzureichen', () => {
    expect(mapWpRoles(['irgendwas'])).toEqual([]);
  });

  it('liefert für eine leere Eingabe keine Rollen', () => {
    expect(mapWpRoles([])).toEqual([]);
  });
});
```

- [ ] **Step 5: Test laufen lassen, Fehlschlag bestätigen**

Run: `npm test`
Expected: FAIL — `Failed to resolve import "./roles"`

- [ ] **Step 6: Minimale Implementierung**

Create `lib/roles.ts`:

```ts
export const DOC_ROLES = [
  'public',
  'eltern',
  'schueler',
  'lehrer',
  'verwaltung',
  'admin',
] as const;

export type DocRole = (typeof DOC_ROLES)[number];

export function isDocRole(value: unknown): value is DocRole {
  return typeof value === 'string' && (DOC_ROLES as readonly string[]).includes(value);
}

/**
 * Abbildung WordPress-Rolle → Doku-Rollen.
 *
 * Die Slugs entsprechen der erwarteten Rollenbenennung im WordPress des GGS.
 * Sie werden gegen die Live-Benutzerverwaltung bestätigt, sobald Admin-Zugang
 * vorliegt (siehe Task 14, Step 1). Eine Abweichung ist eine Änderung an genau
 * dieser Tabelle plus der zugehörigen Testfälle.
 */
const WP_ROLE_MAP: Readonly<Record<string, readonly DocRole[]>> = {
  administrator: ['admin'],
  ggs_verwaltung: ['verwaltung'],
  ggs_lehrer: ['lehrer'],
  ggs_schueler: ['schueler'],
  ggs_eltern: ['eltern'],
};

export function mapWpRoles(wpRoles: readonly string[]): DocRole[] {
  const mapped = new Set<DocRole>();
  for (const wp of wpRoles) {
    for (const role of WP_ROLE_MAP[wp] ?? []) mapped.add(role);
  }
  return [...mapped];
}
```

- [ ] **Step 7: Test laufen lassen, Erfolg bestätigen**

Run: `npm test`
Expected: PASS, 7 Tests

- [ ] **Step 8: Commit**

```bash
git add package.json package-lock.json vitest.config.ts lib/roles.ts lib/roles.test.ts
git commit -m "test: Vitest einrichten und Rollenmodell mit Tests anlegen"
```

---

### Task 2: Ein Inhaltsbaum statt zwei

Der Scaffold führt zwei `defineDocs`-Quellen mit zwei Navigationen und zwei Routenbäumen. Das wird auf eine Quelle unter `content/docs` zusammengezogen. Die Doku liegt auf der Wurzel der eigenen Origin, nicht unter `/anleitungen`.

**Files:**
- Modify: `source.config.ts`
- Modify: `lib/source.ts`
- Create: `app/(docs)/layout.tsx`
- Create: `app/(docs)/[[...slug]]/page.tsx`
- Create: `content/docs/index.mdx`
- Delete: `app/anleitungen/` (gesamtes Verzeichnis), `app/page.tsx`, `content/anleitungen/`, `content/admin/`

**Interfaces:**
- Consumes: nichts aus Task 1
- Produces: `docsSource` aus `lib/source.ts` mit `getPage(slug?: string[])`, `getPages()`, `pageTree`

- [ ] **Step 1: Alte Routen und Beispielinhalte entfernen**

```bash
git rm -r app/anleitungen content/anleitungen content/admin
git rm app/page.tsx
```

`app/page.tsx` muss weg: eine Wurzel-`page.tsx` und ein Wurzel-Catch-All `app/(docs)/[[...slug]]/page.tsx` matchen beide `/`, was Next.js als Routenkonflikt abbricht. Die Startseite kommt künftig aus `content/docs/index.mdx`.

Die drei Beispieldateien des Scaffolds entfallen ersatzlos — Phase 1 geht ohne echte Inhalte live, weil der Zugriffsschutz erst in Phase 2 greift. Einzige Ausnahme ist die Startseite in Step 4, die als `public` klassifiziert und damit unkritisch ist.

- [ ] **Step 2: Eine Inhaltsquelle definieren**

Replace `source.config.ts` entirely:

```ts
import { defineDocs, defineConfig } from 'fumadocs-mdx/config';

export const docs = defineDocs({
  dir: 'content/docs',
});

export default defineConfig();
```

Der bisherige explizite `rehypeCode` entfällt: fumadocs-mdx bringt ihn bereits als Standard-Plugin mit, ein zweiter Eintrag ließe ihn doppelt laufen. Ebenso bleibt `remarkStructure` als Standard aktiv — es erzeugt das `structuredData`-Feld, auf das der Suchindex in Task 12 zugreift.

Das Frontmatter-Schema mit `roles` und `order` kommt in Task 7 dazu. Hier zunächst nur die Zusammenführung auf eine Quelle.

- [ ] **Step 3: Loader auf eine Quelle umstellen**

Replace `lib/source.ts` entirely:

```ts
import { loader } from 'fumadocs-core/source';
import { docs } from '@/.source';

export const docsSource = loader({
  baseUrl: '/',
  source: docs.toFumadocsSource(),
});
```

- [ ] **Step 4: Startseite anlegen**

Create `content/docs/index.mdx`:

```mdx
---
title: Dokumentation
description: Anleitungen und Handbücher des Goethe-Gymnasiums Stolberg
roles: [public]
order: 0
---

Willkommen in der Dokumentation des Goethe-Gymnasiums Stolberg.

Die Anleitungen werden derzeit von der Schulhomepage hierher übertragen.
```

- [ ] **Step 5: Layout und Seitenroute anlegen**

Create `app/(docs)/layout.tsx`:

```tsx
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import type { ReactNode } from 'react';
import { docsSource } from '@/lib/source';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      tree={docsSource.pageTree}
      nav={{
        title: 'GGS Dokumentation',
        url: '/',
      }}
      links={[
        {
          text: 'Zur Schulhomepage',
          url: 'https://goethe-gymnasium-stolberg.de',
          external: true,
        },
      ]}
    >
      {children}
    </DocsLayout>
  );
}
```

Create `app/(docs)/[[...slug]]/page.tsx`:

```tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DocsPage, DocsBody, DocsDescription, DocsTitle } from 'fumadocs-ui/page';
import { docsSource } from '@/lib/source';

interface Props {
  params: Promise<{ slug?: string[] }>;
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const page = docsSource.getPage(slug);
  if (!page) notFound();

  const MDX = page.data.body;

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDX />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = docsSource.getPage(slug);
  if (!page) return {};

  return {
    title: `${page.data.title} – GGS Dokumentation`,
    description: page.data.description,
  };
}
```

Kein `generateStaticParams`: Die Architekturentscheidung ist einheitlich serverseitiges Rendering. Statisches Vorrendern würde in Phase 2 geschützte Seiten in den Build-Output backen.

Der alte `app/anleitungen/[[...slug]]/page.tsx` importierte zusätzlich `getPage, getPages` aus `@/lib/source` — beides existierte dort nie und hätte den Produktionsbuild scheitern lassen. Die neue Datei importiert nur, was es gibt.

- [ ] **Step 6: Bauen und prüfen**

Run: `npx fumadocs-mdx && npx tsc --noEmit`
Expected: keine Ausgabe (keine Typfehler)

Run: `npm run build`
Expected: Build erfolgreich, Route `/` und `/[[...slug]]` als dynamisch (`ƒ`) aufgeführt

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: eine Inhaltsquelle unter content/docs statt zwei getrennter Sections"
```

---

### Task 3: Build-Defekte beseitigen

Zwei Defekte verhindern bzw. verschleiern derzeit einen sauberen Produktionsbuild.

**Files:**
- Modify: `Dockerfile:22`
- Delete: `instrumentation.ts`
- Create: `public/.gitkeep`

**Interfaces:**
- Consumes: nichts
- Produces: baubares Container-Image

- [ ] **Step 1: `public/`-Verzeichnis anlegen**

```bash
mkdir -p public && touch public/.gitkeep
```

`Dockerfile:22` kopiert `/app/public`; das Verzeichnis existiert im Repo nicht, wodurch der Image-Build an dieser Zeile abbricht. Ab Phase 3 landen dort die Screenshots aus der WordPress-Migration.

- [ ] **Step 2: `instrumentation.ts` entfernen**

```bash
git rm instrumentation.ts
```

Die Datei legte beim Serverstart einen globalen `localStorage`-Stub an — ein von allen gleichzeitigen Requests geteiltes Objekt. Unter einheitlichem SSR mit rollenabhängigen Inhalten ist ein Mechanismus, der SSR-Fehler stumm schluckt, das falsche Werkzeug.

- [ ] **Step 3: Prüfen, ob der SSR-Fehler ohne den Stub wiederkehrt**

Run: `npm run build && npm start`
Dann in einem zweiten Terminal: `curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/`
Expected: `200`

Tritt stattdessen ein `localStorage is not defined` auf, ist die Ursache eine fumadocs-ui-Komponente ohne SSR-Wächter. Dann **nicht** den Stub zurückholen, sondern in `components/providers.tsx` prüfen, ob `RootProvider` die auslösende Komponente ist, und die betroffene Komponente über `next/dynamic` mit `ssr: false` laden. Der Server bleibt zustandslos.

- [ ] **Step 4: Image-Build verifizieren**

Run: `docker build -t ggs-docs:test .`
Expected: Build läuft bis `Successfully tagged` durch

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "fix: public-Verzeichnis anlegen und globalen localStorage-Stub entfernen"
```

---

### Task 4: Marken-Tokens und Typografie

Die bestehenden Farbwerte stammen laut Kommentar aus einem Screenshot und sind teilweise tot (`text-ggs-accent` referenziert eine nicht existierende Variable). Sie werden durch die aus dem Elementor-Kit der Live-Seite extrahierten Werte ersetzt.

**Files:**
- Modify: `app/global.css`
- Modify: `app/layout.tsx`
- Create: `lib/fonts.ts`
- Test: `lib/contrast.test.ts`
- Create: `lib/contrast.ts`

**Interfaces:**
- Consumes: nichts
- Produces: CSS-Variablen `--color-ggs-*`, `contrastRatio(hexA: string, hexB: string): number`

- [ ] **Step 1: Den fehlschlagenden Kontrast-Test schreiben**

Die Markenfarben sind für Fließtext nicht ausreichend kontrastreich. Der Test hält die Regel fest, statt sie in einem Kommentar zu behaupten.

Create `lib/contrast.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { contrastRatio } from './contrast';

const WHITE = '#ffffff';

describe('contrastRatio', () => {
  it('berechnet den Maximalkontrast Schwarz auf Weiß', () => {
    expect(contrastRatio('#000000', WHITE)).toBeCloseTo(21, 1);
  });

  it('ist symmetrisch', () => {
    expect(contrastRatio('#D2A500', WHITE)).toBeCloseTo(contrastRatio(WHITE, '#D2A500'), 5);
  });
});

describe('GGS-Farbtokens gegen WCAG AA', () => {
  it('belegt, dass die Markenfarben als Textfarbe durchfallen', () => {
    expect(contrastRatio('#D2A500', WHITE)).toBeLessThan(4.5);
    expect(contrastRatio('#FDD700', WHITE)).toBeLessThan(4.5);
  });

  it('erfüllt mit der abgeleiteten Linkfarbe AA für Fließtext', () => {
    expect(contrastRatio('#8A6A00', WHITE)).toBeGreaterThanOrEqual(4.5);
  });

  it('erfüllt mit der Fließtextfarbe AA', () => {
    expect(contrastRatio('#626262', WHITE)).toBeGreaterThanOrEqual(4.5);
  });
});
```

- [ ] **Step 2: Test laufen lassen, Fehlschlag bestätigen**

Run: `npm test -- lib/contrast.test.ts`
Expected: FAIL — `Failed to resolve import "./contrast"`

- [ ] **Step 3: Kontrastberechnung implementieren**

Create `lib/contrast.ts`:

```ts
function channel(value: number): number {
  const c = value / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function relativeLuminance(hex: string): number {
  const normalized = hex.replace('#', '');
  const r = Number.parseInt(normalized.slice(0, 2), 16);
  const g = Number.parseInt(normalized.slice(2, 4), 16);
  const b = Number.parseInt(normalized.slice(4, 6), 16);
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/** Kontrastverhältnis nach WCAG 2.1, Wertebereich 1–21. */
export function contrastRatio(hexA: string, hexB: string): number {
  const a = relativeLuminance(hexA);
  const b = relativeLuminance(hexB);
  const lighter = Math.max(a, b);
  const darker = Math.min(a, b);
  return (lighter + 0.05) / (darker + 0.05);
}
```

- [ ] **Step 4: Test laufen lassen, Erfolg bestätigen**

Run: `npm test -- lib/contrast.test.ts`
Expected: PASS, 5 Tests

Sollte `#8A6A00` knapp unter 4.5 landen, den Wert schrittweise abdunkeln (`#856600`, `#7F6200`), bis der Test grün ist, und denselben Wert in Step 6 eintragen. Der Test ist die Autorität, nicht der Kommentar.

- [ ] **Step 5: Schriften selbst hosten**

Create `lib/fonts.ts`:

```ts
import { Roboto, Roboto_Slab, Montserrat } from 'next/font/google';

export const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-ggs-sans',
  display: 'swap',
});

export const robotoSlab = Roboto_Slab({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-ggs-serif',
  display: 'swap',
});

export const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['600'],
  variable: '--font-ggs-nav',
  display: 'swap',
});
```

`next/font/google` lädt die Dateien zur Build-Zeit herunter und liefert sie von der eigenen Origin aus. Zur Laufzeit gibt es keine Verbindung zu Google — und keine zum WordPress-Server.

- [ ] **Step 6: Tokens in die Stylesheet-Ebene ziehen**

Replace `app/global.css` entirely:

```css
@import 'tailwindcss';
@import 'fumadocs-ui/style.css';

@theme {
  /* Aus dem Elementor-Kit der Live-Seite extrahiert */
  --color-ggs-primary: #fdd700;      /* Flächen, Buttons, Zierlinien */
  --color-ggs-secondary: #333333;    /* Überschriften */
  --color-ggs-text: #626262;         /* Fließtext, Navigation */
  --color-ggs-accent: #dfc15e;       /* gedämpftes Gold */
  --color-ggs-surface: #eeeeee;

  /* Abgeleitet: erfüllt WCAG AA auf Weiß, siehe lib/contrast.test.ts */
  --color-ggs-link: #8a6a00;

  --font-ggs-sans: var(--font-ggs-sans);
  --font-ggs-serif: var(--font-ggs-serif);
  --font-ggs-nav: var(--font-ggs-nav);

  /* Fumadocs-Überschreibungen */
  --color-fd-primary: var(--color-ggs-link);
  --color-fd-primary-foreground: #ffffff;
}

:root {
  --fd-nav-height: 3.5rem;
}

body {
  font-family: var(--font-ggs-sans), system-ui, sans-serif;
  color: var(--color-ggs-text);
}

h1, h2, h3, h4 {
  color: var(--color-ggs-secondary);
}

/* Gelbe Zierlinie unter Abschnittsüberschriften, wie auf der Schulhomepage */
.prose h2::after {
  content: '';
  display: block;
  width: 3rem;
  height: 3px;
  margin-top: 0.5rem;
  background: var(--color-ggs-primary);
}
```

`--color-ggs-primary` wird bewusst **nicht** als Text- oder Linkfarbe verwendet — es erreicht auf Weiß rund 1,4:1.

- [ ] **Step 7: Schriften im Root-Layout einhängen**

Replace `app/layout.tsx` entirely:

```tsx
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
```

- [ ] **Step 8: Mobilansicht prüfen**

Run: `npm run build && npm start`

Die Seite im Browser bei einer Viewport-Breite von 375 px öffnen. Die Hauptzielgruppe der öffentlichen Anleitungen liest am Telefon — diese Ansicht wird zuerst geprüft, nicht zuletzt.

Expected: Sidebar eingeklappt hinter Menüschalter, Fließtext ohne horizontales Scrollen, Überschriften lesbar, gelbe Zierlinie sichtbar.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: GGS-Marken-Tokens, selbst gehostete Schriften und AA-konforme Linkfarbe"
```

---

### Task 5: Deployment auf die Übergangsadresse

**Files:**
- Modify: `docker-compose.yml`
- Modify: `.env.example`

**Interfaces:**
- Consumes: baubares Image aus Task 3
- Produces: erreichbare Instanz unter `docs-neu.goethe-gymnasium-stolberg.de`

- [ ] **Step 1: Traefik-Labels auf die eigene Origin umstellen**

Replace `docker-compose.yml` entirely:

```yaml
services:
  ggs-docs:
    image: ghcr.io/simonfrank14/ggs-docs:latest
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      # Outstatic
      - OUTSTATIC_SECRET=${OUTSTATIC_SECRET}
      - GITHUB_ACCESS_TOKEN=${GITHUB_ACCESS_TOKEN}
      - OST_GITHUB_ID=${OST_GITHUB_ID}
      - OST_GITHUB_SECRET=${OST_GITHUB_SECRET}
      - OST_CONTENT_PATH=content/docs
      - OST_REPO_OWNER=SimonFrank14
      - OST_REPO_SLUG=ggs-docs
      - OST_REPO_BRANCH=main
      # Auth.js / WordPress-OIDC (Phase 2)
      - AUTH_SECRET=${AUTH_SECRET}
      - AUTH_URL=https://docs-neu.goethe-gymnasium-stolberg.de
      - AUTH_TRUST_HOST=true
      - WP_OIDC_ISSUER=https://goethe-gymnasium-stolberg.de
      - WP_OIDC_CLIENT_ID=${WP_OIDC_CLIENT_ID}
      - WP_OIDC_CLIENT_SECRET=${WP_OIDC_CLIENT_SECRET}
    networks:
      - proxy-network
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.ggs-docs.rule=Host(`docs-neu.goethe-gymnasium-stolberg.de`)"
      - "traefik.http.routers.ggs-docs.entrypoints=websecure"
      - "traefik.http.routers.ggs-docs.tls.certresolver=letsencrypt"
      - "traefik.http.services.ggs-docs.loadbalancer.server.port=3000"

networks:
  proxy-network:
    external: true
```

Die frühere Pfad-Regel auf `goethe-gymnasium-stolberg.de` entfällt: WordPress läuft auf einem anderen Server, eine gemeinsame Origin ist nicht herstellbar. Der eigene Router für `/outstatic` entfällt ebenfalls — bei eigener Origin liegt Outstatic ohnehin hinter demselben Router.

- [ ] **Step 2: `.env.example` angleichen**

Replace `.env.example` entirely:

```bash
# Outstatic – zufälliger geheimer String: openssl rand -hex 32
OUTSTATIC_SECRET=

# GitHub Personal Access Token mit repo-Scope (für Outstatic-Commits)
GITHUB_ACCESS_TOKEN=

# GitHub OAuth App (Outstatic-Login)
# Callback: https://docs-neu.goethe-gymnasium-stolberg.de/api/outstatic/callback
OST_GITHUB_ID=
OST_GITHUB_SECRET=

OST_CONTENT_PATH=content/docs
OST_REPO_OWNER=SimonFrank14
OST_REPO_SLUG=ggs-docs
OST_REPO_BRANCH=main

# Auth.js – zufälliger geheimer String: openssl rand -hex 32
AUTH_SECRET=
AUTH_URL=https://docs-neu.goethe-gymnasium-stolberg.de
AUTH_TRUST_HOST=true

# WordPress OAuth Server (OIDC)
# Redirect-URIs im WP-Client eintragen, BEIDE:
#   https://docs-neu.goethe-gymnasium-stolberg.de/api/auth/callback/wordpress
#   https://docs.goethe-gymnasium-stolberg.de/api/auth/callback/wordpress
WP_OIDC_ISSUER=https://goethe-gymnasium-stolberg.de
WP_OIDC_CLIENT_ID=
WP_OIDC_CLIENT_SECRET=
```

- [ ] **Step 3: DNS-Eintrag und Deploy**

Voraussetzung vor dem Deploy: ein A- bzw. AAAA-Eintrag für `docs-neu.goethe-gymnasium-stolberg.de` auf den Docker-Host, sowie die Festlegung, auf welchem Node der Container läuft (offener Punkt 1 des Specs).

Run auf dem Docker-Host: `docker compose up -d`

- [ ] **Step 4: Erreichbarkeit prüfen**

Run: `curl -s -o /dev/null -w "%{http_code}\n" https://docs-neu.goethe-gymnasium-stolberg.de/`
Expected: `200`

- [ ] **Step 5: Commit**

```bash
git add docker-compose.yml .env.example
git commit -m "chore: Deployment auf eigene Origin docs-neu umstellen"
```

---

## Phase 2 — Zugriff

### Task 6: Der Durchsetzungspunkt

Die zentrale Funktion des gesamten Entwurfs. Sie bekommt die gründlichsten Tests im Projekt.

**Files:**
- Create: `lib/access.ts`
- Test: `lib/access.test.ts`

**Interfaces:**
- Consumes: `DocRole`, `isDocRole` aus `lib/roles.ts` (Task 1)
- Produces:
  - `interface AccessSubject { roles: DocRole[] }`
  - `interface PageAccess { roles?: unknown }`
  - `ANONYMOUS: AccessSubject`
  - `pageRoles(frontmatter: PageAccess): DocRole[]`
  - `canAccess(frontmatter: PageAccess, subject: AccessSubject | null): boolean`

- [ ] **Step 1: Den fehlschlagenden Test schreiben**

Create `lib/access.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { ANONYMOUS, canAccess, pageRoles } from './access';
import type { DocRole } from './roles';

const subject = (...roles: DocRole[]) => ({ roles });

describe('pageRoles — Fail-closed-Verhalten', () => {
  it('behandelt fehlendes roles als nur-admin', () => {
    expect(pageRoles({})).toEqual(['admin']);
  });

  it('behandelt roles: [] als nur-admin', () => {
    expect(pageRoles({ roles: [] })).toEqual(['admin']);
  });

  it('behandelt einen Nicht-Array-Wert als nur-admin', () => {
    expect(pageRoles({ roles: 'public' })).toEqual(['admin']);
    expect(pageRoles({ roles: null })).toEqual(['admin']);
  });

  it('behandelt ausschließlich unbekannte Werte als nur-admin', () => {
    expect(pageRoles({ roles: ['hausmeister', 'gast'] })).toEqual(['admin']);
  });

  it('verwirft unbekannte Werte, behält gültige', () => {
    expect(pageRoles({ roles: ['lehrer', 'hausmeister'] })).toEqual(['lehrer']);
  });

  it('gibt gültige Rollen unverändert zurück', () => {
    expect(pageRoles({ roles: ['eltern', 'schueler'] })).toEqual(['eltern', 'schueler']);
  });
});

describe('canAccess — öffentliche Seiten', () => {
  it('zeigt public-Seiten anonymen Besuchern', () => {
    expect(canAccess({ roles: ['public'] }, null)).toBe(true);
  });

  it('zeigt public-Seiten auch Angemeldeten', () => {
    expect(canAccess({ roles: ['public'] }, subject('eltern'))).toBe(true);
  });

  it('zeigt public-Seiten auch bei zusätzlichen Rollen im Frontmatter', () => {
    expect(canAccess({ roles: ['public', 'admin'] }, null)).toBe(true);
  });
});

describe('canAccess — geschützte Seiten', () => {
  it('verbirgt geschützte Seiten vor anonymen Besuchern', () => {
    expect(canAccess({ roles: ['lehrer'] }, null)).toBe(false);
    expect(canAccess({ roles: ['lehrer'] }, ANONYMOUS)).toBe(false);
  });

  it('zeigt sie der passenden Rolle', () => {
    expect(canAccess({ roles: ['lehrer'] }, subject('lehrer'))).toBe(true);
  });

  it('zeigt sie bei mindestens einer Überschneidung', () => {
    expect(canAccess({ roles: ['lehrer', 'verwaltung'] }, subject('verwaltung'))).toBe(true);
  });

  it('verbirgt sie vor einer nicht genannten Rolle', () => {
    expect(canAccess({ roles: ['lehrer'] }, subject('eltern'))).toBe(false);
  });

  it('kennt keine Hierarchie zwischen den Zielgruppen', () => {
    expect(canAccess({ roles: ['eltern'] }, subject('lehrer'))).toBe(false);
    expect(canAccess({ roles: ['schueler'] }, subject('verwaltung'))).toBe(false);
  });
});

describe('canAccess — admin', () => {
  it('sieht jede geschützte Seite', () => {
    expect(canAccess({ roles: ['eltern'] }, subject('admin'))).toBe(true);
    expect(canAccess({ roles: ['verwaltung'] }, subject('admin'))).toBe(true);
  });

  it('sieht auch unklassifizierte Seiten', () => {
    expect(canAccess({}, subject('admin'))).toBe(true);
  });

  it('ist die einzige Rolle, die unklassifizierte Seiten sieht', () => {
    expect(canAccess({}, subject('lehrer'))).toBe(false);
    expect(canAccess({}, subject('verwaltung'))).toBe(false);
    expect(canAccess({}, null)).toBe(false);
  });
});

describe('canAccess — Subjekt ohne Rollen', () => {
  it('behandelt ein angemeldetes Subjekt ohne Rollen wie anonym', () => {
    expect(canAccess({ roles: ['public'] }, subject())).toBe(true);
    expect(canAccess({ roles: ['lehrer'] }, subject())).toBe(false);
  });
});
```

- [ ] **Step 2: Test laufen lassen, Fehlschlag bestätigen**

Run: `npm test -- lib/access.test.ts`
Expected: FAIL — `Failed to resolve import "./access"`

- [ ] **Step 3: Implementierung**

Create `lib/access.ts`:

```ts
import { isDocRole, type DocRole } from './roles';

export interface AccessSubject {
  roles: DocRole[];
}

/** Nur die Felder des Frontmatters, die für den Zugriff zählen. */
export interface PageAccess {
  roles?: unknown;
}

/** Ein nicht angemeldeter Besucher besitzt genau die Rolle `public`. */
export const ANONYMOUS: AccessSubject = { roles: ['public'] };

/**
 * Ermittelt die Zielrollen einer Seite aus dem Frontmatter.
 *
 * Fail-closed: Fehlt die Angabe, ist sie kein Array oder enthält sie
 * ausschließlich unbekannte Werte, gilt die Seite als nur für `admin`
 * sichtbar. Eine vergessene Klassifikation macht eine Seite unsichtbar,
 * nicht öffentlich.
 */
export function pageRoles(frontmatter: PageAccess): DocRole[] {
  const raw = frontmatter.roles;
  if (!Array.isArray(raw)) return ['admin'];

  const valid = raw.filter(isDocRole);
  return valid.length > 0 ? valid : ['admin'];
}

/**
 * Der einzige Durchsetzungspunkt für Sichtbarkeit.
 *
 * Aufrufer: Seitenroute, Navigationsbaum, Suche, Sitemap — ab Phase 5
 * zusätzlich Ask-AI-Retrieval, llms.txt und die Pro-Seite-Markdown-Route.
 * Die Bedingung wird an keiner dieser Stellen nachgebaut.
 */
export function canAccess(
  frontmatter: PageAccess,
  subject: AccessSubject | null,
): boolean {
  const required = pageRoles(frontmatter);
  if (required.includes('public')) return true;

  const roles = subject?.roles ?? ANONYMOUS.roles;
  if (roles.includes('admin')) return true;

  return required.some((role) => roles.includes(role));
}
```

- [ ] **Step 4: Test laufen lassen, Erfolg bestätigen**

Run: `npm test -- lib/access.test.ts`
Expected: PASS, 18 Tests

- [ ] **Step 5: Commit**

```bash
git add lib/access.ts lib/access.test.ts
git commit -m "feat: canAccess als einzigen Durchsetzungspunkt für Sichtbarkeit"
```

---

### Task 7: Frontmatter-Vertrag im Schema verankern

**Files:**
- Modify: `source.config.ts`
- Test: `source.config.test.ts`

**Interfaces:**
- Consumes: `DOC_ROLES` aus `lib/roles.ts`
- Produces: `docsFrontmatterSchema` — Zod-Schema mit `title`, `description`, `icon`, `full`, `roles`, `order`

- [ ] **Step 1: Den fehlschlagenden Test schreiben**

Create `source.config.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { docsFrontmatterSchema } from './source.config';

const base = { title: 'Beispielseite' };

describe('docsFrontmatterSchema', () => {
  it('akzeptiert eine Seite mit gültigen Rollen', () => {
    const result = docsFrontmatterSchema.safeParse({ ...base, roles: ['public'] });
    expect(result.success).toBe(true);
  });

  it('akzeptiert mehrere Rollen', () => {
    const result = docsFrontmatterSchema.safeParse({
      ...base,
      roles: ['lehrer', 'verwaltung'],
    });
    expect(result.success).toBe(true);
  });

  it('weist unbekannte Rollen ab, statt sie stillschweigend zu verwerfen', () => {
    const result = docsFrontmatterSchema.safeParse({ ...base, roles: ['hausmeister'] });
    expect(result.success).toBe(false);
  });

  it('lässt fehlendes roles zu — canAccess behandelt es fail-closed', () => {
    const result = docsFrontmatterSchema.safeParse(base);
    expect(result.success).toBe(true);
  });

  it('akzeptiert order als Zahl', () => {
    const result = docsFrontmatterSchema.safeParse({ ...base, order: 20 });
    expect(result.success).toBe(true);
  });

  it('weist order als Text ab', () => {
    const result = docsFrontmatterSchema.safeParse({ ...base, order: 'zwanzig' });
    expect(result.success).toBe(false);
  });

  it('verlangt einen Titel', () => {
    expect(docsFrontmatterSchema.safeParse({ roles: ['public'] }).success).toBe(false);
  });
});
```

Zur vierten Zusicherung: Das Schema erzwingt `roles` **nicht**, weil ein harter Schema-Fehler den gesamten Build unlesbar abbrechen ließe. Die fehlende Angabe wird an zwei Stellen aufgefangen — zur Laufzeit fail-closed durch `canAccess` (Task 6) und vor dem Deploy mit klarer Meldung durch das Validierungsskript (Task 8).

- [ ] **Step 2: Test laufen lassen, Fehlschlag bestätigen**

Run: `npm test -- source.config.test.ts`
Expected: FAIL — `docsFrontmatterSchema` ist kein Export von `./source.config`

- [ ] **Step 3: Schema ergänzen**

Replace `source.config.ts` entirely:

```ts
import { defineDocs, defineConfig, frontmatterSchema } from 'fumadocs-mdx/config';
import { z } from 'zod';
import { DOC_ROLES } from './lib/roles';

export const docsFrontmatterSchema = frontmatterSchema.extend({
  /**
   * Zielgruppen der Seite. Fehlt die Angabe, gilt die Seite zur Laufzeit
   * als nur für `admin` sichtbar (siehe lib/access.ts). Das Validierungs-
   * skript meldet sie vor dem Deploy.
   */
  roles: z.array(z.enum(DOC_ROLES)).optional(),
  /** Position in der Navigation. Fehlt sie, wird alphabetisch sortiert. */
  order: z.number().optional(),
});

export const docs = defineDocs({
  dir: 'content/docs',
  docs: { schema: docsFrontmatterSchema },
});

export default defineConfig();
```

- [ ] **Step 4: Test laufen lassen, Erfolg bestätigen**

Run: `npm test -- source.config.test.ts`
Expected: PASS, 7 Tests

- [ ] **Step 5: Typen neu erzeugen und Build prüfen**

Run: `npx fumadocs-mdx && npx tsc --noEmit`
Expected: keine Ausgabe

- [ ] **Step 6: Commit**

```bash
git add source.config.ts source.config.test.ts
git commit -m "feat: roles und order im Frontmatter-Schema verankern"
```

---

### Task 8: Inhaltsvalidierung vor dem Deploy

Das Sicherheitsnetz unter der Fail-closed-Regel. Ohne diesen Schritt verschwände eine vergessene Klassifikation unbemerkt aus der Navigation.

**Files:**
- Create: `scripts/validate-content.ts`
- Test: `scripts/validate-content.test.ts`
- Modify: `package.json`
- Create: `.github/workflows/ci.yml`

**Interfaces:**
- Consumes: `DOC_ROLES`, `isDocRole` aus `lib/roles.ts`
- Produces: `validateFrontmatter(file: string, frontmatter: Record<string, unknown>): string[]` — Liste von Fehlermeldungen, leer bei gültigem Inhalt

- [ ] **Step 1: Den fehlschlagenden Test schreiben**

Create `scripts/validate-content.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { validateFrontmatter } from './validate-content';

describe('validateFrontmatter', () => {
  it('meldet nichts bei gültigem Frontmatter', () => {
    expect(validateFrontmatter('a.mdx', { title: 'A', roles: ['public'] })).toEqual([]);
  });

  it('meldet fehlendes roles mit Dateinamen', () => {
    const errors = validateFrontmatter('ipads/einrichtung.mdx', { title: 'A' });
    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain('ipads/einrichtung.mdx');
    expect(errors[0]).toContain('roles');
  });

  it('meldet leeres roles', () => {
    expect(validateFrontmatter('a.mdx', { title: 'A', roles: [] })).toHaveLength(1);
  });

  it('meldet unbekannte Rollenwerte namentlich', () => {
    const errors = validateFrontmatter('a.mdx', { title: 'A', roles: ['lehrer', 'hausmeister'] });
    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain('hausmeister');
  });

  it('meldet fehlenden Titel', () => {
    expect(validateFrontmatter('a.mdx', { roles: ['public'] })).toHaveLength(1);
  });

  it('meldet mehrere Probleme einzeln', () => {
    expect(validateFrontmatter('a.mdx', {})).toHaveLength(2);
  });
});
```

- [ ] **Step 2: Test laufen lassen, Fehlschlag bestätigen**

Run: `npm test -- scripts/validate-content.test.ts`
Expected: FAIL — `Failed to resolve import "./validate-content"`

- [ ] **Step 3: Implementierung**

Create `scripts/validate-content.ts`:

```ts
import { readFileSync } from 'node:fs';
import { globSync } from 'node:fs';
import path from 'node:path';
import { DOC_ROLES, isDocRole } from '../lib/roles';

export function validateFrontmatter(
  file: string,
  frontmatter: Record<string, unknown>,
): string[] {
  const errors: string[] = [];

  if (typeof frontmatter.title !== 'string' || frontmatter.title.trim() === '') {
    errors.push(`${file}: 'title' fehlt oder ist leer.`);
  }

  const roles = frontmatter.roles;
  if (!Array.isArray(roles) || roles.length === 0) {
    errors.push(
      `${file}: 'roles' fehlt oder ist leer. Erlaubt: ${DOC_ROLES.join(', ')}. ` +
        `Ohne Angabe ist die Seite nur für 'admin' sichtbar.`,
    );
  } else {
    const unknown = roles.filter((role) => !isDocRole(role));
    if (unknown.length > 0) {
      errors.push(
        `${file}: unbekannte Rollen ${unknown.join(', ')}. Erlaubt: ${DOC_ROLES.join(', ')}.`,
      );
    }
  }

  return errors;
}

/** Liest den YAML-Frontmatter-Block einer MDX-Datei als flaches Objekt. */
export function parseFrontmatter(source: string): Record<string, unknown> {
  const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(source);
  if (!match) return {};

  const result: Record<string, unknown> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const kv = /^([A-Za-z_][\w-]*):\s*(.*)$/.exec(line);
    if (!kv) continue;

    const [, key, rawValue] = kv;
    const value = rawValue.trim();

    if (value.startsWith('[') && value.endsWith(']')) {
      const inner = value.slice(1, -1).trim();
      result[key] = inner === ''
        ? []
        : inner.split(',').map((v) => v.trim().replace(/^["']|["']$/g, ''));
    } else if (value !== '' && !Number.isNaN(Number(value))) {
      result[key] = Number(value);
    } else {
      result[key] = value.replace(/^["']|["']$/g, '');
    }
  }
  return result;
}

function main(): void {
  const files = globSync('content/docs/**/*.mdx');
  const errors = files.flatMap((file) =>
    validateFrontmatter(
      path.relative('content/docs', file).replaceAll('\\', '/'),
      parseFrontmatter(readFileSync(file, 'utf8')),
    ),
  );

  if (errors.length > 0) {
    console.error(`Inhaltsvalidierung fehlgeschlagen (${errors.length} Problem(e)):\n`);
    for (const error of errors) console.error(`  - ${error}`);
    process.exit(1);
  }

  console.log(`Inhaltsvalidierung bestanden: ${files.length} Datei(en) geprüft.`);
}

if (process.argv[1]?.endsWith('validate-content.ts')) main();
```

`globSync` stammt aus `node:fs` (ab Node 22 stabil). Der Container läuft auf `node:22-alpine`, lokal auf Node 25 — beide erfüllen das.

- [ ] **Step 4: Test laufen lassen, Erfolg bestätigen**

Run: `npm test -- scripts/validate-content.test.ts`
Expected: PASS, 6 Tests

- [ ] **Step 5: Skript verdrahten**

In `package.json` unter `scripts` einfügen:

```json
"validate:content": "node --experimental-strip-types scripts/validate-content.ts",
"prebuild": "npm run validate:content"
```

- [ ] **Step 6: Gegen den echten Inhalt laufen lassen**

Run: `npm run validate:content`
Expected: `Inhaltsvalidierung bestanden: 1 Datei(en) geprüft.`

Zur Gegenprobe `roles` aus `content/docs/index.mdx` entfernen und erneut ausführen.
Expected: Exit-Code 1 mit der Meldung `index.mdx: 'roles' fehlt oder ist leer.`
Danach `roles: [public]` wieder eintragen.

- [ ] **Step 7: CI-Workflow anlegen**

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:

jobs:
  pruefen:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: npm
      - run: npm ci
      - run: npm run validate:content
      - run: npm test
      - run: npx tsc --noEmit
      - run: npm run build
```

Hinweis: Ein früherer Commit (`6801c6b`) hat den Workflow ausgelassen, weil dem Token der `workflow`-Scope fehlte. Schlägt der Push fehl, muss der Personal Access Token um `workflow` erweitert werden.

- [ ] **Step 8: Commit**

```bash
git add scripts/ package.json .github/workflows/ci.yml
git commit -m "feat: Inhaltsvalidierung als Sicherheitsnetz vor dem Build"
```

---

### Task 9: Anmeldung gegen den WordPress-OIDC

**Files:**
- Create: `auth.ts`
- Create: `app/api/auth/[...nextauth]/route.ts`
- Create: `types/next-auth.d.ts`
- Modify: `package.json`

**Interfaces:**
- Consumes: `mapWpRoles`, `DocRole` aus `lib/roles.ts`; `AccessSubject` aus `lib/access.ts`
- Produces: `auth()` — liefert `Session | null`; `signIn()`, `signOut()`, `handlers`; `subjectFromSession(session): AccessSubject | null`

- [ ] **Step 1: Auth.js installieren**

```bash
npm install next-auth@beta
```

Erwartet wird die v5-API (`NextAuth()` gibt `{ handlers, auth, signIn, signOut }` zurück). Prüfen mit:

Run: `node -e "console.log(require('./node_modules/next-auth/package.json').version)"`
Expected: eine Version, die mit `5.` beginnt

- [ ] **Step 2: Session-Typen erweitern**

Create `types/next-auth.d.ts`:

```ts
import type { DocRole } from '@/lib/roles';

declare module 'next-auth' {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
    };
    docRoles: DocRole[];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    docRoles?: DocRole[];
  }
}
```

- [ ] **Step 3: Auth-Konfiguration schreiben**

Create `auth.ts`:

```ts
import NextAuth from 'next-auth';
import type { OIDCConfig } from 'next-auth/providers';
import { mapWpRoles, type DocRole } from '@/lib/roles';
import type { AccessSubject } from '@/lib/access';

interface WordPressProfile {
  sub: string;
  name?: string;
  email?: string;
  /** Wird vom mu-Plugin ergänzt (siehe wordpress/ggs-oidc-roles.php). */
  roles?: string[];
}

const wordpress: OIDCConfig<WordPressProfile> = {
  id: 'wordpress',
  name: 'Goethe-Gymnasium',
  type: 'oidc',
  issuer: process.env.WP_OIDC_ISSUER,
  clientId: process.env.WP_OIDC_CLIENT_ID,
  clientSecret: process.env.WP_OIDC_CLIENT_SECRET,
  authorization: { params: { scope: 'openid profile email' } },
  // Der Discovery-Endpoint meldet ausschließlich client_secret_basic.
  client: { token_endpoint_auth_method: 'client_secret_basic' },
};

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [wordpress],
  session: { strategy: 'jwt' },
  cookies: {
    sessionToken: {
      name: 'ggs-docs.session',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        // Kein `domain`: host-only, damit die Session nicht auf
        // .goethe-gymnasium-stolberg.de gesetzt wird und in WordPress mitläuft.
      },
    },
  },
  callbacks: {
    jwt({ token, profile }) {
      if (profile) {
        token.docRoles = mapWpRoles(
          Array.isArray(profile.roles) ? profile.roles : [],
        );
      }
      return token;
    },
    session({ session, token }) {
      session.docRoles = token.docRoles ?? [];
      return session;
    },
  },
  pages: {
    error: '/kein-zugriff',
  },
});

/** Übersetzt eine Auth.js-Session in das Subjekt, das canAccess erwartet. */
export function subjectFromSession(
  session: { docRoles?: DocRole[] } | null,
): AccessSubject | null {
  if (!session) return null;
  return { roles: session.docRoles ?? [] };
}
```

- [ ] **Step 4: Route-Handler anlegen**

Create `app/api/auth/[...nextauth]/route.ts`:

```ts
export const runtime = 'nodejs';

export { GET, POST } from '@/auth';
```

Ergänzend in `auth.ts` am Dateiende:

```ts
export const { GET, POST } = handlers;
```

- [ ] **Step 5: OAuth-Client in WordPress anlegen**

Diese Aufgabe erfordert Admin-Zugang zum WordPress. Im WP-OAuth-Server-Plugin einen Client anlegen mit:

- Grant Type: `authorization_code`
- Redirect-URIs (**beide** eintragen):
  - `https://docs-neu.goethe-gymnasium-stolberg.de/api/auth/callback/wordpress`
  - `https://docs.goethe-gymnasium-stolberg.de/api/auth/callback/wordpress`
- Scopes: `openid profile email`

Client-ID und Secret in `.env` als `WP_OIDC_CLIENT_ID` und `WP_OIDC_CLIENT_SECRET` hinterlegen, `AUTH_SECRET` mit `openssl rand -hex 32` erzeugen.

- [ ] **Step 6: Anmeldung im Browser durchspielen**

Run: `npm run build && npm start`

`http://localhost:3000/api/auth/signin` öffnen, „Goethe-Gymnasium" wählen, gegen WordPress anmelden.

Expected: Rückleitung auf die Startseite. Prüfen mit `http://localhost:3000/api/auth/session`:
Expected: JSON mit `docRoles` — vor Task 14 ein leeres Array, weil WordPress noch keine `roles`-Claim liefert.

Ein leeres `docRoles` bei erfolgreicher Anmeldung ist an dieser Stelle der **erwartete** Zustand und bestätigt, dass der Fluss steht.

- [ ] **Step 7: Commit**

```bash
git add auth.ts app/api/auth types/next-auth.d.ts package.json package-lock.json
git commit -m "feat: Anmeldung über den WordPress-OAuth-Server per OIDC"
```

---

### Task 10: Gate an der Seitenroute

**Files:**
- Modify: `app/(docs)/[[...slug]]/page.tsx`
- Create: `app/kein-zugriff/page.tsx`

**Interfaces:**
- Consumes: `canAccess` (Task 6), `auth`, `subjectFromSession` (Task 9), `docsSource` (Task 2)
- Produces: nichts für spätere Tasks

- [ ] **Step 1: 403-Seite anlegen**

Create `app/kein-zugriff/page.tsx`:

```tsx
import Link from 'next/link';

export const metadata = { title: 'Kein Zugriff – GGS Dokumentation' };

export default function KeinZugriff() {
  return (
    <main className="mx-auto max-w-xl px-6 py-24 text-center">
      <h1 className="text-2xl font-semibold text-ggs-secondary">
        Diese Seite ist für deine Rolle nicht freigegeben
      </h1>
      <p className="mt-4 text-ggs-text">
        Du bist angemeldet, aber dein Konto gehört nicht zu der Gruppe, für die
        diese Seite bestimmt ist. Wenn das ein Fehler ist, wende dich an die
        IT-Administration der Schule.
      </p>
      <Link href="/" className="mt-8 inline-block text-ggs-link underline">
        Zurück zur Startseite
      </Link>
    </main>
  );
}
```

- [ ] **Step 2: Gate in die Seitenroute einbauen**

Replace `app/(docs)/[[...slug]]/page.tsx` entirely:

```tsx
import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { DocsPage, DocsBody, DocsDescription, DocsTitle } from 'fumadocs-ui/page';
import { docsSource } from '@/lib/source';
import { canAccess } from '@/lib/access';
import { auth, subjectFromSession } from '@/auth';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug?: string[] }>;
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const page = docsSource.getPage(slug);
  if (!page) notFound();

  const session = await auth();
  if (!canAccess(page.data, subjectFromSession(session))) {
    // Anonym: der Nutzer soll erkennen, dass Anmelden hilft.
    if (!session) redirect(`/api/auth/signin?callbackUrl=${encodeURIComponent(page.url)}`);
    // Angemeldet, aber falsche Rolle: Klartext statt 404.
    redirect('/kein-zugriff');
  }

  const MDX = page.data.body;

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDX />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = docsSource.getPage(slug);
  if (!page) return {};

  const session = await auth();
  if (!canAccess(page.data, subjectFromSession(session))) {
    // Titel und Beschreibung geschützter Seiten dürfen nicht durchsickern.
    return { title: 'GGS Dokumentation' };
  }

  return {
    title: `${page.data.title} – GGS Dokumentation`,
    description: page.data.description,
  };
}
```

`generateMetadata` bekommt dieselbe Prüfung: Ohne sie stünde der Titel einer Admin-Seite im `<title>` der Weiterleitungsantwort.

- [ ] **Step 3: Testinhalte anlegen**

Create `content/docs/test/oeffentlich.mdx`:

```mdx
---
title: Öffentliche Testseite
roles: [public]
---

Diese Seite muss für alle sichtbar sein.
```

Create `content/docs/test/nur-admin.mdx`:

```mdx
---
title: Admin-Testseite
roles: [admin]
---

GEHEIM-MARKER-4711
```

- [ ] **Step 4: Manuell prüfen**

Run: `npm run build && npm start`

```bash
curl -s -o /dev/null -w "public anonym: %{http_code}\n" http://localhost:3000/test/oeffentlich
curl -s -o /dev/null -w "admin anonym: %{http_code}\n" -L --max-redirs 0 http://localhost:3000/test/nur-admin
curl -s http://localhost:3000/test/nur-admin | grep -c "GEHEIM-MARKER-4711" || echo "Marker nicht in der Antwort — korrekt"
```

Expected:
- `public anonym: 200`
- `admin anonym: 307` (Weiterleitung zur Anmeldung)
- `Marker nicht in der Antwort — korrekt`

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: Rollenprüfung an der Seitenroute samt 403-Seite"
```

---

### Task 11: Gefilterter Navigationsbaum

Ohne diesen Schritt stehen die Titel aller geschützten Seiten in der Sidebar jedes Besuchers.

**Files:**
- Create: `lib/page-tree.ts`
- Test: `lib/page-tree.test.ts`
- Modify: `app/(docs)/layout.tsx`

**Interfaces:**
- Consumes: `canAccess`, `AccessSubject` (Task 6); Typen `Root`, `Node` aus `fumadocs-core/page-tree`
- Produces: `filterPageTree(tree: Root, isVisible: (url: string) => boolean): Root`

- [ ] **Step 1: Den fehlschlagenden Test schreiben**

Create `lib/page-tree.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import type { Root } from 'fumadocs-core/page-tree';
import { filterPageTree } from './page-tree';

const tree: Root = {
  name: 'Docs',
  children: [
    { type: 'page', name: 'Start', url: '/' },
    {
      type: 'folder',
      name: 'iPads',
      index: { type: 'page', name: 'iPads', url: '/ipads' },
      children: [
        { type: 'page', name: 'Einrichtung', url: '/ipads/einrichtung' },
      ],
    },
    {
      type: 'folder',
      name: 'Admin',
      index: { type: 'page', name: 'Admin', url: '/admin' },
      children: [
        { type: 'page', name: 'Netzwerk', url: '/admin/netzwerk' },
      ],
    },
    { type: 'separator', name: 'Sonstiges' },
  ],
};

const urls = (root: Root): string[] => {
  const found: string[] = [];
  const walk = (nodes: Root['children']) => {
    for (const node of nodes) {
      if (node.type === 'page') found.push(node.url);
      if (node.type === 'folder') {
        if (node.index) found.push(node.index.url);
        walk(node.children);
      }
    }
  };
  walk(root.children);
  return found;
};

describe('filterPageTree', () => {
  it('lässt den Baum unverändert, wenn alles sichtbar ist', () => {
    expect(urls(filterPageTree(tree, () => true)).sort()).toEqual(
      ['/', '/admin', '/admin/netzwerk', '/ipads', '/ipads/einrichtung'].sort(),
    );
  });

  it('entfernt nicht sichtbare Seiten', () => {
    const result = filterPageTree(tree, (url) => !url.startsWith('/admin'));
    expect(urls(result)).not.toContain('/admin/netzwerk');
    expect(urls(result)).not.toContain('/admin');
  });

  it('entfernt einen Ordner vollständig, wenn nichts darin sichtbar ist', () => {
    const result = filterPageTree(tree, (url) => !url.startsWith('/admin'));
    const names = result.children
      .filter((node) => node.type === 'folder')
      .map((node) => node.name);
    expect(names).not.toContain('Admin');
  });

  it('behält einen Ordner, wenn wenigstens ein Kind sichtbar bleibt', () => {
    const result = filterPageTree(tree, (url) => url !== '/ipads');
    const names = result.children
      .filter((node) => node.type === 'folder')
      .map((node) => node.name);
    expect(names).toContain('iPads');
  });

  it('verändert den Ursprungsbaum nicht', () => {
    filterPageTree(tree, () => false);
    expect(urls(tree)).toHaveLength(5);
  });

  it('behält Trenner', () => {
    const result = filterPageTree(tree, () => true);
    expect(result.children.some((node) => node.type === 'separator')).toBe(true);
  });
});
```

- [ ] **Step 2: Test laufen lassen, Fehlschlag bestätigen**

Run: `npm test -- lib/page-tree.test.ts`
Expected: FAIL — `Failed to resolve import "./page-tree"`

- [ ] **Step 3: Implementierung**

Create `lib/page-tree.ts`:

```ts
import type { Folder, Node, Root } from 'fumadocs-core/page-tree';

function filterNodes(nodes: Node[], isVisible: (url: string) => boolean): Node[] {
  const result: Node[] = [];

  for (const node of nodes) {
    if (node.type === 'separator') {
      result.push(node);
      continue;
    }

    if (node.type === 'page') {
      if (isVisible(node.url)) result.push(node);
      continue;
    }

    const children = filterNodes(node.children, isVisible);
    const index = node.index && isVisible(node.index.url) ? node.index : undefined;

    // Ein Ordner ohne sichtbaren Inhalt verschwindet vollständig — sein Name
    // allein verriete sonst, dass es dort etwas gibt.
    if (children.length === 0 && !index) continue;

    const folder: Folder = { ...node, children, index };
    result.push(folder);
  }

  return result;
}

/**
 * Erzeugt eine gefilterte Kopie des Navigationsbaums. Der Ursprungsbaum
 * bleibt unverändert — er wird beim Start einmal gebaut und von allen
 * Requests geteilt.
 */
export function filterPageTree(
  tree: Root,
  isVisible: (url: string) => boolean,
): Root {
  return { ...tree, children: filterNodes(tree.children, isVisible) };
}
```

- [ ] **Step 4: Test laufen lassen, Erfolg bestätigen**

Run: `npm test -- lib/page-tree.test.ts`
Expected: PASS, 6 Tests

- [ ] **Step 5: Sichtbarkeitsprüfung nach URL bereitstellen**

Append to `lib/source.ts`:

```ts
import { canAccess, type AccessSubject } from './access';

/** URL → Frontmatter, für Baum- und Suchfilterung. */
const pagesByUrl = new Map(
  docsSource.getPages().map((page) => [page.url, page.data]),
);

/**
 * Prüft eine URL gegen canAccess. Unbekannte URLs gelten als nicht sichtbar —
 * fail-closed, damit ein Zuordnungsfehler nichts freigibt.
 */
export function isUrlVisible(url: string, subject: AccessSubject | null): boolean {
  const data = pagesByUrl.get(url);
  if (!data) return false;
  return canAccess(data, subject);
}
```

- [ ] **Step 6: Layout auf den gefilterten Baum umstellen**

Replace `app/(docs)/layout.tsx` entirely:

```tsx
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import type { ReactNode } from 'react';
import { docsSource, isUrlVisible } from '@/lib/source';
import { filterPageTree } from '@/lib/page-tree';
import { auth, subjectFromSession } from '@/auth';

export default async function Layout({ children }: { children: ReactNode }) {
  const session = await auth();
  const subject = subjectFromSession(session);
  const tree = filterPageTree(docsSource.pageTree, (url) => isUrlVisible(url, subject));

  return (
    <DocsLayout
      tree={tree}
      nav={{ title: 'GGS Dokumentation', url: '/' }}
      links={[
        {
          text: 'Zur Schulhomepage',
          url: 'https://goethe-gymnasium-stolberg.de',
          external: true,
        },
      ]}
    >
      {children}
    </DocsLayout>
  );
}
```

- [ ] **Step 7: Manuell prüfen**

Run: `npm run build && npm start`

```bash
curl -s http://localhost:3000/test/oeffentlich | grep -c "Admin-Testseite" || echo "Admin-Titel nicht im Baum — korrekt"
```

Expected: `Admin-Titel nicht im Baum — korrekt`

- [ ] **Step 8: Commit**

```bash
git add lib/page-tree.ts lib/page-tree.test.ts lib/source.ts "app/(docs)/layout.tsx"
git commit -m "feat: Navigationsbaum pro Rolle filtern"
```

---

### Task 12: Suche mit Gate

Der Suchindex ist das größte Leck: Ohne Filterung liegen Titel und Volltext geschützter Seiten im Browser jedes Besuchers.

**Files:**
- Create: `lib/search.ts`
- Create: `app/api/search/route.ts`
- Test: `lib/search.test.ts`

**Interfaces:**
- Consumes: `docsSource`, `isUrlVisible` (Task 11); `initAdvancedSearch` aus `fumadocs-core/search/server`
- Produces: `stripAnchor(url: string): string`, `searchServer` (SearchServer-Instanz)

- [ ] **Step 1: Den fehlschlagenden Test schreiben**

Überschriften-Treffer tragen einen Anker in der URL (`/admin/netzwerk#firewall`). Ohne Abschneiden schlägt die Zuordnung zur Seite fehl — und ein fail-closed-Nachschlag würde zwar nichts freigeben, aber auch legitime Treffer verwerfen. Der Anker muss weg, bevor gefiltert wird.

Create `lib/search.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { stripAnchor } from './search';

describe('stripAnchor', () => {
  it('entfernt den Anker eines Überschriften-Treffers', () => {
    expect(stripAnchor('/admin/netzwerk#firewall')).toBe('/admin/netzwerk');
  });

  it('lässt eine URL ohne Anker unverändert', () => {
    expect(stripAnchor('/admin/netzwerk')).toBe('/admin/netzwerk');
  });

  it('kommt mit mehreren Rautezeichen zurecht', () => {
    expect(stripAnchor('/a#b#c')).toBe('/a');
  });

  it('behandelt die Wurzel korrekt', () => {
    expect(stripAnchor('/#abschnitt')).toBe('/');
  });
});
```

- [ ] **Step 2: Test laufen lassen, Fehlschlag bestätigen**

Run: `npm test -- lib/search.test.ts`
Expected: FAIL — `Failed to resolve import "./search"`

- [ ] **Step 3: Implementierung**

Create `lib/search.ts`:

```ts
import { initAdvancedSearch } from 'fumadocs-core/search/server';
import { docsSource } from './source';

/** Entfernt den Anker aus einer Treffer-URL (`/seite#abschnitt` → `/seite`). */
export function stripAnchor(url: string): string {
  const index = url.indexOf('#');
  return index === -1 ? url : url.slice(0, index);
}

/**
 * Der Index enthält bewusst ALLE Seiten. Gefiltert wird erst beim Ausliefern
 * der Treffer über canAccess — so gibt es genau eine Regel statt zweier
 * Indizes, die auseinanderlaufen können.
 */
export const searchServer = initAdvancedSearch({
  language: 'german',
  indexes: docsSource.getPages().map((page) => ({
    id: page.url,
    url: page.url,
    title: page.data.title,
    description: page.data.description,
    structuredData: page.data.structuredData,
  })),
});
```

- [ ] **Step 4: Test laufen lassen, Erfolg bestätigen**

Run: `npm test -- lib/search.test.ts`
Expected: PASS, 4 Tests

- [ ] **Step 5: Route-Handler mit Gate**

Create `app/api/search/route.ts`:

```ts
import { NextResponse } from 'next/server';
import { searchServer, stripAnchor } from '@/lib/search';
import { isUrlVisible } from '@/lib/source';
import { auth, subjectFromSession } from '@/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get('query') ?? '';
  if (query.trim() === '') return NextResponse.json([]);

  const session = await auth();
  const subject = subjectFromSession(session);

  const results = await searchServer.search(query);
  const visible = results.filter((result) =>
    isUrlVisible(stripAnchor(result.url), subject),
  );

  return NextResponse.json(visible);
}
```

- [ ] **Step 6: Manuell prüfen**

Run: `npm run build && npm start`

```bash
curl -s "http://localhost:3000/api/search?query=Admin" | grep -c "nur-admin" || echo "Admin-Treffer gefiltert — korrekt"
curl -s "http://localhost:3000/api/search?query=Testseite" | grep -c "oeffentlich" && echo "Öffentlicher Treffer vorhanden — korrekt"
```

Expected:
- `Admin-Treffer gefiltert — korrekt`
- `Öffentlicher Treffer vorhanden — korrekt`

- [ ] **Step 7: Commit**

```bash
git add lib/search.ts lib/search.test.ts app/api/search
git commit -m "feat: Suche mit Rollenfilter, Anker vor der Zuordnung abschneiden"
```

---

### Task 13: Sitemap und robots

**Files:**
- Create: `app/sitemap.ts`
- Create: `app/robots.ts`

**Interfaces:**
- Consumes: `docsSource` (Task 2), `canAccess` (Task 6)
- Produces: nichts für spätere Tasks

- [ ] **Step 1: Sitemap auf öffentliche Seiten beschränken**

Create `app/sitemap.ts`:

```ts
import type { MetadataRoute } from 'next';
import { docsSource } from '@/lib/source';
import { canAccess } from '@/lib/access';

const BASE_URL = process.env.AUTH_URL ?? 'https://docs-neu.goethe-gymnasium-stolberg.de';

export default function sitemap(): MetadataRoute.Sitemap {
  // Ohne Subjekt geprüft: es landen ausschließlich public-Seiten in der Sitemap.
  return docsSource
    .getPages()
    .filter((page) => canAccess(page.data, null))
    .map((page) => ({
      url: new URL(page.url, BASE_URL).toString(),
      lastModified: new Date(),
    }));
}
```

- [ ] **Step 2: robots.txt anlegen**

Create `app/robots.ts`:

```ts
import type { MetadataRoute } from 'next';

const BASE_URL = process.env.AUTH_URL ?? 'https://docs-neu.goethe-gymnasium-stolberg.de';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/outstatic', '/kein-zugriff'],
    },
    sitemap: new URL('/sitemap.xml', BASE_URL).toString(),
  };
}
```

Solange die Doku unter `docs-neu` als Übergangsadresse läuft, ist eine Indexierung ohnehin unerwünscht — der Cutover auf `docs.` erfolgt in Phase 4.

- [ ] **Step 3: Manuell prüfen**

Run: `npm run build && npm start`

```bash
curl -s http://localhost:3000/sitemap.xml | grep -c "nur-admin" || echo "Admin-Seite nicht in der Sitemap — korrekt"
curl -s http://localhost:3000/sitemap.xml | grep -c "oeffentlich" && echo "Öffentliche Seite in der Sitemap — korrekt"
```

Expected: beide Zeilen mit „korrekt"

- [ ] **Step 4: Commit**

```bash
git add app/sitemap.ts app/robots.ts
git commit -m "feat: Sitemap und robots auf öffentliche Seiten beschränken"
```

---

### Task 14: Rollen aus WordPress liefern

Ohne diesen Schritt meldet sich jeder erfolgreich an, bekommt aber ein leeres `docRoles` — und sieht damit nur `public`-Seiten. Diese Aufgabe schließt die Kette.

**Files:**
- Create: `wordpress/ggs-oidc-roles.php`
- Create: `wordpress/README.md`
- Modify: `lib/roles.ts` (nur die Tabelle `WP_ROLE_MAP`, falls die Slugs abweichen)
- Modify: `lib/roles.test.ts` (passend zu den bestätigten Slugs)

**Interfaces:**
- Consumes: `mapWpRoles` (Task 1)
- Produces: `roles`-Claim in `id_token` und `/oauth/me`

- [ ] **Step 1: Tatsächliche WordPress-Rollen-Slugs feststellen**

Mit Admin-Zugang im WordPress unter *Benutzer → Rollen* bzw. über WP-CLI:

```bash
wp role list --format=table
```

Die Ausgabe mit der Tabelle `WP_ROLE_MAP` in `lib/roles.ts` abgleichen. Weichen die Slugs ab, sowohl die Tabelle als auch die Erwartungen in `lib/roles.test.ts` anpassen und die Tests laufen lassen.

Run: `npm test -- lib/roles.test.ts`
Expected: PASS

- [ ] **Step 2: mu-Plugin schreiben**

Create `wordpress/ggs-oidc-roles.php`:

```php
<?php
/**
 * Plugin Name: GGS OIDC Roles
 * Description: Ergänzt die WordPress-Rollen als `roles`-Claim in id_token und /oauth/me des WP OAuth Servers.
 * Version: 1.0.0
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Liefert die Rollen-Slugs eines Benutzers.
 *
 * @param int $user_id
 * @return string[]
 */
function ggs_oidc_user_roles($user_id) {
    $user = get_userdata($user_id);
    if (!$user || empty($user->roles)) {
        return array();
    }
    return array_values($user->roles);
}

/**
 * Ergänzt die Rollen in der Antwort des /oauth/me-Endpunkts.
 */
add_filter('wo_me_resource_response', function ($response, $user_id) {
    $response['roles'] = ggs_oidc_user_roles($user_id);
    return $response;
}, 10, 2);

/**
 * Ergänzt die Rollen als Claim im id_token.
 */
add_filter('wo_id_token_claims', function ($claims, $user_id) {
    $claims['roles'] = ggs_oidc_user_roles($user_id);
    return $claims;
}, 10, 2);
```

- [ ] **Step 3: Filternamen gegen die installierte Plugin-Version prüfen**

Die beiden Filternamen `wo_me_resource_response` und `wo_id_token_claims` sind die vom WP OAuth Server verwendeten Präfixe (`wo_`). Sie müssen gegen die konkret installierte Version bestätigt werden:

```bash
grep -rn "apply_filters" wp-content/plugins/oauth2-provider/ | grep -i "me_resource\|id_token\|claims"
```

Weicht ein Name ab, im Plugin den tatsächlichen Namen übernehmen. Findet sich kein Filter für das `id_token`, genügt der `/oauth/me`-Weg allein — dann in `auth.ts` den `jwt`-Callback so ergänzen, dass er `profile` aus dem Userinfo-Aufruf nutzt (Auth.js ruft `userinfo_endpoint` bei OIDC-Providern automatisch auf, wenn `profile` nicht bereits alle Felder trägt).

- [ ] **Step 4: Installieren und prüfen**

Datei nach `wp-content/mu-plugins/ggs-oidc-roles.php` kopieren. mu-Plugins sind ohne Aktivierung sofort aktiv.

Prüfen mit einem gültigen Access-Token:

```bash
curl -s -H "Authorization: Bearer <TOKEN>" https://goethe-gymnasium-stolberg.de/oauth/me/
```

Expected: JSON, das ein Feld `roles` mit den Rollen-Slugs des Benutzers enthält

- [ ] **Step 5: Ende-zu-Ende prüfen**

Run: `npm run build && npm start`

Anmelden, dann `http://localhost:3000/api/auth/session` aufrufen.
Expected: `docRoles` enthält die abgebildeten Doku-Rollen, bei einem WP-Administrator `["admin"]`

Anschließend `http://localhost:3000/test/nur-admin` aufrufen.
Expected: Seite wird angezeigt, Text `GEHEIM-MARKER-4711` sichtbar

Mit einem Nicht-Admin-Konto dieselbe URL aufrufen.
Expected: Weiterleitung auf `/kein-zugriff`

- [ ] **Step 6: Kurzanleitung hinterlegen**

Create `wordpress/README.md`:

```markdown
# WordPress-Seitige Bestandteile

## ggs-oidc-roles.php

Ergänzt die WordPress-Rollen als `roles`-Claim in `id_token` und `/oauth/me`
des WP OAuth Servers. Ohne dieses Plugin melden sich Nutzer zwar erfolgreich
an, erhalten aber keine Rollen und sehen ausschließlich `public`-Seiten.

**Installation:** Datei nach `wp-content/mu-plugins/` kopieren. mu-Plugins
sind ohne Aktivierung sofort aktiv.

**Abhängigkeit:** Die Rollen-Slugs müssen mit der Tabelle `WP_ROLE_MAP` in
`lib/roles.ts` übereinstimmen. Ändert sich eine Rolle in WordPress, ist das
eine Änderung an genau dieser Tabelle plus den Tests in `lib/roles.test.ts`.

## OAuth-Client

Im WP-OAuth-Server-Plugin angelegt mit:

- Grant Type: `authorization_code`
- Scopes: `openid profile email`
- Redirect-URIs (beide):
  - `https://docs-neu.goethe-gymnasium-stolberg.de/api/auth/callback/wordpress`
  - `https://docs.goethe-gymnasium-stolberg.de/api/auth/callback/wordpress`
```

- [ ] **Step 7: Testinhalte entfernen**

```bash
git rm content/docs/test/oeffentlich.mdx content/docs/test/nur-admin.mdx
```

Die beiden Seiten haben ihren Zweck erfüllt. Sie bleiben nicht im Produktivinhalt stehen.

- [ ] **Step 8: Gesamtlauf**

Run: `npm run validate:content && npm test && npx tsc --noEmit && npm run build`
Expected: alle vier Schritte erfolgreich

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: WordPress-Rollen als OIDC-Claim ergänzen und Kette schließen"
```

---

### Task 15: Verhalten bei Ausfall des Identity Providers

Spec §8.1 verlangt zwei Eigenschaften, die aus den bisherigen Aufgaben zwar folgen, aber unbelegt wären: Ein WordPress-Ausfall darf öffentliche Anleitungen nicht mitreißen, und eine Schlüsselrotation darf niemanden aussperren.

**Files:**
- Create: `docs/betrieb/ausfallverhalten.md`
- Test: `lib/access.test.ts` (Ergänzung)

**Interfaces:**
- Consumes: `canAccess` (Task 6), `auth` (Task 9)
- Produces: nichts für spätere Tasks

- [ ] **Step 1: Den fehlschlagenden Test schreiben**

Append to `lib/access.test.ts`:

```ts
describe('canAccess — Unabhängigkeit vom Identity Provider', () => {
  it('entscheidet über public-Seiten ohne jedes Subjekt', () => {
    // Belegt: für öffentliche Seiten ist keine Sitzungsauflösung nötig.
    expect(canAccess({ roles: ['public'] }, null)).toBe(true);
  });

  it('ist eine reine Funktion ohne Seiteneffekte', () => {
    const frontmatter = { roles: ['lehrer'] };
    const subject = { roles: ['lehrer'] as const };
    const first = canAccess(frontmatter, { roles: [...subject.roles] });
    const second = canAccess(frontmatter, { roles: [...subject.roles] });
    expect(first).toBe(second);
    expect(frontmatter).toEqual({ roles: ['lehrer'] });
  });
});
```

- [ ] **Step 2: Test laufen lassen**

Run: `npm test -- lib/access.test.ts`
Expected: PASS, 20 Tests — die Implementierung aus Task 6 erfüllt beide Zusicherungen bereits. Der Test hält sie fest, damit eine spätere Änderung sie nicht unbemerkt bricht.

- [ ] **Step 3: Ausfall praktisch nachstellen**

Den Container mit unerreichbarem Identity Provider starten:

```bash
WP_OIDC_ISSUER=https://nicht-erreichbar.invalid npm run build && npm start
```

```bash
curl -s -o /dev/null -w "public bei IdP-Ausfall: %{http_code}\n" http://localhost:3000/
curl -s -o /dev/null -w "Anmeldeseite bei IdP-Ausfall: %{http_code}\n" http://localhost:3000/api/auth/signin
```

Expected:
- `public bei IdP-Ausfall: 200` — öffentliche Seiten bleiben erreichbar
- Die Anmeldung schlägt fehl, aber mit einer Fehlerseite statt eines Stacktrace

Schlägt der erste Aufruf fehl, wird beim Rendern öffentlicher Seiten eine Verbindung zum Identity Provider aufgebaut, die nicht sein darf. Ursache ist dann eine Discovery-Auflösung im Modul-Rumpf von `auth.ts` — sie muss in den Provider hineinwandern, damit sie erst beim Anmelden greift.

- [ ] **Step 4: Betriebshinweis schreiben**

Create `docs/betrieb/ausfallverhalten.md`:

```markdown
# Ausfallverhalten

## WordPress nicht erreichbar

Öffentliche Seiten (`roles: [public]`) bleiben vollständig erreichbar. Sie
brauchen kein Subjekt, und `canAccess` entscheidet ohne Netzwerkzugriff.

Bestehende Anmeldungen laufen weiter: Die Sitzung liegt als eigenständiges,
verschlüsseltes JWT im Cookie (`session.strategy = 'jwt'`). Jeder Request
entschlüsselt dieses Cookie lokal — es gibt keine Rückfrage an WordPress.

Nur die **Neuanmeldung** schlägt fehl, solange WordPress nicht antwortet.

## Schlüsselrotation (JWKS)

Der Signaturschlüssel unter `/.well-known/keys/` trägt eine `kid`, die sich
ändern kann. Die Prüfung des `id_token` findet ausschließlich **beim
Anmelden** statt — danach trägt das eigene Session-Cookie die Sitzung.

Eine Rotation sperrt daher **keine** angemeldeten Nutzer aus; sie betrifft nur
Anmeldungen, die währenddessen stattfinden. `openid-client` lädt den
Schlüsselsatz bei unbekannter `kid` einmal neu, womit sich das von selbst
erledigt.

Dies korrigiert eine Einschätzung im Design-Spec (§8.1), die von einem
Aussperren aller Angemeldeten ausging. Das trifft nur auf Architekturen mit
serverseitiger Token-Prüfung bei jedem Request zu — hier nicht.

## Rollenänderung in WordPress

Rollen stecken im Session-Cookie und werden erst bei der nächsten Anmeldung
neu gelesen. Eine Rollenänderung wirkt also nicht sofort. Soll sie das,
muss der betroffene Nutzer sich ab- und wieder anmelden.
```

- [ ] **Step 5: Commit**

```bash
git add lib/access.test.ts docs/betrieb/ausfallverhalten.md
git commit -m "test: Unabhängigkeit vom Identity Provider belegen und Ausfallverhalten dokumentieren"
```

---

## Abnahme Phase 1 + 2

Nach Task 15 muss Folgendes zutreffen:

- [ ] `npm test` grün, 55 Tests (7 roles + 5 contrast + 20 access + 7 schema + 6 validate + 6 page-tree + 4 search)
- [ ] `npm run build` erfolgreich, alle Doku-Routen als dynamisch ausgewiesen
- [ ] `docker build` erfolgreich
- [ ] `https://docs-neu.goethe-gymnasium-stolberg.de/` liefert 200 im GGS-Erscheinungsbild
- [ ] Anmeldung über WordPress funktioniert, `docRoles` ist gefüllt
- [ ] Eine Seite mit `roles: [admin]` ist für Anonyme und für Nicht-Admins unsichtbar — in der Seite, im Navigationsbaum, in der Suche und in der Sitemap
- [ ] Eine Seite ohne `roles` bricht `npm run validate:content` mit Exit-Code 1 ab
- [ ] Öffentliche Seiten liefern 200, während der Identity Provider unerreichbar ist
- [ ] Mobilansicht bei 375 px ohne horizontales Scrollen

**Nicht Teil dieser Phasen** (Phase 3–5 laut Spec): `meta.json`-Generator aus dem Frontmatter, Migration der neun WordPress-Anleitungen, Outstatic-Custom-Field für `roles`, Rebuild-Pipeline über GHCR, Wiki.js-Migration, Cutover auf `docs.`, Ask AI mit `/api/chat` und `llms.txt`.
