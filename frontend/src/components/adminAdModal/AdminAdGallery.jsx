import { buildMediaUrl } from '../../utils/entity';

const AdminAdGallery = ({ images = [], currentImageIndex, setCurrentImageIndex, onPrev, onNext }) => (
  <div className="mb-8">
    <div className="relative h-80 sm:h-96 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-slate-800 dark:to-slate-700 rounded-2xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-700">
      {images.length > 0 ? (
        <>
          <img src={buildMediaUrl(images[currentImageIndex])} alt={`تصویر ${currentImageIndex + 1}`} className="w-full h-full object-cover rounded-lg" />
          {images.length > 1 && (
            <>
              <button onClick={onPrev} className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 text-white p-4 rounded-full">‹</button>
              <button onClick={onNext} className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 text-white p-4 rounded-full">›</button>
            </>
          )}
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center"><div className="text-8xl">🏠</div></div>
      )}
    </div>

    {images.length > 1 && (
      <div className="mt-4 flex gap-3 overflow-x-auto p-2">
        {images.map((image, index) => (
          <button key={`${image}-${index}`} onClick={() => setCurrentImageIndex(index)} className={`w-20 h-20 rounded-xl overflow-hidden border-2 ${index === currentImageIndex ? 'border-blue-500' : 'border-gray-300'}`}>
            <img src={buildMediaUrl(image)} alt={`thumb-${index + 1}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    )}
  </div>
);

export default AdminAdGallery;
