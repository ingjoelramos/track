import { User, Domain, Template, Campaign, Link, Visit, LinkStats, FilterOptions, TrafficParameter, SystemSettings } from '../types';
import { users, domains, templates, campaigns, links, visits } from '../data/demoData';
import { calculateLinkStats } from './utils';

// Auth functions
export function login(email: string): User | null {
  const user = users.find(u => u.email === email);
  if (user) {
    localStorage.setItem('auth_token', 'demo-jwt');
    localStorage.setItem('user_role', user.role);
    localStorage.setItem('user_id', user.id);
    return user;
  }
  return null;
}

export function logout(): void {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user_role');
  localStorage.removeItem('user_id');
}

export function getCurrentUser(): User | null {
  const token = localStorage.getItem('auth_token');
  const role = localStorage.getItem('user_role') as 'admin' | 'analyst' | null;
  const userId = localStorage.getItem('user_id');
  
  if (token === 'demo-jwt' && role && userId) {
    return users.find(u => u.id === userId) || null;
  }
  return null;
}

export function isAuthenticated(): boolean {
  return localStorage.getItem('auth_token') === 'demo-jwt';
}

export function hasRole(requiredRole: 'admin' | 'analyst'): boolean {
  const user = getCurrentUser();
  if (!user) return false;
  if (requiredRole === 'analyst') return true; // Admin can do analyst tasks
  return user.role === requiredRole;
}

// User functions
export function getUsers(): User[] {
  return [...users];
}

// Domain CRUD
export function getDomains(): Domain[] {
  const user = getCurrentUser();
  if (!user) return [];
  
  if (user.role === 'admin') {
    return [...domains];
  }
  
  // Regular users see their domains plus global domains
  return domains.filter(d => d.isGlobal || d.userId === user.id);
}

export function getDomain(id: string): Domain | undefined {
  return domains.find(d => d.id === id);
}

export function createDomain(domain: Omit<Domain, 'id'>): Domain {
  const newDomain: Domain = {
    ...domain,
    id: `d${domains.length + 1}`
  };
  
  // If making this domain default, remove default from others
  if (newDomain.isDefault) {
    domains.forEach(domain => {
      if (domain.id !== newDomain.id) {
        domain.isDefault = false;
      }
    });
  }
  
  domains.push(newDomain);
  return newDomain;
}

export function updateDomain(id: string, updates: Partial<Domain>): Domain | null {
  const index = domains.findIndex(d => d.id === id);
  if (index === -1) return null;
  
  // If making this domain default, remove default from others
  if (updates.isDefault) {
    domains.forEach(domain => {
      if (domain.id !== id) {
        domain.isDefault = false;
      }
    });
  }
  
  domains[index] = { ...domains[index], ...updates };
  return domains[index];
}

export function deleteDomain(id: string): boolean {
  const index = domains.findIndex(d => d.id === id);
  if (index === -1) return false;
  
  // If deleting the default domain, make another global domain default if available
  if (domains[index].isDefault) {
    const nextGlobalDomain = domains.find(d => d.isGlobal && d.id !== id);
    if (nextGlobalDomain) {
      nextGlobalDomain.isDefault = true;
    }
  }
  
  domains.splice(index, 1);
  return true;
}

export function getGlobalDomains(): Domain[] {
  return domains.filter(d => d.isGlobal);
}

export function getDefaultDomain(): Domain | undefined {
  return domains.find(d => d.isDefault);
}

// Template CRUD
export function getTemplates(): Template[] {
  return [...templates];
}

export function getTemplate(id: string): Template | undefined {
  return templates.find(t => t.id === id);
}

// Campaign CRUD
export function getCampaigns(): Campaign[] {
  const user = getCurrentUser();
  if (!user) return [];
  
  if (user.role === 'admin') {
    return [...campaigns];
  }
  
  return campaigns.filter(c => c.userId === user.id);
}

export function getCampaign(id: string): Campaign | undefined {
  const user = getCurrentUser();
  if (!user) return undefined;
  
  const campaign = campaigns.find(c => c.id === id);
  if (!campaign) return undefined;
  
  // Admins can access all campaigns
  if (user.role === 'admin') return campaign;
  
  // Regular users can only access their own campaigns
  return campaign.userId === user.id ? campaign : undefined;
}

export function createCampaign(campaign: Omit<Campaign, 'id' | 'createdAt'>): Campaign {
  const user = getCurrentUser();
  if (!user) throw new Error('User not authenticated');
  
  const newCampaign: Campaign = {
    ...campaign,
    id: `c${campaigns.length + 1}`,
    createdAt: Date.now(),
    userId: user.id
  };
  
  campaigns.push(newCampaign);
  return newCampaign;
}

export function updateCampaign(id: string, updates: Partial<Campaign>): Campaign | null {
  const user = getCurrentUser();
  if (!user) return null;
  
  const index = campaigns.findIndex(c => c.id === id);
  if (index === -1) return null;
  
  // Only allow updates if admin or campaign owner
  if (user.role !== 'admin' && campaigns[index].userId !== user.id) {
    return null;
  }
  
  campaigns[index] = { ...campaigns[index], ...updates };
  return campaigns[index];
}

// Link CRUD
export function getLinks(campaignId?: string): Link[] {
  const user = getCurrentUser();
  if (!user) return [];
  
  let filteredLinks = [...links];
  
  if (campaignId) {
    filteredLinks = filteredLinks.filter(l => l.campaignId === campaignId);
  }
  
  if (user.role !== 'admin') {
    // Filter links by campaigns owned by the user
    const userCampaigns = campaigns.filter(c => c.userId === user.id);
    filteredLinks = filteredLinks.filter(l => 
      userCampaigns.some(c => c.id === l.campaignId)
    );
  }
  
  return filteredLinks;
}

export function getLink(id: string): Link | undefined {
  return links.find(l => l.id === id);
}

export function createLink(link: Omit<Link, 'id'>): Link {
  const newLink: Link = {
    ...link,
    id: `l${links.length + 1}`
  };
  links.push(newLink);
  return newLink;
}

// Visit tracking
export function recordVisit(visit: Omit<Visit, 'id' | 'ts'>): Visit {
  const now = Date.now();
  const newVisit: Visit = {
    ...visit,
    id: `v_${now}`,
    ts: now,
    isVpn: visit.isVpn ?? Math.random() < 0.05 // 5% chance of being a VPN if not specified
  };
  visits.push(newVisit);
  return newVisit;
}

export function getVisits(linkId?: string): Visit[] {
  const user = getCurrentUser();
  if (!user) return [];
  
  let filteredVisits = [...visits];
  
  if (linkId) {
    filteredVisits = filteredVisits.filter(v => v.linkId === linkId);
  }
  
  if (user.role !== 'admin') {
    // Filter visits by links from campaigns owned by the user
    const userCampaigns = campaigns.filter(c => c.userId === user.id);
    const userLinks = links.filter(l => 
      userCampaigns.some(c => c.id === l.campaignId)
    );
    filteredVisits = filteredVisits.filter(v => 
      userLinks.some(l => l.id === v.linkId)
    );
  }
  
  return filteredVisits;
}

export function getLinkStats(linkId: string, filters: FilterOptions): LinkStats {
  return calculateLinkStats(getVisits(linkId), linkId, filters);
}

// Traffic Parameter helpers
export function getTrafficParameters(campaignId: string): TrafficParameter[] {
  const campaign = getCampaign(campaignId);
  return campaign?.trafficParameters || [];
}

export function updateTrafficParameters(campaignId: string, parameters: TrafficParameter[]): boolean {
  const user = getCurrentUser();
  if (!user) return false;
  
  const campaign = getCampaign(campaignId);
  if (!campaign) return false;
  
  // Only allow updates if admin or campaign owner
  if (user.role !== 'admin' && campaign.userId !== user.id) {
    return false;
  }
  
  const campaignIndex = campaigns.findIndex(c => c.id === campaignId);
  if (campaignIndex === -1) return false;
  
  campaigns[campaignIndex].trafficParameters = [...parameters];
  
  // Also update all links associated with this campaign
  links.forEach((link, index) => {
    if (link.campaignId === campaignId) {
      links[index].trafficParameters = [...parameters];
    }
  });
  
  return true;
}

// System settings storage
let systemSettings: SystemSettings = {
  proxyCheckEnabled: false
};

export function getSystemSettings(): SystemSettings {
  return { ...systemSettings };
}

export function updateSystemSettings(settings: Partial<SystemSettings>): SystemSettings {
  const user = getCurrentUser();
  if (!user || user.role !== 'admin') {
    throw new Error('Only admins can update system settings');
  }
  
  systemSettings = { ...systemSettings, ...settings };
  return systemSettings;
}