import { ApiConfig, DashboardMetrics, AgentZeroLogResponse, LogItem, VolumeData } from '../types';
import { MOCK_METRICS } from '../constants';

export const fetchAnalytics = async (config: ApiConfig): Promise<DashboardMetrics> => {
  if (!config.url || !config.apiKey) {
    // Return mock data immediately if no config
    return MOCK_METRICS;
  }

  try {
    const baseUrl = config.url.replace(/\/+$/, '');
    const endpoint = `${baseUrl}/api_log_get`;

    // Fetching logs
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': config.apiKey
      },
      body: JSON.stringify({
        context_id: config.contextId || 'default',
        length: 100 // Get last 100 items for stats
      })
    });

    if (!response.ok) {
      console.warn(`API Error ${response.status}: Returning mock data`);
      return MOCK_METRICS;
    }

    const data: AgentZeroLogResponse = await response.json();
    return transformLogDataToMetrics(data);

  } catch (error) {
    console.error("Connection failed:", error);
    return MOCK_METRICS;
  }
};

const transformLogDataToMetrics = (data: AgentZeroLogResponse): DashboardMetrics => {
  const items = data.log?.items || [];
  
  // -- Basic Stats --
  const users = new Set(items.map(item => item.user || 'anonymous'));
  const totalItems = data.log?.total_items || items.length;

  // -- Advanced Heuristics --
  
  // 1. Token Estimation (Approx 4 chars per token)
  let promptTokens = 0;
  let completionTokens = 0;
  let totalChars = 0;

  items.forEach(item => {
    const chars = item.content?.length || 0;
    totalChars += chars;
    const tokens = Math.ceil(chars / 4);
    
    if (item.type === 'user') {
      promptTokens += tokens;
    } else {
      completionTokens += tokens;
    }
  });

  const totalTokens = promptTokens + completionTokens;
  // Mock cost: $0.00001 per token avg
  const estimatedCost = parseFloat((totalTokens * 0.00001).toFixed(4));

  // 2. Throughput Estimation
  // We assume these 100 items happened over the last X duration.
  // Ideally we check timestamps.
  let timeSpanSeconds = 60; // Default fallback
  if (items.length > 1) {
    const first = new Date(items[items.length - 1].timestamp).getTime();
    const last = new Date(items[0].timestamp).getTime();
    const diff = Math.abs(last - first) / 1000;
    if (diff > 0) timeSpanSeconds = diff;
  }
  
  const totalBytes = totalChars; // Rough approx 1 char = 1 byte (utf-8 varies but acceptable for estimation)
  const currentKbps = parseFloat(((totalBytes / 1024) / timeSpanSeconds).toFixed(2));
  
  // 3. Hourly Heatmap
  const hourlyActivity = new Array(24).fill(0);
  items.forEach(item => {
    const date = new Date(item.timestamp);
    if (!isNaN(date.getTime())) {
      const hour = date.getHours();
      hourlyActivity[hour]++;
    }
  });

  // 4. Volume (Last 7 Days)
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();
  const last7DaysMap = new Map<string, number>();
  const volumeData: VolumeData[] = [];

  // Init map
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    last7DaysMap.set(dateStr, 0);
    volumeData.push({ day: days[d.getDay()], count: 0 }); // Placeholder order
  }

  items.forEach(item => {
    const d = new Date(item.timestamp);
    if (!isNaN(d.getTime())) {
      const dateStr = d.toISOString().split('T')[0];
      if (last7DaysMap.has(dateStr)) {
        last7DaysMap.set(dateStr, (last7DaysMap.get(dateStr) || 0) + 1);
      }
    }
  });

  // Re-map correct counts to the array
  // Note: This logic assumes volumeData array indices correspond to the dates iteratation order above
  let idx = 0;
  last7DaysMap.forEach((count) => {
    if (volumeData[idx]) volumeData[idx].count = count;
    idx++;
  });
  
  // Fallback to mock volume if empty (just for visuals in demo, removable in prod)
  const finalVolume = totalItems > 0 ? volumeData : MOCK_METRICS.messageVolume;

  return {
    totalConversations: totalItems,
    activeUsers: users.size,
    avgResponseTime: (Math.random() * 1.5 + 0.5).toFixed(2) + 's', // Mocked latency
    messageVolume: finalVolume,
    sentiment: MOCK_METRICS.sentiment, // Keep mock, NLP required
    hourlyActivity,
    topTopics: MOCK_METRICS.topTopics, // Keep mock, classification required
    messages: items.slice(0, 20), // Only show recent 20 in terminal
    
    tokenUsage: {
      total: totalTokens,
      prompt: promptTokens,
      completion: completionTokens,
      estimatedCost
    },
    throughput: {
      currentKbps: isNaN(currentKbps) ? 0 : currentKbps,
      totalProcessedMb: parseFloat((totalBytes / 1024 / 1024).toFixed(2)),
      peakKbps: parseFloat((currentKbps * 1.5).toFixed(2)) // Mock peak
    },
    systemHealth: {
      status: 'operational',
      latencyMs: Math.floor(Math.random() * 50) + 20,
      uptimePct: 99.99,
      cpuLoad: Math.floor(Math.random() * 40) + 10
    }
  };
};