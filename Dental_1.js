/* ─────────────────────────────────────────
   LUMINATE DENTAL — Dental_1.js
   Interactions: cursor, nav, reveals,
   counters, form
───────────────────────────────────────── */

(function () {
  'use strict';

  // ── Custom cursor ──────────────────────────
  const cursor = document.getElementById('cursor');
  const trail  = document.getElementById('cursorTrail');

  if (cursor && trail) {
    let mouseX = 0, mouseY = 0;
    let trailX = 0, trailY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = mouseX + 'px';
      cursor.style.top  = mouseY + 'px';
    });

    function animateTrail() {
      trailX += (mouseX - trailX) * 0.12;
      trailY += (mouseY - trailY) * 0.12;
      trail.style.left = trailX + 'px';
      trail.style.top  = trailY + 'px';
      requestAnimationFrame(animateTrail);
    }
    animateTrail();
  }

  // ── Nav scroll state ───────────────────────
  const nav = document.getElementById('nav');
  const onScroll = () => {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ── Mobile burger ──────────────────────────
  const burger     = document.getElementById('navBurger');
  const mobileMenu = document.getElementById('mobileMenu');

  if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('open');
      burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open);
    });

    // Close on link click
    mobileMenu.querySelectorAll('.mobile-link').forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        burger.classList.remove('open');
      });
    });
  }

  // ── Reveal on scroll ──────────────────────
  const reveals = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = parseInt(entry.target.dataset.delay || '0', 10);
          setTimeout(() => {
            entry.target.classList.add('in-view');
          }, delay);
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  reveals.forEach((el) => revealObserver.observe(el));

  // ── Animated counters ─────────────────────
  function animateCounter(el, target, duration = 1800) {
    let start = 0;
    const startTime = performance.now();

    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease out quad
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      el.textContent = current.toLocaleString();
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  const statNums = document.querySelectorAll('.stat-num');
  let countersStarted = false;

  const counterObserver = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting) && !countersStarted) {
        countersStarted = true;
        statNums.forEach((el) => {
          const target = parseInt(el.dataset.target, 10);
          animateCounter(el, target);
        });
      }
    },
    { threshold: 0.5 }
  );

  const statBar = document.querySelector('.hero-stat-bar');
  if (statBar) counterObserver.observe(statBar);


  // ── Smooth anchor scrolling with nav offset ─
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10) || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // ── Contact form ──────────────────────────
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  const errorMsg = document.getElementById('formError');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const fname   = document.getElementById('fname');
      const lname   = document.getElementById('lname');
      const email   = document.getElementById('email');
      const phone   = document.getElementById('phone');
      const message = document.getElementById('message');

      const fields = [fname, lname, email, phone, message];
      let valid = true;

      fields.forEach((f) => {
        if (!f) return;
        f.style.borderColor = '';
        if (!f.value.trim()) { f.style.borderColor = '#ff6b6b'; valid = false; }
      });

      // Email format check
      if (email && email.value && !email.value.includes('@')) {
        email.style.borderColor = '#ff6b6b';
        valid = false;
      }

      if (!valid) {
        if (errorMsg) { errorMsg.classList.add('show'); setTimeout(() => errorMsg.classList.remove('show'), 4000); }
        const firstBad = fields.find((f) => f && f.style.borderColor === 'rgb(255, 107, 107)');
        if (firstBad) firstBad.focus();
        return;
      }

      const btn = form.querySelector('button[type="submit"]');
      btn.textContent = 'Sending…';
      btn.disabled = true;

      // Simulate async submission (replace with real fetch/formspree)
      setTimeout(() => {
        form.reset();
        fields.forEach((f) => { if (f) f.style.borderColor = ''; });
        btn.textContent = 'Send Message ✦';
        btn.disabled = false;
        if (success) { success.classList.add('show'); setTimeout(() => success.classList.remove('show'), 6000); }
      }, 1200);
    });

    // Clear error highlight on input
    form.querySelectorAll('input, textarea').forEach((el) => {
      el.addEventListener('input', () => { el.style.borderColor = ''; });
    });
  }

  // ── Parallax on hero image ─────────────────
  const heroImg = document.querySelector('.hero-img');
  if (heroImg) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (scrollY < window.innerHeight) {
        heroImg.style.transform = `translateY(${scrollY * 0.25}px)`;
      }
    }, { passive: true });
  }

  // ── Highlight section parallax ─────────────
  const highlightImg = document.querySelector('.highlight-img');
  if (highlightImg) {
    const hlSection = document.querySelector('.highlight');
    const hlObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          window.addEventListener('scroll', onHlScroll, { passive: true });
        } else {
          window.removeEventListener('scroll', onHlScroll);
        }
      },
      { threshold: 0 }
    );
    hlObserver.observe(hlSection);

    function onHlScroll() {
      const rect = hlSection.getBoundingClientRect();
      const mid  = rect.top + rect.height / 2 - window.innerHeight / 2;
      highlightImg.style.transform = `translateY(${mid * 0.15}px)`;
    }
  }

  // ── Service card hover tilt ───────────────
  document.querySelectorAll('.service-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const cx   = rect.left + rect.width / 2;
      const cy   = rect.top  + rect.height / 2;
      const dx   = (e.clientX - cx) / (rect.width  / 2);
      const dy   = (e.clientY - cy) / (rect.height / 2);
      card.style.transform = `perspective(800px) rotateX(${-dy * 3}deg) rotateY(${dx * 3}deg) translateY(-2px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.4s ease, background 0.3s';
    });
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'none';
    });
  });

})();
