import { MapPin, Star, Award, Heart } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useAuth } from '../contexts/AuthContext';
import { Product } from '../lib/staticData';

type ProductCardProps = {
  product: Product;
  onClick?: () => void;
  onAuthRequired?: () => void;
};

export function JuthoorProductCard({ product, onClick, onAuthRequired }: ProductCardProps) {
  const { language, dir, t } = useLanguage();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      onAuthRequired && onAuthRequired();
      return;
    }
    
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const getName = () => {
    switch (language) {
      case 'ar':
        return product.name_ar;
      case 'fr':
        return product.name_fr;
      default:
        return product.name_en;
    }
  };

  const getDescription = () => {
    switch (language) {
      case 'ar':
        return product.description_ar;
      case 'fr':
        return product.description_fr;
      default:
        return product.description_en;
    }
  };

  const getStyle = () => {
    switch (language) {
      case 'ar':
        return product.style_ar;
      case 'fr':
        return product.style_fr;
      default:
        return product.style_en;
    }
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col cursor-pointer" 
      dir={dir}
      onClick={onClick}
    >
      <div className="relative h-56 bg-gray-200 overflow-hidden">
        <img
          src={product.image_url || 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&q=80'}
          alt={getName()}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          loading="lazy"
        />
        {(() => {
          const verifiedIds = JSON.parse(localStorage.getItem('juthoor_verified_artisans') || '[]');
          const isVerified = (product.artisans && verifiedIds.includes(product.artisans.id)) || 
                             (product.artisans?.verification_status === 'verified') || 
                             product.authenticity_verified;
          
          if (!isVerified) return null;
          
          return (
            <div className={`absolute top-4 ${dir === 'rtl' ? 'left-4' : 'right-4'} bg-green-800 text-white px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-bold shadow-md`}>
              <Award className="w-3.5 h-3.5 text-amber-300" />
              {t('heritage_certified') || 'Heritage Certified ✓'}
            </div>
          );
        })()}
        <div className={`absolute top-4 ${dir === 'rtl' ? 'right-4' : 'left-4'} bg-amber-600 text-white px-4 py-2 rounded-lg font-bold text-lg`}>
          ${product.price_usd}
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <h3 className={`text-xl font-bold text-green-900 mb-1 line-clamp-1 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
          {getName()}
        </h3>
        
        {getStyle() && (
          <span className={`inline-block text-[10px] uppercase tracking-wider font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full mb-2 w-fit ${dir === 'rtl' ? 'ml-auto' : 'mr-auto'}`}>
            {getStyle()}
          </span>
        )}

        <p className={`text-sm text-gray-600 mb-3 line-clamp-2 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
          {getDescription()}
        </p>

        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span className="font-semibold text-gray-800">{product.average_rating.toFixed(1)}</span>
          </div>
          <span className="text-sm text-gray-500">({product.total_reviews} {t('reviews')})</span>
        </div>

        {product.artisans && (
          <div className={`mb-4 pb-4 border-b ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
            <p className="text-xs text-gray-500 mb-1 uppercase tracking-tighter">{t('handmade_by')} <span className="font-bold text-green-800">{product.artisans.name}</span></p>
            <p className="text-sm font-semibold text-gray-700">{product.artisans.craft_specialty}</p>
            <div className="flex items-center gap-1 text-gray-600">
              <MapPin className="w-3.5 h-3.5" />
              <span className="text-xs">{product.artisans.region}</span>
            </div>
          </div>
        )}

        <div className="mt-auto space-y-3">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product);
            }}
            className="w-full bg-green-900 hover:bg-green-800 text-white py-3 rounded-lg font-semibold transition transform hover:scale-105"
          >
            {t('add_to_cart')}
          </button>
          <button 
            onClick={handleWishlistClick}
            className={`w-full border-2 py-2 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${isInWishlist(product.id) ? 'border-red-200 bg-red-50 text-red-600' : 'border-gray-300 hover:border-green-900 text-green-900'}`}
          >
            <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? 'fill-red-600' : ''}`} />
            {t('wishlist')}
          </button>
        </div>
      </div>
    </div>
  );
}
