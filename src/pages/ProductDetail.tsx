import { ArrowLeft, MapPin, Star, Award, ShoppingCart, Heart, Check, View, ShieldCheck } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useAuth } from '../contexts/AuthContext';
import { Product } from '../lib/staticData';

export function ProductDetail({ product, onBack, onAuthRequired }: { product: Product; onBack: () => void, onAuthRequired: () => void }) {
  const { language, dir, t } = useLanguage();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  
  const handleWishlistClick = () => {
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
  
  const [activeVariantId, setActiveVariantId] = useState<string | null>(null);

  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    setScrollY(0); // Reset scroll tracking on product change
    if (product.variants && product.variants.length > 0) {
      setActiveVariantId(product.variants[0].id);
    } else {
      setActiveVariantId(null);
    }
  }, [product]);

  const activeVariant = product.variants?.find(v => v.id === activeVariantId);
  const displayPrice = activeVariant ? activeVariant.price_usd : product.price_usd;

  const rawImage = activeVariant ? activeVariant.image_url : (product.image_url || '');

  // Ensure there's a placeholder generator to label it clearly if the image isn't available yet
  const placeholderUrl = `https://placehold.co/800x800/e2e8f0/1e293b?text=${encodeURIComponent(product.name_en)}`;
  const displayImage = rawImage || placeholderUrl;

  const getName = () => {
    switch (language) {
      case 'ar':
        return product.name_ar;
      case 'fr':
        return product.name_fr || product.name_en; // fallback
      default:
        return product.name_en;
    }
  };

  const getVariantName = (v: any) => {
    return language === 'ar' && v.name_ar ? v.name_ar : v.name;
  };

  const getDescription = () => {
    switch (language) {
      case 'ar':
        return product.description_ar;
      case 'fr':
        return product.description_fr || product.description_en;
      default:
        return product.description_en;
    }
  };

  const getBio = () => {
    if (!product.artisans) return '';
    switch (language) {
      case 'ar':
        return product.artisans.bio_ar;
      case 'fr':
        return product.artisans.bio_fr || product.artisans.bio_en;
      default:
        return product.artisans.bio_en;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" dir={dir}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-12 w-full flex-grow">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-green-900 hover:text-green-700 font-semibold mb-8 transition"
        >
          {dir === 'rtl' ? <ArrowLeft className="w-5 h-5 rotate-180" /> : <ArrowLeft className="w-5 h-5" />}
          {t('back_homepage')}
        </button>



        <div className="grid md:grid-cols-2 gap-6 md:gap-12 bg-white rounded-2xl shadow-xl overflow-hidden p-4 md:p-8">
          {/* Image Section */}
          <div className="relative h-64 sm:h-96 md:h-[600px] w-full bg-gray-100 rounded-xl overflow-hidden shadow-inner group z-0">
            <img 
              src={displayImage}
              alt={getName()}
              className="w-full h-full object-cover will-change-transform"
              style={{ 
                transform: `translateY(${scrollY * 0.15}px) scale(1.1)`,
              }}
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).src = placeholderUrl;
              }}
            />
          </div>

          {/* Details Section */}
          <div className="flex flex-col">
            <div className={`flex flex-col gap-2 mb-6 border-b pb-6 text-right`}>
              <h1 className="text-3xl md:text-4xl font-extrabold text-green-900 mb-2">{getName()}</h1>

              <div className="flex items-center justify-end gap-4 mt-2">
                <div className="flex items-center gap-1 bg-amber-50 px-3 py-1 rounded-full">
                  <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                  <span className="font-bold text-amber-700">{product.average_rating.toFixed(1)}</span>
                </div>
                <span className="text-gray-500">({product.total_reviews} {t('reviews')})</span>
              </div>
              
              <div className="mt-4">
                <span className="text-4xl font-extrabold text-green-800">${displayPrice.toFixed(2)}</span>
              </div>
            </div>

            {/* Description */}
            <div className={`mb-8 text-right`}>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{t('product_description')}</h3>
              <p className="text-gray-600 leading-relaxed text-lg mb-4">{getDescription()}</p>
            </div>

            {/* Dynamic Quality Features */}
            {(product.features_ar || product.features_en) && (
              <div className={`mb-8 text-right`}>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{t('quality_features')}</h3>
                <ul className="space-y-2 mb-4">
                  {(language === 'ar' && product.features_ar ? product.features_ar : product.features_en)?.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3 text-gray-700 text-lg">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Variants Selector */}
            {product.variants && product.variants.length > 0 && (
              <div className={`mb-8 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                <h3 className="text-lg font-bold text-gray-800 mb-3">{t('select_variant')}</h3>
                <div className="flex flex-col gap-3">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setActiveVariantId(variant.id)}
                      className={`flex justify-between items-center px-4 py-3 border-2 rounded-xl transition ${
                        activeVariantId === variant.id
                          ? 'border-green-800 bg-green-50 shadow-sm'
                          : 'border-gray-200 hover:border-green-800 hover:bg-gray-50'
                      }`}
                    >
                      <span className={`font-semibold ${activeVariantId === variant.id ? 'text-green-900' : 'text-gray-700'}`}>
                        {getVariantName(variant)}
                      </span>
                      <span className="font-bold text-green-800">${variant.price_usd.toFixed(2)}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-auto space-y-4 pt-6 border-t">
              <button 
                onClick={() => addToCart(product)}
                className="w-full bg-green-900 hover:bg-green-800 text-white py-4 rounded-xl font-bold text-lg transition transform hover:-translate-y-1 shadow-lg flex justify-center items-center gap-2"
              >
                <ShoppingCart className="w-6 h-6" />
                {t('add_to_cart')}
              </button>
              <button 
                onClick={handleWishlistClick}
                className={`w-full py-4 rounded-xl font-bold text-lg transition flex justify-center items-center gap-2 border-2 ${isInWishlist(product.id) ? 'bg-red-50 border-red-200 text-red-600' : 'bg-white border-green-900 text-green-900 hover:bg-green-50'}`}
              >
                <Heart className={`w-6 h-6 ${isInWishlist(product.id) ? 'fill-red-600' : ''}`} />
                {isInWishlist(product.id) ? t('saved_to_wishlist') : t('add_to_wishlist')}
              </button>
            </div>
            
            {/* Verification Explanation Section */}
            {(() => {
              const verifiedIds = JSON.parse(localStorage.getItem('juthoor_verified_artisans') || '[]');
              const isVerified = (product.artisans && verifiedIds.includes(product.artisans.id)) || 
                                 (product.artisans?.verification_status === 'verified') || 
                                 product.authenticity_verified;
              if (!isVerified) return null;
              
              return (
                <div className="mt-8 bg-green-50 border border-green-200 rounded-xl p-5 flex items-start gap-4">
                  <ShieldCheck className="w-8 h-8 text-green-700 flex-shrink-0 mt-1" />
                  <p className={`text-green-900 text-sm md:text-base leading-relaxed ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                    {t('verification_explanation')}
                  </p>
                </div>
              );
            })()}
            
          </div>
        </div>

        {/* Designer / Artisan Card */}
        {product.artisans && (
          <div className="mt-8 md:mt-12 bg-white rounded-2xl shadow-lg p-4 md:p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center border-b pb-4">
              {t('meet_designer')}
            </h3>
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              {product.artisans.photo_url && (
                <img 
                  src={product.artisans.photo_url} 
                  alt={product.artisans.name} 
                  className="w-32 h-32 rounded-full object-cover shadow-md border-4 border-green-50"
                  loading="lazy"
                />
              )}
              <div className={`flex-1 text-right`}>
                <div className={`flex flex-col md:flex-row items-center gap-3 mb-2 md:justify-end`}>
                  <h4 className="text-2xl font-extrabold text-green-900">{product.artisans.name}</h4>
                  {(() => {
                    const verifiedIds = JSON.parse(localStorage.getItem('juthoor_verified_artisans') || '[]');
                    const isVerified = (product.artisans && verifiedIds.includes(product.artisans.id)) || 
                                       (product.artisans?.verification_status === 'verified');
                    if (!isVerified) return null;
                    return (
                      <span className="inline-flex items-center gap-1.5 bg-green-800 text-white text-sm font-bold px-3 py-1 rounded-full shadow-sm">
                        <Award className="w-4 h-4 text-amber-300" />
                        {t('heritage_certified') || 'Heritage Certified ✓'}
                      </span>
                    );
                  })()}
                </div>
                
                <div className={`flex items-center gap-2 text-gray-500 mb-4 justify-end`}>
                  <MapPin className="w-5 h-5 text-amber-600" />
                  <span className="font-medium text-lg">{product.artisans.region}</span>
                </div>
                
                <p className="text-gray-600 leading-relaxed text-lg italic mb-4">"{getBio()}"</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
