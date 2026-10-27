import kart from './games/kart.js';import plat from './games/platformer.js';import space from './games/space-defense.js';
const $=s=>document.querySelector(s),cv=$('#c'),ctx=cv.getContext('2d');cv.width=800;cv.height=450;
const GM={kart:{n:'Neon Kart Racing',f:kart,d:'3 vueltas contra 3 rivales. Derrapa y usa el turbo.'},plat:{n:'Campus Explorer',f:plat,d:'3 niveles de plataformas con chips, enemigos y checkpoints.'},space:{n:'Orbital Defense',f:space,d:'3 oleadas y un jefe final con potenciadores.'}};
const KEY='neon_v1';let S={v:1,best:{},plays:0,log:[]};try{Object.assign(S,JSON.parse(localStorage.getItem(KEY)||'{}'))}catch{}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch{}};
const K={},P=[],touch=matchMedia('(pointer:coarse)').matches||'ontouchstart' in window,hud=$('#hud');
let snd=true,ac,G=null,paused=false,last=0,mode='',opt={};
function beep(f=440,d=.1,type='square',g=.04){if(!snd)return;try{ac??=new AudioContext();const o=ac.createOscillator(),v=ac.createGain(),t=ac.currentTime;o.type=type;o.frequency.value=f;v.gain.setValueAtTime(g,t);v.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(v);v.connect(ac.destination);o.start();o.stop(t+d)}catch{}}
function burst(x,y,n,c,s=120,life=.5){for(let i=0;i<n&&P.length<250;i++){const a=Math.random()*6.28,v=Math.random()*s;P.push({x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,l:life,m:life,c})}}
function drawParts(){for(const p of P){ctx.globalAlpha=Math.max(0,p.l/p.m);ctx.fillStyle=p.c;ctx.fillRect(p.x-2,p.y-2,4,4)}ctx.globalAlpha=1}
const E={ctx,K,beep,burst,drawParts,start,end,vib:ms=>{try{snd&&navigator.vibrate?.(ms)}catch{}}};
function clr(){Object.keys(K).forEach(k=>K[k]=0);document.querySelectorAll('#pad .on').forEach(b=>b.classList.remove('on'))}
function showOv(h,p,label,fn){$('#ov h2').textContent=h;$('#ov p').textContent=p;$('#again').textContent=label;$('#again').onclick=fn;$('#ov').hidden=false}
function menu(){G=null;paused=false;clr();$('#game').hidden=true;$('#ov').hidden=true;$('#menu').hidden=false;document.body.className='';
$('#cards').innerHTML=Object.entries(GM).map(([k,g])=>`<div class="card"><h3>${g.n}</h3><p>${g.d}</p><p>Récord local: <b>${S.best[k]||0}</b></p><button data-m="${k}">Jugar</button></div>`).join('');$('#plays').textContent=`Partidas jugadas: ${S.plays}`}
function start(m,o={}){mode=m;if(m==='kart'&&o.n==null)o={n:S.plays%2};opt=o;clr();P.length=0;paused=false;G=GM[m].f(E,o);document.body.className=(touch?'touch ':'')+'m-'+m;$('#menu').hidden=true;$('#game').hidden=false;$('#ov').hidden=true}
function end(win,score,msg){G=null;clr();S.plays++;const nb=score>(S.best[mode]||0);if(nb)S.best[mode]=score;S.log=[{m:mode,s:score,w:win,d:Date.now()},...S.log].slice(0,20);save();beep(win?880:150,.4);showOv(win?'¡Victoria!':'Derrota',`${msg} · ${score} pts${nb?' · ¡NUEVO RÉCORD!':''}`,'Reintentar',()=>start(mode,{n:opt.n}))}
function pause(v=!paused){if(!G)return;paused=v;if(v){clr();showOv('Pausa','','Continuar',()=>pause(false))}else $('#ov').hidden=true}
function loop(t){requestAnimationFrame(loop);const dt=Math.min((t-last)/1000,.05);last=t;if(!G||paused)return;const g=G;g.update(dt);if(G!==g)return;for(let i=P.length-1;i>=0;i--){const p=P[i];p.l-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;if(p.l<=0)P.splice(i,1)}g.draw();hud.textContent=g.hud()}
const km={arrowleft:'l',a:'l',arrowright:'r',d:'r',arrowup:'u',w:'u',arrowdown:'d',s:'d',' ':'f'};
addEventListener('keydown',e=>{const k=e.key.toLowerCase();if(k==='p'){pause();return}if(km[k]){K[km[k]]=1;if(G)e.preventDefault()}});
addEventListener('keyup',e=>{const k=km[e.key.toLowerCase()];if(k)K[k]=0});
addEventListener('blur',clr);document.addEventListener('visibilitychange',()=>{if(document.hidden){pause(true);clr()}});
document.querySelectorAll('#pad button').forEach(b=>{const k=b.dataset.k,on=v=>{K[k]=v;b.classList.toggle('on',!!v)};b.onpointerdown=e=>{e.preventDefault();b.setPointerCapture(e.pointerId);on(1);E.vib(8)};['pointerup','pointercancel','lostpointercapture'].forEach(ev=>b.addEventListener(ev,()=>on(0)))});
$('#cards').onclick=e=>{const m=e.target.dataset.m;if(m){beep(660,.1);start(m)}};
$('#pause').onclick=()=>pause();$('#home').onclick=menu;
$('#snd').onclick=e=>{snd=!snd;e.target.textContent='Sonido: '+(snd?'ON':'OFF')};
$('#rst').onclick=()=>{if(confirm('¿Borrar récords y progreso?')){S={v:1,best:{},plays:0,log:[]};save();menu()}};
let dp;addEventListener('beforeinstallprompt',e=>{e.preventDefault();dp=e});
$('#inst').onclick=()=>{if(dp){dp.prompt();dp=null}else alert('Android/Chrome: menú ⋮ › Instalar aplicación. iPhone/iPad: abre en Safari › Compartir › Añadir a pantalla de inicio.')};
navigator.serviceWorker?.register('sw.js').then(r=>{r.onupdatefound=()=>{$('#help').textContent='Actualización disponible: recarga la página.'}}).catch(()=>{});
menu();requestAnimationFrame(loop);
