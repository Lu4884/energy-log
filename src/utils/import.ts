import type { EnergyRecord, EnergyLevel } from '../types'
import { generateUUID } from './uuid'

function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') { current += '"'; i++ }
        else inQuotes = false
      } else { current += ch }
    } else {
      if (ch === '"') inQuotes = true
      else if (ch === ',') { result.push(current); current = '' }
      else current += ch
    }
  }
  result.push(current)
  return result
}

function parseTS(val: string): number {
  const d = new Date(val)
  if (!isNaN(d.getTime())) return d.getTime()
  const m = val.match(/(\d{4})[-/](\d{1,2})[-/](\d{1,2})\s+(\d{1,2}):(\d{2})/)
  if (m) return new Date(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]).getTime()
  return Date.now()
}

function parseEnergy(val: string): EnergyLevel {
  const t = val.trim()
  if (t.includes('😊') || t === '+' || t.includes('滋养')) return '+'
  if (t.includes('😔') || t === '-' || t.includes('消耗')) return '-'
  return '0'
}

export function parseCSV(text: string): EnergyRecord[] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim())
  if (lines.length < 2) return []

  const headers = parseCSVLine(lines[0])
  const hm: Record<string, number> = {}
  headers.forEach((h, i) => { hm[h.trim()] = i })

  const records: EnergyRecord[] = []
  for (let i = 1; i < lines.length; i++) {
    const cols = parseCSVLine(lines[i])
    if (cols.length < 3) continue
    const g = (k: string) => { const idx = hm[k]; return idx !== undefined && idx < cols.length ? cols[idx] : '' }
    const energy = parseEnergy(g('能量状态') || g('energy'))
    const record: EnergyRecord = {
      id: generateUUID(),
      timestamp: parseTS(g('时间')),
      activity: g('做了什么') || g('activity') || '',
      activityTag: g('活动标签') || g('activityTag') || '',
      person: g('和谁在一起') || g('person') || '',
      personTag: g('人物标签') || g('personTag') || '',
      energy,
      value: energy === '+' ? 1 : energy === '-' ? -1 : 0,
      note: g('感受备注') || g('note') || '',
    }
    const rawVal = g('能量值') || g('value')
    if (rawVal) { const n = parseFloat(rawVal); if (!isNaN(n)) record.value = n }
    if (record.activity || record.activityTag) records.push(record)
  }
  return records
}
