// Movie Mash round engine. TEXT ONLY: quotes from /workspace/shared/movie-mash/quote_bank.md ([CHECK] lines skipped).
function norm(s){return (s||'').toLowerCase().replace(/[^a-z0-9 ]/g,'').replace(/\s+/g,' ').trim()}
function hit(g,ans){g=norm(g);if(!g)return false;const a=norm(ans);if(g===a)return true;
 const words=a.split(' ').filter(w=>w.length>4);return (a.includes(g)&&g.length>=4)||words.some(w=>g.split(' ').includes(w))}
function kinetic(q){let n=0;return q.split(' ').map(w=>`<span class="kw" style="animation-delay:${(n++)*0.18}s">${w}</span>`).join(' ')}
function cast(){return `<div class="cast"><img class="c c1" src="chars/gp-look.png" alt="Guinea pig"><img class="c c2" src="chars/dog-tilt.png" alt="Dachshund"><img class="c c3" src="chars/mini-sammy-face-surprised.png" alt="Mini Sammy"></div>`}
function soundBtn(src){return `<button type="button" class="snd" data-src="${src}" aria-pressed="false">🔇 Sound off · ▶ Play music</button>`}
document.addEventListener('click',e=>{const b=e.target.closest('.snd');if(!b)return;
 if(!b._a){b._a=new Audio(b.dataset.src);b._a.onended=()=>{b.setAttribute('aria-pressed','false');b.textContent='🔇 Sound off · ▶ Play music'}}
 if(b._a.paused){b._a.currentTime=0;b._a.play();b.setAttribute('aria-pressed','true');b.textContent='🔊 Sound on · ⏸ Pause'}
 else{b._a.pause();b.setAttribute('aria-pressed','false');b.textContent='🔇 Sound off · ▶ Play music'}});
// Round timer: change this one constant to change every round's length.
const ROUND_SECONDS=60;
(function(){const c=document.createElement('style');c.textContent=`.mm-timer{position:sticky;top:0;z-index:5;background:rgba(10,0,30,.85);border-radius:10px;padding:6px 10px;margin:10px 0;display:flex;align-items:center;gap:10px;font-weight:700}
.mm-timer .bar{flex:1;height:12px;border-radius:6px;background:#333;overflow:hidden}.mm-timer .fill{height:100%;width:100%;background:linear-gradient(90deg,#19e3c9,#ffd23f,#ff7a18);transition:width .25s linear}
.mm-timer.hot .fill{background:#ff2a2a;animation:mmhot .5s ease-in-out infinite alternate}.mm-timer.hot .t{color:#ff4a4a}
@keyframes mmhot{from{opacity:1;box-shadow:0 0 4px #f00}to{opacity:.45;box-shadow:0 0 14px #f00}}
@media (prefers-reduced-motion: reduce){.mm-timer.hot .fill{animation:none}}`;document.head.appendChild(c)})();
// ---- Randomizer: every page load deals fresh rounds from the full bank on this page,
// never repeating a question this session (sessionStorage), with deep-cut bonus questions rotated in at random.
const MM_SEEN='pmg_seen_v1',MM_BONUS_PTS=200; // every round ends with one deep-cut bonus, worth up to 200 speed pts
function mmShuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
const mmQueue=[];
function mmRound(el,Q,music,o){mmQueue.push({el,Q,music,o});if(mmQueue.length==1)setTimeout(mmDeal,0)}
function mmDeal(){let seen;try{seen=new Set(JSON.parse(sessionStorage.getItem(MM_SEEN))||[])}catch(e){seen=new Set()}
 const bank=mmQueue.flatMap(r=>r.Q),deep=(typeof DEEP_CUTS!=='undefined'?DEEP_CUTS:[]).map(d=>({deep:1,q:d.q,a:d.a,wrong:d.wrong||[],note:d.note}));
 let fresh=mmShuffle(bank.filter(q=>!seen.has(q.q)));
 const need=mmQueue.reduce((n,r)=>n+r.Q.length,0);
 if(fresh.length<need){bank.forEach(q=>seen.delete(q.q));fresh=mmShuffle(fresh.concat(mmShuffle(bank.filter(q=>!fresh.includes(q)))))}
 let dfresh=mmShuffle(deep.filter(d=>!seen.has(d.q)));if(!dfresh.length){deep.forEach(d=>seen.delete(d.q));dfresh=mmShuffle(deep)}
 const order=mmShuffle(mmQueue.map((_,i)=>i));let k=0;
 order.forEach(i=>{const r=mmQueue[i];const Q=fresh.slice(k,k+r.Q.length);k+=r.Q.length;
  if(!dfresh.length)dfresh=mmShuffle(deep.map(x=>Object.assign({},x)));if(dfresh.length){const d=Object.assign({},dfresh.shift());d.choices=mmShuffle([d.a,...d.wrong]);Q.push(d)}
  Q.forEach(q=>seen.add(q.q));r.Q2=Q});
 try{sessionStorage.setItem(MM_SEEN,JSON.stringify([...seen]))}catch(e){}
 mmQueue.forEach(r=>mmRoundNow(r.el,r.Q2,r.music,r.o))}
function mmRoundNow(el,Q,music,o){o=o||{};
 let h=`<div class="stage">${cast()}<div class="card mash">${Q.map(q=>`<div class="ql">${q.deep?'🎷 Deep cut: '+q.q:'“'+kinetic(q.q)+'”'}</div>`).join('<div class=sep>✦</div>')}</div></div>
 <div style="text-align:center;margin:10px 0">${soundBtn(music)} <button type="button" class="snd2 btn alt" style="padding:8px 18px;font-size:.9rem">↻ Replay the mash</button></div><div class="mm-timer" role="timer" aria-live="off"><span class="t">⏱ ${ROUND_SECONDS}s</span><div class="bar"><div class="fill"></div></div><span>Score: <b class="live">0</b></span></div><p class="mm-hint" style="text-align:center;color:#aaa;font-size:.85rem">Clock starts when you press play or start typing. Faster correct answers score more.</p><form class="grid" style="margin-top:14px">`;
 Q.forEach((q,i)=>{if(q.deep){h+=`<div class="card"><b>🎷 Bonus deep cut · up to ${MM_BONUS_PTS} pts</b><p>${q.q}</p>${q.choices.map(c=>`<label style="display:block"><input type="radio" name="d${i}" value="${c.replace(/"/g,'&quot;')}"> ${c}</label>`).join('')}</div>`;return}h+=`<div class="card"><b>Quote ${i+1}</b><label>Movie<input name="m${i}"></label><label>Actor<input name="a${i}"></label><label>Year<input name="y${i}" inputmode="numeric"></label></div>`});
 h+=`<div style="grid-column:1/-1;text-align:center"><button class="btn alt" type="submit">Reveal the answers</button></div></form><div class="reveal card"></div>`;
 el.innerHTML=h;const f=el.querySelector('form'),r=el.querySelector('.reveal'),st=el.querySelector('.stage');
 el.querySelector('.snd2').onclick=()=>{const m=el.querySelector('.mash');m.innerHTML=m.innerHTML;st.classList.remove('react');void st.offsetWidth;st.classList.add('react')};
 const tm=el.querySelector('.mm-timer'),tt=tm.querySelector('.t'),fill=tm.querySelector('.fill'),live=tm.querySelector('.live');
 let t0=0,iv=0,doneR=false;const at={};
 const chk=(n,v)=>{const i=+n.slice(1),q=Q[i];if(!q)return false;return n[0]=='d'?v===q.a:n[0]=='m'?hit(v,q.movie):n[0]=='a'?hit(v,q.actor):norm(v)===q.year};
 const pts=sec=>Math.round(50+50*Math.max(0,ROUND_SECONDS-sec)/ROUND_SECONDS); // 100 instant → 50 at the buzzer
 const el_=()=>t0?(Date.now()-t0)/1000:0;
 const liveScore=()=>{let p=0;for(const k in at)p+=at[k].ok?pts(at[k].sec)*(k[0]=='d'?MM_BONUS_PTS/100:1):0;live.textContent=p;return p};
 const tick=()=>{const left=Math.max(0,ROUND_SECONDS-el_());tt.textContent='⏱ '+Math.ceil(left)+'s';fill.style.width=(100*left/ROUND_SECONDS)+'%';tm.classList.toggle('hot',left<=5&&left>0);
  if(left<=0){clearInterval(iv);tt.textContent="⏱ Time's up!";doneR=true;f.requestSubmit?f.requestSubmit():f.dispatchEvent(new Event('submit',{cancelable:true}))}};
 const start=()=>{if(t0||doneR)return;t0=Date.now();iv=setInterval(tick,250);tick()};
 el.addEventListener('click',e=>{if(e.target.closest('.snd'))start()});
 f.addEventListener('focusin',start);
 f.addEventListener('change',e=>{const n=e.target.name;if(!n||doneR)return;start();at[n]={sec:el_(),ok:chk(n,e.target.value)};liveScore()});
 f.onsubmit=e=>{e.preventDefault();if(f.dataset.done)return;f.dataset.done=1;doneR=true;clearInterval(iv);tm.classList.remove('hot');
  const d=new FormData(f);let s=0,out='';
  for(const [n,v] of d){if(!at[n]&&String(v).trim())at[n]={sec:el_(),ok:chk(n,v)}}
  f.querySelectorAll('input,button').forEach(x=>x.disabled=true);
  let max=0;Q.forEach((q,i)=>{if(q.deep){const ok=d.get('d'+i)===q.a;s+=ok;max+=1;out+=`<div><b>🎷 Deep cut</b>: ${q.q}<br>${ok?'✅':'▫️'} ${q.a}<br><small>${q.note||''}</small></div>`;return}max+=3;const ok=[hit(d.get('m'+i),q.movie),hit(d.get('a'+i),q.actor),norm(d.get('y'+i))===q.year];ok.forEach(x=>s+=x);
   out+=`<div><b>Quote ${i+1}</b>: “${q.q}”<br>${ok[0]?'✅':'▫️'} Movie: ${q.movie}<br>${ok[1]?'✅':'▫️'} Actor: ${q.actor}<br>${ok[2]?'✅':'▫️'} Year: ${q.year}</div>`});
  const good=s>=max/2;
  el.querySelector('.c3').src='chars/mini-sammy-face-'+(good?'smile':'surprised')+'.png';
  el.querySelector('.c1').src='chars/'+(good?'gp-carrot':'gp-look')+'.png';el.querySelector('.c2').src='chars/'+(good?'dog-front':'dog-tilt')+'.png';
  st.classList.remove('react');void st.offsetWidth;st.classList.add('react');
  const pts_=liveScore(),cs=Object.values(at).filter(x=>x.ok),avg=cs.length?(cs.reduce((a,x)=>a+x.sec,0)/cs.length).toFixed(1):'–',used=Math.min(ROUND_SECONDS,el_()).toFixed(1);
  r.innerHTML=`<div class="scoreboard mm-sum"><div><small>Correct</small><b>${s}/${max}</b></div><div><small>Speed points</small><b>${pts_}</b></div><div><small>Avg time per correct answer</small><b>${avg}s</b></div><div><small>Time used</small><b>${used}s</b></div></div><p class="ok score"><b>You got ${s} / ${max}.</b> ${good?'The crew is cheering!':'The crew is stumped too… try another round!'}</p>`+(o.key?pmgRecord(o.key,o.label,s,max):'')+(o.bonus?pmgUnlock(o.bonus,s,max):'')+`<div class="grid">${out}</div>`;r.classList.add('show');r.scrollIntoView({behavior:'smooth',block:'nearest'})}}
