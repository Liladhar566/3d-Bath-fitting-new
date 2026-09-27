import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import type { Product } from '@/data/products'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      to={`/products/${product.slug}`}
      className="group block transition-transform duration-300 ease-out hover:-translate-y-1.5"
    >
      {/* Image */}
      <div className="overflow-hidden rounded-lg bg-charcoal-soft/5">
        <img
          src={product.image}
          alt={product.name}
          className="w-full aspect-[4/5] object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
        />
      </div>

      {/* Details */}
      <div className="mt-4 space-y-1">
        {/* Eyebrow category */}
        <p className="type-eyebrow text-metal">{product.category}</p>

        {/* Product name */}
        <h3 className="font-sans text-base font-semibold text-charcoal">
          {product.name}
        </h3>

        {/* Price */}
        {product.price && (
          <p className="text-sm text-charcoal">{product.price}</p>
        )}

        {/* View Product link */}
        <div className="flex items-center gap-1.5 pt-2 text-sm font-medium text-bronze">
          <span>View Product</span>
          <ArrowRight
            size={14}
            className="transition-transform duration-300 ease-out group-hover:translate-x-1"
          />
        </div>
      </div>
    </Link>
  )
}
