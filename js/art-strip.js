'use strict';

/* ════════════════════════════════════════════════════════════════
   art-strip.js — bottom filmstrip for individual artwork pages
   Builds the thumbnail bar and highlights the current piece.

   TO ADD / REMOVE / RENAME A PIECE:
     Edit this list AND the matching entry in js/art-3d.js.
     Both files must stay in sync.
     LOCATION: js/art-strip.js  lines 13 – 55
════════════════════════════════════════════════════════════════ */
var STRIP_ARTWORKS = [
  { name: 'Balcony',                              file: 'balcony.html',                        img: '../images/artworks/Balcony.jpg'                                    },
  { name: 'Before the show',                      file: 'before-the-show.html',                img: '../images/artworks/Before the show.jpg'                           },
  { name: 'Controlled',                           file: 'controlled.html',                     img: '../images/artworks/Controlled.jpg'                                },
  { name: 'Fallen Angels',                        file: 'fallen-angels.html',                  img: '../images/artworks/Fallen Angels.jpg'                             },
  { name: 'French Boys',                          file: 'french-boys.html',                    img: '../images/artworks/French Boys.jpg'                               },
  { name: 'Loot drop',                            file: 'loot-drop.html',                      img: '../images/artworks/Loot drop.jpg'                                 },
  { name: 'Missing you',                          file: 'missing-you.html',                    img: '../images/artworks/Missing you.jpg'                               },
  { name: 'Morning',                              file: 'morning.html',                        img: '../images/artworks/Morning.jpg'                                   },
  { name: 'My pod',                               file: 'my-pod.html',                         img: '../images/artworks/My pod.jpg'                                    },
  { name: 'Portrait',                             file: 'portrait.html',                       img: '../images/artworks/Portrait.jpg'                                  },
  { name: 'Love seat',                            file: 'reclined.html',                       img: '../images/artworks/Reclined.jpg'                                  },
  { name: 'Recoil',                               file: 'recoil.html',                         img: '../images/artworks/Recoil.jpg'                                    },
  { name: 'Searching',                            file: 'searching.html',                      img: '../images/artworks/Searching.jpg'                                 },
  { name: 'Self Portrait',                        file: 'self-portrait.html',                  img: '../images/artworks/Self Portrait.jpg'                             },
  { name: 'So what',                              file: 'so-what.html',                        img: '../images/artworks/So what.jpg'                                   },
  { name: 'Aquarium',                             file: 'aquarium.html',                       img: '../images/artworks/Aquarium.jpg'                                  },
  { name: 'DJ',                                   file: 'dj.html',                             img: '../images/artworks/DJ.jpg'                                        },
  { name: "Dadai's Painting",                     file: 'dadais-painting.html',                img: '../images/artworks/Dadais Painting.png'                          },
  { name: "Don't blink",                          file: 'dont-blink.html',                     img: '../images/artworks/Dont blink.png'                               },
  { name: 'Dreams',                               file: 'dreams.html',                         img: '../images/artworks/Dreams.jpg'                                    },
  { name: 'Girls and their weird pets',           file: 'girls-and-their-weird-pets.html',     img: '../images/artworks/Girls and their weird pets.png'                },
  { name: 'Hypnosis',                             file: 'hypnosis.html',                       img: '../images/artworks/Hypnosis.PNG'                                  },
  { name: 'In her castle',                        file: 'in-her-castle.html',                  img: '../images/artworks/In her castle.png'                             },
  { name: 'In your arms',                         file: 'in-your-arms.html',                   img: '../images/artworks/In your arms.png'                              },
  { name: 'Lunch break',                          file: 'lunch-break.html',                    img: '../images/artworks/Lunch break.png'                               },
  { name: 'Ninja',                                file: 'ninja.html',                          img: '../images/artworks/Ninja.PNG'                                     },
  { name: 'The party',                            file: 'the-party.html',                      img: '../images/artworks/The party.png'                                 },
  { name: 'Pearls',                               file: 'pearls.html',                         img: '../images/artworks/Pearls.jpg'                                    },
  { name: 'Rorschach cat',                        file: 'rorschach-cat.html',                  img: '../images/artworks/Rorschach cat.png'                             },
  { name: 'Spongebob',                            file: 'spongebob.html',                      img: '../images/artworks/Spongebob.png'                                 },
  { name: 'The old guitarist',                    file: 'the-old-guitarist.html',              img: '../images/artworks/The old guitarist.png'                         },
  { name: 'Untitled',                             file: 'untitled.html',                       img: '../images/artworks/Untitled.png'                                  },
  { name: 'lost a cat',                           file: 'lost-a-cat.html',                     img: '../images/artworks/lost a cat.png'                                },
  { name: 'Aquarium of the Bay: 30th Anniversary',file: 'aquarium-of-the-bay-30th-anniversary.html', img: '../images/artworks/Aquarium of the Bay 30th Anniversary.jpeg' },
  { name: 'American dreams',                      file: 'american-dreams.html',                img: '../images/artworks/American dreams.JPEG'                          },
  { name: 'Shades of blue',                       file: 'shades-of-blue.html',                 img: '../images/artworks/Shades of blue.jpeg'                           },
  { name: 'Your favorite band',                   file: 'your-favorite-band.html',             img: '../images/artworks/Your favorite band.png'                        },
  { name: '2016',                                 file: '2016.html',                           img: '../images/artworks/2016.PNG'                                      },
  { name: 'Scales',                               file: 'scales.html',                         img: '../images/artworks/Scales.jpeg'                                   },
];

(function () {
  /* Detect current page filename (e.g. "balcony.html") */
  var currentFile = window.location.pathname.split('/').pop();

  /* Build strip container */
  var strip = document.createElement('div');
  strip.className = 'art-strip';
  strip.setAttribute('aria-label', 'Browse artworks');
  strip.setAttribute('role', 'navigation');

  var activeEl = null;

  STRIP_ARTWORKS.forEach(function (aw) {
    var a   = document.createElement('a');
    a.href  = aw.file;
    a.className = 'art-strip-item';
    a.title = aw.name;

    var img    = document.createElement('img');
    img.src    = aw.img;
    img.alt    = aw.name;
    img.loading = 'lazy';

    a.appendChild(img);
    strip.appendChild(a);

    if (aw.file === currentFile) {
      a.classList.add('active');
      activeEl = a;
    }
  });

  document.body.appendChild(strip);

  /* Centre the active thumbnail inside the strip (horizontal only — never scrolls the page) */
  if (activeEl) {
    setTimeout(function () {
      strip.scrollLeft = activeEl.offsetLeft - (strip.offsetWidth / 2) + (activeEl.offsetWidth / 2);
    }, 80);
  }

  /* Always start at the top — disable browser scroll restoration first
     so it can't override this after navigating from the orb or the strip */
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);
})();
