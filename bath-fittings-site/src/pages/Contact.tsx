import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Clock } from 'lucide-react'
import SectionHeading from '@/components/SectionHeading'
import Button from '@/components/Button'
import EnquiryForm from '@/components/EnquiryForm'
import { siteConfig } from '@/config/site'

const BUSINESS_HOURS = [
  { day: 'Monday – Friday', hours: '10:00 AM – 7:00 PM' },
  { day: 'Saturday', hours: '10:00 AM – 5:00 PM' },
  { day: 'Sunday', hours: 'Closed' },
]

function ContactItem({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: typeof Mail
  label: string
  value: string
  href?: string
}) {
  const content = (
    <div className="flex items-start gap-4">
      <div className="mt-0.5 text-bronze">
        <Icon size={18} />
      </div>
      <div>
        <p className="type-eyebrow text-metal mb-1">{label}</p>
        <p className="text-sm text-charcoal">{value}</p>
      </div>
    </div>
  )

  if (href) {
    return (
      <a
        href={href}
        className="block hover:opacity-80 transition-opacity duration-200"
      >
        {content}
      </a>
    )
  }

  return content
}

export default function Contact() {
  return (
    <div className="w-full bg-ivory pt-32 md:pt-40 pb-[clamp(64px,10vw,120px)]">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16">
        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-14 md:mb-20"
        >
          <SectionHeading
            eyebrow="Get in Touch"
            heading="We'd Love to Hear From You"
            description="Have a question about our products, need a specification sheet, or want to discuss a project? Reach out — our team is here to help."
          />
        </motion.div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
          {/* ── Left column: Contact info ── */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.1,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            className="flex flex-col gap-8"
          >
            {/* Contact details */}
            <div className="flex flex-col gap-6">
              <ContactItem
                icon={Mail}
                label="Email"
                value={siteConfig.contact.email}
                href={`mailto:${siteConfig.contact.email}`}
              />
              <ContactItem
                icon={Phone}
                label="Phone"
                value={siteConfig.contact.phone}
                href={`tel:${siteConfig.contact.phone.replace(/\s+/g, '')}`}
              />
              <ContactItem
                icon={MapPin}
                label="Address"
                value={siteConfig.contact.address}
              />
            </div>

            {/* Divider */}
            <div className="h-px bg-line/60" />

            {/* Business hours */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Clock size={18} className="text-bronze" />
                <p className="type-eyebrow text-metal">Business Hours</p>
              </div>
              <div className="flex flex-col gap-2">
                {BUSINESS_HOURS.map((item) => (
                  <div
                    key={item.day}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-charcoal">{item.day}</span>
                    <span className="text-metal">{item.hours}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-line/60" />

            {/* Map placeholder */}
            <div className="border border-line bg-line/10 aspect-video flex items-center justify-center">
              <p className="type-eyebrow text-metal">Map</p>
            </div>

            {/* WhatsApp CTA */}
            <div>
              <Button
                variant="secondary"
                href="https://wa.me/919876543210"
              >
                Chat on WhatsApp
              </Button>
            </div>
          </motion.div>

          {/* ── Right column: Inline Enquiry Form ── */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.2,
              ease: [0.25, 0.1, 0.25, 1],
            }}
          >
            <h3 className="type-h2 text-charcoal mb-6">
              Send Us a Message
            </h3>
            <EnquiryForm variant="inline" />
          </motion.div>
        </div>
      </div>
    </div>
  )
}
