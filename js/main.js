/* ================================================================
   main.js — landing page interactions
   ================================================================

   SECTIONS
   ────────
   1. Elements
   2. Menu open / close helpers
   3. Scroll-wheel trigger
   4. Touch-swipe trigger
   5. Cursor-parallax (name lines follow the mouse)
   6. Hover state tracking (circle menu)
   7. Animation loop — arc morphing + .ritos growth + cursor track

================================================================ */

'use strict';

/* ──────────────────────────────────────────────────────────────
   1. ELEMENTS
────────────────────────────────────────────────────────────── */
const circleMenu  = document.getElementById('circleMenu');
const blurOverlay = document.getElementById('blurOverlay');
const nameLine1   = document.getElementById('nameLine1');
const nameLine2   = document.getElementById('nameLine2');

const landingVideo = document.querySelector('.video-wrapper video');
if (landingVideo) landingVideo.playbackRate = 0.65;

const PARALLAX_LINES = [
  nameLine1 && { el: nameLine1, strength: 0.025 },
  nameLine2 && { el: nameLine2, strength: 0.016 },
].filter(Boolean);

const ringPath   = circleMenu && circleMenu.querySelector('.circle-ring path');
const topLabel   = circleMenu && circleMenu.querySelector('.menu-top');
const rightLabel = circleMenu && circleMenu.querySelector('.menu-right');
const botLabel   = circleMenu && circleMenu.querySelector('.menu-bottom');
const leftLabel  = circleMenu && circleMenu.querySelector('.menu-left');


/* ──────────────────────────────────────────────────────────────
   2. MENU HELPERS
────────────────────────────────────────────────────────────── */
let menuOpen = false;

function openMenu() {
  menuOpen = true;
  circleMenu.classList.add('active');
  blurOverlay.classList.add('active');
}

function closeMenu() {
  menuOpen = false;
  for (const k in labelTargets) labelTargets[k] = 0;
  circleMenu.classList.remove('active');
  blurOverlay.classList.remove('active');
}

blurOverlay.addEventListener('click', closeMenu);


/* ──────────────────────────────────────────────────────────────
   3 & 4. MENU TRIGGER — scroll on scroll-nav pages, header
   click on all others.
────────────────────────────────────────────────────────────── */
const isScrollNav = document.body.dataset.menu === 'scroll';

if (isScrollNav) {
  /* Scroll-wheel trigger */
  window.addEventListener('wheel', (e) => {
    if (e.deltaY > 0 && !menuOpen) openMenu();
    if (e.deltaY < 0 &&  menuOpen) closeMenu();
  }, { passive: true });

  /* Touch-swipe trigger */
  let _touchStartY = 0;
  window.addEventListener('touchstart', (e) => {
    _touchStartY = e.touches[0].clientY;
  }, { passive: true });
  window.addEventListener('touchend', (e) => {
    const delta = _touchStartY - e.changedTouches[0].clientY;
    if (Math.abs(delta) > 50) {
      if (!menuOpen) openMenu(); else closeMenu();
    }
  }, { passive: true });

} else {
  /* Inject a fixed header that toggles the menu on click */
  const siteHeader = document.createElement('div');
  siteHeader.id        = 'siteHeader';
  siteHeader.className = 'site-header';
  siteHeader.textContent = 'ritos.space';
  document.body.appendChild(siteHeader);

  siteHeader.addEventListener('click', () => {
    if (menuOpen) closeMenu(); else openMenu();
  });
}


/* ──────────────────────────────────────────────────────────────
   5. CURSOR PARALLAX (name lines)
────────────────────────────────────────────────────────────── */
const RADIUS = 500;

function elementCenter(el) {
  const r = el.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}

window.addEventListener('mousemove', (e) => {
  if (menuOpen) return;

  PARALLAX_LINES.forEach(({ el, strength }) => {
    const center = elementCenter(el);
    const dx     = e.clientX - center.x;
    const dy     = e.clientY - center.y;
    const dist   = Math.hypot(dx, dy);
    if (dist < RADIUS) {
      const t = (1 - dist / RADIUS) * strength;
      el.style.transform = `translate(${(dx * t).toFixed(2)}px, ${(dy * t).toFixed(2)}px)`;
    } else {
      el.style.transform = 'translate(0, 0)';
    }
  });
});


/* ──────────────────────────────────────────────────────────────
   6. HOVER STATE — per-label only
────────────────────────────────────────────────────────────── */

/* per-label hover targets (0 = resting, 1 = hovered) */
const labelTargets = { top: 0, right: 0, bot: 0, left: 0 };
const labelProgress = { top: 0, right: 0, bot: 0, left: 0 };

[
  [topLabel,   'top'],
  [rightLabel, 'right'],
  [botLabel,   'bot'],
  [leftLabel,  'left'],
].forEach(([el, key]) => {
  if (!el) return;
  el.addEventListener('mouseenter', () => { labelTargets[key] = 1; });
  el.addEventListener('mouseleave', () => { labelTargets[key] = 0; });
});


/* ──────────────────────────────────────────────────────────────
   7. ANIMATION LOOP
   Circle geometry: r=130, center=(135,135).
   topOff  = horizontal half-gap width at top & bottom.
   lrOff   = vertical   half-gap height at left & right.
   On hover: gaps widen, nav labels grow & track cursor. .ritos is static.
────────────────────────────────────────────────────────────── */
const R = 130, CX = 135, CY = 135;

function menuTick() {
  /* ── lerp each label's progress independently ── */
  for (const k in labelProgress) {
    labelProgress[k] += (labelTargets[k] - labelProgress[k]) * 0.1;
  }

  if (ringPath) {
    /* each gap has its own offset driven by its label's progress */
    const topOff  = 35 + labelProgress.top   * 30; // top gap:   35 → 65
    const botOff  = 35 + labelProgress.bot   * 30; // bottom gap: 35 → 65
    const rightOff = 16 + labelProgress.right * 14; // right gap: 16 → 30
    const leftOff  = 16 + labelProgress.left  * 14; // left gap:  16 → 30

    const topY    = CY - Math.sqrt(R * R - topOff   * topOff);
    const botY    = CY + Math.sqrt(R * R - botOff   * botOff);
    const rightX  = CX + Math.sqrt(R * R - rightOff * rightOff);
    const leftX   = CX - Math.sqrt(R * R - leftOff  * leftOff);
    const f = v => v.toFixed(1);

    /* each arc spans between two adjacent gap endpoints */
    ringPath.setAttribute('d', [
      `M ${f(CX + topOff)}  ${f(topY)}  A ${R} ${R} 0 0 1 ${f(rightX)} ${f(CY - rightOff)}`,
      `M ${f(rightX)} ${f(CY + rightOff)} A ${R} ${R} 0 0 1 ${f(CX + botOff)}  ${f(botY)}`,
      `M ${f(CX - botOff)}  ${f(botY)}  A ${R} ${R} 0 0 1 ${f(leftX)}  ${f(CY + leftOff)}`,
      `M ${f(leftX)}  ${f(CY - leftOff)}  A ${R} ${R} 0 0 1 ${f(CX - topOff)}  ${f(topY)}`,
    ].join(' '));

    /* scale label positions from SVG viewBox coords (270px) to container pixels */
    const menuSize = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--menu-size')) || 270;
    const s = menuSize / 270;

    if (topLabel) {
      topLabel.style.top      = (topY  * s) + 'px';
      topLabel.style.fontSize = (13 + labelProgress.top   * 9) + 'px';
    }
    if (botLabel) {
      botLabel.style.top      = (botY  * s) + 'px';
      botLabel.style.fontSize = (13 + labelProgress.bot   * 9) + 'px';
    }
    if (rightLabel) {
      rightLabel.style.left     = (rightX * s) + 'px';
      rightLabel.style.fontSize = (13 + labelProgress.right * 9) + 'px';
    }
    if (leftLabel) {
      leftLabel.style.left      = (leftX  * s) + 'px';
      leftLabel.style.fontSize  = (13 + labelProgress.left  * 9) + 'px';
    }
  }

  requestAnimationFrame(menuTick);
}

requestAnimationFrame(menuTick);
