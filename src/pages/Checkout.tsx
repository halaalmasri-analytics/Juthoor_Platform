import { useCart } from '../contexts/CartContext';
import { useLanguage } from '../contexts/LanguageContext';
import { CreditCard, CheckCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { useState } from 'react';

type PaymentMethod = 'card' | 'paypal' | 'reflect';

export function Checkout({ onBack }: { onBack: () => void }) {
  const { cart, total, clearCart } = useCart();
  const { dir, t, language } = useLanguage();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const getName = (product: any) => {
    switch (language) {
      case 'ar': return product.name_ar;
      case 'fr': return product.name_fr || product.name_en;
      default: return product.name_en;
    }
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      clearCart();
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4 md:p-6 text-center" dir={dir}>
        <div className="max-w-md animate-fadeIn">
          <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-green-900 mb-4">{t('shukran')}</h1>
          <p className="text-xl text-gray-700 mb-8 leading-relaxed">
            {t('order_placed')}
          </p>
          <button 
            onClick={onBack}
            className="bg-green-900 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-green-800 transition shadow-lg transform hover:-translate-y-1"
          >
            {t('continue_shopping')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12" dir={dir}>
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        <button 
          onClick={onBack}
           className="flex items-center gap-2 text-green-900 hover:text-green-700 font-semibold mb-8 transition"
        >
          <ArrowLeft className={`w-5 h-5 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
          {t('back_to_cart')}
        </button>

        <div className="grid md:grid-cols-2 gap-6 md:gap-12">
          {/* Order Summary */}
          <div className="order-2 md:order-1">
            <h2 className="text-2xl font-bold text-green-900 mb-6">{t('order_summary')}</h2>
            <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
              <div className="p-6 space-y-4 max-h-[400px] overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white rounded border overflow-hidden">
                        <img src={item.product.image_url || ''} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-gray-900 line-clamp-1">{getName(item.product)}</p>
                        <p className="text-xs text-gray-500">{t('qty')}: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-bold text-green-800">${(item.product.price_usd * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <div className="p-6 bg-green-900 text-white border-t">
                <div className="flex justify-between items-center mb-2 opacity-80">
                  <span>{t('subtotal')}</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center mb-4 opacity-80">
                  <span>{t('shipping')}</span>
                  <span>{t('free')}</span>
                </div>
                <div className="flex justify-between items-center text-2xl font-bold border-t pt-4">
                  <span>{t('total')}</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div className="order-1 md:order-2">
            <h2 className="text-2xl font-bold text-green-900 mb-6">{t('payment')}</h2>
            <div className="bg-white rounded-2xl shadow-md p-6 md:p-8 border border-gray-100">
              <div className="flex gap-4 mb-8">
                <button 
                  onClick={() => setPaymentMethod('card')}
                  className={`flex-1 py-4 border-2 rounded-xl transition flex flex-col items-center gap-2 ${paymentMethod === 'card' ? 'border-green-800 bg-green-50' : 'border-gray-100 hover:border-gray-200'}`}
                >
                  <CreditCard className="w-6 h-6" />
                  <span className="text-xs font-bold uppercase">{t('card')}</span>
                </button>
                <button 
                  onClick={() => setPaymentMethod('paypal')}
                  className={`flex-1 py-4 border-2 rounded-xl transition flex flex-col items-center gap-2 ${paymentMethod === 'paypal' ? 'border-green-800 bg-green-50' : 'border-gray-100 hover:border-gray-200'}`}
                >
                  <div className="w-6 h-6 flex items-center justify-center font-bold text-blue-800 italic">P</div>
                  <span className="text-xs font-bold uppercase">PayPal</span>
                </button>
                <button 
                  onClick={() => setPaymentMethod('reflect')}
                  className={`flex-1 py-4 border-2 rounded-xl transition flex flex-col items-center gap-2 ${paymentMethod === 'reflect' ? 'border-green-800 bg-green-50' : 'border-gray-100 hover:border-gray-200'}`}
                >
                   <div className="w-6 h-6 flex items-center justify-center font-bold text-amber-500">R</div>
                  <span className="text-xs font-bold uppercase">Reflect</span>
                </button>
              </div>

              <form onSubmit={handlePayment} className="space-y-6">
                {paymentMethod === 'card' ? (
                  <>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">{t('card_holder')}</label>
                      <input type="text" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600" placeholder={t('full_name_placeholder')} />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">{t('card_number')}</label>
                      <input type="text" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600" placeholder={t('card_number_placeholder')} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">{t('expiry')}</label>
                        <input type="text" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600" placeholder="MM/YY" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">{t('cvc')}</label>
                        <input type="text" required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600" placeholder="000" />
                      </div>
                    </div>
                  </>
                ) : (
                   <div className="bg-gray-50 p-8 rounded-xl text-center">
                     <p className="text-gray-600">{t('redirect_payment', { provider: paymentMethod === 'paypal' ? 'PayPal' : 'Reflect' })}</p>
                   </div>
                )}

                <button 
                  disabled={isProcessing}
                  className="w-full bg-green-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-800 transition flex items-center justify-center gap-2 shadow-lg disabled:opacity-75 disabled:cursor-not-allowed mt-8"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      {t('processing')}
                    </>
                  ) : (
                    <>
                      {t('confirm_payment')}
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
