export interface Agent {
  id: string
  name: string
  status: 'online' | 'offline' | 'busy' | 'idle' | 'error'
  model: string
  modelProvider?: string
  channels: string[]
  createdAt: string
  lastHeartbeat: string
  uptime: number
  resources: {
    cpu: number
    memory: number
    disk: number
  }
  todayStats: {
    tasksCompleted: number
    tasksFailed: number
    messagesReceived: number
    messagesSent: number
    skillsCalled: number
  }
  currentTask?: Task
  config?: {
    soulMd?: string
    heartbeatInterval?: number
    autoApprove?: boolean
  }
}

export interface Task {
  id: string
  agentId: string
  name: string
  type: string
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled'
  progress: number
  description?: string
  createdAt: string
  startedAt?: string
  completedAt?: string
  estimatedDuration?: number
  result?: any
  error?: string
}

export interface Message {
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
}

export interface Skill {
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
}

export interface LogEntry {
  id: string
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG'
  message: string
  source: string
  timestamp: string
  agentId?: string
}

export interface WebSocketEvent {
  type: string
  data: any
  timestamp: string
}
