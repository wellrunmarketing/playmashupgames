/* Sammy's Mashup Games – neon "sound waves" equalizer. Self-contained, no deps. */
(function(){
var N=16,COLORS=['#ff7a18','#ff4fa3','#19e3c9','#ffd23f'];
var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
var css=`.sw-eq{display:flex;align-items:flex-end;justify-content:center;gap:3px;height:44px;margin:8px auto;max-width:320px;padding:4px 8px;border-radius:12px;background:rgba(10,0,30,.55);opacity:.35;transition:opacity .4s}
.sw-eq.on{opacity:1;box-shadow:0 0 18px rgba(255,79,163,.45)}
.sw-eq i{flex:1;min-width:3px;max-width:14px;height:100%;border-radius:3px 3px 1px 1px;transform-origin:bottom;transform:scaleY(.08);will-change:transform;transition:transform .5s ease}
.sw-eq.on i{transition:none}
.sw-eq.css.on i{animation:swb .9s ease-in-out infinite alternate}
@keyframes swb{0%{transform:scaleY(.15)}50%{transform:scaleY(.85)}100%{transform:scaleY(.35)}}
.sw-glow{animation:swg 1.2s ease-in-out infinite;border-radius:12px}
@keyframes swg{0%,100%{box-shadow:0 0 6px 2px #ff7a18,0 0 14px 4px #ff4fa3}50%{box-shadow:0 0 12px 4px #19e3c9,0 0 26px 8px #ffd23f}}
.ask .sw-eq{position:absolute;bottom:76px;right:0;width:150px;height:34px;margin:0}
.ask .sw-eq:not(.on){display:none}
@media (prefers-reduced-motion: reduce){.sw-eq i,.sw-eq.css.on i{animation:none!important;transition:none}.sw-eq.on i{transform:scaleY(.5)}.sw-glow{animation:none;box-shadow:0 0 10px 3px #ff4fa3}}`;
var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);

var ctx=null,noWA=reduce||!(window.AudioContext||window.webkitAudioContext),active=new Set(),raf=0;
function makeEq(){var d=document.createElement('div');d.className='sw-eq';d.setAttribute('aria-hidden','true');
 for(var i=0;i<N;i++){var b=document.createElement('i');var c1=COLORS[i%4],c2=COLORS[(i+1)%4];
  b.style.background='linear-gradient(to top,'+c1+','+c2+')';b.style.boxShadow='0 0 6px '+c1;b.style.animationDelay=(-(i*137)%900)/1000+'s';d.appendChild(b)}
 return d}
function anchorFor(a){ // where to put bars + which button glows
 if(a.id==='sammyClip'){var t=document.getElementById('sammyTap');return {btn:t,host:t&&t.parentNode,append:true}}
 var snd=[].find.call(document.querySelectorAll('.snd'),function(b){return b._a===a});
 if(snd)return {btn:snd,host:snd.parentNode,after:snd};
 if(a.isConnected)return {btn:a,host:a.parentNode,after:a};
 return null}
function setup(a){if(a._sw)return a._sw;var an=anchorFor(a);if(!an||!an.host)return null;
 var eq=makeEq();if(an.append){an.host.style.position=an.host.style.position||'fixed';an.host.appendChild(eq)}else an.host.insertBefore(eq,an.after.nextSibling);
 var s={a:a,eq:eq,bars:eq.children,btn:an.btn,an:null,data:null};
 if(!noWA){try{ctx=ctx||new(window.AudioContext||window.webkitAudioContext)();
  var src=ctx.createMediaElementSource(a),A=ctx.createAnalyser();A.fftSize=64;A.smoothingTimeConstant=.75;
  src.connect(A);A.connect(ctx.destination);s.an=A;s.data=new Uint8Array(A.frequencyBinCount)}catch(e){s.an=null}}
 if(!s.an)eq.classList.add('css');
 a._sw=s;return s}
function loop(){raf=0;var any=false;
 active.forEach(function(s){if(!s.an)return;any=true;s.an.getByteFrequencyData(s.data);var L=s.data.length-4;
  for(var i=0;i<N;i++){var v=s.data[Math.floor(i*L/N)]/255;s.bars[i].style.transform='scaleY('+Math.max(.06,v).toFixed(3)+')'}});
 if(any)raf=requestAnimationFrame(loop)}
function on(a){if(!(a instanceof HTMLAudioElement))return;var s=setup(a);if(!s)return;
 if(ctx&&ctx.state==='suspended')ctx.resume();
 active.add(s);s.eq.classList.add('on');if(s.btn)s.btn.classList.add('sw-glow');
 if(s.an&&!reduce&&!raf)raf=requestAnimationFrame(loop)}
function off(a){var s=a&&a._sw;if(!s)return;active.delete(s);s.eq.classList.remove('on');if(s.btn)s.btn.classList.remove('sw-glow');
 for(var i=0;i<N;i++)s.bars[i].style.transform=''}
// in-page <audio> tags (play/pause don't bubble, so capture)
document.addEventListener('play',function(e){on(e.target)},true);
['pause','ended','emptied'].forEach(function(t){document.addEventListener(t,function(e){off(e.target)},true)});
// detached new Audio() from mm.js .snd buttons
var P=HTMLMediaElement.prototype,op=P.play;
P.play=function(){var a=this;if(!a.isConnected&&a instanceof HTMLAudioElement&&!a._swh){a._swh=1;
  a.addEventListener('playing',function(){on(a)});['pause','ended'].forEach(function(t){a.addEventListener(t,function(){off(a)})})}
 return op.apply(this,arguments)};
})();
