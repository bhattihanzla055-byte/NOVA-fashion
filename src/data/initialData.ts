import { Product, Coupon, Order, Review, User, NewsletterSubscriber } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'The Brixton Lambskin Bomber',
    slug: 'brixton-lambskin-bomber',
    price: 680,
    originalPrice: 850,
    category: 'men',
    subcategory: 'Outerwear',
    description: 'Constructed from full-grain supple Italian lambskin leather with a matte black finish. Features bespoke matte silver two-way hardware, ribbed storm cuffs, and an interior breast pocket lined with silk cupro.',
    details: {
      composition: '100% Lambskin Leather Shell; 100% Cupro Lining',
      fit: 'Relaxed modern tailored silhouette; fits true to size',
      care: 'Specialist leather clean only',
      origin: 'Handcrafted in Florence, Italy'
    },
    images: [
      '/src/assets/images/product_leather_bomber_1794103594721.jpg',
      '/src/assets/images/product_men_tailored_overcoat_1794103593370.jpg'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Obsidian Black', hex: '#0a0a0a' },
      { name: 'Deep Espresso', hex: '#231c19' }
    ],
    stock: 12,
    rating: 4.9,
    reviewsCount: 38,
    isNew: true,
    isBestSeller: true,
    isFeatured: true,
    createdAt: '2026-09-15T10:00:00Z'
  },
  {
    id: 'prod-2',
    name: 'Aura Bias-Cut Silk Evening Slip',
    slug: 'aura-bias-cut-silk-evening-slip',
    price: 495,
    originalPrice: 590,
    category: 'women',
    subcategory: 'Dresses',
    description: 'An architectural evening slip dress cut on the bias in 30mm double georgette silk. Drapes effortlessly along the body with an asymmetric cowl neckline and floor-length fluid sweep.',
    details: {
      composition: '100% Mulberry Silk (30 Momme Heavy Georgette)',
      fit: 'Fluid bias cut; contours gently without constriction',
      care: 'Dry clean only',
      origin: 'Crafted in Lyon, France'
    },
    images: [
      '/src/assets/images/product_women_silk_dress_1794103595165.jpg',
      '/src/assets/images/hero_fashion_luxury_1794103592653.jpg'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Onyx Noir', hex: '#0f0f11' },
      { name: 'Champagne Sand', hex: '#e8decb' },
      { name: 'Pure Chalk', hex: '#f7f6f2' }
    ],
    stock: 8,
    rating: 5.0,
    reviewsCount: 42,
    isNew: true,
    isBestSeller: true,
    isFeatured: true,
    createdAt: '2026-09-20T12:00:00Z'
  },
  {
    id: 'prod-3',
    name: 'Atelier Double-Breasted Cashmere Trench',
    slug: 'atelier-double-breasted-cashmere-trench',
    price: 980,
    originalPrice: 1250,
    category: 'women',
    subcategory: 'Coats',
    description: 'An iconic outerwear statement cut from unbrushed Grade-A Mongolian cashmere. Features structured shoulders, horn button closures, storm flap detailing, and a tonal self-fabric belt with buckle.',
    details: {
      composition: '85% Mongolian Cashmere, 15% Virgin Wool',
      fit: 'Oversized tailored drape; designed for seasonal layering',
      care: 'Professional gentle dry clean',
      origin: 'Tailored in Milan, Italy'
    },
    images: [
      '/src/assets/images/hero_fashion_luxury_1794103592653.jpg',
      '/src/assets/images/banner_seasonal_campaign_1794103595731.jpg'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Midnight Charcoal', hex: '#161616' },
      { name: 'Oatmeal Travertine', hex: '#d9d2c5' }
    ],
    stock: 5,
    rating: 4.9,
    reviewsCount: 56,
    isNew: false,
    isBestSeller: true,
    isFeatured: true,
    createdAt: '2026-08-10T09:00:00Z'
  },
  {
    id: 'prod-4',
    name: 'Verona Wool-Cashmere Minimal Overcoat',
    slug: 'verona-wool-cashmere-minimal-overcoat',
    price: 750,
    originalPrice: 890,
    category: 'men',
    subcategory: 'Outerwear',
    description: 'A benchmark of modern masculine tailoring. Built with a structured notched lapel, concealed three-button placket, hand-stitched pick lapels, and center back vent for clean mobility.',
    details: {
      composition: '90% Virgin Wool, 10% Cashmere; Viscose Cupro lining',
      fit: 'Regular tailored cut; fits cleanly over knitwear and suiting',
      care: 'Dry clean only',
      origin: 'Tailored in Biella, Italy'
    },
    images: [
      '/src/assets/images/product_men_tailored_overcoat_1794103593370.jpg',
      '/src/assets/images/banner_seasonal_campaign_1794103595731.jpg'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Charcoal Heather', hex: '#262628' },
      { name: 'Camel Tan', hex: '#a68968' }
    ],
    stock: 14,
    rating: 4.8,
    reviewsCount: 29,
    isNew: true,
    isBestSeller: true,
    isFeatured: true,
    createdAt: '2026-10-01T14:30:00Z'
  },
  {
    id: 'prod-5',
    name: 'Palazzo Monolithic Pleated Trousers',
    slug: 'palazzo-monolithic-pleated-trousers',
    price: 360,
    originalPrice: 420,
    category: 'women',
    subcategory: 'Tailoring',
    description: 'High-waisted wide-leg trousers featuring deep front knife pleats and an extended waistband tab with hidden horn button fastening. Delivers an effortless, fluid architectural drape.',
    details: {
      composition: '100% Fine Tropical Virgin Wool',
      fit: 'High-rise, relaxed wide leg with full break',
      care: 'Dry clean only',
      origin: 'Made in Portugal'
    },
    images: [
      '/src/assets/images/banner_seasonal_campaign_1794103595731.jpg',
      '/src/assets/images/hero_fashion_luxury_1794103592653.jpg'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Deep Black', hex: '#0a0a0a' },
      { name: 'Warm Ecru', hex: '#eae5dc' }
    ],
    stock: 19,
    rating: 4.7,
    reviewsCount: 24,
    isNew: false,
    isBestSeller: false,
    isFeatured: true,
    createdAt: '2026-08-25T11:15:00Z'
  },
  {
    id: 'prod-6',
    name: 'Sovereign Heavyweight Cashmere Knit',
    slug: 'sovereign-heavyweight-cashmere-knit',
    price: 440,
    originalPrice: 520,
    category: 'men',
    subcategory: 'Knitwear',
    description: 'Spun from 4-ply Mongolian cashmere with ribbed crew collar, cuffs, and hem. Exceptionally dense yet feather-soft to the skin, providing effortless thermoregulation.',
    details: {
      composition: '100% 4-Ply Grade A Cashmere',
      fit: 'Classic regular fit; ribbed collar and cuffs',
      care: 'Hand wash cold with wool detergent or dry clean',
      origin: 'Knitted in Hawick, Scotland'
    },
    images: [
      '/src/assets/images/product_men_tailored_overcoat_1794103593370.jpg',
      '/src/assets/images/product_leather_bomber_1794103594721.jpg'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Pure Ink Black', hex: '#111113' },
      { name: 'Raw Cashmere Oatmeal', hex: '#d6cfc2' }
    ],
    stock: 9,
    rating: 4.9,
    reviewsCount: 31,
    isNew: true,
    isBestSeller: false,
    isFeatured: true,
    createdAt: '2026-09-02T16:00:00Z'
  },
  {
    id: 'prod-7',
    name: 'Brutalist Monogram Calfskin Tote',
    slug: 'brutalist-monogram-calfskin-tote',
    price: 520,
    category: 'accessories',
    subcategory: 'Bags',
    description: 'An understated luxury companion carved from vegetable-tanned French calfskin. Finished with subtle blind-debossed Nova insignia, magnetic top closure, and removable zip pouch.',
    details: {
      composition: '100% Full Grain Vegetable-Tanned Leather',
      fit: 'Dimensions: 38cm x 32cm x 15cm; 24cm handle drop',
      care: 'Wipe with soft damp cloth; treat with leather balm',
      origin: 'Handmade in Florence, Italy'
    },
    images: [
      '/src/assets/images/hero_fashion_luxury_1794103592653.jpg',
      '/src/assets/images/product_leather_bomber_1794103594721.jpg'
    ],
    sizes: ['M'],
    colors: [
      { name: 'Noir Matte', hex: '#0d0d0e' },
      { name: 'Saddle Cognac', hex: '#724b2b' }
    ],
    stock: 6,
    rating: 5.0,
    reviewsCount: 19,
    isNew: false,
    isBestSeller: true,
    isFeatured: true,
    createdAt: '2026-07-18T10:00:00Z'
  },
  {
    id: 'prod-8',
    name: 'Metropolis Tailored Minimalist Suit Blazer',
    slug: 'metropolis-tailored-minimalist-suit-blazer',
    price: 640,
    originalPrice: 760,
    category: 'women',
    subcategory: 'Tailoring',
    description: 'Sculptural single-breasted blazer engineered with clean peak lapels, sharp waist suppression, welted flap pockets, and horn buttons. Pairs with Palazzo trousers for complete runway silhouette.',
    details: {
      composition: '98% Super 130s Merino Wool, 2% Elastane',
      fit: 'Structured shoulders, tailored waist',
      care: 'Dry clean only',
      origin: 'Milan, Italy'
    },
    images: [
      '/src/assets/images/banner_seasonal_campaign_1794103595731.jpg',
      '/src/assets/images/product_women_silk_dress_1794103595165.jpg'
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Raw Ivory', hex: '#ece7df' },
      { name: 'Carbon Black', hex: '#121212' }
    ],
    stock: 11,
    rating: 4.8,
    reviewsCount: 27,
    isNew: true,
    isBestSeller: false,
    isFeatured: true,
    createdAt: '2026-10-12T08:00:00Z'
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'c-1',
    code: 'NOVA10',
    discountType: 'percentage',
    value: 10,
    minOrder: 150,
    active: true,
    description: '10% off your first purchase over $150'
  },
  {
    id: 'c-2',
    code: 'WELCOME20',
    discountType: 'percentage',
    value: 20,
    minOrder: 300,
    active: true,
    description: '20% welcome privilege on orders over $300'
  },
  {
    id: 'c-3',
    code: 'LUXURY50',
    discountType: 'fixed',
    value: 50,
    minOrder: 250,
    active: true,
    description: '$50 complimentary credit on orders over $250'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    productId: 'prod-1',
    userName: 'Alexander Vance',
    rating: 5,
    date: '2026-10-24',
    comment: 'The Brixton Bomber is unequivocally the finest leather garment in my wardrobe. The lambskin has an immaculate drape, and the matte silver zippers are heavy and smooth.',
    verified: true
  },
  {
    id: 'rev-2',
    productId: 'prod-2',
    userName: 'Elena Rostova',
    rating: 5,
    date: '2026-10-28',
    comment: 'The 30 Momme silk has noticeable weight that avoids clinging while skimming the silhouette beautifully. Wore it to a gallery opening in Paris and received non-stop compliments.',
    verified: true
  },
  {
    id: 'rev-3',
    productId: 'prod-3',
    userName: 'Camille Laurent',
    rating: 5,
    date: '2026-11-02',
    comment: 'Pure luxury. The Mongolian cashmere feels extraordinarily soft, warm, and structured. Exceptional construction that will last a lifetime.',
    verified: true
  },
  {
    id: 'rev-4',
    productId: 'prod-4',
    userName: 'Marcus Thorne',
    rating: 5,
    date: '2026-11-04',
    comment: 'Sharp lines and impeccable Italian tailoring. Fits perfectly over a knit sweater without feeling bulky. Delivered to London in 3 days.',
    verified: true
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-101',
    orderNumber: 'NV-94021',
    createdAt: '2026-11-05T14:22:00Z',
    customer: {
      fullName: 'Julian Sterling',
      email: 'julian.sterling@luxury.io',
      phone: '+1 (555) 234-8901',
      address: '740 Park Avenue, Apt 11B',
      city: 'New York',
      postalCode: '10021',
      country: 'United States'
    },
    items: [
      {
        id: 'prod-1-L-Obsidian Black',
        productId: 'prod-1',
        name: 'The Brixton Lambskin Bomber',
        price: 680,
        originalPrice: 850,
        image: '/src/assets/images/product_leather_bomber_1794103594721.jpg',
        size: 'L',
        color: 'Obsidian Black',
        quantity: 1,
        maxStock: 12
      }
    ],
    subtotal: 680,
    discount: 68,
    couponCode: 'NOVA10',
    shipping: 0,
    total: 612,
    paymentMethod: 'card',
    paymentStatus: 'paid',
    status: 'delivered',
    trackingNumber: 'NV-EXP-890241US',
    timeline: [
      { status: 'Order Placed', time: 'Nov 05, 14:22', note: 'Payment authorized via Stripe' },
      { status: 'Quality Inspected', time: 'Nov 05, 16:40', note: 'Inspected at Milan Atelier' },
      { status: 'Shipped', time: 'Nov 06, 09:15', note: 'Handed to DHL Express' },
      { status: 'Delivered', time: 'Nov 07, 13:00', note: 'Delivered & signed by recipient' }
    ]
  },
  {
    id: 'ord-102',
    orderNumber: 'NV-94022',
    createdAt: '2026-11-06T19:40:00Z',
    customer: {
      fullName: 'Sophia Delacroix',
      email: 'sophia.d@vogue.fr',
      phone: '+33 6 12 34 56 78',
      address: '18 Rue de la Paix',
      city: 'Paris',
      postalCode: '75002',
      country: 'France'
    },
    items: [
      {
        id: 'prod-2-S-Onyx Noir',
        productId: 'prod-2',
        name: 'Aura Bias-Cut Silk Evening Slip',
        price: 495,
        originalPrice: 590,
        image: '/src/assets/images/product_women_silk_dress_1794103595165.jpg',
        size: 'S',
        color: 'Onyx Noir',
        quantity: 1,
        maxStock: 8
      }
    ],
    subtotal: 495,
    discount: 0,
    shipping: 0,
    total: 495,
    paymentMethod: 'card',
    paymentStatus: 'paid',
    status: 'shipped',
    trackingNumber: 'NV-EXP-991204FR',
    timeline: [
      { status: 'Order Placed', time: 'Nov 06, 19:40', note: 'Payment verified' },
      { status: 'In Transit', time: 'Nov 07, 08:30', note: 'Departed Paris hub' }
    ]
  },
  {
    id: 'ord-103',
    orderNumber: 'NV-94023',
    createdAt: '2026-11-07T11:05:00Z',
    customer: {
      fullName: 'Tariq Mansoor',
      email: 'tariq.m@dubaiholdings.ae',
      phone: '+971 50 123 4567',
      address: 'Villa 44, Emirates Hills',
      city: 'Dubai',
      postalCode: '00000',
      country: 'United Arab Emirates'
    },
    items: [
      {
        id: 'prod-4-XL-Charcoal Heather',
        productId: 'prod-4',
        name: 'Verona Wool-Cashmere Minimal Overcoat',
        price: 750,
        originalPrice: 890,
        image: '/src/assets/images/product_men_tailored_overcoat_1794103593370.jpg',
        size: 'XL',
        color: 'Charcoal Heather',
        quantity: 1,
        maxStock: 14
      }
    ],
    subtotal: 750,
    discount: 50,
    couponCode: 'LUXURY50',
    shipping: 0,
    total: 700,
    paymentMethod: 'cod',
    paymentStatus: 'pending',
    status: 'processing',
    trackingNumber: 'NV-EXP-332910AE',
    timeline: [
      { status: 'Order Placed', time: 'Nov 07, 11:05', note: 'Cash on Delivery selected' },
      { status: 'Processing', time: 'Nov 07, 12:30', note: 'Tailoring preparation underway' }
    ]
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-admin',
    name: 'Nova Atelier Director',
    email: 'admin@novafashion.com',
    phone: '+1 (555) 019-2831',
    role: 'admin',
    wishlist: ['prod-1', 'prod-3']
  },
  {
    id: 'usr-customer-1',
    name: 'Julian Sterling',
    email: 'julian.sterling@luxury.io',
    phone: '+1 (555) 234-8901',
    role: 'customer',
    savedAddresses: [
      {
        fullName: 'Julian Sterling',
        email: 'julian.sterling@luxury.io',
        phone: '+1 (555) 234-8901',
        address: '740 Park Avenue, Apt 11B',
        city: 'New York',
        postalCode: '10021',
        country: 'United States'
      }
    ],
    wishlist: ['prod-2', 'prod-4', 'prod-7']
  }
];

export const INITIAL_SUBSCRIBERS: NewsletterSubscriber[] = [
  { id: 'sub-1', email: 'elena.r@fashionparis.com', subscribedAt: '2026-10-15T09:20:00Z' },
  { id: 'sub-2', email: 'marcus.t@lifestyle.co.uk', subscribedAt: '2026-10-29T14:10:00Z' },
  { id: 'sub-3', email: 'charlotte@milandesign.it', subscribedAt: '2026-11-04T18:45:00Z' }
];
