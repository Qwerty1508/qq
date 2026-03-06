/**
 * Culinaire Presentation Scripts
 * Handles scroll reveal animations, smooth scrolling, and lightbox logic.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Scroll Reveal Animations (Intersection Observer)
    const fadeElements = document.querySelectorAll('.reveal');

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px" // Trigger slightly before it hits the viewport bottom
    };

    const revealOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: Stop observing after reveal for a one-time animation
                // observer.unobserve(entry.target);
            } else {
                // Remove to allow re-animating when scrolling back up
                entry.target.classList.remove('active');
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
    if(slides[slideIndex]) {
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
    // Basic preloading check
    const img = new Image();
    img.src = imageSrc;
    
    img.onload = () => {
        lightboxImg.src = imageSrc;
    };
    
    // Set fallback if image fails (re-use placeholder logic visually)
    lightboxImg.onerror = () => {
        lightboxImg.src = 'https://via.placeholder.com/1080x1920/121212/D4AF37?text=Image+Not+Found';
    };

    // If image is already cached, just assign
    lightboxImg.src = imageSrc;
    lightboxCaption.textContent = captionText || 'Preview';
    
    lightbox.classList.add('active');
    toggleBodyScroll(true);
}

function closeLightbox() {
    lightbox.classList.remove('active');
    toggleBodyScroll(false);
    
    // Clear image source after animation finishes to prevent ghosting on next open
    setTimeout(() => {
        lightboxImg.src = '';
        lightboxCaption.textContent = '';
    }, 400); 
}

// Event Listeners for closing Lightbox
lightbox.addEventListener('click', (e) => {
    // Close if clicking outside the image content
    if (e.target === lightbox) {
        closeLightbox();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
    }
});
