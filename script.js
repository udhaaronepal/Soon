/* ==========================================================================
   COMING SOON — SCRIPT
   Vanilla JS, no dependencies.
   1. Scroll-reveal animations (IntersectionObserver)
   2. Live countdown timer
   3. Subtle pointer parallax on background blobs
   4. Footer year
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initCountdown();
  initBlobParallax();
  setFooterYear();
});

/* ---------- 1. Scroll reveal ---------- */
function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;

  // Graceful fallback for browsers without IntersectionObserver support.
  if (!('IntersectionObserver' in window)) {
    revealEls.forEach((el) => el.classList.add('in-view'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          obs.unobserve(entry.target); // reveal once, then stop watching
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  revealEls.forEach((el) => observer.observe(el));
}

/* ---------- 2. Countdown timer ---------- */
function initCountdown() {
  // 🔧 Replace with your real launch date/time (local time, ISO format).
  // const LAUNCH_DATE = new Date('2026-09-05T00:00:00');
  const LAUNCH_DATE = new Date('2027-07-22T12:00:00+05:45');

  const daysEl = document.getElementById('count-days');
  const hoursEl = document.getElementById('count-hours');
  const minsEl = document.getElementById('count-mins');
  const secsEl = document.getElementById('count-secs');

  if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

  // Track previous values so we only touch the DOM (and animate) on change.
  const previous = { d: null, h: null, m: null, s: null };

  function tick() {
    const now = new Date();
    const diff = Math.max(0, LAUNCH_DATE.getTime() - now.getTime());

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);

    updateUnit(daysEl, days, 'd');
    updateUnit(hoursEl, hours, 'h');
    updateUnit(minsEl, mins, 'm');
    updateUnit(secsEl, secs, 's');
  }

  function updateUnit(el, value, key) {
    if (previous[key] === value) return;
    previous[key] = value;
    el.textContent = String(value).padStart(2, '0');

    // Replay the CSS "tick" pulse animation on change.
    el.classList.remove('is-tick');
    void el.offsetWidth; // force reflow so the animation can restart
    el.classList.add('is-tick');
  }

  tick();
  setInterval(tick, 1000);
}

/* ---------- 3. Ambient pointer parallax for background blobs ---------- */
function initBlobParallax() {
  const wraps = document.querySelectorAll('.blob-wrap');
  if (!wraps.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
  if (prefersReducedMotion || !hasFinePointer) return; // skip on touch / reduced-motion devices

  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let animating = false;

  window.addEventListener('mousemove', (e) => {
    targetX = e.clientX / window.innerWidth - 0.5;
    targetY = e.clientY / window.innerHeight - 0.5;

    if (!animating) {
      animating = true;
      requestAnimationFrame(render);
    }
  });

  function render() {
    // Ease toward the pointer target for a smooth, floaty feel.
    currentX += (targetX - currentX) * 0.06;
    currentY += (targetY - currentY) * 0.06;

    wraps.forEach((wrap, i) => {
      const strength = (i + 1) * 12; // each blob drifts by a slightly different amount
      wrap.style.setProperty('--px', `${currentX * strength}px`);
      wrap.style.setProperty('--py', `${currentY * strength}px`);
    });

    if (Math.abs(targetX - currentX) > 0.001 || Math.abs(targetY - currentY) > 0.001) {
      requestAnimationFrame(render);
    } else {
      animating = false;
    }
  }
}

/* ---------- 4. Footer year ---------- */
function setFooterYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
}
