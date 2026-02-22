import express from 'express'
import { z } from 'zod'

const router = express.Router()

// ============================================
// 类型定义（设计文档 4.3 消息数据模型）
// ============================================
interface Message {
  id: string
  agentId: string
  channel: string
  direction: 'incoming' | 'outgoing' | 'system'
  content: string
  contentType: 'text' | 'image' | 'file' | 'command'
  sender?: string
  timestamp: string
  processingStatus: 'pending' | 'processing' | 'completed' | 'failed'
  processingTime?: number
  relatedTaskId?: string
  metadata?: Record<string, any>
}

// ============================================
// Mock 数据
// ============================================
let messages: Message[] = [
  { id: 'msg-1', agentId: 'main', channel: 'telegram', direction: 'incoming', content: '你好', contentType: 'text', sender: '8537212690', timestamp: '2026-02-22T10:00:00Z', processingStatus: 'completed', processingTime: 120 },
  { id: 'msg-2', agentId: 'main', channel: 'telegram', direction: 'outgoing', content: '你好！有什么可以帮你的？', contentType: 'text', sender: 'OpenClaw', timestamp: '2026-02-22T10:00:01Z', processingStatus: 'completed', processingTime: 50 },
  { id: 'msg-3', agentId: 'main', channel: 'telegram', direction: 'incoming', content: '帮我测试一下浏览器', contentType: 'text', sender: '8537212690', timestamp: '2026-02-22T10:01:00Z', processingStatus: 'completed', processingTime: 80 },
  { id: 'msg-4', agentId: 'main', channel: 'system', direction: 'system', content: 'Agent started', contentType: 'text', timestamp: '2026-02-22T09:00:00Z', processingStatus: 'completed' },
  { id: 'msg-5', agentId: 'main', channel: 'telegram', direction: 'incoming', content: '今天天气怎么样', contentType: 'text', sender: '8537212690', timestamp: '2026-02-22T10:05:00Z', processingStatus: 'completed', processingTime: 200 },
  { id: 'msg-6', agentId: 'main', channel: 'telegram', direction: 'outgoing', content: '今天天气晴，气温20-28度', contentType: 'text', sender: 'OpenClaw', timestamp: '2026-02-22T10:05:01Z', processingStatus: 'completed', processingTime: 100 },
]

// ============================================
// Zod 验证 Schema
// ============================================
const createMessageSchema = z.object({
  agentId: z.string().min(1),
  channel: z.string().min(1),
  direction: z.enum(['incoming', 'outgoing', 'system']),
  content: z.string().min(1).max(5000),
  contentType: z.enum(['text', 'image', 'file', 'command']).optional(),
  sender: z.string().optional(),
  relatedTaskId: z.string().optional()
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
// API: 消息接口（设计文档 5.3）
// ============================================

// GET /api/messages - 获取消息列表
router.get('/', (req, res) => {
  try {
    const { agentId, channel, direction, limit = 50, offset = 0 } = req.query
    
    let filtered = [...messages]
    
    if (agentId) {
      filtered = filtered.filter(m => m.agentId === agentId)
    }
    
    if (channel) {
      filtered = filtered.filter(m => m.channel === channel)
    }
    
    if (direction) {
      filtered = filtered.filter(m => m.direction === direction)
    }
    
    // 按时间倒序
    filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    
    // 分页
    const total = filtered.length
    const paginated = filtered.slice(Number(offset), Number(offset) + Number(limit))
    
    res.json({
      total,
      limit: Number(limit),
      offset: Number(offset),
      messages: paginated
    })
  } catch (error) {
    console.error('Error listing messages:', error)
    res.status(500).json({ error: 'Failed to list messages' })
  }
})

// GET /api/messages/stats - 获取消息统计（设计文档 5.3）
router.get('/stats', (req, res) => {
  try {
    const now = new Date()
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    
    const stats = {
      total: messages.length,
      // 按渠道统计
      byChannel: messages.reduce((acc, m) => {
        acc[m.channel] = (acc[m.channel] || 0) + 1
        return acc
      }, {} as Record<string, number>),
      // 按方向统计
      byDirection: messages.reduce((acc, m) => {
        acc[m.direction] = (acc[m.direction] || 0) + 1
        return acc
      }, {} as Record<string, number>),
      // 按内容类型统计
      byContentType: messages.reduce((acc, m) => {
        acc[m.contentType] = (acc[m.contentType] || 0) + 1
        return acc
      }, {} as Record<string, number>),
      // 处理状态统计
      byProcessingStatus: messages.reduce((acc, m) => {
        acc[m.processingStatus] = (acc[m.processingStatus] || 0) + 1
        return acc
      }, {} as Record<string, number>),
      // 今日消息数
      todayCount: messages.filter(m => new Date(m.timestamp) > oneDayAgo).length,
      // 这小时消息数
      thisHourCount: messages.filter(m => new Date(m.timestamp) > oneHourAgo).length,
      // 平均处理时间
      avgProcessingTime: messages.length > 0
        ? Math.round(messages.reduce((sum, m) => sum + (m.processingTime || 0), 0) / messages.filter(m => m.processingTime).length) || 0
        : 0,
      // 响应时间（incoming -> outgoing）
      avgResponseTime: calculateAvgResponseTime()
    }
    res.json(stats)
  } catch (error) {
    console.error('Error getting message stats:', error)
    res.status(500).json({ error: 'Failed to get stats' })
  }
})

function calculateAvgResponseTime(): number {
  const incomingMessages = messages.filter(m => m.direction === 'incoming')
  let totalResponseTime = 0
  let responseCount = 0
  
  for (const incoming of incomingMessages) {
    const response = messages.find(m => 
      m.direction === 'outgoing' && 
      m.agentId === incoming.agentId &&
      new Date(m.timestamp) > new Date(incoming.timestamp) &&
      new Date(m.timestamp).getTime() - new Date(incoming.timestamp).getTime() < 60000 // 1分钟内
    )
    
    if (response) {
      totalResponseTime += new Date(response.timestamp).getTime() - new Date(incoming.timestamp).getTime()
      responseCount++
    }
  }
  
  return responseCount > 0 ? Math.round(totalResponseTime / responseCount) : 0
}

// GET /api/messages/:id - 获取单条消息
router.get('/:id', (req, res) => {
  try {
    const message = messages.find(m => m.id === req.params.id)
    if (!message) {
      return res.status(404).json({ error: 'Message not found' })
    }
    res.json(message)
  } catch (error) {
    console.error('Error getting message:', error)
    res.status(500).json({ error: 'Failed to get message' })
  }
})

// POST /api/messages - 发送消息
router.post('/', (req, res) => {
  try {
    const validation = createMessageSchema.safeParse(req.body)
    
    if (!validation.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validation.error.errors
      })
    }
    
    const startTime = Date.now()
    
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      ...req.body,
      contentType: req.body.contentType || 'text',
      timestamp: new Date().toISOString(),
      processingStatus: 'pending',
      processingTime: undefined
    }
    
    messages.push(newMessage)
    
    // 模拟处理
    setTimeout(() => {
      const msg = messages.find(m => m.id === newMessage.id)
      if (msg) {
        msg.processingStatus = 'completed'
        msg.processingTime = Date.now() - startTime
      }
    }, 100)
    
    res.status(201).json(newMessage)
  } catch (error) {
    console.error('Error creating message:', error)
    res.status(500).json({ error: 'Failed to create message' })
  }
})

// POST /api/agents/:agentId/messages - 向 Agent 发送消息（设计文档 5.3）
router.post('/agent/:agentId', (req, res) => {
  try {
    const { agentId } = req.params
    
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      agentId,
      channel: req.body.channel || 'telegram',
      direction: 'incoming',
      content: req.body.content,
      contentType: req.body.contentType || 'text',
      sender: req.body.sender,
      timestamp: new Date().toISOString(),
      processingStatus: 'pending'
    }
    
    messages.push(newMessage)
    res.status(201).json(newMessage)
  } catch (error) {
    console.error('Error sending message to agent:', error)
    res.status(500).json({ error: 'Failed to send message' })
  }
})

// DELETE /api/messages/:id - 删除消息
router.delete('/:id', (req, res) => {
  try {
    const index = messages.findIndex(m => m.id === req.params.id)
    
    if (index === -1) {
      return res.status(404).json({ error: 'Message not found' })
    }
    
    messages.splice(index, 1)
    res.status(204).send()
  } catch (error) {
    console.error('Error deleting message:', error)
    res.status(500).json({ error: 'Failed to delete message' })
  }
})

// GET /api/messages/search - 搜索消息（新增）
router.get('/search', (req, res) => {
  try {
    const { q, channel, limit = 20 } = req.query
    
    if (!q) {
      return res.status(400).json({ error: 'Search query is required' })
    }
    
    const query = (q as string).toLowerCase()
    
    let results = messages.filter(m => 
      m.content.toLowerCase().includes(query)
    )
    
    if (channel) {
      results = results.filter(m => m.channel === channel)
    }
    
    results = results.slice(0, Number(limit))
    
    res.json({
      query: q,
      total: results.length,
      messages: results
    })
  } catch (error) {
    console.error('Error searching messages:', error)
    res.status(500).json({ error: 'Failed to search messages' })
  }
})

export default router
