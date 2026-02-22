import { useState } from 'react'
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Palette,
  Globe,
  Save,
  RefreshCw
} from 'lucide-react'
import { clsx } from 'clsx'

export function Settings() {
  const [activeTab, setActiveTab] = useState('general')

  const tabs = [
    { id: 'general', label: '通用', icon: SettingsIcon },
    { id: 'notifications', label: '通知', icon: Bell },
    { id: 'security', label: '安全', icon: Shield },
    { id: 'appearance', label: '外观', icon: Palette },
    { id: 'language', label: '语言', icon: Globe },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <h1 className="text-2xl font-bold text-text-primary">⚙️ 设置</h1>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-48 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                'w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-left',
                activeTab === tab.id
                  ? 'bg-primary/20 text-primary'
                  : 'text-text-secondary hover:bg-bg-hover hover:text-text-primary'
              )}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 bg-bg-secondary rounded-xl border border-border-color p-6">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-text-primary">通用设置</h2>
              
              {/* Agent Name */}
              <div className="space-y-2">
                <label className="block text-text-secondary">Agent 名称</label>
                <input
                  type="text"
                  defaultValue="Main Agent"
                  className="w-full px-4 py-2 bg-bg-tertiary border border-border-color rounded-lg text-text-primary focus:outline-none focus:border-primary"
                />
              </div>

              {/* Default Model */}
              <div className="space-y-2">
                <label className="block text-text-secondary">默认模型</label>
                <select className="w-full px-4 py-2 bg-bg-tertiary border border-border-color rounded-lg text-text-primary focus:outline-none focus:border-primary">
                  <option value="minimax">MiniMax-M2.5</option>
                  <option value="copilot">GitHub Copilot</option>
                </select>
              </div>

              {/* Heartbeat Interval */}
              <div className="space-y-2">
                <label className="block text-text-secondary">心跳间隔 (分钟)</label>
                <input
                  type="number"
                  defaultValue={60}
                  className="w-full px-4 py-2 bg-bg-tertiary border border-border-color rounded-lg text-text-primary focus:outline-none focus:border-primary"
                />
              </div>

              {/* Auto Approve */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-primary">自动批准危险操作</p>
                  <p className="text-text-muted text-sm">执行 rm, del 等命令前不需要确认</p>
                </div>
                <button className="relative w-12 h-6 bg-bg-tertiary rounded-full transition-colors">
                  <span className="absolute left-1 top-1 w-4 h-4 bg-text-muted rounded-full transition-all" />
                </button>
              </div>

              <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark">
                <Save className="w-4 h-4" />
                保存设置
              </button>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-text-primary">通知设置</h2>
              
              <div className="space-y-4">
                {[
                  { label: '任务完成通知', desc: '任务完成后发送通知' },
                  { label: '错误告警', desc: '发生错误时发送通知' },
                  { label: '心跳异常', desc: 'Agent 离线时发送通知' },
                  { label: '每日汇总', desc: '每日发送工作汇总' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div>
                      <p className="text-text-primary">{item.label}</p>
                      <p className="text-text-muted text-sm">{item.desc}</p>
                    </div>
                    <button className="relative w-12 h-6 bg-primary rounded-full transition-colors">
                      <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-text-primary">安全设置</h2>
              
              <div className="space-y-4">
                <div className="p-4 bg-bg-tertiary rounded-lg">
                  <p className="text-text-primary font-medium">API 密钥</p>
                  <p className="text-text-muted text-sm mt-1">••••••••••••••••</p>
                </div>

                <button className="flex items-center gap-2 px-4 py-2 bg-bg-tertiary text-text-secondary rounded-lg hover:bg-bg-hover">
                  <RefreshCw className="w-4 h-4" />
                  轮换密钥
                </button>

                <div className="flex items-center justify-between pt-4 border-t border-border-color">
                  <div>
                    <p className="text-text-primary">IP 白名单</p>
                    <p className="text-text-muted text-sm">限制访问来源</p>
                  </div>
                  <button className="px-4 py-2 bg-bg-tertiary text-text-secondary rounded-lg hover:bg-bg-hover">
                    配置
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-text-primary">外观设置</h2>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-text-secondary">主题</label>
                  <div className="flex gap-4">
                    {['dark', 'light', 'auto'].map((theme) => (
                      <button
                        key={theme}
                        className={clsx(
                          'px-4 py-2 rounded-lg border',
                          theme === 'dark' 
                            ? 'border-primary bg-primary/20 text-primary'
                            : 'border-border-color text-text-secondary hover:border-primary/50'
                        )}
                      >
                        {theme === 'dark' ? '🌙 暗色' : theme === 'light' ? '☀️ 亮色' : '🔄 自动'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'language' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-text-primary">语言设置</h2>
              
              <div className="space-y-4">
                <select className="w-full px-4 py-2 bg-bg-tertiary border border-border-color rounded-lg text-text-primary focus:outline-none focus:border-primary">
                  <option value="zh-CN">简体中文</option>
                  <option value="en">English</option>
                  <option value="zh-TW">繁體中文</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
