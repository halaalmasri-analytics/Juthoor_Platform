import { MapPin, User } from 'lucide-react';
import { Product } from '../lib/supabase';
import { useLanguage } from '../contexts/LanguageContext';

type ProductCardProps = {
  product: Product & { artisans?: any };
};

export function ProductCard({ product }: ProductCardProps) {
  const { language, t } = useLanguage();

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

  const getBio = () => {
    if (!product.artisans) return '';
    switch (language) {
      case 'ar':
        return product.artisans.bio_ar;
      case 'fr':
        return product.artisans.bio_fr;
      default:
        return product.artisans.bio_en;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl will-change-transform [backface-visibility:hidden] [transform:translateZ(0)]">
      <div className="relative h-64 overflow-hidden">
        <img
          src={product.image_url || 'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg'}
          alt={getName()}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110 will-change-transform [backface-visibility:hidden] [transform:translateZ(0)]"
          loading="lazy"
        />
        <div className="absolute top-4 right-4 bg-amber-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
          ${product.price_usd}
        </div>
      </div>

      <div className="p-6">
        <h3 className={`text-2xl font-bold mb-3 text-gray-800 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
          {getName()}
        </h3>

        <p className={`text-gray-600 mb-4 leading-relaxed ${language === 'ar' ? 'text-right' : 'text-left'}`}>
          {getDescription()}
        </p>

        {product.artisans && (
          <div className="border-t pt-4 mt-4">
            <div className="flex items-start gap-3 mb-3">
              {product.artisans.photo_url && (
                <img
                  src={product.artisans.photo_url}
                  alt={product.artisans.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <User className="w-4 h-4 text-amber-600" />
                  <p className="font-semibold text-gray-800">
                    {t('handmade')} {product.artisans.name}
                  </p>
                </div>
                {product.artisans.location && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{product.artisans.location}</span>
                  </div>
                )}
              </div>
            </div>
            <p className={`text-sm text-gray-600 italic ${language === 'ar' ? 'text-right' : 'text-left'}`}>
              {getBio()}
            </p>
          </div>
        )}

        <div className="mt-4 pt-4 border-t">
          <span className="inline-block bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium">
            {product.category}
          </span>
        </div>
      </div>
    </div>
  );
}
