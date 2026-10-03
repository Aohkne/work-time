// Mọi mốc giờ tính bằng "phút kể từ 00:00" của ngày check-in.
export const WORK_START = 8 * 60 + 30 // 08:30
export const LATE_AFTER = 9 * 60 + 30 // 09:30
export const LUNCH_START = 12 * 60 + 30 // 12:30
export const LUNCH_END = 13 * 60 + 45 // 13:45
export const LUNCH_MIN = LUNCH_END - LUNCH_START // 75'
export const WORK_MIN = 8 * 60 // 8 tiếng làm thực

export function parseTime(value) {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value ?? '')
  if (!match) return null
  const h = Number(match[1])
  const m = Number(match[2])
  if (h > 23 || m > 59) return null
  return h * 60 + m
}

export function formatClock(minutes) {
  const total = Math.round(minutes)
  const h = Math.floor(total / 60) % 24
  const m = total % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

export function formatDuration(minutes) {
  const total = Math.max(0, Math.round(minutes))
  const h = Math.floor(total / 60)
  const m = total % 60
  if (h === 0) return `${m} phút`
  if (m === 0) return `${h} tiếng`
  return `${h} tiếng ${m} phút`
}

export function splitSeconds(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds))
  return {
    h: Math.floor(s / 3600),
    m: Math.floor((s % 3600) / 60),
    s: s % 60,
  }
}

// Tính giờ tan: đủ 8 tiếng làm, không tính nghỉ trưa 12:30–13:45.
export function calcSchedule(checkIn) {
  let start = Math.max(checkIn, WORK_START)
  if (start >= LUNCH_START && start < LUNCH_END) start = LUNCH_END

  let end = start + WORK_MIN
  const spansLunch = start < LUNCH_START && end > LUNCH_START
  if (spansLunch) end += LUNCH_MIN

  return {
    checkIn,
    start,
    end,
    spansLunch,
    isEarly: checkIn < WORK_START,
    isLate: checkIn > LATE_AFTER,
    lateMinutes: Math.max(0, checkIn - LATE_AFTER),
  }
}

function lunchOverlap(from, to) {
  return Math.max(0, Math.min(to, LUNCH_END) - Math.max(from, LUNCH_START))
}

// Trạng thái tại thời điểm `now` (phút, có phần lẻ giây).
export function getProgress(schedule, now) {
  const { start, end, spansLunch } = schedule
  const clamped = Math.min(Math.max(now, start), end)
  const worked = clamped - start - (spansLunch ? lunchOverlap(start, clamped) : 0)

  let phase = 'working'
  if (now < start) phase = 'before'
  else if (now >= end) phase = 'done'
  else if (spansLunch && now >= LUNCH_START && now < LUNCH_END) phase = 'lunch'

  return {
    phase,
    workedMin: worked,
    workPercent: (worked / WORK_MIN) * 100,
    timePercent: ((clamped - start) / (end - start)) * 100,
    remainingSec: Math.max(0, (end - now) * 60),
  }
}

export function nowInMinutes(date = new Date()) {
  return date.getHours() * 60 + date.getMinutes() + date.getSeconds() / 60
}

export function todayKey(date = new Date()) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}
