---
title: Passwörter von Schülerinnen und Schülern zurücksetzen
description: Schulkonto-Passwort im Passwortmanager und iPad-Codes über Apple Classroom oder Jamf Teacher zurücksetzen
status: published
slug: passwoerter-zuruecksetzen
publishedAt: 2026-09-27T00:00:00.000Z
order: 20
roles:
  - label: Öffentlich
    value: public
---

Sie können Passwörter und iPad-Codes von Schülerinnen und Schülern selbst zurücksetzen. Prüfen Sie zuerst, welches Passwort betroffen ist — es gibt drei verschiedene.

## Welches Passwort ist betroffen?

- **Microsoft-Schulkonto:** das Passwort zur Schul-E-Mail-Adresse. Es gilt für Teams, Outlook, OneDrive, OneNote, Office, die Goethe-Homepage, das WLAN und die PCs. → [Passwort vom Microsoft-Schulkonto](#passwort-vom-microsoft-schulkonto)

  ![Übersicht der Dienste, die das Microsoft-Schulkonto nutzen: Office 365, Teams, Outlook, OneDrive, Goethe-Homepage, Apple ID, iCloud, PCs und WLAN](/images/anleitungen/passwoerter-zuruecksetzen/dienste-mit-schulkonto.webp)

- **Shared iPad (Klassensätze 1–10):** ein 6-stelliger Zahlencode (`XXX-XXX`), nur zum Anmelden an den Leih-iPads aus dem Lehrerzimmer und von den Fluren. → [Code eines Shared iPads](#code-eines-shared-ipads)

  ![Anmeldebildschirm eines Shared iPads mit Benutzersymbol](/images/anleitungen/passwoerter-zuruecksetzen/shared-ipad-anmeldebildschirm.webp)

- **Eigenes 1:1-iPad (Klassen 7 und 8):** meist ebenfalls ein 6-stelliger Zahlencode, nur zum Entsperren des eigenen iPads auf dem Sperrbildschirm. → [Code eines 1:1-iPads](#code-eines-11-ipads)

## Passwort vom Microsoft-Schulkonto

> **Wichtig:** Den Passwortmanager erreichen Sie nur, wenn Sie sich bei Microsoft mit der vollen Adresse `v.nachname@goethe-gymnasium-stolberg.de` anmelden, nicht mit `v.nachname@ggs.nrw`.

1. Öffnen Sie den [Passwortmanager](https://my.mnspro.cloud/tools/passwords?tid=343d7080-30c7-4b35-99c7-3530f5df0f76&oid=30003800-b16d-4a1b-7871-08d8ed1875bc&embbeded=true). Er ist auch über den Button im Goethe Portal und die Verknüpfung auf dem iPad erreichbar.
2. Suchen Sie die Person heraus, klicken Sie sie an und klicken Sie auf **Passwort ändern**.

   ![Passwortmanager mit der Liste der Schülerinnen und Schüler, eine Person ausgewählt, oben die Schaltfläche Passwort ändern](/images/anleitungen/passwoerter-zuruecksetzen/passwortmanager-person-auswaehlen.webp)

3. Übernehmen Sie das automatisch erzeugte Passwort oder geben Sie ein eigenes ein. Mit dem **Auge** machen Sie es sichtbar, mit dem **Zwischenablage-Symbol** daneben kopieren Sie es.

   ![Fenster Passwort ändern mit Passwortfeld, Auge und Zwischenablage-Symbol](/images/anleitungen/passwoerter-zuruecksetzen/passwortmanager-neues-passwort.webp)

4. Bestätigen Sie. Das neue Passwort gilt sofort.
5. Teilen Sie der Person das neue Passwort mit. Bei der nächsten Anmeldung muss sie ein eigenes neues Passwort festlegen.

> **Hinweis:** Ein eigenes Passwort muss mindestens 8 Zeichen lang sein und drei der vier Zeichenarten enthalten: Kleinbuchstaben, Großbuchstaben, Zahlen, Symbole.

### Mehrere Personen oder ganze Kurse

1. Halten Sie im Passwortmanager die **Umschalttaste** gedrückt und klicken Sie alle betroffenen Personen an. Klicken Sie dann auf **Passwort ändern**.

   ![Passwortmanager mit drei ausgewählten Personen, oben rechts „3 von 152 ausgewählt"](/images/anleitungen/passwoerter-zuruecksetzen/passwortmanager-mehrere-auswaehlen.webp)

2. Für ganze Kurse wechseln Sie oben auf den Reiter **Kurse** und gehen genauso vor.

   ![Reiter Kurse im Passwortmanager mit einem ausgewählten Kurs](/images/anleitungen/passwoerter-zuruecksetzen/passwortmanager-kurse.webp)

3. Wählen Sie, ob alle dasselbe Passwort bekommen oder jede Person ein eigenes, und bestätigen Sie.
4. Teilen Sie den Personen ihr neues Passwort mit.

> **Hinweis:** Wählen Sie individuelle Passwörter, erhalten Sie eine Systemmail mit allen Passwörtern an Ihre Goethe-E-Mail-Adresse.

## Code eines Shared iPads

Das geht mit **Apple Classroom**.

1. Wählen Sie in Classroom die Klasse aus.
2. Tippen Sie auf die Schülerin oder den Schüler. Das Fenster **Aktionen** öffnet sich.
3. Tippen Sie auf **Passwort**.
4. Melden Sie sich mit Ihrer verwalteten Apple-ID (`v.nachname@goethe-gymnasium-stolberg.de`) und Ihrem Passwort an, bestätigen Sie gegebenenfalls die Zwei-Faktor-Authentifizierung und tippen Sie auf **Fertig**.
5. Classroom zeigt ein zufälliges, vorläufiges Passwort an. Teilen Sie es der Schülerin oder dem Schüler mit.

> **Hinweis:** Ist auf dem Shared iPad bereits die Passworteingabe zu sehen, erscheint bei Ihnen die Taste **Passwort senden**. Damit wird die Schülerin oder der Schüler direkt angemeldet. Das Passwort muss danach sofort geändert werden.

## Code eines 1:1-iPads

Das geht mit **Jamf Teacher**.

1. Wählen Sie in Jamf Teacher im Seitenmenü **Klassen** und dann die Klasse aus.
2. Tippen Sie auf die Schülerin oder den Schüler. Die Detailansicht öffnet sich.
3. Tippen Sie auf **Passwort löschen**.
4. Bestätigen Sie oben rechts mit **Löschen**.

Das iPad lässt sich jetzt ohne Code entsperren. Die Schülerin oder der Schüler wird aufgefordert, einen neuen Code festzulegen, und kann das höchstens 60 Minuten aufschieben.

> **Hinweis:** Fingerabdruck und Gesichtserkennung werden dabei ebenfalls gelöscht und müssen neu eingerichtet werden.

## Klappt nicht?

- **Passwortmanager öffnet sich nicht?** Melden Sie sich bei Microsoft ab und mit der vollen Adresse `v.nachname@goethe-gymnasium-stolberg.de` wieder an.
- **Falsches Passwort zurückgesetzt?** Prüfen Sie mit der Übersicht oben, welches der drei Passwörter gemeint ist. Das Schulkonto-Passwort und die iPad-Codes sind unabhängig voneinander.
- **Immer noch nicht?** Schreiben Sie dem IT-Support im Teams-Chat **IT-Support** oder an [support@goethe-gymnasium-stolberg.de](mailto:support@goethe-gymnasium-stolberg.de).
