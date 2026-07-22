import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

export const USER_ROLES = ['user', 'admin', 'superadmin']

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 160,
    },
    passwordHash: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: USER_ROLES,
      default: 'user',
      index: true,
    },
    likedPromptIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Prompt' }],
  },
  { timestamps: true },
)

userSchema.methods.verifyPassword = function verifyPassword(password) {
  return bcrypt.compare(String(password || ''), this.passwordHash)
}

userSchema.statics.hashPassword = function hashPassword(password) {
  return bcrypt.hash(String(password || ''), 10)
}

userSchema.methods.toPublicJSON = function toPublicJSON() {
  return {
    id: String(this._id),
    name: this.name,
    email: this.email,
    role: this.role || 'user',
    likedPromptIds: (this.likedPromptIds || []).map(String),
    createdAt: this.createdAt,
  }
}

userSchema.methods.isStaff = function isStaff() {
  return this.role === 'admin' || this.role === 'superadmin'
}

export const User = mongoose.model('User', userSchema)
