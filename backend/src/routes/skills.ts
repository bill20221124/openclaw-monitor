import express from 'express'
import { z } from 'zod'

const router = express.Router()

// ============================================
// 类型定义（设计文档 4.4 技能数据模型）
// ============================================
interface Skill {
  id: string
  name: string
  description: string
  category: string
  stats: {
    totalCalls: number
    successCalls: number
    failedCalls: number
    avgExecutionTime: number
  }
  recentCalls: SkillCall[]
}

interface SkillCall {
  id: string
  skillId: string
  agentId: string
  taskId?: string
  parameters: Record<string, any>
  result?: any
  error?: string
  executionTime: number
  timestamp: string
}

// ============================================
// Mock 数据
// ============================================
let skills: Skill[] = [
  { 
    id: 'skill-1', 
    name: 'browser', 
    description: 'Browser automation', 
    category: 'tool', 
    stats: { totalCalls: 45, successCalls: 44, failedCalls: 1, avgExecutionTime: 1200 },
    recentCalls: []
  },
  { 
    id: 'skill-2', 
    name: 'github', 
    description: 'GitHub operations', 
    category: 'tool', 
    stats: { totalCalls: 32, successCalls: 32, failedCalls: 0, avgExecutionTime: 800 },
    recentCalls: []
  },
  { 
    id: 'skill-3', 
    name: 'notion', 
    description: 'Notion integration', 
    category: 'integration', 
    stats: { totalCalls: 28, successCalls: 27, failedCalls: 1, avgExecutionTime: 600 },
    recentCalls: []
  },
  { 
    id: 'skill-4', 
    name: 'super-search', 
    description: 'Memory search', 
    category: 'memory', 
    stats: { totalCalls: 15, successCalls: 15, failedCalls: 0, avgExecutionTime: 300 },
    recentCalls: []
  },
  { 
    id: 'skill-5', 
    name: 'weather', 
    description: 'Weather data', 
    category: 'tool', 
    stats: { totalCalls: 12, successCalls: 12, failedCalls: 0, avgExecutionTime: 200 },
    recentCalls: []
  },
  { 
    id: 'skill-6', 
    name: 'mcp-microsoft365', 
    description: 'M365 integration', 
    category: 'integration', 
    stats: { totalCalls: 8, successCalls: 6, failedCalls: 2, avgExecutionTime: 1500 },
    recentCalls: []
  },
]

// ============================================
// Zod 验证 Schema
// ============================================
const createSkillSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  category: z.string().min(1).max(50)
})

const callSkillSchema = z.object({
  agentId: z.string().min(1),
  taskId: z.string().optional(),
  parameters: z.record(z.any()).optional()
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
// API: 技能接口（设计文档 5.4）
// ============================================

// GET /api/skills - 获取所有技能列表
router.get('/', (req, res) => {
  try {
    const { category, limit = 20 } = req.query
    
    let filtered = [...skills]
    
    if (category) {
      filtered = filtered.filter(s => s.category === category)
    }
    
    // 按调用次数排序
    filtered.sort((a, b) => b.stats.totalCalls - a.stats.totalCalls)
    
    res.json({
      total: filtered.length,
      skills: filtered.slice(0, Number(limit))
    })
  } catch (error) {
    console.error('Error listing skills:', error)
    res.status(500).json({ error: 'Failed to list skills' })
  }
})

// GET /api/skills/stats - 获取技能使用统计（设计文档 5.4）
router.get('/stats', (req, res) => {
  try {
    const totalCalls = skills.reduce((sum, s) => sum + s.stats.totalCalls, 0)
    const totalSuccess = skills.reduce((sum, s) => sum + s.stats.successCalls, 0)
    const totalFailed = skills.reduce((sum, s) => sum + s.stats.failedCalls, 0)
    
    const stats = {
      totalSkills: skills.length,
      totalCalls,
      totalSuccess,
      totalFailed,
      successRate: totalCalls > 0 ? ((totalSuccess / totalCalls) * 100).toFixed(1) + '%' : '0%',
      avgExecutionTime: Math.round(skills.reduce((sum, s) => sum + s.stats.avgExecutionTime, 0) / skills.length),
      // 按类别统计
      byCategory: skills.reduce((acc, s) => {
        if (!acc[s.category]) {
          acc[s.category] = { count: 0, calls: 0 }
        }
        acc[s.category].count++
        acc[s.category].calls += s.stats.totalCalls
        return acc
      }, {} as Record<string, { count: number; calls: number }>),
      // Top 技能
      topSkills: [...skills]
        .sort((a, b) => b.stats.totalCalls - a.stats.totalCalls)
        .slice(0, 5)
        .map(s => ({
          name: s.name,
          calls: s.stats.totalCalls,
          successRate: s.stats.totalCalls > 0 
            ? ((s.stats.successCalls / s.stats.totalCalls) * 100).toFixed(1) + '%'
            : '0%'
        })),
      // 最慢的技能
      slowestSkills: [...skills]
        .sort((a, b) => b.stats.avgExecutionTime - a.stats.avgExecutionTime)
        .slice(0, 3)
        .map(s => ({
          name: s.name,
          avgTime: s.stats.avgExecutionTime + 'ms'
        }))
    }
    res.json(stats)
  } catch (error) {
    console.error('Error getting skill stats:', error)
    res.status(500).json({ error: 'Failed to get stats' })
  }
})

// GET /api/skills/:id - 获取技能详情
router.get('/:id', (req, res) => {
  try {
    const skill = skills.find(s => s.id === req.params.id || s.name === req.params.id)
    if (!skill) {
      return res.status(404).json({ error: 'Skill not found' })
    }
    res.json(skill)
  } catch (error) {
    console.error('Error getting skill:', error)
    res.status(500).json({ error: 'Failed to get skill' })
  }
})

// GET /api/skills/:id/calls - 获取技能调用历史
router.get('/:id/calls', (req, res) => {
  try {
    const skill = skills.find(s => s.id === req.params.id || s.name === req.params.id)
    if (!skill) {
      return res.status(404).json({ error: 'Skill not found' })
    }
    
    const { limit = 20, agentId } = req.query
    
    // 返回最近的调用记录
    res.json({
      skillId: skill.id,
      totalCalls: skill.stats.totalCalls,
      calls: skill.recentCalls.slice(0, Number(limit))
    })
  } catch (error) {
    console.error('Error getting skill calls:', error)
    res.status(500).json({ error: 'Failed to get calls' })
  }
})

// POST /api/skills - 创建新技能（仅用于演示）
router.post('/', (req, res) => {
  try {
    const validation = createSkillSchema.safeParse(req.body)
    
    if (!validation.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validation.error.errors
      })
    }
    
    const newSkill: Skill = {
      id: `skill-${Date.now()}`,
      name: req.body.name,
      description: req.body.description || '',
      category: req.body.category,
      stats: {
        totalCalls: 0,
        successCalls: 0,
        failedCalls: 0,
        avgExecutionTime: 0
      },
      recentCalls: []
    }
    
    skills.push(newSkill)
    res.status(201).json(newSkill)
  } catch (error) {
    console.error('Error creating skill:', error)
    res.status(500).json({ error: 'Failed to create skill' })
  }
})

// POST /api/skills/:id/call - 调用技能（模拟）
router.post('/:id/call', (req, res) => {
  try {
    const skill = skills.find(s => s.id === req.params.id || s.name === req.params.id)
    if (!skill) {
      return res.status(404).json({ error: 'Skill not found' })
    }
    
    const validation = callSkillSchema.safeParse(req.body)
    
    if (!validation.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validation.error.errors
      })
    }
    
    // 模拟调用
    const startTime = Date.now()
    const success = Math.random() > 0.1 // 90% 成功率
    const executionTime = Math.round(skill.stats.avgExecutionTime * (0.8 + Math.random() * 0.4))
    
    // 更新统计
    skill.stats.totalCalls++
    if (success) {
      skill.stats.successCalls++
    } else {
      skill.stats.failedCalls++
    }
    skill.stats.avgExecutionTime = Math.round(
      (skill.stats.avgExecutionTime * (skill.stats.totalCalls - 1) + executionTime) / skill.stats.totalCalls
    )
    
    const call: SkillCall = {
      id: `call-${Date.now()}`,
      skillId: skill.id,
      agentId: req.body.agentId,
      taskId: req.body.taskId,
      parameters: req.body.parameters || {},
      result: success ? { success: true } : undefined,
      error: success ? undefined : 'Simulated error',
      executionTime,
      timestamp: new Date().toISOString()
    }
    
    skill.recentCalls.unshift(call)
    // 只保留最近100条
    if (skill.recentCalls.length > 100) {
      skill.recentCalls = skill.recentCalls.slice(0, 100)
    }
    
    res.json({
      success,
      executionTime,
      result: call.result,
      error: call.error
    })
  } catch (error) {
    console.error('Error calling skill:', error)
    res.status(500).json({ error: 'Failed to call skill' })
  }
})

// DELETE /api/skills/:id - 删除技能（仅用于演示）
router.delete('/:id', (req, res) => {
  try {
    const index = skills.findIndex(s => s.id === req.params.id || s.name === req.params.id)
    
    if (index === -1) {
      return res.status(404).json({ error: 'Skill not found' })
    }
    
    skills.splice(index, 1)
    res.status(204).send()
  } catch (error) {
    console.error('Error deleting skill:', error)
    res.status(500).json({ error: 'Failed to delete skill' })
  }
})

export default router
