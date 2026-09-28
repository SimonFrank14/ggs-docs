---
title: Lizenzlogik im Detail
description: Alle Regeln auf einen Blick – Status von Plätzen und Codes, welcher Code vergeben wird, wann etwas verfällt oder ersetzt wird
status: published
slug: lizenzlogik
publishedAt: 2026-09-28T00:00:00.000Z
order: 60
roles:
  - label: Lehrkräfte
    value: lehrer
  - label: Verwaltung
    value: verwaltung
---

Diese Seite ist das Nachschlagewerk: Hier steht, nach welchen Regeln GGS Media Plätze und Codes vergibt, zurückholt und ersetzt. Die Schritt-für-Schritt-Anleitungen findest du in den anderen Seiten dieses Bereichs.

## Status eines Platzes

Ein **Platz** (Seat) ist der Anspruch einer Person auf ein Buch.

![Lebenslauf eines Platzes: Reserviert, Eingelöst, Abgelaufen und Zurückgeholt mit den Übergängen](/images/anleitungen/ggs-media/lebenslauf-platz.svg)

| Status | Bedeutung | Blockiert einen Code? |
|---|---|---|
| **reserviert** | Zugewiesen, aber noch nicht abgerufen | ja, einen freien Platz im Pool |
| **eingelöst** | Code angezeigt und fest zugeteilt | ja, endgültig |
| **abgelaufen** | Laufzeit vorbei, nachdem der Code abgerufen wurde | Code bleibt verbraucht |
| **zurückgeholt** | Vor dem Abruf beendet | nein, Platz ist wieder frei |

Jede Person hat pro Buch höchstens **einen aktiven** Platz (reserviert oder eingelöst und nicht abgelaufen). Zuweisungen, Regeln und der Import überspringen Personen, die schon einen haben.

### Laufzeit eines Platzes

| Laufzeit | Endet | Entsteht durch |
|---|---|---|
| **Schuljahr** | am nächsten Stichtag (erster Tag der Sommerferien) | Zuweisen, Kurs-Regel, Weitergeben |
| **Dauerhaft** | nie | Zuweisen, Kurs-Regel, Weitergeben, Anton-CSV – nur mit Codes ohne Ablaufdatum |
| **Kurzausleihe** | nach der gewählten Zahl von Wochen | nur Weitergeben |

## Status eines Codes

![Status eines Codes: Frei, Reserviert, Eingelöst, Gesperrt und Abgelaufen mit den Übergängen](/images/anleitungen/ggs-media/lebenslauf-code.svg)

| Status | Bedeutung |
|---|---|
| **frei** | Im Pool, kann vergeben werden |
| **reserviert** | Fest einem Platz zugeordnet, aber noch nicht abgerufen. Kommt nur bei personengebundenen Codes vor. |
| **eingelöst** | Einer Person angezeigt. Wird **nie wieder** vergeben, auch nicht nach Ablauf des Platzes. |
| **abgelaufen** | Die Charge ist beim Verlag abgelaufen. Wird nicht mehr vergeben. |
| **gesperrt** | Von Hand oder als defekt aus dem Verkehr gezogen. Zählt nicht zum Bestand. |

## Wie viele Codes sind frei?

**Frei im Pool** = freie Codes minus reservierte Plätze, die noch keinen Code haben.

Ein Beispiel: Ein Buch hat 30 freie Codes. 24 Personen haben einen reservierten Platz, aber noch nichts abgerufen. Dann zeigt GGS Media **6 frei** – auch wenn technisch noch 30 Codes unberührt sind. So kann nie mehr zugewiesen werden, als Codes da sind.

**Fehlende Lizenzen** auf der Übersicht zählt Mitglieder von aktiven Regeln, die noch keinen Platz haben, und für die auch kein Code mehr frei ist. So viele Codes müssen nachgekauft werden.

## Welcher Code wird vergeben?

Der Code wird erst beim **Abruf** ausgesucht, nicht beim Zuweisen. GGS Media nimmt den ältesten Bestand zuerst:

1. Nur freie Codes, die nicht personengebunden sind und deren Charge nicht abgelaufen ist
2. Zuerst Codes, deren Charge **am frühesten abläuft**. Codes ohne Ablaufdatum kommen zuletzt.
3. Bei gleichem Ablauf die **früher importierte** Charge
4. Innerhalb der Charge der **älteste** Code

So werden Codes mit Ablaufdatum verbraucht, bevor sie verfallen, und dauerhafte Codes bleiben als Reserve.

Bei **personengebundenen** Büchern (Anton) steht der Code schon beim Import fest. Die Person bekommt immer genau den Code, der beim Anbieter auf sie registriert ist.

Ist beim Abruf kein Code mehr frei, sieht die Person: „Kein freier Code mehr im Pool — bitte an die Medienverwaltung wenden".

## Wann wird etwas ersetzt oder zurückgeholt?

| Situation | Was passiert |
|---|---|
| Person ruft Code innerhalb der Rückholfrist nicht ab | Nachtlauf holt den Platz zurück. Unter Meine Lizenzen steht **Platz verfallen** mit **Neu anfordern**. Der Platz geht an andere Wartende. |
| … und die Person ist noch in einem Kurs mit Regel für das Buch | Die Regel versorgt sie **nicht** automatisch neu, bis zum Ende der Laufzeit des verfallenen Platzes (meist: Stichtag). Sie bekommt das Buch über **Neu anfordern**, von Hand oder im nächsten Schuljahr. |
| Platz von Hand zurückgeholt | wie verfallen: die Regel gibt ihn derselben Person nicht automatisch wieder |
| Stichtag, Code nicht abgerufen | Platz wird zurückgeholt, Code bleibt frei |
| Stichtag, Code abgerufen | Platz läuft ab, Code bleibt verbraucht |
| Kurzausleihe vorbei | wie am Stichtag |
| Charge beim Verlag abgelaufen | Freie und reservierte Codes der Charge werden **abgelaufen**. Eingelöste bleiben eingelöst. |
| Ablaufdatum einer Charge in die Zukunft verschoben | Abgelaufene Codes der Charge werden wieder **frei** |
| Code defekt gemeldet | Alter Code wird **gesperrt**, die Person bekommt sofort den nächsten freien Code (personengebunden: nur einen für sie registrierten) |
| Regel entfernt | Nicht abgerufene Plätze der Regel gehen zurück in den Pool, abgerufene bleiben. Legst du die Regel neu an, werden alle Mitglieder wieder versorgt. |
| Regel pausiert | Keine neuen Plätze. Bestehende bleiben, und **Neu anfordern** über diese Regel geht nicht mehr. |
| Person verlässt den Kurs | Nichts. Ein abgerufener Platz bleibt bis zum Stichtag, ein nicht abgerufener verfällt nach der Rückholfrist und wird nicht erneuert. |
| Neues Kursmitglied | Nächster Nachtlauf (oder **Jetzt abgleichen**) legt einen Platz an – bei automatischen Regeln |
| Neue Codes importiert mit **Danach direkt an offene Regeln verteilen** | Alle aktiven Regeln dieses Buchs werden sofort abgeglichen |
| Import rückgängig gemacht | Charge und Codes werden gelöscht, Reservierungen darauf aufgehoben. Nur möglich, solange kein Code abgerufen wurde. |
| Buch gelöscht | Alle Codes, Plätze und Regeln des Buchs werden gelöscht |

## Neu anfordern

Unter Meine Lizenzen kann eine Person einen **verfallenen** oder **abgelaufenen** Platz neu anfordern. Das klappt nur, wenn

- sie für das Buch keinen anderen aktiven Platz hat,
- sie Mitglied eines Kurses mit einer **aktiven** Regel für das Buch ist und
- ein Code frei ist (personengebunden: noch ein für sie registrierter Code frei ist).

Der neue Platz ist reserviert, bekommt die Laufzeit der Regel und eine neue Rückholfrist. Ohne passende Regel erscheint „Kein Kurs versorgt dich aktuell mit diesem Buch — bitte an die Medienverwaltung wenden". Dann weist du das Buch von Hand zu.

## Der Nachtlauf

Jede Nacht um 3:30 Uhr läuft GGS Media diese Schritte in dieser Reihenfolge ab. Unter **Rücknahme** kannst du ihn mit **Jetzt ausführen** auch sofort starten.

1. **Rückholfrist**: Reservierte Plätze, deren Frist abgelaufen ist, gehen zurück in den Pool.
2. **Laufzeitende**: Reservierte Plätze mit abgelaufener Laufzeit gehen zurück in den Pool, eingelöste werden **abgelaufen**.
3. **Verlagsablauf**: Freie und reservierte Codes aus abgelaufenen Chargen werden **abgelaufen**.
4. **Aufräumen**: Codes, deren Status nicht zu ihrem Platz passt, werden korrigiert. Ein Code mit aktivem Platz ist nie frei; ein reservierter Code ohne aktiven Platz wird wieder frei.
5. **Abgleich**: Jede aktive Regel mit automatischen Nachrückern sucht ihren Kurs (notfalls über den Namen, siehe [Wie eine Regel ihren Kurs findet](/lizenzverwaltung/zuweisen-und-kurs-regeln#wie-eine-regel-ihren-kurs-findet)) und legt für jedes Mitglied ohne Platz einen an, solange Codes frei sind. Übersprungen wird, wer seinen Platz in der laufenden Laufzeit verfallen ließ oder ihn von Hand zurückgeholt bekam.

Das Ergebnis steht auf der Übersicht unter **Nächster Stichtag** und im **Verlauf** als **Nachtlauf**.

> **Gut zu wissen:** Zum Stichtag legt Schritt 5 sofort Plätze für das neue Schuljahr an – für die Mitglieder der Teams, die GGS Media in dieser Nacht findet. Nicht mitgezählt werden archivierte Teams und Teams, deren Name mit einem Schuljahres-Vorsatz wie `S25_26` beginnt. Sind die alten Teams zum Stichtag noch aktiv und heißen noch gleich, bekommen deren Mitglieder Plätze für das neue Jahr, und die Regel bleibt beim alten Team. Wie und wann die Teams zum Schuljahreswechsel umgestellt werden, klärst du mit dem IT-Team.
