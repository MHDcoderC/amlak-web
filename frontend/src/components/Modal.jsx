import { useState, useEffect, useCallback, memo } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config/api';
import authManager from '../utils/auth';
import { getEntityId } from '../utils/entity';
import { validateImageFiles, createPreviewItems, revokePreviewItem, revokePreviewItems, moveItemInArray } from '../utils/imageUpload';
import ModalFormSection from './modal/ModalFormSection';
import ModalGallerySection from './modal/ModalGallerySection';
import ModalMapSection from './modal/ModalMapSection';
import { provinces } from '../data/provinces';

const Modal = memo(({ setIsModalOpen, onAdCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    address: '',
    province: '',
    city: '',
    location: { lat: 35.6892, lng: 51.3890 },
    imageUrls: [],
    phone: '',
    userNotes: '',
    price: '',
    area: '',
    rooms: '',
    propertyType: 'apartment'
  });
  const [cities, setCities] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);

  useEffect(() => {
    if (!formData.province) return;
    const province = provinces.find((p) => p.name === formData.province);
    if (!province) return;
    setSelectedProvince(province);
    setCities(province.cities);
    setFormData((prev) => ({ ...prev, city: '', location: province.coordinates || prev.location }));
  }, [formData.province]);

  useEffect(() => () => revokePreviewItems(formData.imageUrls), [formData.imageUrls]);

  const appendImages = useCallback((files) => {
    const validation = validateImageFiles({ files, currentCount: formData.imageUrls.length });
    if (!validation.ok) {
      alert(validation.error);
      return;
    }
    const previews = createPreviewItems(validation.files);
    setFormData((prev) => ({ ...prev, imageUrls: [...prev.imageUrls, ...previews] }));
  }, [formData.imageUrls.length]);

  const handleImageUpload = useCallback((e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setImageLoading(true);
    appendImages(files);
    e.target.value = '';
    setImageLoading(false);
  }, [appendImages]);

  const handleDropFiles = useCallback((e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-brand-400', 'bg-brand-50');
    const files = Array.from(e.dataTransfer.files || []);
    if (!files.length) return;
    setImageLoading(true);
    appendImages(files);
    setImageLoading(false);
  }, [appendImages]);

  const handleRemoveImage = useCallback((index) => {
    revokePreviewItem(formData.imageUrls[index]);
    setFormData((prev) => ({ ...prev, imageUrls: prev.imageUrls.filter((_, i) => i !== index) }));
  }, [formData.imageUrls]);

  const handleClearImages = useCallback(() => {
    revokePreviewItems(formData.imageUrls);
    setFormData((prev) => ({ ...prev, imageUrls: [] }));
  }, [formData.imageUrls]);

  const handleMapClick = useCallback((locationData) => {
    if (locationData?.lat && locationData?.lng) {
      setFormData((prev) => ({ ...prev, location: locationData }));
    }
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = authManager.getToken();
      const user = authManager.getUser();
      const userId = getEntityId(user);
      if (!token || !userId) throw new Error('کاربر وارد نشده است.');

      let uploadedImageUrls = [];
      if (formData.imageUrls.length) {
        const formDataToSend = new FormData();
        formData.imageUrls.forEach((item) => formDataToSend.append('images', item.file));
        const uploadRes = await axios.post(`${API_BASE_URL}/api/ads/upload`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        });
        uploadedImageUrls = uploadRes.data.files.map((file) => file.url);
      }

      await axios.post(`${API_BASE_URL}/api/ads`, {
        ...formData,
        lat: formData.location.lat,
        lng: formData.location.lng,
        images: uploadedImageUrls,
        price: formData.price ? Number.parseInt(formData.price, 10) : null,
        area: formData.area ? Number.parseInt(formData.area, 10) : null,
        rooms: formData.rooms ? Number.parseInt(formData.rooms, 10) : null,
        userId
      }, { headers: { Authorization: `Bearer ${token}` } });

      revokePreviewItems(formData.imageUrls);
      if (onAdCreated) onAdCreated();
      else setIsModalOpen(false);
    } catch (error) {
      console.error(error);
      alert('خطا در ثبت آگهی. لطفاً دوباره تلاش کنید.');
    } finally {
      setLoading(false);
    }
  }, [formData, onAdCreated, setIsModalOpen]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-xl border border-gray-200 dark:border-slate-700">
        <div className="p-6 border-b border-gray-200 dark:border-slate-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">ثبت آگهی جدید</h2>
          <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-800">×</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <ModalFormSection formData={formData} setFormData={setFormData} cities={cities} />

          <ModalGallerySection
            imageUrls={formData.imageUrls}
            imageLoading={imageLoading}
            onInputChange={handleImageUpload}
            onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('border-brand-400', 'bg-brand-50'); }}
            onDragLeave={(e) => { e.preventDefault(); e.currentTarget.classList.remove('border-brand-400', 'bg-brand-50'); }}
            onDropFiles={handleDropFiles}
            onRemoveImage={handleRemoveImage}
            onClearImages={handleClearImages}
            onImageDragStart={(e, index) => { setDraggedIndex(index); e.dataTransfer.effectAllowed = 'move'; }}
            onImageDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; }}
            onImageDrop={(e, index) => {
              e.preventDefault();
              if (draggedIndex === null || draggedIndex === index) return;
              setFormData((prev) => ({ ...prev, imageUrls: moveItemInArray(prev.imageUrls, draggedIndex, index) }));
              setDraggedIndex(null);
            }}
            onImageDragEnd={() => setDraggedIndex(null)}
          />

          <ModalMapSection formData={formData} onMapClick={handleMapClick} selectedProvince={selectedProvince} />

          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 border rounded-xl">انصراف</button>
            <button type="submit" disabled={loading} className="px-6 py-3 bg-brand-700 text-white rounded-lg disabled:opacity-50 font-semibold text-sm">
              {loading ? 'در حال ثبت...' : 'ثبت آگهی'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

export default Modal;
