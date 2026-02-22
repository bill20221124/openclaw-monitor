import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Bot, 
  ListTodo, 
  MessageSquare, 
  Wrench, 
  FileText, 
  Settings,
  Activity
} from 'lucide-react'
import { clsx } from 'clsx'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: '仪表板' },
  { to: '/tasks', icon: ListTodo, label: '任务' },
  { to: '/messages', icon: MessageSquare, label: '消息' },
  { to: '/skills', icon: Wrench, label: '技能' },
  { to: '/logs', icon: FileText, label: '日志' },
  { to: '/settings', icon: Settings, label: '设置' },
]

export function Sidebar() {
  return (
    <aside className="w-64 bg-bg-secondary border-r border-border-color flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-border-color">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <Activity className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-text-primary">OpenClaw</h1>
            <p className="text-xs text-text-muted">Monitor</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                isActive
                  ? 'bg-primary/20 text-primary'
                  : 'text-text-secondary hover:bg-bg-hover hover:text-text-primary'
              )
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Status */}
      <div className="p-4 border-t border-border-color">
        <div className="flex items-center gap-2 text-sm text-text-muted">
          <span className="w-2 h-2 rounded-full bg-success status-pulse" />
          <span>系统正常</span>
        </div>
      </div>
    </aside>
  )
}
