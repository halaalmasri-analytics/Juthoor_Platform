import { useState, useEffect } from 'react';
import { ARTISANS } from '../lib/staticData';
import { MapPin, Award, Search } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useProducts } from '../contexts/ProductContext';

export function ArtisansPage({ onProductClick, onAuthRequired: _onAuthRequired }: { onProductClick: (id: string) => void, onAuthRequired: () => void }) {
  const { language, dir, t } = useLanguage();
  const { products: allProducts } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const CITIES = ['All', 'Hebron', 'Nablus', 'Ramallah', 'Jerusalem', 'Gaza', 'Bethlehem'];

  // Identify the target artisans based on prompt specifications
  const targetArtisanIds = [
    'artisan-7', // Lina Khoury (Ramallah)
    'artisan-1', // Ibrahim (Hebron)
    'artisan-2', // Sami (Nablus)
    'artisan-3', // Layla (Ramallah)
    'artisan-4', // Maryam (Gaza)
    'artisan-5', // Zein (Jerusalem)
    'artisan-6', // Amal (Bethlehem)
  ];
  
  const displayArtisans = ARTISANS.filter(a => targetArtisanIds.includes(a.id));

  // Filter logic
  const filteredArtisans = displayArtisans.filter(artisan => {
    const matchesCity = selectedCity === 'All' || artisan.region.toLowerCase().includes(selectedCity.toLowerCase());
    const matchesSearch = 
      artisan.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      artisan.bio_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artisan.location.toLowerCase().includes(searchTerm.toLowerCase());
      
    return matchesCity && matchesSearch;
  });

  const getArtisanProducts = (artisanId: string) => {
    return allProducts.filter(p => p.artisan_id === artisanId);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12" dir={dir}>
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center mb-8 md:mb-12 animate-fadeIn">
          <h1 className="text-3xl md:text-5xl font-extrabold text-green-900 mb-4">{t('our_artisans')}</h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            {t('artisans_subtitle')}
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 md:p-8 rounded-2xl shadow-md mb-8 md:mb-12">
          <div className="relative mb-6 max-w-3xl mx-auto">
            <Search className={`absolute ${dir === 'rtl' ? 'right-4' : 'left-4'} top-3.5 text-gray-400 w-5 h-5`} />
            <input 
              type="text" 
              placeholder={t('search_artisans')} 
              className={`w-full ${dir === 'rtl' ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 transition text-gray-800`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {CITIES.map(city => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`px-6 py-2.5 rounded-full font-bold transition duration-300 ${
                  selectedCity === city 
                    ? 'bg-green-800 text-white shadow-lg transform -translate-y-0.5' 
                    : 'bg-green-50 text-green-800 hover:bg-green-100 hover:shadow border border-green-100'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        {/* Artisans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {filteredArtisans.map(artisan => {
            const products = getArtisanProducts(artisan.id);

            return (
              <div key={artisan.id} className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden flex flex-col hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="p-8 flex-grow flex flex-col">
                  {/* Header Row */}
                  <div className={`flex justify-between items-start mb-5 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    <h2 className="text-2xl font-extrabold text-gray-900 leading-tight">{artisan.name}</h2>
                    <span className="bg-green-100 border border-green-200 text-green-800 text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap shadow-sm">
                      {artisan.craft_specialty}
                    </span>
                  </div>

                  {/* Location */}
                  <div className={`flex items-center gap-2 text-gray-500 mb-4 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    <MapPin className="w-5 h-5 text-amber-600 flex-shrink-0" />
                    <span className="font-semibold text-base">{artisan.region}</span>
                  </div>

                  {/* Verified Badge */}
                  {(() => {
                    const verifiedIds = JSON.parse(localStorage.getItem('juthoor_verified_artisans') || '[]');
                    const isVerified = artisan.verification_status === 'verified' || verifiedIds.includes(artisan.id);
                    if (!isVerified) return null;
                    return (
                      <div className={`inline-flex items-center gap-1.5 bg-green-800 text-white text-sm font-bold px-4 py-1.5 rounded-full mb-6 max-w-max shadow-md ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                        <Award className="w-4 h-4 text-amber-300" />
                        {t('heritage_certified') || 'Heritage Certified ✓'}
                      </div>
                    );
                  })()}

                  {/* Bio */}
                  <p className="text-gray-600 leading-relaxed mb-8 italic text-[15px] flex-grow">
                    "{language === 'ar' ? artisan.bio_ar : language === 'fr' ? ((artisan as any).bio_fr || artisan.bio_en) : artisan.bio_en}"
                  </p>

                  {/* Render Embedded Products! */}
                  {products.length > 0 && (
                    <div className="mt-auto border-t border-gray-100 pt-5">
                      <h4 className={`text-xs font-extrabold text-gray-400 mb-3 uppercase tracking-wider ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                        {t('artisan_products')}
                      </h4>
                      <ul className="space-y-3">
                        {products.map(product => {
                           // If product has valid variants we want to list them clearly as requested by user
                           if (product.variants && product.variants.length > 0) {
                              return (
                                <li key={product.id} className={`text-[15px] ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                                  <span className="font-bold text-gray-800">{language === 'ar' ? product.name_ar : language === 'fr' ? (product.name_fr || product.name_en) : product.name_en} - </span>
                                  <div className="inline-flex flex-wrap items-center gap-x-1.5 mt-1">
                                    {product.variants.map((v, idx) => (
                                      <span key={v.id}>
                                        <button 
                                          onClick={() => onProductClick(product.id)}
                                          className="text-green-700 hover:text-green-900 hover:underline font-semibold transition"
                                        >
                                          {v.name} (${v.price_usd})
                                        </button>
                                        {idx < (product.variants?.length || 0) - 1 ? <span className="text-gray-400">, </span> : ''}
                                      </span>
                                    ))}
                                  </div>
                                </li>
                              );
                           }

                           // Standard rendering for singular products (e.g. Tea Cup)
                           return (
                             <li key={product.id} className={dir === 'rtl' ? 'text-right' : 'text-left'}>
                               <button 
                                 onClick={() => onProductClick(product.id)}
                                 className="text-green-700 hover:text-green-900 hover:underline font-bold text-[15px] transition items-center text-left"
                               >
                                 {language === 'ar' ? product.name_ar : language === 'fr' ? (product.name_fr || product.name_en) : product.name_en} (${product.price_usd})
                               </button>
                             </li>
                           );
                        })}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filteredArtisans.length === 0 && (
           <div className="text-center py-24 bg-white rounded-3xl shadow-sm border border-gray-100">
             <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
               <Search className="w-8 h-8 text-gray-400" />
             </div>
             <p className="text-2xl text-gray-800 font-bold mb-2">{t('no_artisans')}</p>
             <p className="text-gray-500">{t('no_artisans_desc')}</p>
           </div>
        )}
      </div>
    </div>
  );
}
