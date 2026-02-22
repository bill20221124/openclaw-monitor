# OpenClaw Monitor

> OpenClaw 运行状态可视化监控平台 - 星际争霸风格 UI

## 🎯 项目概述

一个类似 ralv.ai 风格的实时监控平台，用于监控 OpenClaw Agent 的运行状态、任务执行、消息通信等。

## 🚀 快速开始

### 前端

```bash
cd frontend
npm install
npm run dev
```

访问 http://localhost:3000

### 后端

```bash
cd backend
npm install
npm run dev
```

API 运行在 http://localhost:8080

## 📁 项目结构

```
openclaw-monitor/
├── frontend/                 # React + TypeScript 前端
│   ├── src/
│   │   ├── components/     # UI 组件
│   │   │   ├── layout/    # 布局组件
│   │   │   └── dashboard/ # 仪表板组件
│   │   ├── pages/         # 页面组件
│   │   ├── hooks/         # React Hooks
│   │   ├── lib/          # 工具库
│   │   └── types/        # TypeScript 类型定义
│   ├── public/           # 静态资源
│   └── ...
│
├── backend/                # Node.js + Express 后端
│   ├── src/
│   │   ├── routes/      # API 路由
│   │   ├── services/    # 服务层
│   │   └── middleware/  # 中间件
│   └── ...
│
└── README.md
```

## 🎨 UI 设计

### 配色方案（星际争霸风格）

| 颜色 | 值 | 用途 |
|------|-----|------|
| 主色 | `#00D4FF` | 科技蓝 |
| 背景 | `#0A0E17` | 深空黑 |
| 面板 | `#141B2D` | 面板灰 |
| 成功 | `#00C853` | 成功绿 |
| 警告 | `#FFD600` | 警告黄 |
| 错误 | `#FF1744` | 错误红 |

## 📊 功能

### 已完成

- [x] Agent 状态监控面板
- [x] 任务队列管理
- [x] 消息流查看
- [x] 技能使用统计
- [x] 系统日志浏览
- [x] 用户设置页面
- [x] 资源使用图表
- [x] 响应式设计

### 待完成

- [ ] WebSocket 实时更新
- [ ] Appwrite 数据集成
- [ ] 用户认证

## 🔌 API 接口

### Agents

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/agents | 获取所有 Agent |
| GET | /api/agents/:id | 获取单个 Agent |
| POST | /api/agents | 创建 Agent |
| PUT | /api/agents/:id | 更新 Agent |
| DELETE | /api/agents/:id | 删除 Agent |

### Tasks

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/tasks | 获取任务列表 |
| POST | /api/tasks/:id/cancel | 取消任务 |

### Messages

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/messages | 获取消息列表 |
| GET | /api/messages/stats | 获取消息统计 |

### Skills

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/skills | 获取技能列表 |
| GET | /api/skills/stats | 获取技能统计 |

### Logs

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/logs | 获取日志列表 |
| GET | /api/logs/alerts | 获取告警列表 |

## 🛠️ 技术栈

### 前端

- React 18
- TypeScript
- Tailwind CSS
- shadcn/ui
- Recharts (图表)
- Zustand (状态管理)
- Socket.io Client
- React Router

### 后端

- Node.js
- Express
- Socket.io
- Helmet (安全)
- Morgan (日志)

## 📝 开发规范

### 组件命名

```tsx
// 页面组件
export function Dashboard() { }

// 子组件
export function AgentCard() { }

// 布局组件
export function Layout() { }
```

### 样式规范

使用 Tailwind CSS，遵循星际争霸配色：

```tsx
// 正确
<div className="bg-bg-secondary text-text-primary">

// 避免
<div className="bg-gray-900 text-white">
```

## 📄 许可证

MIT

---

**作者**: OpenClaw AI Assistant  
**版本**: 1.0.0  
**日期**: 2026-02-22
