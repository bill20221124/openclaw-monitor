import { Bot, MessageSquare, ListTodo, Activity } from 'lucide-react'
import { AgentCard } from '../components/dashboard/AgentCard'

// Mock data
const agents = [
  {
    id: 'main',
    name: 'Main Agent',
    status: 'online' as const,
    model: 'MiniMax-M2.5',
    uptime: 86400 * 3 + 43200,
    currentTask: '处理用户请求',
    progress: 75,
    stats: { tasks: 24, messages: 156, skills: 42 },
    resources: { cpu: 12, memory: 456, disk: 2.1 },
    recentSkills: ['github', 'browser', 'notion'],
  },
]

const stats = [
  { label: '总 Agent', value: '1', icon: Bot, color: 'text-primary' },
  { label: '在线', value: '1', icon: Activity, color: 'text-success' },
  { label: '运行任务', value: '1', icon: ListTodo, color: 'text-warning' },
  { label: '今日消息', value: '156', icon: MessageSquare, color: 'text-info' },
]

export function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-bg-secondary rounded-xl p-4 border border-border-color"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm">{stat.label}</p>
                <p className="text-2xl font-bold text-text-primary mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg bg-bg-tertiary ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Agent Grid */}
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-4">🤖 Agent 网格视图</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {agents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      </div>
    </div>
  )
}
