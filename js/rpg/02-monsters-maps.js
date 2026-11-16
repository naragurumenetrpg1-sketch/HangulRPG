// ===== 2. monsters =====
const MON_ART={};
function mon(name,fn){const c=mk(48,48),x=c.getContext('2d');fn(x);MON_ART[name]=c}
const eye=(x,a,b)=>{R(0,x,a,b,4,4,'#fff');R(0,x,a+1,b+1,2,3,'#111')};
mon('slime',x=>{R(0,x,8,26,32,16,'#3a8fe8');R(0,x,12,20,24,8,'#3a8fe8');R(0,x,18,14,12,8,'#3a8fe8');R(0,x,20,16,4,4,'#9fd0ff');R(0,x,6,38,36,4,'#2a6ac0');eye(x,16,28);eye(x,28,28);R(0,x,20,36,8,2,'#123')});
mon('bat',x=>{R(0,x,18,18,12,14,'#6a4ac0');R(0,x,2,12,16,8,'#4a2a90');R(0,x,30,12,16,8,'#4a2a90');R(0,x,6,20,12,6,'#4a2a90');R(0,x,30,20,12,6,'#4a2a90');R(0,x,18,12,4,6,'#6a4ac0');R(0,x,26,12,4,6,'#6a4ac0');R(0,x,20,22,3,3,'#ff4');R(0,x,26,22,3,3,'#ff4');R(0,x,22,28,4,3,'#fff')});
mon('wolf',x=>{R(0,x,6,22,30,14,'#7a7a88');R(0,x,30,14,14,14,'#8a8a98');R(0,x,30,10,4,6,'#6a6a78');R(0,x,40,10,4,6,'#6a6a78');R(0,x,40,22,6,4,'#5a5a68');R(0,x,36,18,3,3,'#f44');R(0,x,8,34,5,10,'#6a6a78');R(0,x,28,34,5,10,'#6a6a78');R(0,x,2,18,6,6,'#7a7a88');R(0,x,41,25,3,3,'#fff')});
mon('ghost',x=>{R(0,x,12,8,24,32,'#dfe8ff');R(0,x,16,4,16,6,'#dfe8ff');for(let i=0;i<4;i++)R(0,x,12+i*6,40,6,i%2?4:8,'#dfe8ff');R(0,x,18,18,5,7,'#223');R(0,x,28,18,5,7,'#223');R(0,x,22,30,6,4,'#223');R(0,x,6,22,6,10,'#c0ccf0');R(0,x,36,22,6,10,'#c0ccf0')});
mon('skel',x=>{R(0,x,16,4,16,14,'#e8e4d0');R(0,x,18,10,4,4,'#111');R(0,x,26,10,4,4,'#111');R(0,x,20,16,8,2,'#111');R(0,x,18,20,12,16,'#e8e4d0');for(let i=0;i<3;i++)R(0,x,18,22+i*4,12,2,'#111');R(0,x,8,20,8,3,'#e8e4d0');R(0,x,32,20,8,3,'#e8e4d0');R(0,x,34,6,3,22,'#aab');R(0,x,18,36,5,10,'#e8e4d0');R(0,x,26,36,5,10,'#e8e4d0')});
mon('boss',x=>{R(0,x,10,18,28,26,'#5a1a6a');R(0,x,14,6,20,16,'#7a2a8a');R(0,x,10,2,5,10,'#e8d0a0');R(0,x,33,2,5,10,'#e8d0a0');R(0,x,18,12,4,4,'#ff3030');R(0,x,26,12,4,4,'#ff3030');R(0,x,20,18,8,3,'#111');R(0,x,0,16,10,14,'#3a0a4a');R(0,x,38,16,10,14,'#3a0a4a');R(0,x,14,28,20,3,'#f2c94c');R(0,x,12,44,8,4,'#2a0a3a');R(0,x,28,44,8,4,'#2a0a3a')});
const MA=n=>IMGS['m_'+n];
Object.assign(MON_ART,{slime:MA('slime'),goblin:MA('goblin'),kobold:MA('kobold'),mino:MA('mino'),ghost:MA('ghost'),treant:MA('treant'),spider:MA('spider'),wisp:MA('wisp')});
const ENEMIES={
 slime:{n:'スライム',hits:3,need:2,art:'slime',hp:9,atk:6,def:1,exp:3,gold:4},
 goblin:{n:'ゴブリン',hits:3,need:3,art:'goblin',hp:13,atk:8,def:2,exp:5,gold:6},
 kobold:{n:'コボルト',hits:3,need:4,art:'kobold',hp:24,atk:13,def:4,exp:12,gold:10},
 ghost:{n:'ゴースト',hits:3,need:4,art:'ghost',hp:22,atk:12,def:3,exp:13,gold:11,spell:1},
 wisp:{n:'おにび',hits:3,need:4,art:'wisp',hp:20,atk:11,def:2,exp:12,gold:10,spell:1},
 spider:{n:'どくぐも',hits:3,need:4,art:'spider',hp:28,atk:14,def:4,exp:14,gold:12},
 mino:{n:'ミノタウロス',hits:3,need:5,art:'mino',hp:44,atk:19,def:7,exp:26,gold:20},
 treant:{n:'こぼくのせい',hits:3,need:5,art:'treant',hp:40,atk:17,def:8,exp:24,gold:18},
 boss:{n:'まおうガルム',hits:3,need:10,art:'boss',hp:130,atk:24,def:9,exp:0,gold:0,boss:1}
};
// ===== 3. maps =====
function genField(){
  const W=32,H=26,r=rnd(42),t=[];
  for(let y=0;y<H;y++){const row=[];for(let x=0;x<W;x++){const e=x<2||y<2||x>=W-2||y>=H-2;row.push(e?'^':r()<.11?'T':r()<.03?'F':r()<.025?'Z':'.')}t.push(row)}
  const dst=(x,y,cx,cy,rx,ry)=>((x-cx)/rx)**2+((y-cy)/ry)**2<=1;
  for(let y=2;y<H-2;y++)for(let x=2;x<W-2;x++){if(dst(x,y,12,16,4.5,3.2))t[y][x]='~';if(dst(x,y,20,5,3.5,3))t[y][x]='^'}
  const path=(x1,y1,x2,y2)=>{let x=x1,y=y1;while(x!==x2){t[y][x]='_';x+=Math.sign(x2-x)}while(y!==y2){t[y][x]='_';y+=Math.sign(y2-y)}t[y][x]='_'};
  path(5,6,5,9);path(5,9,26,9);path(26,9,26,18);
  for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){if(t[5+dy][5+dx]!=='_')t[5+dy][5+dx]='.';if(t[19+dy][26+dx]!=='_')t[19+dy][26+dx]='.'}
  for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){if(t[7+dy][14+dx]!=='_')t[7+dy][14+dx]='.'}
  t[5][5]='V';t[19][26]='H';t[7][14]='V';t[8][14]='_';
  for(let y=10;y<=17;y++)for(let x=17;x<=25;x++){if(t[y][x]==='.'&&r()<.38)t[y][x]='T'}
  for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){if(t[13+dy][22+dx]!=='_')t[13+dy][22+dx]='.'}
  for(let x=23;x<=26;x++)t[13][x]='_';t[13][22]='V';
  return t.map(r=>r.join(''));
}
function genVillage(){const W=22,H=20,r=rnd(9),t=[];
  for(let y=0;y<H;y++){const row=[];for(let x=0;x<W;x++)row.push(r()<.04?'F':'.');t.push(row)}
  const bld=(dx,dy,top,d)=>{for(let y=dy-top;y<=dy;y++)for(let x=dx-2;x<=dx+2;x++)t[y][x]='N';if(d)t[dy][dx]='D'};
  bld(5,8,6,1);bld(16,8,6,1);bld(5,16,6,1);bld(16,15,3,0);
  for(let x=1;x<W-1;x++)t[9][x]='S';for(let y=1;y<H;y++)t[y][10]='S';for(let x=5;x<10;x++)t[17][x]='_';
  t[13][13]='F';t[14][4]='F';
  for(const[x,y]of[[1,1],[20,1],[1,17],[20,17],[19,12],[2,5]])t[y][x]='T';for(const[x,y]of[[3,1],[17,1],[12,15],[7,18]])t[y][x]='Z';
  for(const x of[8,9,11,12])t[3][x]='h';t[4][8]='p';t[4][12]='p';
  // fence all around; the gate is the single tile at the bottom (x 10)
  for(let x=0;x<W;x++){t[0][x]='h';if(x!==10)t[H-1][x]='h'}
  for(let y=1;y<H-1;y++){t[y][0]='v';t[y][W-1]='v'}
  for(const[x,y]of[[0,0],[W-1,0],[0,H-1],[W-1,H-1],[9,H-1],[11,H-1]])t[y][x]='p';
  return t.map(r=>r.join(''));}
function genVillage2(){const W=18,H=18,r=rnd(21),t=[];
  for(let y=0;y<H;y++){const row=[];for(let x=0;x<W;x++)row.push(r()<.04?'F':'.');t.push(row)}
  const bld=(dx,dy,top)=>{for(let y=dy-top;y<=dy;y++)for(let x=dx-2;x<=dx+2;x++)t[y][x]='N';t[dy][dx]='D'};
  bld(4,8,6);bld(13,8,6);
  for(let x=1;x<W-1;x++)t[9][x]='S';for(let y=1;y<H;y++)t[y][9]='S';
  t[14][5]='F';t[14][12]='F';
  for(const[x,y]of[[1,1],[16,1],[1,15],[16,15],[7,14]])t[y][x]='T';for(const[x,y]of[[8,2],[10,2],[14,13],[4,13]])t[y][x]='Z';
  for(let x=0;x<W;x++){t[0][x]='h';if(x!==9)t[H-1][x]='h'}
  for(let y=1;y<H-1;y++){t[y][0]='v';t[y][W-1]='v'}
  for(const[x,y]of[[0,0],[W-1,0],[0,H-1],[W-1,H-1],[8,H-1],[10,H-1]])t[y][x]='p';
  return t.map(r=>r.join(''));}
function genVillage3(){const W=20,H=19,r=rnd(33),t=[];
  for(let y=0;y<H;y++){const row=[];for(let x=0;x<W;x++)row.push(r()<.03?'F':r()<.17?'T':'.');t.push(row)}
  const bld=(dx,dy,top)=>{for(let y=dy-top;y<=dy;y++)for(let x=dx-2;x<=dx+2;x++)t[y][x]='N';t[dy][dx]='D'};
  bld(4,8,6);bld(15,8,6);
  for(let x=1;x<W-1;x++)t[9][x]='S';for(let y=1;y<H;y++)t[y][10]='S';
  for(const[x,y]of[[9,17],[11,17],[9,16],[11,16],[9,10],[11,10],[4,9],[15,9],[3,9],[5,9],[14,9],[16,9],[4,10],[15,10]])if(t[y][x]==='T')t[y][x]='.';
  for(let x=0;x<W;x++){t[0][x]='h';if(x!==10)t[H-1][x]='h'}
  for(let y=1;y<H-1;y++){t[y][0]='v';t[y][W-1]='v'}
  for(const[x,y]of[[0,0],[W-1,0],[0,H-1],[W-1,H-1],[9,H-1],[11,H-1]])t[y][x]='p';
  return t.map(r=>r.join(''));}
const MAPS={
 field:{name:'ルミナ平原',rows:genField(),enc:1,bgm:'field'},
 village:{name:'ルミナ村',bgm:'town',rows:genVillage()},
 village2:{name:'ミナむら',bgm:'town',rows:genVillage2()},
 inn2:{name:'やどや',bgm:'town',rows:['WWWWWWWWWW','WfffffffBW','WffffffffW','WfCCCCfffW','WffffffffW','WffffffffW','WffffffffW','WWWWDWWWWW']},
 shop2:{name:'どうぐや',bgm:'town',rows:['WWWWWWWWWW','WffffffffW','WffffffffW','WfCCCCfffW','WffffffffW','WffffffffW','WffffffffW','WWWWDWWWWW']},
 village3:{name:'モリむら',bgm:'town',rows:genVillage3()},
 inn3:{name:'やどや',bgm:'town',rows:['WWWWWWWWWW','WfffffffBW','WffffffffW','WfCCCCfffW','WffffffffW','WffffffffW','WffffffffW','WWWWDWWWWW']},
 shop3:{name:'どうぐや',bgm:'town',rows:['WWWWWWWWWW','WffffffffW','WffffffffW','WfCCCCfffW','WffffffffW','WffffffffW','WffffffffW','WWWWDWWWWW']},
 inn:{name:'やどや',bgm:'town',rows:['WWWWWWWWWW','WfffffffBW','WffffffffW','WfCCCCfffW','WffffffffW','WffffffffW','WffffffffW','WWWWDWWWWW']},
 shop:{name:'どうぐや',bgm:'town',rows:['WWWWWWWWWW','WffffffffW','WffffffffW','WfCCCCfffW','WffffffffW','WffffffffW','WffffffffW','WWWWDWWWWW']},
 elder:{name:'ちょうろうの いえ',bgm:'town',rows:['WWWWWWWW','WffffffW','WffffffW','WffffffW','WffffffW','WffffffW','WWWDWWWW']},
 cave1:{name:'ガルムのどうくつ B1',enc:1,bgm:'cave',rows:[
 'WWWWWWWWWWWWWWWWWWWW','W<ccccccWccccccccccW','WcccccccWcccWWWWcccW','WcccWWWWWcccWccccccW','WcccccccccccWcccWWWW',
 'WWWWWWWccWWWWcccccXW','WWWWWWWccWWWWWWWWWWW','W'+'c'.repeat(18)+'W','WcccWWWccccccWWWcccW','WcccccccccccccccXccW',
 'WcccWWWccccccWWWcccW','W'+'c'.repeat(16)+'>cW','WWWWWWWWWWWWWWWWWWWW']},
 cave2:{name:'ガルムのどうくつ B2',bgm:'boss',rows:[
 'WWWWWWWWWWWWWW','WXcccbbbbcccXW','WccccbbbbccccW','WcccccbbcccccW','WcccccbbcccccW','WcccccbbcccccW','WcccccbbcccccW','WcccccbbcccccW','WccccccccccccW','WccccccccccccW','Wcccccc<ccccW','WWWWWWWWWWWWWW']}
};
for(const k in MAPS){const m=MAPS[k];m.h=m.rows.length;m.w=Math.max(...m.rows.map(r=>r.length));m.rows=m.rows.map(r=>r.padEnd(m.w,'W'))}

for(const k of['inn','shop','elder','inn2','shop2','inn3','shop3'])MAPS[k].rows=MAPS[k].rows.map(r=>r.replace(/W/g,'Y'));
function applyTex(){[['~','t_water',null],['S','t_cobble',null],['_','t_dirt',null],['f','t_wood',null],['Y','t_brick',null],['W','t_rock','rgba(20,20,70,.45)']].forEach(([ch,key,ov])=>{const im=IMGS[key];if(!im||!im.naturalWidth)return;
  const c=mk(TS,TS),x=c.getContext('2d');x.drawImage(im,0,0);if(ov){x.fillStyle=ov;x.fillRect(0,0,TS,TS)}TILES[ch]=c})}
for(const k in IMGS)if(k.startsWith('t_')){IMGS[k].onload=applyTex}applyTex();
