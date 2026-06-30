import { useEffect, useState } from 'react';

const ShowcaseNoticeModal = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem('showcase_notice_seen_v1');
    if (!seen) setOpen(true);
  }, []);

  const close = (persist = true) => {
    if (persist) localStorage.setItem('showcase_notice_seen_v1', '1');
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-warm-200 overflow-hidden my-4 sm:my-8">
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-brand-200 rounded-full blur-3xl opacity-30 pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-brand-100 rounded-full blur-3xl opacity-30 pointer-events-none" />

        <div className="p-5 sm:p-6 lg:p-8">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-extrabold text-warm-900 leading-tight">
              این وب‌سایت یک نمونه‌کار حرفه‌ای است
            </h3>
            <button 
              onClick={() => close()} 
              className="text-warm-400 hover:text-warm-700 text-xl font-bold p-1 hover:bg-warm-100 rounded-lg transition-colors flex-shrink-0"
              aria-label="بستن"
            >
              ×
            </button>
          </div>

          <p className="text-warm-600 leading-7 mb-4 text-sm">
            با سلام! این پروژه به‌عنوان نمونه‌کار و رزومه توسط
            <span className="font-bold text-warm-900"> محمد سجادی‌خو (mmdcode)</span>
            توسعه داده شده. هدف از این دمو، نمایش کیفیت کدنویسی و توجه به تجربه کاربریه.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
            <div className="p-3 bg-warm-50 rounded-lg border border-warm-200">
              <div className="font-semibold text-warm-900 mb-1.5 text-xs">تکنولوژی‌های کلاینت</div>
              <ul className="text-xs text-warm-600 space-y-1 list-disc pr-4">
                <li>React + Vite</li>
                <li>TailwindCSS و طراحی Responsive</li>
                <li>Leaflet برای نقشه</li>
              </ul>
            </div>
            <div className="p-3 bg-warm-50 rounded-lg border border-warm-200">
              <div className="font-semibold text-warm-900 mb-1.5 text-xs">تکنولوژی‌های سرور</div>
              <ul className="text-xs text-warm-600 space-y-1 list-disc pr-4">
                <li>Node.js + Express</li>
                <li>RESTful API</li>
                <li>MongoDB</li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            <a 
              href="https://t.me/mmdcode" 
              target="_blank" 
              rel="noreferrer" 
              className="w-full text-center px-4 py-2.5 rounded-lg bg-brand-700 text-white font-bold text-sm hover:bg-brand-800 transition-colors"
            >
              ارتباط با محمد سجادی‌خو
            </a>
            <button 
              onClick={() => close()} 
              className="w-full px-4 py-2.5 rounded-lg border border-warm-200 text-warm-700 font-semibold bg-white hover:bg-warm-50 text-sm"
            >
              ورود به وب‌سایت
            </button>
            <button 
              onClick={() => close(true)} 
              className="w-full px-4 py-2 rounded-lg text-warm-500 text-xs hover:bg-warm-50"
            >
              دیگر نمایش نده
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowcaseNoticeModal;
