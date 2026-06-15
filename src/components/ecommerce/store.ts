import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppView, ProductFilters, LocalCartItem, User, Product } from './types';

interface AppState {
  // Navigation
  currentView: AppView;
  selectedProductId: string | null;
  setView: (view: AppView, productId?: string | null) => void;

  // Filters
  filters: ProductFilters;
  setFilters: (filters: Partial<ProductFilters>) => void;
  resetFilters: () => void;

  // Cart (localStorage for guests)
  cart: LocalCartItem[];
  addToCart: (productId: string, variantId?: string, quantity?: number) => void;
  removeFromCart: (productId: string, variantId?: string) => void;
  updateCartQuantity: (productId: string, variantId: string | undefined, quantity: number) => void;
  clearCart: () => void;

  // Wishlist (localStorage)
  wishlist: string[];
  toggleWishlist: (productId: string) => void;

  // Recently viewed
  recentlyViewed: string[];
  addRecentlyViewed: (productId: string) => void;

  // User
  user: User | null;
  setUser: (user: User | null) => void;

  // Cart drawer open
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;

  // Auth modal
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  authMode: 'login' | 'signup';
  setAuthMode: (mode: 'login' | 'signup') => void;

  // Search
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;

  // Mobile menu
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;

  // AI recommendations
  recommendations: Product[];
  setRecommendations: (products: Product[]) => void;
}

const defaultFilters: ProductFilters = {
  search: '',
  categoryId: '',
  brandId: '',
  minPrice: 0,
  maxPrice: 50000,
  sort: 'newest',
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Navigation
      currentView: 'home',
      selectedProductId: null,
      setView: (view, productId = null) => {
        set({ currentView: view, selectedProductId: productId });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },

      // Filters
      filters: { ...defaultFilters },
      setFilters: (newFilters) =>
        set((state) => ({ filters: { ...state.filters, ...newFilters } })),
      resetFilters: () => set({ filters: { ...defaultFilters } }),

      // Cart
      cart: [],
      addToCart: (productId, variantId, quantity = 1) =>
        set((state) => {
          const existing = state.cart.find(
            (item) => item.productId === productId && item.variantId === variantId
          );
          if (existing) {
            return {
              cart: state.cart.map((item) =>
                item.productId === productId && item.variantId === variantId
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }
          return { cart: [...state.cart, { productId, variantId, quantity }] };
        }),
      removeFromCart: (productId, variantId) =>
        set((state) => ({
          cart: state.cart.filter(
            (item) => !(item.productId === productId && item.variantId === variantId)
          ),
        })),
      updateCartQuantity: (productId, variantId, quantity) =>
        set((state) => ({
          cart:
            quantity <= 0
              ? state.cart.filter(
                  (item) => !(item.productId === productId && item.variantId === variantId)
                )
              : state.cart.map((item) =>
                  item.productId === productId && item.variantId === variantId
                    ? { ...item, quantity }
                    : item
                ),
        })),
      clearCart: () => set({ cart: [] }),

      // Wishlist
      wishlist: [],
      toggleWishlist: (productId) =>
        set((state) => ({
          wishlist: state.wishlist.includes(productId)
            ? state.wishlist.filter((id) => id !== productId)
            : [...state.wishlist, productId],
        })),

      // Recently viewed
      recentlyViewed: [],
      addRecentlyViewed: (productId) =>
        set((state) => ({
          recentlyViewed: [
            productId,
            ...state.recentlyViewed.filter((id) => id !== productId),
          ].slice(0, 20),
        })),

      // User
      user: null,
      setUser: (user) => set({ user }),

      // Cart drawer
      cartOpen: false,
      setCartOpen: (open) => set({ cartOpen: open }),

      // Auth modal
      authModalOpen: false,
      setAuthModalOpen: (open) => set({ authModalOpen: open }),
      authMode: 'login',
      setAuthMode: (mode) => set({ authMode: mode }),

      // Search
      searchOpen: false,
      setSearchOpen: (open) => set({ searchOpen: open }),

      // Mobile menu
      mobileMenuOpen: false,
      setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),

      // AI recommendations
      recommendations: [],
      setRecommendations: (products) => set({ recommendations: products }),
    }),
    {
      name: 'luxe-fashion-store',
      partialize: (state) => ({
        cart: state.cart,
        wishlist: state.wishlist,
        recentlyViewed: state.recentlyViewed,
        user: state.user,
        filters: state.filters,
      }),
    }
  )
);
