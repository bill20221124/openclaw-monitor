import express from 'express'

const router = express.Router()

// Mock data
let messages = [
  {
    id: 'msg-1',
    agentId: 'main',
    channel: 'telegram',
    direction: 'incoming',
    content: '你好',
    contentType: 'text',
    timestamp: new Date().toISOString(),
    processingStatus: 'completed'
  }
]

// GET /api/messages
router.get('/', (req, res) => {
  const { agentId, channel } = req.query
  let filtered = messages
  if (agentId) filtered = filtered.filter(m => m.agentId === agentId)
  if (channel) filtered = filtered.filter(m => m.channel === channel)
  res.json(filtered)
})

// GET /api/messages/stats
router.get('/stats', (req, res) => {
  const stats = {
    total: messages.length,
    byChannel: messages.reduce((acc, m) => {
      acc[m.channel] = (acc[m.channel] || 0) + 1
      return acc
    }, {}),
    byDirection: messages.reduce((acc, m) => {
      acc[m.direction] = (acc[m.direction] || 0) + 1
      return acc
    }, {})
  }
  res.json(stats)
})

export default router
