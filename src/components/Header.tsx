import { useLanguage } from '../contexts/LanguageContext';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ShoppingCart, Menu, X, User as UserIcon, LogIn, UserPlus, LogOut, UserCircle } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { CartDrawer } from './CartDrawer';

export function Header({ onNavigate, currentView = 'home' }: { onNavigate?: (view: string) => void, currentView?: string }) {
  const { t, dir } = useLanguage();
  const { cart } = useCart();
  const { user, signOut, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);

  const cartItemsCount = cart.reduce((count, item) => count + item.quantity, 0);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setAccountMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNav = (e: React.MouseEvent, view: string) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(view);
    } else {
      window.location.href = `/${view === 'home' ? '' : view}`;
    }
    setMobileMenuOpen(false);
  };

  const handleCheckout = () => {
    setCartOpen(false);
    if (onNavigate) onNavigate('checkout');
  };

  return (
    <header className="sticky top-0 z-40 bg-white shadow-md" dir={dir}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/image.png" alt="Juthoor" className="h-14 w-14 rounded-full bg-white shadow-sm p-1" />
            <div>
              <h1 className="text-2xl font-bold text-green-900">{t('juthoor')}</h1>
              <p className="text-xs text-amber-600 font-semibold">{t('tagline')}</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a 
              href="/" 
              onClick={(e) => handleNav(e, 'home')}
              className={`${currentView === 'home' ? 'text-green-800 font-bold border-b-2 border-green-800' : 'text-gray-700 hover:text-green-700'} pb-1 font-medium transition`}
            >
              {t('home')}
            </a>
            <a 
              href="/products" 
              onClick={(e) => handleNav(e, 'products')}
              className={`${currentView === 'products' ? 'text-green-800 font-bold border-b-2 border-green-800' : 'text-gray-700 hover:text-green-700'} pb-1 font-medium transition`}
            >
              {t('products')}
            </a>
            <a 
              href="/artisans" 
              onClick={(e) => handleNav(e, 'artisans')}
              className={`${currentView === 'artisans' ? 'text-green-800 font-bold border-b-2 border-green-800' : 'text-gray-700 hover:text-green-700'} pb-1 font-medium transition`}
            >
              {t('artisans')}
            </a>
            <a 
              href="/insights" 
              onClick={(e) => handleNav(e, 'insights')}
              className={`${currentView === 'insights' || currentView === 'admin-dashboard' ? 'text-green-800 font-bold border-b-2 border-green-800' : 'text-gray-700 hover:text-green-700'} pb-1 font-medium transition`}
            >
              {t('insights')}
            </a>
          </nav>

          <div className="flex items-center gap-4">
            <LanguageSwitcher />

            {/* Account Dropdown */}
            <div className="relative" ref={accountMenuRef}>
              <button 
                onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                className={`p-2 rounded-full transition ${accountMenuOpen ? 'bg-green-100 text-green-900' : 'text-gray-700 hover:text-green-700'}`}
              >
                <UserIcon className="w-6 h-6" />
              </button>

              {accountMenuOpen && (
                <div className={`absolute top-full mt-2 ${dir === 'rtl' ? 'left-0' : 'right-0'} w-56 bg-white rounded-2xl shadow-xl border border-green-50 py-3 z-50 animate-fadeIn`}>
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-3 border-b mb-2">
                        <p className="text-xs text-gray-500 font-bold uppercase mb-1">{t('signed_in_as')}</p>
                        <p className="font-bold text-green-900 truncate">{user?.full_name}</p>
                      </div>
                      <button 
                        onClick={() => { 
                          setAccountMenuOpen(false); 
                          if(onNavigate) {
                            onNavigate(
                              user?.user_type === 'admin' ? 'admin-dashboard' :
                              user?.user_type === 'artisan' ? 'artisan-dashboard' : 'buyer-dashboard'
                            );
                          } 
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-green-50 transition font-medium"
                      >
                        <UserCircle className="w-5 h-5 text-green-700" />
                        {user?.user_type === 'admin' ? 'Admin Dashboard' :
                         user?.user_type === 'artisan' ? 'Artisan Dashboard' : 'My Dashboard'}
                      </button>
                      <button 
                        onClick={() => { setAccountMenuOpen(false); signOut(); }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition font-medium"
                      >
                        <LogOut className="w-5 h-5" />
                        {t('log_out')}
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        onClick={() => { setAccountMenuOpen(false); if(onNavigate) onNavigate('login'); }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-green-50 transition font-medium"
                      >
                        <LogIn className="w-5 h-5 text-green-700" />
                        {t('log_in')}
                      </button>
                      <button 
                        onClick={() => { setAccountMenuOpen(false); if(onNavigate) onNavigate('signup'); }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-green-50 transition font-medium"
                      >
                        <UserPlus className="w-5 h-5 text-green-700" />
                        {t('sign_up_action')}
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            <button 
              onClick={() => setCartOpen(true)}
              className="relative p-2 text-gray-700 hover:text-green-700 transition"
            >
              <ShoppingCart className="w-6 h-6" />
              <span className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartItemsCount}
              </span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-green-700"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        <CartDrawer 
          isOpen={cartOpen} 
          onClose={() => setCartOpen(false)} 
          onCheckout={handleCheckout}
        />

        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t pt-4 space-y-2">
            <a 
              href="/" 
              onClick={(e) => handleNav(e, 'home')}
              className={`block py-2 ${currentView === 'home' ? 'text-green-800 font-bold' : 'text-gray-700 hover:text-green-700 font-medium'}`}
            >
              {t('home')}
            </a>
            <a 
              href="/products" 
              onClick={(e) => handleNav(e, 'products')}
              className={`block py-2 ${currentView === 'products' ? 'text-green-800 font-bold' : 'text-gray-700 hover:text-green-700 font-medium'}`}
            >
              {t('products')}
            </a>
            <a 
              href="/artisans" 
              onClick={(e) => handleNav(e, 'artisans')}
              className={`block py-2 ${currentView === 'artisans' ? 'text-green-800 font-bold' : 'text-gray-700 hover:text-green-700 font-medium'}`}
            >
              {t('artisans')}
            </a>
            <a 
              href="/insights" 
              onClick={(e) => handleNav(e, 'insights')}
              className={`block py-2 ${currentView === 'insights' ? 'text-green-800 font-bold' : 'text-gray-700 hover:text-green-700 font-medium'}`}
            >
              {t('insights')}
            </a>
          </nav>
        )}
      </div>
    </header>
  );
}
