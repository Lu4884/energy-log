export const ACTIVITY_TAGS = [
  '独处休息',
  '工作任务',
  '帮人做事',
  '社交聚会',
  '运动锻炼',
  '学习成长',
  '家务琐事',
  '娱乐消遣',
  '其他',
] as const

export const PERSON_TAGS = [
  '自己',
  '家人',
  '朋友',
  '同事',
  '伴侣',
  '陌生人',
  '其他',
] as const

export const ENERGY_OPTIONS = [
  { value: '+' as const, label: '滋养', emoji: '😊' },
  { value: '0' as const, label: '中性', emoji: '😐' },
  { value: '-' as const, label: '消耗', emoji: '😔' },
]
