import { useState } from 'react'
import { 
  MessageSquare, 
  Send, 
  Download, 
  Search,
  Filter,
  ArrowDownUp
} from 'lucide-react'
import { clsx } from 'clsx'

interface Message {
  id: string
  agentId: string
  channel: string
  direction: 'incoming' | 'outgoing' | 'system'
  content: string
  contentType: string
  sender?: string
  timestamp: string
  processingTime?: number
}

const messages: Message[] = [
  { id: '1', agentId: 'main', channel: 'telegram', direction: 'incoming', content: '你好', sender: '8537212690', timestamp: '2026-02-22T10:00:00Z', processingTime: 120 },
  { id: '2', agentId: 'main', channel: 'telegram', direction: 'outgoing', content: '你好！有什么可以帮你的？', sender: 'OpenClaw', timestamp: '2026-02-22T10:00:01Z', processingTime: 50 },
  { id: '3', agentId: 'main', channel: 'telegram', direction: 'incoming', content: '帮我测试一下浏览器', sender: '8537212690', timestamp: '2026-02-22T10:01:00Z', processingTime: 80 },
  { id: '4', agentId: 'main', channel: 'system', direction: 'system', content: 'Agent started', timestamp: '2026-02-22T09:00:00Z' },
]

const channelLabels: Record<string, { label: string; color: string }> = {
  telegram: { label: 'Telegram', color: 'bg-blue-500' },
  whatsapp: { label: 'WhatsApp', color: 'bg-green-500' },
  slack: { label: 'Slack', color: 'bg-purple-500' },
  system: { label: '系统', color: 'bg-gray-500' },
}

export function Messages() {
  const [search, setSearch] = useState('')
  const [channelFilter, setChannelFilter] = useState('all')

  const filteredMessages = messages.filter(msg => {
    const matchSearch = msg.content.toLowerCase().includes(search.toLowerCase())
    const matchChannel = channelFilter === 'all' || msg.channel === channelFilter
    return matchSearch && matchChannel
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text-primary">💬 消息监控</h1>
        
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-2 bg-bg-tertiary text-text-secondary rounded-lg hover:bg-bg-hover">
            <Download className="w-4 h-4" />
            导出
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-bg-secondary rounded-xl p-4 border border-border-color">
          <p className="text-text-muted text-sm">总消息</p>
          <p className="text-2xl font-bold text-text-primary">{messages.length}</p>
        </div>
        <div className="bg-bg-secondary rounded-xl p-4 border border-border-color">
          <p className="text-text-muted text-sm">收到</p>
          <p className="text-2xl font-bold text-primary">{messages.filter(m => m.direction === 'incoming').length}</p>
        </div>
        <div className="bg-bg-secondary rounded-xl p-4 border border-border-color">
          <p className="text-text-muted text-sm">发送</p>
          <p className="text-2xl font-bold text-success">{messages.filter(m => m.direction === 'outgoing').length}</p>
        </div>
        <div className="bg-bg-secondary rounded-xl p-4 border border-border-color">
          <p className="text-text-muted text-sm">系统</p>
          <p className="text-2xl font-bold text-warning">{messages.filter(m => m.direction === 'system').length}</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
          <input
            type="text"
            placeholder="搜索消息..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-bg-secondary border border-border-color rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-primary"
          />
        </div>
        <select
          value={channelFilter}
          onChange={(e) => setChannelFilter(e.target.value)}
          className="px-4 py-2 bg-bg-secondary border border-border-color rounded-lg text-text-primary focus:outline-none focus:border-primary"
        >
          <option value="all">全部渠道</option>
          <option value="telegram">Telegram</option>
          <option value="whatsapp">WhatsApp</option>
          <option value="slack">Slack</option>
          <option value="system">系统</option>
        </select>
      </div>

      {/* Message Stream */}
      <div className="bg-bg-secondary rounded-xl border border-border-color overflow-hidden">
        <div className="max-h-[600px] overflow-y-auto">
          {filteredMessages.map((msg) => (
            <div 
              key={msg.id} 
              className={clsx(
                'p-4 border-b border-border-color hover:bg-bg-hover/50',
                msg.direction === 'incoming' && 'bg-primary/5',
                msg.direction === 'outgoing' && 'bg-success/5',
              )}
            >
              <div className="flex items-start gap-3">
                {/* Channel Badge */}
                <span className={clsx('px-2 py-0.5 rounded text-xs text-white', channelLabels[msg.channel]?.color || 'bg-gray-500')}>
                  {channelLabels[msg.channel]?.label || msg.channel}
                </span>

                {/* Direction */}
                <span className={clsx(
                  'text-xs px-2 py-0.5 rounded',
                  msg.direction === 'incoming' && 'bg-primary/20 text-primary',
                  msg.direction === 'outgoing' && 'bg-success/20 text-success',
                  msg.direction === 'system' && 'bg-warning/20 text-warning',
                )}>
                  {msg.direction === 'incoming' ? '⬇️ 收到' : msg.direction === 'outgoing' ? '⬆️ 发送' : '⚙️ 系统'}
                </span>

                {/* Sender */}
                {msg.sender && (
                  <span className="text-text-muted text-sm">
                    {msg.sender}
                  </span>
                )}

                {/* Time */}
                <span className="text-text-muted text-sm ml-auto">
                  {new Date(msg.timestamp).toLocaleString('zh-CN')}
                </span>
              </div>

              {/* Content */}
              <p className="mt-2 text-text-primary">{msg.content}</p>

              {/* Meta */}
              {msg.processingTime && (
                <p className="mt-1 text-text-muted text-xs">
                  处理时间: {msg.processingTime}ms
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
