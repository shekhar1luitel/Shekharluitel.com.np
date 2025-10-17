# ShekharLuitel.com.np

A fast, classless Eleventy site for Shekhar Luitel. Content lives in Markdown, layouts use Nunjucks, and styling relies on semantic tags, custom elements, and attribute variants inspired by Adam Stoddard's "This website has no class".

## Project structure

```
assets/         Static assets (CSS, JS, images)
  css/
    base.css    Global tag styles and component rules
    themes.css  Theme tokens for light, dark, berry, and blueprint modes
    syntax.css  Minimal syntax highlighting overrides
  js/
    theme.js    Theme switcher (system/light/dark/berry/blueprint)
content/
  notes/        Markdown posts with front matter
  pages/        Top-level pages (home, work, notes, about, contact)
    work/       Project case studies referenced from the work index
includes/       Shared partials (header, footer)
layouts/        Base, home, page, work, and note layouts
```

## Getting started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server with live reload:
   ```bash
   npm run dev
   ```
   Eleventy will watch content and asset folders, rebuilding to `dist/` and serving via Browsersync.
3. Generate a production build:
   ```bash
   npm run build
   ```
   Outputs a minified static site to `dist/` ready for deployment.

## Theming

The theme switcher stores the selected option in `localStorage` and updates the `<html>` element's `data-theme` and `data-resolved-theme` attributes. Available options:

- `system` (default, follows OS preference)
- `light`
- `dark`
- `berry`
- `blueprint`

Color tokens live in `assets/css/themes.css`. Base typography, layout, and component rules stay in `assets/css/base.css` using tag selectors, custom elements (e.g., `<project-card>`), and attribute variants (e.g., `[variant="ghost"]`).

## Content authoring

- Create new pages in `content/pages/` with front matter specifying a layout and permalink.
- Add notes in `content/notes/` with `layout: note.njk`, `date`, `tags`, and `excerpt` fields.
- Add project case studies under `content/pages/work/`, then reference them automatically via front matter (`order`, `featured`).

## Accessibility & SEO

- Skip link, semantic landmarks, ARIA-friendly navigation with `aria-current`.
- Inline critical CSS in the base layout to limit flash of unstyled content.
- Atom feed (`/feed.xml`), sitemap (`/sitemap.xml` via Eleventy plugin), and social meta tags are included out of the box.

## Deployment

### Netlify

1. Create a new Netlify site from your Git repository.
2. Set the build command to `npm run build` and the publish directory to `dist`.
3. Enable form notifications if you want Netlify to capture submissions from the contact form (`name="contact"`).

### Vercel

1. Import the repository into Vercel.
2. Use the default build command `npm run build` and output directory `dist` (configure under "Build & Output Settings").
3. Disable serverless functions—this is a purely static export.

## Performance targets

- Keep CSS payload under ~8 KB uncompressed across `base.css`, `themes.css`, and `syntax.css`.
- Avoid client-side frameworks. Only `assets/js/theme.js` and the lightweight tag filter script run on the client.

## License

MIT © 2024 Shekhar Luitel
