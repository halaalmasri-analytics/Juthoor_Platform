import { X, Mail, Lock, User as UserIcon, Loader2, ArrowRight, Shield } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

export function AuthModal({ 
  isOpen, 
  onClose, 
  initialTab = 'login',
  onSuccess 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  initialTab?: 'login' | 'signup';
  onSuccess: () => void;
}) {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>(initialTab);
  const { signIn, signUp } = useAuth();
  const { dir, t } = useLanguage();
  const modalRef = useRef<HTMLDivElement>(null);

  // States for Login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // States for Signup
  const [signupEmail, setSignupEmail] = useState('');
  const [signupFullName, setSignupFullName] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupRole, setSignupRole] = useState<'buyer' | 'artisan' | 'admin'>('buyer');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setError('');
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [initialTab, isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signIn(loginEmail, loginPassword);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || t('invalid_credentials'));
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signUp(signupEmail, signupPassword, { full_name: signupFullName, user_type: signupRole });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || t('signup_error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div 
        ref={modalRef}
        className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden relative animate-fadeIn"
        dir={dir}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className={`absolute top-6 ${dir === 'rtl' ? 'left-6' : 'right-6'} text-gray-400 hover:text-gray-600 transition p-2 hover:bg-gray-100 rounded-full z-10`}
        >
          <X className="w-6 h-6" />
        </button>

        {/* Tabs */}
        <div className="flex border-b">
          <button 
            onClick={() => { setActiveTab('login'); setError(''); }}
            className={`flex-1 py-6 font-bold text-lg transition ${activeTab === 'login' ? 'text-green-900 border-b-4 border-green-900 bg-green-50/30' : 'text-gray-400 hover:text-gray-600'}`}
          >
            {t('sign_in')}
          </button>
          <button 
            onClick={() => { setActiveTab('signup'); setError(''); }}
            className={`flex-1 py-6 font-bold text-lg transition ${activeTab === 'signup' ? 'text-green-900 border-b-4 border-green-900 bg-green-50/30' : 'text-gray-400 hover:text-gray-600'}`}
          >
            {t('register') || 'Register'}
          </button>
        </div>

        <div className="p-8 md:p-10">
          <div className="text-center mb-8">
            <img src="/image.png" alt="Juthoor" className="h-16 w-16 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-green-900">
              {activeTab === 'login' ? t('welcome_back') : t('join_journey')}
            </h2>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-semibold border border-red-100">
              {error}
            </div>
          )}

          {activeTab === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">{t('email_address')}</label>
                <div className="relative">
                  <Mail className={`absolute ${dir === 'rtl' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5`} />
                  <input 
                    type="email" 
                    required 
                    className={`w-full ${dir === 'rtl' ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 transition`} 
                    placeholder="your@email.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-bold text-gray-700">{t('password')}</label>
                  <button type="button" className="text-xs text-green-800 font-bold hover:underline">
                    {t('forgot_password') || (dir === 'rtl' ? 'نسيت كلمة المرور؟' : 'Forgot password?')}
                  </button>
                </div>
                <div className="relative">
                  <Lock className={`absolute ${dir === 'rtl' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5`} />
                  <input 
                    type="password" 
                    required 
                    className={`w-full ${dir === 'rtl' ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 transition`} 
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4 mt-4">
                <button 
                  disabled={loading}
                  className="w-full bg-green-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-800 transition flex items-center justify-center gap-2 shadow-lg disabled:opacity-75"
                >
                  {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>{t('sign_in')} <ArrowRight className={`w-5 h-5 ${dir === 'rtl' ? 'rotate-180' : ''}`} /></>}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-gray-500 hover:text-green-800 transition font-medium text-sm text-center"
                >
                  {dir === 'rtl' ? 'العودة للتصفح →' : '← Back to browsing'}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Account Type</label>
                <div className="relative">
                  <Shield className={`absolute ${dir === 'rtl' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5`} />
                  <select
                    value={signupRole}
                    onChange={(e) => setSignupRole(e.target.value as any)}
                    className={`w-full ${dir === 'rtl' ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 transition appearance-none`}
                  >
                    <option value="buyer">Buyer</option>
                    <option value="artisan">Artisan</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">{t('full_name')}</label>
                <div className="relative">
                  <UserIcon className={`absolute ${dir === 'rtl' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5`} />
                  <input 
                    type="text" 
                    required 
                    className={`w-full ${dir === 'rtl' ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 transition`} 
                    placeholder={t('full_name_placeholder')}
                    value={signupFullName}
                    onChange={(e) => setSignupFullName(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">{t('email_address')}</label>
                <div className="relative">
                  <Mail className={`absolute ${dir === 'rtl' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5`} />
                  <input 
                    type="email" 
                    required 
                    className={`w-full ${dir === 'rtl' ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 transition`} 
                    placeholder="your@email.com"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">{t('password')}</label>
                <div className="relative">
                  <Lock className={`absolute ${dir === 'rtl' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5`} />
                  <input 
                    type="password" 
                    required 
                    className={`w-full ${dir === 'rtl' ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 transition`} 
                    placeholder="••••••••"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4 mt-6">
                <button 
                  disabled={loading}
                  className="w-full bg-green-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-800 transition flex items-center justify-center gap-2 shadow-lg disabled:opacity-75"
                >
                  {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>{t('create_account_btn')} <ArrowRight className={`w-5 h-5 ${dir === 'rtl' ? 'rotate-180' : ''}`} /></>}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-gray-500 hover:text-green-800 transition font-medium text-sm text-center"
                >
                  {dir === 'rtl' ? 'العودة للتصفح →' : '← Back to browsing'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
