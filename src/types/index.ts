export type Category = 'all' | 'men' | 'women' | 'outerwear' | 'tailoring' | 'accessories';

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  category: 'men' | 'women' | 'accessories';
  subcategory: string;
  description: string;
  details: {
    composition: string;
    fit: string;
    care: string;
    origin: string;
  };
  images: string[];
  sizes: ('XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL')[];
  colors: { name: string; hex: string }[];
  stock: number;
  rating: number;
  reviewsCount: number;
  isNew?: boolean;
  isBestSeller?: boolean;
  isFeatured?: boolean;
  createdAt: string;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

export interface CartItem {
  id: string; // unique item id (productId-size-color)
  productId: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  size: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
  color: string;
  quantity: number;
  maxStock: number;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderCustomer {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface OrderTimeline {
  status: string;
  time: string;
  note: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  customer: OrderCustomer;
  items: CartItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  shipping: number;
  total: number;
  paymentMethod: 'cod' | 'card' | 'bank';
  paymentStatus: 'paid' | 'pending';
  status: OrderStatus;
  trackingNumber: string;
  timeline: OrderTimeline[];
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number;
  minOrder: number;
  active: boolean;
  description: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'admin';
  savedAddresses?: OrderCustomer[];
  wishlist: string[]; // product IDs
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribedAt: string;
}
