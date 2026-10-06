# Arbeitsregeln für KI-Agenten (Claude Code, Copilot, Cursor, Codex …)

Diese Datei gilt für jede automatisierte Arbeit an diesem Repository. `CLAUDE.md` verweist auf sie.
Lies zusätzlich `README.md` (Architektur) und `CONTEXT-FACHLICH.md` (Curriculum).

## Projekt in einem Satz
Ein einzelnes, eigenständiges HTML-Lernsystem für Schüler:innen eines Geschichts-Leistungskurses in NRW, das sie bis zum Abitur am 13.04.2027 durch alle 14 Schwerpunkte der Abiturvorgaben führt.

## Harte Regeln

1. **Keine Build-Pipeline einführen.** Kein npm-Bundler, kein Framework, kein TypeScript, kein CSS-Präprozessor. Gebaut wird mit `python3 build.py`. Playwright ist nur Testwerkzeug.
2. **Keine externen Laufzeit-Ressourcen** außer Google Fonts. Kein CDN-Skript, keine externen Bilder, kein Fetch zur Laufzeit. Alles inline, Grafik als Inline-SVG oder `data:`-URI.
3. **Nur `src/` bearbeiten, danach neu bauen.** `dist/` ist generiert.
4. **IDs sind Vertrag.** `IF<n>-S<n>-<SK|UK><n>`, Karten-IDs `L-/Z-/U-`, Planaufgaben-IDs. Nicht umbenennen, nicht umsortieren, wenn daran IDs hängen – sonst verlieren Nutzer ihren gespeicherten Fortschritt. Neues wird angehängt.
5. **Speicherzugriffe immer in `try/catch`.** Die Seite muss ohne `localStorage` vollständig funktionieren.
6. **Keine Downloads aus der Seite heraus** (`<a download>`, Blob-Saves). Die veröffentlichte Fassung blockiert sie. Datentransfer läuft über den Text-Code.
7. **Druckbarkeit ist Pflicht**, nicht Kür: Jede neue Komponente braucht ihr Verhalten in `@media print` (hell, ohne Navigation, `break-inside: avoid`). Getestet wird für Chrome, Edge und Safari.
8. **Hell- und Dunkelmodus**: Farben nur über Tokens. Keine Farbe ausschließlich innerhalb eines `@media`- oder `[data-theme]`-Blocks definieren.
9. **Barrierearmut**: sichtbarer Fokus, bedienbar per Tastatur, `aria-label` für Icon-Buttons, ab 400 px kein horizontales Scrollen (Ausnahme: Tabellen in `.tbl-wrap`).
10. **Sprache**: Deutsch. Begleittexte duzen, Aufgabenstellungen siezen (Abitur-Wortlaut). Umlaute müssen in jeder Datei korrekt kodiert sein (UTF-8).

## Fachliche Regeln (nicht verhandelbar)

- **Kompetenzerwartungen wörtlich** aus dem Kernlehrplan (Leistungskurs). Keine Umformulierung, keine GK-Fassungen.
- **Fokussierungen 2027** markieren Gewichtung, streichen nie Inhalte. ★ nur für Erwartungen, die wirklich in den Vorgaben stehen.
- **Sachurteil ≠ Werturteil**: In Urteilsfragen immer trennbar halten; Werturteil mit offengelegtem Maßstab (Grundgesetz).
- **Zeitgenössisch belastete Begriffe** („Machtergreifung“, „Volksgemeinschaft“, „Endlösung“, „Arisierung“, „Reichskristallnacht“ …) immer in Anführungszeichen, im Lexikon mit Hinweis und Alternativbegriff.
- **NS-Zeit und Holocaust**: sachlich, opfersensibel, keine Verharmlosung, keine Täterperspektive ohne Einordnung.
- **Keine erfundenen Fakten, Zitate, Seitenzahlen oder Literaturangaben.** Seitenverweise nur auf „Zeiten und Menschen“ (ISBN 978-3-14-024990-4) und nur, wenn im Inhaltsverzeichnis belegt. Unsicheres mit `[ungeprüft]` kennzeichnen und der Lehrkraft vorlegen.
- **Urheberrecht**: Keine Quellentexte, Abbildungen oder Verlagsmaterialien in die Datei kopieren. Abituraufgaben „Nur für den Dienstgebrauch“ dürfen nicht eingebunden werden; auf die öffentlichen MSB-Seiten verlinken.
- **Datenschutz**: keine Namen von Schüler:innen, keine Serverkommunikation, keine Analytics.

## Typische Aufgaben und wie sie gelöst werden

| Aufgabe | Vorgehen |
|---|---|
| Stichworte ergänzen | Eintrag im passenden `ke[].st`-Array in `src/data1.js` / `data2.js` ergänzen, knapp halten (eine Zeile, ein Gedanke). |
| Neue Karteikarten | Nicht direkt anlegen – sie entstehen automatisch aus `LEX`, `ZL` und den Urteilsfragen. |
| Neues Ereignis in der Zeitleiste | Zeile in `ZL` mit eindeutigem Sortierschlüssel (`1933.2` für Reihenfolge innerhalb eines Jahres). |
| Neue Seite/Route | View-Funktion in `app.js`, Eintrag in `NAV`, Fall im `switch` von `render()`, Titel in der Titel-Map. |
| Design ändern | Nur über Tokens in `style.css`; Komponentenklassen wiederverwenden statt Inline-Styles zu streuen. |
| Änderung ausliefern | `python3 build.py`, dann `node test.js`, dann beide dist-Dateien verteilen (Moodle-Datei + Artifact-Republish unter derselben URL). |

## Definition of Done

- `python3 build.py` läuft fehlerfrei, `node test.js` meldet keine Seitenfehler.
- Alle Routen laden, Selbsteinschätzung, Planer, Karteikarten und Backup funktionieren.
- 400 px: `document.documentElement.scrollWidth === 400`.
- Druck-PDF (hell, auch bei Dunkelmodus) ohne zerschnittene Karten.
- Keine neuen externen Ressourcen, keine neuen Abhängigkeiten.
