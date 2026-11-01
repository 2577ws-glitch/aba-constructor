const FK=[['','—'],['#ffe14d','Люди (жёлтый)'],['#7fd36b','Действия (зелёный)'],['#7fb2ff','Описания (синий)'],['#ffb347','Предметы (оранжевый)'],['#ff9ecb','Социальные (розовый)'],['#ff6b6b','Отрицание/стоп (красный)'],['#ffffff','Разное (белый)']];
const PS={A4:[210,297],A5:[148,210]};const $=id=>document.getElementById(id);
let P,sel=-1,selImg=null;
function newProject(id){const t=T.find(x=>x.id==id);const n=(t.cols||0)*(t.rows||0)*(t.pages||1);
 return {v:1,tpl:t.id,title:t.title||t.name.replace(/\s*\(.*\)$/,''),page:t.page||'A4',orient:t.orient||'p',cols:t.cols||0,rows:t.rows||0,pages:t.pages||1,
 w:t.w??t.size??0,h:t.h??t.size??0,frame:'black',fc:'#2c5d8f',cut:!!t.cut,fs:t.small?9:14,rowsN:t.rowsN||10,images:[],
 cells:Array.from({length:n},(_,i)=>({ru:(t.caps||[])[i]||'',kz:(t.kz||[])[i]||'',fk:'',img:null,bg:(t.colors||[])[i%7]&&t.colors?(t.colors[i%7]):''})),
 headers:(t.headers||[]).slice(),table:[]};}
function tpl(){return T.find(x=>x.id==P.tpl)}
function fitCells(){const n=P.cols*P.rows*P.pages;while(P.cells.length<n)P.cells.push({ru:'',kz:'',fk:'',img:null,bg:''});}
const esc=s=>String(s||'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function img(i){return P.images[i]||null}
// ---------- SVG extras ----------
function svg(w,h,body){return `<svg class="extra" xmlns="http://www.w3.org/2000/svg" width="${w}mm" height="${h}mm" viewBox="0 0 ${w} ${h}" font-family="Arial" font-weight="bold">${body}</svg>`}
function sectors(cx,cy,r,labels,cols,fs){let s='',n=labels.length;labels.forEach((l,i)=>{const a0=2*Math.PI*i/n-Math.PI/2,a1=2*Math.PI*(i+1)/n-Math.PI/2,am=(a0+a1)/2;
 s+=`<path d="M${cx},${cy} L${cx+r*Math.cos(a0)},${cy+r*Math.sin(a0)} A${r},${r} 0 0 1 ${cx+r*Math.cos(a1)},${cy+r*Math.sin(a1)} Z" fill="${cols[i%cols.length]}" stroke="#000" stroke-width="0.5"/>`;
 s+=`<text x="${cx+r*.65*Math.cos(am)}" y="${cy+r*.65*Math.sin(am)}" font-size="${fs}" text-anchor="middle" dominant-baseline="middle">${l}</text>`});
 return s+`<circle cx="${cx}" cy="${cy}" r="2" fill="#000"/>`}
const EX={
weather:(W,H)=>{const h=Math.min(90,H);return {h,svg:svg(W,h,`<defs><linearGradient id="tg" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#2b6cff"/><stop offset=".5" stop-color="#ffe14d"/><stop offset="1" stop-color="#ff3b30"/></linearGradient></defs>
<rect x="10" y="5" width="16" height="${h-15}" rx="8" fill="url(#tg)" stroke="#000"/><text x="30" y="12" font-size="5">ЖАРКО / ЫСТЫҚ</text><text x="30" y="${h/2}" font-size="5">ТЕПЛО / ЖЫЛЫ</text><text x="30" y="${h-12}" font-size="5">ХОЛОДНО / СУЫҚ</text>
${sectors(W-h/2-5,h/2,h/2-3,['Зима','Весна','Лето','Осень'],['#cfe8ff','#d9f5c9','#fff6b0','#ffd9a8'],6)}<line x1="${W-h/2-5}" y1="${h/2}" x2="${W-h/2-5}" y2="12" stroke="#c00" stroke-width="2"/>`)}},
timer:(W,H)=>{const r=Math.min(55,H/2-10);return {h:2*r+30,svg:svg(W,2*r+30,sectors(W/2,r+3,r,['1','2','3','4','5'],['#ff6b6b','#ffb347','#ffe14d','#7fd36b','#7fb2ff'],10)+
 [0,1,2,3,4].map(i=>`<circle cx="${W/2-48+i*24}" cy="${2*r+18}" r="9" fill="none" stroke="#000" stroke-width="0.6"/><text x="${W/2-48+i*24}" y="${2*r+20}" font-size="6" text-anchor="middle">${5-i}</text>`).join(''))}},
strip:(W)=>({h:34,svg:svg(W,34,`<rect x="2" y="2" width="${W-4}" height="30" rx="3" fill="#fff" stroke="#000" stroke-width="0.8"/><rect x="5" y="5" width="30" height="24" fill="#ffe14d" stroke="#000"/><text x="20" y="19" font-size="6" text-anchor="middle">Я хочу</text>`+[0,1,2].map(i=>`<rect x="${40+i*30}" y="5" width="26" height="24" fill="none" stroke="#999" stroke-dasharray="2"/>`).join(''))}),
scale:(W)=>({h:60,svg:svg(W,60,[['#7fd36b','Спокоен — играю, работаю'],['#ffe14d','Тревожно — дышу, сжимаю мяч'],['#ff6b6b','Очень плохо — наушники, тихий угол']].map((c,i)=>`<rect x="2" y="${2+i*19}" width="${W-4}" height="17" rx="3" fill="${c[0]}" stroke="#000" stroke-width="0.5"/><text x="8" y="${13+i*19}" font-size="6">${3-i}. ${c[1]}</text>`).join(''))}),
emotions:(W,H)=>{const r=Math.min(90,H-10,W-10)/2;return {h:2*r+6,svg:svg(W,2*r+6,sectors(W/2,r+3,r,['Радость','Грусть','Злость','Страх','Удивление','Спокойствие'],['#fff6b0','#cfe8ff','#ffb3b3','#e6d9ff','#ffd9a8','#d9f5c9'],5)+`<polygon points="${W/2-3},${r+3} ${W/2+3},${r+3} ${W/2},${r*0.3}" fill="#222"/>`)}},
tracing:(W,H)=>{const rh=(H-5)/6;let s='',d=`stroke="#888" stroke-width="1" stroke-dasharray="3 2" fill="none"`;
 for(let k=0;k<6;k++){const y=k*rh+rh/2;let p='';
  if(k==0)p=`M15,${y} H${W-5}`;
  if(k==1){p=`M15,${y}`;for(let x=15;x<W-10;x+=20)p+=` q5,-${rh/3} 10,0 t10,0`}
  if(k==2){p=`M15,${y+rh/4}`;for(let x=15;x<W-10;x+=14)p+=` l7,-${rh/2} l7,${rh/2}`}
  if(k==3){p=`M15,${y}`;for(let x=15;x<W-20;x+=16)p+=` c8,-${rh/2} 8,0 0,0 c0,0 0,${rh/4} 16,0`}
  if(k==4){for(let c=0;c<4;c++){const cx=30+c*(W-40)/4;p+=`M${cx},${y} `;for(let a=0;a<18;a++){const ang=a*0.7,rr=1+a*0.55*rh/24;p+=`L${cx+rr*Math.cos(ang)},${y+rr*Math.sin(ang)} `}}}
  if(k==5){p=`M15,${y+rh/3} h${rh*.6} v-${rh*.6} h-${rh*.6}z M${W/2-rh/3},${y} m0,0 a${rh/3},${rh/3} 0 1,0 ${rh*.66},0 a${rh/3},${rh/3} 0 1,0 -${rh*.66},0 M${W-30},${y+rh/3} l${rh/3},-${rh*.66} l${rh/3},${rh*.66}z`}
  s+=`<circle cx="8" cy="${k==2?y+rh/4:y}" r="3" fill="#7fd36b"/><path d="${p}" ${d}/>`}
 return {h:H,svg:svg(W,H,s)}},
maze:(W,H)=>{const c=W/2,y=H/2;let p=(sgn)=>`M${c},${y} C${c+sgn*W*.15},${y-H*.45} ${c+sgn*W*.25},${y+H*.45} ${c+sgn*W*.35},${y} S${c+sgn*W*.42},${y-H*.3} ${c+sgn*(W/2-8)},${y-H*.3}`;
 return {h:H,svg:svg(W,H,[1,-1].map(s=>`<path d="${p(s)}" stroke="#bbb" stroke-width="14" fill="none" stroke-linecap="round"/><path d="${p(s)}" stroke="#666" stroke-width="0.8" stroke-dasharray="3 2" fill="none"/><text x="${c+s*(W/2-8)}" y="${y-H*.3-10}" font-size="6" text-anchor="middle">ФИНИШ</text>`).join('')+`<circle cx="${c}" cy="${y}" r="6" fill="#7fd36b"/><text x="${c}" y="${y+14}" font-size="6" text-anchor="middle">СТАРТ</text>`)}},
eight:(W,H)=>{const a=W/2-12,c=W/2,y=H/2;let p='';for(let t=0;t<=6.3;t+=0.05){const s=Math.sin(t),k=1+s*s;p+=(t?'L':'M')+(c+a*Math.cos(t)/k)+','+(y+a*Math.sin(t)*Math.cos(t)/k*1.3)+' '}
 return {h:H,svg:svg(W,H,`<path d="${p}Z" stroke="#ddd" stroke-width="18" fill="none"/><path d="${p}Z" stroke="#555" stroke-width="1" stroke-dasharray="4 3" fill="none"/><circle cx="${c}" cy="${y}" r="4" fill="#7fd36b"/>`)}},
geo:(W,H)=>{let s='',bw=(W-10)/2,bh=(H-50)/2;const figs=['M0,0 L4,0 L4,4 L0,4Z','M2,0 L4,4 L0,4Z','M0,2 L2,0 L4,2 L2,4Z','M0,4 L1,0 L3,0 L4,4Z'];
 for(let b=0;b<4;b++){const ox=5+(b%2)*bw,oy=(b>>1)*bh,st=Math.min(bw,bh-6)/5,sx=ox+(bw-st*4)/2,sy=oy+4;s+=`<rect x="${ox+2}" y="${oy+1}" width="${bw-4}" height="${bh-2}" fill="none" stroke="#000" stroke-dasharray="2"/>`;
  for(let i=0;i<5;i++)for(let j=0;j<5;j++)s+=`<circle cx="${sx+i*st}" cy="${sy+j*st}" r="1.2"/>`;
  s+=`<path d="${figs[b]}" transform="translate(${sx},${sy}) scale(${st})" fill="none" stroke="#e33" stroke-width="${2/st}" stroke-linejoin="round"/>`}
 const seqs=[['#e33','#2b6cff'],['#e33','#e33','#2b6cff','#2b6cff'],['#ffe14d','#7fd36b','#2b6cff']];
 seqs.forEach((q,k)=>{for(let i=0;i<12;i++){const x=12+i*((W-20)/12),y=2*bh+10+k*14;s+=i<8?`<circle cx="${x}" cy="${y}" r="5" fill="${q[i%q.length]}" stroke="#000" stroke-width="0.4"/>`:`<circle cx="${x}" cy="${y}" r="5" fill="none" stroke="#999" stroke-dasharray="1.5"/>`}});
 return {h:H,svg:svg(W,H,s)}},
math:(W,H)=>{let s='',cw=(W-4)/4,ch=Math.min(cw,(H-36)/3);for(let n=0;n<=10;n++){const x=2+(n%4)*cw,y=(n>>2)*ch;s+=`<rect x="${x+1}" y="${y+1}" width="${cw-2}" height="${ch-2}" rx="2" fill="#fff" stroke="#000" stroke-width="0.6" stroke-dasharray="2"/><text x="${x+cw/2}" y="${y+ch*.42}" font-size="${ch*.35}" text-anchor="middle">${n}</text>`;
  for(let d=0;d<n;d++)s+=`<circle cx="${x+cw/2-((Math.min(n,5)-1)*cw/14)+(d%5)*cw/7}" cy="${y+ch*.62+Math.floor(d/5)*ch*.15}" r="${cw/20}" fill="#2b6cff"/>`}
 const y0=3*ch+6,sw=(W-4)/20;for(let i=0;i<20;i++)s+=`<rect x="${2+i*sw}" y="${y0}" width="${sw}" height="${sw}" fill="${i<10?'#fff6b0':'#d9f5c9'}" stroke="#000" stroke-width="0.4"/><text x="${2+i*sw+sw/2}" y="${y0+sw*.68}" font-size="${sw*.5}" text-anchor="middle">${i+1}</text>`;
 return {h:H,svg:svg(W,H,s)}}};
// ---------- render ----------
function pageHTML(pi){const t=tpl(),[a,b]=PS[P.page],W=P.orient=='l'?b:a,H=P.orient=='l'?a:b,CW=W-16;let CH=H-16-12;
 let h=`<div class="page" style="width:${W}mm;height:${H}mm"><div class="ptitle" contenteditable data-k="title">${esc(P.title)}</div>`;
 if(t.kind=='table'){const cols=P.headers.length;h+=`<table class="dt"><tr>${P.headers.map((x,i)=>`<th contenteditable data-h="${i}">${esc(x)}</th>`).join('')}</tr>`;
  const rh=Math.max(7,Math.min(22,(CH-(t.legend?8:0)-(t.notes?40:0)-10)/P.rowsN));
  for(let r=0;r<P.rowsN;r++){h+=`<tr style="height:${rh}mm">`;for(let c=0;c<cols;c++){const v=(P.table[r]||[])[c]??(c==0&&t.col0?(t.col0[r]||''):'');h+=`<td contenteditable data-r="${r}" data-c="${c}">${esc(v)}</td>`}h+='</tr>'}
  h+='</table>'+(t.legend?`<div class="legend">${esc(t.legend)}</div>`:'')+(t.notes?`<div class="notes">${esc(t.notes)}</div>`:'');return h+'</div>'}
 let ex=null;if(t.extra)ex=EX[t.extra](CW,t.kind=='svg'?CH:Math.min(100,CH*.42));
 if(t.kind!='svg'){const avH=CH-(ex?ex.h+4:0)-(t.colHeads?8:0)-(t.extraText?10:0),rl=t.rowLabels?32:0,gap=P.cut?0:3,avW=CW-rl-(rl?gap:0);
  let cw=+P.w||((avW-gap*(P.cols-1))/P.cols),chh=+P.h||(+P.w?cw:(avH-gap*(P.rows-1))/P.rows);if(!+P.w&&!+P.h){cw=chh=Math.min(cw,chh);if(t.size===0){cw=(avW-gap*(P.cols-1))/P.cols;chh=(avH-gap*(P.rows-1))/P.rows}}
  const k=Math.min(1,(avW-gap*(P.cols-1))/(cw*P.cols),(avH-gap*(P.rows-1))/(chh*P.rows));cw*=k;chh*=k;
  h+=`<div class="grid${P.cut?' cut':''}${t.capTop?' capTop':''}" style="grid-template-columns:${rl?rl+'mm ':''}repeat(${P.cols},${cw.toFixed(2)}mm);grid-auto-rows:${chh.toFixed(2)}mm">`;
  if(t.colHeads)h+=(rl?'<div></div>':'')+t.colHeads.map(x=>`<div class="ch" style="height:7mm">${x}</div>`).join('');
  for(let r=0;r<P.rows;r++){if(rl)h+=`<div class="rl">${esc(t.rowLabels[r]||'')}</div>`;
   for(let c=0;c<P.cols;c++){const i=pi*P.cols*P.rows+r*P.cols+c,e=P.cells[i],im=img(e.img);
    let bc=P.frame=='none'?'transparent':P.frame=='color'?P.fc:P.frame=='fitz'&&e.fk?e.fk:'#000',bg=P.frame=='fitz'&&e.fk?e.fk+'55':(e.bg||'#fff');
    h+=`<div class="cell${t.noImg?' noImg':''}${t.round&&c>0?' round':''}${i==sel?' sel':''}" data-i="${i}" style="border-color:${bc};background:${bg}">${t.noImg?'':`<div class="img" style="${im?`background-image:url(${im})`:''}"></div>`}<div class="cap" style="font-size:${P.fs}pt">${esc(e.ru)}${e.kz?`<br><span class="kz">${esc(e.kz)}</span>`:''}</div></div>`}}
  h+='</div>';if(t.extraText)h+=`<div class="ptitle" style="margin-top:3mm">${t.extraText}</div>`}
 if(ex)h+=ex.svg;return h+'</div>'}
function render(){const t=tpl(),np=t.kind=='table'||t.kind=='svg'?1:P.pages;fitCells();let html='';for(let i=0;i<np;i++)html+=pageHTML(i);
 $('pages').innerHTML=html;const pv=$('preview');const [a,b]=PS[P.page],Wmm=P.orient=='l'?b:a,Hmm=P.orient=='l'?a:b,px=Wmm*96/25.4,sc=Math.min(1,(pv.clientWidth-30)/px);
 pv.innerHTML=[...$('pages').children].map(p=>`<div class="pw" style="width:${px*sc}px;height:${Hmm*96/25.4*sc}px"><div style="transform:scale(${sc});transform-origin:0 0">${p.outerHTML}</div></div>`).join('');
 $('pagestyle').textContent=`@page{size:${P.page} ${P.orient=='l'?'landscape':'portrait'};margin:0}`;
 $('gGrid').style.display=$('gImgs').style.display=t.kind?'none':'';$('gTable').style.display=t.kind=='table'?'':'none';$('gCell').style.display=sel>=0&&!t.kind?'':'none';$('lFc').style.display=P.frame=='color'?'':'none';
 $('tray').innerHTML=P.images.map((s,i)=>`<img src="${s}" data-im="${i}" draggable="true" class="${i===selImg?'sel':''}">`).join('');save()}
function syncUI(){$('sTpl').value=P.tpl;['title','page','orient','cols','rows','pages','w','h','frame','fc','fs','rowsN'].forEach(k=>{const el=document.querySelector(`[data-p="${k}"]`);if(el)el.value=P[k]});$('cCut').checked=P.cut;showCell()}
function showCell(){if(sel<0||!P.cells[sel])return;const e=P.cells[sel];$('cellNo').textContent='№'+(sel+1);$('tRu').value=e.ru;$('tKz').value=e.kz;$('sFk').value=e.fk}
function save(){try{localStorage.setItem('abaProject',JSON.stringify(P))}catch(e){console.warn('localStorage full')}}
// ---------- events ----------
$('sTpl').innerHTML=T.map(t=>`<option value="${t.id}">${t.id}. ${t.name}</option>`).join('');$('sFk').innerHTML=FK.map(f=>`<option value="${f[0]}">${f[1]}</option>`).join('');
[['iTitle','title'],['sPage','page'],['sOrient','orient'],['iCols','cols'],['iRows','rows'],['iPages','pages'],['iW','w'],['iH','h'],['sFrame','frame'],['iFc','fc'],['iFs','fs'],['iRowsN','rowsN']].forEach(([id,k])=>{const el=$(id);el.dataset.p=k;el.oninput=()=>{P[k]=el.type=='number'?Math.max(+el.min||0,+el.value||0):el.value;render()}});
$('cCut').onchange=e=>{P.cut=e.target.checked;render()};
document.querySelectorAll('[data-sz]').forEach(b=>b.onclick=()=>{P.w=P.h=+b.dataset.sz;syncUI();render()});
$('sTpl').onchange=e=>{P=newProject(+e.target.value);sel=-1;syncUI();render()};$('bNew').onclick=()=>{if(confirm('Сбросить текущий шаблон?')){const im=P.images;P=newProject(P.tpl);P.images=im;sel=-1;syncUI();render()}};
function addFiles(files,cb){[...files].filter(f=>/image\/(png|jpe?g)/.test(f.type)).forEach(f=>{const r=new FileReader();r.onload=()=>{P.images.push(r.result);cb&&cb(P.images.length-1);render()};r.readAsDataURL(f)})}
$('fImg').onchange=e=>{addFiles(e.target.files);e.target.value=''};
$('tray').onclick=e=>{if(e.target.dataset.im!=null){selImg=+e.target.dataset.im;if(sel>=0){P.cells[sel].img=selImg;}render()}};
$('tray').ondragstart=e=>e.dataTransfer.setData('text/plain',e.target.dataset.im);
$('bFill').onclick=()=>{let k=0;P.cells.forEach(c=>{if(c.img==null&&k<P.images.length)c.img=k++});render()};
const pv=$('preview');pv.onclick=e=>{const c=e.target.closest('.cell');if(!c)return;sel=+c.dataset.i;if(selImg!=null&&P.cells[sel].img==null){P.cells[sel].img=selImg}showCell();render()};
pv.ondragover=e=>e.preventDefault();pv.ondrop=e=>{e.preventDefault();const c=e.target.closest('.cell');if(!c)return;const i=+c.dataset.i;
 if(e.dataTransfer.files.length)addFiles(e.dataTransfer.files,ix=>{P.cells[i].img=ix});else{const v=e.dataTransfer.getData('text/plain');if(v!=='')P.cells[i].img=+v}render()};
pv.addEventListener('focusout',e=>{const d=e.target.dataset;if(!d)return;const v=e.target.innerText.trim();
 if(d.k)P.title=v,$('iTitle').value=v;else if(d.h!=null)P.headers[d.h]=v;else if(d.r!=null){(P.table[d.r]=P.table[d.r]||[])[d.c]=v}save()});
$('tRu').oninput=e=>{P.cells[sel].ru=e.target.value;render()};$('tKz').oninput=e=>{P.cells[sel].kz=e.target.value;render()};$('sFk').onchange=e=>{P.cells[sel].fk=e.target.value;if(P.frame!='fitz'){P.frame='fitz';syncUI()}render()};
$('bClrImg').onclick=()=>{P.cells[sel].img=null;render()};$('bClrCell').onclick=()=>{Object.assign(P.cells[sel],{ru:'',kz:'',fk:'',img:null});showCell();render()};
$('bPrint').onclick=()=>{document.activeElement&&document.activeElement.blur();render();window.print()};
$('bSave').onclick=()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(P)],{type:'application/json'}));a.download='aba-'+P.tpl+'.json';a.click()};
$('fLoad').onchange=e=>{const f=e.target.files[0];if(!f)return;f.text().then(s=>{try{P=JSON.parse(s);sel=-1;syncUI();render()}catch(x){alert('Неверный файл')}});e.target.value=''};
async function exportPDF(){document.activeElement&&document.activeElement.blur();sel=-1;render();const box=$('pages');box.style.cssText='display:block;position:absolute;left:-10000px;top:0';
 const [a,b]=PS[P.page],W=P.orient=='l'?b:a,H=P.orient=='l'?a:b;const pdf=new jspdf.jsPDF({orientation:P.orient=='l'?'landscape':'portrait',unit:'mm',format:P.page.toLowerCase()});
 const pages=[...box.children];for(let i=0;i<pages.length;i++){const c=await html2canvas(pages[i],{scale:2.5,backgroundColor:'#fff',useCORS:true});if(i)pdf.addPage();pdf.addImage(c.toDataURL('image/jpeg',0.92),'JPEG',0,0,W,H)}
 box.style.cssText='';return pdf}
$('bPdf').onclick=async()=>{const b=$('bPdf');b.disabled=true;b.textContent='⏳ PDF…';try{(await exportPDF()).save('aba-'+P.tpl+'.pdf')}catch(e){alert('Ошибка PDF: '+e)}b.disabled=false;b.textContent='📄 PDF'};
window.onresize=()=>render();
try{P=JSON.parse(localStorage.getItem('abaProject'))}catch(e){}if(!P||!P.tpl)P=newProject(1);syncUI();render();

$('bSpec').onclick=()=>{const b=$('specBox');if(!b.hidden){b.hidden=true;$('bSpec').textContent='🔒 Специалист';return}const p=prompt('PIN специалиста');if(p===null)return;if(p.trim()==='123456789A'){b.hidden=false;$('bSpec').textContent='🔓 Закрыть'}else alert('Неверный PIN')};
