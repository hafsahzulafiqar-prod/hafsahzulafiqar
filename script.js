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
    document.dispatchEvent(new Event('cs:change'));
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

// Hero card stack (home page only, ".hero" / ".hero-sticky" — see
// styles.css): a two-stage, scroll-scrubbed reveal, structurally identical
// to the case-studies pinned deck below — same is-pinned toggle, same
// getBoundingClientRect()-based progress formula, same live matchMedia
// re-check on resize/preference change — except progress here drives two
// CONTINUOUS custom properties (--stage1, --stage2) instead of a discrete
// "which card is active" index, so the cards/heading/tagline interpolate
// smoothly frame-by-frame and reverse cleanly at any scroll position,
// rather than snapping between fixed states.
// Stage 1 (progress 0 -> 0.5 of the pinned range): cards 2-4 fan out from
// resting position to their Figma rotation, uncovering the badges that sit
// behind them, while the heading fades up to full color.
// Stage 2 (0.5 -> 1): cards/heading hold steady; the tagline fades up to
// full color. Both default to 1 on .hero (see styles.css), so mobile and
// prefers-reduced-motion — where this never pins or attaches a listener —
// just render the fully-revealed end state immediately.
(function () {
  var section = document.querySelector('.hero');
  var sticky = document.querySelector('.hero-sticky');
  if (!section || !sticky) return;

  var mqSmall = window.matchMedia('(max-width: 760px)');
  var mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  function pinnedAllowed() { return !mqSmall.matches && !mqReduce.matches; }

  var ticking = false;

  function update() {
    ticking = false;
    if (!section.classList.contains('is-pinned')) return;
    var rect = section.getBoundingClientRect();
    var scrollable = rect.height - window.innerHeight;
    var progress = scrollable > 0 ? Math.min(1, Math.max(0, -rect.top / scrollable)) : 0;
    var stage1 = Math.min(1, Math.max(0, progress / 0.5));
    var stage2 = Math.min(1, Math.max(0, (progress - 0.5) / 0.5));
    section.style.setProperty('--stage1', stage1);
    section.style.setProperty('--stage2', stage2);
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
    if (on) {
      update();
    } else {
      // Drop back to the CSS defaults (both 1, i.e. fully revealed) rather
      // than leaving a stale inline value from before a breakpoint/
      // preference change.
      section.style.removeProperty('--stage1');
      section.style.removeProperty('--stage2');
    }
  }
  [mqSmall, mqReduce].forEach(function (mq) {
    if (mq.addEventListener) mq.addEventListener('change', sync); else mq.addListener(sync);
  });
  sync();
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

// Videos ("video", muted loops): start only while visible and stay paused
// otherwise, so several never decode at once. Inside the pinned case study
// deck only the active card's video plays. JS sets the muted state itself and
// retries on first interaction, since some browsers (Safari, low power mode)
// refuse the first autoplay. Reduced-motion visitors keep the poster frame.
(function () {
  var vids = Array.prototype.slice.call(document.querySelectorAll('video'));
  if (!vids.length) return;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var visible = new Map();
  vids.forEach(function (v) { v.muted = true; v.defaultMuted = true; v.loop = true; v.playsInline = true; });
  if (reduce) return;

  function wanted(v) {
    if (!visible.get(v)) return false;
    var card = v.closest('.case-studies-card');
    if (card && card.closest('.case-studies.is-pinned')) return card.classList.contains('active');
    return true;
  }
  function sync(v) {
    if (wanted(v)) {
      if (v.paused) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
    } else if (!v.paused) v.pause();
  }
  function syncAll() { vids.forEach(sync); }

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { visible.set(e.target, e.isIntersecting); sync(e.target); });
    }, { threshold: 0.25 });
    vids.forEach(function (v) { io.observe(v); });
  } else vids.forEach(function (v) { visible.set(v, true); });

  document.addEventListener('cs:change', syncAll);
  ['pointerdown', 'touchstart', 'keydown', 'scroll'].forEach(function (t) {
    document.addEventListener(t, function once() { document.removeEventListener(t, once); syncAll(); }, { passive: true });
  });
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

// "Going above and beyond" lightbox: clicking a card's video opens it larger
// in an overlay whose own layer scrolls vertically, so a tall clip or a
// short viewport never gets clipped. Reuses the card's own <video> element
// by moving it into the lightbox stage and back (rather than a second copy)
// so there's only ever one decoder per clip. A comment node left in the
// card marks exactly where the video came from, so close() always knows
// where to put it back regardless of how many times this runs.
(function () {
  var lightbox = document.getElementById('beyond-lightbox');
  var triggers = document.querySelectorAll('[data-beyond-open]');
  if (!lightbox || !triggers.length) return;
  var scrollEl = lightbox.querySelector('.beyond-lightbox-scroll');
  var stage = lightbox.querySelector('.beyond-lightbox-stage');
  var closeBtn = lightbox.querySelector('.beyond-lightbox-close');
  var homeVideo = null, homeMarker = null, lastFocus = null;

  function open(trigger) {
    var v = trigger.querySelector('video');
    if (!v || homeVideo) return;
    homeVideo = v;
    homeMarker = document.createComment('beyond-video-slot');
    v.parentNode.insertBefore(homeMarker, v);
    stage.appendChild(v);
    v.classList.add('beyond-lightbox-video');
    v.controls = true;
    v.muted = false;
    v.play().catch(function () {});
    lastFocus = document.activeElement;
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }
  function close() {
    if (!homeVideo) return;
    homeVideo.pause();
    homeVideo.controls = false;
    homeVideo.muted = true;
    homeVideo.classList.remove('beyond-lightbox-video');
    homeMarker.parentNode.insertBefore(homeVideo, homeMarker);
    homeMarker.remove();
    homeVideo = null; homeMarker = null;
    lightbox.hidden = true;
    document.body.style.overflow = '';
    scrollEl.scrollTop = 0;
    if (lastFocus) lastFocus.focus();
  }
  triggers.forEach(function (t) { t.addEventListener('click', function () { open(t); }); });
  lightbox.addEventListener('click', function (e) { if (e.target.closest('[data-beyond-close]')) close(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !lightbox.hidden) close(); });
})();
