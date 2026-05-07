import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { JuthoorProductCard } from '../components/JuthoorProductCard';
import { Package, Heart, DollarSign, Settings, LogOut, Save, Loader2, User as UserIcon } from 'lucide-react';

export function BuyerDashboard({ onProductClick, onNavigate }: { onProductClick: (id: string) => void, onNavigate?: (view: string) => void }) {
  const { user, signOut, updateUser } = useAuth();
  const { wishlist, removeFromWishlist } = useWishlist();
  const { dir, t } = useLanguage();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'wishlist' | 'settings'>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.full_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  const handleUpdate = async () => {
    setLoading(true);
    await updateUser({ full_name: name, email });
    setLoading(false);
    setIsEditing(false);
  };

  const handleSignOut = () => {
    signOut();
    if (onNavigate) onNavigate('home');
  };

  const mockOrders = [
    { id: '#1024', product: 'Handwoven Olive Branch Scarf', artisan: 'Fatima Al-Khaled', date: '21 Oct 2023', total: '$45.00', status: 'Delivered' },
    { id: '#0982', product: 'Hand-Painted Ceramic Plate', artisan: 'Yusuf Ceramics', date: '12 Sep 2023', total: '$85.00', status: 'Shipped' },
    { id: '#0950', product: 'Olive Wood Serving Board', artisan: 'Bethlehem Woodworks', date: '05 Aug 2023', total: '$35.00', status: 'Delivered' },
  ];

  const totalSpent = mockOrders.reduce((sum, order) => sum + parseFloat(order.total.replace('$', '')), 0);

  return (
    <div className="min-h-screen bg-gray-50" dir={dir}>
      <Header onNavigate={onNavigate} currentView="buyer-dashboard" />

      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-3xl font-bold text-green-900">Buyer Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {user.full_name}!</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="md:w-1/4">
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
              {user.profile_photo_url ? (
                <img src={user.profile_photo_url} className="w-full h-full rounded-full object-cover" loading="lazy" />
              ) : (
                <UserIcon className="w-10 h-10 text-green-800" />
              )}
            </div>
            <h2 className="text-xl font-bold text-green-900">{user.full_name}</h2>
            <p className="text-gray-500 text-sm mb-6">{user.email}</p>
            
            <div className="space-y-2">
              <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition ${activeTab === 'overview' ? 'bg-green-900 text-white' : 'hover:bg-green-50 text-gray-700'}`}>
                <UserIcon className="w-5 h-5" /> Overview
              </button>
              <button onClick={() => setActiveTab('orders')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition ${activeTab === 'orders' ? 'bg-green-900 text-white' : 'hover:bg-green-50 text-gray-700'}`}>
                <Package className="w-5 h-5" /> Order History
              </button>
              <button onClick={() => setActiveTab('wishlist')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition ${activeTab === 'wishlist' ? 'bg-green-900 text-white' : 'hover:bg-green-50 text-gray-700'}`}>
                <Heart className="w-5 h-5" /> Wishlist
              </button>
              <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition ${activeTab === 'settings' ? 'bg-green-900 text-white' : 'hover:bg-green-50 text-gray-700'}`}>
                <Settings className="w-5 h-5" /> Settings
              </button>
              <div className="pt-4 border-t mt-4">
                <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-red-600 hover:bg-red-50 transition">
                  <LogOut className="w-5 h-5" /> {t('log_out')}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {activeTab === 'overview' && (
            <>
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4">
                  <div className="p-4 bg-blue-100 rounded-full text-blue-800"><Package className="w-6 h-6" /></div>
                  <div>
                    <p className="text-gray-500 text-sm font-semibold">Total Orders</p>
                    <p className="text-2xl font-bold text-green-900">{mockOrders.length}</p>
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4">
                  <div className="p-4 bg-green-100 rounded-full text-green-800"><DollarSign className="w-6 h-6" /></div>
                  <div>
                    <p className="text-gray-500 text-sm font-semibold">Total Spent</p>
                    <p className="text-2xl font-bold text-green-900">${totalSpent.toFixed(2)}</p>
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4">
                  <div className="p-4 bg-rose-100 rounded-full text-rose-800"><Heart className="w-6 h-6" /></div>
                  <div>
                    <p className="text-gray-500 text-sm font-semibold">Wishlist Items</p>
                    <p className="text-2xl font-bold text-green-900">{wishlist.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-xl font-bold text-green-900 mb-6">Recent Activity</h3>
                <p className="text-gray-600">You have successfully received {mockOrders.filter(o => o.status === 'Delivered').length} orders. Thank you for supporting Palestinian artisans!</p>
              </div>
            </>
          )}

          {activeTab === 'orders' && (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b">
                <h3 className="text-xl font-bold text-green-900">Order History</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="p-4 font-semibold text-gray-700">Order ID</th>
                      <th className="p-4 font-semibold text-gray-700">Product</th>
                      <th className="p-4 font-semibold text-gray-700">Artisan</th>
                      <th className="p-4 font-semibold text-gray-700">Date</th>
                      <th className="p-4 font-semibold text-gray-700">Price</th>
                      <th className="p-4 font-semibold text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockOrders.map((order, i) => (
                      <tr key={i} className="border-b hover:bg-gray-50">
                        <td className="p-4 font-medium text-green-900">{order.id}</td>
                        <td className="p-4 text-gray-800">{order.product}</td>
                        <td className="p-4 text-gray-600">{order.artisan}</td>
                        <td className="p-4 text-gray-600">{order.date}</td>
                        <td className="p-4 font-bold text-gray-900">{order.total}</td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'wishlist' && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-xl font-bold text-green-900 mb-6">My Wishlist</h3>
              {wishlist.length === 0 ? (
                <div className="text-center py-12">
                  <Heart className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                  <p className="text-gray-500">Your wishlist is empty.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {wishlist.map(product => (
                    <div key={product.id} className="relative">
                      <JuthoorProductCard product={product} onClick={() => onProductClick(product.id)} />
                      <div className="mt-4 flex gap-2">
                        <button 
                          onClick={() => removeFromWishlist(product.id)}
                          className="flex-1 py-2 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition"
                        >
                          Remove
                        </button>
                        <button 
                          onClick={() => { onProductClick(product.id); }}
                          className="flex-1 py-2 text-sm font-semibold text-white bg-green-900 hover:bg-green-800 rounded-lg transition"
                        >
                          Buy Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-green-900">Account Settings</h3>
                {!isEditing && (
                  <button onClick={() => setIsEditing(true)} className="text-sm font-bold text-green-700 bg-green-50 px-4 py-2 rounded-lg hover:bg-green-100">
                    Edit Profile
                  </button>
                )}
              </div>
              <div className="max-w-md space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-500 mb-2">FULL NAME</label>
                  {isEditing ? (
                    <input type="text" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-600 outline-none" value={name} onChange={e => setName(e.target.value)} />
                  ) : <p className="font-bold text-gray-900">{user.full_name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-500 mb-2">EMAIL ADDRESS</label>
                  {isEditing ? (
                    <input type="email" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-600 outline-none" value={email} onChange={e => setEmail(e.target.value)} />
                  ) : <p className="font-bold text-gray-900">{user.email}</p>}
                </div>
                {isEditing && (
                  <div>
                    <label className="block text-sm font-bold text-gray-500 mb-2">NEW PASSWORD</label>
                    <input type="password" placeholder="Leave blank to keep current password" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-600 outline-none" />
                  </div>
                )}
                {isEditing && (
                  <div className="flex gap-4 pt-4">
                    <button onClick={handleUpdate} disabled={loading} className="flex-1 bg-green-900 text-white py-3 rounded-lg font-bold hover:bg-green-800 transition flex items-center justify-center gap-2">
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} Save
                    </button>
                    <button onClick={() => setIsEditing(false)} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-200 transition">Cancel</button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
