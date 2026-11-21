// ===== 6. talk / shop / menu / save / title =====
function talk(n){const WHO=({elder:'ちょうろう',inn:'やどや',shop:'どうぐや'})[n.id]||((n.id==='guard'||n.id==='boss')?null:'むらびと'),say=(pg,c)=>sayAs(pg,c,WHO);const H=S.hero;if(n.id!=='guard')S.seen['n'+S.map+':'+n.x+','+n.y]=1;const tp=teachPage(n);
  if(n.id==='guard'){const vi=Math.max(0,townIdx(S.map)),f='g'+S.map+n.w;if(tp&&!S.flags[f]){S.flags[f]=1;say(['門番「そうだ、ひとつ おしえてやろう。」',tp],()=>guardCheck(vi))}else guardCheck(vi);return}
  if(n.t){say(tp?[n.t,tp]:n.t);return}
  if(n.id==='inn'){say(tp?['ようこそ やどやへ！',tp,'ひとばん 10Gですが おとまりに なりますか？']:'ようこそ やどやへ！\nひとばん 10Gですが おとまりに なりますか？',()=>choose(['はい','いいえ'],i=>{
    if(i!==0){say('では また おこしくださいませ。');return}
    if(H.gold<10){say('おかねが たりないようです…');return}
    H.gold-=10;AUDIO.play(null);AUDIO.se('inn');fadeTo(()=>{H.hp=H.mhp;H.mp=H.mmp},()=>{AUDIO.play('town');say('ゆうべは おたのしみでしたね。\nHPと MPが かんぜんに かいふくした！')})},{x:340,y:230,w:110,a:'b'}));return}
  if(n.id==='shop'){say(tp?['いらっしゃい！ ごゆっくり どうぞ。',tp]:'いらっしゃい！ ごゆっくり どうぞ。',shopMenu);return}
  if(n.id==='elder'){
    if(S.flags.boss){say('ひかりの石は むらの たからじゃ。\nほんとうに ありがとう、ユウよ。');return}
    if(!S.flags.met){S.flags.met=1;H.gold+=30;S.items.herb+=2;
      say(['おお ユウ、よく きてくれた。','じつは ひかりの石が きたの どうくつに すむ\nまおうガルムに うばわれてしもうた。','あの石が なければ むらの みずは かれてしまう…','へいげんの まものを たおして ちからを つけ\nどうくつの おくの ガルムを うつのじゃ。','これは わずかじゃが ささやかな ぎょうぎじゃ。\n30Gと やくそう 2こを うけとっておくれ。','どうくつは むらの ひがしの みち、\nへいげんの おくに あるぞ。'].concat(tp?[tp]:[]));}
    else say(['どうくつへ いくには すべての むら\n（このむら・ミナむら・もりの むら）の\nもんばんの テストに ごうかくするのじゃ。','ガルムは とても つよい まものじゃ。\nレベルを あげて そうびも ととのえるのじゃぞ。'].concat(tp?[tp]:[]),null);return}
  if(n.id==='boss'){say(['……よく ここまで きたな、ゆうしゃよ。','ひかりの石は わたさぬ！\nこの まおうガルムが あいてに なろう！'],()=>startBattle('boss'))}
}
function shopMenu(){const H=S.hero;
  const goods=[['herb','やくそう',8],['ether','せいすい',20],['w1','どうのつるぎ',60],['w2','てつのつるぎ',180],['a1','かわのよろい',50],['a2','くさりかたびら',160]];
  let i=0,msg='なにを おもとめですか？';
  const own=k=>k[0]==='w'?H.wpn>=+k[1]:k[0]==='a'?H.arm>=+k[1]:false;
  push({full:1,a:'c',tap(lx,ly){if(lx<60||lx>452||ly<40||ly>370){this.key('b');return}const j=Math.floor((ly-90)/34);if(j>=0&&j<goods.length){if(j===i)this.key('a');else i=j}},draw(){win(60,40,392,330);txt('どうぐや',80,54,'#f2c94c');txt('所持金 '+H.gold+'G',330,54);
      goods.forEach((it,j)=>{const o=own(it[0]);txt((j===i?'▶':'  ')+it[1],80,96+j*34,o?'#888':'#fff');
        txt(o?'そうび ずみ':it[2]+'G',330,96+j*34,o?'#888':'#fff')});
      lines(msg,80,310,24,'#cde')},
   key(k){if(k==='up')i=(i+goods.length-1)%goods.length;else if(k==='down')i=(i+1)%goods.length;
    else if(k==='b'){pop();say('また どうぞ！');}
    else if(k==='a'){const it=goods[i];if(own(it[0])){msg='それは もう そうび している。';return}
      if(H.gold<it[2]){msg='おかねが たりないようです。';AUDIO.se('no');return}
      H.gold-=it[2];AUDIO.se('chest');
      if(it[0]==='herb'||it[0]==='ether'){S.items[it[0]]++;msg=it[1]+'を かいました！'}
      else if(it[0][0]==='w'){H.wpn=+it[0][1];msg=it[1]+'を そうびした！ こうげき +'+WPN[H.wpn][1]}
      else{H.arm=+it[0][1];msg=it[1]+'を そうびした！ しゅび +'+ARM[H.arm][1]}}}})}
// leave the game and go back to the title (home) screen. The game is saved first, so "続きから" picks up where you stopped.
function backToTitle(){say(['タイトルに もどりますか？\n（ここまでの きろくは じどうで セーブされます）'],()=>choose(['はい','いいえ'],c=>{
  if(c!==0)return;try{quietSave()}catch(e){}
  S.scenes.length=1;S.started=false;S.mv=null;S.path=null;title();home()}))}
function openMenu(){if(S.mv)return;AUDIO.se('ok');
  const acts=[['つよさ',status],['どうぐ',useItem],['じゅもん',fieldSpell],['たんごちょう',bookScene],['きろく',recordScene],['セーブ',save],['せってい',settingsScene],['タイトルへ',backToTitle]];
  choose(acts.map(x=>x[0]),i=>{if(i>=0)acts[i][1]()},{x:16,y:16,w:190})}
function status(){const H=S.hero;
  push({full:1,a:'t',tap(){this.key('b')},draw(){win(150,16,346,300);txt(H.name+' '+HEROES[H.cls||0].job+' Lv'+H.lv,170,30,'#f2c94c');
    lines(`${CFG.easy?'':'HP  '+H.hp+' / '+H.mhp+'\n'}MP  ${H.mp} / ${H.mmp}\nこうげき ${ATK()}\nしゅび   ${DEF()}\nけいけんち ${H.exp}\nつぎのLvまで ${need(H.lv)-H.exp}\nぶき ${WPN[H.wpn][0]}\nぼうぐ ${ARM[H.arm][0]}\n${H.gold} G`,170,62,27)},
   key(k){if(k==='a'||k==='b'){AUDIO.se('ok');pop()}}})}
function useItem(){const o=[];if(S.items.herb)o.push(['herb','やくそう x'+S.items.herb]);if(S.items.ether)o.push(['ether','せいすい x'+S.items.ether]);
  if(!o.length){say('どうぐを もっていない。');return}
  choose(o.map(a=>a[1]),i=>{if(i<0)return;const k=o[i][0],H=S.hero;
    if(k==='herb'){if(H.hp>=H.mhp){say('HPは まんたんだ。');return}S.items.herb--;H.hp=Math.min(H.mhp,H.hp+30);AUDIO.se('heal');say('やくそうを つかった！\nHPが かいふくした！')}
    else{if(H.mp>=H.mmp){say('MPは まんたんだ。');return}S.items.ether--;H.mp=Math.min(H.mmp,H.mp+10);AUDIO.se('heal');say('せいすいを つかった！\nMPが かいふくした！')}},{x:150,y:16,w:200})}
function fieldSpell(){const H=S.hero;if(!S.flags.heal){say('まだ つかえる じゅもんが ない。');return}
  choose(['ホイミ 3'],i=>{if(i<0)return;if(H.mp<3){say('MPが たりない！');return}if(H.hp>=H.mhp){say('HPは まんたんだ。');return}
    H.mp-=3;H.hp=Math.min(H.mhp,H.hp+25);AUDIO.se('heal');say('ホイミを となえた！\nHPが かいふくした！')},{x:150,y:16,w:150})}
const SAVEKEY='lumina-hero-save-v1';
function quietSave(){metaMerge();localStorage.setItem(SAVEKEY,JSON.stringify({comps:S.comps||[],map:S.map,x:S.x,y:S.y,dir:S.dir,hero:S.hero,items:S.items,flags:S.flags,chests:S.chests,learned:S.learned,stats:S.stats,seen:S.seen,cleared:S.cleared,seed:S.seed,trans:S.trans||0}))}
function saveInfo(d){try{d=d||JSON.parse(localStorage.getItem(SAVEKEY));return HEROES[d.hero.cls].job+' Lv'+d.hero.lv}catch(e){return ''}}
function save(){try{quietSave();const nm=(M()&&M().name)||'';say(['セーブしました！','（'+saveInfo({hero:S.hero})+(nm?'　'+nm:'')+'）\nつぎは タイトルの「続きから」で さいかいできるぞ。'])}
  catch(e){say('ここでは セーブが できないようです。')}}
function loadSave(){try{const d=JSON.parse(localStorage.getItem(SAVEKEY));if(!d)return false;
  Object.assign(S,{started:true,comps:d.comps||[],trail:[],map:d.map,x:d.x,y:d.y,dir:d.dir,hero:d.hero,items:d.items,flags:d.flags,chests:d.chests,learned:d.learned||{},stats:d.stats||{},seen:d.seen||{},cleared:d.cleared||{},trans:d.trans||0});rollAll(d.seed||7);const sc=tileAt(S.map,S.x,S.y);if(townIdx(S.map)>=0&&'OKNThvpZ'.includes(sc)){const st={village:[10,17],village2:[9,16],village3:[10,17]}[S.map];if(st){S.x=st[0];S.y=st[1]}}NPCS.cave2[0].gone=!!S.flags.boss;return true}catch(e){return false}}
function hasSave(){try{return !!localStorage.getItem(SAVEKEY)}catch(e){return false}}
function title(){let t=0,i=0;const opts=(hasSave()?['最初から','続きから（'+saveInfo()+'）']:['最初から']).concat(['ホームに戻る']);AUDIO.play(null);
  const sc={a:'n',nopad:true,noland:true,tap(lx,ly){const j=menuHit(lx,ly,opts.length);if(j>=0){i=j;this.key('a')}},draw(){drawTitleBG();menuDraw(opts,i)},
    update(dt){t+=dt},
    key(k){if(k==='b'){AUDIO.se('ok');home();return}if(k==='up'||k==='down')i=(i+1)%opts.length;else if(k==='a'){AUDIO.se('ok');
      if(i===opts.length-1){home();return}
      if(i===1&&loadSave()){pop();AUDIO.play(M().bgm);if(!guideSeen())setTimeout(()=>{if(S.started&&S.scenes.length===1)guideScene()},400)}
      else{pop();AUDIO.play('town');say(['たびの なかまを えらぼう！\nなかまごとに おぼえる ことばの テーマが ちがうぞ。'],()=>pickHero(ci=>pickComps(ci,cs=>{newRun(ci,true,cs);say(['ある ひ、ルミナむらの たからである ひかりの石が\nまおうガルムに うばわれた…','ゆうしゃ ユウは ちょうろうに よばれている。\nまずは むらの ちょうろうの いえを たずねよう。'],()=>{if(!guideSeen())guideScene()})})))}}}};
  push(sc)}

const heroLabel=i=>{const H=HEROES[i];if(i>=4&&!metaUnlocked())return '？？？　（クリアで かいほう）';return (metaGet().cleared[i]?'★':'　')+H.job+'　'+VOC[H.id].theme};
function pickHero(done){choose(HEROES.map((h,i)=>heroLabel(i)),ci=>{const c=Math.max(0,ci);if(c>=4&&!metaUnlocked()){say('この なかまは まおうを たおすと\nえらべるように なるぞ！',()=>pickHero(done));return}done(c)},{x:20,y:20,w:472,cancel:false,a:'c'})}
function newRun(ci,fresh,comps){S.started=true;S.comps=comps||[];S.trail=[];S.hero={name:(S.hero&&S.hero.name)||'ユウ',cls:ci,lv:1,hp:30,mhp:30,mp:5,mmp:5,atk:8,def:3,exp:0,gold:20,wpn:0,arm:0};
  S.items={herb:2,ether:0};S.flags={};S.chests={};S.seen={};if(fresh){S.learned={};S.stats={};S.cleared={}}
  S.learned=Object.assign({},S.learned,metaGet().learned);S.cleared=Object.assign({},S.cleared,metaGet().cleared);
  S.map='village';S.trans=0;S.todToast=null;S.x=10;S.y=10;S.dir=0;S.mv=null;S.steps=0;S.sinceBattle=0;NPCS.cave2[0].gone=false;rollAll((Math.random()*1e9)|0);AUDIO.play('town');if(fresh)S.flags.tut=1;if(fresh){let n=0;const iv=setInterval(()=>{if(++n>120||S.flags.tutHint||S.map!=='village'){clearInterval(iv);return}if(S.scenes.length===1&&!S.mv){clearInterval(iv);tutStart()}},500)}}
function pickComps(ci,done){const list=HEROES.map((h,i)=>i).filter(i=>i!==ci&&metaGet().cleared[i]);if(!list.length){done([]);return}
  const sel=[];const ask=()=>choose(list.map(i=>(sel.includes(i)?'✔ ':'　')+HEROES[i].job+'　'+THEME_K(HEROES[i].id)).concat(['けってい（'+sel.length+'/3にん）']),c=>{const k=Math.max(0,c);
    if(k===list.length){done(sel.slice());return}const id=list[k],at=sel.indexOf(id);if(at>=0)sel.splice(at,1);else if(sel.length>=3){say('なかまは さいだい 3にんまでだ。',ask);return}else sel.push(id);ask()},{x:20,y:20,w:472,cancel:false,a:'c'});
  say(['クリアずみの しょくぎょうの なかまを\nさいだい 3にん つれていけるぞ。','なかまの ことばも むらの ひとたちが\nすこしずつ おしえてくれる。'],ask)}
function newHeroSelect(){AUDIO.play('town');say(['ちょうろう「さあ、あたらしい なかまと\nもういちど ぼうけんに でよう！」','ちょうろう「なかまを かえると おぼえる ことばの\nテーマも かわるぞ。 ★は クリアずみじゃ。」','ちょうろう「…おお、まおうを たおした おぬしには\nじょうきゅうの なかまたちも したがうようじゃ。」'],()=>
  pickHero(c=>pickComps(c,cs=>{fadeTo(()=>{newRun(c,false,cs);try{quietSave()}catch(e){}},()=>say(['むらの ようすが どこか ちがう…\nひとも たるも ならびが かわっている。','あたらしい ゆうしゃは ちょうろうに よばれている。\nまずは むらで ひとに はなしかけ ことばを あつめよう。']))})))}
