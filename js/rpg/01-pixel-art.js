// ===== 1. pixel art =====
const TS=16;
const cv=document.getElementById('c'), g=cv.getContext('2d'), wrapEl=document.getElementById('wrap');
let LW=512, LH=448, WS=2, RES=0; // logical canvas size follows the screen shape; WS = world zoom
let landMode=false; // true only on RPG play and the 一問一答 screens
function landOK(){try{if(PRACTICING)return true;if(!S.started)return false;return !S.scenes.some(s=>s.noland)}catch(e){return false}}
function resize(){const W0=wrapEl.clientWidth||512,H=wrapEl.clientHeight||448;landMode=landOK();
  const W=landMode?Math.min(W0,Math.round(H*1.5)):W0; // landscape: cap the play field at 3:2 so it is not too flat; the black bars hold the pad
  cv.style.width=W+'px';cv.style.marginLeft=Math.round((W0-W)/2)+'px';
  const a=H/W;
  if(a>=448/512){LW=512;LH=Math.min(1400,Math.round(512*a))}else{LH=448;LW=Math.min(1400,Math.round(448/a))}
  WS=(LW===512&&LH>800)?3:2;let coarse=false;try{coarse=matchMedia('(pointer:coarse)').matches}catch(e){}
  RES=coarse?Math.min(Math.round(292*LH/H),Math.max(0,LH-448)):0;cv.width=LW;cv.height=LH;g.imageSmoothingEnabled=false}
addEventListener('resize',resize);resize();
const isLand=()=>landMode&&LW/LH>1.3; // landscape layout (RPG / 一問一答 only)
// UI scenes are laid out in a 512x448 box: a=anchor of that box inside the canvas
function boxOff(a){const cx=(LW-512)/2;return a==='n'?[0,0]:a==='b'?[cx,LH-448-RES]:a==='t'?[cx,0]:[cx,(LH-448)/2]}
const mk=(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c};
const R=(x,c,a,b,w,h,col)=>{c.fillStyle=col;c.fillRect(a,b,w,h)};
function rnd(seed){let s=seed>>>0;return()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296}}
const TILES={};
function tile(ch,fn){const c=mk(TS,TS),x=c.getContext('2d');fn(x);TILES[ch]=c}
const grass=x=>{R(0,x,0,0,16,16,'#3f9b3f');const r=rnd(7);for(let i=0;i<14;i++){R(0,x,(r()*15)|0,(r()*15)|0,1,1,r()>.5?'#2f7d32':'#5cba52')}};
const cavef=x=>{R(0,x,0,0,16,16,'#4a4666');const r=rnd(11);for(let i=0;i<10;i++)R(0,x,(r()*14)|0,(r()*14)|0,2,1,'#3a3654')};
tile('.',grass);
tile('N',grass);
tile('F',grass);
tile('T',grass);tile('Z',grass);tile('h',grass);tile('v',grass);tile('p',grass);tile('K',grass);tile('O',grass);
tile('~',x=>{R(0,x,0,0,16,16,'#2a5fd0');R(0,x,2,4,5,1,'#6c9cf5');R(0,x,9,10,5,1,'#6c9cf5');R(0,x,5,13,4,1,'#1e4aa8')});
tile('^',x=>{R(0,x,0,0,16,16,'#6b5a45');R(0,x,6,1,4,3,'#8a7860');R(0,x,3,4,10,4,'#7d6a52');R(0,x,1,8,14,8,'#5a4a38');R(0,x,7,0,2,2,'#f4f4f4');R(0,x,5,2,6,1,'#dcdcdc')});
tile('_',x=>{R(0,x,0,0,16,16,'#c9a468');const r=rnd(3);for(let i=0;i<10;i++)R(0,x,(r()*15)|0,(r()*15)|0,1,1,'#a98648')});
tile('#',x=>{R(0,x,0,0,16,16,'#b9763e');for(let y=0;y<16;y+=4){R(0,x,0,y,16,1,'#8a5528');R(0,x,(y%8?4:10),y+1,1,3,'#8a5528')}});
tile('R',x=>{R(0,x,0,0,16,16,'#b83a3a');for(let y=0;y<16;y+=4)R(0,x,0,y+3,16,1,'#7e2222');R(0,x,0,0,16,1,'#d95c5c')});
tile('D',x=>{R(0,x,0,0,16,16,'#b9763e');R(0,x,3,2,10,14,'#5a3419');R(0,x,4,3,8,13,'#7a4a26');R(0,x,10,9,2,2,'#f2c94c')});
tile('f',x=>{R(0,x,0,0,16,16,'#a56e3c');for(let y=0;y<16;y+=4)R(0,x,0,y,16,1,'#80532a')});
tile('Y',x=>{R(0,x,0,0,16,16,'#8a4a30');for(let y=0;y<16;y+=4){R(0,x,0,y,16,1,'#5a2a1a');R(0,x,(y%8?4:10),y+1,1,3,'#5a2a1a')}});
tile('W',x=>{R(0,x,0,0,16,16,'#34344f');for(let y=0;y<16;y+=4){R(0,x,0,y,16,1,'#22223a');R(0,x,(y%8?3:11),y+1,1,3,'#22223a')}});
tile('c',cavef);
tile('>',x=>{cavef(x);R(0,x,2,2,12,12,'#1a1830');for(let i=0;i<4;i++)R(0,x,2+i*2,3+i*3,12-i*2,2,'#6a6690')});
tile('<',x=>{cavef(x);R(0,x,2,2,12,12,'#8a86b0');for(let i=0;i<4;i++)R(0,x,2,3+i*3,12-i*2,2,'#4a4666')});
tile('C',x=>{R(0,x,0,0,16,16,'#a56e3c');R(0,x,0,3,16,9,'#6b4423');R(0,x,0,3,16,2,'#8a5a30')});
tile('B',x=>{R(0,x,0,0,16,16,'#a56e3c');R(0,x,1,2,14,12,'#e8e8f0');R(0,x,1,2,14,4,'#d94a4a');R(0,x,1,2,3,12,'#fff')});
tile('X',cavef);
tile('x',cavef);
tile('V',grass);
tile('H',grass);
tile('S',x=>{R(0,x,0,0,16,16,'#9a9aa8');R(0,x,0,7,16,1,'#7a7a88');R(0,x,7,0,1,16,'#7a7a88')});
tile('b',x=>{R(0,x,0,0,16,16,'#4a4666');R(0,x,0,0,16,16,'#5a2a3a');R(0,x,2,2,12,12,'#7a3a4a')}); // boss carpet
const SOLID=new Set('T~^#RWYCBHVXNxZKOhvp'.split('')); 
// characters: drawn procedurally. dir 0=down 1=up 2=left 3=right
function drawChar(c,px,py,o,dir,step){
  const sk='#f3c9a0',{hair,cloth,cape}=o; const bob=step?1:0;
  R(0,c,px+4,py+13,8,2,'#0004');
  if(o.cape&&dir!==0)R(0,c,px+3,py+6+bob,10,8,cape);
  R(0,c,px+4,py+7+bob,8,6,cloth);
  R(0,c,px+4+(step&&dir<2?1:0),py+13,3,3-bob,'#3a2a1a');R(0,c,px+9-(step&&dir<2?1:0),py+13,3,3-bob,'#3a2a1a');
  R(0,c,px+4,py+1+bob,8,7,sk);
  R(0,c,px+3,py+bob,10,4,hair);
  if(dir===0){R(0,c,px+5,py+5+bob,1,2,'#222');R(0,c,px+10,py+5+bob,1,2,'#222')}
  else if(dir===1){R(0,c,px+4,py+3+bob,8,5,hair)}
  else{R(0,c,px+(dir===2?4:11),py+5+bob,1,2,'#222');R(0,c,px+(dir===2?9:3),py+3+bob,4,4,hair)}
  if(o.cape&&dir===0){R(0,c,px+3,py+8+bob,2,5,cape);R(0,c,px+11,py+8+bob,2,5,cape)}
  if(o.sword)R(0,c,px+(dir===3?3:12),py+8+bob,1,6,'#e0e8f0');
  if(o.beard)R(0,c,px+5,py+7+bob,6,3,'#eee');
  if(o.hat)R(0,c,px+2,py-1+bob,12,3,o.hat);
}
const SPR={
 hero:{hair:'#c0482a',cloth:'#3a6bd9',cape:'#c0282a',sword:1},
 vill:{hair:'#5a3a1a',cloth:'#6aa84f'},girl:{hair:'#e2a04a',cloth:'#d96aa0'},
 elder:{hair:'#ddd',cloth:'#8a5ad0',beard:1},shop:{hair:'#333',cloth:'#d9a03a',hat:'#d9a03a'},
 inn:{hair:'#7a4a2a',cloth:'#e8e8e8'},king:{hair:'#eee',cloth:'#b83a3a',cape:'#f2c94c',beard:1,hat:'#f2c94c'},
 boss:{hair:'#111',cloth:'#4a1a5a',cape:'#2a0a3a',hat:'#7a1a1a'}
};
