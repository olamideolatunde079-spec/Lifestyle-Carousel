/**
 * Lifestyle Carousel & Showcase Application Logic
 */

// Visual Gallery Data Model
const GALLERY_ITEMS = [
    {
        id: 0,
        title: "Match Was Good",
        category: "fashion",
        categoryName: "Fashion & Style",
        tag: "Sport Luxe",
        desc: "Urban casual portrait capturing sport-inspired style and effortless aesthetic presence.",
        location: "London, UK",
        src: "images/Aesthetic Free.jpg",
        dimensions: "2400 × 3000",
        camera: "Leica SL2 · 50mm f/1.4",
        featured: true
    },
    {
        id: 1,
        title: "Chicago Skyline",
        category: "travel",
        categoryName: "Travel & Nature",
        tag: "Urban Architecture",
        desc: "Towering architecture reflecting morning river mist and cinematic metropolitan energy.",
        location: "Chicago, USA",
        src: "images/chicago.jpg",
        dimensions: "3840 × 2560",
        camera: "Sony A7R V · 24-70mm f/2.8",
        featured: false
    },
    {
        id: 2,
        title: "Cool Style",
        category: "fashion",
        categoryName: "Fashion & Style",
        tag: "Streetwear Luxe",
        desc: "Refined silhouette styling with modern tailoring and contemporary street poise.",
        location: "Paris, France",
        src: "images/Cool style.jpg",
        dimensions: "2800 × 3500",
        camera: "Canon R5 · 85mm f/1.2",
        featured: false
    },
    {
        id: 3,
        title: "Coorg Serenity",
        category: "travel",
        categoryName: "Travel & Nature",
        tag: "Lush Highlands",
        desc: "Misty mountain hills enveloped in verdant coffee groves and serene morning atmosphere.",
        location: "Coorg, India",
        src: "images/Coorg.jpg",
        dimensions: "4000 × 2667",
        camera: "Fujifilm GFX 100S · 32-64mm",
        featured: false
    },
    {
        id: 4,
        title: "Night Out",
        category: "urban",
        categoryName: "Urban & Mood",
        tag: "City Lights",
        desc: "Evening ambience capturing ambient city glow, bokeh textures, and relaxed moments.",
        location: "Tokyo, Japan",
        src: "images/Cute day.jpg",
        dimensions: "2500 × 3125",
        camera: "Sony A7S III · 35mm f/1.4",
        featured: false
    },
    {
        id: 5,
        title: "Lungus Mood",
        category: "editorial",
        categoryName: "Creative Editorial",
        tag: "Character Study",
        desc: "Dramatic portrait study with deep contrast, subtle film grain, and raw personality.",
        location: "Berlin, Germany",
        src: "images/lungus.jpg",
        dimensions: "3000 × 3750",
        camera: "Hasselblad X2D · 80mm",
        featured: true
    },
    {
        id: 6,
        title: "Vibrant Maximalism",
        category: "editorial",
        categoryName: "Creative Editorial",
        tag: "Color & Depth",
        desc: "Intricate visual compositions celebrating expressive cultural colorways and texture.",
        location: "Lagos, Nigeria",
        src: "images/maximalist.jpg",
        dimensions: "3200 × 4000",
        camera: "Nikon Z9 · 50mm f/1.2",
        featured: false
    },
    {
        id: 7,
        title: "Seamless Flow",
        category: "urban",
        categoryName: "Urban & Mood",
        tag: "Visual Rhythm",
        desc: "Minimalist geometry balancing clean architectural lines, shadows, and natural illumination.",
        location: "Stockholm, Sweden",
        src: "images/Seamless pic.jpg",
        dimensions: "2600 × 3250",
        camera: "Leica M11 · 35mm Summilux",
        featured: false
    },
    {
        id: 8,
        title: "Dramatic Footwear",
        category: "fashion",
        categoryName: "Fashion & Style",
        tag: "Statement Soles",
        desc: "Bold textures and contemporary footwear craftsmanship spotlighted with directional lighting.",
        location: "New York, USA",
        src: "images/shoes.jpg",
        dimensions: "2400 × 3000",
        camera: "Canon R5 · 100mm Macro",
        featured: false
    },
    {
        id: 9,
        title: "Visual Logs",
        category: "editorial",
        categoryName: "Creative Editorial",
        tag: "Curated Journal",
        desc: "Documentary aesthetic showcasing daily creative expressions and artistic discovery.",
        location: "Toronto, Canada",
        src: "images/visual log.jpg",
        dimensions: "3000 × 3750",
        camera: "Fujifilm X-T5 · 23mm f/1.4",
        featured: false
    }
];

// Application State
let currentSlideIndex = 0;
let isPaused = false;
let currentFilter = 'all';
let currentLightboxIndex = 0;
let scrollSpeed = 45; // seconds for full loop

// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
    initCarousel();
    initGalleryGrid();
    initControls();
    initLightbox();
    initMobileDrawer();
    initContactForm();
    initScrollSpy();
});

/**
 * Initialize Infinite Carousel Track
 */
function initCarousel() {
    const track = document.getElementById('carouselTrack');
    if (!track) return;

    // Build slide HTML from items (duplicated for seamless continuous looping)
    const slidesHtml = GALLERY_ITEMS.map((item, index) => createSlideHtml(item, index)).join('');
    
    // Duplicate items to ensure uninterrupted seamless scrolling
    track.innerHTML = slidesHtml + slidesHtml;

    // Attach click handlers to open lightbox
    track.querySelectorAll('.slide-card').forEach((card) => {
        card.addEventListener('click', (e) => {
            const index = parseInt(card.dataset.index, 10);
            openLightbox(index);
        });
    });

    // Touch swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        track.classList.add('paused');
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        if (!isPaused) {
            track.classList.remove('paused');
        }
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const threshold = 50;
        if (touchEndX < touchStartX - threshold) {
            // Swiped left
            nextSlideStep();
        } else if (touchEndX > touchStartX + threshold) {
            // Swiped right
            prevSlideStep();
        }
    }
}

/**
 * Helper to generate Slide Card HTML
 */
function createSlideHtml(item, index) {
    return `
        <div class="slide-card" data-index="${index}" role="button" tabindex="0" aria-label="View ${item.title}">
            <img src="${item.src}" alt="${item.title}" class="slide-img" loading="lazy" />
            <div class="slide-caption">
                <div class="slide-caption-tag">
                    <span>${item.tag}</span>
                    <span>${item.location.split(',')[0]}</span>
                </div>
                <h3 class="slide-caption-title">${item.title}</h3>
                <p class="slide-caption-desc">${item.desc}</p>
            </div>
        </div>
    `;
}

/**
 * Initialize Filterable Gallery Grid
 */
function initGalleryGrid() {
    const grid = document.getElementById('galleryGrid');
    if (!grid) return;

    renderGallery();

    // Filter Button Click Listeners
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderGallery();
        });
    });
}

/**
 * Render Gallery Cards according to filter
 */
function renderGallery() {
    const grid = document.getElementById('galleryGrid');
    if (!grid) return;

    const filtered = currentFilter === 'all' 
        ? GALLERY_ITEMS 
        : GALLERY_ITEMS.filter(item => item.category === currentFilter);

    if (filtered.length === 0) {
        grid.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted);">No images found for this category.</div>`;
        return;
    }

    grid.innerHTML = filtered.map(item => `
        <article class="gallery-card ${item.featured ? 'featured-card' : ''}" data-id="${item.id}" role="button" tabindex="0" aria-label="Open ${item.title}">
            <div class="gallery-img-wrap">
                <img src="${item.src}" alt="${item.title}" class="gallery-img" loading="lazy" />
                <div class="gallery-overlay-badge" title="Quick View">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
                </div>
            </div>
            <div class="gallery-content">
                <div class="gallery-meta">
                    <span>${item.categoryName}</span>
                    <span aria-hidden="true">·</span>
                    <span>${item.dimensions}</span>
                </div>
                <h3 class="gallery-title">${item.title}</h3>
                <p class="gallery-desc">${item.desc}</p>
                <div class="gallery-footer">
                    <span class="gallery-location">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                        ${item.location}
                    </span>
                    <span class="gallery-action-link">
                        Inspect
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </span>
                </div>
            </div>
        </article>
    `).join('');

    // Attach click listeners to gallery cards
    grid.querySelectorAll('.gallery-card').forEach(card => {
        card.addEventListener('click', () => {
            const id = parseInt(card.dataset.id, 10);
            openLightbox(id);
        });
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const id = parseInt(card.dataset.id, 10);
                openLightbox(id);
            }
        });
    });
}

/**
 * Initialize Carousel Toolbar & Arrow Controls
 */
function initControls() {
    const track = document.getElementById('carouselTrack');
    const playPauseBtn = document.getElementById('togglePlayBtn');
    const speedBtn = document.getElementById('toggleSpeedBtn');
    const reverseBtn = document.getElementById('toggleReverseBtn');
    const prevBtn = document.getElementById('prevSlideBtn');
    const nextBtn = document.getElementById('nextSlideBtn');

    if (playPauseBtn && track) {
        playPauseBtn.addEventListener('click', () => {
            isPaused = !isPaused;
            if (isPaused) {
                track.classList.add('paused');
                playPauseBtn.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                    <span>Play</span>
                `;
            } else {
                track.classList.remove('paused');
                playPauseBtn.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                    <span>Pause</span>
                `;
            }
        });
    }

    if (speedBtn && track) {
        speedBtn.addEventListener('click', () => {
            if (scrollSpeed === 45) {
                scrollSpeed = 25; // Fast
                speedBtn.querySelector('span').textContent = 'Speed: Fast';
            } else if (scrollSpeed === 25) {
                scrollSpeed = 70; // Slow
                speedBtn.querySelector('span').textContent = 'Speed: Slow';
            } else {
                scrollSpeed = 45; // Normal
                speedBtn.querySelector('span').textContent = 'Speed: 1x';
            }
            track.style.animationDuration = `${scrollSpeed}s`;
        });
    }

    if (reverseBtn && track) {
        reverseBtn.addEventListener('click', () => {
            track.classList.toggle('reverse');
            const isReverse = track.classList.contains('reverse');
            reverseBtn.querySelector('span').textContent = isReverse ? 'Direction: ◀' : 'Direction: ▶';
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', prevSlideStep);
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', nextSlideStep);
    }
}

function nextSlideStep() {
    currentSlideIndex = (currentSlideIndex + 1) % GALLERY_ITEMS.length;
    updateSlideCounter();
    openLightbox(currentSlideIndex);
}

function prevSlideStep() {
    currentSlideIndex = (currentSlideIndex - 1 + GALLERY_ITEMS.length) % GALLERY_ITEMS.length;
    updateSlideCounter();
    openLightbox(currentSlideIndex);
}

function updateSlideCounter() {
    const counter = document.getElementById('slideCounter');
    if (counter) {
        const currentFormatted = String(currentSlideIndex + 1).padStart(2, '0');
        const totalFormatted = String(GALLERY_ITEMS.length).padStart(2, '0');
        counter.textContent = `${currentFormatted} / ${totalFormatted}`;
    }
}

/**
 * Initialize Lightbox Modal
 */
function initLightbox() {
    const modal = document.getElementById('lightboxModal');
    const closeBtn = document.getElementById('lightboxCloseBtn');
    const prevBtn = document.getElementById('lightboxPrevBtn');
    const nextBtn = document.getElementById('lightboxNextBtn');

    if (!modal) return;

    if (closeBtn) {
        closeBtn.addEventListener('click', closeLightbox);
    }

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeLightbox();
        }
    });

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentLightboxIndex = (currentLightboxIndex - 1 + GALLERY_ITEMS.length) % GALLERY_ITEMS.length;
            updateLightboxContent(currentLightboxIndex);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentLightboxIndex = (currentLightboxIndex + 1) % GALLERY_ITEMS.length;
            updateLightboxContent(currentLightboxIndex);
        });
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('open')) return;
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            currentLightboxIndex = (currentLightboxIndex - 1 + GALLERY_ITEMS.length) % GALLERY_ITEMS.length;
            updateLightboxContent(currentLightboxIndex);
        } else if (e.key === 'ArrowRight') {
            currentLightboxIndex = (currentLightboxIndex + 1) % GALLERY_ITEMS.length;
            updateLightboxContent(currentLightboxIndex);
        }
    });
}

function openLightbox(index) {
    currentLightboxIndex = index;
    updateLightboxContent(index);
    const modal = document.getElementById('lightboxModal');
    if (modal) {
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
}

function closeLightbox() {
    const modal = document.getElementById('lightboxModal');
    if (modal) {
        modal.classList.remove('open');
        document.body.style.overflow = '';
    }
}

function updateLightboxContent(index) {
    const item = GALLERY_ITEMS[index];
    if (!item) return;

    const img = document.getElementById('lightboxImg');
    const title = document.getElementById('lightboxTitle');
    const tag = document.getElementById('lightboxTag');
    const desc = document.getElementById('lightboxDesc');
    const location = document.getElementById('lightboxLocation');
    const camera = document.getElementById('lightboxCamera');
    const resolution = document.getElementById('lightboxResolution');

    if (img) {
        img.src = item.src;
        img.alt = item.title;
    }
    if (title) title.textContent = item.title;
    if (tag) tag.textContent = `${item.categoryName} · ${item.tag}`;
    if (desc) desc.textContent = item.desc;
    if (location) location.textContent = item.location;
    if (camera) camera.textContent = item.camera;
    if (resolution) resolution.textContent = item.dimensions;
}

/**
 * Mobile Drawer Toggle
 */
function initMobileDrawer() {
    const toggleBtn = document.getElementById('mobileMenuBtn');
    const drawer = document.getElementById('mobileDrawer');
    if (!toggleBtn || !drawer) return;

    toggleBtn.addEventListener('click', () => {
        drawer.classList.toggle('open');
        const isOpen = drawer.classList.contains('open');
        toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    drawer.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            drawer.classList.remove('open');
            toggleBtn.setAttribute('aria-expanded', 'false');
        });
    });
}

/**
 * Interactive Contact Form
 */
function initContactForm() {
    const form = document.getElementById('contactForm');
    const toast = document.getElementById('toastNotice');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
        }

        setTimeout(() => {
            form.reset();
            if (submitBtn) {
                submitBtn.textContent = 'Send Message';
                submitBtn.disabled = false;
            }
            showToast('Thank you! Your message has been received.');
        }, 600);
    });

    const backToTop = document.getElementById('backToTopBtn');
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

function showToast(message) {
    const toast = document.getElementById('toastNotice');
    if (!toast) return;
    const toastMsg = document.getElementById('toastMessage');
    if (toastMsg) toastMsg.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}

/**
 * ScrollSpy for Navigation Links
 */
function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }, { passive: true });
}
