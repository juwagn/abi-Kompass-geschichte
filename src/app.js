/* ===== Abi-Kompass · App ===== */
(function(){
'use strict';
const KEY='abikompass-ge-lk-2027';
const LV=['neu für mich','grob bekannt','kann ich erklären','kann ich beurteilen'];
const INT=[0,1,3,7,14,30];
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const slug=s=>s.toLowerCase().replace(/[„“"()]/g,'').replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');

/* ---------- Speicher ---------- */
function blank(){return {v:1,e:{},k:{},p:null,n:{},done:{},set:{theme:'auto'}};}
let canStore=false;
try{localStorage.setItem('__ak','1');localStorage.removeItem('__ak');canStore=true;}catch(e){canStore=false;}
let S=blank();
if(canStore){try{const r=localStorage.getItem(KEY);if(r){const o=JSON.parse(r);if(o&&o.v===1)S=Object.assign(blank(),o);}}catch(e){}}
function save(){if(!canStore)return;try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){}}

/* ---------- Datum ---------- */
function today(){const d=new Date();d.setHours(0,0,0,0);return d;}
function ymd(d){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}
function pd(s){const a=s.split('-').map(Number);return new Date(a[0],a[1]-1,a[2]);}
function add(d,n){const x=new Date(d);x.setDate(x.getDate()+n);return x;}
function dd(a,b){return Math.round((b-a)/86400000);}
function fmt(d){return String(d.getDate()).padStart(2,'0')+'.'+String(d.getMonth()+1).padStart(2,'0')+'.';}
function monday(d){const x=new Date(d);x.setDate(x.getDate()-((x.getDay()+6)%7));x.setHours(0,0,0,0);return x;}
const EXD=pd(EXAM.date);
function daysLeft(){return Math.max(0,dd(today(),EXD));}

/* ---------- Indizes ---------- */
const KE=[];SP.forEach(sp=>sp.ke.forEach(k=>{k.sp=sp.id;KE.push(k);}));
const SPM={};SP.forEach((s,i)=>{SPM[s.id]=s;s.idx=i;});
const LSM={};LS.forEach(l=>LSM[l.id]=l);
function spStats(sp){const n=sp.ke.length;let sum=0,set=0;const c=[0,0,0,0];sp.ke.forEach(k=>{const v=S.e[k.id];if(v!==undefined){set++;sum+=v;c[v]++;}});return {n,set,p:sum/(3*n),c};}
function ifStats(no){const list=SP.filter(s=>s.if===no);let sum=0,n=0;list.forEach(s=>s.ke.forEach(k=>{n++;sum+=(S.e[k.id]||0);}));return n?sum/(3*n):0;}
function spNo(sp){const l=SP.filter(s=>s.if===sp.if);return [l.indexOf(sp)+1,l.length];}

/* ---------- Karteikarten ---------- */
const CARDS=[];
LEX.forEach(l=>CARDS.push({id:'L-'+slug(l[0]),kind:'Begriff',deck:'begriffe',ifs:[l[2]],front:l[0],back:'<p>'+l[1]+'</p>'+(l[4]?'<p class="small" style="color:var(--gold-ink)">⚠ '+l[4]+'</p>':'')}));
ZL.forEach(z=>CARDS.push({id:'Z-'+z[0],kind:'Datum',deck:'daten',ifs:z[3],front:'Wann? '+z[2],back:'<p style="font-family:var(--f-display);font-weight:800;font-size:34px;color:var(--heading);margin:0">'+z[1]+'</p>'}));
KE.filter(k=>k.k==='UK').forEach(k=>CARDS.push({id:'U-'+k.id,kind:'Urteilsfrage',deck:'urteile',ifs:[SPM[k.sp].if],front:k.q,back:'<p class="small muted">Skizziere zuerst selbst ein Urteil. Mögliche Argumente:</p><p><b style="color:var(--lv3)">Dafür:</b> '+k.pro.join(' · ')+'</p><p><b style="color:var(--lv0)">Dagegen / relativierend:</b> '+k.con.join(' · ')+'</p>'}));
const CM={};CARDS.forEach(c=>CM[c.id]=c);
function isDue(c){const s=S.k[c.id];return s?pd(s.d)<=today():false;}
function isNew(c){return !S.k[c.id];}
function cardCounts(){let due=0,nw=0;const box=[0,0,0,0,0,0];CARDS.forEach(c=>{const s=S.k[c.id];if(!s){nw++;box[0]++;}else{box[s.f]++;if(pd(s.d)<=today())due++;}});return {due,nw,box};}

/* ---------- Planer ---------- */
function weekType(mon){
  const sun=add(mon,6);
  if(mon<=EXD&&sun>=EXD)return 'pruefung';
  for(const f of FERIEN){let c=0;for(let i=0;i<5;i++){const d=add(mon,i);if(d>=pd(f.von)&&d<=pd(f.bis))c++;}if(c>=3)return f.t==='Osterferien'?'ostern':'pause:'+f.t;}
  return 'lern';
}
function spread(tasks,weeks){if(!weeks.length)return;const per=Math.ceil(tasks.length/weeks.length);tasks.forEach((t,i)=>weeks[Math.min(weeks.length-1,Math.floor(i/per))].tasks.push(t));}
function genPlan(start,min){
  let mon=monday(pd(start));const weeks=[];
  if(mon>EXD)mon=monday(EXD);
  while(mon<=EXD){weeks.push({mon:ymd(mon),type:weekType(mon),phase:'',tasks:[]});mon=add(mon,7);}
  const L=weeks.filter(w=>w.type==='lern');const O=weeks.filter(w=>w.type==='ostern');
  const n=L.length;let a=Math.max(1,Math.round(n*0.45)),b=Math.max(n>=3?1:0,Math.round(n*0.35));if(a+b>n){a=Math.max(1,n-b);if(a+b>n)b=Math.max(0,n-a);}
  const WA=L.slice(0,a),WB=L.slice(a,a+b),WC=L.slice(a+b).concat(O);
  WA.forEach(w=>w.phase='A');WB.forEach(w=>w.phase='B');WC.forEach(w=>w.phase='C');
  const order=SP.slice().sort((x,y)=>{const d=spStats(x).p-spStats(y).p;if(Math.abs(d)>0.001)return d;const f=(y.fokus.length>0)-(x.fokus.length>0);return f||x.idx-y.idx;});
  const tA=order.map(sp=>({id:'sp-'+sp.id+'-A',typ:'sp',ref:sp.id,label:'Überblick: '+sp.short,min:90}));
  const tB=LS.map(l=>({id:'ls-'+l.id+'-B',typ:'ls',ref:l.id,label:'Längsschnitt: '+l.k,min:60}));
  order.filter(sp=>spStats(sp).p<0.67).forEach(sp=>tB.push({id:'uk-'+sp.id+'-B',typ:'uk',ref:sp.id,label:'Urteilsfragen vertiefen: '+sp.short,min:45}));
  tB.push({id:'kl-A-B',typ:'klausur',ref:'A',label:'Bauplan Aufgabenart A an einer Quelle üben',min:60},{id:'kl-B-B',typ:'klausur',ref:'B',label:'Bauplan Aufgabenart B an einer Darstellung üben',min:60});
  const fk=SP.filter(s=>s.fokus.length),rest=SP.filter(s=>!s.fokus.length);
  const tC=fk.concat(rest).map(sp=>({id:'wdh-'+sp.id+'-C',typ:'wdh',ref:sp.id,label:'Wiederholen: '+sp.short+(sp.fokus.length?' ★':''),min:45}));
  tC.push({id:'op-C',typ:'op',ref:'ops',label:'Operatoren-Trainer: 20 Fragen',min:20},{id:'zl-C',typ:'zl',ref:'zl',label:'Zeitleiste: dreimal „Ordnen“',min:20},{id:'dl-C',typ:'dl',ref:'dl',label:'Checkliste Darstellungsleistung und Zeitplan 300 Min. durchgehen',min:20});
  if(!WA.length&&!WB.length){spread(tA.concat(tB,tC),WC.length?WC:weeks.filter(w=>w.type!=='pruefung'));}
  else{spread(tA,WA);spread(tB,WB.length?WB:WA);spread(tC,WC.length?WC:(WB.length?WB:WA));}
  weeks.forEach(w=>{
    if(w.type==='lern'||w.type==='ostern')w.tasks.unshift({id:'karten-'+w.mon,typ:'karten',ref:'k',label:'Karteikarten: 3 × 15 Minuten',min:45});
    else if(w.type.indexOf('pause')===0){w.phase='F';w.tasks.push({id:'pause-'+w.mon,typ:'pause',ref:'',label:'Pause – Erholung gehört zum Plan. Wer mag: 15 Minuten Karteikarten.',min:15});}
    else if(w.type==='pruefung'){w.phase='C';w.tasks.push({id:'final',typ:'final',ref:'',label:'Letzter Check: Zeitplan und Checkliste lesen, Material packen, früh schlafen. Prüfung am '+EXAM.label+'.',min:30});}
  });
  return {start,min:+min,weeks,created:ymd(today())};
}
if(!S.p){const st=today()<EXD?ymd(today()):ymd(add(EXD,-7));S.p=genPlan(st,180);S.p.example=true;save();}
function curWeekIdx(){const t=today();const w=S.p.weeks;for(let i=0;i<w.length;i++){const m=pd(w[i].mon);if(t>=m&&t<add(m,7))return i;}return t<pd(w[0].mon)?0:w.length-1;}
function taskHref(t){return {sp:'#/sp/'+t.ref,uk:'#/sp/'+t.ref,wdh:'#/sp/'+t.ref,ls:'#/ls/'+t.ref,klausur:'#/klausur',op:'#/klausur',dl:'#/klausur',zl:'#/zeitleiste',karten:'#/karten'}[t.typ]||'';}
const PH={A:['Zyklus 1 · Überblick','ph-A'],B:['Zyklus 2 · Vertiefen','ph-B'],C:['Zyklus 3 · Wiederholen','ph-C'],F:['Ferien','ph-F']};
function taskLi(t){const d=!!S.done[t.id];const h=taskHref(t);return '<li class="task'+(d?' done':'')+'"><input type="checkbox" id="t-'+esc(t.id)+'" data-act="task" data-id="'+esc(t.id)+'"'+(d?' checked':'')+'><div class="lbl"><label for="t-'+esc(t.id)+'" class="sr">erledigt</label>'+(h?'<a href="'+h+'">'+esc(t.label)+'</a>':esc(t.label))+'<div class="meta">ca. '+t.min+' Min.</div></div></li>';}

/* ---------- UI-Zustand ---------- */
let TF='alle',TLF={if:0,ls:''},TLM='liste',ORD=null,LXF={q:'',bel:false,if:0,tab:'begriffe'},OPQ={cur:null,opts:[],ans:null,score:0,total:0},SES=null,DECK={d:'mix',f:0},RESET=false;

/* ---------- Bausteine ---------- */
function ring(p,size){size=size||56;const r=22,c=2*Math.PI*r,o=c*(1-p),pc=Math.round(p*100);return '<svg class="ring" width="'+size+'" height="'+size+'" viewBox="0 0 54 54" role="img" aria-label="'+pc+' Prozent"><circle class="bg" cx="27" cy="27" r="'+r+'" fill="none" stroke-width="6"/><circle class="fg" cx="27" cy="27" r="'+r+'" fill="none" stroke-width="6" stroke-linecap="round" stroke-dasharray="'+c.toFixed(2)+'" stroke-dashoffset="'+o.toFixed(2)+'" transform="rotate(-90 27 27)"/><text x="27" y="31.5" text-anchor="middle">'+pc+'%</text></svg>';}
function phead(eb,title,q,extra){return '<header class="phead"><div class="eyebrow">'+eb+'</div><h1>'+title+'</h1>'+(q?'<p class="leitfrage">'+q+'</p>':'')+'<div class="goldbar"></div>'+(extra||'')+'</header>';}
function foot(){return '<footer class="foot">Grundlagen: Kernlehrplan Geschichte Sek. II NRW (2014, Leistungskurs) · Vorgaben Zentralabitur 2027 Geschichte (MSB NRW) · Operatorenübersicht Geschichte (abitur.nrw). Seitenangaben: „Zeiten und Menschen“, Qualifikationsphase (ISBN 978-3-14-024990-4). Alle Schwerpunkte des Kernlehrplans sind prüfungsrelevant; ★ markiert die Fokussierungen 2027.</footer>';}

/* ---------- Views ---------- */
function vStart(){
  const dl=daysLeft(),cc=cardCounts(),wi=curWeekIdx(),w=S.p.weeks[wi];
  const weak=SP.slice().sort((a,b)=>{const d=spStats(a).p-spStats(b).p;if(Math.abs(d)>0.001)return d;return (b.fokus.length>0)-(a.fokus.length>0)||a.idx-b.idx;})[0];
  const uk=weak.ke.find(k=>k.k==='UK');
  const ph=PH[w.phase]||['',''];
  let h=phead('Geschichte · Leistungskurs · Abitur 2027','Dein Abi-Kompass','','<p class="lead">Alle 14 Schwerpunkte der Abiturvorgaben 2027 mit Stichworten, Urteilsfragen und Hilfen – dazu dein Lernplan, Karteikarten und der Klausur-Werkzeugkasten.</p>');
  h+='<div class="dash-top"><section class="countdown" aria-label="Countdown"><svg class="needle" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="46" fill="none" stroke="#fff" stroke-width="3"/><path d="M50 8 L58 50 L50 92 L42 50 Z" fill="#f5c518"/><circle cx="50" cy="50" r="6" fill="#fff"/></svg><div class="eb">Schriftliche Prüfung</div><div class="big">'+dl+'<small>Tage</small></div><div class="sub">bis '+EXAM.label+'</div><div class="facts"><span>'+EXAM.dauer+'</span><span>3 Aufgaben zur Wahl</span><span>Nachschreibtermin '+EXAM.nach+'</span></div></section>';
  h+='<section class="card"><div class="row"><h3 style="margin:0">Diese Woche</h3>'+(ph[0]?'<span class="tagph '+ph[1]+'">'+ph[0]+'</span>':'')+'<span class="spacer"></span><a class="btn sm ghost" href="#/planer">Planer</a></div><p class="small muted" style="margin:4px 0 10px">Woche ab '+fmt(pd(w.mon))+(S.p.example?' · Vorschlag – im Planer an deine Lernzeit anpassen':'')+'</p><ul class="week-list">'+w.tasks.map(taskLi).join('')+'</ul></section></div>';
  h+='<h2>Dein Stand je Inhaltsfeld</h2><div class="rings" style="grid-template-columns:repeat(auto-fit,minmax(230px,1fr))">'+[4,5,6,7].map(no=>'<a class="ringcard" href="#/themen">'+ring(ifStats(no))+'<div><div class="t">Inhaltsfeld '+no+'</div><div class="d">'+IFS[no].k+'</div></div></a>').join('')+'</div><p class="small muted" style="margin-top:8px">Der Stand ergibt sich aus deiner Selbsteinschätzung zu jeder Kompetenzerwartung: 100 % heißt „kann ich beurteilen“ überall.</p>';
  h+='<div class="grid g2" style="margin-top:22px"><section class="card"><h3>Karteikarten</h3><p><b style="font-family:var(--f-display);font-size:28px;color:var(--heading)">'+cc.due+'</b> fällig · '+cc.nw+' noch neu</p><a class="btn primary" href="#/karten">Karten lernen</a></section>';
  h+='<section class="card"><h3>Heute 30 Minuten?</h3><ul class="tight"><li>15 Min. Schwerpunkt: <a href="#/sp/'+weak.id+'">'+weak.short+'</a></li><li>10 Min. Karteikarten (gemischter Stapel)</li><li>5 Min. Urteilsfrage: <i>'+(uk?esc(uk.q):'')+'</i></li></ul><p class="small muted" style="margin-top:8px">Vorschlag nach deiner schwächsten Einschätzung.</p></section></div>';
  h+='<h2>So arbeitest du mit dem Abi-Kompass</h2><div class="steps"><div class="card"><h3>Einschätzen</h3><p class="small">Öffne jeden Schwerpunkt und schätze dich zu jeder Kompetenzerwartung ein – ehrlich, das steuert deinen Plan.</p><a href="#/themen">Zur Themenkarte</a></div><div class="card"><h3>Planen</h3><p class="small">Der Planer verteilt alle Schwerpunkte in drei Zyklen bis zum 13. April – Schwächen zuerst.</p><a href="#/planer">Zum Planer</a></div><div class="card"><h3>Üben</h3><p class="small">Kurz und oft: Karteikarten, Urteilsfragen, Baupläne für die Klausur. Lieber täglich 30 Minuten als einmal drei Stunden.</p><a href="#/lernen">Lernstrategien</a></div></div>';
  h+='<div class="note" style="margin-top:22px"><b>Deine Daten bleiben bei dir.</b> Einschätzungen, Plan und Karten werden nur in diesem Browser gespeichert'+(canStore?'':' – hier ist der Speicher allerdings gesperrt, dein Fortschritt geht beim Schließen verloren')+'. Unter <a href="#/sichern">Sichern &amp; Drucken</a> kannst du deinen Stand auf ein anderes Gerät übertragen.</div>';
  return h+foot();
}

function vThemen(){
  let h=phead('Themenkarte','14 Schwerpunkte, 4 Inhaltsfelder','Alle Schwerpunkte sind Pflicht. Die Fokussierungen 2027 (★) zeigen, worauf die Aufgaben besonders zugreifen können.');
  h+='<div class="filters noprint" role="group" aria-label="Filter"><button class="chip" data-act="tf" data-v="alle" aria-pressed="'+(TF==='alle')+'">Alle</button><button class="chip" data-act="tf" data-v="fokus" aria-pressed="'+(TF==='fokus')+'">★ Fokus 2027</button><button class="chip" data-act="tf" data-v="luecken" aria-pressed="'+(TF==='luecken')+'">Meine Lücken</button></div>';
  [4,5,6,7].forEach(no=>{
    let list=SP.filter(s=>s.if===no);
    if(TF==='fokus')list=list.filter(s=>s.fokus.length);
    if(TF==='luecken')list=list.filter(s=>s.ke.some(k=>(S.e[k.id]===undefined||S.e[k.id]<2)));
    if(!list.length)return;
    h+='<section class="ifsec"><div class="ifhead"><span class="no">IF '+no+'</span><h2>'+IFS[no].t+'</h2></div>';
    if(IFS[no].dossier){
      const idos=IFS[no].dossier;
      h+='<details class="if-dossier-card"><summary class="if-dossier-sum"><div class="sum-left"><span class="chip sk">📖 Epochen-Überblick &amp; Leitfaden IF '+no+'</span></div><div class="sum-toggle noprint"><span class="sum-label-closed">Aufklappen</span><span class="sum-label-open">Zuklappen</span><svg class="sum-chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></div></summary><div class="if-dossier-content"><p class="leitfrage" style="margin:0 0 10px;font-size:16px"><b>Leitfrage:</b> '+esc(idos.leitfrage)+'</p><div class="dossier-text small" style="line-height:1.68;color:var(--ink)">'+esc(idos.epochenueberblick)+'</div><div class="note small" style="margin-top:12px"><b>🎯 Abiturleitfaden 2027 LK:</b> '+esc(idos.abiturleitfaden)+'</div></div></details>';
    }
    h+='<div class="tiles">';
    list.forEach(sp=>{
      const st=spStats(sp);
      const no=spNo(sp);
      h+='<a class="tile" href="#/sp/'+sp.id+'">'
        +'<div class="tile-head"><span class="tile-num">Schwerpunkt '+no[0]+'</span>'+ring(st.p,40)+'</div>'
        +'<div class="tt">'+sp.t+'</div>'
        +'<div class="q">'+sp.q+'</div>'
        +'<div class="ft">'
        +(sp.fokus.length?'<span class="chip fokus">★ Fokus 2027</span>':'')
        +'<span class="chip">'+sp.ke.length+' Erwartungen</span>'
        +(st.set<st.n?'<span class="chip zum">'+(st.n-st.set)+' offen</span>':'')
        +'</div></a>';
    });
    h+='</div></section>';
  });
  return h+foot();
}

function dossierHtml(sp){
  const d=sp.dossier;
  if(!d)return '';
  const paras=d.ueberblick.split('\n\n').map(p=>'<p>'+esc(p)+'</p>').join('');
  let h='<details class="dossier-card" open><summary class="dossier-summary"><div class="row" style="cursor:pointer;gap:8px"><span class="chip sk">📖 Fachwissenschaftliches Dossier</span><span class="chip fokus">Abitur 2027 LK</span>'+(sp.lk?'<span class="chip" style="background:#5e17eb;color:#fff">Nur Leistungskurs</span>':'')+'<span class="spacer"></span><div class="sum-toggle noprint"><span class="sum-label-closed">Dossier öffnen</span><span class="sum-label-open">Dossier schließen</span><svg class="sum-chevron" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></div></div></summary><div class="dossier-content" style="margin-top:14px">';
  if(d.hook){
    h+='<blockquote class="dossier-hook"><p class="dossier-quote">„'+esc(d.hook.zitat)+'“</p><cite class="dossier-cite">— '+esc(d.hook.quelle)+'</cite></blockquote>';
    h+='<p class="dossier-q"><b>Orientierungsfrage:</b> '+esc(d.hook.frage)+'</p>';
  }
  h+='<div class="dossier-text">'+paras+'</div>';
  if(d.abiSpotlight){
    h+='<div class="dossier-spotlight"><div class="eb">🎯 Abitur-Spotlight 2027 (Leistungskurs)</div>';
    h+='<div class="spotlight-item"><b style="color:var(--gold-ink)">Fokus-Tipp:</b> '+esc(d.abiSpotlight.fokusTipp)+'</div>';
    h+='<div class="spotlight-item"><b style="color:var(--heading)">Operatoren-Hinweis:</b> '+esc(d.abiSpotlight.operatorenHinweis)+'</div>';
    h+='<div class="spotlight-item"><b style="color:var(--lv3)">Urteilsbildung (AFB III):</b> '+esc(d.abiSpotlight.urteilHinweis)+'</div>';
    h+='</div>';
  }
  if(d.kontroverse){
    h+='<div class="dossier-kontroverse"><div class="eb">⚖ Wissenschaftliche Kontroverse</div>';
    h+='<h4 style="margin:4px 0 8px;color:var(--heading)">'+esc(d.kontroverse.name)+'</h4>';
    h+='<div class="grid g2" style="gap:12px;margin-top:6px"><div class="col" style="background:var(--surface-2);padding:10px;border-radius:8px;border-left:3px solid var(--gold)"><b class="small" style="color:var(--gold-ink)">These:</b><p class="small" style="margin:4px 0 0">'+esc(d.kontroverse.these)+'</p></div><div class="col" style="background:var(--surface-2);padding:10px;border-radius:8px;border-left:3px solid var(--lv3)"><b class="small" style="color:var(--lv3)">Gegenposition:</b><p class="small" style="margin:4px 0 0">'+esc(d.kontroverse.gegenposition)+'</p></div></div></div>';
  }
  if(d.quellen&&d.quellen.length){
    h+='<div class="dossier-sources"><div class="eb">🔍 Wissenschaftlich fundierte Quellen &amp; Vertiefungsportale</div>';
    h+='<div class="source-tags">'+d.quellen.map(q=>'<a class="source-tag" href="'+esc(q.url)+'" target="_blank" rel="noopener"><span class="name">'+esc(q.name)+'</span><span class="inst">'+esc(q.institution)+' ↗</span></a>').join('')+'</div></div>';
  }
  h+='</div></details>';
  return h;
}

function keHtml(k){
  const v=S.e[k.id];
  let h='<article class="ke'+(k.fk?' fk':'')+'"><div class="ke-head"><span class="chip '+(k.k==='SK'?'sk':'uk')+'">'+(k.k==='SK'?'Sachkompetenz':'Urteilskompetenz')+'</span>'+(k.fk?'<span class="chip fokus">★ Fokus 2027</span>':'')+'</div><p class="ke-text" style="margin:8px 0 0"><span class="pre">'+(k.pre?k.pre+' ':'')+'Die Schülerinnen und Schüler …</span> '+k.t+'</p>';
  h+='<fieldset class="lvl"><legend>Mein Stand</legend>'+LV.map((l,i)=>'<label><input type="radio" name="lv-'+k.id+'" value="'+i+'" data-act="lvl" data-ke="'+k.id+'"'+(v===i?' checked':'')+'><span>'+l+'</span></label>').join('')+'</fieldset>';
  if(k.k==='SK')h+='<ul class="stich">'+k.st.map(s=>'<li>'+s+'</li>').join('')+'</ul>';
  else h+='<p class="ufrage">'+k.q+'</p><div class="urteil"><div class="col pro"><h4>Das spricht dafür</h4><ul>'+k.pro.map(s=>'<li>'+s+'</li>').join('')+'</ul></div><div class="col con"><h4>Das spricht dagegen / relativiert</h4><ul>'+k.con.map(s=>'<li>'+s+'</li>').join('')+'</ul></div></div><p class="small muted" style="margin-top:8px">Erst das Sachurteil (Maßstäbe der Zeit), dann – falls der Operator es verlangt – das Werturteil mit offengelegtem Maßstab.</p>';
  return h+'</article>';
}
function vSP(id){
  const sp=SPM[id];if(!sp)return vThemen();
  const st=spStats(sp),no=spNo(sp);
  let chips='<div class="chips">'+sp.fokus.map(f=>'<span class="chip fokus" title="Fokussierung 2027">★ '+f+'</span>').join('')+'</div>';
  let h=phead('Inhaltsfeld '+sp.if+' · Schwerpunkt '+no[0]+' von '+no[1]+(sp.lk?' · nur Leistungskurs':''),sp.t,sp.q,chips);
  h+='<div class="sp-layout"><div>';
  h+=dossierHtml(sp);
  h+='<h2 style="margin-top:18px">Kompetenzerwartungen</h2><p class="muted small">Wortlaut des Kernlehrplans (LK). Darunter die Stichworte, die du erklären können solltest – bzw. die Urteilsfrage mit Argumenten. Schätze dich bei jeder Erwartung ein.</p>';
  h+=sp.ke.map(keHtml).join('');
  h+='<h2>Hilfen – nimm nur, was du brauchst</h2>';
  h+='<details class="help"><summary>Begriffe klären <span class="lvlbadge">Stufe 1</span></summary><div><ul class="tight">'+sp.hilfe.b.map(b=>'<li><b>'+b[0]+'</b> – '+b[1]+'</li>').join('')+'</ul><p class="small" style="margin-top:8px"><a href="#/lexikon">Alle Begriffe im Lexikon</a></p></div></details>';
  h+='<details class="help"><summary>Struktur finden <span class="lvlbadge">Stufe 2</span></summary><div><p>'+sp.hilfe.s+'</p></div></details>';
  h+='<details class="help"><summary>Formulieren <span class="lvlbadge">Stufe 3</span></summary><div><ul class="tight">'+sp.hilfe.f.map(f=>'<li>„'+f+'“</li>').join('')+'</ul></div></details>';
  h+='<div class="bridge" style="margin-top:16px"><div class="eb">Für Profis · '+sp.profi.t+'</div><span>'+sp.profi.x+'</span></div>';
  h+='</div><aside class="sp-aside"><section class="card"><h3>Dein Stand</h3><div class="row" style="gap:14px">'+ring(st.p,64)+'<div class="small">'+st.set+' von '+st.n+' eingeschätzt</div></div><div style="margin-top:8px">'+LV.map((l,i)=>'<div class="stat"><span>'+l+'</span><b>'+st.c[i]+'</b></div>').join('')+'</div></section>';
  h+='<section class="card"><h3>In „Zeiten und Menschen“</h3><ul class="tight small">'+sp.zum.map(z=>'<li><b>S. '+z[0]+'</b> · '+z[1]+'</li>').join('')+'</ul></section>';
  h+='<section class="card"><h3>Verknüpft in Längsschnitten</h3><div class="chips" style="margin-top:0">'+sp.ls.map(l=>'<a class="chip" href="#/ls/'+l+'">'+LSM[l].k+'</a>').join('')+'</div></section>';
  h+='<section class="card noprint"><h3><label for="note-'+sp.id+'">Meine Notizen</label></h3><textarea class="notes" id="note-'+sp.id+'" data-act="note" data-sp="'+sp.id+'" placeholder="Offene Fragen, Merksätze, Seitenzahlen …">'+esc(S.n[sp.id]||'')+'</textarea></section></aside></div>';
  const prev=SP[sp.idx-1],next=SP[sp.idx+1];
  h+='<nav class="pager" aria-label="Schwerpunkte blättern">'+(prev?'<a class="btn" href="#/sp/'+prev.id+'">← '+prev.short+'</a>':'<span></span>')+(next?'<a class="btn" href="#/sp/'+next.id+'">'+next.short+' →</a>':'<a class="btn" href="#/laengsschnitte">Zu den Längsschnitten →</a>')+'</nav>';
  return h+foot();
}

function vLSall(){
  let h=phead('Längsschnitte','Vier Linien durch alle Inhaltsfelder','Längsschnitte verbinden Themen aus Q1 und Q2. Genau diese Vernetzung macht in Teilaufgabe 2 und 3 den Unterschied.');
  h+='<div class="grid g2">'+LS.map(l=>'<a class="tile" href="#/ls/'+l.id+'"><div class="tt">'+l.t+'</div><div class="q">'+l.q+'</div><div class="ft">'+l.sp.map(s=>'<span class="chip">IF '+SPM[s].if+'</span>').filter((v,i,a)=>a.indexOf(v)===i).join('')+'<span class="chip zum">'+l.rows.length+' Stationen</span></div></a>').join('')+'</div>';
  return h+foot();
}
function vLS(id){
  const l=LSM[id];if(!l)return vLSall();
  let h=phead('Längsschnitt',l.t,l.q,'<p class="lead">'+l.intro+'</p>');
  h+='<div class="tbl-wrap"><table class="tbl-min"><thead><tr><th>Station</th>'+l.cols.map(c=>'<th>'+c+'</th>').join('')+'</tr></thead><tbody>'+l.rows.map(r=>'<tr><td class="st">'+r[0]+'</td>'+r.slice(1).map(c=>'<td>'+c+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>';
  h+='<p class="small muted" style="margin-top:8px">Tipp: Decke eine Spalte ab und rekonstruiere sie aus dem Gedächtnis – das ist Abrufüben und Interleaving zugleich.</p>';
  h+='<div class="bridge" style="margin-top:18px"><div class="eb">Urteilsauftrag</div><b>'+l.task+'</b><p class="small" style="margin:8px 0 0;color:#cfe0fb">'+l.taskSrc+' · Arbeite mit den Bauplänen im <a href="#/klausur">Klausur-Werkzeugkasten</a>: Kriterien festlegen, Stationen vergleichen, abwägen, Fazit.</p></div>';
  h+='<h2>Beteiligte Schwerpunkte</h2><div class="chips">'+l.sp.map(s=>'<a class="chip" href="#/sp/'+s+'">IF '+SPM[s].if+' · '+SPM[s].short+'</a>').join('')+'</div>';
  return h+foot();
}

function tlFiltered(){return ZL.filter(z=>(!TLF.if||z[3].indexOf(TLF.if)>-1)&&(!TLF.ls||z[4].indexOf(TLF.ls)>-1));}
function newOrder(){const pool=tlFiltered();const years={};const cand=pool.slice().sort(()=>Math.random()-0.5).filter(z=>{const y=Math.floor(z[0]);if(years[y])return false;years[y]=1;return true;}).slice(0,5);ORD={items:cand.slice().sort(()=>Math.random()-0.5),checked:false};}
function vZL(){
  let h=phead('Zeitleiste','Von 1618 bis 1990','Chronologie ist das Gerüst jeder Einordnung. Filtere nach Inhaltsfeld oder Längsschnitt – oder trainiere im Modus „Ordnen“.');
  h+='<div class="row noprint" style="margin-bottom:12px"><button class="btn sm'+(TLM==='liste'?' primary':'')+'" data-act="tlm" data-v="liste">Liste</button><button class="btn sm'+(TLM==='ordnen'?' primary':'')+'" data-act="tlm" data-v="ordnen">Ordnen-Training</button></div>';
  h+='<div class="filters noprint" style="margin-bottom:16px"><button class="chip" data-act="tlif" data-v="0" aria-pressed="'+(!TLF.if)+'">Alle IF</button>'+[4,5,6,7].map(n=>'<button class="chip" data-act="tlif" data-v="'+n+'" aria-pressed="'+(TLF.if===n)+'">IF '+n+'</button>').join('')+'<span style="width:10px"></span><button class="chip" data-act="tlls" data-v="" aria-pressed="'+(!TLF.ls)+'">Alle Längsschnitte</button>'+LS.map(l=>'<button class="chip" data-act="tlls" data-v="'+l.id+'" aria-pressed="'+(TLF.ls===l.id)+'">'+l.k+'</button>').join('')+'</div>';
  if(TLM==='liste'){const list=tlFiltered();h+='<p class="small muted">'+list.length+' Ereignisse</p><ol class="tl">'+list.map(z=>'<li><span class="yr">'+Math.floor(z[0])+'</span><div class="tx"><span class="d">'+z[1]+'</span>'+z[2]+'<span class="ifs">'+z[3].map(n=>'<span>IF '+n+'</span>').join('')+'</span></div></li>').join('')+'</ol>';}
  else{
    if(!ORD||ORD.items.length<2)newOrder();
    const sorted=ORD.items.slice().sort((a,b)=>a[0]-b[0]);
    h+='<section class="card"><h3>Bringe die Ereignisse in die richtige Reihenfolge</h3><p class="small muted">Verschiebe mit den Pfeilen, dann prüfen. Das früheste Ereignis steht oben.</p><ol class="order-list">'+ORD.items.map((z,i)=>{let cls='';if(ORD.checked)cls=sorted[i]===z?'good':'wrong';return '<li class="'+cls+'"><span class="pos">'+(i+1)+'</span><span class="tx">'+z[2]+'</span>'+(ORD.checked?'<span class="sol">'+z[1]+'</span>':'<button class="btn sm ghost" data-act="up" data-i="'+i+'" aria-label="nach oben"'+(i===0?' disabled':'')+'>↑</button><button class="btn sm ghost" data-act="down" data-i="'+i+'" aria-label="nach unten"'+(i===ORD.items.length-1?' disabled':'')+'>↓</button>')+'</li>';}).join('')+'</ol><div class="row" style="margin-top:12px">'+(ORD.checked?'<b>'+ORD.items.filter((z,i)=>sorted[i]===z).length+' von '+ORD.items.length+' richtig</b><span class="spacer"></span>':'<button class="btn primary" data-act="ordcheck">Prüfen</button>')+'<button class="btn" data-act="ordnew">Neue Runde</button></div></section>';
  }
  return h+foot();
}

function lexList(){const q=LXF.q.trim().toLowerCase();const list=LEX.filter(l=>(!LXF.bel||l[3])&&(!LXF.if||l[2]===LXF.if)&&(!q||(l[0]+' '+l[1]).toLowerCase().indexOf(q)>-1)).sort((a,b)=>a[0].replace(/[„“]/g,'').localeCompare(b[0].replace(/[„“]/g,''),'de'));
  if(!list.length)return '<p class="muted">Kein Begriff gefunden. Tipp: Suche nach einem Wortteil, z. B. „frieden“.</p>';
  return '<p class="small muted">'+list.length+' Begriffe</p><div class="lex">'+list.map(l=>'<div class="lexitem'+(l[3]?' bel':'')+'"><span class="w">'+l[0]+'</span>'+(l[3]?'<span class="bm">belastet</span>':'')+'<span class="chip" style="margin-left:6px;padding:0 7px">IF '+l[2]+'</span><div class="df">'+l[1]+'</div>'+(l[4]?'<div class="hn">'+l[4]+'</div>':'')+'</div>').join('')+'</div>';}

function dossierLexList(){
  const q=LXF.q.trim().toLowerCase();
  let list=SP.filter(s=>s.dossier&&(!LXF.if||s.if===LXF.if));
  if(q){
    list=list.filter(s=>{
      const d=s.dossier;
      const hay=(s.t+' '+s.short+' '+d.ueberblick+' '+(d.hook?d.hook.zitat:'')+' '+(d.kontroverse?d.kontroverse.name:'')+' '+(d.abiSpotlight?d.abiSpotlight.fokusTipp:'')).toLowerCase();
      return hay.indexOf(q)>-1;
    });
  }
  if(!list.length)return '<p class="muted">Kein Schwerpunkt-Dossier zu diesem Suchbegriff gefunden.</p>';
  return '<p class="small muted">'+list.length+' Dossiers gefunden</p><div class="dossier-lex-list">'+list.map(sp=>{
    const d=sp.dossier;
    return '<article class="card dossier-lex-card" style="margin-bottom:16px"><div class="row" style="margin-bottom:8px;gap:8px"><span class="chip sk">IF '+sp.if+'</span><b style="font-size:16px;color:var(--heading)">'+esc(sp.t)+'</b>'+(sp.lk?'<span class="chip" style="background:#5e17eb;color:#fff">Nur LK</span>':'')+(sp.fokus.length?'<span class="chip fokus">★ Fokus</span>':'')+'<span class="spacer"></span><a class="btn sm primary" href="#/sp/'+sp.id+'">Zum Schwerpunkt →</a></div>'+(d.hook?'<blockquote class="dossier-hook" style="margin:8px 0"><p class="dossier-quote small">„'+esc(d.hook.zitat)+'“</p><cite class="dossier-cite small">— '+esc(d.hook.quelle)+'</cite></blockquote>':'')+'<details><summary class="small muted" style="cursor:pointer;margin:6px 0">Überblick, Kontroverse &amp; Quellen lesen</summary><div style="margin-top:10px"><div class="dossier-text small">'+d.ueberblick.split('\n\n').map(p=>'<p>'+esc(p)+'</p>').join('')+'</div>'+(d.abiSpotlight?'<div class="note small" style="margin:8px 0"><b>Abitur-Spotlight:</b> '+esc(d.abiSpotlight.fokusTipp)+'</div>':'')+(d.kontroverse?'<div class="dossier-kontroverse small" style="margin:8px 0;background:var(--surface-2);padding:10px;border-radius:8px"><b>Wissenschaftliche Kontroverse: '+esc(d.kontroverse.name)+'</b><p style="margin:4px 0"><b>These:</b> '+esc(d.kontroverse.these)+'</p><p style="margin:4px 0"><b>Gegenposition:</b> '+esc(d.kontroverse.gegenposition)+'</p></div>':'')+(d.quellen&&d.quellen.length?'<div class="source-tags" style="margin-top:8px">'+d.quellen.map(q=>'<a class="source-tag" href="'+esc(q.url)+'" target="_blank" rel="noopener"><span class="name">'+esc(q.name)+'</span><span class="inst">'+esc(q.institution)+' ↗</span></a>').join('')+'</div>':'')+'</div></details></article>';
  }).join('')+'</div>';
}

function vLex(){
  let h=phead('Begriffslexikon & Fachdossiers','Fachbegriffe & historische Schwerpunkte fundiert erschließen','Fachsprache zählt in der Darstellungsleistung. Die Fachdossiers bieten dir vertiefte historische Überblicke, Kontroversen und verifizierte Fachquellen für das Zentralabitur 2027.');
  h+='<div class="row noprint" style="margin-bottom:12px;gap:8px"><button class="btn sm'+(LXF.tab==='begriffe'?' primary':'')+'" data-act="lextab" data-v="begriffe">Fachbegriffe ('+LEX.length+')</button><button class="btn sm'+(LXF.tab==='dossiers'?' primary':'')+'" data-act="lextab" data-v="dossiers">Schwerpunkt-Dossiers (14)</button></div>';
  h+='<div class="row noprint" style="margin-bottom:14px"><label for="lexq" class="sr">Suchen</label><input id="lexq" class="search" type="search" placeholder="'+(LXF.tab==='begriffe'?'Begriff suchen …':'Dossier durchsuchen (z.B. Bismarck, Stalinnote, Keynes, 1848) …')+'" value="'+esc(LXF.q)+'" data-act="lexq">'+(LXF.tab==='begriffe'?'<button class="chip" data-act="lexbel" aria-pressed="'+LXF.bel+'">nur belastete Begriffe</button>':'')+''+[0,4,5,6,7].map(n=>'<button class="chip" data-act="lexif" data-v="'+n+'" aria-pressed="'+(LXF.if===n)+'">'+(n?'IF '+n:'Alle IF')+'</button>').join('')+'</div><div id="lexlist">'+(LXF.tab==='begriffe'?lexList():dossierLexList())+'</div>';
  return h+foot();
}

function deckCards(){return CARDS.filter(c=>(DECK.d==='mix'||c.deck===DECK.d)&&(!DECK.f||c.ifs.indexOf(DECK.f)>-1));}
function startSession(){const pool=deckCards();const due=pool.filter(isDue).sort(()=>Math.random()-0.5);const nw=pool.filter(isNew).sort(()=>Math.random()-0.5).slice(0,Math.max(0,Math.min(10,20-due.length)));const q=due.slice(0,20).concat(nw).map(c=>c.id).sort(()=>Math.random()-0.5);SES={q,i:0,flip:false,ok:0,no:0,again:{}};}
function vKarten(){
  const cc=cardCounts();
  let h=phead('Karteikarten','Abrufen statt wiederlesen','Leitner-System mit fünf Fächern: Gewusste Karten wandern ein Fach weiter und kommen seltener, vergessene starten wieder in Fach 1.');
  h+='<div class="boxes" aria-label="Verteilung auf die Fächer"><div><b>'+cc.box[0]+'</b><span>neu</span></div>'+[1,2,3,4,5].map(i=>'<div><b>'+cc.box[i]+'</b><span>Fach '+i+'</span></div>').join('')+'</div>';
  if(!SES||SES.i>=SES.q.length){
    if(SES&&SES.q.length){h+='<section class="card" style="margin-top:16px;text-align:center"><h3>Runde geschafft</h3><p>'+SES.ok+' gewusst · '+SES.no+' noch nicht. Die nicht gewussten Karten kommen morgen wieder.</p></section>';}
    h+='<section class="card" style="margin-top:16px"><h3>Neuen Stapel starten</h3><div class="row" style="align-items:flex-end"><div class="field"><label for="deckd">Kartentyp</label><select id="deckd" data-act="deckd"><option value="mix"'+(DECK.d==='mix'?' selected':'')+'>Gemischt (empfohlen)</option><option value="begriffe"'+(DECK.d==='begriffe'?' selected':'')+'>Begriffe</option><option value="daten"'+(DECK.d==='daten'?' selected':'')+'>Daten</option><option value="urteile"'+(DECK.d==='urteile'?' selected':'')+'>Urteilsfragen</option></select></div><div class="field"><label for="deckf">Inhaltsfeld</label><select id="deckf" data-act="deckf">'+[0,4,5,6,7].map(n=>'<option value="'+n+'"'+(DECK.f===n?' selected':'')+'>'+(n?'IF '+n:'alle')+'</option>').join('')+'</select></div><button class="btn primary" data-act="sesstart">Stapel starten</button></div><p class="small muted" style="margin-top:10px">Ein Stapel enthält bis zu 20 Karten: zuerst fällige, dann bis zu 10 neue. Insgesamt '+CARDS.length+' Karten: Begriffe, Daten und alle Urteilsfragen.</p></section>';
    return h+foot();
  }
  const c=CM[SES.q[SES.i]];
  h+='<div style="margin:18px auto 10px;max-width:640px"><div class="row small muted"><span>Karte '+(SES.i+1)+' von '+SES.q.length+'</span><span class="spacer"></span><span>'+SES.ok+' ✓ · '+SES.no+' ✗</span></div><div class="progressbar" style="margin-top:6px"><i style="width:'+(100*SES.i/SES.q.length)+'%"></i></div></div>';
  h+='<div class="flash'+(SES.flip?' flipped':'')+'"><div class="flash-inner"><div class="face front" aria-hidden="'+SES.flip+'"><div class="kind">'+c.kind+' · IF '+c.ifs.join('/')+'</div><div class="q">'+c.front+'</div><div class="hint">Erst selbst antworten – laut oder schriftlich. Dann umdrehen (Leertaste).</div></div><div class="face back" aria-hidden="'+(!SES.flip)+'"><div class="kind">Rückseite</div><div class="a">'+c.back+'</div></div></div></div>';
  h+='<div class="row" style="justify-content:center;margin-top:16px">'+(SES.flip?'<button class="btn bad" data-act="cno">Noch nicht</button><button class="btn ok" data-act="cok">Gewusst</button>':'<button class="btn primary" data-act="cflip">Umdrehen</button>')+'<button class="btn ghost" data-act="cend">Stapel beenden</button></div>';
  return h+foot();
}

function newOp(){const cur=OPS[Math.floor(Math.random()*OPS.length)];const others=OPS.filter(o=>o!==cur).sort(()=>Math.random()-0.5).slice(0,2);OPQ.cur=cur;OPQ.opts=[cur].concat(others).sort(()=>Math.random()-0.5);OPQ.ans=null;}
function vKlausur(){
  if(!OPQ.cur)newOp();
  let h=phead('Klausur-Werkzeugkasten','Fit für 300 Minuten','Operatoren, Baupläne, Darstellungsleistung, Zeitplan, Formulierungen und Methoden – alles, was du für die schriftliche Prüfung brauchst.');
  h+='<div class="filters noprint" style="margin-bottom:10px">'+[['ops','Operatoren'],['bau','Baupläne A/B'],['dl','Darstellungsleistung'],['zeit','Zeitplan'],['form','Formulierungen'],['meth','Methoden'],['bsp','Beispielaufgaben']].map(x=>'<button class="chip" data-act="scroll" data-t="'+x[0]+'">'+x[1]+'</button>').join('')+'</div>';
  h+='<h2 id="k-ops">Operatoren</h2><section class="card lift noprint"><div class="row"><h3 style="margin:0">Operatoren-Trainer</h3><span class="spacer"></span><span class="small muted">'+OPQ.score+' / '+OPQ.total+' richtig</span></div><p style="margin-top:8px">Welche Definition passt zum Operator <b style="font-family:var(--f-display);font-size:19px;color:var(--heading)">„'+OPQ.cur[0]+'“</b>?</p><div style="display:flex;flex-direction:column;gap:8px">'+OPQ.opts.map((o,i)=>{let cls='btn';if(OPQ.ans!==null){if(o===OPQ.cur)cls+=' ok';else if(i===OPQ.ans)cls+=' bad';}return '<button class="'+cls+'" style="justify-content:flex-start;text-align:left;font-weight:400" data-act="opa" data-i="'+i+'"'+(OPQ.ans!==null?' disabled':'')+'>'+o[1]+'</button>';}).join('')+'</div>'+(OPQ.ans!==null?'<p class="small" style="margin-top:10px"><b>Anforderungsbereich:</b> '+OPQ.cur[2]+' · <b>Tipp:</b> '+OPQ.cur[4]+'</p><button class="btn primary" data-act="opn">Nächster Operator</button>':'')+'</section>';
  h+='<div class="tbl-wrap" style="margin-top:12px"><table><thead><tr><th>Operator</th><th>AFB</th><th>Definition (abitur.nrw)</th><th>Worauf es ankommt</th></tr></thead><tbody>'+OPS.map(o=>'<tr><td class="st">'+o[0]+(o[3]?'<br><span class="small muted" style="font-family:var(--f-body);font-weight:400">'+o[3]+'</span>':'')+'</td><td style="white-space:nowrap">'+o[2]+'</td><td>'+o[1]+'</td><td>'+o[4]+'</td></tr>').join('')+'</tbody></table></div>';
  h+='<h2 id="k-bau">Baupläne</h2><div class="grid g2">'+BAUPLAN.map(b=>'<section class="card"><h3>'+b.t+'</h3><p class="leitfrage" style="font-size:15px;margin:6px 0 12px">'+b.muster+'</p>'+b.teile.map(t=>'<div style="border-top:1px solid var(--rule);padding:10px 0"><div class="row"><span class="chip sk">Teilaufgabe '+t[0]+'</span><b>'+t[1]+'</b><span class="spacer"></span><span class="chip">'+t[2]+' Punkte</span></div><p class="small" style="margin:6px 0 0">'+t[3]+'</p></div>').join('')+'<div style="border-top:1px solid var(--rule);padding-top:10px" class="row"><span class="chip uk">Darstellungsleistung</span><span class="spacer"></span><span class="chip">20 Punkte</span></div><p class="small muted" style="margin-top:8px">Summe: 26 + 28 + 26 + 20 = 100 Punkte</p></section>').join('')+'</div>';
  h+='<h2 id="k-dl">Darstellungsleistung · 20 Punkte</h2><div class="tbl-wrap"><table><thead><tr><th>Der Prüfling …</th><th>Punkte</th><th>So sicherst du sie</th></tr></thead><tbody>'+DL.map(d=>'<tr><td>'+d[0]+'</td><td class="st">'+d[1]+'</td><td>'+d[2]+'</td></tr>').join('')+'</tbody></table></div><p class="small muted" style="margin-top:6px">Kriterien und Punktwerte nach dem Bewertungsbogen der Abiturprüfung Geschichte NRW.</p>';
  const tot=ZEITPLAN.reduce((s,z)=>s+(+z[1]),0);
  h+='<h2 id="k-zeit">Zeitplan für 300 Minuten</h2><div style="display:flex;border-radius:10px;overflow:hidden;border:1px solid var(--rule);margin-bottom:10px" aria-hidden="true">'+ZEITPLAN.map((z,i)=>'<div style="flex:'+z[1]+';padding:8px 6px;font-family:var(--f-label);font-size:11.5px;font-weight:600;text-align:center;background:'+['var(--surface-2)','var(--blue-soft)','var(--lv2-bg)','var(--gold-soft)','var(--lv3-bg)','var(--surface-2)','var(--surface)'][i]+';color:var(--heading);border-right:1px solid var(--rule);min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+z[1]+'′</div>').join('')+'</div><div class="tbl-wrap"><table><thead><tr><th>Phase</th><th>Min.</th><th>Was du tust</th></tr></thead><tbody>'+ZEITPLAN.map(z=>'<tr><td class="st">'+z[0]+'</td><td style="font-variant-numeric:tabular-nums">'+z[1]+'</td><td>'+z[2]+'</td></tr>').join('')+'<tr><td class="st">Gesamt</td><td><b>'+tot+'</b></td><td>Empfehlung – die Auswahlzeit ist in den 300 Minuten enthalten. Probiere den Plan in Übungsklausuren aus.</td></tr></tbody></table></div>';
  h+='<h2 id="k-form">Formulierungsbausteine</h2><div class="grid g2">'+BAUSTEINE.map(b=>'<section class="card"><h3>'+b[0]+'</h3><ul class="tight">'+b[1].map(x=>'<li>„'+x+'“</li>').join('')+'</ul></section>').join('')+'</div>';
  h+='<h2 id="k-meth">Methodenschemata</h2><div class="grid g3">'+METHODEN.map(m=>'<section class="method"><div class="eb">⚙ Methode</div><h3>'+m.t+'</h3><ol class="small" style="margin:6px 0 8px;padding-left:1.2em">'+m.steps.map(s=>'<li style="margin:3px 0">'+s+'</li>').join('')+'</ol><div class="small muted">„Zeiten und Menschen“: '+m.zum+'</div></section>').join('')+'</div>';
  h+='<h2 id="k-bsp">Echte Abituraufgaben</h2><div class="note">Das Ministerium veröffentlicht Aufgaben vergangener Jahre mit Erwartungshorizonten. Übe mit ihnen unter Zeitdruck – ideal ab Zyklus 2 deines Plans.<ul class="tight" style="margin-top:8px"><li><a href="https://www.schulministerium.nrw/abituraufgaben-vergangener-jahre-zum-herunterladen" target="_blank" rel="noopener">Abituraufgaben vergangener Jahre (Bildungsportal NRW)</a></li><li><a href="https://www.standardsicherung.schulministerium.nrw.de/zentralabitur-gost/faecher/geschichte" target="_blank" rel="noopener">Zentralabitur Geschichte: Vorgaben, Operatoren, Konstruktionsvorgaben</a></li></ul></div>';
  return h+foot();
}

function vLernen(){
  let h=phead('Lernen lernen','Wie du dir das Wissen wirklich merkst','Fünf Strategien mit starker Evidenz – und wie der Abi-Kompass sie für dich umsetzt.');
  h+='<div class="grid g2">'+STRATEGIEN.map(s=>'<section class="card"><h3>'+s.t+'</h3><p class="small">'+s.w+'</p><p class="small" style="font-family:var(--f-serif);font-style:italic">Beispiel: '+s.bsp+'</p><div class="chips" style="margin-top:6px"><a class="chip" href="'+s.tool[0]+'">'+s.tool[1]+'</a><a class="chip" href="'+s.tool2[0]+'">'+s.tool2[1]+'</a></div></section>').join('')+'</div>';
  h+='<div class="note" style="margin-top:14px"><b>Was wenig bringt:</b> Markieren und bloßes Wiederlesen fühlen sich produktiv an, bleiben aber kaum hängen. Eine große Übersichtsstudie (Dunlosky u. a., 2013) bewertet Selbsttests und verteiltes Lernen als besonders wirksam – Markieren und Wiederlesen als wenig wirksam.</div>';
  h+='<h2>KI beim Lernen – reflektiert nutzen</h2><div class="grid g3"><section class="card"><h3>Chancen</h3><ul class="tight small">'+KI.chancen.map(x=>'<li>'+x+'</li>').join('')+'</ul></section><section class="card"><h3>Grenzen</h3><ul class="tight small">'+KI.grenzen.map(x=>'<li>'+x+'</li>').join('')+'</ul></section><section class="card"><h3>Deine Regeln</h3><ol class="small" style="margin:6px 0 0;padding-left:1.2em">'+KI.regeln.map(x=>'<li style="margin:3px 0">'+x+'</li>').join('')+'</ol></section></div>';
  h+='<h3 style="margin-top:18px">Prompt-Vorlagen zum Kopieren</h3><div class="grid g2">'+KI.prompts.map((p,i)=>'<section class="card"><div class="row"><b>'+p[0]+'</b><span class="spacer"></span><button class="btn sm noprint" data-act="copyp" data-i="'+i+'">Kopieren</button></div><p class="small" style="font-family:ui-monospace,SFMono-Regular,Consolas,monospace;background:var(--surface-3);border:1px solid var(--rule);border-radius:8px;padding:10px;margin-top:8px">'+esc(p[1])+'</p></section>').join('')+'</div><p class="small muted">Ersetze die eckigen Klammern durch dein Thema. Prüfe jede Antwort mit dem Buch oder dem Abi-Kompass.</p>';
  h+='<h2>Lern-Tandem</h2><p class="lead" style="margin-top:0">Einmal pro Woche 45 Minuten zu zweit – gegenseitiges Erklären ist eine der wirksamsten Formen der Elaboration.</p><div class="tbl-wrap"><table><thead><tr><th>Schritt</th><th>Zeit</th><th>Ablauf</th></tr></thead><tbody>'+TANDEM.map(t=>'<tr><td class="st">'+t[0]+'</td><td style="white-space:nowrap">'+t[1]+'</td><td>'+t[2]+'</td></tr>').join('')+'</tbody></table></div><div class="method" style="margin-top:12px"><div class="eb">Tandem-Regeln</div><ul class="tight small"><li>Fehler sind erwünscht – genau dort lernt ihr.</li><li>Feedback konkret: „Mir fehlte der Bezug zu …“ statt „war gut“.</li><li>Wechselt die Partner nach einigen Wochen, damit neue Perspektiven entstehen.</li></ul></div>';
  return h+foot();
}

function vPlaner(){
  const p=S.p;const wi=curWeekIdx();let all=0,dn=0;p.weeks.forEach(w=>w.tasks.forEach(t=>{all++;if(S.done[t.id])dn++;}));
  let h=phead('Lernplaner','Rückwärts planen bis zum 13. April','Der Planer verteilt alle 14 Schwerpunkte in drei Zyklen: Überblick, Vertiefen, Wiederholen. Deine schwächsten Themen kommen zuerst. Ferien sind berücksichtigt.');
  h+='<section class="card noprint"><div class="row" style="align-items:flex-end"><div class="field"><label for="pstart">Start ab</label><input id="pstart" type="date" value="'+p.start+'" max="'+EXAM.date+'"></div><div class="field"><label for="pmin">Lernzeit pro Woche</label><select id="pmin">'+[90,120,180,240,300].map(m=>'<option value="'+m+'"'+(p.min===m?' selected':'')+'>'+m+' Minuten</option>').join('')+'</select></div><button class="btn primary" data-act="pgen">Plan neu berechnen</button></div><p class="small muted" style="margin-top:10px">Tipp: Schätze dich zuerst in den Schwerpunkten ein – dann berechne den Plan neu. Erledigte Aufgaben bleiben abgehakt.</p></section>';
  h+='<div class="row" style="margin:16px 0 6px"><span class="tagph ph-A">Zyklus 1 · Überblick</span><span class="tagph ph-B">Zyklus 2 · Vertiefen</span><span class="tagph ph-C">Zyklus 3 · Wiederholen</span><span class="tagph ph-F">Ferien</span><span class="spacer"></span><b class="small">'+dn+' von '+all+' erledigt</b></div>';
  p.weeks.forEach((w,i)=>{const m=pd(w.mon);const ph=PH[w.phase]||['',''];const sum=w.tasks.reduce((s,t)=>s+t.min,0);const over=(w.type==='lern'||w.type==='ostern')&&sum>p.min;
    let lbl=w.type==='ostern'?'Osterferien – Intensivwoche':(w.type.indexOf('pause')===0?w.type.split(':')[1]:(w.type==='pruefung'?'Prüfungswoche':''));
    h+='<section class="weekcard'+(i===wi?' now':'')+'"><header><b>Woche ab '+fmt(m)+String(m.getFullYear()).slice(2)+'</b>'+(ph[0]?'<span class="tagph '+ph[1]+'">'+ph[0]+'</span>':'')+(lbl?'<span class="chip zum">'+lbl+'</span>':'')+(i===wi?'<span class="chip fokus">aktuelle Woche</span>':'')+'<span class="spacer"></span><span class="small muted">ca. '+sum+' Min.'+(over?' · mehr als geplant':'')+'</span></header><ul class="week-list">'+w.tasks.map(t=>{const li=taskLi(t);return (i<p.weeks.length-1&&t.typ!=='karten'&&t.typ!=='final')?li.replace('</li>','<button class="btn sm ghost noprint" data-act="tmove" data-w="'+i+'" data-id="'+esc(t.id)+'" aria-label="In die nächste Woche verschieben" title="In die nächste Woche verschieben">→</button></li>'):li;}).join('')+'</ul></section>';});
  return h+foot();
}

function vSichern(){
  let h=phead('Sichern & Drucken','Dein Stand – auf jedem Gerät und auf Papier','Der Abi-Kompass speichert nur in diesem Browser. Mit dem Sicherungscode nimmst du deinen Stand mit.');
  h+='<div class="grid g2"><section class="card"><h3>Stand sichern</h3><p class="small">Erzeuge einen Code, kopiere ihn und speichere ihn z. B. in deinen Notizen oder schicke ihn dir selbst. Er enthält Einschätzungen, Plan, Karten und Notizen.</p><button class="btn primary" data-act="bmake">Sicherungscode erzeugen</button><label for="bout" class="sr">Sicherungscode</label><textarea id="bout" class="code" readonly style="margin-top:10px" placeholder="Hier erscheint dein Code."></textarea><button class="btn" data-act="bcopy" style="margin-top:8px">Code kopieren</button></section>';
  h+='<section class="card"><h3>Stand übernehmen</h3><p class="small">Füge hier einen Sicherungscode ein, z. B. vom Laptop auf das Tablet. Der aktuelle Stand auf diesem Gerät wird ersetzt.</p><label for="bin" class="sr">Code einfügen</label><textarea id="bin" class="code" placeholder="AK27:…"></textarea><button class="btn primary" data-act="bload" style="margin-top:8px">Code übernehmen</button></section></div>';
  h+='<h2>Drucken und als PDF speichern</h2><div class="grid g2"><section class="card"><h3>Lernkompass 2027</h3><p class="small">Alle Kompetenzerwartungen als Checkliste mit deinem aktuellen Stand – der Nachfolger des alten Lernkompasses.</p><a class="btn" href="#/kompass">Druckansicht öffnen</a></section><section class="card"><h3>Jede Seite einzeln</h3><p class="small">Jede Seite lässt sich drucken (Strg+P bzw. ⌘+P). Eingeklappte Hilfen werden dabei automatisch aufgeklappt, der Druck ist immer hell.</p></section></div>';
  h+='<h2>Zurücksetzen</h2><section class="card"><p class="small">Löscht alle Einschätzungen, Karten, Notizen und den Plan auf diesem Gerät.</p><button class="btn bad" data-act="reset">'+(RESET?'Wirklich alles löschen? Nochmal klicken':'Alles zurücksetzen')+'</button></section>';
  return h+foot();
}

function vKompass(){
  let h=phead('Lernkompass · Abitur 2027 · Geschichte Leistungskurs','Alle Kompetenzerwartungen auf einen Blick','Kreuze an, wie sicher du bist: neu · grob · erklären · beurteilen. Markiert ist dein aktueller Stand aus dem Abi-Kompass.','<div class="row noprint" style="margin-top:14px"><button class="btn primary" data-act="print">Drucken / als PDF speichern</button><a class="btn" href="#/sichern">Zurück</a></div>');
  [4,5,6,7].forEach(no=>{h+='<section class="ifsec"><div class="ifhead"><span class="no">IF '+no+'</span><h2>'+IFS[no].t+'</h2></div>';
    SP.filter(s=>s.if===no).forEach(sp=>{h+='<div class="card" style="margin-bottom:10px"><h3>'+sp.t+(sp.fokus.length?' <span class="chip fokus">★ Fokus: '+sp.fokus.join(' · ')+'</span>':'')+'</h3><p class="small muted" style="margin:0 0 6px">„Zeiten und Menschen“ S. '+sp.zum.map(z=>z[0]).join(', ')+'</p>'+sp.ke.map(k=>{const v=S.e[k.id];return '<div class="kp-ke"><span class="boxes4" aria-label="Stand">'+[0,1,2,3].map(i=>'<span class="'+(v===i?'on':'')+'" title="'+LV[i]+'"></span>').join('')+'</span><span><b>'+k.k+'</b>'+(k.fk?' ★':'')+' · '+k.t+'</span></div>';}).join('')+'</div>';});
    h+='</section>';});
  return h+'<p class="small muted">Kästchen von links: neu für mich · grob bekannt · kann ich erklären · kann ich beurteilen.</p>'+foot();
}

/* ---------- Router ---------- */
const NAV=[
 ['grp','Überblick'],['start','Dashboard','M3 12l9-8 9 8M5 10v10h14V10'],['planer','Lernplaner','M4 5h16v15H4zM4 9h16M9 3v4M15 3v4'],
 ['grp','Inhalte'],['themen','Themenkarte','M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3zM9 3v15M15 6v15'],['laengsschnitte','Längsschnitte','M4 18h16M4 12h16M4 6h16M8 4v16'],['zeitleiste','Zeitleiste','M12 3v18M12 7h6M12 12H6M12 17h5'],['lexikon','Begriffslexikon','M5 4h11a3 3 0 013 3v13H8a3 3 0 01-3-3zM5 17a3 3 0 013-3h11'],
 ['grp','Üben'],['karten','Karteikarten','M4 7h13v12H4zM7 4h13v12'],['klausur','Klausur-Werkzeugkasten','M4 20l4-1 11-11-3-3L5 16zM14 6l3 3'],
 ['grp','Begleiten'],['lernen','Lernen lernen','M12 4a6 6 0 016 6c0 2.5-1.5 3.8-2.5 5v2h-7v-2C7.5 13.8 6 12.5 6 10a6 6 0 016-6zM9.5 20h5'],['sichern','Sichern & Drucken','M6 3h9l4 4v14H6zM9 3v5h6M9 14h6M9 17h6']
];
function navHtml(cur){return NAV.map(n=>n[0]==='grp'?'<div class="grp">'+n[1]+'</div>':'<a href="#/'+n[0]+'"'+(cur===n[0]?' aria-current="page"':'')+'><svg viewBox="0 0 24 24" aria-hidden="true"><path d="'+n[2]+'"/></svg>'+n[1]+'</a>').join('');}
function route(){const h=(location.hash||'#/start').replace(/^#\/?/,'');const p=h.split('/');return {v:p[0]||'start',id:p[1]};}
function render(keepScroll){
  const r=route();let html;
  switch(r.v){case 'themen':html=vThemen();break;case 'sp':html=vSP(r.id);break;case 'laengsschnitte':html=vLSall();break;case 'ls':html=vLS(r.id);break;case 'zeitleiste':html=vZL();break;case 'lexikon':html=vLex();break;case 'karten':html=vKarten();break;case 'klausur':html=vKlausur();break;case 'lernen':html=vLernen();break;case 'planer':html=vPlaner();break;case 'sichern':html=vSichern();break;case 'kompass':html=vKompass();break;default:html=vStart();}
  const y=window.scrollY;
  $('#page').innerHTML=html;
  const cur={sp:'themen',ls:'laengsschnitte',kompass:'sichern'}[r.v]||r.v;
  $('#nav').innerHTML=navHtml(cur);
  $$('.js-cd').forEach(e=>e.textContent=daysLeft());
  const t={start:'Dashboard',themen:'Themenkarte',sp:(SPM[r.id]||{}).short,laengsschnitte:'Längsschnitte',ls:(LSM[r.id]||{}).k,zeitleiste:'Zeitleiste',lexikon:'Begriffslexikon',karten:'Karteikarten',klausur:'Klausur-Werkzeugkasten',lernen:'Lernen lernen',planer:'Lernplaner',sichern:'Sichern & Drucken',kompass:'Lernkompass 2027'}[r.v];
  document.title=(t?t+' · ':'')+'Abi-Kompass Geschichte LK 2027';
  if(keepScroll)window.scrollTo(0,y);else window.scrollTo(0,0);
}
window.addEventListener('hashchange',()=>{document.body.classList.remove('navopen');render(false);const m=$('#main');if(m)m.focus({preventScroll:true});});

/* ---------- Theme ---------- */
function applyTheme(){const t=S.set.theme;if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t);else document.documentElement.removeAttribute('data-theme');const b=$('#themebtn');if(b)b.querySelector('b').textContent={auto:'Automatisch',light:'Hell',dark:'Dunkel'}[t]||'Automatisch';}

/* ---------- Aktionen ---------- */
function toast(m){const o=$('.toast');if(o)o.remove();const d=document.createElement('div');d.className='toast';d.setAttribute('role','status');d.textContent=m;document.body.appendChild(d);setTimeout(()=>d.remove(),2600);}
function copyText(txt,ta){if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(txt).then(()=>toast('Kopiert.')).catch(()=>fallback());}else fallback();function fallback(){if(ta){ta.focus();ta.select();}toast('Text markiert – mit Strg+C bzw. ⌘+C kopieren.');}}
function answer(ok){const id=SES.q[SES.i];const s=S.k[id]||{f:0,d:ymd(today())};if(ok){s.f=Math.min(5,(s.f||0)+1);SES.ok++;}else{s.f=1;SES.no++;}s.d=ymd(add(today(),INT[s.f]));S.k[id]=s;save();SES.i++;SES.flip=false;render(true);}
document.addEventListener('click',e=>{
  const b=e.target.closest('[data-act]');
  if(e.target.closest('#menubtn')){document.body.classList.toggle('navopen');return;}
  if(e.target.closest('.scrim')){document.body.classList.remove('navopen');return;}
  if(e.target.closest('#themebtn')){S.set.theme={auto:'light',light:'dark',dark:'auto'}[S.set.theme]||'auto';save();applyTheme();return;}
  if(!b)return;const a=b.dataset.act;
  switch(a){
    case 'tf':TF=b.dataset.v;render(true);break;
    case 'tlm':TLM=b.dataset.v;if(TLM==='ordnen')newOrder();render(true);break;
    case 'tlif':TLF.if=+b.dataset.v;if(TLM==='ordnen')newOrder();render(true);break;
    case 'tlls':TLF.ls=b.dataset.v;if(TLM==='ordnen')newOrder();render(true);break;
    case 'up':case 'down':{const i=+b.dataset.i,j=a==='up'?i-1:i+1;const it=ORD.items;[it[i],it[j]]=[it[j],it[i]];render(true);const btn=$('.order-list li:nth-child('+(j+1)+') [data-act="'+a+'"]')||$('.order-list li:nth-child('+(j+1)+') button');if(btn)btn.focus();break;}
    case 'ordcheck':ORD.checked=true;render(true);break;
    case 'ordnew':newOrder();render(true);break;
    case 'lexbel':LXF.bel=!LXF.bel;render(true);break;
    case 'lexif':LXF.if=+b.dataset.v;render(true);break;
    case 'lextab':LXF.tab=b.dataset.v;render(true);break;
    case 'sesstart':startSession();if(!SES.q.length){SES=null;toast('Keine Karten in dieser Auswahl fällig – wähle einen anderen Stapel.');}render(false);break;
    case 'cflip':SES.flip=true;render(true);break;
    case 'cok':answer(true);break;
    case 'cno':answer(false);break;
    case 'cend':SES={q:SES.q.slice(0,SES.i),i:SES.i,ok:SES.ok,no:SES.no};render(false);break;
    case 'opa':OPQ.ans=+b.dataset.i;OPQ.total++;if(OPQ.opts[OPQ.ans]===OPQ.cur)OPQ.score++;render(true);break;
    case 'opn':newOp();render(true);break;
    case 'scroll':{const t=document.getElementById('k-'+b.dataset.t);if(t)t.scrollIntoView({behavior:'smooth',block:'start'});break;}
    case 'copyp':copyText(KI.prompts[+b.dataset.i][1]);break;
    case 'pgen':{const st=$('#pstart').value||ymd(today());const mn=+$('#pmin').value;S.p=genPlan(st,mn);S.p.example=false;save();render(true);toast('Plan neu berechnet.');break;}
    case 'tmove':{const w=+b.dataset.w;const wk=S.p.weeks[w];const k=wk.tasks.findIndex(t=>t.id===b.dataset.id);if(k>-1&&S.p.weeks[w+1]){const t=wk.tasks.splice(k,1)[0];S.p.weeks[w+1].tasks.push(t);S.p.example=false;save();render(true);toast('In die nächste Woche verschoben.');}break;}
    case 'bmake':{const code='AK27:'+btoa(unescape(encodeURIComponent(JSON.stringify(S))));$('#bout').value=code;break;}
    case 'bcopy':{const ta=$('#bout');if(!ta.value){toast('Erzeuge zuerst einen Code.');break;}copyText(ta.value,ta);break;}
    case 'bload':{const raw=$('#bin').value.trim().replace(/^AK27:/,'');try{const o=JSON.parse(decodeURIComponent(escape(atob(raw))));if(!o||o.v!==1)throw 0;S=Object.assign(blank(),o);save();applyTheme();toast('Stand übernommen.');location.hash='#/start';render(false);}catch(err){toast('Der Code ist unvollständig oder beschädigt. Bitte vollständig kopieren und erneut einfügen.');}break;}
    case 'reset':if(!RESET){RESET=true;render(true);}else{RESET=false;S=blank();S.p=genPlan(today()<EXD?ymd(today()):ymd(add(EXD,-7)),180);S.p.example=true;save();applyTheme();toast('Alles zurückgesetzt.');render(true);}break;
    case 'print':window.print();break;
    case 'skip':{const m=$('#main');if(m)m.focus();break;}
  }
});
document.addEventListener('change',e=>{
  const t=e.target;const a=t.dataset&&t.dataset.act;
  if(a==='lvl'){S.e[t.dataset.ke]=+t.value;save();const sp=SPM[route().id];if(sp){const st=spStats(sp);const aside=$('.sp-aside .card');if(aside)aside.outerHTML='<section class="card"><h3>Dein Stand</h3><div class="row" style="gap:14px">'+ring(st.p,64)+'<div class="small">'+st.set+' von '+st.n+' eingeschätzt</div></div><div style="margin-top:8px">'+LV.map((l,i)=>'<div class="stat"><span>'+l+'</span><b>'+st.c[i]+'</b></div>').join('')+'</div></section>';}}
  else if(a==='task'){S.done[t.dataset.id]=t.checked;save();const li=t.closest('.task');if(li)li.classList.toggle('done',t.checked);}
  else if(a==='deckd'){DECK.d=t.value;}
  else if(a==='deckf'){DECK.f=+t.value;}
});
let noteT;
document.addEventListener('input',e=>{
  const t=e.target;const a=t.dataset&&t.dataset.act;
  if(a==='note'){clearTimeout(noteT);noteT=setTimeout(()=>{S.n[t.dataset.sp]=t.value;save();},400);}
  else if(a==='lexq'){LXF.q=t.value;$('#lexlist').innerHTML=(LXF.tab==='begriffe'?lexList():dossierLexList());}
});
document.addEventListener('keydown',e=>{
  if(route().v!=='karten'||!SES||SES.i>=SES.q.length)return;
  if(e.target.matches('input,select,textarea'))return;
  if(e.code==='Space'){e.preventDefault();if(!SES.flip){SES.flip=true;render(true);}}
  else if(SES.flip&&(e.key==='ArrowRight'||e.key==='j'))answer(true);
  else if(SES.flip&&(e.key==='ArrowLeft'||e.key==='n'))answer(false);
});
window.addEventListener('beforeprint',()=>$$('details').forEach(d=>{if(!d.open){d.open=true;d.dataset.pc='1';}}));
window.addEventListener('afterprint',()=>$$('details[data-pc]').forEach(d=>{d.open=false;delete d.dataset.pc;}));

applyTheme();render(false);
})();
