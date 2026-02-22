import express from 'express'

const router = express.Router()

// Mock data - will be replaced with Appwrite/DB
let agents = [
  {
    id: 'main',
    name: 'Main Agent',
    status: 'online',
    model: 'MiniMax-M2.5',
    channels: ['telegram'],
    createdAt: new Date().toISOString(),
    lastHeartbeat: new Date().toISOString(),
    uptime: 280000,
    resources: { cpu: 12, memory: 456, disk: 2.1 },
    todayStats: { tasksCompleted: 24, tasksFailed: 1, messagesReceived: 156, messagesSent: 142, skillsCalled: 42 },
    currentTask: null
  }
]

// GET /api/agents
router.get('/', (req, res) => {
  res.json(agents)
})

// GET /api/agents/:id
router.get('/:id', (req, res) => {
  const agent = agents.find(a => a.id === req.params.id)
  if (!agent) {
    return res.status(404).json({ error: 'Agent not found' })
  }
  res.json(agent)
})

// POST /api/agents
router.post('/', (req, res) => {
  const newAgent = {
    id: `agent-${Date.now()}`,
    ...req.body,
    createdAt: new Date().toISOString(),
    lastHeartbeat: new Date().toISOString()
  }
  agents.push(newAgent)
  res.status(201).json(newAgent)
})

// PUT /api/agents/:id
router.put('/:id', (req, res) => {
  const index = agents.findIndex(a => a.id === req.params.id)
  if (index === -1) {
    return res.status(404).json({ error: 'Agent not found' })
  }
  agents[index] = { ...agents[index], ...req.body }
  res.json(agents[index])
})

// DELETE /api/agents/:id
router.delete('/:id', (req, res) => {
  const index = agents.findIndex(a => a.id === req.params.id)
  if (index === -1) {
    return res.status(404).json({ error: 'Agent not found' })
  }
  agents.splice(index, 1)
  res.status(204).send()
})

export default router
