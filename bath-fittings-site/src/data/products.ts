export interface Product {
  id: string
  slug: string
  name: string
  category: string
  price?: string
  image: string
  description: string
  featured?: boolean
  model?: string
  gallery?: string[]
  specifications?: { label: string; value: string }[]
}

export const products: Product[] = [
  /* ── Faucets ── */
  {
    id: 'prod-001',
    slug: 'aura-single-lever-faucet',
    name: 'Aura Single-Lever Faucet',
    category: 'Faucets',
    price: '₹7,499',
    image: '/products/placeholder-1.jpg',
    description:
      'A sculptural single-lever faucet with a ceramic disc cartridge and a whisper-quiet flow.',
    featured: true,
    model: '/models/aura-faucet.glb',
    gallery: [
      '/products/placeholder-1.jpg',
      '/products/placeholder-1b.jpg',
    ],
    specifications: [
      { label: 'Material', value: 'Solid Brass' },
      { label: 'Finish', value: 'Brushed Nickel' },
      { label: 'Cartridge', value: '40 mm Ceramic Disc' },
    ],
  },
  {
    id: 'prod-002',
    slug: 'cascade-wall-mounted-faucet',
    name: 'Cascade Wall-Mounted Faucet',
    category: 'Faucets',
    price: '₹9,299',
    image: '/products/placeholder-2.jpg',
    description:
      'Clean wall-mounted geometry that pairs effortlessly with vessel and undermount basins.',
    featured: false,
  },

  /* ── Basin Mixers ── */
  {
    id: 'prod-003',
    slug: 'elara-basin-mixer',
    name: 'Elara Basin Mixer',
    category: 'Basin Mixers',
    price: '₹8,999',
    image: '/products/placeholder-3.jpg',
    description:
      'Precision-balanced hot-and-cold mixing with a slender, tapered spout for modern vanities.',
    featured: true,
    specifications: [
      { label: 'Material', value: 'Brass with Chrome Plate' },
      { label: 'Spout Reach', value: '165 mm' },
      { label: 'Flow Rate', value: '8.3 L/min' },
    ],
  },
  {
    id: 'prod-004',
    slug: 'vero-tall-basin-mixer',
    name: 'Vero Tall Basin Mixer',
    category: 'Basin Mixers',
    price: '₹11,499',
    image: '/products/placeholder-4.jpg',
    description:
      'An elevated profile designed for countertop basins, delivering a dramatic vertical silhouette.',
    featured: true,
    gallery: [
      '/products/placeholder-4.jpg',
      '/products/placeholder-4b.jpg',
    ],
  },

  /* ── Showers ── */
  {
    id: 'prod-005',
    slug: 'monsoon-overhead-shower',
    name: 'Monsoon Overhead Shower',
    category: 'Showers',
    price: '₹12,999',
    image: '/products/placeholder-5.jpg',
    description:
      'A 300 mm ultra-slim rainfall head that transforms the everyday shower into a ritual.',
    featured: true,
    specifications: [
      { label: 'Head Diameter', value: '300 mm' },
      { label: 'Spray Pattern', value: 'Rain + Mist' },
      { label: 'Material', value: 'Stainless Steel 304' },
    ],
  },
  {
    id: 'prod-006',
    slug: 'zen-hand-shower-set',
    name: 'Zen Hand Shower Set',
    category: 'Showers',
    price: '₹4,999',
    image: '/products/placeholder-6.jpg',
    description:
      'Three-function hand shower with a magnetic dock and flexible stainless-steel hose.',
    featured: false,
  },

  /* ── Bath Fittings ── */
  {
    id: 'prod-007',
    slug: 'luna-bath-spout',
    name: 'Luna Bath Spout',
    category: 'Bath Fittings',
    price: '₹6,499',
    image: '/products/placeholder-7.jpg',
    description:
      'A curved wall-mounted spout that delivers a generous laminar flow into freestanding tubs.',
    featured: false,
  },

  /* ── Accessories ── */
  {
    id: 'prod-008',
    slug: 'halo-towel-ring',
    name: 'Halo Towel Ring',
    category: 'Accessories',
    price: '₹2,999',
    image: '/products/placeholder-8.jpg',
    description:
      'Minimal circular towel ring in a corrosion-resistant matte-black finish.',
    featured: true,
  },
  {
    id: 'prod-009',
    slug: 'niche-robe-hook-set',
    name: 'Niche Robe Hook Set',
    category: 'Accessories',
    price: '₹3,499',
    image: '/products/placeholder-9.jpg',
    description:
      'A pair of concealed-mount robe hooks with a squared profile and weighted feel.',
    featured: false,
  },
]
