// ===== 7. audio + loop =====
const AUDIO=(()=>{let ctx=null,master=null,timer=null,cur=null,step=0,on=true,vol=.7;
  const mf=n=>440*Math.pow(2,(n-69)/12);
  const SONGS={
   town:{bpm:132,lead:[72,76,79,76,74,77,81,77,72,76,79,84,83,79,76,0],bass:[48,0,55,0,53,0,57,0,48,0,55,0,55,0,52,0]},
   field:{bpm:150,lead:[67,0,69,71,72,0,71,69,67,0,64,67,69,0,67,0],bass:[48,48,55,55,45,45,52,52,48,48,55,55,43,43,50,50]},
   cave:{bpm:96,lead:[57,0,0,60,0,0,59,0,57,0,0,55,0,0,52,0],bass:[33,0,0,0,33,0,0,0,31,0,0,0,31,0,0,0]},
   battle:{bpm:176,lead:[69,69,72,69,76,76,74,72,69,69,72,69,77,76,74,72],bass:[45,45,45,45,43,43,43,43,41,41,41,41,43,43,45,45]},
   boss:{bpm:168,lead:[57,0,57,60,57,0,63,62,57,0,57,60,66,65,63,0],bass:[33,33,0,33,31,31,0,31,33,33,0,33,36,35,34,0]}};
  function tone(f,d,type='square',v=.08,t0=0,slide){if(!ctx||!on)return;const o=ctx.createOscillator(),gn=ctx.createGain(),t=ctx.currentTime+t0;
    o.type=type;o.frequency.setValueAtTime(f,t);if(slide)o.frequency.exponentialRampToValueAtTime(slide,t+d);
    gn.gain.setValueAtTime(v,t);gn.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(gn);gn.connect(master);o.start(t);o.stop(t+d+.02)}
  function noise(d,v=.1,t0=0){if(!ctx||!on)return;const n=ctx.sampleRate*d|0,b=ctx.createBuffer(1,n,ctx.sampleRate),a=b.getChannelData(0);for(let i=0;i<n;i++)a[i]=(Math.random()*2-1)*(1-i/n);
    const s=ctx.createBufferSource(),gn=ctx.createGain();s.buffer=b;gn.gain.value=v;s.connect(gn);gn.connect(master);s.start(ctx.currentTime+t0)}
  function tick(){const s=SONGS[cur];if(!s)return;const L=s.lead[step%16],B=s.bass[step%16],d=60/s.bpm/2;
    if(L)tone(mf(L),d*.9,'square',.035);if(B)tone(mf(B),d*1.6,'triangle',.08);step++}
  return{setVol(v){vol=v;if(master)master.gain.value=v},init(){if(ctx)return;try{ctx=new (window.AudioContext||window.webkitAudioContext)();master=ctx.createGain();master.gain.value=vol;master.connect(ctx.destination);if(cur)this.play(cur)}catch(e){}},
   play(n){cur=n;step=0;clearInterval(timer);if(n&&SONGS[n]&&ctx)timer=setInterval(tick,60/SONGS[n].bpm/2*1000)},
   se(n){const f={ok:()=>tone(880,.08,'square',.05),talk:()=>tone(660,.05,'square',.03),no:()=>tone(140,.2,'sawtooth',.06),
     hit:()=>{noise(.12,.12);tone(160,.1,'square',.06,0,60)},fire:()=>{noise(.35,.1);tone(300,.35,'sawtooth',.05,0,900)},
     heal:()=>[660,830,990,1320].forEach((q,i)=>tone(q,.14,'triangle',.07,i*.08)),run:()=>tone(500,.3,'square',.05,0,150),
     enc:()=>{tone(700,.4,'square',.06,0,120);noise(.3,.06)},chest:()=>[523,659,784,1047].forEach((q,i)=>tone(q,.1,'square',.05,i*.07)),
     inn:()=>[523,659,784,659,523,659,784,1047].forEach((q,i)=>tone(q,.2,'triangle',.07,i*.2)),
     win:()=>[523,523,523,659,784,659,784,1047].forEach((q,i)=>tone(q,.16,'square',.05,i*.13)),
     lvup:()=>[392,523,659,784,1047].forEach((q,i)=>tone(q,.2,'triangle',.07,.6+i*.1))};(f[n]||(()=>{}))()}}})();
