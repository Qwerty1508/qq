/**
 * Culinaire Presentation Scripts
 * Handles scroll reveal animations, smooth scrolling, and lightbox logic.
 */

document.addEventListener('DOMContentLoaded', () => {
    const fadeElements = document.querySelectorAll('.reveal');

    const revealOptions = {
        threshold: 0.05,
        rootMargin: "0px 0px -30px 0px"
    };

    const revealOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // One-shot: stop observing once revealed — prevents jitter on re-scroll
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    fadeElements.forEach(el => {
        revealOnScroll.observe(el);
    });
});

// 2. Smooth Scroll to Section
function scrollToSlide(slideIndex) {
    const slides = document.querySelectorAll('.slide');
    if (slides[slideIndex]) {
        // Calculate header offset if needed, or straight scroll
        slides[slideIndex].scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// 3. Lightbox Functionality
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
const btnPrev = document.getElementById('lightbox-prev');
const btnNext = document.getElementById('lightbox-next');

let currentItems = [];
let currentIndex = -1;

// Lock/Unlock body scroll
function toggleBodyScroll(lock) {
    if (lock) {
        document.body.style.overflow = 'hidden';
        document.body.style.paddingRight = getScrollbarWidth() + 'px'; // prevent layout shift
    } else {
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
    }
}

// Helper: Calculate scrollbar width
function getScrollbarWidth() {
    return window.innerWidth - document.documentElement.clientWidth;
}

function openLightbox(imageSrc, captionText) {
    // Infer the correct gallery item and grid based on the imageSrc
    const filename = imageSrc.split('/').pop();
    const matchingImg = document.querySelector(`.gallery-item img[src$="${filename}"]`);

    if (matchingImg) {
        const item = matchingImg.closest('.gallery-item');
        const parentGrid = item.closest('.gallery-grid');
        if (parentGrid) {
            currentItems = Array.from(parentGrid.querySelectorAll('.gallery-item'));
            currentIndex = currentItems.indexOf(item);
        }
    } else { // Fallback if image not found in DOM
        currentItems = [];
        currentIndex = -1;
    }

    if (currentIndex >= 0 && currentItems.length > 0) {
        renderCurrentSlide();
    } else {
        setLightboxContent(imageSrc, captionText);
        if (btnPrev) btnPrev.style.display = 'none';
        if (btnNext) btnNext.style.display = 'none';
    }

    lightbox.classList.add('active');
    toggleBodyScroll(true);
}

function renderCurrentSlide() {
    if (currentIndex >= 0 && currentItems.length > 0) {
        const item = currentItems[currentIndex];
        const img = item.querySelector('img');
        const caption = item.querySelector('.item-label');
        const description = item.getAttribute('data-description') || '';

        let src = img.getAttribute('src');
        let text = caption ? caption.textContent : 'Preview';

        setLightboxContent(src, text, description);
        updateNavButtons();
    }
}

function setLightboxContent(imageSrc, captionText, descriptionText = '') {
    const img = new Image();
    img.src = imageSrc;

    img.onload = () => {
        lightboxImg.src = imageSrc;
    };

    lightboxImg.onerror = () => {
        lightboxImg.src = 'https://via.placeholder.com/1080x1920/121212/D4AF37?text=Image+Not+Found';
    };

    lightboxImg.src = imageSrc;
    lightboxCaption.textContent = captionText || 'Preview';

    const descEl = document.getElementById('lightbox-desc');
    if (descEl) {
        descEl.textContent = descriptionText;
    }
}

function updateNavButtons() {
    if (!btnPrev || !btnNext) return;

    if (currentItems.length <= 1) {
        btnPrev.style.display = 'none';
        btnNext.style.display = 'none';
        return;
    }

    btnPrev.style.display = 'flex';
    btnNext.style.display = 'flex';

    btnPrev.disabled = currentIndex === 0;
    btnNext.disabled = currentIndex === currentItems.length - 1;
}

function prevImage(e) {
    if (e) e.stopPropagation();
    if (currentIndex > 0) {
        currentIndex--;
        renderCurrentSlide();
    }
}

function nextImage(e) {
    if (e) e.stopPropagation();
    if (currentIndex >= 0 && currentIndex < currentItems.length - 1) {
        currentIndex++;
        renderCurrentSlide();
    }
}

function closeLightbox() {
    lightbox.classList.remove('active');
    toggleBodyScroll(false);

    // Clear image source after animation finishes
    setTimeout(() => {
        lightboxImg.src = '';
        lightboxCaption.textContent = '';
    }, 400);
}

// Event Listeners for Nav Buttons
if (btnPrev) btnPrev.addEventListener('click', prevImage);
if (btnNext) btnNext.addEventListener('click', nextImage);

// Event Listeners for closing Lightbox
lightbox.addEventListener('click', (e) => {
    // Close if clicking exactly on the lightbox background
    if (e.target === lightbox) {
        closeLightbox();
    }
});

// Keyboard Navigation
document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;

    if (e.key === 'Escape') {
        closeLightbox();
    } else if (e.key === 'ArrowLeft') {
        prevImage();
    } else if (e.key === 'ArrowRight') {
        nextImage();
    }
});

// Touch / Swipe Support for Mobile
let touchStartX = 0;
let touchEndX = 0;

if (lightboxImg) {
    lightboxImg.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightboxImg.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
}

function handleSwipe() {
    const swipeThreshold = 50; // minimum distance to be considered a swipe
    if (touchEndX < touchStartX - swipeThreshold) {
        nextImage(); // Swipe left -> next
    }
    if (touchEndX > touchStartX + swipeThreshold) {
        prevImage(); // Swipe right -> prev
    }
}
