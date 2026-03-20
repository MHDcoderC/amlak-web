export const ALLOWED_IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
export const ALLOWED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

export const validateImageFiles = ({
  files,
  currentCount = 0,
  maxCount = 10,
  maxSize = 5 * 1024 * 1024
}) => {
  const list = Array.isArray(files) ? files : [];

  const validFiles = list.filter((file) => {
    const extension = `.${file.name.split('.').pop().toLowerCase()}`;
    return ALLOWED_IMAGE_MIME_TYPES.includes(file.type) && ALLOWED_IMAGE_EXTENSIONS.includes(extension);
  });

  if (validFiles.length !== list.length) {
    return { ok: false, error: 'فقط فایل‌های تصویری (JPG, PNG, GIF, WEBP) مجاز هستند.' };
  }

  const oversizedFiles = list.filter((file) => file.size > maxSize);
  if (oversizedFiles.length > 0) {
    return { ok: false, error: 'حجم هر تصویر باید کمتر از 5 مگابایت باشد.' };
  }

  if (currentCount + validFiles.length > maxCount) {
    return { ok: false, error: 'حداکثر 10 تصویر می‌توانید انتخاب کنید.' };
  }

  return { ok: true, files: validFiles };
};

export const createPreviewItems = (files) => files
  .map((file) => {
    try {
      return {
        file,
        previewUrl: URL.createObjectURL(file),
        name: file.name,
        size: file.size,
        type: file.type,
        id: Date.now() + Math.random()
      };
    } catch (error) {
      console.error('Error creating preview URL:', file.name, error);
      return null;
    }
  })
  .filter(Boolean);

export const revokePreviewItem = (item) => {
  if (item?.previewUrl && item.previewUrl.startsWith('blob:')) {
    URL.revokeObjectURL(item.previewUrl);
  }
};

export const revokePreviewItems = (items = []) => {
  items.forEach(revokePreviewItem);
};

export const moveItemInArray = (items, fromIndex, toIndex) => {
  const result = [...items];
  const [moved] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, moved);
  return result;
};
