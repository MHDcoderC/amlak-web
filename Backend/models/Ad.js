const mongoose = require('mongoose');

const adSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'عنوان آگهی الزامی است'],
    trim: true,
    maxlength: [255, 'عنوان نمی‌تواند بیشتر از 255 کاراکتر باشد']
  },
  description: {
    type: String,
    required: [true, 'توضیحات آگهی الزامی است'],
    trim: true
  },
  address: {
    type: String,
    required: [true, 'آدرس الزامی است'],
    trim: true,
    maxlength: [500, 'آدرس نمی‌تواند بیشتر از 500 کاراکتر باشد']
  },
  province: {
    type: String,
    required: [true, 'استان الزامی است'],
    trim: true,
    index: true
  },
  city: {
    type: String,
    required: [true, 'شهر الزامی است'],
    trim: true,
    index: true
  },
  lat: {
    type: Number,
    required: [true, 'عرض جغرافیایی الزامی است']
  },
  lng: {
    type: Number,
    required: [true, 'طول جغرافیایی الزامی است']
  },
  images: [{
    type: String
  }],
  phone: {
    type: String,
    required: [true, 'شماره تماس الزامی است'],
    trim: true,
    match: [/^09\d{9}$/, 'شماره تماس باید در فرمت صحیح باشد']
  },
  userNotes: {
    type: String,
    trim: true
  },
  adminNotes: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
    index: true
  },
  stars: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  viewCount: {
    type: Number,
    default: 0
  },
  clickCount: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    min: 0
  },
  area: {
    type: Number,
    min: 0
  },
  rooms: {
    type: Number,
    min: 0,
    max: 20
  },
  propertyType: {
    type: String,
    enum: ['apartment', 'villa', 'office', 'shop', 'land'],
    default: 'apartment',
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for property type in Persian
adSchema.virtual('propertyTypePersian').get(function() {
  const types = {
    apartment: 'آپارتمان',
    villa: 'ویلا',
    office: 'دفتر',
    shop: 'مغازه',
    land: 'زمین'
  };
  return types[this.propertyType] || this.propertyType;
});

// Index for search
adSchema.index({ title: 'text', description: 'text' });

// Static method: Find approved ads with pagination
adSchema.statics.findApproved = async function(limit = 20, skip = 0) {
  return this.find({ status: 'approved' })
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .populate('userId', 'name phone');
};

// Static method: Find all ads with pagination
adSchema.statics.findAll = async function(limit = 20, skip = 0) {
  return this.find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .populate('userId', 'name phone');
};

// Static method: Search ads
adSchema.statics.search = async function(query, limit = 20, skip = 0) {
  return this.find(
    { $text: { $search: query }, status: 'approved' },
    { score: { $meta: 'textScore' } }
  )
    .sort({ score: { $meta: 'textScore' } })
    .limit(limit)
    .skip(skip);
};

// Static method: Find by province
adSchema.statics.findByProvince = async function(province, limit = 20, skip = 0) {
  return this.find({ province, status: 'approved' })
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip);
};

// Static method: Find by property type
adSchema.statics.findByPropertyType = async function(propertyType, limit = 20, skip = 0) {
  return this.find({ propertyType, status: 'approved' })
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip);
};

// Static method: Find by user ID
adSchema.statics.findByUserId = async function(userId) {
  return this.find({ userId }).sort({ createdAt: -1 });
};

// Static method: Increment view count
adSchema.statics.incrementViewCount = async function(adId) {
  return this.findByIdAndUpdate(adId, { $inc: { viewCount: 1 } });
};

// Static method: Increment click count
adSchema.statics.incrementClickCount = async function(adId) {
  return this.findByIdAndUpdate(adId, { $inc: { clickCount: 1 } });
};

// Static method: Update status
adSchema.statics.updateStatus = async function(adId, status, adminNotes = null) {
  const update = { status };
  if (adminNotes) update.adminNotes = adminNotes;
  return this.findByIdAndUpdate(adId, update, { new: true });
};

// Static method: Update rating
adSchema.statics.updateRating = async function(adId, stars) {
  return this.findByIdAndUpdate(adId, { stars }, { new: true });
};

// Static method: Get statistics
adSchema.statics.getStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        totalAds: { $sum: 1 },
        approvedAds: {
          $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] }
        },
        pendingAds: {
          $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
        },
        rejectedAds: {
          $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] }
        },
        totalViews: { $sum: '$viewCount' },
        totalClicks: { $sum: '$clickCount' }
      }
    }
  ]);

  return stats[0] || {
    totalAds: 0,
    approvedAds: 0,
    pendingAds: 0,
    rejectedAds: 0,
    totalViews: 0,
    totalClicks: 0
  };
};

const Ad = mongoose.model('Ad', adSchema);

module.exports = Ad;
