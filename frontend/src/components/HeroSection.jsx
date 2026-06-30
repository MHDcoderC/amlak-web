import { useState, useEffect, memo, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const HeroSection = memo(({ onSearch, onCreateAd, stats }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [imagesLoaded, setImagesLoaded] = useState([false, false, false]);
  const navigate = useNavigate();

  const slides = useMemo(() => ([
    {
      image: '/images/hero/hero-1.jpg',
      title: 'ملک مورد نظرت رو پیدا کن',
      subtitle: 'هزاران آگهی فعال در سراسر کشور'
    },
    {
      image: '/images/hero/hero-2.jpg',
      title: 'ویلا و خانه در بهترین مناطق',
      subtitle: 'زندگی رو اینجا شروع کن'
    },
    {
      image: '/images/hero/hero-3.jpg',
      title: 'آپارتمان‌های مدرن و شیک',
      subtitle: 'در قلب شهرهای بزرگ'
    }
  ]), []);

  useEffect(() => {
    slides.forEach((slide, index) => {
      const img = new Image();
      img.src = slide.image;
      img.onload = () => {
        setImagesLoaded(prev => {
          const newState = [...prev];
          newState[index] = true;
          return newState;
        });
      };
    });
  }, [slides]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch({ searchTerm: searchTerm.trim() });
      navigate('/');
    }
  };

  const scrollToListings = () => {
    const element = document.getElementById('listings-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const allImagesLoaded = imagesLoaded.every(Boolean);
  const heroStats = useMemo(() => ([
    { value: stats?.activeAds ?? '—', label: 'ملک فعال' },
    { value: stats?.coveredCities ?? '—', label: 'شهر' },
    { value: stats?.satisfaction ?? '—', label: 'رضایت' }
  ]), [stats]);

  return (
    <div className="relative h-[550px] md:h-[650px] lg:h-[720px] overflow-hidden">
      {/* Loading State */}
      {!allImagesLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="w-12 h-12 border-[3px] border-white/20 border-t-white rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-white/90 text-sm font-medium">در حال بارگذاری...</p>
          </div>
        </div>
      )}

      {/* Background Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-[1200ms] ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-[6000ms]"
            style={{
              backgroundImage: `url(${slide.image})`,
              transform: index === currentSlide ? 'scale(1.04)' : 'scale(1)'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/15" />
        </div>
      ))}

      {/* Content */}
      <div className={`relative z-10 h-full flex flex-col items-center justify-center page-shell transition-opacity duration-500 ${allImagesLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-3 leading-tight animate-fade-in">
            {slides[currentSlide].title}
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-white/80 animate-fade-in-delay font-medium">
            {slides[currentSlide].subtitle}
          </p>
        </div>

        {/* Search Box */}
        <form
          onSubmit={handleSearch}
          className="w-full max-w-2xl bg-white/10 backdrop-blur-xl rounded-xl p-3 shadow-2xl border border-white/15"
        >
          <div className="flex gap-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="شهر، محله یا نوع ملک رو سرچ کنید..."
              className="flex-1 px-5 py-3 rounded-lg bg-white/95 text-warm-900 placeholder-warm-400 focus:ring-2 focus:ring-brand-400/40 focus:outline-none text-sm transition-all duration-200"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-brand-600 text-white rounded-lg font-bold text-sm hover:bg-brand-700 transition-all duration-200 whitespace-nowrap shadow-lg"
            >
              جستجو
            </button>
          </div>
        </form>

        {/* Quick Stats */}
        <div className="flex flex-wrap justify-center gap-8 md:gap-12 mt-8">
          {heroStats.map((stat, index) => (
            <div
              key={index}
              className="text-center text-white animate-fade-in-up"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="text-2xl md:text-3xl font-black mb-0.5">{stat.value}</div>
              <div className="text-white/70 text-xs md:text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <button
            onClick={scrollToListings}
            className="px-6 py-2.5 bg-white text-warm-900 rounded-lg font-bold text-sm hover:bg-warm-50 transition-all duration-200 shadow-lg"
          >
            دیدن آگهی‌ها
          </button>
          <button
            onClick={onCreateAd}
            className="px-6 py-2.5 bg-transparent border border-white/40 text-white rounded-lg font-bold text-sm hover:bg-white/10 transition-all duration-200"
          >
            ثبت آگهی رایگان
          </button>
        </div>

        {/* Slide Indicators */}
        <div className="flex gap-1.5 mt-6">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-white w-6' : 'bg-white/40 w-1.5'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-warm-50 to-transparent dark:from-warm-900 z-20" />
    </div>
  );
});

HeroSection.displayName = 'HeroSection';

export default HeroSection;
