import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Mail, Lock, User as UserIcon, Loader2, ArrowRight, Shield } from 'lucide-react';

export function Signup({ onBack, onNavigateToLogin, onSuccess }: { onBack: () => void, onNavigateToLogin: () => void, onSuccess: () => void }) {
  const { signUp } = useAuth();
  const { dir, t } = useLanguage();
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'buyer' | 'artisan' | 'admin'>('buyer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signUp(email, password, { full_name: fullName, user_type: role });
      onSuccess();
    } catch (err: any) {
      setError(err.message || t('signup_error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center p-4 md:p-6" dir={dir}>
      <div className="max-w-md w-full bg-white rounded-3xl md:rounded-[2.5rem] shadow-2xl p-6 md:p-10 border border-green-100 animate-fadeIn">
        <div className="text-center mb-10">
          <img src="/image.png" alt="Juthoor" className="h-20 w-20 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-green-900">{t('join_journey')}</h1>
          <p className="text-gray-500 mt-2">{t('signup_subtitle')}</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-semibold border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Account Type</label>
            <div className="relative">
              <Shield className={`absolute ${dir === 'rtl' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5`} />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className={`w-full ${dir === 'rtl' ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-600 transition appearance-none`}
              >
                <option value="buyer">Buyer</option>
                <option value="artisan">Artisan</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">{t('full_name')}</label>
            <div className="relative">
              <UserIcon className={`absolute ${dir === 'rtl' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5`} />
              <input 
                type="text" 
                required 
                className={`w-full ${dir === 'rtl' ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-600 transition`} 
                placeholder={t('full_name_placeholder')}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">{t('email_address')}</label>
            <div className="relative">
              <Mail className={`absolute ${dir === 'rtl' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5`} />
              <input 
                type="email" 
                required 
                className={`w-full ${dir === 'rtl' ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-600 transition`} 
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">{t('password')}</label>
            <div className="relative">
              <Lock className={`absolute ${dir === 'rtl' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5`} />
              <input 
                type="password" 
                required 
                className={`w-full ${dir === 'rtl' ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-600 transition`} 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            disabled={loading}
            className="w-full bg-green-900 text-white py-4 rounded-2xl font-bold text-lg hover:bg-green-800 transition flex items-center justify-center gap-2 shadow-lg disabled:opacity-75"
          >
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                {t('create_account_btn')}
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-gray-600">
          <p>{t('already_account')}</p>
          <button 
            onClick={onNavigateToLogin}
            className="text-green-800 font-bold hover:underline mt-2"
          >
            {t('log_in')}
          </button>
        </div>

        <button 
          onClick={onBack}
          className="w-full mt-6 text-gray-400 hover:text-gray-600 transition text-sm font-medium"
        >
          {t('back_browsing')}
        </button>
      </div>
    </div>
  );
}
