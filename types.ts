export interface LogItem {
  id: string;
  type: 'user' | 'agent' | 'system';
  content: string;
  timestamp: string;
  user: string;
  metadata?: Record<string, any>;
}

export interface AgentZeroLogResponse {
  context_id: string;
  log: {
    guid: string;
    total_items: number;
    returned_items: number;
    start_position: number;
    progress: number;
    items: LogItem[];
  };
  error?: string;
}

export interface SentimentData {
  label: string;
  value: number;
  color: string;
}

export interface VolumeData {
  day: string;
  count: number;
}

export interface TopicData {
  topic: string;
  count: number;
}

export interface TokenUsageData {
  total: number;
  prompt: number;
  completion: number;
  estimatedCost: number; // In cents/dollars
}

export interface ThroughputData {
  currentKbps: number;
  totalProcessedMb: number;
  peakKbps: number;
}

export interface SystemHealth {
  status: 'operational' | 'degraded' | 'critical';
  latencyMs: number;
  uptimePct: number;
  cpuLoad: number; // Mocked for visual
}

export interface DashboardMetrics {
  totalConversations: number;
  activeUsers: number;
  avgResponseTime: string;
  messageVolume: VolumeData[];
  sentiment: SentimentData[];
  hourlyActivity: number[]; // Array of 24 integers
  topTopics: TopicData[];
  messages: LogItem[];
  
  // New Advanced Metrics
  tokenUsage: TokenUsageData;
  throughput: ThroughputData;
  systemHealth: SystemHealth;
}

export interface ApiConfig {
  url: string;
  apiKey: string;
  contextId: string;
}