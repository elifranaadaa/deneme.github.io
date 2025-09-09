/* =====================================================
   BILKUR MADENCILIK - ANA JAVASCRIPT DOSYASI
   ===================================================== */

   /* ===== İÇERİK SIRALAMASI ===== */
   /*
   1. GENEL FONKSIYONLAR
   2. MEGA MENÜ KATEGORİLERİ  
   3. ANA SLIDER SİSTEMİ
   4. PRELOADER
   5. SCROLL INDICATOR
   6. PARALLAX HERO VIDEO
   7. BOTTOM DOCK & OVERLAY MENU
   8. HAKKIMIZDA ANIMASYONLARI
   9. SCROLL FADE EFFECTS
   10. HEADER SCROLL STATE
   11. STAT SAYILARI ANİMASYONU
   12. ÜRETİM AŞAMALARI SİSTEMİ
   13. ÜRETİM SWIPE KONTROLLERİ (MOBİL)
   14. ÜRÜNLER BÖLÜMÜ - TAB & CAROUSEL SİSTEMİ
   15. MOBİL HEADER
   16. ÜRÜN KATEGORİ KART AKTİFLİK
   17. ÜRÜN DETAY GÖRSEL DEĞİŞTİRME
   18. TEKNİK ÖZELLİKLER YATAY KAYDIRMA
   19. LIGHTBOX GALLERY SİSTEMİ
   20. KART TIKLANABİLİRLİK
   21. ÜRÜN DETAY LIGHTBOX SİSTEMİ
   */
   /* ===================================================== */

/* ===== 1. GENEL FONKSIYONLAR ===== */

// Mobil kontrol fonksiyonu
const isUrunlerMobile = () => window.matchMedia('(max-width:1024px)').matches;

// Transform reset (parallax iptal)
document.querySelectorAll('.hero-video').forEach(el => el.style.transform = 'none');

/* ===== 2. MEGA MENÜ KATEGORİLERİ ===== */
document.querySelectorAll('.dropdown-wrapper.is-sarma').forEach(wrapper => {
  const btns = wrapper.querySelectorAll('.cat-btn');
  const panels = wrapper.querySelectorAll('.dropdown-panel');

  function activate(id) {
    // Butonları aktif/pasif yap
    btns.forEach(b => {
      const on = b.dataset.panel === id;
      b.classList.toggle('active', on);
      b.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    
    // Panelleri göster/gizle
    panels.forEach(p => {
      const on = p.id === id;
      if (on) { 
        p.removeAttribute('hidden'); 
        p.classList.add('active'); 
      } else { 
        p.setAttribute('hidden',''); 
        p.classList.remove('active'); 
      }
    });
  }

  // Event listeners
  btns.forEach(b => {
    const id = b.dataset.panel;
    // Hover ile değişsin (masaüstü)
    b.addEventListener('mouseenter', () => activate(id));
    // Klavye erişilebilirliği
    b.addEventListener('focus', () => activate(id));
    b.addEventListener('click', (e) => { 
      e.preventDefault(); 
      activate(id); 
    });
  });
});

/* ===== 3. ANA SLIDER SİSTEMİ ===== */
// --- HERO / SLIDER BLOĞUNU GÜVENLİ YAPIN ---

const slidesDOM = document.querySelectorAll('.slide');
const totalSlides = slidesDOM.length;

// Sayaç elemanı varsa güncelle
const totalEl = document.querySelector('.carousel-counter .total');
if (totalEl) totalEl.textContent = String(totalSlides).padStart(2, '0');

// Helper: sadece slayt varsa çalışsın
if (totalSlides > 0) {
  let currentSlide = 0;

  function applyTextsFromHTML(i) {
    const s = slidesDOM[i];
    const title = s?.dataset.title || '';
    const desc  = s?.dataset.desc  || '';
    const titleEl = document.querySelector('.hero-title');
    const descEl  = document.querySelector('.hero-description');
    if (titleEl) titleEl.textContent = title;
    if (descEl)  descEl.textContent  = desc;
    const curEl = document.querySelector('.carousel-counter .current');
    if (curEl) curEl.textContent = String(i+1).padStart(2,'0');
  }

  function showSlide(i) { 
    slidesDOM.forEach((el,idx)=> el.classList.toggle('active', idx===i)); 
    applyTextsFromHTML(i); 
  }
  
  function nextSlide() { 
    currentSlide = (currentSlide + 1) % totalSlides; 
    showSlide(currentSlide); 
  }
  
  function prevSlide() { 
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides; 
    showSlide(currentSlide); 
  }

  showSlide(0);

  const nextBtn = document.getElementById('nextBtn');
  const prevBtn = document.getElementById('prevBtn');
  nextBtn && nextBtn.addEventListener('click', nextSlide);
  prevBtn && prevBtn.addEventListener('click', prevSlide);

  // Video güvenli kontrol
  const firstVideo = slidesDOM[0]?.querySelector('video');
  if (firstVideo) {
    firstVideo.loop = false;
    firstVideo.addEventListener('ended', () => {
      if (currentSlide === 0) { 
        firstVideo.currentTime = 0; 
        firstVideo.play(); 
      }
    });
  }

  // Otomatik geçiş sadece slayt varsa
  let autoTimer = setInterval(() => { 
    if (currentSlide !== 0) nextSlide(); 
  }, 5000);
  
  ['click','touchstart'].forEach(evt => {
    document.addEventListener(evt, () => {
      clearInterval(autoTimer);
      autoTimer = setInterval(() => { 
        if (currentSlide !== 0) nextSlide(); 
      }, 5000);
    }, { once:true });
  });
}

/* ===== 4. PRELOADER ===== */
window.addEventListener("load", () => {
  const preloader = document.getElementById("preloader");
  if (preloader) {
    preloader.classList.add("hidden");
    setTimeout(() => preloader.remove(), 800); // Tamamen DOM'dan sil
  }
});

/* ===== 5. SCROLL INDICATOR ===== */
const scrollInd = document.querySelector('.scroll-indicator');

if (scrollInd) {
  // Kaybolma efektine scroll-indicator'u da ekle
  window.addEventListener('scroll', () => {
    const fadeStart = 50;
    const fadeEnd = window.innerHeight / 2;
    const scrollTop = window.scrollY;

    let opacity = 1 - (scrollTop - fadeStart) / (fadeEnd - fadeStart);
    opacity = Math.max(0, Math.min(1, opacity));

    scrollInd.style.opacity = opacity;
  });

  // Tıklandığında Hakkımızda bölümüne kaydır
  scrollInd.addEventListener('click', () => {
    const aboutSection = document.querySelector('.about-section');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  });
}

/* ===== 6. PARALLAX HERO VIDEO ===== */
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const rate = scrolled * -0.5;
  const heroVideo = document.querySelector('.hero-video');
  if (heroVideo && scrolled < window.innerHeight) {
    heroVideo.style.transform = `translate3d(0, ${rate}px, 0)`;
  }
});

/* ===== 7. BOTTOM DOCK & OVERLAY MENU ===== */
const bbMenuBtn = document.getElementById('bbMenuBtn');
const menuOverlay = document.getElementById('menuOverlay');
const menuClose = document.getElementById('menuClose');
const bbLangBtn = document.getElementById('bbLangBtn');
const bbLangPopup = document.getElementById('bbLangPopup');
const bbToTop = document.getElementById('bbToTop');

// Menu toggle
if (bbMenuBtn && menuOverlay) {
  const toggleSheet = (force) => {
    const active = typeof force === 'boolean' ? force : !menuOverlay.classList.contains('active');
    menuOverlay.classList.toggle('active', active);
    bbMenuBtn.classList.toggle('active', active);
    menuOverlay.setAttribute('aria-hidden', !active);
    document.body.classList.toggle('menu-open', active);
  };
  
  bbMenuBtn.addEventListener('click', () => toggleSheet());
  if (menuClose) menuClose.addEventListener('click', () => toggleSheet(false));
  menuOverlay.addEventListener('click', (e) => {
    if (e.target === menuOverlay) toggleSheet(false);
  });
}

// Telefon popup aç/kapat
const bbCallBtn = document.getElementById('bbCallBtn');
if (bbCallBtn) {
  bbCallBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    bbCallBtn.classList.toggle('active');
  });

  // Dışarı tıklayınca kapat
  document.addEventListener('click', () => {
    bbCallBtn.classList.remove('active');
  });
}

// Language popover
if (bbLangBtn && bbLangPopup) {
  bbLangBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = bbLangPopup.style.opacity === '1';
    bbLangPopup.style.opacity = open ? '0' : '1';
    bbLangPopup.style.visibility = open ? 'hidden' : 'visible';
    bbLangPopup.style.transform = open ? 'translateX(-50%) translateY(10px)' : 'translateX(-50%) translateY(0)';
  });
  
  document.addEventListener('click', () => {
    bbLangPopup.style.opacity = '0';
    bbLangPopup.style.visibility = 'hidden';
    bbLangPopup.style.transform = 'translateX(-50%) translateY(10px)';
  });
}

// Accordion in overlay menu
document.querySelectorAll('.menu-accordion').forEach(btn => {
  btn.addEventListener('click', () => {
    const sub = btn.parentElement.querySelector('.menu-sub');
    const open = sub.style.maxHeight && sub.style.maxHeight !== '0px';
    sub.style.maxHeight = open ? '0' : `${sub.scrollHeight}px`;
    btn.querySelector('span').textContent = open ? '▾' : '▴';
  });
});

// To top button
if (bbToTop) {
  bbToTop.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));
}

/* ===== 8. HAKKIMIZDA ANIMASYONLARI ===== */
document.querySelectorAll('.about-content > *, .about-image').forEach(el => {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        el.style.animationPlayState = 'running';
      }
    });
  }, { threshold: 0.1 });
  observer.observe(el);
});

/* ===== 9. SCROLL FADE EFFECTS ===== */
// Scroll oldukça sayaç, sosyal ikonlar ve scroll-indicator kaybolsun
window.addEventListener('scroll', () => {
  const fadeStart = 50;
  const fadeEnd = window.innerHeight / 2;
  const scrollTop = window.scrollY;

  let opacity = 1 - (scrollTop - fadeStart) / (fadeEnd - fadeStart);
  opacity = Math.max(0, Math.min(1, opacity));

  document.querySelectorAll('.carousel-counter, .scroll-indicator').forEach(el => {
    if(el) {
      el.style.opacity = opacity;
    }
  });
});

/* ===== 10. HEADER SCROLL STATE ===== */
const headerEl = document.getElementById('header');

function updateHeaderOnScroll() {
  if (!headerEl) return;
  // Aşağı inerken (en ufak scroll'da) scrolled aktif olsun
  if (window.scrollY > 0) {
    headerEl.classList.add('scrolled');
  } else {
    headerEl.classList.remove('scrolled');
  }
}

// Sayfa ilk yükleniş ve her scroll'da kontrol et
window.addEventListener('load', updateHeaderOnScroll, { passive: true });
window.addEventListener('scroll', updateHeaderOnScroll, { passive: true });

/* === Mega menü açılıp kapanırken header'ı beyaza çevir === */
const headerEl2 = document.getElementById('header');
document.querySelectorAll('.nav-item.nav-has-dropdown').forEach(item => {
  const dropdown = item.querySelector('.nav-dropdown');

  const openMenu = () => headerEl2 && headerEl2.classList.add('on-mega');
  const closeMenu = (e) => {
    // Eğer fare dropdown içindeyse kapanmasın
    if (dropdown && dropdown.contains(e.relatedTarget)) return;
    headerEl2 && headerEl2.classList.remove('on-mega');
  };

  item.addEventListener('mouseenter', openMenu);
  item.addEventListener('mouseleave', closeMenu);
  if (dropdown) {
    dropdown.addEventListener('mouseleave', closeMenu);
    dropdown.addEventListener('mouseenter', openMenu);
  }
});

/* ===== 11. STAT SAYILARI ANİMASYONU ===== */
function animateValue(el, start, end, duration) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const value = Math.floor(progress * (end - start) + start);
    el.textContent = `+${value}`;
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

// Observer: sadece görünür olunca çalışsın
const statNumbers = document.querySelectorAll('.stat-number');
if (statNumbers.length) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const targetValue = parseInt(el.textContent.replace(/\D/g, ''), 10); // sayıyı al
        animateValue(el, 0, targetValue, 2000); // 2sn içinde artış
        observer.unobserve(el); // her biri 1 kere çalışsın
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => observer.observe(el));
}

/* ===== 12. ÜRETİM AŞAMALARI SİSTEMİ ===== */
(() => {
  // DOM Elementleri
  const slides = Array.from(document.querySelectorAll('.uretim-slide'));
  const backgroundImage = document.querySelector('.uretim-background-image');
  const prevBtn = document.getElementById('uretim-prev-btn');
  const nextBtn = document.getElementById('uretim-next-btn');

  // Steps Elementleri
  const stepsNav = document.querySelector('.uretim-steps-navigation');
  const stepsContainer = stepsNav ? stepsNav.querySelector('.uretim-steps-container') : null;
  const stepsList = stepsContainer ? stepsContainer.querySelector('.uretim-steps-list') : null;
  const stepItems = stepsList ? Array.from(stepsList.querySelectorAll('.uretim-step-item')) : [];
  const stepLinks = stepItems.map(li => li.querySelector('.uretim-step-link'));

  // Değişkenler
  let currentStep = 0;
  const STEP_HEIGHT = 150;
  const VISIBLE_AREA_TOP = 280;

  // Arkaplan Güncelleme Fonksiyonu
  function updateBackgroundImage(slideIndex) {
    const slide = slides[slideIndex];
    if (!slide) return;
    
    const nextBgUrl = slide.dataset.bg || 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1200';
    backgroundImage.style.backgroundImage = `linear-gradient(180deg,rgba(0,0,0,.85),rgba(0,0,0,.65)), url('${nextBgUrl}')`;
  }

  // Aktif Slide Ayarlama Fonksiyonu
  function setActiveSlide(slideIndex) {
    // Eski aktif slide'ı kaldır
    const activeSlide = slides.find(s => s.classList.contains('uretim-slide-active'));
    if (activeSlide) {
      activeSlide.classList.remove('uretim-slide-active');
      activeSlide.classList.add('uretim-slide-exit');
      setTimeout(() => activeSlide.classList.remove('uretim-slide-exit'), 450);
    }

    // Yeni slide'ı aktif et
    const newSlide = slides[slideIndex];
    if (newSlide) newSlide.classList.add('uretim-slide-active');

    updateBackgroundImage(slideIndex);
  }

  // Steps Pozisyon Güncelleme Fonksiyonu
  function updateStepsPosition() {
    if (!stepsContainer) return;
    
    const windowHeight = window.innerHeight;
    const targetY = (windowHeight / 2) - (STEP_HEIGHT / 2);
    const activeStepCurrentY = VISIBLE_AREA_TOP + (currentStep * STEP_HEIGHT);
    const offset = targetY - activeStepCurrentY;
    
    stepsContainer.style.transform = `translateY(${VISIBLE_AREA_TOP + offset}px)`;
  }

  // Ana Step Değiştirme Fonksiyonu
  function setCurrentStep(stepIndex) {
    const stepCount = stepItems.length || 1;
    currentStep = ((stepIndex % stepCount) + stepCount) % stepCount;
    
    // Slide'ı değiştir
    setActiveSlide(currentStep);
    
    // Step görsellerini güncelle
    stepItems.forEach((li, index) => {
      li.classList.toggle('uretim-step-active', index === currentStep);
    });
    
    // Steps pozisyonunu güncelle
    updateStepsPosition();
  }

  // Başlangıç Ayarları
  setCurrentStep(0);

  // Event Listeners
  
  // Step Link Tıklamaları
  stepLinks.forEach((button, index) => {
    if (button) {
      button.addEventListener('click', (event) => {
        event.preventDefault();
        setCurrentStep(index);
      });
    }
  });

  // Navigasyon Butonları
  if (prevBtn) {
    prevBtn.addEventListener('click', () => setCurrentStep(currentStep - 1));
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', () => setCurrentStep(currentStep + 1));
  }

  // Klavye Kontrolleri
  window.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setCurrentStep(currentStep - 1);
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setCurrentStep(currentStep + 1);
    }
  });

  // Pencere Yeniden Boyutlandırma
  window.addEventListener('resize', () => {
    updateStepsPosition();
  });
})();

/* ===== 13. ÜRETİM SWIPE KONTROLLERİ (MOBİL) ===== */
(() => {
  const slides = document.querySelectorAll(".uretim-slide");
  let startX = 0;
  let currentX = 0;
  let isSwiping = false;

  function goToSlide(index) {
    const total = slides.length;
    if (index < 0) index = total - 1;
    if (index >= total) index = 0;
    slides.forEach((s, i) => {
      s.classList.toggle("uretim-slide-active", i === index);
    });
    currentSlide = index;
  }

  let currentSlide = 0;

  document.querySelectorAll(".uretim-slide").forEach((slide) => {
    slide.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
      isSwiping = true;
    });

    slide.addEventListener("touchmove", (e) => {
      if (!isSwiping) return;
      currentX = e.touches[0].clientX;
    });

    slide.addEventListener("touchend", () => {
      if (!isSwiping) return;
      let diffX = currentX - startX;
      if (Math.abs(diffX) > 50) {
        if (diffX > 0) {
          // sağa kaydır → önceki
          goToSlide(currentSlide - 1);
        } else {
          // sola kaydır → sonraki
          goToSlide(currentSlide + 1);
        }
      }
      isSwiping = false;
    });
  });
})();

/* ===== 14. ÜRÜNLER BÖLÜMÜ - TAB & CAROUSEL SİSTEMİ ===== */
(() => {
  // Tab Sistemi
  const tabs = Array.from(document.querySelectorAll('.urunler-tab'));
  const descBoxes = Array.from(document.querySelectorAll('.urunler-desc'));
  
  if (tabs.length && descBoxes.length) {
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const id = tab.getAttribute('data-id');
        tabs.forEach(t => t.classList.toggle('active', t === tab));
        descBoxes.forEach(box => box.classList.toggle('active', box.getAttribute('data-box-id') === id));
      });
    });
  }

  /* === Ortak Ürün Carousel Fonksiyonu === */
  function attachProductCarousel(prefix, options = {}) {
    const listEl = document.getElementById(`${prefix}-carousel`);
    const imagesEl = document.getElementById(`${prefix}-images`);
    const prevBtn = document.getElementById(`${prefix}-prev`);
    const nextBtn = document.getElementById(`${prefix}-next`);
    
    if (!listEl || !imagesEl) return;

    const items = Array.from(listEl.querySelectorAll('.urunler-product-item'));
    const slides = Array.from(imagesEl.querySelectorAll('.urunler-image-slide'));
    
    if (!items.length || !slides.length) return;

    const n = items.length;
    const activeFromDom = items.findIndex(el => el.classList.contains('active'));

    const ds = (imagesEl.dataset.startIndex || listEl.dataset.startIndex || '').toString().trim().toLowerCase();
    const optStart = options.startIndex;

    function norm(i) { 
      return ((i % n) + n) % n; 
    }

    let current;
    if (optStart === 'middle' || ds === 'middle' || ds === 'center') {
      current = Math.floor((n - 1) / 2);
    } else if (Number.isFinite(optStart)) {
      current = norm(optStart);
    } else if (!Number.isNaN(parseInt(ds, 10))) {
      current = norm(parseInt(ds, 10));
    } else if (activeFromDom >= 0) {
      current = activeFromDom;
    } else {
      current = Math.floor((n - 1) / 2);
    }

    /* === AUTOPLAY AYARLARI === */
    const intervalFromAttr = Number(imagesEl.dataset.interval || listEl.dataset.interval || 0) || undefined;
// Mobil/Tablet (<=1024px) ise autoplay kapalı
const isSmallScreen = window.matchMedia('(max-width:1024px)').matches;
let AUTO_PLAY = !isSmallScreen && (options.auto !== false);
const AUTO_INT = Number(options.interval || intervalFromAttr || 5000);
let autoTimer = null;

    function startAuto() {
      if (!AUTO_PLAY) return;
      stopAuto();
      autoTimer = setInterval(() => setActive(current + 1, /*fromAuto=*/true), AUTO_INT);
    }
    
    function stopAuto() {
      if (autoTimer) { 
        clearInterval(autoTimer); 
        autoTimer = null; 
      }
    }
    
    function restartAuto() {
      stopAuto(); 
      startAuto();
    }

    function handleResizeAutoplay() {
  const small = window.matchMedia('(max-width:1024px)').matches;
  AUTO_PLAY = !small && (options.auto !== false);
  if (AUTO_PLAY) startAuto();
  else stopAuto();
}
window.addEventListener('resize', handleResizeAutoplay);


    /* === LİSTEYİ ORTAYA HİZALA === */


function updateListPosition() {
  const viewport = listEl.parentElement; // .urunler-list-col
  if (!viewport) return;

  const isMobile = window.matchMedia('(max-width: 992px)').matches;

  if (isMobile) {
    // 📱 Mobil/Tablet: transform kullanma, doğal kaydırma
    listEl.style.transform = '';
    listEl.style.removeProperty('--slot-pad-top');
    listEl.style.removeProperty('--slot-pad-bottom');

    const active = items[current];
    if (active && typeof active.scrollIntoView === 'function') {
      active.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'smooth' });
    }
    return;
  }

  // 💻 Masaüstü hizalama
  const slot = parseFloat(getComputedStyle(viewport).getPropertyValue('--active-slot'))
               || Math.round(viewport.clientHeight * 0.35);

  const activeItem = items[current];
  if (!activeItem) return;

  const viewportH = viewport.clientHeight;

  // Görünmez tamponlar: en üst/alt ürün de slot çizgisine otursun
  const padTop = slot;
  const padBottom = Math.max(0, viewportH - slot);

  listEl.style.setProperty('--slot-pad-top', padTop + 'px');
  listEl.style.setProperty('--slot-pad-bottom', padBottom + 'px');

  const listH = listEl.scrollHeight;

  const activeTop = activeItem.offsetTop;
  let y = slot - activeTop;

  // Taşmayı engelle
  const maxY = 0;
  const minY = Math.min(0, viewportH - listH);
  if (y > maxY) y = maxY;
  if (y < minY) y = minY;

  listEl.style.transform = `translateY(${Math.round(y)}px)`;
}

// 🪄 Ekran boyutu değişince aktif ürünü yeniden hizala
window.addEventListener('resize', () => {
  updateListPosition();
});






function setActive(i, fromAuto = false) {
  // ÜRÜN sayısı kadar dolaş
  const n = items.length;  
  current = ((i % n) + n) % n;

  // Listede birebir index
  items.forEach((el, idx) => el.classList.toggle('active', idx === current));

  // Görseller daha azsa modulo ile eşle
  const sN = slides.length;
  slides.forEach((el, idx) => el.classList.toggle('active', idx === (current % sN)));

  updateListPosition();
  if (!fromAuto) restartAuto();
}




    // Tıklama
    items.forEach((el, idx) => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        setActive(idx);
      });
    });

    // Oklar
    if (prevBtn) prevBtn.addEventListener('click', (e) => { 
      e.preventDefault(); 
      setActive(current - 1); 
    });
    if (nextBtn) nextBtn.addEventListener('click', (e) => { 
      e.preventDefault(); 
      setActive(current + 1); 
    });

    // Hover'da durdur / çıkınca başlat (hem liste hem görsel alanı)
    const viewport = listEl.parentElement || listEl;
    [viewport, imagesEl].forEach(el => {
      el.addEventListener('mouseenter', stopAuto);
      el.addEventListener('mouseleave', startAuto);
    });

    // Sekme görünmez olunca durdur, geri gelince başlat
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stopAuto(); 
      else startAuto();
    });

    // Başlat
// Başlat
setActive(current);
if (AUTO_PLAY) startAuto();
window.addEventListener('resize', updateListPosition);
handleResizeAutoplay(); // sayfa yüklenir yüklenmez doğru moda geç

  }

  // Carousel'leri başlat
  attachProductCarousel('machine', { interval: 4000, startIndex: 'middle' });
  attachProductCarousel('pulley', { interval: 4000, startIndex: 'middle' });

  /* === Haberler Carousel === */
  (function initNewsCarousel() {
    const wrap = document.getElementById('news-carousel');
    const prev = document.getElementById('news-prev');
    const next = document.getElementById('news-next');
    if (!wrap) return;

    // Adım: kart genişliği + gap kadar kaydır
    const sampleItem = wrap.querySelector('.urunler-news-item') || wrap.firstElementChild;
    const styles = window.getComputedStyle(wrap);
    const gap = parseInt(styles.columnGap || styles.gap || '40', 10) || 40;
    const step = sampleItem ? (sampleItem.getBoundingClientRect().width + gap) : Math.max(320, wrap.clientWidth * 0.8);

    function scrollByStep(dir) {
      wrap.scrollBy({ left: dir * step, behavior: 'smooth' });
    }

    if (prev) prev.addEventListener('click', (e) => { 
      e.preventDefault(); 
      scrollByStep(-1); 
    });
    if (next) next.addEventListener('click', (e) => { 
      e.preventDefault(); 
      scrollByStep(1); 
    });
  })();
})();

/* =====================================================
   15. MOBİL HEADER
   ===================================================== */

// Mobil viewport yükseklik düzeltmesi (iOS Safari için)
function setMobileViewport() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
  
  const isMobile = window.innerWidth <= 1024;
  if (isMobile) {
    const headerHeight = window.innerWidth <= 480 ? 70 : window.innerWidth <= 768 ? 75 : 82;
    document.documentElement.style.setProperty('--mheader', `${headerHeight}px`);
  }
}

// Sayfa yüklendiğinde ve boyut değiştiğinde çalıştır
window.addEventListener('load', setMobileViewport);
window.addEventListener('resize', setMobileViewport);
window.addEventListener('orientationchange', () => {
  setTimeout(setMobileViewport, 100); 
});

function optimizeMobileHeader() {
  const header = document.getElementById('header');
  if (!header) return;
  
  const isMobile = window.innerWidth <= 1024;
  
  if (isMobile) {
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > 10) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
      
      lastScrollY = currentScrollY;
    }, { passive: true });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  optimizeMobileHeader();
  
  const isMobile = window.innerWidth <= 1024;
  if (isMobile) {
    document.addEventListener('touchstart', () => {}, { passive: true });
    document.addEventListener('touchmove', () => {}, { passive: true });
  }
});

if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
  window.addEventListener('resize', () => {
    setTimeout(() => {
      setMobileViewport();
      
      const hero = document.querySelector('.hero');
      if (hero) {
        const headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--mheader'));
        hero.style.minHeight = `calc(100vh - ${headerHeight}px)`;
      }
    }, 300);
  });
}

function optimizeTouchDevices() {
  if ('ontouchstart' in window) {
    document.body.classList.add('touch-device');
    
    const style = document.createElement('style');
    style.textContent = `
      .touch-device .nav-link:hover::before,
      .touch-device .social-link:hover,
      .touch-device .carousel-btn:hover {
        transition: none !important;
      }
    `;
    document.head.appendChild(style);
  }
}

document.addEventListener('DOMContentLoaded', optimizeTouchDevices);

if (/Android/.test(navigator.userAgent)) {
  const initialViewportHeight = window.innerHeight;
  
  window.addEventListener('resize', () => {
    const currentViewportHeight = window.innerHeight;
    const heightDifference = initialViewportHeight - currentViewportHeight;
    
    const bottomBar = document.querySelector('.bottom-bar');
    if (bottomBar) {
      if (heightDifference > 150) {
        bottomBar.style.transform = 'translateX(-50%) translateY(100px)';
      } else { 
        bottomBar.style.transform = 'translateX(-50%) translateY(0)';
      }
    }
  });
}

/* ===== 16. ÜRÜN KATEGORİ KART AKTİFLİK ===== */
document.querySelectorAll('.uk-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    document.querySelectorAll('.uk-card.is-active').forEach(c => c.classList.remove('is-active'));
    card.classList.add('is-active');
  });
  card.addEventListener('focusin', () => {
    document.querySelectorAll('.uk-card.is-active').forEach(c => c.classList.remove('is-active'));
    card.classList.add('is-active');
  });
});

/* ===== 17. ÜRÜN DETAY GÖRSEL DEĞİŞTİRME ===== */
/* ÜRÜN DETAY: küçük görsel tıklandığında ana görseli değiştir */
(() => {
  const main = document.getElementById('urundetayMainImg');
  const thumbs = document.querySelectorAll('.urundetay-thumb');
  if (!main || !thumbs.length) return;

  thumbs.forEach(btn => {
    btn.addEventListener('click', () => {
      const src = btn.getAttribute('data-src');
      if (src) {
        main.src = src;
        thumbs.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
      }
    });
  });
})();

/* ===== 18. TEKNİK ÖZELLİKLER YATAY KAYDIRMA ===== */
// Teknik Özellikler: yatay kaydırma için kenar gölgeleri
(() => {
  const wrap = document.getElementById('specsScroll');
  if (!wrap) return;
  const fadeL = wrap.querySelector('.scroll-fade.left');
  const fadeR = wrap.querySelector('.scroll-fade.right');

  function updateFades() {
    const max = wrap.scrollWidth - wrap.clientWidth;
    if (max <= 0) { 
      fadeL.style.display='none'; 
      fadeR.style.display='none'; 
      return; 
    }
    fadeL.style.display = wrap.scrollLeft > 0 ? 'block' : 'none';
    fadeR.style.display = wrap.scrollLeft < max ? 'block' : 'none';
  }
  
  wrap.addEventListener('scroll', updateFades, { passive: true });
  window.addEventListener('resize', updateFades);
  updateFades();
})();

/* ===== 19. LIGHTBOX GALLERY SİSTEMİ ===== */
// Lightbox Gallery System
(() => {
  const gallery = document.getElementById('mvGallery');
  if (!gallery) return;

  const items = Array.from(gallery.querySelectorAll('.g-item'));
  if (!items.length) return;

  // DOM Elements
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lbImg');
  const lbCap = document.getElementById('lbCap');
  const lbPrev = document.getElementById('lbPrev');
  const lbNext = document.getElementById('lbNext');
  const lbClose = document.getElementById('lbClose');
  const lbBackdrop = document.getElementById('lbBackdrop');

  // Slide data
  const slides = items.map(a => ({
    src: a.getAttribute('href'),
    alt: (a.querySelector('img')?.getAttribute('alt') || '').trim()
  }));

  let currentIndex = 0;

  // Open lightbox
  const openLightbox = (index) => {
    currentIndex = ((index % slides.length) + slides.length) % slides.length;
    const { src, alt } = slides[currentIndex];
    
    lbImg.src = src;
    lbImg.alt = alt || '';
    lbCap.textContent = alt || `Görsel ${currentIndex + 1} / ${slides.length}`;
    
    lb.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    lb.setAttribute('aria-hidden', 'false');
    
    // Focus management
    lbClose.focus();
  };

  // Close lightbox
  const closeLightbox = () => {
    lb.classList.remove('is-open');
    document.body.style.overflow = '';
    lb.setAttribute('aria-hidden', 'true');
  };

  // Navigate to next image
  const nextImage = () => {
    openLightbox(currentIndex + 1);
  };

  // Navigate to previous image
  const prevImage = () => {
    openLightbox(currentIndex - 1);
  };

  // Event listeners for gallery thumbnails
  items.forEach((item, index) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      openLightbox(index);
    });
  });

  // Navigation buttons
  lbNext?.addEventListener('click', (e) => {
    e.preventDefault();
    nextImage();
  });

  lbPrev?.addEventListener('click', (e) => {
    e.preventDefault();
    prevImage();
  });

  lbClose?.addEventListener('click', (e) => {
    e.preventDefault();
    closeLightbox();
  });

  // Close on backdrop click
  lbBackdrop?.addEventListener('click', closeLightbox);

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('is-open')) return;

    switch(e.key) {
      case 'Escape':
        closeLightbox();
        break;
      case 'ArrowRight':
        e.preventDefault();
        nextImage();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        prevImage();
        break;
    }
  });

  // Touch/swipe support for mobile
  let touchStartX = 0;
  let touchEndX = 0;

  lbImg.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lbImg.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });

  const handleSwipe = () => {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swiped left - next image
        nextImage();
      } else {
        // Swiped right - previous image
        prevImage();
      }
    }
  };

  // Prevent context menu on images
  lbImg.addEventListener('contextmenu', (e) => {
    e.preventDefault();
  });

  // Image loading states
  lbImg.addEventListener('load', () => {
    lbImg.style.opacity = '1';
  });

  lbImg.addEventListener('error', () => {
    lbCap.textContent = 'Görsel yüklenemedi';
  });
})();

/* ===== 20. KART TIKLANABİLİRLİK ===== */
document.addEventListener("DOMContentLoaded", function() {
  // Tüm kartları seç
  const cards = document.querySelectorAll(".uk-card");

  cards.forEach(card => {
    card.addEventListener("click", function() {
      window.location.href = "urunler-detay.html";
    });
  });
});

/* ===== 21. ÜRÜN DETAY LIGHTBOX SİSTEMİ ===== */
document.addEventListener('DOMContentLoaded', function() {
  const mainImg = document.getElementById('urundetayMainImg');
  const thumbBtns = Array.from(document.querySelectorAll('.urundetay-thumb'));
  const images = thumbBtns.map(b => b.dataset.src); // galerideki görseller
  let current = 0;

  // aktif küçük resim durumunu güncelle
  function setActiveThumb(idx) {
    thumbBtns.forEach(b => b.classList.remove('is-active'));
    if (thumbBtns[idx]) thumbBtns[idx].classList.add('is-active');
  }

  // ana görseli değiştir (ürün detay alanında)
  function setMain(index) {
    current = (index + images.length) % images.length;
    mainImg.src = images[current];
    setActiveThumb(current);
  }

  // thumb tıklayınca ana görseli değiştir
  thumbBtns.forEach((btn, idx) => {
    btn.addEventListener('click', () => setMain(idx));
  });

  // ------- LIGHTBOX -------
  const lb = document.getElementById('lb');
  const lbImg = document.getElementById('lbImg');
  const lbClose = document.getElementById('lbClose');
  const lbPrev = document.getElementById('lbPrev');
  const lbNext = document.getElementById('lbNext');
  const lbCounter = document.getElementById('lbCounter');

  function openLB(index) {
    setLB(index);
    lb.classList.add('is-open');
    document.documentElement.classList.add('no-scroll');
    document.body.classList.add('no-scroll');
    lb.setAttribute('aria-hidden', 'false');
  }

  function closeLB() {
    lb.classList.remove('is-open');
    document.documentElement.classList.remove('no-scroll');
    document.body.classList.remove('no-scroll');
    lb.setAttribute('aria-hidden', 'true');
  }

  function setLB(index) {
    current = (index + images.length) % images.length;
    lbImg.src = images[current];
    lbCounter.textContent = (current+1) + ' / ' + images.length;
  }

  function next() { 
    setLB(current+1); 
  }
  
  function prev() { 
    setLB(current-1); 
  }

  // ANA GÖRSEL'e tıklayınca aç
  mainImg.addEventListener('click', () => {
    // mevcut ana görselin index'ini bul
    const idx = images.findIndex(src => src === mainImg.src || mainImg.src.endsWith(src));
    openLB(idx >= 0 ? idx : current);
  });

  // Lightbox kontrolleri
  lbNext.addEventListener('click', next);
  lbPrev.addEventListener('click', prev);
  lbClose.addEventListener('click', closeLB);

  // Arka plana tıklayınca (resmin dışına) kapat
  lb.addEventListener('click', (e) => {
    if(e.target === lb) closeLB();
  });

  // Klavye: ESC kapat, oklarla gezin
  document.addEventListener('keydown', (e) => {
    if(!lb.classList.contains('is-open')) return;
    if(e.key === 'Escape') closeLB();
    if(e.key === 'ArrowRight') next();
    if(e.key === 'ArrowLeft') prev();
  });

  // Dokunmatik: swipe left/right
  let touchX = null;
  lb.addEventListener('touchstart', (e) => { 
    touchX = e.touches[0].clientX; 
  }, {passive:true});
  
  lb.addEventListener('touchend', (e) => {
    if(touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    const THRESH = 40;
    if(Math.abs(dx) > THRESH) { 
      dx < 0 ? next() : prev(); 
    }
    touchX = null;
  }, {passive:true});

  // İlk yüklemede ana görseli ve aktif thumb'u hizala
  // (sayfadaki default ana görsel hangi küçük resme karşılık geliyorsa ona senkron)
  const initIdx = images.findIndex(src => mainImg.src.endsWith(src));
  if(initIdx >= 0) { 
    setActiveThumb(initIdx); 
    current = initIdx; 
  }
});
