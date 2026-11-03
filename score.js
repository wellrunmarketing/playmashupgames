// Local scores only (localStorage). A shared leaderboard needs a backend later.
const PMG='pmg_scores_v1';
function pmgLoad(){try{return JSON.parse(localStorage.getItem(PMG))||{total:0,best:{},log:[]}}catch(e){return {total:0,best:{},log:[]}}}
function pmgSave(d){localStorage.setItem(PMG,JSON.stringify(d))}
function pmgRecord(key,label,s,max){const d=pmgLoad();d.total+=s;const prev=d.best[key]||0;d.best[key]=Math.max(prev,s);
 d.log.push({label,s,max,t:Date.now()});d.log=d.log.slice(-50);pmgSave(d);pmgRender();pmgTicker();
 return `<div class="scoreboard"><div><small>This round</small><b>${s}/${max}</b></div><div><small>Your best (this round)</small><b>${d.best[key]}/${max}</b>${s>prev&&prev>0?' 🎉 New best!':''}</div><div><small>Running total</small><b>${d.total}</b></div></div>`}
function pmgUnlock(id,s,max){const el=document.getElementById(id);if(!el)return '';if(s>=Math.ceil(max*2/3)){el.classList.remove('locked');el.classList.add('unlocked');return `<p class="ok">🔓 Bonus round unlocked! <a href="#${id}" style="color:var(--y)">Play it ↓</a></p>`}
 return `<p style="color:#aaa">Score ${Math.ceil(max*2/3)}+ to unlock the bonus round.</p>`}
function pmgRender(){const d=pmgLoad();document.querySelectorAll('.running').forEach(e=>e.textContent=d.total);
 const lb=document.getElementById('leader');if(!lb)return;
 const mine=d.log.map(x=>({n:'You',r:x.label,s:x.s,m:x.max,me:1}));
 const sample=[{n:'Sample Player A',r:'Round 1',s:11,m:12},{n:'Sample Player B',r:'Movie Mash',s:8,m:9},{n:'Sample Player C',r:'Round 1',s:7,m:12}];
 const rows=[...mine,...sample].sort((a,b)=>b.s/b.m-a.s/a.m).slice(0,10);
 lb.innerHTML=rows.map((r,i)=>`<tr class="${r.me?'me':'sample'}"><td>${i+1}</td><td>${r.n}${r.me?'':' <span class=tag>SAMPLE</span>'}</td><td>${r.r}</td><td>${r.s}/${r.m}</td></tr>`).join('')}
function pmgTicker(){const t=document.getElementById('tk');if(!t)return;const d=pmgLoad(),S=' <span class="tag">SAMPLE</span>';
 const day=new Date().toDateString(),today=d.log.filter(x=>new Date(x.t).toDateString()==day);
 const top=today.length?today.reduce((a,b)=>b.s/b.max>a.s/a.max?b:a):null;
 const last=d.log.length?d.log[d.log.length-1]:null;
 const L=[top?`Top score today: ${top.s}/${top.max} (${top.label})`:'Top score today: 11/12'+S,
 last?`Latest high score: You – ${last.s} points`:'Latest high score: Sample Player A – 11 points'+S,
 'New round every week','Christmas Movie Mash is live','Step right up, if you have what it takes'];
 const h=L.map(x=>`<span class="tk-item">★ ${x}</span>`).join('');t.innerHTML=h+h}
document.addEventListener('DOMContentLoaded',()=>{pmgRender();pmgTicker()});
