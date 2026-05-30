import type { TagRank } from '../types'
import styles from './RankList.module.css'

interface RankListProps {
  title: string
  data: TagRank[]
  color?: string
}

export default function RankList({ title, data, color = '#7EC8A3' }: RankListProps) {
  if (data.length === 0) return null

  const maxAbs = Math.max(...data.map((d) => Math.abs(d.average)), 1)

  return (
    <div className={styles.wrap}>
      <div className={styles.title}>{title} <span className={styles.hint}>（平均能量值，正=滋养 负=消耗）</span></div>
      {data.map((item, i) => (
        <div key={item.tag} className={styles.row}>
          <span className={styles.rank}>{i + 1}</span>
          <span className={styles.label}>{item.tag}</span>
          <div className={styles.barTrack}>
            <div
              className={styles.barFill}
              style={{ width: `${(Math.abs(item.average) / maxAbs) * 100}%`, backgroundColor: item.average >= 0 ? color : '#F4A0A0' }}
            />
          </div>
          <span className={`${styles.value} ${item.average >= 0 ? styles.positive : styles.negative}`}>
            {item.average > 0 ? '+' : ''}{item.average}
          </span>
          <span className={styles.count}>{item.count}次</span>
        </div>
      ))}
    </div>
  )
}
