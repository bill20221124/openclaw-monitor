import { useState } from 'react'
import { 
  ListTodo, 
  Play, 
  Pause, 
  CheckCircle, 
  XCircle, 
  Clock,
  AlertCircle 
} from 'lucide-react'
import { clsx } from 'clsx'

interface Task {
  id: string
  agentId: string
  name: string
  type: string
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled'
  progress: number
  createdAt: string
  startedAt?: string
  completedAt?: string
  error?: string
}

// Mock data
const tasks: Task[] = [
  { id: '1', agentId: 'main', name: '处理用户请求', type: 'conversation', status: 'running', progress: 75, createdAt: '2026-02-22T10:00:00Z', startedAt: '2026-02-22T10:00:05Z' },
  { id: '2', agentId: 'main', name: '上传日志到 Notion', type: 'automation', status: 'completed', progress: 100, createdAt: '2026-02-22T09:00:00Z', startedAt: '2026-02-22T09:00:00Z', completedAt: '2026-02-22T09:00:30Z' },
  { id: '3', agentId: 'main', name: '测试浏览器', type: 'test', status: 'failed', progress: 50, createdAt: '2026-02-22T08:00:00Z', startedAt: '2026-02-22T08:00:05Z', completedAt: '2026-02-22T08:05:00Z', error: 'Browser not configured' },
]

const statusConfig = {
  pending: { icon: Clock, color: 'text-text-muted', label: '等待中' },
  running: { icon: Play, color: 'text-primary', label: '运行中' },
  completed: { icon: CheckCircle, color: 'text-success', label: '已完成' },
  failed: { icon: XCircle, color: 'text-error', label: '失败' },
  cancelled: { icon: AlertCircle, color: 'text-warning', label: '已取消' },
}

const typeLabels: Record<string, string> = {
  conversation: '💬 对话',
  automation: '⚙️ 自动化',
  test: '🧪 测试',
  github: '🐙 GitHub',
  browser: '🌐 浏览器',
}

export function Tasks() {
  const [filter, setFilter] = useState<string>('all')

  const filteredTasks = filter === 'all' 
    ? tasks 
    : tasks.filter(t => t.status === filter)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text-primary">📋 任务监控</h1>
        
        {/* Filter */}
        <div className="flex gap-2">
          {['all', 'running', 'completed', 'failed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={clsx(
                'px-3 py-1.5 rounded-lg text-sm transition-colors',
                filter === status 
                  ? 'bg-primary/20 text-primary' 
                  : 'bg-bg-tertiary text-text-secondary hover:bg-bg-hover'
              )}
            >
              {status === 'all' ? '全部' : statusConfig[status as keyof typeof statusConfig]?.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-bg-secondary rounded-xl p-4 border border-border-color">
          <p className="text-text-muted text-sm">总任务</p>
          <p className="text-2xl font-bold text-text-primary">{tasks.length}</p>
        </div>
        <div className="bg-bg-secondary rounded-xl p-4 border border-border-color">
          <p className="text-text-muted text-sm">运行中</p>
          <p className="text-2xl font-bold text-primary">{tasks.filter(t => t.status === 'running').length}</p>
        </div>
        <div className="bg-bg-secondary rounded-xl p-4 border border-border-color">
          <p className="text-text-muted text-sm">已完成</p>
          <p className="text-2xl font-bold text-success">{tasks.filter(t => t.status === 'completed').length}</p>
        </div>
        <div className="bg-bg-secondary rounded-xl p-4 border border-border-color">
          <p className="text-text-muted text-sm">失败</p>
          <p className="text-2xl font-bold text-error">{tasks.filter(t => t.status === 'failed').length}</p>
        </div>
      </div>

      {/* Task List */}
      <div className="bg-bg-secondary rounded-xl border border-border-color overflow-hidden">
        <table className="w-full">
          <thead className="bg-bg-tertiary">
            <tr>
              <th className="text-left p-4 text-text-secondary font-medium">任务</th>
              <th className="text-left p-4 text-text-secondary font-medium">类型</th>
              <th className="text-left p-4 text-text-secondary font-medium">状态</th>
              <th className="text-left p-4 text-text-secondary font-medium">进度</th>
              <th className="text-left p-4 text-text-secondary font-medium">时间</th>
              <th className="text-left p-4 text-text-secondary font-medium">操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map((task) => {
              const config = statusConfig[task.status]
              const StatusIcon = config.icon
              
              return (
                <tr key={task.id} className="border-t border-border-color hover:bg-bg-hover/50">
                  <td className="p-4">
                    <p className="text-text-primary font-medium">{task.name}</p>
                    <p className="text-text-muted text-sm">ID: {task.id}</p>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-bg-tertiary rounded text-sm text-text-secondary">
                      {typeLabels[task.type] || task.type}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <StatusIcon className={clsx('w-4 h-4', config.color)} />
                      <span className={clsx('text-sm', config.color)}>{config.label}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-bg-tertiary rounded-full overflow-hidden">
                        <div 
                          className={clsx(
                            'h-full rounded-full',
                            task.status === 'failed' ? 'bg-error' : 
                            task.status === 'completed' ? 'bg-success' : 'bg-primary'
                          )}
                          style={{ width: `${task.progress}%` }}
                        />
                      </div>
                      <span className="text-text-muted text-sm">{task.progress}%</span>
                    </div>
                  </td>
                  <td className="p-4 text-text-muted text-sm">
                    {task.startedAt ? new Date(task.startedAt).toLocaleString('zh-CN') : '-'}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      {task.status === 'running' ? (
                        <button className="p-2 bg-bg-tertiary rounded-lg hover:bg-bg-hover text-text-secondary">
                          <Pause className="w-4 h-4" />
                        </button>
                      ) : null}
                      <button className="p-2 bg-bg-tertiary rounded-lg hover:bg-bg-hover text-text-secondary">
                        <Play className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
