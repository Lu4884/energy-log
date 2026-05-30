# AGENTS.md — 项目开发指引

## 项目简介

**能量流水账** — 移动端能量记录 Web App，帮助用户追踪日常活动的能量变化。

## 标准文档路径

| 文档 | 路径 | 说明 |
|------|------|------|
| 需求规格 | `docs/requirements.md` | 完整功能需求和页面结构 |
| 技术规范 | `docs/tech-spec.md` | 技术栈、项目结构、存储方案 |
| 设计规范 | `docs/design-spec.md` | 色彩、字体、布局、组件设计 |
| 开发计划 | `docs/dev-plan.md` | 分阶段执行步骤 |
| 数据模型 | `docs/data-model.md` | TypeScript 类型、存储结构、统计公式 |
| 开发日志 | `devlog/YYYY-MM-DD.md` | 每日开发记录 |

## 工作流程

1. **开始工作前**：阅读 `docs/dev-plan.md` 确认当前阶段
2. **编码时**：参考 `docs/tech-spec.md`（技术）和 `docs/design-spec.md`（UI）
3. **数据结构**：严格遵循 `docs/data-model.md` 的类型定义
4. **完成阶段后**：更新 `devlog/` 中的当日日志
5. **遇到不确定**：参考 `docs/requirements.md` 确认功能预期

## 开发原则

- 一次只做一个 Phase，完成后验证再继续
- 保持代码简洁，不引入未在技术规范中的依赖
- 所有 UI 组件遵循设计规范中的色彩、间距、圆角标准
- 每个组件独立可测试，通过后再集成
- 数据操作全部通过 `utils/storage.ts` 封装，不直接操作 localStorage

## 常用命令

```bash
npm run dev      # 启动开发服务器
npm run build    # 生产构建
npm run preview  # 预览生产构建
```
