# 能量流水账 - 技术规范文档

## 技术栈

| 类别 | 选型 | 说明 |
|------|------|------|
| 框架 | React 18+ | 组件化开发，生态丰富 |
| 构建工具 | Vite | 快速开发与构建 |
| 语言 | TypeScript | 类型安全 |
| 路由 | React Router v6 | 4 个页面 SPA 路由 |
| 状态管理 | React Context + useReducer | 轻量级，无额外依赖 |
| 图表 | ECharts 5+ | 功能完整，移动端支持好 |
| 样式 | CSS Modules | 组件级样式隔离 |
| 图标 | Lucide React | 简洁图标库 |
| 导出 | xlsx (SheetJS) | Excel/CSV 文件生成 |
| UUID | crypto.randomUUID() | 浏览器原生 API |
| 存储 | localStorage | 纯本地持久化 |
| 部署 | Netlify | 连接 GitHub 自动部署 |

## 项目结构

```
energy-log/
├── public/
│   └── manifest.json          # PWA manifest
├── src/
│   ├── main.tsx               # 入口
│   ├── App.tsx                # 路由配置
│   ├── constants/
│   │   ├── tags.ts            # 预设标签数据
│   │   └── config.ts          # 应用配置常量
│   ├── types/
│   │   └── index.ts           # TypeScript 类型定义
│   ├── stores/
│   │   └── EnergyContext.tsx   # 全局状态管理
│   ├── utils/
│   │   ├── storage.ts         # localStorage 读写封装
│   │   ├── export.ts          # CSV/Excel 导出
│   │   ├── import.ts          # CSV 导入解析
│   │   └── stats.ts           # 统计计算工具
│   ├── hooks/
│   │   ├── useRecords.ts      # 记录 CRUD hook
│   │   └── useStats.ts        # 统计数据 hook
│   ├── pages/
│   │   ├── Home.tsx           # 首页
│   │   ├── Record.tsx         # 记录页
│   │   ├── Insights.tsx       # 洞察页
│   │   └── Me.tsx             # 我的页
│   ├── components/
│   │   ├── Layout.tsx         # 底部导航布局
│   │   ├── EnergyCard.tsx     # 能量记录卡片
│   │   ├── QuickRecord.tsx    # 快速记录表单
│   │   ├── EnergyIcon.tsx     # 能量状态图标
│   │   ├── TagSelector.tsx    # 标签选择器
│   │   ├── RecordList.tsx     # 记录列表
│   │   ├── WeekChart.tsx      # 周趋势图
│   │   ├── PieChart.tsx       # 占比饼图
│   │   ├── RankList.tsx       # 排行列表
│   │   └── StreakBadge.tsx    # 打卡徽章
│   └── styles/
│       └── global.css         # 全局样式 & CSS 变量
├── docs/                      # 项目文档
├── devlog/                    # 开发日志
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 数据存储

### localStorage Key
- `energy-records`: JSON 数组，存储所有记录
- `energy-settings`: JSON 对象，存储用户设置

### 存储容量
- localStorage 上限约 5MB
- 每条记录约 500 字节，可存储约 10000 条

## 移动端适配

- Viewport: `width=device-width, initial-scale=1.0`
- 基础字号: 16px（防止 iOS 缩放）
- 最小点击区域: 44x44px
- 安全区域适配: `env(safe-area-inset-*)`
- 底部导航固定定位 + safe-area 兼容
- 断点范围: 375px - 430px，兼顾 iPad

## 浏览器兼容
- iOS Safari 14+
- Android Chrome 90+
- 使用 CSS 变量，无需要 PostCSS 兼容
