'use strict';

/* ════════════════════════════════════════════════════════════════
   projects-3d.js — 3D project universe for projects.html
   Requires: THREE global from js/three.min.js
════════════════════════════════════════════════════════════════ */

/* ── Project list ─────────────────────────────────────────────
   TO ADD A PROJECT:
     1. Add the image to /images/projects/  (name it <slug>.png/jpg)
     2. Add a new entry below (name, url, img path)
     3. Create the matching page in /projects/

   TO REMOVE A PROJECT:
     Delete its entry here. Atlas + geometry rebuild automatically.

   LOCATION: js/projects-3d.js  lines 17 – 36
──────────────────────────────────────────────────────────────*/
var PROJECTS = [
  { name: 'fashion',        url: 'projects/fashion.html',        img: 'images/projects/thumbs/Fashion.jpg'                        },
  { name: 'flatware',       url: 'projects/flatware.html',       img: 'images/projects/thumbs/flatware.png'                       },
  { name: 'shelf',          url: 'projects/shelf.html',          img: 'images/projects/thumbs/Organization (shelf).jpeg'         },
  { name: 'dispenser',      url: 'projects/dispenser.html',      img: 'images/projects/thumbs/Dispenser.jpg'                     },
  { name: 'timer',          url: 'projects/timer.html',          img: 'images/projects/thumbs/Timer.png'                         },
  { name: 'knife',          url: 'projects/knife.html',          img: 'images/projects/thumbs/Fang(knife).jpeg'                  },
  { name: 'design drawing', url: 'projects/design-drawing.html', img: 'images/projects/thumbs/Design Drawing.jpeg'                },
  { name: 'CAD',            url: 'projects/cad.html',            img: 'images/projects/thumbs/CAD.png'                            },
  { name: 'bus app',        url: 'projects/bus-app.html',        img: 'images/projects/thumbs/Bus.png'                            },
  { name: 'muuto',          url: 'projects/muuto.html',          img: 'images/projects/thumbs/muuto.png'                         },
  { name: 'chair',          url: 'projects/chair.html',          img: 'images/projects/thumbs/Chair.png'                         },
  { name: 'calculator',     url: 'projects/calculator.html',     img: 'images/projects/thumbs/Calculator.png'                    },
  { name: 'booth',          url: 'projects/booth.html',          img: 'images/projects/thumbs/booth.png'                         },
  { name: 'train',          url: 'projects/train.html',          img: 'images/projects/thumbs/lego train.png'                    },
  { name: 'dragon',         url: 'projects/dragon.html',         img: 'images/projects/thumbs/Dragon.jpeg'                        },
  { name: 'flux stove',     url: 'projects/flux-stove.html',     img: 'images/projects/thumbs/Flux.png'                           },
  { name: 'mask',           url: 'projects/mask.html',           img: 'images/projects/thumbs/mask.png'                          },
];

var N = PROJECTS.length;  // 17

/* ── Atlas layout ─────────────────────────────────────────────
   5 columns × 4 rows = 20 cells, one per project.
   Each cell is CELL×CELL px; images are cropped to fill a circle.
──────────────────────────────────────────────────────────────*/
var COLS = 5, ROWS = 4, CELL = 300;  // 5×4 = 20 cells for 18 projects
var AW = COLS * CELL;   // 2560 px
var AH = ROWS * CELL;   // 2048 px

/* ── Image preload ────────────────────────────────────────────
   All project images are loaded before the scene is built.
   Missing images get a white circle fallback (safe to add later).
──────────────────────────────────────────────────────────────*/
var loadedImages = new Array(N).fill(null);
var loadCount    = 0;

PROJECTS.forEach(function(proj, i) {
  var img    = new Image();
  img.onload = function() {
    loadedImages[i] = img;
    if (++loadCount === N) init();
  };
  img.onerror = function() {
    if (++loadCount === N) init();
  };
  img.src = proj.img;
});

/* ── Atlas builder ────────────────────────────────────────────
   Draws each project image into its atlas cell, clipped to a
   circle (cover crop — no letterboxing).
   Called inside init() after all images have loaded.
──────────────────────────────────────────────────────────────*/
function buildAtlas() {
  var cvs = document.createElement('canvas');
  cvs.width = AW; cvs.height = AH;
  var ctx = cvs.getContext('2d');

  PROJECTS.forEach(function(_, pi) {
    var col = pi % COLS, row = Math.floor(pi / COLS);
    var ox  = col * CELL, oy = row * CELL;
    var r   = CELL / 2,  cx = ox + r, cy = oy + r;

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r - 4, 0, Math.PI * 2);
    ctx.clip();

    var img = loadedImages[pi];
    if (img && img.naturalWidth > 0) {
      var iw    = img.naturalWidth, ih = img.naturalHeight;
      var scale = Math.max(CELL / iw, CELL / ih);
      var dw    = iw * scale, dh = ih * scale;
      ctx.drawImage(img, ox + (CELL - dw) / 2, oy + (CELL - dh) / 2, dw, dh);
    } else {
      ctx.fillStyle = PROJECTS[pi].color || '#ffffff';
      ctx.fillRect(ox, oy, CELL, CELL);
    }

    ctx.restore();
  });

  return cvs;
}

/* ── Vertex shader ────────────────────────────────────────────
   Scales gl_PointSize by depth so closer orbs appear larger.
   Hovered project scales up slightly.
──────────────────────────────────────────────────────────────*/
var VERT = [
  'attribute float size;',
  'attribute float projIdx;',
  'attribute vec4  uvRect;',
  'uniform float   brightnesses[' + N + '];',
  'uniform float   hoverProject;',
  'varying vec4    vRect;',
  'varying float   vBright;',
  'void main() {',
  '  vRect   = uvRect;',
  '  vBright = brightnesses[int(projIdx)];',
  '  float hov = 1.0 - step(0.5, abs(projIdx - hoverProject));',
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
var mouse, hovProj, drag, didDrag;

var AUTO_TARGET = 0.002;
var DAMPING     = 0.88;

/* ── Main init — runs once all images have loaded ─────────────*/
function init() {
  var canvas  = document.getElementById('threeCanvas');
  var tooltip = document.getElementById('projTooltip');

  renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);

  scene  = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 500);

  orb       = { theta: 0, phi: 1.2, r: 90 };
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

  var atlas = new THREE.CanvasTexture(buildAtlas());

  uBright  = new Array(N).fill(0);
  tgtBrig  = new Array(N).fill(1);
  hovUnif  = { value: -1.0 };

  var uniforms = {
    atlas:        { value: atlas },
    brightnesses: { value: uBright },
    hoverProject: hovUnif,
  };

  var mat = new THREE.ShaderMaterial({
    vertexShader:   VERT,
    fragmentShader: FRAG,
    uniforms:       uniforms,
    transparent:    true,
    depthWrite:     false,
  });

  /* ── Particle geometry ───────────────────────────────────────
     One particle per project. Placed randomly on a sphere.

     CHANGE ORB SIZE:   edit the sizes line
     CHANGE SPREAD:     edit the r line
  ──────────────────────────────────────────────────────────────*/
  var pos     = new Float32Array(N * 3);
  var sizes   = new Float32Array(N);
  var pIdxArr = new Float32Array(N);
  var uvArr   = new Float32Array(N * 4);
  var projOf  = new Int32Array(N);

  PROJECTS.forEach(function(_, pi) {
    var uvx = (pi % COLS) / COLS, uvy = Math.floor(pi / COLS) / ROWS;
    var uvw = 1.0 / COLS, uvh = 1.0 / ROWS;

    var th = Math.random() * Math.PI * 2;
    var ph = Math.acos(2 * Math.random() - 1);
    var r  = 8 + Math.random() * 22;
    pos[pi * 3]     = r * Math.sin(ph) * Math.cos(th);
    pos[pi * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
    pos[pi * 3 + 2] = r * Math.cos(ph);
    sizes[pi]        = 16.0 + Math.random() * 4.0;
    pIdxArr[pi]      = pi;
    projOf[pi]       = pi;
    uvArr[pi * 4]    = uvx; uvArr[pi * 4 + 1] = uvy;
    uvArr[pi * 4 + 2] = uvw; uvArr[pi * 4 + 3] = uvh;
  });

  /* Snapshots for depth-sorting — never mutated after init */
  var origPos   = new Float32Array(pos);
  var origSizes = new Float32Array(sizes);
  var origUv    = new Float32Array(uvArr);

  var geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('size',     new THREE.BufferAttribute(sizes, 1));
  geo.setAttribute('projIdx',  new THREE.BufferAttribute(pIdxArr, 1));
  geo.setAttribute('uvRect',   new THREE.BufferAttribute(uvArr, 4));

  /* ── Depth sort (painter's algorithm) ───────────────────────
     Reorders geometry buffers far→near each frame so closer
     orbs always paint over farther ones.
  ──────────────────────────────────────────────────────────────*/
  var _sortOrder = new Array(N);
  function sortByDepth() {
    var cam = camera.position;
    for (var i = 0; i < N; i++) {
      var dx = origPos[i*3] - cam.x, dy = origPos[i*3+1] - cam.y, dz = origPos[i*3+2] - cam.z;
      _sortOrder[i] = { pi: i, d2: dx*dx + dy*dy + dz*dz };
    }
    _sortOrder.sort(function(a, b) { return b.d2 - a.d2; });

    var gp = geo.attributes.position.array;
    var gs = geo.attributes.size.array;
    var gi = geo.attributes.projIdx.array;
    var gu = geo.attributes.uvRect.array;
    for (var j = 0; j < N; j++) {
      var pi = _sortOrder[j].pi;
      projOf[j]  = pi;
      gp[j*3]    = origPos[pi*3];   gp[j*3+1] = origPos[pi*3+1]; gp[j*3+2] = origPos[pi*3+2];
      gs[j]      = origSizes[pi];
      gi[j]      = pi;
      gu[j*4]    = origUv[pi*4]; gu[j*4+1] = origUv[pi*4+1]; gu[j*4+2] = origUv[pi*4+2]; gu[j*4+3] = origUv[pi*4+3];
    }
    geo.attributes.position.needsUpdate = true;
    geo.attributes.size.needsUpdate     = true;
    geo.attributes.projIdx.needsUpdate  = true;
    geo.attributes.uvRect.needsUpdate   = true;
  }

  points = new THREE.Points(geo, mat);
  scene.add(points);

  ray = new THREE.Raycaster();
  ray.params.Points.threshold = 1.2;

  mouse   = new THREE.Vector2(-9999, -9999);
  hovProj = -1;
  drag    = null;
  didDrag = false;

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
    if (!didDrag && hovProj >= 0) window.location.href = PROJECTS[hovProj].url;
    drag  = null;
    phase = 'inertia';
  });

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
      if (hits.length > 0) window.location.href = PROJECTS[projOf[hits[0].index]].url;
    }
    drag  = null;
    phase = 'inertia';
  });

  window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  var INTRO = 150;

  function tick() {
    requestAnimationFrame(tick);

    if (phase === 'intro') {
      frm++;
      var t = frm / INTRO;
      orb.r = 70 - (70 - 28) * (1 - Math.pow(1 - t, 3));
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

    for (var i = 0; i < N; i++) {
      uBright[i] += (tgtBrig[i] - uBright[i]) * 0.07;
    }

    ray.setFromCamera(mouse, camera);
    var hits = ray.intersectObject(points);
    if (hits.length > 0) {
      var pi = projOf[hits[0].index];
      if (pi !== hovProj) {
        hovProj             = pi;
        hovUnif.value       = pi;
        tooltip.textContent = PROJECTS[pi].name;
        tooltip.classList.add('visible');
        canvas.style.cursor = 'pointer';
      }
    } else if (hovProj >= 0) {
      hovProj = -1;
      hovUnif.value = -1.0;
      tooltip.classList.remove('visible');
      canvas.style.cursor = 'default';
    }

    renderer.render(scene, camera);
  }

  tick();
}
