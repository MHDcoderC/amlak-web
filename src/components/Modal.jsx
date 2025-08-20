import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config/api';
import { provinces } from '../data/provinces';
import CustomMap from './CustomMap';
import authManager from '../utils/auth';

const Modal = memo(({ setIsModalOpen, onAdCreated }) => {
         const [formData, setFormData] = useState({
    title: '',
    description: '',
    address: '',
    province: '',
    city: '',
    location: { lat: 35.6892, lng: 51.3890 }, // تهران به صورت پیش‌فرض
    images: [], // برای نگهداری File objects
    imageUrls: [], // برای نگهداری URL های پیش‌نمایش
    phone: '',
    userNotes: '',
    adminNotes: '',
    price: '',
    area: '',
    rooms: '',
    propertyType: 'apartment',
  });

  const [selectedProvince, setSelectedProvince] = useState(null);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  useEffect(() => {
    if (formData.province) {
      const province = provinces.find(p => p.name === formData.province);
      if (province) {
        setSelectedProvince(province);
        setCities(province.cities);
        setFormData(prev => ({
          ...prev,
          location: province.coordinates || { lat: 35.6892, lng: 51.3890 },
          city: ''
        }));
      }
    }
  }, [formData.province]);

  // Ensure location always has valid coordinates
  useEffect(() => {
    if (!formData.location || typeof formData.location.lat !== 'number' || typeof formData.location.lng !== 'number') {
      setFormData(prev => ({
        ...prev,
        location: { lat: 35.6892, lng: 51.3890 }
      }));
    }
  }, [formData.location]);

  // پاکسازی URL های پیش‌نمایش هنگام unmount شدن کامپوننت
  useEffect(() => {
    return () => {
      formData.imageUrls.forEach(item => {
        if (item.previewUrl && item.previewUrl.startsWith('blob:')) {
          URL.revokeObjectURL(item.previewUrl);
        }
      });
    };
  }, [formData.imageUrls]);

       const handleLocationChange = useCallback((lat, lng) => {
         if (typeof lat === 'number' && typeof lng === 'number') {
           setFormData(prev => ({ ...prev, location: { lat, lng } }));
         }
       }, []);

       const handleMapClick = useCallback((locationData) => {
         if (locationData && typeof locationData.lat === 'number' && typeof locationData.lng === 'number') {
           setFormData(prev => ({ ...prev, location: locationData }));
         }
       }, []);

  const handleImageUpload = useCallback((e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setImageLoading(true);

    // بررسی پسوند و نوع فایل‌ها
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    
    const validFiles = files.filter(file => {
      const extension = '.' + file.name.split('.').pop().toLowerCase();
      return allowedTypes.includes(file.type) && allowedExtensions.includes(extension);
    });

    if (validFiles.length !== files.length) {
      alert('فقط فایل‌های تصویری (JPG, PNG, GIF, WEBP) مجاز هستند.');
      e.target.value = '';
      return;
    }

    // بررسی حجم فایل‌ها (حداکثر 5 مگابایت)
    const maxSize = 5 * 1024 * 1024; // 5MB
    const oversizedFiles = files.filter(file => file.size > maxSize);
    
    if (oversizedFiles.length > 0) {
      alert('حجم هر تصویر باید کمتر از 5 مگابایت باشد.');
      e.target.value = '';
      return;
    }

    // بررسی تعداد تصاویر (حداکثر 10 تصویر)
    if (formData.imageUrls.length + validFiles.length > 10) {
      alert('حداکثر 10 تصویر می‌توانید انتخاب کنید.');
      e.target.value = '';
      return;
    }

        // ایجاد URL های پیش‌نمایش برای فایل‌ها - روش ساده‌تر
    const newImageUrls = validFiles.map(file => {
      try {
        const previewUrl = URL.createObjectURL(file);

        return {
      file: file,
          previewUrl: previewUrl,
      name: file.name,
      size: file.size,
          type: file.type,
          id: Date.now() + Math.random()
        };
      } catch (error) {
        console.error('Error creating preview URL for file:', file.name, error);
        return null;
      }
    }).filter(Boolean);

    if (newImageUrls.length > 0) {
      // اضافه کردن تاخیر کوچک برای اطمینان از بارگذاری تصاویر
      setTimeout(() => {
    setFormData(prev => ({
      ...prev,
      imageUrls: [...prev.imageUrls, ...newImageUrls]
    }));
        setImageLoading(false);
      }, 100);
    } else {
      setImageLoading(false);
    }

    // پاک کردن input برای امکان انتخاب مجدد همان فایل‌ها
    e.target.value = '';
  }, [formData.imageUrls]);

  const removeImage = useCallback((index) => {
    // حذف URL پیش‌نمایش (اگر از URL.createObjectURL استفاده شده باشد)
    const imageUrl = formData.imageUrls[index];
    if (imageUrl && imageUrl.previewUrl && imageUrl.previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(imageUrl.previewUrl);
    }
    // برای data URLs نیازی به revoke نیست
    
    setFormData(prev => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index)
    }));
  }, [formData.imageUrls]);

  // تابع برای drag and drop فایل‌ها
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.currentTarget.classList.add('border-blue-400', 'bg-blue-50');
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50');
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50');
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;

    setImageLoading(true);

    // بررسی پسوند و نوع فایل‌ها
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    
    const validFiles = files.filter(file => {
      const extension = '.' + file.name.split('.').pop().toLowerCase();
      return allowedTypes.includes(file.type) && allowedExtensions.includes(extension);
    });

    if (validFiles.length !== files.length) {
      alert('فقط فایل‌های تصویری (JPG, PNG, GIF, WEBP) مجاز هستند.');
      return;
    }

    // بررسی حجم فایل‌ها (حداکثر 5 مگابایت)
    const maxSize = 5 * 1024 * 1024; // 5MB
    const oversizedFiles = files.filter(file => file.size > maxSize);
    
    if (oversizedFiles.length > 0) {
      alert('حجم هر تصویر باید کمتر از 5 مگابایت باشد.');
      return;
    }

    // بررسی تعداد تصاویر (حداکثر 10 تصویر)
    if (formData.imageUrls.length + validFiles.length > 10) {
      alert('حداکثر 10 تصویر می‌توانید انتخاب کنید.');
      return;
    }

    // ایجاد URL های پیش‌نمایش برای فایل‌ها - روش ساده‌تر
    const newImageUrls = validFiles.map(file => {
      try {
        const previewUrl = URL.createObjectURL(file);

        return {
          file: file,
          previewUrl: previewUrl,
          name: file.name,
          size: file.size,
          type: file.type,
          id: Date.now() + Math.random()
        };
      } catch (error) {
        console.error('Error creating preview URL for file (drop):', file.name, error);
        return null;
      }
    }).filter(Boolean);

    if (newImageUrls.length > 0) {
      // اضافه کردن تاخیر کوچک برای اطمینان از بارگذاری تصاویر
      setTimeout(() => {
        setFormData(prev => ({
          ...prev,
          imageUrls: [...prev.imageUrls, ...newImageUrls]
        }));
        setImageLoading(false);
      }, 100);
    } else {
      setImageLoading(false);
    }
  }, [formData.imageUrls]);

  // توابع برای تغییر ترتیب تصاویر
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const handleImageDragStart = useCallback((e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  const handleImageDragOver = useCallback((e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleImageDrop = useCallback((e, dropIndex) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) return;

    const newImageUrls = [...formData.imageUrls];
    const draggedItem = newImageUrls[draggedIndex];
    
    // حذف آیتم از موقعیت قبلی
    newImageUrls.splice(draggedIndex, 1);
    // اضافه کردن آیتم در موقعیت جدید
    newImageUrls.splice(dropIndex, 0, draggedItem);
    
    setFormData(prev => ({
      ...prev,
      imageUrls: newImageUrls
    }));
    
    setDraggedIndex(null);
  }, [draggedIndex, formData.imageUrls]);

  const handleImageDragEnd = useCallback(() => {
    setDraggedIndex(null);
  }, []);

  const openImagePreview = useCallback((imageUrl, index) => {
    setPreviewImage({ url: imageUrl, index });
  }, []);

  const closeImagePreview = useCallback(() => {
    setPreviewImage(null);
  }, []);



         const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // آپلود تصاویر به سرور
      let uploadedImageUrls = [];
      if (formData.imageUrls.length > 0) {
        const formDataToSend = new FormData();
        formData.imageUrls.forEach(item => {
          formDataToSend.append('images', item.file);
        });

        const response = await axios.post(`${API_BASE_URL}/api/ads/upload`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        uploadedImageUrls = response.data.files.map(file => file.url);
      }

      // Get user token for authentication
      const token = authManager.getToken();
      const user = authManager.getUser();
      
      if (!user || !user.id) {
        throw new Error('کاربر وارد نشده است. لطفاً ابتدا وارد شوید.');
      }
      
      // ارسال اطلاعات آگهی با URL های تصاویر آپلود شده
      await axios.post(`${API_BASE_URL}/api/ads`, {
        ...formData,
        lat: formData.location.lat,
        lng: formData.location.lng,
        images: uploadedImageUrls,
        userNotes: formData.userNotes,
        price: formData.price ? parseInt(formData.price) : null,
        area: formData.area ? parseInt(formData.area) : null,
        rooms: formData.rooms ? parseInt(formData.rooms) : null,
        userId: user.id,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // پاکسازی URL های پیش‌نمایش
      formData.imageUrls.forEach(item => {
        if (item.previewUrl && item.previewUrl.startsWith('blob:')) {
          URL.revokeObjectURL(item.previewUrl);
        }
      });
      
      if (onAdCreated) {
        onAdCreated();
      } else {
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error(err);
      alert('خطا در ثبت آگهی. لطفاً دوباره تلاش کنید.');
    } finally {
      setLoading(false);
    }
  }, [formData, onAdCreated, setIsModalOpen]);

  const propertyTypes = [
    { value: 'apartment', label: 'آپارتمان' },
    { value: 'villa', label: 'ویلا' },
    { value: 'office', label: 'دفتر کار' },
    { value: 'shop', label: 'مغازه' },
    { value: 'land', label: 'زمین' },
  ];

       return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20">
        <div className="p-8 border-b border-white/30 bg-gradient-to-r from-blue-50/80 to-purple-50/80 backdrop-blur-sm rounded-t-3xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">🏠 ثبت آگهی جدید</h2>
              <p className="text-gray-600">اطلاعات ملک خود را وارد کنید</p>
            </div>
            <button
              onClick={() => setIsModalOpen(false)}
              className="text-gray-400 hover:text-gray-600 text-3xl font-bold hover:bg-white/50 p-2 rounded-full transition-all duration-300 hover:scale-110 backdrop-blur-sm"
            >
              ×
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 bg-white/40 backdrop-blur-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ستون اول */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  عنوان آگهی *
                </label>
               <input
                 type="text"
                  required
                  className="w-full p-3 border border-white/30 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-transparent bg-white/60 backdrop-blur-sm shadow-lg"
                 value={formData.title}
                 onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="مثال: آپارتمان 2 خوابه در ونک"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  نوع ملک *
                </label>
                <select
                  required
                  className="w-full p-3 border border-white/30 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-transparent bg-white/60 backdrop-blur-sm shadow-lg"
                  value={formData.propertyType}
                  onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                >
                  {propertyTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  استان *
                </label>
                <select
                  required
                  className="w-full p-3 border border-white/30 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-transparent bg-white/60 backdrop-blur-sm shadow-lg"
                  value={formData.province}
                  onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                >
                  <option value="">انتخاب استان</option>
                  {provinces.map(province => (
                    <option key={province.name} value={province.name}>
                      {province.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  شهر *
                </label>
                <select
                  required
                  className="w-full p-3 border border-white/30 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-transparent bg-white/60 backdrop-blur-sm shadow-lg"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  disabled={!formData.province}
                >
                  <option value="">انتخاب شهر</option>
                  {cities.map((city, index) => (
                    <option key={`${city}-${index}`} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  آدرس دقیق *
                </label>
               <input
                 type="text"
                  required
                  className="w-full p-3 border border-white/30 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-transparent bg-white/60 backdrop-blur-sm shadow-lg"
                 value={formData.address}
                 onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="آدرس کامل ملک"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  شماره تماس *
                </label>
                <input
                  type="tel"
                  required
                  className="w-full p-3 border border-white/30 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-transparent bg-white/60 backdrop-blur-sm shadow-lg"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="09123456789"
                />
              </div>
            </div>

            {/* ستون دوم */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  قیمت (تومان)
                </label>
                <input
                  type="number"
                  className="w-full p-3 border border-white/30 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-transparent bg-white/60 backdrop-blur-sm shadow-lg"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="500000000"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    متراژ (متر مربع)
                  </label>
                  <input
                    type="number"
                    className="w-full p-3 border border-white/30 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-transparent bg-white/60 backdrop-blur-sm shadow-lg"
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    placeholder="120"
                  />
                </div>

                                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      تعداد خواب
                    </label>
                    <input
                      type="number"
                      className="w-full p-3 border border-white/30 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-transparent bg-white/60 backdrop-blur-sm shadow-lg"
                      value={formData.rooms}
                      onChange={(e) => setFormData({ ...formData, rooms: e.target.value })}
                      placeholder="2"
                    />
                  </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  توضیحات *
                </label>
                <textarea
                  required
                  rows={4}
                  className="w-full p-3 border border-white/30 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-transparent bg-white/60 backdrop-blur-sm shadow-lg resize-none"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="توضیحات کامل درباره ملک..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="ml-2">📋</span>
                  توضیحات اضافی برای مدیر (اختیاری)
                </label>
                <textarea
                  rows={3}
                  className="w-full p-3 border border-yellow-300 rounded-xl focus:ring-2 focus:ring-yellow-500/50 focus:border-transparent bg-yellow-50/60 backdrop-blur-sm shadow-lg resize-none"
                  value={formData.userNotes}
                  onChange={(e) => setFormData({ ...formData, userNotes: e.target.value })}
                  placeholder="توضیحات اضافی برای مدیر (مثل شرایط خاص، توضیحات تکمیلی و...)"
                />
                <p className="text-xs text-gray-500 mt-1">این توضیحات فقط برای مدیر نمایش داده می‌شود</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  تصاویر
                </label>
                <div
                  className="w-full p-6 border-2 border-dashed border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-transparent bg-white/60 backdrop-blur-sm shadow-lg transition-all duration-300 hover:border-blue-400 hover:bg-blue-50/30"
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="text-center mb-6">
                    <div className="mb-4">
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <p className="text-lg font-medium text-gray-700 mb-2">
                      تصاویر ملک را اضافه کنید
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                      فایل‌های تصویری را اینجا بکشید یا کلیک کنید تا انتخاب کنید
                    </p>
                                         <p className="text-xs text-gray-400 mb-2">
                       حداکثر 10 تصویر، هر کدام کمتر از 5 مگابایت (JPG, PNG, GIF, WEBP)
                     </p>
                     <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded-lg border border-blue-200">
                       <p className="font-medium mb-1">💡 راهنمای استفاده:</p>
                       <ul className="text-right space-y-1">
                         <li>• تصاویر را بکشید و اینجا رها کنید</li>
                         <li>• برای تغییر ترتیب، تصاویر را بکشید و جابجا کنید</li>
                         <li>• روی × کلیک کنید تا تصویر را حذف کنید</li>
                       </ul>
                     </div>
                    
                                         <label className={`mt-4 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white transition-all duration-200 transform hover:scale-105 ${
                       imageLoading 
                         ? 'bg-gray-400 cursor-not-allowed' 
                         : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer'
                     }`}>
                       {imageLoading ? (
                         <>
                           <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white ml-2"></div>
                           در حال بارگذاری...
                         </>
                       ) : (
                         <>
                           <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                           </svg>
                           انتخاب تصاویر
                         </>
                       )}
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                         className="hidden"
                         disabled={imageLoading}
                />
                     </label>
                  </div>
                
                {/* نمایش تصاویر انتخاب شده */}
                {formData.imageUrls.length > 0 && (
                    <div className="mt-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-gray-800 flex items-center">
                          <svg className="w-5 h-5 ml-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          تصاویر انتخاب شده ({formData.imageUrls.length} تصویر)
                        </h4>
                                                 <div className="flex items-center space-x-2 space-x-reverse">

                           <button
                             type="button"
                             onClick={() => {
                               formData.imageUrls.forEach(item => {
                                 if (item.previewUrl && item.previewUrl.startsWith('blob:')) {
                                   URL.revokeObjectURL(item.previewUrl);
                                 }
                               });
                               setFormData(prev => ({ ...prev, imageUrls: [] }));
                             }}
                             className="text-sm text-red-600 hover:text-red-800 font-medium flex items-center transition-colors duration-200"
                           >
                             <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                             </svg>
                             حذف همه
                           </button>
                         </div>
                      </div>
                      
                                             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {formData.imageUrls.map((item, index) => (
                           <div 
                             key={item.id} 
                             className={`relative group cursor-move ${draggedIndex === index ? 'opacity-50 scale-95' : ''}`}
                             draggable
                             onDragStart={(e) => handleImageDragStart(e, index)}
                             onDragOver={(e) => handleImageDragOver(e, index)}
                             onDrop={(e) => handleImageDrop(e, index)}
                             onDragEnd={handleImageDragEnd}
                           >
                             <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden border-2 border-gray-200 hover:border-blue-400 transition-all duration-300 shadow-lg hover:shadow-xl relative">
                            <img
                              src={item.previewUrl}
                              alt={`تصویر ${index + 1}`}
                                 className="w-full h-full object-cover hover:scale-110 transition-transform duration-300 cursor-pointer"
                                 onClick={() => openImagePreview(item.previewUrl, index)}
                                 title="کلیک برای مشاهده بزرگتر"
                                 data-image-index={index}
                                 onError={(e) => {
                                   console.error('Image failed to load:', item.previewUrl);
                                   e.target.style.display = 'none';
                                   e.target.nextSibling.style.display = 'flex';
                                 }}
                                 onLoad={(e) => {
                                   console.log('Image loaded successfully:', item.previewUrl);
                                   e.target.style.display = 'block';
                                   if (e.target.nextSibling) {
                                     e.target.nextSibling.style.display = 'none';
                                   }
                                 }}
                               />
                               {/* Fallback برای تصاویر که بارگذاری نمی‌شوند */}
                               <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 text-xs text-center p-2" style={{ display: 'none' }}>
                                 <div>
                                   <svg className="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                   </svg>
                                   <p>خطا در بارگذاری تصویر</p>
                                   <p className="text-xs mt-1">{item.name}</p>
                                 </div>
                               </div>
                          </div>
                          
                          {/* دکمه حذف */}
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm hover:bg-red-600 transition-all duration-200 transform hover:scale-110 shadow-lg z-10 border-2 border-white"
                            title="حذف تصویر"
                          >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                          </button>
                          
                                                         {/* شماره تصویر و آیکون drag */}
                             <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-lg font-medium flex items-center">
                               <svg className="w-3 h-3 ml-1 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                                 <path d="M8 6a2 2 0 11-4 0 2 2 0 014 0zM8 12a2 2 0 11-4 0 2 2 0 014 0zM8 18a2 2 0 11-4 0 2 2 0 014 0zM20 6a2 2 0 11-4 0 2 2 0 014 0zM20 12a2 2 0 11-4 0 2 2 0 014 0zM20 18a2 2 0 11-4 0 2 2 0 014 0z" />
                               </svg>
                               {index + 1}
                             </div>
                            
                            {/* اطلاعات فایل */}
                            
                              
                            {/* Overlay برای hover */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 rounded-xl flex items-center justify-center pointer-events-none">
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <button
                                  type="button"
                                  onClick={() => removeImage(index)}
                                  className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors duration-200 flex items-center pointer-events-auto"
                                >
                                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                  حذف
                                </button>
                              </div>
                            </div>

                            {/* کپشن زیر تصویر */}
                            <div className="mt-1 px-1">
                              <div className="truncate text-[11px] text-gray-700">
                                {item.name.length > 28 ? item.name.substring(0, 25) + '…' : item.name}
                              </div>
                              <div className="text-[10px] text-gray-500">{(item.size / 1024 / 1024).toFixed(1)} MB</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                </div>
              </div>
            </div>
          </div>

          {/* نقشه تعاملی */}
          <div className="mt-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              <span className="ml-2">🗺️</span>
              موقعیت مکانی
            </h3>

            <div className="mt-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                نقشه (کلیک کنید تا موقعیت را انتخاب کنید)
              </label>
              <div className="h-80 rounded-2xl overflow-hidden border-2 border-white/30 shadow-2xl bg-white/20 backdrop-blur-sm">
                <CustomMap 
                  center={[formData.location?.lat || 35.6892, formData.location?.lng || 51.3890]} 
                  zoom={selectedProvince ? 10 : 6} 
                  title={formData.title || 'موقعیت ملک'}
                  onLocationSelect={handleMapClick}
                  province={formData.province}
                  city={formData.city}
                  searchQuery={formData.address}
                  className="h-full"
                />
              </div>
              <div className="mt-3 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/30 shadow-lg">
                <p className="text-sm text-gray-600">
                  <strong>مختصات انتخاب شده:</strong> {formData.location?.lat?.toFixed(6) || '0.000000'}, {formData.location?.lng?.toFixed(6) || '0.000000'}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  برای جستجوی محله، آدرس دقیق را در فیلد آدرس وارد کنید
                </p>
              </div>
            </div>
          </div>

          {/* دکمه‌های عملیات */}
          <div className="flex justify-end space-x-4 space-x-reverse mt-8 p-6 bg-white/40 backdrop-blur-sm rounded-2xl border border-white/30 shadow-xl">
               <button
                 type="button"
                 onClick={() => setIsModalOpen(false)}
              className="px-8 py-4 border-2 border-white/40 rounded-xl text-gray-700 hover:bg-white/60 hover:border-white/60 transition-all duration-300 font-semibold backdrop-blur-sm shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              ❌ انصراف
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-4 bg-gradient-to-r from-blue-500/90 to-purple-600/90 backdrop-blur-sm text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 border border-white/20"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white ml-2"></div>
                  در حال ثبت...
                </>
              ) : (
                <>
                  ✨ ثبت آگهی
                </>
              )}
               </button>
          </div>
             </form>
           </div>

      {/* مودال پیش‌نمایش تصویر */}
      {previewImage && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="relative max-w-4xl max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="flex justify-between items-center p-4 bg-gray-50 border-b">
              <h3 className="text-lg font-semibold text-gray-800">
                تصویر {previewImage.index + 1} از {formData.imageUrls.length}
              </h3>
              <button
                onClick={closeImagePreview}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold p-2 hover:bg-gray-100 rounded-lg transition-all duration-300"
              >
                ×
              </button>
            </div>
            
            {/* تصویر */}
            <div className="p-4">
              <img
                src={previewImage.url}
                alt={`تصویر ${previewImage.index + 1}`}
                className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg"
              />
            </div>
            
            {/* اطلاعات فایل */}
            <div className="p-4 bg-gray-50 border-t">
              <div className="text-sm text-gray-600">
                <p><strong>نام فایل:</strong> {formData.imageUrls[previewImage.index]?.name}</p>
                <p><strong>حجم:</strong> {(formData.imageUrls[previewImage.index]?.size / 1024 / 1024).toFixed(1)} MB</p>
                <p><strong>نوع:</strong> {formData.imageUrls[previewImage.index]?.type}</p>
              </div>
            </div>
          </div>
        </div>
      )}
         </div>
       );
     });

     export default Modal;