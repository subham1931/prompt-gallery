import mongoose from 'mongoose'

const settingsSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, default: 'site_settings' },
    themeAccent: {
      type: String,
      enum: ['orange', 'green', 'blue', 'purple'],
      default: 'orange',
    },
  },
  { timestamps: true },
)

export const Settings = mongoose.model('Settings', settingsSchema)
