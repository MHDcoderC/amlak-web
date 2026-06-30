import { useState, useEffect, memo } from 'react';

const Testimonials = memo(() => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: 'رضا عباسی',
      role: 'خریدار',
      avatar: '🏠',
      content: 'خونه‌ای که می‌خواستم رو اینجا پیدا کردم. فیلتر قیمت و متراژ خیلی کمک کرد سریع‌تر تصمیم بگیرم.',
      rating: 5
    },
    {
      id: 2,
      name: 'نیلوفر شریفی',
      role: 'فروشنده',
      avatar: '🔑',
      content: 'آگهیمو زدم و ظرف یه هفته چند نفر زنگ زدن. فرآیند ثبت واقعاً ساده‌ست.',
      rating: 5
    },
    {
      id: 3,
      name: 'امیر حسینی',
      role: 'مشاور املاک',
      avatar: '📊',
      content: 'پنل مدیریت آگهی‌ها خیلی تمیزه. می‌تونم همه چیز رو یکجا ببینم و مدیریت کنم.',
      rating: 4
    },
    {
      id: 4,
      name: 'زهرا کاظمی',
      role: 'مستأجر',
      avatar: '🏢',
      content: 'نقشه تعاملیش عالیه. مستقیم روی نقشه دیدم ملک کجاست و بعد زنگ زدم.',
      rating: 5
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-brand-500' : 'text-warm-200 dark:text-warm-700'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <section className="py-12 bg-warm-50 dark:bg-warm-900">
      <div className="page-shell">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-100 dark:bg-brand-900/30 text-brand-800 dark:text-brand-300 rounded-lg text-xs font-semibold mb-3">
            <span>💬</span>
            <span>تجربه کاربران</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-warm-900 dark:text-white mb-2">
            کاربران چی میگن؟
          </h2>
          <p className="text-warm-500 dark:text-warm-400 text-sm max-w-md mx-auto">
            نظرات واقعی کسایی که از املاک ایران استفاده کردن
          </p>
        </div>

        {/* Testimonials */}
        <div className="relative max-w-3xl mx-auto">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="w-full flex-shrink-0 px-4"
                >
                  <div className="bg-white dark:bg-warm-800 rounded-xl p-6 md:p-8 text-center border border-warm-200 dark:border-warm-700">
                    <div className="w-14 h-14 bg-warm-100 dark:bg-warm-700 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                      {testimonial.avatar}
                    </div>

                    <div className="flex justify-center gap-0.5 mb-4">
                      {renderStars(testimonial.rating)}
                    </div>

                    <p className="text-sm md:text-base text-warm-700 dark:text-warm-300 mb-4 leading-relaxed">
                      «{testimonial.content}»
                    </p>

                    <div>
                      <p className="font-bold text-warm-900 dark:text-white text-sm">
                        {testimonial.name}
                      </p>
                      <p className="text-warm-500 dark:text-warm-400 text-xs">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-1.5 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'w-5 bg-brand-600'
                    : 'w-1.5 bg-warm-300 dark:bg-warm-600 hover:bg-warm-400'
                }`}
              />
            ))}
          </div>

          {/* Arrows */}
          <button
            onClick={() => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 w-9 h-9 bg-white dark:bg-warm-800 rounded-lg border border-warm-200 dark:border-warm-700 flex items-center justify-center text-warm-500 hover:text-warm-800 dark:hover:text-warm-200 transition-colors z-10"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % testimonials.length)}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 w-9 h-9 bg-white dark:bg-warm-800 rounded-lg border border-warm-200 dark:border-warm-700 flex items-center justify-center text-warm-500 hover:text-warm-800 dark:hover:text-warm-200 transition-colors z-10"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
});

Testimonials.displayName = 'Testimonials';

export default Testimonials;
