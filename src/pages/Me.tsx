import { useState } from 'react'
import { Download, Info, BookOpen, Check } from 'lucide-react'
import { useEnergyRecords } from '../hooks/useEnergy'
import { exportExcel } from '../utils/export'
import styles from './Me.module.css'

export default function Me() {
  const records = useEnergyRecords()
  const [toast, setToast] = useState<string | null>(null)
  const [showGuide, setShowGuide] = useState<'usage' | 'practice' | null>(null)

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2000) }

  const handleExportExcel = async () => {
    if (records.length === 0) { showToast('暂无记录可导出'); return }
    await exportExcel(records)
    showToast('Excel 导出成功')
  }

  if (showGuide === 'usage') {
    return (
      <div className={styles.page}>
        <button className={styles.backBtn} onClick={() => setShowGuide(null)}>← 返回</button>
        <h2 className={styles.guideTitle}>使用说明</h2>
        <div className={styles.guideContent}>
          <h3>什么是能量流水账？</h3>
          <p>追踪每一天的能量状态。记录每项活动后的能量变化，直观看到哪些人和事在滋养你，哪些在消耗你。</p>
          <h3>如何记录？</h3>
          <p>每项活动记录：</p>
          <ul><li><strong>做了什么</strong></li><li><strong>和谁在一起</strong></li><li><strong>能量状态</strong> 😊滋养 / 😐中性 / 😔消耗</li><li><strong>能量强度</strong> 可自定义数值大小</li><li><strong>感受备注</strong></li></ul>
          <h3>核心原则</h3>
          <ol><li><strong>不批判</strong>：能量低不代表做错了什么</li><li><strong>连续记录</strong>：每天记录才能看到真实趋势</li><li><strong>观察模式</strong>：留意习惯性付出和真正快乐的区别</li></ol>
          <h3>数据安全</h3>
          <p>所有数据仅存储在您设备的浏览器本地，不上传任何服务器。</p>
        </div>
      </div>
    )
  }

  if (showGuide === 'practice') {
    return (
      <div className={styles.page}>
        <button className={styles.backBtn} onClick={() => setShowGuide(null)}>← 返回</button>
        <h2 className={styles.guideTitle}>练习引导</h2>
        <div className={styles.guideContent}>
          <h3>第一周：看见</h3><p>只记录，不评价。每天写1-3条。不需要分析，只需"看见"。</p>
          <h3>第二周：辨认</h3><p>留意能耗模式。某些人、某些场景反复出现？先辨认，不急着改变。</p>
          <h3>第三周：觉察</h3><p>问问自己：哪些付出是真心愿意的？哪些是出于习惯或压力？</p>
          <h3>第四周：选择</h3><p>做一个小调整。减少一次消耗型社交，或增加一次独处。</p>
          <h3>重要提醒</h3><p>这不是"优化效率"的工具。目的是帮你更诚恳地面对自己。能量有高低是正常的。</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>我的</h1>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>数据管理</div>
        <div className={styles.menuItem} onClick={handleExportExcel}>
          <div className={styles.menuLeft}><Download size={20} className={styles.menuIcon} /><span>导出记录 (Excel)</span></div>
          <span className={styles.menuArrow}>→</span>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>帮助</div>
        <div className={styles.menuItem} onClick={() => setShowGuide('usage')}>
          <div className={styles.menuLeft}><Info size={20} className={styles.menuIcon} /><span>使用说明</span></div>
          <span className={styles.menuArrow}>→</span>
        </div>
        <div className={styles.menuItem} onClick={() => setShowGuide('practice')}>
          <div className={styles.menuLeft}><BookOpen size={20} className={styles.menuIcon} /><span>练习引导</span></div>
          <span className={styles.menuArrow}>→</span>
        </div>
      </div>

      <div className={styles.stats}><span>共 {records.length} 条记录</span></div>
      <div className={styles.version}>能量流水账 v0.1.0</div>

      {toast && (<div className={styles.toast}><Check size={16} /><span>{toast}</span></div>)}
    </div>
  )
}
