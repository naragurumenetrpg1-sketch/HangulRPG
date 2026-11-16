// ===== 8. main loop =====
let last=performance.now();
function frame(now){const dt=Math.min(.05,(now-last)/1000);last=now;
  const top=S.scenes[S.scenes.length-1];if(top&&top.update)top.update(dt);
  g.imageSmoothingEnabled=false;S.scenes.forEach(s=>{const o=boxOff(s.a||'c');g.save();g.translate(o[0],o[1]);s.draw&&s.draw();g.restore()});requestAnimationFrame(frame)}
function boot(){title();home();requestAnimationFrame(frame)}
(document.fonts&&document.fonts.load?Promise.race([Promise.all([document.fonts.load('16px DotGothic16','あ'),document.fonts.load('500 16px "Noto Sans KR"','한국어')]),new Promise(r=>setTimeout(r,1500))]):Promise.resolve()).then(boot,boot);

// ===== 9. touch: swipe to move, tap to walk =====
const passable=(x,y,goal)=>{const m=M();if(x<0||y<0||x>=m.w||y>=m.h)return false;const key=S.map+':'+x+','+y;
  if(WARPS[key]||key==='field:5,5')return !!goal;return !SOLID.has(tileAt(S.map,x,y))&&!npcAt(x,y)};
function findPath(sx,sy,gx,gy){const q=[[sx,sy]],prev={},k=(x,y)=>x+','+y,D=[['down',0,1],['up',0,-1],['left',-1,0],['right',1,0]];prev[k(sx,sy)]=null;
  while(q.length){const[x,y]=q.shift();if(x===gx&&y===gy){const out=[];let c=k(x,y);while(prev[c]){out.unshift(prev[c][0]);c=prev[c][1]}return out}
    for(const[n,dx,dy]of D){const nx=x+dx,ny=y+dy,kk=k(nx,ny);if(kk in prev||!passable(nx,ny,nx===gx&&ny===gy))continue;prev[kk]=[n,k(x,y)];q.push([nx,ny])}}return null}
function tapWorld(tx,ty){const m=M();if(S.mv||tx<0||ty<0||tx>=m.w||ty>=m.h)return;
  if(tx===S.x&&ty===S.y){interact();return}
  if(passable(tx,ty,true)){const p=findPath(S.x,S.y,tx,ty);if(p){S.path=p;S.pathEnd=null}return}
  let best=null;[[0,1],[1,-1],[2,-1],[3,1]].forEach(()=>{});
  for(const[d,dx,dy]of[[0,0,1],[1,0,-1],[2,-1,0],[3,1,0]]){
    let sx=tx-dx,sy=ty-dy;if(!passable(sx,sy)&&tileAt(S.map,sx,sy)==='C'){sx-=dx;sy-=dy}
    if(!passable(sx,sy))continue;const p=(sx===S.x&&sy===S.y)?[]:findPath(S.x,S.y,sx,sy);if(p&&(!best||p.length<best.p.length))best={p,d}}
  if(best){S.path=best.p;S.pathEnd={face:best.d,act:true}}}
let ptr=null;
function logical(e){const r=cv.getBoundingClientRect();return[(e.clientX-r.left)/r.width*LW,(e.clientY-r.top)/r.height*LH]}
const crossEl=document.getElementById('cross');
function crossCenter(){const r=crossEl.getBoundingClientRect();return[r.left+r.width/2,r.top+r.height/2,r.width/2+14]}
const knobEl=document.getElementById('knob');
function setCrossDir(d,mag){crossEl.querySelectorAll('[data-d]').forEach(i=>i.classList.toggle('on',i.dataset.d===d));crossEl.classList.toggle('act',!!d);
  const m=Math.min(mag||0,46),o={up:[0,-m],down:[0,m],left:[-m,0],right:[m,0]}[d]||[0,0];knobEl.style.transform=`translate(${o[0]}px,${o[1]}px)`}
let crossTimer=null;
wrapEl.addEventListener('pointerdown',e=>{AUDIO.init();const[cx,cy,cr]=crossCenter();const inCross=S.started&&!PRACTICING&&!(S.scenes[S.scenes.length-1]||{}).nopad&&Math.hypot(e.clientX-cx,e.clientY-cy)<=cr;
  ptr={x0:e.clientX,y0:e.clientY,t0:performance.now(),moved:false,dir:null,sx:e.clientX,sy:e.clientY,cross:inCross};try{wrapEl.setPointerCapture(e.pointerId)}catch(_){}});
wrapEl.addEventListener('pointermove',e=>{if(!ptr)return;
  if(ptr.cross){const[cx,cy]=crossCenter(),dx=e.clientX-cx,dy=e.clientY-cy;let d=null;
    if(Math.hypot(dx,dy)>16){d=Math.abs(dx)>Math.abs(dy)?(dx>0?'right':'left'):(dy>0?'down':'up')}
    if(Math.hypot(e.clientX-ptr.x0,e.clientY-ptr.y0)>10){ptr.moved=true;S.path=null}
    setCrossDir(d,Math.hypot(dx,dy));
    if(d!==ptr.dir){if(ptr.dir)held.delete(ptr.dir);clearInterval(crossTimer);ptr.dir=d;
      if(d){held.add(d);press(d);if(S.scenes[S.scenes.length-1]!==S.scenes[0])crossTimer=setInterval(()=>press(d),230)}}
    return}
const dx=e.clientX-ptr.x0,dy=e.clientY-ptr.y0,dist=Math.hypot(dx,dy);
  if(!ptr.moved&&dist>16){ptr.moved=true;S.path=null}if(!ptr.moved)return;
  const top=S.scenes[S.scenes.length-1],d=Math.abs(dx)>Math.abs(dy)?(dx>0?'right':'left'):(dy>0?'down':'up');
  if(top===S.scenes[0]){ if(ptr.dir!==d){if(ptr.dir)held.delete(ptr.dir);held.add(d);ptr.dir=d;press(d)}
    if(dist>70){ptr.x0=e.clientX-dx/dist*40;ptr.y0=e.clientY-dy/dist*40} }
  else if(!PRACTICING){const sx=e.clientX-ptr.sx,sy=e.clientY-ptr.sy;if(Math.hypot(sx,sy)>34){press(Math.abs(sx)>Math.abs(sy)?(sx>0?'right':'left'):(sy>0?'down':'up'));ptr.sx=e.clientX;ptr.sy=e.clientY}}});
function endPtr(e,cancel){if(!ptr)return;if(ptr.dir)held.delete(ptr.dir);clearInterval(crossTimer);setCrossDir(null);const p=ptr;ptr=null;
  if(p.cross){if(!cancel&&!p.moved&&performance.now()-p.t0<400){const t=S.scenes[S.scenes.length-1];if(t===S.scenes[0])interact();else press('a')}return}if(cancel||p.moved||performance.now()-p.t0>400)return;
  const top=S.scenes[S.scenes.length-1];let[lx,ly]=logical(e);
  if(top===S.scenes[0]){tapWorld(Math.floor((lx/WS+S.cam[0])/TS),Math.floor((ly/WS+S.cam[1])/TS))}
  else{const o=boxOff(top.a||'c');lx-=o[0];ly-=o[1];if(top.tap)top.tap(lx,ly);else press('a')}}
wrapEl.addEventListener('pointerup',e=>endPtr(e,false));wrapEl.addEventListener('pointercancel',e=>endPtr(e,true));
wrapEl.addEventListener('contextmenu',e=>e.preventDefault());
