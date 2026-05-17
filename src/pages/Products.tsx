import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useProducts } from '../contexts/ProductContext';
import { JuthoorProductCard } from '../components/JuthoorProductCard';

type SortOption = 'top_rated' | 'price_asc' | 'price_desc';

export function ProductsPage({ onProductClick, onAuthRequired }: { onProductClick: (id: string) => void, onAuthRequired: () => void }) {
  const { dir, t } = useLanguage();
  const { products } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<SortOption>('top_rated');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const REGIONS = ['All', 'Ramallah', 'Hebron', 'Nablus', 'Jerusalem', 'Gaza', 'Bethlehem'];
  const CATEGORIES = ['All', 'Embroidery', 'Ceramics', 'Glasswork', 'Accessories', 'Home Decor', 'Clothing', 'Jewelry'];

  // Base list of all active products
  let displayProducts = products.filter(p => p.product_status === 'active');

  // Filter Logic
  displayProducts = displayProducts.filter(product => {
    const matchesSearch = 
      product.name_en.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (product.name_ar && product.name_ar.includes(searchTerm)) ||
      product.description_en.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRegion = 
      selectedRegion === 'All' || 
      (product.artisans && product.artisans.region.toLowerCase().includes(selectedRegion.toLowerCase()));

    const matchesCategory = 
      selectedCategory === 'All' || 
      product.category.toLowerCase().includes(selectedCategory.toLowerCase());
      
    return matchesSearch && matchesRegion && matchesCategory;
  });

  // Sort Logic
  displayProducts.sort((a, b) => {
    switch(sortBy) {
      case 'price_asc':
        return a.price_usd - b.price_usd;
      case 'price_desc':
        return b.price_usd - a.price_usd;
      case 'top_rated':
      default:
        return b.average_rating - a.average_rating;
    }
  });

  return (
    <div className="min-h-screen bg-white py-8 md:py-12" dir={dir}>
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Header Section */}
        <div className="text-center mb-8 md:mb-16 animate-fadeIn">
          <h1 className="text-3xl md:text-4xl lg:text-6xl font-extrabold text-green-900 mb-4 md:mb-6 font-serif">
            {t('rooted_heritage')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t('products_subtitle')}
          </p>
        </div>

        {/* Search and Filters Bar */}
        <div className="bg-green-50/50 p-4 md:p-8 rounded-3xl mb-8 md:mb-16 border border-green-100 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search Input */}
            <div className="relative flex-[2]">
              <Search className={`absolute ${dir === 'rtl' ? 'right-5' : 'left-5'} top-1/2 -translate-y-1/2 text-green-800 w-5 h-5`} />
              <input 
                type="text" 
                placeholder={t('search_placeholder')} 
                className={`w-full ${dir === 'rtl' ? 'pr-14 pl-5' : 'pl-14 pr-5'} py-4 bg-white border border-green-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-100 transition text-gray-800 text-lg shadow-inner`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Region Select */}
            <div className="flex-1">
              <select 
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full py-4 px-6 bg-white border border-green-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-100 transition appearance-none cursor-pointer text-gray-800 font-medium"
              >
                <option value="All">{t('all_regions')}</option>
                {REGIONS.filter(r => r !== 'All').map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>

            {/* Category Select */}
            <div className="flex-1">
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full py-4 px-6 bg-white border border-green-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-100 transition appearance-none cursor-pointer text-gray-800 font-medium"
              >
                <option value="All">{t('all_categories')}</option>
                {CATEGORIES.filter(c => c !== 'All').map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Sort Select */}
            <div className="flex-1">
              <div className="relative">
                <ArrowUpDown className="absolute right-5 top-1/2 -translate-y-1/2 text-green-700 w-4 h-4 pointer-events-none" />
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="w-full py-4 px-6 bg-white border border-green-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-100 transition appearance-none cursor-pointer text-gray-800 font-medium"
                >
                  <option value="top_rated">{t('top_rated')}</option>
                  <option value="price_asc">{t('price_low_high')}</option>
                  <option value="price_desc">{t('price_high_low')}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Quick Tags for Category */}
          <div className="mt-8 flex flex-wrap gap-2 justify-center">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${
                  selectedCategory === cat 
                    ? 'bg-green-900 text-white shadow-md transform -translate-y-0.5' 
                    : 'bg-white text-green-900 hover:bg-green-50 border border-green-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Applied Filters Info */}
        {(selectedCategory !== 'All' || selectedRegion !== 'All' || searchTerm) && (
          <div className="mb-8 flex items-center gap-4 text-gray-500 text-sm">
            <SlidersHorizontal className="w-4 h-4" />
            <span>{t('showing_results')} </span>
            {searchTerm && <span className="bg-gray-100 px-2 py-1 rounded">"{searchTerm}"</span>}
            {selectedCategory !== 'All' && <span className="bg-gray-100 px-2 py-1 rounded">{selectedCategory}</span>}
            {selectedRegion !== 'All' && <span className="bg-gray-100 px-2 py-1 rounded">{selectedRegion}</span>}
            <button 
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
                setSelectedRegion('All');
                setSortBy('top_rated');
              }}
              className="text-green-800 font-bold hover:underline ml-auto"
            >
              {t('clear_all_filters')}
            </button>
          </div>
        )}

        {/* Product Cards Grid */}
        {displayProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-12">
            {displayProducts.map((product, index) => (
              <div 
                key={product.id}
                className="animate-fadeIn"
                style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
              >
                 <JuthoorProductCard 
                    product={product} 
                    onClick={() => onProductClick(product.id)} 
                    onAuthRequired={onAuthRequired} 
                 />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-gray-50 rounded-[3rem] border border-dashed border-gray-200">
            <div className="bg-white w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <Search className="w-10 h-10 text-gray-300" />
            </div>
            <p className="text-3xl text-gray-800 font-bold mb-4 font-serif">{t('no_products')}</p>
            <p className="text-xl text-gray-500 max-w-md mx-auto leading-relaxed">
              {t('no_products_desc')}
            </p>
            <button 
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
                setSelectedRegion('All');
              }}
              className="mt-8 bg-green-900 text-white px-8 py-3 rounded-2xl font-bold hover:bg-green-800 transition shadow-lg"
            >
              {t('reset_filters')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
