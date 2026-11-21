// ===== 6a. settings (difficulty, volume, text speed/size, effects) and the first-time guide =====
const CFG_KEY='lumina-settings';
const CFG=Object.assign({easy:false,vol:4,speed:1,fsize:1,fx:true},(()=>{try{return JSON.parse(localStorage.getItem(CFG_KEY))||{}}catch(e){return{}}})());
const cfgSave=()=>{try{localStorage.setItem(CFG_KEY,JSON.stringify(CFG))}catch(e){}};
const VOLS=[0,.15,.35,.55,.7,.9],SPEEDS=[22,45,90,1e6],FSIZES=[16,18,21];
const applyVol=()=>{try{AUDIO.setVol(VOLS[CFG.vol]==null?.7:VOLS[CFG.vol])}catch(e){}};

function settingsScene(){let i=0;
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const rows=[
    {l:'むずかしさ',get:()=>CFG.easy?'やさしい':'ふつう',chg:()=>{CFG.easy=!CFG.easy},
     hint:()=>CFG.easy?'まちがえても たいりょくが へらないよ。\nHPの ひょうじも きえるよ。':'まちがえると てきの こうげきで\nたいりょくが へるよ。'},
    {l:'おんりょう',get:()=>'■'.repeat(CFG.vol)+'□'.repeat(5-CFG.vol),chg:d=>{CFG.vol=clamp(CFG.vol+d,0,5);applyVol();AUDIO.se('ok')},hint:()=>'おとの おおきさを かえるよ。'},
    {l:'もじの はやさ',get:()=>['ゆっくり','ふつう','はやい','すぐ'][CFG.speed],chg:d=>{CFG.speed=(CFG.speed+d+4)%4},hint:()=>'かいわの もじが でる はやさ。'},
    {l:'もじの おおきさ',get:()=>['ちいさい','ふつう','おおきい'][CFG.fsize],chg:d=>{CFG.fsize=(CFG.fsize+d+3)%3},sample:true,hint:()=>'かいわと バトルの もじの おおきさ。'},
    canSpeak()?{l:'はつおん（じどう）',get:()=>voiceOn()?'ON':'OFF',chg:()=>{setVoice(!voiceOn());if(voiceOn())speakKo('안녕하세요')},hint:()=>'こたえたあと かんこくごを\nよみあげるよ。'}:null,
    {l:'まちの えんしゅつ',get:()=>CFG.fx?'ON':'OFF',chg:()=>{CFG.fx=!CFG.fx},hint:()=>'かげ・ひかり・ランタン・たいまつ・\nひるから よるへの うつりかわり。\nうごきが おもいときは OFF にしてね。'},
    {l:'あそびかた',act:true,run:()=>guideScene(),hint:()=>'そうさの せつめいを もういちど みるよ。'},
    {l:'もどる',act:true,run:()=>close(),hint:()=>''}
  ].filter(Boolean);
  const RH=36,TOP=62;
  const close=()=>{cfgSave();AUDIO.se('ok');pop()};
  const change=(r,d)=>{if(r.act)return;r.chg(d);cfgSave()};
  push({a:'c',draw(){win(16,12,480,424);txt('せってい',34,24,'#f2c94c',18);
      rows.forEach((r,j)=>{const y=TOP+j*RH;if(j===i){rrect(28,y-3,456,RH-3,8);g.fillStyle='rgba(242,201,76,.14)';g.fill();g.lineWidth=1.5;g.strokeStyle='#f2c94c';g.stroke()}
        txt(r.l,44,y+4,j===i?'#fff':'#cfd8ff',17);
        if(r.act){if(r.l!=='もどる')txt('▶',452,y+4,'#9fb0ff',16)}
        else{const v=r.get();g.font='17px '+FONT;const w=g.measureText(v).width;txt(v,418-w,y+4,'#7ee07e',17);txt('◀',286,y+4,'#667',14);txt('▶',440,y+4,'#9fb0ff',14)}});
      const hy=TOP+rows.length*RH+6,r=rows[i],h=r.hint();
      g.fillStyle='rgba(255,255,255,.1)';g.fillRect(34,hy-4,444,1);
      if(r.sample){const fs=FSIZES[CFG.fsize];txt('サンプル：ことばを おぼえよう！ 한국어',40,hy+6,'#f2c94c',fs)}
      else h.split('\n').forEach((l,k)=>txt(l,40,hy+6+k*22,'#aab',14))},
    key(k){if(k==='up')i=(i+rows.length-1)%rows.length;else if(k==='down')i=(i+1)%rows.length;
      else if(k==='left')change(rows[i],-1);else if(k==='right')change(rows[i],1);
      else if(k==='a'){const r=rows[i];if(r.act)r.run();else change(r,1)}else if(k==='b')close()},
    tap(lx,ly){const j=Math.floor((ly-(TOP-3))/RH);if(j<0||j>=rows.length||lx<28||lx>484){if(ly<TOP-8)return;return}
      i=j;const r=rows[j];if(r.act){r.run();return}change(r,lx<300?-1:1);AUDIO.se('ok')}})}

// ---- first-time guide: dims the screen, rings the controls it explains ----
const GUIDE_KEY='lumina-guide';
const guideSeen=()=>{try{return localStorage.getItem(GUIDE_KEY)==='1'}catch(e){return true}};
function guideScene(cb){let pi=0,t=0;
  const IDS=['cross','bB','hg','bk','mp'];
  const PG=[
    {t:'いどう',ids:['cross'],body:['この まるを ドラッグ（スワイプ）で あるくよ。','がめんを タップすると そこまで あるいていくよ。','キーボードは ↑↓←→ か WASD。']},
    {t:'はなす・しらべる・メニュー',ids:['bB'],body:['ひとや たからばこを タップすると はなす・しらべる。','Bボタンで メニューが ひらくよ。','（つよさ・どうぐ・セーブ・せってい・タイトルへ）']},
    {t:'ことばの ほん',ids:['hg','bk','mp'],body:['ㄱ：あいうえお表・ハングル表・もじ一覧','ほん：おぼえた ことばの たんごちょう','ちず：いまの ばしょと もくひょう','せんとうちゅうでも いつでも おせるよ！']},
    {t:'せんとう',ids:[],body:['てきに であうと ことばクイズ！','せいかいで こうげき、まちがえると てきが はんげき。','むずかしいときは「せってい」から やさしいモードに できるよ。']}
  ];
  const rectOf=id=>{const el=document.getElementById(id),c=cv.getBoundingClientRect();if(!el||el.style.display==='none'||el.style.visibility==='hidden')return null;const r=el.getBoundingClientRect();if(!r.width||!c.width)return null;
    return[(r.left-c.left)/c.width*LW,(r.top-c.top)/c.height*LH,r.width/c.width*LW,r.height/c.height*LH]};
  const setDim=ids=>IDS.forEach(id=>{const el=document.getElementById(id);if(el)el.style.opacity=ids.includes(id)?'1':'.22'});
  const clearDim=()=>IDS.forEach(id=>{const el=document.getElementById(id);if(el)el.style.opacity=''});
  const finish=()=>{try{localStorage.setItem(GUIDE_KEY,'1')}catch(e){}clearDim();AUDIO.se('ok');pop();cb&&cb()};
  const next=()=>{AUDIO.se('ok');if(pi<PG.length-1){pi++}else finish()};
  push({a:'n',nopad:false,
    update(dt){t+=dt},
    draw(){const p=PG[pi];setDim(p.ids);
      g.fillStyle='rgba(2,4,18,.74)';g.fillRect(0,0,LW,LH);
      const rects=p.ids.map(rectOf).filter(Boolean);
      rects.forEach(r=>{const pad=8+Math.sin(t*5)*2;g.lineWidth=3;g.strokeStyle='#f2c94c';rrect(r[0]-pad,r[1]-pad,r[2]+pad*2,r[3]+pad*2,Math.min(30,r[3]/2));g.stroke()});
      const w=Math.min(LW-28,440),lines=p.body.flatMap(b=>wrapLines(b,w-40,16)),h=62+lines.length*24+34;
      const cy=rects.length?rects.reduce((a,r)=>a+r[1]+r[3]/2,0)/rects.length:LH/2;
      const x=(LW-w)/2,y=cy<LH*.35?Math.min(cy+70,LH-h-20):Math.max(66,Math.min(cy-h-70,LH*.35));
      win(x,y,w,h);txt(p.t,x+20,y+16,'#f2c94c',19);lines.forEach((l,j)=>txt(l,x+20,y+48+j*24,'#fff',16));
      for(let j=0;j<PG.length;j++){g.fillStyle=j===pi?'#f2c94c':'rgba(255,255,255,.3)';g.beginPath();g.arc(x+w/2-(PG.length-1)*9+j*18,y+h-14,3.5,0,7);g.fill()}
      txt(pi<PG.length-1?'タップで つぎへ ▶':'タップで はじめる！',x+w-150,y+h-24,'#9fb0ff',13);
      rrect(10,10,92,28,14);g.fillStyle='rgba(255,255,255,.12)';g.fill();txt('スキップ',24,14,'#cfd8ff',14)},
    key(k){if(k==='b')finish();else if(k==='a')next()},
    tap(lx,ly){if(lx<108&&ly<44)finish();else next()}})}
