import type { EnergyRecord } from '../types'

function formatTimestamp(ts: number): string {
  const d = new Date(ts)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const h = String(d.getHours()).padStart(2, '0')
  const min = String(d.getMinutes()).padStart(2, '0')
  return `${y}-${m}-${day} ${h}:${min}`
}

function csvEscape(val: string): string {
  if (val.includes(',') || val.includes('"') || val.includes('\n')) {
    return `"${val.replace(/"/g, '""')}"`
  }
  return val
}

export function exportCSV(records: EnergyRecord[]): void {
  const headers = ['时间', '做了什么', '活动标签', '和谁在一起', '人物标签', '能量状态', '能量值', '感受备注']
  const rows = records.map((r) => [
    formatTimestamp(r.timestamp),
    csvEscape(r.activity),
    csvEscape(r.activityTag),
    csvEscape(r.person),
    csvEscape(r.personTag),
    r.energy,
    String(r.value),
    csvEscape(r.note),
  ])
  const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
  downloadBlob(new Blob(['\uFEFF' + csv], { type: 'text/csv' }), `能量记录_${formatTimestamp(Date.now()).replace(/[: ]/g, '_')}.csv`)
}

export async function exportExcel(records: EnergyRecord[]): Promise<void> {
  const XLSX = await import('xlsx')
  const data = records.map((r) => ({
    时间: formatTimestamp(r.timestamp),
    做了什么: r.activity,
    活动标签: r.activityTag,
    和谁在一起: r.person,
    人物标签: r.personTag,
    能量状态: r.energy === '+' ? '😊 滋养' : r.energy === '-' ? '😔 消耗' : '😐 中性',
    能量值: r.value,
    感受备注: r.note,
  }))
  const ws = XLSX.utils.json_to_sheet(data)
  ws['!cols'] = [
    { wch: 18 }, { wch: 20 }, { wch: 12 }, { wch: 16 }, { wch: 12 }, { wch: 14 }, { wch: 10 }, { wch: 30 },
  ]
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, '能量记录')
  const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
  downloadBlob(new Blob([buf], { type: 'application/octet-stream' }), `能量记录_${formatTimestamp(Date.now()).replace(/[: ]/g, '_')}.xlsx`)
}

export function exportBackup(records: EnergyRecord[]): void {
  const json = JSON.stringify({ version: '0.1.0', exportedAt: Date.now(), records }, null, 2)
  downloadBlob(new Blob([json], { type: 'application/json' }), `能量流水账_备份_${formatTimestamp(Date.now()).replace(/[: ]/g, '_')}.json`)
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
