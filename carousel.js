/*
 * carousel.js
 * ===========
 * Everything interactive on this page lives here.
 * There is NO other JavaScript file. Python (app.py) serves
 * the page; this file handles what happens after it loads.
 *
 * SECTIONS:
 *   A. GALLERY DATA       — one list of all 10 images with full metadata
 *   B. COVERFLOW CAROUSEL — auto-advances, play/pause, prev/next, swipe
 *   C. LIGHTBOX           — opens when any image is clicked
 *   D. GALLERY FILTERS    — Fashion / Travel / Urban / Editorial tabs
 *   E. MOBILE MENU        — hamburger open/close
 *   F. BACK TO TOP        — smooth scroll button
 *   G. SCROLL SPY         — active nav underline follows scroll position
 */

(function () {
'use strict';

/* ═══════════════════════════════════════════════════════════════════════
   A. GALLERY DATA
   ═══════════════════════════════════════════════════════════════════════
   One single list used by BOTH the carousel AND the lightbox.
   Every image has its own title, description, location, camera,
   category and dimensions. The lightbox reads from here so each
   image always shows its own correct information.
   ═══════════════════════════════════════════════════════════════════════ */
var ITEMS = [
  {
    id:         0,
    src:        'images/Aesthetic%20Free.jpg',
    alt:        'Match Was Good',
    title:      'Match Was Good',
    tag:        'Fashion & Style · Sport Luxe',
    desc:       'Urban casual portrait capturing sport-inspired style and effortless aesthetic presence. Shot on location in East London during golden hour.',
    location:   'London, UK',
    camera:     'Leica SL2 · 50mm f/1.4',
    dimensions: '2400 × 3000',
    category:   'fashion'
  },
  {
    id:         1,
    src:        'images/chicago.jpg',
    alt:        'Chicago Skyline',
    title:      'Chicago Skyline',
    tag:        'Travel & Nature · Urban Architecture',
    desc:       'Towering architecture reflecting morning river mist and cinematic metropolitan energy. The Chicago River frames the steel canyon at dawn.',
    location:   'Chicago, USA',
    camera:     'Sony A7R V · 24-70mm f/2.8',
    dimensions: '3840 × 2560',
    category:   'travel'
  },
  {
    id:         2,
    src:        'images/Cool%20style.jpg',
    alt:        'Cool Style',
    title:      'Cool Style',
    tag:        'Fashion & Style · Streetwear Luxe',
    desc:       'Refined silhouette styling with modern tailoring and contemporary street poise. Minimal palette, maximum impact against Parisian stone.',
    location:   'Paris, France',
    camera:     'Canon R5 · 85mm f/1.2',
    dimensions: '2800 × 3500',
    category:   'fashion'
  },
  {
    id:         3,
    src:        'images/Coorg.jpg',
    alt:        'Coorg Serenity',
    title:      'Coorg Serenity',
    tag:        'Travel & Nature · Lush Highlands',
    desc:       'Misty mountain hills enveloped in verdant coffee groves and serene morning atmosphere. Coorg\'s famous morning fog rolls through the valley at sunrise.',
    location:   'Coorg, India',
    camera:     'Fujifilm GFX 100S · 32-64mm',
    dimensions: '4000 × 2667',
    category:   'travel'
  },
  {
    id:         4,
    src:        'images/Cute%20day.jpg',
    alt:        'Night Out',
    title:      'Night Out',
    tag:        'Urban & Mood · City Lights',
    desc:       'Evening ambience capturing ambient city glow, bokeh textures, and relaxed moments. Tokyo\'s neon reflects softly off wet pavement.',
    location:   'Tokyo, Japan',
    camera:     'Sony A7S III · 35mm f/1.4',
    dimensions: '2500 × 3125',
    category:   'urban'
  },
  {
    id:         5,
    src:        'images/lungus.jpg',
    alt:        'Lungus Mood',
    title:      'Lungus Mood',
    tag:        'Creative Editorial · Character Study',
    desc:       'Dramatic portrait study with deep contrast, subtle film grain, and raw personality. Shot on medium format for maximum tonal depth.',
    location:   'Berlin, Germany',
    camera:     'Hasselblad X2D · 80mm',
    dimensions: '3000 × 3750',
    category:   'editorial'
  },
  {
    id:         6,
    src:        'images/maximalist.jpg',
    alt:        'Vibrant Maximalism',
    title:      'Vibrant Maximalism',
    tag:        'Creative Editorial · Color & Depth',
    desc:       'Intricate visual compositions celebrating expressive cultural colorways and texture. Lagos street fashion at its most vibrant and unapologetic.',
    location:   'Lagos, Nigeria',
    camera:     'Nikon Z9 · 50mm f/1.2',
    dimensions: '3200 × 4000',
    category:   'editorial'
  },
  {
    id:         7,
    src:        'images/Seamless%20pic.jpg',
    alt:        'Seamless Flow',
    title:      'Seamless Flow',
    tag:        'Urban & Mood · Visual Rhythm',
    desc:       'Minimalist geometry balancing clean architectural lines, shadows, and natural illumination. Stockholm\'s modernist buildings create a graphic canvas.',
    location:   'Stockholm, Sweden',
    camera:     'Leica M11 · 35mm Summilux',
    dimensions: '2600 × 3250',
    category:   'urban'
  },
  {
    id:         8,
    src:        'images/shoes.jpg',
    alt:        'Dramatic Footwear',
    title:      'Dramatic Footwear',
    tag:        'Fashion & Style · Statement Soles',
    desc:       'Bold textures and contemporary footwear craftsmanship spotlighted with directional lighting. Every stitch and sole detail rendered in high fidelity.',
    location:   'New York, USA',
    camera:     'Canon R5 · 100mm Macro',
    dimensions: '2400 × 3000',
    category:   'fashion'
  },
  {
    id:         9,
    src:        'images/visual%20log.jpg',
    alt:        'Visual Logs',
    title:      'Visual Logs',
    tag:        'Creative Editorial · Curated Journal',
    desc:       'Documentary aesthetic showcasing daily creative expressions and artistic discovery. A visual diary of moments too good not to capture.',
    location:   'Toronto, Canada',
    camera:     'Fujifilm X-T5 · 23mm f/1.4',
    dimensions: '3000 × 3750',
    category:   'editorial'
  }
];


/* ═══════════════════════════════════════════════════════════════════════
   B. COVERFLOW CAROUSEL
   ═══════════════════════════════════════════════════════════════════════
   All 10 cards are stacked on top of each other (position:absolute).
   positionCards() gives each card a transform based on how far it is
   from the active card. JavaScript sets transform/opacity/z-index
   directly so z-index actually works (CSS @keyframes cannot do this).
   ═══════════════════════════════════════════════════════════════════════ */
var carouselCards   = Array.from(document.querySelectorAll('.slide-card'));
var totalCards      = carouselCards.length;
var activeIdx       = 0;
var autoTimer       = null;
var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
var isPaused        = prefersReducedMotion.matches;
var lightboxOpen    = false;

/* Smooth CSS transition applied to every card movement */
var TRANSITION = 'transform 0.55s cubic-bezier(0.45,0,0.55,1), ' +
                 'opacity   0.55s cubic-bezier(0.45,0,0.55,1), ' +
                 'filter    0.55s ease, box-shadow 0.55s ease';

/*
 * positionCards()
 * Gives every card one of 5 positions based on its distance from activeIdx:
 *   offset 0            → CENTRE      (big, full opacity, front)
 *   offset 1            → RIGHT       (smaller, shifted right, dimmed)
 *   offset total-1      → LEFT        (smaller, shifted left,  dimmed)
 *   offset 2            → FAR-RIGHT   (more faded, peeking)
 *   offset total-2      → FAR-LEFT    (more faded, peeking)
 *   anything else       → HIDDEN      (invisible, off-screen)
 */
function positionCards() {
  var compactLayout = window.matchMedia('(max-width: 480px)').matches;
  var sideOffset = compactLayout ? 96 : 72;
  var farOffset = compactLayout ? 175 : 130;
  var hiddenOffset = compactLayout ? 250 : 190;

  carouselCards.forEach(function (card, i) {
    var offset = ((i - activeIdx) % totalCards + totalCards) % totalCards;
    card.style.transition = TRANSITION;

    if (offset === 0) {
      card.style.transform = 'translateX(0%) scale(1.00)';
      card.style.opacity   = '1';
      card.style.zIndex    = '5';
      card.style.filter    = 'brightness(1.0) blur(0px)';
      card.style.boxShadow = '0 28px 64px rgba(0,0,0,0.42),0 4px 14px rgba(0,0,0,0.22)';
    } else if (offset === 1) {
      card.style.transform = 'translateX(' + sideOffset + '%) scale(0.82)';
      card.style.opacity   = '0.82';
      card.style.zIndex    = '4';
      card.style.filter    = 'brightness(0.68) blur(0px)';
      card.style.boxShadow = '0 14px 36px rgba(0,0,0,0.26)';
    } else if (offset === totalCards - 1) {
      card.style.transform = 'translateX(-' + sideOffset + '%) scale(0.82)';
      card.style.opacity   = '0.82';
      card.style.zIndex    = '4';
      card.style.filter    = 'brightness(0.68) blur(0px)';
      card.style.boxShadow = '0 14px 36px rgba(0,0,0,0.26)';
    } else if (offset === 2) {
      card.style.transform = 'translateX(' + farOffset + '%) scale(0.66)';
      card.style.opacity   = '0.35';
      card.style.zIndex    = '2';
      card.style.filter    = 'brightness(0.52) blur(1px)';
      card.style.boxShadow = 'none';
    } else if (offset === totalCards - 2) {
      card.style.transform = 'translateX(-' + farOffset + '%) scale(0.66)';
      card.style.opacity   = '0.35';
      card.style.zIndex    = '2';
      card.style.filter    = 'brightness(0.52) blur(1px)';
      card.style.boxShadow = 'none';
    } else {
      var goRight = offset < totalCards / 2;
      card.style.transform = goRight
        ? 'translateX(' + hiddenOffset + '%) scale(0.55)'
        : 'translateX(-' + hiddenOffset + '%) scale(0.55)';
      card.style.opacity   = '0';
      card.style.zIndex    = '0';
      card.style.filter    = 'brightness(0.4) blur(2px)';
      card.style.boxShadow = 'none';
    }
  });
}

window.addEventListener('resize', positionCards);

function carouselGoNext() {
  activeIdx = (activeIdx + 1) % totalCards;
  positionCards();
}
function carouselGoPrev() {
  activeIdx = (activeIdx - 1 + totalCards) % totalCards;
  positionCards();
}

function startAuto() {
  if (autoTimer) clearInterval(autoTimer);
  autoTimer = null;
  if (isPaused || totalCards < 2) return;
  autoTimer = setInterval(carouselGoNext, 2200);
}

/* ── Initial paint (no transition so cards don't fly in from off-screen) */
if (totalCards > 0) {
  carouselCards.forEach(function (c) { c.style.transition = 'none'; });
  positionCards();
  /* re-enable transitions after one paint frame */
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      carouselCards.forEach(function (c) { c.style.transition = TRANSITION; });
    });
  });
  startAuto();
}

/* Prev / Next buttons */
var prevBtn = document.getElementById('prevSlideBtn');
var nextBtn = document.getElementById('nextSlideBtn');
var carouselToggleBtn = document.getElementById('carouselToggleBtn');
var pauseIcon = carouselToggleBtn && carouselToggleBtn.querySelector('[data-carousel-icon="pause"]');
var playIcon = carouselToggleBtn && carouselToggleBtn.querySelector('[data-carousel-icon="play"]');

function updateCarouselToggle() {
  if (!carouselToggleBtn) return;
  var label = isPaused ? 'Play carousel' : 'Pause carousel';
  carouselToggleBtn.setAttribute('aria-label', label);
  carouselToggleBtn.setAttribute('title', label);
  if (pauseIcon) pauseIcon.style.display = isPaused ? 'none' : '';
  if (playIcon) playIcon.style.display = isPaused ? '' : 'none';
}

updateCarouselToggle();
if (carouselToggleBtn) {
  carouselToggleBtn.addEventListener('click', function () {
    var wasPaused = isPaused;
    isPaused = !isPaused;
    updateCarouselToggle();
    if (wasPaused) carouselGoNext();
    startAuto();
  });
}
if (prevBtn) prevBtn.addEventListener('click', function () { carouselGoPrev(); startAuto(); });
if (nextBtn) nextBtn.addEventListener('click', function () { carouselGoNext(); startAuto(); });

var wrapper = document.querySelector('.carousel-wrapper');

/* Touch swipe */
var touchStartX = 0;
if (wrapper) {
  wrapper.addEventListener('touchstart', function (e) {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  wrapper.addEventListener('touchend', function (e) {
    var diff = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(diff) > 50) {
      if (diff < 0) carouselGoNext(); else carouselGoPrev();
      startAuto();
    }
  }, { passive: true });
}

/* Keyboard arrows (when lightbox is closed) */
document.addEventListener('keydown', function (e) {
  if (lightboxOpen) return;
  if (e.key === 'ArrowLeft')  { carouselGoPrev(); startAuto(); }
  if (e.key === 'ArrowRight') { carouselGoNext(); startAuto(); }
});

/* Clicking a carousel card opens the lightbox for that specific image */
carouselCards.forEach(function (card, i) {
  card.addEventListener('click', function (e) {
    e.stopPropagation();  /* don't bubble to wrapper */
    openLightbox(i);
  });
  card.style.cursor = 'pointer';
});


/* ═══════════════════════════════════════════════════════════════════════
   C. LIGHTBOX
   ═══════════════════════════════════════════════════════════════════════
   The HTML structure already exists (div#lightboxModal with .open class).
   We just need to:
     1. Fill the content fields from ITEMS[id]
     2. Add / remove the .open class to show / hide it
     3. Wire up close, prev, next, Escape, backdrop click
   ═══════════════════════════════════════════════════════════════════════ */
var modal       = document.getElementById('lightboxModal');
var lbImg       = document.getElementById('lightboxImg');
var lbTitle     = document.getElementById('lightboxTitle');
var lbTag       = document.getElementById('lightboxTag');
var lbDesc      = document.getElementById('lightboxDesc');
var lbLocation  = document.getElementById('lightboxLocation');
var lbCamera    = document.getElementById('lightboxCamera');
var lbRes       = document.getElementById('lightboxResolution');
var lbCloseBtn  = document.getElementById('lightboxCloseBtn');
var lbPrevBtn   = document.getElementById('lightboxPrevBtn');
var lbNextBtn   = document.getElementById('lightboxNextBtn');

/* Which item is currently shown in the lightbox */
var lbIndex = 0;

/*
 * fillLightbox(id)
 * Looks up ITEMS[id] and puts its data into the lightbox fields.
 * This is why every image shows its OWN correct caption — we read
 * from the ITEMS list, not from whatever was last set.
 */
function fillLightbox(id) {
  var item = ITEMS[id];
  if (!item) return;
  lbImg.src        = item.src;
  lbImg.alt        = item.alt;
  lbTitle.textContent    = item.title;
  lbTag.textContent      = item.tag;
  lbDesc.textContent     = item.desc;
  lbLocation.textContent = item.location;
  lbCamera.textContent   = item.camera;
  lbRes.textContent      = item.dimensions;
  lbIndex = id;
}

function openLightbox(id) {
  fillLightbox(id);
  modal.classList.add('open');
  document.body.style.overflow = 'hidden'; /* stop background scrolling */
  lightboxOpen = true;
}

function closeLightbox() {
  modal.classList.remove('open');
  document.body.style.overflow = ''; /* restore scrolling */
  lightboxOpen = false;
}

/* Close button */
if (lbCloseBtn) lbCloseBtn.addEventListener('click', closeLightbox);

/* Click on dark backdrop (not on the dialog itself) closes it */
if (modal) {
  modal.addEventListener('click', function (e) {
    if (e.target === modal) closeLightbox();
  });
}

/* Prev / Next inside the lightbox */
if (lbPrevBtn) {
  lbPrevBtn.addEventListener('click', function () {
    fillLightbox((lbIndex - 1 + ITEMS.length) % ITEMS.length);
  });
}
if (lbNextBtn) {
  lbNextBtn.addEventListener('click', function () {
    fillLightbox((lbIndex + 1) % ITEMS.length);
  });
}

/* Keyboard: Escape closes, Arrow keys navigate inside lightbox */
document.addEventListener('keydown', function (e) {
  if (!lightboxOpen) return;
  if (e.key === 'Escape')     closeLightbox();
  if (e.key === 'ArrowLeft')  fillLightbox((lbIndex - 1 + ITEMS.length) % ITEMS.length);
  if (e.key === 'ArrowRight') fillLightbox((lbIndex + 1) % ITEMS.length);
});

/* Touch swipe inside the lightbox */
var lbTouchStartX = 0;
if (modal) {
  modal.addEventListener('touchstart', function (e) {
    lbTouchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  modal.addEventListener('touchend', function (e) {
    var diff = e.changedTouches[0].screenX - lbTouchStartX;
    if (Math.abs(diff) > 50) {
      if (diff < 0) fillLightbox((lbIndex + 1) % ITEMS.length);
      else          fillLightbox((lbIndex - 1 + ITEMS.length) % ITEMS.length);
    }
  }, { passive: true });
}

/* Make gallery cards open the lightbox when clicked */
var galleryCards = Array.from(document.querySelectorAll('.gallery-card'));
galleryCards.forEach(function (card) {
  card.style.cursor = 'pointer';
  card.addEventListener('click', function () {
    var id = parseInt(card.getAttribute('data-id'), 10);
    openLightbox(id);
  });
  /* Keyboard: Enter or Space also opens it */
  card.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openLightbox(parseInt(card.getAttribute('data-id'), 10));
    }
  });
});


/* ═══════════════════════════════════════════════════════════════════════
   D. GALLERY FILTER BUTTONS
   ═══════════════════════════════════════════════════════════════════════
   Each button has data-filter="fashion" (or travel/urban/editorial/all).
   Each gallery card has data-category="fashion" etc.
   Clicking a button shows only cards whose data-category matches.
   ═══════════════════════════════════════════════════════════════════════ */
var filterBtns = Array.from(document.querySelectorAll('.filter-btn'));
var allGalleryCards = Array.from(document.querySelectorAll('#galleryGrid .gallery-card'));

filterBtns.forEach(function (btn) {
  btn.addEventListener('click', function () {
    /* Move the .active highlight to the clicked button */
    filterBtns.forEach(function (b) {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');

    var filter = btn.getAttribute('data-filter'); /* "all", "fashion", etc. */

    allGalleryCards.forEach(function (card) {
      var cat = card.getAttribute('data-category');
      if (filter === 'all' || cat === filter) {
        /* Show this card */
        card.style.display = '';
        card.removeAttribute('hidden');
      } else {
        /* Hide this card */
        card.style.display = 'none';
        card.setAttribute('hidden', '');
      }
    });
  });
});


/* ═══════════════════════════════════════════════════════════════════════
   E. MOBILE MENU
   ═══════════════════════════════════════════════════════════════════════
   The hamburger button (#mobileMenuBtn) toggles the .open class on
   the drawer (#mobileDrawer). CSS already has .mobile-drawer.open
   rules that make it slide down. JS just adds / removes the class.
   ═══════════════════════════════════════════════════════════════════════ */
var mobileBtn    = document.getElementById('mobileMenuBtn');
var mobileDrawer = document.getElementById('mobileDrawer');

if (mobileBtn && mobileDrawer) {
  mobileBtn.addEventListener('click', function () {
    var isOpen = mobileDrawer.classList.toggle('open');
    mobileBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  /* Close the drawer when any link inside it is tapped */
  mobileDrawer.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      mobileDrawer.classList.remove('open');
      mobileBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

/* Start silently for browser-compatible autoplay; audio is user-controlled. */
var showcaseVideo = document.querySelector('.showcase-video');
var videoSoundBtn = document.getElementById('videoSoundBtn');
var videoAudioPanel = document.getElementById('videoAudioPanel');
var videoAudioCloseBtn = document.getElementById('videoAudioCloseBtn');
var videoVolume = document.getElementById('videoVolume');

function updateVideoAudioControls() {
  if (!showcaseVideo || !videoSoundBtn) return;
  var isMuted = showcaseVideo.muted || showcaseVideo.volume === 0;
  videoSoundBtn.setAttribute('aria-label', isMuted ? 'Unmute video and show volume' : 'Mute video');
  videoSoundBtn.setAttribute('aria-pressed', isMuted ? 'true' : 'false');
  var mutedIcon = videoSoundBtn.querySelector('[data-video-icon="muted"]');
  var soundIcon = videoSoundBtn.querySelector('[data-video-icon="sound"]');
  if (mutedIcon) mutedIcon.style.display = isMuted ? '' : 'none';
  if (soundIcon) soundIcon.style.display = isMuted ? 'none' : '';
}

if (showcaseVideo && videoSoundBtn && videoAudioPanel && videoAudioCloseBtn && videoVolume) {
  showcaseVideo.muted = true;
  showcaseVideo.volume = Number(videoVolume.value);

  videoAudioCloseBtn.addEventListener('click', function () {
    videoAudioPanel.hidden = true;
    videoSoundBtn.setAttribute('aria-expanded', 'false');
    videoSoundBtn.focus();
  });

  videoSoundBtn.addEventListener('click', function () {
    if (videoAudioPanel.hidden) {
      videoAudioPanel.hidden = false;
      videoSoundBtn.setAttribute('aria-expanded', 'true');
    }

    if (showcaseVideo.muted || showcaseVideo.volume === 0) {
      if (showcaseVideo.volume === 0) {
        showcaseVideo.volume = Number(videoVolume.value) || 0.7;
      }
      showcaseVideo.muted = false;
    } else {
      showcaseVideo.muted = true;
    }
    showcaseVideo.play().catch(function (error) {
      console.error('Unable to play the lifestyle video with sound:', error);
    });
    updateVideoAudioControls();
  });

  videoVolume.addEventListener('input', function () {
    showcaseVideo.volume = Number(videoVolume.value);
    showcaseVideo.muted = showcaseVideo.volume === 0;
    updateVideoAudioControls();
  });

  showcaseVideo.play().catch(function (error) {
    console.error('Unable to autoplay the lifestyle video:', error);
  });

  updateVideoAudioControls();
}


/* ═══════════════════════════════════════════════════════════════════════
   F. BACK TO TOP
   ═══════════════════════════════════════════════════════════════════════ */
var topBtn = document.getElementById('backToTopBtn');
if (topBtn) {
  topBtn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}


/* ═══════════════════════════════════════════════════════════════════════
   G. SCROLL SPY
   ═══════════════════════════════════════════════════════════════════════
   Watches which section is on-screen and moves the active underline
   to the matching nav link. Runs on every scroll event (passive so
   it never blocks the page from scrolling smoothly).
   ═══════════════════════════════════════════════════════════════════════ */
var allNavLinks  = Array.from(document.querySelectorAll('.nav-link'));
var allSections  = Array.from(document.querySelectorAll('section[id]'));

function updateActiveLink() {
  var scrollY = window.scrollY + 90;
  var currentId = '';
  allSections.forEach(function (s) {
    if (s.offsetTop <= scrollY) currentId = s.getAttribute('id');
  });
  allNavLinks.forEach(function (link) {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + currentId) {
      link.classList.add('active');
    }
  });
}
updateActiveLink();
window.addEventListener('scroll', updateActiveLink, { passive: true });


/* ═══════════════════════════════════════════════════════════════════════
   REDUCED MOTION
   Stop the carousel auto-advance if the user prefers less animation.
   ═══════════════════════════════════════════════════════════════════════ */
if (prefersReducedMotion.matches) {
  carouselCards.forEach(function (c) { c.style.transition = 'none'; });
}

}()); /* end IIFE */
