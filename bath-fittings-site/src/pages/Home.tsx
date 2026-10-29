import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import ThreeDViewer from '@/components/ThreeDViewer'
import HeroOverlay from '@/components/HeroOverlay'
import Button from '@/components/Button'
import SectionHeading from '@/components/SectionHeading'
import ProductGrid from '@/components/ProductGrid'
import { getFeaturedProducts } from '@/services/productService'

const CATEGORIES = [
  {
    name: 'Faucets',
    slug: 'faucets',
    image: '/categories/placeholder-1.jpg',
  },
  {
    name: 'Basin Mixers',
    slug: 'basin-mixers',
    image: '/categories/placeholder-2.jpg',
  },
  {
    name: 'Showers',
    slug: 'showers',
    image: '/categories/placeholder-3.jpg',
  },
  {
    name: 'Bath Fittings',
    slug: 'bath-fittings',
    image: '/categories/placeholder-4.jpg',
  },
  {
    name: 'Accessories',
    slug: 'accessories',
    image: '/categories/placeholder-5.jpg',
  },
  {
    name: 'Bathroom Collections',
    slug: 'all',
    image: '/categories/placeholder-6.jpg',
  },
]

const RUNWAY_VH = { desktop: 500, mobile: 400 }
const OVERLAP_VH = 60
const SCROLL_SPRING = { stiffness: 80, damping: 30, restDelta: 0.0001 }

export default function Home() {
  const runwayRef = useRef<HTMLElement>(null)
  const navigate = useNavigate()

  /* ---- Track mobile viewport with MediaQueryList ------------------ */
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 767px)')
    setIsMobile(mql.matches)
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  const runwayVh = isMobile ? RUNWAY_VH.mobile : RUNWAY_VH.desktop
  const endAt = (runwayVh - 100 - OVERLAP_VH) / (runwayVh - 100)
  const endAtRef = useRef(endAt)
  useEffect(() => {
    endAtRef.current = endAt
  }, [endAt])

  /* ---- Scroll-linked progress for the full runway ----------------- */
  const { scrollYProgress } = useScroll({
    target: runwayRef,
    offset: ['start start', 'end end'],
  })

  const rawChoreographyProgress = useTransform(scrollYProgress, (v) =>
    Math.min(1, Math.max(0, v / endAtRef.current))
  )
  const choreographyProgress = useSpring(rawChoreographyProgress, SCROLL_SPRING)

  return (
    <div className="w-full bg-ivory">
      {/* ============================================================ */}
      {/* HERO RUNWAY — tall scroll region with sticky 3D canvas       */}
      {/* ============================================================ */}
      <section
        ref={runwayRef}
        className="relative"
        style={{ height: `${runwayVh}vh` }}
      >
        <div className="sticky top-0 h-[100svh] w-full overflow-hidden z-0">
          <ThreeDViewer
            className="z-0"
            scrollProgress={choreographyProgress}
          />
          <HeroOverlay scrollProgress={choreographyProgress} />
        </div>
      </section>

      {/* ============================================================ */}
      {/* BRAND INTRODUCTION                                           */}
      {/* ============================================================ */}
      <section
        style={{ marginTop: `-${OVERLAP_VH}vh` }}
        className="relative z-10 py-[clamp(64px,10vw,120px)] px-6 md:px-12 bg-ivory border-t border-line/40"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className="max-w-3xl mx-auto text-center"
        >
          <p className="type-eyebrow text-bronze tracking-widest mb-4">
            OUR PHILOSOPHY
          </p>
          <h2 className="type-h2 text-charcoal font-serif mb-6">
            Precision in every detail.
          </h2>
          <p className="type-body text-metal max-w-2xl mx-auto">
            Every contour, valve, and surface is engineered with exacting standards. We marry elemental purity with uncompromising craftsmanship to elevate everyday spaces into sanctuaries of calm.
          </p>
        </motion.div>
      </section>

      {/* ============================================================ */}
      {/* CATEGORY GRID                                                */}
      {/* ============================================================ */}
      <section className="relative z-10 py-[clamp(64px,10vw,120px)] px-6 md:px-12 bg-ivory border-t border-line/40">
        <div className="max-w-[1440px] mx-auto">
          <div className="mb-12 md:mb-16">
            <SectionHeading heading="Our Collections" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                to={cat.slug === 'all' ? '/products' : `/products?category=${encodeURIComponent(cat.slug)}`}
                className="group block transition-transform duration-300 ease-out hover:-translate-y-1.5"
              >
                <div className="relative aspect-[4/3] bg-line/20 overflow-hidden mb-4">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                </div>
                <div className="flex items-center justify-between pt-1">
                  <h3 className="font-serif text-lg md:text-xl font-medium text-charcoal group-hover:text-bronze transition-colors duration-300">
                    {cat.name}
                  </h3>
                  <ArrowUpRight
                    size={20}
                    className="text-metal transition-all duration-300 ease-out group-hover:text-charcoal group-hover:translate-x-1 group-hover:-translate-y-1"
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* FEATURED PRODUCTS                                            */}
      {/* ============================================================ */}
      <section className="relative z-10 py-[clamp(64px,10vw,120px)] px-6 md:px-12 bg-ivory border-t border-line/40">
        <div className="max-w-[1440px] mx-auto">
          <div className="mb-12 md:mb-16">
            <SectionHeading heading="Featured Products" />
          </div>

          <ProductGrid products={getFeaturedProducts()} />

          <div className="mt-12 md:mt-16 text-center">
            <Button
              variant="secondary"
              href="/products"
              onClick={(e) => {
                e.preventDefault()
                navigate('/products')
              }}
            >
              View All Products
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
