import { useState, useEffect, useCallback, useMemo } from 'react';
import { provinces } from '../data/provinces';

// Debounce utility function
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const AddressSearch = ({ onSearch, className = '' }) => {
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [availableCities, setAvailableCities] = useState([]);

  // Debounce search term to avoid excessive API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Memoized available cities
  const memoizedAvailableCities = useMemo(() => {
    if (selectedProvince) {
      const province = provinces.find(p => p.name === selectedProvince);
      return province ? province.cities : [];
    }
    return [];
  }, [selectedProvince]);

  useEffect(() => {
    setAvailableCities(memoizedAvailableCities);
    setSelectedCity('');
  }, [memoizedAvailableCities]);

  // Memoized search filters
  const searchFilters = useMemo(() => ({
    province: selectedProvince,
    city: selectedCity,
    propertyType,
    priceRange,
    searchTerm: debouncedSearchTerm
  }), [selectedProvince, selectedCity, propertyType, priceRange, debouncedSearchTerm]);

  // Trigger search when filters change
  useEffect(() => {
    onSearch(searchFilters);
  }, [searchFilters, onSearch]);

  const handleProvinceChange = useCallback((e) => {
    setSelectedProvince(e.target.value);
  }, []);

  const handleCityChange = useCallback((e) => {
    setSelectedCity(e.target.value);
  }, []);

  const handlePropertyTypeChange = useCallback((e) => {
    setPropertyType(e.target.value);
  }, []);

  const handlePriceRangeChange = useCallback((field, value) => {
    setPriceRange(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleSearchTermChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  const clearFilters = useCallback(() => {
    setSelectedProvince('');
    setSelectedCity('');
    setPropertyType('');
    setPriceRange({ min: '', max: '' });
    setSearchTerm('');
  }, []);

  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 border border-gray-200 ${className}`}>
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
          <span className="ml-2">🔍</span>
          جستجوی پیشرفته
        </h3>
        <p className="text-gray-600">آگهی‌های مورد نظر خود را پیدا کنید</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {/* جستجوی متنی */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">جستجو در عنوان و توضیحات</label>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchTermChange}
            placeholder="مثال: آپارتمان 2 خوابه..."
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>

        {/* انتخاب استان */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">استان</label>
          <select
            value={selectedProvince}
            onChange={handleProvinceChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          >
            <option value="">همه استان‌ها</option>
            {provinces.map(province => (
              <option key={province.name} value={province.name}>
                {province.name}
              </option>
            ))}
          </select>
        </div>

        {/* انتخاب شهر */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">شهر</label>
          <select
            value={selectedCity}
            onChange={handleCityChange}
            disabled={!selectedProvince}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100"
          >
            <option value="">همه شهرها</option>
            {availableCities.map(city => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* نوع ملک */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">نوع ملک</label>
          <select
            value={propertyType}
            onChange={handlePropertyTypeChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          >
            <option value="">همه انواع</option>
            <option value="apartment">🏢 آپارتمان</option>
            <option value="villa">🏡 ویلا</option>
            <option value="office">🏢 دفتر</option>
            <option value="shop">🏪 مغازه</option>
            <option value="land">🌍 زمین</option>
          </select>
        </div>

        {/* محدوده قیمت */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">حداقل قیمت (تومان)</label>
          <input
            type="number"
            value={priceRange.min}
            onChange={(e) => handlePriceRangeChange('min', e.target.value)}
            placeholder="0"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">حداکثر قیمت (تومان)</label>
          <input
            type="number"
            value={priceRange.max}
            onChange={(e) => handlePriceRangeChange('max', e.target.value)}
            placeholder="نامحدود"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>
      </div>

      {/* دکمه‌های عملیات */}
      <div className="flex flex-col sm:flex-row gap-4 justify-end">
        <button
          onClick={clearFilters}
          className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all duration-200 transform hover:scale-105 font-medium"
        >
          پاک کردن فیلترها
        </button>
      </div>
    </div>
  );
};

export default AddressSearch; 