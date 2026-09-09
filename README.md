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
Home (index.html)     → hero, logo strip, stats, work preview cards, footer CTA
About (about.html)    → bio, skills
Resume (resume.html)  → embedded/downloadable resume.pdf
Work/
  ├── dtc-meal-plans.html
  ├── b2b-coaches.html
  ├── ai-tutor-ksa.html
  ├── pura-health-redesign.html
  └── jugnu-retailer-app.html
```

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
| `--bg` | `#F5F8FF` | Page background (light blue-white) |
| `--bg-alt` | `#FBF4FA` | Alternating section background (soft pink-white) |
| `--card` | `#FFFFFF` | Card / chat surfaces |
| `--text` | `#1B1730` | Primary text (deep indigo, for contrast on light bg) |
| `--text-muted` | `#6B6684` | Body copy, secondary text |
| `--primary` | `#7FB2F0` | Decorative accent — hero headline text-fill, stat rules, eyebrow bar |
| `--secondary` | `#E28FD0` | Decorative accent — hero headline text-fill, stat rules |
| `--accent` | `#A78BFA` | Decorative accent — hero headline text-fill, stat rules, hover states |
| `--btn-color` | `#BDE3FF` | Solid fill for every button (`.btn-primary`, `.btn-outline`, `.nav-cta`) and the pulsing orb |
| `--border` | `rgba(27,23,48,0.08)` | Hairlines on cards, nav, inputs |

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
- The hero `<h1>` uses a gradient text-fill (primary → secondary → accent: blue → pink
  → purple) — the site's one signature flourish. Don't reuse it elsewhere or it loses
  impact. Buttons do **not** use this gradient — see Components below.

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

- **Buttons** — `.btn-primary` is a **solid** `--btn-color` (`#BDE3FF`) fill, no
  gradient. `.nav-cta` and `.chat-send` (which extends `.btn-primary`) match.
  `.btn-outline` is the secondary style: white (`--card`) background with a `--btn-color`
  border. Never more than one `.btn-primary` visible at a time in a given view.
- **Cards** — `.project-card` (work preview cards on the home page) and `.chat-card`
  (the assistant). Same border/radius/hover-lift treatment so they read as one family.
- **Orb (the "eye")** — `.orb`, a soft radial `--btn-color` glow (280px) that pulses
  gently (`orb-pulse`), with a smaller `.orb-pupil` glossy circle centered inside it
  that drifts around on its own loop (`pupil-drift`) — reads as an eye that both
  breathes and looks around. Both respect `prefers-reduced-motion`. Lives inside
  `.chat-card`, clipped by the card's `overflow: hidden`. If you resize the orb, check
  that the pupil's center still lands inside the visible (non-clipped) region — it's
  easy to accidentally position the whole eye above the card's clip boundary.
- **Profile photo** — `.profile-photo` in the hero, above the name/kicker line.
  Currently a gradient placeholder circle (`aria-hidden`); swap in a real `<img
  src="..." alt="Hafsah Zulafiqar">` when a photo is ready, and remove the
  `aria-hidden`.
- **Hero background** — `.hero` has its own animated gradient (`hero-gradient-shift`,
  14s loop) cycling between `--primary` (light blue) and `--secondary` (pink), sitting
  behind the profile photo, headline, and chat card. Paused under
  `prefers-reduced-motion`.
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
  through `thumb-5` gradient, same family as the home page's project-card thumbnails)
  at the very top of each `/work/*.html` page, above the breadcrumb and title. The
  floating nav overlaps its top edge deliberately (same pattern as the image sitting
  behind a nav elsewhere). It's a gradient placeholder — swap in a real `<img>` per
  case study when you have one.
- **Tags/chips** — `.tags span` (role tags, tinted `--primary`) and `.chip` (chat
  suggestions, neutral until hover). Both pill-shaped, small-caps-weight text.
- **Chat assistant** — `.chat-log`, `.chat-msg-bot` / `.chat-msg-user` bubbles,
  `.chat-form`, `.chat-suggestions`. Present on the home page only. See below for how
  its content is maintained.

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
  - Headline: "Meet Hafsah, a rare hybrid."
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
