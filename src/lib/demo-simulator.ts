import { generateFakeVisit } from './utils';
import { recordVisit, getLinks } from './storage';
import { formatDateTime, generateUniqueHash } from './utils';

// Simulated traffic patterns
const TRAFFIC_PATTERNS = {
  PEAK_HOURS: [9, 10, 11, 14, 15, 16], // Hours with highest traffic
  MEDIUM_HOURS: [8, 12, 13, 17, 18, 19], // Hours with medium traffic
  LOW_HOURS: [0, 1, 2, 3, 4, 5, 6, 7, 20, 21, 22, 23], // Hours with low traffic
  
  getVisitDelay: () => {
    const hour = new Date().getHours();
    
    if (TRAFFIC_PATTERNS.PEAK_HOURS.includes(hour)) {
      return Math.random() * 1000; // 0-1 second during peak
    } else if (TRAFFIC_PATTERNS.MEDIUM_HOURS.includes(hour)) {
      return 1000 + Math.random() * 2000; // 1-3 seconds during medium
    } else {
      return 2000 + Math.random() * 4000; // 2-6 seconds during low
    }
  },
  
  getTrafficMultiplier: () => {
    const hour = new Date().getHours();
    
    if (TRAFFIC_PATTERNS.PEAK_HOURS.includes(hour)) {
      return 1 + Math.random() * 0.5; // 100-150% during peak
    } else if (TRAFFIC_PATTERNS.MEDIUM_HOURS.includes(hour)) {
      return 0.5 + Math.random() * 0.3; // 50-80% during medium
    } else {
      return 0.1 + Math.random() * 0.2; // 10-30% during low
    }
  }
};

/**
 * Initializes the visit simulator to generate fake tracking data
 */
export function initVisitSimulator() {
  console.log('Starting visit simulator...');
  
  let visitCount = 0;
  const maxVisits = 1000; // Cap total visits for demo
  const deviceIds = new Set<string>(); // Track unique devices
  const vpnIps = new Set<string>(); // Simulate VPN IPs
  
  // Initialize some "VPN" IPs
  for (let i = 0; i < 50; i++) {
    vpnIps.add(`${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`);
  }
  
  // Generate visits based on traffic patterns
  const interval = setInterval(() => {
    const links = getLinks();
    if (links.length > 0) {
      visitCount++;
      
      // Stop after reaching max visits to prevent memory issues
      if (visitCount > maxVisits) {
        clearInterval(interval);
        console.log('Demo visit generation completed');
        return;
      }
      
      const link = links[0]; // Use the first link for demo purposes
      const trafficMultiplier = TRAFFIC_PATTERNS.getTrafficMultiplier();
      
      // Determine if this is a repeat visitor
      const isRepeatVisitor = Math.random() < 0.3; // 30% chance
      let deviceId = generateUniqueHash();
      
      if (isRepeatVisitor && deviceIds.size > 0) {
        // Pick a random existing device ID
        deviceId = Array.from(deviceIds)[Math.floor(Math.random() * deviceIds.size)];
      } else {
        deviceIds.add(deviceId);
      }
      
      // Determine if using VPN
      const isVpn = Math.random() < 0.05; // 5% chance
      const ip = isVpn ? 
        Array.from(vpnIps)[Math.floor(Math.random() * vpnIps.size)] :
        `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
      
      const fakeVisit = generateFakeVisit(link.id, {
        deviceId,
        isVpn,
        ip,
        trafficMultiplier,
        isRepeatVisitor
      });
      
      // Simulate network delay
      setTimeout(() => {
        recordVisit(fakeVisit);
        console.log(
          `[${formatDateTime(new Date())}] Visit ${visitCount}/${maxVisits} | ` +
          `${isRepeatVisitor ? 'Repeat' : 'New'} visitor | ` +
          `${isVpn ? 'VPN' : 'Direct'} | ` +
          `Traffic multiplier: ${trafficMultiplier.toFixed(2)}`
        );
      }, TRAFFIC_PATTERNS.getVisitDelay());
    }
  }, 500); // Check every 500ms, but actual delay is controlled by traffic patterns
  
  // Return function to stop simulator
  return () => clearInterval(interval);
}