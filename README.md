# Hafsah Zulafiqar — Portfolio

A multi-page portfolio site hosted on GitHub Pages. Light blue-to-pink-to-purple theme,
bold display headings, a company logo strip, a stats section, and case-study preview
cards linking out to full project pages. Includes an on-page chat assistant that
answers visitor questions using a fixed CV knowledge base — no backend, no API keys.

Design language modeled after abmcooks.github.io: a fixed top nav, a scrolling strip of
past-company names/logos beneath it, a bold hero statement, a stat block section, and
case-study cards that link out to dedicated project pages.

## Site map

```
Home (index.html)     → hero (centered), logo strip, stats, work preview cards,
                         "How I work" (4-step process), "What makes Hafsah different"
                         (3-item grid), footer CTA with a closing glow
About (about.html)    → bio, skills
Resume (resume.html)  → embedded/downloadable resume.pdf
Work/
  ├── dtc-meal-plans.html
  ├── b2b-coaches.html
  ├── ai-tutor-ksa.html
  ├── pura-health-redesign.html
  └── jugnu-retailer-app.html
```

The home page's layout format (centered hero, alternating-image process section, icon
grid, closing glow CTA) is modeled after a SaaS landing page reference the user shared —
adapted with this site's own light blue/pink/purple palette and content, not that
reference's dark theme or literal copy (which was product-onboarding content, not
relevant to a portfolio).

## File structure

```
portfolio-site/
├── index.html            → home page markup (edit this for hero/stats/logo copy)
├── about.html            → about page
├── resume.html           → resume page
├── work/
│   ├── dtc-meal-plans.html
│   ├── b2b-coaches.html
│   ├── ai-tutor-ksa.html
│   ├── pura-health-redesign.html
│   └── jugnu-retailer-app.html
├── styles.css             → design tokens + component styles (shared across all pages)
├── script.js              → nav state, footer year, chat assistant Q&A logic
├── resume.pdf             → add your own — not included in this repo
├── assets/
│   └── logos/             → company logo files (see Logo strip section)
└── README.md
```

## Design system

### Color palette

| Token | Hex | Usage |
|---|---|---|
| `--bg` | `#FAFAFA` | Page background |
| `--bg-alt` | `#F0F0F0` | Alternating section background (neutral light grey) |
| `--card` | `#FFFFFF` | Card / chat surfaces |
| `--text` | `#1B1730` | Primary text (deep indigo, for contrast on light bg) |
| `--text-muted` | `#6B6684` | Body copy, secondary text |
| `--primary` | `#7FB2F0` | Solid accent — hero headline, profile photo, stat rules (light blue) |
| `--secondary` | `#E28FD0` | Solid accent — chat dot, stat rules (pink) |
| `--accent` | `#A78BFA` | Solid accent — eyebrow bar, stat rules, hover states (purple) |
| `--btn-color` | `#BDE3FF` | Solid fill for every button (`.btn-primary`, `.nav-cta`) and the user's chat bubble |
| `--btn-text` | `#17142A` | Text color on `--btn-color` surfaces (buttons, the user's chat bubble) |
| `--border` | `rgba(27,23,48,0.08)` | Hairlines on cards, nav, inputs |

Blue/pink/purple, on a `#FAFAFA` page background — but **no gradients**. Every element
that used to blend two or three of these together (hero headline, hero background wash,
profile/about photos, project-card and case-study thumbnails, chat dot, the user's chat
bubble) is now a flat, single solid color instead. The two exceptions are the orb and
the closing-CTA glow, which are still `radial-gradient`s — those fade a single color to
transparent to create a soft light/blur effect, which is a different thing from blending
multiple hues together; removing the radial fade there would just leave a hard-edged
circle, not "no gradient." If that distinction turns out to be wrong, flatten those too
(`.orb` and `.section-glow::before` in `styles.css`).

A short-lived white/black/red variant, and later a dark theme, were both tried and fully
reverted — if you ever want to redo either, `git log` has them, but every hardcoded color
in this file (shadows, gradients, tag tints) needs to move with the tokens, not just the
`:root` block; a revert missed exactly that once.

All tokens are defined once in `:root` at the top of `styles.css` — change a value there
to re-theme the whole site.

### Typography

- **Display** (`--font-display`): `"Impact", "Haettenschweiler", "Arial Narrow Bold", sans-serif`
  — used for the hero headline, page titles, and stat numbers. Impact is a display-only
  font with no weight variants and inconsistent OS-level availability, so the fallback
  chain matters — test on Windows and Mac before publishing.
- **Body** (`--font-body`): DM Sans, weights 400/500/700 — used for subheadings, nav,
  body copy, and the chat UI. Loads from Google Fonts via `<link>` tags in each page's
  `<head>`.
- The hero `<h1>` is a flat solid `--accent` (purple) — it used to be a gradient
  text-fill across primary → secondary → accent, removed along with every other
  decorative gradient on the site (see Color palette above).

### Layout

- Content capped at `max-width: 1100px` via the `.wrap` class.
- Sections alternate `--bg` / `--bg-alt` for rhythm (`.section` / `.section-alt`).
- Grids (`.project-grid`, `.stat-grid`, `.logo-strip`) use auto-fit/flex-wrap with gap —
  never per-item margins.
- Buttons are pill-shaped (`border-radius: 999px`); cards use 18–22px radius. Keep that
  split — pills for actions, rounded rectangles for content containers.
- Nav is fixed/sticky at the top across all pages, same markup on every page. It's
  intentionally minimal: logo (links home) + a single "Resume" link + a "Get in touch"
  CTA (hidden on mobile to keep the capsule on one line).

### Components

- **Buttons** — `.btn-primary` is a **solid** `--btn-color` (`#BDE3FF` light blue) fill
  with dark (`--btn-text`) text, no gradient. `.nav-cta` and `.chat-send` (which extends
  `.btn-primary`) match. `.btn-outline` is the secondary style: white (`--card`)
  background, dark text, with a `--btn-color` border. Never more than one `.btn-primary`
  visible at a time in a given view.
- **Cards** — `.project-card` (work preview cards on the home page) shares the same
  border/radius/hover-lift language as `.chat-card`, but `.chat-card` itself is
  glassmorphic: `background: rgba(255,255,255,0.55)` plus `backdrop-filter: blur(22px)
  saturate(140%)`, a light border with a brighter top edge, and an inset highlight —
  so whatever sits behind it (the orb's glow, the page background) shows through,
  blurred. There's a `@supports` fallback to a solid `var(--card)` background for
  browsers without `backdrop-filter`.
- **Hero layout** — `.hero .wrap` is `display: flex; flex-direction: column;
  align-items: center; text-align: center;`, so the profile photo, headline, tagline,
  actions, and chat card all center as a column. `.chat-content` resets
  `text-align: left` so that centering doesn't cascade into the chat bubbles/input
  (it will if you add new hero children with body text — reset it the same way).
- **How I work** — `.how-steps`, four `.how-step` articles alternating image-left/
  text-right and text-left/image-right (`.how-step-reverse` swaps the grid order via
  `order`), connected by a centered vertical line (`.how-steps::before`). Each step has
  a numbered circle (`.how-number`) in an accent-colored ring. On mobile the line is
  hidden and steps stack single-column. Content is drawn from Hafsah's real skills list
  (continuous discovery, Double Diamond, CRM/growth strategy) and the FITT Meals
  case study — not invented.
- **What makes Hafsah different** — `.diff-grid`, a 3-column icon/title/description
  grid (`.diff-item`), inline SVG line icons in a rounded `.diff-icon` box. The three
  claims are all traceable to material already on the site (the design+growth hybrid
  arc, the Double Diamond/discovery process, the real stats) — keep it that way if you
  edit the copy.
- **Closing CTA glow** — `.section-glow` (applied to the `#contact` section) adds a
  large blurred single-hue `--primary` glow behind the section via `::before` (a
  `radial-gradient` fading to transparent — see the note on gradients above).
  `.section-glow .wrap` is `position: relative; z-index: 1` so content stays above
  the glow.
- **Orb** — `.orb`, a soft radial `--btn-color` glow (280px) inside `.chat-card`,
  absolutely positioned behind the card header and clipped by the card's
  `overflow: hidden` so it reads as a glow within the card rather than floating above
  it. `orb-pulse` (6s loop) both scales/fades it (pulse) and offsets it via `translate`
  (drift) in the same keyframes, so it breathes and wanders at once. Respects
  `prefers-reduced-motion`. (An earlier version used a separate drifting "pupil" child
  for an eye-like look — removed; the orb itself now carries the movement instead.)
- **Profile photo** — `.profile-photo` in the hero, above the name/kicker line.
  Currently a flat `--primary` placeholder circle (`aria-hidden`); swap in a real `<img
  src="..." alt="Hafsah Zulafiqar">` when a photo is ready, and remove the
  `aria-hidden`.
- **Hero background** — plain `var(--bg)`, same as the rest of the page. It used to be
  an animated gradient wash (`hero-gradient-shift`) cycling blue/pink behind the hero
  content — removed along with the other decorative gradients. The keyframes and
  animation are gone from `styles.css` entirely, not just hidden.
- **Logo strip** — `.marquee`, a scrolling text ticker of company names (not image
  logos — this matches the abmcooks.github.io reference itself, and avoids broken
  image icons since no logo files exist): FITT Meals, PureHealth, Kahunas, Kaso, PureCS,
  Jugnu, Mualim, Happa Studios. On the home page it sits **below** the hero/chat
  assistant section, not directly under the nav.
- **Stat block** — `.stat-grid`, three `.stat-item` blocks (large display-font number +
  small muted label underneath):
  - `146%` — Growth achieved
  - `30% → 7%` — Bounce rate reduced
  - `30%` — Increase in sales YoY

  Scroll-revealed: only "The record." heading is visible on first view; the three
  stats stay hidden until the grid scrolls into the viewport, then cascade in one at a
  time (staggered `transition-delay`). Driven by an `IntersectionObserver` in
  `script.js` that adds `.in-view` to `.stat-grid`. The hidden state is gated behind a
  `.js-ready` class added by a tiny inline script in `index.html`'s `<head>` — so if JS
  fails to load, the stats just render visible immediately (progressive enhancement,
  and avoids a flash-of-hidden-content).
- **Case-study hero image** — `.case-hero-image`, a full-bleed banner (`thumb-1`
  through `thumb-5`, same flat-color family as the home page's project-card
  thumbnails) at the very top of each `/work/*.html` page, above the breadcrumb and
  title. The floating nav overlaps its top edge deliberately (same pattern as the
  image sitting behind a nav elsewhere). It's a solid-color placeholder — swap in a
  real `<img>` per
  case study when you have one.
- **Tags/chips** — `.tags span` (role tags, tinted `--primary`) and `.chip` (chat
  suggestions, neutral until hover). Both pill-shaped, small-caps-weight text.
- **Chat assistant** — `.chat-log`, `.chat-msg-bot` / `.chat-msg-user` bubbles,
  `.chat-form`, `.chat-suggestions`. Present on the home page only. `.chat-log` has no
  fixed height or internal scrollbar — it grows with the conversation, so the card
  itself gets taller and the "Ask about Hafsah's work" header scrolls up and out of
  view with the page as messages accumulate, rather than staying pinned above a small
  scrolling box. `addMessage()` in `script.js` calls `scrollIntoView()` on each new
  message to bring it into view. See below for how its content is maintained.

## Maintaining the chat assistant

`script.js` contains a rule-based Q&A engine, not a live AI model — this keeps the site
fully static and free to host, with zero risk of it inventing facts. It works in two
parts:

- **ANSWERS** — a fixed object of pre-written response strings, one per topic (design,
  growth, projects, education, general, fallback).
- **KEYWORDS** — lists of substrings per topic. Incoming questions are lowercased and
  checked against each list in order until one matches.

To update what the assistant knows: edit the strings in `ANSWERS`. Keep every claim
traceable to your actual CV — no invented metrics or skills.

To change what triggers which answer: add or remove substrings in the matching
`KEYWORDS` list. Order matters — a question matching two lists gets the one checked
first.

To change the suggested-question chips: each `<button class="chip">` in the hero has a
`data-question="..."` attribute — that's the exact string run through the classifier
when clicked. Edit the button's visible label and/or its `data-question` independently.

If you outgrow keyword matching later, that's the point to swap in a real LLM — but that
needs a backend to hold an API key safely, a bigger step up from this static setup.

## Portfolio content guidelines

- **Hero** — headline and supporting line live at the top of `index.html`'s `<main>`:
  - Headline: "Meet Hafsah, an all-rounder."
  - Supporting line: "After working across design, strategy, marketing, and growth."
- **Logo strip** — pull company names verbatim from the CV (currently FITT Meals,
  PureHealth, Kahunas, Kaso, PureCS, Jugnu, Mualim, Happa Studios). It renders as a
  scrolling text marquee below the hero/chat section, not image logos.
- **Nav** — deliberately minimal: logo + "Resume" + "Get in touch." If you add pages
  later, decide whether they need a nav link or are better reached from the footer —
  About currently isn't linked from the top bar.
- **Stats section** — lead with the three numbers above; don't add unverified stats.
- **Work previews** — one `.project-card` per case study on the home page, each with a
  title, 1-2 sentence summary, and a link to its full page in `/work/`.
- **About** — bio paragraph(s) + a `.skills` pill list. Pull skills verbatim from the
  CV; don't pad the list with aspirational ones.
- **Resume** — drop the actual `resume.pdf` in the root folder; the download button
  already points to it.
- **Contact** — footer CTA + mailto link, consistent across all pages. Currently:
  hafsah.zulafiqar@gmail.com. Fill in real social profile URLs before publishing live
  (currently placeholders).
- **Numbers over adjectives** — every card and every chat answer should lead with a
  specific stat, not a vague claim ("led a redesign" is weaker than "led a redesign
  that lifted conversion 146%").

## Local preview

This machine doesn't have Python/Node installed, so a quick way to preview locally is
with Ruby's built-in server (already on macOS):

```
ruby -run -e httpd . -p 8000
```

Then open `http://localhost:8000`.

## Deploying to GitHub Pages

```
git init
git add index.html about.html resume.html work styles.css script.js resume.pdf README.md assets
git commit -m "Initial multi-page portfolio site"
git branch -M main
git remote add origin https://github.com/yourusername/yourusername.github.io.git
git push -u origin main
```

Then in the repo: **Settings → Pages** → set source to the `main` branch. The site goes
live at `https://yourusername.github.io` within a minute or two of each push.
