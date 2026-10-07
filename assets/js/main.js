/* Pahalwan Ji — interactions (vanilla JS, no libraries) */
(function(){
  "use strict";

  var header = document.querySelector('.site-header');
  function onScroll(){ if(header){ header.classList.toggle('scrolled', window.scrollY > 8); } }
  window.addEventListener('scroll', onScroll, {passive:true}); onScroll();

  /* ---------- Mobile nav (fixed overlay; never occupies page height) ---------- */
  var ham = document.getElementById('hamburger');
  var mnav = document.getElementById('mobileNav');
  var mclose = document.getElementById('mobileClose');
  function openNav(){
    if(!mnav) return;
    mnav.classList.add('open');
    mnav.setAttribute('aria-hidden','false');
    if(ham) ham.setAttribute('aria-expanded','true');
    document.body.style.overflow='hidden';
    if(mclose) mclose.focus({preventScroll:true});
  }
  function closeNav(){
    if(!mnav) return;
    mnav.classList.remove('open');
    mnav.setAttribute('aria-hidden','true');
    if(ham) ham.setAttribute('aria-expanded','false');
    document.body.style.overflow='';
  }
  if(ham) ham.addEventListener('click', openNav);
  if(mclose) mclose.addEventListener('click', function(){ closeNav(); if(ham) ham.focus({preventScroll:true}); });
  if(mnav) mnav.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', closeNav); });

  /* ---------- Reveal on scroll ---------- */
  var els = document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window && els.length){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){ if(en.isIntersecting){ en.target.classList.add('visible'); io.unobserve(en.target); } });
    },{threshold:.1,rootMargin:'0px 0px -6% 0px'});
    els.forEach(function(el){ io.observe(el); });
  } else { els.forEach(function(el){ el.classList.add('visible'); }); }

  /* ---------- Menu filter ---------- */
  var fbtns = document.querySelectorAll('.filter-btn');
  var items = document.querySelectorAll('#menuBoard .menu-item');
  fbtns.forEach(function(btn){
    btn.addEventListener('click', function(){
      fbtns.forEach(function(b){ b.classList.remove('active'); b.setAttribute('aria-pressed','false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed','true');
      var f = btn.getAttribute('data-filter');
      items.forEach(function(it){
        var show = (f==='all' || it.getAttribute('data-cat')===f);
        it.style.display = show ? '' : 'none';
      });
    });
    btn.setAttribute('aria-pressed', btn.classList.contains('active') ? 'true' : 'false');
  });

  /* ---------- Lightbox (real photos only) ---------- */
  var lb = document.getElementById('lightbox');
  var lbImg = document.getElementById('lightboxImg');
  var lbCount = document.getElementById('lbCount');
  var galleryImgs = Array.prototype.slice.call(document.querySelectorAll('[data-lightbox]'));
  var idx = 0;
  function paint(){
    if(!lb || !galleryImgs.length) return;
    var src = galleryImgs[idx].getAttribute('data-full') || galleryImgs[idx].src;
    lbImg.src = src;
    lbImg.alt = galleryImgs[idx].alt || 'Pahalwan Ji photo';
    if(lbCount) lbCount.textContent = (idx+1) + ' / ' + galleryImgs.length;
  }
  function openLB(i){
    if(!lb || !galleryImgs.length) return;
    idx = ((i % galleryImgs.length) + galleryImgs.length) % galleryImgs.length;
    paint();
    lb.classList.add('open');
    document.body.style.overflow='hidden';
  }
  function closeLB(){
    if(!lb) return;
    lb.classList.remove('open');
    document.body.style.overflow='';
  }
  function step(d){ idx = ((idx+d % galleryImgs.length) + galleryImgs.length) % galleryImgs.length; paint(); }
  galleryImgs.forEach(function(im,i){
    im.addEventListener('click', function(){ openLB(i); });
    im.addEventListener('keydown', function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); openLB(i); } });
    if(!im.hasAttribute('tabindex')) im.setAttribute('tabindex','0');
    im.setAttribute('role','button');
  });
  if(lb){ lb.addEventListener('click', function(e){ if(e.target===lb) closeLB(); }); }
  var p=document.getElementById('lbPrev'), n=document.getElementById('lbNext'), c=document.getElementById('lbClose');
  if(p) p.addEventListener('click', function(e){ e.stopPropagation(); step(-1); });
  if(n) n.addEventListener('click', function(e){ e.stopPropagation(); step(1); });
  if(c) c.addEventListener('click', function(e){ e.stopPropagation(); closeLB(); });

  /* Touch swipe */
  var sx=0;
  if(lb){
    lb.addEventListener('touchstart', function(e){ sx=e.touches[0].clientX; }, {passive:true});
    lb.addEventListener('touchend', function(e){
      var dx=e.changedTouches[0].clientX-sx;
      if(Math.abs(dx)>40){ step(dx<0?1:-1); }
    }, {passive:true});
  }

  /* Keyboard: Escape closes, arrows navigate lightbox */
  document.addEventListener('keydown', function(e){
    if(e.key==='Escape'){ closeNav(); closeLB(); }
    if(lb && lb.classList.contains('open')){
      if(e.key==='ArrowLeft'){ e.preventDefault(); step(-1); }
      if(e.key==='ArrowRight'){ e.preventDefault(); step(1); }
    }
  });

  /* Footer year */
  var yr = new Date().getFullYear();
  document.querySelectorAll('.foot-bottom span:first-child').forEach(function(s){
    s.textContent = s.textContent.replace(/©\s*\d{4}/, '© ' + yr);
  });
})();
