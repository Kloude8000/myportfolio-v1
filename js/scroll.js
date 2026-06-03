/* ============================
   SCROLL.JS - Smooth Scrolling & Active Link Tracking
   ============================ */

// Smooth scrolling for navigation links
const scrollLinks = document.querySelectorAll('.nav-links a[href^="#"], .btn[href^="#"]');

scrollLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');

    // Only handle anchor links
    if (href === '#' || !href.startsWith('#')) {
      return;
    }

    e.preventDefault();

    const targetElement = document.querySelector(href);

    if (targetElement) {
      // Get navbar height for offset
      const navBar = document.querySelector('.navbar');
      const navHeight = navBar ? navBar.offsetHeight : 70;

      // Calculate scroll position
      const targetPosition = targetElement.offsetTop - navHeight;

      // Smooth scroll
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// Active Link Highlighting on Scroll
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a[href^="#"]');

function updateActiveLink() {
  let currentSection = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    const navBar = document.querySelector('.navbar');
    const navHeight = navBar ? navBar.offsetHeight : 70;

    if (window.scrollY >= sectionTop - navHeight) {
      currentSection = section.getAttribute('id');
    }
  });

  // Update active states
  navItems.forEach(item => {
    item.classList.remove('active');

    if (item.getAttribute('href') === `#${currentSection}`) {
      item.classList.add('active');
    }
  });
}

// Debounce scroll listener for better performance
let scrollTimeout;
window.addEventListener('scroll', () => {
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(updateActiveLink, 50);
});

// Initial call
updateActiveLink();
