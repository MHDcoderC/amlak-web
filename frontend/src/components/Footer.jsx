import { memo } from 'react';

const Footer = memo(() => {
  const currentYear = new Date().getFullYear();
  const persianYear = currentYear - 621;

  return (
    <footer className="bg-warm-900 text-warm-300 relative overflow-hidden">
      {/* Subtle pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      <div className="relative z-10 page-shell pt-12 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-brand-700 rounded-lg flex items-center justify-center">
                <span className="text-lg">🏠</span>
              </div>
              <div>
                <h3 className="text-base font-bold text-white">املاک ایران</h3>
                <p className="text-[10px] text-warm-500">نسخه ۲.۰</p>
              </div>
            </div>
            <p className="text-sm text-warm-400 leading-relaxed">
              پلتفرم خرید و فروش املاک با تمرکز بر تجربه کاربری ساده و سریع.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <span className="w-5 h-0.5 bg-brand-500 rounded-full" />
              دسترسی سریع
            </h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="text-warm-400 hover:text-white transition-colors">صفحه اصلی</a></li>
              <li><a href="/" className="text-warm-400 hover:text-white transition-colors">جستجوی پیشرفته</a></li>
              <li><a href="/" className="text-warm-400 hover:text-white transition-colors">ثبت آگهی</a></li>
              <li><a href="https://github.com/MHDcoderC/amlak-web" target="_blank" rel="noopener noreferrer" className="text-warm-400 hover:text-white transition-colors">سورس کد</a></li>
            </ul>
          </div>

          {/* Tech */}
          <div>
            <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <span className="w-5 h-0.5 bg-brand-500 rounded-full" />
              تکنولوژی
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {['React', 'Vite', 'Express', 'MongoDB', 'Tailwind'].map(t => (
                <span key={t} className="px-2 py-1 bg-warm-800 border border-warm-700 rounded text-xs text-warm-300">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-5 border-t border-warm-800 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-warm-500">
          <p>© {persianYear} املاک ایران · Mohammad Sajjadi (mmcode)</p>
          <div className="flex gap-4">
            <a href="https://amlak.mmdcode.top/" target="_blank" rel="noopener noreferrer" className="hover:text-warm-300 transition-colors">دمو</a>
            <a href="https://github.com/MHDcoderC/amlak-web" target="_blank" rel="noopener noreferrer" className="hover:text-warm-300 transition-colors">GitHub</a>
          </div>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';

export default Footer;
