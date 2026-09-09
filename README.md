# Hafsah Zulafiqar — Portfolio

This portfolio runs as a multi-page site on GitHub Pages. It uses a light
blue-to-pink-to-purple theme, bold display headings, a company logo strip, a stats
section, and case-study preview cards that link out to full project pages. It also
includes an on-page chat assistant that answers visitor questions using a fixed CV
knowledge base — no backend, no API keys.

The design language follows abmcooks.github.io: a fixed top nav, a scrolling strip of
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
grid, closing glow CTA) follows a SaaS landing page reference you shared. It keeps this
site's own light blue/pink/purple palette and content, not that reference's dark theme
or literal copy — that copy covered product onboarding, which doesn't fit a portfolio.

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
├── resume.pdf             → add your own — this repo doesn't include it
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

This project briefly tried a white/black/red palette, then a dark theme, and fully
reverted both — `git log` has them if you ever want to redo either. But every hardcoded
color in this file (shadows, gradients, tag tints) needs to move with the tokens, not
just the `:root` block; one revert missed exactly that.

`:root` at the top of `styles.css` defines all tokens once — change a value there to
re-theme the whole site.

### Typography

- **Display** (`--font-display`): `"Impact", "Haettenschweiler", "Arial Narrow Bold", sans-serif`
  — used for the hero headline, page titles, and stat numbers. Impact is a display-only
  font with no weight variants and inconsistent OS-level availability, so the fallback
  chain matters — test on Windows and Mac before publishing.
- **Body** (`--font-body`): DM Sans, weights 400/500/700 — used for subheadings, nav,
  body copy, and the chat UI. Loads from Google Fonts via `<link>` tags in each page's
  `<head>`.
- The hero `<h1>` is a flat solid `--accent` (purple). It used to be a gradient
  text-fill across primary → secondary → accent; this pass flattened it along with
  every other decorative gradient on the site (see Color palette above).

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
- **Rotating role word** — the headline reads "Meet Hafsah, the `<span
  id="role-word">`" so the swapped word never needs its own article ("a" vs. "an"
  would otherwise have to change per word). A script in `script.js` cycles
  `#role-word`'s text through Designer → Thinker → Marketeer → Strategist →
  All-Rounder → repeat, every 1.8s, with a `.swap` class that triggers a quick
  fade-and-rise transition (`.role-word` / `.role-word.swap` in `styles.css`) around
  each change. Skips entirely under `prefers-reduced-motion`, leaving whatever word
  is already in the HTML (currently "All-Rounder") static — no partial-motion
  fallback, since a word that keeps changing without the transition to soften it
  would arguably be worse for motion-sensitive readers than not changing at all. To
  edit the word list or timing, edit the `words` array or the two delays (220ms
  swap, 1800ms hold) in that block of `script.js`.
  **Fixed width, so only the word swaps in place.** The words range from 8
  characters ("Designer") to 11 ("All-Rounder"), and since they're rendered in a
  proportional font (not monospace), a naive swap would resize `#role-word` on
  every change and nudge the closing period — and the whole centered headline —
  left and right. `script.js` measures all five words in the element's own font
  on load (writing each one in, reading `getBoundingClientRect().width`, taking
  the max) and locks `#role-word` to that pixel width via inline `style.width`
  before starting the rotation. `.role-word` is `display: inline-block; text-align:
  left` in `styles.css` so the word sits at a fixed start position inside that
  locked box regardless of length.
- **How I work** — `.how-steps`, four `.how-step` articles alternating image-left/
  text-right and text-left/image-right (`.how-step-reverse` swaps the grid order via
  `order`); a centered vertical line (`.how-steps::before`) connects them. Each step has
  a numbered circle (`.how-number`) in an accent-colored ring. On mobile the line
  disappears and steps stack single-column. The copy pulls from Hafsah's real skills
  list (continuous discovery, Double Diamond, CRM/growth strategy) and the FITT Meals
  case study — nothing invented.
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
- **Orb** — `.orb`, a soft radial `--btn-color` glow (280px) inside `.chat-card`. It
  sits absolutely positioned behind the card header; the card's `overflow: hidden`
  clips it, so it reads as a glow within the card rather than floating above it.
  `orb-pulse` (6s loop) both scales/fades it (pulse) and offsets it via `translate`
  (drift) in the same keyframes, so it breathes and wanders at once. It respects
  `prefers-reduced-motion`. (An earlier version used a separate drifting "pupil" child
  for an eye-like look; this pass removed it, and the orb itself now carries the
  movement instead.)
- **Profile photo** — `.profile-photo` in the hero, above the name/kicker line.
  Currently a flat `--primary` placeholder circle (`aria-hidden`); swap in a real `<img
  src="..." alt="Hafsah Zulafiqar">` when a photo is ready, and remove the
  `aria-hidden`.
- **Hero background** — plain `var(--bg)`, same as the rest of the page. It used to be
  an animated gradient wash (`hero-gradient-shift`) cycling blue/pink behind the hero
  content; this pass removed it along with the other decorative gradients. The
  keyframes and animation no longer exist in `styles.css` at all, not just hidden.
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

  Scroll-revealed: only "The record." heading shows on first view; the three stats
  stay hidden until the grid scrolls into the viewport, then cascade in one at a time
  (staggered `transition-delay`). An `IntersectionObserver` in `script.js` drives this
  — it adds `.in-view` to `.stat-grid` once the grid comes into view. A tiny inline
  script in `index.html`'s `<head>` adds a `.js-ready` class that gates the hidden
  state, so if JS fails to load, the stats just render visible immediately
  (progressive enhancement — it also avoids a flash-of-hidden-content).
- **Case-study hero image** — `.case-hero-image`, a full-bleed banner (`thumb-1`
  through `thumb-5`, same flat-color family as the home page's project-card
  thumbnails) at the very top of each `/work/*.html` page, above the breadcrumb and
  title. The floating nav overlaps its top edge deliberately (same pattern as the
  image sitting behind a nav elsewhere). It's a solid-color placeholder — swap in a
  real `<img>` per case study when you have one.
- **Case-study visual placeholders** — `.case-compare` (side-by-side before/after or
  A/B variant boxes, `.case-compare-shot` + `.case-compare-label`) and `.case-gallery`
  (a grid of smaller screen placeholders, `.case-gallery-shot`). Unlike the colorful
  `thumb-N` placeholders, these use a neutral `--bg-alt` fill with a **dashed** border
  specifically so they read as "empty, swap in a real screenshot" rather than as
  intentional decoration. `.case-prose` caps a text block at 720px for readability —
  it sits between the wider (1100px, from `.wrap`) visual blocks so paragraphs don't
  stretch full-width while galleries do. This pattern first appeared on the PureCS/Pura
  case study (`pura-health-redesign.html`), matching a richer, Behance-style
  case-study format (brief → before/after → design system → key flows →
  experimentation → result). Apply the same pattern to the other four case studies if
  you want them in this format too, and swap the placeholder divs for real `<img>`
  tags once you have the actual screens.

  **Watch the shorthand `padding` property here.** `.wrap` sets `padding: 0 24px` for
  the site's horizontal margins; if a class combined onto the same element (like
  `.case-body` or `.case-nav`) later sets its own `padding: Xpx 0 Ypx` shorthand, that
  three-value form sets left/right padding to `0` too — silently overwriting `.wrap`'s
  24px and pulling that element flush to the edge, with no error and no visual cue
  except comparing bounding-box positions against a sibling element. This actually
  happened (`.case-body` and `.case-nav` both did it), and it's why case-study
  paragraphs and images briefly sat at the edge instead of aligned with the rest of
  the site. Fixed now — both rules use `padding-top`/`padding-bottom` only, leaving
  `.wrap`'s horizontal padding alone — but if a case-study page's content ever looks
  misaligned again, check for this exact pattern before anything else: grep
  `styles.css` for `padding:` shorthand on any class that appears combined with
  `wrap` in the HTML (`grep -n 'class="wrap ' *.html work/*.html` finds the
  combinations; check each of those classes' own `padding` rule for a 3- or 4-value
  shorthand).
- **Real case-study images** — `.case-compare-img` (a single full-width `<img>`,
  replacing a `.case-compare-shot` placeholder pair) and `.case-design-system` (a
  single wide reference image in a horizontally-scrolling container). PureCS/Pura
  uses both already: `assets/purecs/hero-compare/old.png` + `.../new.png` for the
  "Old vs. new" section, and `assets/purecs/design-system.png` for "Design system."
  `.case-design-system` scrolls horizontally rather than shrinking to fit — on mobile
  it holds the image at a fixed legible height (`480px`) instead of scaling it down to
  viewport width, so dense reference sheets (small text, many components) stay
  readable; the container scrolls instead of the image shrinking into mush. Apply the
  same treatment (a wide, detailed reference image) to any other case study that
  needs it.
- **Clickable flow tabs** — `.case-flow-tags` is a real `role="tablist"` of buttons
  (not static pills), each with `aria-controls` linking it to a
  `.case-flow-panel[role="tabpanel"]`. A generic tab-switcher in `script.js` toggles
  the `hidden` attribute so only the selected tab's panel shows — it works on any
  `[role="tablist"]`, so it's safe to reuse elsewhere and it no-ops on pages without
  one. Each panel holds a `.case-flow-columns` (Old / New) with a `.case-flow-shots`
  row per side — `flex-wrap: wrap`, **not** a horizontal scroll (an earlier version
  used `overflow-x: auto`; the request explicitly asked for everything visible at
  once instead of a scroll strip, so all screenshots wrap onto as many rows as they
  need). Each image sets a fixed height (not width), so mixed-count old/new sets
  still line up. All three tabs use real screenshots: "Sign up & sign in"
  (`assets/purecs/signup/`, 6 old + 6 new), "Goal & dual completion"
  (`assets/purecs/goal-completion/`, 6 + 6), and "Pure Score"
  (`assets/purecs/purescore/`, 5 + 5) — this tab's real name changed once the folder
  arrived; the deck reference this case study followed called it "Kids score," but
  the actual screens are about calculating a personal "Pura Score," not anything
  kid-specific, so the tab label and folder name both reflect what the screens
  actually show. A fourth tab ("Subscription & pricing") existed as a placeholder
  earlier; it's gone now — nobody supplied those screenshots, so it got removed
  rather than left empty. Check the existing asset folders for new additions before
  assuming a set is final; screenshots have shown up in batches across multiple
  sessions.

  **The `old`/`new` folder names on disk were correct all along — trust them.**
  The files came from folders literally named `old` and `new`, and every `old`
  folder file shows the *original* PureCS app (the "PURA+" wordmark, the
  Mobility/Recovery/Challenges/Fit Coins tab bar), while every `new` folder file
  shows the *redesigned* app (no wordmark, no tab bar — cleaner components like
  the calendar-strip goal dashboard and the plain "Calculate Pure Score" flow).
  This applies to `hero-compare/`, `signup/`, `goal-completion/`, and
  `purescore/` alike. A mid-project pass briefly "corrected" this on a wrong
  heuristic (assuming the PURA+ wordmark meant *new*) and swapped every folder's
  contents, which broke `hero-compare` too even though it had never been touched
  before — the giveaway that the heuristic, not the original folder names, was
  the actual bug. That swap was reverted; the folder contents now match their
  names again. If a fourth flow folder shows up, trust its `old`/`new` naming by
  default and only second-guess it if the screens visibly contradict the label
  (e.g. an "old" folder full of clearly newer-looking UI).
- **Real hero photo** — `.thumb-purecs-hero` (`assets/purecs/hero.png`, a wide
  three-phone composite) replaces the flat `thumb-4` color on both the home page's
  PureCS card and the case-study page's `.case-hero-image` banner. Because CSS
  `url()` paths resolve against the stylesheet's own location (project root), not the
  page that includes it, this one rule works correctly from both `index.html` (root)
  and `work/pura-health-redesign.html` (one level down) without needing a different
  path per page.
- **Case-study image assets** — live under `assets/<case-study>/<flow>/<old|new>/`
  (e.g. `assets/purecs/signup/old/1.png`) — sequential numbers, not the original
  export filenames, so ordering stays predictable regardless of source.
- **Tags/chips** — `.tags span` (role tags, tinted `--primary`) and `.chip` (chat
  suggestions, neutral until hover). Both pill-shaped, small-caps-weight text.
- **Chat assistant** — `.chat-log`, `.chat-msg-bot` / `.chat-msg-user` bubbles,
  `.chat-form`, `.chat-suggestions`. Present on the home page only. `.chat-log` has no
  fixed height or internal scrollbar — it grows with the conversation, so the card
  itself gets taller and the "Ask about Hafsah's work" header scrolls up and out of
  view with the page as messages accumulate, rather than staying pinned above a small
  scrolling box. `addMessage()` in `script.js` calls `scrollIntoView()` on each new
  message to bring it into view. See "Maintaining the chat assistant" below for how
  to keep its content up to date.

## Maintaining the chat assistant

`script.js` contains a rule-based Q&A engine, not a live AI model — this keeps the site
fully static and free to host, with zero risk of it inventing facts. It works in two
parts:

- **ANSWERS** — a fixed object of pre-written response strings, one per topic (design,
  growth, projects, education, general, fallback).
- **KEYWORDS** — lists of substrings per topic. The classifier lowercases each
  incoming question and checks it against each list in order until one matches.

To update what the assistant knows: edit the strings in `ANSWERS`. Keep every claim
traceable to your actual CV — no invented metrics or skills.

To change what triggers which answer: add or remove substrings in the matching
`KEYWORDS` list. Order matters — a question matching two lists gets the one checked
first.

To change the suggested-question chips: each `<button class="chip">` in the hero has a
`data-question="..."` attribute — that's the exact string the classifier processes
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
  later, decide whether they need a nav link, or whether the footer is a better place
  for them — the top bar currently doesn't link to About.
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
