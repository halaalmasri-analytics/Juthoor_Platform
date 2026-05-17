import { useEffect, useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { useLanguage } from './contexts/LanguageContext';
import { useAuth } from './contexts/AuthContext';
import { useProducts } from './contexts/ProductContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Footer } from './components/Footer';
import { ArtisansPage } from './pages/ArtisansPage';
import { ProductsPage } from './pages/Products';
import { JuthoorProductCard } from './components/JuthoorProductCard';
import { ProductDetail } from './pages/ProductDetail';
import { Checkout } from './pages/Checkout';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { ArtisanDashboard } from './pages/ArtisanDashboard';
import { BuyerDashboard } from './pages/BuyerDashboard';
import { JuthoorInsights } from './pages/JuthoorInsights';
import { Product } from './lib/staticData';
import { Loader2, Leaf, Heart, Shield } from 'lucide-react';

type HomePageProps = {
  onProductClick: (id: string) => void;
  onNavigate?: (view: string) => void;
  currentView?: string;
};

function HomePage({ onProductClick, onNavigate, currentView }: HomePageProps) {
  const [displayProducts, setDisplayProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { t, dir } = useLanguage();
  const { products } = useProducts();

  useEffect(() => {
    loadProducts();
  }, [products]);

  async function loadProducts() {
    // Simulate a short network delay for realistic UX
    await new Promise((resolve) => setTimeout(resolve, 400));
    // Display all active mock products for this prototype
    const activeProducts = products.filter((p) => p.product_status === 'active');
    setDisplayProducts(activeProducts);
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-white" dir={dir}>
      <Header onNavigate={onNavigate} currentView={currentView} />
      <Hero onNavigate={onNavigate} />

      <section className="py-10 md:py-20 bg-gradient-to-b from-white to-green-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2 className={`text-3xl md:text-4xl font-bold text-green-900 mb-3 md:mb-4 text-center`}>
            {t('featured_products')}
          </h2>
          <p className="text-center text-gray-600 mb-8 md:mb-12 text-base md:text-lg">
            {t('discover_crafts')}
          </p>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-12 h-12 animate-spin text-green-900" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
              {displayProducts.slice(0, 3).map((product) => (
                <JuthoorProductCard 
                  key={product.id} 
                  product={product} 
                  onClick={() => onProductClick(product.id)}
                  onAuthRequired={() => onNavigate?.('login')}
                />
              ))}
            </div>
          )}

          {!loading && products.length === 0 && (
            <div className="text-center py-20">
              <p className="text-xl text-gray-600">No products available yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      <section className="py-10 md:py-20 bg-white" dir={dir}>
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-green-900 mb-8 md:mb-16">
            {t('why_juthoor')}
          </h2>

          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="bg-green-100 p-4 rounded-full">
                  <Leaf className="w-8 h-8 text-green-900" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-green-900 mb-3">
                {t('authentic_crafts')}
              </h3>
              <p className="text-gray-600">
                {t('authentic_crafts_desc')}
              </p>
            </div>

            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="bg-amber-100 p-4 rounded-full">
                  <Heart className="w-8 h-8 text-amber-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-green-900 mb-3">
                {t('fair_trade')}
              </h3>
              <p className="text-gray-600">
                {t('fair_trade_desc')}
              </p>
            </div>

            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="bg-green-100 p-4 rounded-full">
                  <Shield className="w-8 h-8 text-green-900" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-green-900 mb-3">
                {t('heritage_verified')}
              </h3>
              <p className="text-gray-600">
                {t('heritage_verified_desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

import { Chatbot } from './components/Chatbot';
import { AuthModal } from './components/AuthModal';
import { MobileBottomNav } from './components/MobileBottomNav';

function App() {
  const [currentView, setCurrentView] = useState<'home' | 'artisans' | 'products' | 'checkout' | 'login' | 'signup' | 'profile' | 'insights' | 'artisan-dashboard' | 'buyer-dashboard' | 'admin-dashboard'>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'signup'>('login');

  const handleNavigate = (view: string) => {
    if (view === 'login' || view === 'signup') {
      localStorage.setItem('redirectPath', currentView);
      setAuthModalTab(view as 'login' | 'signup');
      setIsAuthModalOpen(true);
      return;
    }
    setCurrentView(view as any);
    setSelectedProductId(null);
  };

  const handleAuthRequiredAction = (targetView: string) => {
    localStorage.setItem('redirectPath', targetView);
    setAuthModalTab('login');
    setIsAuthModalOpen(true);
  };

  const handleLoginSuccess = () => {
    const redirectPath = localStorage.getItem('redirectPath');
    
    if (redirectPath && redirectPath !== 'login' && redirectPath !== 'signup') {
      localStorage.removeItem('redirectPath');
      setCurrentView(redirectPath as any);
    } else {
      const stored = localStorage.getItem('juthoor_user');
      const currentUser = stored ? JSON.parse(stored) : null;
      if (currentUser?.user_type === 'admin') setCurrentView('admin-dashboard');
      else if (currentUser?.user_type === 'artisan') setCurrentView('artisan-dashboard');
      else setCurrentView('buyer-dashboard');
    }
  };

  return (
    <div className="pb-16 md:pb-0">
      <ViewContent 
        currentView={currentView} 
        selectedProductId={selectedProductId}
        onNavigate={handleNavigate}
        onSelectProduct={setSelectedProductId}
        onAuthRequired={handleAuthRequiredAction}
        onLoginSuccess={handleLoginSuccess}
      />
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => {
          setIsAuthModalOpen(false);
          handleNavigate('home');
          window.history.pushState({}, '', '/');
        }}
        initialTab={authModalTab}
        onSuccess={handleLoginSuccess}
      />
      <Chatbot />
      <MobileBottomNav currentView={currentView} onNavigate={handleNavigate} />
      <Analytics />
    </div>
  );
}

function ViewContent({ 
  currentView, 
  selectedProductId, 
  onNavigate, 
  onSelectProduct,
  onAuthRequired,
  onLoginSuccess
}: any) {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { products, loading: productsLoading } = useProducts();
  
  const selectedProduct = selectedProductId 
    ? products.find(p => p.id === selectedProductId) 
    : null;

  if (authLoading || productsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <Loader2 className="w-12 h-12 text-green-800 animate-spin" />
      </div>
    );
  }

  // Auth Guard for Checkout
  if (currentView === 'checkout' && !isAuthenticated) {
     onNavigate('login');
     return null;
  }

  if (selectedProduct) {
     return (
       <>
         <Header onNavigate={onNavigate} currentView={currentView} />
         <ProductDetail 
            product={selectedProduct} 
            onBack={() => onSelectProduct(null)} 
            onAuthRequired={() => onAuthRequired(currentView)}
         />
         <Footer />
       </>
    );
  }

  switch (currentView) {
    case 'login':
    case 'signup':
      onNavigate('home'); // Redirect to home if someone manually goes to /login or /signup
      return null;
    
    case 'artisan-dashboard':
      if (!isAuthenticated || !user || user.user_type !== 'artisan') {
        setTimeout(() => onNavigate('login'), 0);
        return null;
      }
      return <ArtisanDashboard onNavigate={onNavigate} />;

    case 'buyer-dashboard':
    case 'profile':
      if (!isAuthenticated || !user || user.user_type !== 'buyer') {
        setTimeout(() => onNavigate('login'), 0);
        return null;
      }
      return <BuyerDashboard onProductClick={onSelectProduct} onNavigate={onNavigate} />;

    case 'admin-dashboard':
    case 'insights':
      if (!isAuthenticated || !user || user.user_type !== 'admin') {
        setTimeout(() => onNavigate('login'), 0);
        return null;
      }
      return (
        <>
          <Header onNavigate={onNavigate} currentView="admin-dashboard" />
          <JuthoorInsights />
          <Footer />
        </>
      );

    case 'artisans':
      return (
        <>
          <Header onNavigate={onNavigate} currentView={currentView} />
          <ArtisansPage onProductClick={onSelectProduct} onAuthRequired={() => onAuthRequired(currentView)} />
          <Footer />
        </>
      );
    case 'products':
      return (
        <>
          <Header onNavigate={onNavigate} currentView={currentView} />
          <ProductsPage onProductClick={onSelectProduct} onAuthRequired={() => onAuthRequired(currentView)} />
          <Footer />
        </>
      );
    case 'checkout':
      return (
        <>
          <Header onNavigate={onNavigate} currentView={currentView} />
          <Checkout onBack={() => onNavigate('products')} />
          <Footer />
        </>
      );
    default:
      return <HomePage onProductClick={onSelectProduct} onNavigate={onNavigate} currentView={currentView} />;
  }
}

export default App;
