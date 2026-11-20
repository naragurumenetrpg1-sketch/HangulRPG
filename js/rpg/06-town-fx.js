// ===== 6b. town atmosphere (HD-2D style): time of day, window/forge lights, dappled light, floor texture =====
// Only used inside towns (maps called "village*") and only when settings > まちの えんしゅつ is ON.
const TOD={
  day:{tint:[255,247,231],glow:.16,dap:1,dapC:'255,244,200',shA:.5,shLen:1,vig:.48},
  evening:{tint:[255,188,132],glow:.62,dap:.5,dapC:'255,200,140',shA:.56,shLen:1.7,vig:.54},
  night:{tint:[108,128,208],glow:1,dap:.45,dapC:'170,190,255',shA:.3,shLen:.9,vig:.62}};
const TOD_MAP={village:'day',village2:'evening',village3:'night'};
const todOf=()=>TOD[TOD_MAP[S.map]||'day'];
// light anchors inside each building image (image pixels, origin top-left)
const LIGHTS={
  inn:{win:[[40,49],[20,86],[60,86]],door:[40,97]},
  shop:{win:[[40,38],[17,63],[58,63]],door:[38,80]},
  elder:{win:[[40,42],[20,88],[60,88]],door:[40,100]},
  smith:{forge:[[27,53,1],[60,63,.8]]}};

const _gl={};
function glowSpr(r,rgb){const k=r+'|'+rgb;if(_gl[k])return _gl[k];const s=r*2,c=document.createElement('canvas');c.width=c.height=s;const q=c.getContext('2d'),gr=q.createRadialGradient(r,r,0,r,r,r);
  gr.addColorStop(0,'rgba('+rgb+',1)');gr.addColorStop(.45,'rgba('+rgb+',.35)');gr.addColorStop(1,'rgba('+rgb+',0)');q.fillStyle=gr;q.fillRect(0,0,s,s);return _gl[k]=c}

// ---- floor: cobblestone variants for the town road ("S" tile) ----
const _cob=[];
function buildCobble(v){const c=document.createElement('canvas');c.width=c.height=16;const q=c.getContext('2d');let s=v*7919+17;const r=()=>(s=(s*16807)%2147483647)/2147483647;
  q.fillStyle='#62627a';q.fillRect(0,0,16,16);
  for(let row=0;row<4;row++){const y=row*4,off=row%2?4:0;
    for(let sx=-8+off;sx<16;sx+=8){const x=Math.max(0,sx),w=Math.min(16,sx+8)-x;if(w<=0)continue;
      const b=150+((r()*20-10)|0),sh=(r()*10-5)|0;q.fillStyle='rgb('+(b+sh)+','+(b+sh)+','+(b+8+sh)+')';q.fillRect(x,y,w-1,3);
      q.fillStyle='rgba(255,255,255,.22)';q.fillRect(x,y,w-1,1);q.fillStyle='rgba(0,0,0,.18)';q.fillRect(x,y+2,w-1,1)}}
  for(let i=0;i<5;i++){q.fillStyle=r()>.5?'rgba(0,0,0,.12)':'rgba(120,160,110,.18)';q.fillRect((r()*15)|0,(r()*15)|0,1,1)}
  return c}
function cobble(x,y){const v=(x*7+y*13+((x^y)&1))%6;return _cob[v]||(_cob[v]=buildCobble(v))}

// ---- floor: fine grain over the ground (world-anchored, so it never swims) ----
let _grain=null;
function grainPattern(){if(_grain)return _grain;const c=document.createElement('canvas');c.width=c.height=64;const q=c.getContext('2d'),d=q.createImageData(64,64);let s=4242;const r=()=>(s=(s*16807)%2147483647)/2147483647;
  for(let i=0;i<64*64;i++){const v=128+((r()*2-1)*46|0);d.data[i*4]=d.data[i*4+1]=d.data[i*4+2]=v;d.data[i*4+3]=255}q.putImageData(d,0,0);return _grain=g.createPattern(c,'repeat')}
const treeNear=(x,y)=>{for(let j=-1;j<=1;j++)for(let i=-1;i<=1;i++){const c=tileAt(S.map,x+i,y+j);if(c==='T'||c==='Z')return true}return false};

// ground layer: grain + dappled sunlight (drawn before characters/buildings)
function townGround(x0,x1,y0,y1,TD,t){
  g.save();g.globalCompositeOperation='overlay';g.globalAlpha=.2;g.fillStyle=grainPattern();g.fillRect(x0*TS,y0*TS,(x1-x0)*TS,(y1-y0)*TS);g.restore();
  if(TD.dap<=0)return;
  g.save();g.globalCompositeOperation='lighter';const spr=glowSpr(16,TD.dapC);
  for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++){const ch=tileAt(S.map,x,y);if(ch!=='.'&&ch!=='F')continue;
    const h=((x*73856093)^(y*19349663))>>>0,k=h%20;let near=false;
    if(k!==0){if(k>=5)continue;if(!treeNear(x,y))continue;near=true}
    const ph=(h%628)/100,ax=Math.sin(t*.45+ph)*3,ay=Math.cos(t*.37+ph)*2,a=TD.dap*(near?.2:.12)*(.55+.45*Math.sin(t*.8+ph*1.7)),sc=.8+((h>>8)%5)/10,w=26*sc,hh=15*sc;
    if(a<=.005)continue;g.globalAlpha=a;g.drawImage(spr,x*TS+8+ax-w/2,y*TS+8+ay-hh/2,w,hh)}
  g.restore()}

// tint (multiply) then lights (additive) - both in world space, after everything is drawn
function townTint(TD){g.save();g.globalCompositeOperation='multiply';g.fillStyle='rgb('+TD.tint.join(',')+')';g.fillRect(S.cam[0]-2,S.cam[1]-2,LW/WS+4,LH/WS+4);g.restore()}
function townLights(TD,t){
  g.save();g.globalCompositeOperation='lighter';
  (BLD[S.map]||[]).forEach(b=>{const im=IMGS['b_'+b.k],L=LIGHTS[b.k];if(!im||!im.naturalWidth||!L)return;
    const ox=b.x*TS+8-im.naturalWidth/2,oy=(b.y+1)*TS-im.naturalHeight,fl=.88+.12*Math.sin(t*3.1+b.x*1.7);
    if(L.win&&TD.glow>.05)L.win.forEach((p,i)=>{const a=TD.glow*(i?.9:1)*fl;
      g.globalAlpha=a*.38;g.drawImage(glowSpr(24,'255,196,110'),ox+p[0]-24,oy+p[1]-24,48,48);
      g.globalAlpha=Math.min(1,a*.62);g.fillStyle='#ffd88a';g.fillRect(ox+p[0]-4,oy+p[1]-5,8,10)});
    if(L.door&&TD.glow>.05){g.globalAlpha=TD.glow*.5*fl;g.drawImage(glowSpr(26,'255,190,100'),ox+L.door[0]-26,(b.y+1)*TS+3-10,52,20)}
    if(L.forge)L.forge.forEach((p,i)=>{const f=.75+.25*Math.sin(t*9+i*2)+.1*Math.sin(t*23+i),a=(.42+.4*TD.glow)*f*p[2];
      g.globalAlpha=Math.min(1,a*.8);g.drawImage(glowSpr(22,'255,140,50'),ox+p[0]-22,oy+p[1]-22,44,44);
      g.globalAlpha=Math.min(1,a*.7);g.drawImage(glowSpr(8,'255,210,130'),ox+p[0]-8,oy+p[1]-8,16,16)})});
  g.restore()}
