import CustomMap from '../CustomMap';

const AdminAdContact = ({ ad }) => (
  <div className="space-y-8">
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-gray-200 dark:border-slate-700 shadow-xl">
      <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">آدرس</h3>
      <p className="text-gray-700 dark:text-slate-200 text-lg">{ad.address}</p>
    </div>

    <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border border-gray-200 dark:border-slate-700 shadow-xl">
      <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">موقعیت مکانی</h3>
      <div className="h-80 rounded-xl overflow-hidden border-2 border-gray-100 dark:border-slate-700">
        <CustomMap center={[ad.lat, ad.lng]} zoom={15} title={ad.title} className="h-full" />
      </div>
    </div>

    <div className="bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-slate-800 dark:via-slate-800 dark:to-slate-700 rounded-2xl p-8 border border-gray-200 dark:border-slate-700 shadow-xl">
      <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">اطلاعات تماس</h3>
      <div className="space-y-4">
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border">📱 {ad.phone}</div>
        <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border">👤 {ad.sellerName || 'نامشخص'}</div>
      </div>
    </div>
  </div>
);

export default AdminAdContact;
