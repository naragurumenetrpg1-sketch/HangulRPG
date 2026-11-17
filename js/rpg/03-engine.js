// ===== 4. engine core =====
const SC=2, FONT='"DotGothic16","Noto Sans KR","Malgun Gothic","Apple SD Gothic Neo","MS Gothic",monospace';
const S={map:'village',x:10,y:17,dir:0,step:0,mv:null,steps:0,sinceBattle:0,
  hero:{name:'ユウ',cls:0,lv:1,hp:30,mhp:30,mp:5,mmp:5,atk:8,def:3,exp:0,gold:20,wpn:0,arm:0},
  items:{herb:2,ether:0},flags:{},chests:{},learned:{},seen:{},cleared:{},seed:7,perm:null,stats:{},scenes:[]};
const HEROES=[{id:'sword',job:'剣士'},{id:'mage',job:'魔法使い'},{id:'priest',job:'僧侶'},{id:'monk',job:'武道家'},
 {id:'asword',job:'上級兵士',base:'sword',tint:{shift:0,gray:45,gs:.55,gl:.0}},{id:'amage',job:'上級魔法使い',base:'mage',tint:{shift:150}},{id:'apriest',job:'上級僧侶',base:'priest',tint:{shift:-120,gray:50,gs:.4,gl:.0}},{id:'amonk',job:'上級武道家',base:'monk',tint:{shift:210,gray:215,gs:.35,gl:.0}},{id:'merchant',job:'商人',base:'sword',tint:{shift:0,gray:22,gs:.6,gl:.06}}];
const META_KEY='lumina-hero-meta';
const metaGet=()=>{try{const d=JSON.parse(localStorage.getItem(META_KEY))||{};return{unlocked:!!d.unlocked,cleared:d.cleared||{},learned:d.learned||{}}}catch(e){return{unlocked:false,cleared:{},learned:{}}}};
const metaPut=d=>{try{localStorage.setItem(META_KEY,JSON.stringify(d))}catch(e){}};
const metaUnlocked=()=>metaGet().unlocked;
const metaUnlock=()=>{const d=metaGet();d.unlocked=1;metaPut(d)};
const metaClear=ci=>{const d=metaGet();d.unlocked=1;d.cleared[ci]=1;metaPut(d)};
const metaMerge=()=>{try{const d=metaGet();Object.assign(d.learned,S.learned||{});metaPut(d)}catch(e){}};
function heroImg(i){const H=HEROES[i||0];if(!H.base)return IMGS['hero_'+H.id];const src=IMGS['hero_'+H.base];if(!src||!src.naturalWidth)return null;if(H._im)return H._im;
  const c=document.createElement('canvas');c.width=src.naturalWidth;c.height=src.naturalHeight;const q=c.getContext('2d');q.drawImage(src,0,0);const d=q.getImageData(0,0,c.width,c.height),a=d.data,T=H.tint;
  for(let p=0;p<a.length;p+=4){if(!a[p+3])continue;let r=a[p]/255,g=a[p+1]/255,b=a[p+2]/255;const mx=Math.max(r,g,b),mn=Math.min(r,g,b);let l=(mx+mn)/2,s=0,h=0;const dd=mx-mn;
    if(dd){s=l>.5?dd/(2-mx-mn):dd/(mx+mn);h=mx===r?((g-b)/dd+(g<b?6:0)):mx===g?(b-r)/dd+2:(r-g)/dd+4;h*=60}
    if(s<.18&&T.gray!==undefined){h=T.gray;s=T.gs;l=Math.min(1,l+(T.gl||0))}else h=(h+T.shift+360)%360;
    const C=(1-Math.abs(2*l-1))*s,X=C*(1-Math.abs((h/60)%2-1)),m=l-C/2;let rr,gg,bb;const k=Math.floor(h/60)%6;[rr,gg,bb]=[[C,X,0],[X,C,0],[0,C,X],[0,X,C],[X,0,C],[C,0,X]][k];
    a[p]=Math.round((rr+m)*255);a[p+1]=Math.round((gg+m)*255);a[p+2]=Math.round((bb+m)*255)}
  q.putImageData(d,0,0);H._im=c;return c}
function setHero(i){S.hero.cls=i}
const WPN=[['ひのきのぼう',0,0],['どうのつるぎ',6,60],['てつのつるぎ',12,180]];
const ARM=[['ぬののふく',0,0],['かわのよろい',4,50],['くさりかたびら',9,160]];
const ITM={herb:['やくそう',8],ether:['せいすい',20]};
const ATK=()=>S.hero.atk+WPN[S.hero.wpn][1], DEF=()=>S.hero.def+ARM[S.hero.arm][1];
const need=lv=>lv*lv*5+lv*4;
const NPCS={
 village:[],
 inn:[{x:3,y:2,s:'inn',i:'v_woman',id:'inn',w:4}],shop:[{x:3,y:2,s:'shop',i:'v_merch',id:'shop',w:5}],elder:[{x:3,y:2,s:'elder',i:'v_elder',id:'elder',w:6}],
 village2:[],village3:[],
 inn2:[{x:3,y:2,s:'inn',i:'v_woman',id:'inn',w:0}],shop2:[{x:3,y:2,s:'shop',i:'v_merch',id:'shop',w:1}],
 inn3:[{x:3,y:2,s:'inn',i:'v_woman',id:'inn',w:0}],shop3:[{x:3,y:2,s:'shop',i:'v_merch',id:'shop',w:1}],
 cave2:[{x:6,y:2,s:'boss',id:'boss'}],field:[],cave1:[]
};
const WARPS={
 'village:5,8':['inn',4,6,1],'inn:4,7':['village',5,9,0],'village:16,8':['shop',4,6,1],'shop:4,7':['village',16,9,0],
 'village:5,16':['elder',3,5,1],'elder:3,6':['village',5,17,0],'village:10,19':['field',5,6,0],'field:5,5':['village',10,18,1],
 'field:26,19':['cave1',2,1,0],'field:14,7':['village2',9,16,1],'field:22,13':['village3',10,17,1],'village3:10,18':['field',23,13,3],'village3:4,8':['inn3',4,6,1],'inn3:4,7':['village3',4,9,0],'village3:15,8':['shop3',4,6,1],'shop3:4,7':['village3',15,9,0],'village2:9,17':['field',14,8,0],'village2:4,8':['inn2',4,6,1],'inn2:4,7':['village2',4,9,0],'village2:13,8':['shop2',4,6,1],'shop2:4,7':['village2',13,9,0],'cave1:1,1':['field',26,20,0],'cave1:17,11':['cave2',6,9,1],'cave2:6,10':['cave1',17,10,0]
};
const BLD={village3:[{k:'inn',x:4,y:8},{k:'shop',x:15,y:8}],village2:[{k:'inn',x:4,y:8},{k:'shop',x:13,y:8}],village:[{k:'inn',x:5,y:8},{k:'shop',x:16,y:8},{k:'elder',x:5,y:16},{k:'smith',x:16,y:15}]};
const LOOT={'cave1:18,5':{item:'herb',n:3},'cave1:16,9':{gold:80},'cave2:1,1':{item:'ether',n:2},'cave2:12,1':{item:'herb',n:4}};
const M=()=>MAPS[S.map];
function tileAt(m,x,y){const mp=MAPS[m];if(x<0||y<0||x>=mp.w||y>=mp.h)return 'W';const ch=mp.rows[y][x];return(ch==='X'&&S.chests[m+':'+x+','+y])?'x':ch}
const npcAt=(x,y)=>(NPCS[S.map]||[]).find(n=>n.x===x&&n.y===y&&!n.gone);
const DIRV=[[0,1],[0,-1],[-1,0],[1,0]];
// ---- input ----
const held=new Set();
const KEYMAP={ArrowUp:'up',ArrowDown:'down',ArrowLeft:'left',ArrowRight:'right',w:'up',s:'down',a:'left',d:'right',z:'a',Enter:'a',' ':'a',x:'b',Escape:'b',Backspace:'b'};
function press(k){AUDIO.init();S.path=null;const sc=S.scenes[S.scenes.length-1];if(sc&&sc.key)sc.key(k)}
addEventListener('keydown',e=>{const k=KEYMAP[e.key]||KEYMAP[e.key.toLowerCase()];if(!k)return;e.preventDefault();if(!held.has(k)){held.add(k);press(k)}});
addEventListener('keyup',e=>{const k=KEYMAP[e.key]||KEYMAP[e.key.toLowerCase()];if(k)held.delete(k)});
document.querySelectorAll('[data-k]').forEach(b=>{const k=b.dataset.k;
  const dn=e=>{e.preventDefault();if(!held.has(k)){held.add(k);press(k)}},up=e=>{e.preventDefault();held.delete(k)};
  b.addEventListener('pointerdown',dn);b.addEventListener('pointerup',up);b.addEventListener('pointerleave',up);b.addEventListener('pointercancel',up)});
// ---- ui helpers ----
function txt(s,x,y,col='#fff',size=16){g.font=size+'px '+FONT;g.textBaseline='top';g.fillStyle='#000';g.fillText(s,x+1,y+1);g.fillStyle=col;g.fillText(s,x,y)}
function rrect(x,y,w,h,r){g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath()}
function win(x,y,w,h){const r=10;g.save();
  g.shadowColor='rgba(0,0,0,.55)';g.shadowBlur=14;g.shadowOffsetY=4;rrect(x,y,w,h,r);g.fillStyle='#0b1226';g.fill();g.shadowColor='transparent';
  const gr=g.createLinearGradient(0,y,0,y+h);gr.addColorStop(0,'rgba(24,40,72,.94)');gr.addColorStop(1,'rgba(8,14,32,.96)');
  rrect(x,y,w,h,r);g.fillStyle=gr;g.fill();
  g.lineWidth=2.5;g.strokeStyle='#d9b24a';rrect(x+1,y+1,w-2,h-2,r);g.stroke();
  g.lineWidth=1;g.strokeStyle='rgba(120,150,230,.55)';rrect(x+5,y+5,w-10,h-10,r-4);g.stroke();
  g.fillStyle='#f2c94c';[[x+7,y+7],[x+w-7,y+7],[x+7,y+h-7],[x+w-7,y+h-7]].forEach(c=>{g.beginPath();g.moveTo(c[0],c[1]-3);g.lineTo(c[0]+3,c[1]);g.lineTo(c[0],c[1]+3);g.lineTo(c[0]-3,c[1]);g.closePath();g.fill()});
  g.restore()}
function lines(s,x,y,lh=22,col){s.split('\n').forEach((l,i)=>txt(l,x,y+i*lh,col))}
const push=s=>S.scenes.push(s), pop=()=>S.scenes.pop();
// message window with typewriter; pages = array of strings; cb after
function say(pages,cb){if(typeof pages==='string')pages=[pages];pages=pages.flatMap(p=>String(p).split('\f'));let pi=0,ci=0,t=0;
  const sc={draw(){win(16,316,480,120);const p=pages[pi];const shown=p.slice(0,ci);lines(shown,34,330,26);
      if(ci>=p.length&&((t*2)|0)%2===0)txt('▼',474,408)},
    update(dt){t+=dt;sc._c=(sc._c||0)+dt*45;ci=Math.floor(Math.min(pages[pi].length,sc._c))},
    key(k){if(k!=='a'&&k!=='b')return;const p=pages[pi];if(ci<p.length){ci=p.length;sc._c=p.length;return}
      AUDIO.se('ok');if(pi<pages.length-1){pi++;ci=0;sc._c=0}else{pop();cb&&cb()}},a:'b'};push(sc);AUDIO.se('talk')}
// vertical choice menu
function choose(opts,cb,o={}){let i=0;const ba=S.scenes[S.scenes.length-1].a,an=o.a||(ba==='n'?'t':ba)||'t';const w=o.w||150,x=(o.x===10&&o.a==='n'&&isLand())?LW-w-130:(o.x??340),h=opts.length*28+24,y=o.bot!==undefined?LH-h-o.bot:(o.y??250);
  push({draw(){win(x,y,w,h);opts.forEach((s,j)=>txt((j===i?'▶':'  ')+s,x+12,y+12+j*28))},
   key(k){if(k==='up')i=(i+opts.length-1)%opts.length;else if(k==='down')i=(i+1)%opts.length;
    else if(k==='a'){AUDIO.se('ok');pop();cb(i)}else if(k==='b'&&o.cancel!==false){pop();cb(-1)}},
   tap(lx,ly){const j=Math.floor((ly-(y+12))/28);if(lx>=x&&lx<=x+w&&j>=0&&j<opts.length){i=j;this.key('a')}},a:an})}
// fade transition
function fadeTo(mid,done){let t=0,did=false;push({draw(){const a=t<.3?t/.3:Math.max(0,1-(t-.3)/.3);g.fillStyle=`rgba(0,0,0,${a})`;g.fillRect(0,0,LW,LH)},
  update(dt){t+=dt;if(t>=.3&&!did){did=true;mid()}if(t>=.6){pop();done&&done()}},key(){},a:'n'})}
function warpTo(w){fadeTo(()=>{S.map=w[0];S.x=w[1];S.y=w[2];S.dir=w[3];S.mv=null;S.trail=[];AUDIO.play(M().bgm)},()=>{const vi={village2:1,village3:2}[w[0]];if(vi&&!S.flags['in'+vi]&&typeof entryTest==='function')entryTest(vi)})}
// ---- world ----
function decoKey(ch,x,y){const h=((x*73856093)^(y*19349663))>>>0,f=S.map==='field';
  if(ch==='T'&&S.map==='village3'){const r=h%10;return r<6?'fir'+(1+h%4):r<9?'tr'+(1+h%5):'dead'+(1+h%4)}
  if(ch==='T'){const r=h%10;
    if(f){if(r<4)return'tr'+(1+h%5);if(r<8)return'fir'+(1+h%4);if(r<9)return['cher1','cher2'][h%2];return'dead'+(1+h%4)}
    if(r<8)return'tr'+(1+h%5);if(r<9)return'fir'+(1+h%4);return['cher1','cher2'][h%2]}
  const L=f?['bush1','bush2','bush3','rock1','rock2','rock3','tuft1','tuft2']:['bush1','bush2','bush3','tuft1','tuft2','o_shrubb','o_shruba'];return L[h%L.length]}
function drawWorld(){
  g.fillStyle='#000';g.fillRect(0,0,LW,LH);const m=M();const VW=LW/(TS*WS),VH=LH/(TS*WS);
  let px=S.x,py=S.y;if(S.mv){px+=(S.mv.tx-S.x)*S.mv.t;py+=(S.mv.ty-S.y)*S.mv.t}
  let cx=px+.5-VW/2,cy=py+.5-VH/2;
  S.cam=[Math.round(cx*TS),Math.round(cy*TS)];g.save();g.scale(WS,WS);g.translate(-S.cam[0],-S.cam[1]);
  const x0=Math.max(0,Math.floor(cx)),x1=Math.min(m.w,Math.ceil(cx+VW)+1),y0=Math.max(0,Math.floor(cy)),y1=Math.min(m.h,Math.ceil(cy+VH)+1);
  const sil=(im,c,sx,sy,sw,sh)=>{const key=c+sx+','+sy;im._s=im._s||{};if(!im._s[key]){const cv=document.createElement('canvas');cv.width=sw;cv.height=sh;const q=cv.getContext('2d');q.drawImage(im,sx,sy,sw,sh,0,0,sw,sh);q.globalCompositeOperation='source-in';q.fillStyle=c;q.fillRect(0,0,sw,sh);im._s[key]=cv}return im._s[key]};
  const OFF=[[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[1,-1],[-1,1],[1,1]];
  const outl=(im,sx,sy,sw,sh,dx,dy,dw,dh,col)=>{if(col){const c=sil(im,col,sx,sy,sw,sh);for(const[ox,oy]of OFF)g.drawImage(c,0,0,sw,sh,dx+ox,dy+oy,dw,dh)}g.drawImage(im,sx,sy,sw,sh,dx,dy,dw,dh)};
  const spr=(k,x,y,col)=>{const im=IMGS[k];if(!im||!im.naturalWidth)return;const w=im.naturalWidth/2,h=im.naturalHeight/2;outl(im,0,0,im.naturalWidth,im.naturalHeight,x*TS+8-w/2,(y+1)*TS-h,w,h,col)};
  const ncol=n=>n.id==='boss'?null:n.id==='guard'?'#ff3030':(S.seen['n'+S.map+':'+n.x+','+n.y]?null:'#fff');
  const deco=[],DK={K:'o_crate',O:'o_barrel',X:'o_chest',x:'o_chesto',V:'i_town',H:'i_cave',h:'o_fh',v:'o_fv',p:'o_fp'};
  if(S.map==='field'||S.map.startsWith('village')){const ax0=Math.floor(cx),ax1=Math.ceil(cx+VW)+1,ay0=Math.floor(cy),ay1=Math.ceil(cy+VH)+1;
    for(let y=ay0;y<ay1;y++)for(let x=ax0;x<ax1;x++){if(x>=0&&y>=0&&x<m.w&&y<m.h)continue;g.drawImage(TILES['.'],x*TS,y*TS);
      const h=(((x*73856093)^(y*19349663))>>>0)%11;if(h<4){const k=decoKey('T',x,y);deco.push({y:y+.9,f:()=>spr(k,x,y)})}else if(h===4){const k=['bush1','bush2','tuft1','tuft2'][(x+y+99)&3];deco.push({y:y+.5,f:()=>spr(k,x,y)})}}}
  for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++){const ch=tileAt(S.map,x,y);g.drawImage((ch==='^'&&S.map==='field')?TILES['.']:(TILES[ch]||TILES['.']),x*TS,y*TS);
    if(S.map==='cave1'||S.map==='cave2'){const h=((x*73856093)^(y*19349663))>>>0;
      if(ch==='c'&&h%9===0)deco.push({y:y+.2,f:()=>spr(['pebb','tuft','pudd','mush','fung','flora','glowc'][h%7],x,y)});
      else if(ch==='W'&&h%6===0){const up=tileAt(S.map,x,y-1)==='W',k=(up?['stag','stac','crys','deadb','glowc','fung']:['stag','stac','glowc','fung'])[h%(up?6:4)];deco.push({y:y+.9,f:()=>spr(k,x,y)})}
      else if(ch==='<'||ch==='>'){const k=ch==='>'?'st_f':'st_a';deco.push({y:y+.1,f:()=>spr(k,x,y,'#fff')})}}
    if(ch==='^'&&S.map==='field'&&((x<16?x%2===0:x%2===1))&&y%2===1){const k=(y===1&&(x%4===0||x%4===1))||((x*5+y*3)%7===0)?'mt4':'mt1';deco.push({y:y+.5,f:()=>spr(k,x,y)})}
    if(ch==='T'||ch==='Z'){const k=decoKey(ch,x,y);deco.push({y:y+.9,f:()=>spr(k,x,y)})}
    else if(ch==='F')spr(['o_pink','o_purple','fl_w','fl_m','fl_b'][((x*7+y*3)*5>>2)%5],x,y);else if(DK[ch])spr(DK[ch],x,y,(ch==='X'||((ch==='O'||ch==='K')&&S.map.startsWith('village')&&!S.seen[S.map+x+','+y])||((ch==='V'||ch==='H')&&WARPS[S.map+':'+x+','+y]))?'#fff':null)}
  const ents=(BLD[S.map]||[]).map(b=>{const im=IMGS['b_'+b.k];return{y:b.y-.5,f:()=>{if(im.complete&&im.naturalWidth)g.drawImage(im,b.x*TS+8-im.naturalWidth/2,(b.y+1)*TS-im.naturalHeight)}}}).concat(deco).concat((NPCS[S.map]||[]).filter(n=>!n.gone).map(n=>({y:n.y,f:()=>{if(n.h){const ha=IMGS['hero_'+n.h];if(ha&&ha.naturalWidth){outl(ha,0,0,52,44,n.x*TS+8-13,(n.y+1)*TS-23,26,22,ncol(n));return}}const im=n.i&&IMGS[n.i];if(im&&im.naturalWidth){const w=im.naturalWidth/2,h=im.naturalHeight/2;outl(im,0,0,im.naturalWidth,im.naturalHeight,n.x*TS+8-w/2,(n.y+1)*TS-1-h,w,h,ncol(n))}else drawChar(g,n.x*TS,n.y*TS-2,SPR[n.s]||SPR.vill,0,0)}})));
  ents.push({y:py,f:()=>drawHero(px,py)});
  (S.comps||[]).forEach((c,k)=>{const tr=S.trail||[],a=tr[k]||tr[tr.length-1]||{x:S.x,y:S.y},b=k===0?{x:S.x,y:S.y}:(tr[k-1]||a),t=S.mv?Math.min(1,S.mv.t):0,fx=a.x+(b.x-a.x)*t,fy=a.y+(b.y-a.y)*t,ddx=b.x-a.x,ddy=b.y-a.y,dd=ddy>0?0:ddy<0?1:ddx<0?2:ddx>0?3:(a.d!==undefined?a.d:S.dir);ents.push({y:fy-.01*(k+1),f:()=>drawHeroCls(c,fx,fy,dd,!!S.mv&&(ddx||ddy))})});
  ents.sort((a,b)=>a.y-b.y).forEach(e=>e.f());
  {const box=(x,y,c)=>{g.beginPath();g.arc(x*TS+8,y*TS+8,1.6,0,7);g.fillStyle=c;g.fill()};
   for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++){const ch=tileAt(S.map,x,y);
     if(ch==='D'||(WARPS[S.map+':'+x+','+y]&&ch!=='.'&&ch!=='_'&&!'VH<>'.includes(ch)))box(x,y,'#fff')}
   for(const k in WARPS){if(k.indexOf(S.map+':')===0){const[x,y]=k.split(':')[1].split(',').map(Number);if(x>=x0&&x<x1&&y>=y0&&y<y1&&!'VH<>'.includes(tileAt(S.map,x,y)))box(x,y,'#fff')}}
  }
  g.restore();
  if(m.name){/* location tag */}
}
function drawHero(px,py){drawHeroCls(S.hero.cls||0,px,py,S.dir,!!S.mv)}
function drawHeroCls(cls,px,py,dir,moving){const im=heroImg(cls);
  if(!im||!(im.naturalWidth||im.width)){drawChar(g,Math.round(px*TS),Math.round(py*TS)-2,SPR.hero,dir,moving&&S.mv&&S.mv.t>.25&&S.mv.t<.75?1:0);return}
  const row=moving?(S.step?1:2):0,col=dir===0?0:dir===1?1:2,x=Math.round(px*TS+8-13),y=Math.round((py+1)*TS-23);
  if(dir===2){g.save();g.translate(x+26,y);g.scale(-1,1);g.drawImage(im,col*52,row*44,52,44,0,0,26,22);g.restore()}
  else g.drawImage(im,col*52,row*44,52,44,x,y,26,22)}
function startMove(k){const d={down:0,up:1,left:2,right:3}[k];S.dir=d;const tx=S.x+DIRV[d][0],ty=S.y+DIRV[d][1];
  if(M().open&&(tx<0||ty<0||tx>=M().w||ty>=M().h)){const sp={0:[5,6],1:[5,4],2:[4,5],3:[6,5]}[d];warpTo(['field',sp[0],sp[1],d]);return}
  const key=S.map+':'+tx+','+ty;const t=tileAt(S.map,tx,ty);
  if(!WARPS[key]&&key!=='field:5,5'&&(SOLID.has(t)||npcAt(tx,ty)||tx<0||ty<0||tx>=M().w||ty>=M().h))return;S.mv={tx,ty,t:0}}
function arrive(){const key=S.map+':'+S.x+','+S.y;
  const GT={'village:10,19':['gate',0],'village2:9,17':['v2',1],'village3:10,18':['v3',2]};
  if(GT[key]&&!S.flags[GT[key][0]]){S.y--;S.dir=1;S.path=null;guardCheck(GT[key][1]);return}
  const LK={'field:22,13':['v2','みちは ふかい もりに とざされている…\nミナむらの もんばんの テストに ごうかくしよう。'],'field:26,19':['v3','どうくつの いりぐちは かたく とざされている…\nすべての むらの もんばんの テストに\nごうかくしよう。']};
  if(LK[key]&&(!S.flags[LK[key][0]]||(key==='field:26,19'&&!(S.flags.gate&&S.flags.v2&&S.flags.v3)))){S.x-=DIRV[S.dir][0];S.y-=DIRV[S.dir][1];S.path=null;say(LK[key][1]);return}
  const w=WARPS[key];if(w){warpTo(w);return}
  if(key==='field:5,5'){const sp={0:[10,0],1:[10,19],2:[21,9],3:[0,9]}[S.dir];warpTo(['village',sp[0],sp[1],S.dir]);return}
  const m=M();if(!m.enc)return;S.sinceBattle++;
  if(S.sinceBattle>5&&Math.random()<.1){S.sinceBattle=0;
    let z=S.map==='cave1'?2:(Math.hypot(S.x-5,S.y-5)<9?0:1);
    const L=[['slime','slime','goblin'],['kobold','ghost','wisp','spider','goblin'],['mino','treant','ghost','spider']][z];
    startBattle(L[(Math.random()*L.length)|0])}}
const OBJ_SPOT=[];
const GEN_TX=['いい てんきね。\nむらの みんなも げんきを だしてほしいわ。','たびの とちゅうかい？\nこの むらは いい ところだよ。','わしは まいにち ここで\nむらを ながめておる。','おとなに なったら\nぼうけんしゃに なりたいの！','さいきん ガルムの うわさで\nもちきりじゃ。','あたらしい ことばを おぼえると\nせかいが ひろがるって いうわよ。','きょうも いちにち いい てんきだ。','どうぐやの やくそうは\nよく きくって ひょうばんだよ。'];
const GEN_SP=['v_woman','v_merch','v_elder','v_girl','v_scholar','v_youth'];
function rollVillage(seed){S.seed=seed;const r=rnd((seed*2654435761)>>>0||1);const sh=a=>{for(let i=a.length-1;i>0;i--){const j=(r()*(i+1))|0;[a[i],a[j]]=[a[j],a[i]]}return a};
  const base=genVillage().map(s=>s.split('')),H=base.length,W=base[0].length,fixed=new Set(['9,18','11,18','10,18','16,16']),ok=c=>'.SF_'.includes(c);
  const cand=[];for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++){if(base[y][x]!=='.'||fixed.has(x+','+y))continue;let f=0;for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]])if(ok(base[y+dy][x+dx]))f++;if(f>=3)cand.push([x,y])}
  let objs,np;
  for(let att=0;att<80;att++){sh(cand);const picked=[],take=n=>{const out=[];for(const c of cand){if(out.length>=n)break;if(picked.some(p=>Math.abs(p[0]-c[0])<=1&&Math.abs(p[1]-c[1])<=1))continue;picked.push(c);out.push(c)}return out};
    objs=take(4);np=take(9);
    const blk=new Set(objs.map(c=>c.join(',')).concat(np.map(c=>c.join(',')),['9,18','11,18','16,16']));
    const seen=new Set(['10,17']),q=[[10,17]];while(q.length){const[x,y]=q.shift();for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy,k=nx+','+ny;if(nx<0||ny<0||nx>=W||ny>=H||seen.has(k)||blk.has(k)||'NTZhvp'.includes(base[ny][nx]))continue;seen.add(k);q.push([nx,ny])}}
    const tg=objs.concat(np,[[16,16]]);if(tg.every(([x,y])=>[[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy])=>seen.has((x+dx)+','+(y+dy))))&&['5,9','16,9','5,17'].every(k=>seen.has(k)))break}
  OBJ_SPOT.length=0;objs.forEach(([x,y])=>{base[y][x]=r()<.5?'O':'K';OBJ_SPOT.push(x+','+y)});
  MAPS.village.rows=base.map(a=>a.join(''));
  const v=NPCS.village;v.length=0;const P=i=>({x:np[i][0],y:np[i][1]});
  v.push(Object.assign(P(0),{s:'vill',i:'v_scholar',w:0,t:'ここは ルミナむら。\nへいわな むらだったのに…\nガルムが きてから みんな ふあんがっておる。'}));
  v.push(Object.assign(P(1),{s:'girl',i:'v_girl',w:1,t:'ゆうしゃさま、きを つけて！\nどうくつの おくには とても つよい\nまおうが いるそうよ。'}));
  v.push(Object.assign(P(2),{s:'vill',i:'v_youth',w:2,t:'むらの そとの へいげんには\nスライムや ゴブリンが でるぞ。\nまずは そこで レベルを あげるんだ。'}));
  v.push({x:16,y:16,s:'vill',i:'v_smith',w:3,t:'ここは わしの かじやじゃ。\nそのうち いい ぶきを うってやろう。\nそれまでは どうぐやの ぶきで がまんせい。'});
  v.push({x:9,y:18,s:'vill',h:'sword',id:'guard'},{x:11,y:18,s:'vill',h:'sword',id:'guard'});
  v.push(Object.assign(P(7),{s:'vill',i:'v_chick',w:7,t:'コケッ コケッ！'}),Object.assign(P(8),{s:'vill',i:'v_chick',w:8,t:'コッコッコ…'}));
  const tx=sh(GEN_TX.slice()),spr=sh(GEN_SP.slice());for(let k=0;k<4;k++)v.push(Object.assign(P(3+k),{s:'vill',i:spr[k],w:9+k,t:tx[k]}));
  S.perm=S.perm||[];S.perm[0]=sh([...Array(17).keys()])}
const TOWN_OF={village:0,inn:0,shop:0,elder:0,village2:1,inn2:1,shop2:1,village3:2,inn3:2,shop3:2};
const townIdx=m=>Object.prototype.hasOwnProperty.call(TOWN_OF,m)?TOWN_OF[m]:-1;
const OBJS={village:OBJ_SPOT,village2:[],village3:[]};
const GEN_TX3=['もりの なかは しずかで いいわ。','きのこの シチューは この むらの めいぶつよ。','きを きる おとが きこえるじゃろう？','もりの おくには ふしぎな ひかりが あるらしい。'];
const TOWN={village2:{gen:()=>genVillage2(),gate:'9,17',guards:[[8,16],[10,16]],start:[9,16],appr:['4,9','13,9'],tx:['ここは ミナむら。\nたびびとが ひとやすみする じゅくばまちじゃ。','やどやで やすんで ゆっくり いきな。','この さきの もりへ いくなら もんばんの テストを うけるんだよ。']},
 village3:{gen:()=>genVillage3(),gate:'10,18',guards:[[9,17],[11,17]],start:[10,17],appr:['4,9','15,9'],tx:GEN_TX3}};
function rollTown(map,vi,seed){const cfg=TOWN[map],r=rnd((seed*2654435761)>>>0||1);const sh=a=>{for(let i=a.length-1;i>0;i--){const j=(r()*(i+1))|0;[a[i],a[j]]=[a[j],a[i]]}return a};
  const base=cfg.gen().map(s=>s.split('')),H=base.length,W=base[0].length,ok=c=>'.SF_'.includes(c),fixed=new Set([cfg.gate].concat(cfg.guards.map(g=>g.join(','))));
  const cand=[];for(let y=1;y<H-1;y++)for(let x=1;x<W-1;x++){if(base[y][x]!=='.'||fixed.has(x+','+y))continue;let f=0;for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]])if(ok(base[y+dy][x+dx]))f++;if(f>=3)cand.push([x,y])}
  let objs=[],np=[];
  for(let att=0;att<120;att++){const sp=att<60?1:0;sh(cand);const picked=[],take=n=>{const out=[];for(const c of cand){if(out.length>=n)break;if(sp&&picked.some(p=>Math.abs(p[0]-c[0])<=1&&Math.abs(p[1]-c[1])<=1))continue;picked.push(c);out.push(c)}return out};
    objs=take(6);np=take(9);if(objs.length<6||np.length<9)continue;
    const blk=new Set(objs.map(c=>c.join(',')).concat(np.map(c=>c.join(',')),[...fixed]));
    const seen=new Set([cfg.start.join(',')]),q=[cfg.start.slice()];while(q.length){const[x,y]=q.shift();for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy,k=nx+','+ny;if(nx<0||ny<0||nx>=W||ny>=H||seen.has(k)||blk.has(k)||'NTZhvp'.includes(base[ny][nx]))continue;seen.add(k);q.push([nx,ny])}}
    if(objs.concat(np).every(([x,y])=>[[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy])=>seen.has((x+dx)+','+(y+dy))))&&cfg.appr.every(k=>seen.has(k)))break}
  const L=OBJS[map];L.length=0;objs.forEach(([x,y])=>{base[y][x]=r()<.5?'O':'K';L.push(x+','+y)});
  MAPS[map].rows=base.map(a=>a.join(''));
  const v=NPCS[map];v.length=0;
  cfg.guards.forEach((g,i)=>v.push({x:g[0],y:g[1],s:'vill',h:'sword',id:'guard'}));
  const tx=sh(GEN_TX.concat(cfg.tx,cfg.tx)),spr=sh(GEN_SP.concat(GEN_SP));
  np.forEach((c,k)=>{const chick=k>=7;v.push({x:c[0],y:c[1],s:'vill',i:chick?'v_chick':spr[k],w:chick?(k<9?k-5:undefined):4+k,t:chick?(k%2?'コケッ コケッ！':'コッコッコ…'):tx[k]})});
  S.perm=S.perm||[];S.perm[vi]=sh([...Array(17).keys()])}
function rollAll(seed){rollVillage(seed);rollTown('village2',1,seed+11);rollTown('village3',2,seed+23)}
rollAll((Math.random()*1e9)|0);
function interact(){const [dx,dy]=DIRV[S.dir];let tx=S.x+dx,ty=S.y+dy,n=npcAt(tx,ty);
  if(!n&&tileAt(S.map,tx,ty)==='C'){n=npcAt(tx+dx,ty+dy)}
  if(n){talk(n);return}
  {const c=tileAt(S.map,tx,ty),L=OBJS[S.map];if(L&&(c==='O'||c==='K')){const i=L.indexOf(tx+','+ty);
    if(i>=0){S.seen[S.map+tx+','+ty]=1;const tp=teachPage({w:13+i});const nm=c==='O'?'たる':'はこ';
      say(tp?[S.hero.name+'は '+nm+'の なかを のぞいた。',nm+'の なかに ことばの かかれた メモが あった！',tp]:[S.hero.name+'は '+nm+'の なかを のぞいた。',nm+'の なかは からっぽだった。']);return}
    say(c==='O'?'からっぽの たるだ。':'からっぽの はこだ。');return}}
  if(tileAt(S.map,tx,ty)==='X'){const k=S.map+':'+tx+','+ty,l=LOOT[k];S.chests[k]=1;AUDIO.se('chest');
    if(l.gold){S.hero.gold+=l.gold;say(S.hero.name+'は たからばこを あけた！\n'+l.gold+'Gを てにいれた！')}
    else{S.items[l.item]+=l.n;say(S.hero.name+'は たからばこを あけた！\n'+ITM[l.item][0]+'を '+l.n+'こ てにいれた！')}}}
S.scenes.push({a:'n',draw(){drawWorld();if(S.started&&S.scenes.length===1&&typeof drawObjective==='function')drawObjective()},update(dt){
  if(S.scenes[S.scenes.length-1]!==this){S.path=null;return}
  if(S.mv){S.mv.t+=dt/.17;if(S.mv.t>=1){S.trail=S.trail||[];S.trail.unshift({x:S.x,y:S.y,d:S.dir});S.trail.length=Math.min(S.trail.length,4);S.x=S.mv.tx;S.y=S.mv.ty;S.mv=null;S.step^=1;arrive();if(S.scenes[S.scenes.length-1]!==this)return}}
  if(!S.mv){let h=false;for(const k of['up','down','left','right'])if(held.has(k)){S.path=null;startMove(k);h=true;break}
    if(!h&&S.path){if(S.path.length){const k=S.path.shift();startMove(k);if(!S.mv)S.path=null}
      else{const e=S.pathEnd;S.path=null;S.pathEnd=null;if(e){S.dir=e.face;if(e.act)interact()}}}}},
 key(k){if(S.mv)return;if(k==='a')interact();else if(k==='b')openMenu();else if(['up','down','left','right'].includes(k))startMove(k)}});
S.scenes[0].world=true;
