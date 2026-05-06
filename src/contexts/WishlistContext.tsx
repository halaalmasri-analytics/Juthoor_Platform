import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../lib/staticData';
import { useAuth } from './AuthContext';

type WishlistContextType = {
  wishlist: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<Product[]>([]);

  // Load wishlist for the specific user
  useEffect(() => {
    if (user) {
      const stored = localStorage.getItem(`wishlist_${user.id}`);
      if (stored) {
        setWishlist(JSON.parse(stored));
      } else {
        setWishlist([]);
      }
    } else {
      setWishlist([]);
    }
  }, [user]);

  const addToWishlist = (product: Product) => {
    if (!user) return;
    setWishlist(prev => {
      if (prev.some(p => p.id === product.id)) return prev;
      const updated = [...prev, product];
      localStorage.setItem(`wishlist_${user.id}`, JSON.stringify(updated));
      return updated;
    });
  };

  const removeFromWishlist = (productId: string) => {
    if (!user) return;
    setWishlist(prev => {
      const updated = prev.filter(p => p.id !== productId);
      localStorage.setItem(`wishlist_${user.id}`, JSON.stringify(updated));
      return updated;
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some(p => p.id === productId);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
