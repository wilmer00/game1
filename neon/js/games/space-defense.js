export default (E)=>{
const {ctx,K}=E,C=[6,9,12],stars=Array.from({length:70},()=>({x:Math.random()*800,y:Math.random()*450,z:20+Math.random()*100}));
let t=0,sc=0,wave=-1,intro=2,en=[],b=[],eb=[],pw=[],boss=null,shots=0,hits=0,over=0;const S={x:400,y:410,cd:0,inv:0,hp:3,rf:0,sh:0};
function spawn(){wave++;if(wave<3)en=Array.from({length:C[wave]},(_,i)=>({bx:80+(i%6)*125,by:50+Math.floor(i/6)*55,x:0,y:0,age:0,ph:i,cd:1+Math.random()*2,k:i%2}));else boss={x:400,y:-60,hp:60,cd:1.5}}
function hurt(){if(S.inv>0||S.sh>0||over)return;S.hp--;S.inv=1.5;E.burst(S.x,S.y,14,'#0ff',160,.5);E.vib(80);E.beep(110,.3,'sawtooth');if(S.hp<=0){over=1;E.end(false,sc,'Nave destruida')}}
function kill(e,v){sc+=v;hits++;E.burst(e.x,e.y,14,'#fa0',180,.6);E.beep(200,.15,'sawtooth');if(Math.random()<.15)pw.push({x:e.x,y:e.y,k:Math.random()<.5?'R':'S'})}
const eshot=(x,y,a,s)=>eb.push({x,y,vx:Math.sin(a)*s,vy:Math.cos(a)*s});
return{
update(dt){t+=dt;S.cd-=dt;S.inv-=dt;S.rf-=dt;S.sh-=dt;
if(intro>0){intro-=dt;if(intro<=0)spawn()}else if(!en.length&&!boss)intro=2;
S.x=Math.max(20,Math.min(780,S.x+((K.r?1:0)-(K.l?1:0))*380*dt));
if((K.f||K.u)&&S.cd<=0){S.cd=S.rf>0?.12:.25;b.push({x:S.x,y:S.y-16});shots++;E.beep(700,.05)}
for(const e of en){e.age+=dt;e.x=e.bx+Math.sin(t*(1+e.k)+e.ph)*(50+30*e.k);e.y=e.by+e.age*(6+wave*3);e.cd-=dt;if(e.cd<=0){e.cd=2.2/(1+wave*.25)+Math.random();eshot(e.x,e.y+14,0,170+wave*20)}
if(e.y>400){e.dead=1;hurt()}}
if(boss){if(boss.y<90)boss.y+=60*dt;boss.x=400+Math.sin(t*.8)*250;boss.cd-=dt;const ph=boss.hp>40?0:boss.hp>20?1:2;
if(boss.cd<=0&&boss.y>=90){boss.cd=[.9,.8,.6][ph];if(ph===0)eshot(boss.x,boss.y+30,Math.atan2(S.x-boss.x,S.y-boss.y),190);else for(let i=-(ph+1);i<=ph+1;i+=ph===1?1:.5)eshot(boss.x,boss.y+30,i*.25,190)}}
for(const q of b){q.y-=520*dt;for(const e of en)if(!e.dead&&!q.d&&Math.abs(q.x-e.x)<18&&Math.abs(q.y-e.y)<16){e.dead=1;q.d=1;kill(e,100)}
if(boss&&!q.d&&Math.abs(q.x-boss.x)<50&&Math.abs(q.y-boss.y)<30){q.d=1;boss.hp--;hits++;sc+=10;E.burst(q.x,q.y,3,'#fff',100,.3)}}
en=en.filter(e=>!e.dead);b=b.filter(q=>!q.d&&q.y>-20);
for(const q of eb){q.x+=q.vx*dt;q.y+=q.vy*dt;if(Math.abs(q.x-S.x)<14&&Math.abs(q.y-S.y)<14){q.d=1;hurt()}}eb=eb.filter(q=>!q.d&&q.y<470&&q.x>-20&&q.x<820);
for(const w of pw){w.y+=90*dt;if(Math.abs(w.x-S.x)<24&&Math.abs(w.y-S.y)<24){w.d=1;if(w.k==='R')S.rf=6;else S.sh=5;E.beep(900,.15)}}pw=pw.filter(w=>!w.d&&w.y<470);
if(boss&&boss.hp<=0&&!over){over=1;E.burst(boss.x,boss.y,60,'#f0f',260,1);E.end(true,sc+2000+Math.round(shots?hits/shots*1000:0)+S.hp*300,'Jefe derrotado')}},
draw(dt){ctx.fillStyle='#05030f';ctx.fillRect(0,0,800,450);
for(const s of stars){s.y=(s.y+s.z*.016)%450;ctx.fillStyle=`rgba(255,255,255,${s.z/130})`;ctx.fillRect(s.x,s.y,s.z>80?2:1,s.z>80?2:1)}
let g=ctx.createRadialGradient(650,110,5,650,110,70);g.addColorStop(0,'#f8a');g.addColorStop(1,'#406');ctx.fillStyle=g;ctx.beginPath();ctx.arc(650,110,60,0,7);ctx.fill();
g=ctx.createRadialGradient(200,300,10,200,300,200);g.addColorStop(0,'#60f3');g.addColorStop(1,'#0000');ctx.fillStyle=g;ctx.fillRect(0,100,500,350);
for(const e of en){ctx.fillStyle=e.k?'#fa0':'#f0f';ctx.beginPath();ctx.moveTo(e.x,e.y+14);ctx.lineTo(e.x+16,e.y);ctx.lineTo(e.x,e.y-14);ctx.lineTo(e.x-16,e.y);ctx.fill()}
if(boss){ctx.fillStyle='#a0f';ctx.fillRect(boss.x-50,boss.y-25,100,50);ctx.fillStyle='#f55';ctx.fillRect(boss.x-30,boss.y-5,60,10);ctx.fillStyle='#333';ctx.fillRect(200,8,400,10);ctx.fillStyle='#f33';ctx.fillRect(200,8,400*Math.max(0,boss.hp)/60,10)}
ctx.fillStyle='#ff0';for(const q of b)ctx.fillRect(q.x-2,q.y,4,14);
ctx.fillStyle='#f44';for(const q of eb){ctx.beginPath();ctx.arc(q.x,q.y,5,0,7);ctx.fill()}
ctx.font='bold 18px system-ui';ctx.textAlign='center';for(const w of pw){ctx.fillStyle=w.k==='R'?'#fa0':'#0f8';ctx.fillText(w.k,w.x,w.y)}
if(!(S.inv>0&&Math.floor(t*10)%2)){ctx.fillStyle='#0ff';ctx.beginPath();ctx.moveTo(S.x,S.y-18);ctx.lineTo(S.x+16,S.y+14);ctx.lineTo(S.x,S.y+8);ctx.lineTo(S.x-16,S.y+14);ctx.fill();ctx.fillStyle='#fa0';ctx.fillRect(S.x-3,S.y+10,6,6+Math.random()*8)}
if(S.sh>0){ctx.strokeStyle='#0f8';ctx.lineWidth=2;ctx.beginPath();ctx.arc(S.x,S.y,24,0,7);ctx.stroke()}
E.drawParts();
if(intro>0){const nw=wave+1;ctx.font='bold 56px system-ui';ctx.fillStyle='#0ff';ctx.fillText(nw<3?`OLEADA ${nw+1}`:'¡JEFE FINAL!',400,230)}},
hud(){return`Puntos ${sc} · Vidas ${'♥'.repeat(Math.max(0,S.hp))} ${S.rf>0?'· RÁPIDO ':''}${S.sh>0?'· ESCUDO':''}`}}}
