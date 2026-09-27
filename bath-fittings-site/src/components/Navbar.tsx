import { useState, useEffect } from 'react'
import { NavLink, Link } from 'react-router-dom'
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
} from 'framer-motion'
import { Menu, X } from 'lucide-react'
import Button from '@/components/Button'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Products' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
] as const

const SPRING_CONFIG = { stiffness: 200, damping: 30, mass: 0.5 }

/* Mobile overlay animation variants */
const overlayVariants = {
  closed: { opacity: 0 },
  open: {
    opacity: 1,
    transition: { duration: 0.3, when: 'beforeChildren' as const, staggerChildren: 0.06 },
  },
  exit: { opacity: 0, transition: { duration: 0.25 } },
}

const linkVariants = {
  closed: { opacity: 0, y: 20 },
  open: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  /* ---- Scroll-driven values ---- */
  const { scrollY } = useScroll()

  const bgOpacityRaw = useTransform(scrollY, [0, 80], [0, 0.9])
  const blurRaw = useTransform(scrollY, [0, 80], [0, 12])
  const borderOpacityRaw = useTransform(scrollY, [0, 80], [0, 1])
  const heightRaw = useTransform(scrollY, [0, 80], [96, 72])

  const bgOpacity = useSpring(bgOpacityRaw, SPRING_CONFIG)
  const blur = useSpring(blurRaw, SPRING_CONFIG)
  const borderOpacity = useSpring(borderOpacityRaw, SPRING_CONFIG)
  const navHeight = useSpring(heightRaw, SPRING_CONFIG)

  /* Convert spring MotionValues to CSS strings — all hooks at top level */
  const backgroundColor = useTransform(
    bgOpacity,
    (v: number) => `rgba(247, 245, 241, ${v})`
  )
  const backdropFilter = useTransform(
    blur,
    (v: number) => `blur(${v}px)`
  )
  const borderColor = useTransform(
    borderOpacity,
    (v: number) => `rgba(221, 217, 210, ${v})`
  )

  /* Discrete text color swap */
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const unsubscribe = scrollY.on('change', (v) => setScrolled(v >= 80))
    return unsubscribe
  }, [scrollY])

  /* Body scroll lock when mobile menu is open */
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const textColor = scrolled ? 'text-charcoal' : 'text-ivory'

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 w-full z-50"
        style={{
          height: navHeight,
          backgroundColor,
          backdropFilter,
          borderBottomWidth: '1px',
          borderBottomStyle: 'solid',
          borderBottomColor: borderColor,
        }}
      >
        <div className="mx-auto max-w-7xl h-full px-6 flex items-center justify-between">
          {/* Logo / Brand */}
          <Link
            to="/"
            className={`font-serif text-xl font-medium tracking-tight transition-colors duration-300 ${textColor}`}
          >
            BathFittings
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `text-sm transition-colors duration-300 ${textColor} ${
                    isActive
                      ? 'font-semibold'
                      : 'font-normal hover:opacity-70'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <Button variant="primary" href="/contact">
              Enquire
            </Button>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            className={`md:hidden p-2 -mr-2 transition-colors duration-300 ${textColor}`}
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label="Menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile full-screen overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-menu"
            className="fixed inset-0 z-40 bg-charcoal flex flex-col items-center justify-center gap-8"
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="exit"
          >
            {NAV_LINKS.map((link) => (
              <motion.div key={link.to} variants={linkVariants}>
                <NavLink
                  to={link.to}
                  end={link.to === '/'}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `type-h2 text-ivory transition-opacity duration-200 ${
                      isActive ? 'opacity-100' : 'opacity-60 hover:opacity-100'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </motion.div>
            ))}
            <motion.div variants={linkVariants}>
              <Button
                variant="primary"
                href="/contact"
                onClick={() => setIsOpen(false)}
              >
                Enquire
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
