import { useLanguage } from '../contexts/LanguageContext';
import { ArrowRight } from 'lucide-react';

type HeroProps = {
  onNavigate?: (view: string) => void;
};

export function Hero({ onNavigate }: HeroProps) {
  const { t, dir } = useLanguage();

  return (
    <section className="relative overflow-hidden py-20 min-h-[80vh] flex items-center bg-black" dir={dir}>
      {/* Fullscreen Video Background - No Overlay */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/Palestine_Juthoor.mp4" type="video/mp4" />
      </video>

      <div className="max-w-7xl mx-auto px-6 py-20 relative z-10 w-full">
        <div className="flex flex-col md:flex-row items-center">
          <div className={`w-full md:w-2/3 lg:w-1/2 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 [text-shadow:_0_2px_10px_rgb(0_0_0_/_80%)]">
              Juthoor
              <br className="md:hidden" />
              <span className="text-amber-400"> - جذور</span>
            </h2>
            <p className="text-2xl text-white mb-4 font-semibold [text-shadow:_0_2px_8px_rgb(0_0_0_/_80%)]">{t('tagline')}</p>
            <p className="text-lg text-white mb-8 leading-relaxed max-w-xl [text-shadow:_0_2px_8px_rgb(0_0_0_/_80%)]">
              {t('hero_description')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => onNavigate?.('products')}
                className="bg-amber-600 hover:bg-amber-500 text-white px-8 py-4 rounded-lg font-semibold transition transform hover:scale-105 flex items-center justify-center gap-2 shadow-[0_4px_14px_0_rgb(0,0,0,0.5)]"
              >
                {t('products')}
                <ArrowRight className="w-5 h-5" />
              </button>
              <button 
                onClick={() => onNavigate?.('artisans')}
                className="border-2 border-white text-white hover:bg-white/20 px-8 py-4 rounded-lg font-semibold transition shadow-[0_4px_14px_0_rgb(0,0,0,0.5)] backdrop-blur-sm [text-shadow:_0_1px_4px_rgb(0_0_0_/_80%)]"
              >
                {t('support_palestinians')}
              </button>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-6 bg-black/40 p-6 rounded-2xl backdrop-blur-md border border-white/20 shadow-2xl">
              <div>
                <p className="text-3xl font-bold text-amber-400 [text-shadow:_0_2px_4px_rgb(0_0_0_/_80%)]">500+</p>
                <p className="text-sm text-white font-medium [text-shadow:_0_1px_3px_rgb(0_0_0_/_80%)]">{t('featured_products')}</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-amber-400 [text-shadow:_0_2px_4px_rgb(0_0_0_/_80%)]">150+</p>
                <p className="text-sm text-white font-medium [text-shadow:_0_1px_3px_rgb(0_0_0_/_80%)]">{t('artisans')}</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-amber-400 [text-shadow:_0_2px_4px_rgb(0_0_0_/_80%)]">50+</p>
                <p className="text-sm text-white font-medium [text-shadow:_0_1px_3px_rgb(0_0_0_/_80%)]">{t('countries')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
