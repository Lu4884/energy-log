import { Flame } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useEnergyRecords } from '../hooks/useEnergy'
import { getTodayStats, getStreak, getWeeklyNetEnergy } from '../utils/stats'
import WeekChart from '../components/WeekChart'
import styles from './Home.module.css'

function formatDate(date: Date) {
  const weekDays = ['日', '一', '二', '三', '四', '五', '六']
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 周${weekDays[date.getDay()]}`
}

function formatTime(ts: number) {
  const d = new Date(ts)
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

export default function Home() {
  const records = useEnergyRecords()
  const navigate = useNavigate()
  const today = getTodayStats(records)
  const streak = getStreak(records)
  const weekly = getWeeklyNetEnergy(records)
  const recent = records.slice(0, 3)
  const hasData = records.length > 0

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>能量流水账</h1>
        <span className={styles.date}>{formatDate(new Date())}</span>
      </div>

      <div className={styles.card}>
        <div className={styles.cardTitle}>今日能量总览</div>
        {!hasData ? (
          <div className={styles.emptyHint}>暂无记录，去<strong>记录页</strong>添加第一条吧</div>
        ) : (
          <>
            <div className={styles.energyOverview}>
              <div className={styles.energyItem}>
                <span className={styles.energyEmoji}>😊</span>
                <span className={`${styles.energyCount} ${styles.positive}`}>{today.positive}</span>
                <span className={styles.energyLabel}>滋养</span>
              </div>
              <div className={styles.energyItem}>
                <span className={styles.energyEmoji}>😐</span>
                <span className={`${styles.energyCount} ${styles.neutral}`}>{today.neutral}</span>
                <span className={styles.energyLabel}>中性</span>
              </div>
              <div className={styles.energyItem}>
                <span className={styles.energyEmoji}>😔</span>
                <span className={`${styles.energyCount} ${styles.negative}`}>{today.negative}</span>
                <span className={styles.energyLabel}>消耗</span>
              </div>
            </div>
            <div className={styles.netEnergy}>
              <span>今日净能量：</span>
              <span className={`${styles.netValue} ${today.netEnergy > 0 ? styles.positive : today.netEnergy < 0 ? styles.negative : styles.neutral}`}>
                {today.netEnergy >= 0 ? '+' : ''}{today.netEnergy}
              </span>
            </div>
          </>
        )}
      </div>

      <div className={styles.card}>
        <div className={styles.cardTitle}>本周趋势</div>
        {!hasData ? <div className={styles.trendPlaceholder}>记录数据后将展示趋势图</div> : <WeekChart data={weekly} />}
      </div>

      <div className={styles.card}>
        <div className={styles.cardTitle}>
          最近记录
          <span className={styles.recordCount}>{records.length}</span>
        </div>
        {recent.length === 0 ? (
          <div className={styles.emptyHint}>还没有能量记录</div>
        ) : (
          <>
            {recent.map((r) => (
              <div key={r.id} className={styles.recordItem}>
                <span className={styles.recordIcon}>{r.energy === '+' ? '😊' : r.energy === '-' ? '😔' : '😐'}</span>
                <div className={styles.recordInfo}>
                  <div className={styles.recordActivity}>{r.activity || r.activityTag}</div>
                  <div className={styles.recordMeta}>
                    {r.activityTag && <span className={styles.tagMini}>{r.activityTag}</span>}
                    {r.personTag && <span className={styles.tagMini}>{r.personTag}</span>}
                    <span className={styles.valMini}>{r.value > 0 ? '+' : ''}{r.value}</span>
                    {r.note && <span className={styles.noteText}>{r.note}</span>}
                  </div>
                </div>
                <span className={styles.recordTime}>{formatTime(r.timestamp)}</span>
              </div>
            ))}
            {records.length > 3 && (
              <button className={styles.showAllBtn} onClick={() => navigate('/record')}>查看全部 →</button>
            )}
          </>
        )}
      </div>

      <div className={styles.card}>
        <div className={styles.streak}>
          <Flame size={22} color="#7EC8A3" />
          <span className={styles.streakText}>连续记录</span>
          <span className={styles.streakCount}>{streak}</span>
          <span className={styles.streakText}>天</span>
        </div>
        {streak >= 3 && (
          <div className={styles.streakEncourage}>
            {streak >= 7 ? '太棒了！已连续记录一周' : `坚持 ${streak} 天了，继续保持！`}
          </div>
        )}
      </div>
    </div>
  )
}
