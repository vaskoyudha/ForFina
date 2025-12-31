// ========================================
// CONFIGURATION - EDIT THIS SECTION
// ========================================

// Set your anniversary date here (YYYY-MM-DD format)
const ANNIVERSARY_DATE = '2025-09-26'; // 26 September 2025

// ========================================
// DOM ELEMENTS
// ========================================

// Create cursor glow effect
const cursorGlow = document.createElement('div');
cursorGlow.classList.add('cursor-glow');
document.body.appendChild(cursorGlow);

// Mouse tracking
let mouseX = 0;
let mouseY = 0;

// Gate Page Elements
const gatePage = document.getElementById('gatePage');
const mainPage = document.getElementById('mainPage');
const dateInput = document.getElementById('dateInput');
const submitBtn = document.getElementById('submitDate');
const errorMessage = document.getElementById('errorMessage');

// Main Page Elements
const envelopeContainer = document.getElementById('envelopeContainer');
const envelopeImage = document.getElementById('envelopeImage');
const letterContainer = document.getElementById('letterContainer');
const closeLetter = document.getElementById('closeLetter');
const confettiContainer = document.getElementById('confettiContainer');
const musicToggle = document.getElementById('musicToggle');

// Countdown Elements
const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');

// ========================================
// SOUND EFFECTS (Optional - uncomment if you add sound files)
// ========================================

// const sounds = {
//     click: new Audio('assets/sounds/click.mp3'),
//     success: new Audio('assets/sounds/success.mp3'),
//     error: new Audio('assets/sounds/error.mp3'),
//     envelope: new Audio('assets/sounds/envelope.mp3'),
//     confetti: new Audio('assets/sounds/confetti.mp3')
// };

// function playSound(soundName) {
//     if (sounds[soundName]) {
//         sounds[soundName].currentTime = 0;
//         sounds[soundName].play().catch(e => console.log('Sound play failed:', e));
//     }
// }

// ========================================
// MOUSE TRACKING & CURSOR EFFECTS
// ========================================

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorGlow.style.left = mouseX + 'px';
    cursorGlow.style.top = mouseY + 'px';
});

// Create ripple effect on click
function createRipple(x, y) {
    const ripple = document.createElement('div');
    ripple.style.position = 'fixed';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.style.width = '10px';
    ripple.style.height = '10px';
    ripple.style.borderRadius = '50%';
    ripple.style.border = '2px solid rgba(255, 107, 157, 0.6)';
    ripple.style.transform = 'translate(-50%, -50%)';
    ripple.style.pointerEvents = 'none';
    ripple.style.zIndex = '9999';
    ripple.style.animation = 'rippleExpand 0.8s ease-out forwards';

    document.body.appendChild(ripple);

    setTimeout(() => ripple.remove(), 800);
}

// Add ripple animation CSS dynamically
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes rippleExpand {
        to {
            width: 100px;
            height: 100px;
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

document.addEventListener('click', (e) => {
    createRipple(e.clientX, e.clientY);
    // playSound('click');
});

// ========================================
// GATE PAGE - DATE VALIDATION
// ========================================

submitBtn.addEventListener('click', validateDate);
dateInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        validateDate();
    }
});

function validateDate() {
    const inputValue = dateInput.value;

    if (!inputValue) {
        showError('Ayo isi tanggalnya dulu dong... 🥺');
        return;
    }

    if (inputValue === ANNIVERSARY_DATE) {
        // Correct date!
        // playSound('success');
        errorMessage.textContent = '';
        errorMessage.classList.remove('shake');

        // Success animation
        submitBtn.style.background = 'linear-gradient(135deg, #26de81, #20bf6b)';
        submitBtn.textContent = '✓ Berhasil!';

        // Transition to main page with smooth animation
        setTimeout(() => {
            gatePage.classList.add('exit');

            setTimeout(() => {
                gatePage.style.display = 'none';
                gatePage.classList.remove('active', 'exit');
                mainPage.classList.add('active');
                mainPage.style.display = 'flex';

                // Start countdown and effects
                startCountdown();
                updateDaysTogether();
                initializeParticles();

                // Auto-play music (User interaction confirmed)
                if (!isMusicPlaying) {
                    bgMusic.currentTime = 78; // Start at 1:18
                    bgMusic.play().then(() => {
                        isMusicPlaying = true;
                        const icon = musicToggle.querySelector('#musicIcon');
                        if (icon) icon.textContent = '🎵';
                    }).catch(err => {
                        console.log('Music play failed:', err);
                    });
                }
            }, 600);
        }, 500);
    } else {
        // Wrong date
        showError('Hmm... kayaknya bukan tanggal itu deh 🤔');
    }
}

function showError(message) {
    // playSound('error');
    errorMessage.textContent = message;
    errorMessage.classList.add('shake');
    dateInput.classList.add('shake');

    // Visual feedback
    dateInput.style.borderColor = 'var(--color-error)';

    setTimeout(() => {
        errorMessage.classList.remove('shake');
        dateInput.classList.remove('shake');
        dateInput.style.borderColor = '';
    }, 500);
}

// ========================================
// COUNTDOWN TIMER
// ========================================

function startCountdown() {
    updateCountdown(); // Initial update
    setInterval(updateCountdown, 1000); // Update every second
}

function updateCountdown() {
    const now = new Date().getTime();
    const newYear = new Date('2026-01-01T00:00:00').getTime();
    const distance = newYear - now;

    if (distance < 0) {
        daysEl.textContent = '00';
        hoursEl.textContent = '00';
        minutesEl.textContent = '00';
        secondsEl.textContent = '00';
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');
}

// ========================================
// LOVE COUNTER (Days Together)
// ========================================

function updateDaysTogether() {
    const anniversaryDate = new Date(ANNIVERSARY_DATE);
    const today = new Date();
    const diffTime = Math.abs(today - anniversaryDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const counterEl = document.getElementById('daysTogetherCounter');
    if (counterEl) {
        // Animated counting effect
        animateCounter(counterEl, diffDays);
    }
}

function animateCounter(element, targetValue) {
    const duration = 2000; // 2 seconds
    const startValue = 0;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function for smooth animation
        const easeOutQuad = progress * (2 - progress);
        const currentValue = Math.floor(startValue + (targetValue - startValue) * easeOutQuad);

        element.textContent = currentValue;

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = targetValue;
        }
    }

    requestAnimationFrame(update);
}

// ========================================
// ENVELOPE INTERACTION
// ========================================

let isEnvelopeOpen = false;

envelopeContainer.addEventListener('click', openEnvelope);

function openEnvelope() {
    if (isEnvelopeOpen) return;

    isEnvelopeOpen = true;

    // playSound('envelope');

    // 3D flip animation
    envelopeImage.classList.add('opening');

    // Change envelope image with delay
    setTimeout(() => {
        envelopeImage.src = 'assets/envelope-open.png';
    }, 600);

    // Hide envelope container
    setTimeout(() => {
        envelopeContainer.style.opacity = '0';
        envelopeContainer.style.transform = 'scale(0.8) rotateY(180deg)';
    }, 300);

    // Show letter
    setTimeout(() => {
        envelopeContainer.style.display = 'none';
        letterContainer.classList.add('show');

        // Trigger confetti and sound
        // playSound('confetti');
        createConfetti();
        createFloatingHearts();
    }, 1200);
}

closeLetter.addEventListener('click', closeLetter_);

function closeLetter_() {
    letterContainer.classList.remove('show');

    setTimeout(() => {
        envelopeContainer.style.display = 'block';
        envelopeImage.src = 'assets/envelope-closed.png';
        envelopeImage.classList.remove('opening');

        setTimeout(() => {
            envelopeContainer.style.opacity = '1';
            envelopeContainer.style.transform = 'scale(1) rotateY(0)';
            isEnvelopeOpen = false;
        }, 50);
    }, 300);
}

// ========================================
// CONFETTI EFFECT
// ========================================

function createConfetti() {
    const colors = ['#ff6b9d', '#ffa8c5', '#ffd700', '#ff69b4', '#ff1493'];
    const confettiCount = 100;

    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');

            // Random position
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.top = '-10px';

            // Random color
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];

            // Random size
            const size = Math.random() * 10 + 5;
            confetti.style.width = size + 'px';
            confetti.style.height = size + 'px';

            // Random rotation
            confetti.style.transform = `rotate(${Math.random() * 360}deg)`;

            // Random animation duration
            confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';

            confettiContainer.appendChild(confetti);

            // Remove after animation
            setTimeout(() => {
                confetti.remove();
            }, 4000);
        }, i * 30);
    }
}

// ========================================
// MUSIC TOGGLE & AUTO-PLAY
// ========================================

let isMusicPlaying = false;
const bgMusic = new Audio('assets/music.mp3');
bgMusic.loop = true;

// Auto-play logic moved to Gate validation (User Interaction)

musicToggle.addEventListener('click', toggleMusic);

function toggleMusic() {
    if (isMusicPlaying) {
        bgMusic.pause();
        const icon = musicToggle.querySelector('#musicIcon');
        if (icon) icon.textContent = '🔇';
        isMusicPlaying = false;
    } else {
        bgMusic.play().then(() => {
            const icon = musicToggle.querySelector('#musicIcon');
            if (icon) icon.textContent = '🎵';
            isMusicPlaying = true;
        }).catch(err => {
            console.log('Play failed:', err);
        });
    }
}

// ========================================
// FLOATING HEARTS EFFECT
// ========================================

function createFloatingHearts() {
    const heartsCount = 15;
    const hearts = ['❤️', '💕', '💖', '💗', '💝'];

    for (let i = 0; i < heartsCount; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
            heart.style.position = 'fixed';
            heart.style.left = Math.random() * 100 + '%';
            heart.style.bottom = '-50px';
            heart.style.fontSize = (Math.random() * 20 + 20) + 'px';
            heart.style.opacity = '0.8';
            heart.style.pointerEvents = 'none';
            heart.style.zIndex = '1000';
            heart.style.animation = `floatUp ${Math.random() * 3 + 3}s ease-out forwards`;

            document.body.appendChild(heart);

            setTimeout(() => heart.remove(), 6000);
        }, i * 200);
    }
}

// Add float up animation
const floatUpStyle = document.createElement('style');
floatUpStyle.textContent = `
    @keyframes floatUp {
        to {
            transform: translateY(-120vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(floatUpStyle);

// ========================================
// PARTICLE SYSTEM
// ========================================

let particles = [];

function initializeParticles() {
    // Create subtle particle effects
    setInterval(() => {
        if (Math.random() > 0.7) {
            createParticle();
        }
    }, 200);
}

function createParticle() {
    const particle = document.createElement('div');
    particle.textContent = ['✨', '⭐', '💫'][Math.floor(Math.random() * 3)];
    particle.style.position = 'fixed';
    particle.style.left = Math.random() * window.innerWidth + 'px';
    particle.style.top = Math.random() * window.innerHeight + 'px';
    particle.style.fontSize = (Math.random() * 15 + 10) + 'px';
    particle.style.opacity = '0';
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '1';
    particle.style.animation = 'particleFade 3s ease-out forwards';

    document.body.appendChild(particle);

    setTimeout(() => particle.remove(), 3000);
}

const particleStyle = document.createElement('style');
particleStyle.textContent = `
    @keyframes particleFade {
        0% {
            opacity: 0;
            transform: scale(0) rotate(0deg);
        }
        50% {
            opacity: 0.8;
        }
        100% {
            opacity: 0;
            transform: scale(1.5) rotate(180deg) translateY(-50px);
        }
    }
`;
document.head.appendChild(particleStyle);

// ========================================
// INITIALIZATION
// ========================================

// ========================================
// CINEMATIC INTRO LOGIC (ENHANCED)
// ========================================
window.addEventListener('load', () => {
    const introOverlay = document.getElementById('introOverlay');
    const scenes = document.querySelectorAll('.intro-scene');
    const lightBurst = document.querySelector('.light-burst');
    const curtainLeft = document.querySelector('.curtain-left');
    const curtainRight = document.querySelector('.curtain-right');

    // Create particle system
    createIntroParticles();

    // Scene timing (in milliseconds)
    const sceneTiming = [
        { delay: 500, duration: 2000 },   // Scene 1
        { delay: 2500, duration: 2000 },  // Scene 2
        { delay: 4500, duration: 3000 },  // Scene 3 (Main name)
        { delay: 7500, duration: 1500 }   // Scene 4 (Signature)
    ];

    // Play intro sequence
    playIntroSequence();

    function playIntroSequence() {
        // Scene 1: "Sebuah kejutan kecil..."
        setTimeout(() => {
            activateScene(0);
            const text1 = scenes[0].querySelector('.fade-text');
            text1.classList.add('visible');
        }, sceneTiming[0].delay);

        // Scene 2: "Special untuk..." + Light Burst
        setTimeout(() => {
            deactivateScene(0);
            activateScene(1);
            const text2 = scenes[1].querySelector('.fade-text');
            text2.classList.add('visible');

            // Trigger light burst
            lightBurst.classList.add('active');
        }, sceneTiming[1].delay);

        // Scene 3: "Shafina Christy" + Hearts
        setTimeout(() => {
            deactivateScene(1);
            activateScene(2);
            const name = document.getElementById('mainName');
            name.classList.add('visible');

            // Create floating hearts around name
            createFloatingHeartsIntro();
        }, sceneTiming[2].delay);

        // Scene 4: "dari Vasko"
        setTimeout(() => {
            deactivateScene(2);
            activateScene(3);
            const signature = scenes[3].querySelector('.signature-text');
            const heart = scenes[3].querySelector('.heart-icon');
            signature.classList.add('visible');

            setTimeout(() => {
                heart.classList.add('visible');
            }, 300);
        }, sceneTiming[3].delay);

        // End: Curtain reveal transition
        setTimeout(() => {
            curtainLeft.classList.add('open');
            curtainRight.classList.add('open');

            setTimeout(() => {
                introOverlay.classList.add('hidden');

                setTimeout(() => {
                    introOverlay.style.display = 'none';
                }, 1000);
            }, 1200);
        }, sceneTiming[3].delay + sceneTiming[3].duration);
    }

    function activateScene(index) {
        scenes[index].classList.add('active');
    }

    function deactivateScene(index) {
        scenes[index].classList.remove('active');
    }

    function createIntroParticles() {
        const container = document.getElementById('introParticles');
        const particleCount = 50;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'intro-particle';

            // Random position
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';

            // Random movement
            particle.style.setProperty('--tx', (Math.random() - 0.5) * 100 + 'px');
            particle.style.setProperty('--ty', (Math.random() - 0.5) * 100 + 'px');

            // Random delay
            particle.style.animationDelay = Math.random() * 2 + 's';

            container.appendChild(particle);
        }
    }

    function createFloatingHeartsIntro() {
        const container = document.getElementById('floatingHearts');
        const hearts = ['💕', '💖', '💗', '❤️'];
        const heartCount = 8;

        for (let i = 0; i < heartCount; i++) {
            const heart = document.createElement('div');
            heart.className = 'intro-heart';
            heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];

            // Position around the name
            const angle = (360 / heartCount) * i;
            const radius = 150;
            const x = Math.cos(angle * Math.PI / 180) * radius;
            const y = Math.sin(angle * Math.PI / 180) * radius;

            heart.style.left = `calc(50% + ${x}px)`;
            heart.style.top = `calc(50% + ${y}px)`;
            heart.style.animationDelay = i * 0.15 + 's';

            container.appendChild(heart);
        }
    }
});

// Optional: Save state to localStorage
function saveProgress() {
    localStorage.setItem('hasSeenGate', 'true');
}

// Optional: Auto-skip gate if already seen (comment out if you want gate every time)
/*
window.addEventListener('load', () => {
    if (localStorage.getItem('hasSeenGate') === 'true') {
        gatePage.style.display = 'none';
        mainPage.classList.add('active');
        mainPage.style.display = 'flex';
        startCountdown();
    }
});
*/

// ========================================
// FIREWORKS EFFECT
// ========================================
function launchFireworks() {
    const container = document.getElementById('fireworksContainer');
    container.classList.add('active');

    const colors = ['fw-pink', 'fw-gold', 'fw-purple', 'fw-cyan', 'fw-red'];
    const burstCount = 15; // Number of firework bursts

    for (let i = 0; i < burstCount; i++) {
        setTimeout(() => {
            createFireworkBurst(container, colors);
        }, i * 400); // Stagger the bursts
    }

    // Hide container after all fireworks finish
    setTimeout(() => {
        container.classList.remove('active');
        setTimeout(() => {
            container.innerHTML = ''; // Clear particles
        }, 500);
    }, burstCount * 400 + 3000);
}

function createFireworkBurst(container, colors) {
    // Random position
    const x = Math.random() * (window.innerWidth - 200) + 100;
    const y = Math.random() * (window.innerHeight * 0.5) + 50;

    // Random color
    const color = colors[Math.floor(Math.random() * colors.length)];

    // Create rocket
    const rocket = document.createElement('div');
    rocket.className = 'firework-rocket';
    rocket.style.left = x + 'px';
    rocket.style.top = window.innerHeight + 'px';
    container.appendChild(rocket);

    // Explode after rocket reaches position
    setTimeout(() => {
        rocket.remove();
        createExplosion(container, x, y, color);
    }, 1000);
}

function createExplosion(container, x, y, color) {
    const particleCount = 80; // Particles per burst
    const animations = ['explode1', 'explode2', 'explode3'];

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = `firework-particle ${color}`;

        // Calculate explosion vector
        const angle = (Math.PI * 2 * i) / particleCount;
        const velocity = 100 + Math.random() * 100;
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity + (Math.random() * 50); // Add gravity effect

        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.setProperty('--tx', tx + 'px');
        particle.style.setProperty('--ty', ty + 'px');

        // Random animation
        const anim = animations[Math.floor(Math.random() * animations.length)];
        particle.style.animation = `${anim} ${1.5 + Math.random()}s ease-out forwards`;

        container.appendChild(particle);

        // Remove particle after animation
        setTimeout(() => {
            particle.remove();
        }, 2500);
    }
}

// Trigger fireworks after intro completes
setTimeout(() => {
    launchFireworks();
}, 10000); // Start fireworks right after intro finishes

console.log('💕 Website loaded successfully! Happy New Year 2026! 🎉');
