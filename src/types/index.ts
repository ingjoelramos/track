export interface User {
  id: string;
  email: string;
  role: 'admin' | 'analyst';
  name: string;
}

export interface Domain {
  id: string;
  host: string;
  verified: boolean;
  isGlobal?: boolean;
  isDefault?: boolean;
  userId?: string;
}

export interface Template {
  id: string;
  name: string;
  type: 'placeholders' | 'query';
  pattern: string;
}

export interface Campaign {
  id: string;
  name: string;
  domainId: string;
  templateId?: string;
  status: 'active' | 'paused' | 'draft';
  createdAt: number;
  userId: string;
  trafficSource?: string;
  trafficParameters?: TrafficParameter[];
  destinationUrl?: string;
  blockVpn?: boolean;
  blockAbnormalTraffic?: boolean;
  frequencyCapping?: 'none' | '6h' | '12h' | '24h';
  repeatVisitorUrl?: string;
}

export interface Link {
  id: string;
  campaignId: string;
  slug: string;
  params: Record<string, string>;
  trafficParameters?: TrafficParameter[];
}

export interface Visit {
  id: string;
  linkId: string;
  ts: number;
  browser?: string;
  target_url?: string;
  keyword?: string;
  carrier?: string;
  device_id?: string;
  visitor_type?: string;
  traffic_type?: string;
  source?: string;
  region?: string;
  country?: string;
  city?: string;
  isVpn?: boolean;
  device?: string;
  os?: string;
  language?: string;
  referrer?: string;
  connection?: string;
  ip?: string;
}

export interface LinkStats {
  total: number;
  unique: number;
  repeated: number;
  vpn: number;
  legitimate: number;
  sources: Record<string, number>;
  regions: Record<string, number>;
  browsers: Record<string, number>;
  hourly: Record<string, number>;
  tokenStats?: Record<string, Record<string, {
    total: number;
    unique: number;
    repeated: number;
    vpn: number;
    legitimate: number;
  }>>;
}

export interface FilterOptions {
  dateRange: 'today' | '7d' | '15d' | 'month' | 'custom';
  startDate?: string;
  endDate?: string;
  tokenFilters?: {
    parameter: string;
    value: string;
  }[];
  country?: string;
  region?: string;
  city?: string;
  device?: string;
  browser?: string;
  language?: string;
  referrer?: string;
  os?: string;
  source?: string;
  isVpn?: boolean;
  repeated?: boolean;
  visitor_type?: string;
  traffic_type?: string;
  connection?: string;
  carrier?: string;
}

export interface TrafficParameter {
  id: string;
  sourceId: string;
  token: string;
  parameter: string;
  description: string;
}

export interface SystemSettings {
  proxyCheckApiKey?: string;
  proxyCheckEnabled: boolean;
  globalDomain?: string;
}