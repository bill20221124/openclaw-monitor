import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { createServer } from 'http'
import { Server } from 'socket.io'
import dotenv from 'dotenv'

import agentRoutes from './routes/agents.js'
import taskRoutes from './routes/tasks.js'
import messageRoutes from './routes/messages.js'
import skillRoutes from './routes/skills.js'
import logRoutes from './routes/logs.js'
import { setupWebSocket } from './services/websocket.js'

dotenv.config()

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
})

// Middleware
app.use(helmet())
app.use(cors())
app.use(morgan('combined'))
app.use(express.json())

// Routes
app.use('/api/agents', agentRoutes)
app.use('/api/tasks', taskRoutes)
app.use('/api/messages', messageRoutes)
app.use('/api/skills', skillRoutes)
app.use('/api/logs', logRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Setup WebSocket
setupWebSocket(io)

// Error handling
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Something went wrong!' })
})

const PORT = process.env.PORT || 8080

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📡 WebSocket server ready`)
})

export { io }
