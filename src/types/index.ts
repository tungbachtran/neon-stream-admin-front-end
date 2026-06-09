// src/types/index.ts
export interface User {
  id: string;
  email: string;
  username: string;
  fullName: string | null;
  avatar: string | null;
  phone:string | null;
  role: Role | null;
  bio: string | null;
  isBanned: boolean;
  isVerified: boolean;
  diamondBalance: number;
  lastLogin: string | null;
  createdAt: string;
}

export interface Role {
  id: string;
  name: string;
  displayName: string | null;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  thumbnailUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GiftCatalog {
  id: string;
  name: string;
  emoji: string;
  iconUrl: string | null;
  animationUrl: string | null;
  diamondCost: number;
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
  isActive: boolean;
  sortOrder: number;
  soundKey: string | null;
}
export interface UserLite {
  id: string;
  email: string;
  username: string;
  fullName?: string | null;
  avatar?: string | null;
  diamondBalance?: number;
}
export interface DiamondTransaction {
  id: string;
  userId: string;
  user?: UserLite;

  diamondPackage: string;
  diamondAmount: number;
  bonusDiamondAmount: number;
  amountVnd: number;
  paymentMethod: string;
  status: string;
  txnRef: string;

  vnpTransactionNo?: string | null;
  vnpBankCode?: string | null;
  vnpBankTranNo?: string | null;
  vnpCardType?: string | null;
  vnpResponseCode?: string | null;
  vnpPayDate?: string | null;
  vnpOrderInfo?: string | null;

  ipnProcessed: boolean;
  ipnProcessedAt?: string | null;

  createdAt: string;
  updatedAt: string;
}

export interface GiftTransaction {
  id: string;

  senderId: string;
  receiverId: string;
  streamId: string;
  giftId: string;

  sender?: UserLite;
  receiver?: UserLite;
  gift?: GiftCatalog;
  stream?: any;

  quantity: number;
  totalDiamonds: number;
  status: string;
  idempotencyKey: string;

  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  statusCode: number;
}

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  fullName: string | null;
  avatar: string | null;
  role: Role | null;
}
