import { useCallback, useMemo, memo, useRef, useEffect } from 'react';
import { PRICE_SLIDER_STEPS, formatPriceTomanShort } from '../data/priceFilters';

/**
 * اسلایدر دوکَله قیمت — جهت راست‌به‌چپ (ارزان‌تر راست، گران‌تر چپ).
 * leftVal: ۰ = بدون حداقل، ۱…n = steps[leftVal-1]
 * rightVal: n+1 = بدون سقف، ۱…n = steps[rightVal-1]
 */
const PriceRangeSlider = memo(({ minStr, maxStr, onChange, className = '' }) => {
  const steps = PRICE_SLIDER_STEPS;
  const n = steps.length;
  const maxRight = n + 1;

  const { leftVal, rightVal } = useMemo(() => {
    if (n === 0) return { leftVal: 0, rightVal: 1 };

    let L = 0;
    if (minStr) {
      const idx = steps.indexOf(Number(minStr));
      L = idx === -1 ? 0 : idx + 1;
    }

    let R = maxRight;
    if (maxStr) {
      const idx = steps.indexOf(Number(maxStr));
      R = idx === -1 ? maxRight : idx + 1;
    }

    if (L >= n) L = n;
    if (R < 1) R = 1;
    if (R > maxRight) R = maxRight;
    if (L >= R) {
      if (R <= 1) R = Math.min(maxRight, L + 1);
      else L = Math.max(0, R - 1);
    }
    return { leftVal: L, rightVal: R };
  }, [minStr, maxStr, n, maxRight, steps]);

  const emit = useCallback(
    (L, R) => {
      let l = L;
      let r = R;
      if (l >= r) {
        if (r <= 1) r = Math.min(maxRight, l + 1);
        else l = Math.max(0, r - 1);
      }
      const nextMin = l <= 0 ? '' : String(steps[l - 1]);
      const nextMax = r >= maxRight ? '' : String(steps[r - 1]);
      onChange({ min: nextMin, max: nextMax });
    },
    [onChange, steps, maxRight]
  );

  const handleLeft = useCallback(
    (e) => {
      const L = Number(e.target.value);
      emit(L, rightVal);
    },
    [emit, rightVal]
  );

  const handleRight = useCallback(
    (e) => {
      const R = Number(e.target.value);
      emit(leftVal, R);
    },
    [emit, leftVal]
  );

  const minInputRef = useRef(null);
  const maxInputRef = useRef(null);

  useEffect(() => {
    const minEl = minInputRef.current;
    const maxEl = maxInputRef.current;
    if (!minEl || !maxEl) return;
    if (leftVal >= rightVal - 1) {
      maxEl.style.zIndex = '30';
      minEl.style.zIndex = '20';
    } else {
      minEl.style.zIndex = '30';
      maxEl.style.zIndex = '20';
    }
  }, [leftVal, rightVal]);

  /** هر دو دستگیره روی یک مقیاس ۰…n+۱ نمایش داده می‌شوند */
  const scale = maxRight;
  const minPct = useMemo(() => (scale <= 0 ? 0 : (leftVal / scale) * 100), [leftVal, scale]);
  const maxPct = useMemo(() => (scale <= 0 ? 100 : (rightVal / scale) * 100), [rightVal, scale]);

  const labelMin = leftVal <= 0 ? 'بدون حداقل' : formatPriceTomanShort(steps[leftVal - 1]);
  const labelMax = rightVal >= maxRight ? 'بدون سقف' : formatPriceTomanShort(steps[rightVal - 1]);

  if (n === 0) return null;

  return (
    <div className={`space-y-4 ${className}`} dir="rtl">
      <div className="flex justify-between gap-3 text-sm font-semibold text-warm-800 dark:text-warm-100">
        <div className="text-right">
          <span className="text-xs text-warm-500 dark:text-warm-400 block mb-0.5">حداقل</span>
          <span className="text-brand-700 dark:text-brand-300">{labelMin}</span>
        </div>
        <div className="text-left">
          <span className="text-xs text-warm-500 dark:text-warm-400 block mb-0.5">حداکثر</span>
          <span className="text-brand-700 dark:text-brand-300">{labelMax}</span>
        </div>
      </div>

      <div className="relative mx-1 h-12 flex items-center" dir="rtl">
        <div className="pointer-events-none absolute inset-x-0 top-1/2 h-2.5 -translate-y-1/2 rounded-full bg-warm-200 dark:bg-warm-600" />
        <div
          className="pointer-events-none absolute top-1/2 h-2.5 -translate-y-1/2 rounded-full bg-brand-600"
          style={{
            insetInlineStart: `${minPct}%`,
            width: `${Math.max(0, maxPct - minPct)}%`,
          }}
        />
        <input
          ref={minInputRef}
          type="range"
          min={0}
          max={n}
          step={1}
          value={leftVal}
          onChange={handleLeft}
          className="price-range-input absolute inset-x-0 top-1/2 w-full -translate-y-1/2 cursor-pointer appearance-none bg-transparent"
          aria-label="حداقل قیمت"
        />
        <input
          ref={maxInputRef}
          type="range"
          min={1}
          max={maxRight}
          step={1}
          value={rightVal}
          onChange={handleRight}
          className="price-range-input absolute inset-x-0 top-1/2 w-full -translate-y-1/2 cursor-pointer appearance-none bg-transparent"
          aria-label="حداکثر قیمت"
        />
      </div>

      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 px-0.5">
        <span>ارزان‌تر</span>
        <span>{formatPriceTomanShort(steps[n - 1])} به بالا</span>
      </div>
    </div>
  );
});

PriceRangeSlider.displayName = 'PriceRangeSlider';

export default PriceRangeSlider;
