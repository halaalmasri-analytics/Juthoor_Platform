import { useLanguage } from '../contexts/LanguageContext';
import { Heart, Instagram, ScanLine } from 'lucide-react';
import { JuthoorQRCode } from './JuthoorQRCode';
import { useEffect, useState } from 'react';

export function Footer() {
  const { t, dir } = useLanguage();
  const [animateQR, setAnimateQR] = useState(false);

  useEffect(() => {
    const handleLoad = () => {
      setTimeout(() => setAnimateQR(true), 500);
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, []);

  return (
    <footer className="bg-[#064e3b] text-white py-10 md:py-16 mt-12 md:mt-20" dir={dir}>
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-8 md:mb-12">
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <img src="/image.png" alt="Juthoor" className="h-8 w-8" />
              {t('juthoor')}
            </h3>
            <p className="text-green-100 text-sm leading-relaxed">
              {t('footer_desc')}
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">{t('navigation')}</h4>
            <ul className="space-y-2 text-green-100">
              <li>
                <a href="/" className="hover:text-white transition">
                  {t('home')}
                </a>
              </li>
              <li>
                <a href="/products" className="hover:text-white transition">
                  {t('products')}
                </a>
              </li>
              <li>
                <a href="/artisans" className="hover:text-white transition">
                  {t('artisans')}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">{t('community')}</h4>
            <ul className="space-y-2 text-green-100">
              <li>
                <a href="#" className="hover:text-white transition">
                  {t('become_artisan')}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  {t('heritage_stories')}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  {t('contact_us')}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">{t('legal')}</h4>
            <ul className="space-y-2 text-green-100">
              <li>
                <a href="#" className="hover:text-white transition">
                  {t('privacy_policy')}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  {t('terms_of_service')}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  {t('fair_trade_commitment')}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-green-700/50 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8">
            <div className="flex flex-col items-center md:items-start gap-4">
              <p className="text-green-100 flex items-center gap-2">
                {t('made_with_love')} <Heart className="w-4 h-4 text-red-500 fill-red-500" /> {t('for_palestine')}
              </p>
              <a 
                href="https://www.instagram.com/juthoor_djh?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white hover:text-green-200 transition-colors group"
                aria-label="Follow our journey on Instagram"
              >
                <Instagram className="w-5 h-5 stroke-[1.5]" />
                <span className="text-sm font-medium">{t('follow_journey')}</span>
              </a>
            </div>

            <p className="text-green-300 text-sm">
              {t('juthoor')} - {t('rooted_reaching')}
            </p>

            {/* QR Code Section — hidden on very small phones */}
            <div className="hidden sm:flex items-center gap-4">
              <div className="text-right">
                <div className="flex items-center gap-1.5 text-green-200 mb-1 justify-end">
                  <ScanLine className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">{t('scan_explore')}</span>
                </div>
                <p className="text-green-300/80 text-xs">{t('discover_artisans')}</p>
              </div>
              <div className={`rounded-xl overflow-hidden shadow-lg border border-white/20 transition-all duration-500 hover:scale-105 ${animateQR ? 'opacity-100 translate-y-0 animate-fadeIn' : 'opacity-0 translate-y-4'}`}>
                <img 
                  src="/QR.png" 
                  alt="Scan to explore" 
                  className="w-[150px] h-[150px] object-contain bg-white" 
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
