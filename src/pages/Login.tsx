import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';

export function Login({ onBack, onNavigateToSignup, onSuccess }: { onBack: () => void, onNavigateToSignup: () => void, onSuccess: () => void }) {
  const { signIn } = useAuth();
  const { dir, t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signIn(email, password);
      onSuccess();
    } catch (err: any) {
      setError(err.message || t('invalid_credentials'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center p-6" dir={dir}>
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 border border-green-100 animate-fadeIn">
        <div className="text-center mb-10">
          <img src="/image.png" alt="Juthoor" className="h-20 w-20 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-green-900">{t('welcome_back')}</h1>
          <p className="text-gray-500 mt-2">{t('login_subtitle')}</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-semibold border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
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
                {t('sign_in')}
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-gray-600">
          <p>{t('no_account')}</p>
          <button 
            onClick={onNavigateToSignup}
            className="text-green-800 font-bold hover:underline mt-2"
          >
            {t('create_account')}
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
