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
        // Sync mock product images with the latest static data
        // AND remove any mock products that were deleted from staticData
        const synced = parsed.filter(p => {
          const isMock = p.id.startsWith('product-');
          if (isMock) {
            return PRODUCTS.some(sp => sp.id === p.id);
          }
          return true; // Keep artisan-added products
        }).map(p => {
          const staticProduct = PRODUCTS.find(sp => sp.id === p.id);
          if (staticProduct) {
            return { ...p, image_url: staticProduct.image_url };
          }
          return p;
        });
        setProducts(synced);
        localStorage.setItem('juthoor_products', JSON.stringify(synced));
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
