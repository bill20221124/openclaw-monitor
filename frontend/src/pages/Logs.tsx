import { useState } from 'react'
import { 
  FileText, 
  Search, 
  Download, 
  AlertTriangle,
  Info,
  AlertCircle,
  Bug,
  Filter
} from 'lucide-react'
import { clsx } from 'clsx'

interface LogEntry {
  id: string
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG'
  message: string
  source: string
  timestamp: string
  agentId?: string
}

const logs: LogEntry[] = [
  { id: '1', level: 'INFO', message: 'Gateway started successfully', source: 'gateway', timestamp: '2026-02-22T09:00:00Z' },
  { id: '2', level: 'INFO', message: 'Telegram connected', source: 'telegram', timestamp: '2026-02-22T09:00:01Z' },
  { id: '3', level: 'DEBUG', message: 'Skill loaded: browser', source: 'skills', timestamp: '2026-02-22T09:00:02Z' },
  { id: '4', level: 'DEBUG', message: 'Skill loaded: github', source: 'skills', timestamp: '2026-02-22T09:00:03Z' },
  { id: '5', level: 'WARN', message: 'Browser service requires pairing', source: 'browser', timestamp: '2026-02-22T09:15:00Z' },
  { id: '6', level: 'ERROR', message: 'M365 API access blocked by Conditional Access', source: 'm365', timestamp: '2026-02-22T09:30:00Z' },
  { id: '7', level: 'INFO', message: 'Memory automation configured', source: 'cron', timestamp: '2026-02-22T10:00:00Z' },
  { id: '8', level: 'INFO', message: 'Log uploaded to Notion', source: 'automation', timestamp: '2026-02-22T23:00:00Z' },
]

const levelConfig = {
  INFO: { icon: Info, color: 'text-info', bg: 'bg-info/20', label: '信息' },
  WARN: { icon: AlertTriangle, color: 'text-warning', bg: 'bg-warning/20', label: '警告' },
  ERROR: { icon: AlertCircle, color: 'text-error', bg: 'bg-error/20', label: '错误' },
  DEBUG: { icon: Bug, color: 'text-text-muted', bg: 'bg-text-muted/20', label: '调试' },
}

const sourceLabels: Record<string, string> = {
  gateway: '🌐 Gateway',
  telegram: '💬 Telegram',
  skills: '🔧 技能',
  browser: '🌐 浏览器',
  m365: '☁️ M365',
  cron: '⏰ 定时任务',
  automation: '⚙️ 自动化',
}

export function Logs() {
  const [search, setSearch] = useState('')
  const [levelFilter, setLevelFilter] = useState<string>('all')
  const [sourceFilter, setSourceFilter] = useState<string>('all')

  const filteredLogs = logs.filter(log => {
    const matchSearch = log.message.toLowerCase().includes(search.toLowerCase())
    const matchLevel = levelFilter === 'all' || log.level === levelFilter
    const matchSource = sourceFilter === 'all' || log.source === sourceFilter
    return matchSearch && matchLevel && matchSource
  })

  const levelCounts = {
    INFO: logs.filter(l => l.level === 'INFO').length,
    WARN: logs.filter(l => l.level === 'WARN').length,
    ERROR: logs.filter(l => l.level === 'ERROR').length,
    DEBUG: logs.filter(l => l.level === 'DEBUG').length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text-primary">📜 系统日志</h1>
        
        <button className="flex items-center gap-2 px-3 py-2 bg-bg-tertiary text-text-secondary rounded-lg hover:bg-bg-hover">
          <Download className="w-4 h-4" />
          导出日志
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <button 
          onClick={() => setLevelFilter('all')}
          className={clsx(
            'bg-bg-secondary rounded-xl p-4 border transition-colors',
            levelFilter === 'all' ? 'border-primary' : 'border-border-color hover:border-primary/50'
          )}
        >
          <p className="text-text-muted text-sm">全部</p>
          <p className="text-2xl font-bold text-text-primary">{logs.length}</p>
        </button>
        <button 
          onClick={() => setLevelFilter('INFO')}
          className={clsx(
            'bg-bg-secondary rounded-xl p-4 border transition-colors',
            levelFilter === 'INFO' ? 'border-info' : 'border-border-color hover:border-info/50'
          )}
        >
          <p className="text-info text-sm">信息</p>
          <p className="text-2xl font-bold text-info">{levelCounts.INFO}</p>
        </button>
        <button 
          onClick={() => setLevelFilter('WARN')}
          className={clsx(
            'bg-bg-secondary rounded-xl p-4 border transition-colors',
            levelFilter === 'WARN' ? 'border-warning' : 'border-border-color hover:border-warning/50'
          )}
        >
          <p className="text-warning text-sm">警告</p>
          <p className="text-2xl font-bold text-warning">{levelCounts.WARN}</p>
        </button>
        <button 
          onClick={() => setLevelFilter('ERROR')}
          className={clsx(
            'bg-bg-secondary rounded-xl p-4 border transition-colors',
            levelFilter === 'ERROR' ? 'border-error' : 'border-border-color hover:border-error/50'
          )}
        >
          <p className="text-error text-sm">错误</p>
          <p className="text-2xl font-bold text-error">{levelCounts.ERROR}</p>
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
          <input
            type="text"
            placeholder="搜索日志..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-bg-secondary border border-border-color rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-primary"
          />
        </div>
        <select
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value)}
          className="px-4 py-2 bg-bg-secondary border border-border-color rounded-lg text-text-primary focus:outline-none focus:border-primary"
        >
          <option value="all">全部来源</option>
          <option value="gateway">Gateway</option>
          <option value="telegram">Telegram</option>
          <option value="skills">技能</option>
          <option value="browser">浏览器</option>
          <option value="m365">M365</option>
          <option value="cron">定时任务</option>
        </select>
      </div>

      {/* Log List */}
      <div className="bg-bg-secondary rounded-xl border border-border-color overflow-hidden">
        <div className="max-h-[500px] overflow-y-auto font-mono text-sm">
          {filteredLogs.map((log) => {
            const config = levelConfig[log.level]
            const Icon = config.icon
            
            return (
              <div 
                key={log.id} 
                className="p-3 border-b border-border-color hover:bg-bg-hover/50"
              >
                <div className="flex items-start gap-3">
                  {/* Level Badge */}
                  <span className={clsx('px-2 py-0.5 rounded text-xs flex items-center gap-1', config.bg, config.color)}>
                    <Icon className="w-3 h-3" />
                    {log.level}
                  </span>

                  {/* Source */}
                  <span className="text-text-muted">
                    {sourceLabels[log.source] || log.source}
                  </span>

                  {/* Time */}
                  <span className="text-text-muted ml-auto">
                    {new Date(log.timestamp).toLocaleString('zh-CN')}
                  </span>
                </div>

                {/* Message */}
                <p className="mt-1 text-text-primary">{log.message}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
