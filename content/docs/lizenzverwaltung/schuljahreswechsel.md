---
title: Schuljahreswechsel
description: Was zum Stichtag mit Plätzen, Codes und Kurs-Regeln passiert und was du vorher und nachher prüfen solltest
status: published
slug: schuljahreswechsel
publishedAt: 2026-09-28T00:00:00.000Z
order: 50
roles:
  - label: Lehrkräfte
    value: lehrer
  - label: Verwaltung
    value: verwaltung
---

Ein neues Schuljahr braucht in GGS Media **kein neues Zuordnen**. Die Kurs-Regeln laufen weiter und versorgen die neuen Kursmitglieder von selbst. Du musst nur prüfen, ob genug Codes da sind und ob jede Regel ihren Kurs wiederfindet.

## Der Stichtag

Der **Stichtag** ist der **erste Tag der Sommerferien** in NRW. GGS Media holt die Ferientermine automatisch von [OpenHolidays](https://openholidaysapi.org). Ist der Dienst nicht erreichbar, rechnet GGS Media vorübergehend mit dem 1. Juli und versucht es später erneut. Das aktuelle Schuljahr siehst du oben rechts, den nächsten Stichtag auf der **Übersicht**.

In der ersten Nacht ab dem Stichtag passiert automatisch:

| Was | Passiert mit |
|---|---|
| Schuljahres-Plätze, deren Code **abgerufen** wurde | werden **abgelaufen**. Der Code bleibt verbraucht und wird nie neu vergeben. Die Person sieht ihn weiter unter „Abgelaufene anzeigen". |
| Schuljahres-Plätze, die **nicht abgerufen** wurden | gehen zurück in den Pool |
| **Dauerhafte** Plätze | bleiben unverändert bei der Person |
| Freie Codes aus Chargen mit Ablauf zu diesem Stichtag | werden **abgelaufen** und nicht mehr vergeben |
| Kurs-Regeln | laufen weiter. Sie versorgen ab jetzt die Mitglieder mit Plätzen bis zum **nächsten** Stichtag. |

## Die Seite Schuljahreswechsel

Unter **Schuljahreswechsel** siehst du schon vor dem Stichtag, was passieren wird.

![Schuljahreswechsel von 2026/27 nach 2027/28 mit Kennzahlen und dem Übergang jeder Regel](/images/anleitungen/ggs-media/schuljahreswechsel.webp)

Oben stehen:

- **Regeln laufen weiter**: laufen ohne dein Zutun
- **Seats verfallen**: Plätze, die zum Stichtag enden
- **Dauerhaft — bleiben**: Plätze ohne Ablauf
- **Braucht Entscheidung**: Regeln, bei denen das Team fehlt oder der Pool nicht reicht

Die Tabelle zeigt für jede Regel den Bedarf im neuen Jahr und wie viele Codes nach dem Stichtag frei sind:

| Übergang | Bedeutung | Was tun? |
|---|---|---|
| **läuft automatisch** | Team gefunden, genug Codes | nichts |
| **Pool reicht nicht** | Mehr Mitglieder als freie Codes nach dem Stichtag | **Klären** → Codes nachkaufen und importieren |
| **Kein Team mit diesem Namen** / **Mehrere Teams mit diesem Namen** | Die Regel findet ihren Kurs nicht eindeutig | **Klären** → das richtige Team wählen |
| **wartet auf neue Teams** | In den Sommerferien sind die neuen Teams oft noch nicht angelegt | abwarten und nach dem ersten Schultag noch einmal prüfen |

Die alten Teams werden zum Schuljahreswechsel archiviert. GGS Media ignoriert archivierte Teams, deshalb zeigen die Regeln in den Ferien **wartet auf neue Teams**. Sobald ein neues Team mit demselben Namen angelegt ist, folgt die Regel ihm automatisch im nächsten Nachtlauf.
| **pausiert** | Regel ist pausiert | bei Bedarf unter Kurs-Regeln fortsetzen |

**Wechsel prüfen** lädt die Vorschau neu. **… Regeln jetzt abgleichen** versorgt sofort alle Mitglieder, statt auf die Nacht zu warten.

## Checkliste

**Vor den Sommerferien**

1. Öffne **Schuljahreswechsel** und prüfe alle Zeilen mit **Pool reicht nicht**.
2. Bestelle fehlende Codes beim Verlag.
3. Prüfe unter **Kurs-Regeln**, ob Regeln für Kurse, die es nicht mehr gibt, entfernt werden sollen.

**In den Sommerferien, nach dem Stichtag**

4. Importiere die neuen **Schuljahres-Codes** erst jetzt (siehe Hinweis unten).

**Nach dem ersten Schultag**

5. Öffne **Kurs-Regeln** und kläre alle Regeln mit **Team fehlt** oder **Name mehrdeutig** über **Mit anderem Team verknüpfen**.
6. Klicke auf **Alle abgleichen**.
7. Prüfe auf der **Übersicht** die Karte **Fehlende Lizenzen**.

> **Wichtig:** Eine Charge mit der Laufzeit **Schuljahr** läuft zum **nächsten** Stichtag ab. Importierst du die Codes für das neue Schuljahr schon **vor** den Sommerferien, laufen sie am Stichtag sofort ab. Importiere sie deshalb nach dem Stichtag – oder wähle **Mehrere Jahre** mit 2 Jahren. Aus Versehen zu früh importiert? Unter **Bücher & Pools** → **Charge bearbeiten** das Ablaufdatum auf den richtigen Stichtag setzen; die Codes werden dann wieder frei.

> **Gut zu wissen:** Wer im neuen Schuljahr **dasselbe Buch** weiter braucht, bekommt über seine neue Kurs-Regel einen **neuen** Platz und ruft einen **neuen** Code ab – der alte Code ist ja verbraucht. Bücher, die über mehrere Jahre genutzt werden, weist du deshalb am besten **dauerhaft** zu. Das geht nur mit Codes ohne Ablaufdatum.

## Der Nachtlauf

GGS Media erledigt all das in einem **Nachtlauf**, jede Nacht um 3:30 Uhr. Wann er zuletzt lief und was er getan hat, steht auf der **Übersicht** unten rechts. Ist er länger als 26 Stunden nicht gelaufen, wird der Hinweis rot – dann informiere das IT-Team. Verpasst der Server eine Nacht, holt er den Lauf beim nächsten Start nach. Was der Nachtlauf im Einzelnen tut, steht in [Lizenzlogik im Detail](/lizenzverwaltung/lizenzlogik#der-nachtlauf).
