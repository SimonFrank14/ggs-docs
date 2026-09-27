---
title: iPads im Unterricht steuern
description: "Für Lehrkräfte: Mit Jamf Teacher und Apple Classroom Schüler-iPads einschränken, anzeigen, sperren und Inhalte verteilen"
status: published
slug: ipads-im-unterricht-steuern
publishedAt: 2026-09-27T00:00:00.000Z
order: 40
roles:
  - label: Öffentlich
    value: public
---

Mit zwei Apps steuerst du die iPads deiner Klasse: **Jamf Teacher** und **Apple Classroom**. Diese Anleitung beschränkt sich auf die wichtigsten Funktionen.

Faustregel:

- **Jamf Teacher** für die Vorbereitung und den Beginn der Stunde: Apps und Websites einschränken, Apps installieren.
- **Apple Classroom** während der Stunde: Bildschirme ansehen, sperren, Apps öffnen, Inhalte teilen.

## Das brauchst du

- Ein iPad, auf dem du mit der **verwalteten Apple-ID der Schule** angemeldet bist (`v.nachname@goethe-gymnasium-stolberg.de`)
- Die Apps **Apple Classroom** und **Jamf Teacher**. Auf Schul-iPads sind beide schon installiert.

## Einmalig einrichten

### Apple Classroom

1. Öffne **Einstellungen** und tippe oben links auf dein Profil.
2. Steht dort nicht deine Schul-E-Mail-Adresse, tippe unten auf **Abmelden** und melde dich mit der Apple-ID der Schule neu an.
3. Auf einem privaten iPad installierst du zusätzlich **Apple Classroom** aus dem App Store.

### Jamf Teacher

1. Öffne **Jamf Teacher** (auf privaten iPads vorher installieren).
2. Erlaube alle Berechtigungen, nach denen die App fragt (Mitteilungen, Bluetooth, Standort). Die App braucht sie, um zu funktionieren.
3. Nur auf privaten iPads: Melde dich an mit
   - **Domain:** `goethegsstolberg`
   - **Benutzername:** `v.nachname@goethe-gymnasium-stolberg.de`
   - **Passwort:** dein persönliches Jamf-Passwort

Schul-iPads sind bereits vorkonfiguriert.

## Klassen und Gruppen

Alle Teams, die die IT angelegt hat, erscheinen automatisch als Klassen in Classroom und Jamf Teacher. Teams, die du selbst angelegt hast, legst du in **Apple Classroom** über **+** als Klasse an. Von dort wird sie auch in Jamf Teacher übernommen.

### Schülerinnen und Schüler auswählen

Fast jede Aktion wirkt auf eine Auswahl. Nachdem du die Klasse geöffnet hast, wählst du:

- **Alle Schüler** in der Seitenleiste (Standard),
- eine **Gruppe** in der Seitenleiste,
- **Auswählen** oben rechts, dann einzelne Personen, dann **Fertig**, oder
- eine **einzelne Person** direkt. Dann öffnet sich das Fenster **Aktionen**.

### Gruppe in Apple Classroom anlegen

Classroom bildet einige Gruppen automatisch, etwa nach der gerade geöffneten App. Eigene Gruppen legst du so an:

1. Wähle die Klasse aus.
2. Tippe in der Seitenleiste auf **Neue Gruppe**.
3. Gib einen Namen ein und tippe auf **OK**.
4. Wähle die Mitglieder aus und tippe auf **Hinzufügen**.
5. Tippe oben rechts auf **Fertig**.

Zum Ändern, Duplizieren, Umbenennen oder Löschen tippst du oben in der Seitenleiste auf **Bearbeiten** und dann neben der Gruppe auf **Aktionen**. Löschen kannst du nur selbst angelegte Gruppen.

### Gruppe in Jamf Teacher anlegen

1. Wähle die Klasse aus.
2. Tippe unter der Aktionsleiste im Gruppen-Menü auf **Erstellen**.
3. Gib einen Namen ein und wähle die Mitglieder aus.
4. Tippe auf **Sichern**.

Zum Bearbeiten oder Löschen drückst du lange auf die Gruppe.

## Unterricht vorbereiten (Jamf Teacher)

### Lektion mit Einschränkungen erstellen

In einer **Lektion** legst du fest, welche Apps und Websites in der Stunde erlaubt sind. Alles andere wird auf den Schüler-iPads ausgeblendet. Lektionen lassen sich wiederverwenden.

1. Tippe in der Seitenleiste auf **Lektionen** und dann auf **+** bzw. **Unterrichtsstunde erstellen**.
2. Gib einen **Namen** ein (Beschreibung optional).
3. **Erlaubte Apps:** Tippe auf **Bearbeiten**, hake die erlaubten Apps an und tippe auf **< Unterrichtsstunde erstellen**.
4. **Erlaubte Websites:** Tippe auf **Website hinzufügen**, gib einen Titel und die vollständige Adresse ein (mit `https://`, am besten aus Safari kopiert) und tippe auf **Return**. Wiederhole das für jede Website.
   - **Auf diese Websites beschränken** einschalten, damit nur diese Websites erreichbar sind. Ohne diese Option erscheinen sie nur als Verknüpfungen in Safari.
   - **In Safari sperren** nur einschalten, wenn die Schülerinnen und Schüler außer Safari keine App brauchen.
5. **Kategorie-basierter App-Filter** (optional): Schalte ganze App-Kategorien aus. Das wirkt nur, wenn du keine erlaubten Apps festgelegt hast.
6. **Sonstige Einschränkungen** (optional): Schalte z. B. Kamera oder Autokorrektur ab.
7. Tippe auf **Sichern**.

Was du nicht einstellst, wird nicht eingeschränkt. Über die drei Punkte bei einer Lektion kannst du sie später bearbeiten, über **Teilen** an Kolleginnen und Kollegen weitergeben.

> **Wichtig:** Erlaubte Apps müssen auf den Schüler-iPads installiert sein. Installiere sie im Zweifel vorher (siehe unten).

### Lektion starten

1. Tippe in der Seitenleiste auf **Lektionen** und dann auf die Lektion.
2. Wähle bei **Automatisches Löschen**, nach welcher Zeit die Einschränkungen enden.
3. Wähle die Klasse aus und tippe auf **Starten**.

Alternativ öffnest du unter **Klassen** die Klasse, wählst die Schülerinnen und Schüler aus und tippst in der Aktionsliste auf **Unterrichtsstunde starten**.

### Apps auf Schüler-iPads installieren

Du kannst jede App aus dem App Store der Schule verteilen. Weitere Apps bekommst du über den IT-Support.

1. Tippe in der Seitenleiste auf **Klassen** und wähle die Klasse aus.
2. Wähle die Schülerinnen und Schüler aus.
3. Tippe in der Aktionsliste auf **Apps installieren**.
4. Wähle die App aus der Liste oder über die Suche.
5. Bestätige mit **Ja**, warte und tippe auf **Fertig**.

## Während des Unterrichts (Apple Classroom)

Öffne jeweils zuerst die Klasse und wähle die Schülerinnen und Schüler aus. Tippe am Ende auf **Fertig**.

| Du möchtest … | Tippe in der Aktionsliste auf … |
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

1. Öffne die Datei, das Bild oder die Website auf deinem iPad.
2. Tippe auf **Teilen** → **AirDrop** und wähle die Gruppe aus.

Schülerinnen und Schüler teilen mit dir ebenfalls über **Teilen**. Die geteilten Objekte findest du in Classroom über das **Freigabefeld** in der Aktionsliste.

### Hinweise zu Apps und Websites

- Classroom kann nur auf **eine** App beschränken. Mehrere erlaubte Apps legst du vorher in Jamf Teacher fest.
- Eine App lässt sich nur öffnen, wenn sie auf dem Schüler-iPad installiert ist. Bücher und PDFs müssen in der App **Bücher** auf allen Geräten liegen.
- Für **Navigieren** → **Safari** muss die Website als Lesezeichen in deinem Safari gespeichert sein. Ist in Jamf Teacher ein Web-Filter aktiv, muss die Website dort erlaubt sein.
- In Safari können Schülerinnen und Schüler zu anderen Seiten wechseln. Das verhinderst du nur mit **Auf diese Websites beschränken** in Jamf Teacher.

Vergessene Codes setzt du ebenfalls in Classroom bzw. Jamf Teacher zurück, siehe [Passwörter von Schülerinnen und Schülern zurücksetzen](/konto/passwoerter-zuruecksetzen).

## Unterricht beenden

Heb am Ende der Stunde alle Einschränkungen auf, damit die iPads in der nächsten Stunde wieder frei nutzbar sind.

1. **Shared iPads:** Wähle in Classroom die Schülerinnen und Schüler aus und tippe auf **Aktionen** → **Abmelden**. Die Dokumente der Schülerinnen und Schüler werden in die iCloud übertragen. Solange das läuft, zeigt das iPad beim Abmelden ein App-Symbol an.
2. **Classroom:** Tippe in der Aktionsliste auf **Aktionen** → **Unterricht beenden**.
3. **Jamf Teacher:** Öffne die Klasse, tippe oben links auf **Klasse verlassen** und dann auf **Einschränkungen löschen und gehen**.

Danach zeigt Classroom die **Klassenzusammenfassung**: welche Apps wie lange genutzt wurden, was geteilt wurde und wer teilgenommen hat. Tippe auf eine App oder eine Person, um eine Zeitleiste zu sehen. Speichern lässt sich die Zusammenfassung nicht.

> **Tipp:** Stell in Jamf Teacher beim Start das **Automatische Löschen** auf die restliche Stundenzeit. Spätestens um 15:30 Uhr löscht das System alle Einschränkungen.

## Klappt nicht?

- **Klasse fehlt in Classroom?** Prüfe, ob du mit der Apple-ID der Schule angemeldet bist. Selbst angelegte Teams legst du in Classroom über **+** an.
- **App lässt sich nicht öffnen oder fehlt nach der Lektion?** Installiere die App vorher über Jamf Teacher.
- **Kategorie-Filter wirkt nicht?** Er greift nur, wenn in der Lektion keine erlaubten Apps festgelegt sind.
- **Schüler-iPads sind noch eingeschränkt?** Verlass die Klasse in Jamf Teacher mit **Einschränkungen löschen und gehen**.
- **Immer noch nicht?** Schreib dem IT-Support im Teams-Chat **IT-Support** oder an [support@goethe-gymnasium-stolberg.de](mailto:support@goethe-gymnasium-stolberg.de).
