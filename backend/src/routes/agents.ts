import express from 'express'
import { z } from 'zod'

const router = express.Router()

// ============================================
// 类型定义（设计文档 4.1 Agent 数据模型）
// ============================================
interface Agent {
  id: string
  name: string
  status: 'online' | 'offline' | 'busy' | 'error' | 'idle'
  model: string
  modelProvider: 'anthropic' | 'openai' | 'ollama' | 'other'
  channels: string[]
  createdAt: string
  lastHeartbeat: string
  uptime: number
  resources: {
    cpu: number
    memory: number
    disk: number
  }
  todayStats: {
    tasksCompleted: number
    tasksFailed: number
    messagesReceived: number
    messagesSent: number
    skillsCalled: number
  }
  currentTask: Task | null
  config: {
    soulMd: string
    heartbeatInterval: number
    autoApprove: boolean
  }
}

interface Task {
  id: string
  agentId: string
  name: string
  type: string
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled'
  progress: number
  description: string
  createdAt: string
  startedAt?: string
  completedAt?: string
  estimatedDuration?: number
  result?: any
  error?: string
  logs: TaskLog[]
}

interface TaskLog {
  timestamp: string
  level: 'info' | 'warn' | 'error'
  message: string
}

// ============================================
// Mock 数据
// ============================================
let agents: Agent[] = [
  {
    id: 'main',
    name: 'Main Agent',
    status: 'online',
    model: 'MiniMax-M2.5',
    modelProvider: 'other',
    channels: ['telegram'],
    createdAt: '2026-02-20T00:00:00Z',
    lastHeartbeat: new Date().toISOString(),
    uptime: 280000,
    resources: { cpu: 12, memory: 456, disk: 2.1 },
    todayStats: { tasksCompleted: 24, tasksFailed: 1, messagesReceived: 156, messagesSent: 142, skillsCalled: 42 },
    currentTask: null,
    config: {
      soulMd: '# SOUL.md\nYou are a helpful AI assistant...',
      heartbeatInterval: 60,
      autoApprove: false
    }
  }
]

// ============================================
// Zod 验证 Schema（设计文档要求输入验证）
// ============================================
const createAgentSchema = z.object({
  name: z.string().min(1).max(100),
  model: z.string().optional(),
  modelProvider: z.enum(['anthropic', 'openai', 'ollama', 'other']).optional(),
  channels: z.array(z.string()).optional(),
  config: z.object({
    soulMd: z.string().optional(),
    heartbeatInterval: z.number().optional(),
    autoApprove: z.boolean().optional()
  }).optional()
})

const updateAgentSchema = createAgentSchema.partial()

// ============================================
// 中间件：日志记录
// ============================================
const logRequest = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const start = Date.now()
  res.on('finish', () => {
    const duration = Date.now() - start
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`)
  })
  next()
}

router.use(logRequest)

// ============================================
// API: Agent 管理接口（设计文档 5.1）
// ============================================

// GET /api/agents - 获取所有 Agent 列表
router.get('/', (req, res) => {
  try {
    const { status, channel } = req.query
    
    let filtered = [...agents]
    
    if (status) {
      filtered = filtered.filter(a => a.status === status)
    }
    
    if (channel) {
      filtered = filtered.filter(a => a.channels.includes(channel as string))
    }
    
    res.json({
      total: filtered.length,
      agents: filtered
    })
  } catch (error) {
    console.error('Error listing agents:', error)
    res.status(500).json({ error: 'Failed to list agents' })
  }
})

// GET /api/agents/stats - 获取 Agent 统计（设计文档新增）
router.get('/stats', (req, res) => {
  try {
    const stats = {
      total: agents.length,
      online: agents.filter(a => a.status === 'online').length,
      offline: agents.filter(a => a.status === 'offline').length,
      busy: agents.filter(a => a.status === 'busy').length,
      error: agents.filter(a => a.status === 'error').length,
      idle: agents.filter(a => a.status === 'idle').length,
      totalTasksCompleted: agents.reduce((sum, a) => sum + a.todayStats.tasksCompleted, 0),
      totalMessages: agents.reduce((sum, a) => sum + a.todayStats.messagesReceived + a.todayStats.messagesSent, 0)
    }
    res.json(stats)
  } catch (error) {
    console.error('Error getting stats:', error)
    res.status(500).json({ error: 'Failed to get stats' })
  }
})

// GET /api/agents/:id - 获取单个 Agent 详情
router.get('/:id', (req, res) => {
  try {
    const agent = agents.find(a => a.id === req.params.id)
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' })
    }
    res.json(agent)
  } catch (error) {
    console.error('Error getting agent:', error)
    res.status(500).json({ error: 'Failed to get agent' })
  }
})

// GET /api/agents/:id/tasks - 获取 Agent 的任务列表（设计文档新增）
router.get('/:id/tasks', (req, res) => {
  try {
    const agent = agents.find(a => a.id === req.params.id)
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' })
    }
    // 返回当前任务
    if (agent.currentTask) {
      res.json([agent.currentTask])
    } else {
      res.json([])
    }
  } catch (error) {
    console.error('Error getting agent tasks:', error)
    res.status(500).json({ error: 'Failed to get tasks' })
  }
})

// GET /api/agents/:id/messages - 获取 Agent 的消息（设计文档新增）
router.get('/:id/messages', (req, res) => {
  try {
    const agent = agents.find(a => a.id === req.params.id)
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' })
    }
    // 返回模拟消息
    res.json([])
  } catch (error) {
    console.error('Error getting agent messages:', error)
    res.status(500).json({ error: 'Failed to get messages' })
  }
})

// POST /api/agents - 创建新 Agent
router.post('/', (req, res) => {
  try {
    const validation = createAgentSchema.safeParse(req.body)
    
    if (!validation.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validation.error.errors
      })
    }
    
    const newAgent: Agent = {
      id: `agent-${Date.now()}`,
      name: req.body.name,
      model: req.body.model || 'MiniMax-M2.5',
      modelProvider: req.body.modelProvider || 'other',
      status: 'offline',
      channels: req.body.channels || [],
      createdAt: new Date().toISOString(),
      lastHeartbeat: new Date().toISOString(),
      uptime: 0,
      resources: { cpu: 0, memory: 0, disk: 0 },
      todayStats: {
        tasksCompleted: 0,
        tasksFailed: 0,
        messagesReceived: 0,
        messagesSent: 0,
        skillsCalled: 0
      },
      currentTask: null,
      config: req.body.config || {
        soulMd: '',
        heartbeatInterval: 60,
        autoApprove: false
      }
    }
    
    agents.push(newAgent)
    res.status(201).json(newAgent)
  } catch (error) {
    console.error('Error creating agent:', error)
    res.status(500).json({ error: 'Failed to create agent' })
  }
})

// PUT /api/agents/:id - 更新 Agent 配置
router.put('/:id', (req, res) => {
  try {
    const index = agents.findIndex(a => a.id === req.params.id)
    
    if (index === -1) {
      return res.status(404).json({ error: 'Agent not found' })
    }
    
    const validation = updateAgentSchema.safeParse(req.body)
    
    if (!validation.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validation.error.errors
      })
    }
    
    agents[index] = {
      ...agents[index],
      ...req.body,
      id: agents[index].id, // 防止 ID 被修改
      createdAt: agents[index].createdAt // 防止创建时间被修改
    }
    
    res.json(agents[index])
  } catch (error) {
    console.error('Error updating agent:', error)
    res.status(500).json({ error: 'Failed to update agent' })
  }
})

// DELETE /api/agents/:id - 删除 Agent
router.delete('/:id', (req, res) => {
  try {
    const index = agents.findIndex(a => a.id === req.params.id)
    
    if (index === -1) {
      return res.status(404).json({ error: 'Agent not found' })
    }
    
    agents.splice(index, 1)
    res.status(204).send()
  } catch (error) {
    console.error('Error deleting agent:', error)
    res.status(500).json({ error: 'Failed to delete agent' })
  }
})

// POST /api/agents/:id/start - 启动 Agent（设计文档 5.1）
router.post('/:id/start', (req, res) => {
  try {
    const agent = agents.find(a => a.id === req.params.id)
    
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' })
    }
    
    agent.status = 'online'
    agent.lastHeartbeat = new Date().toISOString()
    
    res.json({ message: 'Agent started', agent })
  } catch (error) {
    console.error('Error starting agent:', error)
    res.status(500).json({ error: 'Failed to start agent' })
  }
})

// POST /api/agents/:id/stop - 停止 Agent（设计文档 5.1）
router.post('/:id/stop', (req, res) => {
  try {
    const agent = agents.find(a => a.id === req.params.id)
    
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' })
    }
    
    agent.status = 'offline'
    agent.currentTask = null
    
    res.json({ message: 'Agent stopped', agent })
  } catch (error) {
    console.error('Error stopping agent:', error)
    res.status(500).json({ error: 'Failed to stop agent' })
  }
})

// POST /api/agents/:id/restart - 重启 Agent（设计文档 5.1）
router.post('/:id/restart', (req, res) => {
  try {
    const agent = agents.find(a => a.id === req.params.id)
    
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' })
    }
    
    agent.status = 'busy'
    agent.uptime = 0
    agent.lastHeartbeat = new Date().toISOString()
    
    res.json({ message: 'Agent restarting', agent })
  } catch (error) {
    console.error('Error restarting agent:', error)
    res.status(500).json({ error: 'Failed to restart agent' })
  }
})

// POST /api/agents/:id/heartbeat - 更新心跳（设计文档新增）
router.post('/:id/heartbeat', (req, res) => {
  try {
    const agent = agents.find(a => a.id === req.params.id)
    
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' })
    }
    
    agent.lastHeartbeat = new Date().toISOString()
    
    if (req.body.resources) {
      agent.resources = { ...agent.resources, ...req.body.resources }
    }
    
    res.json({ message: 'Heartbeat updated', lastHeartbeat: agent.lastHeartbeat })
  } catch (error) {
    console.error('Error updating heartbeat:', error)
    res.status(500).json({ error: 'Failed to update heartbeat' })
  }
})

export default router
