import { useEffect, useState, memo } from 'react';
import { getEntityId } from '../utils/entity';
import { formatPriceFa, getPropertyTypeLabelFa, getStatusMetaFa } from '../utils/adPresentation';
import AdminAdHeader from './adminAdModal/AdminAdHeader';
import AdminAdGallery from './adminAdModal/AdminAdGallery';
import AdminAdMeta from './adminAdModal/AdminAdMeta';
import AdminAdContact from './adminAdModal/AdminAdContact';

const AdminAdModal = memo(({ ad, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const adId = getEntityId(ad);

  useEffect(() => {
    if (adId) setCurrentImageIndex(0);
  }, [adId]);

  const statusMeta = getStatusMetaFa(ad.status);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-7xl w-full max-h-[95vh] overflow-y-auto shadow-2xl border border-gray-100 dark:border-slate-700">
        <AdminAdHeader
          title={ad.title}
          statusText={statusMeta.text}
          statusColor={statusMeta.color}
          createdAt={ad.createdAt}
          onClose={onClose}
        />

        <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div>
            <AdminAdGallery
              images={ad.images || []}
              currentImageIndex={currentImageIndex}
              setCurrentImageIndex={setCurrentImageIndex}
              onPrev={() => setCurrentImageIndex((prev) => (prev - 1 + ad.images.length) % ad.images.length)}
              onNext={() => setCurrentImageIndex((prev) => (prev + 1) % ad.images.length)}
            />
            <AdminAdMeta
              ad={ad}
              propertyTypeLabel={getPropertyTypeLabelFa(ad.propertyType)}
              formattedPrice={formatPriceFa(ad.price)}
            />
          </div>

          <AdminAdContact ad={ad} />
        </div>
      </div>
    </div>
  );
});

export default AdminAdModal;
