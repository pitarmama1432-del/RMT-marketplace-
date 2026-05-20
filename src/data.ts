import { GamingListing, Tournament } from './types';

export const INITIAL_LISTINGS: GamingListing[] = [
  {
    id: 'LIST-001',
    title: 'PUBG Mobile Account - Rank: Conqueror Tier',
    game: 'PUBG Mobile',
    category: 'Account',
    price: 2500,
    riskScore: 8,
    riskReason: 'No suspicious activity; email linked has been verified; account age > 3 years.',
    verifiedSeller: true,
    description: 'High-end PUBG Mobile account with ancient outfits, rare emotes, and Conqueror rank frames. Fast and 100% secure transfer via escrow protection.',
    deliveryTime: 'Instant Delivery',
    screenshots: [
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=600&auto=format&fit=crop'
    ],
    seller: {
      username: 'GameZoneBD',
      avatarUrl: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=GameZoneBD',
      isVerified: true,
      rating: 5.0,
      reviewsCount: 234,
      totalTrades: 532,
      successRate: 99.4,
      memberSince: 'Jan 2023'
    },
    stats: {
      'Rank': 'Conqueror Tier',
      'Outfits': '60+ Outfits',
      'Full Access': 'Yes',
      'K/D Ratio': '5.42',
      'Matches': '892',
      'Account Level': '72'
    },
    tags: ['Conqueror', 'Legendary Gun skins', 'Full Access']
  },
  {
    id: 'LIST-002',
    title: 'Free Fire Max level 75 super account',
    game: 'Free Fire',
    category: 'Account',
    price: 1200,
    riskScore: 4,
    riskReason: 'Clean trade history. Multi-factor authentication fully verified by GameTrade.',
    verifiedSeller: true,
    description: 'Elite pass bundles since season 4. All characters unlocked. High win rate in custom tournaments.',
    deliveryTime: 'Instant Delivery',
    screenshots: [
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=600&auto=format&fit=crop'
    ],
    seller: {
      username: 'FireElite',
      avatarUrl: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=FireElite',
      isVerified: true,
      rating: 4.9,
      reviewsCount: 178,
      totalTrades: 320,
      successRate: 98.7,
      memberSince: 'Mar 2024'
    },
    stats: {
      'Rank': 'Grandmaster',
      'Skins': '120+ Weapon Skins',
      'Elite Pass': 'Yes',
      'Win Rate': '72%',
      'Account Level': '75'
    },
    tags: ['Grandmaster', 'Elite Bundles', 'Weapon Skins']
  },
  {
    id: 'LIST-003',
    title: 'Mobile Legends 98 Skins + Max Emblems',
    game: 'Mobile Legends',
    category: 'Account',
    price: 1780,
    riskScore: 11,
    riskReason: 'Account has changed IP address recently (likely due to migration). Otherwise clean state.',
    verifiedSeller: true,
    description: 'Max emblems, legendary Saber skin, Lightborn skin, Epic skins for Gusion and Chou.',
    deliveryTime: 'Instant Delivery',
    screenshots: [
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop'
    ],
    seller: {
      username: 'MLProSeller',
      avatarUrl: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=MLProSeller',
      isVerified: true,
      rating: 4.8,
      reviewsCount: 89,
      totalTrades: 145,
      successRate: 100.0,
      memberSince: 'Jul 2023'
    },
    stats: {
      'Rank': 'Mythical Glory',
      'Total Skins': '98 Skins',
      'Emblems': 'Max All Emblems',
      'Win Rate': '68%'
    },
    tags: ['Mythical Glory', 'Legendary Skin', 'Max Emblems']
  },
  {
    id: 'LIST-004',
    title: 'Valorant Champion Account with Reaver Vandal',
    game: 'Valorant',
    category: 'Account',
    price: 3200,
    riskScore: 18,
    riskReason: 'Higher price value segment; user has 1 previous minor dispute resolved in their favor.',
    verifiedSeller: false,
    description: 'Premium bundle skins including Reaver Vandal (Max upgraded), Prime Specter, Rgx Blade, and Level 150.',
    deliveryTime: 'Within 2 Hours',
    screenshots: [
      'https://images.unsplash.com/photo-1553481187-be93c21490a9?q=80&w=600&auto=format&fit=crop'
    ],
    seller: {
      username: 'ValoLover',
      avatarUrl: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=ValoLover',
      isVerified: false,
      rating: 4.5,
      reviewsCount: 42,
      totalTrades: 64,
      successRate: 95.0,
      memberSince: 'Nov 2024'
    },
    stats: {
      'Rank': 'Diamond 3',
      'Skins': 'Reaver, Prime, RGX',
      'Level': '152',
      'Agents': 'All Unlocked'
    },
    tags: ['Reaver Vandal', 'Diamond 3', 'RGX Blade']
  },
  {
    id: 'LIST-005',
    title: 'Call of Duty Level 150 Platinum Camo Account',
    game: 'Call of Duty',
    category: 'Account',
    price: 1950,
    riskScore: 6,
    riskReason: 'Authenticated identity card; secure matching email and phone linking verified.',
    verifiedSeller: true,
    description: 'Legendary blueprints, Platinum camo unlocked for main SMGs and Rifles. Includes over 5000 COD Points.',
    deliveryTime: 'Instant Delivery',
    screenshots: [
      'https://images.unsplash.com/photo-1553481187-be93c21490a9?q=80&w=600&auto=format&fit=crop'
    ],
    seller: {
      username: 'ShadowSoldier',
      avatarUrl: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=ShadowSoldier',
      isVerified: true,
      rating: 4.9,
      reviewsCount: 112,
      totalTrades: 215,
      successRate: 98.2,
      memberSince: 'Feb 2023'
    },
    stats: {
      'Rank': 'Legendary',
      'Camos': 'Platinum & Damascus',
      'CoD Points': '5400',
      'Level': '150'
    },
    tags: ['Legendary Rank', 'Platinum Camo', 'COD Points']
  },
  {
    id: 'LIST-006',
    title: 'Genshin Impact - C6 Zhongli AND C2 Shogun',
    game: 'Genshin Impact',
    category: 'Account',
    price: 5400,
    riskScore: 23,
    riskReason: 'High tier value segment. Auto-security system demands active 2FA transfer authorization.',
    verifiedSeller: true,
    description: 'AR 58 premium account. C6 Zhongli, C2 Raiden Shogun, C1 Kazuha, C0 Furina. Signature weapons for almost all 5-stars.',
    deliveryTime: 'Within 1 Hour',
    screenshots: [
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop'
    ],
    seller: {
      username: 'GenshinLord',
      avatarUrl: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=GenshinLord',
      isVerified: true,
      rating: 5.0,
      reviewsCount: 310,
      totalTrades: 620,
      successRate: 100.0,
      memberSince: 'Oct 2022'
    },
    stats: {
      'Adventure Rank': 'AR 58',
      '5-Star Chars': '18 Chars',
      'C6 Characters': 'Zhongli',
      'Region': 'Asia'
    },
    tags: ['C6 Zhongli', 'AR 58', 'Asia Server']
  },
  {
    id: 'LIST-007',
    title: 'FC Mobile Champion Team (OVR 102)',
    game: 'FC Mobile',
    category: 'Account',
    price: 850,
    riskScore: 5,
    riskReason: 'Highly reliable verified seller with excellent continuous trading operations.',
    verifiedSeller: true,
    description: 'Beautiful FC Mobile team featuring 103 Pele, 102 Zidane, and 101 Van Dijk. Stacked with rank up materials!',
    deliveryTime: 'Instant Delivery',
    screenshots: [
      'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=600&auto=format&fit=crop'
    ],
    seller: {
      username: 'FCKing',
      avatarUrl: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=FCKing',
      isVerified: true,
      rating: 4.8,
      reviewsCount: 76,
      totalTrades: 120,
      successRate: 97.4,
      memberSince: 'May 2024'
    },
    stats: {
      'Team OVR': '102 OVR',
      'Top Players': 'Pele, Zidane, Mbappe',
      'Coins': '120 Million BDT equivalent',
      'Division': 'FC Champion III'
    },
    tags: ['102 OVR', 'Zidane', '120M Coins']
  },
  {
    id: 'LIST-008',
    title: 'Roblox account with 25k spent robux',
    game: 'Roblox',
    category: 'Account',
    price: 990,
    riskScore: 14,
    riskReason: 'Multiple cosmetic link chains; manual delivery verification recommended.',
    verifiedSeller: false,
    description: 'Level 2400 max in Blox Fruits, highly rare game-passes in Bedwars, Adopt Me, and high Robux inventory.',
    deliveryTime: 'Within 24 Hours',
    screenshots: [
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=600&auto=format&fit=crop'
    ],
    seller: {
      username: 'RobloxKing22',
      avatarUrl: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=RobloxKing22',
      isVerified: false,
      rating: 4.2,
      reviewsCount: 15,
      totalTrades: 24,
      successRate: 91.6,
      memberSince: 'Jan 2025'
    },
    stats: {
      'Spent Robux': '25,000+',
      'Blox Fruits': 'Max Level',
      'Rare Items': 'Shadow, Venom, dough',
      'Created': '2021'
    },
    tags: ['Blox Fruits Max', '25k Spent', 'Rare passes']
  },
  {
    id: 'LIST-009',
    title: 'PUBG Mobile 10,000 UC Top-up (Safe Direct Direct ID PIN)',
    game: 'PUBG Mobile',
    category: 'Currency',
    price: 1800,
    riskScore: 2,
    riskReason: 'Direct API-based top-up pin, fully verified automated delivery.',
    verifiedSeller: true,
    description: 'Fast direct ID top-up. 100% legal UC from official developer partner. Add your ID in payment comments.',
    deliveryTime: 'Instant Delivery',
    screenshots: [
      'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=600&auto=format&fit=crop'
    ],
    seller: {
      username: 'GameZoneBD',
      avatarUrl: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=GameZoneBD',
      isVerified: true,
      rating: 5.0,
      reviewsCount: 234,
      totalTrades: 532,
      successRate: 99.4,
      memberSince: 'Jan 2023'
    },
    stats: {
      'UC Amount': '10,000 UC',
      'Format': 'Player ID Pin',
      'Delivery': 'Auto Instant'
    },
    tags: ['UC Top Up', 'Instant PIN', 'Official License']
  },
  {
    id: 'LIST-010',
    title: 'Radiant-tier Valorant Rank Boost (3 Ranks)',
    game: 'Valorant',
    category: 'Coaching',
    price: 1500,
    riskScore: 7,
    riskReason: 'Coaching & Boosting involves secure session; professional booster credentials are verified.',
    verifiedSeller: true,
    description: 'Safe rank boosting (up to Ascendant or Immortal) with 100% Winrate guarantee by former collegiate players.',
    deliveryTime: '24 Hour Completion',
    screenshots: [],
    seller: {
      username: 'ShadowSoldier',
      avatarUrl: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=ShadowSoldier',
      isVerified: true,
      rating: 4.9,
      reviewsCount: 112,
      totalTrades: 215,
      successRate: 98.2,
      memberSince: 'Feb 2023'
    },
    stats: {
      'Booster Rank': 'Radiant',
      'Stream Option': 'Available',
      'VIP Solo Queue': 'Yes'
    },
    tags: ['Valorant Boosting', 'Radiant Booster', 'Secure VPN']
  }
];

export const INITIAL_TOURNAMENTS: Tournament[] = [
  {
    id: 'TOURN-001',
    name: 'PUBG Mobile Dhaka Cyber Showdown',
    game: 'PUBG Mobile',
    prizePool: '৳ 50,000',
    entryFee: '৳ 200',
    teamsCount: 24,
    maxTeams: 32,
    status: 'UPCOMING',
    date: 'May 28, 2026'
  },
  {
    id: 'TOURN-002',
    name: 'Valorant Elite Cup: South Asia Cup',
    game: 'Valorant',
    prizePool: '৳ 100,000',
    entryFee: 'Free Entry',
    teamsCount: 64,
    maxTeams: 64,
    status: 'LIVE',
    date: 'May 20, 2026'
  },
  {
    id: 'TOURN-003',
    name: 'Mobile Legends Bang Bang Arena',
    game: 'Mobile Legends',
    prizePool: '৳ 35,000',
    entryFee: '৳ 100',
    teamsCount: 8,
    maxTeams: 16,
    status: 'UPCOMING',
    date: 'June 02, 2026'
  }
];

export const PLATFORM_STATS = {
  activeUsers: '10K+',
  successfulTrades: '25K+',
  positiveReviews: '99.7%',
  scamProtection: '99.9%',
  aiSystemStatus: 'Active',
  secureEscrowAmountLocked: '৳ 842,500'
};
