interface SectionHeadingProps {
  eyebrow?: string
  heading: string
  description?: string
  alignment?: 'left' | 'center'
}

export default function SectionHeading({
  eyebrow,
  heading,
  description,
  alignment = 'center',
}: SectionHeadingProps) {
  const align = alignment === 'center' ? 'text-center' : 'text-left'

  return (
    <div className={`${align} max-w-3xl ${alignment === 'center' ? 'mx-auto' : ''}`}>
      {eyebrow && (
        <p className="type-eyebrow text-metal mb-4">{eyebrow}</p>
      )}
      <h2 className="type-h2">{heading}</h2>
      {description && (
        <p className="type-body text-metal mt-4">{description}</p>
      )}
    </div>
  )
}
