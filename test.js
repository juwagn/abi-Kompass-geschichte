const {chromium}=require('playwright');
(async()=>{
 const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'}).catch(async()=>await chromium.launch());
 const p=await b.newPage({viewport:{width:1360,height:900}});
 const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
 await p.goto('file://'+process.cwd()+'/dist/Abi-Kompass_Geschichte_LK_2027.html');
 await p.waitForTimeout(800);
 await p.screenshot({path:'shot_dash.png'});
 for(const r of ['themen','sp/IF5-S2','laengsschnitte','ls/frieden','zeitleiste','lexikon','karten','klausur','lernen','planer','sichern','kompass']){await p.evaluate(h=>location.hash='#/'+h,r);await p.waitForTimeout(150);}
 // interactions
 await p.evaluate(()=>location.hash='#/sp/IF4-S1');await p.waitForTimeout(100);
 await p.click('label:has(input[name="lv-IF4-S1-SK1"][value="2"])');
 await p.evaluate(()=>location.hash='#/karten');await p.waitForTimeout(100);
 await p.click('[data-act="sesstart"]');await p.click('[data-act="cflip"]');await p.waitForTimeout(600);await p.click('[data-act="cok"]');
 await p.evaluate(()=>location.hash='#/zeitleiste');await p.click('[data-act="tlm"][data-v="ordnen"]');await p.click('[data-act="ordcheck"]');
 await p.evaluate(()=>location.hash='#/klausur');await p.click('[data-act="opa"][data-i="0"]');
 await p.evaluate(()=>location.hash='#/planer');await p.click('[data-act="pgen"]');
 await p.evaluate(()=>location.hash='#/sichern');await p.click('[data-act="bmake"]');
 const code=await p.inputValue('#bout');
 await p.fill('#bin',code);await p.click('[data-act="bload"]');
 const st=await p.evaluate(()=>JSON.parse(localStorage.getItem('abikompass-ge-lk-2027')));
 console.log('e:',JSON.stringify(st.e),'cards:',Object.keys(st.k).length,'weeks:',st.p.weeks.length);
 console.log('phases:',st.p.weeks.map(w=>w.phase||'-').join(''));
 // mobile
 const m=await b.newPage({viewport:{width:400,height:860}});m.on('pageerror',e=>errs.push('M:'+e.message));
 await m.goto('file://'+process.cwd()+'/dist/Abi-Kompass_Geschichte_LK_2027.html#/sp/IF6-S3');await m.waitForTimeout(700);
 await m.screenshot({path:'shot_mobile.png'});
 const ov=await m.evaluate(()=>document.documentElement.scrollWidth);console.log('mobile scrollWidth',ov);
 // dark
 await p.emulateMedia({colorScheme:'dark'});await p.evaluate(()=>location.hash='#/sp/IF5-S2');await p.waitForTimeout(400);await p.screenshot({path:'shot_dark.png'});
 // print
 await p.emulateMedia({colorScheme:'dark',media:'print'});
 await p.evaluate(()=>location.hash='#/kompass');await p.waitForTimeout(300);
 await p.pdf({path:'kompass.pdf',format:'A4'});
 await p.evaluate(()=>location.hash='#/sp/IF5-S2');await p.waitForTimeout(300);
 await p.evaluate(()=>window.dispatchEvent(new Event('beforeprint')));
 await p.pdf({path:'sp.pdf',format:'A4'});
 console.log('errors:',errs);
 await b.close();
})();
