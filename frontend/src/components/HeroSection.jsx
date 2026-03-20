import { useState, useEffect, memo, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const HeroSection = memo(({ onSearch, onCreateAd, stats }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [imagesLoaded, setImagesLoaded] = useState([false, false, false]);
  const navigate = useNavigate();

  // Local images - downloaded to public/images/hero/
  const slides = useMemo(() => ([
    {
      image: '/images/hero/hero-1.jpg',
      title: 'خانه رویایی خود را پیدا کنید',
      subtitle: 'بیش از ۱۰,۰۰۰ ملک منتظر شماست'
    },
    {
      image: '/images/hero/hero-2.jpg',
      title: 'ویلاهای لوکس در بهترین مناطق',
      subtitle: 'زندگی با استانداردهای جهانی'
    },
    {
      image: '/images/hero/hero-3.jpg',
      title: 'آپارتمان‌های مدرن شهر',
      subtitle: 'در قلب تهران و شهرهای بزرگ'
    }
  ]), []);

  // Preload images
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

  // Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
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
    { value: stats?.coveredCities ?? '—', label: 'شهر تحت پوشش' },
    { value: stats?.satisfaction ?? '—', label: 'رضایت مشتری' }
  ]), [stats]);

  return (
    <div className="relative h-[600px] md:h-[700px] lg:h-[800px] overflow-hidden">
      {/* Loading State */}
      {!allImagesLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white text-lg">در حال بارگذاری...</p>
          </div>
        </div>
      )}

      {/* Background Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center transform scale-105 transition-transform duration-[5000ms]"
            style={{
              backgroundImage: `url(${slide.image})`,
              transform: index === currentSlide ? 'scale(1.05)' : 'scale(1)'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        </div>
      ))}

      {/* Content */}
      <div className={`relative z-10 h-full flex flex-col items-center justify-center px-4 transition-opacity duration-500 ${allImagesLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 drop-shadow-2xl animate-fade-in">
            {slides[currentSlide].title}
          </h1>
          <p className="text-xl md:text-2xl lg:text-3xl text-white/90 drop-shadow-lg animate-fade-in-delay">
            {slides[currentSlide].subtitle}
          </p>
        </div>

        {/* Search Box */}
        <form
          onSubmit={handleSearch}
          className="w-full max-w-3xl bg-white/10 backdrop-blur-xl rounded-3xl p-4 shadow-2xl border border-white/20"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="شهر، محله یا نوع ملک را جستجو کنید..."
                className="w-full px-6 py-4 rounded-2xl bg-white/90 text-gray-800 placeholder-gray-500 focus:ring-4 focus:ring-blue-400/50 focus:outline-none text-lg transition-all duration-300"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl">🔍</span>
            </div>
            <button
              type="submit"
              className="px-8 py-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300 whitespace-nowrap"
            >
              جستجو
            </button>
          </div>
        </form>

        {/* Quick Stats */}
        <div className="flex flex-wrap justify-center gap-8 mt-12">
          {heroStats.map((stat, index) => (
            <div
              key={index}
              className="text-center text-white animate-fade-in-up"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="text-3xl md:text-4xl font-bold mb-1">{stat.value}</div>
              <div className="text-white/80 text-sm md:text-base">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <button
            onClick={scrollToListings}
            className="px-8 py-3 bg-white text-gray-900 rounded-full font-bold hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-xl"
          >
            مشاهده آگهی‌ها
          </button>
          <button
            onClick={onCreateAd}
            className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-full font-bold hover:bg-white/20 transform hover:scale-105 transition-all duration-300"
          >
            ثبت آگهی رایگان
          </button>
        </div>

        {/* Slide Indicators */}
        <div className="flex gap-2 mt-8">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-white w-8' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-blue-50 to-transparent dark:from-gray-900 z-20" />
    </div>
  );
});

HeroSection.displayName = 'HeroSection';

export default HeroSection;
