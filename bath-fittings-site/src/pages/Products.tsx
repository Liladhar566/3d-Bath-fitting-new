import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SectionHeading from '@/components/SectionHeading'
import ProductCard from '@/components/ProductCard'
import { categories } from '@/data/categories'
import { getAllProducts, getProductsByCategory } from '@/services/productService'
import type { Product } from '@/data/products'

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
}

export default function Products() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [search, setSearch] = useState('')

  const filtered: Product[] = useMemo(() => {
    let results =
      activeCategory === 'all'
        ? getAllProducts()
        : getProductsByCategory(activeCategory)

    if (search.trim()) {
      const q = search.trim().toLowerCase()
      results = results.filter((p) =>
        p.name.toLowerCase().includes(q),
      )
    }

    return results
  }, [activeCategory, search])

  return (
    <div className="w-full bg-ivory pt-32 md:pt-40 pb-[clamp(64px,10vw,120px)]">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16">
        {/* Header */}
        <div className="mb-12 md:mb-16">
          <SectionHeading
            eyebrow="Our Collection"
            heading="Explore the Range"
            description="Discover precision-crafted fittings designed for the modern bathroom."
          />
        </div>

        {/* Search + Filter bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10 md:mb-14">
          {/* Category pills */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => {
              const isActive =
                cat.slug === activeCategory
              return (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => setActiveCategory(cat.slug)}
                  className={`px-4 py-2 text-sm font-medium transition-all duration-200 border-b-2 ${
                    isActive
                      ? 'text-charcoal border-bronze'
                      : 'text-metal border-transparent hover:text-charcoal hover:border-line'
                  }`}
                >
                  {cat.name}
                </button>
              )
            })}
          </div>

          {/* Search input */}
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products…"
            className="w-full sm:w-64 bg-transparent border-b border-line py-2 text-sm text-charcoal placeholder:text-metal/50 outline-none transition-colors duration-200 focus:border-charcoal"
          />
        </div>

        {/* Product grid with AnimatePresence */}
        {filtered.length === 0 ? (
          <p className="text-center text-metal py-20 type-body">
            No products found
          </p>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((product, i) => (
                <motion.div
                  key={product.id}
                  layout
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{
                    duration: 0.3,
                    delay: i * 0.04,
                    layout: { duration: 0.3 },
                  }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  )
}
