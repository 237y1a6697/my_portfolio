// Beginner-friendly JavaScript for navigation, smooth scrolling and small UI helpers
document.addEventListener('DOMContentLoaded', function(){
  // Update copyright year
  document.getElementById('year').textContent = new Date().getFullYear();

  // Mobile nav toggle
  const navToggle = document.getElementById('nav-toggle');
  const navList = document.getElementById('nav-list');
  navToggle && navToggle.addEventListener('click', function(){
    // Toggle visibility for mobile nav
    const isOpen = navList.style.display === 'flex';
    navList.style.display = isOpen ? 'none' : 'flex';
  });

  // Smooth scrolling for internal links
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e){
      const targetId = this.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if(target){
        e.preventDefault();
        // close mobile nav when navigating
        if(window.innerWidth <= 900) navList.style.display = 'none';
        // Smooth scroll
        target.scrollIntoView({behavior:'smooth', block:'start'});
      }
    });
  });

  // Simple reveal-on-scroll: add 'reveal' class when element is visible
  const revealElements = document.querySelectorAll('.card, .skill, .hero-text, .hero-card');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('reveal');
      }
    });
  }, {threshold: 0.12});
  revealElements.forEach(el => revealObserver.observe(el));

});

/* Notes for beginners:
 - This file uses only modern, plain JS APIs.
 - `scrollIntoView` provides smooth scrolling without a library.
 - `IntersectionObserver` is used for lightweight scroll reveals.
*/
