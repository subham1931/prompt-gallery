import 'dotenv/config'
import { connectDb } from '../config/db.js'
import { Prompt } from '../models/Prompt.js'

async function run() {
  await connectDb(process.env.MONGODB_URI)
  const now = new Date()

  // For test-20 and test-21 if scheduledAt was set in the future due to timezone mismatch, update scheduledAt to now
  const updated = await Prompt.updateMany(
    { status: 'scheduled' },
    { $set: { status: 'published' } }
  )

  console.log(`Successfully published ${updated.modifiedCount} scheduled prompt(s).`)
  process.exit(0)
}

run().catch(console.error)
