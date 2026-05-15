import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { ARTISAN_DASHBOARD_STATS, Product } from '../lib/staticData';
import { DollarSign, ShoppingCart, Star, Upload, Trash2, Edit2, Plus, LogOut, Package, ShieldCheck, ShieldAlert, X } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useProducts } from '../contexts/ProductContext';

const revenueData = [
  { name: 'Jan', revenue: 1200 },
  { name: 'Feb', revenue: 1900 },
  { name: 'Mar', revenue: 1500 },
  { name: 'Apr', revenue: 2200 },
  { name: 'May', revenue: 2800 },
  { name: 'Jun', revenue: 3500 },
];

const recentOrders = [
  { id: '#1024', product: 'Handwoven Olive Branch Scarf', buyer: 'Ahmad M.', date: '21 Oct 2023', status: 'Delivered' },
  { id: '#0982', product: 'Hand-Painted Ceramic Plate', buyer: 'Sarah K.', date: '12 Sep 2023', status: 'Shipped' },
  { id: '#0950', product: 'Olive Wood Serving Board', buyer: 'Omar D.', date: '05 Aug 2023', status: 'Processing' },
];

export function ArtisanDashboard({ onNavigate }: { onNavigate?: (view: string) => void }) {
  const { user, signOut } = useAuth();
  const { dir, t } = useLanguage();
  const { products: allProducts, addProduct, updateProduct, deleteProduct } = useProducts();
  
  const [stats, setStats] = useState({
    totalProducts: 0,
    averageRating: 0,
    totalSales: 0,
    totalOrders: 0,
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProductId, setCurrentProductId] = useState<string | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name_en: '',
    name_ar: '',
    description_en: '',
    description_ar: '',
    price_usd: 0,
    category: 'Tatreez',
    region: 'Nablus',
    stock_quantity: 0,
    image_url: ''
  });

  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    loadDashboardData();
    const verifiedIds = JSON.parse(localStorage.getItem('juthoor_verified_artisans') || '[]');
    if (user && verifiedIds.includes(user.id)) {
      setIsVerified(true);
    }
  }, [user, allProducts]);

  async function loadDashboardData() {
    await new Promise((resolve) => setTimeout(resolve, 500));
    setStats(ARTISAN_DASHBOARD_STATS);
    
    // Filter products for the current artisan
    const artisanProducts = allProducts.filter(p => p.artisan_id === user?.id || (user?.id === 'artisan-1' && p.artisan_id === 'artisan-1'));
    setProducts(artisanProducts);
    setLoading(false);
  }

  const handleOpenAddModal = () => {
    setIsEditing(false);
    setCurrentProductId(null);
    setFormData({
      name_en: '',
      name_ar: '',
      description_en: '',
      description_ar: '',
      price_usd: 0,
      category: 'Tatreez',
      region: 'Nablus',
      stock_quantity: 0,
      image_url: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setIsEditing(true);
    setCurrentProductId(product.id);
    setFormData({
      name_en: product.name_en,
      name_ar: product.name_ar || '',
      description_en: product.description_en,
      description_ar: product.description_ar || '',
      price_usd: product.price_usd,
      category: product.category,
      region: product.artisans?.region || 'Nablus',
      stock_quantity: 10, // Mock stock if not present
      image_url: product.image_url || ''
    });
    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image_url: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && currentProductId) {
      updateProduct(currentProductId, {
        ...formData,
        product_status: 'active'
      });
    } else {
      addProduct({
        ...formData,
        artisan_id: user?.id || 'artisan-1',
        artisans: {
          id: user?.id || 'artisan-1',
          name: user?.full_name || 'Artisan',
          region: formData.region,
          location: formData.region,
          craft_specialty: formData.category,
          bio_en: '',
          bio_ar: '',
          average_rating: 5,
          created_at: new Date().toISOString()
        }
      } as any);
    }
    setIsModalOpen(false);
  };

  const handleDeleteClick = (id: string) => {
    if (window.confirm(t('delete_confirm_msg'))) {
      deleteProduct(id);
    }
  };

  const handleSignOut = () => {
    signOut();
    if (onNavigate) onNavigate('home');
  };

  // Explicit mapping for core platform product images to guarantee uniqueness
  const PRODUCT_IMAGE_MAP: Record<string, string> = {
    'Hebron Glass Set (Blue & White)': '/large_display_plate.jpeg',
    'Palestinian Heritage Wall Hooks': '/key_hook.jpeg',
    'Embroidered Mirrors': '/wall_mirror.jpeg',
    'Palestinian Heritage Dresses': '/pink_dress.jpeg',
    'Tatreez Jewelry': '/tatreeze_earrning.jpeg',
    'Tatreez Bags': '/zaitona_bag.jpeg',
    'Keffiyeh & Olive Ceramic Tea Cup': '/tea_cup_set.png',
    'Palestine Map Ceramic Plate': '/map_plate.png',
    '“Love is Palestine” Keffiyeh Mug': '/pal_cup.png',
    'The Pomegranate Bag (حقيبة الرمان)': '/ardalkhair_bag.jpeg',
    'Carved Walnut Heritage Mirror (Blue Tatreez Inlay)': '/blue_poket_mirror.jpeg',
    '"Resilience" Red Tatreez Clutch': '/bag.jpeg',
    'Resilience Red Tatreez Clutch': '/bag.jpeg',
  };

  // Extract unique data for smart dropdowns and linked names
  const productSourceData = allProducts.reduce((acc, p) => {
    const key = p.name_en.trim();
    if (!acc[key]) {
      acc[key] = { ar: p.name_ar || '', desc: p.description_en, image: p.image_url || undefined };
    }
    return acc;
  }, {} as Record<string, { ar: string, desc: string, image?: string }>);

  const arToEnMap = allProducts.reduce((acc, p) => {
    if (p.name_ar && !acc[p.name_ar]) {
      acc[p.name_ar] = { en: p.name_en, desc: p.description_en };
    }
    return acc;
  }, {} as Record<string, { en: string, desc: string }>);

  const uniqueNamesEn = Object.keys(productSourceData).sort();
  const uniqueNamesAr = Object.keys(arToEnMap).sort();

  const handleEnNameChange = (name: string) => {
    if (!name) {
      setFormData({ ...formData, name_en: '', name_ar: '', description_en: '' });
      return;
    }
    const match = productSourceData[name];
    setFormData({ 
      ...formData, 
      name_en: name, 
      name_ar: match.ar, 
      description_en: match.desc 
    });
  };

  const handleArNameChange = (name: string) => {
    if (!name) {
      setFormData({ ...formData, name_en: '', name_ar: '', description_en: '' });
      return;
    }
    const match = arToEnMap[name];
    setFormData({ 
      ...formData, 
      name_ar: name, 
      name_en: match.en, 
      description_en: match.desc 
    });
  };

  const priceRanges = [
    { label: '$10-$30', value: 10 },
    { label: '$31-$60', value: 31 },
    { label: '$61-$100', value: 61 },
    { label: '$100+', value: 101 }
  ];

  const stockOptions = [1, 5, 10, 20, 50, 100];

  return (
    <div className="min-h-screen bg-gray-50" dir={dir}>
      <Header onNavigate={onNavigate} currentView="artisan-dashboard" />

      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-green-900">Artisan Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome back, {user?.full_name}! Manage your products and track your success</p>
          </div>
          <button onClick={handleSignOut} className="flex items-center gap-2 text-red-600 font-bold hover:bg-red-50 px-4 py-2 rounded-lg transition">
            <LogOut className="w-5 h-5" /> Sign Out
          </button>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12 space-y-6 md:space-y-8">
        
        {/* Verification Status Card */}
        <div className={`p-6 rounded-2xl flex items-center gap-4 shadow-sm border ${isVerified ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'}`}>
          <div className={`p-4 rounded-full ${isVerified ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-600'}`}>
            {isVerified ? <ShieldCheck className="w-8 h-8" /> : <ShieldAlert className="w-8 h-8" />}
          </div>
          <div>
            <h3 className={`text-xl font-bold ${isVerified ? 'text-green-900' : 'text-orange-900'} flex items-center gap-2`}>
              {isVerified ? 'Heritage Certified ✓' : 'Pending Review'}
            </h3>
            <p className={isVerified ? 'text-green-800' : 'text-orange-800'}>
              {isVerified 
                ? 'Your profile has been verified as an authentic Palestinian artisan.'
                : 'Your profile is under review. You will be notified once verified.'}
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <div className="bg-white rounded-2xl shadow-sm p-6 flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-semibold">Total Products</p>
              <p className="text-3xl font-bold text-green-900 mt-2">{stats.totalProducts}</p>
            </div>
            <div className="p-4 bg-green-50 rounded-full"><Package className="w-8 h-8 text-green-800" /></div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-6 flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-semibold">Average Rating</p>
              <p className="text-3xl font-bold text-amber-600 mt-2">{stats.averageRating.toFixed(1)}</p>
            </div>
            <div className="p-4 bg-amber-50 rounded-full"><Star className="w-8 h-8 text-amber-600" /></div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-6 flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-semibold">Total Earnings</p>
              <p className="text-3xl font-bold text-green-600 mt-2">${stats.totalSales.toFixed(0)}</p>
            </div>
            <div className="p-4 bg-green-50 rounded-full"><DollarSign className="w-8 h-8 text-green-600" /></div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-6 flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-semibold">Total Orders</p>
              <p className="text-3xl font-bold text-blue-900 mt-2">{stats.totalOrders}</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-full"><ShoppingCart className="w-8 h-8 text-blue-800" /></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6 min-w-0">
            <h2 className="text-xl font-bold text-green-900 mb-6">Monthly Revenue</h2>
            <div className="h-[300px] w-full relative">
              {mounted && (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} tickFormatter={(value) => `$${value}`} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Line type="monotone" dataKey="revenue" stroke="#1B5E20" strokeWidth={3} dot={{ r: 4, fill: '#1B5E20', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-green-900 mb-6">Recent Orders</h2>
            <div className="space-y-4">
              {recentOrders.map((order, i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-bold text-green-900">{order.id}</p>
                    <span className={`text-xs px-2 py-1 rounded-full font-bold ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-gray-800 line-clamp-1">{order.product}</p>
                  <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                    <span>{order.buyer}</span>
                    <span>{order.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-4 md:p-6 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-green-900">Your Listed Products</h2>
              <p className="text-sm text-gray-500 mt-1">Categories: Tatreez, Olive Oil, Ceramics, Olive Wood, Glasswork</p>
            </div>
            <button 
              onClick={handleOpenAddModal}
              className="bg-green-900 hover:bg-green-800 text-white px-6 py-3 rounded-xl font-bold transition flex items-center gap-2 whitespace-nowrap shadow-md"
            >
              <Plus className="w-5 h-5" /> {t('add_new_product')}
            </button>
          </div>

          {!loading && products.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-500 uppercase tracking-wider">Rating</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-right text-sm font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50/50 transition">
                      <td className="px-6 py-4 text-sm font-bold text-gray-900 flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-100 flex-shrink-0">
                          <img 
                            src={product.image_url || PRODUCT_IMAGE_MAP[product.name_en] || productSourceData[product.name_en.trim()]?.image || '/large_display_plate.jpeg'} 
                            className="w-full h-full object-cover" 
                            loading="lazy"
                          />
                        </div>
                        {product.name_en}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-green-800">${product.price_usd}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className="flex items-center gap-1 text-amber-600 font-bold">
                          <Star className="w-4 h-4 fill-current" /> {product.average_rating.toFixed(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-bold uppercase tracking-wide">
                          {product.product_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleOpenEditModal(product)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition" 
                            title={t('edit_product')}
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteClick(product.id)} 
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition" 
                            title={t('delete')}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : loading ? (
            <div className="p-12 flex justify-center text-green-900"><Upload className="animate-bounce" /></div>
          ) : (
            <div className="p-12 text-center">
              <p className="text-gray-600 text-lg font-medium">No products yet. Create your first listing to get started!</p>
            </div>
          )}
        </div>
      </div>

      <Footer />

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl md:rounded-[2.5rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-scaleUp">
            <div className="p-8 border-b flex justify-between items-center bg-green-50/50">
              <h2 className="text-2xl font-bold text-green-900">{isEditing ? t('edit_product') : t('add_new_product')}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white rounded-full transition text-gray-500">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 overflow-y-auto space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700">{t('product_name')} (EN)</label>
                  <select 
                    required
                    disabled={!!formData.name_ar && !uniqueNamesEn.includes(formData.name_en)}
                    className={`w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-green-100 outline-none transition cursor-pointer ${formData.name_ar && !uniqueNamesEn.includes(formData.name_en) ? 'bg-gray-100' : 'bg-gray-50'}`}
                    value={formData.name_en}
                    onChange={e => handleEnNameChange(e.target.value)}
                  >
                    <option value="">Select Name (EN)</option>
                    {uniqueNamesEn.map(name => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700">{t('product_name')} (AR)</label>
                  <select 
                    disabled={!!formData.name_en && !uniqueNamesAr.includes(formData.name_ar)}
                    className={`w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-4 focus:ring-green-100 outline-none transition text-right cursor-pointer ${formData.name_en && !uniqueNamesAr.includes(formData.name_ar) ? 'bg-gray-100' : 'bg-gray-50'}`}
                    value={formData.name_ar}
                    onChange={e => handleArNameChange(e.target.value)}
                  >
                    <option value="">اختر الاسم (AR)</option>
                    {uniqueNamesAr.map(name => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700">{t('price')}</label>
                  <select 
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-green-100 outline-none transition cursor-pointer"
                    value={priceRanges.find(r => r.value === formData.price_usd)?.value || ''}
                    onChange={e => setFormData({ ...formData, price_usd: parseFloat(e.target.value) })}
                  >
                    <option value="">Select Range</option>
                    {priceRanges.map(range => (
                      <option key={range.value} value={range.value}>{range.label}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700">{t('category')}</label>
                  <select 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-green-100 outline-none transition"
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="Tatreez">Tatreez</option>
                    <option value="Olive Oil">Olive Oil</option>
                    <option value="Ceramics">Ceramics</option>
                    <option value="Olive Wood">Olive Wood</option>
                    <option value="Glasswork">Glasswork</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700">{t('region')}</label>
                  <select 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-green-100 outline-none transition"
                    value={formData.region}
                    onChange={e => setFormData({ ...formData, region: e.target.value })}
                  >
                    <option value="Nablus">Nablus</option>
                    <option value="Hebron">Hebron</option>
                    <option value="Ramallah">Ramallah</option>
                    <option value="Jerusalem">Jerusalem</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700">{t('stock_quantity')}</label>
                  <select 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-green-100 outline-none transition cursor-pointer"
                    value={formData.stock_quantity}
                    onChange={e => setFormData({ ...formData, stock_quantity: parseInt(e.target.value) })}
                  >
                    {stockOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700">{t('upload_image')}</label>
                  <div className="flex items-center gap-4">
                    <label className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-dashed border-green-300 rounded-xl hover:bg-green-50 transition text-green-800 font-bold">
                        <Upload className="w-5 h-5" />
                        <span>{t('upload_image')}</span>
                      </div>
                      <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                    </label>
                    <div className="w-16 h-16 rounded-xl border bg-gray-50 flex items-center justify-center overflow-hidden">
                      {formData.image_url ? (
                        <img src={formData.image_url} className="w-full h-full object-cover" loading="lazy" />
                      ) : (
                        <Package className="w-8 h-8 text-gray-300" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t flex gap-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-6 py-4 border-2 border-gray-200 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 transition"
                >
                  {t('cancel')}
                </button>
                <button 
                  type="submit" 
                  className="flex-1 px-6 py-4 bg-green-900 text-white rounded-2xl font-bold hover:bg-green-800 shadow-lg transform transition active:scale-95"
                >
                  {t('save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

