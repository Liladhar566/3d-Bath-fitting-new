# Current Objective

Build out the interactive Navbar component for the bath-fittings-site.

# Current Task

Replace the placeholder Navbar with a fully implemented component featuring scroll-driven styling, desktop/mobile layouts, and animated mobile overlay.

# Status

**COMPLETED**

# Completed

- [x] Fixed navbar to top of viewport with z-50 (above 3D canvas)
- [x] Desktop layout: logo left, centered nav links (Home, Products, About, Contact), "Enquire" Button far right
- [x] Mobile layout: logo left, hamburger button right (lucide-react Menu/X icons)
- [x] NavLink for all links with active route styling (font-semibold on active)
- [x] Scroll-driven bg: transparent → rgba(ivory, 0.9) over scrollY 0-80px
- [x] Scroll-driven backdrop-filter: blur 0 → 12px over same range
- [x] Scroll-driven border-bottom: opacity 0 → 1 using line color
- [x] Scroll-driven height: 96px → 72px over same range
- [x] All scroll transforms wrapped in useSpring for smooth damped tracking
- [x] Discrete text color swap: ivory when scrollY < 80, charcoal when >= 80
- [x] Mobile overlay: full-screen fixed bg-charcoal, z-40
- [x] Framer Motion staggered animations on overlay links (fade + translateY, 60ms stagger)
- [x] Body scroll lock (overflow hidden) while mobile menu open
- [x] aria-label="Menu" and aria-expanded on hamburger button
- [x] Clicking overlay links closes menu and navigates
- [x] Verified tsc --noEmit passes (zero errors)
- [x] Verified vite build succeeds
- [x] Updated PROJECT_CONTEXT.md

# In Progress

Nothing — Navbar task is complete.

# Remaining

No remaining items for the Navbar task. Potential next steps:

- [ ] Implement Footer with site info, links, copyright
- [ ] Build out Home page hero section with real content overlaying the 3D viewer
- [ ] Add page transition animations in PageTransition.tsx (framer-motion)
- [ ] Create product data (JSON/TS in `src/data/`)
- [ ] Build Products page with product grid/catalog
- [ ] Build ProductDetails page with 3D product viewer
- [ ] Replace torus knot placeholder with real 3D hero content
- [ ] Implement About and Contact page content

# Current Problems / Errors

**None.** The project compiles and builds cleanly.

- Build warning: Output chunk exceeds 500 kB (Three.js + framer-motion). Address with code-splitting later.

# Important Recent Changes

| When | What |
|---|---|
| 2026-09-27 ~00:14 | Replaced placeholder Navbar with full implementation |
| 2026-09-27 ~00:16 | Refactored: moved all useTransform hooks to component top level |
| 2026-09-27 ~00:17 | Verified tsc + vite build pass, updated PROJECT_CONTEXT.md |

# Files Being Worked On

| File | Role |
|---|---|
| `src/components/Navbar.tsx` | Full Navbar implementation — the only file changed |

# Decisions Made During Current Task

1. **All useTransform/useSpring hooks at component top level** — not inside helpers or render functions, ensuring valid React hook call order.
2. **Spring config** `{ stiffness: 200, damping: 30, mass: 0.5 }` — gives a smooth, slightly damped feel rather than 1:1 raw scroll tracking.
3. **Discrete text color swap** via state + `scrollY.on('change')` rather than interpolating text color — cleaner since we only need two states (ivory vs charcoal).
4. **RGB values hardcoded in useTransform callbacks** — `rgba(247, 245, 241, ...)` matches `--color-ivory: #F7F5F1` and `rgba(221, 217, 210, ...)` matches `--color-line: #DDD9D2`. This is necessary because CSS custom properties can't be used inside `rgba()` in Framer Motion transform callbacks.
5. **z-50 for navbar, z-40 for mobile overlay** — ensures the hamburger button stays above the overlay for toggling.
6. **NavLink `end` prop** only on Home (`/`) to prevent it from matching all routes.
7. **Brand text "BathFittings"** as placeholder logo — can be swapped for an SVG/image later.

# What To Do Next

1. **Implement Footer** — site info, navigation links, copyright notice.
2. **Build Home page hero** — real content (heading, subtext, CTA) overlaying the 3D viewer.
3. **Create product data** — define types and sample data in `src/data/`.
4. **Build Products page** — product grid with cards.
5. **Add page transitions** — wire framer-motion into PageTransition.tsx.

# Verification

| Check | Result |
|---|---|
| `tsc --noEmit` | ✅ Pass (zero errors) |
| `vite build` | ✅ Pass (outputs to `dist/`, CSS 14.21 kB, JS 1317 kB) |
| Dev server | Was running, may need restart after server reset |
| Scroll-driven navbar | Needs visual verification in browser |
| Mobile overlay animation | Needs visual verification at < md breakpoint |
| Body scroll lock | Needs manual verification |

# Last Updated

2026-09-27T00:17:00+05:30
