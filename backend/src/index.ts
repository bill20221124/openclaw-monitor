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

// CORS 配置 - 生产环境应使用环境变量
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}

// Middleware
app.use(helmet())
app.use(cors(corsOptions))
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
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0'
  })
})

// Setup WebSocket
setupWebSocket(io)

// Error handling
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err.message)
  res.status(500).json({ error: 'Internal server error' })
})

// 端口验证
const PORT = parseInt(process.env.PORT || '8080', 10)

if (isNaN(PORT) || PORT < 1 || PORT > 65535) {
  console.error('Invalid PORT:', process.env.PORT)
  process.exit(1)
}

httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📡 WebSocket server ready`)
  console.log(`🌍 CORS origin: ${corsOptions.origin}`)
})

export { io }
