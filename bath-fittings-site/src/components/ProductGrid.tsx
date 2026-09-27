import ProductCard from '@/components/ProductCard'
import type { Product } from '@/data/products'

interface ProductGridProps {
  products: Product[]
}

export default function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <p className="text-center text-metal py-20 type-body">
        No products found
      </p>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
      {products.map((product) => (
        <ProductCard product={product} key={product.id} />
      ))}
    </div>
  )
}
