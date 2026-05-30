import { useState, useMemo, useRef } from 'react'
import { Search, Edit3, Trash2, X, Check } from 'lucide-react'
import { useEnergyRecords } from '../hooks/useEnergy'
import { useRecords } from '../hooks/useRecords'
import { ACTIVITY_TAGS, PERSON_TAGS, ENERGY_OPTIONS } from '../constants/tags'
import type { EnergyRecord, EnergyLevel } from '../types'
import styles from './Record.module.css'

function formatTime(ts: number) {
  const d = new Date(ts)
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const h = String(d.getHours()).padStart(2, '0')
  const min = String(d.getMinutes()).padStart(2, '0')
  return `${m}-${day} ${h}:${min}`
}

function energyToValue(energy: EnergyLevel): number {
  if (energy === '+') return 1
  if (energy === '-') return -1
  return 0
}

export default function Record() {
  const records = useEnergyRecords()
  const { addRecord, updateRecord, deleteRecord } = useRecords()
  const formRef = useRef<HTMLDivElement>(null)

  const [energy, setEnergy] = useState<EnergyLevel | null>(null)
  const [value, setValue] = useState(1)
  const [activity, setActivity] = useState('')
  const [activityTag, setActivityTag] = useState('')
  const [person, setPerson] = useState('')
  const [personTag, setPersonTag] = useState('')
  const [note, setNote] = useState('')
  const [formError, setFormError] = useState('')

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<EnergyRecord | null>(null)
  const [editError, setEditError] = useState('')

  const [showSearch, setShowSearch] = useState(false)
  const [filterEnergy, setFilterEnergy] = useState<EnergyLevel | ''>('')
  const [searchText, setSearchText] = useState('')
  const [showAll, setShowAll] = useState(false)
  const [searchDate, setSearchDate] = useState('')

  const resetForm = () => {
    setEnergy(null)
    setValue(1)
    setActivity('')
    setActivityTag('')
    setPerson('')
    setPersonTag('')
    setNote('')
    setFormError('')
  }

  const handleSave = () => {
    if (!energy) { setFormError('请选择能量状态'); return }
    if (!activity.trim()) { setFormError('请填写做了什么'); return }
    setFormError('')
    addRecord({ energy, value, activity: activity.trim(), activityTag, person: person.trim(), personTag, note: note.trim() })
    resetForm()
  }

  const handleEdit = (record: EnergyRecord) => {
    setEditingId(record.id)
    setEditForm({ ...record })
    setEditError('')
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
  }

  const handleUpdate = () => {
    if (!editForm) return
    if (!editForm.activity.trim()) { setEditError('请填写做了什么'); return }
    setEditError('')
    updateRecord({ ...editForm, activity: editForm.activity.trim(), note: editForm.note.trim() })
    setEditingId(null)
    setEditForm(null)
  }

  const handleDelete = (id: string) => {
    if (editingId === id) { setEditingId(null); setEditForm(null); setEditError('') }
    deleteRecord(id)
  }

  const displayRecords = useMemo(() => records.slice(0, 3), [records])

  const filtered = useMemo(() => {
    let list = records
    if (filterEnergy) list = list.filter((r) => r.energy === filterEnergy)
    if (searchText.trim()) {
      const s = searchText.trim().toLowerCase()
      list = list.filter((r) =>
        r.activity.toLowerCase().includes(s) || r.activityTag.toLowerCase().includes(s) ||
        r.person.toLowerCase().includes(s) || r.personTag.toLowerCase().includes(s) || r.note.toLowerCase().includes(s)
      )
    }
    if (searchDate) {
      list = list.filter((r) => {
        const d = new Date(r.timestamp)
        const ds = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
        return ds === searchDate
      })
    }
    return list
  }, [records, filterEnergy, searchText, searchDate])

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>能量记录</h1>

      <div className={styles.card} ref={formRef}>
        <div className={styles.cardTitle}>
          {editingId ? '编辑记录' : '快速记录'}
          {editingId && <button className={styles.cancelBtn} onClick={() => { setEditingId(null); setEditForm(null); setEditError('') }}><X size={16} /> 取消</button>}
        </div>

        <div className={styles.energyRow}>
          {ENERGY_OPTIONS.map((opt) => {
            const selected = editingId ? editForm?.energy === opt.value : energy === opt.value
            return (
              <button
                key={opt.value}
                className={`${styles.energyBtn} ${selected ? styles.energySelected : ''}`}
                onClick={() => {
                  if (editingId && editForm) {
                    const newVal = opt.value === '+' ? 1 : opt.value === '-' ? -1 : 0
                    setEditForm({ ...editForm, energy: opt.value, value: editForm.value === 0 ? newVal : (opt.value === '0' ? 0 : Math.abs(editForm.value) * (opt.value === '+' ? 1 : -1)) })
                  } else {
                    setEnergy(opt.value)
                    setValue(energyToValue(opt.value))
                  }
                }}
              >
                <span className={styles.energyEmoji}>{opt.emoji}</span>
                <span className={styles.energyLabel}>{opt.label}</span>
              </button>
            )
          })}
        </div>

        <div className={styles.valueRow}>
          <span className={styles.valueLabel}>能量强度：</span>
          <input
            type="number"
            className={styles.valueInput}
            min={energy === '-' || (editingId && editForm?.energy === '-') ? -5 : 0}
            max={5}
            value={editingId ? editForm?.value ?? 0 : value}
            onChange={(e) => {
              const n = parseFloat(e.target.value) || 0
              if (editingId && editForm) setEditForm({ ...editForm, value: n })
              else setValue(n)
            }}
          />
        </div>

        <input
          className={styles.input}
          placeholder="我做了什么..."
          value={editingId ? editForm?.activity ?? '' : activity}
          onChange={(e) => editingId && editForm ? setEditForm({ ...editForm, activity: e.target.value }) : setActivity(e.target.value)}
        />

        <div className={styles.tagLabel}>活动标签（可选）</div>
        <div className={styles.tagGrid}>
          {ACTIVITY_TAGS.map((tag) => {
            const sel = editingId ? editForm?.activityTag === tag : activityTag === tag
            return (
              <button key={tag} className={`${styles.tag} ${sel ? styles.tagActive : ''}`}
                onClick={() => editingId && editForm ? setEditForm({ ...editForm, activityTag: tag }) : setActivityTag(tag)}>{tag}</button>
            )
          })}
        </div>

        <input
          className={styles.input}
          placeholder="和谁在一起（可选）..."
          value={editingId ? editForm?.person ?? '' : person}
          onChange={(e) => editingId && editForm ? setEditForm({ ...editForm, person: e.target.value }) : setPerson(e.target.value)}
        />

        <div className={styles.tagLabel}>人物标签（可选）</div>
        <div className={styles.tagGrid}>
          {PERSON_TAGS.map((tag) => {
            const sel = editingId ? editForm?.personTag === tag : personTag === tag
            return (
              <button key={tag} className={`${styles.tag} ${sel ? styles.tagActive : ''}`}
                onClick={() => editingId && editForm ? setEditForm({ ...editForm, personTag: tag }) : setPersonTag(tag)}>{tag}</button>
            )
          })}
        </div>

        <textarea className={styles.textarea} placeholder="聊聊感受（可选）..." rows={2}
          value={editingId ? editForm?.note ?? '' : note}
          onChange={(e) => editingId && editForm ? setEditForm({ ...editForm, note: e.target.value }) : setNote(e.target.value)}
        />

        {(formError || editError) && <div className={styles.error}>{formError || editError}</div>}

        {editingId ? (
          <button className={styles.saveBtn} onClick={handleUpdate}><Check size={18} /> 保存修改</button>
        ) : (
          <button className={styles.saveBtn} onClick={handleSave}>保存记录</button>
        )}
      </div>

      <div className={styles.card}>
        <div className={styles.listHeader}>
          <span className={styles.cardTitle}>历史记录 {records.length > 0 && <span className={styles.count}>{records.length}</span>}</span>
          <button className={`${styles.filterBtn} ${showSearch ? styles.filterActive : ''}`} onClick={() => setShowSearch(!showSearch)}>
            <Search size={18} />
          </button>
        </div>

        {showSearch && (
          <div className={styles.searchBar}>
            <input className={styles.searchInput} placeholder="搜索记录..." value={searchText} onChange={(e) => setSearchText(e.target.value)} />
            <div className={styles.filterRow}>
              {(['', '+', '0', '-'] as const).map((val) => (
                <button key={val} className={`${styles.filterChip} ${filterEnergy === val ? styles.filterChipActive : ''}`}
                  onClick={() => setFilterEnergy(val)}>
                  {val === '' ? '全部' : val === '+' ? '😊 滋养' : val === '-' ? '😔 消耗' : '😐 中性'}
                </button>
              ))}
            </div>
            <input type="date" className={styles.dateInput} value={searchDate} onChange={(e) => setSearchDate(e.target.value)} />
            {searchDate && <button className={styles.clearDate} onClick={() => setSearchDate('')}>清除日期</button>}
          </div>
        )}

        {showSearch ? (
          <div className={styles.allList}>
            <button className={styles.backBtn} onClick={() => { setShowSearch(false); setSearchText(''); setFilterEnergy(''); setSearchDate(''); }}>← 关闭搜索</button>
            {filtered.length === 0 ? <div className={styles.emptyHint}>没有匹配的记录</div> : (
              filtered.map((r) => (
                <div key={r.id} className={`${styles.recordItem} ${editingId === r.id ? styles.recordEditing : ''}`}>
                  <span className={styles.recordEmoji}>{r.energy === '+' ? '😊' : r.energy === '-' ? '😔' : '😐'}</span>
                  <div className={styles.recordBody}>
                    <div className={styles.recordTitle}>{r.activity || r.activityTag}</div>
                    <div className={styles.recordSub}>
                      {r.personTag && <span className={styles.tagMini}>{r.personTag}</span>}
                      {r.activityTag && <span className={styles.tagMini}>{r.activityTag}</span>}
                      <span className={styles.valMini}>{r.value > 0 ? '+' : ''}{r.value}</span>
                      {r.note && <span className={styles.notePreview}>{r.note}</span>}
                    </div>
                  </div>
                  <span className={styles.recordTime}>{formatTime(r.timestamp)}</span>
                  <div className={styles.recordActions}>
                    <button className={styles.actionBtn} onClick={() => handleEdit(r)}><Edit3 size={14} /></button>
                    <button className={styles.actionBtn} onClick={() => { if (window.confirm('确定删除？')) handleDelete(r.id) }}><Trash2 size={14} /></button>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : showAll ? (
          <div className={styles.allList}>
            <button className={styles.backBtn} onClick={() => setShowAll(false)}>← 返回最近记录</button>
            {records.length === 0 ? <div className={styles.emptyHint}>暂无记录</div> : (
              records.map((r) => (
                <div key={r.id} className={`${styles.recordItem} ${editingId === r.id ? styles.recordEditing : ''}`}>
                  <span className={styles.recordEmoji}>{r.energy === '+' ? '😊' : r.energy === '-' ? '😔' : '😐'}</span>
                  <div className={styles.recordBody}>
                    <div className={styles.recordTitle}>{r.activity || r.activityTag}</div>
                    <div className={styles.recordSub}>
                      {r.personTag && <span className={styles.tagMini}>{r.personTag}</span>}
                      {r.activityTag && <span className={styles.tagMini}>{r.activityTag}</span>}
                      <span className={styles.valMini}>{r.value > 0 ? '+' : ''}{r.value}</span>
                      {r.note && <span className={styles.notePreview}>{r.note}</span>}
                    </div>
                  </div>
                  <span className={styles.recordTime}>{formatTime(r.timestamp)}</span>
                  <div className={styles.recordActions}>
                    <button className={styles.actionBtn} onClick={() => handleEdit(r)}><Edit3 size={14} /></button>
                    <button className={styles.actionBtn} onClick={() => { if (window.confirm('确定删除？')) handleDelete(r.id) }}><Trash2 size={14} /></button>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <>
            {displayRecords.length === 0 ? <div className={styles.emptyHint}>暂无记录</div> : (
              displayRecords.map((r) => (
                <div key={r.id} className={`${styles.recordItem} ${editingId === r.id ? styles.recordEditing : ''}`}>
                  <span className={styles.recordEmoji}>{r.energy === '+' ? '😊' : r.energy === '-' ? '😔' : '😐'}</span>
                  <div className={styles.recordBody}>
                    <div className={styles.recordTitle}>{r.activity || r.activityTag}</div>
                    <div className={styles.recordSub}>
                      {r.personTag && <span className={styles.tagMini}>{r.personTag}</span>}
                      {r.activityTag && <span className={styles.tagMini}>{r.activityTag}</span>}
                      <span className={styles.valMini}>{r.value > 0 ? '+' : ''}{r.value}</span>
                      {r.note && <span className={styles.notePreview}>{r.note}</span>}
                    </div>
                  </div>
                  <span className={styles.recordTime}>{formatTime(r.timestamp)}</span>
                  <div className={styles.recordActions}>
                    <button className={styles.actionBtn} onClick={() => handleEdit(r)}><Edit3 size={14} /></button>
                    <button className={styles.actionBtn} onClick={() => { if (window.confirm('确定删除？')) handleDelete(r.id) }}><Trash2 size={14} /></button>
                  </div>
                </div>
              ))
            )}
            {records.length > 3 && (
              <button className={styles.showAllBtn} onClick={() => setShowAll(true)}>查看全部 {records.length} 条记录 →</button>
            )}
          </>
        )}
      </div>
    </div>
  )
}
