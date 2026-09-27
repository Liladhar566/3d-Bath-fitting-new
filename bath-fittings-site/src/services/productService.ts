import { products } from '@/data/products'
import type { Product } from '@/data/products'

export function getAllProducts(): Product[] {
  return products
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug)
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured)
}

export function getProductsByCategory(category: string): Product[] {
  if (category.toLowerCase() === 'all') {
    return products
  }
  return products.filter(
    (p) => p.category.toLowerCase() === category.toLowerCase()
  )
}
