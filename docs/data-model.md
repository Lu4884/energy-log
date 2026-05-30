# 能量流水账 - 数据模型文档

## 核心实体

### EnergyRecord（能量记录）

```typescript
interface EnergyRecord {
  id: string;           // UUID v4，唯一标识
  timestamp: number;    // Unix 毫秒时间戳
  activity: string;     // 做了什么（纯文本）
  activityTag: string;  // 活动类型标签
  person: string;       // 和谁在一起（纯文本）
  personTag: string;    // 人物标签
  energy: EnergyLevel;  // 能量状态
  note: string;         // 感受备注
}

type EnergyLevel = '+' | '0' | '-';
```

### AppSettings（应用设置）

```typescript
interface AppSettings {
  reminderEnabled: boolean;  // 提醒开关（MVP 阶段暂不使用）
  reminderTime: string;      // 提醒时间 HH:mm
}
```

## 预设标签

### 活动类型标签 (activityTag)

```
独处休息
工作任务
帮人做事
社交聚会
运动锻炼
学习成长
家务琐事
娱乐消遣
其他
```

### 人物标签 (personTag)

```
自己
家人
朋友
同事
伴侣
陌生人
其他
```

## 存储结构

### localStorage Key: `energy-records`

```json
[
  {
    "id": "a1b2c3d4-...",
    "timestamp": 1717065600000,
    "activity": "帮朋友搬家",
    "activityTag": "帮人做事",
    "person": "老王",
    "personTag": "朋友",
    "energy": "-",
    "note": "其实很累，但不好意思拒绝"
  }
]
```

### localStorage Key: `energy-settings`

```json
{
  "reminderEnabled": false,
  "reminderTime": "20:00"
}
```

## 导出格式

### CSV

```csv
id,时间,做了什么,活动标签,和谁在一起,人物标签,能量状态,感受备注
a1b2...,2024-05-30 14:30,帮朋友搬家,帮人做事,老王,朋友,-,其实很累...
```

### Excel

使用 SheetJS 生成 `.xlsx` 格式，表头同 CSV。

## 统计计算

### 日统计
- 记录总数
- 正能量条数 (energy='+')
- 中性条数 (energy='0')
- 负能量条数 (energy='-')
- 净能量值 = 正条数 - 负条数

### 周统计
- 7 天内每日净能量值数组
- 7 天总净能量值
- 连续记录天数（从今天往前数）

### 月统计
- 30 天内每日净能量值数组
- 正能量占比 = 正条数 / 总条数
- 负能量占比

### 排行榜
- 按 activityTag 分组，计算平均能量值（+ = 1, 0 = 0, - = -1）
- 按 personTag 分组，同上
- 按数值排序
