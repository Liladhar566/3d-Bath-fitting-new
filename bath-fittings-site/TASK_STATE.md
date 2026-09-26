# Current Objective

Build out the global design system for the bath-fittings-site project: fonts, colors, type scale, and reusable design components.

# Current Task

Set up the complete design system: Google Fonts, CSS custom properties, Tailwind v4 theme extension, body defaults, fluid typography utility classes, Button component, and SectionHeading component.

# Status

**COMPLETED**

# Completed

- [x] Added Google Fonts "Fraunces" (400, 500) and "Inter" (400, 500, 600) via `<link>` in `index.html`
- [x] Added preconnect hints to `fonts.googleapis.com` and `fonts.gstatic.com`
- [x] Defined CSS custom properties on `:root` (ivory, charcoal, charcoal-soft, metal, bronze, line, font-serif, font-sans)
- [x] Extended Tailwind v4 theme via `@theme` directive mapping CSS vars to utility classes
- [x] Set body defaults: `bg-ivory`, `text-charcoal`, `font-sans`, antialiased
- [x] Created fluid type scale utility classes: `.type-h1`, `.type-h2`, `.type-body`, `.type-eyebrow`
- [x] Created `Button.tsx` with primary/secondary variants, ArrowRight icon, hover animation, `href`→`<a>` support
- [x] Created `SectionHeading.tsx` with eyebrow/heading/description, left/center alignment
- [x] Verified `tsc --noEmit` passes (zero errors)
- [x] Verified `vite build` succeeds
- [x] Updated PROJECT_CONTEXT.md with design system documentation

# In Progress

Nothing — design system task is complete.

# Remaining

No remaining items for the design system task. Potential next steps:

- [ ] Implement Navbar with navigation links and brand mark
- [ ] Implement Footer with site info
- [ ] Add page transition animations in PageTransition.tsx (framer-motion)
- [ ] Create product data (JSON/TS in `src/data/`)
- [ ] Build out Home page hero section with real content
- [ ] Build out Products page with product grid/catalog
- [ ] Build out ProductDetails page with 3D product viewer
- [ ] Replace torus knot placeholder with real 3D hero content
- [ ] Implement About and Contact page content
- [ ] Add responsive design patterns
- [ ] Set up code-splitting / lazy loading for Three.js chunks

# Current Problems / Errors

**None.** The project compiles and builds cleanly.

- Build warning: Output chunk exceeds 500 kB (Three.js). Not a blocker — address with code-splitting later.

# Important Recent Changes

| When | What |
|---|---|
| 2026-09-26 ~10:44 | Added Google Fonts `<link>` with preconnect hints to `index.html` |
| 2026-09-26 ~10:44 | Rewrote `index.css`: CSS custom properties, `@theme` extension, body defaults, fluid type scale |
| 2026-09-26 ~10:45 | Created `Button.tsx` (primary/secondary variants, arrow hover animation) |
| 2026-09-26 ~10:45 | Created `SectionHeading.tsx` (eyebrow + h2 + description) |
| 2026-09-26 ~10:47 | Verified tsc + vite build pass cleanly |
| 2026-09-26 ~10:48 | Updated PROJECT_CONTEXT.md with design system docs |

# Files Being Worked On

| File | Role |
|---|---|
| `index.html` | Google Fonts loading with preconnect |
| `src/index.css` | Design tokens, Tailwind @theme, body defaults, fluid type scale |
| `src/components/Button.tsx` | Reusable button with primary/secondary variants |
| `src/components/SectionHeading.tsx` | Reusable section heading pattern |

# Decisions Made During Current Task

1. Used **Tailwind v4 `@theme` directive** in CSS to map design tokens (not `tailwind.config.js` which is v3-only).
2. Used **CSS custom properties on `:root`** as the single source of truth for design tokens — Tailwind `@theme` references these vars.
3. Used **custom CSS utility classes** (`.type-h1`, `.type-h2`, `.type-body`, `.type-eyebrow`) for fluid typography instead of Tailwind arbitrary values — cleaner and reusable.
4. Button uses **Tailwind's `group` / `group-hover`** pattern for the arrow slide animation — no custom CSS needed.
5. Button renders as **`<a>`** when `href` is provided, **`<button>`** otherwise — for proper semantics.
6. SectionHeading defaults to **center-aligned** with optional `alignment="left"` prop, and auto-centers with `mx-auto` + `max-w-3xl`.
7. Fonts use **`display=swap`** for FOIT prevention and **preconnect hints** for performance.

# What To Do Next

1. **Implement Navbar** — add logo/brand, navigation links using `<Link>` from react-router-dom, styled with design tokens.
2. **Implement Footer** — site info, social links, copyright.
3. **Build Home page** — hero section with real content overlaying the 3D viewer, using Button and SectionHeading.
4. **Create product data** — define product types and sample data in `src/data/`.
5. **Build Products page** — product grid with cards.
6. **Add page transitions** — wire framer-motion into PageTransition.tsx.

# Verification

| Check | Result |
|---|---|
| `tsc --noEmit` | ✅ Pass (zero errors) |
| `vite build` | ✅ Pass (outputs to `dist/`, CSS 10.27 kB) |
| Dev server | Running (`npm run dev` active in terminal) |
| Google Fonts loading | Not manually verified (visual check needed) |
| Button hover animation | Not manually verified (visual check needed) |
| Fluid type responsiveness | Not manually verified (resize browser to test) |

# Last Updated

2026-09-26T10:48:00+05:30
