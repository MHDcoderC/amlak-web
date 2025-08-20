import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import API_BASE_URL from '../config/api';
import CustomMap from './CustomMap';

const AdminAdModal = memo(({ ad, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (ad && ad.id) {
      setCurrentImageIndex(0);
    }
  }, [ad.id]);

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

  const formatPrice = (price) => {
    if (!price) return 'قیمت توافقی';
    return price.toLocaleString() + ' تومان';
  };

  const getPropertyTypeText = (type) => {
    const types = {
      apartment: 'آپارتمان',
      villa: 'ویلا',
      office: 'دفتر کار',
      shop: 'مغازه',
      land: 'زمین'
    };
    return types[type] || type;
  };

  const getStatusText = (status) => {
    const statuses = {
      pending: '⏳ در انتظار تایید',
      approved: '✅ تایید شده',
      rejected: '❌ رد شده'
    };
    return statuses[status] || status;
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border-yellow-200',
      approved: 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200',
      rejected: 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border-red-200'
    };
    return colors[status] || 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-7xl w-full max-h-[95vh] overflow-y-auto shadow-2xl border border-gray-100">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-50 via-white to-purple-50 border-b border-gray-200 p-6 rounded-t-2xl backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
            <div className="mb-4 sm:mb-0">
              <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">{ad.title}</h2>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <span className={`inline-flex px-6 py-3 text-sm font-semibold rounded-xl border-2 shadow-lg ${getStatusColor(ad.status)}`}>
                  {getStatusText(ad.status)}
                </span>
                <span className="text-gray-600 bg-white px-4 py-2 rounded-lg shadow-sm border">
                  <span className="ml-2">📅</span>
                  {new Date(ad.createdAt).toLocaleDateString('fa-IR')}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-4xl font-bold p-3 hover:bg-gray-100 rounded-xl transition-all duration-300 hover:scale-110"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* ستون چپ - تصاویر و اطلاعات اصلی */}
            <div>
              {/* تصاویر */}
              <div className="mb-8">
                <div className="relative h-80 sm:h-96 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                  {ad.images && ad.images.length > 0 ? (
                    <>
                      {/* Main image */}
                      <img
                        src={ad.images[currentImageIndex].startsWith('http') 
                          ? ad.images[currentImageIndex] 
                          : `${API_BASE_URL}${ad.images[currentImageIndex]}`
                        }
                        alt={`تصویر ${currentImageIndex + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => {
                          // Prevent infinite retry loop
                          if (e.target.dataset.retried === 'true') {
                            console.error('Image load error in AdminAdModal (final):', e.target.src);
                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zMCAzMEg3MFY3MEgzMFYzMFoiIGZpbGw9IiNEMUQ1REIiLz4KPHBhdGggZD0iTTM1IDM1SDY1VjY1SDM1VjM1WiIgZmlsbD0iI0M3Q0ZEMiIvPgo8L3N2Zz4K';
                            return;
                          }
                          
                          console.error('Image load error in AdminAdModal:', e.target.src);
                          // Try alternative URL format
                          if (e.target.src.includes('/uploads/')) {
                            const filename = e.target.src.split('/uploads/')[1];
                            e.target.dataset.retried = 'true';
                            e.target.src = `${API_BASE_URL}/uploads/${filename}`;
                          } else {
                            e.target.dataset.retried = 'true';
                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zMCAzMEg3MFY3MEgzMFYzMFoiIGZpbGw9IiNEMUQ1REIiLz4KPHBhdGggZD0iTTM1IDM1SDY1VjY1SDM1VjM1WiIgZmlsbD0iI0M3Q0ZEMiIvPgo8L3N2Zz4K';
                          }
                        }}
                        onLoad={(e) => {
                  
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
                      <div className="text-8xl sm:text-9xl">🏠</div>
                    </div>
                  )}
                </div>

                {/* Thumbnail images */}
                {ad.images && ad.images.length > 1 && (
                  <div className="mt-6">
                    <div className="flex space-x-4 space-x-reverse overflow-x-auto p-2">
                      {ad.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-xl border-2 shadow-lg transition-all duration-200 ${
                            index === currentImageIndex 
                              ? 'border-blue-500 shadow-blue-200' 
                              : 'border-gray-300 hover:border-blue-300'
                          }`}
                        >
                          <img
                            src={image.startsWith('http') 
                              ? image 
                              : `${API_BASE_URL}${image}`
                            }
                            alt={`تصویر ${index + 1}`}
                            className="w-full h-full object-cover rounded-lg"
                            onError={(e) => {
                              // Prevent infinite retry loop
                              if (e.target.dataset.retried === 'true') {
                                console.error('Thumbnail image load error in AdminAdModal (final):', e.target.src);
                                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zMCAzMEg3MFY3MEgzMFYzMFoiIGZpbGw9IiNEMUQ1REIiLz4KPHBhdGggZD0iTTM1IDM1SDY1VjY1SDM1VjM1WiIgZmlsbD0iI0M3Q0ZEMiIvPgo8L3N2Zz4K';
                                return;
                              }
                              
                              console.error('Thumbnail image load error in AdminAdModal:', e.target.src);
                              // Try alternative URL format
                              if (e.target.src.includes('/uploads/')) {
                                const filename = e.target.src.split('/uploads/')[1];
                                e.target.dataset.retried = 'true';
                                e.target.src = `${API_BASE_URL}/uploads/${filename}`;
                              } else {
                                e.target.dataset.retried = 'true';
                                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zMCAzMEg3MFY3MEgzMFYzMFoiIGZpbGw9IiNEMUQ1REIiLz4KPHBhdGggZD0iTTM1IDM1SDY1VjY1SDM1VjM1WiIgZmlsbD0iI0M3Q0ZEMiIvPgo8L3N2Zz4K';
                              }
                            }}
                            onLoad={(e) => {
                      
                            }}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* اطلاعات اصلی */}
              <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-2xl p-8 mb-8 shadow-xl border border-white">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <span className="ml-3 text-2xl">📋</span>
                  اطلاعات اصلی
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center p-4 bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <span className="ml-4 text-2xl text-blue-500">📍</span>
                    <div>
                      <div className="text-sm text-gray-600 font-medium">موقعیت</div>
                      <div className="font-bold text-lg">{ad.province} - {ad.city}</div>
                    </div>
                  </div>

                  <div className="flex items-center p-4 bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <span className="ml-4 text-2xl text-green-500">🏠</span>
                    <div>
                      <div className="text-sm text-gray-600 font-medium">نوع ملک</div>
                      <div className="font-bold text-lg">{getPropertyTypeText(ad.propertyType)}</div>
                    </div>
                  </div>

                  {ad.area && (
                    <div className="flex items-center p-4 bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
                      <span className="ml-4 text-2xl text-purple-500">📏</span>
                      <div>
                        <div className="text-sm text-gray-600 font-medium">متراژ</div>
                        <div className="font-bold text-lg">{ad.area} متر مربع</div>
                      </div>
                    </div>
                  )}

                  {ad.rooms && (
                    <div className="flex items-center p-4 bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
                      <span className="ml-4 text-2xl text-orange-500">🛏️</span>
                      <div>
                        <div className="text-sm text-gray-600 font-medium">تعداد خواب</div>
                        <div className="font-bold text-lg">{ad.rooms} خواب</div>
                      </div>
                    </div>
                  )}

                  {ad.stars > 0 && (
                    <div className="flex items-center p-4 bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
                      <span className="ml-4 text-2xl text-yellow-500">⭐</span>
                      <div>
                        <div className="text-sm text-gray-600 font-medium">امتیاز</div>
                        <div className="font-bold text-lg">
                          {ad.stars === 5 && 'ویژه '}
                          {'⭐'.repeat(ad.stars)}
                        </div>
                      </div>
                    </div>
                  )}

                  {ad.price && (
                    <div className="flex items-center p-4 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl shadow-lg border border-green-200 hover:shadow-xl transition-all duration-300 hover:scale-105">
                      <span className="ml-4 text-2xl text-green-600">💰</span>
                      <div>
                        <div className="text-sm text-green-700 font-medium">قیمت</div>
                        <div className="font-bold text-lg text-green-800">{formatPrice(ad.price)}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* آمار */}
              <div className="bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 rounded-2xl p-8 shadow-xl border border-white">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <span className="ml-3 text-2xl">📊</span>
                  آمار آگهی
                </h3>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center p-6 bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <div className="text-3xl font-bold text-blue-600 mb-2">{ad.viewCount || 0}</div>
                    <div className="text-sm text-gray-600 font-medium">بازدید</div>
                  </div>
                  <div className="text-center p-6 bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <div className="text-3xl font-bold text-purple-600 mb-2">{ad.clickCount || 0}</div>
                    <div className="text-sm text-gray-600 font-medium">کلیک</div>
                  </div>
                </div>
              </div>
            </div>

            {/* ستون راست - توضیحات، نقشه و اطلاعات تماس */}
            <div>
              {/* توضیحات */}
              <div className="bg-white rounded-2xl p-8 mb-8 border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <span className="ml-3 text-2xl">📝</span>
                  توضیحات
                </h3>
                <p className="text-gray-700 leading-relaxed text-lg">{ad.description}</p>
              </div>

              {/* توضیحات اضافی برای مدیر */}
              {(ad.userNotes && ad.userNotes.trim()) && (
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-8 mb-8 border border-yellow-200 shadow-xl hover:shadow-2xl transition-all duration-300">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <span className="ml-3 text-2xl">📋</span>
                    توضیحات اضافی برای مدیر
                  </h3>
                  <div className="bg-white rounded-xl p-6 border border-yellow-200">
                    <p className="text-gray-700 leading-relaxed text-lg">{ad.userNotes}</p>
                  </div>
                </div>
              )}

              {/* آدرس */}
              <div className="bg-white rounded-2xl p-8 mb-8 border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <span className="ml-3 text-2xl">📍</span>
                  آدرس دقیق
                </h3>
                <p className="text-gray-700 text-lg">{ad.address}</p>
              </div>

              {/* نقشه تعاملی */}
              <div className="bg-white rounded-2xl p-8 mb-8 border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <span className="ml-3 text-2xl">🗺️</span>
                  موقعیت مکانی
                </h3>
                <div className="h-80 rounded-xl overflow-hidden border-2 border-gray-100">
                  <CustomMap 
                    center={[ad.lat, ad.lng]}
                    zoom={15}
                    title={ad.title}
                    className="h-full"
                  />
                </div>
              </div>

              {/* اطلاعات تماس */}
              <div className="bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 rounded-2xl p-8 border border-gray-200 shadow-xl">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <span className="ml-3 text-2xl">📞</span>
                  اطلاعات تماس
                </h3>
                
                <div className="space-y-6">
                  <div className="flex items-center p-6 bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <span className="ml-4 text-2xl text-green-500">📱</span>
                    <div>
                      <div className="text-sm text-gray-600 font-medium">شماره تماس</div>
                      <div className="font-bold text-xl">{ad.phone}</div>
                    </div>
                  </div>

                  <div className="flex items-center p-6 bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <span className="ml-4 text-2xl text-blue-500">📧</span>
                    <div>
                      <div className="text-sm text-gray-600 font-medium">ایمیل</div>
                      <div className="font-bold text-xl">{ad.email || 'نامشخص'}</div>
                    </div>
                  </div>

                  <div className="flex items-center p-6 bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <span className="ml-4 text-2xl text-purple-500">👤</span>
                    <div>
                      <div className="text-sm text-gray-600 font-medium">نام فروشنده</div>
                      <div className="font-bold text-xl">{ad.sellerName || 'نامشخص'}</div>
                    </div>
                  </div>
                </div>

                {/* دکمه‌های تماس */}
                <div className="mt-8 space-y-4">
                  <button
                    onClick={() => window.location.href = `tel:${ad.phone}`}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-5 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center"
                  >
                    <span className="ml-3 text-2xl">📞</span>
                    تماس با فروشنده
                  </button>
                  
                  <button
                    onClick={() => window.open(`sms:${ad.phone}`, '_blank')}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-5 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center"
                  >
                    <span className="ml-3 text-2xl">💬</span>
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

export default AdminAdModal; 