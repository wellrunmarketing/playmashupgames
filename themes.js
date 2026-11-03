// To add a theme: add a new key below as {label:'Shown Label', names:['Artist One','Artist Two']}, then set ACTIVE_THEME or use ?theme=key.
const ACTIVE_THEME='yacht';
const THEMES={
 classic80s:{label:"'80s Classic Rock",names:["Def Leppard", "Billy Joel", "Stryper", "Pat Benatar", "Paul McCartney & Wings", "Bryan Adams", "Journey", "John Mellencamp", "Bon Jovi", "Bruce Springsteen", "Van Halen", "Rick Springfield", "Foreigner", "Eddie Money", "Boston", "Steve Winwood", "REO Speedwagon", "Night Ranger", "Heart", "Survivor"]},
 yacht:{label:'Yacht Rock',names:["Hall & Oates", "Christopher Cross", "Toto", "Michael McDonald", "Steely Dan", "Kenny Loggins", "Ambrosia", "Boz Scaggs", "The Doobie Brothers", "Robbie Dupree", "Pablo Cruise", "Michael Franks", "Seals & Crofts", "Rupert Holmes"]},
 classicrock:{label:'Classic Rock',names:["Led Zeppelin","The Rolling Stones","Eagles","Fleetwood Mac","Lynyrd Skynyrd","The Who","Tom Petty","Creedence Clearwater Revival","Aerosmith","Bob Seger"]},
 easy:{label:'Easy Listening',names:["Carpenters","Barry Manilow","Anne Murray","Bread","Neil Diamond","Olivia Newton-John","Air Supply","Dan Fogelberg","Captain & Tennille","John Denver"]},
 punk:{label:'Punk',names:["Ramones","The Clash","Sex Pistols","Blondie","Green Day","The Offspring","Bad Religion","Social Distortion","Less Than Jake","Buzzcocks"]},
 jazzfusion:{label:'Jazz Fusion',names:["Weather Report","Return to Forever","Pat Metheny Group","Spyro Gyra","Chick Corea","Herbie Hancock","Jeff Beck","Mahavishnu Orchestra","Yellowjackets","The Crusaders"]}
};
function musicTicker(){const k=new URLSearchParams(location.search).get('theme');const t=THEMES[k]||THEMES[ACTIVE_THEME];
 const h=t.names.map(n=>`<span class="tk-item">${n.replace(/&/g,'&amp;')}</span><span class="tk-item">♪</span>`).join('');
 document.getElementById('mtk').innerHTML=h+h;document.getElementById('mtk-label').textContent='Now Spinning: '+t.label}
document.addEventListener('DOMContentLoaded',musicTicker);
