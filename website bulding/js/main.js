// main.js - handles mobile nav toggle, focus trap, smooth scroll, and header background
(function () {
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('main-nav');
  const announcer = document.getElementById('nav-announcer');
  const overlay = document.getElementById('page-overlay');
  const header = document.querySelector('header');
  if (!navToggle || !nav) return;

  navToggle.setAttribute('aria-controls', 'main-nav');

  function openNav() {
    nav.classList.add('open');
    navToggle.classList.add('open');
    nav.setAttribute('aria-hidden', 'false');
    navToggle.setAttribute('aria-expanded', 'true');
    // update accessible label
    navToggle.setAttribute('aria-label', 'Close navigation');
    if (overlay) {
      overlay.classList.add('open');
      overlay.setAttribute('aria-hidden', 'false');
    }
    // prevent background scrolling
    document.body.classList.add('no-scroll');
    // focus first focusable in nav
    const focusable = getFocusableElements();
    if (focusable.length) focusable[0].focus();
    if (announcer) {
      announcer.textContent = 'Navigation menu opened';
      // clear after a moment to avoid repeated verbosity
      setTimeout(() => { announcer.textContent = ''; }, 2000);
    }
    document.body.addEventListener('click', onBodyClick);
  }

  function closeNav() {
    nav.classList.remove('open');
    navToggle.classList.remove('open');
    nav.setAttribute('aria-hidden', 'true');
    navToggle.setAttribute('aria-expanded', 'false');
    // restore accessible label
    navToggle.setAttribute('aria-label', 'Open navigation');
    navToggle.focus();
    if (overlay) {
      overlay.classList.remove('open');
      overlay.setAttribute('aria-hidden', 'true');
    }
    // restore scroll
    document.body.classList.remove('no-scroll');
    if (announcer) {
      announcer.textContent = 'Navigation menu closed';
      setTimeout(() => { announcer.textContent = ''; }, 1200);
    }
    document.body.removeEventListener('click', onBodyClick);
  }

  function toggleNav() {
    if (nav.classList.contains('open')) closeNav(); else openNav();
  }

  navToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleNav();
  });

  // Close when clicking outside the nav while open
  function onBodyClick(e) {
    if (!nav.contains(e.target) && !navToggle.contains(e.target)) closeNav();
  }

  // close when clicking the overlay specifically
  if (overlay) overlay.addEventListener('click', (e) => { closeNav(); });

  // Smooth scrolling for anchor links and close nav on selection
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        window.scrollTo({ top: targetElement.offsetTop - 80, behavior: 'smooth' });
      }
      if (nav.classList.contains('open')) closeNav();
    });
  });

  // Header background on scroll
  window.addEventListener('scroll', function () {
    if (!header) return;
    if (window.scrollY > 100) header.style.backgroundColor = 'rgba(10, 25, 49, 0.95)';
    else header.style.backgroundColor = 'rgba(10, 25, 49, 0.9)';
  });

  // Focus trap implementation when nav is open
  function getFocusableElements() {
    return Array.from(nav.querySelectorAll('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'))
      .filter(el => !el.hasAttribute('disabled'));
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('open')) {
      closeNav();
      return;
    }
    if (e.key === 'Tab' && nav.classList.contains('open')) {
      const focusable = getFocusableElements();
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
  });

  // Close nav if window resized beyond mobile breakpoint
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && nav.classList.contains('open')) {
      closeNav();
    }
  });

  // Remove modal logic and make CTA buttons redirect
  const payBtns = document.querySelectorAll('.pay-btn');
  payBtns.forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const plan = btn.getAttribute('data-plan');
      window.location.href = `payment.html?plan=${encodeURIComponent(plan)}`;
    });
  });
})();
