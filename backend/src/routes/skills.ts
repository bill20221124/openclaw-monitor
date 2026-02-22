import express from 'express'

const router = express.Router()

// Mock data
let skills = [
  { id: 'skill-1', name: 'browser', category: 'tool', totalCalls: 45, successCalls: 44, failedCalls: 1, avgExecutionTime: 1200 },
  { id: 'skill-2', name: 'github', category: 'tool', totalCalls: 32, successCalls: 32, failedCalls: 0, avgExecutionTime: 800 },
  { id: 'skill-3', name: 'notion', category: 'integration', totalCalls: 28, successCalls: 27, failedCalls: 1, avgExecutionTime: 600 },
  { id: 'skill-4', name: 'super-search', category: 'memory', totalCalls: 15, successCalls: 15, failedCalls: 0, avgExecutionTime: 300 },
]

// GET /api/skills
router.get('/', (req, res) => {
  res.json(skills)
})

// GET /api/skills/:id
router.get('/:id', (req, res) => {
  const skill = skills.find(s => s.id === req.params.id)
  if (!skill) {
    return res.status(404).json({ error: 'Skill not found' })
  }
  res.json(skill)
})

// GET /api/skills/stats
router.get('/stats', (req, res) => {
  const stats = {
    totalSkills: skills.length,
    totalCalls: skills.reduce((sum, s) => sum + s.totalCalls, 0),
    successRate: ((skills.reduce((sum, s) => sum + s.successCalls, 0) / 
                  skills.reduce((sum, s) => sum + s.totalCalls, 0)) * 100).toFixed(1) + '%',
    topSkills: skills.sort((a, b) => b.totalCalls - a.totalCalls).slice(0, 5)
  }
  res.json(stats)
})

export default router
