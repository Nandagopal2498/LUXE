'use client';

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, ShoppingBag, Heart, User, Menu, X, Star, ChevronDown,
  ChevronRight, Minus, Plus, Trash2, ArrowLeft, Filter, MapPin,
  CreditCard, Package, Shield, Truck, Eye, Tag, BarChart3, Users,
  Settings, LogOut, Sun, Moon, Check, AlertCircle, Loader2,
  ChevronUp, Home, Grid3X3, BookOpen, ArrowRight, Sparkles,
  RefreshCw, ExternalLink, Copy, SlidersHorizontal, BadgePercent,
  MessageSquare, ThumbsUp, Share2, Instagram, Twitter, Facebook,
  Mail, Phone, Clock, Award, Gem
} from 'lucide-react';
import { useStore } from './store';
import type { Product, Category, Brand, CartItemData, Order, Review, ProductVariant, Address } from './types';
import { STATUS_COLORS } from './types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { useUser, useClerk, SignInButton } from '@clerk/nextjs';

// ==================== UTILITY FUNCTIONS ====================

function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
}

function getDiscountPercent(price: number, comparePrice: number): number {
  return Math.round(((comparePrice - price) / comparePrice) * 100);
}

function parseImages(imagesStr: string): string[] {
  try {
    return JSON.parse(imagesStr);
  } catch {
    return [];
  }
}

function getRelativeTime(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
}

// ==================== DATA HOOKS ====================

function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 32, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const filters = useStore((s) => s.filters);

  const fetchProducts = useCallback(async (page = 1, append = false) => {
    try {
      if (append) setLoadingMore(true);
      else setLoading(true);

      const params = new URLSearchParams();
      if (filters.search) params.set('search', filters.search);
      if (filters.categoryId) params.set('category', filters.categoryId);
      if (filters.brandId) params.set('brand', filters.brandId);
      if (filters.minPrice > 0) params.set('minPrice', String(filters.minPrice));
      if (filters.maxPrice < 50000) params.set('maxPrice', String(filters.maxPrice));
      params.set('sort', filters.sort);
      params.set('limit', '32');
      params.set('page', String(page));

      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();

      setProducts((prev) => append ? [...prev, ...(data.products || [])] : (data.products || []));
      setPagination(data.pagination || { page: 1, limit: 32, total: 0, totalPages: 0 });
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [filters]);

  useEffect(() => {
    const timer = setTimeout(() => fetchProducts(1, false), 300);
    return () => clearTimeout(timer);
  }, [fetchProducts]);

  const loadMore = () => {
    if (pagination.page < pagination.totalPages) {
      fetchProducts(pagination.page + 1, true);
    }
  };

  return { products, pagination, loading, loadingMore, loadMore, refetch: () => fetchProducts(1, false) };
}

function useTrendingProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products/trending')
      .then((res) => res.json())
      .then((data) => setProducts(data.products || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return { products, loading };
}

function useRecentlyViewedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const store = useStore();

  useEffect(() => {
    if (store.recentlyViewed.length === 0) {
      setLoading(false);
      return;
    }
    const ids = store.recentlyViewed.slice(0, 10).join(',');
    fetch(`/api/products/recently-viewed?ids=${ids}`)
      .then((res) => res.json())
      .then((data) => setProducts(data.products || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [store.recentlyViewed]);

  return { products, loading };
}

function useNewArrivals() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products?newArrival=true&limit=8&sort=newest')
      .then((res) => res.json())
      .then((data) => setProducts(data.products || []))
      .finally(() => setLoading(false));
  }, []);

  return { products, loading };
}

function useProduct(id: string | null) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(!!id);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    fetch(`/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => { if (!cancelled) { setProduct(data); setLoading(false); } })
      .catch(console.error)
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [id]);

  return { product: id ? product : null, loading };
}

function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then(setCategories)
      .catch(console.error);
  }, []);
  return categories;
}

function useBrands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  useEffect(() => {
    fetch('/api/brands')
      .then((res) => res.json())
      .then(setBrands)
      .catch(console.error);
  }, []);
  return brands;
}

function useOrders(userId: string | null) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(!!userId);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    fetch(`/api/orders?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => { if (!cancelled) setOrders(data.orders || data || []); })
      .catch(console.error)
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [userId]);

  return { orders, loading };
}

// ==================== STAR RATING COMPONENT ====================

function StarRating({ rating, size = 16, interactive = false, onChange }: {
  rating: number; size?: number; interactive?: boolean; onChange?: (r: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          disabled={!interactive}
          className={`${interactive ? 'cursor-pointer' : 'cursor-default'} transition-transform ${interactive ? 'hover:scale-110' : ''
            }`}
          onMouseEnter={() => interactive && setHovered(i)}
          onMouseLeave={() => interactive && setHovered(0)}
          onClick={() => interactive && onChange?.(i)}
        >
          <Star
            size={size}
            className={
              i <= (hovered || rating)
                ? 'fill-amber-400 text-amber-400'
                : 'fill-muted text-muted-foreground/30'
            }
          />
        </button>
      ))}
    </div>
  );
}

// ==================== HEADER ====================

function Header({ darkMode, toggleDarkMode }: { darkMode: boolean; toggleDarkMode: () => void }) {
  const store = useStore();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { openSignIn, signOut } = useClerk();
  const { isLoaded } = useUser();
  const cartCount = store.cart.reduce((sum, item) => sum + item.quantity, 0);
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    store.setFilters({ search: searchValue });
    store.setView('shop');
    store.setSearchOpen(false);
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error(err);
    }
    store.setUser(null);
    toast({ title: 'Logged out successfully' });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Menu + Logo */}
        <div className="flex items-center gap-3">
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={() => store.setMobileMenuOpen(true)} className="lg:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <button
            onClick={() => store.setView('home')}
            className="flex items-center gap-2 text-xl font-bold tracking-tighter"
          >
            <Gem className="h-6 w-6 text-amber-500" />
            <span className="hidden sm:inline">LUXE</span>
          </button>
        </div>

        {/* Center: Nav Links (desktop) */}
        {!isMobile && (
          <nav className="hidden md:flex items-center gap-1">
            {[
              { label: 'Home', view: 'home' as const },
              { label: 'Shop', view: 'shop' as const },

            ].map((item) => (
              <Button
                key={item.label}
                variant="ghost"
                size="sm"
                className={`text-sm font-medium ${store.currentView === item.view ? 'text-foreground' : 'text-muted-foreground'
                  }`}
                onClick={() => {
                  if (item.filter) store.setFilters({ sort: 'newest' });
                  store.setView(item.view);
                }}
              >
                {item.label}
              </Button>
            ))}
            <CategoryNav />
          </nav>
        )}

        {/* Right: Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => store.setSearchOpen(true)}>
                  <Search className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Search</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                  onClick={() => store.setView('wishlist')}
                >
                  <Heart className={`h-5 w-5 ${store.wishlist.length > 0 ? 'fill-red-500 text-red-500' : ''}`} />
                  {store.wishlist.length > 0 && (
                    <Badge className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 p-0 text-[10px] text-white">
                      {store.wishlist.length}
                    </Badge>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Wishlist</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative"
                  onClick={() => store.setCartOpen(true)}
                >
                  <ShoppingBag className="h-5 w-5" />
                  {cartCount > 0 && (
                    <Badge className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 p-0 text-[10px] text-white">
                      {cartCount}
                    </Badge>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Cart ({cartCount})</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
                  {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{darkMode ? 'Light Mode' : 'Dark Mode'}</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {!isLoaded ? (
            <Skeleton className="ml-1 h-8 w-20 rounded-md" />
          ) : store.user ? (
            <DropdownMenu
              user={store.user}
              onLogout={handleLogout}
              onViewChange={store.setView}
            />
          ) : (
            <SignInButton>
              <Button
                variant="default"
                size="sm"
                className="ml-1 bg-foreground text-background hover:bg-foreground/90"
              >
                <User className="mr-1 h-4 w-4" />
                <span className="hidden sm:inline">Sign In</span>
              </Button>
            </SignInButton>
          )}
        </div>
      </div>
    </header>
  );
}

function CategoryNav() {
  const categories = useCategories();
  const store = useStore();
  return (
    <>
      {categories.slice(0, 4).map((cat) => (
        <Button
          key={cat.id}
          variant="ghost"
          size="sm"
          className="text-sm font-medium text-muted-foreground"
          onClick={() => {
            store.setFilters({ categoryId: cat.id });
            store.setView('shop');
          }}
        >
          {cat.name}
        </Button>
      ))}
    </>
  );
}

function DropdownMenu({ user, onLogout, onViewChange }: {
  user: { name: string | null; email: string; role: string };
  onLogout: () => void;
  onViewChange: (view: any) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <Button variant="ghost" size="icon" onClick={() => setOpen(!open)}>
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-foreground text-xs font-bold text-background">
          {(user.name || user.email)[0].toUpperCase()}
        </div>
      </Button>
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border bg-popover p-2 shadow-xl"
            >
              <div className="px-3 py-2">
                <p className="text-sm font-semibold">{user.name || 'User'}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
              <Separator className="my-1" />
              {[
                { icon: Package, label: 'My Orders', view: 'orders' as const },
                { icon: Heart, label: 'Wishlist', view: 'wishlist' as const },
                { icon: User, label: 'Dashboard', view: 'dashboard' as const },
                ...(user.role === 'admin' ? [{ icon: BarChart3, label: 'Admin Panel', view: 'admin' as const }] : []),
              ].map((item) => (
                <button
                  key={item.label}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-accent transition-colors"
                  onClick={() => { onViewChange(item.view); setOpen(false); }}
                >
                  <item.icon className="h-4 w-4 text-muted-foreground" />
                  {item.label}
                </button>
              ))}
              <Separator className="my-1" />
              <button
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                onClick={() => { onLogout(); setOpen(false); }}
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ==================== SEARCH MODAL ====================

function SearchModal() {
  const store = useStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (store.searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [store.searchOpen]);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(query)}&limit=8`);
        const data = await res.json();
        setResults(data.products || []);
      } catch { /* ignore */ }
      finally { setLoading(false); }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <Dialog open={store.searchOpen} onOpenChange={store.setSearchOpen}>
      <DialogContent className="sm:max-w-2xl p-0 gap-0 overflow-hidden">
        <div className="flex items-center border-b px-4">
          <Search className="h-5 w-5 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, brands, categories..."
            className="flex-1 border-0 bg-transparent py-4 px-3 text-base outline-none placeholder:text-muted-foreground"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && query.trim()) {
                store.setFilters({ search: query });
                store.setView('shop');
                store.setSearchOpen(false);
              }
            }}
          />
          {query && (
            <Button variant="ghost" size="icon" onClick={() => setQuery('')}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="max-h-96 overflow-y-auto">
          {loading && (
            <div className="p-6 text-center">
              <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}
          {!loading && results.length > 0 && (
            <div className="p-2">
              {results.map((product) => (
                <button
                  key={product.id}
                  className="flex items-center gap-3 w-full rounded-lg px-3 py-2.5 hover:bg-accent transition-colors text-left"
                  onClick={() => {
                    store.setView('product', product.id);
                    store.addRecentlyViewed(product.id);
                    store.setSearchOpen(false);
                  }}
                >
                  <div className="h-12 w-12 rounded-lg bg-muted overflow-hidden shrink-0">
                    <img
                      src={parseImages(product.images)[0] || '/logo.svg'}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{product.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {product.category.name} · {product.brand.name}
                    </p>
                  </div>
                  <span className="text-sm font-semibold">{formatPrice(product.price)}</span>
                </button>
              ))}
            </div>
          )}
          {!loading && query && results.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-sm text-muted-foreground">No products found for &quot;{query}&quot;</p>
            </div>
          )}
          {!loading && !query && (
            <div className="p-6 text-center">
              <p className="text-sm text-muted-foreground">Start typing to search...</p>
            </div>
          )}
        </div>
        {query && (
          <div className="border-t p-3">
            <Button
              variant="ghost"
              className="w-full justify-center text-sm"
              onClick={() => {
                store.setFilters({ search: query });
                store.setView('shop');
                store.setSearchOpen(false);
              }}
            >
              View all results for &quot;{query}&quot; <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ==================== AUTH MODAL ====================

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

function AuthModal() {
  const store = useStore();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        store.setUser({ id: data.user.id, email: data.user.email, name: data.user.name, avatar: data.user.avatar || null, phone: null, role: data.user.role || 'user' });
        store.setAuthModalOpen(false);
        toast({ title: `Welcome, ${data.user.name}!`, description: 'Signed in with Google successfully' });
      } else if (data.url) {
        // Supabase OAuth redirect
        window.location.href = data.url;
      } else {
        setError(data.error || 'Google sign-in failed. Please try again.');
      }
    } catch (err) {
      console.error('Google sign-in error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleCredentialsAuth = async (loginEmail: string, loginPassword: string) => {
    setLoading(true);
    setError('');
    try {
      if (store.authMode === 'login') {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: loginEmail, password: loginPassword }),
        });
        const data = await res.json();
        if (res.ok && data.user) {
          store.setUser({ id: data.user.id, email: data.user.email, name: data.user.name, avatar: data.user.avatar || null, phone: null, role: data.user.role || 'user' });
          store.setAuthModalOpen(false);
          toast({ title: 'Welcome back!' });
        } else {
          setError(data.error || 'Invalid email or password');
        }
      } else {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email: loginEmail, password: loginPassword }),
        });
        const data = await res.json();
        if (res.ok && data.user) {
          // Auto sign-in after registration
          const loginRes = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: loginEmail, password: loginPassword }),
          });
          const loginData = await loginRes.json();
          if (loginRes.ok && loginData.user) {
            store.setUser({ id: loginData.user.id, email: loginData.user.email, name: loginData.user.name, avatar: loginData.user.avatar || null, phone: null, role: loginData.user.role || 'user' });
            store.setAuthModalOpen(false);
            toast({ title: 'Account created successfully!', description: 'Welcome to LUXE!' });
          }
        } else {
          setError(data.error || 'Failed to create account');
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleCredentialsAuth(email, password);
  };

  return (
    <Dialog open={store.authModalOpen} onOpenChange={store.setAuthModalOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold tracking-tight">
            {store.authMode === 'login' ? 'Welcome Back' : 'Create Account'}
          </DialogTitle>
        </DialogHeader>

        {/* Google Sign-In Button - Prominent at top */}
        <div className="mt-4">
          <Button
            type="button"
            variant="outline"
            className="w-full h-12 text-base font-medium border-2 hover:border-foreground/20 hover:bg-muted/50 transition-all duration-200"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
          >
            {googleLoading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <GoogleIcon className="mr-2 h-5 w-5" />
            )}
            Continue with Google
          </Button>
          <p className="mt-1.5 text-center text-[11px] text-muted-foreground/60">
            {process.env.NEXT_PUBLIC_SUPABASE_URL
              ? 'Sign in with your Google account via Supabase'
              : 'Demo mode — add Supabase credentials for real Google OAuth'}
          </p>
        </div>

        {/* Divider */}
        <div className="relative my-2">
          <Separator />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-3 text-xs text-muted-foreground">
            or continue with email
          </span>
        </div>

        {/* Error message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 rounded-lg bg-red-50 dark:bg-red-900/20 p-3 text-sm text-red-600 dark:text-red-400"
          >
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {store.authMode === 'signup' && (
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" required />
            </div>
          )}
          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required />
          </div>
          <div className="space-y-2">
            <Label>Password</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" required />
          </div>
          <Button type="submit" className="w-full bg-foreground text-background hover:bg-foreground/90" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {store.authMode === 'login' ? 'Sign In' : 'Create Account'}
          </Button>

          {/* Demo login buttons */}
          <div className="relative my-2">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-3 text-xs text-muted-foreground">
              demo accounts
            </span>
          </div>
          <Button type="button" variant="outline" className="w-full" onClick={() => handleCredentialsAuth('user@luxe.com', 'User@123')} disabled={loading}>
            <User className="mr-2 h-4 w-4" />
            Demo User Login
          </Button>
          <Button type="button" variant="outline" className="w-full" onClick={() => handleCredentialsAuth('admin@luxe.com', 'Admin@123')} disabled={loading}>
            <Shield className="mr-2 h-4 w-4" />
            Demo Admin Login
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            {store.authMode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              type="button"
              className="font-medium text-foreground underline underline-offset-4"
              onClick={() => { store.setAuthMode(store.authMode === 'login' ? 'signup' : 'login'); setError(''); }}
            >
              {store.authMode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ==================== PRODUCT CARD ====================

function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const store = useStore();
  const { toast } = useToast();
  const images = parseImages(product.images);
  const isWishlisted = store.wishlist.includes(product.id);
  const discount = product.comparePrice ? getDiscountPercent(product.price, product.comparePrice) : 0;

  const fullStars = Math.floor(product.rating || 0);
  const emptyStars = 5 - fullStars;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group relative"
    >
      <div
        className="cursor-pointer overflow-hidden rounded-xl border border-border/50 bg-white transition-all duration-300 hover:shadow-md max-w-[340px] mx-auto w-full"
        onClick={() => {
          store.setView('product', product.id);
          store.addRecentlyViewed(product.id);
        }}
      >
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-[#f0f0f0]">
          <img
            key={product.id}
            src={images[0]}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          {/* Badges */}
          <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
            {discount > 0 && (
              <span className="bg-[#ef4444] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                -{discount}%
              </span>
            )}
            {product.newArrival && (
              <span className="bg-[#10b981] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                NEW
              </span>
            )}
            {discount === 0 && !product.newArrival && (
              <div className="invisible px-2.5 py-0.5 text-[11px] font-bold">
                PLACEHOLDER
              </div>
            )}
          </div>
          {/* Wishlist button */}
          <button
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm transition-all hover:scale-110"
            onClick={(e) => {
              e.stopPropagation();
              store.toggleWishlist(product.id);
              toast({
                title: isWishlisted ? 'Removed from wishlist' : 'Added to wishlist',
                duration: 1500,
              });
            }}
          >
            <Heart className={`h-[15px] w-[15px] transition-colors ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
          </button>
        </div>
        {/* Info */}
        <div className="p-4 bg-white">
          <p className="text-[11px] font-medium uppercase tracking-wider text-gray-500 mb-1">
            {product.brand?.name || 'BRAND'}
          </p>
          <h3 className="text-[15px] font-bold text-gray-900 leading-tight line-clamp-2 mb-1.5">
            {product.name}
          </h3>

          <div className="flex items-center gap-1.5 mb-2.5">
            <div className="text-[13px] tracking-widest">
              <span className="text-[#fbbf24]">{'★'.repeat(fullStars)}</span>
              <span className="text-gray-300">{'☆'.repeat(emptyStars)}</span>
            </div>
            <span className="text-[12px] text-gray-500">({product.reviewCount || 0})</span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-[17px] font-bold text-gray-900">{formatPrice(product.price)}</span>
            {product.comparePrice && product.comparePrice > product.price && (
              <span className="text-[13px] text-gray-400 line-through">
                {formatPrice(product.comparePrice)}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ==================== HERO SECTION ====================

function HeroSection() {
  const store = useStore();
  return (
    <section className="relative overflow-hidden">
      {/* Main hero */}
      <div className="relative flex min-h-[85vh] items-center bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-800 dark:from-neutral-900 dark:via-neutral-950 dark:to-black">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 50%, rgba(251,191,36,0.15) 0%, transparent 50%),
                             radial-gradient(circle at 75% 30%, rgba(251,191,36,0.1) 0%, transparent 50%)`,
          }} />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-sm text-amber-400 mb-8"
              >
                <Sparkles className="h-3.5 w-3.5" />
                New Season Collection 2026
              </motion.div>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1]">
                Define Your
                <br />
                <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                  Style
                </span>
              </h1>
              <p className="mt-6 max-w-lg text-lg text-neutral-400 leading-relaxed">
                Discover curated collections from the world&apos;s most coveted brands.
                Premium fashion, delivered to your doorstep.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Button
                  size="lg"
                  className="bg-amber-500 text-black hover:bg-amber-400 font-semibold px-8 h-12 text-base"
                  onClick={() => store.setView('shop')}
                >
                  Shop Now <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-neutral-600 bg-transparent text-white hover:bg-white/10 hover:text-white h-12 px-8 text-base"
                  onClick={() => store.setFilters({ sort: 'newest' }) || store.setView('shop')}
                >
                  New Arrivals
                </Button>
              </div>
              <div className="mt-12 flex items-center gap-8">
                {[
                  { value: '500+', label: 'Premium Brands' },
                  { value: '50K+', label: 'Happy Customers' },
                  { value: '24h', label: 'Fast Delivery' },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-sm text-neutral-500">{stat.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden lg:block relative"
            >
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80"
                  alt="Fashion collection"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>
              <div className="absolute -bottom-6 -left-6 rounded-xl bg-white p-4 shadow-2xl dark:bg-neutral-800">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
                    <Truck className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Free Shipping</p>
                    <p className="text-xs text-muted-foreground">On orders above ₹999</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Category strip */}
      <div className="border-b bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <CategoryStrip />
        </div>
      </div>
    </section>
  );
}

function CategoryStrip() {
  const categories = useCategories();
  const store = useStore();
  return (
    <div className="flex gap-2 overflow-x-auto py-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
      <Button
        variant={store.filters.categoryId ? 'ghost' : 'secondary'}
        size="sm"
        className="shrink-0 rounded-full text-sm"
        onClick={() => { store.resetFilters(); store.setView('shop'); }}
      >
        All
      </Button>
      {categories.map((cat) => (
        <Button
          key={cat.id}
          variant={store.filters.categoryId === cat.id ? 'secondary' : 'ghost'}
          size="sm"
          className="shrink-0 rounded-full text-sm"
          onClick={() => {
            store.setFilters({ categoryId: cat.id });
            store.setView('shop');
          }}
        >
          {cat.name}
        </Button>
      ))}
    </div>
  );
}

// ==================== TRENDING SECTION ====================

function TrendingSection() {
  const { products, loading } = useTrendingProducts();
  const store = useStore();

  if (loading) return <ProductGridSkeleton />;
  if (products.length === 0) return null;

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-sm font-medium uppercase tracking-wider text-amber-500">Curated for you</p>
              <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight">Trending Now</h2>
            </motion.div>
          </div>
          <Button variant="ghost" className="hidden sm:flex items-center gap-1 text-sm" onClick={() => store.setView('shop')}>
            View All <ArrowRight className="h-3 w-3" />
          </Button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ==================== RECENTLY VIEWED SECTION ====================

function RecentlyViewedSection() {
  const { products, loading } = useRecentlyViewedProducts();
  const store = useStore();

  if (loading || products.length === 0) return null;

  return (
    <section className="py-16 sm:py-20 bg-muted/20 border-t border-b">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-sm font-medium uppercase tracking-wider text-blue-500">Your History</p>
              <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight">Recently Viewed</h2>
            </motion.div>
          </div>
        </div>
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 sm:gap-6 pb-6 -mx-4 px-4 sm:mx-0 sm:px-0 hide-scrollbar">
          {products.map((product, i) => (
            <div key={product.id} className="min-w-[280px] w-[280px] sm:min-w-[320px] sm:w-[320px] snap-start shrink-0">
              <ProductCard product={product} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ==================== NEW ARRIVALS ====================

function NewArrivalsSection() {
  const { products, loading } = useNewArrivals();
  const store = useStore();

  if (loading) return null;
  if (products.length === 0) return null;

  return (
    <section className="py-16 sm:py-20 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-sm font-medium uppercase tracking-wider text-emerald-500">Just Dropped</p>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight">New Arrivals</h2>
          </motion.div>
          <Button variant="ghost" className="hidden sm:flex items-center gap-1 text-sm" onClick={() => { store.setFilters({ sort: 'newest' }); store.setView('shop'); }}>
            View All <ArrowRight className="h-3 w-3" />
          </Button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.slice(0, 4).map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ==================== PROMO BANNER ====================

function PromoBanner() {
  const store = useStore();
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-800 p-8 sm:p-10 text-white min-h-[280px] flex flex-col justify-end"
          >
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-30">
              <img src="https://images.unsplash.com/photo-1552346154-21d32810aba3?w=600&q=80" alt="" className="h-full w-full object-cover" />
            </div>
            <Badge className="w-fit bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 mb-4">Limited Time</Badge>
            <h3 className="text-2xl sm:text-3xl font-bold">Sportswear Sale</h3>
            <p className="mt-2 text-neutral-400">Up to 40% off on premium sportswear brands</p>
            <Button className="mt-6 w-fit bg-amber-500 text-black hover:bg-amber-400" onClick={() => { store.setFilters({ categoryId: 'cmqf3dv2v0004q9d9kmzf7qnm' }); store.setView('shop'); }}>
              Shop Now
            </Button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/30 dark:to-amber-900/20 p-8 sm:p-10 min-h-[280px] flex flex-col justify-end"
          >
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-20">
              <img src="https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&q=80" alt="" className="h-full w-full object-cover" />
            </div>
            <Badge className="w-fit bg-foreground/10 text-foreground mb-4">New Collection</Badge>
            <h3 className="text-2xl sm:text-3xl font-bold text-foreground">Accessories Edit</h3>
            <p className="mt-2 text-muted-foreground">Complete your look with curated accessories</p>
            <Button variant="outline" className="mt-6 w-fit" onClick={() => { store.setFilters({ categoryId: 'cmqf3dv2u0002q9d9py0nqppl' }); store.setView('shop'); }}>
              Explore
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ==================== FEATURES BAR ====================

function FeaturesBar() {
  const features = [
    { icon: Truck, title: 'Free Shipping', desc: 'On orders above ₹999' },
    { icon: RefreshCw, title: 'Easy Returns', desc: '30-day return policy' },
    { icon: Shield, title: 'Secure Payments', desc: '100% protected' },
    { icon: Award, title: 'Authentic Products', desc: 'Guranteed genuine' },
  ];
  return (
    <section className="border-y bg-muted/30 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {features.map((f) => (
            <div key={f.title} className="flex items-center gap-3 sm:gap-4">
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30 shrink-0">
                <f.icon className="h-5 w-5 sm:h-6 sm:w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-semibold">{f.title}</p>
                <p className="text-xs text-muted-foreground">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ==================== SHOP VIEW ====================

function ShopView() {
  const { products, loading, loadingMore, loadMore, pagination } = useProducts();
  const store = useStore();
  const categories = useCategories();
  const brands = useBrands();
  const isMobile = useIsMobile();
  const [filterOpen, setFilterOpen] = useState(false);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {store.filters.search
              ? `Results for "${store.filters.search}"`
              : store.filters.categoryId
                ? categories.find((c) => c.id === store.filters.categoryId)?.name || 'Shop'
                : 'All Products'}
          </h1>
          {!loading && (
            <p className="mt-1 text-sm text-muted-foreground">{pagination.total} products</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="lg:hidden"
            onClick={() => setFilterOpen(!filterOpen)}
          >
            <SlidersHorizontal className="mr-1 h-4 w-4" /> Filters
          </Button>
          <Select
            value={store.filters.sort}
            onValueChange={(v) => store.setFilters({ sort: v as any })}
          >
            <SelectTrigger className="w-[150px] h-9 text-sm">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price_asc">Price: Low to High</SelectItem>
              <SelectItem value="price_desc">Price: High to Low</SelectItem>
              <SelectItem value="rating">Top Rated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Filters sidebar (desktop) */}
        <aside className="hidden lg:block w-64 shrink-0">
          <FilterPanel categories={categories} brands={brands} />
        </aside>

        {/* Mobile filters */}
        <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
          <SheetContent side="left" className="w-80 p-0">
            <SheetHeader className="p-4 border-b">
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="p-4">
              <FilterPanel categories={categories} brands={brands} onClose={() => setFilterOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>

        {/* Product grid */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <ProductGridSkeleton />
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Search className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-lg font-medium">No products found</p>
              <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters</p>
              <Button variant="outline" className="mt-4" onClick={() => store.resetFilters()}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {products.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>

            </>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterPanel({ categories, brands, onClose }: { categories: Category[]; brands: Brand[]; onClose?: () => void }) {
  const store = useStore();
  const [priceRange, setPriceRange] = useState([store.filters.minPrice, store.filters.maxPrice]);

  const handleCategoryClick = (id: string) => {
    store.setFilters({ categoryId: store.filters.categoryId === id ? '' : id });
    onClose?.();
  };

  const handleBrandClick = (id: string) => {
    store.setFilters({ brandId: store.filters.brandId === id ? '' : id });
    onClose?.();
  };

  return (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="text-sm font-semibold mb-3">Categories</h3>
        <div className="space-y-1">
          <button
            className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${!store.filters.categoryId ? 'bg-accent font-medium' : 'hover:bg-accent/50'
              }`}
            onClick={() => { store.setFilters({ categoryId: '' }); onClose?.(); }}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${store.filters.categoryId === cat.id ? 'bg-accent font-medium' : 'hover:bg-accent/50'
                }`}
              onClick={() => handleCategoryClick(cat.id)}
            >
              {cat.name}
              <span className="text-xs text-muted-foreground">{cat._count?.products || 0}</span>
            </button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Brands */}
      <div>
        <h3 className="text-sm font-semibold mb-3">Brands</h3>
        <div className="space-y-1">
          <button
            className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${!store.filters.brandId ? 'bg-accent font-medium' : 'hover:bg-accent/50'
              }`}
            onClick={() => { store.setFilters({ brandId: '' }); onClose?.(); }}
          >
            All Brands
          </button>
          {brands.map((brand) => (
            <button
              key={brand.id}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${store.filters.brandId === brand.id ? 'bg-accent font-medium' : 'hover:bg-accent/50'
                }`}
              onClick={() => handleBrandClick(brand.id)}
            >
              {brand.name}
              <span className="text-xs text-muted-foreground">{brand._count?.products || 0}</span>
            </button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Price Range */}
      <div>
        <h3 className="text-sm font-semibold mb-3">Price Range</h3>
        <Slider
          value={priceRange}
          min={0}
          max={25000}
          step={500}
          onValueChange={(v) => setPriceRange(v)}
          onValueCommit={(v) => store.setFilters({ minPrice: v[0], maxPrice: v[1] })}
          className="mt-2"
        />
        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
          <span>{formatPrice(priceRange[0])}</span>
          <span>{formatPrice(priceRange[1])}</span>
        </div>
      </div>

      <Separator />

      <Button
        variant="outline"
        className="w-full"
        onClick={() => { store.resetFilters(); setPriceRange([0, 50000]); onClose?.(); }}
      >
        Clear All Filters
      </Button>
    </div>
  );
}
// ==================== CUSTOMERS ALSO VIEWED ====================

function CustomersAlsoViewed({ productId }: { productId: string }) {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const store = useStore();

  useEffect(() => {
    // Only fetch if we have a productId
    if (!productId) return;

    // Get up to 5 recent IDs, excluding the current one
    const recentIds = store.recentlyViewed.filter(id => id !== productId).slice(0, 5).join(',');

    fetch(`/api/customers-also-viewed?productId=${productId}&recentIds=${recentIds}`)
      .then(res => res.json())
      .then(data => {
        if (data.products) setRecommendations(data.products);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [productId, store.recentlyViewed]);

  if (loading || recommendations.length === 0) return null;

  return (
    <section className="mt-16 border-t pt-12">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif flex items-center gap-2">
            <span className="bg-foreground text-background w-8 h-8 rounded-full inline-flex items-center justify-center text-sm">✦</span>
            Customers Also Viewed
          </h2>
          <p className="text-muted-foreground mt-1">Based on your recent browsing session</p>
        </div>
      </div>

      {/* We use a scrollable flex container to simulate a carousel */}
      <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 sm:gap-6 pb-6 -mx-4 px-4 sm:mx-0 sm:px-0 hide-scrollbar">
        {recommendations.map((p, i) => (
          <div key={p.id} className="min-w-[280px] w-[280px] sm:min-w-[320px] sm:w-[320px] snap-start shrink-0">
            <ProductCard product={p} index={i} />
          </div>
        ))}
      </div>
    </section>
  );
}

// ==================== COMPLETE THE LOOK ====================

function CompleteTheLook({ productId, categoryId }: { productId: string; categoryId: string }) {
  const [complements, setComplements] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/complete-look?productId=${productId}&categoryId=${categoryId}`)
      .then(res => res.json())
      .then(data => {
        if (data.products) setComplements(data.products);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [productId, categoryId]);

  if (loading || complements.length === 0) return null;

  return (
    <section className="mt-16 border-t pt-12">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif flex items-center gap-2">
            <span className="bg-foreground text-background w-8 h-8 rounded-full inline-flex items-center justify-center text-sm">✦</span>
            Complete the Look
          </h2>
          <p className="text-muted-foreground mt-1">Perfect pieces to pair with this item</p>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {complements.slice(0, 4).map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </div>
    </section>
  );
}

// ==================== PRODUCT DETAIL VIEW ====================

function ProductDetailView() {
  const store = useStore();
  const { toast } = useToast();
  const { openSignIn } = useClerk();
  const { product, loading } = useProduct(store.selectedProductId);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');

  // State resets when product changes because parent uses key={selectedProductId}

  useEffect(() => {
    if (!product) return;
    fetch(`/api/recommendations?productId=${product.id}&category=${product.categoryId}`)
      .then((r) => r.json())
      .then((data) => setRecommendations(data.products || []))
      .catch(() => { });
  }, [product?.id, product?.categoryId]);

  // Track recently viewed
  useEffect(() => {
    if (product?.id) {
      store.addRecentlyViewed(product.id);
    }
  }, [product?.id]);

  if (loading) return <ProductDetailSkeleton />;
  if (!product) return <div className="py-20 text-center">Product not found</div>;

  let images = Array.from(new Set(parseImages(product.images)));
  if (images.length === 0) {
    images = ['/logo.svg', '/logo.svg'];
  } else if (images.length === 1) {
    images = [images[0], images[0]];
  } else if (images.length > 4) {
    images = images.slice(0, 4);
  }
  const discount = product.comparePrice ? getDiscountPercent(product.price, product.comparePrice) : 0;
  const isWishlisted = store.wishlist.includes(product.id);

  // Group variants by color
  const colors = [...new Set(product.variants.map((v) => v.color))];
  const sizes = [...new Set(product.variants.map((v) => v.size))];

  // Use first variant as default if not selected
  const effectiveColor = selectedColor || colors[0] || '';
  const effectiveSize = selectedSize || sizes[0] || '';
  const selectedVariant = product.variants.find(
    (v) => v.size === effectiveSize && v.color === effectiveColor
  );
  const stockStatus = selectedVariant
    ? selectedVariant.stock > 0
      ? `${selectedVariant.stock} left in stock`
      : 'Out of stock'
    : product.variants.some((v) => v.stock > 0)
      ? 'Select variant for stock'
      : 'Out of stock';

  const handleAddToCart = () => {
    if (product.variants.length > 0 && (!effectiveSize || !effectiveColor)) {
      toast({ title: 'Please select size and color', variant: 'destructive' });
      return;
    }
    if (selectedVariant && selectedVariant.stock <= 0) {
      toast({ title: 'Item is out of stock', variant: 'destructive' });
      return;
    }
    store.addToCart(product.id, selectedVariant?.id, quantity);
    store.setCartOpen(true);
    toast({ title: 'Added to cart!' });
  };

  const handleReviewSubmit = async () => {
    if (!store.user) {
      store.setAuthModalOpen(true);
      return;
    }
    try {
      await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: store.user.id,
          productId: product.id,
          rating: reviewRating,
          title: reviewTitle,
          comment: reviewComment,
        }),
      });
      toast({ title: 'Review submitted!' });
      setReviewTitle('');
      setReviewComment('');
    } catch {
      toast({ title: 'Failed to submit review', variant: 'destructive' });
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Button variant="ghost" className="mb-4" onClick={() => store.setView('shop')}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Shop
      </Button>
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <button onClick={() => store.setView('home')} className="hover:text-foreground transition-colors">Home</button>
        <ChevronRight className="h-3 w-3" />
        <button onClick={() => store.setView('shop')} className="hover:text-foreground transition-colors">Shop</button>
        <ChevronRight className="h-3 w-3" />
        <button
          onClick={() => { store.setFilters({ categoryId: product.categoryId }); store.setView('shop'); }}
          className="hover:text-foreground transition-colors"
        >
          {product.category.name}
        </button>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Images */}
        <div className="space-y-4">
          <motion.div
            key={selectedImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="aspect-[3/4] overflow-hidden rounded-2xl bg-muted"
          >
            <img
              src={images[selectedImage] || '/logo.svg'}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </motion.div>
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  className={`h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${i === selectedImage ? 'border-foreground' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  onClick={() => setSelectedImage(i)}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-6">
          <div>
            <p className="text-sm font-medium uppercase tracking-wider text-amber-500">{product.brand.name}</p>
            <h1 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight">{product.name}</h1>
            <div className="mt-3 flex items-center gap-3">
              <StarRating rating={product.rating} size={18} />
              <span className="text-sm text-muted-foreground">
                {product.rating.toFixed(1)} ({product.reviewCount} reviews)
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
            {product.comparePrice && (
              <>
                <span className="text-lg text-muted-foreground line-through">{formatPrice(product.comparePrice)}</span>
                <Badge className="bg-red-500 text-white">{discount}% OFF</Badge>
              </>
            )}
          </div>
          <p className="text-sm text-muted-foreground">Tax included. Shipping calculated at checkout.</p>

          <Separator />

          {/* Color Selection */}
          <div>
            <p className="text-sm font-semibold mb-3">
              Color: <span className="font-normal text-muted-foreground">{effectiveColor || 'Select'}</span>
            </p>
            <div className="flex gap-2">
              {colors.map((color) => {
                const variant = product.variants.find((v) => v.color === color);
                return (
                  <button
                    key={color}
                    className={`h-10 w-10 rounded-full border-2 transition-all ${effectiveColor === color ? 'border-foreground scale-110' : 'border-muted hover:border-foreground/30'
                      }`}
                    style={{ backgroundColor: variant?.colorHex || color }}
                    onClick={() => setSelectedColor(color)}
                    title={color}
                  />
                );
              })}
            </div>
          </div>

          {/* Size Selection */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold">
                Size: <span className="font-normal text-muted-foreground">{effectiveSize || 'Select'}</span>
              </p>
              <button className="text-xs text-muted-underline underline text-muted-foreground hover:text-foreground">
                Size Guide
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => {
                const hasStock = product.variants.some(
                  (v) => v.size === size && v.color === (effectiveColor || v.color) && v.stock > 0
                );
                return (
                  <button
                    key={size}
                    disabled={!hasStock}
                    className={`flex h-10 min-w-[2.5rem] items-center justify-center rounded-lg border px-3 text-sm font-medium transition-all ${effectiveSize === size
                      ? 'border-foreground bg-foreground text-background'
                      : hasStock
                        ? 'border-border hover:border-foreground/50'
                        : 'border-muted bg-muted/50 text-muted-foreground line-through cursor-not-allowed'
                      }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stock Status */}
          <div className="flex items-center gap-2">
            {selectedVariant?.stock > 0 ? (
              <Check className="h-4 w-4 text-emerald-500" />
            ) : (
              <AlertCircle className="h-4 w-4 text-amber-500" />
            )}
            <span className={`text-sm ${selectedVariant?.stock > 0 ? 'text-emerald-600' : 'text-amber-600'}`}>
              {stockStatus}
            </span>
          </div>

          {/* Quantity + Add to Cart */}
          <div className="flex gap-3">
            <div className="flex items-center rounded-lg border">
              <Button variant="ghost" size="icon" className="h-10 w-10" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-10 text-center text-sm font-medium">{quantity}</span>
              <Button variant="ghost" size="icon" className="h-10 w-10" onClick={() => setQuantity(quantity + 1)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <Button
              className="flex-1 bg-foreground text-background hover:bg-foreground/90 h-12 text-base font-semibold"
              onClick={handleAddToCart}
            >
              <ShoppingBag className="mr-2 h-4 w-4" /> Add to Cart
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 shrink-0"
              onClick={() => {
                store.toggleWishlist(product.id);
                toast({ title: isWishlisted ? 'Removed from wishlist' : 'Added to wishlist', duration: 1500 });
              }}
            >
              <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
          </div>

          <Separator />

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: Truck, label: 'Free Shipping' },
              { icon: RefreshCw, label: 'Easy Returns' },
              { icon: Shield, label: 'Secure Pay' },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-1.5 text-center">
                <item.icon className="h-5 w-5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{item.label}</span>
              </div>
            ))}
          </div>

          <Separator />

          {/* Tabs: Description / Reviews */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full">
              <TabsTrigger value="description" className="flex-1">Description</TabsTrigger>
              <TabsTrigger value="reviews" className="flex-1">Reviews ({product.reviewCount})</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {product.description || 'No description available.'}
              </p>
            </TabsContent>
            <TabsContent value="reviews" className="mt-4">
              <div className="space-y-4">
                {/* Review summary */}
                <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                  <div className="text-center">
                    <p className="text-3xl font-bold">{product.rating.toFixed(1)}</p>
                    <StarRating rating={product.rating} size={14} />
                    <p className="text-xs text-muted-foreground mt-1">{product.reviewCount} reviews</p>
                  </div>
                </div>

                {/* Existing reviews */}
                {product.reviews && product.reviews.length > 0 ? (
                  product.reviews.map((review) => (
                    <div key={review.id} className="border-b pb-4">
                      <div className="flex items-center gap-2">
                        <StarRating rating={review.rating} size={12} />
                        {review.title && <span className="text-sm font-medium">{review.title}</span>}
                      </div>
                      {review.comment && <p className="mt-1 text-sm text-muted-foreground">{review.comment}</p>}
                      <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{review.user?.name || 'Anonymous'}</span>
                        <span>·</span>
                        <span>{getRelativeTime(review.createdAt)}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No reviews yet. Be the first to review!</p>
                )}

                {/* Write review */}
                <div className="mt-6 rounded-lg border p-4 space-y-3">
                  <h4 className="text-sm font-semibold">Write a Review</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Rating:</span>
                    <StarRating rating={reviewRating} size={20} interactive onChange={setReviewRating} />
                  </div>
                  <Input
                    placeholder="Review title"
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                  />
                  <Textarea
                    placeholder="Share your experience..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                  />
                  <Button size="sm" onClick={handleReviewSubmit}>Submit Review</Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Complete the Look */}
      <CompleteTheLook productId={product.id} categoryId={product.categoryId} />

      {/* Customers Also Viewed Carousel */}
      <CustomersAlsoViewed productId={product.id} />

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <section className="mt-16 border-t pt-12">
          <div className="flex items-center gap-2 mb-8">
            <Sparkles className="h-5 w-5 text-amber-500" />
            <h2 className="text-xl sm:text-2xl font-bold">You Might Also Like</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {recommendations.slice(0, 4).map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// ==================== CART DRAWER ====================

function CartDrawer() {
  const store = useStore();
  const { toast } = useToast();
  const [cartProducts, setCartProducts] = useState<Map<string, Product>>(new Map());
  const [loading, setLoading] = useState(false);

  // Fetch product details for cart items
  const cartKey = store.cart.map((i) => i.productId).join(',');
  useEffect(() => {
    if (store.cart.length === 0) return;
    Promise.all(
      store.cart.map((item) =>
        fetch(`/api/products/${item.productId}`)
          .then((r) => r.ok ? r.json() : null)
          .then((p) => p && !p.error ? [item.productId, p] as [string, Product] : null)
          .catch(() => null)
      )
    ).then((results) => {
      const map = new Map<string, Product>();
      results.forEach((r) => { if (r) map.set(r[0], r[1]); });
      setCartProducts(map);
      setLoading(false);
    });
  }, [cartKey]);

  const cartTotal = store.cart.reduce((sum, item) => {
    const product = cartProducts.get(item.productId);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  const cartSavings = store.cart.reduce((sum, item) => {
    const product = cartProducts.get(item.productId);
    return sum + (product?.comparePrice ? (product.comparePrice - product.price) * item.quantity : 0);
  }, 0);

  return (
    <Sheet open={store.cartOpen} onOpenChange={store.setCartOpen}>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0">
        <SheetHeader className="p-6 pb-4 border-b">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Shopping Bag
            <Badge variant="secondary" className="ml-1">
              {store.cart.reduce((sum, i) => sum + i.quantity, 0)}
            </Badge>
          </SheetTitle>
        </SheetHeader>

        {store.cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6">
            <ShoppingBag className="h-16 w-16 text-muted-foreground/30 mb-4" />
            <p className="text-lg font-medium">Your bag is empty</p>
            <p className="text-sm text-muted-foreground mt-1">Add items to get started</p>
            <Button className="mt-6 bg-foreground text-background" onClick={() => { store.setView('shop'); store.setCartOpen(false); }}>
              Shop Now
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1">
              <div className="p-6 space-y-4">
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex gap-4">
                      <Skeleton className="h-24 w-20 rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                        <Skeleton className="h-8 w-24" />
                      </div>
                    </div>
                  ))
                ) : (
                  store.cart.map((item) => {
                    const product = cartProducts.get(item.productId);
                    if (!product) return null;
                    const images = parseImages(product.images);
                    return (
                      <motion.div
                        key={`${item.productId}-${item.variantId}`}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex gap-4"
                      >
                        <div className="h-24 w-20 shrink-0 overflow-hidden rounded-lg bg-muted">
                          <img src={images[0] || '/logo.svg'} alt={product.name} className="h-full w-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium line-clamp-1">{product.name}</p>
                          <p className="text-xs text-muted-foreground">{product.brand.name}</p>
                          <div className="mt-1 flex items-center gap-2">
                            <span className="text-sm font-bold">{formatPrice(product.price)}</span>
                            {product.comparePrice && (
                              <span className="text-xs text-muted-foreground line-through">
                                {formatPrice(product.comparePrice)}
                              </span>
                            )}
                          </div>
                          <div className="mt-2 flex items-center justify-between">
                            <div className="flex items-center rounded-md border">
                              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => store.updateCartQuantity(item.productId, item.variantId, item.quantity - 1)}>
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-6 text-center text-xs font-medium">{item.quantity}</span>
                              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => store.updateCartQuantity(item.productId, item.variantId, item.quantity + 1)}>
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-muted-foreground hover:text-destructive"
                              onClick={() => store.removeFromCart(item.productId, item.variantId)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </ScrollArea>

            {/* Cart footer */}
            <div className="border-t p-6 space-y-4">
              {cartSavings > 0 && (
                <div className="flex items-center gap-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 p-3">
                  <BadgePercent className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm text-emerald-700 dark:text-emerald-400 font-medium">
                    You save {formatPrice(cartSavings)}!
                  </span>
                </div>
              )}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-emerald-600 font-medium">{cartTotal >= 999 ? 'FREE' : formatPrice(99)}</span>
                </div>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="font-semibold">Total</span>
                <span className="text-lg font-bold">{formatPrice(cartTotal + (cartTotal >= 999 ? 0 : 99))}</span>
              </div>
              <Button
                className="w-full bg-foreground text-background hover:bg-foreground/90 h-12 text-base font-semibold"
                onClick={() => { store.setView('checkout'); store.setCartOpen(false); }}
              >
                Proceed to Checkout
              </Button>
              <Button variant="ghost" className="w-full text-sm" onClick={() => { store.setView('shop'); store.setCartOpen(false); }}>
                Continue Shopping
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

// ==================== CHECKOUT VIEW ====================

function CheckoutView() {
  const store = useStore();
  const { toast } = useToast();
  const { openSignIn } = useClerk();
  const [step, setStep] = useState(1);
  const [cartProducts, setCartProducts] = useState<Map<string, Product>>(new Map());
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [placing, setPlacing] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    name: store.user?.name || '',
    phone: store.user?.phone || '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  const checkoutCartKey = store.cart.map((i) => i.productId).join(',');
  useEffect(() => {
    if (store.cart.length === 0) return;
    Promise.all(
      store.cart.map((item) =>
        fetch(`/api/products/${item.productId}`)
          .then((r) => r.ok ? r.json() : null)
          .then((p) => p && !p.error ? [item.productId, p] as [string, Product] : null)
          .catch(() => null)
      )
    ).then((results) => {
      const map = new Map<string, Product>();
      results.forEach((r) => { if (r) map.set(r[0], r[1]); });
      setCartProducts(map);
    });
  }, [checkoutCartKey]);

  const subtotal = store.cart.reduce((sum, item) => {
    const product = cartProducts.get(item.productId);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);
  const shipping = subtotal >= 999 ? 0 : 99;
  const tax = 0;
  const total = subtotal + shipping - couponDiscount;

  const handleApplyCoupon = async () => {
    setCouponError('');
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode, cartTotal: subtotal }),
      });
      const data = await res.json();
      if (data.valid) {
        setCouponDiscount(data.discount);
        toast({ title: `Coupon applied! You save ${formatPrice(data.discount)}` });
      } else {
        setCouponError(data.error || 'Invalid coupon');
        setCouponDiscount(0);
      }
    } catch {
      setCouponError('Failed to validate coupon');
    }
  };

  const handlePlaceOrder = async () => {
    if (!store.user) {
      openSignIn();
      return;
    }
    if (!shippingInfo.name || !shippingInfo.phone || !shippingInfo.address || !shippingInfo.city || !shippingInfo.state || !shippingInfo.pincode) {
      toast({ title: 'Please fill all shipping details', variant: 'destructive' });
      return;
    }
    setPlacing(true);
    try {
      const items = store.cart.map((item) => ({
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
        price: cartProducts.get(item.productId)?.price || 0,
      }));
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: store.user.id,
          items,
          shippingName: shippingInfo.name,
          shippingPhone: shippingInfo.phone,
          shippingAddress: shippingInfo.address,
          shippingCity: shippingInfo.city,
          shippingState: shippingInfo.state,
          shippingPincode: shippingInfo.pincode,
          couponCode: couponCode || undefined,
          paymentMethod: 'razorpay',
          paymentId: `pay_demo_${Date.now()}`,
        }),
      });
      const data = await res.json();
      if (data.order) {
        setOrderId(data.order.id);
        store.clearCart();
        setOrderPlaced(true);
        toast({ title: 'Order placed successfully!' });
      } else {
        toast({ title: data.error || 'Failed to place order', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Failed to place order', variant: 'destructive' });
    } finally {
      setPlacing(false);
    }
  };

  if (store.cart.length === 0 && !orderPlaced) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground/30 mb-4" />
        <p className="text-xl font-medium">Your cart is empty</p>
        <Button className="mt-6 bg-foreground text-background" onClick={() => store.setView('shop')}>
          Shop Now
        </Button>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mx-auto max-w-2xl px-4 py-20 text-center"
      >
        <div className="flex h-20 w-20 mx-auto items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
          <Check className="h-10 w-10 text-emerald-600" />
        </div>
        <h1 className="mt-6 text-3xl font-bold">Order Confirmed!</h1>
        <p className="mt-2 text-muted-foreground">Your order has been placed successfully</p>
        <div className="mt-6 rounded-lg border p-4 text-left space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Order ID</span>
            <span className="font-mono text-xs">{orderId}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total</span>
            <span className="font-bold">{formatPrice(total)}</span>
          </div>
        </div>
        <div className="mt-8 flex gap-4 justify-center">
          <Button className="bg-foreground text-background" onClick={() => store.setView('orders')}>
            View Orders
          </Button>
          <Button variant="outline" onClick={() => store.setView('shop')}>
            Continue Shopping
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
      <Button variant="ghost" className="mb-4" onClick={() => store.setView('shop')}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Shop
      </Button>
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-8">Checkout</h1>

      {/* Progress */}
      <div className="mb-8 flex items-center gap-2">
        {['Shipping', 'Payment', 'Confirmation'].map((s, i) => (
          <React.Fragment key={s}>
            <div className={`flex items-center gap-2 ${step >= i + 1 ? 'text-foreground' : 'text-muted-foreground'}`}>
              <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${step >= i + 1 ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground'
                }`}>
                {step > i + 1 ? <Check className="h-3 w-3" /> : i + 1}
              </div>
              <span className="text-sm font-medium hidden sm:inline">{s}</span>
            </div>
            {i < 2 && <div className={`flex-1 h-0.5 ${step > i + 1 ? 'bg-foreground' : 'bg-muted'}`} />}
          </React.Fragment>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Form */}
        <div className="lg:col-span-3 space-y-6">
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <h2 className="text-lg font-semibold">Shipping Address</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input value={shippingInfo.name} onChange={(e) => setShippingInfo({ ...shippingInfo, name: e.target.value })} placeholder="Enter your name" />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input value={shippingInfo.phone} onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })} placeholder="+91 XXXXXXXXXX" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Input value={shippingInfo.address} onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })} placeholder="Street address" />
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>City</Label>
                  <Input value={shippingInfo.city} onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })} placeholder="City" />
                </div>
                <div className="space-y-2">
                  <Label>State</Label>
                  <Input value={shippingInfo.state} onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })} placeholder="State" />
                </div>
                <div className="space-y-2">
                  <Label>Pincode</Label>
                  <Input value={shippingInfo.pincode} onChange={(e) => setShippingInfo({ ...shippingInfo, pincode: e.target.value })} placeholder="Pincode" />
                </div>
              </div>
              <Button className="w-full bg-foreground text-background hover:bg-foreground/90" onClick={() => setStep(2)}>
                Continue to Payment <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <h2 className="text-lg font-semibold">Payment Method</h2>
              <div className="rounded-xl border p-6 space-y-4">
                <div className="flex items-center gap-3 p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-500">
                  <CreditCard className="h-5 w-5 text-amber-600" />
                  <div>
                    <p className="text-sm font-semibold">Razorpay (Demo)</p>
                    <p className="text-xs text-muted-foreground">UPI, Cards, Net Banking, Wallets</p>
                  </div>
                  <Check className="ml-auto h-5 w-5 text-amber-600" />
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  This is a demo. No real payment will be processed.
                </p>
              </div>

              {/* Coupon */}
              <div className="space-y-2">
                <Label>Coupon Code</Label>
                <div className="flex gap-2">
                  <Input
                    value={couponCode}
                    onChange={(e) => { setCouponCode(e.target.value.toUpperCase()); setCouponError(''); }}
                    placeholder="Enter coupon code"
                    className="uppercase"
                  />
                  <Button variant="outline" onClick={handleApplyCoupon} disabled={!couponCode}>
                    Apply
                  </Button>
                </div>
                {couponError && <p className="text-xs text-destructive">{couponError}</p>}
                {couponDiscount > 0 && (
                  <p className="text-xs text-emerald-600 flex items-center gap-1">
                    <Check className="h-3 w-3" /> Coupon applied! Save {formatPrice(couponDiscount)}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">Try: WELCOME10, FASHION20, SUMMER15</p>
              </div>

              <div className="flex gap-4">
                <Button variant="outline" onClick={() => setStep(1)}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button
                  className="flex-1 bg-foreground text-background hover:bg-foreground/90"
                  onClick={handlePlaceOrder}
                  disabled={placing}
                >
                  {placing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CreditCard className="mr-2 h-4 w-4" />}
                  Place Order · {formatPrice(total)}
                </Button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-2">
          <div className="sticky top-24 rounded-xl border bg-card p-6 space-y-4">
            <h3 className="font-semibold">Order Summary</h3>
            <ScrollArea className="max-h-64">
              <div className="space-y-3">
                {store.cart.map((item) => {
                  const product = cartProducts.get(item.productId);
                  if (!product) return null;
                  const images = parseImages(product.images);
                  return (
                    <div key={`${item.productId}-${item.variantId}`} className="flex gap-3">
                      <div className="h-14 w-12 shrink-0 rounded-md bg-muted overflow-hidden relative">
                        <img src={images[0]} alt="" className="h-full w-full object-cover" />
                        <Badge className="absolute -right-1 -top-1 h-4 w-4 flex items-center justify-center rounded-full bg-foreground text-[9px] text-background p-0">
                          {item.quantity}
                        </Badge>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium line-clamp-1">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.brand.name}</p>
                      </div>
                      <span className="text-xs font-medium">{formatPrice(product.price * item.quantity)}</span>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
            <Separator />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className={shipping === 0 ? 'text-emerald-600' : ''}>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
              </div>

              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Coupon Discount</span>
                  <span>-{formatPrice(couponDiscount)}</span>
                </div>
              )}
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== WISHLIST VIEW ====================

function WishlistView() {
  const store = useStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const wishlistKey = store.wishlist.join(',');

  useEffect(() => {
    if (store.wishlist.length === 0) return;
    Promise.all(
      store.wishlist.map((id) =>
        fetch(`/api/products/${id}`).then((r) => r.json()).catch(() => null)
      )
    ).then((results) => {
      setProducts(results.filter(Boolean));
      setLoading(false);
    });
  }, [wishlistKey]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Button variant="ghost" className="mb-4" onClick={() => store.setView('shop')}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Shop
      </Button>
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-8">
        Wishlist <span className="text-muted-foreground font-normal text-lg">({store.wishlist.length})</span>
      </h1>
      {loading ? (
        <ProductGridSkeleton />
      ) : products.length === 0 ? (
        <div className="py-20 text-center">
          <Heart className="mx-auto h-16 w-16 text-muted-foreground/30 mb-4" />
          <p className="text-xl font-medium">Your wishlist is empty</p>
          <p className="text-sm text-muted-foreground mt-1">Save items you love for later</p>
          <Button className="mt-6 bg-foreground text-background" onClick={() => store.setView('shop')}>
            Discover Products
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}

// ==================== DASHBOARD VIEW ====================

function DashboardView() {
  const store = useStore();
  const { orders, loading: ordersLoading } = useOrders(store.user?.id || null);

  if (!store.user) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <User className="mx-auto h-16 w-16 text-muted-foreground/30 mb-4" />
        <p className="text-xl font-medium">Sign in to access your dashboard</p>
        <Button className="mt-6 bg-foreground text-background" onClick={() => store.setAuthModalOpen(true)}>
          Sign In
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Button variant="ghost" className="mb-4" onClick={() => store.setView('shop')}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Shop
      </Button>
      <div className="flex items-center gap-4 mb-8">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-foreground text-xl font-bold text-background">
          {(store.user.name || 'U')[0].toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{store.user.name || 'User'}</h1>
          <p className="text-sm text-muted-foreground">{store.user.email}</p>
        </div>
      </div>

      <Tabs defaultValue="orders">
        <TabsList>
          <TabsTrigger value="orders"><Package className="mr-1 h-4 w-4" /> Orders</TabsTrigger>
          <TabsTrigger value="wishlist"><Heart className="mr-1 h-4 w-4" /> Wishlist</TabsTrigger>
          <TabsTrigger value="settings"><Settings className="mr-1 h-4 w-4" /> Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="orders" className="mt-6">
          {ordersLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-32 w-full rounded-xl" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="py-16 text-center">
              <Package className="mx-auto h-12 w-12 text-muted-foreground/30 mb-4" />
              <p className="text-lg font-medium">No orders yet</p>
              <Button className="mt-4" onClick={() => store.setView('shop')}>Start Shopping</Button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="rounded-xl border p-4 sm:p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Order #{order.id.slice(-8).toUpperCase()}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                    <Badge className={STATUS_COLORS[order.status] || ''}>{order.status}</Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <span className="text-muted-foreground">{order.orderItems?.length || 0} items</span>
                    <span className="font-bold">{formatPrice(order.finalAmount)}</span>
                  </div>
                  {/* Order status tracker */}
                  <div className="mt-4 flex items-center gap-1">
                    {['pending', 'confirmed', 'shipped', 'delivered'].map((s, i, arr) => (
                      <React.Fragment key={s}>
                        <div className={`h-2 w-2 rounded-full ${arr.indexOf(order.status) >= i ? 'bg-amber-500' : 'bg-muted'
                          }`} />
                        {i < arr.length - 1 && (
                          <div className={`h-0.5 flex-1 ${arr.indexOf(order.status) > i ? 'bg-amber-500' : 'bg-muted'}`} />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="wishlist" className="mt-6">
          <WishlistView />
        </TabsContent>
        <TabsContent value="settings" className="mt-6">
          <div className="max-w-lg space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold">Profile</h3>
              <div className="space-y-2">
                <Label>Name</Label>
                <Input defaultValue={store.user.name || ''} />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input defaultValue={store.user.email} disabled />
              </div>
              <Button variant="outline">Save Changes</Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ==================== ADMIN PANEL ====================

function AdminPanel() {
  const store = useStore();
  const { toast } = useToast();
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0, users: 0 });
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch stats
    Promise.all([
      fetch('/api/products?limit=1').then((r) => r.json()),
      fetch('/api/orders').then((r) => r.json()),
    ]).then(([prodData, orderData]) => {
      setStats({
        products: prodData.pagination?.total || 0,
        orders: Array.isArray(orderData) ? orderData.length : (orderData.orders?.length || 0),
        revenue: 0,
        users: 0,
      });
      setAllOrders(Array.isArray(orderData) ? orderData : (orderData.orders || []));
      setProducts(prodData.products || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (!store.user || store.user.role !== 'admin') {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <Shield className="mx-auto h-16 w-16 text-muted-foreground/30 mb-4" />
        <p className="text-xl font-medium">Admin access required</p>
        <p className="text-sm text-muted-foreground mt-1">Sign in as admin to access this panel</p>
        <Button className="mt-6" onClick={() => store.setAuthModalOpen(true)}>Sign In as Admin</Button>
      </div>
    );
  }

  const statCards = [
    { icon: Grid3X3, label: 'Products', value: stats.products, color: 'text-amber-600' },
    { icon: Package, label: 'Orders', value: stats.orders, color: 'text-emerald-600' },
    { icon: CreditCard, label: 'Revenue', value: formatPrice(142500), color: 'text-blue-600' },
    { icon: Users, label: 'Customers', value: 24, color: 'text-purple-600' },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Button variant="ghost" className="mb-4" onClick={() => store.setView('shop')}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Shop
      </Button>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your store</p>
        </div>
        <Badge variant="outline" className="text-amber-600 border-amber-500/30">Admin</Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-muted ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="orders">
        <TabsList>
          <TabsTrigger value="orders"><Package className="mr-1 h-4 w-4" /> Orders</TabsTrigger>
          <TabsTrigger value="products"><Grid3X3 className="mr-1 h-4 w-4" /> Products</TabsTrigger>
          <TabsTrigger value="analytics"><BarChart3 className="mr-1 h-4 w-4" /> Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="mt-6">
          <div className="rounded-xl border">
            <ScrollArea className="max-h-[500px]">
              <table className="w-full text-sm">
                <thead className="border-b bg-muted/50">
                  <tr>
                    <th className="p-3 text-left font-medium">Order ID</th>
                    <th className="p-3 text-left font-medium">Status</th>
                    <th className="p-3 text-left font-medium">Total</th>
                    <th className="p-3 text-left font-medium">Date</th>
                    <th className="p-3 text-left font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {allOrders.map((order) => (
                    <tr key={order.id} className="border-b last:border-0">
                      <td className="p-3 font-mono text-xs">#{order.id.slice(-8).toUpperCase()}</td>
                      <td className="p-3">
                        <Badge className={STATUS_COLORS[order.status] || ''}>{order.status}</Badge>
                      </td>
                      <td className="p-3 font-medium">{formatPrice(order.finalAmount)}</td>
                      <td className="p-3 text-muted-foreground text-xs">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-3">
                        <Select
                          value={order.status}
                          onValueChange={async (status) => {
                            try {
                              await fetch(`/api/orders/${order.id}`, {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ status }),
                              });
                              toast({ title: `Order status updated to ${status}` });
                              setAllOrders((prev) =>
                                prev.map((o) => (o.id === order.id ? { ...o, status: status as Order['status'] } : o))
                              );
                            } catch {
                              toast({ title: 'Failed to update', variant: 'destructive' });
                            }
                          }}
                        >
                          <SelectTrigger className="h-8 w-[120px] text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </ScrollArea>
          </div>
        </TabsContent>

        <TabsContent value="products" className="mt-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Revenue Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <RevenueChart />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Top Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <CategoryChart />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ==================== CHARTS ====================

function RevenueChart() {
  const [ChartComponent, setChartComponent] = useState<React.ComponentType<any> | null>(null);

  useEffect(() => {
    import('recharts').then((mod) => {
      const Component = ({ data }: { data: { name: string; revenue: number; orders: number }[] }) => (
        <mod.ResponsiveContainer width="100%" height={250}>
          <mod.AreaChart data={data}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <mod.XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
            <mod.YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
            <mod.Tooltip />
            <mod.Area type="monotone" dataKey="revenue" stroke="#f59e0b" fill="url(#colorRevenue)" strokeWidth={2} />
          </mod.AreaChart>
        </mod.ResponsiveContainer>
      );
      setChartComponent(() => Component);
    });
  }, []);

  if (!ChartComponent) return <Skeleton className="h-[250px] w-full" />;

  const data = [
    { name: 'Jan', revenue: 18000, orders: 24 },
    { name: 'Feb', revenue: 22000, orders: 31 },
    { name: 'Mar', revenue: 19000, orders: 27 },
    { name: 'Apr', revenue: 28000, orders: 42 },
    { name: 'May', revenue: 32000, orders: 48 },
    { name: 'Jun', revenue: 35000, orders: 53 },
  ];

  return <ChartComponent data={data} />;
}

function CategoryChart() {
  const [ChartComponent, setChartComponent] = useState<React.ComponentType<any> | null>(null);

  useEffect(() => {
    import('recharts').then((mod) => {
      const Component = ({ data }: { data: { name: string; value: number; fill: string }[] }) => (
        <mod.ResponsiveContainer width="100%" height={250}>
          <mod.BarChart data={data}>
            <mod.XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
            <mod.YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
            <mod.Tooltip />
            <mod.Bar dataKey="value" radius={[6, 6, 0, 0]} />
          </mod.BarChart>
        </mod.ResponsiveContainer>
      );
      setChartComponent(() => Component);
    });
  }, []);

  if (!ChartComponent) return <Skeleton className="h-[250px] w-full" />;

  const data = [
    { name: 'Men', value: 6, fill: '#1a1a1a' },
    { name: 'Women', value: 6, fill: '#f59e0b' },
    { name: 'Footwear', value: 7, fill: '#10b981' },
    { name: 'Sports', value: 4, fill: '#8b5cf6' },
    { name: 'Accessories', value: 4, fill: '#ec4899' },
    { name: 'Kids', value: 5, fill: '#06b6d4' },
  ];

  return <ChartComponent data={data} />;
}

// ==================== FOOTER ====================

function Footer() {
  const store = useStore();
  return (
    <footer className="border-t bg-muted/30 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 text-lg font-bold mb-4">
              <Gem className="h-5 w-5 text-amber-500" />
              LUXE
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Premium fashion from the world&apos;s most coveted brands. Curated style, delivered.
            </p>
            <div className="mt-4 flex gap-3">
              {[Instagram, Twitter, Facebook].map((Icon, i) => (
                <Button key={i} variant="ghost" size="icon" className="h-8 w-8">
                  <Icon className="h-4 w-4" />
                </Button>
              ))}
            </div>
          </div>
          {[
            {
              title: 'Shop',
              links: ['New Arrivals', 'Best Sellers', 'Sale', 'Collections'],
            },
            {
              title: 'Help',
              links: ['Shipping Info', 'Returns', 'Size Guide', 'Contact Us'],
            },
            {
              title: 'Company',
              links: ['About Us', 'Careers', 'Press', 'Sustainability'],
            },
          ].map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold mb-3">{col.title}</h3>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link}>
                    <button
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => store.setView('shop')}
                    >
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <Separator className="my-8" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© 2026 LUXE. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <button className="hover:text-foreground transition-colors">Privacy Policy</button>
            <button className="hover:text-foreground transition-colors">Terms of Service</button>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ==================== MOBILE NAV ====================

function MobileBottomNav() {
  const store = useStore();
  const isMobile = useIsMobile();
  if (!isMobile) return null;

  const navItems = [
    { icon: Home, label: 'Home', view: 'home' as const },
    { icon: Grid3X3, label: 'Shop', view: 'shop' as const },
    { icon: Heart, label: 'Wishlist', view: 'wishlist' as const },
    { icon: User, label: 'Account', view: 'dashboard' as const },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur-lg safe-area-bottom lg:hidden">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={`flex flex-col items-center gap-1 px-3 py-1 transition-colors ${store.currentView === item.view ? 'text-foreground' : 'text-muted-foreground'
              }`}
            onClick={() => store.setView(item.view)}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ==================== SKELETONS ====================

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="aspect-[3/4] rounded-xl" />
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/3" />
        </div>
      ))}
    </div>
  );
}

function ProductDetailSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        <div className="space-y-4">
          <Skeleton className="aspect-[3/4] rounded-2xl" />
          <div className="flex gap-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 w-20 rounded-lg" />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </div>
  );
}

// ==================== MAIN PAGE ====================

// Hook for dark mode that avoids sync setState in effects
function useDarkMode() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === 'undefined') return false;
    const saved = localStorage.getItem('luxe-dark-mode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = saved ? saved === 'true' : prefersDark;
    if (isDark) document.documentElement.classList.add('dark');
    return isDark;
  });

  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => {
      const next = !prev;
      localStorage.setItem('luxe-dark-mode', String(next));
      document.documentElement.classList.toggle('dark', next);
      return next;
    });
  }, []);

  return { darkMode, toggleDarkMode };
}

export default function FashionEcommerce() {
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [mounted, setMounted] = useState(false);
  const { user: clerkUser, isLoaded } = useUser();
  const store = useStore();

  // Use rAF to avoid sync setState in effect
  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  // Sync Clerk state with Zustand
  useEffect(() => {
    if (!isLoaded) return;
    if (clerkUser) {
      store.setUser({
        id: clerkUser.id,
        email: clerkUser.primaryEmailAddress?.emailAddress || '',
        name: clerkUser.fullName || clerkUser.username || 'User',
        avatar: clerkUser.imageUrl || null,
        phone: clerkUser.primaryPhoneNumber?.phoneNumber || null,
        role: (clerkUser.publicMetadata?.role as string) || 'user',
      });
    } else {
      store.setUser(null);
    }
  }, [clerkUser, isLoaded]);

  if (!mounted) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex items-center gap-2">
          <Gem className="h-6 w-6 text-amber-500 animate-pulse" />
          <span className="text-xl font-bold tracking-tighter">LUXE</span>
        </div>
      </div>
    );
  }

  const renderView = () => {
    switch (store.currentView) {
      case 'home':
        return (
          <>
            <HeroSection />
            <TrendingSection />
            <RecentlyViewedSection />
            <FeaturesBar />
            <NewArrivalsSection />
            <PromoBanner />
          </>
        );
      case 'shop':
        return <ShopView />;
      case 'product':
        return <ProductDetailView key={store.selectedProductId || 'product'} />;
      case 'wishlist':
        return <WishlistView />;
      case 'checkout':
        return <CheckoutView />;
      case 'dashboard':
      case 'orders':
        return <DashboardView />;
      case 'admin':
        return <AdminPanel />;
      default:
        return <ShopView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <main className="flex-1 pb-16 lg:pb-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={store.currentView + (store.selectedProductId || '')}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <CartDrawer />
      <SearchModal />
      <AuthModal />
      <MobileBottomNav />
    </div>
  );
}
