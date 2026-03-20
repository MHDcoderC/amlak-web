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
    apartment: { icon: '🏢', label: 'آپارتمان', color: 'bg-blue-500' },
    villa: { icon: '🏡', label: 'ویلا', color: 'bg-green-500' },
    office: { icon: '🏢', label: 'دفتر', color: 'bg-purple-500' },
    shop: { icon: '🏪', label: 'مغازه', color: 'bg-orange-500' },
    land: { icon: '🌍', label: 'زمین', color: 'bg-amber-600' }
  };

  const typeInfo = propertyTypeIcons[ad.propertyType] || { icon: '🏠', label: 'ملک', color: 'bg-gray-500' };

  return (
    <div
      className="group relative bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onAdClick(ad)}
    >
      {/* Image Container */}
      <div className="relative h-56 md:h-64 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-slate-700 dark:to-slate-600 overflow-hidden">
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
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-slate-700 dark:via-slate-600 dark:to-slate-500">
            <div className="text-6xl animate-bounce-subtle">🏠</div>
          </div>
        )}

        {/* Overlay Gradient */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-80' : 'opacity-60'}`} />

        {/* Badges */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          {/* Property Type Badge */}
          <div className={`${typeInfo.color} text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg flex items-center gap-1.5`}>
            <span>{typeInfo.icon}</span>
            <span>{typeInfo.label}</span>
          </div>

          {/* Featured Badge */}
          {ad.stars >= 4 && (
            <div className={`px-3 py-1.5 rounded-full text-sm font-bold shadow-lg flex items-center gap-1 ${
              ad.stars === 5
                ? 'bg-amber-500 text-white'
                : 'bg-blue-500 text-white'
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
            <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm text-gray-900 dark:text-white px-4 py-2 rounded-xl font-bold text-lg shadow-lg flex items-center justify-between">
              <span>{priceFormatted}</span>
              <span className="text-sm text-gray-600 dark:text-gray-400 font-normal">تومان</span>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
          {ad.title}
        </h3>

        {/* Location */}
        <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mb-3">
          <svg className="w-4 h-4 ml-1.5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="truncate">{ad.city}، {ad.province}</span>
        </div>

        {/* Features */}
        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
          {ad.area && (
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
              <span>{ad.area} متر</span>
            </div>
          )}
          {ad.rooms && (
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>{ad.rooms} خواب</span>
            </div>
          )}
        </div>

        {/* Description Preview */}
        <p className="text-sm text-gray-500 dark:text-gray-500 line-clamp-2 mb-4">
          {ad.description}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCall(ad.phone);
            }}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 px-4 rounded-xl font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-green-500/30"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            تماس
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onMessage(ad.phone);
            }}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-xl font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-blue-500/30"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            پیام
          </button>
        </div>

        {/* View Count */}
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
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
