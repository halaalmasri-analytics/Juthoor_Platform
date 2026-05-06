import { Languages } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2 bg-white rounded-full shadow-lg px-2 py-1 border border-green-100">
      <Languages className="w-4 h-4 text-green-900 mx-1" />
      <button
        onClick={() => setLanguage('en')}
        className={`px-3 py-1.5 rounded-full transition-all font-semibold text-sm ${
          language === 'en'
            ? 'bg-green-900 text-white'
            : 'text-gray-600 hover:bg-green-50'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('ar')}
        className={`px-3 py-1.5 rounded-full transition-all font-semibold text-sm ${
          language === 'ar'
            ? 'bg-green-900 text-white'
            : 'text-gray-600 hover:bg-green-50'
        }`}
      >
        AR
      </button>
      <button
        onClick={() => setLanguage('fr')}
        className={`px-3 py-1.5 rounded-full transition-all font-semibold text-sm ${
          language === 'fr'
            ? 'bg-green-900 text-white'
            : 'text-gray-600 hover:bg-green-50'
        }`}
      >
        FR
      </button>
    </div>
  );
}
