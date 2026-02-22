import { Bell, User } from 'lucide-react'

export function Header() {
  return (
    <header className="h-16 bg-bg-secondary border-b border-border-color flex items-center justify-between px-6">
      {/* Left - Breadcrumb / Title */}
      <div>
        <h2 className="text-lg font-semibold text-text-primary">控制台</h2>
      </div>

      {/* Right - Actions */}
      <div className="flex items-center gap-4">
        {/* Time Range Selector */}
        <select className="bg-bg-tertiary border border-border-color rounded-lg px-3 py-1.5 text-sm text-text-secondary focus:outline-none focus:border-primary">
          <option>实时</option>
          <option>1小时</option>
          <option>24小时</option>
          <option>7天</option>
        </select>

        {/* Notifications */}
        <button className="relative p-2 text-text-secondary hover:text-text-primary transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full" />
        </button>

        {/* User */}
        <button className="flex items-center gap-2 p-2 text-text-secondary hover:text-text-primary transition-colors">
          <User className="w-5 h-5" />
        </button>
      </div>
    </header>
  )
}
