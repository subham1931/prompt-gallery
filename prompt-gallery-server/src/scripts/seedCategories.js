import 'dotenv/config'
import { connectDb } from '../config/db.js'
import { Category } from '../models/Category.js'

const SEED = [
  { name: 'Portraits', slug: 'portraits', icon: 'P' },
  { name: 'Fashion & Editorial', slug: 'fashion-editorial', icon: 'F' },
  { name: 'Photography', slug: 'photography', icon: 'Ph' },
  { name: 'Cinematic', slug: 'cinematic', icon: 'C' },
  { name: 'Lifestyle', slug: 'lifestyle', icon: 'L' },
  { name: 'Digital Art', slug: 'digital-art', icon: 'D' },
  { name: 'Men', slug: 'men', icon: 'M' },
  { name: 'Woman', slug: 'woman', icon: 'W' },
  { name: 'Business & Professional', slug: 'business-professional', icon: 'B' },
  { name: 'Black & White', slug: 'black-white', icon: 'BW' },
  { name: 'Couple', slug: 'couple', icon: 'Cp' },
  { name: 'Family', slug: 'family', icon: 'Fa' },
  { name: 'Birthday', slug: 'birthday', icon: 'Bd' },
  { name: 'Nature', slug: 'nature', icon: 'N' },
  { name: 'Vintage', slug: 'vintage', icon: 'V' },
]

async function seed() {
  await connectDb(process.env.MONGODB_URI)

  for (const cat of SEED) {
    await Category.updateOne({ slug: cat.slug }, { $setOnInsert: cat }, { upsert: true })
  }

  console.log(`Categories ready: ${await Category.countDocuments()}`)
  process.exit(0)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
