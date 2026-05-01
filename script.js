// Initialize AOS Animation Library
document.addEventListener('DOMContentLoaded', () => {
    AOS.init({
        once: true,
        offset: 50,
        duration: 800,
        easing: 'ease-in-out',
    });
});

// Sticky Navbar
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navItems = document.querySelectorAll('.nav-links a');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    
    // Toggle Icon
    const icon = hamburger.querySelector('i');
    if (navLinks.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
});

// Close mobile menu on link click
navItems.forEach(item => {
    item.addEventListener('click', () => {
        navLinks.classList.remove('active');
        const icon = hamburger.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    });
});

// Typing Effect for Hero Section
const roles = ["Full-Stack Developer", "AI/ML Engineer", "Problem Solver", "Tech Enthusiast"];
const typingText = document.querySelector('.typing-text');
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingDelay = 100;

function typeEffect() {
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
        typingText.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        typingDelay = 50;
    } else {
        typingText.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typingDelay = 100;
    }

    if (!isDeleting && charIndex === currentRole.length) {
        isDeleting = true;
        typingDelay = 2000; // Pause at end of word
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typingDelay = 500; // Pause before new word
    }

    setTimeout(typeEffect, typingDelay);
}

// Start typing effect
if (typingText) {
    setTimeout(typeEffect, 1000);
}

// Contact Form Submit Handler
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const btn = contactForm.querySelector('button');
        const originalText = btn.innerHTML;
        const formData = new FormData(contactForm);
        
        // Show loading state
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        btn.disabled = true;

        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                // Success state
                btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
                btn.style.background = 'linear-gradient(135deg, #00f3ff, #00ff88)';
                contactForm.reset();
            } else {
                throw new Error('Submission failed');
            }
        } catch (error) {
            // Error state
            btn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error!';
            btn.style.background = 'linear-gradient(135deg, #ff4b2b, #ff416c)';
        } finally {
            // Reset button after 3 seconds
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = '';
                btn.disabled = false;
            }, 3000);
        }
    });
}
