import { Prompt } from '../models/Prompt.js'

export function startPublishingScheduler(intervalMs = 30000) {
  const checkAndPublish = async () => {
    try {
      const now = new Date()
      const result = await Prompt.updateMany(
        {
          status: 'scheduled',
          scheduledAt: { $lte: now },
        },
        {
          $set: {
            status: 'published',
          },
        },
      )

      if (result.modifiedCount > 0) {
        console.log(
          `[Scheduler] Successfully auto-published ${result.modifiedCount} scheduled prompt(s) at ${now.toISOString()}`,
        )
      }
    } catch (err) {
      console.error('[Scheduler Error] Failed to publish scheduled prompts:', err.message)
    }
  }

  // Run initial check immediately, then periodically
  checkAndPublish()
  const timer = setInterval(checkAndPublish, intervalMs)
  return timer
}
