'use strict';

const ORBS = [
  // ── 1st year (1) ─────────────────────────────────────────
  { name: 'fashion',        year: 1, url: 'projects/fashion.html',        x: 13, y: 14, size: 200, dimOp: 0.24 },

  // ── 2nd year (8) ─────────────────────────────────────────
  { name: 'flatware',       year: 2, url: 'projects/flatware.html',       x: 28, y: 22, size: 220, dimOp: 0.25 },
  { name: 'shelf',          year: 2, url: 'projects/shelf.html',          x: 69, y: 38, size: 205, dimOp: 0.22 },
  { name: 'dispenser',      year: 2, url: 'projects/dispenser.html',      x: 20, y: 50, size: 215, dimOp: 0.24 },
  { name: 'timer',          year: 2, url: 'projects/timer.html',          x: 83, y: 52, size: 195, dimOp: 0.26 },
  { name: 'knife',          year: 2, url: 'projects/knife.html',          x: 46, y: 32, size: 230, dimOp: 0.21 },
  { name: 'design drawing', year: 2, url: 'projects/design-drawing.html', x: 91, y: 13, size: 190, dimOp: 0.25 },
  { name: 'CAD',            year: 2, url: 'projects/cad.html',            x: 56, y: 10, size: 210, dimOp: 0.22 },
  { name: 'bus app',        year: 2, url: 'projects/bus-app.html',        x: 80, y: 20, size: 200, dimOp: 0.26 },

  // ── 3rd year (9) ─────────────────────────────────────────
  { name: 'mutto',          year: 3, url: 'projects/mutto.html',          x: 36, y: 13, size: 208, dimOp: 0.23 },
  { name: 'chair',          year: 3, url: 'projects/chair.html',          x: 61, y: 55, size: 218, dimOp: 0.25 },
  { name: 'calculator',     year: 3, url: 'projects/calculator.html',     x: 10, y: 30, size: 200, dimOp: 0.22 },
  { name: 'booth',          year: 3, url: 'projects/booth.html',          x: 76, y: 14, size: 212, dimOp: 0.24 },
  { name: 'train',          year: 3, url: 'projects/train.html',          x: 53, y: 44, size: 198, dimOp: 0.26 },
  { name: 'dragon',         year: 3, url: 'projects/dragon.html',         x: 38, y: 54, size: 205, dimOp: 0.23 },
  { name: 'exhibition',     year: 3, url: 'projects/exhibition.html',     x: 22, y: 60, size: 215, dimOp: 0.21 },
  { name: 'flux stove',     year: 3, url: 'projects/flux-stove.html',     x: 68, y: 62, size: 210, dimOp: 0.23 },
  { name: 'mask',           year: 3, url: 'projects/mask.html',           x: 86, y: 38, size: 200, dimOp: 0.25 },

  // ── 4th year (2) ─────────────────────────────────────────
  { name: 'app',            year: 4, url: 'projects/app.html',            x: 45, y: 20, size: 208, dimOp: 0.24 },
  { name: 'magazine',       year: 4, url: 'projects/magazine.html',       x: 30, y: 40, size: 222, dimOp: 0.22 },
];

/* ── Physics constants ───────────────────────────────────────── */
const SPEED_MAX  = 0.55;  /* px / frame */
const MIN_SPEED  = 0.18;
const WANDER     = 0.035; /* random steering per frame */
const B_MARGIN   = 120;   /* px from wall where repulsion starts */
const B_FORCE    = 0.06;

/* ── State ───────────────────────────────────────────────────── */
let currentTab  = 1;
let isSnapping  = false;
const orbEls    = [];
const slotEls   = [];
const orbStates = []; /* { x, y, vx, vy } in screen px */

/* ── Build DOM ───────────────────────────────────────────────── */
function buildOrbs() {
  const canvas = document.getElementById('orbCanvas');
  const W  = window.innerWidth;
  const H  = window.innerHeight;
  const BH = H * 0.75;

  ORBS.forEach((orb, i) => {
    const startX = Math.min(orb.x / 100 * W, W  - orb.size / 2);
    const startY = Math.min(orb.y / 100 * H, BH - orb.size / 2);
    const angle  = Math.random() * Math.PI * 2;

    orbStates.push({
      x:  startX,
      y:  startY,
      vx: Math.cos(angle) * SPEED_MAX * 0.7,
      vy: Math.sin(angle) * SPEED_MAX * 0.7,
    });

    const slot = document.createElement('div');
    slot.className  = 'orb-slot';
    slot.style.left = startX + 'px';
    slot.style.top  = startY + 'px';

    const disc = document.createElement('div');
    disc.className = 'orb';
    disc.dataset.index = i;
    disc.style.setProperty('--size',   orb.size + 'px');
    disc.style.setProperty('--dim-op', orb.dimOp);

    const label = document.createElement('span');
    label.className   = 'orb-label';
    label.textContent = orb.name;
    disc.appendChild(label);

    disc.addEventListener('mouseenter', () => {
      if (orb.year !== currentTab) disc.classList.add('dim-hover');
    });
    disc.addEventListener('mouseleave', () => disc.classList.remove('dim-hover'));
    disc.addEventListener('click', () => { window.location.href = orb.url; });

    slot.appendChild(disc);
    canvas.appendChild(slot);
    orbEls.push(disc);
    slotEls.push(slot);
  });
}

/* ── Wander loop ─────────────────────────────────────────────── */
function wanderTick() {
  if (!isSnapping) {
    const W  = window.innerWidth;
    const BH = window.innerHeight * 0.75;

    orbStates.forEach((s, i) => {
      const r = ORBS[i].size / 2;

      /* random steering */
      s.vx += (Math.random() - 0.5) * WANDER;
      s.vy += (Math.random() - 0.5) * WANDER;

      /* soft boundary repulsion */
      const l = r, r_ = W - r, t = r, b = BH - r;
      if (s.x - l  < B_MARGIN) s.vx += B_FORCE * (1 - (s.x - l)  / B_MARGIN);
      if (r_ - s.x < B_MARGIN) s.vx -= B_FORCE * (1 - (r_ - s.x) / B_MARGIN);
      if (s.y - t  < B_MARGIN) s.vy += B_FORCE * (1 - (s.y - t)  / B_MARGIN);
      if (b  - s.y < B_MARGIN) s.vy -= B_FORCE * (1 - (b  - s.y) / B_MARGIN);

      /* speed cap + floor */
      const spd = Math.hypot(s.vx, s.vy);
      if (spd > SPEED_MAX) {
        s.vx = s.vx / spd * SPEED_MAX;
        s.vy = s.vy / spd * SPEED_MAX;
      } else if (spd < MIN_SPEED && spd > 0) {
        s.vx = s.vx / spd * MIN_SPEED;
        s.vy = s.vy / spd * MIN_SPEED;
      }

      s.x += s.vx;
      s.y += s.vy;

      /* hard clamp */
      s.x = Math.max(r, Math.min(W - r, s.x));
      s.y = Math.max(r, Math.min(BH - r, s.y));

      slotEls[i].style.left = s.x + 'px';
      slotEls[i].style.top  = s.y + 'px';
    });
  }

  requestAnimationFrame(wanderTick);
}

/* ── Tab switching ───────────────────────────────────────────── */
function applyTab(tab) {
  currentTab = tab;
  orbEls.forEach((disc, i) => {
    disc.classList.toggle('bright', ORBS[i].year === tab);
    disc.classList.remove('dim-hover');
  });
}

document.querySelectorAll('.tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    applyTab(Number(btn.dataset.tab));
  });
});

/* ── Grid snap ───────────────────────────────────────────────── */
function getGridPositions(n) {
  const W  = window.innerWidth;
  const BH = window.innerHeight * 0.75;
  const cols = 5;
  const rows = Math.ceil(n / cols);
  const xS = W  * 0.12, xE = W  * 0.88;
  const yS = BH * 0.10, yE = BH * 0.85;
  return Array.from({ length: n }, (_, i) => ({
    x: xS + (i % cols) * (xE - xS) / (cols - 1),
    y: rows > 1
      ? yS + Math.floor(i / cols) * (yE - yS) / (rows - 1)
      : (yS + yE) / 2,
  }));
}

const gridBtn   = document.getElementById('gridBtn');
const orbCanvas = document.getElementById('orbCanvas');

gridBtn.addEventListener('click', () => {
  if (isSnapping) return;
  isSnapping = true;
  gridBtn.classList.add('locked');
  orbCanvas.classList.add('grid-active');

  const positions = getGridPositions(ORBS.length);
  slotEls.forEach((slot, i) => {
    slot.classList.add('snapping');
    slot.style.left = positions[i].x + 'px';
    slot.style.top  = positions[i].y + 'px';
    orbStates[i].x  = positions[i].x;
    orbStates[i].y  = positions[i].y;
    orbStates[i].vx = (Math.random() - 0.5) * MIN_SPEED;
    orbStates[i].vy = (Math.random() - 0.5) * MIN_SPEED;
  });

  /* 600ms snap transition + 2000ms hold, then release */
  setTimeout(() => {
    orbCanvas.classList.remove('grid-active');
    slotEls.forEach(slot => slot.classList.remove('snapping'));
    gridBtn.classList.remove('locked');
    isSnapping = false;
  }, 2600);
});

/* ── Init ────────────────────────────────────────────────────── */
buildOrbs();
applyTab(1);
requestAnimationFrame(wanderTick);
