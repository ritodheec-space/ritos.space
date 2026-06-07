# /new-artwork — sync art pages with images folder

Scan `/Users/rito/website/images/artworks/` for any `.jpg` / `.jpeg` / `.png` files that are **not** `art-bg.jpg` (or `art-bg.png`). For each image found, check whether a matching page exists in `/Users/rito/website/art/`. If the page is missing, create it and update the **three** places that list artworks.

## Step 1 — discover what needs to be done

Run `ls /Users/rito/website/images/artworks/` and `ls /Users/rito/website/art/` to compare.

**Slug rule:** take the filename without extension, lowercase it, replace spaces with hyphens.
- `My pod.jpg` → slug `my-pod` → page `art/my-pod.html`
- `Before the show.jpg` → slug `before-the-show` → page `art/before-the-show.html`

Report which images are missing pages before making any changes.

## Step 2 — create missing HTML pages

For each missing page write `/Users/rito/website/art/[slug].html` using exactly this template (substitute NAME, SLUG, FILE with the real values):

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NAME — Ritodhee Chatterjee</title>
  <link rel="stylesheet" href="../css/styles.css">
  <link rel="stylesheet" href="../css/art-piece.css">
</head>
<body>

  <!-- Required for circle-menu dismiss (main.js needs these) -->
  <div class="blur-overlay" id="blurOverlay"></div>
  <nav class="circle-menu" id="circleMenu" aria-label="Site navigation">
    <svg class="circle-ring" viewBox="0 0 270 270" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path stroke="rgba(255,255,255,0.88)" stroke-width="0.75" fill="none"
        d="M 170 10  A 130 130 0 0 1 264 119
           M 264 151 A 130 130 0 0 1 170 260
           M 100 260 A 130 130 0 0 1 6   151
           M 6   119 A 130 130 0 0 1 100 10"/>
    </svg>
    <a href="../index.html"    class="menu-item menu-top">.space</a>
    <a href="../about.html"    class="menu-item menu-left">.info</a>
    <a href="../art.html"      class="menu-item menu-right">.art</a>
    <a href="../projects.html" class="menu-item menu-bottom">.projects</a>
    <span class="menu-item menu-center">.ritos</span>
  </nav>

  <!-- Back link — always visible while scrolling -->
  <a href="../art.html" class="piece-back">← artworks</a>

  <main>
    <!-- IMAGE ─────────────────────────────────────────────────────
         To swap this photo: replace /images/artworks/FILE with the new file
         (keep the same filename), or update the src path below.
         LOCATION: art/SLUG.html  line below
    ──────────────────────────────────────────────────────────────-->
    <img class="piece-image" src="../images/artworks/FILE" alt="NAME">

    <div class="piece-meta">

      <!-- TITLE ─────────────────────────────────────────────────
           To rename this piece: edit the text inside <h1> below.
           Also update the matching entry in js/art-3d.js lines 15-33.
           LOCATION: art/SLUG.html  line below
      ────────────────────────────────────────────────────────────-->
      <h1 class="piece-title">NAME</h1>

      <p class="piece-info">

        <!-- YEAR ──────────────────────────────────────────────────
             Change the number below to the year this work was made.
             LOCATION: art/SLUG.html — look for "YEAR" comment
        ────────────────────────────────────────────────────────────-->
        <span class="piece-year">2024</span><!-- YEAR -->

        &nbsp;&nbsp;·&nbsp;&nbsp;

        <!-- MEDIUM ─────────────────────────────────────────────────
             Replace "Medium" with the material used, e.g.:
               Procreate   |   Gouache on paper   |   Oil on canvas
               Ink         |   Digital            |   Acrylic
             LOCATION: art/SLUG.html — look for "MEDIUM" comment
        ─────────────────────────────────────────────────────────────-->
        <span class="piece-medium">Medium</span><!-- MEDIUM -->

      </p>
    </div>
  </main>

  <script src="../js/main.js"></script>
  <script src="../js/art-strip.js"></script>
</body>
</html>
```

## Step 3 — update the ARTWORKS array in art-3d.js

Read `/Users/rito/website/js/art-3d.js`. The `ARTWORKS` array is between the comments `── Artwork list ─` and `var N = ARTWORKS.length`. Add a new entry for each new piece in the format:

```js
  { name: 'NAME', url: 'art/SLUG.html', img: 'images/artworks/FILE' },
```

Keep entries in the same order as the existing list (append at the end, or insert alphabetically — either is fine). Also update `ROWS` if the total count no longer fits in 5 columns × current row count (COLS=5, so ROWS = Math.ceil(total / 5)).

## Step 4 — update the STRIP_ARTWORKS array in art-strip.js

Read `/Users/rito/website/js/art-strip.js`. The `STRIP_ARTWORKS` array starts after the block comment near the top. Add a new entry for each new piece in the format:

```js
  { name: 'NAME', file: 'SLUG.html', img: '../images/artworks/FILE' },
```

Note the differences from art-3d.js:
- `file` (not `url`) contains just the filename, e.g. `balcony.html` (no `art/` prefix)
- `img` path starts with `../images/artworks/` (not `images/artworks/`) because these pages live inside `/art/`

Append the new entry at the end of the array, matching the order used in art-3d.js.

## Step 5 — report what was done

List every file created and every line changed, and remind the user to:
- Open each new page in `art/` and fill in the correct **year** and **medium**
- Reload `art.html` to confirm the new orb appears in the universe
- The new piece will automatically appear in the bottom filmstrip on all other piece pages
