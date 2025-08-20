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
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden my-4 sm:my-8">
        <div className="absolute -top-16 -left-16 w-48 h-48 bg-purple-200 rounded-full blur-3xl opacity-40 pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-blue-200 rounded-full blur-3xl opacity-40 pointer-events-none" />

        <div className="p-4 sm:p-6 lg:p-8">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight">
              این وب‌سایت یک نمونه‌کار حرفه‌ای است
            </h3>
            <button 
              onClick={() => close()} 
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold p-2 -m-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
              aria-label="بستن"
            >
              ×
            </button>
          </div>

          <p className="text-gray-700 leading-7 sm:leading-8 mb-4 text-sm sm:text-base">
            با سلام! این پروژه به‌عنوان نمونه‌کار و رزومه توسط
            <span className="font-bold text-gray-900"> محمد سجادی‌خو (mmdcode)</span>
            توسعه داده شده است. هدف از این دمو، نمایش کیفیت کدنویسی، توجه به تجربه کاربری، و تسلط بر معماری سمت کلاینت و سرور می‌باشد.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6">
            <div className="p-3 sm:p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-gray-200">
              <div className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">تکنولوژی‌های کلاینت</div>
              <ul className="text-xs sm:text-sm text-gray-700 space-y-1 list-disc pr-4 sm:pr-5">
                <li>React + Vite</li>
                <li>TailwindCSS و طراحی Responsive</li>
                <li>Leaflet برای نقشه و تعاملات مکانی</li>
                <li>اکوسیستم مدرن جاوااسکریپت (ES Modules)</li>
              </ul>
            </div>
            <div className="p-3 sm:p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-gray-200">
              <div className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">تکنولوژی‌های سرور</div>
              <ul className="text-xs sm:text-sm text-gray-700 space-y-1 list-disc pr-4 sm:pr-5">
                <li>Node.js + Express</li>
                <li>آپلود فایل و مدیریت تصاویر</li>
                <li>RESTful API و ساختار ماژولار</li>
                <li>بهینه‌سازی برای استقرار آسان</li>
              </ul>
            </div>
          </div>

          <div className="p-3 sm:p-4 bg-white rounded-xl border border-gray-200 mb-6">
            <div className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">ویژگی‌های شاخص</div>
            <ul className="text-xs sm:text-sm text-gray-700 space-y-1 list-disc pr-4 sm:pr-5">
              <li>پیش‌نمایش زنده تصاویر با Drag & Drop و مرتب‌سازی</li>
              <li>جستجو و فیلتر پویا، شمارش بازدید و کلیک</li>
              <li>طراحی مینیمال با انیمیشن‌های ظریف و جزئیات UI</li>
              <li>کدنویسی خوانا، ماژولار و قابل نگهداری</li>
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <a 
              href="https://t.me/mmdcode" 
              target="_blank" 
              rel="noreferrer" 
              className="w-full text-center px-4 sm:px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold shadow hover:shadow-lg transform hover:scale-[1.02] transition text-sm sm:text-base"
            >
              ارتباط با محمد سجادی‌خو (mmdcode)
            </a>
            <button 
              onClick={() => close()} 
              className="w-full px-4 sm:px-5 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold bg-white hover:bg-gray-50 text-sm sm:text-base"
            >
              ورود به وب‌سایت
            </button>
            <button 
              onClick={() => close(true)} 
              className="w-full px-4 sm:px-5 py-2 rounded-xl text-gray-600 text-xs sm:text-sm hover:bg-gray-50"
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
