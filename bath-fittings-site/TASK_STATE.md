# Current Objective

Rebuild hero 3D scene to depict overhead shower head with control valve and scroll-driven water flow.

# Current Task

Rewrite `src/components/HeroSceneContent.tsx`, forward `scrollProgress` through `src/components/ThreeDViewer.tsx`, and derive `heroScrollProgress` in `src/pages/Home.tsx`.

# Status

**COMPLETED**

# Completed

- [x] Fixed hero button group in `src/pages/Home.tsx` to use `flex flex-col sm:flex-row gap-4` for clean vertical stacking on narrow viewports.
- [x] Fixed navbar text/logo color in `src/components/Navbar.tsx` to consistently use `text-charcoal`, removing the scroll-based color-swap logic while preserving background/blur/height transitions.
- [x] Rewrote `src/components/HeroSceneContent.tsx`:
  - Overhead shower fitting: wall-mount arm with escutcheon, horizontal pipe, elbow connector, and wide angled disc shower head (`#E8E8E8`, metalness 0.9, roughness 0.25).
  - Control valve with cylindrical body and rotating lever mesh.
  - Water spray effect: plane beneath nozzle with custom `ShaderMaterial` (vertical-scrolling noise driven by `uTime`, light blue-white additive blending, opacity driven by `uOpacity`).
  - 8 droplet spheres falling continuously with staggered offsets/speeds, opacity matching water.
  - Accepts `scrollProgress: MotionValue<number>` prop, reads `scrollProgress.get()` inside `useFrame` without storing in React state.
  - Lerps lever `rotation.z` from 0 to `Math.PI * 0.4` and water `uOpacity` / droplet opacity from 0 to 1 based on scroll progress.
  - Preserves mouse-parallax tilt on outer group and freezes ambient idle bob when `reducedMotion` is true, while keeping scroll-driven response active.
- [x] Updated `src/components/ThreeDViewer.tsx`:
  - Accepts `scrollProgress` (`MotionValue<number>`) and forwards down to `HeroSceneContent`.
  - Retained Canvas, studio Environment, camera setup, and reduced motion detection.
- [x] Updated `src/pages/Home.tsx`:
  - Derived `heroScrollProgress` via `useTransform(scrollYProgress, [0, 0.25, 1], [0, 1, 1])`.
  - Passed `scrollProgress={heroScrollProgress}` to `<ThreeDViewer />`.
- [x] Verified `tsc --noEmit` and `vite build` pass with 0 errors.

- [x] Generated Stitch design references for About page and Contact page (project 13646462438883013133).
- [x] Created `src/components/EnquiryForm.tsx`:
  - `variant="modal"`: fixed overlay + centered panel with Framer Motion scale+fade, backdrop click and Escape key close.
  - `variant="inline"`: same form fields rendered directly in page flow, no overlay.
  - Fields: Name (required), Phone (required), Email (required, validated), Product (read-only if prefilled), Message (optional).
  - Submit replaces form with success message ("Thank you — we'll be in touch shortly.").
- [x] Created `src/pages/Products.tsx`:
  - SectionHeading with eyebrow + heading + description.
  - Category filter pills from `categories.ts` — active pill has bronze underline.
  - Search input filtering by product name, combined with active category.
  - Results wrapped in `AnimatePresence mode="popLayout"` with staggered fade+scale transitions.
  - Does NOT modify ProductGrid or ProductCard.
- [x] Created `src/pages/ProductDetails.tsx`:
  - `useParams` + `getProductBySlug` lookup.
  - Not found: centered message + "Back to Collection" button.
  - Found: two-column (stack mobile) — left image (4:5), right info column with staggered entrance.
  - Specs: label/value rows with `divide-y divide-line`, staggered reveal.
  - "Enquire Now" button opens `<EnquiryForm variant="modal" prefilledProduct={product.name} />`.
- [x] Created `src/pages/About.tsx`:
  - Hero section: centered serif statement + paragraph, generous padding.
  - 4 alternating sections (Our Story, Craftsmanship, Materials & Technology, Brand Values): two-column with `md:[direction:rtl]` for alternation, `whileInView` reveal.
  - Placeholder images `/about/placeholder-N.jpg`.
- [x] Created `src/pages/Contact.tsx`:
  - Two-column: left = contact info from `siteConfig.contact`, business hours, bordered "Map" placeholder, WhatsApp CTA.
  - Right = `<EnquiryForm variant="inline" />`.
- [x] `tsc --noEmit` passes with 0 errors.
- [x] `vite build` succeeds cleanly.
- [x] Updated `PROJECT_CONTEXT.md` and `TASK_STATE.md`.

# Remaining

- [ ] Add page transition animations in PageTransition.tsx
- [ ] Replace torus knot placeholder with real 3D hero content
- [ ] Add real product, category, and about images
- [ ] Implement SEO meta tags per page

# Current Problems / Errors

**None.** The project compiles and builds cleanly.

# Important Recent Changes

| When | What |
|---|---|
| 2026-09-27 ~15:09 | Created `src/components/EnquiryForm.tsx` (modal + inline variants) |
| 2026-09-27 ~15:10 | Created `src/pages/Products.tsx` with filtering + animated grid |
| 2026-09-27 ~15:10 | Created `src/pages/ProductDetails.tsx` with slug lookup + specs + modal enquiry |
| 2026-09-27 ~15:11 | Created `src/pages/About.tsx` with hero + 4 alternating sections |
| 2026-09-27 ~15:11 | Created `src/pages/Contact.tsx` with contact info + inline form |
| 2026-09-27 ~15:12 | Verified tsc and vite build pass cleanly |

# Files Being Worked On

| File | Role |
|---|---|
| `src/components/EnquiryForm.tsx` | Shared enquiry form (modal + inline) |
| `src/pages/Products.tsx` | Catalog with filtering and animated grid |
| `src/pages/ProductDetails.tsx` | Individual product detail with modal enquiry |
| `src/pages/About.tsx` | Brand story with alternating sections |
| `src/pages/Contact.tsx` | Contact info + inline enquiry form |

# Decisions Made During Current Task

1. **Products page filter animation** — Wrapped individual `ProductCard` in `motion.div` with `AnimatePresence mode="popLayout"` and `layout` prop, avoiding any changes to ProductCard/ProductGrid components. Stagger delay `i * 0.04` for subtle cascade.
2. **EnquiryForm architecture** — Single component with `variant` prop rather than separate Modal/Inline components, reducing duplication. `FormContent` is an internal sub-component shared by both variants.
3. **About page alternation** — Used `md:[direction:rtl]` CSS trick to reverse column order on even sections rather than conditional `order-` classes, which is cleaner and auto-reverses all children.
4. **ProductDetails specs animation** — `staggerChildren: 0.06` with `delayChildren: 0.3` so specs cascade after the main info column slides in.
5. **Contact page WhatsApp** — Placeholder `href="https://wa.me/919876543210"` using standard WhatsApp API link format.

# Verification

| Check | Result |
|---|---|
| `tsc --noEmit` | ✅ Pass (zero errors) |
| `vite build` | ✅ Pass (CSS 23.18 kB, JS 1347.70 kB) |
| Dev server | Running |

# Last Updated

2026-09-27T15:13:00+05:30
