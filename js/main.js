/* ============================
   MAIN.JS - Core Functionality
   ============================ */

// Mobile Menu Toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuToggle) {
  mobileMenuToggle.addEventListener('click', () => {
    const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
    mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
    navLinks.setAttribute('aria-expanded', !isExpanded);
  });

  // Close menu when a link is clicked
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenuToggle.setAttribute('aria-expanded', 'false');
      navLinks.setAttribute('aria-expanded', 'false');
    });
  });
}

// Intersection Observer for Scroll Animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe all section elements for fade-in animation
document.querySelectorAll('section').forEach(section => {
  observer.observe(section);
});

// Utility function for adding classes with delay
function addClassWithDelay(element, className, delayMs) {
  setTimeout(() => {
    element.classList.add(className);
  }, delayMs);
}

console.log('Portfolio loaded successfully');
