import { ArrowRight } from 'lucide-react'
import type { ReactNode, MouseEventHandler } from 'react'

interface ButtonProps {
  variant?: 'primary' | 'secondary'
  children: ReactNode
  onClick?: MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>
  href?: string
}

export default function Button({
  variant = 'primary',
  children,
  onClick,
  href,
}: ButtonProps) {
  const base =
    'inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-medium transition-all duration-300 ease-out group'

  const variants = {
    primary: 'bg-bronze text-ivory hover:bg-charcoal-soft',
    secondary:
      'bg-transparent text-charcoal border border-charcoal hover:bg-charcoal hover:text-ivory',
  }

  const className = `${base} ${variants[variant]}`

  const content = (
    <>
      {children}
      <ArrowRight
        size={16}
        className="transition-transform duration-300 ease-out group-hover:translate-x-1"
      />
    </>
  )

  if (href) {
    return (
      <a href={href} className={className} onClick={onClick}>
        {content}
      </a>
    )
  }

  return (
    <button type="button" className={className} onClick={onClick}>
      {content}
    </button>
  )
}
