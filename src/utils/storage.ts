import type { EnergyRecord, AppSettings } from '../types'
import { STORAGE_KEYS } from '../constants/config'

export function getRecords(): EnergyRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RECORDS)
    if (!raw) return []
    const data = JSON.parse(raw) as EnergyRecord[]
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

export function setRecords(records: EnergyRecord[]): void {
  localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(records))
}

export function getSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS)
    if (!raw) return { reminderEnabled: false, reminderTime: '20:00' }
    return JSON.parse(raw) as AppSettings
  } catch {
    return { reminderEnabled: false, reminderTime: '20:00' }
  }
}

export function setSettings(settings: AppSettings): void {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings))
}
