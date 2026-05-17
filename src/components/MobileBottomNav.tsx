import { Home, ShoppingBag, Users, UserCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

type MobileBottomNavProps = {
  currentView: string;
  onNavigate: (view: string) => void;
};

export function MobileBottomNav({ currentView, onNavigate }: MobileBottomNavProps) {
  const { t, dir } = useLanguage();
  const { user, isAuthenticated } = useAuth();

  const handleAccountClick = () => {
    if (!isAuthenticated) {
      onNavigate('login');
    } else {
      onNavigate(
        user?.user_type === 'admin' ? 'admin-dashboard' :
        user?.user_type === 'artisan' ? 'artisan-dashboard' : 'buyer-dashboard'
      );
    }
  };

  return (
    <div 
      className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-50 pb-safe"
      dir={dir}
    >
      <div className="flex justify-around items-center h-16">
        <button 
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${currentView === 'home' ? 'text-green-800' : 'text-gray-500 hover:text-green-700'}`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-bold">{t('home')}</span>
        </button>

        <button 
          onClick={() => onNavigate('products')}
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${currentView === 'products' ? 'text-green-800' : 'text-gray-500 hover:text-green-700'}`}
        >
          <ShoppingBag className="w-5 h-5" />
          <span className="text-[10px] font-bold">{t('products')}</span>
        </button>

        <button 
          onClick={() => onNavigate('artisans')}
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${currentView === 'artisans' ? 'text-green-800' : 'text-gray-500 hover:text-green-700'}`}
        >
          <Users className="w-5 h-5" />
          <span className="text-[10px] font-bold">{t('artisans')}</span>
        </button>

        <button 
          onClick={handleAccountClick}
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${['login', 'signup', 'profile', 'admin-dashboard', 'artisan-dashboard', 'buyer-dashboard'].includes(currentView) ? 'text-green-800' : 'text-gray-500 hover:text-green-700'}`}
        >
          <UserCircle className="w-5 h-5" />
          <span className="text-[10px] font-bold">{isAuthenticated ? t('profile') : t('log_in')}</span>
        </button>
      </div>
    </div>
  );
}
