/* eslint-disable react-refresh/only-export-components */
import { useState, useEffect, useCallback, memo } from 'react';
import { buildMediaUrl, getEntityId } from '../utils/entity';

const STORAGE_KEY = 'amlak_favorites';

// Hook for managing favorites
export const useFavorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch (e) {
        console.error('Error loading favorites:', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever favorites change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    }
  }, [favorites, isLoaded]);

  const addFavorite = useCallback((ad) => {
    const adId = getEntityId(ad);
    if (!adId) return;
    setFavorites(prev => {
      if (prev.some(f => getEntityId(f) === adId)) return prev;
      return [...prev, { ...ad, id: adId, savedAt: Date.now() }];
    });
    if (window.toast) {
      window.toast.success('به علاقه‌مندی‌ها اضافه شد', 'این ملک در لیست علاقه‌مندی‌های شما ذخیره شد');
    }
  }, []);

  const removeFavorite = useCallback((adId) => {
    setFavorites(prev => prev.filter(f => getEntityId(f) !== adId));
    if (window.toast) {
      window.toast.info('حذف شد', 'این ملک از لیست علاقه‌مندی‌ها حذف شد');
    }
  }, []);

  const toggleFavorite = useCallback((ad) => {
    const adId = getEntityId(ad);
    if (!adId) return;
    if (favorites.some(f => getEntityId(f) === adId)) {
      removeFavorite(adId);
    } else {
      addFavorite(ad);
    }
  }, [favorites, addFavorite, removeFavorite]);

  const isFavorite = useCallback((adId) => {
    return favorites.some(f => getEntityId(f) === adId);
  }, [favorites]);

  const clearAll = useCallback(() => {
    setFavorites([]);
    if (window.toast) {
      window.toast.info('لیست پاک شد', 'تمام موارد از علاقه‌مندی‌ها حذف شدند');
    }
  }, []);

  return {
    favorites,
    isLoaded,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    clearAll
  };
};

// Favorite Button Component
export const FavoriteButton = memo(({ ad, isFavorite, onToggle, className = '' }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = (e) => {
    e.stopPropagation();
    setIsAnimating(true);
    onToggle(ad);
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <button
      onClick={handleClick}
      className={`p-2 rounded-full transition-all duration-300 hover:scale-110 ${
        isFavorite
          ? 'bg-red-500 text-white shadow-lg hover:bg-red-600'
          : 'bg-white/90 text-gray-600 shadow-md hover:bg-white hover:text-red-500'
      } ${isAnimating ? 'scale-125' : ''} ${className}`}
      aria-label={isFavorite ? 'حذف از علاقه‌مندی‌ها' : 'افزودن به علاقه‌مندی‌ها'}
    >
      <svg
        className="w-5 h-5 transition-transform duration-300"
        fill={isFavorite ? 'currentColor' : 'none'}
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={isFavorite ? 0 : 2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    </button>
  );
});

FavoriteButton.displayName = 'FavoriteButton';

// Favorites Modal Component
export const FavoritesModal = memo(({ isOpen, onClose, favorites, onRemove, onViewAd }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-scale-in">
      <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">علاقه‌مندی‌های من</h2>
              <p className="text-gray-600 dark:text-gray-400">{favorites.length} ملک ذخیره شده</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors duration-200"
          >
            <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {favorites.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">لیست علاقه‌مندی‌ها خالی است</h3>
              <p className="text-gray-600 dark:text-gray-400">هنوز هیچ ملکی به علاقه‌مندی‌های خود اضافه نکرده‌اید</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {favorites.map(ad => (
                <div
                  key={getEntityId(ad)}
                  className="group bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-4 flex gap-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 cursor-pointer"
                  onClick={() => onViewAd(ad)}
                >
                  <div className="w-24 h-24 rounded-xl bg-gray-200 dark:bg-gray-600 flex-shrink-0 overflow-hidden">
                    {ad.images && ad.images[0] ? (
                      <img
                        src={buildMediaUrl(ad.images[0])}
                        alt={ad.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className="w-full h-full items-center justify-center text-3xl hidden">🏠</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 dark:text-white truncate mb-1">{ad.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{ad.city} - {ad.province}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-green-600 dark:text-green-400 font-bold">
                        {ad.price ? ad.price.toLocaleString() + ' تومان' : 'توافقی'}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemove(getEntityId(ad));
                        }}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors duration-200"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {favorites.length > 0 && (
          <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <button
              onClick={() => {
                if (confirm('آیا از حذف تمام موارد مطمئن هستید؟')) {
                  localStorage.removeItem(STORAGE_KEY);
                  window.location.reload();
                }
              }}
              className="w-full py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors duration-200 font-medium"
            >
              حذف همه موارد
            </button>
          </div>
        )}
      </div>
    </div>
  );
});

FavoritesModal.displayName = 'FavoritesModal';

export default FavoritesModal;
