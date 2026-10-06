# Hafsah Zulafiqar — Portfolio

A static multi-page portfolio site (plain HTML/CSS/JS, no build step, no framework)
deployed to GitHub Pages. One shared `styles.css` and `script.js` drive every page;
each page repeats its own nav/footer markup rather than using a template system.

## Site map

```
Home (index.html)
  → Hero: a decorative wireframe grid background (hover-glow lines) behind
    4 floating case-study photos (FITT, Mualim, PureCS, Kahunas) and the
    headline "I design products that solve problems for the users / and
    perform better for the business"
  → Companies strip (#experience) — scrolling text marquee
  → Case studies (#case-studies) — a scroll-pinned 3D "drum" deck on wide
    desktop viewports (one card centered at a time, neighbors peeking
    above/below), falling back to a plain stacked list on narrower
    viewports. Features 5 cards: FITT Meals (Subscription Journey), Mualim,
    PureCS, Kahunas, and Jugnu (locked — see "Lock modal" below)
  → Going above and beyond (#beyond) — a video carousel (2D animation,
    logo/branding, 3D modeling) that opens each clip in a lightbox
  → What people say (#testimonials) — real quotes with a prev/next carousel
  → About preview (#about-preview)
  → Footer — "Let's build together" CTA + real LinkedIn/Behance links

About (about.html)     → bio, "Education & certifications", contact CTA
Resume (resume.html)   → "Download Resume (PDF)" button (resume.pdf), an
                          "At a glance" grid of career-highlight cards kept
                          in sync with resume.pdf, contact CTA
Work/
  ├── fitt-subscription-journey.html  → FITT Meals: Subscription Journey
  ├── dtc-meal-plans.html             → FITT Meals (growth case study)
  ├── ai-tutor-ksa.html               → Mualim — AI tutor (two parts: For
  │                                      Parents, For Students)
  ├── b2b-coaches.html                → Kahunas (B2B coaching platform; built on
  │                                      the FITT page structure, visuals mostly
  │                                      placeholders for now)
  ├── pura-health-redesign.html       → PureCS (Pura Health redesign)
  └── jugnu-retailer-app.html         → Jugnu (locked on the homepage deck —
                                         a modal on that card redirects
                                         visitors back to #case-studies)
```

**`dtc-meal-plans.html` isn't linked from anywhere on the live site right now**
(not in the homepage deck, not in any case study's "More case studies" grid).
It still exists and renders fine, in the older flat-prose format, just orphaned.
Decide whether to rebuild it on the FITT page structure and link it in, or
retire it; don't assume it's reachable by visitors as-is.

Nav is minimal on every page: logo (links home) + a "Get in touch" CTA
(→ `resume.html`). There's no top-nav link to About — it's only reachable via
the footer / about-preview section on the home page.

## File structure

```
portfolio-site/
├── index.html            → home page
├── about.html             → about page
├── resume.html            → resume / "at a glance" page
├── resume.pdf              → the real, current CV — swap this file in place
│                             whenever the CV updates (see "Updating the resume")
├── work/
│   ├── fitt-subscription-journey.html
│   ├── dtc-meal-plans.html
│   ├── ai-tutor-ksa.html
│   ├── b2b-coaches.html
│   ├── pura-health-redesign.html
│   └── jugnu-retailer-app.html
├── styles.css              → design tokens + every component style, shared
├── script.js               → nav state, footer year, all interactive
│                             components (see "Key components" below)
├── assets/
│   ├── favicon.svg          → "HZ" mark, brand blue background
│   ├── skyline.svg
│   ├── icons/
│   ├── profile/
│   ├── about/
│   ├── beyond/              → the "going above and beyond" video carousel
│   ├── testimonials/
│   └── <case-study>/         → fitt-meals/, mualim/, purecs/, jugnu/, kahunas/
│       ├── intro.mp4 + intro-poster.jpg     → homepage-deck / banner video
│       ├── <feature>.mp4 + <feature>-poster.jpg
│       └── <slide>.png                       → carousel/toggle stills
└── README.md
```

Real per-project photo/video assets now exist for every featured case study
(FITT Meals, Mualim, PureCS) — most `.case-gallery-shot` placeholders you'll
still find in the less-featured pages (`dtc-meal-plans.html`, `b2b-coaches.html`,
and a few sections of `ai-tutor-ksa.html`) are genuinely still waiting on
assets, not something left unfinished by mistake.

## Design system

### Color palette

The site now uses a single flat brand blue rather than the earlier
blue/pink/purple mix — `--primary`, `--secondary`, `--accent`, and
`--btn-color` are all the same hex, so re-theming is a one-line change at the
top of `styles.css`.

| Token | Hex | Usage |
|---|---|---|
| `--bg` | `#FAFAFA` | Page background |
| `--bg-alt` | `#F0F0F0` | Alternating section background, placeholder fills |
| `--card` | `#FFFFFF` | Card surfaces |
| `--text` | `#1B1730` | Primary text |
| `--text-muted` | `#6B6684` | Body copy, secondary text |
| `--primary` / `--secondary` / `--accent` / `--btn-color` | `#4F7DF3` | The single brand blue — CTAs, links, accents, button fills |
| `--heading` | `#1B1730` | Heading color |
| `--btn-text` | `#FFFFFF` | Text on `--btn-color` surfaces |
| `--border` | `rgba(27,23,48,0.08)` | Hairlines on cards, nav, inputs |

`:root` at the top of `styles.css` defines every token once.

### Typography

- **Display** (`--font-display`): Fira Sans (Google Fonts, weights 400/700/800/900)
  — every heading, nav, stat labels, the marquee.
- **Body** (`--font-body`): a rounded system-font stack (renders as SF Pro
  Rounded on Apple platforms, DM Sans elsewhere) — body copy and UI text.

### Layout

- Content capped at `max-width: 1100px` via `.wrap`.
- Sections alternate `--bg` / `--bg-alt` for rhythm.
- Buttons are pill-shaped (`border-radius: 999px`); cards use 18–22px radius.

## Key components

- **Hero wireframe grid** — an SVG grid of cells (`data-row`/`data-col`) behind
  the hero content. Hovering a cell lights up a spreading glow along its row
  and column via CSS custom properties (`--glow`) set from a delegated
  `pointerover` listener in `script.js`, not a hard per-cell `:hover` swap.
- **Case-studies pinned drum deck** (`#case-studies`, `script.js`) — on wide
  viewports the section pins via `position: sticky` and a continuous scroll
  progress value drives a spring-animated 3D rotation (`rotateX`, opacity,
  a darkening "veil") so cards roll through center one at a time. Below the
  pinning width threshold it falls back to a plain stacked list — same
  markup, no JS-driven transform. The media box is sized to the actual
  video's 16:9 aspect ratio (not stretched to fill the panel), so nothing
  gets cropped.
- **Videos** (`.case-video` / `.case-video-fill`) — real per-project videos
  with a `poster` frame, `muted loop playsinline preload="none"`. A single
  `script.js` block gates autoplay: a video only plays while it's actually
  visible (`IntersectionObserver`) and — inside the pinned deck — only while
  its card is the active one. Respects `prefers-reduced-motion` (poster only,
  never plays).
- **`.case-toggle`** — a two-tab "Initial concept / Final outcome" pattern
  used across several case studies. Generic `[data-case-toggle]` handler in
  `script.js`; safe to reuse anywhere.
- **`.case-carousel`** — a prev/next (`‹`/`›`) image carousel for a toggle
  panel that holds more than one screen. Generic `[data-case-carousel]`
  handler; also reusable.
- **Lock modal** (`#lock-modal`) — Jugnu's case-study card carries a `.locked`
  class and a badge; clicking it opens a modal instead of navigating, and
  dismissing the modal redirects back to `#case-studies`. The click
  interception in `script.js` matches any `.locked .project-link`, so the
  pattern works on any card, not just Jugnu's.
- **`.case-stats`** — count-up stat numbers (`data-count-to`), animated from
  0 on scroll-into-view via `IntersectionObserver`; `data-suffix` (`%`, `+`,
  etc.) is auto-derived from the element's own initial text.
- **`.case-link-banner`** — a clickable banner image linking out to a live
  Figma board (research/survey decks), `target="_blank"`; a
  `.case-link-banner--static` variant exists for a non-clickable version of
  the same visual.
- **"Going above and beyond" carousel** (`#beyond`) — a horizontally
  scrollable set of video cards; clicking a card opens its video in a
  lightbox.
- **Testimonial carousel** (`#testimonials`) — real quotes, prev/next
  buttons toggle which `.testimonial-slide` has `.active`.
- **`.project-link` stretched-link pattern** — the whole card is clickable,
  not just the link text: `.project-link::after` is `position: absolute;
  inset: 0`, resolved against the card's own `position: relative`. **Any
  new place this class gets reused needs `position: relative` on its own
  nearest container**, or the invisible overlay escapes to the nearest
  positioned ancestor up the tree and steals clicks from unrelated elements
  below it in the DOM. This has happened more than once — always add
  `position: relative` in the same change.

### Known leftover: a dead chat-assistant block in `script.js`

`script.js` still contains a rule-based Q&A engine (`ANSWERS`, `KEYWORDS`,
`document.getElementById('chat-log')`) from an earlier version of the home
page. **No page currently has a `#chat-log` element or any chat markup**, so
this code is inert — it runs, finds nothing, and no-ops. It's harmless but
dead weight; flagging it here rather than silently deleting it, since someone
may want to either remove it or resurrect the chat UI on purpose.

## Conventions

- **Cache-busting**: `styles.css` and `script.js` are linked with a
  `?v=YYYYMMDDNN` query string on every page. Bump it across **all 9 HTML
  files** any time either file changes:
  ```
  grep -rl 'v=<old>' *.html work/*.html | xargs sed -i '' 's/v=<old>/v=<new>/g'
  ```
- **Site-wide markup sync** (nav, footer, or any block duplicated across
  pages): write a small Python script that loops
  `['index.html', 'about.html', 'resume.html'] + glob.glob('work/*.html')`,
  computes a path prefix per file (`''` at root, `'../'` under `work/`), and
  does an exact-string `.replace()` — printing which files matched so drift
  gets caught, not silently skipped.
- **Case-study assets** live under `assets/<case-study>/`, with a matching
  `-poster.jpg` next to every video. Poster frames are pulled from a
  meaningful timestamp in the clip (`ffmpeg -ss <seconds> -vframes 1`), not
  frame 0 — the first frame is often a blank/logo splash.
- **Updating the resume**: replace `resume.pdf` in place (same filename), and
  update the "At a glance" cards on `resume.html` to match — dates, merged/
  split roles, and headline stats should mirror the PDF exactly so the two
  never quietly disagree.

## Local preview

```
python3 -m http.server 8743
```

Then open `http://localhost:8743`. (Any static file server works — this is
just what's already on the machine.)

**Browser caching gotcha**: navigating to the same URL can serve a stale
cached copy of the HTML document itself, even after files change on disk —
append a throwaway query string (`?nocache=1`) or close/reopen the tab if a
change "isn't showing" in preview.

## Deploying to GitHub Pages

```
git add -A
git commit -m "Your message"
git push
```

Then in the repo: **Settings → Pages** → source set to the `main` branch.
GitHub Pages takes roughly 30–60 seconds to propagate after a push — if
something "isn't showing" on the live site right after pushing, that delay
(or the browser's own cache) is the first thing to check, not the code.
