import React, { useCallback, useEffect, useMemo, useState, ReactNode } from 'react';
import { Product } from '../types';
import { api } from '../lib/api';
import { useAuth } from './AuthContext';
import { toast } from '@/components/ui/sonner';
import { CartContext } from './cartContextValue';
import { CartItem } from './cartTypes';

const CART_KEY = 'Cosmiq_cart';
const RECENT_KEY = 'Cosmiq_recently_viewed';

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user, token } = useAuth();

  const [items, setItems] = useState<CartItem[]>(() => {
    try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); } catch { return []; }
  });
  const [wishlist, setWishlist] = useState<string[]>(user?.wishlist || []);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>(() => {
    try { return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]'); } catch { return []; }
  });

  useEffect(() => { if (user?.wishlist) setWishlist(user.wishlist); else setWishlist([]); }, [user]);
  useEffect(() => { localStorage.setItem(CART_KEY, JSON.stringify(items)); }, [items]);
  useEffect(() => { localStorage.setItem(RECENT_KEY, JSON.stringify(recentlyViewed.slice(0, 10))); }, [recentlyViewed]);

  const addToCart = useCallback((product: Product, quantity = 1) => {
    const stock = Math.max(0, product.stock);
    const existing = items.find(i => i.product._id === product._id);
    const currentQuantity = existing?.quantity || 0;
    const nextQuantity = Math.min(stock, currentQuantity + quantity);
    const addedQuantity = nextQuantity - currentQuantity;

    if (stock === 0) {
      toast.error('Out of stock', {
        description: `${product.name} is currently unavailable.`,
      });
      return;
    }

    if (addedQuantity <= 0) {
      toast.error('Stock limit reached', {
        description: `Only ${stock} ${stock === 1 ? 'unit is' : 'units are'} available.`,
      });
      return;
    }

    setItems(prev => {
      if (existing) return prev.map(i => i.product._id === product._id ? { ...i, quantity: nextQuantity } : i);
      return [...prev, { product, quantity: addedQuantity }];
    });
    toast.success('Added to cart', {
      description: `${addedQuantity} x ${product.name} ${addedQuantity === 1 ? 'is' : 'are'} now in your bag.`,
      action: {
        label: 'View Cart',
        onClick: () => { window.location.href = '/cart'; },
      },
    });
  }, [items]);

  const removeFromCart = useCallback((productId: string) => {
    const item = items.find(i => i.product._id === productId);
    setItems(prev => prev.filter(i => i.product._id !== productId));
    if (item) {
      toast('Removed from cart', {
        description: `${item.product.name} was removed from your bag.`,
      });
    }
  }, [items]);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) return removeFromCart(productId);
    setItems(prev => prev.map(i => {
      if (i.product._id !== productId) return i;
      return { ...i, quantity: Math.min(quantity, Math.max(1, i.product.stock)) };
    }));
  }, [removeFromCart]);

  const clearCart = useCallback(() => setItems([]), []);

  const toggleWishlist = useCallback(async (productId: string) => {
    if (!token) {
      toast('Sign in required', {
        description: 'Please sign in to manage your wishlist.',
      });
      window.location.href = '/auth';
      return;
    }
    const wasWishlisted = wishlist.includes(productId);
    try {
      const res = await api.post<{ data: { wishlist: string[] } }>(`/auth/me/wishlist/${productId}`, {});
      setWishlist(res.data.wishlist);
      toast.success(wasWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
    } catch {
      setWishlist(prev => prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]);
      toast.success(wasWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
    }
  }, [token, wishlist]);

  const addToRecentlyViewed = useCallback((product: Product) => {
    setRecentlyViewed(prev => [product, ...prev.filter(p => p._id !== product._id)].slice(0, 10));
  }, []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const value = useMemo(
    () => ({
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice,
      wishlist,
      toggleWishlist,
      recentlyViewed,
      addToRecentlyViewed,
    }),
    [
      addToCart,
      addToRecentlyViewed,
      clearCart,
      items,
      recentlyViewed,
      removeFromCart,
      toggleWishlist,
      totalItems,
      totalPrice,
      updateQuantity,
      wishlist,
    ]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
