import { DashboardMetrics } from './types';

export const DEFAULT_API_URL = 'http://localhost:5000';
export const DEFAULT_CONTEXT_ID = 'ctx_default';

export const MOCK_METRICS: DashboardMetrics = {
  totalConversations: 1247,
  activeUsers: 89,
  avgResponseTime: "1.2s",
  messageVolume: [
    { day: "Mon", count: 45 },
    { day: "Tue", count: 52 },
    { day: "Wed", count: 38 },
    { day: "Thu", count: 67 },
    { day: "Fri", count: 72 },
    { day: "Sat", count: 58 },
    { day: "Sun", count: 91 }
  ],
  sentiment: [
    { label: "Positive", value: 68, color: "#10b981" },
    { label: "Neutral", value: 25, color: "#64748b" },
    { label: "Negative", value: 7, color: "#f43f5e" }
  ],
  hourlyActivity: Array.from({ length: 24 }, () => Math.floor(Math.random() * 100)),
  topTopics: [
    { topic: "System Arch", count: 234 },
    { topic: "Deployment", count: 189 },
    { topic: "Debugging", count: 156 },
    { topic: "Optimization", count: 98 },
    { topic: "Security", count: 45 }
  ],
  messages: [
    {
      id: "msg-mock-001",
      user: "dev_lead",
      type: "user",
      content: "Initiate system diagnostic sequence level 4.",
      timestamp: new Date().toISOString()
    },
    {
      id: "msg-mock-002",
      user: "agent_zero",
      type: "agent",
      content: "Diagnostics running. Core temperature nominal. Vector DB integrity 99.9%.",
      timestamp: new Date(Date.now() - 2000).toISOString()
    }
  ],
  tokenUsage: {
    total: 145020,
    prompt: 89000,
    completion: 56020,
    estimatedCost: 2.45
  },
  throughput: {
    currentKbps: 12.4,
    totalProcessedMb: 450.2,
    peakKbps: 45.1
  },
  systemHealth: {
    status: 'operational',
    latencyMs: 142,
    uptimePct: 99.98,
    cpuLoad: 34
  }
};

export const COLORS = {
  primary: '#3b82f6',
  teal: '#14b8a6',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  neutral: '#6b7280',
  slate: '#64748b'
};