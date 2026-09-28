---
title: Bücher und Codes verwalten
description: Bücher anlegen, Verlagscodes importieren, Chargen pflegen und personengebundene Anton-Lizenzen einlesen
status: published
slug: buecher-und-codes
publishedAt: 2026-09-28T00:00:00.000Z
order: 20
roles:
  - label: Lehrkräfte
    value: lehrer
  - label: Verwaltung
    value: verwaltung
---

Bevor du Lizenzen verteilen kannst, braucht GGS Media das **Buch** und die **Codes** dazu. Codes kommen immer als **Charge** ins System: Eine Charge ist ein Import, zum Beispiel eine Bestellung beim Verlag.

## Buch anlegen

1. Öffne **Bücher & Pools** und klicke auf **Neues Buch**.
2. Fülle die Felder aus:

| Feld | Bedeutung |
|---|---|
| **Titel** | Name des Buchs, z. B. „Green Line 3". Jeder Titel darf nur einmal vorkommen. |
| **Art** | **Buch** oder **App** |
| **Verlag**, **Fach**, **Stufe** | Für Übersicht, Berichte und die Matrix Stufe × Fach |
| **Code-Prefix** | Vorschlag für den Import, z. B. `EKV-` für Klett (siehe unten) |
| **Rückholfrist (Tage)** | So lange darf ein reservierter Platz ungenutzt bleiben (1 bis 365, Standard 42) |
| **Einlöse-URL** | Nur nötig, wenn nicht im Bildungslogin eingelöst wird (z. B. `https://anton.app`). Dann sehen die Schülerinnen und Schüler einen Link „Einlösen bei …". |
| **Standard-Laufzeit** | **Schuljahr** oder **Dauerhaft** – Vorschlag beim Zuweisen |
| **Personengebunden (Anton)** | Nur einschalten, wenn der Verlag jeden Code auf eine bestimmte Person registriert. Siehe [Anton-CSV](#personengebundene-lizenzen-anton-csv). |

3. Klicke auf **Speichern**.

![Bücher & Pools mit der Liste aller Bücher und der Detailansicht von Green Line 3 mit Chargen und Codes](/images/anleitungen/ggs-media/buecher.webp)

In der Detailansicht rechts siehst du:

- **Bestand**, **Belegt** und **Frei**. Gesperrte Codes zählen nicht zum Bestand.
- **Seats**: ein Kästchen pro Code – grün eingelöst, orange reserviert, grau frei.
- **Regeln auf dieses Buch**: welche Kurse das Buch dauerhaft bekommen
- **Chargen** mit Ablaufdatum und wie viele Codes davon in Verwendung sind
- **Codes**: jeder einzelne Code mit Status und, falls vergeben, der Person. Die Suche findet Codes und Namen.

## Codes importieren

1. Öffne **Codes importieren**.
2. Wähle rechts unter **Buch** das Buch aus.
3. Füge die Codes links ein: aus der Zwischenablage, als CSV oder per **Datei wählen**. Trennzeichen dürfen Zeilenumbruch, Komma oder Semikolon sein.
4. Prüfe die Spalte **Wird gespeichert**. Doppelte Codes und Codes, die schon im Bestand sind, werden durchgestrichen und übersprungen.
5. Wähle das **Prefix**. Es wird vor jeden Code gesetzt. Lass **Nur ergänzen, wenn der Code ihn nicht schon hat** eingeschaltet, dann entsteht kein doppeltes `EKV-EKV-`.
6. Wähle die **Laufzeit dieser Charge**, also wie lange die Codes **beim Verlag** gültig sind (siehe unten).
7. Trage bei Bedarf **Bestellnummer** und **Kaufdatum** ein.
8. Lass **Danach direkt an offene Regeln verteilen** eingeschaltet, wenn Kursmitglieder schon auf dieses Buch warten. Sie bekommen dann sofort einen Platz.
9. Klicke auf **… Codes importieren**.

![Codes importieren mit eingefügten Codes, Vorschau mit Prefix WES- und einem übersprungenen Duplikat](/images/anleitungen/ggs-media/import.webp)

> **Gut zu wissen:** Die Prefixe der Verlage sind `WES-` (Westermann), `COR-` (Cornelsen), `EKV-` (Klett) und `CCB-` (Buchner). Das zuletzt verwendete Prefix merkt sich GGS Media am Buch.

### Laufzeit einer Charge

| Laufzeit | Die Codes laufen ab … |
|---|---|
| **Schuljahr** | zum nächsten Stichtag (erster Tag der Sommerferien) |
| **Mehrere Jahre** | zum Stichtag nach der gewählten Zahl von Schuljahren. „3 Jahre" im Schuljahr 2026/27 heißt: Ablauf zu Beginn der Sommerferien 2029. |
| **Dauerhaft** | nie |

Der Ablauf richtet sich immer nach den Sommerferien in NRW, nicht nach dem Kaufdatum. Die Ferientermine holt GGS Media automatisch von [OpenHolidays](https://openholidaysapi.org).

Die Laufzeit hat zwei Folgen:

- Nach dem Ablauf setzt der Nachtlauf alle **noch nicht eingelösten** Codes der Charge auf **abgelaufen**. Sie werden nicht mehr vergeben.
- Ein Buch lässt sich nur dann **dauerhaft** zuweisen, wenn es freie Codes **ohne** Ablaufdatum hat.

## Chargen und Codes pflegen

Alles davon findest du unter **Bücher & Pools** in der Detailansicht eines Buchs.

- **Charge bearbeiten** (Stift): Bezeichnung, Bestellnummer, Kaufdatum und **Läuft ab am** ändern. Leer lassen heißt „ohne Ablauf". Schiebst du das Datum in die Zukunft, werden bereits abgelaufene Codes der Charge wieder frei.
- **Charge löschen** (Papierkorb): nur möglich, solange **kein** Code der Charge eingelöst oder reserviert ist und kein Platz darauf zeigt.
- **Code sperren / freigeben**: Ein freier Code lässt sich sperren, z. B. wenn er sicher kaputt ist. Gesperrte Codes werden nie vergeben. Mit **freigeben** kommt er zurück in den Pool.
- **Codes entfernen**: löscht alle **nicht verwendeten** Codes des Buchs. Eingelöste und reservierte Codes bleiben, leere Chargen verschwinden.
- **Buch löschen**: Zur Bestätigung musst du den Titel eintippen.

> **Wichtig:** **Buch löschen** entfernt auch alle Codes, Plätze und Regeln dieses Buchs, auch eingelöste. Die Schülerinnen und Schüler sehen ihre Codes dann nicht mehr unter Meine Lizenzen. Lösche ein Buch nur, wenn es wirklich nie verwendet wurde.

Einen Import kannst du auch unter **Verlauf** mit **Rückgängig** zurücknehmen, solange noch kein Code der Charge abgerufen wurde. Siehe [Verlauf und Rückgängig](/lizenzverwaltung/ruecknahme-und-ersatz#verlauf-und-rückgängig).

## Personengebundene Lizenzen (Anton-CSV)

Manche Anbieter, zum Beispiel **Anton**, registrieren jeden Code auf eine bestimmte Person. Solche Codes dürfen nicht getauscht oder an jemand anderen weitergegeben werden. Für diese Bücher gilt deshalb:

- Das Buch ist als **Personengebunden** angelegt.
- Codes kommen nur über **Anton-CSV** ins System, nicht über **Codes importieren**.
- Das Buch erscheint beim **Zuweisen** nicht. Jede Person bekommt beim Import direkt ihren eigenen Code.

So importierst du die Liste des Anbieters:

1. Öffne **Anton-CSV**.
2. Wähle rechts unter **Buch / App** das personengebundene Buch.
3. Füge die CSV ein oder klicke auf **Datei wählen**. Die Datei braucht die Spalten **Name**, **E-Mail** und **Lizenzcode**. GGS Media erkennt die Spalten selbst; unter **Spalten-Zuordnung** kannst du sie korrigieren.
4. Prüfe die Tabelle. Jede Zeile wird über die **E-Mail-Adresse** einer Person im Schulkonto zugeordnet, ersatzweise über den Namen.
5. Klicke auf **… Zuordnungen übernehmen**. Übernommen werden nur die Zeilen mit **eindeutig**.
6. Lade mit **… Problemzeilen als CSV** die restlichen Zeilen herunter und kläre sie.

![Anton-CSV mit fünf geprüften Zeilen: zwei eindeutig, eine Person unbekannt, ein doppelter Code und ein Code, der schon im Bestand ist](/images/anleitungen/ggs-media/anton.webp)

| Status | Bedeutung |
|---|---|
| **eindeutig** | Person gefunden, Code neu – wird übernommen |
| **Person unbekannt** | Weder E-Mail noch Name passen zu einem Schulkonto |
| **Namensgleichheit** | Ohne E-Mail passt der Name auf mehrere Personen |
| **Code doppelt** | Der Code steht mehrmals in der Datei |
| **Code liegt schon im Bestand** | Der Code wurde schon früher importiert |

Nach dem Import hat jede Person sofort einen reservierten Platz mit **ihrem** Code und kann ihn unter Meine Lizenzen abrufen. Die Laufzeit folgt der **Standard-Laufzeit** des Buchs (Anton: dauerhaft).

> **Gut zu wissen:** Hat eine Person schon einen aktiven Platz für das Buch, bekommt sie keinen zweiten. Ihr neuer Code bleibt als Reserve für sie im Pool und wird nur ihr zugeteilt, z. B. als Ersatz für einen defekten Code.
