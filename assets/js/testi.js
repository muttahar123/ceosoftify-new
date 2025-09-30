const testimonialsContainer = document.querySelector('.testimonialst');
const testimonials = document.querySelectorAll('.testimonialt');

let isDragging = false;
let startX = 0;
let currentTranslate = 0;
let prevTranslate = 0;
let currentIndex = 3; // Start from the first real set of visible cards
const visibleCards = 3; // Number of visible cards at a time
const cardWidth = testimonials[0].offsetWidth + parseInt(window.getComputedStyle(testimonials[0]).marginRight);

// Clone necessary cards for seamless looping
const firstClones = [];
const lastClones = [];
for (let i = 0; i < visibleCards; i++) {
    firstClones.push(testimonials[i].cloneNode(true));
    lastClones.push(testimonials[testimonials.length - 1 - i].cloneNode(true));
}
firstClones.forEach((clone) => testimonialsContainer.appendChild(clone));
lastClones.reverse().forEach((clone) => testimonialsContainer.insertBefore(clone, testimonials[0]));

// Adjust the container's initial position
testimonialsContainer.style.transform = `translateX(-${currentIndex * cardWidth}px)`;

// Mouse event handlers
testimonialsContainer.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX;
    testimonialsContainer.style.transition = 'none';
});

testimonialsContainer.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const currentPosition = e.clientX;
    const diff = currentPosition - startX;
    currentTranslate = prevTranslate + diff;
    testimonialsContainer.style.transform = `translateX(${currentTranslate}px)`;
});

testimonialsContainer.addEventListener('mouseup', handleMouseUp);
testimonialsContainer.addEventListener('mouseleave', handleMouseUp);

// Snap to nearest card on release
function handleMouseUp() {
    if (!isDragging) return;
    isDragging = false;

    const movedBy = currentTranslate - prevTranslate;
    if (movedBy < -50 && currentIndex < testimonials.length + visibleCards - 1) {
        currentIndex++; // Move to next card group
    } else if (movedBy > 50 && currentIndex > 0) {
        currentIndex--; // Move to previous card group
    }

    snapToTestimonial();
}

// Snap to cards and handle looping
function snapToTestimonial() {
    testimonialsContainer.style.transition = 'transform 0.5s ease-in-out';
    prevTranslate = -currentIndex * cardWidth;
    testimonialsContainer.style.transform = `translateX(${prevTranslate}px)`;

    testimonialsContainer.addEventListener('transitionend', handleLoop);
}

// Handle seamless looping
function handleLoop() {
    testimonialsContainer.style.transition = 'none';
    if (currentIndex === 0) {
        currentIndex = testimonials.length - visibleCards; // Jump to the last real set of cards
        prevTranslate = -currentIndex * cardWidth;
        testimonialsContainer.style.transform = `translateX(${prevTranslate}px)`;
    } else if (currentIndex === testimonials.length + visibleCards - 1) {
        currentIndex = visibleCards; // Jump to the first real set of cards
        prevTranslate = -currentIndex * cardWidth;
        testimonialsContainer.style.transform = `translateX(${prevTranslate}px)`;
    }
    testimonialsContainer.removeEventListener('transitionend', handleLoop);
}

// Prevent default drag behavior (e.g., image selection)
testimonialsContainer.addEventListener('dragstart', (e) => e.preventDefault());

// Recalculate card width on window resize
window.addEventListener('resize', () => {
    prevTranslate = -currentIndex * cardWidth;
    testimonialsContainer.style.transform = `translateX(${prevTranslate}px)`;
});