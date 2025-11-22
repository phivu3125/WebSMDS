/**
 * Business hours detection hook
 * Detects peak hours: 7:30-17:30, Monday-Sunday (T2-CN)
 * Uses Vietnam timezone (Asia/Ho_Chi_Minh)
 */

export const useBusinessHours = () => {
  const isBusinessHours = (): boolean => {
    const now = new Date()
    const vietnamTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Ho_Chi_Minh"}))
    const hour = vietnamTime.getHours()
    const minute = vietnamTime.getMinutes()
    const dayOfWeek = vietnamTime.getDay()

    // Convert current time to minutes since midnight for easy comparison
    const currentTime = hour * 60 + minute
    const startTime = 7 * 60 + 30  // 7:30 = 450 minutes
    const endTime = 17 * 60 + 30   // 17:30 = 1050 minutes

    const result = dayOfWeek >= 0 && dayOfWeek <= 6 && currentTime >= startTime && currentTime <= endTime

    // Check if within business hours (7:30-17:30) and any day (0-6 = Sunday-Saturday)
    return result
  }

  return { isBusinessHours }
}