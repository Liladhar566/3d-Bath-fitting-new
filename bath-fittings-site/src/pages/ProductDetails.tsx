import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import Button from '@/components/Button'
import EnquiryForm from '@/components/EnquiryForm'
import { getProductBySlug } from '@/services/productService'

export default function ProductDetails() {
  const { productId } = useParams<{ productId: string }>()
  const navigate = useNavigate()
  const [enquiryOpen, setEnquiryOpen] = useState(false)

  const product = productId ? getProductBySlug(productId) : undefined

  /* ── Not Found ── */
  if (!product) {
    return (
      <div className="w-full bg-ivory pt-40 pb-[clamp(64px,10vw,120px)]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 text-center">
          <h1 className="type-h2 text-charcoal mb-4">Product not found</h1>
          <p className="type-body text-metal mb-8">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Button
            variant="secondary"
            href="/products"
            onClick={(e) => {
              e.preventDefault()
              navigate('/products')
            }}
          >
            Back to Collection
          </Button>
        </div>
      </div>
    )
  }

  /* ── Found ── */
  return (
    <>
      <div className="w-full bg-ivory pt-32 md:pt-40 pb-[clamp(64px,10vw,120px)]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16">
          {/* Back link */}
          <motion.button
            type="button"
            onClick={() => navigate('/products')}
            className="flex items-center gap-2 text-sm text-metal hover:text-charcoal transition-colors duration-200 mb-8 md:mb-12"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ArrowLeft size={16} />
            <span>Back to Collection</span>
          </motion.button>

          {/* Two-column layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
            {/* Left: Product image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              className="bg-charcoal-soft/5 overflow-hidden"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full aspect-[4/5] object-cover"
              />
            </motion.div>

            {/* Right: Product info */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.15,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="flex flex-col justify-center"
            >
              {/* Eyebrow category */}
              <p className="type-eyebrow text-bronze mb-3">
                {product.category}
              </p>

              {/* Name */}
              <h1 className="type-h1 text-charcoal mb-4">
                {product.name}
              </h1>

              {/* Description */}
              <p className="type-body text-metal mb-6 max-w-lg">
                {product.description}
              </p>

              {/* Price */}
              {product.price && (
                <p className="font-serif text-2xl text-charcoal mb-8">
                  {product.price}
                </p>
              )}

              {/* Specifications */}
              {product.specifications && product.specifications.length > 0 && (
                <motion.div
                  className="mb-8"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: {},
                    visible: {
                      transition: { staggerChildren: 0.06, delayChildren: 0.3 },
                    },
                  }}
                >
                  <p className="type-eyebrow text-metal mb-4">
                    Specifications
                  </p>
                  <div className="divide-y divide-line">
                    {product.specifications.map((spec) => (
                      <motion.div
                        key={spec.label}
                        className="flex items-center justify-between py-3"
                        variants={{
                          hidden: { opacity: 0, y: 8 },
                          visible: {
                            opacity: 1,
                            y: 0,
                            transition: { duration: 0.3, ease: 'easeOut' },
                          },
                        }}
                      >
                        <span className="text-sm text-metal">
                          {spec.label}
                        </span>
                        <span className="text-sm font-medium text-charcoal">
                          {spec.value}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.45 }}
              >
                <Button
                  variant="primary"
                  onClick={() => setEnquiryOpen(true)}
                >
                  Enquire Now
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Modal enquiry form */}
      <EnquiryForm
        variant="modal"
        isOpen={enquiryOpen}
        onClose={() => setEnquiryOpen(false)}
        prefilledProduct={product.name}
      />
    </>
  )
}
