import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { Dashboard } from './pages/Dashboard'
import { AgentDetail } from './pages/AgentDetail'
import { Tasks } from './pages/Tasks'
import { Messages } from './pages/Messages'
import { Skills } from './pages/Skills'
import { Logs } from './pages/Logs'
import { Settings } from './pages/Settings'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="agent/:id" element={<AgentDetail />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="messages" element={<Messages />} />
          <Route path="skills" element={<Skills />} />
          <Route path="logs" element={<Logs />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
