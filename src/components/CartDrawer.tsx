import { useCart } from '../contexts/CartContext';
import { useLanguage } from '../contexts/LanguageContext';
import { X, Plus, Minus, CreditCard, ShoppingBag } from 'lucide-react';

type CartDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
};

export function CartDrawer({ isOpen, onClose, onCheckout }: CartDrawerProps) {
  const { cart, removeFromCart, updateQuantity, total } = useCart();
  const { language, dir, t } = useLanguage();

  if (!isOpen) return null;

  const getName = (product: any) => {
    switch (language) {
      case 'ar': return product.name_ar;
      case 'fr': return product.name_fr || product.name_en;
      default: return product.name_en;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" dir={dir}>
      <div className="absolute inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
      
      <div className={`fixed inset-y-0 ${dir === 'rtl' ? 'left-0' : 'right-0'} max-w-full flex`}>
        <div className="w-screen max-w-md bg-white shadow-xl flex flex-col">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-2xl font-bold text-green-900 flex items-center gap-2">
              <ShoppingBag className="w-6 h-6" />
              {t('your_cart')}
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {cart.length === 0 ? (
              <div className="text-center py-20">
                <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="w-10 h-10 text-gray-400" />
                </div>
                <p className="text-xl font-semibold text-gray-800 mb-2">{t('cart_empty')}</p>
                <p className="text-gray-500 mb-8">{t('cart_empty_desc')}</p>
                <button 
                  onClick={onClose}
                  className="bg-green-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-800 transition"
                >
                  {t('start_shopping')}
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex gap-4">
                    <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                      <img 
                        src={item.product.image_url || ''} 
                        alt={getName(item.product)}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-gray-900 line-clamp-1">{getName(item.product)}</h3>
                        <p className="text-sm text-green-700 font-semibold mt-1">${item.product.price_usd.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border rounded-lg">
                          <button 
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="p-1 hover:bg-gray-100"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-3 font-bold">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="p-1 hover:bg-gray-100"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-red-500 hover:text-red-700 text-sm font-medium"
                        >
                          {t('remove')}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <div className="p-6 border-t bg-gray-50">
              <div className="flex justify-between items-center mb-6 text-xl font-bold">
                <span>{t('total')}</span>
                <span className="text-green-900">${total.toFixed(2)}</span>
              </div>
              <button 
                onClick={onCheckout}
                className="w-full bg-green-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-800 transition flex items-center justify-center gap-2 shadow-lg"
              >
                <CreditCard className="w-6 h-6" />
                {t('proceed_checkout')}
              </button>
              <p className="text-center text-xs text-gray-500 mt-4">
                {t('shipping_taxes')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
