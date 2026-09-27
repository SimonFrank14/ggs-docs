---
title: iPads im Unterricht steuern
description: Mit Jamf Teacher und Apple Classroom Schüler-iPads einschränken, anzeigen, sperren und Inhalte verteilen
status: published
slug: ipads-im-unterricht-steuern
publishedAt: 2026-09-27T00:00:00.000Z
order: 10
roles:
  - label: Öffentlich
    value: public
---

Mit zwei Apps steuern Sie die iPads Ihrer Klasse: **Jamf Teacher** und **Apple Classroom**. Diese Anleitung beschränkt sich auf die wichtigsten Funktionen.

Faustregel:

- **Jamf Teacher** für die Vorbereitung und den Beginn der Stunde: Apps und Websites einschränken, Apps installieren.
- **Apple Classroom** während der Stunde: Bildschirme ansehen, sperren, Apps öffnen, Inhalte teilen.

## Das brauchen Sie

- Ein iPad, auf dem Sie mit der **verwalteten Apple-ID der Schule** angemeldet sind (`v.nachname@goethe-gymnasium-stolberg.de`)
- Die Apps **Apple Classroom** und **Jamf Teacher**. Auf Schul-iPads sind beide schon installiert.

## Einmalig einrichten

### Apple Classroom

1. Öffnen Sie **Einstellungen** und tippen Sie oben links auf Ihr Profil.
2. Steht dort nicht Ihre Schul-E-Mail-Adresse, tippen Sie unten auf **Abmelden** und melden Sie sich mit der Apple-ID der Schule neu an.
3. Auf einem privaten iPad installieren Sie zusätzlich **Apple Classroom** aus dem App Store.

### Jamf Teacher

1. Öffnen Sie **Jamf Teacher** (auf privaten iPads vorher installieren).
2. Erlauben Sie alle Berechtigungen, nach denen die App fragt (Mitteilungen, Bluetooth, Standort). Die App braucht sie, um zu funktionieren.
3. Nur auf privaten iPads: Melden Sie sich an mit
   - **Domain:** `goethegsstolberg`
   - **Benutzername:** `v.nachname@goethe-gymnasium-stolberg.de`
   - **Passwort:** Ihr persönliches Jamf-Passwort

Schul-iPads sind bereits vorkonfiguriert.

## Klassen und Gruppen

Alle Teams, die die IT angelegt hat, erscheinen automatisch als Klassen in Classroom und Jamf Teacher. Teams, die Sie selbst angelegt haben, legen Sie in **Apple Classroom** über **+** als Klasse an. Von dort wird sie auch in Jamf Teacher übernommen.

### Schülerinnen und Schüler auswählen

Fast jede Aktion wirkt auf eine Auswahl. Nachdem Sie die Klasse geöffnet haben, wählen Sie:

- **Alle Schüler** in der Seitenleiste (Standard),
- eine **Gruppe** in der Seitenleiste,
- **Auswählen** oben rechts, dann einzelne Personen, dann **Fertig**, oder
- eine **einzelne Person** direkt. Dann öffnet sich das Fenster **Aktionen**.

### Gruppe in Apple Classroom anlegen

Classroom bildet einige Gruppen automatisch, etwa nach der gerade geöffneten App. Eigene Gruppen legen Sie so an:

1. Wählen Sie die Klasse aus.
2. Tippen Sie in der Seitenleiste auf **Neue Gruppe**.
3. Geben Sie einen Namen ein und tippen Sie auf **OK**.
4. Wählen Sie die Mitglieder aus und tippen Sie auf **Hinzufügen**.
5. Tippen Sie oben rechts auf **Fertig**.

Zum Ändern, Duplizieren, Umbenennen oder Löschen tippen Sie oben in der Seitenleiste auf **Bearbeiten** und dann neben der Gruppe auf **Aktionen**. Löschen können Sie nur selbst angelegte Gruppen.

### Gruppe in Jamf Teacher anlegen

1. Wählen Sie die Klasse aus.
2. Tippen Sie unter der Aktionsleiste im Gruppen-Menü auf **Erstellen**.
3. Geben Sie einen Namen ein und wählen Sie die Mitglieder aus.
4. Tippen Sie auf **Sichern**.

Zum Bearbeiten oder Löschen drücken Sie lange auf die Gruppe.

## Unterricht vorbereiten (Jamf Teacher)

### Lektion mit Einschränkungen erstellen

In einer **Lektion** legen Sie fest, welche Apps und Websites in der Stunde erlaubt sind. Alles andere wird auf den Schüler-iPads ausgeblendet. Lektionen lassen sich wiederverwenden.

1. Tippen Sie in der Seitenleiste auf **Lektionen** und dann auf **+** bzw. **Unterrichtsstunde erstellen**.
2. Geben Sie einen **Namen** ein (Beschreibung optional).
3. **Erlaubte Apps:** Tippen Sie auf **Bearbeiten**, haken Sie die erlaubten Apps an und tippen Sie auf **< Unterrichtsstunde erstellen**.
4. **Erlaubte Websites:** Tippen Sie auf **Website hinzufügen**, geben Sie einen Titel und die vollständige Adresse ein (mit `https://`, am besten aus Safari kopiert) und tippen Sie auf **Return**. Wiederholen Sie das für jede Website.
   - **Auf diese Websites beschränken** einschalten, damit nur diese Websites erreichbar sind. Ohne diese Option erscheinen sie nur als Verknüpfungen in Safari.
   - **In Safari sperren** nur einschalten, wenn die Schülerinnen und Schüler außer Safari keine App brauchen.
5. **Kategorie-basierter App-Filter** (optional): Schalten Sie ganze App-Kategorien aus. Das wirkt nur, wenn Sie keine erlaubten Apps festgelegt haben.
6. **Sonstige Einschränkungen** (optional): Schalten Sie z. B. Kamera oder Autokorrektur ab.
7. Tippen Sie auf **Sichern**.

Was Sie nicht einstellen, wird nicht eingeschränkt. Über die drei Punkte bei einer Lektion können Sie sie später bearbeiten, über **Teilen** an Kolleginnen und Kollegen weitergeben.

> **Wichtig:** Erlaubte Apps müssen auf den Schüler-iPads installiert sein. Installieren Sie sie im Zweifel vorher (siehe unten).

### Lektion starten

1. Tippen Sie in der Seitenleiste auf **Lektionen** und dann auf die Lektion.
2. Wählen Sie bei **Automatisches Löschen**, nach welcher Zeit die Einschränkungen enden.
3. Wählen Sie die Klasse aus und tippen Sie auf **Starten**.

Alternativ öffnen Sie unter **Klassen** die Klasse, wählen die Schülerinnen und Schüler aus und tippen in der Aktionsliste auf **Unterrichtsstunde starten**.

### Apps auf Schüler-iPads installieren

Sie können jede App aus dem App Store der Schule verteilen. Weitere Apps erhalten Sie über den IT-Support.

1. Tippen Sie in der Seitenleiste auf **Klassen** und wählen Sie die Klasse aus.
2. Wählen Sie die Schülerinnen und Schüler aus.
3. Tippen Sie in der Aktionsliste auf **Apps installieren**.
4. Wählen Sie die App aus der Liste oder über die Suche.
5. Bestätigen Sie mit **Ja**, warten Sie und tippen Sie auf **Fertig**.

## Während des Unterrichts (Apple Classroom)

Öffnen Sie jeweils zuerst die Klasse und wählen Sie die Schülerinnen und Schüler aus. Tippen Sie am Ende auf **Fertig**.

| Sie möchten … | Tippen Sie in der Aktionsliste auf … |
|---|---|
| Bildschirme ansehen | **Bildschirm anzeigen** (zum Vergrößern mit zwei Fingern aufziehen; zurück mit **Initialen anzeigen**) |
| Bildschirme sperren oder freigeben | **Sperren** bzw. **Entsperren** |
| Ton stummschalten | **Stumm** |
| eine App öffnen | **Apps** und dann die App |
| die Schüler in einer App festhalten | **Apps**, **Nach Öffnen auf App beschränken** einschalten, dann die App |
| die App wieder freigeben | **Entsperren** |
| geöffnete Apps ausblenden | **Ausblenden** |
| eine Website oder ein Buch öffnen | **Navigieren**, dann **Safari** (Lesezeichen) oder **Bücher** (EPUB, PDF) |
| einen Schülerbildschirm an den Beamer senden | **AirPlay**, dann das Gerät des Raumes; gegebenenfalls den angezeigten PIN-Code eingeben (nur einzelne Person) |

> **Hinweis:** Sperren und Stummschalten gehen nur im Präsenzunterricht. Gesperrte Geräte entsperren die Schülerinnen und Schüler mit ihrem Code. Stumm betrifft nur Medien, Systemtöne bleiben hörbar, und die Lautstärke lässt sich wieder hochdrehen.

### Dateien und Links teilen

1. Öffnen Sie die Datei, das Bild oder die Website auf Ihrem iPad.
2. Tippen Sie auf **Teilen** → **AirDrop** und wählen Sie die Gruppe aus.

Schülerinnen und Schüler teilen mit Ihnen ebenfalls über **Teilen**. Die geteilten Objekte finden Sie in Classroom über das **Freigabefeld** in der Aktionsliste.

### Hinweise zu Apps und Websites

- Classroom kann nur auf **eine** App beschränken. Mehrere erlaubte Apps legen Sie vorher in Jamf Teacher fest.
- Eine App lässt sich nur öffnen, wenn sie auf dem Schüler-iPad installiert ist. Bücher und PDFs müssen in der App **Bücher** auf allen Geräten liegen.
- Für **Navigieren** → **Safari** muss die Website als Lesezeichen in Ihrem Safari gespeichert sein. Ist in Jamf Teacher ein Web-Filter aktiv, muss die Website dort erlaubt sein.
- In Safari können Schülerinnen und Schüler zu anderen Seiten wechseln. Das verhindern Sie nur mit **Auf diese Websites beschränken** in Jamf Teacher.

Vergessene Codes setzen Sie ebenfalls in Classroom bzw. Jamf Teacher zurück, siehe [Passwörter von Schülerinnen und Schülern zurücksetzen](/lehrkraefte/passwoerter-zuruecksetzen).

## Unterricht beenden

Heben Sie am Ende der Stunde alle Einschränkungen auf, damit die iPads in der nächsten Stunde wieder frei nutzbar sind.

1. **Shared iPads:** Wählen Sie in Classroom die Schülerinnen und Schüler aus und tippen Sie auf **Aktionen** → **Abmelden**. Ihre Dokumente werden in die iCloud übertragen. Solange das läuft, zeigt das iPad beim Abmelden ein App-Symbol an.
2. **Classroom:** Tippen Sie in der Aktionsliste auf **Aktionen** → **Unterricht beenden**.
3. **Jamf Teacher:** Öffnen Sie die Klasse, tippen Sie oben links auf **Klasse verlassen** und dann auf **Einschränkungen löschen und gehen**.

Danach zeigt Classroom die **Klassenzusammenfassung**: welche Apps wie lange genutzt wurden, was geteilt wurde und wer teilgenommen hat. Tippen Sie auf eine App oder eine Person, um eine Zeitleiste zu sehen. Speichern lässt sich die Zusammenfassung nicht.

> **Tipp:** Stellen Sie in Jamf Teacher beim Start das **Automatische Löschen** auf die restliche Stundenzeit. Spätestens um 15:30 Uhr löscht das System alle Einschränkungen.

## Klappt nicht?

- **Klasse fehlt in Classroom?** Prüfen Sie, ob Sie mit der Apple-ID der Schule angemeldet sind. Selbst angelegte Teams legen Sie in Classroom über **+** an.
- **App lässt sich nicht öffnen oder fehlt nach der Lektion?** Installieren Sie die App vorher über Jamf Teacher.
- **Kategorie-Filter wirkt nicht?** Er greift nur, wenn in der Lektion keine erlaubten Apps festgelegt sind.
- **Schüler-iPads sind noch eingeschränkt?** Verlassen Sie die Klasse in Jamf Teacher mit **Einschränkungen löschen und gehen**.
- **Immer noch nicht?** Schreiben Sie dem IT-Support im Teams-Chat **IT-Support** oder an [support@goethe-gymnasium-stolberg.de](mailto:support@goethe-gymnasium-stolberg.de).
