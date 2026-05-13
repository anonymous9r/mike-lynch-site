# mike-lynch-site

Personal portfolio and resume site for **Mike Lynch** — AI-first web designer, technical SEO specialist, and creative operator based in West Palm Beach, Florida.

**Live site:** Deploys to Netlify from `main`  
**Portfolio:** [9rdesigns.com](https://9rdesigns.com)  
**LinkedIn:** [michael-lynch-08b52375](https://www.linkedin.com/in/michael-lynch-08b52375/)  
**Contact:** [anonymouslynch@gmail.com](mailto:anonymouslynch@gmail.com)

---

## About

A single-page portfolio and resume site built with plain HTML, CSS, and JavaScript. No framework, no build step, no dependency bloat.

The site is designed to be:
- Fast-loading
- Fully responsive
- Accessible
- Easy to edit without a full dev stack
- Strong enough visually to support both hiring and client acquisition

---

## Features

- Semantic one-page HTML structure
- Sticky header with active section highlighting
- Light / dark theme toggle
- Responsive layout with fluid typography
- Scroll reveal effects with reduced-motion support
- Portfolio section linking to live client work
- Netlify-ready static deployment

---

## Stack

- **HTML5** — semantic structure in `index.html`
- **CSS3** — custom properties, layout system, theming, motion, and responsive styles in `assets/css/styles.css`
- **Vanilla JavaScript** — theme toggle, active nav state, scroll reveal logic in `assets/js/main.js`
- **Netlify** — static hosting and deployment
- **Google Fonts** — Inter + Outfit

---

## Project structure

```text
mike-lynch-site/
├── index.html
├── assets/
│   ├── css/
│   │   └── styles.css
│   └── js/
│       └── main.js
├── netlify.toml
└── README.md
```

---

## Local preview

No build process needed.

```bash
# Option 1
python3 -m http.server 8000

# then visit
http://localhost:8000
```

You can also use Netlify CLI if you want to mirror deployment behavior more closely:

```bash
npx netlify dev
```

---

## Deploy to Netlify

1. Go to [Netlify](https://app.netlify.com/)
2. Click **Add new site** → **Import from Git**
3. Connect GitHub
4. Select `anonymous9r/mike-lynch-site`
5. Confirm settings:
   - **Build command:** none
   - **Publish directory:** `.`
6. Deploy

Every push to `main` triggers a fresh deploy automatically. Static sites without preprocessors can use a blank build command and a root publish directory. [web:230][web:233]

---

## Editing guide

Common content locations:

| Change | File / section |
|---|---|
| Hero headline and intro | `index.html` → `#hero` |
| About copy | `index.html` → `#about` |
| Experience timeline | `index.html` → `#experience` |
| Work cards | `index.html` → `#work` |
| Skills and stack | `index.html` → `#skills` |
| AI workflow copy | `index.html` → `#workflow` |
| Contact CTA | `index.html` → `#contact` |
| Theme colors, spacing, type, hover styles | `assets/css/styles.css` |
| Theme toggle, reveal logic, active nav behavior | `assets/js/main.js` |

---

## Notes

- This site is intentionally framework-free so it stays easy to maintain.
- Motion should remain restrained and always respect reduced-motion preferences.
- Live portfolio links should point only to real client work, not placeholders.

---

## License

Resume content, brand copy, and project descriptions © Mike Lynch.  
Code scaffolding may be reused with attribution unless otherwise noted.
