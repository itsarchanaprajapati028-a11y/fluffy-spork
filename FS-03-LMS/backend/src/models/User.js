const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    phone: { type: String, default: '' },
    avatar: { type: String, default: null },
    role: { type: String, enum: ['student', 'instructor', 'admin'], default: 'student' },
    isVerified: { type: Boolean, default: false },
    bio: { type: String, default: '' },
    headline: { type: String, default: '' },
    expertise: [{ type: String }],
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    studentsCount: { type: Number, default: 0 },
    coursesCount: { type: Number, default: 0 },
    earnings: { type: Number, default: 0 },
  },
  { timestamps: true }
);

userSchema.methods.toPublic = function () {
  return {
    _id: this._id,
    firstName: this.firstName,
    lastName: this.lastName,
    email: this.email,
    phone: this.phone,
    avatar: this.avatar,
    role: this.role,
    isVerified: this.isVerified,
    bio: this.bio,
    headline: this.headline,
    expertise: this.expertise,
    rating: this.rating,
    reviewCount: this.reviewCount,
    studentsCount: this.studentsCount,
    coursesCount: this.coursesCount,
    earnings: this.earnings,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model('User', userSchema);