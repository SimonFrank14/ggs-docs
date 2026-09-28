---
title: GGS Media im Überblick
description: Wie die Lizenzverwaltung für digitale Schulbücher aufgebaut ist und welche Begriffe du kennen musst
status: published
slug: ueberblick
publishedAt: 2026-09-28T00:00:00.000Z
order: 10
roles:
  - label: Lehrkräfte
    value: lehrer
  - label: Verwaltung
    value: verwaltung
---

**GGS Media** ([media.ggs.nrw](https://media.ggs.nrw)) verwaltet die Lizenzcodes für digitale Schulbücher und Apps. Du importierst die Codes der Verlage, verknüpfst Kurse dauerhaft mit Büchern, und die Schülerinnen und Schüler holen sich ihren Code selbst unter **Meine Lizenzen** ab. Den Code lösen sie danach im Bildungslogin ein.

Diese Anleitungen sind für die Person, die die Lizenzen verwaltet. Wie Schülerinnen, Schüler und Lehrkräfte ihren Code abrufen, steht in [Lizenzcodes abrufen](/schulalltag/meine-lizenzen).

> **Wichtig:** Die Verwaltungsseiten siehst du nur mit der Rolle **Admin** in GGS Media. Die Rolle vergibt das IT-Team.

![Übersicht von GGS Media mit Kennzahlen, Auslastung je Buch und Aufgaben](/images/anleitungen/ggs-media/uebersicht.webp)

## Die wichtigsten Begriffe

| Begriff | Bedeutung |
|---|---|
| **Buch** | Ein Titel, für den es Codes gibt, z. B. „Green Line 3". Auch Apps wie Anton sind Bücher. |
| **Code** | Ein Lizenzschlüssel des Verlags. Jeder Code kann **genau einmal** eingelöst werden. |
| **Charge** | Ein Import von Codes, z. B. eine Bestellung. Die Charge legt fest, wie lange die Codes beim Verlag gültig sind. |
| **Pool** | Alle freien Codes eines Buchs. |
| **Platz (Seat)** | Der Anspruch einer Person auf ein Buch für eine bestimmte Zeit. Ein Platz blockiert einen Code im Pool, **welcher** Code es wird, entscheidet sich aber erst beim Abruf. |
| **Kurs-Regel** | Eine dauerhafte Verknüpfung „Kurs oder Klasse → Buch". Die Regel versorgt jede Nacht neue Kursmitglieder und läuft über den Schuljahreswechsel weiter. |
| **Rückholfrist** | So viele Tage darf ein Platz reserviert bleiben, ohne dass der Code abgerufen wird (Standard: 42 Tage). Danach geht der Platz zurück in den Pool. |
| **Stichtag** | Der erste Tag der Sommerferien. Dann enden alle Plätze, die für ein Schuljahr vergeben wurden. |

## So hängt alles zusammen

1. Du legst ein **Buch** an und importierst die Codes als **Charge**. Siehe [Bücher und Codes verwalten](/lizenzverwaltung/buecher-und-codes).
2. Du weist das Buch einem Kurs oder einer Klasse zu und speicherst das als **Kurs-Regel**. Jedes Kursmitglied bekommt einen **reservierten Platz**. Siehe [Zuweisen und Kurs-Regeln](/lizenzverwaltung/zuweisen-und-kurs-regeln).
3. Die Person öffnet **Meine Lizenzen** und tippt auf **Zum Anzeigen antippen**. Erst jetzt wird ihr ein konkreter Code fest zugeteilt. Der Platz ist dann **eingelöst**.
4. Wer seinen Code nicht innerhalb der Rückholfrist abruft, verliert den Platz wieder. Das und defekte Codes stehen in [Rücknahme, Weitergabe und defekte Codes](/lizenzverwaltung/ruecknahme-und-ersatz).
5. Zum Stichtag enden die Schuljahres-Plätze, die Regeln laufen weiter. Siehe [Schuljahreswechsel](/lizenzverwaltung/schuljahreswechsel).

Alle Regeln im Detail (welcher Code vergeben wird, wann ein Platz verfällt, was der Nachtlauf tut) findest du in [Lizenzlogik im Detail](/lizenzverwaltung/lizenzlogik).

## Warum Plätze statt fester Codes?

Früher wurde jeder Person gleich beim Zuweisen ein Code fest zugeordnet. Holte sie ihn nie ab, war der Code trotzdem weg. Heute blockiert eine Zuweisung nur einen **Platz**. Der Code wird erst beim Abruf ausgesucht. Nicht abgerufene Plätze kommen deshalb ohne Verlust zurück in den Pool.

## Die Seiten im Menü

| Bereich | Seite | Wofür |
|---|---|---|
| Überblick | **Übersicht** | Bestand, Auslastung, fehlende Lizenzen und offene Aufgaben |
| | **Verlauf** | Jede Änderung mit Zeit und Person; Importe und Zuweisungen lassen sich rückgängig machen |
| | **Berichte** | Auslastung, Einlösequote, Matrix Stufe × Fach; Export als PDF oder CSV |
| Zuteilung | **Kurs-Regeln** | Alle dauerhaften Zuordnungen Kurs → Buch |
| | **Zuweisen** | Plätze an Klassen, Kurse oder einzelne Personen vergeben |
| | **Zuteilungen** | Alle Plätze mit Status, Code und Ablauf; defekte Codes ersetzen |
| | **Rücknahme** | Nicht abgerufene Plätze zurückholen und Codes weitergeben |
| Bestand | **Bücher & Pools** | Bücher anlegen, Chargen und einzelne Codes verwalten |
| | **Codes importieren** | Verlagscodes einfügen |
| | **Anton-CSV** | Personengebundene Lizenzen importieren |
| Schuljahr | **Schuljahreswechsel** | Vorschau, was zum Stichtag mit jeder Regel passiert |
| | **Meine Lizenzen** | Deine eigenen Lizenzen – diese Seite sehen alle |

Oben rechts findest du die **Suche** (auch mit Strg + K) nach Buch, Kurs oder Person und das aktuelle **Schuljahr**.
