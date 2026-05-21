(function(){
  // Nav scroll
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 40), {passive:true});

  // Burger
  const burger = document.getElementById('burger');
  const mobileNav = document.getElementById('mobileNav');
  burger.addEventListener('click', () => {
    const open = mobileNav.classList.toggle('open');
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
  });
  mobileNav.querySelectorAll('.mn-link').forEach(l => l.addEventListener('click', () => {
    mobileNav.classList.remove('open'); burger.classList.remove('open');
  }));

  // Smooth scroll with nav offset
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (!t) return;
      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 70;
      window.scrollTo({top: t.getBoundingClientRect().top + window.scrollY - offset, behavior:'smooth'});
    });
  });

  // Reveal on scroll
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const d = parseInt(e.target.dataset.delay || 0);
        setTimeout(() => e.target.classList.add('in'), d);
        io.unobserve(e.target);
      }
    });
  }, {threshold: 0.1, rootMargin: '0px 0px -30px 0px'});
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // Counters
  function counter(el, target, dur=1600) {
    const start = performance.now();
    const step = now => {
      const p = Math.min((now - start) / dur, 1);
      el.textContent = Math.round((1 - Math.pow(1-p, 3)) * target).toLocaleString();
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  const cio = new IntersectionObserver(entries => {
    if (entries.some(e => e.isIntersecting)) {
      document.querySelectorAll('.hstat-n').forEach(el => counter(el, +el.dataset.target));
      cio.disconnect();
    }
  }, {threshold: 0.5});
  const sb = document.querySelector('.hero-stats');
  if (sb) cio.observe(sb);

  // Hero parallax
  const heroImg = document.querySelector('.hero-img');
  if (heroImg) window.addEventListener('scroll', () => {
    if (window.scrollY < window.innerHeight)
      heroImg.style.transform = `translateY(${window.scrollY * 0.2}px)`;
  }, {passive:true});

  // Form
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const ids = ['fname','lname','email','phone','message'];
      const fields = ids.map(id => document.getElementById(id));
      let valid = true;
      fields.forEach(f => { f.style.borderColor = ''; if (!f.value.trim()) { f.style.borderColor = '#ff6b6b'; valid = false; } });
      const em = document.getElementById('email');
      if (em && em.value && !em.value.includes('@')) { em.style.borderColor = '#ff6b6b'; valid = false; }
      const err = document.getElementById('formErr');
      if (!valid) { err.classList.add('show'); setTimeout(() => err.classList.remove('show'), 4000); return; }
      const btn = form.querySelector('button[type=submit]');
      btn.textContent = 'Sending…'; btn.disabled = true;
      setTimeout(() => {
        form.reset(); fields.forEach(f => f.style.borderColor = '');
        btn.textContent = 'Send Message ◆'; btn.disabled = false;
        const ok = document.getElementById('formOk');
        ok.classList.add('show'); setTimeout(() => ok.classList.remove('show'), 6000);
      }, 1200);
    });
    form.querySelectorAll('input,textarea').forEach(el => el.addEventListener('input', () => el.style.borderColor = ''));
  }
})();
