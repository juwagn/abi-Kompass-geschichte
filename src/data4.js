/* ===== Termine ===== */
const EXAM = {date:'2027-04-13', label:'Di 13.04.2027', nach:'Mi 12.05.2027', dauer:'300 Minuten inkl. Auswahlzeit'};
const FERIEN = [
 {von:'2026-10-17', bis:'2026-11-01', t:'Herbstferien'},
 {von:'2026-12-23', bis:'2027-01-06', t:'Weihnachtsferien'},
 {von:'2027-03-22', bis:'2027-04-03', t:'Osterferien'}
];

/* ===== Operatoren (Übersicht über die Operatoren Geschichte, abitur.nrw) ===== */
const OPS = [
 ['erörtern','Eine These oder Problemstellung auf ihren Wert und ihre Stichhaltigkeit hin abwägend prüfen und auf dieser Grundlage eine eigene Stellungnahme dazu entwickeln. Die Erörterung einer historischen Darstellung setzt deren Analyse voraus.','I–III','übergeordnet','Pro und Contra gewichten, dann ein eigenes, begründetes Fazit. Ohne Fazit keine Erörterung.'],
 ['interpretieren','Sinnzusammenhänge aus Quellen erschließen und eine begründete Stellungnahme abgeben, die auf einer Analyse, Erläuterung und Bewertung beruht.','I–III','übergeordnet','Klammer über Teilaufgabe 1–3 bei Aufgabenart A.'],
 ['analysieren','Formale Merkmale von Materialien untersuchen und Inhalt und Gedankengang von Materialien (Quellen, Darstellungen) wiedergeben bzw. Bildelemente (Karikaturen, historische Gemälde) beschreiben.','überw. II','','Formale Angaben + strukturierter Gedankengang mit Zeilenbelegen. Keine Wertung.'],
 ['begründen','Aussagen (z. B. Urteil, These, Wertung) durch Argumente stützen, die auf historischen Beispielen und anderen Belegen gründen.','überw. II','','Jede Behauptung braucht ein „weil“ und ein Beispiel.'],
 ['beschreiben','Merkmale / Aspekte eines Sachverhaltes oder eines Materials detailliert darstellen.','I–II','','Genau und geordnet – noch ohne Erklärung.'],
 ['beurteilen','Den Stellenwert historischer Sachverhalte in einem Zusammenhang bestimmen, um ohne persönlichen Wertebezug zu einem begründeten Sachurteil zu gelangen.','III','','Sachurteil: Maßstäbe der damaligen Zeit, Wirkung, Plausibilität.'],
 ['bewerten','Wie Operator „beurteilen“, aber zusätzlich mit Offenlegen und Begründen eigener Wertmaßstäbe, die Pluralität einschließen und zu einem Werturteil führen, das auf den Wertvorstellungen des Grundgesetzes basiert.','III','','Sachurteil + Werturteil; Maßstab ausdrücklich nennen (z. B. Menschenwürde, Art. 1 GG).'],
 ['charakterisieren','Historische Sachverhalte in ihren Eigenarten beschreiben und diese dann unter einem bestimmten Gesichtspunkt zusammenfassen.','II–III','','Typische Merkmale herausstellen und unter einem Leitgedanken bündeln.'],
 ['einordnen','Einen oder mehrere historische Sachverhalte in einen historischen Zusammenhang stellen.','überw. II','','Was geschah vorher, gleichzeitig, danach? Welcher Entwicklung gehört die Quelle an?'],
 ['entwickeln','Auf der Grundlage erarbeiteter Ergebnisse zu einer eigenen Deutung gelangen; gewonnene Analyseergebnisse verwerten, um in einem vorgegebenen Textformat (z. B. Rede, Leserbrief, Diskussionsbeitrag) zu einer eigenen Deutung zu gelangen.','II–III','','Textformat einhalten, eigene Deutung sichtbar machen.'],
 ['erläutern','Historische Sachverhalte durch Wissen und Einsichten in einen Zusammenhang einordnen und durch zusätzliche Informationen und Beispiele verdeutlichen.','überw. II','','Zusammenhang herstellen + mit Beispielen veranschaulichen.'],
 ['herausarbeiten','Aus Materialien bestimmte historische Sachverhalte herausfinden, die nicht explizit genannt werden, und Zusammenhänge zwischen ihnen herstellen.','überw. II','','Zwischen den Zeilen lesen: Unausgesprochenes sichtbar machen.'],
 ['nennen','Informationen / Sachverhalte / Merkmale zielgerichtet unkommentiert zusammentragen.','I–II','','Knapp aufzählen, nicht erklären.'],
 ['Stellung nehmen','Eine Problemstellung / eine Bewertung / eine Position auf der Grundlage fachlicher Kenntnisse prüfen und nach sorgfältiger Abwägung eine Einschätzung formulieren.','III','','Position prüfen, abwägen, eigene Einschätzung klar formulieren.'],
 ['untersuchen','Materialien oder historische Sachverhalte kriterienorientiert bzw. aspektgeleitet erschließen.','überw. II','','Kriterien vorab festlegen und nacheinander abarbeiten.'],
 ['vergleichen','Auf der Grundlage von Kriterien historische Sachverhalte problembezogen gegenüberstellen, um Gemeinsamkeiten, Unterschiede, Teil-Identitäten, Ähnlichkeiten, Abweichungen oder Gegensätze darzustellen.','II–III','','Kriterien zuerst, dann Gemeinsamkeiten und Unterschiede – mit Fazit.'],
 ['zusammenfassen','Sachverhalte / Aussagen komprimiert darstellen.','I–II','','Kern in eigenen Worten, deutlich kürzer als das Original.']
];

/* ===== Baupläne ===== */
const BAUPLAN = [
 {id:'A', t:'Aufgabenart A · Interpretation einer Quelle',
  muster:'Interpretieren Sie die vorliegende Quelle, indem Sie<br>1. sie analysieren,<br>2. sie in den Kontext … einordnen und … erläutern / charakterisieren,<br>3. … beurteilen / bewerten / zu … Stellung nehmen.',
  teile:[
   ['1','Analysieren','26','<b>Formal:</b> Verfasser:in (nur für die Quelle relevante Informationen), Quellengattung, Adressat, Zeit und Ort, Anlass, Thema.<br><b>Inhaltlich:</b> Gedankengang in Abschnitten mit Zeilenbelegen, Kernaussagen, Argumentationsweise, sprachliche Mittel, Intention. Wiedergabe im Konjunktiv der indirekten Rede.'],
   ['2','Einordnen + zweiter Operator','28 (meist 14 + 14)','<b>Einordnen:</b> historischer Kontext vor und zum Entstehungszeitpunkt, Bezüge der Quelle zu Ereignissen und Entwicklungen.<br><b>Zweiter Teil</b> (erläutern, charakterisieren …): einen Aspekt der Quelle mit Fachwissen vertiefen, z. B. Weltbild oder Strategie des Verfassers.'],
   ['3','Urteilen','26','<b>Beurteilen</b> = Sachurteil (Maßstäbe der Zeit, Wirkung, Aussagekraft, Perspektive).<br><b>Bewerten</b> = zusätzlich Werturteil mit offengelegten Maßstäben (Grundgesetz).<br>Mehrere Aspekte (etwa drei bis vier) abwägen und zu einem klaren Gesamturteil kommen.']
  ]},
 {id:'B', t:'Aufgabenart B · Analyse einer Darstellung und kritische Auseinandersetzung',
  muster:'1. Analysieren Sie den Text.<br>2. Erläutern Sie … (historische Bezüge) und charakterisieren Sie … / ordnen Sie … ein.<br>3. Beurteilen Sie … / Nehmen Sie Stellung zu … / Erörtern Sie …',
  teile:[
   ['1','Analysieren','26','<b>Formal:</b> Autor:in und Profession, Titel, Erscheinungsjahr und -ort, Textsorte (Fachbuch, Essay, Rede), Thema, Adressaten.<br><b>Inhaltlich:</b> Kernthese, Argumentationsgang mit Belegen und Zeilenangaben, Schlussfolgerung, Intention.'],
   ['2','Erläutern / Einordnen','28 (z. B. 14 + 14 oder 16 + 12)','Die im Text angesprochenen historischen Sachverhalte mit eigenem Fachwissen erläutern, ergänzen und gegebenenfalls korrigieren. Zweiter Teil: z. B. Darstellung von Akteuren charakterisieren.'],
   ['3','Beurteilen / Stellung nehmen / Erörtern','26','Stichhaltigkeit der Argumentation prüfen: Belege, Auslassungen, Standort und Perspektive der Autorin oder des Autors, Gegenpositionen der Forschung. Abwägendes eigenes Urteil.']
  ]}
];

/* ===== Darstellungsleistung (Bewertungsbogen Abitur NRW Geschichte) ===== */
const DL = [
 ['strukturiert seinen Text schlüssig, stringent sowie gedanklich klar und bezieht sich dabei genau und konsequent auf die Aufgabenstellung.',5,'Gliederung nach Teilaufgaben, Einleitungs- und Überleitungssätze, Fazit je Teilaufgabe.'],
 ['bezieht beschreibende, deutende und wertende Aussagen schlüssig aufeinander.',4,'Trenne Beschreibung, Deutung und Urteil sprachlich – und verknüpfe sie mit „daraus folgt“, „dies zeigt“.'],
 ['belegt seine Aussagen durch angemessene und korrekte Nachweise (Zitate, Bezüge u. a.).',3,'Zeilenangaben (Z. 12–15), korrekte Zitate in Anführungszeichen, indirekte Rede.'],
 ['formuliert unter Beachtung der Fachsprache präzise und begrifflich differenziert.',4,'Fachbegriffe aus dem Lexikon nutzen, belastete Begriffe in Anführungszeichen.'],
 ['schreibt sprachlich richtig (Grammatik, Orthografie, Zeichensetzung) sowie syntaktisch und stilistisch sicher.',4,'15 Minuten fürs Korrekturlesen fest einplanen; Wörterbuch ist erlaubt.']
];

/* ===== Zeitplan 300 Minuten ===== */
const ZEITPLAN = [
 ['Auswahl','30','Alle drei Aufgaben lesen: Material, Operatoren, Themen. Entscheiden nach: Wo habe ich für Teilaufgabe 2 und 3 das meiste Wissen?'],
 ['Material erschließen','45','Material zweimal lesen, markieren, Abschnitte mit Zeilen notieren, Gliederung für alle drei Teilaufgaben skizzieren.'],
 ['Teilaufgabe 1','55','Analyse schreiben.'],
 ['Teilaufgabe 2','70','Einordnen und zweiten Operator ausführen – hier liegt das meiste Fachwissen.'],
 ['Teilaufgabe 3','65','Urteil entwickeln: Aspekte, Abwägung, Fazit.'],
 ['Korrektur','20','Sprache, Zeilenbelege, Fachbegriffe, Vollständigkeit prüfen.'],
 ['Puffer','15','Für Unvorhergesehenes.']
];

/* ===== Formulierungsbausteine ===== */
const BAUSTEINE = [
 ['Einleitung der Analyse',['Bei der vorliegenden Quelle handelt es sich um … (Gattung) von … (Verfasser:in), … (Funktion), aus dem Jahr …','Die Quelle richtet sich an … und entstand anlässlich …','Thema ist …; der Verfasser vertritt die Position, dass …']],
 ['Gedankengang wiedergeben',['Zu Beginn stellt der Autor fest, dass … (Z. 1–5).','Daran anknüpfend begründet er … mit … (Z. 6–12).','Abschließend fordert er … (Z. 20–24).','Er betont / behauptet / räumt ein / kritisiert, dass …']],
 ['Einordnen',['Die Quelle entstand in einer Phase, in der …','Unmittelbar zuvor hatte … stattgefunden, sodass …','Die Aussage in Z. … bezieht sich auf …, das heißt …']],
 ['Urteilen',['Aus zeitgenössischer Perspektive erscheint … nachvollziehbar, weil …','Gemessen an den Wertmaßstäben des Grundgesetzes, insbesondere …, ist … zu bewerten als …','Einerseits …, andererseits …; insgesamt überwiegt …','Die Aussagekraft der Quelle ist begrenzt, da …']],
 ['Überleitungen',['Darüber hinaus …','Im Gegensatz dazu …','Daraus ergibt sich …','Dies wird besonders deutlich an …']]
];

/* ===== Methodenschemata ===== */
const METHODEN = [
 {t:'Textquelle interpretieren', zum:'S. 391 (ideologiekritisch), Methodenwerkstatt ab S. 599',
  steps:['Formale Merkmale: Verfasser:in, Gattung, Adressat, Zeit, Ort, Anlass, Thema','Inhalt: Gedankengang in Abschnitten, Kernaussagen mit Zeilen','Sprache und Argumentation: Schlüsselbegriffe, Stilmittel, Wirkungsabsicht','Einordnung: historischer Kontext, Stellung des Verfassers','Beurteilung: Perspektive, Intention, Aussagekraft und Grenzen; ggf. Werturteil']},
 {t:'Karikatur interpretieren', zum:'S. 394',
  steps:['Formale Angaben: Zeichner:in, Veröffentlichungsort und -zeit, Titel/Bildunterschrift','Beschreiben: Personen, Gegenstände, Symbole, Text im Bild – noch ohne Deutung','Deuten: Bedeutung der Symbole und Übertreibungen, Kernaussage','Einordnen: Anlass und Kontext','Beurteilen: Perspektive des Zeichners, Angemessenheit der Kritik']},
 {t:'Plakat interpretieren', zum:'S. 254 (Wahlplakate)',
  steps:['Auftraggeber:in, Zeit, Anlass (z. B. Wahl), Zielgruppe','Bildelemente, Farben (im Abitur: Schwarz-Weiß-Vorlage!), Schrift, Aufbau','Botschaft und Appell; Feindbilder und Leitbilder','Einordnung in die politische Lage','Beurteilung von Wirkungsabsicht und Manipulation']},
 {t:'Politische Rede interpretieren', zum:'S. 283',
  steps:['Redner:in, Anlass, Ort, Publikum, Medium','Aufbau und Gedankengang','Rhetorik: Wir-Ich-Sie-Bezüge, Feindbilder, Wiederholungen, Pathos','Intention: Überzeugen, Mobilisieren, Rechtfertigen','Beurteilung im Kontext: Wahrheitsgehalt, Wirkung']},
 {t:'Statistik interpretieren', zum:'S. 135',
  steps:['Thema, Quelle der Daten, Zeitraum, Raum, Einheit (absolut, %, Index)','Zentrale Werte und Entwicklung beschreiben (Höchst-, Tiefstwerte, Trends)','Erklären mit Fachwissen','Grenzen der Aussagekraft: Erhebungsmethode, Lücken, Interessen der Urheber','Fazit zur Fragestellung']},
 {t:'Darstellung analysieren', zum:'Forum-Seiten, Methodenwerkstatt ab S. 599',
  steps:['Autor:in, Profession, Titel, Jahr, Textsorte','Kernthese und Argumentationsgang mit Zeilenbelegen','Belege und Argumentationsweise (Quellen, Statistiken, Vergleiche)','Standort und Perspektive: Forschungsposition, Zeitbezug','Kritische Prüfung: Stichhaltigkeit, Auslassungen, Gegenpositionen']}
];

/* ===== Lernen lernen ===== */
const STRATEGIEN = [
 {t:'Abrufüben', w:'Wissen aus dem Gedächtnis holen statt nochmal lesen. Jeder erfolgreiche Abruf festigt die Erinnerung stärker als Wiederlesen.',
  bsp:'Schreibe in fünf Minuten alles auf, was du über die Präsidialkabinette weißt – erst dann öffnest du die Themenseite und ergänzt in anderer Farbe.',
  tool:['#/karten','Karteikarten'], tool2:['#/themen','Themenseiten']},
 {t:'Verteiltes Lernen', w:'Lieber viermal 30 Minuten über zwei Wochen als zwei Stunden am Stück. Kleine Pausen zum Vergessen machen den nächsten Abruf wirksamer.',
  bsp:'Der Planer legt jeden Schwerpunkt in drei Zyklen an: Überblick, Vertiefung, Wiederholung.',
  tool:['#/planer','Lernplaner'], tool2:['#/karten','Leitner-System']},
 {t:'Interleaving', w:'Themen mischen statt blockweise lernen. Das Gehirn muss unterscheiden – genau das verlangt die Abiturklausur mit drei Aufgaben zur Wahl.',
  bsp:'Vergleiche 1815 und 1919 in einer Sitzung, statt erst alles zu 1815 zu lernen.',
  tool:['#/laengsschnitte','Längsschnitte'], tool2:['#/karten','gemischter Stapel']},
 {t:'Elaboration', w:'Fragen „Warum?“ und „Wie hängt das zusammen?“ stellen und neue Informationen mit Bekanntem verknüpfen.',
  bsp:'Warum stärkten Kulturkampf und Sozialistengesetz am Ende Zentrum und SPD?',
  tool:['#/themen','Urteilsfragen'], tool2:['#/lernen','Lern-Tandem']},
 {t:'Dual Coding', w:'Worte mit Bildern verbinden: Zeitleisten, Strukturbilder, Schaubilder. Zwei Codes geben zwei Wege zur Erinnerung.',
  bsp:'Zeichne das Machtdreieck des Reichspräsidenten aus Art. 48, 25 und 53 der Weimarer Verfassung.',
  tool:['#/zeitleiste','Zeitleiste'], tool2:['#/klausur','Methodenschemata']}
];

const KI = {
 chancen:['Abfragen lassen: Die KI stellt Fragen, du antwortest ohne Hilfsmittel.','Feedback auf eigene Texte nach Kriterien (Sach- und Werturteil, Belege, Aufbau).','Schwierige Begriffe in anderen Worten erklären lassen.','Gegenargumente zu deiner These sammeln lassen.'],
 grenzen:['KI erfindet Fakten, Zitate, Seitenzahlen und Literatur („Halluzinationen“) – oft sehr überzeugend formuliert.','KI kennt die NRW-Vorgaben 2027 und euren Unterricht nicht zuverlässig.','Im Abitur schreibst du allein und von Hand: Übernommene Texte trainieren nichts.','Persönliche Daten gehören nicht in einen KI-Chat.'],
 regeln:['Erst selbst denken und schreiben, dann KI fragen.','Jede Information mit „Zeiten und Menschen“ oder dem Abi-Kompass prüfen (Begriffe zum Nachschlagen ab S. 623).','Nie fertige Texte übernehmen – nur Feedback und Fragen.','Nur Werkzeuge nutzen, die eure Schule freigegeben hat, und die schulischen KI-Regeln beachten.'],
 prompts:[
  ['Abfrage-Coach','Du bist mein Lernpartner für das Geschichtsabitur im Leistungskurs in NRW. Stelle mir zum Thema [Thema] acht Fragen, immer nur eine. Warte auf meine Antwort und sage mir dann kurz, was stimmt und was fehlt. Verrate keine Lösung, bevor ich geantwortet habe.'],
  ['Feedback auf mein Urteil','Hier ist meine Antwort zur Aufgabe „[Aufgabe]“: [dein Text]. Gib mir Feedback nach drei Kriterien: 1) Unterscheide ich Sachurteil und Werturteil? 2) Sind meine Argumente historisch belegt? 3) Ist mein Fazit abgewogen? Schreibe meinen Text nicht neu, sondern nenne drei konkrete Verbesserungen.'],
  ['Begriff erklären – mit Prüfauftrag','Erkläre mir den Begriff [Begriff] in höchstens fünf Sätzen so, dass ich ihn in einer Geschichtsklausur verwenden kann, und nenne ein historisches Beispiel. Kennzeichne jede Aussage, bei der du unsicher bist.'],
  ['Advocatus Diaboli','Ich vertrete die These „[These]“. Nenne mir die drei stärksten Gegenargumente aus Sicht der Geschichtswissenschaft, ohne mir zuzustimmen. Nenne keine Literatur, die du nicht sicher kennst.']
 ]
};

const TANDEM = [
 ['Abfragen','10 Min.','Gegenseitig Karteikarten abfragen, Rollen nach fünf Minuten tauschen. Falsche Karten notieren.'],
 ['Erklären','15 Min.','Jede Person erklärt einen Schwerpunkt in drei Minuten ohne Notizen. Die andere prüft mit der Themenseite und hakt Stichworte ab.'],
 ['Urteils-Duell','15 Min.','Beide beantworten dieselbe Urteilsfrage in drei Sätzen. Vergleicht Argumente und Maßstäbe: Wo ist es ein Sachurteil, wo ein Werturteil?'],
 ['Absprache','5 Min.','Was nehmen wir uns bis zum nächsten Treffen vor? Termin festlegen.']
];
