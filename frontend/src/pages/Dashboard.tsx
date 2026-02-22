import { Bot, MessageSquare, ListTodo, Activity } from 'lucide-react'
import { AgentCard } from '../components/dashboard/AgentCard'
import { mockAgents, mockStats } from '../lib/mock'

export function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {mockStats.map((stat) => (
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
                {stat.label === '总 Agent' && <Bot className="w-6 h-6" />}
                {stat.label === '在线' && <Activity className="w-6 h-6" />}
                {stat.label === '运行任务' && <ListTodo className="w-6 h-6" />}
                {stat.label === '今日消息' && <MessageSquare className="w-6 h-6" />}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Agent Grid */}
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-4">🤖 Agent 网格视图</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {mockAgents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      </div>
    </div>
  )
}
