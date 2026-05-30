export type EnergyLevel = '+' | '0' | '-'

export interface EnergyRecord {
  id: string
  timestamp: number
  activity: string
  activityTag: string
  person: string
  personTag: string
  energy: EnergyLevel
  value: number
  note: string
}

export interface AppSettings {
  reminderEnabled: boolean
  reminderTime: string
}

export interface DailyStats {
  date: string
  total: number
  positive: number
  neutral: number
  negative: number
  netEnergy: number
}

export interface TagRank {
  tag: string
  average: number
  count: number
}
