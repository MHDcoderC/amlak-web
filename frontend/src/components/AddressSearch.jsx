import { useState, useCallback, useMemo, memo } from 'react';
import { provinces } from '../data/provinces';

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
    const filters = {
      province: selectedProvince,
      city: selectedCity,
      propertyType,
      priceRange: {
        min: priceRange.min ? parseInt(priceRange.min) : null,
        max: priceRange.max ? parseInt(priceRange.max) : null
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

  return (
    <div className={`bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden ${className}`}>
      {/* Header - Always Visible */}
      <div className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
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
              className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-slate-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-800 dark:text-white placeholder-gray-400"
            />
          </div>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            جستجو
          </button>

          {/* Advanced Filter Toggle */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`px-4 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 border-2 ${
              isExpanded
                ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700 text-blue-600 dark:text-blue-400'
                : 'bg-white dark:bg-slate-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-600'
            }`}
          >
            <svg className={`w-5 h-5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            فیلترها
            {activeFiltersCount > 0 && (
              <span className="w-6 h-6 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Clear Filters */}
          {activeFiltersCount > 0 && (
            <button
              onClick={clearFilters}
              className="px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl font-medium transition-all duration-200 flex items-center gap-2"
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
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-4 md:px-6 pb-6 border-t border-gray-100 dark:border-gray-700">
          <div className="pt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

            {/* Province Select */}
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                استان
              </label>
              <div className="relative">
                <select
                  value={selectedProvince}
                  onChange={handleProvinceChange}
                  className="w-full px-4 py-3 pr-10 bg-gray-50 dark:bg-slate-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-800 dark:text-white appearance-none cursor-pointer"
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
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                شهر
              </label>
              <div className="relative">
                <select
                  value={selectedCity}
                  onChange={handleCityChange}
                  disabled={!selectedProvince}
                  className="w-full px-4 py-3 pr-10 bg-gray-50 dark:bg-slate-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-800 dark:text-white appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                نوع ملک
              </label>
              <div className="relative">
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full px-4 py-3 pr-10 bg-gray-50 dark:bg-slate-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-800 dark:text-white appearance-none cursor-pointer"
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

            {/* Price Range */}
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                محدوده قیمت (تومان)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                  placeholder="از"
                  className="flex-1 px-3 py-3 bg-gray-50 dark:bg-slate-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-800 dark:text-white text-sm"
                />
                <input
                  type="number"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                  placeholder="تا"
                  className="flex-1 px-3 py-3 bg-gray-50 dark:bg-slate-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-800 dark:text-white text-sm"
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
});

AddressSearch.displayName = 'AddressSearch';

export default AddressSearch;
