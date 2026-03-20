const PROPERTY_TYPE_LABELS_FA = {
  apartment: 'آپارتمان',
  villa: 'ویلا',
  office: 'دفتر کار',
  shop: 'مغازه',
  land: 'زمین'
};

export const getPropertyTypeLabelFa = (type) => PROPERTY_TYPE_LABELS_FA[type] || type;

export const formatPriceFa = (price) => {
  if (!price) return 'قیمت توافقی';
  return `${Number(price).toLocaleString()} تومان`;
};

const STATUS_META_FA = {
  pending: {
    text: '⏳ در انتظار تایید',
    color: 'bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700'
  },
  approved: {
    text: '✅ تایید شده',
    color: 'bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-700'
  },
  rejected: {
    text: '❌ رد شده',
    color: 'bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-700'
  }
};

export const getStatusMetaFa = (status) => STATUS_META_FA[status] || {
  text: status || 'نامشخص',
  color: 'bg-gradient-to-r from-gray-100 to-slate-100 dark:from-slate-700 dark:to-slate-800 text-gray-800 dark:text-slate-200 border-gray-200 dark:border-slate-600'
};
