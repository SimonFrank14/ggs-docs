# Konsolidierung der GGS-Dokumentation — Design

Stand: 2026-08-08
Status: abgestimmt, Grundlage für die Implementierungsplanung
Ersetzt: den Erstentwurf „Anforderungen: Konsolidierung der GGS-Dokumentation"

---

## 1. Ausgangslage

Die Dokumentation des Goethe-Gymnasiums liegt heute an zwei Orten:

- **Öffentliche Anleitungen** auf der WordPress-Hauptseite unter `goethe-gymnasium-stolberg.de/anleitungen/` — neun Anleitungen auf **einer einzigen** Seite (ID 3354), gegliedert in „Schulinfrastruktur" (4) und „iPads" (5).
- **Interne Admin-Doku** unter `docs.goethe-gymnasium-stolberg.de` — betrieben mit **Wiki.js**, Inhalte in PostgreSQL, bereits durch Wiki.js-eigene Anmeldung geschützt.

Die Pflege in WordPress ist zeitlich nicht leistbar, Inhalte veralten, und die Auffindbarkeit ist schlecht.

### 1.1 Befunde, die den Erstentwurf korrigieren

Diese Punkte wurden am Live-System verifiziert und weichen vom ursprünglichen Anforderungsdokument ab:

| # | Annahme im Erstentwurf | Tatsächlicher Befund |
|---|---|---|
| 1 | Zielhost `ggs.nrw/anleitungen` | `ggs.nrw` ist ein 301-Redirect auf `goethe-gymnasium-stolberg.de`, kein eigener Host |
| 2 | Admin-Doku „bereits Markdown" | Admin-Doku läuft auf **Wiki.js** mit PostgreSQL-Backend; Navigation liegt als Base64-Konfiguration in der DB, nicht als Dateibaum |
| 3 | Pfad-Integration über gemeinsamen Traefik | **Nicht realisierbar** — WordPress läuft auf einem anderen Server; eine gemeinsame Origin ist infrastrukturell nicht herstellbar |
| 4 | Zugriffsschutz per Traefik-BasicAuth oder oauth2-proxy | Verworfen zugunsten seitengenauer Rollenprüfung in der Anwendung (siehe §3) |
| 5 | Zwei Zugriffsebenen (öffentlich / Admin) | **Fünf Rollen**: Eltern, Schüler, Lehrer, Verwaltung, Admin — Schutzbedarf pro Seite, nicht pro Bereich |
| 6 | Viele WordPress-Seiten zu migrieren | Alle neun Anleitungen liegen auf einer Seite; Migration ist ein einmaliges Aufteilen, kein Scraping-Projekt |

### 1.2 Identitätslage

Der WordPress-Server betreibt **WP OAuth Server** mit vollständiger OIDC-Unterstützung. Am Live-System verifiziert:

```
issuer                https://goethe-gymnasium-stolberg.de
authorization         /oauth/authorize/
token                 /oauth/token/
userinfo              /oauth/me/
end_session           /oauth/destroy/
jwks_uri              /.well-known/keys/          (RS256-Key vorhanden)
response_types        code, id_token, token id_token, code id_token
grant_types           authorization_code, refresh_token, client_credentials, implicit
scopes_supported      openid, profile, email, basic
```

Alle fünf Zielgruppen besitzen WordPress-Benutzerkonten. WordPress ist damit **der einzige Identity Provider** für die Dokumentationsplattform.

**Lücke:** `scopes_supported` kennt weder Rollen noch Gruppen. Die Rollenzuordnung muss ergänzt werden (siehe §3.4).

---

## 2. Ziele

1. Beide Doku-Quellen in einer Plattform konsolidieren (Fumadocs, Inhalte als MDX)
2. Pflege überwiegend KI-gestützt ermöglichen
3. Bearbeitung im Browser durch mehrere, teils nicht-technische Personen (Outstatic)
4. **Ersetzt Ziel 4 des Erstentwurfs:** Verbindung zur Hauptseite über gemeinsames Erscheinungsbild, wechselseitige Navigation und SSO — nicht über Pfad-Integration (siehe §1.1 Punkt 3)
5. Seitengenauer Zugriffsschutz für fünf Rollen
6. Ask-AI-Funktion über den rollengefilterten Inhaltsbestand

### 2.1 Nicht im Scope

- Payload CMS / datenbankgestütztes CMS (separater Anwendungsfall)
- Mehrsprachigkeit und automatisierte Übersetzung
- Externe Such-Backends (Orama, Algolia) — FlexSearch genügt
- Ablösung der Wiki.js-Instanz vor Phase 4

---

## 3. Architektur

### 3.1 Grundentscheidung: einheitlich serverseitig, ein Durchsetzungspunkt

Alle Doku-Routen werden serverseitig gerendert. Es gibt **keine** statisch vorgerenderte Teilmenge.

Begründung: Der Schutzbedarf wird pro Seite im Frontmatter entschieden. Eine solche Entscheidung braucht genau einen offensichtlichen Durchsetzungspunkt. Ein Hybridmodell (öffentliche Seiten statisch, geschützte dynamisch) kauft Performance, die bei 50–100 Seiten nicht gebraucht wird, und bezahlt sie mit einem stillen Fehlermodus: eine falsch klassifizierte Seite landet unwiderruflich im statischen Output **und** im öffentlichen Suchindex und bleibt es bis zum nächsten Build. Bei einheitlichem Rendering ist derselbe Fehler sofort sichtbar und mit einem Commit behoben.

Öffentliche Antworten können weiterhin über Cache-Header in Traefik gecacht werden.

### 3.2 Der Durchsetzungspunkt

Eine Funktion in `lib/access.ts`:

```ts
canAccess(page: PageMeta, session: Session | null): boolean
```

Sie ist die **einzige** Stelle, die über Sichtbarkeit entscheidet. Aufrufer:

1. Seitenroute (`app/docs/[[...slug]]/page.tsx`)
2. Navigationsbaum-Filter (Sidebar)
3. Such-Route (`/api/search`)
4. Sitemap / `robots.txt`
5. Ask-AI-Retrieval (`/api/chat`)
6. `llms.txt` / `llms-full.txt`
7. Pro-Seite-Markdown-Route

Jede neue Stelle, die Inhalte ausgibt, ruft dieselbe Funktion. Die Regel wird nirgends nachgebaut.

### 3.3 Frontmatter-Vertrag

```yaml
---
title: Anmelden im Schul-WLAN
order: 20
roles: [public]
---
```

- Erlaubte Werte: `public`, `eltern`, `schueler`, `lehrer`, `verwaltung`, `admin`
- `public` heißt **für alle sichtbar**, auch für Angemeldete — nicht „nur für Nicht-Angemeldete"
- **Fehlt `roles` oder ist es leer, gilt die Seite als nur für `admin` sichtbar.** Fail-closed: eine vergessene Klassifikation macht eine Seite unsichtbar, nicht öffentlich.
- `admin` sieht alle Seiten. Darüber hinaus ist das Modell additiv ohne Hierarchie — ein Lehrer hat keinen impliziten Zugriff auf Eltern-Inhalte.
- Anonyme Besucher haben genau die Rolle `public`.
- `order` steuert die Position in der Navigation (§4.2). Fehlt es, wird alphabetisch nach `title` einsortiert.

Der Validierungsschritt in CI (§6.2) bricht den Build ab, wenn `roles` fehlt oder unbekannte Werte enthält. Ohne diesen Schritt wäre eine vergessene Klassifikation zwar nicht öffentlich, die Seite verschwände aber unbemerkt.

### 3.4 Anmeldung und Rollen

**Login:** Auth.js v5 mit OIDC-Provider gegen den Discovery-Endpoint aus §1.2.

**Session-Cookie:** verschlüsselt, **host-only ohne `Domain`-Attribut**. Zwingend, damit die Session nicht auf `.goethe-gymnasium-stolberg.de` gesetzt wird und in WordPress mitläuft.

**Redirect-URIs:** Es werden **zwei** URIs im WP-OAuth-Client registriert — für die Übergangsadresse und für die spätere Zieladresse (§5.1), damit der Umzug kein Neuanlegen des Clients erzwingt.

**Rollen — primärer Weg:** Ein mu-Plugin auf dem WordPress-Server legt eine `roles`-Claim in `id_token` und `/oauth/me`. Die Doku-Plattform bildet WP-Rollen über eine Tabelle in **einer** Konfigurationsdatei (`lib/roles.ts`) auf die sechs Doku-Rollen ab.

**Rollen — Rückfallweg (Spike):** Falls kein Eingriff in WordPress möglich ist, holt die Anwendung die Rollen mit dem Access-Token über `/wp-json/wp/v2/users/me`. Das erfordert vorab einen Spike, weil die REST-API anonym mit 403 antwortet und erst zu prüfen ist, ob sie Bearer-Token durchlässt.

**Logout:** Es wird ausschließlich das eigene Session-Cookie gelöscht. Der `end_session_endpoint` wird **nicht** aufgerufen — er würde auch die WordPress-Sitzung beenden, was Nutzer nicht erwarten.

### 3.5 Verhalten bei fehlender Berechtigung

| Situation | Verhalten |
|---|---|
| Anonym, geschützte Seite | Weiterleitung zum Login (nicht 404 — der Nutzer soll erkennen, dass Anmelden hilft) |
| Angemeldet, falsche Rolle | 403-Seite mit Klartext-Erklärung |
| Suche, Navigation, Ask AI | Nicht zugängliche Seiten erscheinen gar nicht — keine Treffer, keine Baumeinträge, keine Zitate |

---

## 4. Inhalte

### 4.1 Struktur

**Ein Inhaltsbaum, nicht zwei.** Der bestehende Scaffold trennt `content/anleitungen` und `content/admin` in zwei `defineDocs`-Quellen mit zwei Navigationen. Das wird aufgegeben: Sobald Sichtbarkeit aus dem Frontmatter kommt, ist die Verzeichnisstruktur eine **Themen**-Gliederung, keine Zugriffsgliederung. Ein Lehrer soll nicht zwischen zwei Navigationen wechseln. Der Ordner `admin/` verschwindet für alle anderen Rollen schlicht aus dem gefilterten Baum.

**Genau zwei Ebenen.** Outstatics Modell ist zweistufig (*Collection* → *Dokument*). Fumadocs könnte tiefer schachteln, Outstatic nicht. Tiefere Pfade wären im Editor unsichtbar.

```
content/docs/
  infrastruktur/   schul-wlan · drahtlose-projektion · airprint · account-2fa
  ipads/           einrichtung · apps-installieren · jamf-parent-zugang ·
                   jamf-parent-nutzung · privates-ipad-vorbereiten
  verwaltung/      (leer bis Inhalte vorliegen — siehe unten)
  admin/           (Inhalt aus der Wiki.js-Migration, Phase 4)
```

`infrastruktur/` und `ipads/` sind die neun Anleitungen aus der WordPress-Migration (Phase 3) und der einzige Bereich mit heute bekanntem Inhalt. `admin/` füllt sich aus Wiki.js (Phase 4). Für `verwaltung/` existiert derzeit **kein** Bestand — der Ordner entsteht, sobald die Verwaltung Inhalte beisteuert, und wird nicht auf Vorrat angelegt.

Der bestehende Pfad `content/admin/netzwerk/uebersicht.mdx` hat drei Ebenen und muss flach gezogen werden. Die drei Beispieldateien des Scaffolds werden vor dem ersten Deploy entfernt — Phase 1 geht mit leerem Inhaltsbaum live, weil zu diesem Zeitpunkt noch kein Zugriffsschutz greift.

### 4.2 Navigation

Fumadocs ordnet über `meta.json`; Outstatic verwaltet diese Dateien nicht. Statt Redakteure an JSON zu lassen, **generiert ein Build-Schritt `meta.json` aus dem Frontmatter** (`title`, `order`). Eigenes Modul, deterministisch, unabhängig testbar. Redakteure sehen ausschließlich Dokumente.

### 4.3 Migration WordPress

Einmalige Aufgabe, kein Dauerbetrieb:

1. Gerendertes HTML von Seite 3354 einmal ziehen
2. An den Abschnittsgrenzen in neun MDX-Dateien auftrennen
3. Konvertieren, `roles` und `order` setzen
4. Durchgang von Hand

**Die Bilder müssen mit.** Die Anleitungen zeigen Screenshots aus `wp-content/uploads`. Bleiben diese verlinkt, hängt die Doku dauerhaft am WordPress-Server und bricht bei jedem Aufräumen dort. Assets wandern nach `public/`.

Die WordPress-REST-API antwortet anonym mit 403. Für Zugriffe darüber hinaus wird ein authentifizierter Zugang benötigt; für diese Migration genügt das öffentlich gerenderte HTML.

### 4.4 Migration Wiki.js (Phase 4)

1. Export über das **Git-Storage-Modul** von Wiki.js (schreibt `.md` samt Metadaten heraus) — nicht über die Datenbank
2. Konvertierung der Wiki.js-Eigenheiten: `{.is-info}`-Blockstile → Fumadocs-`Callout`, Tabsets → `Tabs`, interne Links auf die neue Pfadstruktur
3. **Navigation neu aufbauen** — Wiki.js hält die Sidebar als Base64-Konfiguration in der Datenbank; sie kommt beim Export nicht mit
4. `roles` pro Seite setzen

### 4.5 Alte URLs

- Die WordPress-Seite `/anleitungen/` **bleibt bestehen** und wird zur Wegweiser-Seite mit prominentem Einstieg in die neue Doku. Ein Server-Redirect ist nicht möglich, weil WordPress auf einem anderen Server liegt.
- Für Wiki.js wird beim Cutover auf `docs.` eine Redirect-Tabelle alt→neu angelegt.

---

## 5. Betrieb

### 5.1 Adressen und Cutover

Die Doku bekommt eine **eigene Origin**. `docs.goethe-gymnasium-stolberg.de` ist heute von Wiki.js belegt, dessen Inhalte erst in Phase 4 umziehen.

| Phase | Adresse | Wiki.js |
|---|---|---|
| 1–3 | `docs-neu.goethe-gymnasium-stolberg.de` | unberührt auf `docs.` |
| 4 (Cutover) | `docs.goethe-gymnasium-stolberg.de` | abgelöst, Redirects aktiv |

Kein `basePath` — die Anwendung läuft auf `/`.

### 5.2 Deployment

Ein Next.js-Container, `output: 'standalone'`, hinter Traefik im `proxy-network`, TLS über Let's Encrypt.

Ausgehende Verbindungen: HTTPS zu GitHub (Outstatic-Commits), zu WordPress (OIDC-Discovery und JWKS), ab Phase 5 zum Modellanbieter.

Auf welchem Node der Container läuft, ist ein **Deployment-Parameter**, keine Architekturentscheidung — festzulegen vor dem ersten Deploy in Phase 1.

**Bekannter Defekt:** [`Dockerfile:22`](../../../Dockerfile) kopiert `/app/public`, aber ein `public/`-Verzeichnis existiert nicht — der Image-Build bricht dort ab. Muss gegen ein leeres Verzeichnis abgesichert werden.

**Zu entfernen:** `instrumentation.ts` legt beim Serverstart einen globalen `localStorage`-Stub an, weil fumadocs-ui-Komponenten beim SSR darauf zugreifen. Das ist ein von allen gleichzeitigen Requests geteiltes globales Objekt — hier harmlos, aber ein Pflaster über der Ursache. Unter einheitlichem SSR mit rollenabhängigen Inhalten ist ein Reflex, der SSR-Fehler stumm schluckt, der falsche. Richtiger Weg: betroffene Komponenten als Client-Komponenten laden oder fumadocs-Version anheben.

### 5.3 Redaktion und Rebuild

**Outstatic** bleibt als Web-Editor. `OST_CONTENT_PATH` zeigt auf `content/docs`. Login über GitHub OAuth; der Editorkreis ist zunächst das IT-Team, GitHub-Konten sind zumutbar. Die `/outstatic`-Route wird auf `noindex` gesetzt.

`roles` wird als **Multi-Select-Custom-Field** mit den sechs festen Werten angelegt. Redakteure tippen keine YAML-Listen; Tippfehler bei Rollennamen sind ausgeschlossen.

**Pipeline:** Commit → GitHub Actions baut das Image, taggt mit Commit-SHA, schiebt nach GHCR → Webhook stößt den Redeploy an. Kein Watchtower-Polling (beobachtet nur `:latest`, Zeitpunkt bleibt dem Zufall überlassen).

**Kosten, ehrlich benannt:** fumadocs-mdx kompiliert Inhalte zur Build-Zeit ein. Vom Speichern im Editor bis zur sichtbaren Änderung vergehen **rund drei bis fünf Minuten**. Für eine Schul-Doku vertretbar, aber es ist kein CMS-Gefühl. Schneller ginge nur mit Laufzeit-Kompilierung aus einem Git-Volume — mehr Eigenbau, weniger Prüfung zur Build-Zeit. Wird jetzt nicht gebaut.

**Zu Ziel 2 (KI-gestützte Pflege):** Der Hebel ist nicht die Autovervollständigung im Editor, sondern dass Inhalte als MDX im Git liegen. KI-gestützte Pflege heißt: ein Agent arbeitet auf dem Repository, erzeugt einen Branch, das Team prüft und merged. Outstatics eingebaute KI-Vervollständigung deckt nur kleine Textänderungen ab.

---

## 6. Gestaltung

### 6.1 Marken-Tokens

Aus dem Elementor-Kit der Live-Seite extrahiert:

| Token | Wert | Verwendung |
|---|---|---|
| primary | `#FDD700` | Buttons, Icon-Flächen, Zierlinien |
| secondary | `#333333` | Überschriften |
| text | `#626262` | Fließtext, Navigation |
| accent | `#DFC15E` | gedämpftes Gold |
| Link (Theme) | `#D2A500` | Textlinks |
| Typografie | Roboto 600 / Roboto Slab 400 / Roboto 400 | Headings / sekundär / Fließtext |
| Navigation | Montserrat 600, 17px | Hauptmenü |
| Logo | `Logo-Goethe_300-1-…png`, 300×58 | Wortmarke mit Gebäude-Strichzeichnung |

Bildsprache: zentrierte Überschriften mit gelber Unterstreichung, gesperrte Versalien für Abschnittstitel, Kartenraster.

### 6.2 Kontrast-Korrektur

Die Markenfarben sind für eine Doku nicht unverändert verwendbar:

- `#D2A500` auf Weiß ≈ **2,3:1** — WCAG AA verlangt 4,5:1 für Fließtext
- `#FDD700` auf Weiß ≈ **1,4:1**

Auf der Elementor-Seite fällt das kaum auf, weil Gold dort fast nur als Fläche hinter dunkler Schrift und als Zierlinie vorkommt. In einer Doku sind Links Fließtext — die Hauptzielgruppe der öffentlichen Anleitungen liest am Telefon.

**Regel:** `#FDD700` bleibt für Flächen und Zierelemente. Für Text- und Linkfarben wird eine dunklere Variante abgeleitet (Richtung `#8A6A00`), die auf Weiß AA erfüllt und als dieselbe Farbe gelesen wird.

Die bestehenden Werte in `app/global.css` sind laut Kommentar „aus dem Screenshot extrahiert" und teilweise tot — `text-ggs-accent` im Layout referenziert eine nicht existierende Variable. Sie werden durch die extrahierten Tokens ersetzt.

Schriften werden über `next/font` selbst gehostet, nicht vom WordPress-Server geladen — gleicher Grund wie bei den Screenshots.

**Mobilansicht ist der Hauptfall**, nicht der Nebenfall, und wird zuerst geprüft.

### 6.3 Verbindung zur Hauptseite

Da die Pfad-Integration entfällt, trägt die Verbindung an drei Stellen:

1. Die WordPress-Seite `/anleitungen/` wird zur Wegweiser-Seite
2. Die Doku führt einen sichtbaren Rückweg zur Schulhomepage
3. Gemeinsames Erscheinungsbild nach §6.1

Der Domainwechsel bleibt sichtbar. Das ist der Preis der Infrastruktur und lässt sich nur gestalterisch abfedern.

---

## 7. Ask AI (Phase 5)

Fumadocs liefert die UI-Bausteine (`AISearch`, `AISearchPanel`, `AISearchTrigger`) und erwartet eine eigene `/api/chat`-Route auf Basis des Vercel AI SDK. Das Modell wird selbst gestellt.

**Entscheidung:** rollenabhängiges Retrieval mit **externem Modell**.

**Die Falle:** Fumadocs exponiert `/llms.txt`, `/llms-full.txt` und pro Seite eine Markdown-Fassung. Diese geben standardmäßig den **kompletten** Inhaltsbestand aus — `llms-full.txt` ist eine einzige URL mit der gesamten Doku inklusive Admin-Bereich im Klartext. Das kommt mit dem Aktivieren des Features stillschweigend mit.

**Festlegungen:**

- `llms.txt` und `llms-full.txt` enthalten **ausschließlich** `roles: [public]`-Seiten (sie sind per Definition Crawler-Futter)
- Die Rollenfilterung des Retrievals passiert serverseitig in `/api/chat` über `canAccess`
- Die Pro-Seite-Markdown-Route unterliegt derselben Prüfung wie die HTML-Seite
- **Ein AVV mit dem Modellanbieter liegt vor, bevor Admin-Inhalte in den Korpus gehen.** Bis dahin bleibt der Korpus auf `public` beschränkt.

Phase 5 hängt an keiner vorherigen Entscheidung außer der, dass die Gate-Aufrufe von Anfang an vorgesehen sind.

---

## 8. Fehlerbehandlung und Tests

### 8.1 Sortiert nach Schadenshöhe

**Ein Inhalt wird für die falsche Rolle sichtbar.** Der einzige Fehler, der wirklich weh tut.

- `canAccess` bekommt Unit-Tests mit einer Tabelle aus Rolle × Frontmatter × erwartetem Ergebnis, inklusive „`roles` fehlt", „`roles` leer", „unbekannte Rolle"
- Pro Aufrufstelle aus §3.2 ein Integrationstest: eine Admin-Seite ist für einen anonymen Abruf **und** für ein angemeldetes Elternteil unsichtbar — in der Seite, im Navigationsbaum, in der Suche, in `llms.txt` und in der Chat-Antwort
- Diese sieben Stellen sind die Teststellen. Jede neue ausgebende Stelle braucht denselben Test.

**WordPress ist nicht erreichbar.** Ein IdP-Ausfall darf öffentliche Anleitungen nicht mitreißen: anonyme Zugriffe auf `public`-Seiten lösen keine Session-Prüfung gegen WordPress aus. Bestehende Sessions laufen über die Cookie-Gültigkeit weiter; nur der Neu-Login schlägt fehl, mit verständlicher Meldung statt Stacktrace.

**JWKS-Rotation.** Der Schlüssel unter `/.well-known/keys/` trägt eine `kid`, die sich ändern kann. Der Key-Satz wird gecacht und bei unbekannter `kid` einmal neu geladen. Ohne das sperrt eine Schlüsselrotation in WordPress alle Angemeldeten aus, und die Ursache ist von außen nicht erkennbar.

### 8.2 Kaputter Inhalt

Der Validierungsschritt läuft in CI vor dem Image-Bau und prüft:

- `roles` gesetzt und ausschließlich mit erlaubten Werten
- interne Links auflösbar
- referenzierte Assets vorhanden

Rot heißt: kein Deploy. Der zuletzt laufende Container bleibt stehen.

### 8.3 Was nicht getestet wird

Das Rendering von Fumadocs, die Outstatic-Oberfläche, die OIDC-Bibliothek. Fremdcode bringt eigene Tests mit. Getestet wird, was hier entschieden wurde: die Zugriffsregel, das Rollen-Mapping, die Meta-Generierung, die Migrations-Konvertierung.

---

## 9. Phasen

| Phase | Inhalt | Ergebnis |
|---|---|---|
| **1 — Fundament** | Ein Inhaltsbaum statt zwei, Dockerfile-Defekt, `instrumentation.ts` entfernen, Marken-Tokens, Mobilansicht, Deployment auf `docs-neu.` | Lauffähige, gestaltete, leere Plattform |
| **2 — Zugriff** | `canAccess`, Frontmatter-Vertrag, Auth.js gegen WP-OIDC, mu-Plugin für Rollen, Baum-/Such-/Sitemap-Filter, Tests | Rollenschutz funktioniert und ist getestet |
| **3 — Öffentliche Inhalte** | Migration der neun WP-Anleitungen samt Bildern, Outstatic-Konfiguration, `meta.json`-Generator, CI-Validierung, Rebuild-Pipeline, WP-Wegweiser-Seite | Öffentliche Doku produktiv |
| **4 — Interne Inhalte** | Wiki.js-Export, Konvertierung, Navigation neu, Rollen setzen, Cutover auf `docs.` mit Redirects | Wiki.js abgelöst |
| **5 — Ask AI** | `/api/chat`, rollengefiltertes Retrieval, `llms.txt` auf `public` beschränkt, AVV | Ask AI produktiv |

Phase 2 ist die Voraussetzung für alles Weitere und wird **vor** dem Einbringen echter Inhalte fertiggestellt — Inhalte in eine Plattform ohne funktionierenden Zugriffsschutz zu laden, erzeugt genau das Leck, das dieser Entwurf vermeidet. Phase 1 geht deshalb mit leerem Inhaltsbaum live.

Dieses Dokument beschreibt den **Zielzustand über alle fünf Phasen**. Implementierungspläne entstehen phasenweise; der erste deckt Phase 1 und 2 ab, weil sie zusammen den ersten sinnvoll prüfbaren Zustand ergeben.

---

## 10. Offene Punkte

| # | Punkt | Vorgehen |
|---|---|---|
| 1 | Auf welchem Node läuft der Container? | Deployment-Parameter, festzulegen vor dem ersten Deploy in Phase 1. Anforderung: Docker-Host im `proxy-network`, ausgehend HTTPS zu GitHub und WordPress |
| 2 | Liefert `/wp-json/wp/v2/users/me` mit Bearer-Token Rollen? | Spike in Phase 2, nur relevant als Rückfallweg, falls das mu-Plugin nicht gebaut werden soll |
| 3 | Welcher Modellanbieter für Ask AI? | Entscheidung in Phase 5, zusammen mit dem AVV |
| 4 | Redirect-Tabelle Wiki.js alt→neu | Wird in Phase 4 aus dem Export erzeugt |
| 5 | Editorkreis über das IT-Team hinaus | Aktuell nicht erforderlich. Sobald nicht-technische Redakteure dazukommen, ist die GitHub-Bindung von Outstatic neu zu bewerten — Outstatic kennt keinen zweiten Auth-Provider |

---

## 11. Bewusst verworfen

- **Payload CMS / DB-gestütztes CMS** — anderer Anwendungsfall, separat zu behandeln
- **oauth2-proxy als Traefik-Middleware** — kennt nur Pfade, keine Frontmatter; fünf überlappende Rollen ließen sich nur über eine Pfadhierarchie abbilden, Cross-Links und eine gemeinsame Suche gingen verloren
- **Zwei Container (öffentlich statisch / intern geschützt)** — dieselbe Begründung, zusätzlich doppelte Navigation
- **Hybrid aus statischen und dynamischen Seiten** — siehe §3.1
- **Laufzeit-MDX-Kompilierung aus Git-Volume** — würde die Rebuild-Zeit auf Sekunden drücken, kostet aber Eigenbau und Build-Zeit-Prüfung. Später nachrüstbar, falls die 3–5 Minuten stören
- **Mehrsprachigkeit, externe Such-Backends** — nicht erforderlich
