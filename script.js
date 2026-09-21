// Footer year — present on every page.
var yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Locked case study modal. #lock-modal appears on two pages with different
// triggers: on index.html it opens when a .project-card.locked link is
// clicked (currently just Jugnu); on the Jugnu case-study page itself it
// opens automatically on load via its data-auto-open attribute, and every
// way of dismissing it (backdrop, close button, Escape) sends the visitor
// back to the homepage instead of ever revealing the page underneath.
(function () {
  var modal = document.getElementById('lock-modal');
  if (!modal) return;

  var redirectTo = modal.getAttribute('data-auto-open');

  function openModal() {
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    if (redirectTo) {
      window.location.href = redirectTo;
      return;
    }
    modal.hidden = true;
    document.body.style.overflow = '';
  }

  modal.querySelectorAll('[data-lock-close]').forEach(function (el) {
    el.addEventListener('click', closeModal);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.hidden) closeModal();
  });

  if (redirectTo) openModal();

  document.querySelectorAll('.project-card.locked .project-link').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      openModal();
    });
  });
})();

// Hero role word (home page only): cycles Designer. → Thinker. → Marketeer. →
// Strategist. → All-Rounder. → repeat, with a quick fade+rise swap. The full
// stop lives inside the span (not after it in the HTML), so it swaps in and
// out together with each word instead of sitting fixed in place. The span is
// locked to the width of its widest word first, so the swap never nudges the
// surrounding headline text. Skips entirely under prefers-reduced-motion,
// leaving the static initial word.
(function () {
  var el = document.getElementById('role-word');
  if (!el) return;

  var words = ['Designer.', 'Thinker.', 'Marketeer.', 'Strategist.', 'All-Rounder.'];

  // Measure every word in the element's own font, then lock the span to the
  // widest one so the headline never shifts.
  var maxWidth = 0;
  words.forEach(function (word) {
    el.textContent = word;
    maxWidth = Math.max(maxWidth, el.getBoundingClientRect().width);
  });
  el.style.width = Math.ceil(maxWidth) + 'px';

  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.textContent = 'All-Rounder.';
    return;
  }

  var i = words.indexOf('All-Rounder.');
  el.textContent = words[i];

  setInterval(function () {
    el.classList.add('swap');
    setTimeout(function () {
      i = (i + 1) % words.length;
      el.textContent = words[i];
      el.classList.remove('swap');
    }, 220);
  }, 1800);
})();

// Generic tab switcher for [role="tablist"] groups (currently: the "Key flows
// redesigned" tabs on case-study pages). No-ops on pages without one.
(function () {
  var tablists = document.querySelectorAll('[role="tablist"]');
  tablists.forEach(function (tablist) {
    var tabs = tablist.querySelectorAll('[role="tab"]');
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) {
          var selected = t === tab;
          t.setAttribute('aria-selected', selected ? 'true' : 'false');
          var panel = document.getElementById(t.getAttribute('aria-controls'));
          if (panel) panel.hidden = !selected;
        });
      });
    });
  });
})();

// Scroll-reveal for "The record." stats (home page only). The grid stays
// hidden (via the .js-ready CSS gate) until it scrolls into view, then the
// three stat items cascade in one at a time via staggered transition-delay.
(function () {
  var grid = document.querySelector('.stat-grid');
  if (!grid || typeof IntersectionObserver === 'undefined') return;
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        grid.classList.add('in-view');
        observer.unobserve(grid);
      }
    });
  }, { threshold: 0.35 });
  observer.observe(grid);
})();

// Scroll-reveal for "How I work" (home page only). Each numbered bubble is
// observed independently (unlike the stat grid's single shared observer), so
// they pop in one at a time as the visitor scrolls down past each one, rather
// than all four appearing together.
(function () {
  var steps = document.querySelectorAll('.how-step');
  if (!steps.length || typeof IntersectionObserver === 'undefined') return;
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  steps.forEach(function (step) { observer.observe(step); });
})();

// Rule-based Q&A over Hafsah's CV (home page only). Answers are fixed templates
// built only from the knowledge base below — nothing is generated or invented.
(function () {
  var log = document.getElementById('chat-log');
  if (!log) return;

  var ANSWERS = {
    design:
      "Hafsah's product design background spans Kahunas, Kaso, PureCS, and Jugnu. At Kahunas she ran a full UX audit of the GTM app and led a redesign targeting 50% user growth; at PureCS she led the Pura app redesign, improving user satisfaction by 60% through A/B testing, focus groups, and the Double Diamond methodology; at Jugnu she led a 3-month UX overhaul of the Retailer app that drove a 60% increase in user acquisition. As CX & Design Manager at FITT Meals she also improved conversion by 146% and cut bounce rate from 28% to 7%. Take a look at the FITT Meals and PureCS case studies below.",
    growth:
      "As Growth & Marketing Manager at FITT Meals, Hafsah drove 30% growth against YoY targets — the highest revenue and customer numbers in company history — while leading a 3-person team. Her social media strategy grew sales from social by 400% and added 500+ followers in a single month, and her CRM lifecycle redesigns (winback, expiry, welcome flows) lifted winback by 20%. Check out the FITT Meals case study below for more detail.",
    projects:
      "Hafsah's case studies cover five projects: FITT Meals (DTC meal plans — design manager to growth manager arc), Kahunas (B2B coaching app UX audit and redesign), Mualim (AI tutor for kids, KSA — design consulting), the Pura health app redesign at PureCS, and the Jugnu retailer app overhaul. Each one is written up in full below, with the real process and results behind it.",
    general:
      "Hafsah is a rare hybrid: she started as a product designer, moved into CX & design leadership, and was promoted into growth & marketing management — all within FITT Meals. That arc means she designs the experience and grows the numbers behind it: 146% conversion improvement as design manager, then 30% YoY growth and 400% social sales growth as growth manager. See the FITT Meals case study below for the full journey.",
    education:
      "Hafsah holds a Bachelor's in Product Design from the National College of Arts (2017–2020), graduating with Distinction and a 3.7 GPA. She has also completed certifications in AI for Designers (2024), UX Strategy (2023), and Design Thinking (2023), plus Human-Computer Interaction through IXDF (2022), and is working toward a Certified Usability Analyst certification with Human Factors International. See her experience below for how she's applied that training.",
    fallback:
      "I can only answer using what's in Hafsah's CV — try asking about her product design work, her growth & marketing results at FITT Meals, her case studies, her education, or why she'd be a strong hire. For anything else, reach her directly via the contact link below."
  };

  var KEYWORDS = {
    education: ['education', 'degree', 'university', 'college', 'certificat', 'certified', 'qualif', 'gpa', 'distinction', 'study', 'studied', 'school'],
    general: ['hire', 'why', 'background', 'overview', 'fit', 'hybrid', 'who is', 'tell me about', 'about hafsah', 'summary'],
    projects: ['project', 'case stud', 'portfolio', 'show me your work', 'examples of', 'mualim', 'ai tutor'],
    growth: ['growth', 'marketing', 'crm', 'social', 'acquisition', 'revenue', 'sales', 'lifecycle', 'winback', 'campaign', 'followers', 'brand', 'grow'],
    design: ['design', 'ux', 'ui', 'research', 'prototyp', 'wirefram', 'usab', 'persona', 'discovery', 'diamond', 'conversion', 'bounce', 'cx', 'a/b', 'test']
  };

  function classify(question) {
    var q = question.toLowerCase();
    var order = ['education', 'general', 'projects', 'growth', 'design'];
    for (var i = 0; i < order.length; i++) {
      var topic = order[i];
      if (KEYWORDS[topic].some(function (k) { return q.includes(k); })) return topic;
    }
    return 'fallback';
  }

  var form = document.getElementById('chat-form');
  var input = document.getElementById('chat-input');

  function addMessage(text, sender) {
    var row = document.createElement('div');
    row.className = sender === 'user' ? 'chat-msg chat-msg-user' : 'chat-msg chat-msg-bot';
    var p = document.createElement('p');
    p.textContent = text;
    row.appendChild(p);
    log.appendChild(row);
    // The log grows with the card now instead of scrolling internally, so
    // bring the new message into view on the page itself.
    row.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }

  function ask(question) {
    var trimmed = question.trim();
    if (!trimmed) return;
    addMessage(trimmed, 'user');
    var intent = classify(trimmed);
    setTimeout(function () { addMessage(ANSWERS[intent], 'bot'); }, 350);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    ask(input.value);
    input.value = '';
  });

  document.querySelectorAll('.chip').forEach(function (chip) {
    chip.addEventListener('click', function () { ask(chip.getAttribute('data-question')); });
  });
})();

// Home-page work stack (".work-stack .work-stack-card" — see styles.css):
// the stacking/overlap itself is pure CSS (position: sticky with a staggered
// `top` per card), so it works with zero JS. This just adds a "shuffle" depth
// cue on top of that: once a later card has scrolled up and is sitting on
// top of an earlier one, the covered card scales down and dims slightly, so
// the deck reads as having real depth rather than flat overlapping rectangles.
// Skipped entirely under prefers-reduced-motion, same as the other
// scroll-driven effects on this page — the plain sticky stack still works
// fine without it, just without the scale/dim.
(function () {
  var cards = Array.prototype.slice.call(document.querySelectorAll('.work-stack .work-stack-card'));
  if (!cards.length) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var ticking = false;

  function update() {
    ticking = false;
    var stuck = cards.map(function (card) {
      var top = parseFloat(getComputedStyle(card).top) || 0;
      return card.getBoundingClientRect().top <= top + 1;
    });
    cards.forEach(function (card, i) {
      if (!stuck[i]) {
        card.style.transform = '';
        card.style.filter = '';
        return;
      }
      var behind = 0;
      for (var j = i + 1; j < cards.length; j++) {
        if (stuck[j]) behind++;
      }
      var scale = Math.max(0.92, 1 - behind * 0.025);
      var dim = Math.max(0.75, 1 - behind * 0.07);
      card.style.transform = 'scale(' + scale + ')';
      card.style.filter = 'brightness(' + dim + ')';
    });
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
})();

// "Thinking orb" above the chat card (home page only): a sphere built from
// small dots spread evenly across its surface (a Fibonacci sphere — the
// standard way to distribute N points roughly uniformly over a sphere),
// rotated a little more each frame and re-projected to 2D. Dots further
// around the back (lower z after rotation) are drawn smaller and fainter
// so the whole thing reads as a solid rotating 3D orb of particles rather
// than a flat pattern. Draws one static frame under prefers-reduced-motion
// instead of animating.
(function () {
  var canvas = document.querySelector('.thinking-orb-canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  if (!ctx) return;

  var POINT_COUNT = 140;
  var points = [];
  var offset = 2 / POINT_COUNT;
  var increment = Math.PI * (3 - Math.sqrt(5));
  for (var i = 0; i < POINT_COUNT; i++) {
    var y = (i * offset) - 1 + offset / 2;
    var r = Math.sqrt(Math.max(0, 1 - y * y));
    var phi = i * increment;
    points.push([Math.cos(phi) * r, y, Math.sin(phi) * r]);
  }

  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var size = 0;

  function resize() {
    size = canvas.clientWidth;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize);

  var angle = 0;
  var t = 0;

  function draw() {
    var cx = size / 2;
    var cy = size / 2;
    var radius = size * 0.46;
    var pulse = 1 + Math.sin(t) * 0.03;
    var cos = Math.cos(angle);
    var sin = Math.sin(angle);

    ctx.clearRect(0, 0, size, size);

    var rotated = points.map(function (p) {
      return [p[0] * cos + p[2] * sin, p[1], -p[0] * sin + p[2] * cos];
    });
    // Back-to-front so nearer dots draw over farther ones.
    rotated.sort(function (a, b) { return a[2] - b[2]; });

    rotated.forEach(function (p) {
      var depth = (p[2] + 1) / 2;
      var dotRadius = (0.7 + depth * 1.3) * (size / 64);
      var alpha = 0.2 + depth * 0.75;
      var px = cx + p[0] * radius * pulse;
      var py = cy + p[1] * radius * pulse;
      ctx.beginPath();
      ctx.fillStyle = 'rgba(79,125,243,' + alpha + ')';
      ctx.arc(px, py, dotRadius, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    draw();
    return;
  }

  function loop() {
    angle += 0.01;
    t += 0.04;
    draw();
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();

// Case studies (home page only, ".case-studies" — see styles.css). All 3
// cards already carry their own full real content in the HTML and are
// stacked normally by default — that's what no-JS/reduced-motion
// visitors get. When motion is allowed, this adds .is-pinned (CSS then
// makes the section 3x the viewport tall and stacks the cards on top of
// each other) and just toggles which card has .active as the user
// scrolls, plus keeps the shared counter's number in sync — matching
// georgegeo.vercel.app's actual deck (each slide is a self-contained
// absolutely-stacked unit crossfading via a class toggle, confirmed by
// inspecting its DOM — not a shared text panel with a separately
// animated image).
(function () {
  var section = document.querySelector('.case-studies');
  var cards = document.querySelectorAll('.case-studies-card');
  var currentEl = document.querySelector('.case-studies .cs-current');
  if (!section || !cards.length) return;
  // Below 760px the cards already read fine as a plain stacked column
  // (see the mobile media query) and there isn't room for a pinned,
  // scroll-jacked deck; reduced-motion visitors get the same fallback.
  // Both are re-checked live (resize, rotate, preference change) so a page
  // loaded wide and then narrowed doesn't stay pinned and overlap.
  var mqSmall = window.matchMedia('(max-width: 760px)');
  var mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  function pinnedAllowed() { return !mqSmall.matches && !mqReduce.matches; }

  var activeIndex = 0;
  var ticking = false;

  // Each card carries its position relative to the active one, not just
  // whether it's active — the image needs to know which way to fly
  // (already-shown cards rest above/"is-before", not-yet-shown cards rest
  // below/"is-after") so the exit and entry motions can go in opposite
  // directions instead of mirroring each other. The text stays put and
  // just crossfades with the card's own opacity transition.
  function classify() {
    cards.forEach(function (card, i) {
      card.classList.toggle('active', i === activeIndex);
      card.classList.toggle('is-before', i < activeIndex);
      card.classList.toggle('is-after', i > activeIndex);
    });
  }
  function update() {
    ticking = false;
    if (!section.classList.contains('is-pinned')) return;
    var rect = section.getBoundingClientRect();
    var scrollable = rect.height - window.innerHeight;
    var progress = scrollable > 0 ? Math.min(1, Math.max(0, -rect.top / scrollable)) : 0;
    var index = Math.round(progress * (cards.length - 1));
    if (index === activeIndex) return;
    activeIndex = index;
    classify();
    if (currentEl) currentEl.textContent = activeIndex + 1;
  }
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  function sync() {
    var on = pinnedAllowed();
    section.classList.toggle('is-pinned', on);
    if (on) { activeIndex = -1; update(); }
  }
  [mqSmall, mqReduce].forEach(function (mq) {
    if (mq.addEventListener) mq.addEventListener('change', sync); else mq.addListener(sync);
  });
  sync();
})();

// Hero icon row (home page only, ".hero-circles" — see styles.css): writes
// one --progress custom property (0 at the top of the page, 1 by
// HERO_SCROLL_RANGE px down) onto the container; every icon's CSS transform
// reads it to spread from the condensed, overlapping stack to an evenly
// spaced row. Under prefers-reduced-motion CSS pins --progress to 1.
// The range is short because the row sits right under the nav capsule and
// scrolls out from behind it after ~120px.
(function () {
  var circles = document.querySelector('.hero-circles');
  if (!circles) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var HERO_SCROLL_RANGE = 110;
  var ticking = false;

  function update() {
    ticking = false;
    circles.style.setProperty('--progress', Math.min(1, Math.max(0, window.scrollY / HERO_SCROLL_RANGE)));
  }
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }, { passive: true });
  update();
})();

// Testimonial carousel (home page only, ".testimonial-carousel"): swaps
// which .testimonial-slide has the .active class (CSS shows only that
// one). Slide 1 is marked active in the markup, so nothing here is
// required just to read the first testimonial — this only wires up the
// prev/next buttons to cycle, wrapping around at either end.
(function () {
  var slides = document.querySelectorAll('.testimonial-slide');
  var prevBtn = document.querySelector('.testimonial-prev');
  var nextBtn = document.querySelector('.testimonial-next');
  if (!slides.length || !prevBtn || !nextBtn) return;

  var index = 0;
  function show(newIndex) {
    index = (newIndex + slides.length) % slides.length;
    slides.forEach(function (slide, i) {
      slide.classList.toggle('active', i === index);
    });
  }
  prevBtn.addEventListener('click', function () { show(index - 1); });
  nextBtn.addEventListener('click', function () { show(index + 1); });
})();

// "Going above and beyond" (home page only, "#beyond-carousel"): no
// buttons, no drag — the track just drifts horizontally in lockstep with
// scroll position. Progress is 0 when the section's top just enters the
// bottom of the viewport and 1 once its bottom has passed the top of the
// viewport, so the drift plays out over exactly the scroll distance the
// section itself occupies, not a separate pinned range like the case
// studies section. Skipped under prefers-reduced-motion (track stays at
// its default position — every card is still reachable via normal page
// scroll, nothing here is required to see them).
(function () {
  var section = document.getElementById('beyond-carousel');
  var track = document.getElementById('beyond-track');
  if (!section || !track) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var ticking = false;

  function update() {
    ticking = false;
    var rect = section.getBoundingClientRect();
    var total = rect.height + window.innerHeight;
    var progress = Math.min(1, Math.max(0, (window.innerHeight - rect.top) / total));
    var maxShift = track.scrollWidth - section.clientWidth;
    if (maxShift <= 0) {
      track.style.transform = 'none';
      return;
    }
    track.style.transform = 'translateX(-' + (progress * maxShift) + 'px)';
  }
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
})();

// Survey demographic bar chart (case-study pages, ".case-chart-bar-fill" —
// see styles.css): each bar's real/final width is already set inline via
// --pct, so a no-JS or reduced-motion visitor sees the real chart at rest.
// Here, JS drops every bar to 0 width, then uses an IntersectionObserver to
// grow it back to its real --pct once the chart scrolls into view — a
// one-shot "enter" animation rather than a continuous scroll-position
// mapping, since there's nothing to interpolate between once it's in view.
(function () {
  var bars = document.querySelectorAll('.case-chart-bar-fill');
  if (!bars.length) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!('IntersectionObserver' in window)) return;

  bars.forEach(function (bar) { bar.classList.add('animate-in'); });

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.remove('animate-in');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.4 });

  bars.forEach(function (bar) { observer.observe(bar); });
})();

// Case-study sidebar jump nav (".case-sidebar-nav", see styles.css): marks
// the link for whichever section is currently at the top of the viewport
// as .active, so the highlight follows the reader instead of staying on
// "Overview". Links are plain anchors, so with no JS they still work —
// only the highlight needs this.
(function () {
  var links = Array.prototype.slice.call(document.querySelectorAll('.case-sidebar-nav a[href^="#"]'));
  if (!links.length) return;
  var targets = links.map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); });
  var ticking = false;

  function setActive(index) {
    links.forEach(function (a, i) { a.classList.toggle('active', i === index); });
  }
  function update() {
    ticking = false;
    var current = 0;
    targets.forEach(function (el, i) {
      if (el && el.getBoundingClientRect().top <= 140) current = i;
    });
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) current = links.length - 1;
    setActive(current);
  }
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
})();

// Hero 3D block grid (home page only, ".grid-scene" — see styles.css).
// Wide slabs on a tilted plane seen from a low camera. Each cell is a static
// hit target at z=0; the block inside it rises on a per-block spring while
// hovered, revealing a blue floor glow beneath it. One rAF loop runs only
// while something is still moving, and an idle wave keeps the page alive.
// Under prefers-reduced-motion nothing moves: hover just fades the glow.
(function () {
  var scene = document.querySelector('.grid-scene');
  if (!scene) return;
  var hero = scene.parentElement;
  var plane = scene.querySelector('.grid-plane');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) scene.classList.add('is-reduced');

  // Rise is quick and near-critically damped; the fall is softer and lets the
  // block touch down with a small rebound (RESTITUTION) instead of a bounce.
  var RISE = { k: 220, c: 24 }, FALL = { k: 100, c: 13 };
  var RESTITUTION = 0.28;
  var IDLE_MS = 3000, WAVE_EVERY = 8000, WAVE_MS = 3600;

  var cells = [], cols = 0, rows = 0, maxLift = 64;
  var active = -1, running = false, last = 0;
  var idleTimer = 0, waveStart = 0;

  function cssPx(name) { return parseFloat(getComputedStyle(scene).getPropertyValue(name)); }

  function build() {
    var vw = hero.clientWidth, vh = hero.clientHeight;
    if (!vw || !vh) return;
    plane.textContent = ''; cells = [];
    var gap = cssPx('--gap'), bw = cssPx('--block-w'), bd = cssPx('--block-d');
    var size = Math.ceil(2.2 * Math.max(vw, vh));
    if (vw < 760) { // fewer, larger blocks on phones
      bw = vw * 0.42 - gap; bd = bw / 2.4;
      scene.style.setProperty('--block-w', bw + 'px'); scene.style.setProperty('--block-d', bd + 'px');
    } else { scene.style.removeProperty('--block-w'); scene.style.removeProperty('--block-d'); }
    maxLift = cssPx('--lift-max');
    var pw = bw + gap, pd = bd + gap, depth = size * 2.6; // long far side so rows recede to the horizon
    cols = Math.ceil(size / pw); rows = Math.ceil(depth / pd);
    var W = cols * pw, H = rows * pd;
    plane.style.width = W + 'px'; plane.style.height = H + 'px';
    plane.style.marginLeft = -W / 2 + 'px'; plane.style.marginTop = -H / 2 + 'px';

    var frag = document.createDocumentFragment();
    for (var r = 0; r < rows; r++) for (var c = 0; c < cols; c++) {
      var el = document.createElement('div');
      el.className = 'grid-cell';
      el.style.cssText = 'left:' + c * pw + 'px;top:' + r * pd + 'px;width:' + pw + 'px;height:' + pd + 'px';
      el.innerHTML = '<i class="grid-glow"></i><div class="grid-block"><i class="grid-top"></i><i class="grid-front"></i><i class="grid-side"></i></div>';
      frag.appendChild(el);
      cells.push({ el: el, c: c, r: r, glow: el.firstChild, block: el.lastChild,
        top: el.lastChild.children[0], front: el.lastChild.children[1],
        lift: 0, v: 0, target: 0, shown: 0 });
    }
    plane.appendChild(frag);

    // Drop cells that project entirely off the hero so we animate ~200-300.
    var hb = hero.getBoundingClientRect(), keep = [], m = 220, rects = cells.map(function (o) { return o.el.getBoundingClientRect(); });
    cells.forEach(function (o, i) {
      var b = rects[i];
      var off = !b.width || b.width > 4 * vw || b.height < 2.5 || b.bottom < hb.top - m || b.top > hb.bottom + m || b.right < hb.left - m || b.left > hb.right + m;
      if (off) o.el.remove(); else keep.push(o);
    });
    cells = keep;
    for (var i = 0; i < cells.length; i++) cells[i].el._i = i;
    active = -1;
  }

  function write(o) {
    if (Math.abs(o.lift - o.shown) < 0.0008 && o.lift !== 0) return;
    o.shown = o.lift;
    var l = o.lift < 0 ? 0 : o.lift;
    o.block.style.transform = 'translate3d(0,0,' + (l * maxLift).toFixed(2) + 'px)';
    o.glow.style.opacity = Math.min(0.9, l * 0.9).toFixed(3);
    o.top.style.setProperty('--lift', l.toFixed(3));
    o.front.style.setProperty('--lift', l.toFixed(3));
  }

  function retarget(t) {
    var wave = waveStart ? (t - waveStart) / WAVE_MS : -1;
    var ac = active >= 0 ? cells[active] : null;
    for (var i = 0; i < cells.length; i++) {
      var o = cells[i], v = 0;
      if (ac) {
        var d = Math.sqrt((o.c - ac.c) * (o.c - ac.c) + (o.r - ac.r) * (o.r - ac.r));
        v = d === 0 ? 1 : d <= 1.5 ? 0.35 * (1 - (d - 1) / 0.5) : 0;
        if (v < 0) v = 0;
      }
      if (wave >= 0 && wave <= 1.25) {
        // A soft ridge travelling from the far rows toward the camera.
        var p = 1 - o.r / rows, x = (wave * 1.25 - p) / 0.09;
        var w = 0.5 * Math.exp(-x * x);
        if (w > v) v = w;
      }
      o.target = v;
    }
    if (wave > 1.25) waveStart = 0;
  }

  function tick(t) {
    var dt = Math.min((t - last) / 1000, 1 / 30); last = t;
    retarget(t);
    var moving = false;
    for (var i = 0; i < cells.length; i++) {
      var o = cells[i], s = o.target > o.lift ? RISE : FALL;
      o.v += (s.k * (o.target - o.lift) - s.c * o.v) * dt;
      o.lift += o.v * dt;
      if (o.lift < 0) { o.lift = 0; o.v = o.v < -0.05 ? -o.v * RESTITUTION : 0; }
      if (Math.abs(o.target - o.lift) < 0.0015 && Math.abs(o.v) < 0.01) { o.lift = o.target; o.v = 0; }
      else moving = true;
      write(o);
    }
    if (moving || active >= 0 || waveStart) requestAnimationFrame(tick); else running = false;
  }
  function wake() {
    if (reduce || running) return;
    running = true; last = performance.now(); requestAnimationFrame(tick);
  }

  function scheduleIdle(delay) {
    clearTimeout(idleTimer);
    if (reduce) return;
    idleTimer = setTimeout(function () {
      waveStart = performance.now(); wake();
      scheduleIdle(WAVE_EVERY);
    }, delay);
  }

  function setActive(i) {
    if (i === active) return;
    if (reduce) {
      if (active >= 0 && cells[active]) cells[active].el.classList.remove('is-hot');
      if (i >= 0) cells[i].el.classList.add('is-hot');
    }
    active = i; wake();
  }
  function onPoint(e) {
    waveStart = 0; scheduleIdle(IDLE_MS);
    var el = document.elementFromPoint(e.clientX, e.clientY);
    var cell = el && el.closest && el.closest('.grid-cell');
    if (cell) setActive(cell._i);
    else if (!el || !el.closest('.hero-circle')) return;
    else setActive(-1);
  }
  function onLeave() { setActive(-1); scheduleIdle(IDLE_MS); }

  hero.addEventListener('pointermove', onPoint);
  hero.addEventListener('pointerdown', onPoint);
  hero.addEventListener('pointerleave', onLeave);
  hero.addEventListener('pointerup', function (e) { if (e.pointerType !== 'mouse') onLeave(); });
  hero.addEventListener('pointercancel', onLeave);

  var rt = 0;
  function rebuild() { clearTimeout(rt); rt = setTimeout(function () { build(); wake(); }, 120); }
  if (typeof ResizeObserver !== 'undefined') new ResizeObserver(rebuild).observe(hero);
  else window.addEventListener('resize', rebuild);
  build();
  scheduleIdle(IDLE_MS);
})();

// Back links follow the visitor's actual path: when they arrived from another
// page on this site, "Back" returns there (history.back keeps scroll position)
// instead of always jumping to My Work. Direct loads keep the default link.
(function () {
  var links = document.querySelectorAll('.breadcrumb');
  if (!links.length || !document.referrer) return;
  var ref;
  try { ref = new URL(document.referrer); } catch (e) { return; }
  if (ref.origin !== location.origin || ref.pathname === location.pathname || history.length < 2) return;
  var name = ref.pathname.split('/').pop().replace('.html', '');
  var names = {
    index: 'home', '': 'home',
    'fitt-subscription-journey': 'FITT Meals',
    'ai-tutor-ksa': 'Mualim',
    'pura-health-redesign': 'PureCS',
    'jugnu-retailer-app': 'Jugnu'
  };
  var label = names[name] || name;
  links.forEach(function (a) {
    a.textContent = '\u2190 Back to ' + label;
    a.addEventListener('click', function (e) { e.preventDefault(); history.back(); });
  });
})();

// Autoplaying videos hold on their poster frame for visitors who prefer
// reduced motion.
(function () {
  if (!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) return;
  document.querySelectorAll('video[autoplay]').forEach(function (v) { v.removeAttribute('autoplay'); v.pause(); });
})();

// Initial concept / Final outcome toggles (case study pages, "[data-case-toggle]").
// A two-tab tablist: click or arrow keys switch, the thumb and panels are
// driven by aria-selected / .is-active in CSS.
(function () {
  document.querySelectorAll('[data-case-toggle]').forEach(function (root) {
    var tabs = Array.prototype.slice.call(root.querySelectorAll('[role="tab"]'));
    var panels = Array.prototype.slice.call(root.querySelectorAll('[role="tabpanel"]'));
    function select(i, focus) {
      tabs.forEach(function (t, k) {
        t.setAttribute('aria-selected', k === i ? 'true' : 'false');
        t.tabIndex = k === i ? 0 : -1;
        panels[k].classList.toggle('is-active', k === i);
      });
      if (focus) tabs[i].focus();
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { select(i); });
      t.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); select(i === 0 ? 1 : 0, true); }
      });
    });
  });
})();

// Screenshot carousels ("[data-case-carousel]"): prev/next buttons scroll the
// snap track one slide at a time; the counter and disabled ends follow the
// scroll position, so swiping or arrow keys on the track stay in sync.
(function () {
  document.querySelectorAll('[data-case-carousel]').forEach(function (root) {
    var track = root.querySelector('.case-carousel-track');
    var btns = root.querySelectorAll('.case-carousel-btn');
    var cur = root.querySelector('[data-current]');
    var slides = track.children.length;
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function index() { return Math.round(track.scrollLeft / track.clientWidth); }
    function sync() {
      var i = index();
      cur.textContent = i + 1;
      btns[0].disabled = i <= 0;
      btns[1].disabled = i >= slides - 1;
    }
    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        var i = Math.max(0, Math.min(slides - 1, index() + parseInt(b.dataset.dir, 10)));
        track.scrollTo({ left: i * track.clientWidth, behavior: reduce ? 'auto' : 'smooth' });
      });
    });
    track.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    sync();
  });
})();

// Number count-up ("[data-count-to]", case study pages): each figure starts at
// 0 and counts to its real value (ease-out, 900ms) when it scrolls into view.
// The real number is already in the markup, so no-JS and reduced-motion
// visitors just see the final figures.
(function () {
  var els = document.querySelectorAll('[data-count-to]');
  if (!els.length) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!('IntersectionObserver' in window)) return;

  function suffix(el) { return el.textContent.replace(/^[\d.]+/, ''); }
  function run(el) {
    var to = parseFloat(el.dataset.countTo), tail = el.dataset.suffix, start = null, DUR = 900;
    function step(t) {
      if (start === null) start = t;
      var p = Math.min(1, (t - start) / DUR), e = 1 - Math.pow(1 - p, 4);
      el.textContent = Math.round(to * e) + tail;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      io.unobserve(entry.target);
      run(entry.target);
    });
  }, { threshold: 0.6 });
  els.forEach(function (el) {
    el.dataset.suffix = suffix(el);
    el.textContent = '0' + el.dataset.suffix;
    io.observe(el);
  });
})();
