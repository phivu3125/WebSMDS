/**
 * Business hours detection hook
 * Detects peak hours: 7:30-4:30 next day (qua nửa đêm), Monday-Sunday (T2-CN)
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
    const endTime = 4 * 60 + 30    // 4:30 = 270 minutes (ngày hôm sau)

    // Logic xử lý qua nửa đêm: từ 7:30 sáng đến 23:59 HOẶC từ 00:00 đến 4:30 sáng
    const isAfterStartTime = currentTime >= startTime // Sau 7:30 sáng
    const isBeforeEndTime = currentTime <= endTime     // Trước 4:30 sáng

    return dayOfWeek >= 0 && dayOfWeek <= 6 && (isAfterStartTime || isBeforeEndTime)
  }

  return { isBusinessHours }
}