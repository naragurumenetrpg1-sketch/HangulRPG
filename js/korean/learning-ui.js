const wobj=a=>({k:a[0],r:a[1],m:a[2]});
const pool=()=>VOC[HEROES[S.hero.cls||0].id].w.map(wobj);
const allMeanings=()=>{const o=[];for(const k in VOC)VOC[k].w.forEach(a=>o.push(a[2]));return o};
const similar=(a,b)=>{if(a===b)return true;const cl=x=>x.replace(/[（(].*?[）)]/g,'').replace(/[？?！!。・]/g,'').replace(/(ですか|ください|ましたか|ました|ますか|ます|です|ている|する)/g,'');const n=cl(a),m=cl(b);if(n.length<2||m.length<2||(/^\d/.test(n)&&/^\d/.test(m)))return n===m;if(n===m)return true;const K=/[\u4e00-\u9fff0-9]/;for(let L=Math.min(n.length,m.length);L>=2;L--){for(let i=0;i+L<=n.length;i++){const sub=n.substr(i,L);if(m.includes(sub)&&(L>=3||K.test(sub)))return true}}return false};
const pickDistractors=(ms,m,n=3)=>{const c=[...new Set(ms.filter(x=>x!==m))];const ok=shuffle(c.filter(x=>!similar(x,m)));const out=ok.slice(0,n);if(out.length<n)out.push(...shuffle(c.filter(x=>!out.includes(x))).slice(0,n-out.length));return out};
const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=(Math.random()*(i+1))|0;[a[i],a[j]]=[a[j],a[i]]}return a};
function weight(w){const s=S.stats[w.k]||{ok:0,ng:0};return Math.max(.3,1+2*s.ng-.3*s.ok)}
function pickWord(list,exclude=[]){const L=list.filter(w=>!exclude.includes(w.k));const src=L.length?L:list;let tot=0;src.forEach(w=>tot+=weight(w));let r=Math.random()*tot;for(const w of src){r-=weight(w);if(r<=0)return w}return src[0]}
const knownWords=()=>pool().filter(w=>S.learned[w.k]);
function quiz(w,cb,o={}){
  const PL=o.P||pool(),korOf=m=>{let f=PL.find(x=>x.m===m);if(f)return f;for(const k in VOC){const a=VOC[k].w.find(x=>x[2]===m);if(a)return wobj(a)}return null};
  const ds=pickDistractors(PL.map(x=>x.m),w.m);if(ds.length<3)ds.push(...pickDistractors(allMeanings().filter(m=>!ds.includes(m)),w.m,3-ds.length));
  const opts=shuffle([w.m,...ds]);let i=0,res=null,t=0;
  const PH=236,BH=36,geo=()=>{const L=isLand()&&!o.practice,pw=L?Math.min(460,LW-LW*.28-114):Math.min(LW-20,460);return{pw,px:L?LW-pw-24:(LW-pw)/2,py:LH/2-PH/2}};
  const bw=G=>(G.pw-42)/2,cell=j=>{const G=geo();return[G.px+16+(j%2)*(bw(G)+10),G.py+144+((j/2)|0)*(BH+8)]};
  const fitT=(s,max,size)=>{g.font=size+'px '+FONT;while(size>10&&g.measureText(s).width>max){size--;g.font=size+'px '+FONT}return size};
  const midT=(s,cx,y,col,size,max)=>{size=fitT(s,max,size);txt(s,cx-g.measureText(s).width/2,y,col,size)};
  const pick=j=>{if(res!==null)return;i=j;res=opts[j]===w.m;if(!o.practice){const s=S.stats[w.k]||(S.stats[w.k]={ok:0,ng:0});S.learned[w.k]=1;res?s.ok++:s.ng++;opts.forEach(op=>{const f=korOf(op);if(f)S.learned[f.k]=1})}AUDIO.se(res?'chest':'no');t=0};
  push({a:'n',draw(){const G=geo(),W2=bw(G),cx=G.px+G.pw/2;
      g.fillStyle='rgba(0,0,0,.32)';g.fillRect(0,0,LW,LH);g.globalAlpha=.96;win(G.px,G.py,G.pw,PH);g.globalAlpha=1;
      const hs=res===null?'この かんこくごの いみは？':'（'+w.r+'）';g.font='13px '+FONT;const hw=g.measureText(hs).width+26;
      g.fillStyle='rgba(159,176,255,.16)';rrect(cx-hw/2,G.py+14,hw,22,11);g.fill();txt(hs,cx-hw/2+13,G.py+18,'#9fb0ff',13);
      midT(w.k,cx,G.py+46,'#fff',52,G.pw-40);
      if(res!==null)midT(res?'せいかい！':'ざんねん…',cx,G.py+108,res?'#7ee07e':'#ff8a8a',20,G.pw-40);
      opts.forEach((op,j)=>{const[x,y]=cell(j),sel=j===i&&res===null,ok=res!==null&&op===w.m,ng=res!==null&&j===i&&op!==w.m;
        rrect(x,y,W2,BH,9);g.fillStyle=ok?'rgba(70,200,110,.28)':ng?'rgba(230,80,80,.28)':sel?'rgba(242,201,76,.18)':'rgba(255,255,255,.06)';g.fill();
        g.lineWidth=sel?2.5:1.5;g.strokeStyle=ok?'#7ee07e':ng?'#ff8a8a':sel?'#f2c94c':'rgba(120,140,220,.55)';g.stroke();
        const col=res===null?'#fff':(ok?'#c8f7c8':ng?'#ffd0d0':'#99a');
        if(res===null)midT(op,x+W2/2,y+9,col,18,W2-20);
        else{midT(op,x+W2/2,y+4,col,15,W2-16);const f=korOf(op);if(f)midT(f.k+'  '+f.r,x+W2/2,y+22,col,10,W2-16)}});
      if(res!==null&&o.practice)txt('タップで つぎへ',G.px+G.pw-104,G.py+18,'#9ac',11)},
    update(dt){if(res!==null){t+=dt;if(!o.practice&&t>1.3)this.done()}},
    done(){if(this._d)return;this._d=1;pop();cb(res)},
    key(k){if(res!==null){if(k==='a'&&t>.3)this.done();return}
      if(k==='left'&&i%2)i--;else if(k==='right'&&i%2===0)i++;else if(k==='up'&&i>1)i-=2;else if(k==='down'&&i<2)i+=2;else if(k==='a')pick(i)},
    tap(lx,ly){if(res!==null){if(t>.3)this.done();return}const G=geo(),W2=bw(G);for(let j=0;j<4;j++){const[x,y]=cell(j);if(lx>=x-4&&lx<=x+W2+4&&ly>=y-4&&ly<=y+BH+4){if(i===j)pick(j);else i=j;return}}}})}
// teaching: villagers pass on one word of the hero's theme
const SPOTS=[[0,1,2,3,4,5,6,9,10,11,12,13,14,15,16,7,8],[0,1,2,3,4,5,6,7,8,9,10,13,14,15,16,17,18],[0,1,2,3,4,5,6,7,8,9,10,13,14,15,16,17,18]];
function teachPage(n){if(n.w===undefined)return null;const p=pool(),ti=townIdx(S.map),vi=ti<0?0:ti,pm=S.perm&&S.perm[vi],ix=SPOTS[vi].indexOf(n.w);if(ix<0)return null;const q=pm&&pm[ix]!==undefined?pm[ix]:ix;
  if(q>=17)return null;const lo=vi*50+q*3,ws=[0,1,2].map(i=>lo+i).filter(i=>i<vi*50+50).map(i=>p[i]).filter(Boolean);if(!ws.length)return null;ws.forEach(w=>S.learned[w.k]=1);
  const f=w=>'『'+w.k+'』（'+w.r+'）＝『'+w.m+'』';
  let out='ことばを '+['','ひとつ','ふたつ','みっつ'][ws.length]+' おしえよう。\n'+ws.map(f).join('\n');
  const ex=(S.comps||[]).map(c=>{const w=VOC[HEROES[c].id].w[vi*50+q*3];if(!w||vi*50+q*3>=vi*50+50)return null;const o=wobj(w);S.learned[o.k]=1;return '【'+HEROES[c].job+'】'+f(o)}).filter(Boolean);
  if(ex.length)out+='\f'+'なかまの ことばも おしえてもらった。\n'+ex.join('\n');
  if(n.id!=='guard'&&vi===0&&S.map==='village'&&tutorialOn()&&!S.flags.tutHint&&!S.flags.tutDone){S.flags.tutHint=1;out+='\f？？？「…ことばを おぼえたようだな。\nむらの みなみの でぐちの もんばんが\nおまえを ためしたがっているぞ。」'}
  return out}
const STG=[
 {f:'gate',intro:['門番「まて！ この さきは まものの すみかだ。','かんこくごの もんだいを 10こ だす。\n7こ せいかいしたら とおしてやろう！'],none:['門番「まて！ この さきは まものの すみかだ。','おまえには まだ はやい！','まずは むらの ひとたちに かんこくごを\nきいてまわれ。 ひとりでも はなしたら また こい！'],pass:'よし、とおれ！ ユウよ、きをつけて いくのだぞ！',ok:'門番「とおってよし！ きをつけて いくのだぞ！」'},
 {f:'v2',intro:['門番「ここは ミナむらの でぐちだ。','この さきは ふかい もりへと つづく。\nこの むらで おぼえた ことばから 10こ だす。\n7こ せいかいで とおれるぞ！」'],none:['門番「まて！ この さきは もりの むらへ つづく みちだ。','まずは ミナむらの ひとたちに はなしかけ\nあたらしい ことばを おぼえて きなさい！」'],pass:'よし、もりの むらへ すすむがよい！',ok:'門番「もりの むらへ いくのか。 きをつけてな！」'},
 {f:'v3',intro:['門番「ここは もりの むらの でぐちだ。','この さきには まおうガルムの どうくつが ある。\nこの むらで おぼえた ことばから 10もん だす。\n7もん せいかいで とおしてやろう！」'],none:['門番「まて！ この さきは まおうの どうくつだ！','まずは もりの むらの ひとたちに はなしかけ\nことばを おぼえて きなさい！」'],pass:'よし！ どうくつへの みちが ひらいた。\nまおうガルムを たおして きてくれ！',ok:'門番「まおうガルムを たのんだぞ！」'}];
const compWords=()=>(S.comps||[]).flatMap(c=>VOC[HEROES[c].id].w.map(wobj)).filter(w=>S.learned[w.k]);
const battlePool=()=>{const p=pool();if(/^cave/.test(S.map))return p.concat(compWords());let L=[];[['gate',0],['v2',1],['v3',2]].forEach(([f,i])=>{if(S.flags[f])L=L.concat(p.slice(i*50,i*50+50))});return (L.length?L:p.slice(0,50)).concat(compWords())};
function runTest(a,b,intro,passM,failM,onPass,onFail){say(intro,()=>{
  const used=[],avail=pool().slice(a,b).concat(compWords());const ask=(n,ok)=>{
    if(n===10){if(ok>=7){AUDIO.se('win');say(['門番「'+ok+' もん せいかい！ みごとだ！'].concat(passM),onPass)}
      else say(['門番「'+ok+'もん せいかい… ざんねんだが まだまだ はやい！','7もん せいかいで とおしてやる。\nおぼえなおして もういちど こい！」'].concat(failM||[]),onFail);return}
    const w=pickWord(avail,used);used.push(w.k);quiz(w,r=>ask(n+1,ok+(r?1:0)))};ask(0,0)})}
const ENT=[null,
 {intro:['門番「ここは ミナむらだ。\nむらに はいる まえに テストを するぞ。','これまでの むらで おぼえた ことばから\n10こ だす。7こ せいかいで とおしてやろう！」'],pass:'門番「よし、ミナむらへ ようこそ！」',back:['14,8']},
 {intro:['門番「ここは もりの むらだ。\nむらに はいる まえに テストを するぞ。','これまでの むらで おぼえた ことばから\n10こ だす。7こ せいかいで とおしてやろう！」'],pass:'門番「よし、もりの むらへ ようこそ！」'}];
const ENT_BACK={1:['field',14,8,0],2:['field',23,13,3]};
function entryTest(vi){runTest(0,vi*50,ENT[vi].intro,[ENT[vi].pass],['門番「いったん むらを でて ふくしゅうしてくるのだ。」'],
  ()=>{S.flags['in'+vi]=1;try{quietSave()}catch(e){}},()=>warpTo(ENT_BACK[vi]))}
const tutorialOn=()=>!!(S.flags&&S.flags.tut);
function tutorialTest(){say(['門番「ほう、むらの ひとに はなしを きいたか。','では ためしに かんこくごの テストを してやろう。\n10もん ぜんぶ せいかいできたら とおしてやる！」'],()=>{
  const used=[],avail=pool().slice(0,50);const ask=i=>{
    if(i===10){AUDIO.se('win');S.flags.tutDone=1;say(['門番「なんと！ ぜんぶ せいかいだと！？','みごとだ！ とおってよし！」'],()=>{S.flags.gate=1;try{quietSave()}catch(e){}});return}
    const w=pickWord(avail,used);used.push(w.k);quiz(w,r=>{if(r)ask(i+1);else{S.flags.tutDone=1;S.flags.tutL=pool().slice(0,50).filter(x=>S.learned[x.k]).length;
      say(['門番「ぶははは！ まちがえたな！','かんこくごは そんなに あまくないぞ。」','門番「むらの いろんな ひとに はなしを\nきいてみなさい。 ことばを おぼえたら また こい。」','門番「つぎは 10もん中 7もん せいかいで\nとおしてやろう。」'],()=>{try{quietSave()}catch(e){}})}})};ask(0)})}
function guardCheck(vi){vi=vi||0;const st=STG[vi],H=S.hero;
  if(S.flags[st.f]){say(st.ok);return}
  const lo=vi*50,known=pool().slice(lo,lo+50).filter(w=>S.learned[w.k]);
  if(known.length<1){say(st.none,null);return}
  if(vi===0&&tutorialOn()&&!S.flags.tutDone){tutorialTest();return}
  if(vi===0&&S.flags.tutL!==undefined){if(known.length<=S.flags.tutL){say(['門番「ふん、まだ だれにも あたらしく\nはなしを きいていないようだな。','むらの ひとたちに はなしかけて\nことばを おぼえてから こい！」'],null);return}delete S.flags.tutL}
  runTest(lo,lo+50,st.intro,['門番「'+st.pass.replace(/^門番「/,'')],null,()=>{S.flags[st.f]=1;try{quietSave()}catch(e){}},null)}
function bookScene(){let top=0;const all=pool(),per=7;
  push({a:'t',draw(){win(16,16,480,420);const known=all.filter(w=>S.learned[w.k]).length;txt('たんごちょう　'+VOC[HEROES[S.hero.cls||0].id].theme+'　'+known+' / '+all.length,34,28,'#f2c94c',18);
      all.slice(top,top+per).forEach((w,j)=>{const y=70+j*46,k=S.learned[w.k];const s=S.stats[w.k]||{ok:0,ng:0};
        txt(k?w.k:'？？？',34,y,k?'#fff':'#667',22);txt(k?w.r:'',200,y+4,'#9fb0ff',14);txt(k?w.m:'',320,y+2,'#7ee07e',18);if(k)txt('○'+s.ok+' ×'+s.ng,420,y+4,'#aab',12)});
      txt('↑↓ スクロール　B もどる',34,408,'#aab',13)},
    key(k){if(k==='down'&&top+per<all.length)top++;else if(k==='up'&&top>0)top--;else if(k==='right')top=Math.min(all.length-per,top+per);else if(k==='left')top=Math.max(0,top-per);else if(k==='b'||k==='a'){AUDIO.se('ok');pop()}},tap(lx,ly){if(ly>380)this.key('b');else if(ly>220)this.key('down');else this.key('up')}})}

function hangulScene(){let mode=0,pg=0;
  const P=[['子音',[['ㄱ','カ行 k/g'],['ㄴ','ナ行 n'],['ㄷ','タ行 t/d'],['ㄹ','ラ行 r/l'],['ㅁ','マ行 m'],['ㅂ','パ行 p/b'],['ㅅ','サ行 s'],['ㅇ','むおん／ん'],['ㅈ','チャ行 j'],['ㅊ','チャ(げき)'],['ㅋ','カ(げき)'],['ㅌ','タ(げき)'],['ㅍ','パ(げき)'],['ㅎ','ハ行 h']]],
  ['母音',[['ㅏ','ア'],['ㅑ','ヤ'],['ㅓ','オ（くちひろく）'],['ㅕ','ヨ（くちひろく）'],['ㅗ','オ'],['ㅛ','ヨ'],['ㅜ','ウ'],['ㅠ','ユ'],['ㅡ','ウ（くちよこ）'],['ㅣ','イ']]],
  ['ごうせい母音・濃音',[['ㅐ','エ'],['ㅒ','イェ'],['ㅔ','エ'],['ㅖ','イェ'],['ㅘ','ワ'],['ㅙ','ウェ'],['ㅚ','ウェ'],['ㅝ','ウォ'],['ㅞ','ウェ'],['ㅟ','ウィ'],['ㅢ','ウィ'],['ㄲ','ッカ'],['ㄸ','ッタ'],['ㅃ','ッパ'],['ㅆ','ッサ'],['ㅉ','ッチャ']]]];
  const KANA=[['あ','아','이','우','에','오'],['か','카','키','쿠','케','코'],['さ','사','시','스','세','소'],['た','타','치','츠','테','토'],['な','나','니','누','네','노'],['は','하','히','후','헤','호'],['ま','마','미','무','메','모'],['や','야','','유','','요'],['ら','라','리','루','레','로'],['わ','와','','','','오'],['ん','응','','','','']];
  const KV=['あ','い','う','え','お'];
  const LI=[0,2,3,5,6,7,9,11,12,14,15,16,17,18],VI=[0,2,4,6,8,12,13,17,18,20],LN=['ㄱ','ㄴ','ㄷ','ㄹ','ㅁ','ㅂ','ㅅ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'],VN=['ㅏ','ㅑ','ㅓ','ㅕ','ㅗ','ㅛ','ㅜ','ㅠ','ㅡ','ㅣ'];
  const syl=(l,v)=>String.fromCharCode(0xAC00+(LI[l]*21+VI[v])*28);
  const RL=['g','n','d','r','m','b','s','','j','ch','k','t','p','h'],RV=['a','ya','eo','yeo','o','yo','u','yu','eu','i'];
  const TABS=['あいうえお表','ハングル表','もじ一覧'];
  AUDIO.se('ok');
  const BH=()=>mode===1?Math.max(420,Math.min(LH-24,Math.round(LH*.67))):420;
  push({a:'t',draw(){win(16,16,480,BH());
      TABS.forEach((t,i)=>{const x=30+i*152;g.fillStyle=i===mode?'#3a4bd0':'rgba(255,255,255,.1)';g.fillRect(x,26,146,28);txt(t,x+8,31,i===mode?'#fff':'#9fb0ff',16)});
      if(mode===0){
        KV.forEach((v,j)=>txt(v,100+j*76,59,'#f2c94c',16));
        KANA.forEach((r,i)=>{const y=76+i*29;txt(r[0],36,y+2,'#f2c94c',18);for(let j=1;j<6;j++)if(r[j]){g.fillStyle='rgba(255,255,255,.08)';g.fillRect(84+(j-1)*76,y,70,26);txt(r[j],96+(j-1)*76,y-1,'#fff',23)}});
        txt('かたぱ行は ㅋㅌㅍ の ほか ㄱㄷㅂ でも あらわす',32,398,'#aab',12)}
      else if(mode===1){const bh=BH(),rh=(bh-22-80)/14,tall=rh>=30;
        VN.forEach((v,j)=>txt(v,70+j*42,57,'#f2c94c',17));
        LN.forEach((l,i)=>{const y=78+i*rh;if(i%2===0){g.fillStyle='rgba(255,255,255,.06)';g.fillRect(30,y-1,452,rh)}txt(l,34,y+rh/2-10,'#f2c94c',18);
          for(let j=0;j<10;j++){const x=64+j*42,ro=(RL[i]+RV[j]);
            if(tall){txt(syl(i,j),x+8,y+1,'#fff',rh>=36?23:21);txt(ro,x+2,y+rh-15,'#9fe3b0',11)}
            else{txt(syl(i,j),x-1,y-1,'#fff',17);txt(ro,x+17,y+5,'#9fe3b0',9)}}});
        txt('←→ ひょうを きりかえ　B もどる',32,bh-22,'#aab',12)}
      else{const SEC=[['子音',[['ㄱ','カ行k/g'],['ㄴ','ナ行n'],['ㄷ','タ行t/d'],['ㄹ','ラ行r/l'],['ㅁ','マ行m'],['ㅂ','パ行p/b'],['ㅅ','サ行s'],['ㅇ','むおん'],['ㅈ','チャ行'],['ㅊ','チャ激'],['ㅋ','カ激'],['ㅌ','タ激'],['ㅍ','パ激'],['ㅎ','ハ行h']]],
          ['母音',[['ㅏ','ア'],['ㅑ','ヤ'],['ㅓ','オ広'],['ㅕ','ヨ広'],['ㅗ','オ'],['ㅛ','ヨ'],['ㅜ','ウ'],['ㅠ','ユ'],['ㅡ','ウ横'],['ㅣ','イ']]],
          ['ごうせい母音',[['ㅐ','エ'],['ㅒ','イェ'],['ㅔ','エ'],['ㅖ','イェ'],['ㅘ','ワ'],['ㅙ','ウェ'],['ㅚ','ウェ'],['ㅝ','ウォ'],['ㅞ','ウェ'],['ㅟ','ウィ'],['ㅢ','ウィ']]],
          ['濃音',[['ㄲ','ッカ'],['ㄸ','ッタ'],['ㅃ','ッパ'],['ㅆ','ッサ'],['ㅉ','ッチャ']]]];
        let y=62;SEC.forEach(([t,c])=>{txt(t,32,y,'#f2c94c',13);y+=15;
          for(let r=0;r<c.length;r+=7){c.slice(r,r+7).forEach((e,i)=>{const x=30+i*65;g.fillStyle='rgba(255,255,255,.08)';g.fillRect(x,y,61,34);txt(e[0],x+4,y,'#fff',19);txt(e[1],x+3,y+22,'#9fb0ff',10)});y+=36}
          y+=2});
        txt('激=げきおん　広=くちひろく　横=くちよこ　←→ きりかえ　B もどる',32,398,'#aab',11)}},
    key(k){if(k==='right'&&mode<2){mode++;AUDIO.se('ok')}else if(k==='left'&&mode>0){mode--;AUDIO.se('ok')}
      else if(mode===2&&k==='down'&&pg<P.length-1){pg++;AUDIO.se('ok')}else if(mode===2&&k==='up'&&pg>0){pg--;AUDIO.se('ok')}
      else if(k==='b'||k==='a'){AUDIO.se('ok');pop()}},
    tap(lx,ly){if(ly>BH()-15)this.key('b');else if(ly<60){const i=Math.max(0,Math.min(2,Math.floor((lx-30)/152)));if(i!==mode){mode=i;AUDIO.se('ok')}}else if(mode===2){this.key(ly<240?'up':'down')}}})}
document.getElementById('hg').addEventListener('click',()=>{if(S.scenes.length===1&&!S.mv)hangulScene()});
setInterval(()=>{for(const id of['hg','bk','mp']){const h=document.getElementById(id);if(h)h.style.display=(S.scenes.length>1||S.mv)?'none':''}for(const id of['cross','bB']){const h=document.getElementById(id);if(h)h.style.visibility=(S.started&&!PRACTICING&&!(S.scenes[S.scenes.length-1]||{}).nopad)?'visible':'hidden'}},150);
window.home=home;document.getElementById('bk').addEventListener('click',()=>{if(S.scenes.length===1&&!S.mv){AUDIO.se('ok');bookScene()}});

function mapScene(){
  const ti=townIdx(S.map),grp=ti>=0?'town':S.map,m=M(),all0=pool();let t=0;
  const rg=ti>=0?[ti*50,ti*50+50]:[0,all0.length],all=all0.slice(rg[0],rg[1]);
  const known=all.filter(w=>S.learned[w.k]).length,knownAll=all0.filter(w=>S.learned[w.k]).length;
  const PH=Math.min(LH-32,600),s=Math.min(448/m.w,(PH-150)/m.h),ox=16+(480-m.w*s)/2,oy=62,f=s/TS;
  const DK={K:'o_crate',O:'o_barrel',X:'o_chest',x:'o_chesto',V:'i_town',H:'i_cave',h:'o_fh',v:'o_fv',p:'o_fp'};
  const sp=(k,tx,ty)=>{const im=IMGS[k];if(!im||!im.naturalWidth)return;const w=im.naturalWidth/2*f,h=im.naturalHeight/2*f;g.drawImage(im,ox+(tx*TS+8)*f-w/2,oy+(ty+1)*TS*f-h,w,h)};
  push({a:'t',update(dt){t+=dt},draw(){win(16,16,480,PH);txt(m.name+'　のマップ',34,26,'#f2c94c',18);
      g.imageSmoothingEnabled=false;g.save();g.beginPath();g.rect(ox,oy,m.w*s,m.h*s);g.clip();
      for(let y=0;y<m.h;y++)for(let x=0;x<m.w;x++){let ch=tileAt(S.map,x,y);if(ch==='^'&&S.map==='field')ch='.';g.drawImage(TILES[ch]||TILES['.'],ox+x*s,oy+y*s,s+.6,s+.6)}
      for(const b of (BLD[S.map]||[])){const im=IMGS['b_'+b.k];if(im&&im.naturalWidth)g.drawImage(im,ox+(b.x*TS+8-im.naturalWidth/2)*f,oy+((b.y+1)*TS-im.naturalHeight)*f,im.naturalWidth*f,im.naturalHeight*f)}
      for(let y=0;y<m.h;y++)for(let x=0;x<m.w;x++){const ch=tileAt(S.map,x,y);
        if(ch==='T'||ch==='Z')sp(decoKey(ch,x,y),x,y);else if(ch==='^'&&S.map==='field'){if((x<16?x%2===0:x%2===1)&&y%2===1)sp((y===1&&(x%4===0||x%4===1))||((x*5+y*3)%7===0)?'mt4':'mt1',x,y)}else if(DK[ch])sp(DK[ch],x,y)}
      for(const n of (NPCS[S.map]||[])){if(n.gone)continue;g.fillStyle=n.id==='guard'?'#ff3030':'#ffd84a';g.strokeStyle='#000';g.lineWidth=1;g.beginPath();g.arc(ox+(n.x+.5)*s,oy+(n.y+.5)*s,Math.max(2.5,s*.3),0,7);g.fill();g.stroke()}
      const hx=ox+(S.x+.5)*s,hy=oy+(S.y+.5)*s,r=Math.max(4,s*.5)*(1+.2*Math.sin(t*6));g.fillStyle='#4fd0ff';g.strokeStyle='#fff';g.lineWidth=2;g.beginPath();g.arc(hx,hy,r,0,7);g.fill();g.stroke();
      g.restore();
      const y0=oy+m.h*s+12;
      if(grp==='town'){const pct=Math.round(known/all.length*100);txt('このばしょの ことばの かいしゅうりつ',34,y0,'#9fb0ff',15);
        g.fillStyle='#000';g.fillRect(32,y0+26,304,18);g.fillStyle='#233';g.fillRect(34,y0+28,300,14);g.fillStyle='#4ec24e';g.fillRect(34,y0+28,Math.round(300*known/all.length),14);
        txt(known+' / '+all.length+'　'+pct+'%',350,y0+24,'#fff',18);
        txt(known<all.length?'まだ はなしていない ひとや しらべていない\nたる・はこが あるよ！'.split('\n')[0]:'ぜんぶ おぼえた！ すごい！',34,y0+52,'#ccd',13);
        if(known<all.length)txt('たる・はこ も しらべてみよう！',34,y0+70,'#ccd',13)}
      else{txt('ここでは ことばを おしえてくれない。',34,y0,'#ccd',15);txt('（せんとうで しゅつだいされるよ）',34,y0+22,'#ccd',13);
        txt('ぜんたいの かいしゅう　'+knownAll+' / '+all0.length,34,y0+48,'#9fb0ff',15)}
      txt('● あなた　● ひと　● もんばん　B もどる',34,PH-12,'#aab',12)},
    key(k){if(k==='b'||k==='a'){AUDIO.se('ok');pop()}},tap(){AUDIO.se('ok');pop()}})}
document.getElementById('mp').addEventListener('click',()=>{if(S.scenes.length===1&&!S.mv){AUDIO.se('ok');mapScene()}});

const THEME_K=id=>({sword:'食堂',mage:'自然',priest:'家族・挨拶',monk:'体・動き',apriest:'道案内・方角'})[id]||VOC[id].theme;
const ROM={I:['g','kk','n','d','tt','r','m','b','pp','s','ss','','j','jj','ch','k','t','p','h'],V:['a','ae','ya','yae','eo','e','yeo','ye','o','wa','wae','oe','yo','u','wo','we','wi','yu','eu','ui','i'],
 F:['','k','k','k','n','n','n','t','l','k','m','l','l','l','p','l','m','p','p','t','t','ng','t','t','k','t','p','t']};
const FSPLIT=[[ '',''],['g',''],['kk',''],['g','s'],['n',''],['n','j'],['n','h'],['d',''],['l',''],['l','g'],['l','m'],['l','b'],['l','s'],['l','t'],['l','p'],['l','h'],['m',''],['b',''],['b','s'],['s',''],['ss',''],['ng',''],['j',''],['ch',''],['k',''],['t',''],['p',''],['h','']];
function roman(k){const cs=[...k];const sy=cs.map(c=>{const n=c.charCodeAt(0)-0xAC00;if(n<0||n>11171)return null;return{i:Math.floor(n/588),v:Math.floor(n%588/28),f:n%28}});let out='';
  for(let x=0;x<cs.length;x++){const q=sy[x];if(!q){out+=cs[x];continue}const nx=sy[x+1];let ini=ROM.I[q.i],fin;
    if(x>0&&sy[x-1]&&sy[x-1]._carry!==undefined&&q.i===11)ini=sy[x-1]._carry;
    if(q.f){if(nx&&nx.i===11&&q.f!==21&&q.f!==27){const sp=FSPLIT[q.f];q._carry=sp[1]?sp[1]:sp[0];fin=sp[1]?sp[0]:'';if(q._carry==='ng')q._carry='ng'}else if(q.f===27)fin='';else fin=ROM.F[q.f]}else fin='';
    if(q.f&&q._carry!==undefined&&nx&&nx.i===11){}
    out+=ini+ROM.V[q.v]+(fin||'')}
  return out}
function vocabList(){let hi=0,top=0;const cur=()=>VOC[HEROES[hi].id].w.map(wobj);
  const fit=(s,max,size)=>{g.font=size+'px '+FONT;while(size>10&&g.measureText(s).width>max){size--;g.font=size+'px '+FONT}return size};
  const mid=(s,x,cy,col,size,max,right)=>{size=fit(s,max||999,size);const w=g.measureText(s).width;g.save();g.textBaseline='middle';g.fillStyle=col;g.fillText(s,right?x-w-5:x,cy);g.restore()};
  const L=()=>{const m=20,hy=LH*.03,hh=Math.max(56,LH*.07),ly=hy+hh+6,bh=Math.max(48,LH*.06),by=LH-LH*.03-bh,rh=Math.max(64,LH*.078),per=Math.max(3,Math.floor((by-10-ly)/rh));return{m,hy,hh,ly,bh,by,rh,per}};
  const clamp=()=>{const n=cur().length,{per}=L();top=Math.max(0,Math.min(Math.max(0,n-per),top))};
  push({a:'n',nopad:true,draw(){clamp();const l=L(),all=cur(),H=HEROES[hi];
      g.fillStyle='#fff';g.fillRect(0,0,LW,LH);
      mid('◀',l.m,l.hy+l.hh*.4,'#a06a00',28);mid('▶',LW-l.m,l.hy+l.hh*.4,'#a06a00',28,0,true);
      {const t=THEME_K(H.id);const sz=fit(t,LW-140,22);const w=g.measureText(t).width;mid(t,(LW-w)/2,l.hy+l.hh*.36,'#111',sz)}
      {const t=(top+1)+'-'+Math.min(all.length,top+l.per)+' / '+all.length;const sz=fit(t,LW-140,14);const w=g.measureText(t).width;mid(t,(LW-w)/2,l.hy+l.hh*.8,'#888',sz)}
      g.fillStyle='#ccc';g.fillRect(l.m,l.ly-3,LW-2*l.m,1);
      all.slice(top,top+l.per).forEach((w,j)=>{const y=l.ly+j*l.rh;
        mid(w.k,l.m,y+l.rh*.34,'#111',28,LW*.5);mid(w.m,LW-l.m,y+l.rh*.34,'#0b6a24',18,LW*.4,true);
        mid(roman(w.k),l.m,y+l.rh*.76,'#555',15,LW*.45);mid(w.r,LW-l.m,y+l.rh*.76,'#4a56c8',15,LW*.45,true);
        g.fillStyle='#e3e3e3';g.fillRect(l.m,y+l.rh-1,LW-2*l.m,1)});
      const bw=(LW-2*l.m)/3;[['戻る',0],['▲',1],['▼',2]].forEach(([t,k])=>{const sz=fit(t,bw-12,24);const w=g.measureText(t).width;mid(t,l.m+k*bw+(bw-w)/2,l.by+l.bh/2,'#a06a00',sz)});g.fillStyle='#ccc';g.fillRect(l.m,l.by-4,LW-2*l.m,1)},
    key(k){const n=cur().length,{per}=L();if(k==='down')top=Math.min(Math.max(0,n-per),top+1);else if(k==='up')top=Math.max(0,top-1);
      else if(k==='right'){hi=(hi+1)%HEROES.length;top=0}else if(k==='left'){hi=(hi+HEROES.length-1)%HEROES.length;top=0}
      else if(k==='b'||k==='a'){AUDIO.se('ok');pop()}},
    tap(lx,ly){const l=L(),{per}=l,n=cur().length;
      if(ly>=l.by-6){const bw=(LW-2*l.m)/3,k=Math.floor((lx-l.m)/bw);if(k===0)this.key('b');else if(k===1)top=Math.max(0,top-per);else if(k===2)top=Math.min(Math.max(0,n-per),top+per);return}
      if(ly<l.hy+l.hh+6){this.key(lx<LW/2?'left':'right');return}
      if(ly>(l.ly+l.by)/2)top=Math.min(Math.max(0,n-per),top+per);else top=Math.max(0,top-per)}})}
function drawTitleBG(){g.fillStyle='#000';g.fillRect(0,0,LW,LH);const im=IMGS.title_bg;if(!im||!im.naturalWidth)return;const sc=LH>LW?Math.max(LW/im.naturalWidth,LH/im.naturalHeight):Math.min(LW/im.naturalWidth,LH/im.naturalHeight);const w=im.naturalWidth*sc,h=im.naturalHeight*sc;g.drawImage(im,(LW-w)/2,(LH-h)/2,w,h)}
function menuGeom(n){const h=Math.max(44,LH*.062),gap=Math.max(10,LH*.012),w=Math.min(LW*.78,420),x=(LW-w)/2,y0=LH*(LH>LW?.545:.46);return{h,gap,w,x,y0}}
function menuHit(lx,ly,n){const m=menuGeom(n);for(let j=0;j<n;j++){const y=m.y0+j*(m.h+m.gap);if(ly>=y&&ly<=y+m.h&&lx>=m.x&&lx<=m.x+m.w)return j}return -1}
function menuDraw(opts,i){const m=menuGeom(opts.length);opts.forEach((s,j)=>{const y=m.y0+j*(m.h+m.gap),on=j===i;g.save();if(on){g.shadowColor='#f2c94c';g.shadowBlur=14}g.beginPath();g.moveTo(m.x+14,y);g.arcTo(m.x+m.w,y,m.x+m.w,y+m.h,14);g.arcTo(m.x+m.w,y+m.h,m.x,y+m.h,14);g.arcTo(m.x,y+m.h,m.x,y,14);g.arcTo(m.x,y,m.x+m.w,y,14);g.closePath();g.fillStyle=on?'rgba(28,48,38,.97)':'rgba(6,16,14,.94)';g.fill();g.restore();g.lineWidth=2;g.strokeStyle=on?'#f2c94c':'#6fbf93';g.stroke();
    g.font='26px '+FONT;const tw=g.measureText(s).width;g.save();g.textBaseline='middle';const cy=y+m.h/2+1;g.fillStyle='#000';g.fillText(s,m.x+(m.w-tw)/2+1,cy+1);g.fillStyle=on?'#fff2b0':'#e8fff0';g.fillText(s,m.x+(m.w-tw)/2,cy);if(on){g.fillStyle='#f2c94c';g.fillText('▶',m.x+16,cy)}g.restore()})}
function home(){let i=0;const opts=['RPGで遊ぶ','韓国語一覧','韓国語一問一答'];
  push({a:'n',nopad:true,noland:true,draw(){drawTitleBG();menuDraw(opts,i)},
    tap(lx,ly){const j=menuHit(lx,ly,3);if(j>=0){i=j;this.key('a')}},
    key(k){if(k==='up')i=(i+2)%3;else if(k==='down')i=(i+1)%3;else if(k==='a'){AUDIO.se('ok');if(i===0)pop();else if(i===1)vocabList();else practiceMenu()}}})}

let PRACTICING=false;
function practice(hi,list){const H=HEROES[hi],P=VOC[H.id].w.map(wobj);
  let qt=0,qa=0,retry=list||null,ri=0,tot=0,ok=0,sel=-1,cur=0,q=null,phase='q',wrong=[],toast='',tt=0,used=[];
  const T=txt;
  const korOf=m=>P.find(x=>x.m===m)||null;
  const mk=()=>{let w;if(retry&&ri<retry.length)w=retry[ri++];else{retry=null;w=pickWord(P,used.slice(-20));used.push(w.k)}
    const mine=pickDistractors(P.map(x=>x.m),w.m);q={w,opts:shuffle([w.m,...mine])};sel=-1;cur=0;qt=performance.now()};
  const fit=(s,max,size)=>{g.font=size+'px '+FONT;while(size>10&&g.measureText(s).width>max){size--;g.font=size+'px '+FONT}return size};
  const ctr=(s,y,col,size,max)=>{size=fit(s,max||LW-40,size);const w=g.measureText(s).width;T(s,(LW-w)/2,y,col,size)};
  const cc=(s,y,col,size,max)=>{const l=L();size=fit(s,Math.min(max||LW-40,l.qw-30),size);const w=g.measureText(s).width;T(s,l.m+l.qw/2-w/2,y,col,size)};
  const rr=(x,y,w,h,r)=>{g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath()};
  const box=(x,y,w,h,line,bg,glow)=>{g.save();if(glow){g.shadowColor=line;g.shadowBlur=14}rr(x,y,w,h,14);g.fillStyle=bg;g.fill();g.restore();rr(x,y,w,h,14);g.lineWidth=2;g.strokeStyle=line;g.stroke()};
  const btn=(x,y,w,h,label,col,bg,size=18)=>{g.save();g.shadowColor='rgba(0,0,0,.4)';g.shadowBlur=8;g.shadowOffsetY=3;rr(x,y,w,h,14);g.fillStyle=bg;g.fill();g.restore();rr(x,y,w,h,14);g.lineWidth=2;g.strokeStyle=col;g.stroke();const sz=fit(label,w-16,size);const tw=g.measureText(label).width;T(label,x+(w-tw)/2,y+(h-sz)/2-1,col==='#aab'?'#cfd6ff':col,sz)};
  const L=()=>{const m=16,W=LW,Hh=LH;if(isLand()){const hy=12,hh=58,cy=hy+hh+10,bh=48,by=Hh-12-bh,qh=by-10-cy,qw=Math.min(W*.4,400),gap=10,ah=(qh-3*gap)/4,ax=m+qw+14;return{m,W,Hh,hy,hh,cy,qh,qw,ch:cy,ah,bh,by,ax,aw:W-m-ax,ay:j=>cy+j*(ah+gap),land:true}}const hy=Hh*.05,hh=Math.max(64,Hh*.07),cy=hy+hh+Hh*.02,qh=Hh*.28,ch=cy+qh+Hh*.028,ah=Hh*.08,gap=Hh*.012,bh=Math.max(48,Hh*.06),by=Hh-Hh*.06-bh;
    return{m,W,Hh,hy,hh,cy,qh,ch,ah,bh,by,ax:m,aw:W-2*m,ay:j=>ch+j*(ah+gap),qw:W-2*m,land:false}};
  const back=()=>{PRACTICING=false;pop()};
  const answer=j=>{if(phase!=='q')return;sel=j;const w=q.w;const good=q.opts[j]===w.m;phase='a';qa=performance.now();tot++;AUDIO.se(good?'chest':'no');if(good)ok++;else if(!wrong.find(x=>x.k===w.k))wrong.push(w);
    if(tot%10===0){toast=tot+'問目！';tt=1.8}};
  const nextQ=()=>{phase='q';mk()};
  const wrongList=()=>{let top=0;const per=Math.max(3,Math.floor((LH-150)/62));push({a:'n',draw(){g.fillStyle='#0b0e3a';g.fillRect(0,0,LW,LH);
      T('間違えた問題　'+wrong.length+'個',16,18,'#f2c94c',20);
      if(!wrong.length)ctr('まだ間違いはありません',120,'#7ee07e',18);
      wrong.slice(top,top+per).forEach((w,j)=>{const y=62+j*62;g.fillStyle='#14204a';g.fillRect(12,y-4,LW-24,56);T(w.k,22,y,'#fff',24);T(w.r,22,y+30,'#9fb0ff',13);const sz=fit(w.m,LW*.48,20);T(w.m,LW-22-g.measureText(w.m).width,y+10,'#7ee07e',sz)});
      if(wrong.length)btn(16,LH-16-50-62,LW-32,50,'この問題をやり直す','#f2c94c','#0a0a60');
      btn(16,LH-16-50,LW-32,50,'閉じる','#fff','#0a0a60');if(wrong.length>per)T('↑↓ スクロール',LW-120,LH-84-62,'#aab',12)},
    key(k){if(k==='down'&&top+per<wrong.length)top++;else if(k==='up'&&top>0)top--;else if(k==='a'||k==='b')pop()},
    tap(lx,ly){if(ly>LH-76)pop();else if(ly>LH-140&&wrong.length){pop();retry=shuffle(wrong.slice());ri=0;mk()}else if(ly>LH/2){if(top+per<wrong.length)top++}else if(top>0)top--}})};
  PRACTICING=true;mk();
  push({a:'n',update(dt){if(tt>0)tt-=dt},draw(){const l=L();const gr=g.createLinearGradient(0,0,0,LH);gr.addColorStop(0,'#0f2268');gr.addColorStop(.5,'#0a1650');gr.addColorStop(1,'#10236e');g.fillStyle=gr;g.fillRect(0,0,LW,LH);const rg=g.createRadialGradient(LW*.15,0,10,LW*.15,0,LW*.9);rg.addColorStop(0,'rgba(80,110,220,.25)');rg.addColorStop(1,'rgba(80,110,220,0)');g.fillStyle=rg;g.fillRect(0,0,LW,LH);
      box(l.m,l.hy,LW-2*l.m,l.hh,'#2a3a85','rgba(10,20,70,.6)');T(THEME_K(H.id),l.m+18,l.hy+10,'#e8ecff',20);const pg='正答率 '+(tot?Math.round(ok*100/tot)+'%':'--%');g.font='18px '+FONT;T(pg,LW-l.m-18-g.measureText(pg).width,l.hy+11,'#cde',18);
      const bx=l.m+18,bw=LW-2*l.m-36,by2=l.hy+l.hh-18;g.fillStyle='#34407f';rr(bx,by2,bw,8,4);g.fill();const fr=((tot%10)+(phase==='a'&&tot%10===0?10:0))/10;if(fr>0){g.fillStyle='#f2c94c';rr(bx,by2,Math.max(8,bw*fr),8,4);g.fill()}
      box(l.m,l.cy,l.qw,l.qh,'#4a5aa8','rgba(10,20,80,.55)');const w=q.w;
      if(phase==='q'){cc('この韓国語の意味は？',l.cy+l.qh*.12,'#9fb0ff',16);cc(w.k,l.cy+l.qh*.36,'#fff',64,LW-70)}
      else{cc(w.k+'  ('+w.r+')',l.cy+l.qh*.1,'#fff',24,LW-70);const good=q.opts[sel]===w.m;cc(good?'正解！':'残念…',l.cy+l.qh*.38,good?'#7ee07e':'#ff8a8a',34);cc('答え：'+w.m,l.cy+l.qh*.72,good?'#7ee07e':'#ffd0d0',18)}
      q.opts.forEach((o,j)=>{const y=l.ay(j);let line='#3d4a9a',bg='rgba(12,24,84,.85)',col='#fff',glow=false;if(phase==='a'){if(o===w.m){line='#7ee07e';bg='#0d3a1c';col='#7ee07e'}else if(j===sel){line='#ff8a8a';bg='#3a0d12';col='#ff8a8a'}else{line='#99a';col='#99a'}}else if(j===cur){line='#f2c94c';col='#fff';glow=true}
        box(l.ax,y,l.aw,l.ah,line,bg,glow);
        if(phase==='q'){const sz=fit(o,l.aw-80,24);if(j===cur)T('▶',l.ax+18,y+(l.ah-24)/2,'#f2c94c',24);T(o,l.ax+(j===cur?56:26),y+(l.ah-sz)/2-1,col,sz)}
        else{const f=korOf(o);const sz=fit(o,l.aw-50,20);const y0=y+(l.ah-sz-(f?18:0))/2;T(o,l.ax+26,y0,col,sz);if(f)T(f.k+'  '+f.r,l.ax+26,y0+sz+5,col,13)}});
      btn(l.m,l.by,150,l.bh,'やめる','#aab','#2a3a85',20);if(phase==='a')cc('タップで次へ ▶',l.cy+l.qh*.88,'#f2c94c',15);
      btn(LW-l.m-210,l.by,210,l.bh,'間違えた問題 '+wrong.length,wrong.length?'#ff8a8a':'#aab',wrong.length?'#4a1a30':'#2a3a85',16);
      if(tt>0){g.save();g.globalAlpha=Math.min(1,tt/.8)*.9;const sz=40;g.font=sz+'px '+FONT;const tw=g.measureText(toast).width,ty=L().land?L().hy+(L().hh-sz)/2:(L().ay(3)+L().ah+L().by)/2-sz/2;T(toast,LW/2-tw/2,ty,'#f2c94c',sz);g.restore()}},
    key(k){if(k==='b'){back();return}
      if(phase==='a'){if(k==='a')nextQ();return}
      if(k==='up')cur=(cur+3)%4;else if(k==='down')cur=(cur+1)%4;else if(k==='a')answer(cur)},
    tap(lx,ly){const l=L();
      if(ly>=l.by-4){if(lx>LW-l.m-214){AUDIO.se('ok');wrongList();return}if(lx<l.m+154){back();return}}
      if(performance.now()-qt<450)return;if(phase==='a'){if(performance.now()-qa>400)nextQ();return}
      for(let j=0;j<4;j++){const y=l.ay(j);if(ly>=y&&ly<=y+l.ah&&lx>=l.ax&&lx<=l.ax+l.aw){cur=j;answer(j);return}}}})}
function practiceMenu(){push({a:'c',draw(){g.fillStyle='#0b0e3a';g.fillRect(-1300,-1300,3200,3200)},key(){},tap(){}});
  choose(HEROES.map(h=>'　'+h.job+'　'+THEME_K(h.id)),c=>{pop();if(c>=0)practice(c)},{x:20,y:30,w:472,cancel:true,a:'c'})}

/* オートセーブ: 歩いている間は一定間隔、アプリを閉じる/隠すときにも保存 */
setInterval(()=>{try{if(S.started&&!PRACTICING&&S.hero&&S.scenes.length===1&&!S.mv)quietSave()}catch(e){}},8000);
const autoSaveNow=()=>{try{if(S.started&&S.hero&&S.hero.hp>0)quietSave()}catch(e){}};
window.addEventListener('pagehide',autoSaveNow);document.addEventListener('visibilitychange',()=>{if(document.hidden)autoSaveNow()});

/* 旧セーブからの引き継ぎ: これまで覚えた単語・クリア済みの職業を永続データへ */
(function(){const d=metaGet();if(Object.keys(d.learned).length)return;try{const sv=JSON.parse(localStorage.getItem(SAVEKEY));if(!sv)return;Object.assign(d.learned,sv.learned||{});Object.keys(sv.cleared||{}).forEach(k=>d.cleared[k]=1);if(Object.keys(d.cleared).length)d.unlocked=true;metaPut(d)}catch(e){}})();

/* もくてき表示 */
function objective(){const F=S.flags||{},p=pool(),ti=townIdx(S.map),cnt=vi=>p.slice(vi*50,vi*50+50).filter(w=>S.learned[w.k]).length;
  if(F.boss)return 'ちょうろうの いえへ ほうこくに いこう';
  if(/^cave/.test(S.map))return 'おくの まおうガルムを たおそう！';
  const steps=[['gate',0,'ひとに はなしかけ ことばを あつめよう'],['in1',-1,'ひがしの ミナむらを めざそう'],['v2',1,'ことばを あつめ もんばんの テストへ'],['in2',-1,'さらに ひがしの もりの むらを めざそう'],['v3',2,'ことばを あつめ もんばんの テストへ']];
  for(const [f,vi,msg] of steps){if(!F[f]){
    if(f==='gate'){if(tutorialOn()&&!F.tutDone){return cnt(0)<1?'ひとに はなしかけて ことばを おぼえよう':'みなみの でぐちの もんばんに はなしかけよう'}
      if(ti===0)return 'ことばを あつめ もんばんの テストへ ('+cnt(0)+'/50)';return 'むらへ もどって もんばんの テストを うけよう'}
    if(vi>=0&&ti===vi)return msg.replace('ことばを あつめ','ことばを あつめ')+' ('+cnt(vi)+'/50)';return msg}}
  return 'まおうガルムの どうくつへ！（みなみの おく）'}
function drawObjective(){if(S.scenes.length>1)return;const s='もくてき：'+objective();g.save();g.font='15px '+FONT;let sz=15;const max=LW-200;while(sz>11&&g.measureText(s).width>max){sz--;g.font=sz+'px '+FONT}const w=g.measureText(s).width,x=(LW-w)/2,y=14;
  g.globalAlpha=.88;g.fillStyle='rgba(8,14,40,.78)';g.beginPath();const rx=x-12,ry=y-4,rw=w+24,rh=sz+14,r=12;g.moveTo(rx+r,ry);g.arcTo(rx+rw,ry,rx+rw,ry+rh,r);g.arcTo(rx+rw,ry+rh,rx,ry+rh,r);g.arcTo(rx,ry+rh,rx,ry,r);g.arcTo(rx,ry,rx+rw,ry,r);g.closePath();g.fill();g.globalAlpha=1;g.lineWidth=1.5;g.strokeStyle='rgba(242,201,76,.7)';g.stroke();
  g.textBaseline='middle';g.fillStyle='#f2c94c';g.fillText('◆',rx+8,ry+rh/2+1);g.fillStyle='#fff';g.fillText(s,x+8,ry+rh/2+1);g.restore()}

function tutStart(){if(!tutorialOn()||S.flags.tutHint||S.map!=='village'||S.scenes.length!==1)return;
  const sol=(x,y,n)=>SOLID.has(tileAt('village',x,y))||NPCS.village.some(m=>m!==n&&m.x===x&&m.y===y);
  const L=OBJS.village||[],cands=NPCS.village.filter(n=>n.w!==undefined&&n.id!=='guard').map(n=>({n})).concat(L.map((k,i)=>({o:i,k})).filter(o=>S.map==='village'));
  const pk=cands[(Math.random()*cands.length)|0];if(!pk)return;
  if(pk.n){const n=pk.n,c=[[S.x,S.y-1],[S.x-1,S.y],[S.x+1,S.y],[S.x,S.y+1]].find(([x,y])=>!sol(x,y,n));if(!c)return;n.x=c[0];n.y=c[1];S.dir=c[1]<S.y?1:c[1]>S.y?0:c[0]<S.x?2:3;
    const ch=n.i==='v_chick';say(ch?['コケッ！ コケーッ！','にわとりが とびはねながら よってきた！']:['？？？「おい、そこの おまえ！ まちなさい。」','むらの ひとが ちかづいてきた！'],()=>talk(n));return}
  const [ox,oy]=pk.k.split(',').map(Number),c=tileAt('village',ox,oy),nm=c==='O'?'たる':'はこ';
  const tp=teachPage({w:13+pk.o});S.seen['village'+ox+','+oy]=1;
  say(['ガタガタッ！ '+nm+'が ひとりでに ゆれている…','…'+nm+'の なかから こえが きこえる！',tp||'…なかは からっぽだった。'])}
