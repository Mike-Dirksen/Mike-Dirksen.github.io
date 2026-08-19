# Michael Dirksen — Personal Website

A research-first static personal site hosted on GitHub Pages. It uses plain HTML, CSS, and a small amount of progressive-enhancement JavaScript, so core content works without a build step or client-side framework.

## Local development

Run `python3 -m http.server 8000` from the repository root, then open `http://localhost:8000`.

## Structure

- `index.html` — About/home page
- `research/` — research index and project pages
- `cv/` — concise HTML CV; add a canonical PDF under `assets/cv/`
- `blog/` — writing index and article pages
- `library/` — annotated library with client-side filters
- `assets/css/site.css` — design system and responsive/print styles
- `assets/js/site.js` — mobile navigation and optional library filters
- `rss.xml`, `sitemap.xml`, `robots.txt` — discovery metadata

## Publishing content

Create a directory with a lowercase hyphenated slug and an `index.html` file beneath the relevant section. Add the new entry to that section's index and, when appropriate, the homepage. Blog entries should also be added to `rss.xml` and `sitemap.xml`.

## Updating the CV

Place a public, metadata-reviewed PDF at `assets/cv/Michael-Dirksen-CV.pdf`, then add an ordinary download link and desktop embed to `cv/index.html`. Keep that URL stable when replacing the PDF.

## Deployment

GitHub Pages serves the repository from `main`. The `.nojekyll` file publishes these static files directly. Before merging, check internal links, keyboard navigation, responsive layouts, metadata, and that no private files or draft claims are included.
