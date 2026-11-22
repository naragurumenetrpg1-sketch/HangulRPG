// Renders privacy.html / terms.html / support.html / licenses.html from js/app-info.js (one source of truth shared with the game).
(function(){
  var page=document.body.getAttribute('data-page'),doc=LEGAL[page];if(!doc)return;
  var fill=function(s){return String(s).replace(/\{(\w+)\}/g,function(m,k){return APP_INFO[k]!=null?APP_INFO[k]:m})};
  var esc=function(s){return s.replace(/[&<>]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;'}[c]})};
  var out='<h1>'+esc(doc.title)+'</h1><p class="app">'+esc(fill('{name}'))+'</p>';
  doc.sections.forEach(function(s){
    if(s.h)out+='<h2>'+esc(fill(s.h))+'</h2>';
    var list=null;
    (s.p||[]).forEach(function(p){
      p=fill(p);
      if(p.indexOf('・')===0){if(!list)list=[];list.push(p.slice(1));return}
      if(list){out+='<ul>'+list.map(function(i){return'<li>'+esc(i)+'</li>'}).join('')+'</ul>';list=null}
      out+='<p>'+esc(p).replace(/(https?:\/\/[^\s）)]+)/g,'<a href="$1" rel="noopener">$1</a>')+'</p>';
    });
    if(list)out+='<ul>'+list.map(function(i){return'<li>'+esc(i)+'</li>'}).join('')+'</ul>';
  });
  var nav=[['privacy','プライバシーポリシー'],['terms','利用規約'],['support','サポート'],['licenses','ライセンス表示']].map(function(n){
    return n[0]===page?'<span>'+n[1]+'</span>':'<a href="'+n[0]+'.html">'+n[1]+'</a>'}).join(' ・ ');
  document.getElementById('doc').innerHTML=out;
  document.getElementById('nav').innerHTML=nav+'<br><small>'+esc(fill('© {developer}　バージョン {version}'))+'</small>';
  document.title=doc.title+' | '+APP_INFO.name;
})();
