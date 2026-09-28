---
title: Datenbank sichern und wiederherstellen
description: Backup der SchILD-3-Datenbank im SVWS-Server als SQLite-Datei herunterladen und bei Bedarf wieder einspielen
status: published
slug: datenbank-sichern
publishedAt: 2026-09-28T00:00:00.000Z
order: 10
featured: true
roles:
  - label: Nur IT-Team
    value: admin
  - label: Lehrkräfte
    value: lehrer
  - label: Verwaltung
    value: verwaltung
author:
  name: Simon Frank
  picture: https://avatars.githubusercontent.com/u/71044587?v=4
---

SchILD 3 speichert alle Schuldaten auf dem **SVWS-Server**. In dessen Admin-Oberfläche lädst du mit wenigen Klicks ein vollständiges Backup der Datenbank als **SQLite-Datei** herunter. Mit derselben Datei stellst du den Stand später wieder her.

> **Wichtig:** Das Backup enthält **alle Daten der Schule**, auch Noten und Adressen von Schülerinnen und Schülern. Speichere es nur am festgelegten, geschützten Speicherort der Schule, nie auf einem privaten Gerät, einem ungesicherten USB-Stick oder in einem privaten Cloud-Speicher.

## Das brauchst du

- Einen PC im Verwaltungsnetz mit einem aktuellen Browser
- Die Zugangsdaten des Benutzers **root** für die SVWS-Administration

## Wann du ein Backup machst

- **Vor jedem Update** des SVWS-Servers oder von SchILD 3
- **Vor großen Änderungen**, zum Beispiel Schuljahreswechsel, Import aus anderen Programmen oder Versetzung
- Zusätzlich **regelmäßig**, zum Beispiel am letzten Schultag jedes Monats

## Backup erstellen

1. Öffne im Browser [svws.ggs.nrw/admin](https://svws.ggs.nrw/admin). Gib als **Benutzername** `root` und das **Passwort** ein **(1)** und klicke auf **Anmelden** **(2)**.

   ![Anmeldeseite der SVWS-Administration mit markierten Feldern für Benutzername und Passwort und der Schaltfläche Anmelden](/images/anleitungen/svws-backup/anmelden.webp)

2. Links unter **Schema** ist die Datenbank **svwsdb** schon ausgewählt **(1)**. Klicke rechts unter **Sicherung** auf **Backup** **(2)**, um den Bereich aufzuklappen.

   ![Admin-Oberfläche mit ausgewähltem Schema svwsdb und markiertem Bereich Backup](/images/anleitungen/svws-backup/schema-auswaehlen.webp)

3. Klicke auf **Backup starten (.sqlite)** **(1)**. Das Backup dauert je nach Datenmenge bis zu einigen Minuten. Schließe das Fenster in der Zeit nicht.

   ![Aufgeklappter Bereich Backup mit markierter Schaltfläche Backup starten (.sqlite)](/images/anleitungen/svws-backup/backup-starten.webp)

4. Der Browser lädt die Datei herunter. Benenne sie mit dem Datum, zum Beispiel `svwsdb_2026-09-28.sqlite`, und verschiebe sie an den geschützten Speicherort.

5. Prüfe, dass die Datei nicht leer ist. Ein Backup ist in der Regel mehrere Megabyte groß.

6. Klicke links unten auf **Abmelden**.

> **Hinweis:** **Backup starten (.zip)** erstellt dasselbe Backup als gepackte Datei. Sie ist kleiner, lässt sich aber genauso wiederherstellen. Nimm im Zweifel die `.sqlite`-Datei.

## Backup wiederherstellen

> **Achtung:** Das Wiederherstellen **überschreibt alle Daten** im ausgewählten Schema. Alles, was seit dem Backup eingetragen wurde, ist danach weg. Erstelle deshalb vorher ein neues Backup des aktuellen Stands (siehe oben) und sag dem Sekretariat Bescheid. Niemand darf in der Zeit mit SchILD 3 arbeiten.

1. Melde dich wie oben unter [svws.ggs.nrw/admin](https://svws.ggs.nrw/admin) an und prüfe, dass links das richtige Schema **svwsdb** ausgewählt ist.

2. Klicke unter **Initialisieren / Wiederherstellen** auf **Backup wiederherstellen** **(1)**, um den Bereich aufzuklappen.

   ![Aufgeklappter Bereich Backup wiederherstellen mit markierten Schaltflächen Datei auswählen und Wiederherstellen](/images/anleitungen/svws-backup/wiederherstellen.webp)

3. Klicke auf **Datei auswählen** **(2)** und wähle die Backup-Datei (`.sqlite` oder `.zip`) aus.

4. Klicke auf **Wiederherstellen** **(3)**. Warte, bis die Meldung erscheint, dass die Wiederherstellung abgeschlossen ist.

5. Öffne SchILD 3 und prüfe stichprobenartig, ob die Daten stimmen.

## Klappt nicht?

- **Anmeldung schlägt fehl?** Achte auf Groß- und Kleinschreibung beim Passwort. Die Zugangsdaten für `root` hat nur das IT-Team.
- **Download startet nicht?** Erlaube im Browser Downloads für `svws.ggs.nrw` und versuche es erneut.
- **Wiederherstellen ist ausgegraut?** Es ist noch keine Datei ausgewählt. Wähle zuerst mit **Datei auswählen** ein Backup aus.
- **Immer noch nicht?** Schreib dem IT-Support im Teams-Chat **IT-Support** oder an [support@goethe-gymnasium-stolberg.de](mailto:support@goethe-gymnasium-stolberg.de). Mach bis dahin **keine** weiteren Versuche mit dem Wiederherstellen.