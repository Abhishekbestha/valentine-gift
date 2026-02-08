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

    // Desktop: Mouse hover
    noBtn.addEventListener('mouseenter', (e) => {
        dodgeButton(e);
    });

    // Mobile: Touch
    noBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        dodgeButton(e);
    }, { passive: false });
}

function dodgeButton(e) {
    const btn = noBtn;
    const container = document.querySelector('.glass-card');
    const containerRect = container.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();

    // Calculate new random position within container bounds
    const maxX = containerRect.width - btnRect.width - 40;
    const maxY = containerRect.height - btnRect.height - 40;

    let newX = Math.random() * maxX;
    let newY = Math.random() * maxY;

    // Make sure it moves away from current position
    const currentX = btn.offsetLeft;
    const currentY = btn.offsetTop;

    // If new position is too close to current, flip to other side
    if (Math.abs(newX - currentX) < 100) {
        newX = currentX > maxX / 2 ? Math.random() * (maxX / 2) : (maxX / 2) + Math.random() * (maxX / 2);
    }

    // Apply styling for absolute positioning
    btn.style.position = 'absolute';
    btn.style.left = `${Math.max(20, Math.min(newX, maxX))}px`;
    btn.style.top = `${Math.max(20, Math.min(newY, maxY))}px`;
    btn.style.transition = 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';

    // Add playful scale effect
    btn.style.transform = 'scale(0.9)';
    setTimeout(() => {
        btn.style.transform = 'scale(1)';
    }, 150);

    // Change button text occasionally
    const messages = ['Nope!', 'Try again!', 'Not here!', 'Catch me!', 'Hehe!', 'No way!', '😜', 'Almost!'];
    if (Math.random() > 0.5) {
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
