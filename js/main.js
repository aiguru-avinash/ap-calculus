/**
 * AP Calculus Tutorial — main.js
 * Handles: sidebar toggle, KaTeX render, MCQ interactivity,
 *          solution toggles, progress tracking, FRQ reveals
 */

/* ============================================================
   KaTeX auto-render
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  if (typeof renderMathInElement !== 'undefined') {
    renderMathInElement(document.body, {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '\\[', right: '\\]', display: true },
        { left: '$', right: '$', display: false },
        { left: '\\(', right: '\\)', display: false }
      ],
      throwOnError: false
    });
  }
});

/* ============================================================
   Sidebar toggle (mobile)
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.getElementById('hamburger');
  const sidebar   = document.getElementById('sidebar');
  const overlay   = document.getElementById('sidebarOverlay');

  function openSidebar() {
    sidebar?.classList.add('open');
    overlay?.classList.add('active');
  }

  function closeSidebar() {
    sidebar?.classList.remove('open');
    overlay?.classList.remove('active');
  }

  hamburger?.addEventListener('click', () => {
    sidebar?.classList.contains('open') ? closeSidebar() : openSidebar();
  });

  overlay?.addEventListener('click', closeSidebar);
});

/* ============================================================
   Active sidebar link
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  const currentPath = window.location.pathname.split('/').pop();
  document.querySelectorAll('.sidebar-nav a').forEach(link => {
    const href = link.getAttribute('href')?.split('/').pop();
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
});

/* ============================================================
   Solution toggle
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.solution-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const body = btn.nextElementSibling;
      const isOpen = body?.classList.contains('open');
      body?.classList.toggle('open', !isOpen);
      btn.innerHTML = isOpen
        ? '<span>▶</span> Show Solution'
        : '<span>▼</span> Hide Solution';
    });
    // Initialize text
    btn.innerHTML = '<span>▶</span> Show Solution';
  });
});

/* ============================================================
   MCQ Interactivity
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  let totalAnswered = 0;
  let totalCorrect  = 0;
  const totalQuestions = document.querySelectorAll('.mcq-item').length;

  function updateScore() {
    const scorePct = totalQuestions > 0
      ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
    const scoreEl = document.getElementById('scoreDisplay');
    const progressEl = document.getElementById('progressFill');
    const answeredEl = document.getElementById('answeredCount');
    if (scoreEl) scoreEl.textContent = `${totalCorrect}/${totalQuestions}`;
    if (progressEl) progressEl.style.width = `${(totalAnswered / totalQuestions) * 100}%`;
    if (answeredEl) answeredEl.textContent = `${totalAnswered} answered`;
  }

  document.querySelectorAll('.mcq-item').forEach(item => {
    const options  = item.querySelectorAll('.mcq-option');
    const correct  = item.dataset.correct;
    const explEl   = item.querySelector('.mcq-explanation');
    let answered = false;

    options.forEach(opt => {
      opt.addEventListener('click', () => {
        if (answered) return;
        answered = true;
        totalAnswered++;

        const chosen = opt.dataset.option;
        options.forEach(o => {
          if (o.dataset.option === correct) o.classList.add('correct');
          else if (o === opt) o.classList.add('incorrect');
          o.style.pointerEvents = 'none';
        });

        if (chosen === correct) totalCorrect++;
        if (explEl) explEl.classList.add('visible');

        updateScore();
      });
    });
  });

  // Reset button
  document.getElementById('resetQuiz')?.addEventListener('click', () => {
    totalAnswered = 0; totalCorrect = 0;
    document.querySelectorAll('.mcq-item').forEach(item => {
      item.querySelectorAll('.mcq-option').forEach(opt => {
        opt.classList.remove('correct', 'incorrect', 'selected');
        opt.style.pointerEvents = '';
      });
      item.querySelector('.mcq-explanation')?.classList.remove('visible');
    });
    updateScore();
  });

  updateScore();
});

/* ============================================================
   FRQ Solution accordion
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.frq-solution-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const panel = document.getElementById(btn.dataset.target);
      const isOpen = panel?.style.display === 'block';
      panel.style.display = isOpen ? 'none' : 'block';
      btn.textContent = isOpen ? 'Show Full Solution' : 'Hide Solution';
    });
    btn.textContent = 'Show Full Solution';
  });
});

/* ============================================================
   Smooth scroll for in-page TOC
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});

/* ============================================================
   Copy-to-clipboard for math blocks (optional UX)
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.math-block').forEach(block => {
    block.title = 'Click to copy LaTeX';
    block.style.cursor = 'pointer';
    block.addEventListener('click', () => {
      const tex = block.dataset.tex;
      if (tex && navigator.clipboard) {
        navigator.clipboard.writeText(tex).then(() => {
          const old = block.style.outline;
          block.style.outline = '2px solid var(--color-accent)';
          setTimeout(() => block.style.outline = old, 800);
        });
      }
    });
  });
});
