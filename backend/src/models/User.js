const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email address'],
    },
    passwordHash: {
      type: String,
      required: true,
      select: false, // never returned in queries unless explicitly asked
    },
    role: {
      type: String,
      enum: ['jobseeker', 'employer', 'admin'],
      default: 'jobseeker',
    },
    phone: {
      type: String,
      trim: true,
      match: [/^[6-9]\d{9}$/, 'Invalid Indian phone number'],
    },
    location: {
      city: { type: String, trim: true },
      state: { type: String, trim: true },
    },
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String, select: false },
    emailVerificationExpires: { type: Date, select: false },
    passwordResetToken: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },
    refreshToken: { type: String, select: false },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) return next();
  this.passwordHash = await bcrypt.hash(this.passwordHash, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

// Remove sensitive fields from JSON output
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  delete obj.emailVerificationToken;
  delete obj.emailVerificationExpires;
  delete obj.passwordResetToken;
  delete obj.passwordResetExpires;
  delete obj.refreshToken;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
