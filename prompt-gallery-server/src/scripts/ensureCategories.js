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

export async function seedCategoriesIfEmpty() {
  const count = await Category.countDocuments()
  if (count > 0) return

  await Category.insertMany(SEED)
  console.log(`Seeded ${SEED.length} categories`)
}
