import express from 'express'

const router = express.Router()

// GET /api/logs
router.get('/', (req, res) => {
  const { level, agentId, limit = 100 } = req.query
  
  // In production, this would read from actual log files or database
  const logs = [
    { id: '1', level: 'INFO', message: 'Gateway started', source: 'gateway', timestamp: new Date().toISOString() },
    { id: '2', level: 'INFO', message: 'Telegram connected', source: 'telegram', timestamp: new Date().toISOString() },
    { id: '3', level: 'DEBUG', message: 'Skill loaded: browser', source: 'skills', timestamp: new Date().toISOString() },
  ]
  
  let filtered = logs
  if (level) filtered = filtered.filter(l => l.level === level)
  if (agentId) filtered = filtered.filter(l => l.agentId === agentId)
  
  res.json(filtered.slice(0, Number(limit)))
})

// GET /api/logs/alerts
router.get('/alerts', (req, res) => {
  const alerts = [
    { id: '1', level: 'warning', message: 'High CPU usage', timestamp: new Date().toISOString() },
  ]
  res.json(alerts)
})

export default router
