const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.nav-list');

if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const isOpen = nav.dataset.open === 'true';
    nav.dataset.open = String(!isOpen);
    toggle.setAttribute('aria-expanded', String(!isOpen));
  });
}

const documentChoices = document.querySelectorAll('[data-document-choice]');
const documentPreview = document.querySelector('[data-document-preview]');
const documentOpen = document.querySelector('[data-document-open]');
const documentDownload = document.querySelector('[data-document-download]');

if (documentChoices.length && documentPreview && documentOpen && documentDownload) {
  const documents = {
    resume: {
      label: 'résumé',
      url: '/assets/cv/Michael-Dirksen-Resume.pdf',
      filename: 'Michael-Dirksen-Resume.pdf',
    },
    cv: {
      label: 'CV',
      url: '/assets/cv/Michael-Dirksen-CV.pdf',
      filename: 'Michael-Dirksen-CV.pdf',
    },
  };

  documentChoices.forEach((choice) => {
    choice.addEventListener('click', () => {
      const selected = documents[choice.dataset.documentChoice];
      if (!selected) return;
      documentChoices.forEach((button) => {
        button.setAttribute('aria-pressed', String(button === choice));
      });
      documentPreview.src = selected.url;
      documentPreview.title = `Michael Dirksen ${selected.label} PDF`;
      documentOpen.href = selected.url;
      documentOpen.textContent = `Open ${selected.label} PDF`;
      documentDownload.href = selected.url;
      documentDownload.download = selected.filename;
      documentDownload.textContent = `Download ${selected.label}`;
    });
  });
}

const filters = document.querySelector('[data-library-filters]');
if (filters) {
  const items = [...document.querySelectorAll('[data-library-item]')];
  const count = document.querySelector('[data-result-count]');
  const empty = document.querySelector('.empty-state');
  const applyFilters = () => {
    const query = filters.querySelector('[name="query"]').value.trim().toLowerCase();
    const type = filters.querySelector('[name="type"]').value;
    const topic = filters.querySelector('[name="topic"]').value;
    let visible = 0;
    items.forEach((item) => {
      const matches = (!query || item.textContent.toLowerCase().includes(query)) &&
        (!type || item.dataset.type === type) && (!topic || item.dataset.topics.includes(topic));
      item.hidden = !matches;
      if (matches) visible += 1;
    });
    count.textContent = `${visible} item${visible === 1 ? '' : 's'}`;
    empty.style.display = visible ? 'none' : 'block';
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (type) params.set('type', type);
    if (topic) params.set('topic', topic);
    history.replaceState(null, '', `${location.pathname}${params.size ? `?${params}` : ''}`);
  };
  filters.addEventListener('input', applyFilters);
  filters.querySelector('button').addEventListener('click', () => {
    filters.reset();
    applyFilters();
  });
  const params = new URLSearchParams(location.search);
  filters.querySelector('[name="query"]').value = params.get('q') || '';
  filters.querySelector('[name="type"]').value = params.get('type') || '';
  filters.querySelector('[name="topic"]').value = params.get('topic') || '';
  applyFilters();
}

const themeToggle = document.querySelector('[data-theme-toggle]');
if (themeToggle) {
  const root = document.documentElement;
  const readStored = () => {
    try { return localStorage.getItem('theme'); } catch (e) { return null; }
  };
  const settle = () => {
    themeToggle.setAttribute(
      'aria-label',
      root.dataset.theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'
    );
    document.dispatchEvent(new CustomEvent('themechange'));
  };
  themeToggle.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('theme', root.dataset.theme); } catch (e) { /* private mode */ }
    settle();
  });
  // Track the OS setting only until the reader picks a side.
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
    if (readStored()) return;
    root.dataset.theme = event.matches ? 'dark' : 'light';
    settle();
  });
  settle();
}

const revealables = document.querySelectorAll('[data-reveal]');
if (revealables.length) {
  if (!('IntersectionObserver' in window)) {
    revealables.forEach((el) => el.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.04 });
    revealables.forEach((el) => revealObserver.observe(el));
  }
}

const progress = document.querySelector('.scroll-progress');
if (progress) {
  let ticking = false;
  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
  };
  const schedule = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { update(); ticking = false; });
  };
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  update();
}

const spySections = [...document.querySelectorAll('[data-nav]')];
if (spySections.length && 'IntersectionObserver' in window) {
  const navList = document.querySelector('.nav-list');
  const navLinks = new Map();
  document.querySelectorAll('.nav-list a').forEach((a) => navLinks.set(a.getAttribute('href'), a));
  const onScreen = new Set();
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) onScreen.add(entry.target);
      else onScreen.delete(entry.target);
    });
    // Document order, so the first match is the topmost section in the band.
    const active = spySections.find((section) => onScreen.has(section));
    navLinks.forEach((link) => { delete link.dataset.active; });
    if (active) {
      const link = navLinks.get(active.dataset.nav);
      if (link) link.dataset.active = 'true';
    }
    // Suppress the static current-page underline once a section takes over.
    if (navList) navList.dataset.scrolled = String(Boolean(active) && active.dataset.nav !== '/');
  }, { rootMargin: '-45% 0px -45% 0px' });
  spySections.forEach((section) => spy.observe(section));
}

const dotField = document.querySelector('.dot-field');
if (dotField && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const ctx = dotField.getContext('2d');
  const root = document.documentElement;
  const SPACING = 26;
  const REACH = 150;
  let w = 0;
  let h = 0;
  let cols = 0;
  let rows = 0;
  let px = -9999;
  let py = -9999;
  let queued = false;

  // The phoenix scrolls with the hero but the canvas is fixed, so its rect is
  // re-read each frame rather than cached.
  const watermark = document.querySelector('.hero-watermark');
  const clearing = () => {
    if (!watermark) return null;
    const r = watermark.getBoundingClientRect();
    if (r.bottom < 0 || r.top > h) return null;
    return { cx: r.left + r.width / 2, cy: r.top + r.height / 2, rx: r.width / 2, ry: r.height / 2 };
  };

  const draw = () => {
    ctx.clearRect(0, 0, w, h);
    if (root.dataset.theme !== 'dark') return;
    const hole = clearing();
    for (let i = 0; i < cols; i += 1) {
      for (let j = 0; j < rows; j += 1) {
        const x = i * SPACING;
        const y = j * SPACING;
        let alpha = 0.085;
        const d = Math.hypot(x - px, y - py);
        if (d < REACH) alpha += (1 - d / REACH) * 0.5;
        if (hole) {
          // Fade to nothing inside the bird so it reads against empty space.
          const e = Math.hypot((x - hole.cx) / hole.rx, (y - hole.cy) / hole.ry);
          if (e < 1) alpha *= Math.max(0, (e - 0.5) / 0.5);
        }
        if (alpha < 0.006) continue;
        ctx.globalAlpha = Math.min(alpha, 1);
        ctx.beginPath();
        ctx.arc(x, y, 1.1, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  };

  const schedule = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { draw(); queued = false; });
  };

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    dotField.width = Math.floor(w * dpr);
    dotField.height = Math.floor(h * dpr);
    // Resizing the canvas resets all context state, so restore it here.
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = getComputedStyle(root).getPropertyValue('--ink').trim() || '#ffffff';
    cols = Math.ceil(w / SPACING) + 1;
    rows = Math.ceil(h / SPACING) + 1;
    draw();
  };

  window.addEventListener('pointermove', (event) => {
    px = event.clientX;
    py = event.clientY;
    schedule();
  }, { passive: true });
  window.addEventListener('pointerleave', () => { px = -9999; py = -9999; schedule(); });
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', resize);
  document.addEventListener('themechange', resize);
  resize();
}

const cursorDot = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');
if (cursorDot && cursorRing
    && window.matchMedia('(pointer: fine)').matches
    && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  // Only now is it safe to hide the native cursor.
  document.documentElement.classList.add('cursor-custom');

  let tx = -100;
  let ty = -100;
  let rx = -100;
  let ry = -100;
  let raf = null;

  const trail = () => {
    rx += (tx - rx) * 0.2;
    ry += (ty - ry) * 0.2;
    cursorRing.style.setProperty('--rx', `${rx.toFixed(1)}px`);
    cursorRing.style.setProperty('--ry', `${ry.toFixed(1)}px`);
    raf = Math.abs(tx - rx) + Math.abs(ty - ry) > 0.4 ? requestAnimationFrame(trail) : null;
  };

  window.addEventListener('pointermove', (event) => {
    tx = event.clientX;
    ty = event.clientY;
    // The dot is exact — no easing — so a click lands where the dot is drawn.
    cursorDot.style.setProperty('--dx', `${tx}px`);
    cursorDot.style.setProperty('--dy', `${ty}px`);
    if (!raf) raf = requestAnimationFrame(trail);
  }, { passive: true });

  document.addEventListener('pointerover', (event) => {
    const el = event.target;
    const interactive = el instanceof Element && el.closest('a, button, input, select, textarea');
    cursorRing.dataset.over = String(Boolean(interactive));
  }, { passive: true });

  // Don't leave a stray dot parked on the page when the pointer exits.
  const show = (visible) => {
    const v = visible ? '' : '0';
    cursorDot.style.opacity = v;
    cursorRing.style.opacity = v;
  };
  document.addEventListener('mouseleave', () => show(false));
  document.addEventListener('mouseenter', () => show(true));
}
