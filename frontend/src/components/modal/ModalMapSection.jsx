import CustomMap from '../CustomMap';

const ModalMapSection = ({ formData, onMapClick, selectedProvince }) => (
  <div className="mt-6">
    <h3 className="text-lg font-bold mb-3">موقعیت مکانی</h3>
    <div className="h-72 rounded-2xl overflow-hidden border">
      <CustomMap
        center={[formData.location?.lat || 35.6892, formData.location?.lng || 51.389]}
        zoom={selectedProvince ? 10 : 6}
        title={formData.title || 'موقعیت ملک'}
        onLocationSelect={onMapClick}
        province={formData.province}
        city={formData.city}
        searchQuery={formData.address}
        className="h-full"
      />
    </div>
  </div>
);

export default ModalMapSection;
