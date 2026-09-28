---
title: Zuweisen und Kurs-Regeln
description: Bücher an Klassen, Kurse und Personen vergeben und mit Kurs-Regeln dauerhaft versorgen
status: published
slug: zuweisen-und-kurs-regeln
publishedAt: 2026-09-28T00:00:00.000Z
order: 30
roles:
  - label: Lehrkräfte
    value: lehrer
  - label: Verwaltung
    value: verwaltung
---

Beim Zuweisen bekommt jede Person einen **reservierten Platz**. Ein Code wird dabei noch nicht festgelegt – das passiert erst, wenn die Person ihn unter Meine Lizenzen abruft. Klassen, Kurse und Personen kommen aus den Teams und Schulkonten (Microsoft 365).

## Bücher zuweisen

1. Öffne **Zuweisen**.
2. Wähle unter **1 · Empfänger** eine oder mehrere Klassen, Kurse oder Personen. Personen findest du über die Suche nach dem Namen.
3. Wähle unter **2 · Bücher** ein oder mehrere Bücher. Rechts steht, wie viele Codes frei sind und wie viele für die Auswahl fehlen würden.
4. Prüfe die **3 · Vorschau** und wähle die Optionen (siehe unten).
5. Klicke auf **… Seats reservieren**.

![Zuweisen: Klasse 10A Orga und das Buch À plus! 4 ausgewählt, Vorschau mit 8 neuen Seats und 16 bereits versorgten Personen](/images/anleitungen/ggs-media/zuweisen.webp)

Die Vorschau zeigt:

- **Neue Seats**: So viele Personen bekommen jetzt einen Platz.
- **Bereits versorgt (übersprungen)**: Diese Personen haben schon einen aktiven Platz für das Buch, egal ob über eine andere Regel oder von Hand. Niemand bekommt ein Buch doppelt.
- **Konflikte**: z. B. **Pool zu klein**. Reicht der Pool nicht, bekommen nur so viele Personen einen Platz, wie Codes frei sind. Der Rest geht leer aus, bis Codes nachgekauft sind.
- **Abgleich mit Kurs-Regeln**: ob es für den Kurs schon eine Regel gibt oder ob eine angelegt wird.

### Optionen beim Zuweisen

**Laufzeit** – wie lange die Person das Buch behält:

- **Bis Schuljahresende**: Der Platz endet am nächsten Stichtag (erster Tag der Sommerferien). Das ist der Normalfall.
- **Dauerhaft**: Der Platz bleibt für immer bei der Person und wird nie zurückgeholt. Nur wählbar, wenn das Buch freie Codes **ohne Ablaufdatum** hat.

**Regel** – was mit dem Kurs dauerhaft passiert:

- **Kurs-Regel, Nachrücker automatisch** (empfohlen): Es entsteht eine Kurs-Regel. Neue Kursmitglieder bekommen jede Nacht automatisch einen Platz, auch im nächsten Schuljahr.
- **Kurs-Regel, Abgleich von Hand**: Es entsteht eine Regel, neue Mitglieder werden aber nur versorgt, wenn du **Jetzt abgleichen** klickst.
- **Einmalige Zuteilung**: nur die Personen, die jetzt im Kurs sind, keine Regel.

**Lehrkräfte mitversorgen** – ist das eingeschaltet, bekommen auch die Lehrkräfte im Kurs einen Platz.

**Seat-Verfall** zeigt die Rückholfrist des Buchs: So viele Tage hat jede Person Zeit, ihren Code abzurufen.

> **Gut zu wissen:** Einzelne Personen bekommen nie eine Regel, auch wenn du eine Kurs-Regel wählst. Für sie ist jede Zuweisung einmalig.

## Kurs-Regeln

Eine Kurs-Regel heißt: „Dieser Kurs bekommt immer dieses Buch." Du legst sie einmal an und musst im nächsten Schuljahr nichts neu zuordnen.

![Kurs-Regeln mit acht Regeln, Laufzeit, Nachrücker-Schalter, belegten Seats und Status](/images/anleitungen/ggs-media/kurs-regeln.webp)

Unter **Kurs-Regeln** siehst du jede Regel mit:

- **Kurs / Klasse** und Zahl der Mitglieder. Das Symbol neben dem Namen zeigt, ob Lehrkräfte mitversorgt werden. Ein Klick darauf schaltet das um.
- **Laufzeit**: **Schuljahr** (mit Stichtag) oder **dauerhaft**
- **Nachrücker**: **automatisch** oder **manuell**. Mit dem Schalter änderst du das.
- **Seats belegt**: versorgte Mitglieder von allen Mitgliedern. Das Personen-Symbol daneben zählt Mitglieder, die das Buch schon über eine andere Regel oder von Hand haben, das Uhr-Symbol Mitglieder, die ihren Platz verfallen ließen. Diese versorgt die Regel erst wieder nach **Neu anfordern** oder im nächsten Schuljahr.
- **Status** (siehe Tabelle)

Die Knöpfe rechts in jeder Zeile:

- **Jetzt abgleichen** (Pfeile): versorgt sofort alle Mitglieder, die noch keinen Platz haben
- **Pausieren** / **Fortsetzen**: Eine pausierte Regel vergibt keine neuen Plätze. Bestehende Plätze bleiben.
- **Regel entfernen** (Papierkorb): Die Regel verschwindet. **Nicht abgerufene** Plätze dieser Regel gehen zurück in den Pool, abgerufene Codes bleiben bei den Personen.

**Alle abgleichen** oben gleicht alle aktiven Regeln auf einmal ab. **Neue Regel** führt zu **Zuweisen**.

| Status | Bedeutung | Was tun? |
|---|---|---|
| **läuft** | Alles in Ordnung | nichts |
| **Pool zu klein** | Es fehlen Codes für alle Mitglieder | Codes nachkaufen und importieren |
| **pausiert** | Regel vergibt nichts | bei Bedarf fortsetzen |
| **Team fehlt** | Kein Team mit diesem Namen gefunden | **Mit anderem Team verknüpfen** |
| **Name mehrdeutig** | Mehrere Teams heißen gleich | **Mit anderem Team verknüpfen** |
| **wartet auf Team** | Sommerferien: Die neuen Teams gibt es noch nicht | abwarten, siehe [Schuljahreswechsel](/lizenzverwaltung/schuljahreswechsel) |

### Wie eine Regel ihren Kurs findet

Teams werden jedes Schuljahr neu angelegt und bekommen dabei eine neue Kennung. Deshalb merkt sich eine Regel den **Namen** des Kurses, nicht nur das Team. Jede Nacht sucht sie so:

1. Gibt es das bisherige Team noch? Dann gilt es, auch wenn es umbenannt wurde. Archivierte Teams und Teams mit einem Schuljahres-Vorsatz wie `S25_26` im Namen zählen dabei nicht.
2. Sonst: Gibt es **genau ein** Team mit demselben Namen? Dann folgt die Regel automatisch diesem Team. Groß- und Kleinschreibung, Satzzeichen und ein alter Schuljahres-Vorsatz wie `S25_26` spielen dabei keine Rolle.
3. Sonst meldet die Regel **Team fehlt** oder **Name mehrdeutig**.

Heißt der Kurs im neuen Jahr anders, klicke in der Zeile auf **Mit anderem Team verknüpfen** und wähle das richtige Team. GGS Media schlägt ähnliche Namen vor. Der neue Name gilt ab dann für die Regel, sodass sie auch im Jahr darauf das gleichnamige Team findet. Das Umhängen lässt sich im **Verlauf** rückgängig machen.

Für jedes Buch gibt es pro Kursname nur **eine** Regel. Legst du dieselbe Kombination erneut an, wird die bestehende Regel aktualisiert und wieder aktiviert.

### Wer zählt als Mitglied?

- Als **Schülerin oder Schüler** zählt, wer im Schulkonto eine Klasse oder Stufe als Stellenbezeichnung hat (z. B. `07A`, `EF`, `Q1`).
- Alle anderen Mitglieder zählen als **Lehrkraft** und bekommen nur einen Platz, wenn **Lehrkräfte mitversorgen** an ist.
- Wer den Kurs verlässt, behält seinen Platz bis zum Stichtag. Die Regel nimmt ihn nicht zurück.
- Wer seinen Platz verfallen ließ, wird von der Regel bis zum Ende dieser Laufzeit übersprungen (siehe [Rücknahme](/lizenzverwaltung/ruecknahme-und-ersatz#automatisch-die-rückholfrist)).

## Alle Zuteilungen ansehen

Unter **Zuteilungen** siehst du jeden Platz mit Person, Buch, Quelle (Regel, von Hand, CSV-Import), Status, Code und Ablauf. Oben filterst du nach **Eingelöst**, **Reserviert**, **Verfällt bald** (Frist endet in 7 Tagen) und **Abgelaufen**. Die Suche findet Personen, Klassen, Kurse, Bücher und Codes. **Export CSV** lädt alles als Tabelle herunter.

![Zuteilungen mit Filtern, Suchfeld und Tabelle aller Seats](/images/anleitungen/ggs-media/zuteilungen.webp)
