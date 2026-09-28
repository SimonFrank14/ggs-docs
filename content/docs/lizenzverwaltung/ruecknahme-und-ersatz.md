---
title: Rücknahme, Weitergabe und defekte Codes
description: Nicht abgerufene Plätze zurückholen, Codes weitergeben, defekte Codes ersetzen und Aktionen rückgängig machen
status: published
slug: ruecknahme-und-ersatz
publishedAt: 2026-09-28T00:00:00.000Z
order: 40
roles:
  - label: Lehrkräfte
    value: lehrer
  - label: Verwaltung
    value: verwaltung
---

Ein reservierter Platz, dessen Code nie abgerufen wird, blockiert einen Code, den jemand anderes brauchen könnte. Solche Plätze holt GGS Media automatisch zurück. Du kannst das aber auch von Hand tun.

## Automatisch: die Rückholfrist

Jedes Buch hat eine **Rückholfrist** (Standard: 42 Tage, einstellbar unter **Bücher & Pools** → **Bearbeiten**). Die Frist beginnt, wenn der Platz reserviert wird. Ruft die Person ihren Code bis dahin nicht ab, holt der **Nachtlauf** den Platz zurück. Unter Meine Lizenzen steht dann **Platz verfallen**, und die Person kann den Platz **neu anfordern**.

Bereits **abgerufene** Codes werden nie zurückgeholt. Ein abgerufener Code ist endgültig vergeben.

> **Gut zu wissen:** Ist die Person noch Mitglied eines Kurses mit einer **automatischen Kurs-Regel** für das Buch, versorgt dieselbe Regel sie im selben Nachtlauf wieder mit einem neuen Platz, solange Codes frei sind. Die Frist beginnt dann von vorn. Endgültig frei wird ein Platz nur, wenn die Person nicht mehr im Kurs ist, die Regel pausiert oder auf manuell gestellt ist, oder wenn der Pool leer ist.

Personengebundene Plätze aus dem Anton-CSV-Import haben **keine** Rückholfrist.

## Von Hand zurückholen

1. Öffne **Rücknahme**.
2. Links unter **Nicht eingelöst — kann zurückgeholt werden** siehst du je Buch, wie viele Plätze reserviert, aber nie abgerufen wurden, für welche Kurse und wie lange schon.
3. Klicke beim Buch auf **Zurückholen**. **Alle** nicht abgerufenen Plätze dieses Buchs gehen sofort zurück in den Pool.

Einzelne Plätze holst du unter **Zuteilungen** zurück: Zeilen anhaken und **Nicht eingelöste zurückholen** klicken.

**Jetzt ausführen** unten links startet den Nachtlauf sofort, zum Beispiel direkt nachdem du eine Rückholfrist verkürzt hast.

![Rücknahme & Weitergabe: links nicht eingelöste Seats je Buch, rechts Pool der zurückgeholten Lizenzen mit Laufzeit und Empfängern](/images/anleitungen/ggs-media/ruecknahme.webp)

## Codes weitergeben

Rechts unter **Weitergeben** siehst du die Bücher, bei denen in diesem Schuljahr Plätze zurückgekommen sind. So vergibst du sie neu:

1. Wähle unter **Pool** das Buch.
2. Wähle die **Neue Laufzeit**:
   - **Bis Schuljahresende** – Standard für Restlaufzeiten
   - **Kurzausleihe** für eine Zahl von Wochen, z. B. 6 Wochen für ein Projekt. Der Platz endet danach wie am Stichtag.
   - **Dauerhaft** – nur bei Büchern mit Codes ohne Ablaufdatum
3. Wähle die **Empfänger**: Klassen, Kurse oder Personen.
4. Klicke auf den Knopf unten, um die Plätze zu reservieren.

Weitergeben ist immer eine **einmalige** Zuteilung ohne Regel. Lehrkräfte werden dabei nicht mitversorgt.

## Defekten Code ersetzen

Meldet der Bildungslogin, dass ein Code ungültig oder schon verwendet ist:

1. Öffne **Zuteilungen** und suche die Person oder den Code.
2. Klicke in der Zeile auf das Pfeil-Symbol **Code defekt — neuen Code zuteilen**.
3. Gib optional einen Grund ein, z. B. „Verlag meldet: Code bereits verwendet", und bestätige.

Dann passiert Folgendes:

- Der alte Code wird **gesperrt** und bekommt eine Notiz mit Datum, Grund und dem Ersatzcode.
- Die Person bekommt sofort den **nächsten freien Code** aus dem Pool. Er ist direkt eingelöst und steht bei ihr unter Meine Lizenzen.
- Bei **personengebundenen** Büchern kommt der Ersatz nur aus den Codes, die für **dieselbe Person** registriert sind. Gibt es keinen, erscheint „Kein weiterer registrierter Code für diese Person vorhanden". Dann brauchst du einen neuen Code vom Anbieter.

Das geht nur bei Plätzen, die schon einen Code haben. Bei einem reservierten Platz ohne Code gibt es nichts zu ersetzen.

## Verlauf und Rückgängig

Unter **Verlauf** steht jede Änderung mit Zeit, Aktion, Buch, Person und wer sie ausgelöst hat – auch die Einträge des Nachtlaufs (**scheduler**). Die Suche oben rechts filtert nach Aktion, Person, Buch oder Code.

![Verlauf mit Nachtlauf, reservierten Seats, verfallenen Plätzen, einem ersetzten Code und abgerufenen Codes](/images/anleitungen/ggs-media/verlauf.webp)

Einige Aktionen haben einen Knopf **Rückgängig**:

| Aktion | Was Rückgängig tut |
|---|---|
| **Codes importiert** (auch Anton-CSV) | Löscht die Charge mit allen Codes und hebt Reservierungen darauf auf. Nicht möglich, sobald ein Code der Charge abgerufen wurde. |
| **Seats reserviert** | Hebt alle noch nicht abgerufenen Plätze dieser Zuweisung auf und entfernt die dabei angelegten Regeln. Abgerufene Codes bleiben. |
| **Platz neu angefordert** | Hebt die Reservierung auf, solange der Code nicht abgerufen ist |
| **Regel umgehängt** | Die Regel zeigt wieder auf das vorherige Team |

Abgerufene Codes lassen sich nie rückgängig machen. Sie sind beim Verlag verbraucht.
