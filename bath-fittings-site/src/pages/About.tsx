import { motion } from 'framer-motion'

const SECTIONS = [
  {
    heading: 'Our Story',
    text: 'Founded on the belief that everyday rituals deserve extraordinary objects, Aurelia Baths began as a small studio exploring the intersection of engineering precision and organic material beauty. What started as a single basin mixer prototype has grown into a complete architectural tapware collection trusted by designers and homeowners across the country.',
    image: '/about/placeholder-1.jpg',
  },
  {
    heading: 'Craftsmanship',
    text: 'Every piece is machined from solid billets of brass and stainless steel — never hollow stampings. Our artisans hand-finish each surface through a sequence of abrasive, polishing, and protective coating stages that can take up to forty-eight hours per unit. The result is a tactile weight and warmth that mass production cannot replicate.',
    image: '/about/placeholder-2.jpg',
  },
  {
    heading: 'Materials & Technology',
    text: 'We source certified lead-free brass, 304-grade stainless steel, and advanced ceramic disc cartridges rated for 500,000 open-close cycles. Finishes are applied using physical vapour deposition (PVD) for scratch and corrosion resistance that far exceeds conventional electroplating, ensuring decades of daily use without degradation.',
    image: '/about/placeholder-3.jpg',
  },
  {
    heading: 'Brand Values',
    text: 'Simplicity over ornamentation. Durability over disposability. Silence over noise. These principles guide every design decision — from the geometry of a spout profile to the damping curve of a lever. We believe the best fittings are the ones you stop noticing, because they simply work, beautifully, every single day.',
    image: '/about/placeholder-4.jpg',
  },
] as const

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] },
  },
}

export default function About() {
  return (
    <div className="w-full bg-ivory">
      {/* ── Hero Statement ── */}
      <section className="pt-32 md:pt-44 pb-[clamp(64px,10vw,120px)] px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className="max-w-3xl mx-auto text-center"
        >
          <p className="type-eyebrow text-bronze tracking-widest mb-4">
            ABOUT US
          </p>
          <h1 className="type-h1 text-charcoal mb-6">
            Precision, Purpose,{' '}
            <span className="block">Permanence.</span>
          </h1>
          <p className="type-body text-metal max-w-2xl mx-auto">
            We design and manufacture architectural bathroom fittings that balance elemental simplicity with uncompromising engineering — objects made to endure, built to inspire calm.
          </p>
        </motion.div>
      </section>

      {/* ── Alternating Sections ── */}
      {SECTIONS.map((section, index) => {
        const imageFirst = index % 2 === 0

        return (
          <section
            key={section.heading}
            className="py-[clamp(48px,8vw,96px)] px-6 md:px-12 border-t border-line/40"
          >
            <motion.div
              variants={sectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className={`max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center ${
                imageFirst ? '' : 'md:[direction:rtl]'
              }`}
            >
              {/* Image */}
              <div className={`overflow-hidden bg-line/20 ${imageFirst ? '' : 'md:[direction:ltr]'}`}>
                <img
                  src={section.image}
                  alt={section.heading}
                  className="w-full aspect-[4/3] object-cover"
                  loading="lazy"
                />
              </div>

              {/* Text */}
              <div className={`flex flex-col justify-center ${imageFirst ? '' : 'md:[direction:ltr]'}`}>
                <p className="type-eyebrow text-bronze tracking-widest mb-3">
                  {String(index + 1).padStart(2, '0')}
                </p>
                <h2 className="type-h2 text-charcoal mb-4">
                  {section.heading}
                </h2>
                <p className="type-body text-metal max-w-lg">
                  {section.text}
                </p>
              </div>
            </motion.div>
          </section>
        )
      })}
    </div>
  )
}
