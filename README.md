# 🌟 OpenClaw Monitor

> OpenClaw 运行状态可视化监控平台 - 星际争霸风格 UI

[![GitHub stars](https://img.shields.io/github/stars/bill20221124/openclaw-monitor)](https://github.com/bill20221124/openclaw-monitor)
[![License](https://img.shields.io/github/license/bill20221124/openclaw-monitor)](LICENSE)
[![Frontend](https://img.shields.io/badge/Frontend-React-blue)](https://react.dev)
[![Backend](https://img.shields.io/badge/Backend-Node.js-green)](https://nodejs.org)

---

## 📖 目录

1. [项目概述](#项目概述)
2. [功能特性](#功能特性)
3. [技术栈](#技术栈)
4. [快速开始](#快速开始)
5. [项目结构](#项目结构)
6. [UI 设计](#ui-设计)
7. [API 接口](#api-接口)
8. [数据模型](#数据模型)
9. [WebSocket 事件](#websocket-事件)
10. [部署指南](#部署指南)
11. [开发指南](#开发指南)
12. [常见问题](#常见问题)

---

## 🎯 项目概述

### 背景

OpenClaw 是一个开源的自主 AI 助手平台，能够 24/7 不间断运行，通过多种消息渠道（WhatsApp、Telegram、Slack 等）与用户交互，执行 shell 命令、浏览器自动化、文件操作等任务。

本项目旨在为 OpenClaw 开发一个类似 [ralv.ai](https://ralv.ai) 风格的**运行状态可视化监控平台**，让用户能够直观地查看和管理多个 OpenClaw Agent 的运行状态。

### 设计目标

- **实时监控**：实时展示 OpenClaw Agent 的运行状态、任务执行情况
- **直观可视**：采用星际争霸风格，用卡片、图表、状态指示器展示信息
- **多 Agent 管理**：支持同时监控多个 OpenClaw 实例
- **无需 3D 渲染**：使用 2D 图表、数据面板、状态指示器实现可视化
- **响应式设计**：支持桌面和移动端访问

---

## ✨ 功能特性

### 核心功能

| 功能 | 说明 |
|------|------|
| 🤖 Agent 状态监控 | 实时展示 Agent 在线/离线/忙碌/错误状态 |
| 📋 任务队列管理 | 查看任务列表、进度、创建/取消任务 |
| 💬 消息流监控 | 查看消息历史、统计、搜索 |
| 🔧 技能使用分析 | 技能调用统计、成功率的、排行 |
| 📜 系统日志 | 日志浏览、筛选、导出 |
| ⚙️ 系统设置 | Agent 配置、通知设置、安全设置 |

### 页面模块

| 页面 | 功能 |
|------|------|
| 🖥️ 仪表板 | Agent 网格视图、统计概览、快速操作 |
| 👤 Agent 详情 | 资源监控、任务队列、消息流、配置 |
| 📋 任务监控 | 任务列表、执行趋势、成功率 |
| 💬 消息监控 | 消息流、统计、搜索 |
| 🔧 技能分析 | 使用排行、图表、成功率的 |
| 📜 系统日志 | 日志浏览、告警中心 |
| ⚙️ 设置 | 通用、通知、安全、外观设置 |

---

## 🛠️ 技术栈

### 前端

| 技术 | 版本 | 用途 |
|------|------|------|
| React | 18.x | UI 框架 |
| TypeScript | 5.x | 类型安全 |
| Tailwind CSS | 3.x | 样式框架 |
| Recharts | 2.x | 图表库 |
| Zustand | 4.x | 状态管理 |
| React Router | 6.x | 路由管理 |
| Socket.io Client | 4.x | WebSocket 客户端 |
| Lucide React | 0.294.x | 图标库 |

### 后端

| 技术 | 版本 | 用途 |
|------|------|------|
| Node.js | 18+ | 运行时 |
| Express | 4.x | Web 框架 |
| Socket.io | 4.x | WebSocket 服务 |
| Helmet | 7.x | 安全中间件 |
| Morgan | 1.x | HTTP 日志 |
| Zod | 3.x | 输入验证 |
| Dotenv | 16.x | 环境变量 |

### 开发工具

| 技术 | 用途 |
|------|------|
| Vite | 前端构建 |
| TypeScript | 代码检查 |
| ESLint | 代码规范 |
| Git | 版本控制 |

---

## 🚀 快速开始

### 前置要求

- Node.js 18+
- npm 9+

### 安装步骤

```bash
# 1. 克隆项目
git clone https://github.com/bill20221124/openclaw-monitor.git
cd openclaw-monitor

# 2. 安装前端依赖
cd frontend
npm install

# 3. 安装后端依赖
cd ../backend
npm install

# 4. 启动后端（开发模式）
npm run dev

# 5. 启动前端（新终端）
cd ../frontend
npm run dev
```

### 访问地址

| 服务 | 地址 |
|------|------|
| 前端 | http://localhost:3000 |
| 后端 API | http://localhost:8080 |
| WebSocket | ws://localhost:8081 |

---

## 📁 项目结构

```
openclaw-monitor/
├── frontend/                      # React 前端
│   ├── src/
│   │   ├── components/          # UI 组件
│   │   │   ├── common/          # 通用组件
│   │   │   │   └── ErrorBoundary.tsx    # 错误边界
│   │   │   ├── layout/         # 布局组件
│   │   │   │   ├── Layout.tsx          # 主布局
│   │   │   │   ├── Header.tsx           # 顶部导航
│   │   │   │   └── Sidebar.tsx         # 侧边栏
│   │   │   └── dashboard/      # 仪表板组件
│   │   │       └── AgentCard.tsx        # Agent 卡片
│   │   ├── pages/             # 页面组件
│   │   │   ├── Dashboard.tsx           # 仪表板
│   │   │   ├── AgentDetail.tsx         # Agent 详情
│   │   │   ├── Tasks.tsx              # 任务监控
│   │   │   ├── Messages.tsx           # 消息监控
│   │   │   ├── Skills.tsx             # 技能分析
│   │   │   ├── Logs.tsx               # 系统日志
│   │   │   └── Settings.tsx           # 设置页面
│   │   ├── lib/               # 工具库
│   │   │   ├── appwrite.ts           # Appwrite 客户端
│   │   │   └── mock.ts               # Mock 数据
│   │   ├── types/             # 类型定义
│   │   │   └── index.ts              # 类型导出
│   │   ├── App.tsx            # 应用入口
│   │   ├── main.tsx           # 渲染入口
│   │   └── index.css          # 全局样式
│   ├── public/                # 静态资源
│   ├── index.html             # HTML 模板
│   ├── package.json           # 依赖配置
│   ├── tsconfig.json         # TS 配置
│   ├── vite.config.ts         # Vite 配置
│   ├── tailwind.config.js    # Tailwind 配置
│   └── postcss.config.js      # PostCSS 配置
│
├── backend/                      # Node.js 后端
│   ├── src/
│   │   ├── routes/           # API 路由
│   │   │   ├── agents.ts      # Agent 管理
│   │   │   ├── tasks.ts       # 任务管理
│   │   │   ├── messages.ts   # 消息管理
│   │   │   ├── skills.ts      # 技能管理
│   │   │   └── logs.ts        # 日志管理
│   │   ├── services/          # 服务层
│   │   │   └── websocket.ts   # WebSocket 服务
│   │   └── index.ts          # 服务入口
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example          # 环境变量示例
│
├── CODE_REVIEW.md             # 代码审查记录
├── README.md                  # 项目文档
└── .gitignore               # Git 忽略配置
```

---

## 🎨 UI 设计

### 配色方案（星际争霸风格）

| 颜色 | 值 | 用途 |
|------|-----|------|
| 主色 | `#00D4FF` | 科技蓝、链接、按钮 |
| 深蓝 | `#0088AA` | 主色深色版本 |
| 橙 | `#FF6B35` | 次要强调 |
| 成功 | `#00C853` | 成功状态 |
| 警告 | `#FFD600` | 警告状态 |
| 错误 | `#FF1744` | 错误状态 |
| 信息 | `#2979FF` | 信息提示 |
| 背景主 | `#0A0E17` | 深空黑 |
| 背景次 | `#141B2D` | 面板背景 |
| 背景三 | `#1E2746` | 卡片背景 |
| 悬停 | `#2A3655` | 交互状态 |
| 文字主 | `#FFFFFF` | 主要文字 |
| 文字次 | `#8B9DC3` | 次要文字 |
| 文字暗 | `#5A6A8A` | 弱化文字 |

### 状态颜色

| 状态 | 颜色 | Emoji |
|------|------|-------|
| 在线/成功 | `#00C853` | 🟢 |
| 忙碌/进行中 | `#00D4FF` | 🔵 |
| 空闲/警告 | `#FFD600` | 🟡 |
| 离线/错误 | `#FF1744` | 🔴 |
| 未知/禁用 | `#5A6A8A` | ⚫ |

### 字体规范

| 用途 | 字体 |
|------|------|
| 标题 | Inter, SF Pro Display |
| 正文 | Inter, SF Pro Text |
| 代码 | JetBrains Mono, Fira Code |

---

## 🔌 API 接口

### Agents

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/agents | 获取所有 Agent |
| GET | /api/agents/stats | 获取统计信息 |
| GET | /api/agents/:id | 获取单个 Agent |
| GET | /api/agents/:id/tasks | 获取 Agent 任务 |
| GET | /api/agents/:id/messages | 获取 Agent 消息 |
| POST | /api/agents | 创建新 Agent |
| PUT | /api/agents/:id | 更新 Agent |
| DELETE | /api/agents/:id | 删除 Agent |
| POST | /api/agents/:id/start | 启动 Agent |
| POST | /api/agents/:id/stop | 停止 Agent |
| POST | /api/agents/:id/restart | 重启 Agent |
| POST | /api/agents/:id/heartbeat | 更新心跳 |

### Tasks

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/tasks | 获取任务列表 |
| GET | /api/tasks/stats | 获取统计信息 |
| GET | /api/tasks/:id | 获取任务详情 |
| POST | /api/tasks | 创建任务 |
| PUT | /api/tasks/:id | 更新任务 |
| POST | /api/tasks/:id/start | 开始任务 |
| POST | /api/tasks/:id/cancel | 取消任务 |
| POST | /api/tasks/:id/progress | 更新进度 |
| POST | /api/tasks/:id/complete | 完成任务 |
| POST | /api/tasks/:id/fail | 标记失败 |
| DELETE | /api/tasks/:id | 删除任务 |

### Messages

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/messages | 获取消息列表 |
| GET | /api/messages/stats | 获取统计信息 |
| GET | /api/messages/search | 搜索消息 |
| GET | /api/messages/:id | 获取消息详情 |
| POST | /api/messages | 发送消息 |
| POST | /api/messages/agent/:agentId | 向 Agent 发消息 |
| DELETE | /api/messages/:id | 删除消息 |

### Skills

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/skills | 获取技能列表 |
| GET | /api/skills/stats | 获取统计信息 |
| GET | /api/skills/:id | 获取技能详情 |
| GET | /api/skills/:id/calls | 获取调用历史 |
| POST | /api/skills | 创建技能 |
| POST | /api/skills/:id/call | 调用技能 |
| DELETE | /api/skills/:id | 删除技能 |

### Logs

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/logs | 获取日志列表 |
| GET | /api/logs/stats | 获取统计信息 |
| GET | /api/logs/:id | 获取日志详情 |
| POST | /api/logs | 创建日志 |
| DELETE | /api/logs | 清理日志 |
| GET | /api/logs/alerts | 获取告警列表 |
| POST | /api/logs/alerts | 创建告警 |
| POST | /api/logs/alerts/:id/acknowledge | 确认告警 |
| DELETE | /api/logs/alerts/:id | 删除告警 |

### 系统

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/health | 健康检查 |

---

## 📊 数据模型

### Agent

```typescript
interface Agent {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'busy' | 'idle' | 'error';
  model: string;
  modelProvider: 'anthropic' | 'openai' | 'ollama' | 'other';
  channels: string[];
  createdAt: string;
  lastHeartbeat: string;
  uptime: number;
  resources: { cpu: number; memory: number; disk: number };
  todayStats: {
    tasksCompleted: number;
    tasksFailed: number;
    messagesReceived: number;
    messagesSent: number;
    skillsCalled: number;
  };
  currentTask: Task | null;
  config: {
    soulMd: string;
    heartbeatInterval: number;
    autoApprove: boolean;
  };
}
```

### Task

```typescript
interface Task {
  id: string;
  agentId: string;
  name: string;
  type: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  progress: number;
  description: string;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  estimatedDuration?: number;
  result?: any;
  error?: string;
}
```

---

## 📡 WebSocket 事件

### 服务端 → 客户端

| 事件 | 说明 |
|------|------|
| agent.status | Agent 状态更新 |
| agent.heartbeat | 心跳数据 |
| task.created | 新任务创建 |
| task.updated | 任务更新 |
| task.completed | 任务完成 |
| message.received | 新消息 |
| message.sent | 消息发送 |
| skill.called | 技能调用 |
| system.alert | 系统告警 |
| system.log | 系统日志 |

### 客户端 → 服务端

| 事件 | 说明 |
|------|------|
| subscribe | 订阅频道 |
| unsubscribe | 取消订阅 |
| ping | 心跳 |
| command | 发送命令 |

---

## 🚢 部署指南

### Docker 部署（推荐）

```yaml
# docker-compose.yml
version: '3.8'

services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - VITE_API_URL=http://backend:8080

  backend:
    build: ./backend
    ports:
      - "8080:8080"
    environment:
      - PORT=8080
      - CORS_ORIGIN=https://your-domain.com
```

### Vercel + Render 部署

1. **前端**：部署到 Vercel
2. **后端**：部署到 Render/Railway

### 环境变量

```bash
# 后端
PORT=8080
CORS_ORIGIN=http://localhost:3000

# 前端（可选）
VITE_API_URL=http://localhost:8080
VITE_WS_ENDPOINT=ws://localhost:8081
```

---

## 👨‍💻 开发指南

### 开发规范

1. **组件命名**
   - 页面组件：`Dashboard.tsx`
   - 子组件：`AgentCard.tsx`
   - 布局组件：`Layout.tsx`

2. **样式规范**
   - 使用 Tailwind CSS
   - 遵循星际争霸配色
   - 使用语义化类名

3. **代码规范**
   - TypeScript 严格模式
   - ESLint 代码检查
   - 提交前检查

### 添加新页面

1. 在 `frontend/src/pages/` 创建组件
2. 在 `App.tsx` 添加路由
3. 在侧边栏添加导航

### 添加新 API

1. 在 `backend/src/routes/` 创建路由
2. 在 `backend/src/index.ts` 注册路由
3. 添加 Zod 验证

---

## ❓ 常见问题

### Q1: 如何修改端口？

```bash
# 后端
cd backend
PORT=3000 npm run dev

# 前端
cd frontend
VITE_PORT=3001 npm run dev
```

### Q2: 如何连接真实数据库？

1. 配置 Appwrite/PostgreSQL
2. 修改 `backend/src/routes/` 中的数据获取逻辑

### Q3: 如何添加新的 Agent 状态？

1. 在 `types/index.ts` 添加状态类型
2. 在前端组件中添加对应的 UI
3. 更新后端 API

---

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE)

---

## 🙏 致谢

- [OpenClaw](https://github.com/openclaw/openclaw) - AI 助手平台
- [ralv.ai](https://ralv.ai) - 星际争霸风格参考
- [React](https://react.dev) - UI 框架
- [Tailwind CSS](https://tailwindcss.com) - 样式框架

---

**作者**: OpenClaw AI Assistant  
**版本**: 1.0.0  
**更新时间**: 2026-02-22  

[![GitHub](https://img.shields.io/badge/GitHub-bill20221124/openclaw--monitor-blue)](https://github.com/bill20221124/openclaw-monitor)
