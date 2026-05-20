export type GameType = string;

export type CategoryType = string;

export interface SellerProfile {
  username: string;
  avatarUrl: string;
  isVerified: boolean;
  rating: number;
  reviewsCount: number;
  totalTrades: number;
  successRate: number;
  memberSince: string;
}

export interface GamingListing {
  id: string;
  title: string;
  game: GameType;
  category: CategoryType;
  price: number; // in BDT (৳) or comparable
  riskScore: number; // 0-100, where lower is safer
  riskReason?: string;
  verifiedSeller: boolean;
  description: string;
  deliveryTime: string; // "Instant", "1 hour", "24 hours"
  screenshots: string[];
  seller: SellerProfile;
  stats: Record<string, string>; // e.g., Level: 72, Outfits: 60+, Full Access: Yes
  tags: string[];
}

export type EscrowStep = 'BuyerPaid' | 'Locked' | 'Delivered' | 'Confirmed' | 'Released';

export interface Order {
  id: string;
  listing: GamingListing;
  buyerName: string;
  sellerName: string;
  price: number;
  status: 'PENDING_DELIVERY' | 'DELIVERED_AWAITING_CONFIRMATION' | 'COMPLETED' | 'DISPUTED';
  escrowStep: EscrowStep;
  createdAt: string;
}

export interface Dispute {
  id: string;
  orderId: string;
  listingTitle: string;
  buyerName: string;
  sellerName: string;
  reason: string;
  status: 'OPEN' | 'AI_REVIEWING' | 'RESOLVED_BUYER' | 'RESOLVED_SELLER';
  aiSummary?: string;
  chatLogs: Array<{ sender: string; message: string; timestamp: string }>;
  createdAt: string;
}

export interface Wallet {
  balance: number;
  transactions: Array<{
    id: string;
    type: 'DEPOSIT' | 'WITHDRAW' | 'ESCROW_LOCK' | 'ESCROW_RELEASE' | 'ESCROW_REFUND';
    amount: number;
    description: string;
    timestamp: string;
  }>;
}

export interface ChatMessage {
  id: string;
  sender: string;
  message: string;
  timestamp: string;
  isAi?: boolean;
  scamProbability?: number; // 0-100 detected by AI
  flaggedKeywords?: string[];
}

export interface NotificationItem {
  id: string;
  title: string;
  content: string;
  type: 'INFO' | 'WARNING' | 'ALERT' | 'SUCCESS';
  timestamp: string;
  read: boolean;
}

export interface Tournament {
  id: string;
  name: string;
  game: GameType;
  prizePool: string;
  entryFee: string;
  teamsCount: number;
  maxTeams: number;
  status: 'UPCOMING' | 'LIVE' | 'COMPLETED';
  date: string;
}
