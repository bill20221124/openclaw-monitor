import { useState } from 'react'
import { 
  Wrench, 
  TrendingUp, 
  Clock, 
  AlertCircle,
  BarChart3
} from 'lucide-react'
import { clsx } from 'clsx'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'

interface Skill {
  id: string
  name: string
  description: string
  category: string
  totalCalls: number
  successCalls: number
  failedCalls: number
  avgExecutionTime: number
}

const skills: Skill[] = [
  { id: '1', name: 'browser', description: 'Browser automation', category: 'tool', totalCalls: 45, successCalls: 44, failedCalls: 1, avgExecutionTime: 1200 },
  { id: '2', name: 'github', description: 'GitHub operations', category: 'tool', totalCalls: 32, successCalls: 32, failedCalls: 0, avgExecutionTime: 800 },
  { id: '3', name: 'notion', description: 'Notion integration', category: 'integration', totalCalls: 28, successCalls: 27, failedCalls: 1, avgExecutionTime: 600 },
  { id: '4', name: 'super-search', description: 'Memory search', category: 'memory', totalCalls: 15, successCalls: 15, failedCalls: 0, avgExecutionTime: 300 },
  { id: '5', name: 'weather', description: 'Weather data', category: 'tool', totalCalls: 12, successCalls: 12, failedCalls: 0, avgExecutionTime: 200 },
  { id: '6', name: 'mcp-microsoft365', description: 'M365 integration', category: 'integration', totalCalls: 8, successCalls: 6, failedCalls: 2, avgExecutionTime: 1500 },
]

const COLORS = ['#00D4FF', '#FF6B35', '#00C853', '#FFD600', '#FF1744', '#2979FF']

const categoryLabels: Record<string, string> = {
  tool: '🛠️ 工具',
  integration: '🔗 集成',
  memory: '🧠 记忆',
  ai: '🤖 AI',
}

export function Skills() {
  const [sortBy, setSortBy] = useState<'calls' | 'success' | 'time'>('calls')

  const sortedSkills = [...skills].sort((a, b) => {
    if (sortBy === 'calls') return b.totalCalls - a.totalCalls
    if (sortBy === 'success') return (b.successCalls / b.totalCalls) - (a.successCalls / a.totalCalls)
    return b.avgExecutionTime - a.avgExecutionTime
  })

  const totalCalls = skills.reduce((sum, s) => sum + s.totalCalls, 0)
  const totalSuccess = skills.reduce((sum, s) => sum + s.successCalls, 0)
  const avgSuccessRate = ((totalSuccess / totalCalls) * 100).toFixed(1)

  const categoryData = skills.reduce((acc, s) => {
    const existing = acc.find(item => item.name === categoryLabels[s.category])
    if (existing) {
      existing.value += s.totalCalls
    } else {
      acc.push({ name: categoryLabels[s.category] || s.category, value: s.totalCalls })
    }
    return acc
  }, [] as { name: string; value: number }[])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text-primary">🔧 技能分析</h1>
        
        <div className="flex gap-2">
          {(['calls', 'success', 'time'] as const).map((sort) => (
            <button
              key={sort}
              onClick={() => setSortBy(sort)}
              className={clsx(
                'px-3 py-1.5 rounded-lg text-sm transition-colors',
                sortBy === sort 
                  ? 'bg-primary/20 text-primary' 
                  : 'bg-bg-tertiary text-text-secondary hover:bg-bg-hover'
              )}
            >
              {sort === 'calls' ? '调用次数' : sort === 'success' ? '成功率' : '执行时间'}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-bg-secondary rounded-xl p-4 border border-border-color">
          <div className="flex items-center gap-3">
            <Wrench className="w-8 h-8 text-primary" />
            <div>
              <p className="text-text-muted text-sm">技能总数</p>
              <p className="text-2xl font-bold text-text-primary">{skills.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-bg-secondary rounded-xl p-4 border border-border-color">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-success" />
            <div>
              <p className="text-text-muted text-sm">总调用</p>
              <p className="text-2xl font-bold text-text-primary">{totalCalls}</p>
            </div>
          </div>
        </div>
        <div className="bg-bg-secondary rounded-xl p-4 border border-border-color">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-warning" />
            <div>
              <p className="text-text-muted text-sm">成功率</p>
              <p className="text-2xl font-bold text-text-primary">{avgSuccessRate}%</p>
            </div>
          </div>
        </div>
        <div className="bg-bg-secondary rounded-xl p-4 border border-border-color">
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-info" />
            <div>
              <p className="text-text-muted text-sm">平均耗时</p>
              <p className="text-2xl font-bold text-text-primary">
                {Math.round(skills.reduce((sum, s) => sum + s.avgExecutionTime, 0) / skills.length)}ms
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6">
        {/* Bar Chart - Top Skills */}
        <div className="bg-bg-secondary rounded-xl p-4 border border-border-color">
          <h3 className="text-lg font-semibold text-text-primary mb-4">📊 技能调用排行</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sortedSkills.slice(0, 6)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A3655" />
              <XAxis dataKey="name" stroke="#8B9DC3" fontSize={12} />
              <YAxis stroke="#8B9DC3" fontSize={12} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#141B2D', border: '1px solid #2A3655' }}
                labelStyle={{ color: '#fff' }}
              />
              <Bar dataKey="totalCalls" fill="#00D4FF" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart - By Category */}
        <div className="bg-bg-secondary rounded-xl p-4 border border-border-color">
          <h3 className="text-lg font-semibold text-text-primary mb-4">📈 分类占比</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#141B2D', border: '1px solid #2A3655' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Skill List */}
      <div className="bg-bg-secondary rounded-xl border border-border-color overflow-hidden">
        <table className="w-full">
          <thead className="bg-bg-tertiary">
            <tr>
              <th className="text-left p-4 text-text-secondary font-medium">技能</th>
              <th className="text-left p-4 text-text-secondary font-medium">分类</th>
              <th className="text-left p-4 text-text-secondary font-medium">调用次数</th>
              <th className="text-left p-4 text-text-secondary font-medium">成功</th>
              <th className="text-left p-4 text-text-secondary font-medium">失败</th>
              <th className="text-left p-4 text-text-secondary font-medium">成功率</th>
              <th className="text-left p-4 text-text-secondary font-medium">平均耗时</th>
            </tr>
          </thead>
          <tbody>
            {sortedSkills.map((skill) => {
              const successRate = ((skill.successCalls / skill.totalCalls) * 100).toFixed(1)
              
              return (
                <tr key={skill.id} className="border-t border-border-color hover:bg-bg-hover/50">
                  <td className="p-4">
                    <div>
                      <p className="font-medium text-text-primary">{skill.name}</p>
                      <p className="text-text-muted text-sm">{skill.description}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-bg-tertiary rounded text-sm text-text-secondary">
                      {categoryLabels[skill.category] || skill.category}
                    </span>
                  </td>
                  <td className="p-4 text-text-primary font-medium">{skill.totalCalls}</td>
                  <td className="p-4 text-success">{skill.successCalls}</td>
                  <td className="p-4">
                    <span className={skill.failedCalls > 0 ? 'text-error' : 'text-text-muted'}>
                      {skill.failedCalls}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-bg-tertiary rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-success rounded-full"
                          style={{ width: `${successRate}%` }}
                        />
                      </div>
                      <span className="text-text-secondary text-sm">{successRate}%</span>
                    </div>
                  </td>
                  <td className="p-4 text-text-muted">{skill.avgExecutionTime}ms</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
