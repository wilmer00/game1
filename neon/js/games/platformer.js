export default (E,o={})=>{
const {ctx,K}=E,lv=o.lv||0,GY=360,segs=[],plats=[],coins=[],en=[],N=7+lv*2,gap=80+lv*20;let x=0,score=o.score||0,lives=o.lives??3;
for(let i=0;i<N;i++){const w=i?240+(i*53)%120:400;segs.push([x,x+w]);
if(i%2)en.push({x:x+w/2,x0:x+30,x1:x+w-30,v:50+lv*15,y:GY-20,alive:1});
if(i>1&&i%2===0){plats.push({x:x+w/2-45,y:275,w:90,h:14});coins.push({x:x+w/2,y:235})}
for(let k=0;k<3;k++)coins.push({x:x+40+k*50,y:320});x+=w+(i<N-1?gap:0)}
const END=segs[N-1][1],cpx=segs[N>>1][0]+60,rects=[...segs.map(s=>({x:s[0],y:GY,w:s[1]-s[0],h:140})),...plats];
const p={x:40,y:300,w:22,h:30,vx:0,vy:0,g:0,jh:0,f:1};let cp={x:40,y:300},inv=0,t=0,fin=0;
const hit=(a,r)=>a.x<r.x+r.w&&a.x+a.w>r.x&&a.y<r.y+r.h&&a.y+a.h>r.y;
function hurt(respawn){if(inv<=0){lives--;inv=1.5;E.vib(80);E.beep(120,.3,'sawtooth');E.burst(p.x+11,p.y+15,12,'#f55',140,.5);if(lives<=0&&!fin){fin=1;E.end(false,score,'Sin vidas');return}}
if(respawn){p.x=cp.x;p.y=cp.y;p.vx=p.vy=0}else{p.vy=-300;p.vx=-p.f*200}}
function step(h){const m=(K.r?1:0)-(K.l?1:0);p.vx+=(m*230-p.vx)*Math.min(1,12*h);if(m)p.f=m;
const j=K.u||K.f;if(j&&!p.jh&&p.g){p.vy=-540;p.g=0;E.beep(520,.1)}p.jh=j?1:0;p.vy=Math.min(p.vy+1400*h,800);
p.x=Math.max(0,p.x+p.vx*h);for(const r of rects)if(hit(p,r)){p.x=p.vx>0?r.x-p.w:r.x+r.w;p.vx=0}
p.y+=p.vy*h;const was=p.g;p.g=0;for(const r of rects)if(hit(p,r)){if(p.vy>0){if(!was&&p.vy>300)E.burst(p.x+11,p.y+30,6,'#bbb',60,.3);p.y=r.y-p.h;p.g=1}else p.y=r.y+r.h;p.vy=0}}
return{
update(dt){t+=dt;inv-=dt;step(dt/2);step(dt/2);
for(const e of en){if(!e.alive)continue;e.x+=e.v*dt;if(e.x<e.x0||e.x>e.x1)e.v*=-1;
if(hit(p,{x:e.x-10,y:e.y,w:20,h:20})){if(p.vy>0&&p.y+p.h-e.y<16){e.alive=0;p.vy=-350;score+=100;E.burst(e.x,e.y+10,10,'#f0f',120,.4);E.beep(300,.1)}else hurt(false)}}
for(const c of coins)if(!c.g&&Math.abs(p.x+11-c.x)<18&&Math.abs(p.y+15-c.y)<22){c.g=1;score+=50;E.burst(c.x,c.y,8,'#ff0',100,.4);E.beep(880,.08)}
if(p.x>cpx&&cp.x<cpx){cp={x:cpx,y:300};E.beep(600,.2)}
if(p.y>520)hurt(true);
if(p.x>END-60&&!fin){if(lv<2)E.start('plat',{lv:lv+1,score:score+500,lives});else{fin=1;E.end(true,score+500+lives*300,'¡Campus completado!')}}},
draw(){const cam=Math.max(0,Math.min(p.x-300,END-500));const g=ctx.createLinearGradient(0,0,0,450);g.addColorStop(0,'#0a0820');g.addColorStop(1,'#2b1470');ctx.fillStyle=g;ctx.fillRect(0,0,800,450);
for(let k=0;k<2;k++){ctx.fillStyle=k?'#251a70':'#1a1650';const f=.2+.25*k;for(let i=0;i<12;i++){const bx=((i*130-cam*f)%1560+1560)%1560-130,h=60+(i*37)%90+k*40;ctx.fillRect(bx,GY-h,90,h+100)}}
ctx.save();ctx.translate(-cam,0);
for(const s of segs){ctx.fillStyle='#1f2a6b';ctx.fillRect(s[0],GY,s[1]-s[0],100);ctx.fillStyle='#0ff';ctx.fillRect(s[0],GY,s[1]-s[0],4)}
ctx.fillStyle='#f0f';for(const r of plats)ctx.fillRect(r.x,r.y,r.w,r.h);
for(const c of coins)if(!c.g){ctx.fillStyle='#ff0';ctx.beginPath();ctx.ellipse(c.x,c.y,Math.abs(Math.cos(t*5))*7+1,7,0,0,7);ctx.fill()}
for(const e of en)if(e.alive){ctx.fillStyle='#f0f';ctx.fillRect(e.x-10,e.y,20,20);ctx.fillStyle='#fff';ctx.fillRect(e.x-6,e.y+5,4,4);ctx.fillRect(e.x+2,e.y+5,4,4)}
ctx.fillStyle='#0f8';ctx.fillRect(END-40,GY-80,4,80);ctx.fillRect(END-36,GY-80,26,16);
if(cp.x>=cpx||true){ctx.fillStyle=cp.x>=cpx?'#0f8':'#888';ctx.fillRect(cpx-30,GY-30,3,30)}
if(!(inv>0&&Math.floor(t*10)%2)){const w=p.g&&Math.abs(p.vx)>20?Math.sin(t*14)*4:0;ctx.fillStyle='#0ff';ctx.fillRect(p.x,p.y+6,p.w,16);ctx.fillStyle='#fff';ctx.fillRect(p.x+2,p.y,18,10);ctx.fillStyle='#000';ctx.fillRect(p.x+(p.f>0?12:4),p.y+3,4,4);ctx.fillStyle='#f0f';ctx.fillRect(p.x+3+w,p.y+22,6,8);ctx.fillRect(p.x+13-w,p.y+22,6,8)}
E.drawParts();ctx.restore()},
hud(){return`Nivel ${lv+1}/3 · Vidas ${'♥'.repeat(Math.max(0,lives))} · Puntos ${score}`}}}
