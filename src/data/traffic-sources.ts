// Traffic sources and their available tokens
// These are the tokens/placeholders used by different traffic acquisition platforms

export interface TrafficSource {
  id: string;
  name: string;
  website: string;
  logo: string;
  description: string;
  tokens: TrafficToken[];
  defaultParameterPrefix: string; // Default prefix for automatic parameter naming (e.g., "sub")
}

export interface TrafficToken {
  id: string;
  token: string;   // The actual token string used in URLs, e.g. {cid}
  name: string;    // Human-readable name
  description: string;
  example: string; // Example of what this token might be replaced with
}

export const trafficSources: TrafficSource[] = [
  {
    id: 'zeropark',
    name: 'Zeropark',
    website: 'https://zeropark.com',
    logo: 'https://images.pexels.com/photos/2400594/pexels-photo-2400594.jpeg',
    description: 'Zeropark is a premium traffic source for performance marketers offering various ad formats.',
    defaultParameterPrefix: 'sub',
    tokens: [
      {
        id: 'zp_cid',
        token: '{cid}',
        name: 'Campaign ID',
        description: 'Zeropark campaign identifier',
        example: '12345'
      },
      {
        id: 'zp_browser',
        token: '{browser}',
        name: 'Browser',
        description: 'User browser information',
        example: 'Chrome'
      },
      {
        id: 'zp_device',
        token: '{device}',
        name: 'Device Type',
        description: 'Device type (desktop, mobile, tablet)',
        example: 'mobile'
      },
      {
        id: 'zp_os',
        token: '{os}',
        name: 'Operating System',
        description: 'User operating system',
        example: 'Android'
      },
      {
        id: 'zp_carrier',
        token: '{carrier}',
        name: 'Mobile Carrier',
        description: 'User mobile carrier if applicable',
        example: 'Verizon'
      },
      {
        id: 'zp_country',
        token: '{country}',
        name: 'Country',
        description: 'User country',
        example: 'US'
      },
      {
        id: 'zp_city',
        token: '{city}',
        name: 'City',
        description: 'User city',
        example: 'New York'
      },
      {
        id: 'zp_keyword',
        token: '{keyword}',
        name: 'Keyword',
        description: 'Campaign keyword',
        example: 'iphone 15'
      },
      {
        id: 'zp_source',
        token: '{source}',
        name: 'Traffic Source',
        description: 'The specific source of traffic',
        example: 'push'
      },
      {
        id: 'zp_campaign',
        token: '{campaign}',
        name: 'Campaign Name',
        description: 'The name of the campaign',
        example: 'summer-promo'
      }
    ]
  },
  {
    id: 'exoclick',
    name: 'ExoClick',
    website: 'https://exoclick.com',
    logo: 'https://images.pexels.com/photos/2422293/pexels-photo-2422293.jpeg',
    description: 'ExoClick is a global ad network providing various ad formats for publishers and advertisers.',
    defaultParameterPrefix: 'exo',
    tokens: [
      {
        id: 'exo_clickid',
        token: '{clickid}',
        name: 'Click ID',
        description: 'Unique click identifier',
        example: 'af23bx7c'
      },
      {
        id: 'exo_campaign',
        token: '{campaign}',
        name: 'Campaign ID',
        description: 'ExoClick campaign identifier',
        example: 'C123456'
      },
      {
        id: 'exo_variation',
        token: '{variation}',
        name: 'Ad Variation',
        description: 'The specific variation of the ad shown',
        example: 'v1'
      },
      {
        id: 'exo_country',
        token: '{country}',
        name: 'Country',
        description: 'Visitor country code',
        example: 'US'
      },
      {
        id: 'exo_carrier',
        token: '{carrier}',
        name: 'Mobile Carrier',
        description: 'Visitor mobile carrier',
        example: 'ATT'
      },
      {
        id: 'exo_browser',
        token: '{browser}',
        name: 'Browser',
        description: 'Visitor browser',
        example: 'Chrome'
      },
      {
        id: 'exo_os',
        token: '{os}',
        name: 'Operating System',
        description: 'Visitor OS',
        example: 'Windows'
      },
      {
        id: 'exo_device',
        token: '{device}',
        name: 'Device Type',
        description: 'Visitor device type',
        example: 'mobile'
      }
    ]
  },
  {
    id: 'trafficstars',
    name: 'TrafficStars',
    website: 'https://trafficstars.com',
    logo: 'https://images.pexels.com/photos/4551832/pexels-photo-4551832.jpeg',
    description: 'TrafficStars is a self-serve ad network offering different ad formats and targeting options.',
    defaultParameterPrefix: 'ts',
    tokens: [
      {
        id: 'ts_id',
        token: '{id}',
        name: 'Click ID',
        description: 'Unique click identifier',
        example: '15a98c3d'
      },
      {
        id: 'ts_campaign',
        token: '{campaign}',
        name: 'Campaign ID',
        description: 'TrafficStars campaign identifier',
        example: 'ts789'
      },
      {
        id: 'ts_zone',
        token: '{zone}',
        name: 'Zone ID',
        description: 'Publisher zone identifier',
        example: 'Z42913'
      },
      {
        id: 'ts_creative',
        token: '{creative}',
        name: 'Creative ID',
        description: 'Creative identifier',
        example: 'CR789'
      },
      {
        id: 'ts_platform',
        token: '{platform}',
        name: 'Platform',
        description: 'User platform',
        example: 'ios'
      },
      {
        id: 'ts_source',
        token: '{source}',
        name: 'Source',
        description: 'Traffic source identifier',
        example: 'premium'
      },
      {
        id: 'ts_format',
        token: '{format}',
        name: 'Ad Format',
        description: 'The format of the advertisement',
        example: 'banner'
      }
    ]
  },
  {
    id: 'taboola',
    name: 'Taboola',
    website: 'https://taboola.com',
    logo: 'https://images.pexels.com/photos/6476808/pexels-photo-6476808.jpeg',
    description: 'Taboola is a discovery platform that helps people find content they may like but never knew existed.',
    defaultParameterPrefix: 'tb',
    tokens: [
      {
        id: 'tb_clickid',
        token: '{click_id}',
        name: 'Click ID',
        description: 'Unique click identifier',
        example: 'tab_12345'
      },
      {
        id: 'tb_site',
        token: '{site}',
        name: 'Site ID',
        description: 'Publisher site identifier',
        example: 'CNN'
      },
      {
        id: 'tb_placement',
        token: '{placement}',
        name: 'Placement',
        description: 'Placement location on site',
        example: 'below-article'
      },
      {
        id: 'tb_platform',
        token: '{platform}',
        name: 'Platform',
        description: 'Device platform',
        example: 'desktop'
      },
      {
        id: 'tb_campaign',
        token: '{campaign}',
        name: 'Campaign',
        description: 'Campaign identifier',
        example: 'summer_2025'
      }
    ]
  },
  {
    id: 'propellerads',
    name: 'PropellerAds',
    website: 'https://propellerads.com',
    logo: 'https://images.pexels.com/photos/2156881/pexels-photo-2156881.jpeg',
    description: 'PropellerAds offers various ad formats including popunders, push notifications, and interstitials.',
    defaultParameterPrefix: 'pa',
    tokens: [
      {
        id: 'pa_clickid',
        token: '{clickid}',
        name: 'Click ID',
        description: 'Unique click identifier',
        example: 'pa_78945'
      },
      {
        id: 'pa_zoneid',
        token: '{zoneid}',
        name: 'Zone ID',
        description: 'Publisher zone identifier',
        example: 'Z1234'
      },
      {
        id: 'pa_campaignid',
        token: '{campaignid}',
        name: 'Campaign ID',
        description: 'Campaign identifier',
        example: 'C5678'
      },
      {
        id: 'pa_browser',
        token: '{browser}',
        name: 'Browser',
        description: 'User browser',
        example: 'Firefox'
      },
      {
        id: 'pa_os',
        token: '{os}',
        name: 'Operating System',
        description: 'User operating system',
        example: 'iOS'
      },
      {
        id: 'pa_country',
        token: '{country}',
        name: 'Country',
        description: 'User country',
        example: 'UK'
      },
      {
        id: 'pa_format',
        token: '{format}',
        name: 'Format',
        description: 'Ad format type',
        example: 'push'
      }
    ]
  }
];