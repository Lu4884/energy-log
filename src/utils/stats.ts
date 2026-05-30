import type { EnergyRecord, DailyStats, TagRank } from '../types'

function formatDateKey(ts: number): string {
  const d = new Date(ts)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function getDailyStats(records: EnergyRecord[]): DailyStats[] {
  const map: Record<string, { total: number; positive: number; neutral: number; negative: number; sum: number }> = {}

  for (const r of records) {
    const key = formatDateKey(r.timestamp)
    if (!map[key]) map[key] = { total: 0, positive: 0, neutral: 0, negative: 0, sum: 0 }
    map[key].total++
    map[key].sum += r.value
    if (r.value > 0) map[key].positive++
    else if (r.value < 0) map[key].negative++
    else map[key].neutral++
  }

  return Object.entries(map)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, stats]) => ({
      date,
      total: stats.total,
      positive: stats.positive,
      neutral: stats.neutral,
      negative: stats.negative,
      netEnergy: stats.sum,
    }))
}

export function getWeeklyNetEnergy(records: EnergyRecord[]): number[] {
  const now = new Date()
  const result: number[] = []
  for (let i = 6; i >= 0; i--) {
    const day = new Date(now)
    day.setDate(day.getDate() - i)
    const key = formatDateKey(day.getTime())
    const dayRecords = records.filter((r) => formatDateKey(r.timestamp) === key)
    const sum = dayRecords.reduce((a, r) => a + r.value, 0)
    result.push(sum)
  }
  return result
}

export function getMonthlyNetEnergy(records: EnergyRecord[]): number[] {
  const now = new Date()
  const result: number[] = []
  for (let i = 29; i >= 0; i--) {
    const day = new Date(now)
    day.setDate(day.getDate() - i)
    const key = formatDateKey(day.getTime())
    const dayRecords = records.filter((r) => formatDateKey(r.timestamp) === key)
    const sum = dayRecords.reduce((a, r) => a + r.value, 0)
    result.push(sum)
  }
  return result
}

export function getStreak(records: EnergyRecord[]): number {
  if (records.length === 0) return 0
  const now = new Date()
  let streak = 0
  for (let i = 0; ; i++) {
    const day = new Date(now)
    day.setDate(day.getDate() - i)
    const key = formatDateKey(day.getTime())
    const hasRecords = records.some((r) => formatDateKey(r.timestamp) === key)
    if (hasRecords) {
      streak++
    } else {
      if (i === 0) continue
      break
    }
  }
  return streak
}

export function getTodayStats(records: EnergyRecord[]) {
  const todayKey = formatDateKey(Date.now())
  const todayRecords = records.filter((r) => formatDateKey(r.timestamp) === todayKey)
  const positive = todayRecords.filter((r) => r.value > 0).length
  const neutral = todayRecords.filter((r) => r.value === 0).length
  const negative = todayRecords.filter((r) => r.value < 0).length
  const netEnergy = todayRecords.reduce((a, r) => a + r.value, 0)
  return { total: todayRecords.length, positive, neutral, negative, netEnergy }
}

export function getTagRank(records: EnergyRecord[], tagKey: 'activityTag' | 'personTag'): TagRank[] {
  const map: Record<string, { sum: number; count: number }> = {}
  for (const r of records) {
    const raw = r[tagKey]
    const tag = raw && raw.trim() ? raw.trim() : '其他'
    if (!map[tag]) map[tag] = { sum: 0, count: 0 }
    map[tag].sum += r.value
    map[tag].count++
  }
  return Object.entries(map)
    .map(([tag, { sum, count }]) => ({ tag, average: Math.round((sum / count) * 100) / 100, count }))
    .sort((a, b) => b.average - a.average)
}
