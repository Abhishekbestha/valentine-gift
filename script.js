// ===== DOM Elements =====
const questionSection = document.getElementById('questionSection');
const greetingSection = document.getElementById('greetingSection');
const gallerySection = document.getElementById('gallerySection');
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const surpriseBtn = document.getElementById('surpriseBtn');
const musicToggle = document.getElementById('musicToggle');
const bgMusic = document.getElementById('bgMusic');
const heartsContainer = document.getElementById('heartsContainer');
const galleryItems = document.querySelectorAll('.gallery-item');

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    createFloatingHearts();
    initializeNoButtonDodge();
    initializeEventListeners();
});

// ===== Floating Hearts Background =====
function createFloatingHearts() {
    const hearts = ['💕', '💖', '💗', '💓', '💝', '♥️', '❤️', '💘'];
    const numberOfHearts = 15;

    for (let i = 0; i < numberOfHearts; i++) {
        createHeart(hearts, i);
    }
}

function createHeart(hearts, index) {
    const heart = document.createElement('span');
    heart.className = 'floating-heart';
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.animationDuration = `${6 + Math.random() * 6}s`;
    heart.style.animationDelay = `${index * 0.5}s`;
    heart.style.fontSize = `${1 + Math.random() * 1.5}rem`;
    heartsContainer.appendChild(heart);
}

// ===== No Button Dodge Logic =====
function initializeNoButtonDodge() {
    const container = document.querySelector('.buttons-container');

    // Desktop: Mouse movement
    document.addEventListener('mousemove', (e) => {
        const btn = noBtn;
        const rect = btn.getBoundingClientRect();
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        // Check if mouse is getting close (within 100px)
        const distance = Math.sqrt(
            Math.pow((mouseX - (rect.left + rect.width / 2)), 2) +
            Math.pow((mouseY - (rect.top + rect.height / 2)), 2)
        );

        if (distance < 100) {
            dodgeButton();
        }
    });

    // Mobile: Touch
    noBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        dodgeButton(e);
    }, { passive: false });
}

function dodgeButton() {
    const btn = noBtn;

    // Move button to body if it's not already there to avoid container constraints
    // (backdrop-filter on card creates a new containing block that messes up fixed positioning)
    if (btn.parentNode !== document.body) {
        const rect = btn.getBoundingClientRect();
        document.body.appendChild(btn);
        btn.style.position = 'fixed';
        btn.style.left = `${rect.left}px`;
        btn.style.top = `${rect.top}px`;
    }

    // Get viewport dimensions to ensure button stays on screen
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const btnRect = btn.getBoundingClientRect();

    // Padding from edges
    const padding = 20;

    // Calculate safe area (ensure button stays fully visible)
    const maxX = viewportWidth - btnRect.width - padding;
    const maxY = viewportHeight - btnRect.height - padding;
    const minX = padding;
    const minY = padding;

    // Current position
    let currentX = btn.getBoundingClientRect().left;
    let currentY = btn.getBoundingClientRect().top;

    // Calculate new random position
    let newX = Math.random() * (maxX - minX) + minX;
    let newY = Math.random() * (maxY - minY) + minY;

    // Ensure new position is far enough from current position
    // If too close, force it to the other side/quadrant
    if (Math.abs(newX - currentX) < 200 && Math.abs(newY - currentY) < 200) {
        if (currentX < viewportWidth / 2) {
            newX += viewportWidth / 2;
        } else {
            newX -= viewportWidth / 2;
        }

        if (currentY < viewportHeight / 2) {
            newY += viewportHeight / 2;
        } else {
            newY -= viewportHeight / 2;
        }

        // Final clamp check
        newX = Math.max(minX, Math.min(newX, maxX));
        newY = Math.max(minY, Math.min(newY, maxY));
    }

    // Apply fixed positioning to break out of container flow if needed
    // But using fixed makes coordinate calculation easier relative to viewport
    btn.style.position = 'fixed';
    btn.style.left = `${newX}px`;
    btn.style.top = `${newY}px`;

    // Faster transition for snappier feel
    btn.style.transition = 'all 0.2s cubic-bezier(0.1, 0.7, 1.0, 0.1)';

    // Add playful tilt
    const rotation = (Math.random() - 0.5) * 30;
    btn.style.transform = `scale(0.9) rotate(${rotation}deg)`;

    setTimeout(() => {
        btn.style.transform = `scale(1) rotate(0deg)`;
    }, 200);

    // Change button text occasionally
    const messages = ['Nope!', 'Try again!', 'Not here!', 'Catch me!', 'Hehe!', 'No way!', '😜', 'Almost!'];
    if (Math.random() > 0.6) {
        btn.innerHTML = `<span class="btn-icon">💔</span> ${messages[Math.floor(Math.random() * messages.length)]}`;
    }
}

// ===== Event Listeners =====
function initializeEventListeners() {
    // Yes Button Click
    yesBtn.addEventListener('click', handleYesClick);

    // Surprise Button Click
    surpriseBtn.addEventListener('click', handleSurpriseClick);

    // Music Toggle
    musicToggle.addEventListener('click', toggleMusic);
}

function handleYesClick() {
    // Create celebration effect
    createCelebrationHearts();

    // Hide No button immediately
    noBtn.style.display = 'none';

    // Hide question section with fade out
    questionSection.style.opacity = '0';
    questionSection.style.transform = 'scale(0.9)';
    questionSection.style.transition = 'all 0.5s ease-out';

    setTimeout(() => {
        questionSection.classList.add('hidden');
        greetingSection.classList.remove('hidden');

        // Scroll to greeting section
        greetingSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 500);
}

function createCelebrationHearts() {
    const celebration = document.createElement('div');
    celebration.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        pointer-events: none;
        z-index: 1000;
    `;
    document.body.appendChild(celebration);

    const hearts = ['💖', '💕', '💗', '💓', '💝', '✨', '🌟'];

    for (let i = 0; i < 30; i++) {
        const heart = document.createElement('span');
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.cssText = `
            position: absolute;
            font-size: ${1.5 + Math.random() * 2}rem;
            animation: celebrationBurst 1.5s ease-out forwards;
            --tx: ${(Math.random() - 0.5) * 300}px;
            --ty: ${(Math.random() - 0.5) * 300}px;
            --r: ${Math.random() * 720}deg;
        `;
        celebration.appendChild(heart);
    }

    // Add keyframes dynamically
    if (!document.getElementById('celebrationKeyframes')) {
        const style = document.createElement('style');
        style.id = 'celebrationKeyframes';
        style.textContent = `
            @keyframes celebrationBurst {
                0% {
                    transform: translate(0, 0) rotate(0deg) scale(0);
                    opacity: 1;
                }
                100% {
                    transform: translate(var(--tx), var(--ty)) rotate(var(--r)) scale(1);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Remove celebration element after animation
    setTimeout(() => {
        celebration.remove();
    }, 2000);
}

function handleSurpriseClick() {
    // Hide greeting section
    greetingSection.style.opacity = '0';
    greetingSection.style.transform = 'scale(0.95)';
    greetingSection.style.transition = 'all 0.5s ease-out';

    setTimeout(() => {
        greetingSection.classList.add('hidden');
        gallerySection.classList.remove('hidden');

        // Animate gallery items with stagger
        animateGalleryItems();

        // Scroll to gallery
        gallerySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 500);
}

function animateGalleryItems() {
    galleryItems.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('visible');
        }, index * 200);
    });
}

// ===== Music Toggle =====
let isPlaying = false;

function toggleMusic() {
    if (isPlaying) {
        bgMusic.pause();
        musicToggle.classList.remove('playing');
        musicToggle.querySelector('.music-icon').textContent = '🎵';
    } else {
        bgMusic.volume = 0.3;
        bgMusic.play().catch(() => {
            // Autoplay was prevented, that's okay
            console.log('Autoplay prevented by browser');
        });
        musicToggle.classList.add('playing');
        musicToggle.querySelector('.music-icon').textContent = '🔊';
    }
    isPlaying = !isPlaying;
}

// ===== Handle Reduced Motion Preference =====
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Disable animations for users who prefer reduced motion
    document.documentElement.style.setProperty('--transition-smooth', 'none');
    document.documentElement.style.setProperty('--transition-bounce', 'none');
}
