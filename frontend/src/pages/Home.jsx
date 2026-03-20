import { useEffect, useState, useMemo, useCallback, memo } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config/api';
import AdModal from '../components/AdModal';
import Modal from '../components/Modal';
import AddressSearch from '../components/AddressSearch';
import HeroSection from '../components/HeroSection';
import ModernAdCard from '../components/ModernAdCard';
import Testimonials from '../components/Testimonials';
import StatsSection from '../components/home/StatsSection';
import Pagination from '../components/home/Pagination';
import { getEntityId } from '../utils/entity';
import { Home as HomeIcon, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

const Home = ({
  user,
  onLoginRequired,
  searchFilters: initialFilters,
  onSearch: externalSearch,
  favorites,
  toggleFavorite,
  isFavorite
}) => {
  const [ads, setAds] = useState([]);
  const [filteredAds, setFilteredAds] = useState([]);
  const [selectedAd, setSelectedAd] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchFilters, setSearchFilters] = useState(initialFilters || {});
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const isAdFavorite = useCallback((ad) => {
    const adId = getEntityId(ad);
    if (!adId) return false;
    if (typeof isFavorite === 'function') {
      return isFavorite(adId);
    }
    return Array.isArray(favorites) && favorites.some((fav) => getEntityId(fav) === adId);
  }, [isFavorite, favorites]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [totalPages, setTotalPages] = useState(1);

  // Listen for openAdModal event from favorites
  useEffect(() => {
    const handleOpenAdModal = (event) => {
      const ad = event.detail;
      if (ad) {
        setSelectedAd(ad);
        setIsModalOpen(true);
      }
    };

    window.addEventListener('openAdModal', handleOpenAdModal);
    return () => window.removeEventListener('openAdModal', handleOpenAdModal);
  }, []);

  // Memoized fetchAds function
  const fetchAds = useCallback(async (page) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/ads?page=${page}&limit=${itemsPerPage}`,
      );
      const adsData = response.data?.ads || [];
      setAds(adsData);
      setFilteredAds(adsData);
      setTotalPages(response.data?.totalPages || 1);
    } catch (err) {
      console.error('Error fetching ads:', err);
      if (err.code === 'ERR_NETWORK') {
        console.log('Network error - Backend server might not be running');
      }
      setAds([]);
      setFilteredAds([]);
      setTotalPages(1);
    }
    setLoading(false);
  }, []);

  const hasServerFilters = useMemo(() => (
    Boolean(
      searchFilters?.province ||
      searchFilters?.city ||
      searchFilters?.propertyType ||
      searchFilters?.priceRange?.min ||
      searchFilters?.priceRange?.max ||
      searchFilters?.searchTerm
    )
  ), [searchFilters]);

  const fetchFilteredPage = useCallback(async () => {
    setLoading(true);
    try {
      if (hasServerFilters) {
        const params = new URLSearchParams();
        if (searchFilters.searchTerm) params.append('query', searchFilters.searchTerm);
        if (searchFilters.province) params.append('province', searchFilters.province);
        if (searchFilters.city) params.append('city', searchFilters.city);
        if (searchFilters.propertyType) params.append('propertyType', searchFilters.propertyType);
        if (searchFilters.priceRange?.min) params.append('minPrice', searchFilters.priceRange.min);
        if (searchFilters.priceRange?.max) params.append('maxPrice', searchFilters.priceRange.max);

        params.append('limit', itemsPerPage.toString());
        params.append('page', currentPage.toString());

        const response = await axios.get(`${API_BASE_URL}/api/ads/search/advanced?${params}`);
        setFilteredAds(response.data?.ads || []);
        setTotalPages(response.data?.totalPages || 1);

        // Keep heroStats roughly stable by only updating `ads` on first page.
        if (currentPage === 1) setAds(response.data?.ads || []);
      } else {
        await fetchAds(currentPage);
      }
    } catch (err) {
      console.error('Fetch filtered page error:', err);
      setFilteredAds([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [currentPage, fetchAds, hasServerFilters, itemsPerPage, searchFilters]);

  const heroStats = useMemo(() => {
    const activeAdsCount = ads.length;
    const coveredCitiesCount = new Set(
      ads.map((ad) => ad.city).filter(Boolean)
    ).size;
    const avgStars = ads.length
      ? ads.reduce((sum, ad) => sum + (Number(ad.stars) || 0), 0) / ads.length
      : 4.9;
    // Convert 0-5 stars to a believable percent band (80-99)
    const satisfaction = Math.min(99, Math.max(80, Math.round((avgStars / 5) * 100)));

    return {
      activeAds: `${activeAdsCount.toLocaleString('fa-IR')}+`,
      coveredCities: `${coveredCitiesCount.toLocaleString('fa-IR')}+`,
      satisfaction: `${satisfaction.toLocaleString('fa-IR')}%`
    };
  }, [ads]);

  useEffect(() => {
    fetchFilteredPage();
  }, [fetchFilteredPage]);

  // Update filters when external search is triggered
  useEffect(() => {
    if (initialFilters && Object.keys(initialFilters).length > 0) {
      setSearchFilters(initialFilters);
      setCurrentPage(1);
    }
  }, [initialFilters]);

  const handleSearch = useCallback((filters) => {
    setSearchFilters(filters);
    setCurrentPage(1);
    if (externalSearch) {
      externalSearch(filters);
    }
  }, [externalSearch]);

  const handleAdClick = useCallback(async (ad) => {
    try {
      const adId = getEntityId(ad);
      if (adId) {
        axios.post(`${API_BASE_URL}/api/ads/${adId}/click`).catch(console.error);
      }
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
    fetchFilteredPage();
    setIsCreateModalOpen(false);
    setShowSuccessMessage(true);
    if (window.toast) {
      window.toast.success('آگهی ثبت شد', 'آگهی شما با موفقیت ثبت و منتظر تایید است');
    }
    setTimeout(() => setShowSuccessMessage(false), 5000);
  }, [fetchFilteredPage]);

  const handleCreateAdClick = useCallback(() => {
    if (!user) {
      onLoginRequired();
    } else {
      setIsCreateModalOpen(true);
    }
  }, [user, onLoginRequired]);

  const handleClearFilters = useCallback(() => {
    handleSearch({});
  }, [handleSearch]);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-24 h-24 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <HomeIcon className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <p className="mt-6 text-gray-600 dark:text-gray-400 text-lg animate-pulse">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Hero Section */}
      <HeroSection
        onSearch={handleSearch}
        onCreateAd={handleCreateAdClick}
        stats={heroStats}
      />

      {/* Main Content */}
      <div id="listings-section" className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Title */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            <span>ورژن 2 - جدید و بهبود یافته</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            آگهی‌های املاک
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            جستجو و مشاهده بهترین آگهی‌های املاک در سراسر ایران
          </p>
        </div>

        {/* Register Ad Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={handleCreateAdClick}
            className="group bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-bold text-lg inline-flex items-center gap-3"
          >
            <Sparkles className="w-6 h-6 group-hover:animate-bounce" />
            <span>ثبت آگهی جدید</span>
            <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Search Section */}
        <div className="mb-12">
          <AddressSearch onSearch={handleSearch} />
        </div>

        {/* Stats Section */}
        <StatsSection filteredAds={filteredAds} />

        {/* Results Info */}
        {Object.keys(searchFilters).length > 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 mb-8 border border-gray-100 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">نتایج جستجو</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {filteredAds.length} آگهی از {ads.length} آگهی موجود
                </p>
              </div>
              <button
                onClick={handleClearFilters}
                className="px-6 py-3 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium transition-all duration-200 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                پاک کردن فیلترها
              </button>
            </div>
          </div>
        )}

        {/* Ads Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {filteredAds.map((ad) => (
            <ModernAdCard
              key={getEntityId(ad)}
              ad={ad}
              onAdClick={handleAdClick}
              onCall={handleCall}
              onMessage={handleMessage}
              isFavorite={isAdFavorite(ad)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />

        {/* Testimonials Section */}
        <Testimonials />

        {/* Empty State */}
        {filteredAds.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8 sm:p-12 border border-gray-100 dark:border-gray-700 max-w-lg mx-auto">
              <div className="w-24 h-24 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">هیچ آگهی‌ای یافت نشد</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">با تغییر فیلترهای جستجو، آگهی‌های بیشتری را مشاهده کنید</p>
              <button
                onClick={handleClearFilters}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                مشاهده همه آگهی‌ها
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Ad Detail Modal */}
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

      {/* Create Ad Modal */}
      {isCreateModalOpen && (
        <Modal
          setIsModalOpen={setIsCreateModalOpen}
          onAdCreated={handleAdCreated}
        />
      )}

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="bg-green-600 text-white px-8 py-4 rounded-2xl shadow-2xl border border-green-500 animate-fade-in-up">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-8 h-8 animate-bounce" />
              <div>
                <div className="font-bold text-lg">آگهی شما با موفقیت ثبت شد!</div>
                <div className="text-sm opacity-90">بعد از تایید مدیریت نمایش داده خواهد شد</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(Home);
