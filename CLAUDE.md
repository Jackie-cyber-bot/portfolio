# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **static portfolio website** for UX/UI designer Jiaqi Gu. No build tools, package manager, or compilation step — files are served directly to the browser.

## Development

Open any `.html` file directly in a browser, or use a local static server:
```bash
python3 -m http.server 8000
```
The navbar uses `fetch()` to load `navbar.html`, so it requires a server (not `file://` protocol) to render correctly. A fallback exists for `file://` but navbar links won't highlight correctly.

## Architecture

**Multi-page static site** with shared components:

- `navbar.html` — Navigation component fetched and injected into `#navbar-container` on every page
- `styles.css` — Single stylesheet for all pages; uses CSS custom properties for theming
- `script.js` — Single JS file loaded on every page; functions are selectively invoked per page

**script.js execution flow:**
1. `loadNavbar()` fetches and injects `navbar.html`, then calls `setActiveNavLink()` and `initNavbar()`
2. `initWorkFilters()` is only called on `index.html` (project filtering: All / App Design / Web Design / Rebranding)
3. `initContactForm()` is only called on `contact.html` (submits via `mailto:`)

**Theme system:** Dark/light mode is toggled via a button and persisted in `localStorage`. A `<script>` tag in each page's `<head>` reads `localStorage` before render to prevent flash-of-wrong-theme. Theme classes are applied on `<body>`.

**CSS variables** defined on `:root` and overridden under `body.dark-mode`: `--text-primary`, `--text-secondary`, `--bg-primary`, `--bg-secondary`, `--accent-color`, etc.

## Pages

| Page | Purpose |
|------|---------|
| `index.html` | Home / work grid with category filters |
| `about.html` | Designer bio |
| `contact.html` | Contact form (opens email client via mailto) |
| `project-[1-4].html` | Individual project case studies |

## Adding a New Project

1. Create `project-N.html` by copying an existing project page
2. Add a project card to `index.html` with the appropriate `data-category` attribute (`app-design`, `web-design`, or `rebranding`)
3. Add project assets to `images/`
4. Update the filter logic in `script.js` if adding a new category
