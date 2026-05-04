/* ---- DATA ---- */
const PROCS = [
  {id:'cateterismo',  name:'Cateterismo Diagnóstico',         icon:'bi-heart-pulse',   color:'linear-gradient(135deg,#1C3454,#2A4D72)', desc:'Procedimiento de mínima invasión que utiliza un catéter insertado por la ingle o el brazo para acceder al corazón, permitiendo diagnosticar obstrucciones coronarias, arritmias y otras afecciones cardiovasculares con alta precisión.'},
  {id:'angioplastia', name:'Angioplastia Coronaria',           icon:'bi-activity',      color:'linear-gradient(135deg,#B82C2C,#921E1E)', desc:'Técnica intervencionista que restaura el flujo sanguíneo en arterias coronarias obstruidas mediante un pequeño balón que dilata la arteria desde adentro, aliviando síntomas de angina e infarto.'},
  {id:'stent',        name:'Implante de Stent',                icon:'bi-heart',         color:'linear-gradient(135deg,#0F1E32,#1C3454)', desc:'Colocación de una pequeña malla metálica dentro de la arteria coronaria para mantenerla abierta de forma permanente y prevenir nuevas obstrucciones, mejorando el flujo sanguíneo al músculo cardiaco.'},
  {id:'ivus',         name:'Ecocardiograma Intravascular',     icon:'bi-camera',        color:'linear-gradient(135deg,#2A4D72,#1C3454)', desc:'Uso de ultrasonido intravascular (IVUS) para visualizar el interior de las arterias coronarias con alta resolución, guiando intervenciones con mayor precisión y evaluando la gravedad de las lesiones.'},
  {id:'ffr',          name:'Estudio Funcional Coronario',      icon:'bi-graph-up',      color:'linear-gradient(135deg,#921E1E,#B82C2C)', desc:'Medición del flujo sanguíneo coronario mediante FFR/iFR para determinar con precisión si una lesión requiere intervención o puede manejarse con tratamiento médico, evitando procedimientos innecesarios.'},
  {id:'cierre',       name:'Cierre de Defectos Cardiacos',     icon:'bi-shield-check',  color:'linear-gradient(135deg,#1C3454,#0F1E32)', desc:'Corrección de comunicaciones interauriculares o interventriculares mediante dispositivos de cierre percutáneo, evitando la cirugía abierta y permitiendo una recuperación más rápida y segura.'},
];

const LS_GAL  = 'drjulio_gallery';
const LS_PROC = 'drjulio_proc_imgs';
const LS_HERO = 'drjulio_hero_img';
const LS_DOC  = 'drjulio_doc_img';

function lsGet(k){try{return JSON.parse(localStorage.getItem(k));}catch{return null;}}
function lsSet(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch{alert('Almacenamiento lleno. Elimina imágenes para continuar.');}}

/* ---- NAVBAR SCROLL ---- */
window.addEventListener('scroll',()=>document.getElementById('mainNavbar').classList.toggle('scrolled',scrollY>50));

/* ---- INTERSECTION OBSERVER ---- */
const io = new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target);}});
},{threshold:.1,rootMargin:'0px 0px -30px 0px'});
function initIO(){document.querySelectorAll('.fade-in,.fade-in-left,.fade-in-right').forEach(el=>io.observe(el));}

/* ---- PROCEDURES ---- */
function renderProcs(){
  const imgs = lsGet(LS_PROC)||{};
  document.getElementById('proceduresGrid').innerHTML = PROCS.map((p,i)=>{
    const src = imgs[p.id];
    const imgH = src
      ? `<img src="${src}" class="proc-img-real" alt="${p.name}">`
      : `<div class="proc-placeholder" style="background:${p.color};"><i class="bi ${p.icon}"></i><span>${p.name}</span></div>`;
    return `<div class="col-lg-4 col-md-6 fade-in" style="transition-delay:${i*.08}s;">
      <div class="proc-card">
        <div class="proc-img-wrap">${imgH}</div>
        <div class="card-body">
          <h5 class="card-title">${p.name}</h5>
          <p class="card-text">${p.desc}</p>
          <a href="https://wa.me/523312345678?text=Hola,%20me%20gustaría%20información%20sobre%20${encodeURIComponent(p.name)}" target="_blank" class="btn-teal">Más Info <i class="bi bi-arrow-right"></i></a>
        </div>
      </div>
    </div>`;
  }).join('');
}

/* ---- GALLERY (public) ---- */
function renderGal(cat='all'){
  const items = lsGet(LS_GAL)||[];
  const fil = cat==='all'?items:items.filter(i=>i.category===cat);
  const cats = [...new Set(items.map(i=>i.category))];

  let btns = `<button class="gal-filter-btn${cat==='all'?' active':''}" onclick="renderGal('all')">Todos</button>`;
  cats.forEach(c=>{ btns+=`<button class="gal-filter-btn${cat===c?' active':''}" onclick="renderGal('${c}')">${c}</button>`; });
  document.getElementById('galFilters').innerHTML = btns;

  const grid = document.getElementById('galGrid');
  if(items.length===0){
    grid.innerHTML=`<div class="col-12 text-center py-5 fade-in"><div class="gal-placeholder" style="max-width:380px;margin:0 auto;border-radius:var(--radius);height:280px;"><i class="bi bi-images"></i><span>Próximamente</span><span style="font-size:.73rem;opacity:.7;">Las imágenes aparecerán aquí</span></div></div>`;
    initIO(); return;
  }
  if(fil.length===0){grid.innerHTML=`<div class="col-12 text-center py-4 text-muted"><i class="bi bi-search me-2"></i>No hay imágenes en esta categoría</div>`;return;}
  grid.innerHTML = fil.map((item,i)=>`
    <div class="col-lg-3 col-sm-6 fade-in" style="transition-delay:${(i%8)*.06}s;">
      <div class="gal-item-wrap" onclick="openLB('${item.data}','${item.category} — ${item.type==='antes'?'Antes':'Después'}')">
        <img src="${item.data}" class="gal-img" alt="${item.category}">
        <div class="gal-overlay">
          <span class="gal-badge">${item.type==='antes'?'Antes':'Después'}</span>
          <span class="text-white ms-2" style="font-size:.78rem;">${item.category}</span>
        </div>
      </div>
    </div>`).join('');
  initIO();
}

/* ---- LIGHTBOX ---- */
function openLB(src,cap){
  document.getElementById('lbImg').src=src;
  document.getElementById('lbCaption').textContent=cap;
  new bootstrap.Modal(document.getElementById('modalLB')).show();
}

/* ---- LOAD HERO & DOCTOR ---- */
function loadHero(){
  const d=lsGet(LS_HERO);
  if(d){const bg=document.getElementById('heroBg');bg.style.backgroundImage=`url(${d})`;bg.style.backgroundSize='cover';bg.style.backgroundPosition='center';}
}
function loadDoc(){
  const d=lsGet(LS_DOC);
  if(d){document.getElementById('docPhotoPlaceholder').style.display='none';const img=document.getElementById('docPhotoImg');img.src=d;img.style.display='block';}
}

/* ---- CONTACT FORM ---- */
function handleContact(e){e.preventDefault();document.getElementById('contactOk').style.display='block';e.target.reset();setTimeout(()=>document.getElementById('contactOk').style.display='none',5000);}

/* ---- ADMIN AUTH ---- */
let _admModal=null;
function showAdminLogin(){
  document.getElementById('adminPwd').value='';
  document.getElementById('loginErr').style.display='none';
  _admModal=new bootstrap.Modal(document.getElementById('modalLogin'));
  _admModal.show();
  setTimeout(()=>document.getElementById('adminPwd').focus(),450);
}
function checkPwd(){
  if(document.getElementById('adminPwd').value==='admin123'){
    _admModal.hide(); openAdmin();
  } else {
    document.getElementById('loginErr').style.display='block';
    document.getElementById('adminPwd').value='';
    document.getElementById('adminPwd').focus();
  }
}
function openAdmin(){
  const p=document.getElementById('adminPanel');
  p.style.display='flex';
  document.body.style.overflow='hidden';
  showAdmSec('dashboard', p.querySelector('.adm-nav-link'));
}
function exitAdmin(){
  document.getElementById('adminPanel').style.display='none';
  document.body.style.overflow='';
  renderProcs(); renderGal(); loadHero(); loadDoc(); initIO();
}

/* ---- ADMIN SECTIONS ---- */
function showAdmSec(sec, linkEl){
  ['secDashboard','secGallery','secProcedures','secHero'].forEach(id=>{document.getElementById(id).style.display='none';});
  document.querySelectorAll('.adm-nav-link').forEach(l=>l.classList.remove('active'));
  if(linkEl) linkEl.classList.add('active');
  document.getElementById('sec'+sec.charAt(0).toUpperCase()+sec.slice(1)).style.display='block';
  if(sec==='dashboard') loadDash();
  if(sec==='gallery')   loadAdmGal();
  if(sec==='procedures') loadAdmProcs();
  if(sec==='hero')      loadAdmHero();
  return false;
}

/* ---- DASHBOARD ---- */
function loadDash(){
  const items=lsGet(LS_GAL)||[];
  const pImgs=lsGet(LS_PROC)||{};
  const hImg=lsGet(LS_HERO);
  const dImg=lsGet(LS_DOC);
  document.getElementById('dashStats').innerHTML=`
    <div class="col-6 col-md-3"><div class="adm-stat"><div class="adm-stat-num">${items.length}</div><div class="adm-stat-lbl">Fotos galería</div></div></div>
    <div class="col-6 col-md-3"><div class="adm-stat"><div class="adm-stat-num">${Object.keys(pImgs).length}</div><div class="adm-stat-lbl">Imgs procedimientos</div></div></div>
    <div class="col-6 col-md-3"><div class="adm-stat"><div class="adm-stat-num">${hImg?1:0}</div><div class="adm-stat-lbl">Imagen hero</div></div></div>
    <div class="col-6 col-md-3"><div class="adm-stat"><div class="adm-stat-num">${dImg?1:0}</div><div class="adm-stat-lbl">Foto doctor</div></div></div>`;
  document.getElementById('dashCats').innerHTML = PROCS.map(p=>{
    const cnt=items.filter(i=>i.category===p.name).length;
    const pct=items.length?Math.round(cnt/items.length*100):0;
    return `<div class="mb-3"><div class="d-flex justify-content-between mb-1"><span style="font-size:.875rem;font-weight:500;">${p.name}</span><span style="font-size:.78rem;color:var(--text-muted);">${cnt} imagen${cnt!==1?'es':''}</span></div><div style="height:5px;background:#EEE;border-radius:3px;"><div style="height:100%;width:${pct}%;background:linear-gradient(to right,var(--teal),var(--gold));border-radius:3px;transition:width .6s;"></div></div></div>`;
  }).join('');
}

/* ---- ADMIN GALLERY ---- */
let _galFile=null;
function onGalFile(e){
  const f=e.target.files[0]; if(!f) return;
  const r=new FileReader();
  r.onload=ev=>{_galFile=ev.target.result;document.getElementById('galPreview').innerHTML=`<img src="${_galFile}" style="max-width:100%;max-height:240px;border-radius:var(--radius-sm);object-fit:contain;">`};
  r.readAsDataURL(f);
}
function saveGalImg(){
  if(!_galFile){alert('Selecciona una imagen primero.');return;}
  const items=lsGet(LS_GAL)||[];
  items.push({id:Date.now(),data:_galFile,category:document.getElementById('galCat').value,type:document.getElementById('galType').value});
  lsSet(LS_GAL,items);
  _galFile=null;
  document.getElementById('galFileIn').value='';
  document.getElementById('galPreview').innerHTML=`<span class="text-muted" style="font-size:.83rem;"><i class="bi bi-eye me-1"></i>Vista previa</span>`;
  loadAdmGal(); loadDash();
}
function loadAdmGal(cat='all'){
  const items=lsGet(LS_GAL)||[];
  const fil=cat==='all'?items:items.filter(i=>i.category===cat);
  const g=document.getElementById('admGalGrid');
  if(!fil.length){g.innerHTML=`<p class="text-muted" style="font-size:.875rem;"><i class="bi bi-inbox me-1"></i>No hay imágenes aquí aún.</p>`;return;}
  g.innerHTML=fil.map(item=>`
    <div class="adm-gal-item" id="gi-${item.id}">
      <img src="${item.data}" alt="${item.category}">
      <div class="adm-gal-info">
        <div style="font-weight:500;color:var(--teal-dark);font-size:.82rem;">${item.category}</div>
        <div style="color:var(--text-muted);font-size:.78rem;">${item.type==='antes'?'Antes':'Después'}</div>
        <div class="d-flex gap-1 mt-1">
          <button class="btn-xs" style="background:#E8F5E9;color:#2E7D32;" onclick="moveGal(${item.id},-1)" title="Subir"><i class="bi bi-arrow-up"></i></button>
          <button class="btn-xs" style="background:#E3F2FD;color:#1565C0;" onclick="moveGal(${item.id},1)"  title="Bajar"><i class="bi bi-arrow-down"></i></button>
          <button class="btn-xs" style="background:#FFEBEE;color:#C62828;" onclick="delGal(${item.id})"    title="Eliminar"><i class="bi bi-trash"></i></button>
        </div>
      </div>
    </div>`).join('');
}
function delGal(id){
  if(!confirm('¿Eliminar esta imagen?')) return;
  let items=(lsGet(LS_GAL)||[]).filter(i=>i.id!==id);
  lsSet(LS_GAL,items);
  loadAdmGal(document.getElementById('admGalFilter').value);
  loadDash();
}
function moveGal(id,dir){
  let items=lsGet(LS_GAL)||[];
  const idx=items.findIndex(i=>i.id===id); if(idx<0) return;
  const ni=idx+dir; if(ni<0||ni>=items.length) return;
  [items[idx],items[ni]]=[items[ni],items[idx]];
  lsSet(LS_GAL,items);
  loadAdmGal(document.getElementById('admGalFilter').value);
}

/* ---- ADMIN PROCEDURES ---- */
const _pendProc={};
function loadAdmProcs(){
  const imgs=lsGet(LS_PROC)||{};
  document.getElementById('admProcGrid').innerHTML=PROCS.map(p=>{
    const src=imgs[p.id];
    const prev=src?`<img src="${src}" style="width:100%;height:145px;object-fit:cover;border-radius:var(--radius-sm);">`:`<div style="height:145px;border-radius:var(--radius-sm);display:flex;align-items:center;justify-content:center;background:${p.color};color:#fff;font-size:2rem;"><i class="bi ${p.icon}"></i></div>`;
    return `<div class="col-md-6 col-lg-4">
      <div class="adm-card" style="padding:1rem;">
        <div id="pp-${p.id}" class="mb-2">${prev}</div>
        <h6 style="font-family:'Playfair Display',serif;color:var(--teal-dark);font-size:.95rem;margin-bottom:.75rem;">${p.name}</h6>
        <div id="prt-${p.id}"></div>
        <label class="upload-zone" for="pf-${p.id}" style="padding:.9rem;margin-bottom:.5rem;">
          <i class="bi bi-image" style="font-size:1.4rem;margin-bottom:.4rem;"></i>
          <p class="mb-0" style="font-size:.78rem;color:var(--teal-dark);">Cambiar imagen</p>
        </label>
        <input type="file" id="pf-${p.id}" accept="image/*" class="d-none" onchange="onProcFile(event,'${p.id}')">
        <div class="d-flex gap-1 mt-2">
          <button class="btn-gold" style="font-size:.78rem;padding:.38rem .7rem;" onclick="saveProcImg('${p.id}')"><i class="bi bi-floppy"></i> Guardar</button>
          ${src?`<button class="btn-teal" style="background:#95A5A6;font-size:.78rem;padding:.38rem .7rem;" onclick="delProcImg('${p.id}')"><i class="bi bi-trash"></i></button>`:''}
        </div>
      </div>
    </div>`;
  }).join('');
}
function onProcFile(e,id){
  const f=e.target.files[0]; if(!f) return;
  const r=new FileReader();
  r.onload=ev=>{
    _pendProc[id]=ev.target.result;
    document.getElementById(`prt-${id}`).innerHTML=`<img src="${ev.target.result}" style="width:100%;height:110px;object-fit:cover;border-radius:var(--radius-sm);margin-bottom:.5rem;border:2px solid var(--gold);"><p style="font-size:.72rem;color:var(--gold);margin-bottom:.4rem;"><i class="bi bi-eye me-1"></i>Vista previa en tiempo real</p>`;
  };
  r.readAsDataURL(f);
}
function saveProcImg(id){
  if(!_pendProc[id]){alert('Selecciona una imagen primero.');return;}
  const imgs=lsGet(LS_PROC)||{};
  imgs[id]=_pendProc[id];
  lsSet(LS_PROC,imgs);
  delete _pendProc[id];
  loadAdmProcs();
}
function delProcImg(id){
  if(!confirm('¿Eliminar imagen?')) return;
  const imgs=lsGet(LS_PROC)||{};
  delete imgs[id];
  lsSet(LS_PROC,imgs);
  loadAdmProcs();
}

/* ---- ADMIN HERO / DOC ---- */
let _heroFile=null, _docFile=null;
function onHeroFile(e){const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>{_heroFile=ev.target.result;document.getElementById('heroPreview').innerHTML=`<img src="${_heroFile}" style="max-width:100%;max-height:250px;object-fit:contain;border-radius:var(--radius-sm);">`};r.readAsDataURL(f);}
function saveHeroImg(){if(!_heroFile){alert('Selecciona una imagen.');return;}lsSet(LS_HERO,_heroFile);_heroFile=null;document.getElementById('heroFileIn').value='';alert('Imagen del Hero guardada.');}
function delHeroImg(){if(!confirm('¿Eliminar imagen del Hero?'))return;localStorage.removeItem(LS_HERO);document.getElementById('heroPreview').innerHTML=`<span class="text-muted" style="font-size:.83rem;"><i class="bi bi-eye me-1"></i>Vista previa</span>`;alert('Eliminada.');}

function onDocFile(e){const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>{_docFile=ev.target.result;document.getElementById('docPreview').innerHTML=`<img src="${_docFile}" style="max-width:100%;max-height:250px;object-fit:contain;border-radius:var(--radius-sm);">`};r.readAsDataURL(f);}
function saveDocImg(){if(!_docFile){alert('Selecciona una imagen.');return;}lsSet(LS_DOC,_docFile);_docFile=null;document.getElementById('docFileIn').value='';alert('Foto del doctor guardada.');}
function delDocImg(){if(!confirm('¿Eliminar foto del doctor?'))return;localStorage.removeItem(LS_DOC);document.getElementById('docPreview').innerHTML=`<span class="text-muted" style="font-size:.83rem;"><i class="bi bi-eye me-1"></i>Vista previa</span>`;alert('Eliminada.');}

function loadAdmHero(){
  const h=lsGet(LS_HERO); if(h) document.getElementById('heroPreview').innerHTML=`<img src="${h}" style="max-width:100%;max-height:250px;object-fit:contain;border-radius:var(--radius-sm);">`;
  const d=lsGet(LS_DOC);  if(d) document.getElementById('docPreview').innerHTML=`<img src="${d}" style="max-width:100%;max-height:250px;object-fit:contain;border-radius:var(--radius-sm);">`;
}

/* ---- INIT ---- */
document.addEventListener('DOMContentLoaded',()=>{
  renderProcs();
  renderGal();
  loadHero();
  loadDoc();
  initIO();
});
