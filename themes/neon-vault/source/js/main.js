/**
 * NEON VAULT — Main JavaScript
 * Custom cursor, preloader, scroll reveals, mobile nav, theme toggle
 */

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initCustomCursor();
  initMobileNav();
  initThemeToggle();
  initScrollReveal();
});

/* ---- Preloader ---- */
function initPreloader() {
  const preloader = document.querySelector('.preloader');
  if (!preloader) return;
  setTimeout(() => {
    preloader.classList.add('hidden');
    setTimeout(() => preloader.remove(), 600);
  }, 1500);
}

/* ---- Custom Cursor ---- */
function initCustomCursor() {
  if (window.innerWidth < 768) return;

  const cursor = document.querySelector('.cursor');
  const follower = document.querySelector('.cursor-follower');
  if (!cursor || !follower) return;

  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Hover effect on links and buttons
  const hoverTargets = document.querySelectorAll('a, button, .post-card, .category-card, .tag-bubble, input, textarea');
  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('active');
      follower.classList.add('active');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('active');
      follower.classList.remove('active');
    });
  });

  // Click effect
  document.addEventListener('mousedown', () => cursor.classList.add('click'));
  document.addEventListener('mouseup', () => cursor.classList.remove('click'));

  function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.4;
    cursorY += (mouseY - cursorY) * 0.4;
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;

    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    follower.style.left = followerX + 'px';
    follower.style.top = followerY + 'px';

    requestAnimationFrame(animateCursor);
  }

  animateCursor();
}

/* ---- Mobile Navigation ---- */
function initMobileNav() {
  const toggle = document.getElementById('mobile-toggle');
  const nav = document.getElementById('mobile-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    nav.classList.toggle('active');
    const spans = toggle.querySelectorAll('span');
    if (nav.classList.contains('active')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  });
}

/* ---- Theme Toggle ---- */
function initThemeToggle() {
  const toggle = document.getElementById('theme-toggle');
  if (!toggle) return;

  const sunIcon = toggle.querySelector('.sun-icon');
  const moonIcon = toggle.querySelector('.moon-icon');

  toggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('light-theme');
    const isLight = document.documentElement.classList.contains('light-theme');
    sunIcon.style.display = isLight ? 'none' : 'block';
    moonIcon.style.display = isLight ? 'block' : 'none';
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
  });

  // Load saved theme
  const saved = localStorage.getItem('theme');
  if (saved === 'light') {
    document.documentElement.classList.add('light-theme');
    sunIcon.style.display = 'none';
    moonIcon.style.display = 'block';
  }
}

/* ---- Scroll Reveal Animation ---- */
function initScrollReveal() {
  const revealElements = document.querySelectorAll(
    '.post-card, .category-card, .timeline-item, .sidebar-card'
  );

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
}

/* ---- Glitch on hover for glitch-text elements ---- */
document.addEventListener('mouseover', (e) => {
  const glitch = e.target.closest('.glitch-text');
  if (glitch && !glitch.dataset.glitching) {
    glitch.dataset.glitching = 'true';
    glitch.style.animation = 'none';
    glitch.offsetHeight;
    glitch.style.animation = '';
    setTimeout(() => delete glitch.dataset.glitching, 200);
  }
});
