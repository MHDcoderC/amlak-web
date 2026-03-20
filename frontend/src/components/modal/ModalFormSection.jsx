import { provinces } from '../../data/provinces';

const propertyTypes = [
  { value: 'apartment', label: 'آپارتمان' },
  { value: 'villa', label: 'ویلا' },
  { value: 'office', label: 'دفتر کار' },
  { value: 'shop', label: 'مغازه' },
  { value: 'land', label: 'زمین' }
];

const ModalFormSection = ({ formData, setFormData, cities }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div className="space-y-4">
      <input className="w-full p-3 border rounded-xl" placeholder="عنوان آگهی *" value={formData.title} onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))} required />
      <select className="w-full p-3 border rounded-xl" value={formData.propertyType} onChange={(e) => setFormData((p) => ({ ...p, propertyType: e.target.value }))}>
        {propertyTypes.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}
      </select>
      <select className="w-full p-3 border rounded-xl" value={formData.province} onChange={(e) => setFormData((p) => ({ ...p, province: e.target.value }))} required>
        <option value="">انتخاب استان</option>
        {provinces.map((province) => <option key={province.name} value={province.name}>{province.name}</option>)}
      </select>
      <select className="w-full p-3 border rounded-xl" value={formData.city} onChange={(e) => setFormData((p) => ({ ...p, city: e.target.value }))} disabled={!formData.province} required>
        <option value="">انتخاب شهر</option>
        {cities.map((city, index) => <option key={`${city}-${index}`} value={city}>{city}</option>)}
      </select>
      <input className="w-full p-3 border rounded-xl" placeholder="آدرس دقیق *" value={formData.address} onChange={(e) => setFormData((p) => ({ ...p, address: e.target.value }))} required />
      <input className="w-full p-3 border rounded-xl" placeholder="شماره تماس *" value={formData.phone} onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))} required />
    </div>

    <div className="space-y-4">
      <input className="w-full p-3 border rounded-xl" placeholder="قیمت (تومان)" value={formData.price} onChange={(e) => setFormData((p) => ({ ...p, price: e.target.value }))} type="number" />
      <div className="grid grid-cols-2 gap-4">
        <input className="w-full p-3 border rounded-xl" placeholder="متراژ" value={formData.area} onChange={(e) => setFormData((p) => ({ ...p, area: e.target.value }))} type="number" />
        <input className="w-full p-3 border rounded-xl" placeholder="تعداد خواب" value={formData.rooms} onChange={(e) => setFormData((p) => ({ ...p, rooms: e.target.value }))} type="number" />
      </div>
      <textarea className="w-full p-3 border rounded-xl" rows={4} placeholder="توضیحات *" value={formData.description} onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))} required />
      <textarea className="w-full p-3 border rounded-xl bg-yellow-50" rows={3} placeholder="توضیحات اضافی برای مدیر (اختیاری)" value={formData.userNotes} onChange={(e) => setFormData((p) => ({ ...p, userNotes: e.target.value }))} />
    </div>
  </div>
);

export default ModalFormSection;
