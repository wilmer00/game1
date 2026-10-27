export default (E,{n=0}={})=>{
const {ctx,K}=E,cx=400,cy=225,[ox,oy,ix,iy]=[[360,200,215,95],[370,205,250,120]][n%2],mx=(ox+ix)/2,my=(oy+iy)/2,L=Math.PI*6;
const on=(x,y)=>((x-cx)/ox)**2+((y-cy)/oy)**2<1&&((x-cx)/ix)**2+((y-cy)/iy)**2>1;
const cars=['#0ff','#f0f','#fa0','#0f8'].map((c,i)=>{const th=-.09*i,off=i?1+(i%2?.1:-.1):1;return{c,i,ai:i>0,off,th,p:th,x:cx+mx*off*Math.cos(th),y:cy+my*off*Math.sin(th),vx:0,vy:0,s:0,a:Math.atan2(my*Math.cos(th),-mx*Math.sin(th)),fin:0,top:[215,195,205,185][i]}});
let t=0,boost=0,cd=0,done=0;const me=cars[0];
const rank=()=>1+cars.filter(o=>o.p>me.p).length;
return{
update(dt){t+=dt;if(t<3)return;const tt=t-3;cd-=dt;boost-=dt;
if(K.f&&cd<=0){boost=2;cd=10;E.beep(300,.3,'sawtooth');E.vib(30)}
for(const c of cars){let st,gas,br=0;
if(c.ai){const q=c.th+.35,d0=Math.atan2(cy+my*c.off*Math.sin(q)-c.y,cx+mx*c.off*Math.cos(q)-c.x)-c.a,d=Math.atan2(Math.sin(d0),Math.cos(d0));st=Math.max(-1,Math.min(1,d*3));gas=Math.abs(d)<.7?1:.3;br=Math.abs(d)>1?1:0}
else{st=(K.r?1:0)-(K.l?1:0);gas=K.u?1:0;br=K.d?1:0}
const bo=!c.ai&&boost>0,ot=!on(c.x,c.y),lim=ot?70:bo?330:c.top;
c.s+=(gas*200+(bo?250:0)-br*320-c.s*.6)*dt;if(c.s>lim)c.s+=(lim-c.s)*5*dt;if(c.s<0)c.s=0;
c.a+=st*2.6*dt*Math.min(1,c.s/90);
const drift=Math.abs(st)>.5&&c.s>170,g=drift?2.2:7;
c.vx+=(Math.cos(c.a)*c.s-c.vx)*Math.min(1,g*dt);c.vy+=(Math.sin(c.a)*c.s-c.vy)*Math.min(1,g*dt);
c.x=Math.max(10,Math.min(790,c.x+c.vx*dt));c.y=Math.max(10,Math.min(440,c.y+c.vy*dt));
if(ot&&c.s>40)E.burst(c.x,c.y,1,'#6b4',40,.4);else if(drift)E.burst(c.x,c.y,1,'#ddd',20,.4);
if(bo)E.burst(c.x-Math.cos(c.a)*14,c.y-Math.sin(c.a)*14,1,'#fa0',60,.25);
const th=Math.atan2((c.y-cy)/my,(c.x-cx)/mx);let d=th-c.th;d=Math.atan2(Math.sin(d),Math.cos(d));c.p+=d;c.th=th;
if(!c.fin&&c.p>=L)c.fin=tt}
for(let i=0;i<4;i++)for(let j=i+1;j<4;j++){const a=cars[i],b=cars[j],dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy);if(d<22&&d>0){const u=(22-d)/2/d;a.x-=dx*u;a.y-=dy*u;b.x+=dx*u;b.y+=dy*u;a.s*=.96;b.s*=.96;E.burst(a.x+dx/2,a.y+dy/2,3,'#ff0',90,.3);if(i===0||j===0)E.vib(15)}}
if(me.fin&&!done){done=1;const r=1+cars.filter(o=>o.fin&&o.fin<me.fin).length;E.end(r===1,Math.max(0,Math.round((5-r)*1000-me.fin*8)),`Posición ${r}º · ${me.fin.toFixed(1)} s`)}},
draw(){ctx.fillStyle='#0b3d1e';ctx.fillRect(0,0,800,450);
ctx.fillStyle='#2a2a3a';ctx.beginPath();ctx.ellipse(cx,cy,ox,oy,0,0,7);ctx.fill();
ctx.fillStyle='#0b3d1e';ctx.beginPath();ctx.ellipse(cx,cy,ix,iy,0,0,7);ctx.fill();
ctx.strokeStyle='#0ff';ctx.lineWidth=3;for(const[a,b]of[[ox,oy],[ix,iy]]){ctx.beginPath();ctx.ellipse(cx,cy,a,b,0,0,7);ctx.stroke()}
ctx.fillStyle='#fff';ctx.fillRect(cx+ix,cy-3,ox-ix,6);
for(const c of cars){ctx.save();ctx.translate(c.x,c.y);ctx.rotate(c.a);ctx.fillStyle='#000a';ctx.fillRect(-11,-5,24,14);ctx.fillStyle=c.c;ctx.fillRect(-12,-7,24,14);ctx.fillStyle='#111';const w=Math.sin(t*c.s*.1)>0?3:0;ctx.fillRect(-10,-9,6,3+w/3);ctx.fillRect(-10,6,6,3);ctx.fillRect(5,-9,6,3);ctx.fillRect(5,6,6,3);ctx.fillStyle='#fff';ctx.fillRect(4,-3,5,6);ctx.restore()}
E.drawParts();
if(t<3){ctx.font='bold 90px system-ui';ctx.textAlign='center';ctx.fillStyle='#ff0';ctx.fillText(Math.ceil(3-t),400,255)}},
hud(){return`Vuelta ${Math.min(3,Math.floor(Math.max(0,me.p)/(Math.PI*2))+1)}/3 · Pos ${rank()}/4 · Turbo ${cd>0?Math.ceil(cd)+'s':'LISTO'}`}}}
