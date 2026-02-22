import express from 'express'
import { z } from 'zod'

const router = express.Router()

// ============================================
// 类型定义
// ============================================
interface LogEntry {
  id: string
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG'
  message: string
  source: string
  timestamp: string
  agentId?: string
  metadata?: Record<string, any>
}

interface Alert {
  id: string
  level: 'warning' | 'critical' | 'info'
  message: string
  source: string
  timestamp: string
  acknowledged: boolean
  acknowledgedBy?: string
  acknowledgedAt?: string
}

// ============================================
// Mock 数据
// ============================================
let logs: LogEntry[] = [
  { id: '1', level: 'INFO', message: 'Gateway started successfully', source: 'gateway', timestamp: '2026-02-22T09:00:00Z' },
  { id: '2', level: 'INFO', message: 'Telegram connected', source: 'telegram', timestamp: '2026-02-22T09:00:01Z' },
  { id: '3', level: 'DEBUG', message: 'Skill loaded: browser', source: 'skills', timestamp: '2026-02-22T09:00:02Z' },
  { id: '4', level: 'DEBUG', message: 'Skill loaded: github', source: 'skills', timestamp: '2026-02-22T09:00:03Z' },
  { id: '5', level: 'WARN', message: 'Browser service requires pairing', source: 'browser', timestamp: '2026-02-22T09:15:00Z' },
  { id: '6', level: 'ERROR', message: 'M365 API access blocked by Conditional Access', source: 'm365', timestamp: '2026-02-22T09:30:00Z' },
  { id: '7', level: 'INFO', message: 'Memory automation configured', source: 'cron', timestamp: '2026-02-22T10:00:00Z' },
  { id: '8', level: 'INFO', message: 'Log uploaded to Notion', source: 'automation', timestamp: '2026-02-22T23:00:00Z' },
]

let alerts: Alert[] = [
  { id: 'alert-1', level: 'warning', message: 'High CPU usage detected', source: 'monitoring', timestamp: '2026-02-22T10:00:00Z', acknowledged: false },
  { id: 'alert-2', level: 'critical', message: 'M365 API access blocked', source: 'm365', timestamp: '2026-02-22T09:30:00Z', acknowledged: false },
]

// ============================================
// Zod 验证 Schema
// ============================================
const createLogSchema = z.object({
  level: z.enum(['INFO', 'WARN', 'ERROR', 'DEBUG']),
  message: z.string().min(1).max(2000),
  source: z.string().min(1).max(100),
  agentId: z.string().optional(),
  metadata: z.record(z.any()).optional()
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
// API: 系统接口（设计文档 5.5）
// ============================================

// GET /api/logs - 获取日志列表
router.get('/', (req, res) => {
  try {
    const { level, agentId, source, limit = 100, offset = 0 } = req.query
    
    let filtered = [...logs]
    
    if (level) {
      filtered = filtered.filter(l => l.level === level)
    }
    
    if (agentId) {
      filtered = filtered.filter(l => l.agentId === agentId)
    }
    
    if (source) {
      filtered = filtered.filter(l => l.source === source)
    }
    
    // 按时间倒序
    filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    
    const total = filtered.length
    const paginated = filtered.slice(Number(offset), Number(offset) + Number(limit))
    
    res.json({
      total,
      limit: Number(limit),
      offset: Number(offset),
      logs: paginated
    })
  } catch (error) {
    console.error('Error listing logs:', error)
    res.status(500).json({ error: 'Failed to list logs' })
  }
})

// GET /api/logs/stats - 获取日志统计
router.get('/stats', (req, res) => {
  try {
    const stats = {
      total: logs.length,
      byLevel: logs.reduce((acc, l) => {
        acc[l.level] = (acc[l.level] || 0) + 1
        return acc
      }, {} as Record<string, number>),
      bySource: logs.reduce((acc, l) => {
        acc[l.source] = (acc[l.source] || 0) + 1
        return acc
      }, {} as Record<string, number>),
      recentErrors: logs.filter(l => l.level === 'ERROR').slice(0, 5),
      recentWarnings: logs.filter(l => l.level === 'WARN').slice(0, 5)
    }
    res.json(stats)
  } catch (error) {
    console.error('Error getting log stats:', error)
    res.status(500).json({ error: 'Failed to get stats' })
  }
})

// GET /api/logs/:id - 获取单条日志
router.get('/:id', (req, res) => {
  try {
    const log = logs.find(l => l.id === req.params.id)
    if (!log) {
      return res.status(404).json({ error: 'Log not found' })
    }
    res.json(log)
  } catch (error) {
    console.error('Error getting log:', error)
    res.status(500).json({ error: 'Failed to get log' })
  }
})

// POST /api/logs - 创建日志条目
router.post('/', (req, res) => {
  try {
    const validation = createLogSchema.safeParse(req.body)
    
    if (!validation.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validation.error.errors
      })
    }
    
    const newLog: LogEntry = {
      id: `log-${Date.now()}`,
      ...req.body,
      timestamp: new Date().toISOString()
    }
    
    logs.unshift(newLog)
    
    // 最多保留10000条
    if (logs.length > 10000) {
      logs = logs.slice(0, 10000)
    }
    
    res.status(201).json(newLog)
  } catch (error) {
    console.error('Error creating log:', error)
    res.status(500).json({ error: 'Failed to create log' })
  }
})

// DELETE /api/logs - 清理日志
router.delete('/', (req, res) => {
  try {
    const { before, level, keepRecent = 1000 } = req.query
    
    let deleted = 0
    
    if (before) {
      const beforeDate = new Date(before as string)
      const beforeCount = logs.length
      logs = logs.filter(l => new Date(l.timestamp) > beforeDate)
      deleted = beforeCount - logs.length
    }
    
    if (level) {
      const beforeCount = logs.length
      logs = logs.filter(l => l.level !== level)
      deleted += beforeCount - logs.length
    }
    
    // 始终保留最近的日志
    if (logs.length > Number(keepRecent)) {
      logs = logs.slice(0, Number(keepRecent))
    }
    
    res.json({ message: 'Logs cleaned', deleted })
  } catch (error) {
    console.error('Error cleaning logs:', error)
    res.status(500).json({ error: 'Failed to clean logs' })
  }
})

// ============================================
// 告警接口（设计文档 5.5）
// ============================================

// GET /api/logs/alerts - 获取告警列表
router.get('/alerts', (req, res) => {
  try {
    const { level, acknowledged, limit = 20 } = req.query
    
    let filtered = [...alerts]
    
    if (level) {
      filtered = filtered.filter(a => a.level === level)
    }
    
    if (acknowledged !== undefined) {
      filtered = filtered.filter(a => a.acknowledged === (acknowledged === 'true'))
    }
    
    // 按时间倒序
    filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    
    res.json({
      total: filtered.length,
      alerts: filtered.slice(0, Number(limit))
    })
  } catch (error) {
    console.error('Error listing alerts:', error)
    res.status(500).json({ error: 'Failed to list alerts' })
  }
})

// POST /api/logs/alerts - 创建告警
router.post('/alerts', (req, res) => {
  try {
    const newAlert: Alert = {
      id: `alert-${Date.now()}`,
      level: req.body.level || 'info',
      message: req.body.message,
      source: req.body.source,
      timestamp: new Date().toISOString(),
      acknowledged: false
    }
    
    alerts.unshift(newAlert)
    res.status(201).json(newAlert)
  } catch (error) {
    console.error('Error creating alert:', error)
    res.status(500).json({ error: 'Failed to create alert' })
  }
})

// POST /api/logs/alerts/:id/acknowledge - 确认告警
router.post('/alerts/:id/acknowledge', (req, res) => {
  try {
    const alert = alerts.find(a => a.id === req.params.id)
    
    if (!alert) {
      return res.status(404).json({ error: 'Alert not found' })
    }
    
    alert.acknowledged = true
    alert.acknowledgedBy = req.body.acknowledgedBy || 'system'
    alert.acknowledgedAt = new Date().toISOString()
    
    res.json(alert)
  } catch (error) {
    console.error('Error acknowledging alert:', error)
    res.status(500).json({ error: 'Failed to acknowledge alert' })
  }
})

// DELETE /api/logs/alerts/:id - 删除告警
router.delete('/alerts/:id', (req, res) => {
  try {
    const index = alerts.findIndex(a => a.id === req.params.id)
    
    if (index === -1) {
      return res.status(404).json({ error: 'Alert not found' })
    }
    
    alerts.splice(index, 1)
    res.status(204).send()
  } catch (error) {
    console.error('Error deleting alert:', error)
    res.status(500).json({ error: 'Failed to delete alert' })
  }
})

export default router
