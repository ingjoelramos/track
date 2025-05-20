import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format } from 'date-fns';
import { Visit, LinkStats, FilterOptions } from '../types';
import { 
  browsers, devices, os, visitorTypes, trafficTypes, 
  sources, countries, regions, cities, carriers, languages, connections 
} from '../data/demoData';

/**
 * Generates a unique hash for campaign URLs
 * Format: {timestamp-base36}-{random-6-chars}
 * @returns {string} Unique hash string
 * @validated
 */
export function generateUniqueHash(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${timestamp}-${random}`;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | number): string {
  return format(date, 'MMM dd, yyyy');
}

export function formatTime(date: Date | number): string {
  return format(date, 'HH:mm:ss');
}

export function formatDateTime(date: Date | number): string {
  return format(date, 'MMM dd, yyyy HH:mm');
}

export function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export function getRandomRegion(country: string): string {
  const countryRegions = regions[country as keyof typeof regions] || [];
  return getRandomItem(countryRegions);
}

export function getRandomCity(region: string): string {
  const regionCities = cities[region as keyof typeof cities] || [];
  return getRandomItem(regionCities);
}

export function generateDeviceId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function generateFakeVisit(
  linkId: string,
  options: {
    deviceId?: string;
    isVpn?: boolean;
    ip?: string;
    trafficMultiplier?: number;
    isRepeatVisitor?: boolean;
  } = {}
): Omit<Visit, 'id' | 'ts'> {
  const country = getRandomItem(countries);
  const region = getRandomRegion(country);
  const city = getRandomCity(region);
  const deviceId = options.deviceId || generateDeviceId();
  
  // Device type distribution: 70% mobile, 20% desktop, 10% tablet
  const deviceType = Math.random() < 0.7 ? 'Mobile' :
                    Math.random() < 0.9 ? 'Desktop' : 'Tablet';
  
  // OS selection based on device type
  const os = deviceType === 'Desktop' ?
    getRandomItem(['Windows', 'macOS', 'Linux']) :
    deviceType === 'Mobile' ?
      getRandomItem(['Android', 'iOS']) :
      getRandomItem(['iPadOS', 'Android']);
  
  // Browser selection based on OS
  const browser = os === 'iOS' || os === 'iPadOS' ?
    getRandomItem(['Safari', 'Chrome']) :
    os === 'Android' ?
      getRandomItem(['Chrome', 'Samsung Internet', 'Firefox']) :
      getRandomItem(['Chrome', 'Firefox', 'Edge', 'Safari']);
  
  // Apply traffic multiplier to simulate peak/off-peak hours
  const baseValue = options.trafficMultiplier || 1;
  
  return {
    linkId,
    browser,
    target_url: `https://example.com/landing-${Math.floor(Math.random() * 10)}`,
    keyword: ['sale', 'discount', 'new', 'special', 'promotion'][Math.floor(Math.random() * 5)],
    carrier: getRandomItem(carriers),
    device_id: deviceId,
    visitor_type: options.isRepeatVisitor ? 'Returning' : 'New',
    traffic_type: getRandomItem(trafficTypes),
    source: getRandomItem(sources),
    region,
    country,
    city,
    device: deviceType,
    os,
    language: getRandomItem(languages),
    connection: getRandomItem(connections),
    referrer: Math.random() > 0.5 ? `https://${getRandomItem(sources).toLowerCase()}.com` : '',
    isVpn: options.isVpn || false,
    ip: options.ip
  };
}

export function calculateLinkStats(visits: Visit[], linkId: string, filters: FilterOptions): LinkStats {
  // Filter visits
  let filteredVisits = visits.filter(v => v.linkId === linkId);
  
  // Apply date filters
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const sevenDaysAgo = today - 7 * 24 * 60 * 60 * 1000;
  const fifteenDaysAgo = today - 15 * 24 * 60 * 60 * 1000;
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  
  switch (filters.dateRange) {
    case 'today':
      filteredVisits = filteredVisits.filter(v => v.ts >= today);
      break;
    case '7d':
      filteredVisits = filteredVisits.filter(v => v.ts >= sevenDaysAgo);
      break;
    case '15d':
      filteredVisits = filteredVisits.filter(v => v.ts >= fifteenDaysAgo);
      break;
    case 'month':
      filteredVisits = filteredVisits.filter(v => v.ts >= firstDayOfMonth);
      break;
    case 'custom':
      if (filters.startDate) {
        const startTimestamp = new Date(filters.startDate).getTime();
        filteredVisits = filteredVisits.filter(v => v.ts >= startTimestamp);
      }
      if (filters.endDate) {
        const endTimestamp = new Date(filters.endDate).getTime() + 24 * 60 * 60 * 1000 - 1; // End of the day
        filteredVisits = filteredVisits.filter(v => v.ts <= endTimestamp);
      }
      break;
  }
  
  // Apply other filters
  if (filters.country) {
    filteredVisits = filteredVisits.filter(v => v.country === filters.country);
  }
  if (filters.region) {
    filteredVisits = filteredVisits.filter(v => v.region === filters.region);
  }
  if (filters.city) {
    filteredVisits = filteredVisits.filter(v => v.city === filters.city);
  }
  if (filters.device) {
    filteredVisits = filteredVisits.filter(v => v.device === filters.device);
  }
  if (filters.browser) {
    filteredVisits = filteredVisits.filter(v => v.browser === filters.browser);
  }
  if (filters.language) {
    filteredVisits = filteredVisits.filter(v => v.language === filters.language);
  }
  if (filters.referrer) {
    filteredVisits = filteredVisits.filter(v => v.referrer === filters.referrer);
  }
  if (filters.os) {
    filteredVisits = filteredVisits.filter(v => v.os === filters.os);
  }
  if (filters.source) {
    filteredVisits = filteredVisits.filter(v => v.source === filters.source);
  }
  if (filters.visitor_type) {
    filteredVisits = filteredVisits.filter(v => v.visitor_type === filters.visitor_type);
  }
  if (filters.traffic_type) {
    filteredVisits = filteredVisits.filter(v => v.traffic_type === filters.traffic_type);
  }
  if (filters.connection) {
    filteredVisits = filteredVisits.filter(v => v.connection === filters.connection);
  }
  if (filters.carrier) {
    filteredVisits = filteredVisits.filter(v => v.carrier === filters.carrier);
  }
  
  // Apply token filters
  if (filters.tokenFilters && filters.tokenFilters.length > 0) {
    filteredVisits = filteredVisits.filter(visit => {
      return filters.tokenFilters!.every(filter => {
        const value = (visit as any)[filter.parameter];
        return value === filter.value;
      });
    });
  }
  
  if (filters.isVpn !== undefined) {
    filteredVisits = filteredVisits.filter(v => v.isVpn === filters.isVpn);
  }
  
  // Handle repeated visitors filter
  const deviceIds = new Set<string>();
  const repeatedDeviceIds = new Set<string>();
  
  filteredVisits.forEach(visit => {
    if (visit.device_id) {
      if (deviceIds.has(visit.device_id)) {
        repeatedDeviceIds.add(visit.device_id);
      } else {
        deviceIds.add(visit.device_id);
      }
    }
  });
  
  if (filters.repeated !== undefined) {
    filteredVisits = filteredVisits.filter(v => {
      const isRepeated = v.device_id && repeatedDeviceIds.has(v.device_id);
      return filters.repeated ? isRepeated : !isRepeated;
    });
  }
  
  // Calculate stats
  const sourcesCount: Record<string, number> = {};
  const regionsCount: Record<string, number> = {};
  const browsersCount: Record<string, number> = {};
  const tokenStats: Record<string, Record<string, { 
    total: number;
    unique: number;
    repeated: number;
    vpn: number;
    legitimate: number;
  }>> = {};
  const hourlyData: Record<string, number> = {};
  
  filteredVisits.forEach(visit => {
    // Calculate token stats
    if (filters.tokenFilters) {
      filters.tokenFilters.forEach(filter => {
        const value = (visit as any)[filter.parameter];
        if (value) {
          if (!tokenStats[filter.parameter]) {
            tokenStats[filter.parameter] = {};
          }
          if (!tokenStats[filter.parameter][value]) {
            tokenStats[filter.parameter][value] = {
              total: 0,
              unique: 0,
              repeated: 0,
              vpn: 0,
              legitimate: 0
            };
          }
          
          const stats = tokenStats[filter.parameter][value];
          stats.total++;
          
          if (visit.isVpn) {
            stats.vpn++;
          } else {
            stats.legitimate++;
          }
          
          // Check if this is a repeat visitor
          const isRepeated = visit.device_id && repeatedDeviceIds.has(visit.device_id);
          if (isRepeated) {
            stats.repeated++;
          } else {
            stats.unique++;
          }
        }
      });
    }
    
    if (visit.source) {
      sourcesCount[visit.source] = (sourcesCount[visit.source] || 0) + 1;
    }
    
    if (visit.region) {
      regionsCount[visit.region] = (regionsCount[visit.region] || 0) + 1;
    }
    
    if (visit.browser) {
      browsersCount[visit.browser] = (browsersCount[visit.browser] || 0) + 1;
    }
    
    // Aggregate by hour
    const visitDate = new Date(visit.ts);
    const hourKey = format(visitDate, 'yyyy-MM-dd HH:00');
    hourlyData[hourKey] = (hourlyData[hourKey] || 0) + 1;
  });
  
  const vpnVisits = filteredVisits.filter(v => v.isVpn).length;
  const uniqueVisitors = deviceIds.size;
  const repeatedVisits = filteredVisits.length - uniqueVisitors;
  
  return {
    total: filteredVisits.length,
    unique: uniqueVisitors,
    repeated: repeatedVisits,
    vpn: vpnVisits,
    legitimate: filteredVisits.length - vpnVisits,
    sources: sourcesCount,
    regions: regionsCount,
    browsers: browsersCount,
    hourly: hourlyData,
    tokenStats
  };
}