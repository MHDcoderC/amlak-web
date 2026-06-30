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
      <div className="min-h-screen bg-warm-50 dark:bg-warm-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-[3px] border-warm-200 border-t-brand-600 rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <HomeIcon className="w-7 h-7 text-brand-600" />
            </div>
          </div>
          <p className="mt-5 text-warm-500 dark:text-warm-400 text-sm animate-pulse">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-50 dark:bg-warm-900">
      {/* Hero Section */}
      <HeroSection
        onSearch={handleSearch}
        onCreateAd={handleCreateAdClick}
        stats={heroStats}
      />

      {/* Main Content */}
      <div id="listings-section" className="page-shell py-12 sm:py-14 lg:py-16">
        {/* Page Title */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400 rounded-lg text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>نسخه ۲ — جدیدتر</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-warm-900 dark:text-white mb-2">
            آگهی‌های املاک
          </h2>
          <p className="text-sm text-warm-500 dark:text-warm-400 max-w-md mx-auto">
            جستجو و مشاهده آگهی‌های املاک در سراسر کشور
          </p>
        </div>

        {/* Register Ad Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={handleCreateAdClick}
            className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-3 rounded-xl font-bold text-sm transition-colors duration-200 inline-flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>ثبت آگهی جدید</span>
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
          <div className="bg-white dark:bg-warm-800 rounded-xl p-4 mb-6 border border-warm-200 dark:border-warm-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-warm-900 dark:text-white mb-0.5">نتایج جستجو</h3>
                <p className="text-warm-500 dark:text-warm-400 text-xs">
                  {filteredAds.length} آگهی از {ads.length} آگهی موجود
                </p>
              </div>
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 bg-warm-100 dark:bg-warm-700 hover:bg-warm-200 dark:hover:bg-warm-600 text-warm-700 dark:text-warm-300 rounded-lg text-xs font-medium transition-colors duration-150 flex items-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                پاک کردن فیلترها
              </button>
            </div>
          </div>
        )}

        {/* Ads Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
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
          <div className="text-center py-12">
            <div className="bg-white dark:bg-warm-800 rounded-xl p-8 border border-warm-200 dark:border-warm-700 max-w-sm mx-auto">
              <div className="w-16 h-16 bg-warm-100 dark:bg-warm-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-warm-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-warm-900 dark:text-white mb-2">آگهی‌ای پیدا نشد</h3>
              <p className="text-warm-500 dark:text-warm-400 text-sm mb-4">فیلترها رو تغییر بدید تا نتایج بیشتری ببینید</p>
              <button
                onClick={handleClearFilters}
                className="bg-brand-600 hover:bg-brand-700 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors duration-200"
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
          <div className="bg-emerald-600 text-white px-6 py-3 rounded-xl shadow-xl animate-fade-in-up">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5" />
              <div>
                <div className="font-bold text-sm">آگهی ثبت شد!</div>
                <div className="text-xs opacity-80">بعد از تایید مدیریت نمایش داده می‌شه</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(Home);
