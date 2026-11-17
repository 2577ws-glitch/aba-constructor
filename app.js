const FK=[['','—'],['#ffe14d','Люди (жёлтый)'],['#7fd36b','Действия (зелёный)'],['#7fb2ff','Описания (синий)'],['#ffb347','Предметы (оранжевый)'],['#ff9ecb','Социальные (розовый)'],['#ff6b6b','Отрицание/стоп (красный)'],['#ffffff','Разное (белый)']];
const PS={A4:[210,297],A5:[148,210]};const $=id=>document.getElementById(id);
let P,sel=-1,selImg=null;
/* Язык листа: шаблон печатается целиком на одном языке (RU или KZ). KZ берётся из словаря KK (templates.js), иначе — русский текст. */
let LANG=(()=>{try{return localStorage.getItem('abaLang')==='kz'?'kz':'ru'}catch(e){return 'ru'}})();
const L=s=>{s=String(s??'');return LANG==='kz'&&s&&KK[s]?KK[s]:s};
function kzMissing(){const set=new Set(),add=x=>{x=String(x??'').trim();if(x&&!/^[\d\s.:–%-]+$/.test(x)&&!/^\S(\s+\S)*$/.test(x)&&!KK[x])set.add(x)};
 T.forEach(t=>{add(t.name);add(t.title);(t.caps||[]).forEach(add);(t.rowLabels||[]).forEach(add);(t.colHeads||[]).forEach(add);(t.headers||[]).forEach(add);(t.col0||[]).forEach(add);Object.values(t.colv||{}).flat().forEach(add);add(t.legend);add(t.notes);add(t.extraText)});
 SVG_TXT.forEach(add);return [...set]}
function newProject(id){const t=T.find(x=>x.id==id);const n=(t.cols||0)*(t.rows||0)*(t.pages||1);
 return {v:2,tpl:t.id,title:t.title||t.name.replace(/\s*\(.*\)$/,''),page:t.page||'A4',orient:t.orient||'p',cols:t.cols||0,rows:t.rows||0,pages:t.pages||1,
 w:t.w??t.size??0,h:t.h??t.size??0,frame:'black',fc:'#2c5d8f',cut:!!t.cut,fs:t.fs??(t.small?9:14),rowsN:t.rowsN||10,images:[],
 cells:Array.from({length:n},(_,i)=>({ru:(t.caps||[])[i]||'',kz:'',fk:'',img:null,bg:''})),
 headers:(t.headers||[]).slice(),table:[]};}
function tpl(){return T.find(x=>x.id==P.tpl)}
function fitCells(){const n=P.cols*P.rows*P.pages;while(P.cells.length<n)P.cells.push({ru:'',kz:'',fk:'',img:null,bg:''});}
const esc=s=>String(s||'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function img(i){return P.images[i]||null}
// ---------- SVG extras (печать: чёрные линии на белом; цвет — только тонкие акценты там, где он несёт смысл) ----------
function svg(w,h,body){return `<svg class="extra" xmlns="http://www.w3.org/2000/svg" width="${w}mm" height="${h}mm" viewBox="0 0 ${w} ${h}" font-family="Nunito, Arial, sans-serif" font-weight="bold">${body}</svg>`}
const SVG_TXT=['ЖАРКО','ТЕПЛО','ХОЛОДНО','Зима','Весна','Лето','Осень','Я хочу','Спокоен — играю, работаю','Тревожно — дышу, сжимаю мяч','Очень плохо — наушники, тихий угол','Радость','Грусть','Злость','Страх','Удивление','Спокойствие','СТАРТ','ФИНИШ','Найди числа по порядку от 1 до 25','Время: ______','Диктант: ______________________________________________'];
// сектора круга: белые, тонкий контур; acc — тонкая цветная дуга по краю сектора (необязательно)
function sectors(cx,cy,r,labels,acc,fs){let s='',n=labels.length;labels.forEach((l,i)=>{const a0=2*Math.PI*i/n-Math.PI/2,a1=2*Math.PI*(i+1)/n-Math.PI/2,am=(a0+a1)/2,P=(a,rr)=>`${cx+rr*Math.cos(a)},${cy+rr*Math.sin(a)}`;
 s+=`<path d="M${cx},${cy} L${P(a0,r)} A${r},${r} 0 0 1 ${P(a1,r)} Z" fill="#fff" stroke="#000" stroke-width="0.5"/>`;
 if(acc&&acc[i])s+=`<path d="M${P(a0+0.04,r-1.6)} A${r-1.6},${r-1.6} 0 0 1 ${P(a1-0.04,r-1.6)}" fill="none" stroke="${acc[i]}" stroke-width="2.2"/>`;
 s+=`<text x="${cx+r*.62*Math.cos(am)}" y="${cy+r*.62*Math.sin(am)}" font-size="${fs}" text-anchor="middle" dominant-baseline="middle" data-mw="${(2*r*.62*Math.sin(Math.PI/n)*.7).toFixed(1)}">${esc(L(l))}</text>`});
 return s+`<circle cx="${cx}" cy="${cy}" r="2" fill="#000"/>`}
const EX={
weather:(W,H)=>{const h=Math.min(90,H),tb=h-15;let tk='';for(let i=0;i<=10;i++){const y=5+4+i*(tb-14)/10;tk+=`<line x1="26" y1="${y}" x2="${i%5?29:32}" y2="${y}" stroke="${i<4?'#d62828':i>6?'#1d6fd6':'#000'}" stroke-width="0.6"/>`}
 return {h,svg:svg(W,h,`<rect x="12" y="5" width="12" height="${tb-6}" rx="6" fill="#fff" stroke="#000" stroke-width="0.7"/><circle cx="18" cy="${tb+3}" r="8" fill="#fff" stroke="#000" stroke-width="0.7"/><circle cx="18" cy="${tb+3}" r="4" fill="none" stroke="#d62828" stroke-width="1.2"/>${tk}
<text x="35" y="12" font-size="5" fill="#d62828">▲</text><text x="41" y="12" font-size="5">${L('ЖАРКО')}</text><text x="41" y="${h/2}" font-size="5">${L('ТЕПЛО')}</text><text x="35" y="${h-12}" font-size="5" fill="#1d6fd6">▼</text><text x="41" y="${h-12}" font-size="5">${L('ХОЛОДНО')}</text>
${sectors(W-h/2-5,h/2,h/2-3,['Зима','Весна','Лето','Осень'],['#1d6fd6','#2e9e3e','#e0a400','#d2691e'],6)}<line x1="${W-h/2-5}" y1="${h/2}" x2="${W-h/2-5}" y2="12" stroke="#000" stroke-width="1.4"/><polygon points="${W-h/2-8},14 ${W-h/2-2},14 ${W-h/2-5},9" fill="#000"/>`)}},
timer:(W,H)=>{const r=Math.min(55,H/2-10);return {h:2*r+30,svg:svg(W,2*r+30,sectors(W/2,r+3,r,['1','2','3','4','5'],null,10)+
 [0,1,2,3,4].map(i=>`<circle cx="${W/2-48+i*24}" cy="${2*r+18}" r="9" fill="none" stroke="#000" stroke-width="0.6"/><text x="${W/2-48+i*24}" y="${2*r+20}" font-size="6" text-anchor="middle">${5-i}</text>`).join(''))}},
strip:(W)=>({h:34,svg:svg(W,34,`<rect x="2" y="2" width="${W-4}" height="30" rx="3" fill="#fff" stroke="#000" stroke-width="0.8"/><rect x="5" y="5" width="30" height="24" fill="#fff" stroke="#000"/><text x="20" y="19" font-size="6" text-anchor="middle">${esc(L('Я хочу'))}</text>`+[0,1,2].map(i=>`<rect x="${40+i*30}" y="5" width="26" height="24" fill="none" stroke="#999" stroke-dasharray="2"/>`).join(''))}),
scale:(W)=>({h:60,svg:svg(W,60,[['#2e9e3e','Спокоен — играю, работаю'],['#e0a400','Тревожно — дышу, сжимаю мяч'],['#d62828','Очень плохо — наушники, тихий угол']].map((c,i)=>`<rect x="2" y="${2+i*19}" width="${W-4}" height="17" rx="3" fill="#fff" stroke="#000" stroke-width="0.5"/><rect x="4" y="${4+i*19}" width="3" height="13" rx="1" fill="${c[0]}"/><text x="11" y="${13+i*19}" font-size="6">${3-i}. ${esc(L(c[1]))}</text>`).join(''))}),
emotions:(W,H)=>{const r=Math.min(90,H-10,W-10)/2;return {h:2*r+6,svg:svg(W,2*r+6,sectors(W/2,r+3,r,['Радость','Грусть','Злость','Страх','Удивление','Спокойствие'],['#e0a400','#1d6fd6','#d62828','#7b3fa0','#d2691e','#2e9e3e'],5)+`<polygon points="${W/2-3},${r+3} ${W/2+3},${r+3} ${W/2},${r*0.3}" fill="#000"/>`)}},
tracing:(W,H)=>{const rh=(H-5)/6;let s='',d=`stroke="#666" stroke-width="1" stroke-dasharray="3 2" fill="none"`;
 for(let k=0;k<6;k++){const y=k*rh+rh/2;let p='';
  if(k==0)p=`M15,${y} H${W-5}`;
  if(k==1){p=`M15,${y}`;for(let x=15;x<W-10;x+=20)p+=` q5,-${rh/3} 10,0 t10,0`}
  if(k==2){p=`M15,${y+rh/4}`;for(let x=15;x<W-10;x+=14)p+=` l7,-${rh/2} l7,${rh/2}`}
  if(k==3){p=`M15,${y}`;for(let x=15;x<W-20;x+=16)p+=` c8,-${rh/2} 8,0 0,0 c0,0 0,${rh/4} 16,0`}
  if(k==4){for(let c=0;c<4;c++){const cx=30+c*(W-40)/4;p+=`M${cx},${y} `;for(let a=0;a<18;a++){const ang=a*0.7,rr=1+a*0.55*rh/24;p+=`L${cx+rr*Math.cos(ang)},${y+rr*Math.sin(ang)} `}}}
  if(k==5){p=`M15,${y+rh/3} h${rh*.6} v-${rh*.6} h-${rh*.6}z M${W/2-rh/3},${y} m0,0 a${rh/3},${rh/3} 0 1,0 ${rh*.66},0 a${rh/3},${rh/3} 0 1,0 -${rh*.66},0 M${W-30},${y+rh/3} l${rh/3},-${rh*.66} l${rh/3},${rh*.66}z`}
  s+=`<circle cx="8" cy="${k==2?y+rh/4:y}" r="2.5" fill="#000"/><path d="${p}" ${d}/>`}
 return {h:H,svg:svg(W,H,s)}},
maze:(W,H)=>{const c=W/2,y=H/2;let p=(sgn)=>`M${c},${y} C${c+sgn*W*.15},${y-H*.45} ${c+sgn*W*.25},${y+H*.45} ${c+sgn*W*.35},${y} S${c+sgn*W*.42},${y-H*.3} ${c+sgn*(W/2-8)},${y-H*.3}`;
 return {h:H,svg:svg(W,H,[1,-1].map(s=>`<path d="${p(s)}" stroke="#000" stroke-width="15" fill="none" stroke-linecap="round"/><path d="${p(s)}" stroke="#fff" stroke-width="13" fill="none" stroke-linecap="round"/><path d="${p(s)}" stroke="#666" stroke-width="0.8" stroke-dasharray="3 2" fill="none"/><text x="${c+s*(W/2-15)}" y="${y-H*.3-10}" font-size="6" text-anchor="middle">${L('ФИНИШ')}</text>`).join('')+`<circle cx="${c}" cy="${y}" r="5" fill="none" stroke="#000" stroke-width="1"/><text x="${c}" y="${y+14}" font-size="6" text-anchor="middle">${L('СТАРТ')}</text>`)}},
eight:(W,H)=>{const a=W/2-12,c=W/2,y=H/2;let p='';for(let t=0;t<=6.3;t+=0.05){const s=Math.sin(t),k=1+s*s;p+=(t?'L':'M')+(c+a*Math.cos(t)/k)+','+(y+a*Math.sin(t)*Math.cos(t)/k*1.3)+' '}
 return {h:H,svg:svg(W,H,`<path d="${p}Z" stroke="#000" stroke-width="19" fill="none"/><path d="${p}Z" stroke="#fff" stroke-width="17" fill="none"/><path d="${p}Z" stroke="#555" stroke-width="1" stroke-dasharray="4 3" fill="none"/><circle cx="${c}" cy="${y}" r="3" fill="#000"/>`)}},
geo:(W,H)=>{let s='',bw=(W-10)/2,bh=(H-50)/2;const figs=['M0,0 L4,0 L4,4 L0,4Z','M2,0 L4,4 L0,4Z','M0,2 L2,0 L4,2 L2,4Z','M0,4 L1,0 L3,0 L4,4Z'];
 for(let b=0;b<4;b++){const ox=5+(b%2)*bw,oy=(b>>1)*bh,st=Math.min(bw,bh-6)/5,sx=ox+(bw-st*4)/2,sy=oy+4;s+=`<rect x="${ox+2}" y="${oy+1}" width="${bw-4}" height="${bh-2}" fill="none" stroke="#000" stroke-dasharray="2"/>`;
  for(let i=0;i<5;i++)for(let j=0;j<5;j++)s+=`<circle cx="${sx+i*st}" cy="${sy+j*st}" r="1.2"/>`;
  s+=`<path d="${figs[b]}" transform="translate(${sx},${sy}) scale(${st})" fill="none" stroke="#000" stroke-width="${2/st}" stroke-linejoin="round"/>`}
 // бусы: чёрная / белая / с крестиком — различимы на ч/б принтере
 const B={k:'fill="#000" stroke="#000"',w:'fill="#fff" stroke="#000"',x:'fill="#fff" stroke="#000"'};const seqs=[['k','w'],['k','k','w','w'],['k','w','x']];
 seqs.forEach((q,k)=>{for(let i=0;i<12;i++){const x=12+i*((W-20)/12),y=2*bh+10+k*14,t=q[i%q.length];s+=i<8?`<circle cx="${x}" cy="${y}" r="5" ${B[t]} stroke-width="0.5"/>`+(t=='x'?`<path d="M${x-3},${y-3} L${x+3},${y+3} M${x+3},${y-3} L${x-3},${y+3}" stroke="#000" stroke-width="0.6"/>`:''):`<circle cx="${x}" cy="${y}" r="5" fill="none" stroke="#999" stroke-dasharray="1.5"/>`}});
 return {h:H,svg:svg(W,H,s)}},
math:(W,H)=>{let s='',cw=(W-4)/4,ch=Math.min(cw,(H-36)/3);for(let n=0;n<=10;n++){const x=2+(n%4)*cw,y=(n>>2)*ch;s+=`<rect x="${x+1}" y="${y+1}" width="${cw-2}" height="${ch-2}" rx="2" fill="#fff" stroke="#000" stroke-width="0.6" stroke-dasharray="2"/><text x="${x+cw/2}" y="${y+ch*.42}" font-size="${ch*.35}" text-anchor="middle">${n}</text>`;
  for(let d=0;d<n;d++)s+=`<circle cx="${x+cw/2-((Math.min(n,5)-1)*cw/14)+(d%5)*cw/7}" cy="${y+ch*.62+Math.floor(d/5)*ch*.15}" r="${cw/20}" fill="#000"/>`}
 const y0=3*ch+6,sw=(W-4)/20;for(let i=0;i<20;i++)s+=`<rect x="${2+i*sw}" y="${y0}" width="${sw}" height="${sw}" fill="#fff" stroke="#000" stroke-width="${i==9?1:0.4}"/><text x="${2+i*sw+sw/2}" y="${y0+sw*.68}" font-size="${sw*.5}" text-anchor="middle">${i+1}</text>`;
 return {h:H,svg:svg(W,H,s)}},
// --- новые ---
syll:(W,H)=>{const rows=['МА МО МУ МЫ МИ','ПА ПО ПУ ПЫ ПИ','БА БО БУ БЫ БИ','ТА ТО ТУ ТЫ ТИ','ДА ДО ДУ ДЫ ДИ','НА НО НУ НЫ НИ','КА КО КУ КЫ КИ','ВА ВО ВУ ВЫ ВИ'].map(r=>r.split(' '));
 const rh=(H-4)/rows.length,r=Math.min(rh*.36,13);let s='';
 rows.forEach((q,k)=>{const y=k*rh+rh/2+2,step=(W-30)/(q.length-1);let p=`M10,${y}`;q.forEach((_,i)=>{const x=15+i*step;p+=` Q${x-step/2},${y+(i%2?-rh*.3:rh*.3)} ${x},${y}`});
  s+=`<circle cx="6" cy="${y}" r="2" fill="#000"/><path d="${p}" stroke="#666" stroke-width="0.7" stroke-dasharray="3 2" fill="none"/>`+q.map((t,i)=>`<circle cx="${15+i*step}" cy="${y}" r="${r}" fill="#fff" stroke="#000" stroke-width="0.7"/><text x="${15+i*step}" y="${y}" font-size="${r*.8}" text-anchor="middle" dominant-baseline="central">${t}</text>`).join('')});
 return {h:H,svg:svg(W,H,s)}},
schulte:(W,H)=>{let s='',seed=7;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;const n=5,sz=Math.min(W-20,(H-30)/2-10),c=sz/n;
 for(let b=0;b<2;b++){const a=Array.from({length:25},(_,i)=>i+1).sort(()=>rnd()-.5),ox=(W-sz)/2,oy=b*(sz+18)+6;
  s+=`<text x="${ox}" y="${oy-1.5}" font-size="4.5">${L('Найди числа по порядку от 1 до 25')} · ${L('Время: ______')}</text>`;
  a.forEach((v,i)=>{const x=ox+(i%n)*c,y=oy+1+Math.floor(i/n)*c;s+=`<rect x="${x}" y="${y}" width="${c}" height="${c}" fill="#fff" stroke="#000" stroke-width="0.6"/><text x="${x+c/2}" y="${y+c/2}" font-size="${c*.42}" text-anchor="middle" dominant-baseline="central">${v}</text>`})}
 return {h:H,svg:svg(W,H,s)}},
dictation:(W,H)=>{const c=5,top=14,cols=Math.floor((W-2)/c),rows=Math.floor((H-top-2)/c),ox=(W-cols*c)/2;let s=`<text x="${ox}" y="5" font-size="4.5">${L('Диктант: ______________________________________________')}</text><text x="${ox}" y="11" font-size="4" font-weight="normal">→ 2  ↑ 2  → 2  ↓ 2  → 2 …</text>`;
 for(let i=0;i<=cols;i++)s+=`<line x1="${ox+i*c}" y1="${top}" x2="${ox+i*c}" y2="${top+rows*c}" stroke="#bbb" stroke-width="0.2"/>`;
 for(let j=0;j<=rows;j++)s+=`<line x1="${ox}" y1="${top+j*c}" x2="${ox+cols*c}" y2="${top+j*c}" stroke="#bbb" stroke-width="0.2"/>`;
 for(let k=0;k<Math.floor(rows/8);k++)s+=`<circle cx="${ox+2*c}" cy="${top+(k*8+4)*c}" r="1" fill="#000"/>`;
 return {h:H,svg:svg(W,H,s)}}};
// ---------- render ----------
function pageHTML(pi){const t=tpl(),[a,b]=PS[P.page],W=P.orient=='l'?b:a,H=P.orient=='l'?a:b,CW=W-16;let CH=H-16-12;
 let h=`<div class="page" style="width:${W}mm;height:${H}mm"><div class="ptitle" contenteditable data-k="title">${esc(L(P.title))}</div>`;
 if(t.kind=='table'){const cols=P.headers.length;h+=`<table class="dt"><tr>${P.headers.map((x,i)=>`<th contenteditable data-h="${i}">${esc(L(x))}</th>`).join('')}</tr>`;
  const rh=Math.max(7,Math.min(22,(CH-(t.legend?8:0)-(t.notes?40:0)-10)/P.rowsN));
  for(let r=0;r<P.rowsN;r++){h+=`<tr style="height:${rh}mm">`;for(let c=0;c<cols;c++){const v=(P.table[r]||[])[c]??L(c==0&&t.col0?(t.col0[r]||''):(t.colv&&t.colv[c]?(t.colv[c][r]||''):''));h+=`<td contenteditable data-r="${r}" data-c="${c}">${esc(v)}</td>`}h+='</tr>'}
  h+='</table>'+(t.legend?`<div class="legend">${esc(L(t.legend))}</div>`:'')+(t.notes?`<div class="notes">${esc(L(t.notes))}</div>`:'');return h+'</div>'}
 let ex=null;if(t.extra)ex=EX[t.extra](CW,t.kind=='svg'?CH:Math.min(100,CH*.42));
 if(t.kind!='svg'){const avH=CH-(ex?ex.h+4:0)-(t.colHeads?8:0)-(t.extraText?10:0),rl=t.rowLabels?32:0,gap=P.cut?0:3,avW=CW-rl-(rl?gap:0);
  let cw=+P.w||((avW-gap*(P.cols-1))/P.cols),chh=+P.h||(+P.w?cw:(avH-gap*(P.rows-1))/P.rows);if(!+P.w&&!+P.h){cw=chh=Math.min(cw,chh);if(t.size===0){cw=(avW-gap*(P.cols-1))/P.cols;chh=(avH-gap*(P.rows-1))/P.rows}}
  const k=Math.min(1,(avW-gap*(P.cols-1))/(cw*P.cols),(avH-gap*(P.rows-1))/(chh*P.rows));cw*=k;chh*=k;
  h+=`<div class="grid${P.cut?' cut':''}${t.capTop?' capTop':''}" style="grid-template-columns:${rl?rl+'mm ':''}repeat(${P.cols},${cw.toFixed(2)}mm);grid-auto-rows:${chh.toFixed(2)}mm${t.colHeads?';grid-template-rows:7mm':''}">`;
  if(t.colHeads)h+=(rl?'<div></div>':'')+t.colHeads.map(x=>`<div class="ch" style="height:7mm">${esc(L(x))}</div>`).join('');
  for(let r=0;r<P.rows;r++){if(rl)h+=`<div class="rl">${esc(L(t.rowLabels[r]||''))}</div>`;
   for(let c=0;c<P.cols;c++){const i=pi*P.cols*P.rows+r*P.cols+c,e=P.cells[i],im=img(e.img);
    let bc=P.frame=='none'?'transparent':P.frame=='color'?P.fc:P.frame=='fitz'&&e.fk?e.fk:'#000',bg=P.frame=='fitz'&&e.fk?e.fk+'55':'#fff';
    h+=`<div class="cell${t.noImg?' noImg':''}${t.round&&c>0?' round':''}${i==sel?' sel':''}" data-i="${i}" style="border-color:${bc};background:${bg}">${t.noImg?'':`<div class="img" style="${im?`background-image:url(${im})`:''}"></div>`}<div class="cap" style="font-size:${P.fs}pt">${esc(LANG==='kz'?(e.kz||L(e.ru)):e.ru)}</div></div>`}}
  h+='</div>';if(t.extraText)h+=`<div class="ptitle" style="margin-top:3mm">${esc(L(t.extraText))}</div>`}
 if(ex)h+=ex.svg;return h+'</div>'}
function render(){const t=tpl(),np=t.kind=='table'||t.kind=='svg'?1:P.pages;fitCells();let html='';for(let i=0;i<np;i++)html+=pageHTML(i);
 $('pages').innerHTML=html;const pv=$('preview');const [a,b]=PS[P.page],Wmm=P.orient=='l'?b:a,Hmm=P.orient=='l'?a:b,px=Wmm*96/25.4,sc=Math.min(1,(pv.clientWidth-30)/px);
 pv.innerHTML=[...$('pages').children].map(p=>`<div class="pw" style="width:${px*sc}px;height:${Hmm*96/25.4*sc}px"><div style="transform:scale(${sc});transform-origin:0 0">${p.outerHTML}</div></div>`).join('');
 fitAll(pv);$('pagestyle').textContent=`@page{size:${P.page} ${P.orient=='l'?'landscape':'portrait'};margin:0}`;
 $('gGrid').style.display=$('gImgs').style.display=t.kind?'none':'';$('bLib').style.display=t.kind?'none':'';$('gTable').style.display=t.kind=='table'?'':'none';$('gCell').style.display=sel>=0&&!t.kind?'':'none';$('lFc').style.display=P.frame=='color'?'':'none';
 $('tray').innerHTML=P.images.map((s,i)=>`<img src="${s}" data-im="${i}" draggable="true" class="${i===selImg?'sel':''}">`).join('');save()}
function syncUI(){$('sTpl').value=P.tpl;['title','page','orient','cols','rows','pages','w','h','frame','fc','fs','rowsN'].forEach(k=>{const el=document.querySelector(`[data-p="${k}"]`);if(el)el.value=k=='title'?L(P[k]):P[k]});$('cCut').checked=P.cut;showCell()}
function showCell(){if(sel<0||!P.cells[sel])return;const e=P.cells[sel];$('cellNo').textContent='№'+(sel+1);$('tRu').value=e.ru;$('tKz').value=e.kz;$('sFk').value=e.fk}
function save(){try{localStorage.setItem('abaProject',JSON.stringify(P))}catch(e){console.warn('localStorage full')}}
// ---------- events ----------
$('sTpl').innerHTML=[...new Set(T.map(t=>t.g))].map(g=>`<optgroup label="${esc(g)}">`+T.filter(t=>t.g==g).map(t=>`<option value="${t.id}">${t.id}. ${esc(t.name)}</option>`).join('')+'</optgroup>').join('');
function setLang(l){LANG=l==='kz'?'kz':'ru';try{localStorage.setItem('abaLang',LANG)}catch(e){}document.querySelectorAll('#langSw [data-lang]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.lang===LANG));if(P)render();if(typeof UI!=='undefined'&&UI)libLang();chrome()}
document.querySelectorAll('#langSw [data-lang]').forEach(b=>b.onclick=()=>setLang(b.dataset.lang));setLang(LANG);$('sFk').innerHTML=FK.map(f=>`<option value="${f[0]}">${f[1]}</option>`).join('');
[['iTitle','title'],['sPage','page'],['sOrient','orient'],['iCols','cols'],['iRows','rows'],['iPages','pages'],['iW','w'],['iH','h'],['sFrame','frame'],['iFc','fc'],['iFs','fs'],['iRowsN','rowsN']].forEach(([id,k])=>{const el=$(id);el.dataset.p=k;el.oninput=()=>{P[k]=el.type=='number'?Math.max(+el.min||0,+el.value||0):el.value;render()}});
$('cCut').onchange=e=>{P.cut=e.target.checked;render()};
document.querySelectorAll('[data-sz]').forEach(b=>b.onclick=()=>{P.w=P.h=+b.dataset.sz;syncUI();render()});
$('sTpl').onchange=e=>{P=newProject(+e.target.value);sel=-1;syncUI();render()};$('bNew').onclick=()=>{if(confirm(chT('Сбросить текущий шаблон?'))){const im=P.images;P=newProject(P.tpl);P.images=im;sel=-1;syncUI();render()}};
function addFiles(files,cb){[...files].filter(f=>/image\/(png|jpe?g)/.test(f.type)).forEach(f=>{const r=new FileReader();r.onload=()=>{P.images.push(r.result);cb&&cb(P.images.length-1);render()};r.readAsDataURL(f)})}
$('fImg').onchange=e=>{addFiles(e.target.files);e.target.value=''};
$('tray').onclick=e=>{if(e.target.dataset.im!=null){selImg=+e.target.dataset.im;if(sel>=0){P.cells[sel].img=selImg;}render()}};
$('tray').ondragstart=e=>e.dataTransfer.setData('text/plain',e.target.dataset.im);
$('bFill').onclick=()=>{let k=0;P.cells.forEach(c=>{if(c.img==null&&k<P.images.length)c.img=k++});render()};
const pv=$('preview');pv.onclick=e=>{const c=e.target.closest('.cell');if(!c)return;sel=+c.dataset.i;if(selImg!=null&&P.cells[sel].img==null){P.cells[sel].img=selImg}showCell();render()};
pv.ondragover=e=>e.preventDefault();pv.ondrop=e=>{e.preventDefault();const c=e.target.closest('.cell');if(!c)return;const i=+c.dataset.i;
 if(e.dataTransfer.files.length)addFiles(e.dataTransfer.files,ix=>{P.cells[i].img=ix});else{const v=e.dataTransfer.getData('text/plain');if(v!=='')P.cells[i].img=+v}render()};
pv.addEventListener('focusout',e=>{const d=e.target.dataset;if(!d)return;const v=e.target.innerText.trim();
 if(d.k){if(v!==L(P.title)){P.title=v;$('iTitle').value=v}}else if(d.h!=null){if(v!==L(P.headers[d.h]))P.headers[d.h]=v}else if(d.r!=null){const t=tpl(),r=+d.r,c=+d.c,cur=(P.table[r]||[])[c];const def=cur??(c==0&&t.col0?(t.col0[r]||''):(t.colv&&t.colv[c]?(t.colv[c][r]||''):''));if(v!==L(def))(P.table[r]=P.table[r]||[])[c]=v}save()});
$('tRu').oninput=e=>{P.cells[sel].ru=e.target.value;render()};$('tKz').oninput=e=>{P.cells[sel].kz=e.target.value;render()};$('sFk').onchange=e=>{P.cells[sel].fk=e.target.value;if(P.frame!='fitz'){P.frame='fitz';syncUI()}render()};
$('bClrImg').onclick=()=>{P.cells[sel].img=null;render()};$('bClrCell').onclick=()=>{Object.assign(P.cells[sel],{ru:'',kz:'',fk:'',img:null});showCell();render()};
$('bPrint').onclick=()=>{document.activeElement&&document.activeElement.blur();render();const bx=$('pages');bx.style.cssText='display:block;position:absolute;left:-10000px;top:0';fitAll(bx);bx.style.cssText='';window.print()};
$('bSave').onclick=()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(P)],{type:'application/json'}));a.download='aba-'+P.tpl+'.json';a.click()};
$('fLoad').onchange=e=>{const f=e.target.files[0];if(!f)return;f.text().then(s=>{try{P=JSON.parse(s);sel=-1;syncUI();render()}catch(x){alert(chT('Неверный файл'))}});e.target.value=''};
/* Автоподбор размера шрифта: казахские слова часто длиннее — текст не обрезается, слова не меняются.
   Подписи ячеек и заголовки таблиц уменьшаются, пока слово не влезет по ширине; надписи в рисунках (SVG) — пока не влезут в рисунок;
   заголовок листа — если лист переполнен по высоте. */
function fitAll(root){if(!root)return;
 const rg=document.createRange();
 const over=(el,box)=>{rg.selectNodeContents(el);const r=rg.getBoundingClientRect(),b=box.getBoundingClientRect();return r.width&&(r.left<b.left-0.5||r.right>b.right+0.5)};
 root.querySelectorAll('.page').forEach(pg=>{
  pg.querySelectorAll('.cap,th,td').forEach(el=>{if(!el.textContent.trim())return;const box=el.classList.contains('cap')?el.parentElement:el;if(!box.getBoundingClientRect().width)return;
   let fs=parseFloat(getComputedStyle(el).fontSize),n=0;
   while((over(el,box)||el.scrollWidth>el.clientWidth+1)&&fs>7&&n++<40){fs-=0.5;el.style.fontSize=fs+'px'}});
  pg.querySelectorAll('svg.extra').forEach(s=>{const vb=s.viewBox&&s.viewBox.baseVal;const W=vb&&vb.width?vb.width:0;if(!W)return;
   const rects=[...s.querySelectorAll('rect')].map(r=>({x:+r.getAttribute('x')||0,y:+r.getAttribute('y')||0,w:+r.getAttribute('width')||0,h:+r.getAttribute('height')||0})).filter(r=>r.w>12&&r.h>6);
   s.querySelectorAll('text').forEach(t=>{const ax=+t.getAttribute('x')||0,ay=+t.getAttribute('y')||0;
    const own=rects.filter(r=>ax>=r.x&&ax<=r.x+r.w&&ay>=r.y&&ay<=r.y+r.h).sort((p,q)=>p.w*p.h-q.w*q.h)[0];
    const mw=+t.getAttribute('data-mw')||0;const L0=mw?ax-mw/2:own?own.x+1:0.5,R0=mw?ax+mw/2:own?own.x+own.w-1:W-1.5;let n=0,fs=parseFloat(t.getAttribute('font-size'))||6,bb;
    while((bb=t.getBBox())&&bb.width&&(bb.x<L0||bb.x+bb.width>R0)&&fs>2.5&&n++<60){fs-=0.25;t.setAttribute('font-size',fs)}})});
  const ti=pg.querySelector('.ptitle');if(ti){let fs=parseFloat(getComputedStyle(ti).fontSize),n=0;const ovr=()=>{const r=pg.getBoundingClientRect().bottom;let m=0;pg.querySelectorAll(':scope>*').forEach(e=>{m=Math.max(m,e.getBoundingClientRect().bottom)});return m>r+1};
   while(ovr()&&fs>12&&n++<30){fs-=1;ti.style.fontSize=fs+'px'}}})}
/* ---------- вывод: картинки листов в натуральную величину (A4/A5 1:1) ---------- */
async function pageCanvases(){document.activeElement&&document.activeElement.blur();sel=-1;render();const box=$('pages');box.style.cssText='display:block;position:absolute;left:-10000px;top:0';
 try{if(document.fonts&&document.fonts.ready)await document.fonts.ready;fitAll(box);const out=[];for(const pg of [...box.children])out.push(await html2canvas(pg,{scale:2.5,backgroundColor:'#fff',useCORS:true}));return out}finally{box.style.cssText=''}}
function pageMM(){const [a,b]=PS[P.page];return P.orient=='l'?[b,a]:[a,b]}
async function exportPDF(){const [W,H]=pageMM(),cs=await pageCanvases();const pdf=new jspdf.jsPDF({orientation:P.orient=='l'?'landscape':'portrait',unit:'mm',format:P.page.toLowerCase()});
 cs.forEach((c,i)=>{if(i)pdf.addPage();pdf.addImage(c.toDataURL('image/jpeg',0.92),'JPEG',0,0,W,H)});return pdf}
const xmlEsc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
async function exportDocx(){const [W,H]=pageMM(),cs=await pageCanvases(),enc=new TextEncoder(),files={};let body='',rels='';
 const EMU=36000,cx=Math.round(W*EMU),cy=Math.round(H*EMU),tw=mm=>Math.round(mm/25.4*1440);
 for(let i=0;i<cs.length;i++){const n=i+1,rid='rIdImg'+n,blob=await new Promise(r=>cs[i].toBlob(r,'image/jpeg',0.92));files['word/media/p'+n+'.jpeg']=[new Uint8Array(await blob.arrayBuffer()),{level:0}];
  rels+=`<Relationship Id="${rid}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/p${n}.jpeg"/>`;
  body+=`<w:p><w:pPr>${i?'<w:pageBreakBefore/>':''}<w:spacing w:before="0" w:after="0" w:line="240" w:lineRule="auto"/><w:jc w:val="center"/></w:pPr><w:r><w:drawing><wp:inline distT="0" distB="0" distL="0" distR="0"><wp:extent cx="${cx}" cy="${cy}"/><wp:effectExtent l="0" t="0" r="0" b="0"/><wp:docPr id="${n}" name="Лист ${n}"/><wp:cNvGraphicFramePr><a:graphicFrameLocks noChangeAspect="1"/></wp:cNvGraphicFramePr><a:graphic><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:pic><pic:nvPicPr><pic:cNvPr id="${n}" name="p${n}.jpeg"/><pic:cNvPicPr/></pic:nvPicPr><pic:blipFill><a:blip r:embed="${rid}"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill><pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${cx}" cy="${cy}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr></pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r></w:p>`}
 const X='<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
 files['[Content_Types].xml']=enc.encode(X+'<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Default Extension="jpeg" ContentType="image/jpeg"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>');
 files['_rels/.rels']=enc.encode(X+'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>');
 files['word/_rels/document.xml.rels']=enc.encode(X+'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'+rels+'</Relationships>');
 files['word/document.xml']=enc.encode(X+'<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"><w:body>'+body+
  `<w:sectPr><w:pgSz w:w="${tw(W)}" w:h="${tw(H)}"${P.orient=='l'?' w:orient="landscape"':''}/><w:pgMar w:top="0" w:right="0" w:bottom="0" w:left="0" w:header="0" w:footer="0" w:gutter="0"/></w:sectPr></w:body></w:document>`);
 return fflate.zipSync(files)}
function fileName(ext){return 'aymaba-'+P.tpl+'-'+LANG+'.'+ext}
$('bPdf').onclick=async()=>{const b=$('bPdf'),t=b.textContent;b.disabled=true;b.textContent=chT('⏳ PDF…');try{(await exportPDF()).save(fileName('pdf'))}catch(e){alert(chMsg('Ошибка PDF: {сообщение}',e))}b.disabled=false;b.textContent=t};
$('bWord').onclick=async()=>{const b=$('bWord'),t=b.textContent;b.disabled=true;b.textContent='⏳ Word…';try{const z=await exportDocx(),a=document.createElement('a');a.href=URL.createObjectURL(new Blob([z],{type:'application/vnd.openxmlformats-officedocument.wordprocessingml.document'}));a.download=fileName('docx');a.click();setTimeout(()=>URL.revokeObjectURL(a.href),5000)}catch(e){alert('Ошибка Word: '+e)}b.disabled=false;b.textContent=t};
/* ---------- картинки из библиотеки AYMABA (тот же поиск, что на странице печати: сразу по всем темам) ---------- */
const LIB='https://vivamusz.github.io/aymaba/';let LIBD=null,libT=null;
const norm=s=>(s||'').toLowerCase().replace(/ё/g,'е').trim();
async function libLoad(){if(LIBD)return LIBD;try{const r=await fetch(LIB+'data/cards.json?v=kk1');LIBD=await r.json()}catch(e){LIBD={cards:[],categories:[],err:1}}return LIBD}
async function libSearch(){const q=norm($('libQ').value),box=$('libRes');const d=await libLoad();
 if(d.err){box.innerHTML='<p class="hint">'+U('Библиотека сейчас недоступна. Проверьте интернет.')+'</p>';return}
 const cats=q?d.categories.filter(c=>norm(c.ru).includes(q)||norm(c.kk).includes(q)).map(c=>c.num):[];
 const first=d.categories[0]&&d.categories[0].num;const hits=d.cards.filter(c=>q?(norm(c.ru).includes(q)||norm(c.kk).includes(q)||cats.includes(c.cat)):c.cat===first).sort((a,b)=>(norm(b.ru).startsWith(q))-(norm(a.ru).startsWith(q))).slice(0,48);
 box.innerHTML=hits.length?hits.map(c=>`<button type="button" class="lib-it" data-id="${esc(c.id)}" data-ru="${esc(c.ru)}" data-kk="${esc(c.kk||'')}" title="${esc(LANG==='kz'&&c.kk?c.kk:c.ru)}"><img src="${LIB}cards/${esc(c.id)}.webp" alt="" loading="lazy" draggable="false"><span>${esc(LANG==='kz'&&c.kk?c.kk:c.ru)}</span></button>`).join(''):'<p class="hint">'+U('Ничего не нашлось.')+'</p>'}
$('libQ').oninput=()=>{clearTimeout(libT);libT=setTimeout(libSearch,200)};$('libQ').onfocus=()=>{if(!$('libRes').children.length)libSearch()};
$('libRes').onclick=e=>{const it=e.target.closest('.lib-it');if(!it)return;const c=(LIBD&&LIBD.cards||[]).find(x=>x.id===it.dataset.id);if(c)libAdd([c])};
/* ---- Окно «Из библиотеки»: темы слева, поиск и сетка справа; щелчок — сразу в ячейку, галочки — несколько сразу ---- */
var UI={kz:{'Из библиотеки':'Кітапханадан','Поиск по слову':'Сөз бойынша іздеу','Закрыть':'Жабу',
 'Добавить выбранные ({n})':'Таңдалғандарын қосу ({n})',
 'Нажмите картинку — она сразу встанет в следующую пустую ячейку. Галочками можно отметить несколько.':'Суретті басыңыз — ол келесі бос ұяшыққа бірден орналастырылады. Бірнеше суретті таңдау үшін құсбелгі қойыңыз.',
 'Свободных ячеек нет — добавьте строки или листы.':'Бос ұяшық жоқ — жолдар немесе парақтар қосыңыз.',
 'Ничего не нашлось.':'Ештеңе табылмады.',
 'Отметить':'Белгілеу',
 'Библиотека сейчас недоступна. Проверьте интернет.':'Кітапхана қазір қолжетімсіз. Интернет байланысын тексеріңіз.'}};
function U(s){return LANG==='kz'&&UI&&UI.kz[s]?UI.kz[s]:s}   // только строки с переводом пользователя; остальное — по-русски (см. kz_still_missing.xlsx)
const capOf=c=>{const s=LANG==='kz'&&c.kk?c.kk:c.ru;return s.charAt(0).toUpperCase()+s.slice(1)};
const up1=s=>s?s.charAt(0).toUpperCase()+s.slice(1):s;
/* ставит карточки по порядку: сначала выбранная пустая ячейка, потом следующие пустые; если пустых нет — заменяет выбранную */
function libAdd(list){if(tpl().kind||!list.length)return 0;let n=0;
 list.forEach(c=>{let i=(sel>=0&&P.cells[sel]&&P.cells[sel].img==null)?sel:P.cells.findIndex(x=>x.img==null);
  if(i<0){if(sel>=0&&list.length===1)i=sel;else return}
  const url=LIB+'print/'+c.id+'.webp';let ix=P.images.indexOf(url);if(ix<0){P.images.push(url);ix=P.images.length-1}
  const cell=P.cells[i];cell.img=ix;cell.ru=up1(c.ru);if(c.kk)cell.kz=up1(c.kk);selImg=ix;n++});
 if(n){showCell();render()}libNote(n<list.length?U('Свободных ячеек нет — добавьте строки или листы.'):'');return n}
let LM={cat:null,picked:new Set()};
function libNote(t){const el=document.getElementById('lmNote');if(el)el.textContent=t}
function lmBuild(){if($('libModal'))return;const m=document.createElement('div');m.id='libModal';m.className='lm';m.hidden=true;
 m.innerHTML=`<div class="lm-back" data-x></div><div class="lm-box" role="dialog" aria-modal="true" aria-labelledby="lmTitle">
 <div class="lm-head"><b id="lmTitle"></b><button type="button" class="btn-ghost" id="lmClose" data-x></button></div>
 <div class="lm-body"><nav class="lm-cats" id="lmCats"></nav><div class="lm-main"><input type="search" id="lmQ" autocomplete="off"><p class="hint" id="lmHint">Нажмите картинку — она сразу встанет в следующую пустую ячейку. Галочками можно отметить несколько.</p><div class="lm-grid" id="lmGrid"></div></div></div>
 <div class="lm-foot"><span class="hint" id="lmNote" aria-live="polite"></span><button type="button" class="btn-primary" id="lmAdd" disabled></button></div></div>`;
 document.body.appendChild(m);
 m.addEventListener('click',e=>{if(e.target.closest('[data-x]'))lmClose()});
 $('lmQ').oninput=()=>{clearTimeout(libT);libT=setTimeout(lmGrid,150)};
 $('lmCats').onclick=e=>{const b=e.target.closest('[data-cat]');if(!b)return;LM.cat=+b.dataset.cat;$('lmQ').value='';lmCats();lmGrid()};
 $('lmGrid').onclick=e=>{const it=e.target.closest('.lm-it');if(!it)return;const c=LIBD.cards.find(x=>x.id===it.dataset.id);if(!c)return;
  if(e.target.closest('.lm-chk')){LM.picked.has(c.id)?LM.picked.delete(c.id):LM.picked.add(c.id);it.classList.toggle('on',LM.picked.has(c.id));it.querySelector('.lm-chk').setAttribute('aria-checked',LM.picked.has(c.id));lmFoot();return}
  if(libAdd([c])){it.classList.add('added');setTimeout(()=>it.classList.remove('added'),500)}};
 $('lmAdd').onclick=()=>{const list=LIBD.cards.filter(c=>LM.picked.has(c.id));libAdd(list);LM.picked.clear();lmGrid();lmFoot()};
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('libModal').hidden)lmClose()})}
function lmTexts(){$('lmTitle').textContent=U('Из библиотеки')+' AYMABA';$('lmClose').textContent=U('Закрыть');$('lmQ').placeholder=U('Поиск по слову');$('lmHint').textContent=U('Нажмите картинку — она сразу встанет в следующую пустую ячейку. Галочками можно отметить несколько.');lmFoot()}
function lmFoot(){const n=LM.picked.size;$('lmAdd').textContent=U('Добавить выбранные ({n})').split('{n}').join(n);$('lmAdd').disabled=!n}
function lmCats(){$('lmCats').innerHTML=LIBD.categories.map(c=>`<button type="button" data-cat="${c.num}" aria-pressed="${c.num===LM.cat&&!$('lmQ').value?'true':'false'}">${esc(LANG==='kz'&&c.kk?c.kk:c.ru)} <small>${LIBD.cards.filter(x=>x.cat===c.num).length}</small></button>`).join('')}
function lmGrid(){const q=norm($('lmQ').value);let list;
 if(q){const cats=LIBD.categories.filter(c=>norm(c.ru).includes(q)||norm(c.kk).includes(q)).map(c=>c.num);list=LIBD.cards.filter(c=>norm(c.ru).includes(q)||norm(c.kk).includes(q)||cats.includes(c.cat)).sort((a,b)=>(norm(b.ru).startsWith(q)||norm(b.kk).startsWith(q))-(norm(a.ru).startsWith(q)||norm(a.kk).startsWith(q)))}
 else list=LIBD.cards.filter(c=>c.cat===LM.cat);
 lmCats();
 $('lmGrid').innerHTML=list.length?list.map(c=>`<div class="lm-it${LM.picked.has(c.id)?' on':''}" data-id="${esc(c.id)}"><button type="button" class="lm-pic" title="${esc(capOf(c))}"><img src="${LIB}cards/${esc(c.id)}.webp" alt="" loading="lazy" draggable="false"><span>${esc(capOf(c))}</span></button><button type="button" class="lm-chk" role="checkbox" aria-checked="${LM.picked.has(c.id)}" aria-label="${esc(capOf(c))}" title="${esc(U('Отметить'))}">✓</button></div>`).join(''):'<p class="hint">'+U('Ничего не нашлось.')+'</p>'}
async function lmOpen(){lmBuild();const m=$('libModal');m.hidden=false;document.body.classList.add('lm-open');lmTexts();libNote('');
 $('lmGrid').innerHTML='<p class="hint">…</p>';const d=await libLoad();
 if(d.err){$('lmGrid').innerHTML='<p class="hint">'+U('Библиотека сейчас недоступна. Проверьте интернет.')+'</p>';return}
 if(LM.cat==null&&d.categories.length)LM.cat=d.categories[0].num;lmGrid();setTimeout(()=>$('lmQ').focus({preventScroll:true}),30)}
function lmClose(){$('libModal').hidden=true;document.body.classList.remove('lm-open')}
function libLang(){libBtns();if($('libModal')&&!$('libModal').hidden){lmTexts();lmGrid()}if($('libRes').children.length&&LIBD)libSearch()}
function libBtns(){document.querySelectorAll('[data-libbtn]').forEach(b=>{b.lastChild.textContent=' '+U('Из библиотеки')})}
document.querySelectorAll('[data-libbtn]').forEach(b=>b.onclick=lmOpen);libBtns();
window.onresize=()=>render();
try{P=JSON.parse(localStorage.getItem('abaProject'))}catch(e){}if(!P||!P.tpl||P.v!==2||!T.some(t=>t.id==P.tpl))P=newProject(1);syncUI();render();if(document.fonts){document.fonts.ready.then(()=>render());document.fonts.addEventListener&&document.fonts.addEventListener('loadingdone',()=>render())}


/* PIN: encrypted, no default in source */
const PIN_STORE='aba_pin_v1';
function pinRec(){try{return JSON.parse(localStorage.getItem(PIN_STORE)||'null')}catch(e){return null}}
async function hashPin(pin,salt){const buf=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(salt+':'+pin));return [...new Uint8Array(buf)].map(b=>b.toString(16).padStart(2,'0')).join('')}
async function setPin(pin){const salt=crypto.getRandomValues(new Uint8Array(16)).reduce((s,b)=>s+b.toString(16).padStart(2,'0'),'');localStorage.setItem(PIN_STORE,JSON.stringify({salt,hash:await hashPin(pin,salt),v:1}))}
async function checkPin(pin){const r=pinRec();if(!r)return false;return (await hashPin(pin,r.salt))===r.hash}
function ensurePinModal(){
  let m=document.getElementById('pinModal');
  if(m)return m;
  m=document.createElement('div');m.id='pinModal';
  m.style.cssText='display:none;position:fixed;inset:0;background:#0007;z-index:50;align-items:center;justify-content:center';
  m.innerHTML='<div id="pinBox" style="background:#fff;border-radius:12px;padding:16px;max-width:280px;width:90%"></div>';
  document.body.appendChild(m);return m;
}
function pinPad(title,mode){return new Promise(resolve=>{
  const m=ensurePinModal(),box=document.getElementById('pinBox');
  m.style.display='flex';
  box.innerHTML='<h3 style="margin:0 0 8px;font:600 16px sans-serif">'+title+'</h3><div id="pinDisp" style="font:28px/1.2 monospace;letter-spacing:6px;text-align:center;min-height:36px">· · · ·</div><div id="pinErr" style="color:#c00;font-size:13px;min-height:18px;text-align:center"></div><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px">'+
    [1,2,3,4,5,6,7,8,9,'←',0,'OK'].map(k=>'<button type="button" data-k="'+k+'" style="font-size:20px;padding:12px 0;border:1px solid #ccc;border-radius:8px;background:#f8fafc">'+(k==='OK'?'✓':k)+'</button>').join('')+
    '</div><p style="font-size:12px;color:#64748b;text-align:center">'+chT('4–8 цифр')+'</p><button id="pinCancel" style="width:100%;margin-top:6px;padding:8px">'+chT('Отмена')+'</button>';
  let buf='',first='';
  const disp=document.getElementById('pinDisp'),err=document.getElementById('pinErr');
  const show=()=>{disp.textContent=buf?('•'.repeat(buf.length)):('· · · ·');err.textContent=''};
  const close=()=>{m.style.display='none'};
  document.getElementById('pinCancel').onclick=()=>{close();resolve(null)};
  box.querySelectorAll('button[data-k]').forEach(b=>b.onclick=async()=>{
    const k=b.dataset.k;
    if(k==='←'){buf=buf.slice(0,-1);show();return}
    if(k==='OK'){
      if(buf.length<4||buf.length>8){err.textContent=chT('Нужно 4–8 цифр');return}
      if(mode==='setup'){
        if(!first){first=buf;buf='';disp.textContent=chT('ещё раз');return}
        if(buf!==first){err.textContent=chT('Не совпало');first='';buf='';show();return}
        await setPin(buf);close();resolve(true);return
      }
      if(await checkPin(buf)){close();resolve(true)}else{err.textContent=chT('Неверный PIN');buf='';show()}
      return
    }
    if(buf.length>=8)return;buf+=k;show()
  })
})}
/* PIN спрашивается только при входе в «🔒 Специалист»; первый раз — создать, «Отмена» просто закрывает окно */
async function askPin(){if(!pinRec())return !!(await pinPad(chT('Создайте PIN специалиста'),'setup'))&&!!pinRec();return !!(await pinPad(chT('PIN специалиста'),'unlock'))}
let holdT=null,holdDone=false;
$('bSpec').onpointerdown=e=>{const box=$('specBox');if(!box.hidden)return;holdDone=false;holdT=setTimeout(async()=>{holdDone=true;if(!(await askPin()))return;box.hidden=false;$('bSpec').textContent=chT('🔓 Закрыть')},3000)};
$('bSpec').onpointerup=$('bSpec').onpointerleave=$('bSpec').onpointercancel=()=>{clearTimeout(holdT);holdT=null};
$('bSpec').onclick=()=>{if(holdDone){holdDone=false;return}const box=$('specBox');if(!box.hidden){box.hidden=true;$('bSpec').textContent=chT('🔒 Специалист')}};


/* KZ: интерфейс конструктора — только переводы пользователя: /workspace/aymaba_kk/interface_kk_constructor.json (без строк с PECS) + interface_kk_aymaba.csv (legal.back, nav.home/constructor/communicator). Чего нет в этих файлах — остаётся по-русски. */
var CHR={"🖨 Печать": "🖨 Басып шығару", "📄 PDF": "📄 PDF", "⏳ PDF…": "⏳ PDF дайындалуда…", "🔒 Специалист": "🔒 Маман", "🔓 Закрыть": "🔓 Жабу", "💾 Сохранить JSON": "💾 JSON файлын сақтау", "📂 Открыть JSON": "📂 JSON файлын ашу", "✨ Сбросить шаблон": "✨ Үлгіні бастапқы күйге қайтару", "Сбросить текущий шаблон?": "Ағымдағы үлгіні бастапқы күйге қайтарғыңыз келе ме?", "Неверный файл": "Жарамсыз файл", "Ошибка PDF: {сообщение}": "PDF қатесі: {жеделхат}", "Шаблон": "Үлгі", "Заголовок": "Тақырып", "Лист": "Парақ", "A4": "A4", "A5": "A5", "Ориентация": "Парақтың бағыты", "Книжная": "Тік", "Альбомная": "Көлденең", "Столбцы": "Бағандар", "Строки": "Жолдар", "Листов": "Парақ саны", "Ширина ячейки, мм (0 = авто)": "Ұяшықтың ені, мм (0 = автоматты)", "Высота, мм": "Биіктігі, мм", "9×9": "9×9", "7×7": "7×7", "5×5": "5×5", "4×4": "4×4", "Авто": "Автоматты", "Рамки": "Жақтаулар", "Чёрная": "Қара", "Цветная": "Түрлі түсті", "Ключ Фицджеральда": "Фицджеральд түс кілті", "Без рамки": "Жақтаусыз", "Цвет рамки": "Жақтаудың түсі", "Линии разреза": "Қию сызықтары", "Строк таблицы": "Кесте жолдары", "Размер шрифта подписи, pt": "Жазу қарпінің өлшемі, пт", "Картинки": "Суреттер", "(нажмите картинку, затем ячейку, или перетащите)": "(алдымен суретті, содан кейін ұяшықты басыңыз немесе сүйреп апарыңыз)", "➕ Загрузить PNG/JPG": "➕ PNG/JPG жүктеу", "Заполнить пустые ячейки по порядку": "Бос ұяшықтарды ретімен толтыру", "Ячейка": "Ұяшық", "Подпись RU": "Орысша жазу", "Подпись KZ": "Қазақша жазу", "Категория (Фицджеральда)": "Санат (Фицджеральд жүйесі)", "Люди (жёлтый)": "Адамдар (сары)", "Действия (зелёный)": "Әрекеттер (жасыл)", "Описания (синий)": "Сипаттамалар (көк)", "Предметы (оранжевый)": "Заттар (қызғылт сары)", "Социальные (розовый)": "Әлеуметтік сөздер (қызғылт)", "Отрицание/стоп (красный)": "Болымсыздық/тоқтату (қызыл)", "Разное (белый)": "Басқалары (ақ)", "Убрать картинку": "Суретті алып тастау", "Очистить": "Тазалау", "Проект автоматически хранится в браузере (localStorage).": "Жоба браузерде автоматты түрде сақталады (localStorage).", "4–8 цифр": "4–8 цифр", "Отмена": "Болдырмау", "Нужно 4–8 цифр": "4–8 цифр енгізіңіз", "ещё раз": "қайта енгізіңіз", "Не совпало": "Сәйкес келмейді", "Неверный PIN": "PIN-код қате", "Создайте PIN специалиста": "Маманның PIN-кодын орнатыңыз", "Нужен PIN для защиты настроек": "Баптауларды қорғау үшін PIN-код қажет", "PIN специалиста": "Маманның PIN-коды", "← на главную": "← Басты бетке", "Главная": "Басты бет", "Конструктор": "Конструктор", "Коммуникатор": "Коммуникатор"};
var CHE=/^([\s\u2190-\u2BFF\u{1F000}-\u{1FAFF}\uFE0F\u200D]*)([\s\S]*?)(\s*)$/u,CHK=null,CHB=null;
function chMaps(){if(CHK)return;CHK={};CHB={};for(const r in CHR){const a=r.match(CHE)[2],b=CHR[r].match(CHE)[2];if(a&&b){CHK[a]=b;if(!(b in CHB))CHB[b]=a}}}
function chT(s){if(typeof CHR==='undefined'||s==null)return s;chMaps();const m=String(s).match(CHE),c=m[2],k=LANG==='kz'?CHK[c]:CHB[c];return k!=null&&k!==c?m[1]+k+m[3]:s}
function chMsg(ru,v){const k=LANG==='kz'&&typeof CHR!=='undefined'&&CHR[ru];return k?k.replace(/\{[^}]*\}/,v):ru.replace(/\{[^}]*\}/,v)}
function tplList(){const s=$('sTpl'),v=s.value;s.innerHTML=[...new Set(T.map(t=>t.g))].map(g=>`<optgroup label="${esc(chT(g))}">`+T.filter(t=>t.g==g).map(t=>`<option value="${t.id}">${t.id}. ${esc(L(t.name))}</option>`).join('')+'</optgroup>').join('');if(v)s.value=v}
function chrome(){if(typeof CHR==='undefined')return;tplList();if(P&&document.activeElement!==$('iTitle'))$('iTitle').value=L(P.title);
 document.querySelectorAll('.toolbar,aside,.mob-nav,#pinModal').forEach(root=>{
  const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:n=>n.parentElement.closest('#langSw,#sTpl,#libRes,#tray,#cellNo')?2:1});let n;
  while(n=w.nextNode()){const t=chT(n.data);if(t!==n.data)n.data=t}
  root.querySelectorAll('[title],[placeholder],[aria-label],optgroup[label]').forEach(el=>{['title','placeholder','aria-label','label'].forEach(a=>{const v=el.getAttribute(a);if(v){const t=chT(v);if(t!==v)el.setAttribute(a,t)}})})})}
chrome();
