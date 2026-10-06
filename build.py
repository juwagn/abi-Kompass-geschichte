import pathlib
base=pathlib.Path(__file__).resolve().parent
src=base/'src'
css=(src/'style.css').read_text(encoding='utf-8')
js='\n'.join((src/f).read_text(encoding='utf-8') for f in ['data1.js','data2.js','data3.js','data4.js','app.js'])
fonts='<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600..800&family=DM+Sans:ital,opsz,wght@0,9..40,400..700;1,9..40,400&family=Lora:ital,wght@0,400..600;1,400..500&family=Outfit:wght@500..700&display=swap">'
body='''<button class="skip" type="button" data-act="skip">Zum Inhalt springen</button>
<div class="topbar noprint"><button id="menubtn" type="button" aria-label="Menü öffnen">☰ Menü</button><span class="nm">Abi-<span>Kompass</span></span><span class="cd"><span class="js-cd"></span> Tage</span></div>
<div class="scrim"></div>
<div class="shell">
<aside class="side noprint" aria-label="Navigation">
<div class="brand"><div class="eb">Geschichte LK · Abitur 2027</div><div class="nm">Abi-<span>Kompass</span></div><div class="bar"></div><div class="cd">noch <b class="js-cd"></b> Tage bis zur Prüfung</div></div>
<nav class="nav" id="nav"></nav>
<div class="side-foot"><button id="themebtn" class="themebtn" type="button">Darstellung <b>Automatisch</b></button><small>Gesamtschule · Qualifikationsphase 2 · Schuljahr 2026/27</small></div>
</aside>
<main class="main" id="main" tabindex="-1"><div class="page" id="page"><p>Der Abi-Kompass wird geladen …</p></div></main>
</div>
<noscript><p style="padding:20px">Der Abi-Kompass braucht JavaScript. Bitte öffne die Datei im Browser (nicht in der Vorschau) oder aktiviere JavaScript.</p></noscript>
'''
title='<title>Abi-Kompass Geschichte LK 2027</title>'
frag=title+'\n'+fonts+'\n<style>\n'+css+'\n</style>\n'+body+'<script>\n'+js+'\n</script>\n'
(base/'dist/abikompass.html').write_text(frag,encoding='utf-8')
full='<!DOCTYPE html>\n<html lang="de">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n'+title+'\n'+fonts+'\n<style>\n'+css+'\n</style>\n</head>\n<body>\n'+body+'<script>\n'+js+'\n</script>\n</body>\n</html>\n'
(base/'dist/Abi-Kompass_Geschichte_LK_2027.html').write_text(full,encoding='utf-8')
(base/'dist/index.html').write_text(full,encoding='utf-8')
(base/'index.html').write_text(full,encoding='utf-8')
print(len(full))
