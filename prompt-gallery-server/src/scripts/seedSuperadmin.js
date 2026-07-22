import 'dotenv/config'
import { connectDb } from '../config/db.js'
import { User } from '../models/User.js'

async function seedSuperadmin() {
  const email = String(process.env.SUPERADMIN_EMAIL || '')
    .trim()
    .toLowerCase()
  const password = String(process.env.SUPERADMIN_PASSWORD || '')
  const name = String(process.env.SUPERADMIN_NAME || 'Super Admin').trim()

  if (!email || !password) {
    throw new Error('SUPERADMIN_EMAIL and SUPERADMIN_PASSWORD are required')
  }
  if (password.length < 6) {
    throw new Error('SUPERADMIN_PASSWORD must be at least 6 characters')
  }

  await connectDb(process.env.MONGODB_URI)

  const passwordHash = await User.hashPassword(password)
  let user = await User.findOne({ email }).select('+passwordHash')

  if (user) {
    user.name = name || user.name
    user.role = 'superadmin'
    user.passwordHash = passwordHash
    await user.save()
    console.log(`Updated existing user to superadmin: ${email}`)
  } else {
    user = await User.create({
      name: name || 'Super Admin',
      email,
      passwordHash,
      role: 'superadmin',
    })
    console.log(`Created superadmin: ${email}`)
  }

  console.log(JSON.stringify(user.toPublicJSON(), null, 2))
}

seedSuperadmin()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Superadmin seed failed:', err.message || err)
    process.exit(1)
  })
