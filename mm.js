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
function mmRound(el,Q,music,o){o=o||{};
 let h=`<div class="stage">${cast()}<div class="card mash">${Q.map(q=>`<div class="ql">“${kinetic(q.q)}”</div>`).join('<div class=sep>✦</div>')}</div></div>
 <div style="text-align:center;margin:10px 0">${soundBtn(music)} <button type="button" class="snd2 btn alt" style="padding:8px 18px;font-size:.9rem">↻ Replay the mash</button></div><form class="grid" style="margin-top:14px">`;
 Q.forEach((q,i)=>{h+=`<div class="card"><b>Quote ${i+1}</b><label>Movie<input name="m${i}"></label><label>Actor<input name="a${i}"></label><label>Year<input name="y${i}" inputmode="numeric"></label></div>`});
 h+=`<div style="grid-column:1/-1;text-align:center"><button class="btn alt" type="submit">Reveal the answers</button></div></form><div class="reveal card"></div>`;
 el.innerHTML=h;const f=el.querySelector('form'),r=el.querySelector('.reveal'),st=el.querySelector('.stage');
 el.querySelector('.snd2').onclick=()=>{const m=el.querySelector('.mash');m.innerHTML=m.innerHTML;st.classList.remove('react');void st.offsetWidth;st.classList.add('react')};
 f.onsubmit=e=>{e.preventDefault();const d=new FormData(f);let s=0,out='';
  Q.forEach((q,i)=>{const ok=[hit(d.get('m'+i),q.movie),hit(d.get('a'+i),q.actor),norm(d.get('y'+i))===q.year];ok.forEach(x=>s+=x);
   out+=`<div><b>Quote ${i+1}</b>: “${q.q}”<br>${ok[0]?'✅':'▫️'} Movie: ${q.movie}<br>${ok[1]?'✅':'▫️'} Actor: ${q.actor}<br>${ok[2]?'✅':'▫️'} Year: ${q.year}</div>`});
  const max=Q.length*3,good=s>=max/2;
  el.querySelector('.c3').src='chars/mini-sammy-face-'+(good?'smile':'surprised')+'.png';
  el.querySelector('.c1').src='chars/'+(good?'gp-carrot':'gp-look')+'.png';el.querySelector('.c2').src='chars/'+(good?'dog-front':'dog-tilt')+'.png';
  st.classList.remove('react');void st.offsetWidth;st.classList.add('react');
  r.innerHTML=`<p class="ok score"><b>You got ${s} / ${max}.</b> ${good?'The crew is cheering!':'The crew is stumped too… try another round!'}</p>`+(o.key?pmgRecord(o.key,o.label,s,max):'')+(o.bonus?pmgUnlock(o.bonus,s,max):'')+`<div class="grid">${out}</div>`;r.classList.add('show');r.scrollIntoView({behavior:'smooth',block:'nearest'})}}
