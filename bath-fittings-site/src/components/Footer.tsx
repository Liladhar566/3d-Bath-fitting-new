import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Products' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
] as const

const COLLECTION_LINKS = [
  { to: '/products?category=faucets', label: 'Faucets' },
  { to: '/products?category=basin-mixers', label: 'Basin Mixers' },
  { to: '/products?category=showers', label: 'Showers' },
  { to: '/products?category=bath-fittings', label: 'Bath Fittings' },
  { to: '/products?category=accessories', label: 'Accessories' },
] as const

function FooterHeading({ children }: { children: string }) {
  return <h4 className="type-eyebrow text-ivory mb-5">{children}</h4>
}

function FooterLink({ to, children }: { to: string; children: string }) {
  return (
    <li>
      <Link
        to={to}
        className="text-sm text-metal hover:text-bronze transition-colors duration-200"
      >
        {children}
      </Link>
    </li>
  )
}

export default function Footer() {
  return (
    <motion.footer
      className="bg-charcoal"
      style={{ paddingTop: 'clamp(64px, 10vw, 120px)' }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="mx-auto max-w-7xl px-6">
        {/* ---- 4-column grid ---- */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
          {/* Column 1: Brand */}
          <div>
            <Link
              to="/"
              className="font-serif text-xl font-medium text-ivory tracking-tight"
            >
              BathFittings
            </Link>
            <p className="text-sm text-metal mt-3">
              Crafted for modern living.
            </p>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <FooterHeading>Navigate</FooterHeading>
            <ul className="flex flex-col gap-3">
              {NAV_LINKS.map((link) => (
                <FooterLink key={link.to} to={link.to}>
                  {link.label}
                </FooterLink>
              ))}
            </ul>
          </div>

          {/* Column 3: Collections */}
          <div>
            <FooterHeading>Collections</FooterHeading>
            <ul className="flex flex-col gap-3">
              {COLLECTION_LINKS.map((link) => (
                <FooterLink key={link.label} to={link.to}>
                  {link.label}
                </FooterLink>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <FooterHeading>Get in Touch</FooterHeading>
            <ul className="flex flex-col gap-3 text-sm text-metal">
              <li>
                <a
                  href="mailto:hello@bathfittings.com"
                  className="hover:text-bronze transition-colors duration-200"
                >
                  hello@bathfittings.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+911234567890"
                  className="hover:text-bronze transition-colors duration-200"
                >
                  +91 123 456 7890
                </a>
              </li>
              <li className="leading-relaxed">
                42 Design District, Andheri East,
                <br />
                Mumbai 400 069, India
              </li>
            </ul>
          </div>
        </div>

        {/* ---- Divider ---- */}
        <div
          className="my-12 h-px"
          style={{ backgroundColor: 'rgba(221, 217, 210, 0.2)' }}
        />

        {/* ---- Bottom row ---- */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-8 text-xs text-metal">
          <p>&copy; 2026 BathFittings. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link
              to="/privacy"
              className="hover:text-bronze transition-colors duration-200"
            >
              Privacy Policy
            </Link>
            <span className="text-metal/40">&bull;</span>
            <Link
              to="/terms"
              className="hover:text-bronze transition-colors duration-200"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </motion.footer>
  )
}
