import { useState, useEffect, memo } from 'react';

const Testimonials = memo(() => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: 'محمد رضایی',
      role: 'خریدار ملک',
      avatar: '👨‍💼',
      content: 'با استفاده از این پلتفرم توانستم خانه رویایی خود را در کمتر از یک هفته پیدا کنم. رابط کاربری عالی و اطلاعات کامل بود.',
      rating: 5
    },
    {
      id: 2,
      name: 'سارا احمدی',
      role: 'فروشنده ملک',
      avatar: '👩‍💼',
      content: 'ملک من در عرض چند روز فروش رفت. پشتیبانی عالی و فرآیند ثبت آگهی بسیار ساده بود.',
      rating: 5
    },
    {
      id: 3,
      name: 'علی محمدی',
      role: 'مستاجر',
      avatar: '👨‍💻',
      content: 'جستجوی پیشرفته و فیلترهای دقیق کمک کرد تا سریع‌تر خانه مورد نظرم را پیدا کنم.',
      rating: 4
    },
    {
      id: 4,
      name: 'مریم کریمی',
      role: 'سرمایه‌گذار',
      avatar: '👩‍💻',
      content: 'به عنوان سرمایه‌گذار، دسترسی به آمار و اطلاعات دقیق بازار برای من بسیار ارزشمند است.',
      rating: 5
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <svg
        key={i}
        className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <section className="py-16 bg-white dark:bg-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full text-sm font-medium mb-4">
            <span>💬</span>
            <span>نظرات کاربران</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            مشتریان ما چه می‌گویند
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            رضایت مشتریان اولویت اصلی ماست
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative max-w-4xl mx-auto">
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
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-700 dark:to-slate-600 rounded-3xl p-8 md:p-12 text-center shadow-xl">
                    {/* Avatar */}
                    <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center text-4xl mx-auto mb-6 shadow-lg">
                      {testimonial.avatar}
                    </div>

                    {/* Stars */}
                    <div className="flex justify-center gap-1 mb-6">
                      {renderStars(testimonial.rating)}
                    </div>

                    {/* Content */}
                    <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                      "{testimonial.content}"
                    </p>

                    {/* Author */}
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white text-lg">
                        {testimonial.name}
                      </p>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center gap-3 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'w-8 bg-gradient-to-r from-blue-500 to-purple-500'
                    : 'w-3 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={() => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-12 h-12 bg-white dark:bg-slate-700 rounded-full shadow-lg flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-600 transition-all duration-300 z-10"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % testimonials.length)}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 bg-white dark:bg-slate-700 rounded-full shadow-lg flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-600 transition-all duration-300 z-10"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
