import { useEffect, useState, useMemo, useCallback, memo } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config/api';
import AdModal from '../components/AdModal';
import Modal from '../components/Modal';
import AddressSearch from '../components/AddressSearch';

// Memoized Ad Card Component
const AdCard = memo(({ ad, onAdClick, onCall, onMessage, buildImageUrl }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleCall = useCallback((e) => {
    e.stopPropagation();
    onCall(ad.phone);
  }, [ad.phone, onCall]);

  const handleMessage = useCallback((e) => {
    e.stopPropagation();
    onMessage(ad.phone);
  }, [ad.phone, onMessage]);

  const handleCardClick = useCallback(() => {
    onAdClick(ad);
  }, [ad, onAdClick]);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  const imageUrl = useMemo(() => buildImageUrl(ad.images?.[0]), [ad.images, buildImageUrl]);
  const priceFormatted = useMemo(() => ad.price?.toLocaleString(), [ad.price]);

  return (
    <div 
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 group border border-gray-200"
      onClick={handleCardClick}
    >
      {/* تصویر آگهی */}
      <div className="h-48 sm:h-56 bg-gray-200 relative overflow-hidden">
        {ad.images && ad.images.length > 0 && !imageError ? (
          <>
            <img 
              src={imageUrl}
              alt={ad.title}
              className={`w-full h-full object-cover transition-all duration-300 ${
                imageLoaded ? 'opacity-100 group-hover:scale-110' : 'opacity-0'
              }`}
              loading="lazy"
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
                <div className="animate-pulse text-4xl">🏠</div>
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
            <div className="text-5xl sm:text-6xl">🏠</div>
          </div>
        )}
        
        {/* مدال‌های ویژه */}
        {ad.stars >= 4 && (
          <div className={`absolute top-3 right-3 px-3 py-2 rounded-lg text-sm font-bold shadow-lg ${
            ad.stars === 5 
              ? 'bg-gradient-to-r from-green-400 to-green-500 text-white' 
              : 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white'
          }`}>
            {ad.stars === 5 ? '🏆 ویژه' : '⭐ برتر'}
            {'⭐'.repeat(ad.stars)}
          </div>
        )}

        {/* نوع ملک */}
        <div className="absolute top-3 left-3 bg-blue-500 text-white px-3 py-2 rounded-lg text-sm font-medium shadow-lg">
          {ad.propertyType === 'apartment' && '🏢 آپارتمان'}
          {ad.propertyType === 'villa' && '🏡 ویلا'}
          {ad.propertyType === 'office' && '🏢 دفتر'}
          {ad.propertyType === 'shop' && '🏪 مغازه'}
          {ad.propertyType === 'land' && '🌍 زمین'}
        </div>

        {/* تعداد بازدید */}
        <div className="absolute bottom-3 left-3 bg-black bg-opacity-70 text-white px-3 py-2 rounded-lg text-sm backdrop-blur-sm">
          👁 {ad.viewCount || 0} بازدید
        </div>
      </div>

      {/* محتوای کارت */}
      <div className="p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
          {ad.title}
        </h3>
        
        <div className="space-y-2 sm:space-y-3 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <span className="ml-2">📍</span>
            <span>{ad.province} - {ad.city}</span>
          </div>
          
          {ad.area && (
            <div className="flex items-center text-sm text-gray-600">
              <span className="ml-2">📏</span>
              <span>{ad.area} متر مربع</span>
            </div>
          )}
          
          {ad.rooms && (
            <div className="flex items-center text-sm text-gray-600">
              <span className="ml-2">🛏️</span>
              <span>{ad.rooms} خواب</span>
            </div>
          )}
          
          {ad.price && (
            <div className="flex items-center text-green-600 font-medium">
              <span className="ml-2">💰</span>
              <span>{priceFormatted} تومان</span>
            </div>
          )}
        </div>

        <div className="text-sm text-gray-600 mb-4 line-clamp-2">
          {ad.description}
        </div>

        {/* دکمه‌های تماس */}
        <div className="flex space-x-2 space-x-reverse">
          <button
            onClick={handleCall}
            className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center transform hover:scale-105 shadow-md"
          >
            📞 تماس
          </button>
          
          <button
            onClick={handleMessage}
            className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center transform hover:scale-105 shadow-md"
          >
            💬 پیام
          </button>
        </div>
      </div>
    </div>
  );
});

AdCard.displayName = 'AdCard';

// Memoized Stats Component
const StatsSection = memo(({ filteredAds, ads }) => {
  const stats = useMemo(() => ({
    activeAds: filteredAds.length,
    totalViews: filteredAds.reduce((sum, ad) => sum + (ad.viewCount || 0), 0),
    totalClicks: filteredAds.reduce((sum, ad) => sum + (ad.clickCount || 0), 0),
    featuredAds: filteredAds.filter(ad => ad.stars === 5).length
  }), [filteredAds]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
      <div className="bg-white rounded-xl shadow-lg p-6 text-center border border-gray-200 transform hover:scale-105 transition-all duration-300">
        <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">{stats.activeAds}</div>
        <div className="text-gray-600">آگهی فعال</div>
      </div>
      <div className="bg-white rounded-xl shadow-lg p-6 text-center border border-gray-200 transform hover:scale-105 transition-all duration-300">
        <div className="text-3xl sm:text-4xl font-bold text-green-600 mb-2">{stats.totalViews}</div>
        <div className="text-gray-600">بازدید کل</div>
      </div>
      <div className="bg-white rounded-xl shadow-lg p-6 text-center border border-gray-200 transform hover:scale-105 transition-all duration-300">
        <div className="text-3xl sm:text-4xl font-bold text-purple-600 mb-2">{stats.totalClicks}</div>
        <div className="text-gray-600">کلیک کل</div>
      </div>
      <div className="bg-white rounded-xl shadow-lg p-6 text-center border border-gray-200 transform hover:scale-105 transition-all duration-300">
        <div className="text-3xl sm:text-4xl font-bold text-orange-600 mb-2">{stats.featuredAds}</div>
        <div className="text-gray-600">آگهی ویژه</div>
      </div>
    </div>
  );
});

StatsSection.displayName = 'StatsSection';

// Pagination Component
const Pagination = memo(({ currentPage, totalPages, onPageChange }) => {
  const handlePageChange = useCallback((page) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  }, [onPageChange, totalPages]);

  const renderPageNumbers = useMemo(() => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-2 mx-1 rounded-lg font-medium transition-all duration-200 ${
            i === currentPage
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {i}
        </button>
      );
    }
    return pages;
  }, [currentPage, totalPages, handlePageChange]);

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center space-x-2 space-x-reverse mt-8">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 rounded-lg font-medium transition-all duration-200 bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        قبلی
      </button>
      
      {renderPageNumbers}
      
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 rounded-lg font-medium transition-all duration-200 bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        بعدی
      </button>
    </div>
  );
});

Pagination.displayName = 'Pagination';

const Home = ({ user, onLoginRequired }) => {
  const [ads, setAds] = useState([]);
  const [filteredAds, setFilteredAds] = useState([]);
  const [selectedAd, setSelectedAd] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchFilters, setSearchFilters] = useState({});
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  // Memoized buildImageUrl function
  const buildImageUrl = useCallback((path) => {
    if (!path) return '';
    if (/^https?:\/\//i.test(path)) return path;
    const base = API_BASE_URL.replace(/\/$/, '');
    if (path.startsWith('/')) return base + path;
    return `${base}/${path}`;
  }, []);

  // Memoized fetchAds function
  const fetchAds = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/ads`);
      // Handle both old format (array) and new format ({ ads: array })
      const adsData = response.data.ads || response.data || [];
      setAds(adsData);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching ads:', err);
      
      // Provide user-friendly error message
      if (err.code === 'ERR_NETWORK') {
        console.log('Network error - Backend server might not be running');
        setAds([]); // Set empty array to prevent errors
      } else if (err.response?.status === 404) {
        console.log('API endpoint not found');
        setAds([]);
      } else {
        console.log('API error:', err.response?.data || err.message);
        setAds([]);
      }
      
      setLoading(false);
    }
  }, []);

  // Memoized applyFilters function
  const applyFilters = useCallback(() => {
    // Ensure ads is an array before spreading
    const adsArray = Array.isArray(ads) ? ads : [];
    let filtered = [...adsArray];

    if (searchFilters.searchTerm) {
      const term = searchFilters.searchTerm.toLowerCase();
      filtered = filtered.filter(ad => 
        ad.title.toLowerCase().includes(term) || 
        ad.description.toLowerCase().includes(term)
      );
    }

    if (searchFilters.province) {
      filtered = filtered.filter(ad => ad.province === searchFilters.province);
    }

    if (searchFilters.city) {
      filtered = filtered.filter(ad => ad.city === searchFilters.city);
    }

    if (searchFilters.propertyType) {
      filtered = filtered.filter(ad => ad.propertyType === searchFilters.propertyType);
    }

    if (searchFilters.priceRange) {
      if (searchFilters.priceRange.min) {
        filtered = filtered.filter(ad => ad.price >= parseInt(searchFilters.priceRange.min));
      }
      if (searchFilters.priceRange.max) {
        filtered = filtered.filter(ad => ad.price <= parseInt(searchFilters.priceRange.max));
      }
    }

    setFilteredAds(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [ads, searchFilters]);

  // Memoized paginated ads
  const paginatedAds = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAds.slice(startIndex, endIndex);
  }, [filteredAds, currentPage, itemsPerPage]);

  // Memoized total pages
  const totalPages = useMemo(() => {
    return Math.ceil(filteredAds.length / itemsPerPage);
  }, [filteredAds.length, itemsPerPage]);

  useEffect(() => {
    fetchAds();
  }, [fetchAds]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleSearch = useCallback((filters) => {
    setSearchFilters(filters);
  }, []);

  const handleAdClick = useCallback(async (ad) => {
    try {
      // Use a more efficient approach - don't wait for the click update
      // Use 'id' instead of '_id' for MySQL
      axios.post(`${API_BASE_URL}/api/ads/${ad.id}/click`).catch(console.error);
      setSelectedAd(ad);
      setIsModalOpen(true);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const handleCall = useCallback((phone) => {
    window.location.href = `tel:${phone}`;
  }, []);

  const handleMessage = useCallback((phone) => {
    window.open(`sms:${phone}`, '_blank');
  }, []);

  const handleAdCreated = useCallback(() => {
    fetchAds();
    setIsCreateModalOpen(false);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 5000);
  }, [fetchAds]);

  const handleCreateAdClick = useCallback(() => {
    if (!user) {
      onLoginRequired();
    } else {
      setIsCreateModalOpen(true);
    }
  }, [user, onLoginRequired]);

  const closeSuccessMessage = useCallback(() => {
    setShowSuccessMessage(false);
  }, []);

  const handleClearFilters = useCallback(() => {
    handleSearch({});
  }, [handleSearch]);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto p-4 sm:p-6">
         {/* Page Title and Register Button */}
         <div className="text-center mb-12">
           <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
             آگهی‌های املاک
           </h2>
           <p className="text-lg text-gray-600 mb-8">جستجو و مشاهده بهترین آگهی‌های املاک</p>
           
           {/* Register Ad Button */}
           <button
             onClick={handleCreateAdClick}
             className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-bold text-lg inline-flex items-center space-x-2 space-x-reverse"
           >
             <span className="text-2xl">✨</span>
             <span>ثبت آگهی جدید</span>
           </button>
         </div>

        {/* Search Section */}
        <div className="mb-12">
          <AddressSearch onSearch={handleSearch} />
        </div>

        {/* Stats Section */}
        <StatsSection filteredAds={filteredAds} ads={ads} />

        {/* Results Info */}
        {Object.keys(searchFilters).length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="mb-4 sm:mb-0">
                <h3 className="text-xl font-bold text-gray-800 mb-2">نتایج جستجو</h3>
                <p className="text-gray-600">
                  {filteredAds.length} آگهی از {ads.length} آگهی موجود یافت شد
                </p>
              </div>
              <button
                onClick={handleClearFilters}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-md"
              >
                پاک کردن فیلترها
              </button>
            </div>
          </div>
        )}

        {/* Ads Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {paginatedAds.map((ad) => (
            <div key={ad.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <AdCard
                key={ad.id}
                ad={ad}
                onAdClick={handleAdClick}
                onCall={handleCall}
                onMessage={handleMessage}
                buildImageUrl={buildImageUrl}
              />
            </div>
          ))}
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />

        {filteredAds.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-white rounded-xl shadow-lg p-8 sm:p-12 border border-gray-200">
              <svg className="w-20 h-20 sm:w-24 sm:h-24 text-gray-400 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">هیچ آگهی‌ای یافت نشد</h3>
              <p className="text-gray-600 mb-6">با تغییر فیلترهای جستجو، آگهی‌های بیشتری را مشاهده کنید</p>
              <button
                onClick={handleClearFilters}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
              >
                مشاهده همه آگهی‌ها
              </button>
            </div>
          </div>
        )}
      </div>

      {/* مدال نمایش جزئیات آگهی */}
      {isModalOpen && selectedAd && (
        <AdModal 
          ad={selectedAd} 
          onClose={() => {
            setIsModalOpen(false);
            setSelectedAd(null);
          }}
          onCall={handleCall}
          onMessage={handleMessage}
        />
      )}

      {/* مدال ایجاد آگهی جدید */}
      {isCreateModalOpen && (
        <Modal 
          setIsModalOpen={setIsCreateModalOpen}
          onAdCreated={handleAdCreated}
        />
      )}

      {/* پیام موفقیت */}
      {showSuccessMessage && (
        <div className="fixed bottom-4 right-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-2xl shadow-2xl z-50 border border-green-400 transform transition-all duration-500 animate-bounce">
          <div className="flex items-center space-x-3 space-x-reverse animate-slide-in">
            <div className="text-2xl animate-pulse">✅</div>
            <div>
              <div className="font-bold text-lg">آگهی شما با موفقیت ثبت شد!</div>
              <div className="text-sm opacity-90">بعد از تایید مدیریت نمایش داده خواهد شد</div>
            </div>
            <button
              onClick={closeSuccessMessage}
              className="text-white hover:text-gray-200 text-xl font-bold hover:scale-110 transition-transform duration-200"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(Home);