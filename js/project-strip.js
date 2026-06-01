'use strict';

/* ════════════════════════════════════════════════════════════════
   project-strip.js — bottom filmstrip for individual project pages
   Builds the thumbnail bar and highlights the current project.

   TO ADD / REMOVE / RENAME A PROJECT:
     Edit this list AND the matching entry in js/projects-3d.js.
     Both files must stay in sync.
     LOCATION: js/project-strip.js  lines 13 – 31
════════════════════════════════════════════════════════════════ */
var STRIP_PROJECTS = [
  { name: 'fashion',        file: 'fashion.html',        img: '../images/projects/Fashion.jpg'                  },
  { name: 'flatware',       file: 'flatware.html',       img: '../images/projects/flatware.png'                 },
  { name: 'shelf',          file: 'shelf.html',          img: '../images/projects/Organization (shelf).jpeg'    },
  { name: 'dispenser',      file: 'dispenser.html',      img: '../images/projects/Dispenser.jpg'                },
  { name: 'timer',          file: 'timer.html',          img: '../images/projects/Timer.png'                    },
  { name: 'knife',          file: 'knife.html',          img: '../images/projects/Fang(knife).jpeg'             },
  { name: 'design drawing', file: 'design-drawing.html', img: '../images/projects/Design Drawing.jpeg'          },
  { name: 'CAD',            file: 'cad.html',            img: '../images/projects/CAD.png'                      },
  { name: 'bus app',        file: 'bus-app.html',        img: '../images/projects/Bus.png'                      },
  { name: 'muuto',          file: 'muuto.html',          img: '../images/projects/muuto.png'                    },
  { name: 'chair',          file: 'chair.html',          img: '../images/projects/Chair.png'                    },
  { name: 'calculator',     file: 'calculator.html',     img: '../images/projects/Calculator.png'               },
  { name: 'booth',          file: 'booth.html',          img: '../images/projects/booth.png'                    },
  { name: 'train',          file: 'train.html',          img: '../images/projects/lego train.png'               },
  { name: 'dragon',         file: 'dragon.html',         img: '../images/projects/Dragon.jpeg'                  },
  { name: 'flux stove',     file: 'flux-stove.html',     img: '../images/projects/Flux.png'                     },
  { name: 'mask',           file: 'mask.html',           img: '../images/projects/mask.png'                     },
];

(function () {
  var currentFile = window.location.pathname.split('/').pop();

  var strip = document.createElement('div');
  strip.className = 'proj-strip';
  strip.setAttribute('aria-label', 'Browse projects');
  strip.setAttribute('role', 'navigation');

  var activeEl = null;

  STRIP_PROJECTS.forEach(function (proj) {
    var a       = document.createElement('a');
    a.href      = proj.file;
    a.className = 'proj-strip-item';
    a.title     = proj.name;

    var img     = document.createElement('img');
    img.src     = proj.img;
    img.alt     = proj.name;
    img.loading = 'lazy';

    a.appendChild(img);
    strip.appendChild(a);

    if (proj.file === currentFile) {
      a.classList.add('active');
      activeEl = a;
    }
  });

  document.body.appendChild(strip);

  if (activeEl) {
    setTimeout(function () {
      strip.scrollLeft = activeEl.offsetLeft - (strip.offsetWidth / 2) + (activeEl.offsetWidth / 2);
    }, 80);
  }

  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
})();
