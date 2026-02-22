// Mock data for OpenClaw Monitor

export interface Agent {
  id: string
  name: string
  status: 'online' | 'offline' | 'busy' | 'idle' | 'error'
  model: string
  uptime: number
  currentTask?: string
  progress?: number
  stats: { tasks: number; messages: number; skills: number }
  resources: { cpu: number; memory: number; disk: number }
  recentSkills: string[]
}

export const mockAgents: Agent[] = [
  {
    id: 'main',
    name: 'Main Agent',
    status: 'online',
    model: 'MiniMax-M2.5',
    uptime: 86400 * 3 + 43200,
    currentTask: '处理用户请求',
    progress: 75,
    stats: { tasks: 24, messages: 156, skills: 42 },
    resources: { cpu: 12, memory: 456, disk: 2.1 },
    recentSkills: ['github', 'browser', 'notion'],
  },
]

export const mockStats = [
  { label: '总 Agent', value: '1', color: 'text-primary' },
  { label: '在线', value: '1', color: 'text-success' },
  { label: '运行任务', value: '1', color: 'text-warning' },
  { label: '今日消息', value: '156', color: 'text-info' },
]

export interface Task {
  id: string
  agentId: string
  name: string
  type: string
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled'
  progress: number
  createdAt: string
  startedAt?: string
  completedAt?: string
  error?: string
}

export const mockTasks: Task[] = [
  { id: '1', agentId: 'main', name: '处理用户请求', type: 'conversation', status: 'running', progress: 75, createdAt: '2026-02-22T10:00:00Z', startedAt: '2026-02-22T10:00:05Z' },
  { id: '2', agentId: 'main', name: '上传日志到 Notion', type: 'automation', status: 'completed', progress: 100, createdAt: '2026-02-22T09:00:00Z', startedAt: '2026-02-22T09:00:00Z', completedAt: '2026-02-22T09:00:30Z' },
  { id: '3', agentId: 'main', name: '测试浏览器', type: 'test', status: 'failed', progress: 50, createdAt: '2026-02-22T08:00:00Z', startedAt: '2026-02-22T08:00:05Z', completedAt: '2026-02-22T08:05:00Z', error: 'Browser not configured' },
]

export interface Message {
  id: string
  agentId: string
  channel: string
  direction: 'incoming' | 'outgoing' | 'system'
  content: string
  contentType: string
  sender?: string
  timestamp: string
  processingTime?: number
}

export const mockMessages: Message[] = [
  { id: '1', agentId: 'main', channel: 'telegram', direction: 'incoming', content: '你好', sender: '8537212690', timestamp: '2026-02-22T10:00:00Z', processingTime: 120 },
  { id: '2', agentId: 'main', channel: 'telegram', direction: 'outgoing', content: '你好！有什么可以帮你的？', sender: 'OpenClaw', timestamp: '2026-02-22T10:00:01Z', processingTime: 50 },
  { id: '3', agentId: 'main', channel: 'telegram', direction: 'incoming', content: '帮我测试一下浏览器', sender: '8537212690', timestamp: '2026-02-22T10:01:00Z', processingTime: 80 },
  { id: '4', agentId: 'main', channel: 'system', direction: 'system', content: 'Agent started', timestamp: '2026-02-22T09:00:00Z' },
]

export interface Skill {
  id: string
  name: string
  description: string
  category: string
  totalCalls: number
  successCalls: number
  failedCalls: number
  avgExecutionTime: number
}

export const mockSkills: Skill[] = [
  { id: '1', name: 'browser', description: 'Browser automation', category: 'tool', totalCalls: 45, successCalls: 44, failedCalls: 1, avgExecutionTime: 1200 },
  { id: '2', name: 'github', description: 'GitHub operations', category: 'tool', totalCalls: 32, successCalls: 32, failedCalls: 0, avgExecutionTime: 800 },
  { id: '3', name: 'notion', description: 'Notion integration', category: 'integration', totalCalls: 28, successCalls: 27, failedCalls: 1, avgExecutionTime: 600 },
  { id: '4', name: 'super-search', description: 'Memory search', category: 'memory', totalCalls: 15, successCalls: 15, failedCalls: 0, avgExecutionTime: 300 },
  { id: '5', name: 'weather', description: 'Weather data', category: 'tool', totalCalls: 12, successCalls: 12, failedCalls: 0, avgExecutionTime: 200 },
  { id: '6', name: 'mcp-microsoft365', description: 'M365 integration', category: 'integration', totalCalls: 8, successCalls: 6, failedCalls: 2, avgExecutionTime: 1500 },
]

export interface LogEntry {
  id: string
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG'
  message: string
  source: string
  timestamp: string
}

export const mockLogs: LogEntry[] = [
  { id: '1', level: 'INFO', message: 'Gateway started successfully', source: 'gateway', timestamp: '2026-02-22T09:00:00Z' },
  { id: '2', level: 'INFO', message: 'Telegram connected', source: 'telegram', timestamp: '2026-02-22T09:00:01Z' },
  { id: '3', level: 'DEBUG', message: 'Skill loaded: browser', source: 'skills', timestamp: '2026-02-22T09:00:02Z' },
  { id: '4', level: 'DEBUG', message: 'Skill loaded: github', source: 'skills', timestamp: '2026-02-22T09:00:03Z' },
  { id: '5', level: 'WARN', message: 'Browser service requires pairing', source: 'browser', timestamp: '2026-02-22T09:15:00Z' },
  { id: '6', level: 'ERROR', message: 'M365 API access blocked by Conditional Access', source: 'm365', timestamp: '2026-02-22T09:30:00Z' },
  { id: '7', level: 'INFO', message: 'Memory automation configured', source: 'cron', timestamp: '2026-02-22T10:00:00Z' },
  { id: '8', level: 'INFO', message: 'Log uploaded to Notion', source: 'automation', timestamp: '2026-02-22T23:00:00Z' },
]
