import { useState, useMemo } from 'react'
import { AlertTriangle } from 'lucide-react'
import { useEnergyRecords } from '../hooks/useEnergy'
import { getWeeklyNetEnergy, getMonthlyNetEnergy, getStreak, getTagRank } from '../utils/stats'
import type { TagRank } from '../types'
import TrendChart from '../components/TrendChart'
import DonutChart from '../components/DonutChart'
import RankList from '../components/RankList'
import styles from './Insights.module.css'

function getActivityRank(records: { activity: string; activityTag: string; value: number }[]): (TagRank & { tags: string[] })[] {
  const map: Record<string, { sum: number; count: number; tags: string[] }> = {}
  for (const r of records) {
    const key = r.activity || '(未填写)'
    if (!map[key]) map[key] = { sum: 0, count: 0, tags: [] }
    map[key].sum += r.value
    map[key].count++
    if (r.activityTag && r.activityTag !== '其他' && !map[key].tags.includes(r.activityTag)) {
      map[key].tags.push(r.activityTag)
    }
  }
  return Object.entries(map)
    .map(([tag, { sum, count, tags }]) => ({
      tag,
      average: Math.round((sum / count) * 100) / 100,
      count,
      tags,
    }))
    .sort((a, b) => b.average - a.average)
}

function showActLabel(actText: string, tags: string[]): string {
  if (!tags.length) return `「${actText}」`
  return `「${actText} · ${tags.join('、')}」`
}

function generateReport(
  recordsLen: number,
  posCount: number, negCount: number,
  posSum: number, negSum: number, netSum: number,
  topAct: string, btmAct: string, topActTags: string[], btmActTags: string[],
  topPers: string, btmPers: string,
  topActVal: number, btmActVal: number
): string[] {
  const lines: string[] = []
  if (recordsLen === 0) return ['还没有记录数据，去记录页添加第一条吧。']

  lines.push(`共记录 ${recordsLen} 条活动，滋养 ${posCount} 条（+${posSum}），消耗 ${negCount} 条（${negSum}），净能量 ${netSum > 0 ? '+' : ''}${netSum}。`)

  if (topAct) {
    const valStr = topActVal > 1 ? `（+${topActVal}）` : ''
    lines.push(`最滋养你的事是${showActLabel(topAct, topActTags)}${valStr}。`)
  }
  if (btmAct && btmAct !== topAct) {
    const valStr = btmActVal < -1 ? `（${btmActVal}）` : ''
    lines.push(`最消耗你的事是${showActLabel(btmAct, btmActTags)}${valStr}，可以观察一下背后的原因。`)
  }

  if (topPers) lines.push(`和「${topPers}」在一起时能量最高。`)
  if (btmPers && btmPers !== topPers) lines.push(`和「${btmPers}」相处时能量偏低。`)

  if (netSum > 1) lines.push('整体来看你的能量状态不错，加油保持。')
  else if (netSum < 0) lines.push('最近净能量为负，记得给自己留一些喘息的空间，照顾好自己。')
  else lines.push('能量有高有低是正常的，重要的是你看见了自己。')

  return lines
}

export default function Insights() {
  const records = useEnergyRecords()
  const [tab, setTab] = useState<'week' | 'month'>('week')

  const weeklyData = useMemo(() => getWeeklyNetEnergy(records), [records])
  const monthlyData = useMemo(() => getMonthlyNetEnergy(records), [records])
  const streak = useMemo(() => getStreak(records), [records])
  const activityRanks = useMemo(() => getTagRank(records, 'activityTag'), [records])
  const personRanks = useMemo(() => getTagRank(records, 'personTag'), [records])

  const posCount = useMemo(() => records.filter((r) => r.value > 0).length, [records])
  const neuCount = useMemo(() => records.filter((r) => r.value === 0).length, [records])
  const negCount = useMemo(() => records.filter((r) => r.value < 0).length, [records])

  const posSum = useMemo(() => records.reduce((a, r) => a + (r.value > 0 ? r.value : 0), 0), [records])
  const negSum = useMemo(() => records.reduce((a, r) => a + (r.value < 0 ? r.value : 0), 0), [records])
  const netSum = posSum + negSum

  const reportLines = useMemo(() => {
    const perFiltered = personRanks.filter((r) => r.tag !== '其他')
    const actRank = getActivityRank(records.map((r) => ({ activity: r.activity, activityTag: r.activityTag, value: r.value })))
    const actFiltered = actRank.filter((r) => r.tag !== '(未填写)')
    const topAct = actFiltered[0]
    const btmAct = actFiltered[actFiltered.length - 1]
    return generateReport(
      records.length, posCount, negCount, posSum, negSum, netSum,
      topAct?.tag ?? '', btmAct?.tag !== topAct?.tag ? (btmAct?.tag ?? '') : '',
      topAct?.tags ?? [], btmAct?.tags ?? [],
      perFiltered[0]?.tag ?? '', perFiltered[perFiltered.length - 1]?.tag !== perFiltered[0]?.tag ? (perFiltered[perFiltered.length - 1]?.tag ?? '') : '',
      topAct?.average ?? 0, btmAct?.average ?? 0
    )
  }, [records, posCount, negCount, posSum, negSum, netSum, personRanks])

  const showSOS = streak >= 3 && records.length > 0 && negCount > posCount * 1.5
  const hasData = records.length > 0

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>能量洞察</h1>

      {!hasData ? (
        <div className={styles.card}><div className={styles.emptyState}><span className={styles.emptyEmoji}>📊</span><p>记录数据后将自动生成洞察报告</p></div></div>
      ) : (
        <>
          {showSOS && (
            <div className={styles.sosCard}><AlertTriangle size={18} /><span>能量急救：最近消耗型活动较多，记得给自己一些独处休息的时间。</span></div>
          )}

          <div className={styles.card}>
            <div className={styles.cardTitle}>
              <span>能量趋势</span>
              <div className={styles.tabSwitch}>
                <button className={`${styles.tab} ${tab === 'week' ? styles.tabActive : ''}`} onClick={() => setTab('week')}>本周</button>
                <button className={`${styles.tab} ${tab === 'month' ? styles.tabActive : ''}`} onClick={() => setTab('month')}>本月</button>
              </div>
            </div>
            <TrendChart data={tab === 'week' ? weeklyData : monthlyData} type={tab} />
          </div>

          <div className={styles.card}>
            <div className={styles.cardTitle}>能量占比（按实际能量值）</div>
            <DonutChart positive={posSum} neutral={neuCount} negative={Math.abs(negSum)} />
            <div className={styles.ratioStats}>
              <div className={styles.ratioItem}><span className={styles.ratioPos}>+{posSum}</span><span className={styles.ratioLabel}>滋养</span></div>
              <div className={styles.ratioItem}><span className={styles.ratioNeu}>{neuCount}</span><span className={styles.ratioLabel}>中性</span></div>
              <div className={styles.ratioItem}><span className={styles.ratioNeg}>{negSum}</span><span className={styles.ratioLabel}>消耗</span></div>
            </div>
          </div>

          <div className={styles.card}>
            <RankList title="活动类型排行" data={activityRanks} color="#7EC8A3" />
            <RankList title="人际能量排行" data={personRanks} color="#63B3ED" />
          </div>

          <div className={styles.card}>
            <div className={styles.cardTitle}>分析报告</div>
            <div className={styles.report}>{reportLines.map((line, i) => <p key={i} className={styles.reportLine}>{line}</p>)}</div>
          </div>
        </>
      )}
    </div>
  )
}
