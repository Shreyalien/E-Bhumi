'use strict';
/* Compact native picker; the existing moon/sun button controls display mode. */
const APPEARANCE_PALETTES=[{id:'padma',bn:'পদ্মা সবুজ',en:'Padma Green'},{id:'meghna',bn:'মেঘনা নীল',en:'Meghna Blue'},{id:'sundarban',bn:'মৃত্তিকা',en:'Earth Clay'},{id:'surma',bn:'সুরমা স্লেট',en:'Surma Slate'}];
function initAppearance(){
 const select=document.getElementById('colorVariantSelect');if(!select)return;select.hidden=false;if(select.dataset.appearanceReady)return;select.dataset.appearanceReady='true';
 window.addEventListener('storage',e=>{if(e.key==='ebhumi_color_variant')applyColorVariant(e.newValue||'padma');if(e.key==='ebhumi_theme')initTheme();});
 let previousLanguage=document.documentElement.lang;new MutationObserver(()=>{const current=document.documentElement.lang;if(current!==previousLanguage){previousLanguage=current;syncAppearance();}}).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});syncAppearance();
}
function syncAppearance(){
 const select=document.getElementById('colorVariantSelect');if(!select)return;
 const bn=document.documentElement.lang!=='en',variant=document.documentElement.dataset.colorVariant||'padma',label=bn?'রং বাছুন':'Choose colour';
 for(const p of APPEARANCE_PALETTES){const option=select.querySelector('option[value="'+p.id+'"]'),text=p[bn?'bn':'en'];if(option&&option.textContent!==text)option.textContent=text;}
 if(select.value!==variant)select.value=variant;if(select.title!==label)select.title=label;if(select.getAttribute('aria-label')!==label)select.setAttribute('aria-label',label);
}
