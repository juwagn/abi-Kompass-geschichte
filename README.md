# Abi-Kompass Geschichte LK 2027

Interaktives Lernsystem zur Vorbereitung auf das Zentralabitur Geschichte (Leistungskurs, NRW) am **Di, 13.04.2027**.
Zielgruppe: Schüler:innen eines Q2-Leistungskurses an einer Gesamtschule in NRW.
Autor/Fachlehrer: Julian Wagner, Gesamtschule Horst, Gelsenkirchen.

Das Produkt ist **eine einzige, eigenständige HTML-Datei** ohne Framework, ohne Build-Abhängigkeiten, ohne Server.

---

## 1 · Schnellstart

```bash
# Build (erzeugt beide Fassungen in dist/)
python3 build.py

# lokal ansehen
python3 -m http.server 8000      # dann http://localhost:8000/dist/Abi-Kompass_Geschichte_LK_2027.html
# oder die Datei direkt im Browser öffnen (file:// funktioniert, da alles inline ist)

# optionaler Browsertest (Playwright, nur für CI/Regression)
npm i playwright && node test.js
```

Es gibt **keinen** npm-Build, kein Bundling, kein TypeScript. `build.py` ist bewusst 20 Zeilen Python.

---

## 2 · Verzeichnisstruktur

```
abikompass/
├─ build.py                  # concat: style.css + data*.js + app.js  →  dist/*.html
├─ test.js                   # Playwright-Smoketest: alle Routen, Interaktionen, 400 px, Druck-PDF
├─ src/
│  ├─ style.css              # Design-System (Tokens, Komponenten, Druck, Hell/Dunkel)
│  ├─ data1.js               # IFS (Inhaltsfelder) + SP[] für Inhaltsfeld 4 und 5
│  ├─ data2.js               # SP.push(...) für Inhaltsfeld 6 und 7
│  ├─ data3.js               # LS[] Längsschnitte, ZL[] Zeitleiste, LEX[] Begriffslexikon
│  ├─ data4.js               # EXAM, FERIEN, OPS, BAUPLAN, DL, ZEITPLAN, BAUSTEINE, METHODEN, STRATEGIEN, KI, TANDEM
│  └─ app.js                 # IIFE: Speicher, Planer, Karteikarten, Router, Views, Events
└─ dist/
   ├─ Abi-Kompass_Geschichte_LK_2027.html   # Vollfassung (DOCTYPE/head/body) → Moodle, Download, Offline
   └─ abikompass.html                        # Fragment ohne html/head/body → Claude-Artifact-Publishing
```

Die beiden dist-Dateien haben **identischen** Inhalt, nur unterschiedliche Hülle. Nie direkt in `dist/` editieren – immer `src/` ändern und neu bauen.

---

## 3 · Auslieferungswege

| Kanal | Datei | Hinweis |
|---|---|---|
| Moodle / LOGINEO NRW | `dist/Abi-Kompass_Geschichte_LK_2027.html` | Als **Datei-Ressource** hochladen (Anzeige „Öffnen“). Nicht als Textseite – Moodle entfernt `<script>` aus Textfeldern. |
| Veröffentlichte Seite (Claude Artifact) | `dist/abikompass.html` | Aktuelle Version: `https://claude.ai/code/artifact/c6343702-8cde-46d3-9523-199ddec00e3f` (privat, bis geteilt). Beim Republish dieselbe URL verwenden. |
| Projektablage | Kopie liegt im Claude-Projekt „Unterrichtsassistent Geschichte“ unter `claude/Abi-Kompass_Geschichte_LK_2027.html` |

Beschränkungen der Artifact-Umgebung, die den Code prägen:
- Externe Skripte/Styles sind gesperrt, **außer Google Fonts** → alles andere inline.
- **Downloads aus der Seite heraus sind gesperrt** → Datensicherung läuft über einen Base64-Textcode zum Kopieren, nicht über Dateiexport.
- Die Seite muss auch offline und ohne Fonts funktionieren (Fallback-Stacks sind gesetzt).

---

## 4 · Funktionsumfang (Stand v1)

- **Dashboard**: Countdown, Wochenaufgaben aus dem Planer, Fortschrittsringe je Inhaltsfeld, fällige Karten, 30-Minuten-Vorschlag.
- **Themenkarte → 14 Schwerpunktseiten**: Kompetenzerwartungen im KLP-Wortlaut (LK), Stichworte, Urteilsfragen mit Pro/Contra, 4-stufige Selbsteinschätzung, dreistufige Hilfekarten, „Für Profis“-Kontroverse, Seitenverweise auf „Zeiten und Menschen“, Notizfeld.
- **4 Längsschnitte** als Vergleichsraster mit Urteilsauftrag.
- **Zeitleiste** 1618–1990 (78 Ereignisse) mit Filter und Ordnen-Training.
- **Begriffslexikon** (126 Einträge, belastete Begriffe markiert und kommentiert).
- **Karteikarten**: 235 Karten (Begriffe, Daten, Urteilsfragen), Leitner-System mit 5 Fächern.
- **Klausur-Werkzeugkasten**: Operatoren-Trainer (offizielle Liste), Baupläne Aufgabenart A/B (26/28/26 + 20), Darstellungsleistung, Zeitplan 300 Minuten, Formulierungsbausteine, 6 Methodenschemata, Links zu öffentlichen MSB-Aufgaben.
- **Lernen lernen**: 5 evidenzbasierte Strategien, KI-Nutzung mit Prompt-Vorlagen, Lern-Tandem.
- **Lernplaner**: Rückwärtsplanung bis 13.04.2027 in 3 Zyklen, Ferien berücksichtigt, Aufgaben abhakbar und verschiebbar.
- **Sichern & Drucken**: Text-Code-Backup, Druckansicht „Lernkompass 2027“.

---

## 5 · Technische Architektur

### 5.1 Datenmodell (in-memory, aus `data*.js`)

```js
SP = [{
  id:'IF5-S2', if:5, t:'…Titel…', short:'…', q:'Problemfrage',
  fokus:['…'],                     // Fokussierungen 2027 → ★; [] = keine
  zum:[['264–281','Info: …'], …],  // Seiten in „Zeiten und Menschen“
  ls:['demokratie','nation'],      // Zuordnung zu Längsschnitten
  ke:[
    {id:'IF5-S2-SK4', k:'SK', fk:true, t:'<KLP-Wortlaut>', st:['Stichwort', …]},
    {id:'IF5-S2-UK5', k:'UK', t:'<KLP-Wortlaut>', q:'Urteilsfrage', pro:[…], con:[…]}
  ],
  hilfe:{ b:[[Begriff,Definition], …], s:'<HTML Strukturhilfe>', f:['Formulierung', …] },
  profi:{ t:'Kontroverse', x:'Text' }
}]

LS  = [{id, t, k, q, intro, sp:[spIds], cols:[…], rows:[[Station, …Spalten]], task, taskSrc}]
ZL  = [[sortKey, 'Anzeigedatum', 'Ereignis', [IF-Nummern], [Längsschnitt-IDs]]]
LEX = [['Begriff','Definition', IF, 1?, 'Hinweis bei belasteten Begriffen']]
```

IDs sind **stabil und bedeutungstragend** (`IF<nr>-S<nr>-<SK|UK><lfd>`), weil `localStorage` darauf referenziert. **IDs nie umbenennen**, sonst verlieren Schüler:innen ihren Fortschritt. Neue Einträge nur anhängen.

### 5.2 Persistenz (`localStorage`, Key `abikompass-ge-lk-2027`)

```js
{ v:1,
  e:{ 'IF5-S2-SK4': 0|1|2|3 },          // Selbsteinschätzung
  k:{ 'L-imperialismus': {f:1..5, d:'YYYY-MM-DD'} },  // Leitner-Fach + Fälligkeit
  p:{ start, min, weeks:[{mon,type,phase,tasks:[{id,typ,ref,label,min}]}], example },
  n:{ 'IF5-S2':'Notiz' },
  done:{ 'sp-IF5-S2-A': true },         // erledigte Planaufgaben
  set:{ theme:'auto'|'light'|'dark' } }
```

Jeder Zugriff ist in `try/catch`; ohne Speicher läuft die Seite vollständig, merkt sich nur nichts. Backup/Transfer: `'AK27:' + btoa(unescape(encodeURIComponent(JSON)))`.

Kartengenerierung: Lexikon → `L-<slug>`, Zeitleiste → `Z-<sortKey>`, Urteilsfragen → `U-<keId>`. Leitner-Intervalle `INT=[0,1,3,7,14,30]`.

### 5.3 App (`app.js`)

- Eine IIFE, kein Build, kein Framework. Rendering über `innerHTML` je Route, Events per **Delegation** auf `document` (`data-act="…"`).
- Hash-Router: `#/start`, `#/themen`, `#/sp/<id>`, `#/laengsschnitte`, `#/ls/<id>`, `#/zeitleiste`, `#/lexikon`, `#/karten`, `#/klausur`, `#/lernen`, `#/planer`, `#/sichern`, `#/kompass`.
- `genPlan(start, minutenProWoche)` erzeugt Wochen von Montag bis zur Prüfungswoche, markiert Ferienwochen (≥ 3 Ferientage Mo–Fr) und verteilt: Zyklus A 45 % (alle Schwerpunkte, schwächste zuerst), B 35 % (Längsschnitte, schwache Schwerpunkte, Baupläne), C Rest + Osterferien (Fokus-Wiederholung, Trainer).
- UI-Zustand (Filter, Session, Quiz) lebt in Modulvariablen, **nicht** im Speicher.

### 5.4 Design-System (`style.css`)

Übernommen aus `Design-Schema_Geschichte_NRW.html` des Projekts:
Navy `#14375E`/`#1E3A6E`, Blau `#2F5AA8`, Gelb `#F5C518` (nur Akzent), Flächen `#F4F7FD`/`#EEF3FB`, Rahmen `#D9E2F1`, Text `#1F2A3D`.
Schriften: Bricolage Grotesque (Überschriften), DM Sans (Fließtext), Outfit (Labels), Lora kursiv (Leitfragen/Quellen).
Verbindlich: kein Pergament/Sepia, Gelb nie als große Fläche.

**Drei Themes, drei Zustände**: Tokens in `:root`, Dunkel-Overrides in `@media (prefers-color-scheme:dark){:root:not([data-theme="light"])}` **und** `:root[data-theme="dark"]`. Nie eine Farbe ausschließlich in einem Theme-Block definieren.

**Druck** ist Pflichtanforderung (Chrome, Edge, Safari): `@media print` setzt alle Tokens auf Hell zurück, blendet Navigation/Buttons aus, `break-inside: avoid` für Karten/Zeilen, `beforeprint` öffnet alle `<details>`.

---

## 6 · Fachliche Grundlagen (verbindlich)

| Quelle | Bedeutung |
|---|---|
| **Vorgaben Zentralabitur 2027 Geschichte (MSB NRW)**, S. 5 | 14 inhaltliche Schwerpunkte des LK + Fokussierungen (★). Prüfung LK 300 Min. inkl. Auswahlzeit, 3 Aufgaben zur Wahl, Wörterbuch als Hilfsmittel. |
| **Kernlehrplan Geschichte Sek II NRW (2014)**, LK S. 37–43 | Wortlaut aller 63 Kompetenzerwartungen. Im System als 69 Einträge, weil die beiden IF-7-Erwartungen zu Dimension und Beschlüssen auf 1648/1815/1919/1945 aufgeteilt sind (Feld `pre` kennzeichnet das). |
| **Operatorenübersicht Geschichte (abitur.nrw)** | 17 Operatoren mit Definition und AFB – wörtlich in `OPS`. |
| **Bewertungsbogen Abitur Geschichte NRW** | Darstellungsleistung 5/4/3/4/4 = 20 Punkte. |
| **„Zeiten und Menschen“, Qualifikationsphase, ISBN 978-3-14-024990-4** | Einziges Lehrwerk mit Seitenverweisen (alle Schüler:innen besitzen es). Gesamtband S. 10–598. |
| Termine | Prüfung 13.04.2027, Nachschreibtermin 12.05.2027 (BASS 12-65 Nr. 2). Ferien in `FERIEN` – Osterferien 22.03.–03.04.2027 **noch nicht amtlich geprüft**. |

**Wichtig:** Die Fokussierungen gewichten, sie streichen nichts. Alle Schwerpunkte des KLP bleiben prüfungsrelevant.

---

## 7 · Bekannte Lücken und Backlog

1. **Osterferien 2027 gegen den amtlichen Schulkalender prüfen** (`FERIEN` in `data4.js`), ebenso bewegliche Ferientage.
2. **Moodle-Test ausstehend**: Öffnet LOGINEO die HTML-Datei im Browser oder erzwingt es einen Download?
3. **Jugendopposition** (Fokussierung 2027) hat in „Zeiten und Menschen“ kein eigenes Kapitel; Stichworte stammen aus eigener Darstellung. Alternative Quelle: Horizonte S. 339–344.
4. **Stalinnote** nur im Info-Teil S. 459 ff. des Lehrwerks.
5. **Fachliche Durchsicht** aller Stichworte durch die Lehrkraft steht aus.
6. Mögliche Erweiterungen: Grundkurs-Variante, Druckansicht je Längsschnitt, Export der Notizen, mündliche Prüfung (4. Fach), Verlinkung konkreter Moodle-Kursabschnitte.

---

## 8 · Projektverlauf (Kurzfassung)

1. **Sichtung**: Vorgaben 2027 und KLP ausgewertet, alte TaskCard („Geschichte LK – Abiturwiederholung 2023/24“, nur Q1-Themen) und Lernkompass 2024 abgeglichen. Ergebnis: Urteilskompetenzen fehlten im Altmaterial vollständig, 1648 war leer, mehrere Formulierungen stammten aus dem GK.
2. **Interview** in 5 Runden: Struktur (Schwerpunkte + Längsschnitte), Inhaltstiefe (SK + UK + Urteilsfrage), Differenzierung (gestufte Hilfen), Strategien, Werkzeuge, Planer, Gestaltung.
3. **Konzept** freigegeben, danach Umsetzung und Browsertest.

Die ausführlichen Fassungen liegen im Claude-Projekt: `claude/Lernsystem_Abi2027_Phase1_Sichtung.md` und `claude/Lernsystem_Abi2027_Phase3_Konzept.md`.
