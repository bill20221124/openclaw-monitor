import { useParams } from 'react-router-dom'
import { useState } from 'react'
import { 
  Bot, 
  Cpu, 
  HardDrive, 
  MemoryStick, 
  Play, 
  Pause, 
  RotateCcw,
  MessageSquare,
  Clock,
  ListTodo,
  Settings
} from 'lucide-react'
import { clsx } from 'clsx'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts'

// Mock data
const agent = {
  id: 'main',
  name: 'Main Agent',
  status: 'online' as const,
  model: 'MiniMax-M2.5',
  provider: 'minimax-portal',
  channels: ['Telegram'],
  createdAt: '2026-02-20T00:00:00Z',
  lastHeartbeat: '2026-02-22T10:30:00Z',
  uptime: 280000,
  config: {
    soulMd: '# SOUL.md\nYou are a helpful AI assistant...',
    heartbeatInterval: 60,
    autoApprove: false,
  },
  resources: { cpu: 12, memory: 456, disk: 2.1 },
  todayStats: { 
    tasksCompleted: 24, 
    tasksFailed: 1, 
    messagesReceived: 156, 
    messagesSent: 142, 
    skillsCalled: 42 
  },
  currentTask: {
    id: 'task-1',
    name: '处理用户请求',
    progress: 75,
    startedAt: '2026-02-22T10:00:00Z',
  }
}

const cpuHistory = [
  { time: '10:00', value: 15 },
  { time: '10:05', value: 12 },
  { time: '10:10', value: 18 },
  { time: '10:15', value: 10 },
  { time: '10:20', value: 14 },
  { time: '10:25', value: 11 },
  { time: '10:30', value: 12 },
]

const memoryHistory = [
  { time: '10:00', value: 420 },
  { time: '10:05', value: 450 },
  { time: '10:10', value: 480 },
  { time: '10:15', value: 440 },
  { time: '10:20', value: 460 },
  { time: '10:25', value: 450 },
  { time: '10:30', value: 456 },
]

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  return `${days}天 ${hours}小时 ${minutes}分钟`
}

export function AgentDetail() {
  const { id } = useParams()
  const [activeTab, setActiveTab] = useState('overview')

  const tabs = [
    { id: 'overview', label: '概览', icon: Bot },
    { id: 'tasks', label: '任务', icon: ListTodo },
    { id: 'messages', label: '消息', icon: MessageSquare },
    { id: 'settings', label: '配置', icon: Settings },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-primary/20 flex items-center justify-center">
            <Bot className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">{agent.name}</h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="px-2 py-0.5 bg-success/20 text-success rounded text-sm">🟢 在线</span>
              <span className="text-text-muted">模型: {agent.model}</span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30">
            <Play className="w-4 h-4" />
            启动
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-bg-tertiary text-text-secondary rounded-lg hover:bg-bg-hover">
            <Pause className="w-4 h-4" />
            暂停
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-bg-tertiary text-text-secondary rounded-lg hover:bg-bg-hover">
            <RotateCcw className="w-4 h-4" />
            重启
          </button>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-bg-secondary rounded-xl p-4 border border-border-color">
          <p className="text-text-muted text-sm">运行时间</p>
          <p className="text-xl font-bold text-text-primary mt-1">{formatUptime(agent.uptime)}</p>
        </div>
        <div className="bg-bg-secondary rounded-xl p-4 border border-border-color">
          <p className="text-text-muted text-sm">今日任务</p>
          <p className="text-xl font-bold text-text-primary mt-1">{agent.todayStats.tasksCompleted}</p>
        </div>
        <div className="bg-bg-secondary rounded-xl p-4 border border-border-color">
          <p className="text-text-muted text-sm">消息数</p>
          <p className="text-xl font-bold text-text-primary mt-1">{agent.todayStats.messagesReceived}</p>
        </div>
        <div className="bg-bg-secondary rounded-xl p-4 border border-border-color">
          <p className="text-text-muted text-sm">最后心跳</p>
          <p className="text-xl font-bold text-text-primary mt-1">
            {new Date(agent.lastHeartbeat).toLocaleTimeString('zh-CN')}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-bg-secondary rounded-lg p-1 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={clsx(
              'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors',
              activeTab === tab.id
                ? 'bg-primary/20 text-primary'
                : 'text-text-secondary hover:text-text-primary'
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-2 gap-6">
          {/* Resources Chart */}
          <div className="bg-bg-secondary rounded-xl p-4 border border-border-color">
            <h3 className="text-lg font-semibold text-text-primary mb-4">💻 资源使用趋势</h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={cpuHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A3655" />
                <XAxis dataKey="time" stroke="#8B9DC3" fontSize={12} />
                <YAxis stroke="#8B9DC3" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#141B2D', border: '1px solid #2A3655' }}
                />
                <Area type="monotone" dataKey="value" stroke="#00D4FF" fill="#00D4FF/20" />
              </AreaChart>
            </ResponsiveContainer>
            
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="text-center">
                <Cpu className="w-5 h-5 text-primary mx-auto" />
                <p className="text-text-muted text-sm mt-1">CPU</p>
                <p className="text-text-primary font-bold">{agent.resources.cpu}%</p>
              </div>
              <div className="text-center">
                <MemoryStick className="w-5 h-5 text-success mx-auto" />
                <p className="text-text-muted text-sm mt-1">内存</p>
                <p className="text-text-primary font-bold">{agent.resources.memory}MB</p>
              </div>
              <div className="text-center">
                <HardDrive className="w-5 h-5 text-warning mx-auto" />
                <p className="text-text-muted text-sm mt-1">磁盘</p>
                <p className="text-text-primary font-bold">{agent.resources.disk}GB</p>
              </div>
            </div>
          </div>

          {/* Current Task */}
          <div className="bg-bg-secondary rounded-xl p-4 border border-border-color">
            <h3 className="text-lg font-semibold text-text-primary mb-4">🔄 当前任务</h3>
            {agent.currentTask ? (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-text-secondary">{agent.currentTask.name}</span>
                    <span className="text-text-muted">{agent.currentTask.progress}%</span>
                  </div>
                  <div className="w-full h-3 bg-bg-tertiary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${agent.currentTask.progress}%` }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-text-muted text-sm">
                  <Clock className="w-4 h-4" />
                  开始于: {new Date(agent.currentTask.startedAt).toLocaleString('zh-CN')}
                </div>
              </div>
            ) : (
              <p className="text-text-muted">暂无任务</p>
            )}
          </div>

          {/* Stats */}
          <div className="bg-bg-secondary rounded-xl p-4 border border-border-color">
            <h3 className="text-lg font-semibold text-text-primary mb-4">📊 今日统计</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-bg-tertiary rounded-lg">
                <p className="text-3xl font-bold text-success">{agent.todayStats.tasksCompleted}</p>
                <p className="text-text-muted text-sm">完成任务</p>
              </div>
              <div className="text-center p-4 bg-bg-tertiary rounded-lg">
                <p className="text-3xl font-bold text-error">{agent.todayStats.tasksFailed}</p>
                <p className="text-text-muted text-sm">失败任务</p>
              </div>
              <div className="text-center p-4 bg-bg-tertiary rounded-lg">
                <p className="text-3xl font-bold text-primary">{agent.todayStats.messagesReceived}</p>
                <p className="text-text-muted text-sm">收到消息</p>
              </div>
              <div className="text-center p-4 bg-bg-tertiary rounded-lg">
                <p className="text-3xl font-bold text-info">{agent.todayStats.skillsCalled}</p>
                <p className="text-text-muted text-sm">技能调用</p>
              </div>
            </div>
          </div>

          {/* Channels */}
          <div className="bg-bg-secondary rounded-xl p-4 border border-border-color">
            <h3 className="text-lg font-semibold text-text-primary mb-4">💬 连接渠道</h3>
            <div className="space-y-2">
              {agent.channels.map((channel) => (
                <div key={channel} className="flex items-center justify-between p-3 bg-bg-tertiary rounded-lg">
                  <span className="text-text-primary">{channel}</span>
                  <span className="px-2 py-0.5 bg-success/20 text-success rounded text-sm">已连接</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'tasks' && (
        <div className="bg-bg-secondary rounded-xl p-4 border border-border-color">
          <p className="text-text-muted">任务列表开发中...</p>
        </div>
      )}

      {activeTab === 'messages' && (
        <div className="bg-bg-secondary rounded-xl p-4 border border-border-color">
          <p className="text-text-muted">消息列表开发中...</p>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="bg-bg-secondary rounded-xl p-4 border border-border-color space-y-4">
          <div>
            <label className="block text-text-secondary text-sm mb-2">SOUL.md 配置</label>
            <textarea 
              defaultValue={agent.config.soulMd}
              rows={10}
              className="w-full px-4 py-2 bg-bg-tertiary border border-border-color rounded-lg text-text-primary font-mono text-sm focus:outline-none focus:border-primary"
            />
          </div>
          <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark">
            保存配置
          </button>
        </div>
      )}
    </div>
  )
}
