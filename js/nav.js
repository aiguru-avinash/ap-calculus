/**
 * Shared navigation, theme toggle, search and progress store.
 * <script src="../js/nav.js" id="navScript" data-root=".."></script>
 */
(function () {
  const script = document.getElementById('navScript');
  const root = script ? (script.dataset.root || '.') : '.';

  /* ---------- progress store (shared with main.js) ---------- */
  const KEY = 'apcalc.v1';
  const APC = window.APC = {
    load() { try { return JSON.parse(localStorage.getItem(KEY)) || { mcq: {}, done: {} }; } catch (e) { return { mcq: {}, done: {} }; } },
    save(d) { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) {} },
  };

  /* ---------- icons ---------- */
  const I = {
    sun: '<svg class="i-sun" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    moon: '<svg class="i-moon" viewBox="0 0 24 24"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z"/></svg>',
    menu: '<svg viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg>',
    search: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>',
  };

  const chapters = [
    ['ch01-limits', 'Limits & Continuity', 'AB'], ['ch02-derivatives-basic', 'Differentiation: Basics', 'AB'],
    ['ch03-derivatives-advanced', 'Differentiation: Advanced', 'AB'], ['ch04-applications-derivatives', 'Contextual Applications', 'AB'],
    ['ch05-analytical-applications', 'Analytical Applications', 'AB'], ['ch06-integration', 'Integration', 'AB'],
    ['ch07-differential-equations', 'Differential Equations', 'AB'], ['ch08-applications-integration', 'Applications of Integration', 'AB'],
    ['ch09-parametric-polar-vectors', 'Parametric, Polar & Vectors', 'BC'], ['ch10-series', 'Sequences & Series', 'BC'],
  ];
  const esc = s => s.replace(/&/g, '&amp;');
  const chLinks = chapters.map((c, i) => {
    const n = String(i + 1).padStart(2, '0');
    return `<li data-s="${c[1].toLowerCase()} chapter ${i + 1}"><a href="${root}/chapters/${c[0]}.html" data-ch="${n}"><span class="cdot">${i + 1}</span><span class="lbl">${esc(c[1])}</span><span class="badge badge-${c[2].toLowerCase()}">${c[2]}</span></a></li>`;
  }).join('');
  const mcqLinks = chapters.map((c, i) => {
    const n = String(i + 1).padStart(2, '0');
    return `<li data-s="mcq practice quiz chapter ${i + 1} ${c[1].toLowerCase()}"><a href="${root}/mcq/mcq-ch${n}.html" data-mcq="ch${n}"><span class="cdot">${i + 1}</span><span class="lbl">MCQ · ${esc(c[1])}</span><span class="badge badge-ab mq" style="display:none"></span></a></li>`;
  }).join('');

  const sidebarHTML = `
<nav class="sidebar" id="sidebar" aria-label="Course navigation">
  <div class="sidebar-search">${I.search}<input id="sbSearch" type="search" placeholder="Search chapters, topics…" aria-label="Search chapters"></div>
  <div class="sidebar-section">
    <p class="sidebar-label">Course</p>
    <ul class="sidebar-nav"><li data-s="overview home"><a href="${root}/index.html"><span class="cdot">⌂</span><span class="lbl">Overview</span></a></li></ul>
  </div>
  <div class="sidebar-section"><p class="sidebar-label">Chapters</p><ul class="sidebar-nav">${chLinks}</ul></div>
  <div class="sidebar-section">
    <p class="sidebar-label">Free Response</p>
    <ul class="sidebar-nav">
      <li data-s="frq free response ab"><a href="${root}/frq/frq-ab.html"><span class="cdot">✎</span><span class="lbl">FRQs — AB (25)</span><span class="badge badge-ab">AB</span></a></li>
      <li data-s="frq free response bc"><a href="${root}/frq/frq-bc.html"><span class="cdot">✎</span><span class="lbl">FRQs — BC (25)</span><span class="badge badge-bc">BC</span></a></li>
    </ul>
  </div>
  <div class="sidebar-section"><p class="sidebar-label">MCQ Bank</p><ul class="sidebar-nav">${mcqLinks}
    <li data-s="answer key"><a href="${root}/answers/answer-key.html"><span class="cdot">✓</span><span class="lbl">Full Answer Key</span></a></li></ul></div>
  <div class="prog-wrap"><div class="t"><span>Your progress</span><span id="progTxt">0 / 10</span></div><div class="prog-bar"><i id="progFill"></i></div></div>
</nav>
<div id="sidebarOverlay"></div>`;

  const topNavHTML = `
<header class="top-nav">
  <button id="hamburger" class="icon-btn hamburger" aria-label="Open menu">${I.menu}</button>
  <a href="${root}/index.html" class="nav-brand"><div class="nav-brand-icon">∫</div><span class="nav-brand-text">Avinash<span>AI</span> Calculus</span></a>
  <ul class="nav-links">
    <li><a href="${root}/index.html">Home</a></li>
    <li><a href="${root}/chapters/ch01-limits.html">Chapters</a></li>
    <li><a href="${root}/frq/frq-ab.html">FRQs</a></li>
    <li><a href="${root}/mcq/mcq-ch01.html">MCQs</a></li>
    <li><a href="${root}/answers/answer-key.html">Answers</a></li>
    <li><a href="https://avinashai.com" target="_blank" rel="noopener" class="nav-cta">avinashai.com ↗</a></li>
  </ul>
  <div class="nav-tools"><button class="icon-btn" id="themeBtn" aria-label="Toggle light/dark theme" title="Toggle theme">${I.sun}${I.moon}</button></div>
</header>`;

  const t = document.getElementById('topNav'); if (t) t.outerHTML = topNavHTML;
  const s = document.getElementById('sidebarNav'); if (s) s.outerHTML = sidebarHTML;

  /* ---------- theme ---------- */
  document.getElementById('themeBtn')?.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('apcalc.theme', next); } catch (e) {}
  });

  /* ---------- search ---------- */
  document.getElementById('sbSearch')?.addEventListener('input', e => {
    const q = e.target.value.trim().toLowerCase();
    document.querySelectorAll('#sidebar li[data-s]').forEach(li => li.classList.toggle('hide', !!q && !li.dataset.s.includes(q)));
  });

  /* ---------- progress ticks ---------- */
  window.APC.refreshSidebar = function () {
    const d = APC.load(); let done = 0;
    document.querySelectorAll('#sidebar a[data-ch]').forEach(a => {
      const ok = !!d.done['ch' + a.dataset.ch]; a.classList.toggle('done', ok);
      const dot = a.querySelector('.cdot'); if (ok) { dot.textContent = '✓'; done++; }
    });
    document.querySelectorAll('#sidebar a[data-mcq]').forEach(a => {
      const rec = d.mcq[a.dataset.mcq]; const b = a.querySelector('.mq');
      if (rec && rec.answered) {
        b.style.display = ''; b.textContent = rec.correct + '/' + rec.total;
        if (rec.answered >= rec.total) a.classList.add('done');
      }
    });
    const pf = document.getElementById('progFill'), pt = document.getElementById('progTxt');
    if (pf) pf.style.width = (done * 10) + '%'; if (pt) pt.textContent = done + ' / 10 chapters';
  };
  window.APC.refreshSidebar();
})();
