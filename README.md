# AP Calculus AB & BC Tutorial

A complete, free tutorial course for AP Calculus AB and BC, aligned with the College Board curriculum and Georgia state standards. Hosted at [avinashai.com](https://avinashai.com).

## Features

- **10 Chapters** — Limits through Series (AB topics Ch 1–8, BC-only Ch 9–10)
- **200 MCQs** — 20 per chapter with interactive answer checking and explanations
- **50 FRQs** — 25 AB + 25 BC with full step-by-step solutions, scoring rubrics, and SVG diagrams
- **Full Answer Key** — All 200 MCQ answers in one scannable page
- **Dark-themed UI** — Modern typography (Inter + JetBrains Mono), KaTeX math rendering

## Structure

```
Calculus-Tutorial/
├── index.html               # Course home
├── css/style.css            # Shared stylesheet
├── js/
│   ├── main.js              # KaTeX, MCQ interactivity, FRQ accordions
│   └── nav.js               # Dynamic navigation injector
├── chapters/
│   ├── ch01-limits.html
│   ├── ch02-derivatives.html
│   ├── ch03-advanced-diff.html
│   ├── ch04-contextual.html
│   ├── ch05-analytical.html
│   ├── ch06-integration.html
│   ├── ch07-diff-equations.html
│   ├── ch08-applications.html
│   ├── ch09-parametric-polar.html  # BC only
│   └── ch10-series.html            # BC only
├── mcq/
│   ├── mcq-ch01.html  through  mcq-ch10.html
├── frq/
│   ├── frq-ab.html    # 25 AB FRQs
│   └── frq-bc.html    # 25 BC FRQs
└── answers/
    └── answer-key.html
```

## Technology

- Pure HTML/CSS/JS — no build step required
- [KaTeX](https://katex.org/) for math rendering (CDN)
- Google Fonts: Inter, JetBrains Mono, Merriweather

## Deployment

Deploy by serving the root directory as a static site. No server-side processing needed.

```bash
# Local preview
python3 -m http.server 8080
# Then open http://localhost:8080
```

For production hosting on avinashai.com, commit and push to the deployment branch.

## License

Educational content. Free to use for personal learning.
