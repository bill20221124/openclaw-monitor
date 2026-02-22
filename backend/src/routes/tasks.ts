import express from 'express'
import { z } from 'zod'

const router = express.Router()

// ============================================
// 类型定义（设计文档 4.2 任务数据模型）
// ============================================
interface Task {
  id: string
  agentId: string
  name: string
  type: string
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled'
  progress: number
  description: string
  parameters?: Record<string, any>
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
let tasks: Task[] = [
  {
    id: 'task-1',
    agentId: 'main',
    name: '处理用户请求',
    type: 'conversation',
    status: 'running',
    progress: 75,
    description: '处理用户的消息请求',
    createdAt: '2026-02-22T10:00:00Z',
    startedAt: '2026-02-22T10:00:05Z',
    logs: [
      { timestamp: '2026-02-22T10:00:05Z', level: 'info', message: '任务开始' },
      { timestamp: '2026-02-22T10:00:10Z', level: 'info', message: '正在处理...' }
    ]
  },
  {
    id: 'task-2',
    agentId: 'main',
    name: '上传日志到 Notion',
    type: 'automation',
    status: 'completed',
    progress: 100,
    description: '将日志上传到 Notion',
    createdAt: '2026-02-22T09:00:00Z',
    startedAt: '2026-02-22T09:00:00Z',
    completedAt: '2026-02-22T09:00:30Z',
    result: { success: true, pageId: 'xxx' },
    logs: [
      { timestamp: '2026-02-22T09:00:00Z', level: 'info', message: '开始上传' },
      { timestamp: '2026-02-22T09:00:30Z', level: 'info', message: '上传完成' }
    ]
  },
  {
    id: 'task-3',
    agentId: 'main',
    name: '测试浏览器',
    type: 'test',
    status: 'failed',
    progress: 50,
    description: '测试浏览器功能',
    createdAt: '2026-02-22T08:00:00Z',
    startedAt: '2026-02-22T08:00:05Z',
    completedAt: '2026-02-22T08:05:00Z',
    error: 'Browser not configured',
    logs: [
      { timestamp: '2026-02-22T08:00:05Z', level: 'info', message: '开始测试' },
      { timestamp: '2026-02-22T08:05:00Z', level: 'error', message: 'Browser not configured' }
    ]
  }
]

// ============================================
// Zod 验证 Schema
// ============================================
const createTaskSchema = z.object({
  agentId: z.string().min(1),
  name: z.string().min(1).max(200),
  type: z.string().min(1).max(50),
  description: z.string().max(500).optional(),
  parameters: z.record(z.any()).optional(),
  estimatedDuration: z.number().positive().optional()
})

const updateTaskSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().max(500).optional(),
  parameters: z.record(z.any()).optional(),
  estimatedDuration: z.number().positive().optional()
})

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
// API: 任务管理接口（设计文档 5.2）
// ============================================

// GET /api/tasks - 获取任务列表（支持筛选）
router.get('/', (req, res) => {
  try {
    const { agentId, status, type } = req.query
    
    let filtered = [...tasks]
    
    if (agentId) {
      filtered = filtered.filter(t => t.agentId === agentId)
    }
    
    if (status) {
      filtered = filtered.filter(t => t.status === status)
    }
    
    if (type) {
      filtered = filtered.filter(t => t.type === type)
    }
    
    // 按创建时间倒序
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    
    res.json({
      total: filtered.length,
      tasks: filtered
    })
  } catch (error) {
    console.error('Error listing tasks:', error)
    res.status(500).json({ error: 'Failed to list tasks' })
  }
})

// GET /api/tasks/stats - 获取任务统计（设计文档 5.2）
router.get('/stats', (req, res) => {
  try {
    const stats = {
      total: tasks.length,
      pending: tasks.filter(t => t.status === 'pending').length,
      running: tasks.filter(t => t.status === 'running').length,
      completed: tasks.filter(t => t.status === 'completed').length,
      failed: tasks.filter(t => t.status === 'failed').length,
      cancelled: tasks.filter(t => t.status === 'cancelled').length,
      // 按类型统计
      byType: tasks.reduce((acc, t) => {
        acc[t.type] = (acc[t.type] || 0) + 1
        return acc
      }, {} as Record<string, number>),
      // 成功率
      successRate: tasks.length > 0 
        ? ((tasks.filter(t => t.status === 'completed').length / tasks.length) * 100).toFixed(1) + '%'
        : '0%'
    }
    res.json(stats)
  } catch (error) {
    console.error('Error getting task stats:', error)
    res.status(500).json({ error: 'Failed to get stats' })
  }
})

// GET /api/tasks/:id - 获取任务详情
router.get('/:id', (req, res) => {
  try {
    const task = tasks.find(t => t.id === req.params.id)
    if (!task) {
      return res.status(404).json({ error: 'Task not found' })
    }
    res.json(task)
  } catch (error) {
    console.error('Error getting task:', error)
    res.status(500).json({ error: 'Failed to get task' })
  }
})

// POST /api/tasks - 创建新任务
router.post('/', (req, res) => {
  try {
    const validation = createTaskSchema.safeParse(req.body)
    
    if (!validation.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validation.error.errors
      })
    }
    
    const newTask: Task = {
      id: `task-${Date.now()}`,
      ...req.body,
      status: 'pending',
      progress: 0,
      description: req.body.description || '',
      createdAt: new Date().toISOString(),
      logs: []
    }
    
    tasks.push(newTask)
    res.status(201).json(newTask)
  } catch (error) {
    console.error('Error creating task:', error)
    res.status(500).json({ error: 'Failed to create task' })
  }
})

// PUT /api/tasks/:id - 更新任务
router.put('/:id', (req, res) => {
  try {
    const index = tasks.findIndex(t => t.id === req.params.id)
    
    if (index === -1) {
      return res.status(404).json({ error: 'Task not found' })
    }
    
    const validation = updateTaskSchema.safeParse(req.body)
    
    if (!validation.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validation.error.errors
      })
    }
    
    tasks[index] = {
      ...tasks[index],
      ...req.body
    }
    
    res.json(tasks[index])
  } catch (error) {
    console.error('Error updating task:', error)
    res.status(500).json({ error: 'Failed to update task' })
  }
})

// POST /api/tasks/:id/start - 开始任务
router.post('/:id/start', (req, res) => {
  try {
    const task = tasks.find(t => t.id === req.params.id)
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' })
    }
    
    if (task.status !== 'pending') {
      return res.status(400).json({ error: 'Task cannot be started' })
    }
    
    task.status = 'running'
    task.startedAt = new Date().toISOString()
    task.progress = 0
    task.logs.push({
      timestamp: new Date().toISOString(),
      level: 'info',
      message: '任务开始执行'
    })
    
    res.json(task)
  } catch (error) {
    console.error('Error starting task:', error)
    res.status(500).json({ error: 'Failed to start task' })
  }
})

// POST /api/tasks/:id/cancel - 取消任务（设计文档 5.2）
router.post('/:id/cancel', (req, res) => {
  try {
    const task = tasks.find(t => t.id === req.params.id)
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' })
    }
    
    if (task.status === 'completed' || task.status === 'failed' || task.status === 'cancelled') {
      return res.status(400).json({ error: 'Task cannot be cancelled' })
    }
    
    task.status = 'cancelled'
    task.completedAt = new Date().toISOString()
    task.logs.push({
      timestamp: new Date().toISOString(),
      level: 'warn',
      message: '任务被取消'
    })
    
    res.json(task)
  } catch (error) {
    console.error('Error cancelling task:', error)
    res.status(500).json({ error: 'Failed to cancel task' })
  }
})

// POST /api/tasks/:id/progress - 更新任务进度
router.post('/:id/progress', (req, res) => {
  try {
    const task = tasks.find(t => t.id === req.params.id)
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' })
    }
    
    const { progress, message } = req.body
    
    if (typeof progress === 'number') {
      task.progress = Math.min(100, Math.max(0, progress))
    }
    
    if (message) {
      task.logs.push({
        timestamp: new Date().toISOString(),
        level: 'info',
        message
      })
    }
    
    res.json(task)
  } catch (error) {
    console.error('Error updating progress:', error)
    res.status(500).json({ error: 'Failed to update progress' })
  }
})

// POST /api/tasks/:id/complete - 完成任务
router.post('/:id/complete', (req, res) => {
  try {
    const task = tasks.find(t => t.id === req.params.id)
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' })
    }
    
    task.status = 'completed'
    task.progress = 100
    task.completedAt = new Date().toISOString()
    task.result = req.body.result
    task.logs.push({
      timestamp: new Date().toISOString(),
      level: 'info',
      message: '任务完成'
    })
    
    res.json(task)
  } catch (error) {
    console.error('Error completing task:', error)
    res.status(500).json({ error: 'Failed to complete task' })
  }
})

// POST /api/tasks/:id/fail - 标记任务失败
router.post('/:id/fail', (req, res) => {
  try {
    const task = tasks.find(t => t.id === req.params.id)
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' })
    }
    
    task.status = 'failed'
    task.completedAt = new Date().toISOString()
    task.error = req.body.error || 'Unknown error'
    task.logs.push({
      timestamp: new Date().toISOString(),
      level: 'error',
      message: task.error
    })
    
    res.json(task)
  } catch (error) {
    console.error('Error failing task:', error)
    res.status(500).json({ error: 'Failed to mark task as failed' })
  }
})

// DELETE /api/tasks/:id - 删除任务
router.delete('/:id', (req, res) => {
  try {
    const index = tasks.findIndex(t => t.id === req.params.id)
    
    if (index === -1) {
      return res.status(404).json({ error: 'Task not found' })
    }
    
    tasks.splice(index, 1)
    res.status(204).send()
  } catch (error) {
    console.error('Error deleting task:', error)
    res.status(500).json({ error: 'Failed to delete task' })
  }
})

export default router
