const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  fullName: String,
  profileImage: String,
  plan: {
    type: String,
    enum: ['free', 'pro', 'business'],
    default: 'free'
  },
  credits: { type: Number, default: 5 },
  creditsResetDate: { type: Date, default: () => new Date(Date.now() + 24 * 60 * 60 * 1000) },
  subscription: {
    status: { type: String, enum: ['active', 'inactive', 'cancelled'], default: 'inactive' },
    startDate: Date,
    endDate: Date,
    paymentMethod: String
  },
  customDomain: String,
  isOwner: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);