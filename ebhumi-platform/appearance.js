'use strict';
/* Local appearance preferences only; no account or workflow data is changed. */
const APPEARANCE_PALETTES=[
 {id:'padma',bn:'পদ্মা সবুজ',en:'Padma Green',bnNote:'চিরচেনা সবুজ ও সাদা',enNote:'The original green and white'},
 {id:'meghna',bn:'মেঘনা নীল',en:'Meghna Blue',bnNote:'নদীর নীল, শান্ত আবহ',enNote:'Quiet river-blue tones'},
 {id:'sundarban',bn:'মৃত্তিকা',en:'Earth Clay',bnNote:'মাটির উষ্ণ, কোমল আভা',enNote:'Warm, understated earth tones'},
 {id:'surma',bn:'সুরমা স্লেট',en:'Surma Slate',bnNote:'ধূসর-নীলের পরিমিত ছোঁয়া',enNote:'A restrained blue-grey balance'}
];
function initAppearance(){
 if(document.getElementById('appearanceDialog'))return;
 const select=document.getElementById('colorVariantSelect');if(!select)return;
 const trigger=document.createElement('button');trigger.id='appearanceOpen';trigger.type='button';trigger.className='appearance-trigger';trigger.setAttribute('aria-haspopup','dialog');trigger.setAttribute('aria-controls','appearanceDialog');
 select.before(trigger);select.hidden=true;
 const dialog=document.createElement('dialog');dialog.id='appearanceDialog';dialog.className='appearance-dialog';dialog.setAttribute('aria-labelledby','appearanceTitle');
 dialog.innerHTML='<div class="dialog-head"><div><span class="eyebrow" data-appearance-copy="eyebrow"></span><h2 id="appearanceTitle" data-appearance-copy="title"></h2></div><button type="button" class="appearance-close icon-button">×</button></div><p class="appearance-intro" data-appearance-copy="intro"></p><fieldset class="appearance-modes"><legend data-appearance-copy="mode"></legend><label><input type="radio" name="appearanceMode" value="light"><span data-appearance-copy="light"></span></label><label><input type="radio" name="appearanceMode" value="dark"><span data-appearance-copy="dark"></span></label></fieldset><fieldset class="appearance-palettes"><legend data-appearance-copy="palette"></legend>'+APPEARANCE_PALETTES.map(p=>'<label class="appearance-choice" data-palette="'+p.id+'"><input type="radio" name="appearancePalette" value="'+p.id+'"><span class="appearance-mini" aria-hidden="true"><i class="mini-side"></i><i class="mini-top"></i><i class="mini-card"></i><i class="mini-card second"></i><i class="mini-action"></i></span><span class="appearance-choice-title"></span><small class="appearance-choice-note"></small><span class="appearance-check" aria-hidden="true">✓</span></label>').join('')+'</fieldset><p class="appearance-saved" data-appearance-copy="saved"></p>';
 document.body.append(dialog);
 trigger.addEventListener('click',()=>{syncAppearance();dialog.showModal();dialog.querySelector('input[name="appearanceMode"]:checked')?.focus();});
 dialog.querySelector('.appearance-close').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
 dialog.addEventListener('change',e=>{if(e.target.name==='appearancePalette')setColorVariant(e.target.value);if(e.target.name==='appearanceMode'){localStorage.setItem('ebhumi_theme',e.target.value);applyTheme(e.target.value);}});
 dialog.addEventListener('close',()=>trigger.focus());
 window.addEventListener('storage',e=>{if(e.key==='ebhumi_color_variant')applyColorVariant(e.newValue||'padma');if(e.key==='ebhumi_theme')applyTheme(e.newValue==='dark'?'dark':'light');});
 let previousLanguage=document.documentElement.lang;new MutationObserver(()=>{const current=document.documentElement.lang;if(current!==previousLanguage){previousLanguage=current;syncAppearance();}}).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
 syncAppearance();
}
function syncAppearance(){
 const dialog=document.getElementById('appearanceDialog'),trigger=document.getElementById('appearanceOpen');if(!dialog||!trigger)return;
 const bn=document.documentElement.lang!=='en',variant=document.documentElement.dataset.colorVariant||'padma',mode=document.documentElement.dataset.theme==='dark'?'dark':'light',selected=APPEARANCE_PALETTES.find(p=>p.id===variant)||APPEARANCE_PALETTES[0];
 const copy=bn?{eyebrow:'নিজের মতো করে',title:'আপনার পছন্দের আবহ',intro:'রঙের নমুনা দেখে বেছে নিন। আপনার কাজ ও তথ্য একই থাকবে।',mode:'আলোর ধরন',light:'দিনের আলো',dark:'রাতের আবহ',palette:'রঙের সংগ্রহ',saved:'আপনার পছন্দ এই ব্রাউজারে সংরক্ষিত থাকবে।',close:'বন্ধ করুন',open:'রঙ ও আলোর ধরন বাছুন'}:{eyebrow:'MAKE IT YOURS',title:'A workspace in your colours',intro:'Choose a palette from the previews. Your work and information stay the same.',mode:'Display mode',light:'Daylight',dark:'Nightfall',palette:'Colour collection',saved:'Your preference stays saved in this browser.',close:'Close',open:'Choose colours and display mode'};
 trigger.replaceChildren();const dot=document.createElement('span');dot.className='appearance-dot';dot.setAttribute('aria-hidden','true');const label=document.createElement('span');label.textContent=selected[bn?'bn':'en'];trigger.append(dot,label);trigger.title=copy.open;trigger.setAttribute('aria-label',copy.open+': '+label.textContent);
 dialog.dataset.mode=mode;for(const el of dialog.querySelectorAll('[data-appearance-copy]'))el.textContent=copy[el.dataset.appearanceCopy];dialog.querySelector('.appearance-close').setAttribute('aria-label',copy.close);
 for(const input of dialog.querySelectorAll('input[name="appearanceMode"]'))input.checked=input.value===mode;
 for(const p of APPEARANCE_PALETTES){const card=dialog.querySelector('[data-palette="'+p.id+'"]');card.querySelector('input').checked=p.id===variant;card.querySelector('.appearance-choice-title').textContent=p[bn?'bn':'en'];card.querySelector('.appearance-choice-note').textContent=p[bn?'bnNote':'enNote'];}
}
