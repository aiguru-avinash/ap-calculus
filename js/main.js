/**
 * AP Calculus — main.js
 * KaTeX render, sidebar, solution toggles, MCQ quiz with saved progress, chapter completion.
 */
document.addEventListener('DOMContentLoaded', () => {
  const APC = window.APC || { load: () => ({ mcq: {}, done: {} }), save() {}, refreshSidebar() {} };
  const chNum = document.body.dataset.ch ? String(document.body.dataset.ch).padStart(2, '0') : null;
  const kind = document.body.dataset.kind || '';

  /* ---- KaTeX ---- */
  if (typeof renderMathInElement !== 'undefined') {
    renderMathInElement(document.body, {
      delimiters: [
        { left: '$$', right: '$$', display: true }, { left: '\\[', right: '\\]', display: true },
        { left: '$', right: '$', display: false }, { left: '\\(', right: '\\)', display: false },
      ],
      throwOnError: false,
    });
  }

  /* ---- sidebar (mobile) ---- */
  const sidebar = document.getElementById('sidebar'), overlay = document.getElementById('sidebarOverlay'), ham = document.getElementById('hamburger');
  const setSide = open => { sidebar?.classList.toggle('open', open); overlay?.classList.toggle('active', open); };
  ham?.addEventListener('click', () => setSide(!sidebar.classList.contains('open')));
  overlay?.addEventListener('click', () => setSide(false));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setSide(false); });

  /* ---- active link ---- */
  const cur = location.pathname.split('/').pop();
  document.querySelectorAll('.sidebar-nav a').forEach(a => {
    const h = a.getAttribute('href')?.split('/').pop();
    if (h === cur || (cur === '' && h === 'index.html')) { a.classList.add('active'); a.scrollIntoView?.({ block: 'nearest' }); }
  });
  document.querySelectorAll('.nav-links a').forEach(a => {
    const p = a.getAttribute('href') || '';
    if ((p.includes('/chapters/') && location.pathname.includes('/chapters/')) || (p.includes('/frq/') && location.pathname.includes('/frq/')) ||
        (p.includes('/mcq/') && location.pathname.includes('/mcq/')) || (p.includes('/answers/') && location.pathname.includes('/answers/'))) a.classList.add('active');
  });

  /* ---- worked-example solutions ---- */
  document.querySelectorAll('.solution-toggle').forEach(btn => {
    btn.innerHTML = '<span>▶</span> Show Solution';
    btn.addEventListener('click', () => {
      const body = btn.nextElementSibling; const open = body?.classList.toggle('open');
      btn.innerHTML = open ? '<span>▼</span> Hide Solution' : '<span>▶</span> Show Solution';
    });
  });

  /* ---- FRQ solutions ---- */
  document.querySelectorAll('.frq-solution-toggle').forEach(btn => {
    btn.textContent = 'Show Full Solution';
    btn.addEventListener('click', () => {
      const panel = document.getElementById(btn.dataset.target); if (!panel) return;
      const open = panel.style.display === 'block';
      panel.style.display = open ? 'none' : 'block';
      btn.textContent = open ? 'Show Full Solution' : 'Hide Solution';
    });
  });

  /* ---- smooth in-page links ---- */
  document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href')); if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  }));

  /* ---- MCQ quiz with saved progress ---- */
  const items = [...document.querySelectorAll('.mcq-item')];
  if (items.length) {
    const total = items.length, key = 'ch' + (chNum || '00');
    const data = APC.load(); data.mcq = data.mcq || {};
    let rec = data.mcq[key] || { answers: {} };
    const persist = () => {
      const vals = Object.entries(rec.answers);
      rec.total = total; rec.answered = vals.length;
      rec.correct = vals.filter(([i, l]) => items[i] && items[i].dataset.correct === l).length;
      data.mcq[key] = rec; APC.save(data); APC.refreshSidebar?.(); paint();
    };
    const sEl = document.getElementById('scoreDisplay'), pEl = document.getElementById('progressFill'), aEl = document.getElementById('answeredCount');
    let summary = document.querySelector('.quiz-summary');
    if (!summary) { summary = document.createElement('div'); summary.className = 'quiz-summary'; document.querySelector('.mcq-container')?.after(summary); }
    function paint() {
      const answered = Object.keys(rec.answers).length;
      const correct = Object.entries(rec.answers).filter(([i, l]) => items[i].dataset.correct === l).length;
      if (sEl) sEl.textContent = `${correct}/${total}`;
      if (pEl) pEl.style.width = (answered / total * 100) + '%';
      if (aEl) aEl.textContent = `${answered} of ${total} answered`;
      if (answered === total) {
        const pct = Math.round(correct / total * 100);
        const msg = pct >= 90 ? 'Outstanding — you’re AP-5 ready on this chapter.' : pct >= 70 ? 'Solid work. Review the explanations you missed.' : 'Worth another pass through the chapter, then retry.';
        summary.innerHTML = `<div class="big">${pct}%</div><p><strong>${correct} of ${total} correct.</strong> ${msg}</p>`;
        summary.classList.add('show');
      } else summary.classList.remove('show');
    }
    function reveal(item, idx, letter, animate) {
      const opts = item.querySelectorAll('.mcq-option'), correct = item.dataset.correct, ex = item.querySelector('.mcq-explanation');
      opts.forEach(o => {
        o.classList.add('locked');
        if (o.dataset.option === correct) o.classList.add('correct'); else if (o.dataset.option === letter) o.classList.add('incorrect');
        o.setAttribute('aria-disabled', 'true');
      });
      item.classList.add(letter === correct ? 'is-correct' : 'is-wrong');
      if (ex) {
        ex.querySelector('.verdict')?.remove();
        const v = document.createElement('span'); v.className = 'verdict ' + (letter === correct ? 'ok' : 'no');
        v.textContent = letter === correct ? '✓ Correct' : `✗ Not quite — correct answer is ${correct}`; ex.prepend(v);
        ex.classList.add('visible');
      }
    }
    items.forEach((item, idx) => {
      item.querySelectorAll('.mcq-option').forEach(opt => {
        opt.setAttribute('role', 'button'); opt.tabIndex = 0;
        const pick = () => {
          if (item.querySelector('.mcq-option.locked')) return;
          rec.answers[idx] = opt.dataset.option; reveal(item, idx, opt.dataset.option); persist();
        };
        opt.addEventListener('click', pick);
        opt.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(); } });
      });
      if (rec.answers[idx]) reveal(item, idx, rec.answers[idx]);
    });
    document.getElementById('resetQuiz')?.addEventListener('click', () => {
      rec = { answers: {} }; delete data.mcq[key]; APC.save(data);
      items.forEach(item => {
        item.classList.remove('is-correct', 'is-wrong');
        item.querySelectorAll('.mcq-option').forEach(o => { o.classList.remove('correct', 'incorrect', 'locked'); o.removeAttribute('aria-disabled'); });
        const ex = item.querySelector('.mcq-explanation'); ex?.classList.remove('visible'); ex?.querySelector('.verdict')?.remove();
      });
      APC.refreshSidebar?.(); location.reload();
    });
    paint();
  }

  /* ---- chapter completion ---- */
  if (kind === 'chapter' && chNum) {
    const nav = document.querySelector('.chapter-nav');
    const wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;justify-content:center;margin-top:44px;gap:10px;flex-wrap:wrap';
    const btn = document.createElement('button'); btn.className = 'btn btn-primary'; btn.type = 'button';
    const mcq = document.createElement('a'); mcq.className = 'btn'; mcq.href = `../mcq/mcq-ch${chNum}.html`; mcq.textContent = 'Practice MCQs →';
    const paint = () => { const d = APC.load(); btn.textContent = d.done['ch' + chNum] ? '✓ Chapter complete (click to undo)' : 'Mark chapter complete'; };
    btn.addEventListener('click', () => { const d = APC.load(); d.done['ch' + chNum] = !d.done['ch' + chNum]; if (!d.done['ch' + chNum]) delete d.done['ch' + chNum]; APC.save(d); APC.refreshSidebar?.(); paint(); });
    wrap.append(btn, mcq); paint();
    nav ? nav.before(wrap) : document.querySelector('.content-inner')?.append(wrap);
  }

  /* ---- landing page: progress on cards ---- */
  document.querySelectorAll('.chapter-card').forEach(card => {
    const m = (card.getAttribute('href') || '').match(/ch(\d\d)/); if (!m) return;
    card.dataset.ch = String(parseInt(m[1], 10));
    if (APC.load().done['ch' + m[1]]) { const s = document.createElement('span'); s.className = 'cc-prog'; s.textContent = '✓ DONE'; card.querySelector('.chapter-card-tags')?.append(s); }
  });
});
