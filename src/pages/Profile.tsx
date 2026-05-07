import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useLanguage } from '../contexts/LanguageContext';
import { User as UserIcon, Settings, Heart, Package, LogOut, Loader2, Save } from 'lucide-react';
import { JuthoorProductCard } from '../components/JuthoorProductCard';

export function Profile({ onProductClick }: { onProductClick: (id: string) => void }) {
  const { user, signOut, updateUser } = useAuth();
  const { wishlist } = useWishlist();
  const { dir, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'settings'>('wishlist');
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.full_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await updateUser({ full_name: name, email });
      setIsEditing(false);
    } catch (err: any) {
      console.error('Profile: Update error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const mockOrders = [
    { id: '#1024', date: '21 Oct 2023', total: '$145.00', status: 'Delivered' },
    { id: '#0982', date: '12 Sep 2023', total: '$42.00', status: 'Shipped' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12" dir={dir}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Sidebar */}
          <div className="md:w-1/3 lg:w-1/4">
            <div className="bg-white rounded-3xl shadow-md p-8 text-center animate-fadeIn">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-green-50">
                {user.profile_photo_url ? (
                  <img src={user.profile_photo_url} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <UserIcon className="w-12 h-12 text-green-800" />
                )}
              </div>
              <h2 className="text-2xl font-bold text-green-900 mb-1">{user.full_name}</h2>
              <p className="text-gray-500 text-sm mb-6">{user.email}</p>
              
              <div className="space-y-2">
                <button 
                  onClick={() => setActiveTab('wishlist')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition ${activeTab === 'wishlist' ? 'bg-green-900 text-white' : 'hover:bg-green-50 text-gray-700'}`}
                >
                  <Heart className="w-5 h-5" />
                  {t('wishlist')}
                </button>
                <button 
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition ${activeTab === 'orders' ? 'bg-green-900 text-white' : 'hover:bg-green-50 text-gray-700'}`}
                >
                  <Package className="w-5 h-5" />
                  {t('order_history')}
                </button>
                <button 
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition ${activeTab === 'settings' ? 'bg-green-900 text-white' : 'hover:bg-green-50 text-gray-700'}`}
                >
                  <Settings className="w-5 h-5" />
                  {t('account_settings')}
                </button>
                <div className="pt-4 border-t mt-4">
                  <button 
                    onClick={() => signOut()}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-red-600 hover:bg-red-50 transition"
                  >
                    <LogOut className="w-5 h-5" />
                    {t('log_out')}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-[2rem] shadow-md p-10 min-h-[600px] animate-fadeIn">
              {activeTab === 'wishlist' && (
                <div>
                  <h3 className="text-3xl font-bold text-green-900 mb-8 border-b pb-6">{t('my_wishlist')}</h3>
                  {wishlist.length === 0 ? (
                    <div className="text-center py-20">
                      <Heart className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                      <p className="text-xl text-gray-400">{t('wishlist_empty')}</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                      {wishlist.map(product => (
                        <JuthoorProductCard key={product.id} product={product} onClick={() => onProductClick(product.id)} />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'orders' && (
                <div>
                  <h3 className="text-3xl font-bold text-green-900 mb-8 border-b pb-6">{t('order_history')}</h3>
                  <div className="space-y-4">
                    {mockOrders.map(order => (
                      <div key={order.id} className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:border-green-200 transition">
                        <div>
                          <p className="font-bold text-gray-900">{t('order')} {order.id}</p>
                          <p className="text-sm text-gray-500">{order.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-800">{order.total}</p>
                          <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full font-bold uppercase">{order.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div>
                  <div className="flex justify-between items-center mb-8 border-b pb-6">
                    <h3 className="text-3xl font-bold text-green-900">{t('account_settings')}</h3>
                    {!isEditing && (
                      <button 
                        onClick={() => setIsEditing(true)}
                        className="bg-green-100 text-green-900 px-6 py-2 rounded-xl font-bold hover:bg-green-200 transition"
                      >
                        {t('edit_profile')}
                      </button>
                    )}
                  </div>

                  <div className="max-w-md space-y-8">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-500 mb-2 uppercase tracking-wider">{t('full_name')}</label>
                        {isEditing ? (
                          <input 
                            type="text" 
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 transition"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                          />
                        ) : (
                          <p className="text-xl font-bold text-gray-800">{user.full_name}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-500 mb-2 uppercase tracking-wider">{t('email_address')}</label>
                        {isEditing ? (
                          <input 
                            type="email" 
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 transition"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        ) : (
                          <p className="text-xl font-bold text-gray-800">{user.email}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-500 mb-2 uppercase tracking-wider">{t('account_type')}</label>
                        <p className="text-lg font-semibold text-green-700 capitalize">{user.user_type}</p>
                      </div>
                    </div>

                    {isEditing && (
                      <div className="flex gap-4 pt-8">
                        <button 
                          onClick={handleUpdate}
                          disabled={loading}
                          className="flex-1 bg-green-900 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-800 transition shadow-lg"
                        >
                          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                          {t('save_changes')}
                        </button>
                        <button 
                          onClick={() => setIsEditing(false)}
                          className="px-6 py-4 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition"
                        >
                          {t('cancel')}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
