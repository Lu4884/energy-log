export const STORAGE_KEYS = {
  RECORDS: 'energy-records',
  SETTINGS: 'energy-settings',
} as const

export const APP_VERSION = '0.1.0'

export const ENERGY_SOS_THRESHOLD = 3 // 连续负能量天数触发急救提示
