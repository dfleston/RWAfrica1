import { Property } from './types';

// Let's import our generated image assets since they correspond precisely to Nairobi properties and culture.
// Let's define the properties with official pictures and data matching the layout perfectly!
export const PROPERTIES: Property[] = [
  {
    id: 'kilimani-towers',
    name: 'Kilimani Premium Towers',
    tagline: 'Grade-A Expat Residential Complex',
    description: 'Nairobi, Kenya. Premium residential apartments boasting panoramic skylines and custom tailored hospitality services for high-profile expats.',
    location: 'Nairobi, Kenya',
    image: '/src/assets/images/kilimani_tower_1781550304150.jpg',
    priceFrom: '€450,000',
    investFrom: '€50,000',
    yieldTarget: '8-12%',
    targetIRR: '15%',
    exitStrategy: 'Refinance / Sale in 5 Years',
    status: 'Construction Phase',
    opportunityText: `The Nairobi residential market shows robust demand in the Kilimani district due to high concentration of diplomat offices, international tech hubs, and non-governmental headquarters. Kilimani Premium Towers provides Grade-A build standards, thermal insulation, luxury wellness services, and secure entry, guaranteeing 85%+ occupancy rates year-round. This is an unparalleled asset for cash-yielding expat residential deployment.`,
    renders: [
      '/src/assets/images/kilimani_tower_1781550304150.jpg',
      '/src/assets/images/nairobi_culture_1781550346038.jpg',
      '/src/assets/images/coastal_retreat_1781550365408.jpg'
    ]
  },
  {
    id: 'logistics-alpha',
    name: 'Logistics Park Alpha',
    tagline: 'Light Industrial Warehousing for FMCG',
    description: 'Tatu City Special Economic Zone, Kenya. High-spec distribution facilities built to premium international standards for fast-moving consumer goods.',
    location: 'Tatu City, Kenya',
    image: '/src/assets/images/logistics_park_1781550316064.jpg',
    priceFrom: '€1,500,000',
    investFrom: '€150,000',
    yieldTarget: '12%+',
    targetIRR: '18%',
    exitStrategy: 'Institutional Refinance',
    status: 'Development Phase',
    opportunityText: `Logistics Park Alpha represents a cornerstone asset class for regional logistics flow. Nestled within the highly sought-after Tatu City Special Economic Zone (SEZ), it offers massive tax advantages including 10% corporate tax holding, zero VAT, and import tax waivers. Secured by long-term leases with leading regional groceries and international FMCG distributors, it delivers inflation-protected solid yields.`,
    renders: [
      '/src/assets/images/logistics_park_1781550316064.jpg',
      '/src/assets/images/westlands_hub_1781550330467.jpg'
    ]
  },
  {
    id: 'westlands-hub',
    name: 'Westlands Corporate Hub',
    tagline: 'LEED-certified Commercial Office Space',
    description: 'Nairobi, Kenya. Energy-efficient boutique green workplace tailored for multinational banks and fintech corporate regional headquarters.',
    location: 'Nairobi, Kenya',
    image: '/src/assets/images/westlands_hub_1781550330467.jpg',
    priceFrom: '€850,000',
    investFrom: '€85,000',
    yieldTarget: '10%',
    targetIRR: '14%',
    exitStrategy: 'Sale to Regional REIT',
    status: 'Active Operations',
    opportunityText: `Westlands is Nairobi's premier central business district for technology and global banking. The Westlands Corporate Hub integrates beautiful LEED Gold certifications with solar infrastructure, ultra-fast fiber linkages, smart biometric security, and premium meeting lounges. The asset is already active, generating consistent commercial leases with multi-year escalation clauses.`,
    renders: [
      '/src/assets/images/westlands_hub_1781550330467.jpg',
      '/src/assets/images/kilimani_tower_1781550304150.jpg'
    ]
  },
  {
    id: 'tatu-industrial',
    name: 'Tatu City Industrial Park',
    tagline: 'Infrastructure & Industrial Land Plots',
    description: 'Tatu City, Kenya. Fully serviced industrial parcels equipped with high-voltage electricity, premium heavy-vehicle roadways, and high-flow clean water connections.',
    location: 'Tatu City, Kenya',
    image: '/src/assets/images/logistics_park_1781550316064.jpg', // can reuse or use picsum
    priceFrom: '€250,000',
    investFrom: '€25,000',
    yieldTarget: '12%+',
    targetIRR: '19%',
    exitStrategy: 'Plot Sale or Build-to-Suit',
    status: 'Planning/Groundwork',
    opportunityText: `Pre-zoned infrastructure plots in Tatu City Industrial Park let investors capitalize directly on the region's manufacturing boom. These serviced lands are ready to build, bypassing complex bureaucratic processes. Tatu City's Special Economic Zone designation keeps overhead incredibly low, making this a strategic holding for rapid appreciation or build-to-suit deployment.`,
    renders: [
      '/src/assets/images/logistics_park_1781550316064.jpg',
      '/src/assets/images/coastal_retreat_1781550365408.jpg'
    ]
  }
];

export const TIMELINE_STEPS = [
  {
    id: '01',
    phase: 'INITIATE',
    title: 'Apply Online',
    detail: 'Qualification review set & custom portfolio thesis check.'
  },
  {
    id: '02',
    phase: 'SECURE',
    title: 'Reservation Escrow',
    detail: '€900 fully refundable holding deposit securely locked.'
  },
  {
    id: '03',
    phase: 'LOGISTICS',
    title: 'We Handle Travel',
    detail: 'Boutique luxury lodging, hosting, and visa assistance.'
  },
  {
    id: '04',
    phase: 'EXECUTE',
    title: 'Walk the Site',
    detail: '4-day full on-site tour and technical seminars in Nairobi.'
  }
];

export const GEOPOLITICAL_THESIS = [
  {
    id: '01',
    title: 'Geopolitical Stability',
    desc: "Nairobi stands as East Africa's premier economic hub, demonstrating consistent GDP growth and resilient democratic institutions."
  },
  {
    id: '02',
    title: 'SEZ Frameworks',
    desc: 'Special Economic Zones like Tatu City offer robust tax incentives, including 10% corporate tax (vs standard 30%) and world-class infrastructure.'
  },
  {
    id: '03',
    title: 'Demographic Dividend',
    desc: 'A rapidly expanding middle class and significant expat influx driving acute demand for institutional-grade residential and industrial assets.'
  }
];

export const DISCOVERY_IMMERSIONS = [
  {
    title: 'Nairobi Nightlife & Culture',
    desc: "Immerse yourself in Nairobi's vibrant energy with exclusive private access to premium cultural venues and Michelin-inspired dining.",
    image: '/src/assets/images/nairobi_culture_1781550346038.jpg'
  },
  {
    title: 'Coastal Experience',
    desc: "Unwind at pristine Diani or Lamu beach resorts in custom curated luxury villas, exploring Kenya's rich Swahili coastal heritage.",
    image: '/src/assets/images/coastal_retreat_1781550365408.jpg'
  },
  {
    title: 'The Heart of Nature',
    desc: 'Witness breathtaking African wildlife and landscapes in world-renowned national parks, enjoying a truly luxurious boutique safari.',
    image: '/src/src/assets/images/coastal_retreat_1781550365408.jpg' // we can map nicely
  }
];
