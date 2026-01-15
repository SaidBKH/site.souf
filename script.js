/* ===============================
        SCRIPT GLOBAL
   =============================== */

document.addEventListener("DOMContentLoaded", () => {

  /* ===============================
        NAVBAR — auto-hide & shrink
     =============================== */
  const navbar = document.querySelector('.navbar');
  const hamburger = document.getElementById('hamburgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileOverlay = document.getElementById('mobileOverlay');
  const closeMobile = document.getElementById('closeMobile');

  if(navbar){
    let lastScroll = window.scrollY || 0;
    const shrinkAt = 40;
    window.addEventListener('scroll', ()=>{
      const y = window.scrollY || 0;
      if(y > lastScroll && y > 100) navbar.classList.add('hidden');
      else navbar.classList.remove('hidden');

      if(y > shrinkAt) navbar.classList.add('shrink');
      else navbar.classList.remove('shrink');
      lastScroll = y;
    }, {passive:true});
  }

  /* ===============================
        SMOOTH SCROLL
     =============================== */
  if(navbar){
    document.querySelectorAll('a[href^="#"]').forEach(a=>{
      a.addEventListener('click', (e)=>{
        const href = a.getAttribute('href');
        if(!href || href === '#' || !document.querySelector(href)) return;
        e.preventDefault();
        const target = document.querySelector(href);
        const top = target.getBoundingClientRect().top + window.scrollY - (navbar.offsetHeight || 76) - 12;
        window.scrollTo({top, behavior:'smooth'});

        if(mobileMenu && mobileMenu.classList.contains('active')) closeMobileMenu();
      });
    });
  }

  /* ===============================
        MOBILE MENU
     =============================== */
  function openMobileMenu(){
    if(!mobileMenu || !mobileOverlay || !hamburger) return;
    mobileMenu.classList.add('active');
    mobileOverlay.classList.add('active');
    hamburger.classList.add('active');
    mobileMenu.setAttribute('aria-hidden','false');
    hamburger.setAttribute('aria-expanded','true');
    trapFocus(mobileMenu);
  }

function closeMobileMenu(){
  if(!mobileMenu || !mobileOverlay || !hamburger) return;

  // 🔥 NOUVEAU : sortir le focus du menu avant de le cacher
  if (mobileMenu.contains(document.activeElement)) {
    hamburger.focus();
  }

  mobileMenu.classList.remove('active');
  mobileOverlay.classList.remove('active');
  hamburger.classList.remove('active');

  mobileMenu.setAttribute('aria-hidden','true');
  hamburger.setAttribute('aria-expanded','false');
}


  function trapFocus(container){
    const focusables = container.querySelectorAll('a, button, input, [tabindex]:not([tabindex="-1"])');
    if(!focusables.length) return;
    const first = focusables[0], last = focusables[focusables.length-1];
    function keyHandler(e){
      if(e.key !== 'Tab') return;
      if(e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
      else if(!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
    }
    container.addEventListener('keydown', keyHandler);
    first.focus();
    const obs = new MutationObserver(()=>{ 
      if(!container.classList.contains('active')){
        container.removeEventListener('keydown', keyHandler);
        obs.disconnect();
      }
    });
    obs.observe(container, { attributes: true, attributeFilter: ['class'] });
  }

  if(hamburger) hamburger.addEventListener('click', ()=> mobileMenu.classList.contains('active') ? closeMobileMenu() : openMobileMenu());
  if(closeMobile) closeMobile.addEventListener('click', closeMobileMenu);
  if(mobileOverlay) mobileOverlay.addEventListener('click', closeMobileMenu);
  document.addEventListener('click', (e)=>{
    if(mobileMenu && mobileMenu.classList.contains('active') && !mobileMenu.contains(e.target) && !hamburger.contains(e.target)) closeMobileMenu();
  });


const dropdownBtn = document.querySelector('.dropdown-toggle');

if (dropdownBtn) {
  dropdownBtn.addEventListener('click', () => {
    const expanded = dropdownBtn.getAttribute('aria-expanded') === 'true';
    dropdownBtn.setAttribute('aria-expanded', String(!expanded));
    dropdownBtn.parentElement.classList.toggle('open');
  });

  document.addEventListener('click', (e) => {
    if (!dropdownBtn.parentElement.contains(e.target)) {
      dropdownBtn.setAttribute('aria-expanded', 'false');
      dropdownBtn.parentElement.classList.remove('open');
    }
  });
}

/* ===============================
   MOBILE DROPDOWN
================================ */

document.querySelectorAll('.mobile-dropdown-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const parent = btn.closest('.mobile-dropdown');
    const expanded = btn.getAttribute('aria-expanded') === 'true';

    btn.setAttribute('aria-expanded', String(!expanded));
    parent.classList.toggle('open');
  });
});



  /* ===============================
        MODAL
     =============================== */
  const btnRdvTop = document.getElementById('btn-rdv-top');
  const btnRdvHero = document.getElementById('btn-rdv');
  const modal = document.getElementById('modal');
  const modalClose = document.getElementById('modal-close');

  function openModal(){ if(!modal) return; modal.style.opacity='1'; modal.style.pointerEvents='auto'; modal.classList.add('open'); }
  function closeModalFn(){ if(!modal) return; modal.style.opacity='0'; modal.style.pointerEvents='none'; modal.classList.remove('open'); }

  if(btnRdvTop) btnRdvTop.addEventListener('click', openModal);
  if(btnRdvHero) btnRdvHero.addEventListener('click', openModal);
  if(modalClose) modalClose.addEventListener('click', closeModalFn);
  if(modal) modal.addEventListener('click', (e)=>{ if(e.target === modal) closeModalFn(); });

  window.openPlanityModal = openModal;

  /* ===============================
        CHOOSE BUTTONS
     =============================== */
  const chooseBtns = document.querySelectorAll('.choose-salon');
  const salonCtas = document.querySelectorAll('.salon-cta');
  chooseBtns.forEach(btn=> btn.addEventListener('click', ()=> {
    const link = btn.getAttribute('data-link') || '';
    if(link) window.open(link,'_blank'); else window.open('https://www.planity.com','_blank');
  }));
  salonCtas.forEach(btn=> btn.addEventListener('click', ()=> {
    const link = btn.getAttribute('data-planity') || '';
    if(link) window.open(link,'_blank'); else window.open('https://www.planity.com','_blank');
  }));

  /* ===============================
        FLOATING BOOK
     =============================== */
  const mobileBook = document.getElementById('mobile-book');
  if(mobileBook) mobileBook.addEventListener('click', ()=> { closeMobileMenu(); setTimeout(openModal, 220); });

  /* ===============================
        QUIZ / PILL INTERACTIONS
     =============================== */
  function makePillsInteractive(containerId){
    const container = document.getElementById(containerId);
    if(!container) return;
    container.querySelectorAll('.pill-reco').forEach(pill=>{
      pill.addEventListener('click', ()=> activatePill(pill, container));
      pill.addEventListener('keydown', (e)=>{
        if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activatePill(pill, container); }
      });
    });
  }

  function activatePill(pill, container){
    container.querySelectorAll('.pill-reco').forEach(p=>p.classList.remove('active'));
    pill.classList.add('active');
  }

  ['q-hair','q-goal','q-beard'].forEach(makePillsInteractive);

  /* ===============================
        RITUALS LOGIC
     =============================== */
  const rituals = {
    "fins|propre|non": { title:"Rituel Coupe & Finition", sub:"Coupe précise et légère pour un rendu net et naturel.", includes:["Coupe adaptée à l’implantation","Texture légère","Finitions propres"], upgrade:"Un coiffage professionnel peut être réalisé en salon." },
    "fins|propre|oui": { title:"Coupe + Barbe Complète", sub:"Harmonisation cheveux et barbe pour un rendu propre et équilibré.", includes:["Coupe légère","Traçage et taille de barbe","Serviettes chaudes & massage"], upgrade:"Barbe Premium disponible pour une finition vapeur et cire." },
    "epais|volume|oui": { title:"Équilibre Cheveux & Barbe", sub:"Structuration du volume et allègement maîtrisé.", includes:["Coupe structurée","Taille et traçage de barbe","Massage & serviettes chaudes"], upgrade:"Disponible en version Premium avec soin du visage." },
    "boucles|transform|oui": { title:"Transformation Signature", sub:"Refonte complète respectant le mouvement naturel des boucles.", includes:["Diagnostic capillaire","Coupe texturée","Barbe Premium","Soin du visage"], upgrade:"Couleur ou permanente possibles sur devis." }
  };

  const btnRun = document.getElementById('btn-run');
  const btnReset = document.getElementById('btn-reset');
  const resultCard = document.getElementById('result');
  const loader = document.getElementById('result-loader');
  const body = document.getElementById('result-body');
  const progressBar = document.getElementById('progress-bar');
  const panel = document.getElementById('panel-questions');

  function hideResult(){
    if(resultCard) resultCard.classList.remove('visible'), resultCard.classList.add('hidden');
    if(loader) loader.style.display='none';
    if(body) body.style.display='none';
    if(progressBar) progressBar.style.width='0%';
    if(btnRun) btnRun.setAttribute('aria-expanded','false');
  }

  function showLoader(){
    if(!loader || !body || !resultCard || !progressBar || !btnRun) return;
    body.style.display='none';
    loader.style.display='flex';
    resultCard.classList.remove('hidden');
    resultCard.classList.add('visible');
    btnRun.setAttribute('aria-expanded','true');
    progressBar.style.width='0%';

    let start=null;
    const duration=900+Math.random()*400;

    function step(ts){
      if(!start) start=ts;
      const progress=Math.min(1,(ts-start)/duration);
      progressBar.style.width=(progress*100)+'%';
      if(progress<1) requestAnimationFrame(step);
      else setTimeout(showResultContent,220);
    }
    requestAnimationFrame(step);
  }

  function showResultContent(){
    if(!body || !resultCard) return;
    loader.style.display='none';
    body.style.display='block';
    body.style.opacity='0';
    body.style.transform='translateY(6px)';
    requestAnimationFrame(()=>{
      body.style.transition='all .35s ease';
      body.style.opacity='1';
      body.style.transform='translateY(0)';
    });
  }

  if(btnRun){
    btnRun.addEventListener('click', ()=>{
      const h=document.querySelector('#q-hair .pill-reco.active');
      const g=document.querySelector('#q-goal .pill-reco.active');
      const b=document.querySelector('#q-beard .pill-reco.active');
      if(!h || !g || !b){
        if(panel) panel.animate([{transform:'translateX(0)'},{transform:'translateX(-6px)'},{transform:'translateX(6px)'},{transform:'translateX(0)'}],{duration:280});
        return;
      }
      const key=`${h.dataset.value}|${g.dataset.value}|${b.dataset.value}`;
      const r=rituals[key]||{title:"Rituel Personnalisé",sub:"Nous adaptons la prestation selon l’observation en salon.",includes:["Diagnostic en fauteuil","Proposition sur-mesure"],upgrade:"Option Premium recommandée pour une expérience complète."};
      if(document.getElementById('r-title')) document.getElementById('r-title').innerText=r.title;
      if(document.getElementById('r-sub')) document.getElementById('r-sub').innerText=r.sub;
      const ul=document.getElementById('r-includes');
      if(ul) { ul.innerHTML=''; r.includes.forEach(i=>{ const li=document.createElement('li'); li.innerText=i; ul.appendChild(li); }); }
      if(document.getElementById('r-upgrade')) document.getElementById('r-upgrade').innerText=r.upgrade;
      showLoader();
    });
  }

  if(btnReset){
    btnReset.addEventListener('click', ()=>{
      document.querySelectorAll('.pill-reco').forEach(p=>p.classList.remove('active'));
      hideResult();
    });
  }

  hideResult();

  /* ===============================
        HERO ANIMATION
     =============================== */
  const hero=document.getElementById('hero');
  if(hero){
    hero.style.opacity='0';
    hero.style.transform='translateY(24px)';
    requestAnimationFrame(()=>{
      hero.style.transition='opacity 0.8s ease-out, transform 0.8s ease-out';
      hero.style.opacity='1';
      hero.style.transform='translateY(0)';
    });
    window.addEventListener('scroll', ()=>{
      const y=window.scrollY;
      const offset=Math.min(y*0.08,22);
      hero.style.transform=`translateY(${offset}px)`;
    });
  }

  /* ===============================
        TESTIMONIALS CAROUSEL
     =============================== */
  const reviews=[
    {name:"Skander Wadid",avatar:"",text:"Un concept avant-gardiste ...",date:"Visité en mars"},
    {name:"Marine",avatar:"",text:"Clément est un coiffeur ...",date:"Visité en août"},
    {name:"amin obst",avatar:"",text:"Exceptionnel ...",date:"Visité en août"},
    {name:"slimani djalel",avatar:"",text:"Très pro ...",date:"Visité en octobre"}
  ];

  const track=document.getElementById('testi-track');
  const dotsContainer=document.getElementById('testi-dots');
  if(track && dotsContainer){
    track.innerHTML=reviews.map(r=>`
      <div class="testi">
        <div class="testi-card">
          <div class="testi-header">
            <div class="testi-avatar">${r.avatar?r.avatar[0]:r.name[0]}</div>
            <div>
              <div class="testi-name">${r.name}</div>
              <div class="testi-stars">★★★★★</div>
            </div>
          </div>
          <div class="testi-text">${r.text}</div>
          <div class="muted" style="font-size:13px;margin-top:8px;">${r.date}</div>
        </div>
      </div>
    `).join('');

    dotsContainer.innerHTML=reviews.map((_,i)=>`<div class="testi-dot ${i===0?'active':''}" data-i="${i}"></div>`).join('');
    const dots=[...document.querySelectorAll(".testi-dot")];
    let index=0;
    function updateCarousel(){ track.style.transform=`translateX(-${index*100}%)`; dots.forEach(d=>d.classList.remove('active')); dots[index].classList.add('active'); }
    dots.forEach(dot=>dot.addEventListener('click', ()=>{ index=parseInt(dot.dataset.i); updateCarousel(); }));
    setInterval(()=>{ index=(index+1)%reviews.length; updateCarousel(); },6000);

    let startX=0;
    track.addEventListener("touchstart", e=>startX=e.touches[0].clientX);
    track.addEventListener("touchend", e=>{
      const dx=e.changedTouches[0].clientX-startX;
      if(dx<-40) index=(index+1)%reviews.length;
      if(dx>40) index=(index-1+reviews.length)%reviews.length;
      updateCarousel();
    });
  }




  /* ===============================
        RITUELS — Sélection & CTA
     =============================== */
  const rituelEls = document.querySelectorAll('.rituel');
  const actionBar = document.getElementById('rituel-action');
  const selectedLabel = document.getElementById('rituel-selected');
  const bookLink = document.getElementById('book-rituel');
  const clearBtn = document.getElementById('clear-selection');

  if(rituelEls.length){

    let current = null;

    function setSelected(el){
      if(!el) return clearSelection();
      if(current === el){ clearSelection(); return; }

      if(current){
        current.classList.remove('selected');
        current.setAttribute('aria-pressed','false');
      }

      current = el;
      current.classList.add('selected');
      current.setAttribute('aria-pressed','true');

      const name = el.dataset.rituel || el.querySelector('h3')?.innerText || 'Rituel';
      if(selectedLabel) selectedLabel.textContent = name;
      if(actionBar) actionBar.setAttribute('aria-hidden','false');

      if(bookLink){
        bookLink.dataset.rituel = name;
        bookLink.onclick = window.openPlanityModal || null;
      }
    }

    function clearSelection(){
      if(current){
        current.classList.remove('selected');
        current.setAttribute('aria-pressed','false');
        current = null;
      }
      if(actionBar) actionBar.setAttribute('aria-hidden','true');
      if(selectedLabel) selectedLabel.textContent = '—';
      if(bookLink) bookLink.removeAttribute('data-rituel');
    }

    rituelEls.forEach(el=>{
      el.addEventListener('click', ()=> setSelected(el));
      el.addEventListener('keydown', e=>{
        if(e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setSelected(el);
        }
        if(e.key === 'Escape') clearSelection();
      });
    });

    if(clearBtn) clearBtn.addEventListener('click', clearSelection);
  }





});

/* ===============================
        RITUELS — Animation & Modal
   =============================== */
