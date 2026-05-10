import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, PRODUCTS } from '../lib/staticData';

type ProductContextType = {
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'created_at' | 'average_rating' | 'total_reviews'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  loading: boolean;
};

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('juthoor_products');
    if (stored) {
      try {
        const parsed: Product[] = JSON.parse(stored);
        
        // 1. Identify mock products from storage that still exist in static data
        // and keep user-added products (which are also in storage)
        const storageMocks = parsed.filter(p => {
          const isStatic = PRODUCTS.some(sp => sp.id === p.id);
          return isStatic || p.id.includes('-'); // This keeps both static and user-added ones
        });

        // 2. Find any products in static data that are MISSING from storage
        const missingFromStorage = PRODUCTS.filter(sp => !parsed.some(p => p.id === sp.id));

        // 3. Combine them, ensuring static data takes precedence for base products
        const synced = [...storageMocks, ...missingFromStorage].map(p => {
          const staticProduct = PRODUCTS.find(sp => sp.id === p.id);
          if (staticProduct) {
            return { ...p, ...staticProduct }; // Update with latest info from staticData.ts
          }
          return p;
        });

        // 4. Remove duplicates (in case of overlap logic)
        const uniqueSynced = Array.from(new Map(synced.map(p => [p.id, p])).values());

        setProducts(uniqueSynced);
        localStorage.setItem('juthoor_products', JSON.stringify(uniqueSynced));
      } catch (e) {
        setProducts(PRODUCTS);
      }
    } else {
      setProducts(PRODUCTS);
      localStorage.setItem('juthoor_products', JSON.stringify(PRODUCTS));
    }
    setLoading(false);
  }, []);

  const saveProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    localStorage.setItem('juthoor_products', JSON.stringify(newProducts));
  };

  const addProduct = (productData: Omit<Product, 'id' | 'created_at' | 'average_rating' | 'total_reviews'>) => {
    const newProduct: Product = {
      ...productData,
      id: `product-${Date.now()}`,
      created_at: new Date().toISOString(),
      average_rating: 0,
      total_reviews: 0,
      product_status: 'active',
      authenticity_verified: false
    };
    saveProducts([newProduct, ...products]);
  };

  const updateProduct = (id: string, productData: Partial<Product>) => {
    const newProducts = products.map(p => p.id === id ? { ...p, ...productData } : p);
    saveProducts(newProducts);
  };

  const deleteProduct = (id: string) => {
    const newProducts = products.filter(p => p.id !== id);
    saveProducts(newProducts);
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct, loading }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}
