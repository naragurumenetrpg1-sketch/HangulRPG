// ===== 6c. app info: terms, privacy, licenses, contact, data erase, first-launch agreement =====
const fillInfo=s=>String(s).replace(/\{(\w+)\}/g,(m,k)=>APP_INFO[k]!=null?APP_INFO[k]:m);
const TERMS_KEY='lumina-terms';
const termsOK=()=>{try{return localStorage.getItem(TERMS_KEY)===APP_INFO.legalVersion}catch(e){return true}}; // if storage is unavailable, never block the game

// section list -> wrapped, coloured rows
function legalRows(sections,width){const rows=[];
  sections.forEach((s,i)=>{if(i)rows.push({t:''});
    if(s.h)wrapLines(fillInfo(s.h),width,16).forEach(l=>rows.push({t:l,c:'#f2c94c',s:16}));
    (s.p||[]).forEach(p=>wrapLines(fillInfo(p),width,15).forEach(l=>rows.push({t:l,c:'#e8ecff',s:15})))});
  return rows}

// scrollable text window (wheel, drag, keys and buttons)
function textViewer(title,sections){const W=432,LHT=22,AY=56,AH=330,rows=legalRows(sections,W);let scroll=0;
  const max=()=>Math.max(0,rows.length*LHT-AH+8),clampS=v=>Math.max(0,Math.min(max(),v));
  const set=v=>{scroll=clampS(v)};
  const close=()=>{AUDIO.se('ok');pop()};
  push({a:'c',
    draw(){win(16,12,480,424);txt(title,34,24,'#f2c94c',18);
      g.save();g.beginPath();g.rect(28,AY-4,448,AH+4);g.clip();
      rows.forEach((r,i)=>{const y=AY+i*LHT-scroll;if(r.t&&y>AY-LHT&&y<AY+AH)txt(r.t,34,y,r.c,r.s)});g.restore();
      const m=max();if(m>0){const bh=Math.max(24,AH*AH/(rows.length*LHT)),by=AY+(AH-bh)*scroll/m;g.fillStyle='rgba(255,255,255,.14)';rrect(480,AY,4,AH,2);g.fill();g.fillStyle='#f2c94c';rrect(480,by,4,bh,2);g.fill()}
      const btn=(x,w,s)=>{rrect(x,394,w,30,9);g.fillStyle='rgba(255,255,255,.08)';g.fill();g.lineWidth=1.5;g.strokeStyle='rgba(120,140,220,.6)';g.stroke();g.font='15px '+FONT;txt(s,x+w/2-g.measureText(s).width/2,401,'#cfd8ff',15)};
      btn(34,70,'▲ うえ');btn(112,70,'▼ した');btn(380,98,'もどる');
      txt(m>0?Math.round(100*scroll/m)+'%':'',216,401,'#889',14)},
    key(k){if(k==='up')set(scroll-LHT*2);else if(k==='down')set(scroll+LHT*2);else if(k==='left')set(scroll-AH+LHT);else if(k==='right')set(scroll+AH-LHT);else if(k==='b'||k==='a')close()},
    tap(lx,ly){if(ly<390)return;if(lx>=34&&lx<=104)set(scroll-AH+LHT);else if(lx>=112&&lx<=182)set(scroll+AH-LHT);else if(lx>=380&&lx<=478)close()},
    drag(dy){set(scroll-dy)},wheel(dy){set(scroll+dy*.6)}})}
// mouse wheel / trackpad for scenes that ask for it
wrapEl.addEventListener('wheel',e=>{const s=S.scenes[S.scenes.length-1];if(s&&s.wheel){s.wheel(e.deltaY);e.preventDefault()}},{passive:false});

// "アプリの じょうほう" menu
function legalMenu(){let i=0;
  const about=()=>({title:'お問い合わせ・バージョン',sections:[{h:'アプリ',p:['{name}','バージョン {version}']},{h:'提供者',p:['{developer}']},{h:'お問い合わせ',p:['{email}']}].concat(LEGAL.support.sections.slice(1))});
  const rows=[
    {l:'利用規約',run:()=>textViewer(LEGAL.terms.title,LEGAL.terms.sections)},
    {l:'プライバシーポリシー',run:()=>textViewer(LEGAL.privacy.title,LEGAL.privacy.sections)},
    {l:'ライセンス表示',run:()=>textViewer(LEGAL.licenses.title,LEGAL.licenses.sections)},
    {l:'お問い合わせ・バージョン',run:()=>{const a=about();textViewer(a.title,a.sections)}},
    {l:'データをすべて消す',run:()=>eraseAllData(),warn:true},
    {l:'もどる',run:()=>{AUDIO.se('ok');pop()}}];
  const RH=46,TOP=70;
  push({a:'c',draw(){win(16,40,480,TOP+rows.length*RH+8-30);txt('アプリの情報',34,52,'#f2c94c',18);
      rows.forEach((r,j)=>{const y=TOP+j*RH;rrect(30,y-4,452,RH-8,9);g.fillStyle=j===i?'rgba(242,201,76,.16)':'rgba(255,255,255,.05)';g.fill();g.lineWidth=j===i?2:1;g.strokeStyle=j===i?'#f2c94c':'rgba(120,140,220,.4)';g.stroke();
        txt(r.l,48,y+7,r.warn?'#ff9a9a':(j===i?'#fff':'#cfd8ff'),17);if(r.l!=='もどる')txt('▶',452,y+7,'#9fb0ff',16)})},
    key(k){if(k==='up')i=(i+rows.length-1)%rows.length;else if(k==='down')i=(i+1)%rows.length;else if(k==='a'){AUDIO.se('ok');rows[i].run()}else if(k==='b'){AUDIO.se('ok');pop()}},
    tap(lx,ly){const j=Math.floor((ly-(TOP-4))/RH);if(j>=0&&j<rows.length&&lx>=30&&lx<=482){i=j;AUDIO.se('ok');rows[j].run()}}})}

// delete everything the app stored on the device
function eraseAllData(){
  const doErase=()=>{try{Object.keys(localStorage).filter(k=>k.indexOf('lumina-')===0).forEach(k=>localStorage.removeItem(k))}catch(e){}
    say(['データを すべて けしました。\nアプリを さいきどうします。'],()=>{try{location.reload()}catch(e){}})};
  say(['データを すべて けします。\nセーブデータ・がくしゅうの きろく・せっていが\nもとに もどせなくなります。'],()=>choose(['やめる','けす'],c=>{
    if(c===1)say(['ほんとうに けしても いいですか？'],()=>choose(['やめる','けす'],d=>{if(d===1)doErase()}))}))}

// first launch: ask the player to read and agree to the terms and privacy policy
function termsGate(){let i=2;
  const items=['利用規約を読む','プライバシーポリシーを読む','同意してはじめる'];
  const body=wrapLines('ご利用の前に、「利用規約」と「プライバシーポリシー」をお読みください。「同意してはじめる」を押すと、これらに同意したことになります。',424,16).concat([''],wrapLines('このアプリは、名前・場所などの個人情報を集めません。記録は、端末の中にだけ保存されます。',424,16));
  const accept=()=>{try{localStorage.setItem(TERMS_KEY,APP_INFO.legalVersion)}catch(e){}AUDIO.se('ok');pop()};
  const run=j=>{if(j===0){AUDIO.se('ok');textViewer(LEGAL.terms.title,LEGAL.terms.sections)}else if(j===1){AUDIO.se('ok');textViewer(LEGAL.privacy.title,LEGAL.privacy.sections)}else accept()};
  const BY=62+body.length*24+14,RH=52;
  push({a:'c',gate:true,draw(){win(16,24,480,BY+items.length*RH+22-24);txt('はじめに',34,38,'#f2c94c',20);
      body.forEach((l,k)=>txt(l,38,66+k*24,'#e8ecff',16));
      items.forEach((s,j)=>{const y=BY+j*RH,ok=j===2;rrect(36,y,440,RH-10,10);g.fillStyle=j===i?(ok?'rgba(126,224,126,.22)':'rgba(242,201,76,.16)'):'rgba(255,255,255,.06)';g.fill();g.lineWidth=j===i?2.5:1.5;g.strokeStyle=j===i?(ok?'#7ee07e':'#f2c94c'):'rgba(120,140,220,.5)';g.stroke();
        g.font='18px '+FONT;txt(s,256-g.measureText(s).width/2,y+10,ok?'#c8f7c8':'#fff',18)})},
    key(k){if(k==='up')i=(i+items.length-1)%items.length;else if(k==='down')i=(i+1)%items.length;else if(k==='a')run(i)},
    tap(lx,ly){const j=Math.floor((ly-BY)/RH);if(j>=0&&j<items.length&&lx>=36&&lx<=476){i=j;run(j)}}})}
