// ===== 5. battle =====
function startBattle(id,opt={}){
  const e=Object.assign({},ENEMIES[id]);e.mhp=e.hp;let turn=0,log=[],busy=false,shake=0,flash=0,eHit=0,T0=0,fx=[],pts=[],fl=[],eFlash=0,lunge=0,sshake=0;
  const whiteCache=new Map();const whiteOf=a=>{if(whiteCache.has(a))return whiteCache.get(a);const w=a.naturalWidth||a.width,h=a.naturalHeight||a.height,c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');x.drawImage(a,0,0);x.globalCompositeOperation='source-atop';x.fillStyle='#fff';x.fillRect(0,0,w,h);whiteCache.set(a,c);return c};
  const EC=()=>{const eh=Math.min(260,LH*.3);return[LW/2,LH/2+eh/2-eh*.5,LH/2+eh/2,eh]};
  const burst=(x,y,n,cols,sp,life)=>{for(let i=0;i<n;i++){const an=Math.random()*Math.PI*2,v=(.3+Math.random())*sp;pts.push({x,y,vx:Math.cos(an)*v,vy:Math.sin(an)*v-sp*.2,t:0,life:(life||.6)*(.6+Math.random()*.6),c:cols[(Math.random()*cols.length)|0],s:2+Math.random()*4})}};
  const floatTxt=(s,x,y,col,size)=>fl.push({s,x,y,col,size:size||34,t:0,life:1});
  const H=S.hero;H.hp=H.mhp;
  const B={log:[],
    a:'n',draw(){g.save();if(sshake>0)g.translate((Math.random()-.5)*12,(Math.random()-.5)*10);g.fillStyle='#000';g.fillRect(-20,-20,LW+40,LH+40);
      {const key=e.boss||S.map!=='field'?'bg_cave':'bg_field',bi=IMGS[key];
        if(bi&&bi.naturalWidth){const k=Math.max(LW/bi.naturalWidth,LH/bi.naturalHeight),w=bi.naturalWidth*k,h=bi.naturalHeight*k;g.imageSmoothingEnabled=false;g.drawImage(bi,(LW-w)/2,(LH-h)/2,w,h)}
        else{const gr=g.createLinearGradient(0,0,0,LH);gr.addColorStop(0,'#1a1830');gr.addColorStop(1,'#34344f');g.fillStyle=gr;g.fillRect(0,0,LW,LH)}}
      g.imageSmoothingEnabled=false;
      const eh=Math.min(260,LH*.3),ey=LH/2+eh/2,cx=LW/2;
      if(e.hp>0||eHit>0){const sx=shake>0?(Math.random()*8-4):0;g.globalAlpha=e.hp>0?1:Math.max(0,eHit);
        const a=MON_ART[e.art];if(a&&(a.naturalWidth||a.getContext)){const w0=a.naturalWidth||a.width,h0=a.naturalHeight||a.height,sc=Math.min(300/w0,eh/h0);
          const s2=1+lunge*.35+(e.hp<=0?(1-eHit)*.3:0),bob=e.hp>0?Math.sin(T0*2.2)*3:0,dw=w0*sc*s2,dh=h0*sc*s2;g.drawImage(a,cx-dw/2+sx,ey-dh+bob,dw,dh);if(eFlash>0){g.globalAlpha=Math.min(1,eFlash)*(e.hp>0?1:Math.max(0,eHit));g.drawImage(whiteOf(a),cx-dw/2+sx,ey-dh+bob,dw,dh)}}g.globalAlpha=1}
      if(flash>0){g.fillStyle=`rgba(255,40,40,${flash})`;g.fillRect(-20,-20,LW+40,LH+40)}
      drawFx(cx,ey,eh);
      // enemy status under the enemy
      {const bw=200,bx=cx-bw/2,by=ey+34;g.font='18px '+FONT;const nw=g.measureText(e.n).width;txt(e.n,cx-nw/2,ey+8,'#fff',18);
        g.fillStyle='#000';g.fillRect(bx-2,by-2,bw+4,14);g.fillStyle='#401010';g.fillRect(bx,by,bw,10);g.fillStyle=e.hp/e.mhp>.5?'#4ec24e':e.hp/e.mhp>.25?'#e0c040':'#e04040';g.fillRect(bx,by,Math.round(bw*Math.max(0,e.hp)/e.mhp),10)}
      // hero status (top-left) and log (top-right)
      win(10,10,150,100);txt(H.name+' Lv'+H.lv,22,20);txt('HP '+String(H.hp).padStart(3,' '),22,50);txt('MP '+String(H.mp).padStart(3,' '),22,78);
      {const lw=Math.min(LW-20,460),lx=(LW-lw)/2,ly=ey+54;win(lx,ly,lw,100);lines(B.log.slice(-3).join('\n'),lx+14,ly+10,28)}
      g.restore()},
    update(dt){T0+=dt;shake=Math.max(0,shake-dt);flash=Math.max(0,flash-dt*2);eFlash=Math.max(0,eFlash-dt*3.5);lunge=Math.max(0,lunge-dt*3.2);sshake=Math.max(0,sshake-dt);if(e.hp<=0)eHit=Math.max(0,eHit-dt*1.5);
    fx.forEach(f=>f.t+=dt);fx=fx.filter(f=>f.t<f.dur);pts.forEach(p=>{p.t+=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=260*dt});pts=pts.filter(p=>p.t<p.life);fl.forEach(f=>f.t+=dt*1.1);fl=fl.filter(f=>f.t<f.life)}};
  function drawFx(cx,ey,eh){const ccy=ey-eh*.5;g.save();
    fx.forEach(f=>{const pr=f.t/f.dur;if(f.k==='slash'){const strokes=f.crit?[[1,1],[-1,1]]:[[1,1]];strokes.forEach(([dx])=>{const x0=cx+dx*70,y0=ccy-eh*.42,x1=cx-dx*70,y1=ccy+eh*.42,p=Math.min(1,pr*1.6),fade=1-Math.max(0,(pr-.55)/.45);g.globalAlpha=fade;g.lineCap='round';g.shadowColor=f.crit?'#ffe066':'#9fd8ff';g.shadowBlur=18;g.strokeStyle='#fff';g.lineWidth=(f.crit?16:10)*(1-pr*.6)+2;g.beginPath();g.moveTo(x0,y0);g.lineTo(x0+(x1-x0)*p,y0+(y1-y0)*p);g.stroke()})}
      else if(f.k==='ring'){g.globalAlpha=1-pr;g.strokeStyle=f.c||'#ffe066';g.lineWidth=6*(1-pr)+1;g.beginPath();g.arc(cx,ccy,20+pr*eh*.6,0,Math.PI*2);g.stroke()}});
    g.restore();g.save();pts.forEach(p=>{g.globalAlpha=Math.max(0,1-p.t/p.life);g.fillStyle=p.c;g.fillRect(p.x-p.s/2,p.y-p.s/2,p.s,p.s)});g.restore();
    fl.forEach(f=>{const pr=f.t/f.life;g.save();g.globalAlpha=Math.min(1,(1-pr)*2);g.font='bold '+f.size+'px '+FONT;g.textBaseline='middle';const w=g.measureText(f.s).width,sc=pr<.15?1+(.15-pr)*4:1,x=f.x-w/2,y=f.y-pr*50;g.translate(f.x,y);g.scale(sc,sc);g.lineWidth=5;g.strokeStyle='#000';g.strokeText(f.s,-w/2,0);g.fillStyle=f.col;g.fillText(f.s,-w/2,0);g.restore()})}
  function msg(s){B.log.push(s)}
  function wait(ms,f){busy=true;setTimeout(()=>{busy=false;f&&f()},ms)}
  function enemyTurn(){
    if(e.hp<=0)return;turn++;let d,m;
    if(e.boss&&turn%3===0){d=Math.ceil(H.mhp/e.hits);msg(e.n+'は ほのおを はいた！');AUDIO.se('fire')}
    else if(e.spell&&Math.random()<.3){d=Math.ceil(H.mhp/e.hits);msg(e.n+'は やみのたまを はなった！');AUDIO.se('fire')}
    else{d=Math.ceil(H.mhp/e.hits);msg(e.n+'の こうげき！');AUDIO.se('hit')}
    if(d>0){H.hp=Math.max(0,H.hp-d);flash=.5;lunge=1;sshake=.3;floatTxt('-'+d,85,86,'#ff6b6b',34);burst(60,60,14,['#ff6b6b','#ffd0d0'],110,.5);msg(H.name+'は '+d+'の ダメージを うけた！')}
    if(H.hp<=0)wait(900,lose);else wait(750);
  }
  function playerDmg(base,spread){return Math.max(1,Math.round(base+(Math.random()*spread*2-spread)))}
  function hitEnemy(d,kind,after){e.hp=Math.max(0,e.hp-d);shake=.25;eHit=1;eFlash=1;sshake=kind==='crit'?.35:.15;const [ex,ecy,eyb,eh]=EC();
    if(kind==='fire'){burst(ex,ecy+eh*.3,40,['#ff6a00','#ffb300','#ffe066','#ff3d00'],150,.8);fx.push({k:'ring',t:0,dur:.5,c:'#ff9a3a'})}
    else{fx.push({k:'slash',t:0,dur:.3,crit:kind==='crit'});burst(ex,ecy,kind==='crit'?26:12,kind==='crit'?['#fff','#ffe066']:['#fff','#9fd8ff'],130,.45)}
    if(kind==='crit'){floatTxt('かいしん！',ex,ecy-eh*.45,'#ffe066',30);fx.push({k:'ring',t:0,dur:.45})}
    floatTxt(String(d),ex+(kind==='crit'?0:(Math.random()*40-20)),ecy-eh*.1,kind==='fire'?'#ffb347':kind==='crit'?'#ffe066':'#fff',kind==='crit'?44:36);
    if(e.hp<=0){burst(ex,ecy,50,['#fff','#ffe066','#ff8a8a','#9fd8ff'],220,1);msg(e.n+'を たおした！');wait(700,win_)}else wait(650)}
  function win_(){
    if(e.boss){pop();bossWon();return}
    const ex=e.exp,go=e.gold;H.exp+=ex;H.gold+=go;msg(ex+'ポイントの けいけんち！ '+go+'Gを かくとく！');AUDIO.se('win');
    let ups=[];while(H.exp>=need(H.lv)){H.exp-=need(H.lv);H.lv++;H.mhp+=7;H.mp+=2;H.mmp+=2;H.atk+=2;H.def+=2;H.hp=H.mhp;H.mp=H.mmp;ups.push('レベルが '+H.lv+' に あがった！')}
    if(H.lv>=2&&!S.flags.heal&&ups.length&&H.lv===2){S.flags.heal=1;ups.push('ホイミを おぼえた！')}
    if(H.lv>=3&&!S.flags.fire){S.flags.fire=1;ups.push('ファイアを おぼえた！')}
    H.hp=H.mhp;wait(1200,()=>{pop();if(ups.length){AUDIO.se('lvup');say(ups)}})}
  function lose(){pop();AUDIO.play(null);say(['ユウは ちからつきた…','めのまえが まっくらに なった…'],()=>{
    S.hero.gold=Math.floor(S.hero.gold/2);fadeTo(()=>{S.map='village';S.x=10;S.y=17;S.dir=0;H.hp=H.mhp;H.mp=H.mmp;AUDIO.play('town')},()=>say('おお ゆうしゃよ しんでしまうとは なにごとじゃ！\nおかねを はんぶん うしなったが\nなんとか いきかえった。'))})}
  function menu(){if(busy||H.hp<=0||e.hp<=0)return;
    choose(['たたかう','じゅもん','どうぐ','にげる'],i=>{
      if(i===0){quiz(pickWord(battlePool()),ok=>{msg(H.name+'の こうげき！');
        if(!ok){msg('しかし ことばが でてこない！');msg('こうげきは はずれた！');AUDIO.se('no');{const[ex,ecy,,eh]=EC();floatTxt('MISS',ex,ecy,'#c8c8d8',36)}wait(750,enemyTurn);return}
        AUDIO.se('hit');const crit=Math.random()<.08;let d=Math.ceil(e.mhp/e.need);if(crit){d*=2;msg('かいしんの いちげき！')}hitEnemy(d,crit?'crit':'hit')})}
      else if(i===1)spellMenu();
      else if(i===2)itemMenu();
      else if(i===3){if(e.boss){msg('にげられない！');wait(500,enemyTurn)}else if(Math.random()<.65){msg(H.name+'は にげだした！');AUDIO.se('run');wait(700,()=>pop())}else{msg('しかし まわりこまれて しまった！');wait(600,enemyTurn)}}
    },{x:10,bot:12,w:140,cancel:false,a:'n'})}
  function spellMenu(){const sp=[];if(S.flags.heal)sp.push('ホイミ 3');if(S.flags.fire)sp.push('ファイア 4');
    if(!sp.length){msg('まだ じゅもんを おぼえていない！');return}
    choose(sp,i=>{if(i<0)return;const name=sp[i].split(' ')[0],cost=name==='ホイミ'?3:4;
      if(H.mp<cost){msg('MPが たりない！');return}H.mp-=cost;
      if(name==='ホイミ'){const v=22+(Math.random()*6|0);H.hp=Math.min(H.mhp,H.hp+v);floatTxt('+'+v,85,86,'#7ee07e',34);burst(85,60,18,['#7ee07e','#c8ffc8'],90,.7);msg(H.name+'は ホイミを となえた！');msg('HPが '+v+' かいふくした！');AUDIO.se('heal');wait(700,enemyTurn)}
      else{quiz(pickWord(battlePool()),ok=>{msg(H.name+'は ファイアを となえた！');
        if(!ok){msg('ことばを まちがえて');msg('じゅもんが きえてしまった！');AUDIO.se('no');{const[ex,ecy]=EC();floatTxt('MISS',ex,ecy,'#c8c8d8',36)}wait(750,enemyTurn);return}
        AUDIO.se('fire');const d=Math.ceil(e.mhp/e.need)*2;hitEnemy(d,'fire')})}
    },{x:10,bot:12,w:170,a:'n'})}
  function itemMenu(){const o=[];if(S.items.herb)o.push('やくそう x'+S.items.herb);if(S.items.ether)o.push('せいすい x'+S.items.ether);
    if(!o.length){msg('どうぐを もっていない！');return}
    choose(o,i=>{if(i<0)return;const k=o[i].startsWith('やく')?'herb':'ether';S.items[k]--;
      if(k==='herb'){H.hp=Math.min(H.mhp,H.hp+30);floatTxt('+30',85,86,'#7ee07e',34);burst(85,60,14,['#7ee07e','#c8ffc8'],90,.7);msg('やくそうを つかった！ HPが かいふくした！')}else{H.mp=Math.min(H.mmp,H.mp+10);msg('せいすいを つかった！ MPが かいふくした！')}
      AUDIO.se('heal');wait(700,enemyTurn)},{x:10,bot:12,w:190,a:'n'})}
  // enemy-turn triggers menu again via observer
  const baseUpdate=B.update;let lastBusy=true;
  B.update=function(dt){baseUpdate(dt);const top=S.scenes[S.scenes.length-1];
    if(top===B&&!busy&&H.hp>0&&e.hp>0&&!B._pending){B._pending=1;setTimeout(()=>{B._pending=0;if(S.scenes[S.scenes.length-1]===B)menu()},120)}};
  B.key=()=>{};
  const first=()=>{AUDIO.play(e.boss?'boss':'battle');msg(e.boss?'まおうガルムが あらわれた！':e.n+'が あらわれた！');wait(700)};
  S.scenes.push({draw(){},update(dt){this.t=(this.t||0)+dt;g.fillStyle=`rgba(255,255,255,${Math.max(0,1-this.t*3)})`;if(this.t>.4){pop();push(B);first()}},key(){},
    draw2(){}});
  // battle intro flash
  S.scenes[S.scenes.length-1].draw=function(){drawWorld();const a=Math.sin(Math.min(1,(this.t||0)/.4)*Math.PI*6)>0?.8:0;g.fillStyle=`rgba(255,255,255,${a})`;g.fillRect(0,0,LW,LH)};S.scenes[S.scenes.length-1].a='n';
  AUDIO.se('enc');
}
function bossWon(){
  S.flags.boss=1;S.cleared[S.hero.cls]=1;const b=NPCS.cave2[0];b.gone=true;AUDIO.play(null);
  say(['ぐおおお…！ ばかな…！\nこの わたしが ……','まおうガルムは ひかりの なかに きえていった。','ガルム「…わたしは まおうでは ない。\nおまえが うみだした きょぞう だ…」','ガルム「『がいこくごは むずかしい』…\nそう おもいこんだ おまえの こころが\nむいしきの うちに わたしを つくったのだ。」','ガルム「だが おまえは ことばを まなび\nわたしを のりこえた。 …ゆけ、ユウ。」','ひかりの石が ユウの むねに とけていく…\nふしぎと こころが かるい。'],()=>{
    fadeTo(()=>{S.map='elder';S.x=3;S.y=4;S.dir=1;AUDIO.play('town')},()=>say(['ちょうろう「おお…！ もどったか、ユウ。\nまおうガルムは たおせたようじゃな。」','ちょうろう「…じゃが ガルムとは おぬしの こころが\nうんだ かげ。\n『がいこくごは むずかしい』という\nせんにゅうかんの かべ だったのじゃ。」','ちょうろう「して ユウよ。\nその かべを のりこえることは できたかな？」'],()=>
      choose(['はい、のりこえた！','まだ ちょっと ふあん…'],ci=>say([ci===1?'ちょうろう「それで よい。\nふあんが あるのは まなぼうと している しょうこじゃ。」':'ちょうろう「うむ！ みごとじゃ！」','ちょうろう「だが ことばの まなびに おわりは ない。\nもっと まなぶのだ！\nしれば しるほど せかいは ひろがるぞ。」'],()=>ending()),{x:120,y:170,w:272,cancel:false,a:'c'})))})}
function ending(){let t=0;AUDIO.play('town');metaClear(S.hero.cls);metaMerge();
  const go=()=>{if(t>3){pop();newHeroSelect()}};
  push({a:'c',draw(){g.fillStyle='#0b0e1f';g.fillRect(-1300,-1300,3200,3200);const a=Math.min(1,t/1.5);g.globalAlpha=a;
    txt('ルミナの勇者',160,130,'#f2c94c',32);txt('おわり',220,200,'#fff',24);txt('「むずかしい」の かべを のりこえた！',90,250,'#cde',16);txt('もっと まなぶのだ！',170,280,'#9fb0ff',18);
    if(t>3)txt('タップ／A: あたらしい なかまで もういちど',70,360,'#aab',16);g.globalAlpha=1},update(dt){t+=dt},key(k){if(k==='a')go()},tap(){go()}})}
