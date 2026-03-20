const AdminAdMeta = ({ ad, propertyTypeLabel, formattedPrice }) => (
  <div className="space-y-8">
    <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-800 dark:via-slate-800 dark:to-slate-700 rounded-2xl p-8 shadow-xl border border-white dark:border-slate-700">
      <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">اطلاعات اصلی</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border">📍 {ad.province} - {ad.city}</div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border">🏠 {propertyTypeLabel}</div>
        {ad.area && <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border">📏 {ad.area} متر مربع</div>}
        {ad.rooms && <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border">🛏️ {ad.rooms} خواب</div>}
        {ad.price && <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-xl border col-span-full">💰 {formattedPrice}</div>}
      </div>
    </div>

    <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-gray-200 dark:border-slate-700 shadow-xl">
      <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">توضیحات</h3>
      <p className="text-gray-700 dark:text-slate-200 leading-relaxed text-lg">{ad.description}</p>
    </div>
  </div>
);

export default AdminAdMeta;
