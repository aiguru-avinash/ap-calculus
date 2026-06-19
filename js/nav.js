/**
 * Injects shared sidebar navigation and top-nav into every page.
 * Include this script BEFORE </body> with id="navScript" and
 * a data-root attribute pointing to the site root relative path.
 *
 * Usage:
 *   <script src="../js/nav.js" id="navScript" data-root=".."></script>
 */

(function () {
  const script = document.getElementById('navScript');
  const root   = script ? (script.dataset.root || '.') : '.';

  /* ---- Sidebar HTML ---- */
  const sidebarHTML = `
<nav class="sidebar" id="sidebar">
  <div class="sidebar-section">
    <p class="sidebar-label">Course</p>
    <ul class="sidebar-nav">
      <li><a href="${root}/index.html">🏠 Overview</a></li>
    </ul>
  </div>

  <div class="sidebar-section">
    <p class="sidebar-label">AB + BC Chapters</p>
    <ul class="sidebar-nav">
      <li><a href="${root}/chapters/ch01-limits.html">Ch 1 — Limits &amp; Continuity <span class="badge badge-ab">AB</span></a></li>
      <li><a href="${root}/chapters/ch02-derivatives-basic.html">Ch 2 — Differentiation: Basics <span class="badge badge-ab">AB</span></a></li>
      <li><a href="${root}/chapters/ch03-derivatives-advanced.html">Ch 3 — Differentiation: Advanced <span class="badge badge-ab">AB</span></a></li>
      <li><a href="${root}/chapters/ch04-applications-derivatives.html">Ch 4 — Contextual Applications <span class="badge badge-ab">AB</span></a></li>
      <li><a href="${root}/chapters/ch05-analytical-applications.html">Ch 5 — Analytical Applications <span class="badge badge-ab">AB</span></a></li>
      <li><a href="${root}/chapters/ch06-integration.html">Ch 6 — Integration <span class="badge badge-ab">AB</span></a></li>
      <li><a href="${root}/chapters/ch07-differential-equations.html">Ch 7 — Differential Equations <span class="badge badge-ab">AB</span></a></li>
      <li><a href="${root}/chapters/ch08-applications-integration.html">Ch 8 — Applications of Integration <span class="badge badge-ab">AB</span></a></li>
      <li><a href="${root}/chapters/ch09-parametric-polar-vectors.html">Ch 9 — Parametric, Polar &amp; Vectors <span class="badge badge-bc">BC</span></a></li>
      <li><a href="${root}/chapters/ch10-series.html">Ch 10 — Sequences &amp; Series <span class="badge badge-bc">BC</span></a></li>
    </ul>
  </div>

  <div class="sidebar-section">
    <p class="sidebar-label">Practice</p>
    <ul class="sidebar-nav">
      <li><a href="${root}/frq/frq-ab.html">📝 FRQs — AB (25 problems)</a></li>
      <li><a href="${root}/frq/frq-bc.html">📝 FRQs — BC (25 problems)</a></li>
    </ul>
  </div>

  <div class="sidebar-section">
    <p class="sidebar-label">MCQ Bank</p>
    <ul class="sidebar-nav">
      <li><a href="${root}/mcq/mcq-ch01.html">MCQ — Ch 1 (20 Qs)</a></li>
      <li><a href="${root}/mcq/mcq-ch02.html">MCQ — Ch 2 (20 Qs)</a></li>
      <li><a href="${root}/mcq/mcq-ch03.html">MCQ — Ch 3 (20 Qs)</a></li>
      <li><a href="${root}/mcq/mcq-ch04.html">MCQ — Ch 4 (20 Qs)</a></li>
      <li><a href="${root}/mcq/mcq-ch05.html">MCQ — Ch 5 (20 Qs)</a></li>
      <li><a href="${root}/mcq/mcq-ch06.html">MCQ — Ch 6 (20 Qs)</a></li>
      <li><a href="${root}/mcq/mcq-ch07.html">MCQ — Ch 7 (20 Qs)</a></li>
      <li><a href="${root}/mcq/mcq-ch08.html">MCQ — Ch 8 (20 Qs)</a></li>
      <li><a href="${root}/mcq/mcq-ch09.html">MCQ — Ch 9 (20 Qs)</a></li>
      <li><a href="${root}/mcq/mcq-ch10.html">MCQ — Ch 10 (20 Qs)</a></li>
      <li><a href="${root}/answers/answer-key.html">📋 Full Answer Key</a></li>
    </ul>
  </div>
</nav>
<div id="sidebarOverlay" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:99;transition:opacity 0.3s;"
  class=""></div>
<style>
  #sidebarOverlay.active { display:block !important; }
</style>`;

  /* ---- Top Nav HTML ---- */
  const topNavHTML = `
<header class="top-nav">
  <a href="${root}/index.html" class="nav-brand">
    <div class="nav-brand-icon">∫</div>
    <span class="nav-brand-text">Avinash<span>AI</span> Calculus</span>
  </a>
  <ul class="nav-links">
    <li><a href="${root}/index.html">Home</a></li>
    <li><a href="${root}/chapters/ch01-limits.html">Chapters</a></li>
    <li><a href="${root}/frq/frq-ab.html">FRQs</a></li>
    <li><a href="${root}/mcq/mcq-ch01.html">MCQs</a></li>
    <li><a href="${root}/answers/answer-key.html">Answers</a></li>
    <li><a href="https://avinashai.com" target="_blank" class="nav-cta">avinashai.com ↗</a></li>
  </ul>
  <button id="hamburger" class="hamburger" aria-label="Menu">
    <span></span><span></span><span></span>
  </button>
</header>`;

  /* ---- Inject ---- */
  const navPlaceholder = document.getElementById('topNav');
  if (navPlaceholder) navPlaceholder.outerHTML = topNavHTML;

  const sidebarPlaceholder = document.getElementById('sidebarNav');
  if (sidebarPlaceholder) sidebarPlaceholder.outerHTML = sidebarHTML;
})();
