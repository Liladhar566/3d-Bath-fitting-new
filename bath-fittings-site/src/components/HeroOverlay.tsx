import { useNavigate } from 'react-router-dom'
import { motion, useTransform } from 'framer-motion'
import type { MotionValue } from 'framer-motion'
import Button from '@/components/Button'
import { siteConfig } from '@/config/site'
import { heroStages } from '@/config/heroChoreography'

/* ------------------------------------------------------------------ */
/*  Entrance animation variants (initial hero text stagger)           */
/* ------------------------------------------------------------------ */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
}

const childVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
  },
}

/* ------------------------------------------------------------------ */
/*  Props                                                             */
/* ------------------------------------------------------------------ */
interface HeroOverlayProps {
  scrollProgress: MotionValue<number>
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                    */
/* ------------------------------------------------------------------ */

/** Stage 0 — opening hero text + CTA buttons */
function HeroIntro({ scrollProgress }: { scrollProgress: MotionValue<number> }) {
  const navigate = useNavigate()

  const opacity = useTransform(scrollProgress, [0, 0.12, 0.2], [1, 1, 0])
  const y = useTransform(scrollProgress, [0.12, 0.2], [0, -40])

  return (
    <motion.div
      style={{ opacity, y }}
      className="absolute inset-0 z-10 flex items-end pb-24 md:items-center md:pb-0 px-6 md:px-12 lg:px-16 pointer-events-none"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col max-w-xl pointer-events-auto pt-20"
      >
        {/* Eyebrow */}
        <motion.p
          variants={childVariants}
          className="type-eyebrow text-metal tracking-widest mb-3 md:mb-4"
        >
          {siteConfig.hero.eyebrow}
        </motion.p>

        {/* H1 */}
        <motion.h1
          variants={childVariants}
          className="type-h1 text-charcoal tracking-tight leading-[1.08]"
        >
          <span className="block">{siteConfig.hero.headlineLine1}</span>
          <span className="block">{siteConfig.hero.headlineLine2}</span>
        </motion.h1>

        {/* Description */}
        <motion.p
          variants={childVariants}
          className="type-body text-metal mt-4 md:mt-6 max-w-lg"
        >
          {siteConfig.hero.description}
        </motion.p>

        {/* Buttons — stack on mobile */}
        <motion.div
          variants={childVariants}
          className="mt-6 md:mt-8 flex flex-col sm:flex-row gap-4"
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
  )
}

/** Stages 1–3: scroll-anchored caption blocks */
function StageCaption({
  stage,
  stageIdx,
  scrollProgress,
}: {
  stage: (typeof heroStages)[number]
  stageIdx: number
  scrollProgress: MotionValue<number>
}) {
  const { start, end } = stage

  const opacity = useTransform(
    scrollProgress,
    [start, start + 0.04, end - 0.04, end],
    [0, 1, 1, 0]
  )
  const y = useTransform(
    scrollProgress,
    [start, start + 0.04, end - 0.04, end],
    [24, 0, 0, -24]
  )

  /* Alternate left/right per stage on desktop; bottom-center on mobile */
  const isRight = stageIdx % 2 === 1
  const positionClass = isRight
    ? 'items-end text-right md:pr-16 lg:pr-24'
    : 'items-start text-left md:pl-16 lg:pl-24'

  return (
    <motion.div
      style={{ opacity, y }}
      className={`absolute inset-0 z-10 flex flex-col justify-end pb-20 md:justify-center px-6 ${positionClass} pointer-events-none`}
    >
      <div className="max-w-sm">
        <p className="type-eyebrow text-bronze tracking-widest mb-2">
          {String(stage.index).padStart(2, '0')}
        </p>
        <h2 className="type-h2 text-charcoal font-serif mb-3">
          {stage.title}
        </h2>
        <p className="type-body text-metal">{stage.text}</p>
      </div>
    </motion.div>
  )
}

/** Single progress indicator item — extracts hooks out of .map() */
function ProgressIndicatorItem({
  stage,
  scrollProgress,
}: {
  stage: (typeof heroStages)[number]
  scrollProgress: MotionValue<number>
}) {
  const activeOpacity = useTransform(
    scrollProgress,
    [stage.start - 0.02, stage.start, stage.end, stage.end + 0.02],
    [0, 1, 1, 0]
  )
  const inactiveOpacity = useTransform(activeOpacity, (v) => (v > 0.5 ? 0 : 1))

  return (
    <div className="relative flex items-center gap-2">
      {/* Bronze bar when active */}
      <motion.div
        style={{ opacity: activeOpacity }}
        className="h-px w-6 bg-bronze"
      />
      {/* Inactive label */}
      <motion.span
        style={{ opacity: inactiveOpacity }}
        className="text-xs font-medium text-metal tracking-wider uppercase"
      >
        {stage.title}
      </motion.span>
      {/* Active label */}
      <motion.span
        style={{ opacity: activeOpacity }}
        className="text-xs font-medium text-charcoal tracking-wider uppercase absolute right-0"
      >
        {stage.title}
      </motion.span>
    </div>
  )
}

/** Desktop-only progress indicator on the right edge */
function ProgressIndicator({
  scrollProgress,
}: {
  scrollProgress: MotionValue<number>
}) {
  return (
    <div className="absolute right-6 lg:right-10 top-1/2 -translate-y-1/2 z-20 hidden md:flex flex-col gap-4 items-end pointer-events-none">
      {heroStages.map((stage) => (
        <ProgressIndicatorItem
          key={stage.index}
          stage={stage}
          scrollProgress={scrollProgress}
        />
      ))}
    </div>
  )
}

/** Faint parallax brand watermark for depth */
function BrandWatermark({
  scrollProgress,
}: {
  scrollProgress: MotionValue<number>
}) {
  const x = useTransform(scrollProgress, [0, 1], ['5%', '-15%'])

  return (
    <motion.div
      style={{ x }}
      aria-hidden="true"
      className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden pointer-events-none select-none"
    >
      <span
        className="font-serif whitespace-nowrap"
        style={{
          fontSize: 'clamp(8rem, 20vw, 22rem)',
          opacity: 0.05,
          WebkitTextStroke: '2px currentColor',
          WebkitTextFillColor: 'transparent',
          color: 'var(--color-charcoal)',
        }}
      >
        {siteConfig.brandName}
      </span>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main HeroOverlay                                                  */
/* ------------------------------------------------------------------ */
export default function HeroOverlay({ scrollProgress }: HeroOverlayProps) {
  return (
    <div className="absolute inset-0 z-10">
      {/* Background brand word */}
      <BrandWatermark scrollProgress={scrollProgress} />

      {/* Stage 0: intro hero text + CTAs */}
      <HeroIntro scrollProgress={scrollProgress} />

      {/* Stages 1-3: scroll-anchored captions */}
      {heroStages.map((stage, idx) => (
        <StageCaption
          key={stage.index}
          stage={stage}
          stageIdx={idx}
          scrollProgress={scrollProgress}
        />
      ))}

      {/* Right-edge progress indicator (desktop only) */}
      <ProgressIndicator scrollProgress={scrollProgress} />
    </div>
  )
}
