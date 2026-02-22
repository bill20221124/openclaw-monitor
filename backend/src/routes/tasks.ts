import express from 'express'

const router = express.Router()

// Mock data
let tasks = [
  {
    id: 'task-1',
    agentId: 'main',
    name: '处理用户请求',
    type: 'conversation',
    status: 'running',
    progress: 75,
    createdAt: new Date().toISOString(),
    startedAt: new Date().toISOString()
  }
]

// GET /api/tasks
router.get('/', (req, res) => {
  const { agentId, status } = req.query
  let filtered = tasks
  if (agentId) filtered = filtered.filter(t => t.agentId === agentId)
  if (status) filtered = filtered.filter(t => t.status === status)
  res.json(filtered)
})

// GET /api/tasks/:id
router.get('/:id', (req, res) => {
  const task = tasks.find(t => t.id === req.params.id)
  if (!task) {
    return res.status(404).json({ error: 'Task not found' })
  }
  res.json(task)
})

// POST /api/tasks
router.post('/', (req, res) => {
  const newTask = {
    id: `task-${Date.now()}`,
    ...req.body,
    status: 'pending',
    progress: 0,
    createdAt: new Date().toISOString()
  }
  tasks.push(newTask)
  res.status(201).json(newTask)
})

// POST /api/tasks/:id/cancel
router.post('/:id/cancel', (req, res) => {
  const task = tasks.find(t => t.id === req.params.id)
  if (!task) {
    return res.status(404).json({ error: 'Task not found' })
  }
  task.status = 'cancelled'
  res.json(task)
})

export default router
