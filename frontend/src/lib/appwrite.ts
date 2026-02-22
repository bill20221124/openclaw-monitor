import { Client, Account, Databases } from 'appwrite'

const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1'
const project = import.meta.env.VITE_APPWRITE_PROJECT || ''

export const client = new Client()
  .setEndpoint(endpoint)
  .setProject(project)

export const account = new Account(client)
export const databases = new Databases(client)

export const DB_ID = 'opengclaw-monitor'
export const COLLECTIONS = {
  AGENTS: 'agents',
  TASKS: 'tasks',
  MESSAGES: 'messages',
  SKILLS: 'skills',
  LOGS: 'system_logs',
}
