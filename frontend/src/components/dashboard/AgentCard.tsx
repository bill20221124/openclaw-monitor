import { Link } from 'react-router-dom'
import { clsx } from 'clsx'
import { Bot, Play, Pause, Cpu, HardDrive, MemoryStick } from 'lucide-react'

interface Agent {
  id: string
  name: string
  status: 'online' | 'offline' | 'busy' | 'idle' | 'error'
  model: string
  uptime: number
  currentTask?: string
  progress?: number
  stats: {
    tasks: number
    messages: number
    skills: number
  }
  resources: {
    cpu: number
    memory: number
    disk: number
  }
  recentSkills: string[]
}

const statusColors = {
  online: 'bg-success',
  offline: 'bg-text-muted',
  busy: 'bg-primary',
  idle: 'bg-warning',
  error: 'bg-error',
}

const statusLabels = {
  online: '🟢 在线',
  offline: '⚫ 离线',
  busy: '🔵 执行中',
  idle: '🟡 空闲',
  error: '🔴 错误',
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  
  if (days > 0) return `${days}天 ${hours}小时`
  if (hours > 0) return `${hours}小时 ${minutes}分钟`
  return `${minutes}分钟`
}

export function AgentCard({ agent }: { agent: Agent }) {
  return (
    <div className="bg-bg-secondary rounded-xl border border-border-color overflow-hidden hover:border-primary/50 transition-colors">
      {/* Header */}
      <div className="p-4 flex items-start gap-4 border-b border-border-color">
        <div className="w-12 h-12 rounded-lg bg-bg-tertiary flex items-center justify-center">
          <Bot className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-text-primary truncate">{agent.name}</h4>
            <span className={clsx('w-2.5 h-2.5 rounded-full', statusColors[agent.status])} />
          </div>
          <p className="text-sm text-text-muted">模型: {agent.model}</p>
          <p className="text-sm text-text-muted">运行时间: {formatUptime(agent.uptime)}</p>
        </div>
        <span className="text-xs text-text-muted">
          {statusLabels[agent.status]}
        </span>
      </div>

      {/* Current Task */}
      {agent.currentTask && (
        <div className="p-4 border-b border-border-color">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-text-secondary">当前任务</span>
            <span className="text-xs text-text-muted">{agent.progress}%</span>
          </div>
          <div className="w-full h-2 bg-bg-tertiary rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${agent.progress}%` }}
            />
          </div>
          <p className="text-sm text-text-primary mt-2 truncate">{agent.currentTask}</p>
        </div>
      )}

      {/* Stats */}
      <div className="p-4 border-b border-border-color">
        <p className="text-sm text-text-muted mb-2">📊 今日统计</p>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-bg-tertiary rounded-lg p-2">
            <p className="text-lg font-bold text-text-primary">{agent.stats.tasks}</p>
            <p className="text-xs text-text-muted">任务</p>
          </div>
          <div className="bg-bg-tertiary rounded-lg p-2">
            <p className="text-lg font-bold text-text-primary">{agent.stats.messages}</p>
            <p className="text-xs text-text-muted">消息</p>
          </div>
          <div className="bg-bg-tertiary rounded-lg p-2">
            <p className="text-lg font-bold text-text-primary">{agent.stats.skills}</p>
            <p className="text-xs text-text-muted">技能</p>
          </div>
        </div>
      </div>

      {/* Resources */}
      <div className="p-4 border-b border-border-color">
        <p className="text-sm text-text-muted mb-2">💻 资源使用</p>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-text-muted" />
            <div className="flex-1 h-2 bg-bg-tertiary rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full"
                style={{ width: `${agent.resources.cpu}%` }}
              />
            </div>
            <span className="text-xs text-text-muted w-12">{agent.resources.cpu}%</span>
          </div>
          <div className="flex items-center gap-2">
            <MemoryStick className="w-4 h-4 text-text-muted" />
            <span className="text-xs text-text-muted w-12">{agent.resources.memory}MB</span>
          </div>
          <div className="flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-text-muted" />
            <span className="text-xs text-text-muted w-12">{agent.resources.disk}GB</span>
          </div>
        </div>
      </div>

      {/* Recent Skills */}
      <div className="p-4">
        <p className="text-sm text-text-muted mb-2">🔧 最近技能</p>
        <div className="flex flex-wrap gap-1">
          {agent.recentSkills.map((skill) => (
            <span 
              key={skill}
              className="px-2 py-1 text-xs bg-bg-tertiary text-text-secondary rounded"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-border-color flex gap-2">
        <Link 
          to={`/agent/${agent.id}`}
          className="flex-1 py-2 text-center text-sm bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors"
        >
          查看详情
        </Link>
        <button className="px-4 py-2 text-sm bg-bg-tertiary text-text-secondary rounded-lg hover:bg-bg-hover transition-colors">
          <Pause className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
