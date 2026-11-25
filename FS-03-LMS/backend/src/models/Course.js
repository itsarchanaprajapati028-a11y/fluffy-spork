const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: String,
    description: String,
    type: { type: String, enum: ['video', 'text', 'quiz'], default: 'video' },
    videoUrl: String,
    content: String,
    duration: { type: Number, default: 0 },
    order: { type: Number, default: 0 },
    isPreview: { type: Boolean, default: false },
    resources: [{ name: String, url: String }],
  },
  { _id: true }
);

const moduleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    order: { type: Number, default: 0 },
    lessons: [lessonSchema],
  },
  { _id: true }
);

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, default: '' },
    shortDescription: { type: String, default: '' },
    thumbnail: { url: String, alt: String },
    images: [{ url: String, alt: String }],
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    category: { type: String, default: '' },
    price: { type: Number, default: 0 },
    originalPrice: { type: Number, default: 0 },
    level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
    duration: { type: Number, default: 0 },
    modules: [moduleSchema],
    lessonsCount: { type: Number, default: 0 },
    students: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: true },
    status: { type: String, enum: ['draft', 'published', 'archived'], default: 'published' },
    tags: [{ type: String }],
    attributes: { type: Map, of: String, default: {} },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

courseSchema.virtual('name').get(function () {
  return this.title;
});
courseSchema.virtual('finalPrice').get(function () {
  if (this.originalPrice && this.originalPrice > this.price) return this.price;
  return this.price;
});
courseSchema.virtual('discountPercent').get(function () {
  if (this.originalPrice && this.originalPrice > this.price) {
    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  return 0;
});
courseSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Course', courseSchema);
module.exports.lessonSchema = lessonSchema;
module.exports.moduleSchema = moduleSchema;