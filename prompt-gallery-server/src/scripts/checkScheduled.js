import 'dotenv/config'
import { connectDb } from '../config/db.js'
import { Prompt } from '../models/Prompt.js'

async function check() {
  await connectDb(process.env.MONGODB_URI)
  const docs = await Prompt.find({ status: 'scheduled' })
  console.log('--- SCHEDULED PROMPTS IN DB ---')
  console.log('Count:', docs.length)
  for (const doc of docs) {
    console.log({
      id: doc._id,
      title: doc.title,
      status: doc.status,
      scheduledAt: doc.scheduledAt,
      scheduledAtISO: doc.scheduledAt ? doc.scheduledAt.toISOString() : null,
      currentTimeISO: new Date().toISOString(),
      isLteNow: doc.scheduledAt ? doc.scheduledAt <= new Date() : false,
    })
  }
  process.exit(0)
}

check().catch(console.error)
