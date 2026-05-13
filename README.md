# mike-lynch-site

Personal portfolio and resume site for **Mike Lynch** — Senior Web Designer, Technical SEO Specialist, and AI Workflow Operator based in West Palm Beach, FL (fully remote).

**Live site:** _Deploys to Netlify from `main`._  
**Portfolio:** [9rdesigns.com](https://9rdesigns.com)  
**LinkedIn:** [michael-lynch-08b52375](https://www.linkedin.com/in/michael-lynch-08b52375/)  
**Contact:** [anonymouslynch@gmail.com](mailto:anonymouslynch@gmail.com)

---

## About

A single-page static resume + portfolio site. Hand-written HTML and CSS, no build step, no framework. Designed for fast loads, clean typography, and a layout that holds up on phones, tablets, and full desktop.

Highlights:
- Light/dark theme toggle (respects `prefers-color-scheme`)
- Fluid typography with `clamp()` so type scales smoothly across viewports
- Accessible: skip-link, semantic landmarks, focus styles, reduced-motion support
- Zero dependencies beyond Google Fonts (Instrument Serif + Work Sans)

## Tech

- **HTML5** — semantic markup, single `index.html`
- **CSS** — custom properties, fluid type, theme tokens (inline in `<style>`)
- **Vanilla JS** — ~10 lines for the theme toggle
- **Netlify** — hosting, redirects, security headers (`netlify.toml`)

## Project structure

```
mike-lynch-site/
├── index.html       # The whole site
├── netlify.toml     # Netlify config: publish dir, redirects, headers
└── README.md
```

## Local preview

No build needed. Pick one:

```bash
# Option 1: open the file directly
open index.html

# Option 2: serve with Python
python3 -m http.server 8000
# then visit http://localhost:8000

# Option 3: Netlify CLI (matches production headers/redirects)
npx netlify dev
```

## Deploy to Netlify

1. Go to [app.netlify.com](https://app.netlify.com) → Add new site → Import from Git
2. Authorize GitHub and select `anonymous9r/mike-lynch-site`
3. Build settings auto-detect from `netlify.toml`:
   - Build command: (none)
   - Publish directory: `.`
4. Click Deploy — first build takes ~30 seconds

Every push to `main` triggers a new deploy automatically.

### Custom domain

In Netlify: Site settings → Domain management → Add custom domain. Netlify provisions a free Let's Encrypt SSL certificate.

## Editing content

All copy lives in `index.html`. Common edits:

| What to change | Where |
|---|---|
| Headline + lead paragraph | `<section class="hero">` |
| Job history | `<div class="timeline">` |
| Portfolio cards | `<div class="portfolio-grid">` |
| Skills | `<div class="skills">` |
| Contact info | Footer + header `mailto:` links |
| Theme colors | `:root` and `[data-theme="dark"]` CSS variables |

## License

Content (resume copy, project descriptions) © Mike Lynch. The HTML/CSS scaffolding is free to reuse with attribution.
