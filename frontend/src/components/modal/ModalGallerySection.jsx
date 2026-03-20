const ModalGallerySection = ({
  imageUrls,
  imageLoading,
  onInputChange,
  onDragOver,
  onDragLeave,
  onDropFiles,
  onRemoveImage,
  onClearImages,
  onImageDragStart,
  onImageDragOver,
  onImageDrop,
  onImageDragEnd
}) => (
  <div>
    <div
      className="w-full p-6 border-2 border-dashed rounded-xl"
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDropFiles}
      data-testid="modal-dropzone"
    >
      <label className={`inline-flex px-4 py-2 rounded-md text-white ${imageLoading ? 'bg-gray-400' : 'bg-blue-600 cursor-pointer'}`}>
        {imageLoading ? 'در حال بارگذاری...' : 'انتخاب تصاویر'}
        <input type="file" multiple accept="image/*" className="hidden" onChange={onInputChange} disabled={imageLoading} />
      </label>
    </div>

    {imageUrls.length > 0 && (
      <div className="mt-4">
        <button type="button" className="text-red-600 mb-3" onClick={onClearImages}>حذف همه</button>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {imageUrls.map((item, index) => (
            <div
              key={item.id}
              draggable
              onDragStart={(e) => onImageDragStart(e, index)}
              onDragOver={onImageDragOver}
              onDrop={(e) => onImageDrop(e, index)}
              onDragEnd={onImageDragEnd}
              className="relative border rounded-xl overflow-hidden"
            >
              <img src={item.previewUrl} alt={`preview-${index}`} className="w-full h-28 object-cover" />
              <button type="button" onClick={() => onRemoveImage(index)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6">×</button>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);

export default ModalGallerySection;
