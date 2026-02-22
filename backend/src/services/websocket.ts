import { Server } from 'socket.io'

export function setupWebSocket(io: Server) {
  io.on('connection', (socket) => {
    console.log('🔌 Client connected:', socket.id)

    // Subscribe to channels
    socket.on('subscribe', (channels: string[]) => {
      channels.forEach(channel => {
        socket.join(channel)
      })
      console.log(`📡 Client ${socket.id} subscribed to:`, channels)
    })

    socket.on('unsubscribe', (channels: string[]) => {
      channels.forEach(channel => {
        socket.leave(channel)
      })
    })

    // Handle agent commands
    socket.on('command', (data: { agentId: string; command: string }) => {
      // Forward to specific agent
      io.to(`agent:${data.agentId}`).emit('command', data)
    })

    socket.on('disconnect', () => {
      console.log('🔌 Client disconnected:', socket.id)
    })
  })

  // Broadcast helper functions
  return {
    broadcastAgentStatus: (agentId: string, status: any) => {
      io.to('agents').emit('agent.status', { agentId, ...status })
    },
    
    broadcastTaskUpdate: (task: any) => {
      io.to('tasks').emit('task.updated', task)
    },
    
    broadcastMessage: (message: any) => {
      io.to('messages').emit('message.new', message)
    },
    
    broadcastLog: (log: any) => {
      io.to('system').emit('system.log', log)
    },
    
    broadcastAlert: (alert: any) => {
      io.to('system').emit('system.alert', alert)
    }
  }
}
