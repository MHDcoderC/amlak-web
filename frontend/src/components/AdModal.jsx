import { useState, useEffect, memo } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config/api';
import CustomMap from './CustomMap';
import { buildMediaUrl, getEntityId } from '../utils/entity';
import { formatPriceFa, getPropertyTypeLabelFa } from '../utils/adPresentation';

const FALLBACK_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zMCAzMEg3MFY3MEgzMFYzMFoiIGZpbGw9IiNEMUQ1REIiLz4KPHBhdGggZD0iTTM1IDM1SDY1VjY1SDM1VjM1WiIgZmlsbD0iI0M3Q0ZEMiIvPgo8L3N2Zz4K';

const AdModal = memo(({ ad, onClose, onCall, onMessage }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const adId = getEntityId(ad);

  useEffect(() => {
    const incrementView = async () => {
      if (adId) {
        try {
          await axios.post(`${API_BASE_URL}/api/ads/${adId}/view`);
        } catch (error) {
          console.error('Error incrementing view count:', error);
        }
      }
    };

    if (adId) {
      incrementView();
    }
  }, [adId]);

  const nextImage = () => {
    if (ad.images && ad.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % ad.images.length);
    }
  };

  const prevImage = () => {
    if (ad.images && ad.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + ad.images.length) % ad.images.length);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-6xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-gray-100 dark:border-slate-700">
        {/* Header */}
        <div className="sticky top-0 z-20 flex justify-between items-center p-6 border-b border-warm-200 dark:border-warm-700 bg-white dark:bg-warm-900 rounded-t-3xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-warm-900 dark:text-white">{ad.title}</h2>
          <button
            onClick={onClose}
            className="text-warm-400 hover:text-warm-700 dark:hover:text-warm-200 text-2xl font-bold p-1.5 hover:bg-warm-100 dark:hover:bg-warm-800 rounded-lg transition-colors"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          {/* تصاویر */}
          <div className="mb-8">
            <div className="relative h-72 sm:h-80 bg-warm-100 dark:bg-warm-700 rounded-2xl overflow-hidden">
              {ad.images && ad.images.length > 0 ? (
                <>
                  {/* Main image */}
                  <img
                    src={buildMediaUrl(ad.images[currentImageIndex])}
                    alt={`تصویر ${currentImageIndex + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                    onError={(e) => {
                      e.target.src = FALLBACK_IMAGE;
                    }}
                  />

                  {/* Navigation arrows */}
                  {ad.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-md text-white p-4 rounded-full hover:bg-white/30 transition-all duration-300 hover:scale-110 shadow-2xl border border-white/30"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-md text-white p-4 rounded-full hover:bg-white/30 transition-all duration-300 hover:scale-110 shadow-2xl border border-white/30"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </>
                  )}
                  
                  {/* Image counter */}
                  {ad.images.length > 1 && (
                    <div className="absolute bottom-4 left-4 bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-2xl text-sm font-semibold shadow-2xl border border-white/30">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{currentImageIndex + 1} / {ad.images.length}</span>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
                  <div className="text-7xl sm:text-8xl">🏠</div>
                </div>
              )}
            </div>

            {/* Thumbnail images */}
            {ad.images && ad.images.length > 1 && (
              <div className="mt-6">
                <div className="flex space-x-3 space-x-reverse overflow-x-auto p-2">
                  {ad.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl border-2 shadow-lg transition-all duration-200 ${
                        index === currentImageIndex 
                          ? 'border-blue-500 shadow-blue-200' 
                          : 'border-gray-300 hover:border-blue-300'
                      }`}
                    >
                      <img
                        src={buildMediaUrl(image)}
                        alt={`تصویر ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => {
                          e.target.src = FALLBACK_IMAGE;
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* اطلاعات اصلی */}
            <div>
              <h3 className="text-2xl font-bold mb-6 flex items-center">
                <span className="ml-3 text-2xl">📋</span>
                اطلاعات ملک
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center p-3 bg-warm-50 dark:bg-warm-800 rounded-lg border border-warm-200 dark:border-warm-700">
                  <svg className="w-5 h-5 text-brand-600 ml-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-warm-800 dark:text-warm-200 font-semibold text-sm">{ad.province} - {ad.city}</span>
                </div>

                <div className="flex items-center p-3 bg-warm-50 dark:bg-warm-800 rounded-lg border border-warm-200 dark:border-warm-700">
                  <svg className="w-5 h-5 text-emerald-600 ml-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span className="text-warm-800 dark:text-warm-200 font-semibold text-sm">{getPropertyTypeLabelFa(ad.propertyType)}</span>
                </div>

                {ad.area && (
                  <div className="flex items-center p-3 bg-warm-50 dark:bg-warm-800 rounded-lg border border-warm-200 dark:border-warm-700">
                    <svg className="w-5 h-5 text-brand-600 ml-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                    <span className="text-warm-800 dark:text-warm-200 font-semibold text-sm">{ad.area} متر مربع</span>
                  </div>
                )}

                {ad.rooms && (
                  <div className="flex items-center p-3 bg-warm-50 dark:bg-warm-800 rounded-lg border border-warm-200 dark:border-warm-700">
                    <svg className="w-5 h-5 text-amber-600 ml-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
                    </svg>
                    <span className="text-warm-800 dark:text-warm-200 font-semibold text-sm">{ad.rooms} خواب</span>
                  </div>
                )}

                {ad.stars > 0 && (
                  <div className="flex items-center p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <svg className="w-6 h-6 text-yellow-500 ml-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <span className="text-gray-700 font-semibold text-lg">
                      {ad.stars === 5 && 'ویژه '}
                      {'★'.repeat(ad.stars)} ستاره
                    </span>
                  </div>
                )}

                <div className="flex items-center p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <svg className="w-6 h-6 text-gray-500 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span className="text-gray-700 font-semibold text-lg">{ad.viewCount || 0} بازدید</span>
                </div>
              </div>

              {/* قیمت */}
              {ad.price && (
                <div className="mt-6 p-6 bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl shadow-xl border border-green-200">
                  <div className="text-3xl font-bold text-green-800 text-center">
                    {formatPriceFa(ad.price)}
                  </div>
                </div>
              )}

              {/* توضیحات */}
              <div className="mt-8">
                <h4 className="text-xl font-bold mb-4 flex items-center">
                  <span className="ml-2 text-xl">📝</span>
                  توضیحات
                </h4>
                <div className="p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-100 dark:border-slate-700">
                  <p className="text-gray-700 dark:text-gray-200 leading-relaxed text-lg">{ad.description}</p>
                </div>
              </div>
            </div>

            {/* نقشه و اطلاعات تماس */}
            <div>
              {/* نقشه تعاملی */}
              <div className="mb-8">
                <h4 className="text-xl font-bold mb-4 flex items-center">
                  <span className="ml-2 text-xl">🗺️</span>
                  موقعیت مکانی
                </h4>
                <div className="h-64 rounded-xl overflow-hidden border-2 border-gray-100 shadow-xl">
                                    <CustomMap 
                    center={[ad.lat, ad.lng]}
                    zoom={15}
                    title={ad.title}
                    className="h-full"
                  />
                </div>
              </div>

              {/* اطلاعات تماس */}
              <div className="bg-warm-50 dark:bg-warm-800 p-5 rounded-xl border border-warm-200 dark:border-warm-700">
                <h4 className="text-base font-bold mb-4 flex items-center gap-2">
                  <span>📞</span>
                  اطلاعات تماس
                </h4>
                
                <div className="space-y-3">
                  <div className="flex items-center p-3 bg-white dark:bg-warm-900 rounded-lg border border-warm-200 dark:border-warm-700">
                    <svg className="w-5 h-5 text-emerald-600 ml-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-warm-800 dark:text-warm-200 font-bold text-sm">{ad.phone}</span>
                  </div>

                  <div className="flex items-center p-3 bg-white dark:bg-warm-900 rounded-lg border border-warm-200 dark:border-warm-700">
                    <svg className="w-5 h-5 text-brand-600 ml-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-warm-800 dark:text-warm-200 font-semibold text-sm">{ad.address}</span>
                  </div>
                </div>

                {/* دکمه‌های تماس */}
                <div className="mt-4 space-y-2">
                  <button
                    onClick={() => onCall(ad.phone)}
                    className="w-full bg-brand-700 hover:bg-brand-800 text-white py-3 px-5 rounded-lg font-bold text-sm transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    تماس با فروشنده
                  </button>
                  
                  <button
                    onClick={() => onMessage(ad.phone)}
                    className="w-full bg-warm-700 hover:bg-warm-800 text-white py-3 px-5 rounded-lg font-bold text-sm transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    ارسال پیام
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default AdModal; 