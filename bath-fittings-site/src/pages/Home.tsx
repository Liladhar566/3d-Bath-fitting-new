import { useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import ThreeDViewer from '@/components/ThreeDViewer'
import Button from '@/components/Button'
import SectionHeading from '@/components/SectionHeading'
import ProductGrid from '@/components/ProductGrid'
import { getFeaturedProducts } from '@/services/productService'
import { siteConfig } from '@/config/site'

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

const heroContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
}

const heroChildVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
}

const SPRING_CONFIG = { stiffness: 100, damping: 25, restDelta: 0.001 }

export default function Home() {
  const heroRef = useRef<HTMLElement>(null)
  const navigate = useNavigate()

  /* HERO SCROLL TRANSITION */
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })

  const textOpacityRaw = useTransform(scrollYProgress, [0, 0.85], [1, 0])
  const viewerScaleRaw = useTransform(scrollYProgress, [0, 1], [1, 0.92])

  const textOpacity = useSpring(textOpacityRaw, SPRING_CONFIG)
  const viewerScale = useSpring(viewerScaleRaw, SPRING_CONFIG)

  return (
    <div className="w-full bg-ivory">
      {/* SECTION 1 — HERO (100vh desktop, 90vh mobile) */}
      <section
        ref={heroRef}
        className="relative w-full h-[90vh] md:h-screen overflow-hidden bg-ivory"
      >
        <div className="max-w-[1440px] mx-auto h-full flex flex-col md:grid md:grid-cols-2 items-center px-6 md:px-12 lg:px-16 pt-20 md:pt-0">
          {/* Left Column: Staggered Entrance Content */}
          <motion.div
            style={{ opacity: textOpacity }}
            className="order-2 md:order-1 flex flex-col justify-center py-4 md:py-0 z-10 flex-1 md:flex-initial"
          >
            <motion.div
              variants={heroContainerVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col"
            >
              {/* 1. Eyebrow */}
              <motion.div variants={heroChildVariants}>
                <p className="type-eyebrow text-metal tracking-widest mb-3 md:mb-4">
                  {siteConfig.hero.eyebrow}
                </p>
              </motion.div>

              {/* 2. H1 */}
              <motion.div variants={heroChildVariants}>
                <h1 className="type-h1 text-charcoal tracking-tight leading-[1.08]">
                  <span className="block">{siteConfig.hero.headlineLine1}</span>
                  <span className="block">{siteConfig.hero.headlineLine2}</span>
                </h1>
              </motion.div>

              {/* 3. One-sentence premium brand paragraph */}
              <motion.div variants={heroChildVariants}>
                <p className="type-body text-metal mt-4 md:mt-6 max-w-lg">
                  {siteConfig.hero.description}
                </p>
              </motion.div>

              {/* 4. Button group */}
              <motion.div
                variants={heroChildVariants}
                className="mt-6 md:mt-8 flex flex-wrap items-center gap-4"
              >
                <Button
                  variant="primary"
                  href="/products"
                  onClick={(e) => {
                    e.preventDefault()
                    navigate('/products')
                  }}
                >
                  Explore Collection
                </Button>
                <Button
                  variant="secondary"
                  href="/contact"
                  onClick={(e) => {
                    e.preventDefault()
                    navigate('/contact')
                  }}
                >
                  Enquire Now
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right Column: ThreeDViewer Container */}
          <motion.div
            style={{ scale: viewerScale }}
            className="order-1 md:order-2 w-full h-[45vh] md:h-full relative overflow-hidden flex items-center justify-center shrink-0"
          >
            <ThreeDViewer />
          </motion.div>
        </div>
      </section>

      {/* SECTION 3 — BRAND INTRODUCTION */}
      <section className="py-[clamp(64px,10vw,120px)] px-6 md:px-12 bg-ivory border-t border-line/40">
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

      {/* SECTION 4 — CATEGORY GRID */}
      <section className="py-[clamp(64px,10vw,120px)] px-6 md:px-12 bg-ivory border-t border-line/40">
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

      {/* SECTION 5 — FEATURED PRODUCTS */}
      <section className="py-[clamp(64px,10vw,120px)] px-6 md:px-12 bg-ivory border-t border-line/40">
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
