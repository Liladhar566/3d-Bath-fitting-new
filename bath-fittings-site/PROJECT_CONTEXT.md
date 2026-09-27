# Project Overview

- **Name**: bath-fittings-site
- **Purpose**: A 3D-enabled product showcase website for bath fittings. The site will feature interactive 3D product viewers, product catalogs, and standard informational pages.
- **Target Users**: Customers/buyers browsing bath fitting products; potentially B2B or retail.
- **Current Stage**: **Scaffold only** — project structure, routing, dependencies, and 3D integration boundary are in place. No styling, content, or business logic has been implemented yet.

# Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | React (via Vite) | React 19.2.x, Vite 8.3.x |
| Language | TypeScript (strict mode) | ~6.0.2 |
| Styling | Tailwind CSS v4 | 4.3.x (via `@tailwindcss/postcss`) |
| CSS Processing | PostCSS + Autoprefixer | postcss 8.x, autoprefixer 10.x |
| Routing | react-router-dom | 7.18.x |
| Animation | framer-motion | 13.4.x |
| 3D Rendering | three + @react-three/fiber + @react-three/drei | three 0.186.x, R3F 9.8.x, drei 10.7.x |
| Icons | lucide-react | 1.48.x |
| Linting | oxlint | 1.81.x |
| Database/Backend | None (frontend-only at this stage) | — |
| Authentication | None | — |
| Hosting/Deployment | Not configured | — |

# Project Structure

```
bath-fittings-site/
├── index.html                 # HTML entry + Google Fonts (Fraunces, Inter)
├── vite.config.ts             # Vite config with path aliases
├── tsconfig.json              # Root TS config (references app + node)
├── tsconfig.app.json          # App TS config: strict mode, path aliases
├── tsconfig.node.json         # Node TS config (for vite.config.ts)
├── postcss.config.mjs         # PostCSS: @tailwindcss/postcss + autoprefixer
├── package.json               # Dependencies and scripts
├── public/                    # Static assets served at root
├── src/
│   ├── main.tsx               # React entry: StrictMode + App render
│   ├── App.tsx                # BrowserRouter + all route definitions
│   ├── index.css              # Design system: tokens, @theme, body defaults, fluid type scale
│   ├── components/
│   │   ├── Layout.tsx         # Persistent layout: Navbar + PageTransition(Outlet) + Footer
│   │   ├── Navbar.tsx         # Fixed navbar: scroll-driven bg/blur/height, mobile overlay
│   │   ├── Footer.tsx         # 4-col grid footer: brand, nav, collections, contact + copyright
│   │   ├── PageTransition.tsx # Pass-through wrapper (no animation yet)
│   │   ├── ThreeDViewer.tsx   # R3F Canvas owner (camera, lights, Suspense, reduced-motion)
│   │   ├── HeroSceneContent.tsx # Scene-graph-only: rotating torus knot placeholder
│   │   ├── Button.tsx         # Primary/secondary button with arrow icon
│   │   ├── SectionHeading.tsx # Eyebrow + h2 + description pattern
│   │   ├── ProductCard.tsx   # Product card: image, category, name, price, hover effects
│   │   └── ProductGrid.tsx   # Responsive grid of ProductCards (1→2→3 cols)
│   ├── pages/
│   │   ├── Home.tsx           # Full homepage: Hero (3D + staggered text), Brand Intro, Categories, Featured Products
│   │   ├── Products.tsx       # Placeholder h1
│   │   ├── ProductDetails.tsx # Placeholder h1 (route param: :productId)
│   │   ├── About.tsx          # Placeholder h1
│   │   └── Contact.tsx        # Placeholder h1
│   ├── data/
│   │   ├── products.ts        # Product interface + 9 seed products across 5 categories
│   │   └── categories.ts      # 6 category entries (All + 5 real categories)
│   ├── services/
│   │   └── productService.ts  # Pure functions: getAll, bySlug, featured, byCategory
│   ├── config/
│   │   └── site.ts            # Central site configuration (brand, hero text, contact, social)
│   └── assets/
│       ├── 3d/                # Empty — for 3D models (.glb, .gltf, etc.)
│       ├── images/            # Empty — for general images
│       └── products/          # Empty — for product images
```

# Architecture

```
main.tsx
  └─ App.tsx (BrowserRouter)
       └─ Layout.tsx (persistent wrapper)
            ├─ Navbar.tsx (rendered on every page)
            ├─ <main>
            │    └─ PageTransition.tsx (wraps Outlet)
            │         └─ <Outlet /> → routed page component
            └─ Footer.tsx (rendered on every page)

ThreeDViewer.tsx (Canvas owner)
  └─ HeroSceneContent.tsx (scene-graph children only, no Canvas)
```

- **Routing**: Flat route config in `App.tsx`. All routes are children of the `Layout` route.
- **3D Boundary**: `ThreeDViewer` owns the single `<Canvas>`. Scene content components (`HeroSceneContent`) render only R3F scene-graph JSX (meshes, lights, groups) — never their own Canvas.
- **Reduced Motion**: Detected via `useSyncExternalStore` + `matchMedia('(prefers-reduced-motion: reduce)')` in `ThreeDViewer`, passed as `reducedMotion` boolean prop to scene content.
- **Page Transitions**: `PageTransition` is a structural wrapper around `<Outlet>` — currently pass-through, intended for framer-motion animation later.

# Important Features

| Feature | Status | Notes |
|---|---|---|
| React Router navigation | ✅ Wired | 5 routes, all rendering placeholder h1 elements |
| Layout with Navbar/Footer | ✅ Wired | Both Navbar and Footer fully implemented |
| Footer | ✅ Implemented | 4-col grid, charcoal bg, whileInView fade-in, responsive stacking |
| Navbar | ✅ Implemented | Scroll-driven bg/blur/height, NavLink active states, mobile overlay |
| 3D Canvas integration | ✅ Wired | R3F Canvas with camera, lights, DPR, Suspense |
| Rotating torus knot | ✅ Working | Placeholder 3D content with reduced-motion support |
| Design system | ✅ Implemented | Colors, fonts, fluid type scale, body defaults |
| Button component | ✅ Implemented | Primary (bronze) / secondary (outlined) with arrow hover |
| SectionHeading component | ✅ Implemented | Eyebrow + h2 + description, left/center alignment |
| Page transitions | ⬜ Stub only | PageTransition is pass-through, no animation yet |
| Product data layer | ✅ Implemented | 9 products, 5 categories, Product interface, service functions |
| ProductCard component | ✅ Implemented | Image 4:5, eyebrow category, name, price, hover effects |
| ProductGrid component | ✅ Implemented | Responsive 1→2→3 col grid, empty-state message |
| Contact form | ⬜ Not started | — |

# Data / Backend

- **No database or external API** — all product data is static in `src/data/products.ts`.
- **Product interface**: `id`, `slug`, `name`, `category`, `price?`, `image`, `description`, `featured?`, `model?`, `gallery?`, `specifications?`.
- **9 seed products** across 5 categories: Faucets (2), Basin Mixers (2), Showers (2), Bath Fittings (1), Accessories (2). 5 are `featured: true`.
- **Categories** defined in `src/data/categories.ts`: All, Faucets, Basin Mixers, Showers, Bath Fittings, Accessories.
- **Service layer** (`src/services/productService.ts`): `getAllProducts()`, `getProductBySlug(slug)`, `getFeaturedProducts()`, `getProductsByCategory(category)` — pure functions, case-insensitive matching.
- Product images use placeholder paths (`/products/placeholder-N.jpg`) that will 404 until real images are added.
- No secrets or credentials exist in the project.

# Design System / UI

**Visual Style**: Warm, premium, minimal — inspired by high-end bath/interior design brands.

**Colors** (CSS custom properties on `:root`, mapped to Tailwind via `@theme`):
| Token | Variable | Value | Usage |
|---|---|---|---|
| ivory | `--color-ivory` | `#F7F5F1` | Background |
| charcoal | `--color-charcoal` | `#1A1918` | Primary text |
| charcoal-soft | `--color-charcoal-soft` | `#2E2C2A` | Button hover |
| metal | `--color-metal` | `#8C8985` | Secondary text, descriptions |
| bronze | `--color-bronze` | `#A47551` | Accent, primary button |
| line | `--color-line` | `#DDD9D2` | Borders, dividers |

**Typography**:
- **Serif**: Fraunces (400, 500) — headings
- **Sans**: Inter (400, 500, 600) — body, UI
- Loaded via Google Fonts `<link>` in `index.html` with preconnect hints
- CSS vars: `--font-serif`, `--font-sans` → Tailwind `font-serif`, `font-sans`

**Fluid Type Scale** (utility classes in `index.css`):
| Class | Size | Font | Weight | Line-height |
|---|---|---|---|---|
| `.type-h1` | `clamp(2.25rem, 5vw, 4.5rem)` | serif | 500 | 1.08 |
| `.type-h2` | `clamp(1.75rem, 3.5vw, 3rem)` | serif | 500 | 1.15 |
| `.type-body` | `clamp(1rem, 1.2vw, 1.125rem)` | sans | — | 1.6 |
| `.type-eyebrow` | `0.8125rem` | sans | 600 | 1.4, uppercase, tracked |

**Components**:
- `Button.tsx` — Primary (bronze bg, ivory text) / Secondary (transparent, charcoal border). Arrow icon slides right on hover. Renders `<a>` if `href` provided.
- `SectionHeading.tsx` — Eyebrow label + h2 heading + optional description. Center-aligned by default.

**Body Defaults**: `bg: ivory`, `color: charcoal`, `font: sans`, antialiased.

# Important Decisions

1. **Tailwind CSS v4** (not v3): Uses the new `@import "tailwindcss"` syntax and `@tailwindcss/postcss` plugin. Do NOT add a `tailwind.config.js` — v4 uses CSS-based configuration.
2. **TypeScript strict mode** is enabled in `tsconfig.app.json`. Do not disable it.
3. **Path aliases** (`@/components`, `@/pages`, `@/data`, `@/services`, `@/assets`) are configured in BOTH `vite.config.ts` and `tsconfig.app.json`. If adding new aliases, update both files.
4. **3D boundary pattern**: Only `ThreeDViewer.tsx` may contain a `<Canvas>`. All other 3D components must be scene-graph-only (mesh/group/light JSX). This prevents multiple Canvas instances.
5. **Reduced motion**: Accessibility-first approach — all animations must respect `prefers-reduced-motion`. The `useReducedMotion` hook in ThreeDViewer is the canonical way to detect this.
6. **verbatimModuleSyntax** is enabled — use `import type` for type-only imports.
7. **ESM-only**: `"type": "module"` in package.json. Config files use `.mjs` extension or ESM syntax.
8. **Design tokens in CSS**: All colors and fonts are defined as CSS custom properties in `index.css :root` and mapped to Tailwind via `@theme`. Do not hardcode color values in components — always use token classes (`bg-ivory`, `text-bronze`, etc.) or CSS variables.
9. **Fluid typography classes**: Use `.type-h1`, `.type-h2`, `.type-body`, `.type-eyebrow` for consistent typography. Do not set ad-hoc font sizes on headings.

# Rules / Constraints

- **Do not remove or rename** existing route paths without coordinating across all linking components.
- **Do not create additional `<Canvas>` instances** — the ThreeDViewer is the single Canvas owner.
- **Use `@/` path aliases** for all imports across `src/` directories. Do not use relative `../../` paths.
- **Use `import type`** for type-only imports (enforced by `verbatimModuleSyntax`).
- **Do not add a `tailwind.config.js`** — Tailwind v4 is CSS-configured.
- **Linting**: oxlint is the configured linter (`npm run lint`).
- **Build script**: `npm run build` runs `tsc -b && vite build`. Both must pass cleanly.
- No accessibility, SEO, or performance patterns are implemented yet, but they are intended for future steps.

# Current Known Issues

- **No known runtime errors.** Both `tsc --noEmit` and `vite build` pass cleanly.
- **Vite build warning**: Chunk size exceeds 500 kB (Three.js is large). Will need code-splitting / dynamic imports in the future.
- **Leftover scaffold files**: `src/assets/hero.png` and `src/assets/vite.svg` are remnants from the Vite scaffold template and are unused.

# Deployment

- **Not configured.** No CI/CD, hosting, or deployment pipeline exists.
- **Available scripts**:
  - `npm run dev` — Start Vite dev server
  - `npm run build` — TypeScript check + production build (outputs to `dist/`)
  - `npm run preview` — Preview production build locally
  - `npm run lint` — Run oxlint

# AI Instructions

1. **Read this file and TASK_STATE.md** at the start of every conversation before making changes.
2. **Use path aliases** (`@/components/...`, `@/pages/...`, etc.) for all imports.
3. **Use `import type`** for type-only imports.
4. **Do not create new `<Canvas>` elements** — add 3D content as scene-graph components rendered inside ThreeDViewer.
5. **Respect the 3D boundary**: ThreeDViewer = Canvas owner. Scene content components = scene-graph JSX only.
6. **Update TASK_STATE.md** after completing significant work.
7. **Run `tsc --noEmit` and `npm run build`** to verify changes compile before finishing.
8. **Tailwind v4 syntax**: Use `@import "tailwindcss"` and CSS-based config, not the v3 `tailwind.config.js` approach.
9. **Do not disable strict mode** or weaken TypeScript settings.
10. **Use design token classes** (`bg-ivory`, `text-charcoal`, `text-metal`, `bg-bronze`, etc.) and fluid type utilities (`.type-h1`, `.type-h2`, `.type-body`, `.type-eyebrow`). Do not hardcode colors or font sizes.
11. **Button and SectionHeading** are the first reusable design components. Use them for consistency instead of creating ad-hoc styled buttons or headings.
12. This project has its design system in place — expect to build out Navbar, Footer, page content, product data, and real 3D models in upcoming tasks.
