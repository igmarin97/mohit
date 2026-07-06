/**
 * ==========================================================================
 * 1. Initialization & Loading Screen Handler
 * ==========================================================================
 */
document.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.getElementById('loading-screen');
    const header = document.querySelector('.header');
    const links = document.querySelectorAll('.link-card');
    const footer = document.querySelector('.footer');
    const lightningFlash = document.getElementById('lightning-flash');
    const rainContainer = document.getElementById('rain-container');
    const spiderIcon = document.getElementById('spider-icon');

    // --- 1.1 Loading Animation ---
    // Hide loading screen after a short delay to ensure CSS/Fonts are ready
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        // Ensure header/links/footer are visible after loading, even if scroll reveal is slow
        header.classList.add('visible');
        links.forEach((link, index) => {
            setTimeout(() => link.classList.add('visible'), 700 + index * 100);
        });
        footer.classList.add('visible');
    }, 500); 

    // --- 1.2 Initialize Particles ---
    initializeParticles();

    // --- 1.3 Setup Scroll Reveal Observer ---
    // Keep original scroll reveal for staggered entry, but add immediate visibility for intro smoothness
    setupScrollReveal([header, ...links, footer]);

    // --- 1.4 Setup Ripple Effect Listeners ---
    setupRippleEffect();
    
    // --- 1.5 Setup Cinematic Effects ---
    initializeRain(rainContainer);
    setupLightning(lightningFlash);
    setupMagneticHover(links);
    setupSpiderSwing(spiderIcon);
});

/**
 * Initializes the particles.js library for the floating particle effect.
 */
function initializeParticles() {
    if (window.particlesJS) {
        window.particlesJS('particles-js', {
            "particles": {
                "number": {
                    "value": 50,
                    "density": {
                        "enable": true,
                        "value_area": 800
                    }
                },
                "color": {
                    "value": "#a8dadc" // Neon highlight color
                },
                "shape": {
                    "type": "circle",
                    "stroke": {
                        "width": 0,
                        "color": "#000000"
                    },
                    "polygon": {
                        "nb_sides": 5
                    }
                },
                "opacity": {
                    "value": 0.2,
                    "random": true,
                    "anim": {
                        "enable": true,
                        "speed": 1,
                        "opacity_min": 0.1,
                        "sync": false
                    }
                },
                "size": {
                    "value": 2.5,
                    "random": true,
                    "anim": {
                        "enable": true,
                        "speed": 4,
                        "size_min": 0.5,
                        "sync": false
                    }
                },
                "line_linked": {
                    "enable": false
                },
                "move": {
                    "enable": true,
                    "speed": 0.5, // Slow movement for cinematic feel
                    "direction": "top",
                    "random": true,
                    "straight": false,
                    "out_mode": "out",
                    "bounce": false,
                    "attract": {
                        "enable": false,
                        "rotateX": 600,
                        "rotateY": 1200
                    }
                }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": {
                        "enable": false
                    },
                    "onclick": {
                        "enable": false
                    },
                    "resize": true
                }
            },
            "retina_detect": true
        });
    } else {
        console.warn("particles.js library not loaded.");
    }
}

/**
 * Sets up the Intersection Observer for scroll reveal animations.
 * @param {Array<HTMLElement>} elementsToObserve - Array of DOM elements to observe.
 */
function setupScrollReveal(elementsToObserve) {
    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% of the element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Stop observing once revealed
            }
        });
    }, observerOptions);

    elementsToObserve.forEach(el => {
        if (el) {
            observer.observe(el);
        }
    });
}

/**
 * ==========================================================================
 * 2. Cinematic Background Effects (Rain & Lightning)
 * ==========================================================================
 */

// --- Rain Initialization ---
function initializeRain(container) {
    const numberOfDrops = 100;
    const screenWidth = window.innerWidth;
    
    for (let i = 0; i < numberOfDrops; i++) {
        const drop = document.createElement('div');
        drop.classList.add('raindrop');
        
        // Random horizontal position
        const left = Math.random() * screenWidth;
        // Random start delay for staggered effect
        const delay = Math.random() * 10; 
        // Random duration for varied speed (though CSS handles base speed)
        const duration = 0.5 + Math.random() * 0.5; 

        drop.style.left = `${left}px`;
        drop.style.animationDuration = `${duration}s`;
        drop.style.animationDelay = `-${delay}s`; // Start in the past to fill screen immediately
        
        container.appendChild(drop);
    }
}

// --- Lightning Trigger ---
function setupLightning(flashElement) {

    setInterval(() => {

        if (Math.random() > 0.65) {

            flashElement.classList.add("active");

            setTimeout(() => {
                flashElement.classList.remove("active");
            }, 120);

            setTimeout(() => {

                flashElement.classList.add("active");

                setTimeout(() => {
                    flashElement.classList.remove("active");
                }, 90);

            }, 180);

        }

    }, 5000);

}


/**
 * ==========================================================================
 * 3. Link Card Enhancements (Magnetic Hover & Ripple)
 * ==========================================================================
 */
function setupMagneticHover(linkCards) {
    linkCards.forEach(card => {
        let cardRect = card.getBoundingClientRect();
        
        const handleMouseMove = (e) => {
            // Recalculate rect on every move in case of scroll/resize
            cardRect = card.getBoundingClientRect();
            
            const centerX = cardRect.left + cardRect.width / 2;
            const centerY = cardRect.top + cardRect.height / 2;
            
            const dx = e.clientX - centerX;
            const dy = e.clientY - centerY;
            
            const distance = Math.sqrt(dx * dx + dy * dy);
            const strength = 12; // Increased strength for better feel
            const maxDistance = 80; // Affect radius

            if (distance < maxDistance) {
                // Calculate translation: move card slightly towards the mouse (magnetic pull)
                const moveX = (dx / distance) * strength * (1 - distance / maxDistance);
                const moveY = (dy / distance) * strength * (1 - distance / maxDistance);
                
                // Apply translation, but preserve scale/shadow from CSS hover if active
                card.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.02)`;
            } else {
                // Reset translation if mouse moves too far, but keep CSS hover effects active
                card.style.transform = 'scale(1.02)'; 
            }
        };

        const handleMouseEnter = () => {
            card.addEventListener('mousemove', handleMouseMove);
        };

        const handleMouseLeave = () => {
            // Reset translation when mouse leaves the card area
            card.style.transform = ''; // Let CSS handle scale/border/shadow
            card.removeEventListener('mousemove', handleMouseMove);
            card.removeEventListener('mouseleave', handleMouseEnter); // Remove self listener too
        };

        card.addEventListener('mouseenter', handleMouseEnter);
        card.addEventListener('mouseleave', handleMouseLeave);
    });
}

/**
 * ==========================================================================
 * 4. Ripple Effect Handler (Button Press Animation)
 * ==========================================================================
 */
function setupRippleEffect() {
    const linkCards = document.querySelectorAll('.link-card');

    linkCards.forEach(card => {
        // Handle button press animation (ripple effect)
        card.addEventListener('mousedown', function(e) {
            // 1. Get color from data attribute or default to white
            const rippleColor = this.getAttribute('data-ripple-color') || 'rgba(255, 255, 255, 0.7)';
            
            // 2. Calculate ripple size and position
            const rect = this.getBoundingClientRect();
            const diameter = Math.max(rect.width, rect.height);
            const radius = diameter / 2;

            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // 3. Create and append the ripple element
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            ripple.style.width = ripple.style.height = `${diameter}px`;
            ripple.style.left = `${x - radius}px`;
            ripple.style.top = `${y - radius}px`;
            ripple.style.backgroundColor = rippleColor; // Apply custom color

            this.appendChild(ripple);

            // 4. Clean up the ripple element after animation
            ripple.addEventListener('animationend', () => {
                ripple.remove();
            });
        });
    });
}

/**
 * ==========================================================================
 * 5. Web Swing Animation for Spider Icon
 * ==========================================================================
 */
function setupSpiderSwing(spiderElement) {
    if (!spiderElement) return;
    
    // Inject keyframes for the swing animation into the document head
    const style = document.createElement('style');
    style.id = 'spider-swing-keyframes';
    style.textContent = `
        @keyframes spider-swing {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            25% { transform: translateY(2px) rotate(-5deg); }
            75% { transform: translateY(2px) rotate(5deg); }
        }
    `;
    document.head.appendChild(style);
    
    // Apply the animation
    spiderElement.style.animation = 'spider-swing 4s ease-in-out infinite';
    spiderElement.style.transformOrigin = 'center top'; // Swing from the top attachment point
    spiderElement.style.position = 'relative'; // Ensure transform context is correct within footer
    spiderElement.style.display = 'inline-block';
}

// --- End of Script ---