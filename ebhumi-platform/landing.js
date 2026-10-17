'use strict';
// Retain legacy landing hash links without an inline script (CSP is self-only).
const route=location.hash.slice(1);
if(/^(dashboard|land-search|my-land|applications|land-lease|ctg-zone|gis|documents|payments|due-diligence|ai-assistant|casebook|appointments|notifications|analytics|feature-catalog|admin)$/.test(route))location.replace('/workspace.html#'+route);

function initLandingMotion(){
  if(typeof gsap==='undefined'||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const tl=gsap.timeline({defaults:{ease:'power2.out'}});
  tl.fromTo('.hero .eyebrow',{opacity:0,y:-10},{opacity:1,y:0,duration:0.35})
    .fromTo('.hero h1',{opacity:0,y:14},{opacity:1,y:0,duration:0.45},'-=0.18')
    .fromTo('.hero .intro',{opacity:0,y:10},{opacity:1,y:0,duration:0.4},'-=0.25')
    .fromTo('.hero .actions',{opacity:0,y:10},{opacity:1,y:0,duration:0.35},'-=0.2')
    .fromTo('.landscape .plot',{opacity:0,scale:0.92},{opacity:1,scale:1,duration:0.4,stagger:0.07,clearProps:'transform'},'-=0.25')
    .fromTo('.landscape .passport',{opacity:0,x:18},{opacity:1,x:0,duration:0.45,clearProps:'transform'},'-=0.2');
}

if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',initLandingMotion);
}else{
  initLandingMotion();
}
