import { useState, useCallback, useMemo, memo } from 'react';
import { Banknote } from 'lucide-react';
import { provinces } from '../data/provinces';
import { PRICE_PRESETS, getPriceRangeSummaryText } from '../data/priceFilters';
import PriceRangeSlider from './PriceRangeSlider';

const AddressSearch = memo(({ onSearch, className = '' }) => {
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  // Memoized available cities
  const availableCities = useMemo(() => {
    if (!selectedProvince) return [];
    const province = provinces.find(p => p.name === selectedProvince);
    return province ? province.cities : [];
  }, [selectedProvince]);

  // Calculate active filters count
  const calculateActiveFilters = useCallback(() => {
    let count = 0;
    if (selectedProvince) count++;
    if (selectedCity) count++;
    if (propertyType) count++;
    if (priceRange.min || priceRange.max) count++;
    if (searchTerm.trim()) count++;
    setActiveFiltersCount(count);
  }, [selectedProvince, selectedCity, propertyType, priceRange, searchTerm]);

  // Handle province change
  const handleProvinceChange = useCallback((e) => {
    const value = e.target.value;
    setSelectedProvince(value);
    setSelectedCity(''); // Reset city when province changes
  }, []);

  // Handle city change
  const handleCityChange = useCallback((e) => {
    setSelectedCity(e.target.value);
  }, []);

  // Handle search button click
  const handleSearch = useCallback(() => {
    let minVal = priceRange.min ? parseInt(priceRange.min, 10) : null;
    let maxVal = priceRange.max ? parseInt(priceRange.max, 10) : null;
    if (minVal != null && maxVal != null && minVal > maxVal) {
      const t = minVal;
      minVal = maxVal;
      maxVal = t;
      setPriceRange({
        min: minVal != null ? String(minVal) : '',
        max: maxVal != null ? String(maxVal) : ''
      });
    }

    const filters = {
      province: selectedProvince,
      city: selectedCity,
      propertyType,
      priceRange: {
        min: minVal,
        max: maxVal
      },
      searchTerm: searchTerm.trim()
    };

    onSearch(filters);
    calculateActiveFilters();

    // Scroll to listings
    const element = document.getElementById('listings-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedProvince, selectedCity, propertyType, priceRange, searchTerm, onSearch, calculateActiveFilters]);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setSelectedProvince('');
    setSelectedCity('');
    setPropertyType('');
    setPriceRange({ min: '', max: '' });
    setSearchTerm('');
    setActiveFiltersCount(0);
    onSearch({});
  }, [onSearch]);

  // Handle enter key in search input
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }, [handleSearch]);

  const propertyTypes = [
    { value: 'apartment', label: 'آپارتمان', icon: '🏢' },
    { value: 'villa', label: 'ویلا', icon: '🏡' },
    { value: 'office', label: 'دفتر', icon: '🏢' },
    { value: 'shop', label: 'مغازه', icon: '🏪' },
    { value: 'land', label: 'زمین', icon: '🌍' }
  ];

  const activePresetId = useMemo(
    () => PRICE_PRESETS.find((p) => p.min === priceRange.min && p.max === priceRange.max)?.id ?? null,
    [priceRange.min, priceRange.max]
  );

  const priceSummary = useMemo(
    () => getPriceRangeSummaryText(priceRange.min, priceRange.max),
    [priceRange.min, priceRange.max]
  );

  const applyPricePreset = useCallback((preset) => {
    setPriceRange({ min: preset.min, max: preset.max });
  }, []);

  return (
    <div className={`bg-white dark:bg-warm-800 rounded-xl border border-warm-200 dark:border-warm-700 overflow-hidden ${className}`}>
      {/* Header - Always Visible */}
      <div className="p-5 md:p-7">
        <div className="flex flex-col md:flex-row md:items-center gap-5 md:gap-6">
          {/* Quick Search */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="جستجو در عنوان، توضیحات، آدرس..."
              className="w-full pl-10 pr-4 py-2.5 bg-warm-50 dark:bg-warm-700 border border-warm-200 dark:border-warm-600 rounded-lg focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-colors duration-150 text-sm text-warm-900 dark:text-white placeholder-warm-400"
            />
          </div>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-bold text-sm transition-colors duration-150 flex items-center justify-center gap-1.5"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            جستجو
          </button>

          {/* Advanced Filter Toggle */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 flex items-center gap-1.5 border ${
              isExpanded
                ? 'bg-brand-50 dark:bg-brand-900/20 border-brand-200 dark:border-brand-700 text-brand-600 dark:text-brand-400'
                : 'bg-white dark:bg-warm-700 border-warm-200 dark:border-warm-600 text-warm-600 dark:text-warm-300 hover:bg-warm-50 dark:hover:bg-warm-600'
            }`}
          >
            <svg className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            فیلترها
            {activeFiltersCount > 0 && (
              <span className="w-5 h-5 bg-brand-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Clear Filters */}
          {activeFiltersCount > 0 && (
            <button
              onClick={clearFilters}
              className="px-3 py-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-sm font-medium transition-colors duration-150 flex items-center gap-1.5"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              پاک کردن
            </button>
          )}
        </div>
      </div>

      {/* Advanced Filters - Expandable */}
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[min(920px,90vh)] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-5 md:px-7 pb-7 border-t border-warm-100 dark:border-warm-700 overflow-y-auto max-h-[min(880px,88vh)]">
          <div className="pt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

            {/* Province Select */}
            <div>
              <label className="block text-xs font-bold text-warm-600 dark:text-warm-400 mb-1.5">
                استان
              </label>
              <div className="relative">
                <select
                  value={selectedProvince}
                  onChange={handleProvinceChange}
                  className="w-full px-3 py-2.5 pr-9 bg-warm-50 dark:bg-warm-700 border border-warm-200 dark:border-warm-600 rounded-lg focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-colors duration-150 text-sm text-warm-900 dark:text-white appearance-none cursor-pointer"
                >
                  <option value="">همه استان‌ها</option>
                  {provinces.map(province => (
                    <option key={province.name} value={province.name}>
                      {province.name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* City Select */}
            <div>
              <label className="block text-xs font-bold text-warm-600 dark:text-warm-400 mb-1.5">
                شهر
              </label>
              <div className="relative">
                <select
                  value={selectedCity}
                  onChange={handleCityChange}
                  disabled={!selectedProvince}
                  className="w-full px-3 py-2.5 pr-9 bg-warm-50 dark:bg-warm-700 border border-warm-200 dark:border-warm-600 rounded-lg focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-colors duration-150 text-sm text-warm-900 dark:text-white appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">{selectedProvince ? 'همه شهرها' : 'ابتدا استان را انتخاب کنید'}</option>
                  {availableCities.map(city => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Property Type */}
            <div>
              <label className="block text-xs font-bold text-warm-600 dark:text-warm-400 mb-1.5">
                نوع ملک
              </label>
              <div className="relative">
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full px-3 py-2.5 pr-9 bg-warm-50 dark:bg-warm-700 border border-warm-200 dark:border-warm-600 rounded-lg focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-colors duration-150 text-sm text-warm-900 dark:text-white appearance-none cursor-pointer"
                >
                  <option value="">همه انواع</option>
                  {propertyTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.icon} {type.label}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h4" />
                  </svg>
                </div>
              </div>
            </div>

          </div>

          {/* Price section */}
          <div className="mt-5 rounded-xl border border-warm-200 dark:border-warm-600 bg-warm-50 dark:bg-warm-700/50 p-4 md:p-5">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
              <div className="flex items-start gap-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-700 text-white">
                  <Banknote className="h-4 w-4" aria-hidden />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-warm-900 dark:text-white">
                    محدوده قیمت (تومان)
                  </h3>
                  <p className="text-xs text-warm-500 dark:text-warm-400 mt-0.5">
                    بازه رو تنظیم کنید یا از پیشنهادهای سریع استفاده کنید.
                  </p>
                  <p className="text-xs font-semibold text-brand-600 dark:text-brand-400 mt-1.5" aria-live="polite">
                    {priceSummary}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {PRICE_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => applyPricePreset(preset)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors duration-150 border ${
                    activePresetId === preset.id
                      ? 'bg-brand-700 border-brand-700 text-white'
                      : 'bg-white dark:bg-warm-600 border-warm-200 dark:border-warm-500 text-warm-700 dark:text-warm-200 hover:border-brand-400'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <PriceRangeSlider
              minStr={priceRange.min}
              maxStr={priceRange.max}
              onChange={setPriceRange}
            />
          </div>

        </div>
      </div>
    </div>
  );
});

AddressSearch.displayName = 'AddressSearch';

export default AddressSearch;
