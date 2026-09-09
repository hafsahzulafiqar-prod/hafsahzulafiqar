// Footer year — present on every page.
var yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

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
    log.scrollTop = log.scrollHeight;
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
