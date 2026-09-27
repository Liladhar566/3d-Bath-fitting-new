import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle } from 'lucide-react'
import Button from '@/components/Button'

interface EnquiryFormProps {
  variant: 'modal' | 'inline'
  isOpen?: boolean
  onClose?: () => void
  prefilledProduct?: string
}

interface FormData {
  name: string
  phone: string
  email: string
  product: string
  message: string
}

interface FormErrors {
  name?: string
  phone?: string
  email?: string
}

const initialFormData: FormData = {
  name: '',
  phone: '',
  email: '',
  product: '',
  message: '',
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
}

const panelVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 12 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 12,
    transition: { duration: 0.2 },
  },
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function InputField({
  label,
  type = 'text',
  value,
  onChange,
  error,
  required,
  readOnly,
  id,
}: {
  label: string
  type?: string
  value: string
  onChange: (v: string) => void
  error?: string
  required?: boolean
  readOnly?: boolean
  id: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="type-eyebrow text-metal"
      >
        {label}
        {required && <span className="text-bronze ml-0.5">*</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        readOnly={readOnly}
        className={`w-full bg-transparent border-b ${
          error ? 'border-red-400' : 'border-line'
        } py-2.5 text-sm text-charcoal placeholder:text-metal/50 outline-none transition-colors duration-200 focus:border-charcoal ${
          readOnly ? 'opacity-60 cursor-not-allowed' : ''
        }`}
      />
      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  )
}

function FormContent({
  prefilledProduct,
  submitted,
  setSubmitted,
}: {
  prefilledProduct?: string
  submitted: boolean
  setSubmitted: (v: boolean) => void
}) {
  const [formData, setFormData] = useState<FormData>({
    ...initialFormData,
    product: prefilledProduct ?? '',
  })
  const [errors, setErrors] = useState<FormErrors>({})

  const updateField = (field: keyof FormData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required'
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setSubmitted(true)
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="flex flex-col items-center justify-center py-12 text-center gap-4"
      >
        <CheckCircle size={48} className="text-bronze" />
        <h3 className="type-h2 text-charcoal">Thank You</h3>
        <p className="type-body text-metal max-w-sm">
          Thank you — we'll be in touch shortly.
        </p>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <InputField
        id="enquiry-name"
        label="Name"
        value={formData.name}
        onChange={updateField('name')}
        error={errors.name}
        required
      />
      <InputField
        id="enquiry-phone"
        label="Phone"
        type="tel"
        value={formData.phone}
        onChange={updateField('phone')}
        error={errors.phone}
        required
      />
      <InputField
        id="enquiry-email"
        label="Email"
        type="email"
        value={formData.email}
        onChange={updateField('email')}
        error={errors.email}
        required
      />
      <InputField
        id="enquiry-product"
        label="Product"
        value={formData.product}
        onChange={updateField('product')}
        readOnly={!!prefilledProduct}
      />

      {/* Message textarea */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="enquiry-message"
          className="type-eyebrow text-metal"
        >
          Message
        </label>
        <textarea
          id="enquiry-message"
          value={formData.message}
          onChange={(e) => updateField('message')(e.target.value)}
          rows={4}
          className="w-full bg-transparent border-b border-line py-2.5 text-sm text-charcoal placeholder:text-metal/50 outline-none transition-colors duration-200 focus:border-charcoal resize-none"
        />
      </div>

      <div className="pt-2">
        <Button variant="primary">
          Send Enquiry
        </Button>
      </div>
    </form>
  )
}

export default function EnquiryForm({
  variant,
  isOpen,
  onClose,
  prefilledProduct,
}: EnquiryFormProps) {
  const [submitted, setSubmitted] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  /* Escape key closes modal */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onClose) onClose()
    },
    [onClose],
  )

  useEffect(() => {
    if (variant === 'modal' && isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
      return () => {
        document.removeEventListener('keydown', handleKeyDown)
        document.body.style.overflow = ''
      }
    }
  }, [variant, isOpen, handleKeyDown])

  /* Reset form on re-open */
  useEffect(() => {
    if (variant === 'modal' && isOpen) {
      setSubmitted(false)
    }
  }, [variant, isOpen])

  /* ── Inline variant ── */
  if (variant === 'inline') {
    return (
      <div className="w-full">
        <FormContent
          prefilledProduct={prefilledProduct}
          submitted={submitted}
          setSubmitted={setSubmitted}
        />
      </div>
    )
  }

  /* ── Modal variant ── */
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center px-4"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-charcoal/40"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            ref={panelRef}
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative z-10 w-full max-w-lg bg-ivory border border-line p-8 md:p-10"
          >
            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 p-1 text-metal hover:text-charcoal transition-colors duration-200"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <h3 className="type-h2 text-charcoal mb-6">
              Enquire Now
            </h3>

            <FormContent
              prefilledProduct={prefilledProduct}
              submitted={submitted}
              setSubmitted={setSubmitted}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
