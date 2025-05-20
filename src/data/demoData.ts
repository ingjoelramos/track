import { User, Domain, Template, Campaign, Link, Visit } from '../types';

export const users: User[] = [
  { id: 'u1', email: 'admin@demo.io', role: 'admin', name: 'Admin User' },
  { id: 'u2', email: 'analyst@demo.io', role: 'analyst', name: 'Analyst User' },
  { id: 'u3', email: 'user@demo.io', role: 'analyst', name: 'Regular User' }
];

export const domains: Domain[] = [
  { 
    id: 'd1', 
    host: 'track.demo.io', 
    verified: true,
    isGlobal: true,
    isDefault: true
  },
  { 
    id: 'd2', 
    host: 'promo.demo.io', 
    verified: true,
    isGlobal: true,
    isDefault: false
  },
  {
    id: 'd3',
    host: 'custom.demo.io',
    verified: true,
    isGlobal: false,
    isDefault: false,
    userId: 'u2'
  }
];

export const templates: Template[] = [
  {
    id: 't1', 
    name: 'Placeholders', 
    type: 'placeholders',
    pattern: '{browser}{target_url}{keyword}{carrier}{device_id}{visitor_type}{traffic_type}{source}{region}'
  },
  {
    id: 't2', 
    name: 'Query-string', 
    type: 'query',
    pattern: 'siteid=[siteid]&browser=[browser]&device=[device]&connection=[connection]'
  }
];

export const campaigns: Campaign[] = [
  { 
    id: 'c1',
    name: 'Summer Sale 2025',
    domainId: 'd1',
    templateId: 't1',
    status: 'active',
    createdAt: Date.now() - 15 * 864e5,
    userId: 'u1',
    trafficSource: 'zeropark',
    destinationUrl: 'https://demo.io/summer-sale'
  },
  {
    id: 'c2',
    name: 'Back to School',
    domainId: 'd2',
    templateId: 't2',
    status: 'active',
    createdAt: Date.now() - 10 * 864e5,
    userId: 'u1',
    trafficSource: 'exoclick',
    destinationUrl: 'https://demo.io/school-deals'
  },
  {
    id: 'c3',
    name: 'Tech Gadgets Promo',
    domainId: 'd1',
    templateId: 't1',
    status: 'active',
    createdAt: Date.now() - 8 * 864e5,
    userId: 'u2',
    trafficSource: 'taboola',
    destinationUrl: 'https://demo.io/gadgets'
  },
  {
    id: 'c4',
    name: 'Holiday Special',
    domainId: 'd2',
    templateId: 't2',
    status: 'active',
    createdAt: Date.now() - 7 * 864e5,
    userId: 'u1',
    trafficSource: 'propellerads',
    destinationUrl: 'https://demo.io/holiday'
  },
  {
    id: 'c5',
    name: 'Mobile App Launch',
    domainId: 'd1',
    templateId: 't1',
    status: 'active',
    createdAt: Date.now() - 6 * 864e5,
    userId: 'u2',
    trafficSource: 'zeropark',
    destinationUrl: 'https://demo.io/app-launch'
  },
  {
    id: 'c6',
    name: 'Fashion Collection',
    domainId: 'd3',
    templateId: 't2',
    status: 'active',
    createdAt: Date.now() - 5 * 864e5,
    userId: 'u2',
    trafficSource: 'exoclick',
    destinationUrl: 'https://demo.io/fashion'
  },
  {
    id: 'c7',
    name: 'Gaming Tournament',
    domainId: 'd1',
    templateId: 't1',
    status: 'active',
    createdAt: Date.now() - 4 * 864e5,
    userId: 'u1',
    trafficSource: 'taboola',
    destinationUrl: 'https://demo.io/tournament'
  },
  {
    id: 'c8',
    name: 'Fitness Challenge',
    domainId: 'd2',
    templateId: 't2',
    status: 'active',
    createdAt: Date.now() - 3 * 864e5,
    userId: 'u2',
    trafficSource: 'propellerads',
    destinationUrl: 'https://demo.io/fitness'
  },
  {
    id: 'c9',
    name: 'Travel Deals',
    domainId: 'd1',
    templateId: 't1',
    status: 'active',
    createdAt: Date.now() - 2 * 864e5,
    userId: 'u1',
    trafficSource: 'zeropark',
    destinationUrl: 'https://demo.io/travel'
  },
  {
    id: 'c10',
    name: 'Home Decor Sale',
    domainId: 'd3',
    templateId: 't2',
    status: 'active',
    createdAt: Date.now() - 864e5,
    userId: 'u2',
    trafficSource: 'exoclick',
    destinationUrl: 'https://demo.io/home-decor'
  },
  {
    id: 'c11',
    name: 'Food Festival',
    domainId: 'd1',
    templateId: 't1',
    status: 'active',
    createdAt: Date.now() - 12 * 3600e3,
    userId: 'u1',
    trafficSource: 'taboola',
    destinationUrl: 'https://demo.io/food-fest'
  },
  {
    id: 'c12',
    name: 'Beauty Products',
    domainId: 'd2',
    templateId: 't2',
    status: 'active',
    createdAt: Date.now() - 8 * 3600e3,
    userId: 'u2',
    trafficSource: 'propellerads',
    destinationUrl: 'https://demo.io/beauty'
  },
  {
    id: 'c13',
    name: 'Pet Supplies',
    domainId: 'd1',
    templateId: 't1',
    status: 'active',
    createdAt: Date.now() - 4 * 3600e3,
    userId: 'u1',
    trafficSource: 'zeropark',
    destinationUrl: 'https://demo.io/pets'
  },
  {
    id: 'c14',
    name: 'Book Fair',
    domainId: 'd3',
    templateId: 't2',
    status: 'active',
    createdAt: Date.now() - 2 * 3600e3,
    userId: 'u2',
    trafficSource: 'exoclick',
    destinationUrl: 'https://demo.io/books'
  },
  {
    id: 'c15',
    name: 'Sports Equipment',
    domainId: 'd1',
    templateId: 't1',
    status: 'active',
    createdAt: Date.now() - 3600e3,
    userId: 'u1',
    trafficSource: 'taboola',
    destinationUrl: 'https://demo.io/sports'
  }
];

export const links: Link[] = campaigns.map(campaign => ({
  id: `l${campaign.id.substring(1)}`,
  campaignId: campaign.id,
  slug: campaign.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
  params: {}
}));

export const visits: Visit[] = [];

// Browser options for fake data
export const browsers = ['Chrome', 'Firefox', 'Safari', 'Edge', 'Opera'];
export const devices = ['Desktop', 'Mobile', 'Tablet'];
export const os = ['Windows', 'macOS', 'iOS', 'Android', 'Linux'];
export const visitorTypes = ['New', 'Returning'];
export const trafficTypes = ['Organic', 'Paid', 'Direct', 'Referral', 'Social'];
export const sources = ['Google', 'Facebook', 'Instagram', 'Twitter', 'LinkedIn', 'Email', 'DirectVisit'];
export const countries = ['United States', 'Canada', 'United Kingdom', 'Germany', 'France', 'Japan', 'Australia', 'Brazil', 'India', 'Mexico'];
export const regions = {
  'United States': ['California', 'Texas', 'New York', 'Florida', 'Illinois'],
  'Canada': ['Ontario', 'Quebec', 'British Columbia', 'Alberta'],
  'United Kingdom': ['England', 'Scotland', 'Wales', 'Northern Ireland'],
  'Germany': ['Bavaria', 'North Rhine-Westphalia', 'Baden-Württemberg', 'Hesse'],
  'France': ['Île-de-France', 'Auvergne-Rhône-Alpes', 'Nouvelle-Aquitaine', 'Occitanie'],
  'Japan': ['Tokyo', 'Osaka', 'Kanagawa', 'Aichi'],
  'Australia': ['New South Wales', 'Victoria', 'Queensland', 'Western Australia'],
  'Brazil': ['São Paulo', 'Rio de Janeiro', 'Minas Gerais', 'Bahia'],
  'India': ['Maharashtra', 'Tamil Nadu', 'Karnataka', 'Gujarat'],
  'Mexico': ['Mexico City', 'Jalisco', 'Nuevo León', 'Puebla']
};
export const cities = {
  'California': ['Los Angeles', 'San Francisco', 'San Diego', 'San Jose'],
  'Texas': ['Houston', 'Austin', 'Dallas', 'San Antonio'],
  'New York': ['New York City', 'Buffalo', 'Rochester', 'Syracuse'],
  'Ontario': ['Toronto', 'Ottawa', 'Mississauga', 'Hamilton'],
  'England': ['London', 'Manchester', 'Birmingham', 'Liverpool'],
  'Bavaria': ['Munich', 'Nuremberg', 'Augsburg', 'Regensburg'],
  'Île-de-France': ['Paris', 'Versailles', 'Saint-Denis', 'Boulogne-Billancourt'],
  'Tokyo': ['Shinjuku', 'Shibuya', 'Minato', 'Setagaya'],
  'New South Wales': ['Sydney', 'Newcastle', 'Wollongong', 'Central Coast'],
  'São Paulo': ['São Paulo City', 'Campinas', 'Guarulhos', 'Santo André']
};
export const carriers = ['Verizon', 'AT&T', 'T-Mobile', 'Vodafone', 'Orange', 'Telefonica', 'DoCoMo', 'China Mobile'];
export const languages = ['en-US', 'en-GB', 'es-ES', 'fr-FR', 'de-DE', 'ja-JP', 'pt-BR', 'it-IT', 'ru-RU', 'zh-CN'];
export const connections = ['4G', '5G', 'Wifi', 'Fiber', 'DSL', 'Cable'];