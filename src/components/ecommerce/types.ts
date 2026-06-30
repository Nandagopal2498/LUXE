// TypeScript types for the fashion e-commerce platform

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  createdAt: string;
  _count?: { products: number };
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  createdAt: string;
  _count?: { products: number };
}

export interface ProductVariant {
  id: string;
  productId: string;
  size: string;
  color: string;
  colorHex: string | null;
  stock: number;
  sku: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  comparePrice: number | null;
  images: string; // JSON string
  categoryId: string;
  brandId: string;
  fit?: string | null;
  material?: string | null;
  rating: number;
  reviewCount: number;
  featured: boolean;
  newArrival: boolean;
  createdAt: string;
  updatedAt: string;
  category: Category;
  brand: Brand;
  variants: ProductVariant[];
  reviews?: Review[];
}

export interface Review {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  title: string | null;
  comment: string | null;
  createdAt: string;
  user?: { id: string; name: string | null; avatar: string | null };
}

export interface CartItemData {
  id: string;
  userId: string;
  productId: string;
  variantId: string | null;
  quantity: number;
  product: Product;
  variant?: ProductVariant;
}

export interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  product: Product;
}

export interface Address {
  id: string;
  userId: string;
  name: string;
  phone: string;
  address1: string;
  address2: string | null;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  userId: string;
  totalAmount: number;
  discountAmount: number;
  taxAmount: number;
  finalAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  couponCode: string | null;
  paymentId: string | null;
  paymentMethod: string | null;
  shippingName: string | null;
  shippingPhone: string | null;
  shippingAddress: string | null;
  shippingCity: string | null;
  shippingState: string | null;
  shippingPincode: string | null;
  createdAt: string;
  updatedAt: string;
  orderItems: OrderItemData[];
}

export interface OrderItemData {
  id: string;
  orderId: string;
  productId: string;
  variantId: string | null;
  quantity: number;
  price: number;
  productName: string | null;
  productImage: string | null;
}

export interface Coupon {
  id: string;
  code: string;
  discountPercent: number;
  minOrderAmount: number | null;
  maxDiscount: number | null;
  isActive: boolean;
  expiresAt: string | null;
}

export interface User {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  phone: string | null;
  role: 'user' | 'admin';
}

// App state types
export type AppView =
  | 'home'
  | 'shop'
  | 'product'
  | 'wishlist'
  | 'checkout'
  | 'dashboard'
  | 'admin'
  | 'orders'
  | 'auth';

export interface ProductFilters {
  search: string;
  categoryId: string;
  brandId: string;
  minPrice: number;
  maxPrice: number;
  sort: 'newest' | 'price_asc' | 'price_desc' | 'rating';
}

export interface LocalCartItem {
  productId: string;
  variantId?: string;
  quantity: number;
}

export const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  shipped: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  delivered: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};
