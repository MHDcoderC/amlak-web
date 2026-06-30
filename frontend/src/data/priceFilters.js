/**
 * گزینه‌های قیمت به تومان برای فیلتر پیشرفته.
 * مقادیر رشته‌ای برای هماهنگی با <select value={...}> و API (عدد صحیح).
 */

/** حداقل قیمت — خالی یعنی بدون کف */
export const PRICE_MIN_OPTIONS = [
  { value: '', label: 'بدون حداقل' },
  { value: '500000000', label: '۵۰۰ میلیون تومان' },
  { value: '1000000000', label: '۱ میلیارد تومان' },
  { value: '2000000000', label: '۲ میلیارد تومان' },
  { value: '3000000000', label: '۳ میلیارد تومان' },
  { value: '5000000000', label: '۵ میلیارد تومان' },
  { value: '7000000000', label: '۷ میلیارد تومان' },
  { value: '10000000000', label: '۱۰ میلیارد تومان' },
  { value: '15000000000', label: '۱۵ میلیارد تومان' },
  { value: '20000000000', label: '۲۰ میلیارد تومان' },
  { value: '30000000000', label: '۳۰ میلیارد تومان' },
  { value: '50000000000', label: '۵۰ میلیارد تومان' },
  { value: '100000000000', label: '۱۰۰ میلیارد تومان' },
];

/** حداکثر قیمت — خالی یعنی بدون سقف */
export const PRICE_MAX_OPTIONS = [
  { value: '', label: 'بدون سقف' },
  { value: '1000000000', label: '۱ میلیارد تومان' },
  { value: '2000000000', label: '۲ میلیارد تومان' },
  { value: '3000000000', label: '۳ میلیارد تومان' },
  { value: '5000000000', label: '۵ میلیارد تومان' },
  { value: '7000000000', label: '۷ میلیارد تومان' },
  { value: '10000000000', label: '۱۰ میلیارد تومان' },
  { value: '15000000000', label: '۱۵ میلیارد تومان' },
  { value: '20000000000', label: '۲۰ میلیارد تومان' },
  { value: '30000000000', label: '۳۰ میلیارد تومان' },
  { value: '50000000000', label: '۵۰ میلیارد تومان' },
  { value: '100000000000', label: '۱۰۰ میلیارد تومان' },
  { value: '200000000000', label: '۲۰۰ میلیارد تومان' },
];

/**
 * پیش‌تنظیم سریع بازه — برای کلیک یک‌مرحله‌ای
 */
export const PRICE_PRESETS = [
  { id: 'under1b', label: 'زیر ۱ میلیارد', min: '', max: '1000000000' },
  { id: '1to5', label: '۱ تا ۵ میلیارد', min: '1000000000', max: '5000000000' },
  { id: '5to20', label: '۵ تا ۲۰ میلیارد', min: '5000000000', max: '20000000000' },
  { id: '20to50', label: '۲۰ تا ۵۰ میلیارد', min: '20000000000', max: '50000000000' },
  { id: 'over50', label: 'بالای ۵۰ میلیارد', min: '50000000000', max: '' },
];

/** مراحل یکنواخت قیمت (تومان) — برای اسلایدر دوکَله */
export const PRICE_SLIDER_STEPS = Array.from(
  new Set([
    ...PRICE_MIN_OPTIONS.filter((o) => o.value).map((o) => Number(o.value)),
    ...PRICE_MAX_OPTIONS.filter((o) => o.value).map((o) => Number(o.value)),
  ])
).sort((a, b) => a - b);

/** نمایش کوتاه قیمت برای فیلتر و اسلایدر */
export function formatPriceTomanShort(value) {
  if (value == null || Number.isNaN(Number(value))) return '—';
  const n = Number(value);
  if (n >= 1e9) {
    const b = n / 1e9;
    const t = b % 1 === 0 ? b.toLocaleString('fa-IR') : b.toLocaleString('fa-IR', { maximumFractionDigits: 1 });
    return `${t} میلیارد تومان`;
  }
  if (n >= 1e6) {
    const m = Math.round(n / 1e6);
    return `${m.toLocaleString('fa-IR')} میلیون تومان`;
  }
  return `${n.toLocaleString('fa-IR')} تومان`;
}

export function getPriceRangeSummaryText(minStr, maxStr) {
  if (!minStr && !maxStr) return 'هر قیمتی';
  if (!minStr && maxStr) return `حداکثر ${formatPriceTomanShort(maxStr)}`;
  if (minStr && !maxStr) return `از ${formatPriceTomanShort(minStr)} به بالا`;
  return `${formatPriceTomanShort(minStr)} — ${formatPriceTomanShort(maxStr)}`;
}
