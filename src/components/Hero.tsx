import { useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { ArrowRight } from 'lucide-react';

type HeroProps = {
  onNavigate?: (view: string) => void;
};

// Detect mobile once at module level (avoids repeated queries inside effect)
const isMobile = () =>
  typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches;

export function Hero({ onNavigate }: HeroProps) {
  const { t, dir } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // ── 1. Pick the right source based on device width ──────────────────
    //    Mobile  → 480p / 0.76 MB — starts instantly on any mobile network
    //    Desktop → 720p / 7.86 MB — good quality, still 82% smaller than original
    const src = '/hero-mobile.mp4';

    // Only swap the src if it's different (avoids unnecessary reload on re-render)
    if (!video.currentSrc.endsWith(src)) {
      video.src = src;
      // preload="metadata" on mobile: streams rather than downloading the whole file
      // preload="auto" on desktop: buffer immediately for zero-delay start
      video.preload = isMobile() ? 'metadata' : 'auto';
      video.load();
    }

    // ── 2. Force play as soon as enough data is buffered ─────────────────
    const tryPlay = () => {
      video.play().catch(() => {
        // Autoplay blocked — poster image stays visible as fallback
      });
    };

    if (video.readyState >= 3) {
      tryPlay();
    } else {
      video.addEventListener('canplay', tryPlay, { once: true });
    }

    // ── 3. Enforce loop — backup in case the `loop` attribute is ignored ─
    //    Some Android browsers (especially older WebViews) don't honour `loop`
    const handleEnded = () => {
      video.currentTime = 0;
      tryPlay();
    };
    video.addEventListener('ended', handleEnded);

    // ── 4. Resume play when user returns to the tab ───────────────────────
    //    Mobile browsers pause background tabs; restart seamlessly on return.
    const handleVisibility = () => {
      if (!document.hidden && video.paused) {
        tryPlay();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      video.removeEventListener('canplay', tryPlay);
      video.removeEventListener('ended', handleEnded);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  return (
    <section
      className="relative overflow-hidden py-12 md:py-20 min-h-[60vh] md:min-h-[80vh] flex items-center bg-black"
      dir={dir}
    >
      {/* ── Hero Video Background ──────────────────────────────────────── */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted         // Required for autoplay on iOS & Android Chrome
        playsInline   // Required for inline play on iOS (prevents fullscreen takeover)
        preload="auto"
        style={{ backgroundColor: '#1a1a1a' }}
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        {/*
          Sources are set dynamically in useEffect based on device width.
          The <source> below is the SSR / no-JS fallback only.
        */}
        <source src="/hero-mobile.mp4" type="video/mp4" />
      </video>

      {/* ── Hero Content ──────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-20 relative z-10 w-full">
        <div className="flex flex-col md:flex-row items-center">
          <div className={`w-full md:w-2/3 lg:w-1/2 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 [text-shadow:_0_2px_10px_rgb(0_0_0_/_80%)]">
              Juthoor
              <br className="md:hidden" />
              <span className="text-amber-400"> - جذور</span>
            </h2>
            <p className="text-2xl text-white mb-4 font-semibold [text-shadow:_0_2px_8px_rgb(0_0_0_/_80%)]">
              {t('tagline')}
            </p>
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

            <div className="mt-8 md:mt-12 grid grid-cols-3 gap-3 md:gap-6 bg-black/40 p-3 md:p-6 rounded-2xl backdrop-blur-md border border-white/20 shadow-2xl">
              <div>
                <p className="text-xl md:text-3xl font-bold text-amber-400 [text-shadow:_0_2px_4px_rgb(0_0_0_/_80%)]">500+</p>
                <p className="text-[10px] md:text-sm text-white font-medium [text-shadow:_0_1px_3px_rgb(0_0_0_/_80%)]">{t('featured_products')}</p>
              </div>
              <div>
                <p className="text-xl md:text-3xl font-bold text-amber-400 [text-shadow:_0_2px_4px_rgb(0_0_0_/_80%)]">150+</p>
                <p className="text-[10px] md:text-sm text-white font-medium [text-shadow:_0_1px_3px_rgb(0_0_0_/_80%)]">{t('artisans')}</p>
              </div>
              <div>
                <p className="text-xl md:text-3xl font-bold text-amber-400 [text-shadow:_0_2px_4px_rgb(0_0_0_/_80%)]">50+</p>
                <p className="text-[10px] md:text-sm text-white font-medium [text-shadow:_0_1px_3px_rgb(0_0_0_/_80%)]">{t('countries')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
