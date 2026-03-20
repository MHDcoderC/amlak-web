import { memo } from 'react';

const Footer = memo(() => {
  const currentYear = new Date().getFullYear();
  const persianYear = currentYear - 621; // Approximate Persian year

  const services = [
    { name: 'خرید ملک', icon: '🏠', link: '#' },
    { name: 'فروش ملک', icon: '💰', link: '#' },
    { name: 'اجاره ملک', icon: '🔑', link: '#' },
    { name: 'مشاوره املاک', icon: '📊', link: '#' },
    { name: 'سنجش اعتبار', icon: '✅', link: '#' },
    { name: 'برآورد قیمت', icon: '📈', link: '#' }
  ];

  const quickLinks = [
    { name: 'صفحه اصلی', link: '/' },
    { name: 'جستجوی پیشرفته', link: '/' },
    { name: 'ثبت آگهی', link: '/' },
    { name: 'راهنمای کاربر', link: '#' },
    { name: 'سوالات متداول', link: '#' },
    { name: 'تماس با ما', link: '#' }
  ];

  const socialLinks = [
    { name: 'اینستاگرام', icon: '📸', color: 'hover:text-pink-500', link: '#' },
    { name: 'تلگرام', icon: '✈️', color: 'hover:text-blue-500', link: '#' },
    { name: 'واتساپ', icon: '💬', color: 'hover:text-green-500', link: '#' },
    { name: 'لینکدین', icon: '💼', color: 'hover:text-blue-700', link: '#' }
  ];

  return (
    <footer className="bg-slate-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-blue-500/20 to-transparent" />

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">🏠</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-blue-400">
                  املاک ایران
                </h3>
                <p className="text-xs text-gray-400">ورژن ۲.۰</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              بهترین پلتفرم خرید و فروش املاک در ایران. با بیش از ۱۰ سال تجربه،
              ما بهترین خدمات را به مشتریان خود ارائه می‌دهیم.
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.link}
                  className={`w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-gray-400 ${social.color} hover:bg-slate-700 transition-all duration-300`}
                  title={social.name}
                >
                  <span className="text-lg">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
              <span className="w-8 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
              خدمات ما
            </h4>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.name}>
                  <a
                    href={service.link}
                    className="group flex items-center gap-3 text-gray-400 hover:text-white transition-all duration-300"
                  >
                    <span className="text-lg group-hover:scale-110 transition-transform">{service.icon}</span>
                    <span className="group-hover:translate-x-1 transition-transform">{service.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
              <span className="w-8 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
              دسترسی سریع
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.link}
                    className="group flex items-center gap-3 text-gray-400 hover:text-white transition-all duration-300"
                  >
                    <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span>{link.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
              <span className="w-8 h-1 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full" />
              تماس با ما
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-400">تلفن پشتیبانی</p>
                  <p className="text-white font-semibold">۰۲۱-۱۲۳۴۵۶۷۸</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-400">ایمیل</p>
                  <p className="text-white font-semibold">info@amlak.ir</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-400">آدرس</p>
                  <p className="text-white font-semibold">تهران، خیابان ولیعصر</p>
                </div>
              </li>
            </ul>

            {/* Newsletter */}
            <div className="mt-6 p-4 bg-slate-800 rounded-2xl">
              <p className="text-sm font-bold mb-2">عضویت در خبرنامه</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="ایمیل شما"
                  className="flex-1 px-3 py-2 bg-slate-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="px-4 py-2 bg-blue-600 rounded-lg text-sm font-bold hover:bg-blue-700 hover:shadow-lg transition-all duration-300">
                  عضویت
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © {persianYear} املاک ایران. تمامی حقوق محفوظ است.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-300">
                حریم خصوصی
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-300">
                شرایط استفاده
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-300">
                درباره ما
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';

export default Footer;
