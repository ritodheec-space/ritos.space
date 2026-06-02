'use strict';

/* ════════════════════════════════════════════════════════════════
   art-3d.js — 3D artwork universe for art.html
   Requires: THREE global from js/three.min.js
════════════════════════════════════════════════════════════════ */

/* ── Artwork list ─────────────────────────────────────────────
   TO ADD A PIECE:
     1. Add the jpg to /images/
     2. Add a new entry below (name, url slug, img path)
     3. Create the matching page in /art/  (copy any existing page)

   TO REMOVE A PIECE:
     Delete its entry here. Atlas + geometry rebuild automatically.

   LOCATION: js/art-3d.js  lines 15 – 33
──────────────────────────────────────────────────────────────*/
var ARTWORKS = [
  { name: 'Balcony',         url: 'art/balcony.html',         img: 'images/artworks/thumbs/Balcony.jpg'         },
  { name: 'Before the show', url: 'art/before-the-show.html', img: 'images/artworks/thumbs/Before the show.jpg' },
  { name: 'Controlled',      url: 'art/controlled.html',      img: 'images/artworks/thumbs/Controlled.jpg'      },
  { name: 'Fallen Angels',   url: 'art/fallen-angels.html',   img: 'images/artworks/thumbs/Fallen Angels.jpg'   },
  { name: 'French Boys',     url: 'art/french-boys.html',     img: 'images/artworks/thumbs/French Boys.jpg'     },
  { name: 'Loot drop',       url: 'art/loot-drop.html',       img: 'images/artworks/thumbs/Loot drop.jpg'       },
  { name: 'Missing you',     url: 'art/missing-you.html',     img: 'images/artworks/thumbs/Missing you.jpg'     },
  { name: 'Morning',         url: 'art/morning.html',         img: 'images/artworks/thumbs/Morning.jpg'         },
  { name: 'My pod',          url: 'art/my-pod.html',          img: 'images/artworks/thumbs/My pod.jpg'          },
  { name: 'Portrait',        url: 'art/portrait.html',        img: 'images/artworks/thumbs/Portrait.jpg'        },
  { name: 'Love seat',       url: 'art/reclined.html',        img: 'images/artworks/thumbs/Reclined.jpg'        },
  { name: 'Recoil',          url: 'art/recoil.html',          img: 'images/artworks/thumbs/Recoil.jpg'          },
  { name: 'Searching',       url: 'art/searching.html',       img: 'images/artworks/thumbs/Searching.jpg'       },
  { name: 'Self Portrait',   url: 'art/self-portrait.html',   img: 'images/artworks/thumbs/Self Portrait.jpg'   },
  { name: 'So what',                    url: 'art/so-what.html',                   img: 'images/artworks/thumbs/So what.jpg'                    },
  { name: 'Aquarium',                   url: 'art/aquarium.html',                  img: 'images/artworks/thumbs/Aquarium.jpg'                   },
  { name: 'DJ',                         url: 'art/dj.html',                        img: 'images/artworks/thumbs/DJ.jpg'                         },
  { name: "Dadai's Painting",           url: 'art/dadais-painting.html',           img: 'images/artworks/thumbs/Dadais Painting.jpg'            },
  { name: "Don't blink",                url: 'art/dont-blink.html',                img: 'images/artworks/thumbs/Dont blink.jpg'                 },
  { name: 'Dreams',                     url: 'art/dreams.html',                    img: 'images/artworks/thumbs/Dreams.jpg'                     },
  { name: 'Girls and their weird pets', url: 'art/girls-and-their-weird-pets.html',img: 'images/artworks/thumbs/Girls and their weird pets.jpg' },
  { name: 'Hypnosis',                   url: 'art/hypnosis.html',                  img: 'images/artworks/thumbs/Hypnosis.jpg'                   },
  { name: 'In her castle',              url: 'art/in-her-castle.html',             img: 'images/artworks/thumbs/In her castle.jpg'              },
  { name: 'In your arms',               url: 'art/in-your-arms.html',              img: 'images/artworks/thumbs/In your arms.jpg'               },
  { name: 'Lunch break',                url: 'art/lunch-break.html',               img: 'images/artworks/thumbs/Lunch break.jpg'                },
  { name: 'Ninja',                      url: 'art/ninja.html',                     img: 'images/artworks/thumbs/Ninja.jpg'                      },
  { name: 'The party',                  url: 'art/the-party.html',                 img: 'images/artworks/thumbs/The party.jpg'                  },
  { name: 'Pearls',                     url: 'art/pearls.html',                    img: 'images/artworks/thumbs/Pearls.jpg'                     },
  { name: 'Rorschach cat',              url: 'art/rorschach-cat.html',             img: 'images/artworks/thumbs/Rorschach cat.jpg'              },
  { name: 'Spongebob',                  url: 'art/spongebob.html',                 img: 'images/artworks/thumbs/Spongebob.jpg'                  },
  { name: 'The old guitarist',          url: 'art/the-old-guitarist.html',         img: 'images/artworks/thumbs/The old guitarist.jpg'          },
  { name: 'Untitled',                   url: 'art/untitled.html',                  img: 'images/artworks/thumbs/Untitled.jpg'                   },
  { name: 'lost a cat',                 url: 'art/lost-a-cat.html',                img: 'images/artworks/thumbs/lost a cat.jpg'                 },
  { name: 'Aquarium of the Bay: 30th Anniversary', url: 'art/aquarium-of-the-bay-30th-anniversary.html', img: 'images/artworks/thumbs/Aquarium of the Bay 30th Anniversary.jpg' },
  { name: 'American dreams',            url: 'art/american-dreams.html',           img: 'images/artworks/thumbs/American dreams.jpg'            },
  { name: 'Shades of blue',             url: 'art/shades-of-blue.html',            img: 'images/artworks/thumbs/Shades of blue.jpg'             },
  { name: 'Your favorite band',         url: 'art/your-favorite-band.html',        img: 'images/artworks/thumbs/Your favorite band.jpg'         },
  { name: '2016',                       url: 'art/2016.html',                      img: 'images/artworks/thumbs/2016.jpg'                       },
  { name: 'Scales',                     url: 'art/scales.html',                    img: 'images/artworks/thumbs/Scales.jpg'                     },
];

var N = ARTWORKS.length;  // 39

/* ── Atlas layout ─────────────────────────────────────────────
   5 columns × 3 rows = 15 cells, one per artwork.
   Each cell is CELL×CELL px; images are cropped to fill a circle.

   CHANGE CELL SIZE: increase for sharper orbs (costs more GPU memory).
   LOCATION: js/art-3d.js  lines 40 – 43
──────────────────────────────────────────────────────────────*/
var COLS = 5, ROWS = 8, CELL = 256;  // 5×8 = 40 cells for 39 artworks
var AW = COLS * CELL;   // 1280 px
var AH = ROWS * CELL;   // 2048 px

/* ── Image preload ────────────────────────────────────────────
   All artwork JPGs are loaded before the scene is built so the
   atlas canvas can draw real photos instead of solid circles.
──────────────────────────────────────────────────────────────*/
var loadedImages = new Array(N).fill(null);
var loadCount    = 0;

ARTWORKS.forEach(function(aw, i) {
  var img   = new Image();
  img.onload = function() {
    loadedImages[i] = img;
    if (++loadCount === N) init();
  };
  img.onerror = function() {
    // Image missing — orb stays white (safe fallback, see buildAtlas)
    if (++loadCount === N) init();
  };
  img.src = aw.img;
});

/* ── Atlas builder ────────────────────────────────────────────
   Draws each artwork photo into its atlas cell, clipped to a
   circle (cover crop — no letterboxing).
   Called inside init() after all images have loaded.
──────────────────────────────────────────────────────────────*/
function buildAtlas() {
  var cvs = document.createElement('canvas');
  cvs.width = AW; cvs.height = AH;
  var ctx = cvs.getContext('2d');

  ARTWORKS.forEach(function(_, ai) {
    var col = ai % COLS, row = Math.floor(ai / COLS);
    var ox  = col * CELL, oy = row * CELL;
    var r   = CELL / 2,  cx = ox + r, cy = oy + r;

    ctx.save();

    // Clip drawing to a circle (gives circular orbs)
    ctx.beginPath();
    ctx.arc(cx, cy, r - 4, 0, Math.PI * 2);
    ctx.clip();

    var img = loadedImages[ai];
    if (img && img.naturalWidth > 0) {
      // Cover-crop: scale image to fill the cell, centred
      var iw    = img.naturalWidth, ih = img.naturalHeight;
      var scale = Math.max(CELL / iw, CELL / ih);
      var dw    = iw * scale, dh = ih * scale;
      ctx.drawImage(img, ox + (CELL - dw) / 2, oy + (CELL - dh) / 2, dw, dh);
    } else {
      // Fallback: white circle if image failed to load
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(ox, oy, CELL, CELL);
    }

    ctx.restore();
  });

  return cvs;
}

/* ── Vertex shader ────────────────────────────────────────────
   Scales gl_PointSize by depth so closer orbs appear larger.
   Hovered artwork scales up slightly.

   CHANGE ORB SCALE: edit the 500.0 multiplier (larger = bigger orbs overall)
   CHANGE MAX SIZE:  edit the 380.0 clamp
   LOCATION: js/art-3d.js  lines 102 – 103
──────────────────────────────────────────────────────────────*/
var VERT = [
  'attribute float size;',
  'attribute float artIdx;',
  'attribute vec4  uvRect;',
  'uniform float   brightnesses[' + N + '];',
  'uniform float   hoverArt;',
  'varying vec4    vRect;',
  'varying float   vBright;',
  'void main() {',
  '  vRect   = uvRect;',
  '  vBright = brightnesses[int(artIdx)];',
  '  float hov = 1.0 - step(0.5, abs(artIdx - hoverArt));',
  '  float sz  = size * (1.0 + hov * 0.18);',
  '  vec4 mv   = modelViewMatrix * vec4(position, 1.0);',
  '  gl_PointSize = clamp(sz * (500.0 / -mv.z), 1.0, 600.0);',
  '  gl_Position  = projectionMatrix * mv;',
  '}'
].join('\n');

/* ── Fragment shader ──────────────────────────────────────────
   Samples the correct atlas cell. Y-flip corrects CanvasTexture's
   default flipY so images aren't upside-down.
──────────────────────────────────────────────────────────────*/
var FRAG = [
  'precision highp float;',
  'uniform sampler2D atlas;',
  'varying vec4  vRect;',
  'varying float vBright;',
  'void main() {',
  '  float u = vRect.x + gl_PointCoord.x * vRect.z;',
  '  float v = 1.0 - vRect.y - gl_PointCoord.y * vRect.w;',
  '  vec4 col = texture2D(atlas, vec2(u, v));',
  '  float vis = mix(0.08, 1.0, vBright);',
  '  gl_FragColor = vec4(col.rgb, col.a * vis);',
  '}'
].join('\n');

/* ── Module-level state (assigned in init, used by tick) ─────*/
var renderer, scene, camera, points, ray;
var orb, velTheta, velPhi, prevTheta, prevPhi;
var phase, autoSpeed, frm;
var uBright, tgtBrig, hovUnif;
var mouse, hovArt, drag, didDrag;

/* ── Inertia / auto-spin constants ───────────────────────────
   AUTO_TARGET: auto-rotate speed in radians/frame (larger = faster spin)
   DAMPING:     how quickly drag momentum dies (0 = instant stop, 1 = no decay)

   CHANGE SPIN SPEED: edit AUTO_TARGET
   LOCATION: js/art-3d.js  lines 138 – 139
──────────────────────────────────────────────────────────────*/
var AUTO_TARGET = 0.002;
var DAMPING     = 0.88;

/* ── Main init — runs once all images have loaded ─────────────*/
function init() {
  var canvas  = document.getElementById('artCanvas');
  var tooltip = document.getElementById('artTooltip');

  /* Renderer — alpha:true lets the CSS background image show through */
  renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0xffffff, 1);

  scene  = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 500);

  /* ── Spherical-coordinate orbit ─────────────────────────────
     theta = horizontal angle, phi = vertical angle, r = radius.
     moveCam() converts to Cartesian, always looking at origin.

     CHANGE STARTING ANGLE: edit orb.theta / orb.phi
     CHANGE STARTING DISTANCE: edit orb.r (also the intro start below)
     LOCATION: js/art-3d.js  lines 163 – 164
  ──────────────────────────────────────────────────────────────*/
  orb       = { theta: 0, phi: 1.2, r: 70 };
  velTheta  = 0; velPhi  = 0;
  prevTheta = 0; prevPhi = 0;
  phase     = 'intro';
  autoSpeed = 0;
  frm       = 0;

  function moveCam() {
    var sp = Math.sin(orb.phi);
    camera.position.set(
      orb.r * sp * Math.sin(orb.theta),
      orb.r * Math.cos(orb.phi),
      orb.r * sp * Math.cos(orb.theta)
    );
    camera.lookAt(0, 0, 0);
  }
  moveCam();

  /* ── Texture atlas ───────────────────────────────────────────*/
  var atlas = new THREE.CanvasTexture(buildAtlas());

  /* ── Brightness uniforms ─────────────────────────────────────
     uBright starts at 0 (invisible) and lerps to tgtBrig=1 each frame,
     giving a smooth fade-in on load.
  ──────────────────────────────────────────────────────────────*/
  uBright  = new Array(N).fill(0);
  tgtBrig  = new Array(N).fill(1);
  hovUnif  = { value: -1.0 };

  var uniforms = {
    atlas:        { value: atlas },
    brightnesses: { value: uBright },
    hoverArt:     hovUnif,
  };

  var mat = new THREE.ShaderMaterial({
    vertexShader:   VERT,
    fragmentShader: FRAG,
    uniforms:       uniforms,
    transparent:    true,
    depthWrite:     false,
  });

  /* ── Particle geometry ───────────────────────────────────────
     One particle per artwork (PER=1 → no duplicates).
     Placed at a random point on a sphere of radius r.

     CHANGE ORB SIZE:   edit the sizes line (3.5 + Math.random() * 2.5)
     CHANGE SPREAD:     edit the r line    (5 + Math.random() * 12)
     LOCATION: js/art-3d.js  lines 213 – 214
  ──────────────────────────────────────────────────────────────*/
  var TOTAL   = N;  // one orb per artwork
  var pos     = new Float32Array(TOTAL * 3);
  var sizes   = new Float32Array(TOTAL);
  var aIdxArr = new Float32Array(TOTAL);
  var uvArr   = new Float32Array(TOTAL * 4);
  var artOf   = new Int32Array(TOTAL);

  ARTWORKS.forEach(function(_, ai) {
    var uvx = (ai % COLS) / COLS, uvy = Math.floor(ai / COLS) / ROWS;
    var uvw = 1.0 / COLS, uvh = 1.0 / ROWS;

    var th = Math.random() * Math.PI * 2;
    var ph = Math.acos(2 * Math.random() - 1);
    var r  = 8 + Math.random() * 22;   /* ← SPREAD: increase 22 to spread orbs further apart  */
    pos[ai * 3]     = r * Math.sin(ph) * Math.cos(th);
    pos[ai * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
    pos[ai * 3 + 2] = r * Math.cos(ph);
    sizes[ai]        = ARTWORKS[ai].name === 'Aquarium of the Bay: 30th Anniversary'
                       ? 22.0
                       : 8.0 + Math.random() * 3.0;  /* ← SIZE: first number = min, sum = max   */
    aIdxArr[ai]      = ai;
    artOf[ai]        = ai;
    uvArr[ai * 4]    = uvx; uvArr[ai * 4 + 1] = uvy;
    uvArr[ai * 4 + 2] = uvw; uvArr[ai * 4 + 3] = uvh;
  });

  /* Snapshots of original per-artwork data (never mutated after init).
     The geometry buffers below are re-sorted each frame back-to-front
     so nearer orbs always paint over farther ones (painter's algorithm). */
  var origPos   = new Float32Array(pos);
  var origSizes = new Float32Array(sizes);
  var origUv    = new Float32Array(uvArr);

  var geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('size',     new THREE.BufferAttribute(sizes, 1));
  geo.setAttribute('artIdx',   new THREE.BufferAttribute(aIdxArr, 1));
  geo.setAttribute('uvRect',   new THREE.BufferAttribute(uvArr, 4));

  /* ── Depth sort ──────────────────────────────────────────────
     Reorders the geometry buffers so farther orbs render first,
     ensuring proper overlap (closer orbs appear on top).
     Also rebuilds artOf[] so raycasting still maps correctly.
  ──────────────────────────────────────────────────────────────*/
  var _sortOrder = new Array(N);
  function sortByDepth() {
    var cam = camera.position;
    for (var i = 0; i < N; i++) {
      var dx = origPos[i*3] - cam.x, dy = origPos[i*3+1] - cam.y, dz = origPos[i*3+2] - cam.z;
      _sortOrder[i] = { ai: i, d2: dx*dx + dy*dy + dz*dz };
    }
    _sortOrder.sort(function(a, b) { return b.d2 - a.d2; }); // far → near

    var gp = geo.attributes.position.array;
    var gs = geo.attributes.size.array;
    var gi = geo.attributes.artIdx.array;
    var gu = geo.attributes.uvRect.array;
    for (var j = 0; j < N; j++) {
      var ai = _sortOrder[j].ai;
      artOf[j]  = ai;
      gp[j*3]   = origPos[ai*3];   gp[j*3+1] = origPos[ai*3+1]; gp[j*3+2] = origPos[ai*3+2];
      gs[j]     = origSizes[ai];
      gi[j]     = ai;
      gu[j*4]   = origUv[ai*4]; gu[j*4+1] = origUv[ai*4+1]; gu[j*4+2] = origUv[ai*4+2]; gu[j*4+3] = origUv[ai*4+3];
    }
    geo.attributes.position.needsUpdate = true;
    geo.attributes.size.needsUpdate     = true;
    geo.attributes.artIdx.needsUpdate   = true;
    geo.attributes.uvRect.needsUpdate   = true;
  }

  points = new THREE.Points(geo, mat);
  scene.add(points);


  /* ── Raycaster ───────────────────────────────────────────────
     threshold = pick radius in world units; increase if clicks feel imprecise
     LOCATION: js/art-3d.js  line 243
  ──────────────────────────────────────────────────────────────*/
  ray = new THREE.Raycaster();
  ray.params.Points.threshold = 1.2;

  mouse   = new THREE.Vector2(-9999, -9999);
  hovArt  = -1;
  drag    = null;
  didDrag = false;

  /* ── Mouse / touch events ────────────────────────────────────*/
  canvas.addEventListener('mousemove', function(e) {
    mouse.x = (e.clientX / window.innerWidth)  *  2 - 1;
    mouse.y = (e.clientY / window.innerHeight) * -2 + 1;
    tooltip.style.left = (e.clientX + 14) + 'px';
    tooltip.style.top  = (e.clientY - 10) + 'px';

    if (drag) {
      if (Math.hypot(e.clientX - drag.x, e.clientY - drag.y) > 4) didDrag = true;
      orb.theta = drag.theta - (e.clientX - drag.x) * 0.006;
      orb.phi   = Math.max(0.2, Math.min(Math.PI - 0.2,
                    drag.phi - (e.clientY - drag.y) * 0.006));
    }
  });

  canvas.addEventListener('mousedown', function(e) {
    drag      = { x: e.clientX, y: e.clientY, theta: orb.theta, phi: orb.phi };
    didDrag   = false;
    phase     = 'drag';
    autoSpeed = 0;
    prevTheta = orb.theta;
    prevPhi   = orb.phi;
  });

  window.addEventListener('mouseup', function() {
    if (!didDrag && hovArt >= 0) window.location.href = ARTWORKS[hovArt].url;
    drag  = null;
    phase = 'inertia';
  });

  /* ── Zoom: scroll wheel ──────────────────────────────────────
     ZOOM LIMITS: edit the Math.max / Math.min values
     LOCATION: js/art-3d.js  line 283
  ──────────────────────────────────────────────────────────────*/
  canvas.addEventListener('wheel', function(e) {
    e.preventDefault();
    orb.r = Math.max(8, Math.min(55, orb.r + e.deltaY * 0.04));
  }, { passive: false });

  /* ── Touch events (mobile) ───────────────────────────────────*/
  var _pinchDist0 = 0;

  canvas.addEventListener('touchstart', function(e) {
    e.preventDefault();
    if (e.touches.length === 1) {
      var t = e.touches[0];
      drag      = { x: t.clientX, y: t.clientY, theta: orb.theta, phi: orb.phi };
      didDrag   = false;
      phase     = 'drag';
      autoSpeed = 0;
      prevTheta = orb.theta;
      prevPhi   = orb.phi;
    } else if (e.touches.length === 2) {
      drag = null;
      _pinchDist0 = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
    }
  }, { passive: false });

  canvas.addEventListener('touchmove', function(e) {
    e.preventDefault();
    if (e.touches.length === 1 && drag) {
      var t = e.touches[0];
      if (Math.hypot(t.clientX - drag.x, t.clientY - drag.y) > 6) didDrag = true;
      orb.theta = drag.theta - (t.clientX - drag.x) * 0.006;
      orb.phi   = Math.max(0.2, Math.min(Math.PI - 0.2,
                    drag.phi - (t.clientY - drag.y) * 0.006));
    } else if (e.touches.length === 2) {
      var d = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      orb.r       = Math.max(8, Math.min(55, orb.r - (d - _pinchDist0) * 0.05));
      _pinchDist0 = d;
    }
  }, { passive: false });

  canvas.addEventListener('touchend', function(e) {
    if (!didDrag && e.changedTouches.length > 0) {
      var t  = e.changedTouches[0];
      var mx = (t.clientX / window.innerWidth)  *  2 - 1;
      var my = (t.clientY / window.innerHeight) * -2 + 1;
      ray.setFromCamera(new THREE.Vector2(mx, my), camera);
      var hits = ray.intersectObject(points);
      if (hits.length > 0) window.location.href = ARTWORKS[artOf[hits[0].index]].url;
    }
    drag  = null;
    phase = 'inertia';
  });

  /* ── Resize ──────────────────────────────────────────────────*/
  window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  /* ── Render loop ─────────────────────────────────────────────
     Intro: camera flies in from r=70 → r=28 over ~150 frames.

     CHANGE INTRO DURATION: edit INTRO (frames at 60fps: 150 ≈ 2.5 s)
     CHANGE FINAL DISTANCE: edit the 28 in the orb.r formula
     LOCATION: js/art-3d.js  line 296
  ──────────────────────────────────────────────────────────────*/
  var INTRO = 150;

  function tick() {
    requestAnimationFrame(tick);

    if (phase === 'intro') {
      frm++;
      var t = frm / INTRO;
      orb.r = 70 - (70 - 28) * (1 - Math.pow(1 - t, 3));  // cubic ease-out
      if (frm >= INTRO) phase = 'spin';
    }

    if (phase === 'drag') {
      velTheta  = orb.theta - prevTheta;
      velPhi    = orb.phi   - prevPhi;
      prevTheta = orb.theta;
      prevPhi   = orb.phi;
    } else if (phase === 'inertia') {
      orb.theta += velTheta;
      orb.phi    = Math.max(0.2, Math.min(Math.PI - 0.2, orb.phi + velPhi));
      velTheta  *= DAMPING;
      velPhi    *= DAMPING;
      if (Math.abs(velTheta) + Math.abs(velPhi) < 0.00015) {
        velTheta = velPhi = 0;
        phase = 'spin';
      }
    } else if (phase === 'spin') {
      autoSpeed += (AUTO_TARGET - autoSpeed) * 0.012;
      orb.theta += autoSpeed;
    }

    moveCam();
    sortByDepth();

    // Fade each orb in toward its target brightness
    for (var i = 0; i < N; i++) {
      uBright[i] += (tgtBrig[i] - uBright[i]) * 0.07;
    }

    // Raycast to find hovered artwork
    ray.setFromCamera(mouse, camera);
    var hits = ray.intersectObject(points);
    if (hits.length > 0) {
      var ai = artOf[hits[0].index];
      if (ai !== hovArt) {
        hovArt              = ai;
        hovUnif.value       = ai;
        tooltip.textContent = ARTWORKS[ai].name;
        tooltip.classList.add('visible');
        canvas.style.cursor = 'pointer';
      }
    } else if (hovArt >= 0) {
      hovArt = -1;
      hovUnif.value = -1.0;
      tooltip.classList.remove('visible');
      canvas.style.cursor = 'default';
    }

    renderer.render(scene, camera);
  }

  tick();
}
