import { useState, useCallback, memo } from 'react';
import { FavoriteButton } from './FavoritesManager';
import { buildMediaUrl } from '../utils/entity';

const ModernAdCard = memo(({
  ad,
  onAdClick,
  onCall,
  onMessage,
  isFavorite,
  onToggleFavorite
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  const imageUrl = ad.images?.[0] ? buildMediaUrl(ad.images[0]) : null;
  const priceFormatted = ad.price ? ad.price.toLocaleString() : null;

  const propertyTypeIcons = {
    apartment: { icon: '🏢', label: 'آپارتمان', color: 'bg-warm-700' },
    villa: { icon: '🏡', label: 'ویلا', color: 'bg-emerald-700' },
    office: { icon: '🏢', label: 'دفتر', color: 'bg-warm-600' },
    shop: { icon: '🏪', label: 'مغازه', color: 'bg-brand-700' },
    land: { icon: '🌍', label: 'زمین', color: 'bg-amber-700' }
  };

  const typeInfo = propertyTypeIcons[ad.propertyType] || { icon: '🏠', label: 'ملک', color: 'bg-warm-600' };

  return (
    <div
      className="group relative bg-white dark:bg-warm-800 rounded-xl overflow-hidden border border-warm-200 dark:border-warm-700 hover:border-brand-400 dark:hover:border-brand-500 transition-all duration-300 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onAdClick(ad)}
    >
      {/* Image Container */}
      <div className="relative h-52 md:h-60 bg-warm-100 dark:bg-warm-700 overflow-hidden">
        {imageUrl && !imageError ? (
          <>
            <img
              src={imageUrl}
              alt={ad.title}
              className={`w-full h-full object-cover transition-all duration-700 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              } ${isHovered ? 'scale-110' : 'scale-100'}`}
              loading="lazy"
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-pulse">
                  <div className="w-16 h-16 bg-white/50 rounded-full animate-ping" />
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-warm-100 dark:bg-warm-700">
            <div className="text-5xl">🏠</div>
          </div>
        )}

        {/* Overlay Gradient */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-80' : 'opacity-60'}`} />

        {/* Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5">
          {/* Property Type Badge */}
          <div className="bg-white/90 dark:bg-warm-800/90 text-warm-800 dark:text-warm-200 px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 backdrop-blur-sm">
            <span>{typeInfo.icon}</span>
            <span>{typeInfo.label}</span>
          </div>

          {/* Featured Badge */}
          {ad.stars >= 4 && (
            <div className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 ${
              ad.stars === 5
                ? 'bg-brand-600 text-white'
                : 'bg-warm-700 text-white'
            }`}>
              {ad.stars === 5 ? <><span>🏆</span><span>ویژه</span></> : <><span>⭐</span><span>برتر</span></>}
            </div>
          )}
        </div>

        {/* Favorite Button */}
        <div className="absolute top-4 left-4">
          <FavoriteButton
            ad={ad}
            isFavorite={isFavorite}
            onToggle={onToggleFavorite}
          />
        </div>

        {/* Price Badge (Bottom) */}
        {priceFormatted && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-white/90 dark:bg-warm-800/90 backdrop-blur-sm text-warm-900 dark:text-white px-3 py-1.5 rounded-lg font-bold text-base flex items-center justify-between border border-warm-200 dark:border-warm-600">
              <span>{priceFormatted}</span>
              <span className="text-sm text-gray-600 dark:text-gray-400 font-normal">تومان</span>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title */}
        <h3 className="text-base font-bold text-warm-900 dark:text-white mb-1.5 line-clamp-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors duration-200">
          {ad.title}
        </h3>

        {/* Location */}
        <div className="flex items-center text-warm-500 dark:text-warm-400 text-xs mb-2">
          <svg className="w-3.5 h-3.5 ml-1 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="truncate">{ad.city}، {ad.province}</span>
        </div>

        {/* Features */}
        <div className="flex items-center gap-3 text-xs text-warm-500 dark:text-warm-400 mb-3">
          {ad.area && (
            <div className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
              <span>{ad.area} متر</span>
            </div>
          )}
          {ad.rooms && (
            <div className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>{ad.rooms} خواب</span>
            </div>
          )}
        </div>

        {/* Description Preview */}
        <p className="text-xs text-warm-500 dark:text-warm-400 line-clamp-2 mb-3">
          {ad.description}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCall(ad.phone);
            }}
            className="flex-1 bg-brand-600 hover:bg-brand-700 text-white py-2 px-3 rounded-lg font-semibold text-xs transition-colors duration-200 flex items-center justify-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            تماس
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMessage(ad.phone);
            }}
            className="flex-1 bg-warm-800 dark:bg-warm-700 hover:bg-warm-900 dark:hover:bg-warm-600 text-white py-2 px-3 rounded-lg font-semibold text-xs transition-colors duration-200 flex items-center justify-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            پیام
          </button>
        </div>

        {/* View Count */}
        <div className="mt-3 pt-3 border-t border-warm-100 dark:border-warm-700 flex items-center justify-between text-xs text-warm-400 dark:text-warm-500">
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span>{ad.viewCount || 0} بازدید</span>
          </div>
          <span className="text-xs">
            {ad.createdAt ? new Date(ad.createdAt).toLocaleDateString('fa-IR') : '—'}
          </span>
        </div>
      </div>
    </div>
  );
});

ModernAdCard.displayName = 'ModernAdCard';

export default ModernAdCard;
