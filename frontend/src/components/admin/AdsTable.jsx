import { memo } from 'react';
import { Star } from 'lucide-react';
import { getEntityId } from '../../utils/entity';

const statusLabel = {
  approved: 'تایید شده',
  pending: 'در انتظار',
  rejected: 'رد شده',
};

const statusColor = {
  approved: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  rejected: 'bg-red-100 text-red-800',
};

const AdsTable = memo(({
  ads,
  selectedStatus,
  onStatusChange,
  onViewAd,
  onApprove,
  onReject,
  onDelete,
  onRateAd,
}) => (
  <div>
    <div className="mb-6">
      <select
        value={selectedStatus}
        onChange={(e) => onStatusChange(e.target.value)}
        className="px-4 py-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="all">همه آگهی‌ها</option>
        <option value="pending">در انتظار تایید</option>
        <option value="approved">تایید شده</option>
        <option value="rejected">رد شده</option>
      </select>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50 dark:bg-slate-800">
            <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 dark:text-slate-200">عنوان</th>
            <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 dark:text-slate-200">وضعیت</th>
            <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 dark:text-slate-200">امتیاز</th>
            <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 dark:text-slate-200">بازدید</th>
            <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 dark:text-slate-200">کلیک</th>
            <th className="px-4 py-3 text-right text-sm font-medium text-gray-700 dark:text-slate-200">عملیات</th>
          </tr>
        </thead>
        <tbody>
          {ads.map((ad) => (
            <tr key={getEntityId(ad)} className="border-b border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800/60">
              <td className="px-4 py-3">
                <div>
                  <div className="font-medium text-gray-900 dark:text-slate-100">{ad.title}</div>
                  <div className="text-sm text-gray-500 dark:text-slate-400">{ad.province} - {ad.city}</div>
                </div>
              </td>
              <td className="px-4 py-3">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColor[ad.status] || statusColor.rejected}`}>
                  {statusLabel[ad.status] || 'نامشخص'}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center space-x-1 space-x-reverse">
                  <span className="text-sm text-gray-900 dark:text-slate-100">{ad.stars || 0}/5</span>
                  <div className="flex space-x-0.5 space-x-reverse">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => onRateAd(getEntityId(ad), star)}
                        className={`${star <= (ad.stars || 0) ? 'text-yellow-500' : 'text-gray-300'} hover:text-yellow-400 transition-colors`}
                      >
                        <Star className="w-5 h-5 fill-current" />
                      </button>
                    ))}
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-gray-900 dark:text-slate-100">{ad.viewCount || 0}</td>
              <td className="px-4 py-3 text-sm text-gray-900 dark:text-slate-100">{ad.clickCount || 0}</td>
              <td className="px-4 py-3">
                <div className="flex space-x-2 space-x-reverse">
                  <button onClick={() => onViewAd(ad)} className="text-blue-600 hover:text-blue-800 text-sm">مشاهده</button>
                  {ad.status === 'pending' && (
                    <>
                      <button onClick={() => onApprove(getEntityId(ad))} className="text-green-600 hover:text-green-800 text-sm">تایید</button>
                      <button onClick={() => onReject(getEntityId(ad))} className="text-red-600 hover:text-red-800 text-sm">رد</button>
                    </>
                  )}
                  <button onClick={() => onDelete(getEntityId(ad))} className="text-red-600 hover:text-red-800 text-sm">حذف</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
));

AdsTable.displayName = 'AdsTable';
export default AdsTable;
